package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

// envelope writes a Cloudflare-shaped success response around an arbitrary result.
func envelope(w http.ResponseWriter, status int, result interface{}) {
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"errors":   []interface{}{},
		"messages": []interface{}{},
		"result":   result,
	})
}

func failEnvelope(w http.ResponseWriter, status int, code int, message string) {
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"errors":  []map[string]interface{}{{"code": code, "message": message}},
		"result":  nil,
	})
}

func TestCreateToken(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Errorf("expected POST, got %s", r.Method)
		}
		if r.URL.Path != "/user/tokens" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		// Cloudflare uses Bearer, unlike NetBird's `Token` scheme.
		if got := r.Header.Get("Authorization"); got != "Bearer parent-token" {
			t.Errorf("unexpected auth header: %s", got)
		}
		if got := r.Header.Get("Content-Type"); got != "application/json" {
			t.Errorf("unexpected content-type: %s", got)
		}

		var req CreateTokenRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			t.Fatalf("decoding request: %v", err)
		}
		if req.Name != "openbao-dns-edit" {
			t.Errorf("unexpected name: %s", req.Name)
		}
		if len(req.Policies) != 1 {
			t.Fatalf("expected 1 policy, got %d", len(req.Policies))
		}
		if req.Policies[0].Effect != "allow" {
			t.Errorf("unexpected effect: %s", req.Policies[0].Effect)
		}
		if got := req.Policies[0].Resources["com.cloudflare.api.account.zone.zone-1"]; got != "*" {
			t.Errorf("zone resource missing or wrong: %q", got)
		}

		envelope(w, http.StatusOK, CreateTokenResult{
			ID:        "token-id-1",
			Name:      req.Name,
			Value:     "cf-plaintext-value",
			Status:    "active",
			ExpiresOn: "2026-12-01T00:00:00Z",
		})
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	resp, err := client.CreateToken(&CreateTokenRequest{
		Name: "openbao-dns-edit",
		Policies: []TokenPolicy{{
			Effect:           "allow",
			Resources:        map[string]string{"com.cloudflare.api.account.zone.zone-1": "*"},
			PermissionGroups: []PermissionGroupRef{{ID: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}},
		}},
	})
	if err != nil {
		t.Fatalf("CreateToken: %v", err)
	}
	if resp.Value != "cf-plaintext-value" {
		t.Errorf("unexpected token value: %s", resp.Value)
	}
	if resp.ID != "token-id-1" {
		t.Errorf("unexpected token id: %s", resp.ID)
	}
}

// A 200 carrying success:false is the failure mode that cost a debug cycle on the live account
// (9109 on a token that looked fine). The client must treat the envelope, not the status, as
// authoritative.
func TestCreateTokenSuccessFalseOnHTTP200(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failEnvelope(w, http.StatusOK, 9109, "Invalid access token")
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "dead-token", ScopeUser, "", 5*time.Second)
	_, err := client.CreateToken(&CreateTokenRequest{Name: "x"})
	if err == nil {
		t.Fatal("expected an error for success:false, got nil")
	}
	// The numeric code must survive into the message — it is what distinguishes a dead parent
	// token from a permissions problem.
	if !strings.Contains(err.Error(), "9109") {
		t.Errorf("error should carry the Cloudflare error code, got: %v", err)
	}
}

func TestCreateTokenRejectsResponseWithoutValue(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		envelope(w, http.StatusOK, CreateTokenResult{ID: "token-id-2", Status: "active"})
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	if _, err := client.CreateToken(&CreateTokenRequest{Name: "x"}); err == nil {
		t.Fatal("expected an error when the response carries no token value")
	}
}

func TestCreateTokenNonJSONBody(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadGateway)
		_, _ = w.Write([]byte("<html>edge error</html>"))
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	_, err := client.CreateToken(&CreateTokenRequest{Name: "x"})
	if err == nil {
		t.Fatal("expected an error for a non-JSON body")
	}
	if !strings.Contains(err.Error(), "502") {
		t.Errorf("error should carry the HTTP status, got: %v", err)
	}
}

func TestDeleteToken(t *testing.T) {
	var called bool
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
		if r.Method != http.MethodDelete {
			t.Errorf("expected DELETE, got %s", r.Method)
		}
		if r.URL.Path != "/user/tokens/token-id-3" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		envelope(w, http.StatusOK, map[string]string{"id": "token-id-3"})
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	if err := client.DeleteToken("token-id-3"); err != nil {
		t.Fatalf("DeleteToken: %v", err)
	}
	if !called {
		t.Error("server was never called")
	}
}

// An already-gone token must revoke cleanly: OpenBao retries a failing revoke indefinitely, so
// a hard error here would leave the lease stuck forever.
func TestDeleteTokenTreatsMissingAsSuccess(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failEnvelope(w, http.StatusNotFound, 1001, "Token not found")
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	if err := client.DeleteToken("already-gone"); err != nil {
		t.Fatalf("expected a missing token to revoke cleanly, got: %v", err)
	}
}

func TestDeleteTokenPropagatesRealErrors(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failEnvelope(w, http.StatusForbidden, 9109, "Invalid access token")
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	if err := client.DeleteToken("token-id-4"); err == nil {
		t.Fatal("expected a real failure to propagate so the lease retries")
	}
}

func TestListPermissionGroups(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/user/tokens/permission_groups" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.Method != http.MethodGet {
			t.Errorf("expected GET, got %s", r.Method)
		}
		envelope(w, http.StatusOK, []PermissionGroup{
			{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"},
			{ID: "c8fed203ed3043cba015a93ad1616f1f", Name: "Zone Read"},
		})
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeUser, "", 5*time.Second)
	groups, err := client.ListPermissionGroups()
	if err != nil {
		t.Fatalf("ListPermissionGroups: %v", err)
	}
	if len(groups) != 2 {
		t.Fatalf("expected 2 groups, got %d", len(groups))
	}
	if groups[0].Name != "DNS Write" {
		t.Errorf("unexpected first group: %+v", groups[0])
	}
}

func TestNewCloudflareClientDefaultsAPIURL(t *testing.T) {
	client := NewCloudflareClient("", "t", ScopeUser, "", 0)
	if client.apiURL != DefaultAPIURL {
		t.Errorf("expected the default API URL, got %s", client.apiURL)
	}
	if client.httpClient.Timeout == 0 {
		t.Error("expected a non-zero default timeout")
	}
}

func TestNewCloudflareClientTrimsTrailingSlash(t *testing.T) {
	client := NewCloudflareClient("https://example.test/v4/", "t", ScopeUser, "", 0)
	if client.apiURL != "https://example.test/v4" {
		t.Errorf("trailing slash not trimmed: %s", client.apiURL)
	}
}

// ── Account-owned token scope ────────────────────────────────────────────────────────────
//
// Setting accountID must move EVERY call onto /accounts/<id>/tokens, including the
// permission-groups listing — the ids there differ from the user-scope ones, so resolving a name
// against the wrong endpoint would yield a token that is accepted at creation and denied in use.

func TestAccountOwnedTokenPaths(t *testing.T) {
	const acct = "f16eb73dbe80691d5126e9163aa638c6"
	seen := map[string]string{}
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		seen[r.Method] = r.URL.Path
		switch {
		case strings.HasSuffix(r.URL.Path, "/permission_groups"):
			envelope(w, http.StatusOK, []PermissionGroup{{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"}})
		case r.Method == http.MethodDelete:
			envelope(w, http.StatusOK, map[string]string{"id": "t1"})
		default:
			envelope(w, http.StatusOK, CreateTokenResult{ID: "t1", Value: "v"})
		}
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "parent-token", ScopeAccount, acct, 5*time.Second)

	if _, err := client.CreateToken(&CreateTokenRequest{Name: "x"}); err != nil {
		t.Fatalf("CreateToken: %v", err)
	}
	if want := "/accounts/" + acct + "/tokens"; seen[http.MethodPost] != want {
		t.Errorf("create used %q, want %q", seen[http.MethodPost], want)
	}

	if _, err := client.ListPermissionGroups(); err != nil {
		t.Fatalf("ListPermissionGroups: %v", err)
	}
	if want := "/accounts/" + acct + "/tokens/permission_groups"; seen[http.MethodGet] != want {
		t.Errorf("permission groups used %q, want %q", seen[http.MethodGet], want)
	}

	if err := client.DeleteToken("t1"); err != nil {
		t.Fatalf("DeleteToken: %v", err)
	}
	if want := "/accounts/" + acct + "/tokens/t1"; seen[http.MethodDelete] != want {
		t.Errorf("delete used %q, want %q", seen[http.MethodDelete], want)
	}
}

// Leaving account_id unset while holding an account-scoped parent token is THE likely
// misconfiguration, and Cloudflare's own message gives no clue the fix is a config field here.
func TestScopeHintWhenAccountIDMissing(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failEnvelope(w, http.StatusForbidden, 9109, "Valid user-level authentication not found")
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "account-scoped-parent", ScopeUser, "", 5*time.Second)
	_, err := client.CreateToken(&CreateTokenRequest{Name: "x"})
	if err == nil {
		t.Fatal("expected an error")
	}
	if !strings.Contains(err.Error(), "account_id") {
		t.Errorf("error should hint at the missing account_id, got: %v", err)
	}
}

// ...and must NOT fire when account_id is already set, where the same message means something else.
func TestNoScopeHintWhenAccountIDPresent(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failEnvelope(w, http.StatusForbidden, 9109, "Valid user-level authentication not found")
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "p", ScopeAccount, "acct-1", 5*time.Second)
	_, err := client.CreateToken(&CreateTokenRequest{Name: "x"})
	if err == nil {
		t.Fatal("expected an error")
	}
	if strings.Contains(err.Error(), "account_id") {
		t.Errorf("hint must not fire when account_id is set, got: %v", err)
	}
}
