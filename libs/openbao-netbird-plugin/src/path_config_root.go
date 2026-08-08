package main

import (
	"context"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

type configRoot struct {
	APIURL              string `json:"api_url"`
	ServiceAccountToken string `json:"service_account_token"`
}

func pathConfigRoot(b *netbirdBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "config/root",
			Fields: map[string]*framework.FieldSchema{
				"api_url": {
					Type:        framework.TypeString,
					Description: "NetBird management API base URL",
					Required:    true,
				},
				"service_account_token": {
					Type:        framework.TypeString,
					Description: "Admin-scoped service account token",
					Required:    true,
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathConfigRootRead,
				},
				logical.CreateOperation: &framework.PathOperation{
					Callback: b.pathConfigRootWrite,
				},
				logical.UpdateOperation: &framework.PathOperation{
					Callback: b.pathConfigRootWrite,
				},
				logical.DeleteOperation: &framework.PathOperation{
					Callback: b.pathConfigRootDelete,
				},
			},
			ExistenceCheck: b.pathConfigRootExistenceCheck,
		},
	}
}

func (b *netbirdBackend) pathConfigRootExistenceCheck(ctx context.Context, req *logical.Request, _ *framework.FieldData) (bool, error) {
	config, err := getConfigRoot(ctx, req.Storage)
	if err != nil {
		return false, err
	}
	return config != nil, nil
}

func (b *netbirdBackend) pathConfigRootRead(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	config, err := getConfigRoot(ctx, req.Storage)
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, nil
	}

	return &logical.Response{
		Data: map[string]interface{}{
			"api_url": config.APIURL,
		},
	}, nil
}

func (b *netbirdBackend) pathConfigRootWrite(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	config, err := getConfigRoot(ctx, req.Storage)
	if err != nil {
		return nil, err
	}
	if config == nil {
		config = &configRoot{}
	}

	if apiURL, ok := data.GetOk("api_url"); ok {
		config.APIURL = apiURL.(string)
	}
	if token, ok := data.GetOk("service_account_token"); ok {
		config.ServiceAccountToken = token.(string)
	}

	if config.APIURL == "" {
		return logical.ErrorResponse("api_url is required"), nil
	}
	if config.ServiceAccountToken == "" {
		return logical.ErrorResponse("service_account_token is required"), nil
	}

	entry, err := logical.StorageEntryJSON("config/root", config)
	if err != nil {
		return nil, err
	}

	if err := req.Storage.Put(ctx, entry); err != nil {
		return nil, err
	}

	b.lock.Lock()
	b.client = nil
	b.lock.Unlock()

	return nil, nil
}

func (b *netbirdBackend) pathConfigRootDelete(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	if err := req.Storage.Delete(ctx, "config/root"); err != nil {
		return nil, err
	}

	b.lock.Lock()
	b.client = nil
	b.lock.Unlock()

	return nil, nil
}

func getConfigRoot(ctx context.Context, s logical.Storage) (*configRoot, error) {
	entry, err := s.Get(ctx, "config/root")
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return nil, nil
	}

	var config configRoot
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}
	return &config, nil
}
