package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

const secretTypeProxyToken = "netbird_proxy_token"

func secretProxyToken(b *netbirdBackend) *framework.Secret {
	return &framework.Secret{
		Type: secretTypeProxyToken,
		Fields: map[string]*framework.FieldSchema{
			"token_id": {
				Type:        framework.TypeString,
				Description: "NetBird proxy token ID",
			},
			"token": {
				Type:        framework.TypeString,
				Description: "NetBird proxy token value",
			},
		},
		Revoke: b.proxyTokenRevoke,
		Renew:  b.proxyTokenRenew,
	}
}

func (b *netbirdBackend) proxyTokenRevoke(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	tokenID, ok := req.Secret.InternalData["token_id"].(string)
	if !ok {
		return nil, fmt.Errorf("token_id not found in internal data")
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

func (b *netbirdBackend) proxyTokenRenew(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	resp := &logical.Response{Secret: req.Secret}
	resp.Secret.TTL = req.Secret.TTL
	resp.Secret.MaxTTL = req.Secret.MaxTTL
	return resp, nil
}
