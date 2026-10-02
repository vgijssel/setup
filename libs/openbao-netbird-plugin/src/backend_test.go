package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

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
		t.Fatal("expected leased response with Secret")
	}
	if resp.Secret.InternalData["user_id"] != "user-abc" {
		t.Errorf("unexpected internal user_id: %v", resp.Secret.InternalData["user_id"])
	}
	if resp.Secret.InternalData["token_id"] != "pat-id-001" {
		t.Errorf("unexpected internal token_id: %v", resp.Secret.InternalData["token_id"])
	}
}

func TestConfigProxyTokenCRUD(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Create
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/proxy-token/secret",
		Storage:   storage,
		Data: map[string]interface{}{
			"proxy_name": "secret.vgijssel.nl",
			"ttl":        31536000,
			"max_ttl":    157680000,
		},
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("create proxy token config: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("create error: %s", resp.Error().Error())
	}

	// Read
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/proxy-token/secret",
		Storage:   storage,
	}
	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("read proxy token config: %v", err)
	}
	if resp.Data["proxy_name"] != "secret.vgijssel.nl" {
		t.Errorf("unexpected proxy_name: %v", resp.Data["proxy_name"])
	}

	// Delete
	req = &logical.Request{
		Operation: logical.DeleteOperation,
		Path:      "config/proxy-token/secret",
		Storage:   storage,
	}
	_, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("delete: %v", err)
	}

	// Verify deleted
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/proxy-token/secret",
		Storage:   storage,
	}
	resp, _ = b.HandleRequest(ctx, req)
	if resp != nil {
		t.Error("expected nil after delete")
	}
}

func TestProxyTokenGeneration(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()
	server := setupMockNetBird(t)
	defer server.Close()

	writeRootConfig(t, b, storage, server.URL)

	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/proxy-token/secret",
		Storage:   storage,
		Data: map[string]interface{}{
			"proxy_name": "secret.vgijssel.nl",
			"ttl":        31536000,
			"max_ttl":    157680000,
		},
	}
	b.HandleRequest(ctx, req)

	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "proxy-token/secret",
		Storage:   storage,
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("generate proxy token: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("expected valid response, got: %v", resp)
	}
	if resp.Data["token_id"] != "proxy-id-001" {
		t.Errorf("unexpected token_id: %v", resp.Data["token_id"])
	}
	if resp.Data["token"] != "generated-proxy-token" {
		t.Errorf("unexpected token: %v", resp.Data["token"])
	}
	if resp.Secret == nil {
		t.Fatal("expected leased response with Secret")
	}
	if resp.Secret.InternalData["token_id"] != "proxy-id-001" {
		t.Errorf("unexpected internal token_id: %v", resp.Secret.InternalData["token_id"])
	}
}

func TestConfigSetupKeyCRUD(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Create
	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/setup-key/pikvm",
		Storage:   storage,
		Data: map[string]interface{}{
			"name_prefix": "openbao-pikvm",
			"type":        "reusable",
			"ephemeral":   false,
			"auto_groups": "homelab,pikvm",
			"usage_limit": 0,
			"ttl":         604800,
			"max_ttl":     2592000,
		},
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("create setup key config: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("create error: %s", resp.Error().Error())
	}

	// Read
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/setup-key/pikvm",
		Storage:   storage,
	}
	resp, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("read setup key config: %v", err)
	}
	if resp.Data["name_prefix"] != "openbao-pikvm" {
		t.Errorf("unexpected name_prefix: %v", resp.Data["name_prefix"])
	}
	if resp.Data["type"] != "reusable" {
		t.Errorf("unexpected type: %v", resp.Data["type"])
	}
	groups := resp.Data["auto_groups"].([]string)
	if len(groups) != 2 || groups[0] != "homelab" || groups[1] != "pikvm" {
		t.Errorf("unexpected auto_groups: %v", groups)
	}

	// Delete
	req = &logical.Request{
		Operation: logical.DeleteOperation,
		Path:      "config/setup-key/pikvm",
		Storage:   storage,
	}
	_, err = b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("delete: %v", err)
	}

	// Verify deleted
	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "config/setup-key/pikvm",
		Storage:   storage,
	}
	resp, _ = b.HandleRequest(ctx, req)
	if resp != nil {
		t.Error("expected nil after delete")
	}
}

func TestSetupKeyGeneration(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()
	server := setupMockNetBird(t)
	defer server.Close()

	writeRootConfig(t, b, storage, server.URL)

	req := &logical.Request{
		Operation: logical.CreateOperation,
		Path:      "config/setup-key/pikvm",
		Storage:   storage,
		Data: map[string]interface{}{
			"name_prefix": "openbao-pikvm",
			"type":        "reusable",
			"ephemeral":   false,
			"auto_groups": "homelab,pikvm",
			"usage_limit": 0,
			"ttl":         604800,
			"max_ttl":     2592000,
		},
	}
	b.HandleRequest(ctx, req)

	req = &logical.Request{
		Operation: logical.ReadOperation,
		Path:      "setup-key/pikvm",
		Storage:   storage,
	}
	resp, err := b.HandleRequest(ctx, req)
	if err != nil {
		t.Fatalf("generate setup key: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("expected valid response, got: %v", resp)
	}
	if resp.Data["key_id"] != "sk-id-001" {
		t.Errorf("unexpected key_id: %v", resp.Data["key_id"])
	}
	if resp.Data["setup_key"] != "generated-setup-key" {
		t.Errorf("unexpected setup_key: %v", resp.Data["setup_key"])
	}
	if resp.Data["expires_at"] != "2026-12-31T23:59:59Z" {
		t.Errorf("unexpected expires_at: %v", resp.Data["expires_at"])
	}
	if resp.Secret == nil {
		t.Fatal("expected leased response with Secret")
	}
	if resp.Secret.InternalData["key_id"] != "sk-id-001" {
		t.Errorf("unexpected internal key_id: %v", resp.Secret.InternalData["key_id"])
	}
}

// ── Two independent expiries (lease + NetBird expires_in) ────────────────────────────────
//
// Every credential is bounded twice on purpose. The lease gives early revocation but only while
// OpenBao is healthy and remembers it; NetBird's own expires_in holds even if OpenBao is gone.
// Before this existed the deployed engine issued no lease at all, so nothing was ever revoked
// and PATs accumulated — 22 of them, 11 still valid, the oldest from August.

// captureNetBird records the create request body so the vendor-side expiry can be asserted.
func captureNetBird(t *testing.T, got *map[string]interface{}, result interface{}) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Body != nil {
			_ = json.NewDecoder(r.Body).Decode(got)
		}
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(result)
	}))
}

func TestPATVendorExpiryComesFromMaxTTL(t *testing.T) {
	var got map[string]interface{}
	server := captureNetBird(t, &got, CreatePATResponse{
		PlainToken: "tok",
		PersonalAccessToken: struct {
			ID string `json:"id"`
		}{ID: "pat-1"},
	})
	defer server.Close()

	b, storage := getTestBackend(t)
	ctx := context.Background()
	writeRootConfig(t, b, storage, server.URL)

	b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/pat/r", Storage: storage,
		Data: map[string]interface{}{"user_id": "u", "ttl": 3600, "max_ttl": 86400},
	})

	resp, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.ReadOperation, Path: "pat/r", Storage: storage,
	})
	if err != nil {
		t.Fatalf("generate PAT: %v", err)
	}

	// Expiry 1: the OpenBao lease, at ttl.
	if resp.Secret == nil {
		t.Fatal("expiry 1 missing: no lease")
	}
	if resp.Secret.TTL != time.Hour {
		t.Errorf("lease TTL should be ttl (1h), got %v", resp.Secret.TTL)
	}
	// Expiry 2: NetBird's own, at MAX_TTL -- not ttl. Using ttl would kill the PAT upstream at
	// the first lease renewal while OpenBao still believed it was valid.
	if got["expires_in"] != float64(86400) {
		t.Errorf("expires_in should track max_ttl (86400), got %v", got["expires_in"])
	}
	if resp.Secret.InternalData["role"] != "r" {
		t.Errorf("role must be in InternalData for renewal: %v", resp.Secret.InternalData)
	}
}

func TestSetupKeyVendorExpiryComesFromMaxTTL(t *testing.T) {
	var got map[string]interface{}
	server := captureNetBird(t, &got, CreateSetupKeyResponse{ID: "sk-1", Key: "k", ExpiresAt: "x"})
	defer server.Close()

	b, storage := getTestBackend(t)
	ctx := context.Background()
	writeRootConfig(t, b, storage, server.URL)

	b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/setup-key/r", Storage: storage,
		Data: map[string]interface{}{"ttl": 3600, "max_ttl": 172800},
	})
	resp, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.ReadOperation, Path: "setup-key/r", Storage: storage,
	})
	if err != nil {
		t.Fatalf("generate setup key: %v", err)
	}
	if resp.Secret == nil {
		t.Fatal("expiry 1 missing: no lease")
	}
	if got["expires_in"] != float64(172800) {
		t.Errorf("expires_in should track max_ttl (172800), got %v", got["expires_in"])
	}
}

// Leases are the DEFAULT, so a role written without thinking about it still gets cleanup.
func TestRolesLeaseByDefault(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	for _, tc := range []struct {
		path string
		data map[string]interface{}
	}{
		{"config/pat/d", map[string]interface{}{"user_id": "u"}},
		{"config/proxy-token/d", map[string]interface{}{"proxy_name": "p"}},
		{"config/setup-key/d", map[string]interface{}{}},
	} {
		if _, err := b.HandleRequest(ctx, &logical.Request{
			Operation: logical.CreateOperation, Path: tc.path, Storage: storage, Data: tc.data,
		}); err != nil {
			t.Fatalf("write %s: %v", tc.path, err)
		}
		resp, err := b.HandleRequest(ctx, &logical.Request{
			Operation: logical.ReadOperation, Path: tc.path, Storage: storage,
		})
		if err != nil || resp == nil {
			t.Fatalf("read %s: %v", tc.path, err)
		}
		if resp.Data["manage_lease"] != true {
			t.Errorf("%s: manage_lease should default to true, got %v", tc.path, resp.Data["manage_lease"])
		}
		// The schema defaults must be applied too -- GetOk alone would leave these at zero,
		// minting an unleased, unbounded credential.
		if resp.Data["ttl"] == int64(0) || resp.Data["max_ttl"] == int64(0) {
			t.Errorf("%s: ttl/max_ttl defaults not applied: ttl=%v max_ttl=%v",
				tc.path, resp.Data["ttl"], resp.Data["max_ttl"])
		}
	}
}

// Opting out is explicit and returns no lease at all, for a consumer that cannot hold one
// (ESO revokes its own auth token after each read, which would cascade and destroy the PAT).
func TestUnleasedRoleReturnsNoLease(t *testing.T) {
	var got map[string]interface{}
	server := captureNetBird(t, &got, CreatePATResponse{
		PlainToken: "tok",
		PersonalAccessToken: struct {
			ID string `json:"id"`
		}{ID: "pat-1"},
	})
	defer server.Close()

	b, storage := getTestBackend(t)
	ctx := context.Background()
	writeRootConfig(t, b, storage, server.URL)

	b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/pat/eso", Storage: storage,
		Data: map[string]interface{}{"user_id": "u", "ttl": 3600, "max_ttl": 86400, "manage_lease": false},
	})
	resp, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.ReadOperation, Path: "pat/eso", Storage: storage,
	})
	if err != nil {
		t.Fatalf("generate PAT: %v", err)
	}
	if resp.Secret != nil {
		t.Fatal("manage_lease=false must return no lease")
	}
	if resp.Data["access_token"] != "tok" {
		t.Errorf("credential still has to be returned: %v", resp.Data)
	}
	// NetBird's expiry is then the ONLY bound, so it must still be set — and from TTL, not
	// max_ttl: nothing can renew an unleased credential, so max_ttl would merely double the
	// exposure of something that cannot be revoked.
	if got["expires_in"] != float64(3600) {
		t.Errorf("unleased vendor expiry should track ttl (3600), got %v", got["expires_in"])
	}
}

// Renewal extends the lease without touching NetBird: expires_in already covers max_ttl.
func TestRenewExtendsLeaseWithoutCallingNetBird(t *testing.T) {
	var calls int
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		calls++
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(CreatePATResponse{
			PlainToken: "tok",
			PersonalAccessToken: struct {
				ID string `json:"id"`
			}{ID: "pat-1"},
		})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	ctx := context.Background()
	writeRootConfig(t, b, storage, server.URL)
	b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/pat/r", Storage: storage,
		Data: map[string]interface{}{"user_id": "u", "ttl": 3600, "max_ttl": 86400},
	})
	minted, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.ReadOperation, Path: "pat/r", Storage: storage,
	})
	if err != nil {
		t.Fatalf("generate PAT: %v", err)
	}
	afterMint := calls

	resp, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.RenewOperation, Storage: storage, Secret: minted.Secret,
	})
	if err != nil {
		t.Fatalf("renew: %v", err)
	}
	if resp == nil || resp.Secret == nil {
		t.Fatal("renew returned no lease")
	}
	if resp.Secret.TTL != time.Hour {
		t.Errorf("renewed lease TTL should be the role ttl, got %v", resp.Secret.TTL)
	}
	if calls != afterMint {
		t.Errorf("renew must not call NetBird, made %d call(s)", calls-afterMint)
	}
}

func TestRenewRefusedWhenRoleDeleted(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_ = json.NewEncoder(w).Encode(CreatePATResponse{
			PlainToken: "tok",
			PersonalAccessToken: struct {
				ID string `json:"id"`
			}{ID: "pat-1"},
		})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	ctx := context.Background()
	writeRootConfig(t, b, storage, server.URL)
	b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/pat/doomed", Storage: storage,
		Data: map[string]interface{}{"user_id": "u", "ttl": 3600, "max_ttl": 86400},
	})
	minted, _ := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.ReadOperation, Path: "pat/doomed", Storage: storage,
	})
	b.HandleRequest(ctx, &logical.Request{
		Operation: logical.DeleteOperation, Path: "config/pat/doomed", Storage: storage,
	})

	if _, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.RenewOperation, Storage: storage, Secret: minted.Secret,
	}); err == nil {
		t.Fatal("expected renewal to be refused once the role is gone")
	}
}

// An unsupplied ttl whose default exceeds max_ttl is clamped, not rejected -- the operator
// never chose that default. A ttl they DID supply is rejected.
func TestUnsuppliedTTLClampsToMaxTTL(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	resp, err := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/pat/clamp", Storage: storage,
		Data: map[string]interface{}{"user_id": "u", "max_ttl": 3600},
	})
	if err != nil {
		t.Fatalf("write role: %v", err)
	}
	if resp != nil && resp.IsError() {
		t.Fatalf("unsupplied ttl should clamp, got: %v", resp.Error())
	}
	got, _ := b.HandleRequest(ctx, &logical.Request{
		Operation: logical.ReadOperation, Path: "config/pat/clamp", Storage: storage,
	})
	if got.Data["ttl"] != int64(3600) {
		t.Errorf("ttl should clamp to max_ttl, got %v", got.Data["ttl"])
	}

	resp, err = b.HandleRequest(ctx, &logical.Request{
		Operation: logical.CreateOperation, Path: "config/pat/explicit", Storage: storage,
		Data: map[string]interface{}{"user_id": "u", "ttl": 7200, "max_ttl": 3600},
	})
	if err != nil {
		t.Fatalf("write role: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Fatal("an explicitly supplied ttl above max_ttl must be rejected")
	}
}
