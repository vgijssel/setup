package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
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

func write(t *testing.T, b logical.Backend, storage logical.Storage, path string, data map[string]interface{}) *logical.Response {
	t.Helper()
	resp, err := b.HandleRequest(context.Background(), &logical.Request{
		Operation: logical.UpdateOperation,
		Path:      path,
		Storage:   storage,
		Data:      data,
	})
	if err != nil {
		t.Fatalf("write %s: %v", path, err)
	}
	return resp
}

func read(t *testing.T, b logical.Backend, storage logical.Storage, path string) (*logical.Response, error) {
	t.Helper()
	return b.HandleRequest(context.Background(), &logical.Request{
		Operation: logical.ReadOperation,
		Path:      path,
		Storage:   storage,
	})
}

func TestConfigRootWriteAndRead(t *testing.T) {
	b, storage := getTestBackend(t)

	if resp := write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser),
		"api_url":     "https://api.example.test/client/v4",
		"api_token":   "parent-token-123",
	}); resp != nil && resp.IsError() {
		t.Fatalf("write config: %s", resp.Error())
	}

	resp, err := read(t, b, storage, "config/root")
	if err != nil {
		t.Fatalf("read config: %v", err)
	}
	if resp == nil {
		t.Fatal("expected a config response")
	}
	if resp.Data["api_url"] != "https://api.example.test/client/v4" {
		t.Errorf("unexpected api_url: %v", resp.Data["api_url"])
	}
	// A read must never disclose the parent token. Note it is NOT a privilege ceiling —
	// verified live that Cloudflare lets a child hold permissions the parent lacks — which makes
	// not leaking it more important, not less.
	if _, present := resp.Data["api_token"]; present {
		t.Error("read must not return the parent api_token")
	}
}

func TestConfigRootDefaultsAPIURL(t *testing.T) {
	b, storage := getTestBackend(t)

	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_token": "parent-token-123"})

	resp, err := read(t, b, storage, "config/root")
	if err != nil {
		t.Fatalf("read config: %v", err)
	}
	if resp.Data["api_url"] != DefaultAPIURL {
		t.Errorf("expected the default API URL, got %v", resp.Data["api_url"])
	}
}

func TestConfigRootRequiresToken(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": DefaultAPIURL})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error when api_token is missing")
	}
}

func TestConfigTokenRoleWriteAndRead(t *testing.T) {
	b, storage := getTestBackend(t)

	if resp := write(t, b, storage, "config/token/dns-edit", map[string]interface{}{
		"permissions": []string{"DNS Write", "Zone Read"},
		"zone_ids":    []string{"zone-a", "zone-b"},
		"ttl":         3600,
		"max_ttl":     7200,
	}); resp != nil && resp.IsError() {
		t.Fatalf("write role: %s", resp.Error())
	}

	resp, err := read(t, b, storage, "config/token/dns-edit")
	if err != nil {
		t.Fatalf("read role: %v", err)
	}
	if resp == nil {
		t.Fatal("expected a role response")
	}
	if resp.Data["ttl"] != int64(3600) {
		t.Errorf("unexpected ttl: %v", resp.Data["ttl"])
	}
	if resp.Data["token_name_prefix"] != "openbao" {
		t.Errorf("expected the default prefix, got %v", resp.Data["token_name_prefix"])
	}
	zones, _ := resp.Data["zone_ids"].([]string)
	if len(zones) != 2 {
		t.Errorf("unexpected zone_ids: %v", resp.Data["zone_ids"])
	}
}

// Both halves of a policy are validated at role-write time. A role missing either one mints a
// token Cloudflare accepts but that grants nothing, which otherwise surfaces much later as an
// unexplained 403 inside whatever consumes it.
func TestConfigTokenRoleRequiresPermissions(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/token/bad", map[string]interface{}{
		"zone_ids": []string{"zone-a"},
	})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error when permissions is empty")
	}
}

func TestConfigTokenRoleRequiresResources(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/token/bad", map[string]interface{}{
		"permissions": []string{"DNS Write"},
	})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error when neither zone_ids nor account_ids is set")
	}
}

// Only checked for a LEASED role: ttl is the lease TTL, so with manage_lease=false nothing
// consumes it and rejecting the role would be rejecting a field that has no effect.
func TestConfigTokenRoleRejectsTTLAboveMaxTTLWhenLeased(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/token/bad", map[string]interface{}{
		"permissions":  []string{"DNS Write"},
		"zone_ids":     []string{"zone-a"},
		"ttl":          7200,
		"max_ttl":      3600,
		"manage_lease": true,
	})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error when ttl exceeds max_ttl on a leased role")
	}
}

func TestConfigTokenRoleIgnoresTTLWhenUnleased(t *testing.T) {
	b, storage := getTestBackend(t)

	// ttl defaults to 30d, far above this max_ttl. An unleased role must still be accepted.
	resp := write(t, b, storage, "config/token/eso", map[string]interface{}{
		"permissions": []string{"DNS Write"},
		"zone_ids":    []string{"zone-a"},
		"max_ttl":     "48h",
	})
	if resp != nil && resp.IsError() {
		t.Fatalf("unleased role should ignore ttl, got: %v", resp.Error())
	}
}

func TestTokenReadUnknownRole(t *testing.T) {
	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_token": "parent"})

	resp, err := read(t, b, storage, "token/nope")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error response for an unknown role")
	}
}

// End-to-end mint against a fake Cloudflare: name resolution, resource map, expires_on from
// max_ttl, and the lease carrying the role's TTLs.
func TestTokenReadMintsAndLeases(t *testing.T) {
	var gotReq CreateTokenRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/user/tokens/permission_groups":
			envelope(w, http.StatusOK, []PermissionGroup{
				{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"},
			})
		case "/user/tokens":
			if err := json.NewDecoder(r.Body).Decode(&gotReq); err != nil {
				t.Fatalf("decoding create request: %v", err)
			}
			envelope(w, http.StatusOK, CreateTokenResult{
				ID:        "minted-1",
				Name:      gotReq.Name,
				Value:     "minted-value",
				Status:    "active",
				ExpiresOn: gotReq.ExpiresOn,
			})
		default:
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser),
		"api_url":     server.URL,
		"api_token":   "parent",
	})
	write(t, b, storage, "config/token/dns-edit", map[string]interface{}{
		"permissions":  []string{"DNS Write", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":     []string{"zone-a"},
		"account_ids":  []string{"acct-1"},
		"allowed_ips":  []string{"100.65.0.0/16"},
		"ttl":          3600,
		"max_ttl":      7200,
		"manage_lease": true,
	})

	resp, err := read(t, b, storage, "token/dns-edit")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("unexpected mint failure: %v", resp)
	}

	if resp.Data["api_token"] != "minted-value" {
		t.Errorf("unexpected api_token: %v", resp.Data["api_token"])
	}
	if resp.Data["token_id"] != "minted-1" {
		t.Errorf("unexpected token_id: %v", resp.Data["token_id"])
	}
	if resp.Secret == nil {
		t.Fatal("expected a lease")
	}
	if resp.Secret.TTL != time.Hour {
		t.Errorf("unexpected lease TTL: %v", resp.Secret.TTL)
	}
	if resp.Secret.MaxTTL != 2*time.Hour {
		t.Errorf("unexpected lease MaxTTL: %v", resp.Secret.MaxTTL)
	}
	if resp.Secret.InternalData["token_id"] != "minted-1" {
		t.Errorf("token_id must be in InternalData so revoke can find it: %v", resp.Secret.InternalData)
	}

	// A name was resolved to its id, and a raw id passed through untouched.
	if len(gotReq.Policies) != 1 || len(gotReq.Policies[0].PermissionGroups) != 2 {
		t.Fatalf("unexpected policies: %+v", gotReq.Policies)
	}
	ids := map[string]bool{}
	for _, g := range gotReq.Policies[0].PermissionGroups {
		ids[g.ID] = true
	}
	if !ids["4755a26eedb94da69e1066d98aa820be"] || !ids["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"] {
		t.Errorf("permission groups not resolved as expected: %+v", gotReq.Policies[0].PermissionGroups)
	}

	// Zone and account resources both present, in Cloudflare's key form.
	res := gotReq.Policies[0].Resources
	if res["com.cloudflare.api.account.zone.zone-a"] != "*" {
		t.Errorf("zone resource missing: %v", res)
	}
	if res["com.cloudflare.api.account.acct-1"] != "*" {
		t.Errorf("account resource missing: %v", res)
	}

	// expires_on comes from MAX_TTL (2h), not TTL (1h) — that is what makes renewal within
	// max_ttl safe without a Cloudflare-side update call.
	expires, err := time.Parse(time.RFC3339, gotReq.ExpiresOn)
	if err != nil {
		t.Fatalf("expires_on is not RFC3339: %q (%v)", gotReq.ExpiresOn, err)
	}
	until := time.Until(expires)
	if until < 110*time.Minute || until > 125*time.Minute {
		t.Errorf("expires_on should track max_ttl (~2h), got %v", until)
	}

	if gotReq.Condition == nil || gotReq.Condition.RequestIP == nil ||
		len(gotReq.Condition.RequestIP.In) != 1 || gotReq.Condition.RequestIP.In[0] != "100.65.0.0/16" {
		t.Errorf("allowed_ips not carried into the condition: %+v", gotReq.Condition)
	}
}

func TestTokenReadOmitsExpiryWhenMaxTTLZero(t *testing.T) {
	var gotReq CreateTokenRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/user/tokens" {
			_ = json.NewDecoder(r.Body).Decode(&gotReq)
			envelope(w, http.StatusOK, CreateTokenResult{ID: "m", Value: "v"})
			return
		}
		envelope(w, http.StatusOK, []PermissionGroup{})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": server.URL, "api_token": "p"})
	write(t, b, storage, "config/token/forever", map[string]interface{}{
		"permissions":  []string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":     []string{"zone-a"},
		"ttl":          60,
		"max_ttl":      0,
		"manage_lease": true,
	})

	if _, err := read(t, b, storage, "token/forever"); err != nil {
		t.Fatalf("read token: %v", err)
	}
	if gotReq.ExpiresOn != "" {
		t.Errorf("max_ttl 0 must mint a non-expiring token, got expires_on=%q", gotReq.ExpiresOn)
	}
}

func TestTokenReadUnresolvablePermissionName(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		envelope(w, http.StatusOK, []PermissionGroup{{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"}})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": server.URL, "api_token": "p"})
	write(t, b, storage, "config/token/typo", map[string]interface{}{
		"permissions": []string{"DNS Edit"}, // not a real group name — "DNS Write" is
		"zone_ids":    []string{"zone-a"},
	})

	resp, err := read(t, b, storage, "token/typo")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	// Must be an error RESPONSE, not a Go error: a Go error is a bodiless HTTP 500 and the
	// reason never reaches `bao read` or an ExternalSecret's status.
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error response for an unresolvable permission group name")
	}
	if !strings.Contains(resp.Error().Error(), "DNS Edit") {
		t.Errorf("error should name the unresolved group, got: %v", resp.Error())
	}
}

func TestTokenReadWithoutRootConfig(t *testing.T) {
	b, storage := getTestBackend(t)
	write(t, b, storage, "config/token/dns-edit", map[string]interface{}{
		"permissions": []string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":    []string{"zone-a"},
	})

	resp, err := read(t, b, storage, "token/dns-edit")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error response when config/root is unset")
	}
	if !strings.Contains(resp.Error().Error(), "config/root") {
		t.Errorf("error should say config/root is unset, got: %v", resp.Error())
	}
}

// A dead or revoked PARENT token must surface Cloudflare's code to the caller. This is the
// failure that previously showed up only as a 9109 inside an external-dns crash loop.
func TestTokenReadSurfacesCloudflareErrorCode(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		failEnvelope(w, http.StatusForbidden, 9109, "Invalid access token")
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": server.URL, "api_token": "dead"})
	write(t, b, storage, "config/token/dns-edit", map[string]interface{}{
		"permissions": []string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":    []string{"zone-a"},
	})

	resp, err := read(t, b, storage, "token/dns-edit")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error response for a dead parent token")
	}
	if !strings.Contains(resp.Error().Error(), "9109") {
		t.Errorf("error response should carry the Cloudflare code, got: %v", resp.Error())
	}
}

func TestResolvePermissionGroupsMatchesNamesCaseInsensitively(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		envelope(w, http.StatusOK, []PermissionGroup{{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"}})
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "p", ScopeUser, "", 5*time.Second)
	refs, err := resolvePermissionGroups(client, []string{"dns write"})
	if err != nil {
		t.Fatalf("resolvePermissionGroups: %v", err)
	}
	if len(refs) != 1 || refs[0].ID != "4755a26eedb94da69e1066d98aa820be" {
		t.Errorf("unexpected refs: %+v", refs)
	}
}

// The id regex is lowercase-hex only, so an UPPERCASE 32-hex string is treated as a name and
// goes to lookup rather than being passed through as an id. Asserted because the failure mode
// of the other choice is a token minted against a permission group that does not exist.
func TestResolvePermissionGroupsDoesNotTreatUppercaseHexAsID(t *testing.T) {
	var listed bool
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		listed = true
		envelope(w, http.StatusOK, []PermissionGroup{})
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "p", ScopeUser, "", 5*time.Second)
	if _, err := resolvePermissionGroups(client, []string{"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}); err == nil {
		t.Fatal("expected an unresolved-name error")
	}
	if !listed {
		t.Error("uppercase hex should have fallen through to a name lookup")
	}
}

// No lookup call at all when every entry is already an id — the common steady-state path.
func TestResolvePermissionGroupsSkipsLookupForPureIDs(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t.Error("permission groups should not be listed when all entries are ids")
	}))
	defer server.Close()

	client := NewCloudflareClient(server.URL, "p", ScopeUser, "", 5*time.Second)
	refs, err := resolvePermissionGroups(client, []string{"4755a26eedb94da69e1066d98aa820be"})
	if err != nil {
		t.Fatalf("resolvePermissionGroups: %v", err)
	}
	if len(refs) != 1 || refs[0].ID != "4755a26eedb94da69e1066d98aa820be" {
		t.Errorf("unexpected refs: %+v", refs)
	}
}

// Full mint through the ACCOUNT-owned path — the one validated against the live account. Uses
// the real blueora.ng zone id and the real DNS Write permission-group id so the request body
// here is byte-for-byte what was proven to work.
func TestTokenReadMintsViaAccountPath(t *testing.T) {
	const acct = "f16eb73dbe80691d5126e9163aa638c6"
	const zone = "b763644969bac446062ef24eef5565f0"
	var gotReq CreateTokenRequest
	var createPath string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/permission_groups") {
			envelope(w, http.StatusOK, []PermissionGroup{
				{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"},
			})
			return
		}
		createPath = r.URL.Path
		if err := json.NewDecoder(r.Body).Decode(&gotReq); err != nil {
			t.Fatalf("decoding create request: %v", err)
		}
		envelope(w, http.StatusOK, CreateTokenResult{ID: "acct-minted", Value: "acct-value"})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeAccount),
		"api_url":     server.URL,
		"api_token":   "parent",
		"account_id":  acct,
	})
	write(t, b, storage, "config/token/dns-blueora", map[string]interface{}{
		"permissions": []string{"DNS Write"},
		"zone_ids":    []string{zone},
		"ttl":         "720h",
		"max_ttl":     "1440h",
	})

	resp, err := read(t, b, storage, "token/dns-blueora")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("unexpected mint failure: %v", resp)
	}
	if resp.Data["api_token"] != "acct-value" {
		t.Errorf("unexpected api_token: %v", resp.Data["api_token"])
	}
	if want := "/accounts/" + acct + "/tokens"; createPath != want {
		t.Errorf("minted via %q, want %q", createPath, want)
	}

	// A FLAT map of specific zone ids. Account-owned tokens REJECT a flat wildcard
	// (`...zone.*`) with "Must specify a zone for account owned tokens" — specific ids are fine,
	// and specific ids are all this chart ever emits.
	res := gotReq.Policies[0].Resources
	if res["com.cloudflare.api.account.zone."+zone] != "*" {
		t.Errorf("zone resource missing: %v", res)
	}
	for k := range res {
		if strings.HasSuffix(k, ".*") {
			t.Errorf("a flat wildcard resource key is rejected by the account API: %q", k)
		}
	}
}

// ── Explicit token_scope contract ────────────────────────────────────────────────────────
//
// The scope is STATED, never inferred from whether account_id happens to be set. Each rejection
// below would otherwise surface as a Cloudflare authentication error naming neither the field
// nor the token permission at fault.

func TestConfigRootRequiresTokenScope(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/root", map[string]interface{}{"api_token": "p"})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error when token_scope is missing")
	}
	if !strings.Contains(resp.Error().Error(), "token_scope is required") {
		t.Errorf("unexpected error: %v", resp.Error())
	}
}

func TestConfigRootRejectsUnknownTokenScope(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": "acount", // typo
		"api_token":   "p",
	})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error for an unknown token_scope")
	}
}

func TestConfigRootAccountScopeRequiresAccountID(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeAccount),
		"api_token":   "p",
	})
	if resp == nil || !resp.IsError() {
		t.Fatal(`expected an error when token_scope="account" has no account_id`)
	}
	if !strings.Contains(resp.Error().Error(), "account_id is required") {
		t.Errorf("unexpected error: %v", resp.Error())
	}
}

// Rejected rather than ignored: an account_id under user scope is applied nowhere, so accepting
// it would advertise a restriction that does not exist.
func TestConfigRootUserScopeRejectsAccountID(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser),
		"api_token":   "p",
		"account_id":  "acct-1",
	})
	if resp == nil || !resp.IsError() {
		t.Fatal(`expected an error when token_scope="user" sets account_id`)
	}
	if !strings.Contains(resp.Error().Error(), "must be empty") {
		t.Errorf("unexpected error: %v", resp.Error())
	}
}

// A read shows the scope AND the resolved endpoint, so which parent permission is required is
// answerable without reading the source.
func TestConfigRootReadReportsResolvedEndpoint(t *testing.T) {
	b, storage := getTestBackend(t)

	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_token": "p",
	})
	resp, _ := read(t, b, storage, "config/root")
	if resp.Data["token_scope"] != "user" {
		t.Errorf("unexpected token_scope: %v", resp.Data["token_scope"])
	}
	if resp.Data["tokens_endpoint"] != DefaultAPIURL+"/user/tokens" {
		t.Errorf("unexpected tokens_endpoint: %v", resp.Data["tokens_endpoint"])
	}

	b2, storage2 := getTestBackend(t)
	write(t, b2, storage2, "config/root", map[string]interface{}{
		"token_scope": string(ScopeAccount), "api_token": "p", "account_id": "acct-1",
	})
	resp, _ = read(t, b2, storage2, "config/root")
	if resp.Data["token_scope"] != "account" {
		t.Errorf("unexpected token_scope: %v", resp.Data["token_scope"])
	}
	if resp.Data["tokens_endpoint"] != DefaultAPIURL+"/accounts/acct-1/tokens" {
		t.Errorf("unexpected tokens_endpoint: %v", resp.Data["tokens_endpoint"])
	}
}

// The multi-account property: ONE user-scoped mount mints for zones in different accounts,
// because a role names zones by globally-unique zone id and never names an account. This is the
// reason user scope exists in this plugin.
//
// The two ids below are the real ones, and they are the point: blueora.ng belongs to
// "Maarten@vgijssel.nl's Account" and vgijssel.nl to "Piet@vgijssel.nl's Account". Verified live
// that a token minted from this exact role wrote and deleted an _acme-challenge TXT in both.
func TestUserScopeMintsForZonesInDifferentAccounts(t *testing.T) {
	const zoneBlueora = "b763644969bac446062ef24eef5565f0"  // Maarten@vgijssel.nl's Account
	const zoneVgijssel = "8e5a9db0a62108e5fff87072dbb939d0" // Piet@vgijssel.nl's Account
	var gotReq CreateTokenRequest
	var createPath string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/permission_groups") {
			envelope(w, http.StatusOK, []PermissionGroup{{ID: "4755a26eedb94da69e1066d98aa820be", Name: "DNS Write"}})
			return
		}
		createPath = r.URL.Path
		_ = json.NewDecoder(r.Body).Decode(&gotReq)
		envelope(w, http.StatusOK, CreateTokenResult{ID: "m", Value: "v"})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": server.URL, "api_token": "user-parent",
	})
	write(t, b, storage, "config/token/dns-both", map[string]interface{}{
		"permissions": []string{"DNS Write"},
		"zone_ids":    []string{zoneBlueora, zoneVgijssel},
	})

	resp, err := read(t, b, storage, "token/dns-both")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("unexpected mint failure: %v", resp)
	}
	if createPath != "/user/tokens" {
		t.Errorf("user scope must mint at /user/tokens, got %q", createPath)
	}

	res := gotReq.Policies[0].Resources
	if res["com.cloudflare.api.account.zone."+zoneBlueora] != "*" {
		t.Errorf("blueora zone missing: %v", res)
	}
	if res["com.cloudflare.api.account.zone."+zoneVgijssel] != "*" {
		t.Errorf("vgijssel zone missing: %v", res)
	}
	// No account is named anywhere — that is what makes cross-account work.
	for k := range res {
		if !strings.HasPrefix(k, "com.cloudflare.api.account.zone.") {
			t.Errorf("user-scope policy should name only zones, found %q", k)
		}
	}
}

// A config stored BEFORE token_scope existed decodes to an empty scope. It must be rejected at
// USE time, not silently defaulted to /user/tokens — found by live testing, where exactly such a
// stale entry reported `tokens_endpoint: .../user/tokens` while holding an account id.
func TestStaleConfigWithoutTokenScopeIsRejectedAtUse(t *testing.T) {
	b, storage := getTestBackend(t)
	ctx := context.Background()

	// Write the pre-field shape straight to storage, bypassing the write-path validation.
	entry, err := logical.StorageEntryJSON("config/root", &configRoot{
		APIURL:    DefaultAPIURL,
		APIToken:  "legacy-parent",
		AccountID: "acct-1",
	})
	if err != nil {
		t.Fatalf("building entry: %v", err)
	}
	if err := storage.Put(ctx, entry); err != nil {
		t.Fatalf("seeding storage: %v", err)
	}

	write(t, b, storage, "config/token/r", map[string]interface{}{
		"permissions": []string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":    []string{"zone-a"},
	})

	resp, err := read(t, b, storage, "token/r")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || !resp.IsError() {
		t.Fatal("a stale config with no token_scope must refuse to mint, not pick an endpoint")
	}
	if !strings.Contains(resp.Error().Error(), "token_scope is required") {
		t.Errorf("unexpected error: %v", resp.Error())
	}

	// And a read must not advertise an endpoint it will never call.
	cfg, _ := read(t, b, storage, "config/root")
	if cfg.Data["tokens_endpoint"] == DefaultAPIURL+"/user/tokens" {
		t.Error("read must not report a working endpoint for an unusable config")
	}
}

// ── manage_lease ─────────────────────────────────────────────────────────────────────────
//
// The default (false) returns NO lease. This is the single most important behaviour for the
// ExternalSecret consumers: an OpenBao secret lease belongs to the auth token that created it,
// and ESO revokes its own Vault token right after reading, so a leased credential is deleted
// seconds after it is handed over. Measured live before this was fixed — a Secret synced
// successfully and its token answered 9109 twenty seconds later.

func TestMintWithoutLeaseByDefault(t *testing.T) {
	var gotReq CreateTokenRequest
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/permission_groups") {
			envelope(w, http.StatusOK, []PermissionGroup{})
			return
		}
		_ = json.NewDecoder(r.Body).Decode(&gotReq)
		envelope(w, http.StatusOK, CreateTokenResult{ID: "m", Value: "v", ExpiresOn: gotReq.ExpiresOn})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": server.URL, "api_token": "p",
	})
	write(t, b, storage, "config/token/eso", map[string]interface{}{
		"permissions": []string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":    []string{"zone-a"},
		"max_ttl":     "48h",
	})

	resp, err := read(t, b, storage, "token/eso")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp == nil || resp.IsError() {
		t.Fatalf("unexpected mint failure: %v", resp)
	}
	if resp.Secret != nil {
		t.Fatal("default must return NO lease; a lease dies with the caller's auth token")
	}
	if resp.Data["api_token"] != "v" {
		t.Errorf("unexpected api_token: %v", resp.Data["api_token"])
	}

	// Cloudflare-side expiry is still set — it is now the ONLY thing bounding the token's life.
	expires, err := time.Parse(time.RFC3339, gotReq.ExpiresOn)
	if err != nil {
		t.Fatalf("unleased token must still carry expires_on, got %q (%v)", gotReq.ExpiresOn, err)
	}
	if until := time.Until(expires); until < 47*time.Hour || until > 49*time.Hour {
		t.Errorf("expires_on should track max_ttl (48h), got %v", until)
	}
}

// An unleased role with no expiry would mint credentials that live forever with nothing tracking
// them, so the combination is refused rather than silently leaked.
func TestUnleasedRoleRequiresMaxTTL(t *testing.T) {
	b, storage := getTestBackend(t)

	resp := write(t, b, storage, "config/token/leaky", map[string]interface{}{
		"permissions": []string{"DNS Write"},
		"zone_ids":    []string{"zone-a"},
		"max_ttl":     0,
	})
	if resp == nil || !resp.IsError() {
		t.Fatal("expected an error for manage_lease=false with max_ttl=0")
	}
	if !strings.Contains(resp.Error().Error(), "max_ttl must be greater than 0") {
		t.Errorf("unexpected error: %v", resp.Error())
	}
}

func TestManageLeaseTrueStillLeases(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/permission_groups") {
			envelope(w, http.StatusOK, []PermissionGroup{})
			return
		}
		envelope(w, http.StatusOK, CreateTokenResult{ID: "m", Value: "v"})
	}))
	defer server.Close()

	b, storage := getTestBackend(t)
	write(t, b, storage, "config/root", map[string]interface{}{
		"token_scope": string(ScopeUser), "api_url": server.URL, "api_token": "p",
	})
	write(t, b, storage, "config/token/cli", map[string]interface{}{
		"permissions":  []string{"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
		"zone_ids":     []string{"zone-a"},
		"ttl":          "1h",
		"max_ttl":      "2h",
		"manage_lease": true,
	})

	resp, err := read(t, b, storage, "token/cli")
	if err != nil {
		t.Fatalf("read token: %v", err)
	}
	if resp.Secret == nil {
		t.Fatal("manage_lease=true must return a lease")
	}
	if resp.Secret.TTL != time.Hour {
		t.Errorf("unexpected lease TTL: %v", resp.Secret.TTL)
	}
	if resp.Secret.InternalData["token_id"] != "m" {
		t.Errorf("token_id must be in InternalData so revoke can find it: %v", resp.Secret.InternalData)
	}
}

func TestRoleReportsManageLease(t *testing.T) {
	b, storage := getTestBackend(t)
	write(t, b, storage, "config/token/r", map[string]interface{}{
		"permissions": []string{"DNS Write"}, "zone_ids": []string{"z"}, "max_ttl": "48h",
	})
	resp, _ := read(t, b, storage, "config/token/r")
	if resp.Data["manage_lease"] != false {
		t.Errorf("manage_lease should default to false, got %v", resp.Data["manage_lease"])
	}
}
