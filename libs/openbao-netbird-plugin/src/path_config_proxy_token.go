package main

import (
	"context"
	"time"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

type configProxyToken struct {
	ProxyName string        `json:"proxy_name"`
	TTL       time.Duration `json:"ttl"`
	MaxTTL    time.Duration `json:"max_ttl"`
}

func pathConfigProxyToken(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "config/proxy-token/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the proxy token role",
					Required:    true,
				},
				"proxy_name": {
					Type:        framework.TypeString,
					Description: "Name for the generated proxy token in NetBird",
					Required:    true,
				},
				"ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Default TTL for generated tokens",
					Default:     31536000, // 1 year
				},
				"max_ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Maximum TTL for generated tokens",
					Default:     157680000, // 5 years
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathConfigProxyTokenRead,
				},
				logical.CreateOperation: &framework.PathOperation{
					Callback: b.pathConfigProxyTokenWrite,
				},
				logical.UpdateOperation: &framework.PathOperation{
					Callback: b.pathConfigProxyTokenWrite,
				},
				logical.DeleteOperation: &framework.PathOperation{
					Callback: b.pathConfigProxyTokenDelete,
				},
			},
			ExistenceCheck: b.pathConfigProxyTokenExistenceCheck,
		},
	}
}

func (b *netbirdBackend) pathConfigProxyTokenExistenceCheck(ctx context.Context, req *logical.Request, data *framework.FieldData) (bool, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/proxy-token/"+name)
	if err != nil {
		return false, err
	}
	return entry != nil, nil
}

func (b *netbirdBackend) pathConfigProxyTokenRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/proxy-token/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return nil, nil
	}

	var config configProxyToken
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}

	return &logical.Response{
		Data: map[string]interface{}{
			"proxy_name": config.ProxyName,
			"ttl":        int64(config.TTL.Seconds()),
			"max_ttl":    int64(config.MaxTTL.Seconds()),
		},
	}, nil
}

func (b *netbirdBackend) pathConfigProxyTokenWrite(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	entry, err := req.Storage.Get(ctx, "config/proxy-token/"+name)
	if err != nil {
		return nil, err
	}

	var config configProxyToken
	if entry != nil {
		if err := entry.DecodeJSON(&config); err != nil {
			return nil, err
		}
	}

	if proxyName, ok := data.GetOk("proxy_name"); ok {
		config.ProxyName = proxyName.(string)
	}
	if ttl, ok := data.GetOk("ttl"); ok {
		config.TTL = time.Duration(ttl.(int)) * time.Second
	}
	if maxTTL, ok := data.GetOk("max_ttl"); ok {
		config.MaxTTL = time.Duration(maxTTL.(int)) * time.Second
	}

	if config.ProxyName == "" {
		return logical.ErrorResponse("proxy_name is required"), nil
	}

	storageEntry, err := logical.StorageEntryJSON("config/proxy-token/"+name, config)
	if err != nil {
		return nil, err
	}

	if err := req.Storage.Put(ctx, storageEntry); err != nil {
		return nil, err
	}

	return nil, nil
}

func (b *netbirdBackend) pathConfigProxyTokenDelete(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	if err := req.Storage.Delete(ctx, "config/proxy-token/"+name); err != nil {
		return nil, err
	}
	return nil, nil
}
