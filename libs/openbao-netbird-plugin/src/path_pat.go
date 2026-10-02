package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

func pathPAT(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "pat/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the PAT role",
					Required:    true,
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathPATRead,
				},
			},
		},
	}
}

func (b *netbirdBackend) pathPATRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	entry, err := req.Storage.Get(ctx, "config/pat/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return logical.ErrorResponse("role %q not found", name), nil
	}

	var config configPAT
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	tokenName := fmt.Sprintf("%s-%s", config.TokenNamePrefix, name)
	// NetBird-side expiry: max_ttl when leased (renewal headroom), ttl when not — see
	// vendorExpirySeconds. This is the second of the two independent expiries, and it bounds the
	// PAT even if OpenBao loses the lease entirely.
	expiresInSeconds := vendorExpirySeconds(config.ManageLease, config.TTL, config.MaxTTL, 86400)

	patResp, err := client.CreatePAT(config.UserID, &CreatePATRequest{
		Name:      tokenName,
		ExpiresIn: expiresInSeconds,
	})
	if err != nil {
		return nil, fmt.Errorf("creating PAT in NetBird: %w", err)
	}

	return b.leaseResponse(secretTypePAT, name, config.ManageLease, config.TTL, config.MaxTTL,
		map[string]interface{}{
			"token_id":     patResp.PersonalAccessToken.ID,
			"access_token": patResp.PlainToken,
		},
		map[string]interface{}{
			"user_id":  config.UserID,
			"token_id": patResp.PersonalAccessToken.ID,
		}), nil
}
