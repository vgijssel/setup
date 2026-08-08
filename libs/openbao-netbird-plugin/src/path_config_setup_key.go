package main

import (
	"context"
	"time"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

type configSetupKey struct {
	NamePrefix string        `json:"name_prefix"`
	Type       string        `json:"type"`
	Ephemeral  bool          `json:"ephemeral"`
	AutoGroups []string      `json:"auto_groups"`
	UsageLimit int           `json:"usage_limit"`
	TTL        time.Duration `json:"ttl"`
	MaxTTL     time.Duration `json:"max_ttl"`
}

func pathConfigSetupKey(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "config/setup-key/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the setup key role",
					Required:    true,
				},
				"name_prefix": {
					Type:        framework.TypeString,
					Description: "Prefix for generated setup key names",
					Default:     "openbao",
				},
				"type": {
					Type:        framework.TypeString,
					Description: "Setup key type (one-off or reusable)",
					Default:     "reusable",
				},
				"ephemeral": {
					Type:        framework.TypeBool,
					Description: "Whether peers using this key are ephemeral",
					Default:     false,
				},
				"auto_groups": {
					Type:        framework.TypeCommaStringSlice,
					Description: "Groups to auto-assign to peers",
				},
				"usage_limit": {
					Type:        framework.TypeInt,
					Description: "Maximum number of times the key can be used (0 = unlimited)",
					Default:     0,
				},
				"ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Default TTL for generated keys",
					Default:     604800, // 7 days
				},
				"max_ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Maximum TTL for generated keys",
					Default:     2592000, // 30 days
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathConfigSetupKeyRead,
				},
				logical.CreateOperation: &framework.PathOperation{
					Callback: b.pathConfigSetupKeyWrite,
				},
				logical.UpdateOperation: &framework.PathOperation{
					Callback: b.pathConfigSetupKeyWrite,
				},
				logical.DeleteOperation: &framework.PathOperation{
					Callback: b.pathConfigSetupKeyDelete,
				},
			},
			ExistenceCheck: b.pathConfigSetupKeyExistenceCheck,
		},
	}
}

func (b *netbirdBackend) pathConfigSetupKeyExistenceCheck(ctx context.Context, req *logical.Request, data *framework.FieldData) (bool, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/setup-key/"+name)
	if err != nil {
		return false, err
	}
	return entry != nil, nil
}

func (b *netbirdBackend) pathConfigSetupKeyRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/setup-key/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return nil, nil
	}

	var config configSetupKey
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}

	return &logical.Response{
		Data: map[string]interface{}{
			"name_prefix": config.NamePrefix,
			"type":        config.Type,
			"ephemeral":   config.Ephemeral,
			"auto_groups": config.AutoGroups,
			"usage_limit": config.UsageLimit,
			"ttl":         int64(config.TTL.Seconds()),
			"max_ttl":     int64(config.MaxTTL.Seconds()),
		},
	}, nil
}

func (b *netbirdBackend) pathConfigSetupKeyWrite(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	entry, err := req.Storage.Get(ctx, "config/setup-key/"+name)
	if err != nil {
		return nil, err
	}

	var config configSetupKey
	if entry != nil {
		if err := entry.DecodeJSON(&config); err != nil {
			return nil, err
		}
	}

	if prefix, ok := data.GetOk("name_prefix"); ok {
		config.NamePrefix = prefix.(string)
	}
	if keyType, ok := data.GetOk("type"); ok {
		config.Type = keyType.(string)
	}
	if ephemeral, ok := data.GetOk("ephemeral"); ok {
		config.Ephemeral = ephemeral.(bool)
	}
	if groups, ok := data.GetOk("auto_groups"); ok {
		config.AutoGroups = groups.([]string)
	}
	if limit, ok := data.GetOk("usage_limit"); ok {
		config.UsageLimit = limit.(int)
	}
	if ttl, ok := data.GetOk("ttl"); ok {
		config.TTL = time.Duration(ttl.(int)) * time.Second
	}
	if maxTTL, ok := data.GetOk("max_ttl"); ok {
		config.MaxTTL = time.Duration(maxTTL.(int)) * time.Second
	}

	storageEntry, err := logical.StorageEntryJSON("config/setup-key/"+name, config)
	if err != nil {
		return nil, err
	}

	if err := req.Storage.Put(ctx, storageEntry); err != nil {
		return nil, err
	}

	return nil, nil
}

func (b *netbirdBackend) pathConfigSetupKeyDelete(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	if err := req.Storage.Delete(ctx, "config/setup-key/"+name); err != nil {
		return nil, err
	}
	return nil, nil
}
