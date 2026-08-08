package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

const secretTypeSetupKey = "netbird_setup_key"

func secretSetupKey(b *netbirdBackend) *framework.Secret {
	return &framework.Secret{
		Type: secretTypeSetupKey,
		Fields: map[string]*framework.FieldSchema{
			"key_id": {
				Type:        framework.TypeString,
				Description: "NetBird setup key ID",
			},
			"setup_key": {
				Type:        framework.TypeString,
				Description: "NetBird setup key value",
			},
			"expires_at": {
				Type:        framework.TypeString,
				Description: "Setup key expiration timestamp",
			},
		},
		Revoke: b.setupKeyRevoke,
		Renew:  b.setupKeyRenew,
	}
}

func (b *netbirdBackend) setupKeyRevoke(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	keyID, ok := req.Secret.InternalData["key_id"].(string)
	if !ok {
		return nil, fmt.Errorf("key_id not found in internal data")
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

func (b *netbirdBackend) setupKeyRenew(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	resp := &logical.Response{Secret: req.Secret}
	resp.Secret.TTL = req.Secret.TTL
	resp.Secret.MaxTTL = req.Secret.MaxTTL
	return resp, nil
}
