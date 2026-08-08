package main

import (
	"context"
	"fmt"
	"sync"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

const (
	secretTypePAT        = "netbird_pat"
	secretTypeProxyToken = "netbird_proxy_token"
	secretTypeSetupKey   = "netbird_setup_key"
)

type netbirdBackend struct {
	*framework.Backend
	lock   sync.RWMutex
	client *NetBirdClient
}

func Factory(ctx context.Context, conf *logical.BackendConfig) (logical.Backend, error) {
	b := &netbirdBackend{}

	b.Backend = &framework.Backend{
		BackendType:  logical.TypeLogical,
		Help:         "The NetBird secrets engine generates and manages NetBird credentials.",
		PathsSpecial: &logical.Paths{},
		Paths: framework.PathAppend(
			pathConfigRoot(b),
			pathConfigPAT(b),
			pathConfigProxyToken(b),
			pathConfigSetupKey(b),
			pathPAT(b),
			pathProxyToken(b),
			pathSetupKey(b),
		),
		Secrets: []*framework.Secret{
			{
				Type: secretTypePAT,
				Revoke: b.revokePAT,
			},
			{
				Type: secretTypeProxyToken,
				Revoke: b.revokeProxyToken,
			},
			{
				Type: secretTypeSetupKey,
				Revoke: b.revokeSetupKey,
			},
		},
		Invalidate: b.invalidate,
	}

	if err := b.Setup(ctx, conf); err != nil {
		return nil, err
	}

	return b, nil
}

func (b *netbirdBackend) revokePAT(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	userID, _ := req.Secret.InternalData["user_id"].(string)
	tokenID, _ := req.Secret.InternalData["token_id"].(string)
	if userID == "" || tokenID == "" {
		return nil, fmt.Errorf("missing internal data for PAT revocation")
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	if err := client.DeletePAT(userID, tokenID); err != nil {
		return nil, fmt.Errorf("revoking PAT in NetBird: %w", err)
	}
	return nil, nil
}

func (b *netbirdBackend) revokeProxyToken(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	tokenID, _ := req.Secret.InternalData["token_id"].(string)
	if tokenID == "" {
		return nil, fmt.Errorf("missing internal data for proxy token revocation")
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	if err := client.DeleteProxyToken(tokenID); err != nil {
		return nil, fmt.Errorf("revoking proxy token in NetBird: %w", err)
	}
	return nil, nil
}

func (b *netbirdBackend) revokeSetupKey(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	keyID, _ := req.Secret.InternalData["key_id"].(string)
	if keyID == "" {
		return nil, fmt.Errorf("missing internal data for setup key revocation")
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	if err := client.DeleteSetupKey(keyID); err != nil {
		return nil, fmt.Errorf("revoking setup key in NetBird: %w", err)
	}
	return nil, nil
}

func (b *netbirdBackend) invalidate(ctx context.Context, key string) {
	if key == "config/root" {
		b.lock.Lock()
		b.client = nil
		b.lock.Unlock()
	}
}

func (b *netbirdBackend) getClient(ctx context.Context, s logical.Storage) (*NetBirdClient, error) {
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

	b.client = NewNetBirdClient(config.APIURL, config.ServiceAccountToken, 0)
	return b.client, nil
}
