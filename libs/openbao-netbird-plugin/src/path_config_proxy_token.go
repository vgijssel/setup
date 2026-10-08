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
	// See lease.go: two independent expiries, lease + NetBird expires_in. Default TRUE.
	ManageLease bool `json:"manage_lease"`
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
				"manage_lease": manageLeaseField(),
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
			"proxy_name":   config.ProxyName,
			"ttl":          int64(config.TTL.Seconds()),
			"max_ttl":      int64(config.MaxTTL.Seconds()),
			"manage_lease": config.ManageLease,
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
	} else {
		// A NEW role takes the schema defaults for anything not supplied. This has to be
		// explicit: GetOk below reports only what the REQUEST carried and does NOT apply the
		// Default declared in the field schema, so relying on it would leave ttl/max_ttl at zero
		// and manage_lease at false — silently minting an unleased, unbounded credential.
		config.TTL = time.Duration(data.Get("ttl").(int)) * time.Second
		config.MaxTTL = time.Duration(data.Get("max_ttl").(int)) * time.Second
		config.ManageLease = data.Get("manage_lease").(bool)
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
	if manageLease, ok := data.GetOk("manage_lease"); ok {
		config.ManageLease = manageLease.(bool)
	}

	if config.ProxyName == "" {
		return logical.ErrorResponse("proxy_name is required"), nil
	}

	ttl, errResp := resolveLeaseTTLs(data, config.ManageLease, config.TTL, config.MaxTTL)
	if errResp != nil {
		return errResp, nil
	}
	config.TTL = ttl

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
