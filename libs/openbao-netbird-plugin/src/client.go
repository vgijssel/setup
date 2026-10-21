package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

// maxResponseBytes caps how much of an API response is read into memory. The NetBird responses
// this client parses are a few hundred bytes; the cap stops a hostile or malfunctioning endpoint
// from making the plugin allocate without bound.
const maxResponseBytes = 1 << 20

type NetBirdClient struct {
	apiURL     string
	token      string
	httpClient *http.Client
}

func NewNetBirdClient(apiURL, token string, timeout time.Duration) *NetBirdClient {
	if timeout == 0 {
		timeout = 30 * time.Second
	}
	return &NetBirdClient{
		apiURL: apiURL,
		token:  token,
		httpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

// CreatePATRequest. NOTE ExpiresIn is in DAYS here and validated 1..365 by the API, whereas the
// identically-named field on CreateSetupKeyRequest is in SECONDS. Verified live.
type CreatePATRequest struct {
	Name      string `json:"name"`
	ExpiresIn int    `json:"expires_in"`
}

type CreatePATResponse struct {
	PlainToken          string `json:"plain_token"`
	PersonalAccessToken struct {
		ID string `json:"id"`
	} `json:"personal_access_token"`
}

type CreateProxyTokenRequest struct {
	Name string `json:"name"`
}

type CreateProxyTokenResponse struct {
	ID    string `json:"id"`
	Token string `json:"plain_token"`
}

// CreateSetupKeyRequest. ExpiresIn is in SECONDS here — unlike CreatePATRequest, where the same
// field name means DAYS.
type CreateSetupKeyRequest struct {
	Name       string   `json:"name"`
	Type       string   `json:"type"`
	Ephemeral  bool     `json:"ephemeral"`
	AutoGroups []string `json:"auto_groups"`
	UsageLimit int      `json:"usage_limit"`
	ExpiresIn  int      `json:"expires_in"`
}

type CreateSetupKeyResponse struct {
	ID        string `json:"id"`
	Key       string `json:"key"`
	ExpiresAt string `json:"expires"`
}

// Path segments are escaped because user_id / token ids reach this client as free-form strings
// from the engine's own config and lease data. An unescaped "../" or "?" would silently retarget
// the call at a different NetBird endpoint.
func (c *NetBirdClient) CreatePAT(userID string, req *CreatePATRequest) (*CreatePATResponse, error) {
	endpoint := fmt.Sprintf("%s/api/users/%s/tokens", c.apiURL, url.PathEscape(userID))

	resp, err := c.doRequest(http.MethodPost, endpoint, req)
	if err != nil {
		return nil, fmt.Errorf("creating PAT: %w", err)
	}

	var result CreatePATResponse
	if err := json.Unmarshal(resp, &result); err != nil {
		return nil, fmt.Errorf("decoding PAT response: %w", err)
	}
	return &result, nil
}

func (c *NetBirdClient) DeletePAT(userID, tokenID string) error {
	endpoint := fmt.Sprintf("%s/api/users/%s/tokens/%s", c.apiURL, url.PathEscape(userID), url.PathEscape(tokenID))
	return c.doDelete(endpoint)
}

func (c *NetBirdClient) CreateProxyToken(req *CreateProxyTokenRequest) (*CreateProxyTokenResponse, error) {
	endpoint := fmt.Sprintf("%s/api/reverse-proxies/proxy-tokens", c.apiURL)

	resp, err := c.doRequest(http.MethodPost, endpoint, req)
	if err != nil {
		return nil, fmt.Errorf("creating proxy token: %w", err)
	}

	var result CreateProxyTokenResponse
	if err := json.Unmarshal(resp, &result); err != nil {
		return nil, fmt.Errorf("decoding proxy token response: %w", err)
	}
	return &result, nil
}

func (c *NetBirdClient) DeleteProxyToken(tokenID string) error {
	endpoint := fmt.Sprintf("%s/api/reverse-proxies/proxy-tokens/%s", c.apiURL, url.PathEscape(tokenID))
	return c.doDelete(endpoint)
}

func (c *NetBirdClient) CreateSetupKey(req *CreateSetupKeyRequest) (*CreateSetupKeyResponse, error) {
	endpoint := fmt.Sprintf("%s/api/setup-keys", c.apiURL)

	resp, err := c.doRequest(http.MethodPost, endpoint, req)
	if err != nil {
		return nil, fmt.Errorf("creating setup key: %w", err)
	}

	var result CreateSetupKeyResponse
	if err := json.Unmarshal(resp, &result); err != nil {
		return nil, fmt.Errorf("decoding setup key response: %w", err)
	}
	return &result, nil
}

func (c *NetBirdClient) DeleteSetupKey(keyID string) error {
	endpoint := fmt.Sprintf("%s/api/setup-keys/%s", c.apiURL, url.PathEscape(keyID))
	return c.doDelete(endpoint)
}

func (c *NetBirdClient) doRequest(method, endpoint string, body interface{}) ([]byte, error) {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshaling request body: %w", err)
	}

	req, err := http.NewRequest(method, endpoint, bytes.NewReader(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	req.Header.Set("Authorization", "Token "+c.token)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("executing request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(io.LimitReader(resp.Body, maxResponseBytes))
	if err != nil {
		return nil, fmt.Errorf("reading response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		// Bounded: an error body can echo the request, and these requests carry token material.
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, truncate(string(respBody), 256))
	}

	return respBody, nil
}

func (c *NetBirdClient) doDelete(endpoint string) error {
	req, err := http.NewRequest(http.MethodDelete, endpoint, nil)
	if err != nil {
		return fmt.Errorf("creating delete request: %w", err)
	}

	req.Header.Set("Authorization", "Token "+c.token)
	req.Header.Set("Accept", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("executing delete request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, maxResponseBytes))
		return fmt.Errorf("delete API returned status %d: %s", resp.StatusCode, truncate(string(body), 256))
	}

	return nil
}

func truncate(s string, n int) string {
	if len(s) <= n {
		return s
	}
	return s[:n] + "…"
}
