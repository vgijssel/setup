package main

import (
	"context"
	"fmt"
	"sync"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

// OpenBao secrets engine minting short-lived, scoped Cloudflare API tokens, revoked with their
// lease. Replaces one long-lived token shared as a static kv entry by cert-manager's DNS-01
// solver and external-dns on both clusters — an arrangement where that single credential going
// invalid broke certificate renewal and DNS management everywhere at once, with no symptom
// beyond a 9109 in an external-dns crash loop.
//
// It does NOT eliminate a static secret; it relocates and concentrates it. The engine holds a
// PARENT token with `User API Tokens: Edit`, strictly more privileged than anything it hands out.
// That is the trade: one credential to guard and rotate instead of several to scatter.
//
// Paths:
//
//	config/root            the parent credential + an explicit token_scope ("user"|"account")
//	config/token/<role>    what a role's tokens may do, and over which zones/accounts
//	token/<role>           read to mint; every read mints a NEW token and leases it
//
// MULTI-ACCOUNT: with token_scope="user" one mount mints tokens for zones in every account its
// owner administers, because a role names zones by globally-unique zone id and never names an
// account. token_scope="account" is confined to the one account in config/root, so covering N
// accounts that way means N mounts at N paths.
//
// SECURITY: write access to config/root or config/token/* grants everything the parent token's
// ACCOUNT can do — which is strictly more than the parent token itself can do. Verified live:
// Cloudflare does NOT cap a minted token to a subset of its parent's permissions, so a parent
// holding only `Account API Tokens Write` can mint a child with any permission in that account.
// A role is the entire privilege definition (permission groups AND resources), so whoever can
// write a role can mint anything in the account. Gate those paths at least as tightly as the
// parent token itself; the `crossplane` policy grants cloudflare/config/* and deliberately
// nothing under cloudflare/token/*.
const secretTypeToken = "cloudflare_token"

type cloudflareBackend struct {
	*framework.Backend
	lock   sync.RWMutex
	client *CloudflareClient
}

func Factory(ctx context.Context, conf *logical.BackendConfig) (logical.Backend, error) {
	b := &cloudflareBackend{}

	b.Backend = &framework.Backend{
		BackendType:  logical.TypeLogical,
		Help:         "The Cloudflare secrets engine generates and revokes scoped Cloudflare API tokens.",
		PathsSpecial: &logical.Paths{},
		Paths: framework.PathAppend(
			pathConfigRoot(b),
			pathConfigToken(b),
			pathToken(b),
		),
		Secrets: []*framework.Secret{
			{
				Type:   secretTypeToken,
				Revoke: b.revokeToken,
				// No Renew handler on purpose. Cloudflare's update-token endpoint replaces the
				// whole token definition, so extending `expires_on` in place risks silently
				// dropping the policies. Instead the minted token's `expires_on` is set from
				// max_ttl while the lease TTL is `ttl`, so any renewal inside max_ttl is always
				// backed by a still-valid token and no Cloudflare-side edit is ever needed.
			},
		},
		Invalidate: b.invalidate,
	}

	if err := b.Setup(ctx, conf); err != nil {
		return nil, err
	}

	return b, nil
}

func (b *cloudflareBackend) revokeToken(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	tokenID, _ := req.Secret.InternalData["token_id"].(string)
	if tokenID == "" {
		return nil, fmt.Errorf("missing internal data for token revocation")
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	if err := client.DeleteToken(tokenID); err != nil {
		return nil, fmt.Errorf("revoking token in Cloudflare: %w", err)
	}
	return nil, nil
}

func (b *cloudflareBackend) invalidate(ctx context.Context, key string) {
	if key == "config/root" {
		b.lock.Lock()
		b.client = nil
		b.lock.Unlock()
	}
}

func (b *cloudflareBackend) getClient(ctx context.Context, s logical.Storage) (*CloudflareClient, error) {
	b.lock.RLock()
	if b.client != nil {
		defer b.lock.RUnlock()
		return b.client, nil
	}
	b.lock.RUnlock()

	b.lock.Lock()
	defer b.lock.Unlock()

	if b.client != nil {
		return b.client, nil
	}

	config, err := getConfigRoot(ctx, s)
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, fmt.Errorf("root configuration not set")
	}
	// Validate the STORED scope, not just incoming writes. A config written before token_scope
	// existed decodes to an empty scope, and silently defaulting it would pick an endpoint for
	// the operator — the exact failure mode making the field explicit was meant to remove.
	if err := config.validateScope(); err != nil {
		return nil, err
	}

	b.client = NewCloudflareClient(config.APIURL, config.APIToken, config.TokenScope, config.AccountID, 0)
	return b.client, nil
}
