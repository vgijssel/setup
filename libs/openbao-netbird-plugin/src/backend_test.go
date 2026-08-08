package main

import (
	"context"
	"testing"

	"github.com/openbao/openbao/sdk/v2/logical"
)

func getTestBackend(t *testing.T) (logical.Backend, logical.Storage) {
	t.Helper()

	config := logical.TestBackendConfig()
	config.StorageView = &logical.InmemStorage{}

	b, err := Factory(context.Background(), config)
	if err != nil {
		t.Fatalf("creating backend: %v", err)
	}
	return b, config.StorageView
}

func TestConfigRootWriteAndRead(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Write config
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/root",
		Storage:   storage,
		Data: map[string]interface{}{
			"api_url":               "https://api.netbird.io",
			"service_account_token": "secret-token-123",
		},
	}

	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("write config: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("write config error response: %s", resp.Error().Error())
	}

	// Read config
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/root",
		Storage:   storage,
	}

	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("read config: %v", err)
	}
	if resp == nil {
		t.Fatal("expected non-nil response")
	}
	if resp.Data["api_url"] != "https://api.netbird.io" {
		t.Errorf("unexpected api_url: %v", resp.Data["api_url"])
	}
	// Token should NOT be returned in read
	if _, ok := resp.Data["service_account_token"]; ok {
		t.Error("service_account_token should not be returned in read")
	}
}

func TestConfigRootDelete(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Write config first
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/root",
		Storage:   storage,
		Data: map[string]interface{}{
			"api_url":               "https://api.netbird.io",
			"service_account_token": "secret-token-123",
		},
	}
	b.HandleRequest(ctx, req)

	// Delete config
	req = &logical.Request{
		Operation: logical.DeleteOperation,
		Path:      "config/root",
		Storage:   storage,
	}

	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("delete config: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("delete config error: %s", resp.Error().Error())
	}

	// Read should return nil
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/root",
		Storage:   storage,
	}
	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("read after delete: %v", err)
	}
	if resp != nil {
		t.Error("expected nil response after delete")
	}
}

func TestConfigRootValidation(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Missing api_url
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/root",
		Storage:   storage,
		Data: map[string]interface{}{
			"service_account_token": "token",
		},
	}

	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Error("expected error response for missing api_url")
	}

	// Missing service_account_token
	req = &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/root",
		Storage:   storage,
		Data: map[string]interface{}{
			"api_url": "https://api.netbird.io",
		},
	}

	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Error("expected error response for missing service_account_token")
	}
}
