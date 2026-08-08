package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestCreatePAT(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Errorf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/api/users/user-123/tokens" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Token test-token" {
			t.Errorf("unexpected auth header: %s", r.Header.Get("Authorization"))
		}
		if r.Header.Get("Content-Type") != "application/json" {
			t.Errorf("unexpected content-type: %s", r.Header.Get("Content-Type"))
		}

		var req CreatePATRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Fatalf("decoding request: %v", err)
		}
		if req.Name != "openbao-test" {
			t.Errorf("unexpected name: %s", req.Name)
		}
		if req.ExpiresIn != 86400 {
			t.Errorf("unexpected expires_in: %d", req.ExpiresIn)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(CreatePATResponse{
			PlainToken: "pat-secret-value",
			PersonalAccessToken: struct {
				ID string `json:"id"`
			}{ID: "pat-id-123"},
		})
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "test-token", 5*time.Second)
	resp, err := client.CreatePAT("user-123", &CreatePATRequest{
		Name:      "openbao-test",
		ExpiresIn: 86400,
	})
	if err != nil {
		t.Fatalf("CreatePAT: %v", err)
	}
	if resp.PlainToken != "pat-secret-value" {
		t.Errorf("unexpected token: %s", resp.PlainToken)
	}
	if resp.PersonalAccessToken.ID != "pat-id-123" {
		t.Errorf("unexpected token id: %s", resp.PersonalAccessToken.ID)
	}
}

func TestDeletePAT(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			t.Errorf("expected DELETE, got %s", r.Method)
		}
		if r.URL.Path != "/api/users/user-123/tokens/pat-id-456" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Token test-token" {
			t.Errorf("unexpected auth header: %s", r.Header.Get("Authorization"))
		}
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "test-token", 5*time.Second)
	if err := client.DeletePAT("user-123", "pat-id-456"); err != nil {
		t.Fatalf("DeletePAT: %v", err)
	}
}

func TestCreateProxyToken(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Errorf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/api/reverse-proxies/proxy-tokens" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Token test-token" {
			t.Errorf("unexpected auth header: %s", r.Header.Get("Authorization"))
		}

		var req CreateProxyTokenRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Fatalf("decoding request: %v", err)
		}
		if req.Name != "secret-proxy" {
			t.Errorf("unexpected name: %s", req.Name)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(CreateProxyTokenResponse{
			ID:    "proxy-id-789",
			Token: "proxy-token-secret",
		})
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "test-token", 5*time.Second)
	resp, err := client.CreateProxyToken(&CreateProxyTokenRequest{
		Name: "secret-proxy",
	})
	if err != nil {
		t.Fatalf("CreateProxyToken: %v", err)
	}
	if resp.ID != "proxy-id-789" {
		t.Errorf("unexpected id: %s", resp.ID)
	}
	if resp.Token != "proxy-token-secret" {
		t.Errorf("unexpected token: %s", resp.Token)
	}
}

func TestDeleteProxyToken(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			t.Errorf("expected DELETE, got %s", r.Method)
		}
		if r.URL.Path != "/api/reverse-proxies/proxy-tokens/proxy-id-789" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "test-token", 5*time.Second)
	if err := client.DeleteProxyToken("proxy-id-789"); err != nil {
		t.Fatalf("DeleteProxyToken: %v", err)
	}
}

func TestCreateSetupKey(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Errorf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/api/setup-keys" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Token test-token" {
			t.Errorf("unexpected auth header: %s", r.Header.Get("Authorization"))
		}

		var req CreateSetupKeyRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Fatalf("decoding request: %v", err)
		}
		if req.Name != "openbao-pikvm" {
			t.Errorf("unexpected name: %s", req.Name)
		}
		if req.Type != "reusable" {
			t.Errorf("unexpected type: %s", req.Type)
		}
		if req.Ephemeral != false {
			t.Error("expected ephemeral=false")
		}
		if len(req.AutoGroups) != 2 || req.AutoGroups[0] != "homelab" {
			t.Errorf("unexpected auto_groups: %v", req.AutoGroups)
		}
		if req.ExpiresIn != 604800 {
			t.Errorf("unexpected expires_in: %d", req.ExpiresIn)
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(CreateSetupKeyResponse{
			ID:        "setup-key-id-abc",
			Key:       "setup-key-secret-value",
			ExpiresAt: "2026-01-01T00:00:00Z",
		})
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "test-token", 5*time.Second)
	resp, err := client.CreateSetupKey(&CreateSetupKeyRequest{
		Name:       "openbao-pikvm",
		Type:       "reusable",
		Ephemeral:  false,
		AutoGroups: []string{"homelab", "pikvm"},
		UsageLimit: 0,
		ExpiresIn:  604800,
	})
	if err != nil {
		t.Fatalf("CreateSetupKey: %v", err)
	}
	if resp.ID != "setup-key-id-abc" {
		t.Errorf("unexpected id: %s", resp.ID)
	}
	if resp.Key != "setup-key-secret-value" {
		t.Errorf("unexpected key: %s", resp.Key)
	}
	if resp.ExpiresAt != "2026-01-01T00:00:00Z" {
		t.Errorf("unexpected expires_at: %s", resp.ExpiresAt)
	}
}

func TestDeleteSetupKey(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			t.Errorf("expected DELETE, got %s", r.Method)
		}
		if r.URL.Path != "/api/setup-keys/setup-key-id-abc" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		w.WriteHeader(http.StatusNoContent)
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "test-token", 5*time.Second)
	if err := client.DeleteSetupKey("setup-key-id-abc"); err != nil {
		t.Fatalf("DeleteSetupKey: %v", err)
	}
}

func TestClientErrorHandling(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte(`{"message":"forbidden"}`))
	}))
	defer server.Close()

	client := NewNetBirdClient(server.URL, "bad-token", 5*time.Second)
	_, err := client.CreatePAT("user-123", &CreatePATRequest{Name: "test", ExpiresIn: 3600})
	if err == nil {
		t.Fatal("expected error for 403 response")
	}
}

func TestClientDefaultTimeout(t *testing.T) {
	client := NewNetBirdClient("http://localhost", "token", 0)
	if client.httpClient.Timeout != 30*time.Second {
		t.Errorf("expected 30s default timeout, got %v", client.httpClient.Timeout)
	}
}
