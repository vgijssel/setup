package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

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

type CreatePATRequest struct {
	Name      string `json:"name"`
	ExpiresIn int    `json:"expires_in"`
}

type CreatePATResponse struct {
	PlainToken       string `json:"plain_token"`
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

func (c *NetBirdClient) CreatePAT(userID string, req *CreatePATRequest) (*CreatePATResponse, error) {
	url := fmt.Sprintf("%s/api/users/%s/tokens", c.apiURL, userID)

	resp, err := c.doRequest(http.MethodPost, url, req)
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
	url := fmt.Sprintf("%s/api/users/%s/tokens/%s", c.apiURL, userID, tokenID)
	return c.doDelete(url)
}

func (c *NetBirdClient) CreateProxyToken(req *CreateProxyTokenRequest) (*CreateProxyTokenResponse, error) {
	url := fmt.Sprintf("%s/api/reverse-proxies/proxy-tokens", c.apiURL)

	resp, err := c.doRequest(http.MethodPost, url, req)
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
	url := fmt.Sprintf("%s/api/reverse-proxies/proxy-tokens/%s", c.apiURL, tokenID)
	return c.doDelete(url)
}

func (c *NetBirdClient) CreateSetupKey(req *CreateSetupKeyRequest) (*CreateSetupKeyResponse, error) {
	url := fmt.Sprintf("%s/api/setup-keys", c.apiURL)

	resp, err := c.doRequest(http.MethodPost, url, req)
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
	url := fmt.Sprintf("%s/api/setup-keys/%s", c.apiURL, keyID)
	return c.doDelete(url)
}

func (c *NetBirdClient) doRequest(method, url string, body interface{}) ([]byte, error) {
	jsonBody, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshaling request body: %w", err)
	}

	req, err := http.NewRequest(method, url, bytes.NewReader(jsonBody))
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

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("API returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

func (c *NetBirdClient) doDelete(url string) error {
	req, err := http.NewRequest(http.MethodDelete, url, nil)
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
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("delete API returned status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
