package main

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

// permissionGroupID matches Cloudflare's 32-hex permission-group ids, which is how a role entry
// is told apart from a human name like "DNS Write".
var permissionGroupID = regexp.MustCompile(`^[0-9a-f]{32}$`)

// cloudflareTokenNameMaxLen is Cloudflare's documented limit on `name`.
const cloudflareTokenNameMaxLen = 120

func pathToken(b *cloudflareBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "token/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the token role",
					Required:    true,
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathTokenRead,
				},
			},
		},
	}
}

// pathTokenRead mints a fresh Cloudflare API token for the role.
//
// Every read mints a NEW token — there is no caching, by design: that is what makes the
// credential per-consumer and revocable. A consumer that re-reads on a schedule (the
// ExternalSecret pattern used in this repo) therefore rotates, with the previous token staying
// valid until its own lease expires. Set the consumer's refresh interval to roughly half the
// role's `ttl` so the two overlap and the handover is never a gap.
func (b *cloudflareBackend) pathTokenRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	config, err := getConfigToken(ctx, req.Storage, name)
	if err != nil {
		return nil, err
	}
	if config == nil {
		return logical.ErrorResponse("role %q not found", name), nil
	}

	// Every failure below this line is returned as an ERROR RESPONSE, not a Go error.
	//
	// A returned Go error becomes a bare HTTP 500 with no body, so `bao read` prints nothing and
	// an ExternalSecret records no reason — which is precisely the opaque failure this engine
	// exists to replace (the dead static token showed up only as a 9109 buried in an
	// external-dns crash loop). These are all configuration faults with a specific cause, so the
	// cause has to reach whoever is reading.
	root, err := getConfigRoot(ctx, req.Storage)
	if err != nil {
		return nil, err
	}
	if root == nil {
		return logical.ErrorResponse("cloudflare: config/root is not set — write the parent API token " +
			"and a token_scope to cloudflare/config/root before minting"), nil
	}
	// Surfaced as a 400 with the reason rather than letting getClient fail into a bodiless 500.
	if err := root.validateScope(); err != nil {
		return logical.ErrorResponse("cloudflare: config/root is unusable: %s", err.Error()), nil
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	groups, err := resolvePermissionGroups(client, config.Permissions)
	if err != nil {
		return logical.ErrorResponse("cloudflare: %s", err.Error()), nil
	}

	resources := map[string]string{}
	for _, zoneID := range config.ZoneIDs {
		resources["com.cloudflare.api.account.zone."+zoneID] = "*"
	}
	for _, accountID := range config.AccountIDs {
		resources["com.cloudflare.api.account."+accountID] = "*"
	}

	createReq := &CreateTokenRequest{
		Name: tokenName(config.TokenNamePrefix, name),
		Policies: []TokenPolicy{
			{
				Effect:           "allow",
				Resources:        resources,
				PermissionGroups: groups,
			},
		},
	}

	// Cloudflare-side expiry — the second of the two independent expiries, and the one that holds
	// even if OpenBao is gone entirely (storage restored from a snapshot, the mount deleted).
	// Set to the longest the token could legitimately still be in use:
	//
	//	LEASED    max_ttl — a renewal can extend the lease that far, so the token has to outlive
	//	          every renewal. Using ttl would kill it upstream at the FIRST renewal while
	//	          OpenBao still believed the lease was good.
	//	UNLEASED  ttl — nothing can extend anything, so ttl is the whole intended lifetime. Using
	//	          max_ttl would silently inflate the exposure of a token nothing can revoke.
	//
	// A role is refused at write time if its effective lifetime here would be 0 while unleased,
	// since expires_on would then be the only bound and there would not be one.
	if lifetime := config.vendorLifetime(); lifetime > 0 {
		createReq.ExpiresOn = time.Now().UTC().Add(lifetime).Format(time.RFC3339)
	}

	if len(config.AllowedIPs) > 0 {
		createReq.Condition = &TokenCondition{
			RequestIP: &RequestIPCondition{In: config.AllowedIPs},
		}
	}

	result, err := client.CreateToken(createReq)
	if err != nil {
		// Carries Cloudflare's own error code through to the caller. 9109 means the PARENT token
		// is dead or revoked; a permissions error means the parent cannot grant what this role
		// asks for. Those need entirely different fixes and are indistinguishable without the text.
		return logical.ErrorResponse("cloudflare: %s", err.Error()), nil
	}

	respData := map[string]interface{}{
		"token_id":   result.ID,
		"api_token":  result.Value,
		"expires_on": result.ExpiresOn,
	}

	// UNLEASED (the default, and what every ExternalSecret consumer needs).
	//
	// A secret lease in OpenBao belongs to the auth token that created it, so when that token is
	// revoked the lease goes with it and this engine's revoke deletes the Cloudflare token. ESO
	// logs in, reads, then revokes its own Vault token — so returning a lease here hands the
	// consumer a credential that is destroyed seconds later. Measured exactly that: a Secret
	// synced successfully and its token answered 9109 twenty seconds afterwards, with no leases
	// and no minted tokens left in Cloudflare.
	//
	// So the token's lifetime is Cloudflare's own expires_on, set above from max_ttl and
	// guaranteed not to be 0 by the role's validation. OpenBao tracks nothing and revokes
	// nothing, which is precisely what makes the credential outlive the caller's session.
	if !config.ManageLease {
		return &logical.Response{Data: respData}, nil
	}

	resp := b.Secret(secretTypeToken).Response(respData, map[string]interface{}{
		"token_id": result.ID,
		// Needed by renewToken to re-read the role's TTLs, and by revokeToken to find the token.
		"role": name,
	})
	resp.Secret.TTL = config.TTL
	resp.Secret.MaxTTL = config.MaxTTL

	return resp, nil
}

// resolvePermissionGroups turns a role's `permissions` into the id-only refs Cloudflare wants.
//
// Raw ids pass through untouched; anything else is looked up by name. The lookup is one extra
// GET per mint and is not cached on purpose — mints are rare (a rotation every few weeks), and a
// stale cache would mean a role silently keeps using a permission group that has been
// deprecated or re-identified.
//
// Names are matched case-insensitively but must otherwise be exact. Cloudflare treats the name
// as cosmetic and reserves the right to change it, so pinning ids in the role is the more
// durable choice; names exist because an id is undiscoverable without an already-working token.
func resolvePermissionGroups(client *CloudflareClient, permissions []string) ([]PermissionGroupRef, error) {
	refs := make([]PermissionGroupRef, 0, len(permissions))
	var needLookup []string

	for _, p := range permissions {
		if permissionGroupID.MatchString(p) {
			refs = append(refs, PermissionGroupRef{ID: p})
		} else {
			needLookup = append(needLookup, p)
		}
	}

	if len(needLookup) == 0 {
		return refs, nil
	}

	groups, err := client.ListPermissionGroups()
	if err != nil {
		return nil, fmt.Errorf("resolving permission group names: %w", err)
	}

	byName := make(map[string]string, len(groups))
	for _, g := range groups {
		byName[strings.ToLower(g.Name)] = g.ID
	}

	for _, p := range needLookup {
		id, ok := byName[strings.ToLower(p)]
		if !ok {
			return nil, fmt.Errorf("permission group %q not found among the %d groups available in this token scope "+
				"(ids differ between user and account scope); check the exact name or pin the 32-hex id instead",
				p, len(groups))
		}
		refs = append(refs, PermissionGroupRef{ID: id})
	}

	return refs, nil
}

// tokenName builds the name the token carries in the Cloudflare dashboard. The timestamp makes
// successive rotations of one role distinguishable there — without it a dashboard listing shows
// several identically named tokens and there is no way to tell which lease owns which.
func tokenName(prefix, role string) string {
	name := fmt.Sprintf("%s-%s-%s", prefix, role, time.Now().UTC().Format("20060102T150405Z"))
	if len(name) > cloudflareTokenNameMaxLen {
		name = name[:cloudflareTokenNameMaxLen]
	}
	return name
}
