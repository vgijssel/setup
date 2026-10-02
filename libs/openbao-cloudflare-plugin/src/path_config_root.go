package main

import (
	"context"
	"fmt"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

// configRoot holds the PARENT credential every minted token descends from.
//
// It is NOT a privilege ceiling. Verified live that Cloudflare lets a minted token hold
// permissions the parent lacks, so the real ceiling is everything the parent's ACCOUNT can do —
// or, for a user token, everything its owner can administer across every account. Write access to
// config/root or config/token/* is therefore at least as powerful as the parent credential
// itself; gate both paths in the OpenBao policy accordingly.
type configRoot struct {
	APIURL string `json:"api_url"`
	// TokenScope is REQUIRED and states outright which Cloudflare token API to use — it is never
	// inferred from the presence of another field. See the TokenScope docs in client.go for the
	// trade-off; in short, "user" can mint for zones across every account its owner belongs to,
	// "account" is confined to one account.
	TokenScope TokenScope `json:"token_scope"`
	// The parent credential. Never returned by a read.
	//
	//	token_scope=user     needs `User API Tokens Edit`
	//	token_scope=account  needs `Account API Tokens Write`
	//
	// It does NOT need the permissions it hands down: verified live that a parent holding only
	// `Account API Tokens Write` minted a working `DNS Write` child. Cloudflare does not cap a
	// child to a subset of its parent, so this credential's reach is its whole account (or, for a
	// user token, every account its owner can administer).
	APIToken string `json:"api_token"`
	// Which account owns the minted tokens. REQUIRED for token_scope=account, REJECTED for
	// token_scope=user (where nothing needs it — a zone id is globally unique, which is exactly
	// why one user-scoped mount can serve several accounts). Not a secret.
	//
	// Distinct from a role's `account_ids`, which is about which account RESOURCES a token may
	// act on. A role scoped only to zones sets no account_ids at all.
	AccountID string `json:"account_id"`
}

// validateScope enforces that the scope is stated and that the two fields agree. Applied both
// when config/root is WRITTEN and when it is USED, because a config stored before token_scope
// existed decodes to an empty scope, and defaulting that would silently choose an endpoint.
//
// Each of these would otherwise surface only as a Cloudflare authentication error that names
// neither the field nor the token permission at fault.
func (c *configRoot) validateScope() error {
	switch {
	case c.TokenScope == "":
		return fmt.Errorf(`token_scope is required: "user" (/user/tokens, needs ` +
			"`User API Tokens Edit`, and can mint for zones in every account its owner administers) or " +
			`"account" (/accounts/<id>/tokens, needs ` + "`Account API Tokens Write`" + `, one account only). ` +
			`If this config predates the field, re-write config/root with it set.`)
	case !c.TokenScope.Valid():
		return fmt.Errorf("token_scope %q is not valid; must be %q or %q",
			string(c.TokenScope), string(ScopeUser), string(ScopeAccount))
	case c.TokenScope == ScopeAccount && c.AccountID == "":
		return fmt.Errorf(`account_id is required when token_scope is "account" ` +
			"(it is the account whose /accounts/<id>/tokens endpoint mints the token)")
	case c.TokenScope == ScopeUser && c.AccountID != "":
		return fmt.Errorf(`account_id must be empty when token_scope is "user": ` +
			"user-owned tokens are minted at /user/tokens and are scoped by zone id, which is globally " +
			"unique. Setting it here would imply a restriction that is not applied — put account ids on " +
			"a role's account_ids instead.")
	}
	return nil
}

func pathConfigRoot(b *cloudflareBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "config/root",
			Fields: map[string]*framework.FieldSchema{
				"api_url": {
					Type:        framework.TypeString,
					Description: "Cloudflare API base URL",
					Default:     DefaultAPIURL,
				},
				"token_scope": {
					Type:          framework.TypeString,
					Description:   `Which Cloudflare token API to use: "user" (/user/tokens, spans every account its owner administers) or "account" (/accounts/<id>/tokens, one account only)`,
					Required:      true,
					AllowedValues: []interface{}{string(ScopeUser), string(ScopeAccount)},
				},
				"api_token": {
					Type:        framework.TypeString,
					Description: `Parent Cloudflare API token: needs "User API Tokens Edit" for token_scope=user, or "Account API Tokens Write" for token_scope=account`,
					Required:    true,
				},
				"account_id": {
					Type:        framework.TypeString,
					Description: "Cloudflare account id owning the minted tokens; required for token_scope=account, must be empty for token_scope=user",
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

func (b *cloudflareBackend) pathConfigRootExistenceCheck(ctx context.Context, req *logical.Request, _ *framework.FieldData) (bool, error) {
	config, err := getConfigRoot(ctx, req.Storage)
	if err != nil {
		return false, err
	}
	return config != nil, nil
}

// pathConfigRootRead deliberately returns api_url only — never the parent token.
func (b *cloudflareBackend) pathConfigRootRead(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
	config, err := getConfigRoot(ctx, req.Storage)
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, nil
	}

	return &logical.Response{
		Data: map[string]interface{}{
			"api_url":     config.APIURL,
			"account_id":  config.AccountID,
			"token_scope": string(config.TokenScope),
			// The resolved endpoint, so an operator can confirm at a glance which API is in use
			// and therefore which parent permission is the right one, without reading the source.
			"tokens_endpoint": tokensEndpoint(config),
		},
	}, nil
}

// tokensEndpoint reports the endpoint that WILL be called, or says plainly that none will be.
// Reporting /user/tokens for an unusable config would be the same silent default the explicit
// token_scope field exists to prevent, just surfaced in a read instead of a request.
func tokensEndpoint(config *configRoot) string {
	if err := config.validateScope(); err != nil {
		return "<unusable: " + string(config.TokenScope) + ">"
	}
	if config.TokenScope == ScopeAccount {
		return config.APIURL + "/accounts/" + config.AccountID + "/tokens"
	}
	return config.APIURL + "/user/tokens"
}

func (b *cloudflareBackend) pathConfigRootWrite(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
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
	if config.APIURL == "" {
		config.APIURL = DefaultAPIURL
	}
	if token, ok := data.GetOk("api_token"); ok {
		config.APIToken = token.(string)
	}
	if accountID, ok := data.GetOk("account_id"); ok {
		config.AccountID = accountID.(string)
	}
	if scope, ok := data.GetOk("token_scope"); ok {
		config.TokenScope = TokenScope(scope.(string))
	}

	if config.APIToken == "" {
		return logical.ErrorResponse("api_token is required"), nil
	}

	if err := config.validateScope(); err != nil {
		return logical.ErrorResponse("%s", err.Error()), nil
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

func (b *cloudflareBackend) pathConfigRootDelete(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
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
