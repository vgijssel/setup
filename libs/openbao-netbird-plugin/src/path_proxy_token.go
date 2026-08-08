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

	proxyResp, err := client.CreateProxyToken(&CreateProxyTokenRequest{
		Name: config.ProxyName,
	})
	if err != nil {
		return nil, fmt.Errorf("creating proxy token in NetBird: %w", err)
	}

	resp := b.Secret(secretTypeProxyToken).Response(map[string]interface{}{
		"token_id": proxyResp.ID,
		"token":    proxyResp.Token,
	}, map[string]interface{}{
		"token_id": proxyResp.ID,
	})

	resp.Secret.TTL = config.TTL
	resp.Secret.MaxTTL = config.MaxTTL

	return resp, nil
}
