package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

func pathSetupKey(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "setup-key/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the setup key role",
					Required:    true,
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathSetupKeyRead,
				},
			},
		},
	}
}

func (b *netbirdBackend) pathSetupKeyRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	entry, err := req.Storage.Get(ctx, "config/setup-key/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return logical.ErrorResponse("role %q not found", name), nil
	}

	var config configSetupKey
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	keyName := fmt.Sprintf("%s-%s", config.NamePrefix, name)
	// NetBird-side expiry: max_ttl when leased (renewal headroom), ttl when not — see
	// vendorExpirySeconds. This is the second of the two independent expiries, and it bounds the
	// key even if OpenBao loses the lease entirely.
	expiresInSeconds := vendorExpirySeconds(config.ManageLease, config.TTL, config.MaxTTL, 604800)

	skResp, err := client.CreateSetupKey(&CreateSetupKeyRequest{
		Name:       keyName,
		Type:       config.Type,
		Ephemeral:  config.Ephemeral,
		AutoGroups: config.AutoGroups,
		UsageLimit: config.UsageLimit,
		ExpiresIn:  expiresInSeconds,
	})
	if err != nil {
		return nil, fmt.Errorf("creating setup key in NetBird: %w", err)
	}

	return b.leaseResponse(secretTypeSetupKey, name, config.ManageLease, config.TTL, config.MaxTTL,
		map[string]interface{}{
			"key_id":     skResp.ID,
			"setup_key":  skResp.Key,
			"expires_at": skResp.ExpiresAt,
		},
		map[string]interface{}{
			"key_id": skResp.ID,
		}), nil
}
