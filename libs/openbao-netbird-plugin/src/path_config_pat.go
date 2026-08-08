package main

import (
	"context"
	"time"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

type configPAT struct {
	UserID          string        `json:"user_id"`
	TokenNamePrefix string        `json:"token_name_prefix"`
	TTL             time.Duration `json:"ttl"`
	MaxTTL          time.Duration `json:"max_ttl"`
}

func pathConfigPAT(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "config/pat/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the PAT role",
					Required:    true,
				},
				"user_id": {
					Type:        framework.TypeString,
					Description: "NetBird user ID to create tokens for",
					Required:    true,
				},
				"token_name_prefix": {
					Type:        framework.TypeString,
					Description: "Prefix for generated token names",
					Default:     "openbao",
				},
				"ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Default TTL for generated tokens",
					Default:     2592000, // 30 days
				},
				"max_ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Maximum TTL for generated tokens",
					Default:     31536000, // 365 days
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathConfigPATRead,
				},
				logical.CreateOperation: &framework.PathOperation{
					Callback: b.pathConfigPATWrite,
				},
				logical.UpdateOperation: &framework.PathOperation{
					Callback: b.pathConfigPATWrite,
				},
				logical.DeleteOperation: &framework.PathOperation{
					Callback: b.pathConfigPATDelete,
				},
			},
			ExistenceCheck: b.pathConfigPATExistenceCheck,
		},
	}
}

func (b *netbirdBackend) pathConfigPATExistenceCheck(ctx context.Context, req *logical.Request, data *framework.FieldData) (bool, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/pat/"+name)
	if err != nil {
		return false, err
	}
	return entry != nil, nil
}

func (b *netbirdBackend) pathConfigPATRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/pat/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return nil, nil
	}

	var config configPAT
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}

	return &logical.Response{
		Data: map[string]interface{}{
			"user_id":           config.UserID,
			"token_name_prefix": config.TokenNamePrefix,
			"ttl":               int64(config.TTL.Seconds()),
			"max_ttl":           int64(config.MaxTTL.Seconds()),
		},
	}, nil
}

func (b *netbirdBackend) pathConfigPATWrite(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	entry, err := req.Storage.Get(ctx, "config/pat/"+name)
	if err != nil {
		return nil, err
	}

	var config configPAT
	if entry != nil {
		if err := entry.DecodeJSON(&config); err != nil {
			return nil, err
		}
	}

	if userID, ok := data.GetOk("user_id"); ok {
		config.UserID = userID.(string)
	}
	if prefix, ok := data.GetOk("token_name_prefix"); ok {
		config.TokenNamePrefix = prefix.(string)
	}
	if ttl, ok := data.GetOk("ttl"); ok {
		config.TTL = time.Duration(ttl.(int)) * time.Second
	}
	if maxTTL, ok := data.GetOk("max_ttl"); ok {
		config.MaxTTL = time.Duration(maxTTL.(int)) * time.Second
	}

	if config.UserID == "" {
		return logical.ErrorResponse("user_id is required"), nil
	}

	storageEntry, err := logical.StorageEntryJSON("config/pat/"+name, config)
	if err != nil {
		return nil, err
	}

	if err := req.Storage.Put(ctx, storageEntry); err != nil {
		return nil, err
	}

	return nil, nil
}

func (b *netbirdBackend) pathConfigPATDelete(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	if err := req.Storage.Delete(ctx, "config/pat/"+name); err != nil {
		return nil, err
	}
	return nil, nil
}
