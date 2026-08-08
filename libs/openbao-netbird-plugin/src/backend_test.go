package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
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

func setupMockNetBird(t *testing.T) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case r.Method == http.MethodPost && r.URL.Path == "/api/users/user-abc/tokens":
			json.NewEncoder(w).Encode(CreatePATResponse{
				PlainToken: "generated-pat-token",
				PersonalAccessToken: struct {
					ID string `json:"id"`
				}{ID: "pat-id-001"},
			})
		case r.Method == http.MethodDelete && r.URL.Path == "/api/users/user-abc/tokens/pat-id-001":
			w.WriteHeader(http.StatusNoContent)
		case r.Method == http.MethodPost && r.URL.Path == "/api/reverse-proxies/proxy-tokens":
			json.NewEncoder(w).Encode(CreateProxyTokenResponse{
				ID:    "proxy-id-001",
				Token: "generated-proxy-token",
			})
		case r.Method == http.MethodDelete && r.URL.Path == "/api/reverse-proxies/proxy-tokens/proxy-id-001":
			w.WriteHeader(http.StatusNoContent)
		case r.Method == http.MethodPost && r.URL.Path == "/api/setup-keys":
			json.NewEncoder(w).Encode(CreateSetupKeyResponse{
				ID:        "sk-id-001",
				Key:       "generated-setup-key",
				ExpiresAt: "2026-12-31T23:59:59Z",
			})
		case r.Method == http.MethodDelete && r.URL.Path == "/api/setup-keys/sk-id-001":
			w.WriteHeader(http.StatusNoContent)
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	}))
}

func writeRootConfig(t *testing.T, b logical.Backend, storage logical.Storage, apiURL string) {
	t.Helper()
	ctx := context.Background()
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/root",
		Storage:   storage,
		Data: map[string]interface{}{
			"api_url":               apiURL,
			"service_account_token": "test-service-token",
		},
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("writing root config: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("root config error: %s", resp.Error().Error())
	}
}

func TestConfigPATCRUD(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Create
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/pat/operator",
		Storage:   storage,
		Data: map[string]interface{}{
			"user_id":           "user-abc",
			"token_name_prefix": "openbao-test",
			"ttl":               3600,
			"max_ttl":           86400,
		},
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("create PAT config: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("create PAT config error: %s", resp.Error().Error())
	}

	// Read
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/pat/operator",
		Storage:   storage,
	}
	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("read PAT config: %v", err)
	}
	if resp.Data["user_id"] != "user-abc" {
		t.Errorf("unexpected user_id: %v", resp.Data["user_id"])
	}
	if resp.Data["token_name_prefix"] != "openbao-test" {
		t.Errorf("unexpected token_name_prefix: %v", resp.Data["token_name_prefix"])
	}
	if resp.Data["ttl"].(int64) != 3600 {
		t.Errorf("unexpected ttl: %v", resp.Data["ttl"])
	}

	// Delete
	req = &logical.Request{
		Operation: logical.DeleteOperation,
		Path:      "config/pat/operator",
		Storage:   storage,
	}
	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("delete PAT config: %v", err)
	}

	// Verify deleted
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/pat/operator",
		Storage:   storage,
	}
	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("read after delete: %v", err)
	}
	if resp != nil {
		t.Error("expected nil after delete")
	}
}

func TestPATGeneration(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()
	server := setupMockNetBird(t)
	defer server.Close()

	writeRootConfig(t, b, storage, server.URL)

	// Write PAT role config
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/pat/operator",
		Storage:   storage,
		Data: map[string]interface{}{
			"user_id":           "user-abc",
			"token_name_prefix": "openbao",
			"ttl":               3600,
			"max_ttl":           86400,
		},
	}
	b.HandleRequest(ctx, req)

	// Generate credential
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "pat/operator",
		Storage:   storage,
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("generate PAT: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("expected valid response, got: %v", resp)
	}

	if resp.Data["token_id"] != "pat-id-001" {
		t.Errorf("unexpected token_id: %v", resp.Data["token_id"])
	}
	if resp.Data["access_token"] != "generated-pat-token" {
		t.Errorf("unexpected access_token: %v", resp.Data["access_token"])
	}
	if resp.Secret == nil {
		t.Fatal("expected secret with lease")
	}
	if resp.Secret.TTL.Seconds() != 3600 {
		t.Errorf("unexpected TTL: %v", resp.Secret.TTL)
	}
}

func TestPATRevocation(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()
	server := setupMockNetBird(t)
	defer server.Close()

	writeRootConfig(t, b, storage, server.URL)

	// Write PAT role config
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/pat/operator",
		Storage:   storage,
		Data: map[string]interface{}{
			"user_id":           "user-abc",
			"token_name_prefix": "openbao",
			"ttl":               3600,
			"max_ttl":           86400,
		},
	}
	b.HandleRequest(ctx, req)

	// Generate credential
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "pat/operator",
		Storage:   storage,
	}
	resp, _ := b.HandleRequest(ctx, req)

	// Revoke
	req = &logical.Request{
		Operation: logical.RevokeOperation,
		Path:      "pat/operator",
		Storage:   storage,
		Secret:    resp.Secret,
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("revoke PAT: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("revoke error: %s", resp.Error().Error())
	}
}
