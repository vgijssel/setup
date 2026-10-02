package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

func pathProxyToken(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "proxy-token/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the proxy token role",
					Required:    true,
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathProxyTokenRead,
				},
			},
		},
	}
}

func (b *netbirdBackend) pathProxyTokenRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	entry, err := req.Storage.Get(ctx, "config/proxy-token/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return logical.ErrorResponse("role %q not found", name), nil
	}

	var config configProxyToken
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}

	client, err := b.getClient(ctx, req.Storage)
	if err != nil {
		return nil, err
	}

	// NO VENDOR-SIDE EXPIRY IS POSSIBLE HERE. NetBird's reverse-proxy token API
	// (POST /api/reverse-proxies/proxy-tokens) accepts only a name — there is no `expires_in`
	// field to set, unlike PATs and setup keys. So a proxy token has ONLY the OpenBao lease
	// bounding it, and with manage_lease=false it has nothing at all. That is a vendor API
	// limitation, not a choice; treat an unleased proxy-token role as a permanent credential.
	proxyResp, err := client.CreateProxyToken(&CreateProxyTokenRequest{
		Name: config.ProxyName,
	})
	if err != nil {
		return nil, fmt.Errorf("creating proxy token in NetBird: %w", err)
	}

	return b.leaseResponse(secretTypeProxyToken, name, config.ManageLease, config.TTL, config.MaxTTL,
		map[string]interface{}{
			"token_id": proxyResp.ID,
			"token":    proxyResp.Token,
		},
		map[string]interface{}{
			"token_id": proxyResp.ID,
		}), nil
}
