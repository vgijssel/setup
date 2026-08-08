package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

const secretTypePAT = "netbird_pat"

func secretPAT(b *netbirdBackend) *framework.Secret {
	return &framework.Secret{
		Type: secretTypePAT,
		Fields: map[string]*framework.FieldSchema{
			"token_id": {
				Type:        framework.TypeString,
				Description: "NetBird PAT ID",
			},
			"access_token": {
				Type:        framework.TypeString,
				Description: "NetBird PAT value",
			},
		},
		Revoke: b.patRevoke,
		Renew:  b.patRenew,
	}
}

func (b *netbirdBackend) patRevoke(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	tokenID, ok := req.Secret.InternalData["token_id"].(string)
	if !ok {
		return nil, fmt.Errorf("token_id not found in internal data")
	}
	userID, ok := req.Secret.InternalData["user_id"].(string)
	if !ok {
		return nil, fmt.Errorf("user_id not found in internal data")
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

func (b *netbirdBackend) patRenew(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	resp := &logical.Response{Secret: req.Secret}
	resp.Secret.TTL = req.Secret.TTL
	resp.Secret.MaxTTL = req.Secret.MaxTTL
	return resp, nil
}
