package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// DefaultAPIURL is Cloudflare's v4 API root. Overridable via config/root so tests (and a
// future enterprise/gateway endpoint) can point elsewhere.
const DefaultAPIURL = "https://api.cloudflare.com/client/v4"

// TokenScope names which of Cloudflare's two token APIs the parent credential may use. It is
// configured EXPLICITLY (config/root.token_scope) rather than inferred from whether an account
// id happens to be set: the two are not interchangeable, picking the wrong one fails with an
// authentication error that names neither, and "I forgot a field" should not silently change
// which API is called.
//
//	ScopeUser     /user/tokens            parent needs `User API Tokens Edit`
//	ScopeAccount  /accounts/<id>/tokens   parent needs `Account API Tokens Write`
//
// WHICH TO USE: a user token can scope a minted token to zones in ANY account its owner belongs
// to, so one mount covers several accounts. An account token is confined to its own account, so
// managing N accounts that way needs N mounts.
//
// BOTH SCOPES ARE VERIFIED LIVE. User scope: one mount minted a token covering `blueora.ng` and
// `vgijssel.nl`, which sit in two DIFFERENT Cloudflare accounts, and that token created, resolved
// and deleted an `_acme-challenge` TXT record in each. Account scope: same lifecycle within one
// account. A parent holding only `Account API Tokens Write` gets `9109 Valid user-level
// authentication not found` on every `/user/tokens` call, including the permission-groups listing.
//
// Permission-group IDS DIFFER between the two scopes — measured 413 groups in user scope vs 407
// in account scope on the same login — which is why name resolution reads the permission_groups
// endpoint under this same prefix rather than a fixed one.
//
// Token prefixes make the scope visible at a glance: `cfut_` for a user token, `cfat_` for an
// account token. Useful when a credential ends up in the wrong field.
type TokenScope string

const (
	ScopeUser    TokenScope = "user"
	ScopeAccount TokenScope = "account"
)

func (s TokenScope) Valid() bool {
	return s == ScopeUser || s == ScopeAccount
}

type CloudflareClient struct {
	apiURL string
	token  string
	scope  TokenScope
	// Only meaningful for ScopeAccount: which account owns the minted tokens.
	accountID  string
	httpClient *http.Client
}

func NewCloudflareClient(apiURL, token string, scope TokenScope, accountID string, timeout time.Duration) *CloudflareClient {
	if apiURL == "" {
		apiURL = DefaultAPIURL
	}
	if timeout == 0 {
		timeout = 30 * time.Second
	}
	return &CloudflareClient{
		apiURL:    strings.TrimRight(apiURL, "/"),
		token:     token,
		scope:     scope,
		accountID: accountID,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

// tokensPath resolves the base path for the configured scope.
//
// ScopeAccount without an accountID is rejected when config/root is written, so it cannot be
// reached here; the fallback to /user/tokens would otherwise be a silent scope change.
func (c *CloudflareClient) tokensPath() string {
	if c.scope == ScopeAccount && c.accountID != "" {
		return c.apiURL + "/accounts/" + url.PathEscape(c.accountID) + "/tokens"
	}
	return c.apiURL + "/user/tokens"
}

// ── Wire types ───────────────────────────────────────────────────────────────────────────

// PermissionGroupRef is how a policy names a permission group. Only `id` is sent: Cloudflare
// documents the human name as cosmetic and subject to change, so the id is the contract.
type PermissionGroupRef struct {
	ID string `json:"id"`
}

// TokenPolicy grants `permission_groups` over `resources`.
//
// `resources` is a map whose KEYS are Cloudflare resource identifiers, e.g.
// `com.cloudflare.api.account.zone.<zone_id>` or `com.cloudflare.api.account.<account_id>`,
// and whose values are `"*"`. It is typed `map[string]string` rather than a struct because the
// keys are data, not schema.
type TokenPolicy struct {
	Effect           string               `json:"effect"`
	Resources        map[string]string    `json:"resources"`
	PermissionGroups []PermissionGroupRef `json:"permission_groups"`
}

type RequestIPCondition struct {
	In    []string `json:"in,omitempty"`
	NotIn []string `json:"not_in,omitempty"`
}

type TokenCondition struct {
	RequestIP *RequestIPCondition `json:"request_ip,omitempty"`
}

type CreateTokenRequest struct {
	Name      string          `json:"name"`
	Policies  []TokenPolicy   `json:"policies"`
	Condition *TokenCondition `json:"condition,omitempty"`
	// RFC3339. Omitted entirely when empty, which mints a non-expiring token.
	ExpiresOn string `json:"expires_on,omitempty"`
	NotBefore string `json:"not_before,omitempty"`
}

// CreateTokenResult is the `result` object of a create call. `Value` is the plaintext token and
// is returned ONLY here — Cloudflare never discloses it again, so a lost value means the token
// has to be revoked and reissued.
type CreateTokenResult struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Value     string `json:"value"`
	Status    string `json:"status"`
	ExpiresOn string `json:"expires_on"`
}

type PermissionGroup struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// ── Operations ───────────────────────────────────────────────────────────────────────────

// CreateToken mints an API token owned by whichever scope tokensPath resolves to.
//
// VERIFIED LIVE: a parent holding ONLY `Account API Tokens Write` — no DNS or zone permission of
// its own — successfully minted a child with `DNS Write`, and that child then created and deleted
// a real `_acme-challenge` TXT record. Cloudflare does NOT cap a child to a subset of the
// parent's permissions. The parent is therefore not a privilege ceiling: within its account it
// can grant anything. That is what makes write access to this engine's role paths so sensitive.
//
// Resource-map gotcha, ACCOUNT scope only: a flat wildcard (`com.cloudflare.api.account.zone.*`)
// is rejected with "Must specify a zone for account owned tokens, or nest zone under specific
// account resource". A flat map of SPECIFIC zone ids — the only thing this plugin emits — is
// accepted in BOTH scopes. Do not add wildcard support without nesting the zone key under
// `com.cloudflare.api.account.<id>`.
//
// Because the plugin only ever names specific zone ids, the request body is identical across
// scopes and only the endpoint differs. That is what lets ONE user-scoped mount mint tokens for
// zones in several accounts: a zone id is globally unique, so no account needs naming — verified
// live across two accounts. Note the PARENT does not need to be able to see those zones; the
// user token used here lists zero zones and zero accounts (it holds only `User API Tokens Edit`)
// yet mints children that reach both.
func (c *CloudflareClient) CreateToken(req *CreateTokenRequest) (*CreateTokenResult, error) {
	raw, err := c.doRequest(http.MethodPost, c.tokensPath(), req)
	if err != nil {
		return nil, fmt.Errorf("creating token: %w%s", err, c.scopeHint(err))
	}

	var result CreateTokenResult
	if err := json.Unmarshal(raw, &result); err != nil {
		return nil, fmt.Errorf("decoding token response: %w", err)
	}
	if result.ID == "" {
		return nil, fmt.Errorf("token created but response carried no id")
	}
	if result.Value == "" {
		return nil, fmt.Errorf("token %s created but response carried no value; it must be revoked by hand", result.ID)
	}
	return &result, nil
}

// DeleteToken revokes a token by id. Treats 404 / "token not found" as success so a lease whose
// token was already deleted (by hand, or by its own expires_on) does not wedge revocation —
// OpenBao retries a failing revoke forever and the lease would never clear.
func (c *CloudflareClient) DeleteToken(tokenID string) error {
	_, err := c.doRequest(http.MethodDelete, c.tokensPath()+"/"+url.PathEscape(tokenID), nil)
	if err != nil && isNotFound(err) {
		return nil
	}
	return err
}

// ListPermissionGroups returns every permission group available in THIS client's token scope
// (see tokensPath — the ids differ between account- and user-owned), used to resolve names like
// "DNS Write" to ids at mint time.
//
// Unpaginated: verified live that the account endpoint returns all 407 groups in one response
// with `result_info: null`, ignoring `per_page` entirely. So there is no page loop to miss.
//
// Doubles as the liveness check for the parent token. Do NOT use `/user/tokens/verify` for that:
// measured on this account, verify answers "Invalid API Token" for a token that authenticates
// fine everywhere else, so it produces false alarms.
func (c *CloudflareClient) ListPermissionGroups() ([]PermissionGroup, error) {
	raw, err := c.doRequest(http.MethodGet, c.tokensPath()+"/permission_groups", nil)
	if err != nil {
		return nil, fmt.Errorf("listing permission groups: %w%s", err, c.scopeHint(err))
	}

	var groups []PermissionGroup
	if err := json.Unmarshal(raw, &groups); err != nil {
		return nil, fmt.Errorf("decoding permission groups: %w", err)
	}
	return groups, nil
}

// ── Transport ────────────────────────────────────────────────────────────────────────────

type apiError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// apiEnvelope is Cloudflare's uniform response wrapper.
//
// Checking the HTTP status is NOT sufficient: Cloudflare returns `success: false` with a useful
// `errors[]` under assorted statuses, and conversely answers 200 for a no-op. So every response
// is decoded and `success` is the authority. The error code is kept in the message because it is
// what makes a failure diagnosable — e.g. 9109 "Invalid access token" is a dead/revoked parent
// token, not a permissions problem, and the two look identical without the code.
type apiEnvelope struct {
	Success bool            `json:"success"`
	Errors  []apiError      `json:"errors"`
	Result  json.RawMessage `json:"result"`
}

func (c *CloudflareClient) doRequest(method, url string, body interface{}) (json.RawMessage, error) {
	var reader io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("marshaling request body: %w", err)
		}
		reader = bytes.NewReader(jsonBody)
	}

	req, err := http.NewRequest(method, url, reader)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	// Bearer, not NetBird's `Token` scheme.
	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("Accept", "application/json")
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("executing request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body: %w", err)
	}

	var env apiEnvelope
	if err := json.Unmarshal(respBody, &env); err != nil {
		// Not JSON at all (a proxy error page, a 5xx from the edge) — surface the status and a
		// bounded slice of the body rather than a decode error that hides what happened.
		return nil, fmt.Errorf("API returned status %d with a non-JSON body: %s", resp.StatusCode, truncate(string(respBody), 256))
	}

	if !env.Success {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, formatAPIErrors(env.Errors))
	}

	return env.Result, nil
}

// scopeHint translates Cloudflare's scope-mismatch error into the config change that fixes it.
// Cloudflare says "Valid user-level authentication not found", which names neither the field nor
// the token permission actually at fault, so without this the diagnosis is guesswork.
func (c *CloudflareClient) scopeHint(err error) string {
	if err == nil || c.scope != ScopeUser {
		return ""
	}
	if !strings.Contains(strings.ToLower(err.Error()), "user-level authentication") {
		return ""
	}
	return " (hint: token_scope is \"user\" but this parent token does not carry `User API Tokens Edit`; " +
		"if it is an account token with `Account API Tokens Write`, set token_scope=\"account\" and account_id)"
}

func formatAPIErrors(errs []apiError) string {
	if len(errs) == 0 {
		return "success=false with no errors reported"
	}
	parts := make([]string, 0, len(errs))
	for _, e := range errs {
		parts = append(parts, fmt.Sprintf("%d %s", e.Code, e.Message))
	}
	return strings.Join(parts, "; ")
}

// isNotFound matches the ways Cloudflare says "that token id does not exist". Matched on the
// message/code text because the envelope is the only signal — the HTTP status for a missing
// token is not stable across endpoints.
func isNotFound(err error) bool {
	s := strings.ToLower(err.Error())
	return strings.Contains(s, "not found") || strings.Contains(s, "could not be found") || strings.Contains(s, "status 404")
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
