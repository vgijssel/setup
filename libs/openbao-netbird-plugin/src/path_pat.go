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
	// NetBird-side expiry: max_ttl when leased (renewal headroom), ttl when not. This is the
	// second of the two independent expiries, and it bounds the PAT even if OpenBao loses the
	// lease entirely.
	//
	// DAYS, not seconds — the PAT endpoint validates expires_in to 1..365 and rejects a seconds
	// value with 422 "expiration has to be between 1 and 365". The setup-key endpoint takes the
	// same field in SECONDS. See vendorExpiryDays.
	expiresInDays := vendorExpiryDays(config.ManageLease, config.TTL, config.MaxTTL, 1)

	patResp, err := client.CreatePAT(config.UserID, &CreatePATRequest{
		Name:      tokenName,
		ExpiresIn: expiresInDays,
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
