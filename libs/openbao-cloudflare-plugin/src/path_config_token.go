package main

import (
	"context"
	"time"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

// configToken is one role: the shape of every token minted under `token/<name>`.
//
// A role is the whole privilege definition — permissions AND the resources they apply to — so
// `config/token/*` write access equals the parent token's authority. There is no capping of a
// role against a subset of the parent; Cloudflare simply rejects a policy the parent cannot
// grant. Restrict this path in policy accordingly.
type configToken struct {
	TokenNamePrefix string `json:"token_name_prefix"`
	// Permission-group names ("DNS Write") or raw 32-hex ids. Resolved at mint time.
	Permissions []string `json:"permissions"`
	// Cloudflare zone ids; become `com.cloudflare.api.account.zone.<id>` resource keys.
	ZoneIDs []string `json:"zone_ids"`
	// Cloudflare account ids; become `com.cloudflare.api.account.<id>` resource keys. Needed
	// only for account-level permission groups; zone-level DNS work wants ZoneIDs.
	AccountIDs []string `json:"account_ids"`
	// Optional CIDR allow-list pinned onto the token (`condition.request_ip.in`).
	AllowedIPs []string      `json:"allowed_ips"`
	TTL        time.Duration `json:"ttl"`
	MaxTTL     time.Duration `json:"max_ttl"`
	// ManageLease decides whether OpenBao owns the token's lifecycle.
	//
	// DEFAULT false, and that default is load-bearing for every ExternalSecret consumer.
	//
	// In OpenBao a secret lease is a CHILD of the auth token that created it, so revoking that
	// auth token revokes the lease — which runs this engine's revoke and deletes the Cloudflare
	// token. External Secrets Operator logs in, reads, and then revokes its own Vault token, so
	// a leased credential it mints is destroyed within seconds of being written to the Secret.
	// Measured: the consumer's Secret held a token that answered 9109 twenty seconds after a
	// successful sync, with zero leases and zero minted tokens left in Cloudflare.
	//
	//	false  no OpenBao lease. Lifetime is enforced by Cloudflare's own `expires_on`
	//	       (= max_ttl), which is independent of OpenBao being up, and rotation is the
	//	       consumer's refresh interval. Nothing can revoke the token early, which is
	//	       exactly what makes it survive the caller's auth token going away.
	//	true   lease of ttl/max_ttl; the token is deleted when the lease ends. ONLY safe when
	//	       the caller's auth token outlives the credential — interactive `bao read`, not ESO.
	ManageLease bool `json:"manage_lease"`
}

func pathConfigToken(b *cloudflareBackend) []*framework.Path {
	return []*framework.Path{
		{
			Pattern: "config/token/" + framework.GenericNameRegex("name"),
			Fields: map[string]*framework.FieldSchema{
				"name": {
					Type:        framework.TypeString,
					Description: "Name of the token role",
					Required:    true,
				},
				"token_name_prefix": {
					Type:        framework.TypeString,
					Description: "Prefix for generated Cloudflare token names",
					Default:     "openbao",
				},
				"permissions": {
					Type:        framework.TypeCommaStringSlice,
					Description: "Permission group names (e.g. 'DNS Write') or raw 32-hex permission group ids",
					Required:    true,
				},
				"zone_ids": {
					Type:        framework.TypeCommaStringSlice,
					Description: "Cloudflare zone ids the token is scoped to",
				},
				"account_ids": {
					Type:        framework.TypeCommaStringSlice,
					Description: "Cloudflare account ids the token is scoped to (for account-level permission groups)",
				},
				"allowed_ips": {
					Type:        framework.TypeCommaStringSlice,
					Description: "Optional CIDRs the token may be used from (condition.request_ip.in)",
				},
				"ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Lease TTL for generated tokens",
					Default:     2592000, // 30 days
				},
				"max_ttl": {
					Type:        framework.TypeDurationSecond,
					Description: "Cloudflare expires_on for the minted token, and the maximum lease TTL when manage_lease is true",
					Default:     7776000, // 90 days
				},
				"manage_lease": {
					Type: framework.TypeBool,
					Description: "Attach an OpenBao lease that deletes the token when it ends. Leave false for " +
						"ExternalSecret consumers: a lease is a child of the caller's auth token, and ESO revokes " +
						"its own token after each read, which would destroy the credential immediately",
					Default: false,
				},
			},
			Operations: map[logical.Operation]framework.OperationHandler{
				logical.ReadOperation: &framework.PathOperation{
					Callback: b.pathConfigTokenRead,
				},
				logical.CreateOperation: &framework.PathOperation{
					Callback: b.pathConfigTokenWrite,
				},
				logical.UpdateOperation: &framework.PathOperation{
					Callback: b.pathConfigTokenWrite,
				},
				logical.DeleteOperation: &framework.PathOperation{
					Callback: b.pathConfigTokenDelete,
				},
			},
			ExistenceCheck: b.pathConfigTokenExistenceCheck,
		},
	}
}

func (b *cloudflareBackend) pathConfigTokenExistenceCheck(ctx context.Context, req *logical.Request, data *framework.FieldData) (bool, error) {
	name := data.Get("name").(string)
	entry, err := req.Storage.Get(ctx, "config/token/"+name)
	if err != nil {
		return false, err
	}
	return entry != nil, nil
}

func (b *cloudflareBackend) pathConfigTokenRead(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	config, err := getConfigToken(ctx, req.Storage, name)
	if err != nil {
		return nil, err
	}
	if config == nil {
		return nil, nil
	}

	return &logical.Response{
		Data: map[string]interface{}{
			"token_name_prefix": config.TokenNamePrefix,
			"permissions":       config.Permissions,
			"zone_ids":          config.ZoneIDs,
			"account_ids":       config.AccountIDs,
			"allowed_ips":       config.AllowedIPs,
			"ttl":               int64(config.TTL.Seconds()),
			"max_ttl":           int64(config.MaxTTL.Seconds()),
			"manage_lease":      config.ManageLease,
		},
	}, nil
}

func (b *cloudflareBackend) pathConfigTokenWrite(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)

	config, err := getConfigToken(ctx, req.Storage, name)
	if err != nil {
		return nil, err
	}
	// A new role takes the schema defaults for any field not supplied; an existing one keeps its
	// stored value, so a partial update cannot silently reset a knob it did not mention. This has
	// to be explicit because GetOk reports only what the REQUEST carried — it does not apply the
	// Default declared in the field schema, so relying on it would leave ttl/max_ttl at zero and
	// trip the max_ttl validation below on every role written without them.
	isNew := config == nil
	if isNew {
		config = &configToken{
			TTL:    time.Duration(data.Get("ttl").(int)) * time.Second,
			MaxTTL: time.Duration(data.Get("max_ttl").(int)) * time.Second,
		}
	}

	if prefix, ok := data.GetOk("token_name_prefix"); ok {
		config.TokenNamePrefix = prefix.(string)
	}
	if config.TokenNamePrefix == "" {
		config.TokenNamePrefix = "openbao"
	}
	if perms, ok := data.GetOk("permissions"); ok {
		config.Permissions = perms.([]string)
	}
	if zones, ok := data.GetOk("zone_ids"); ok {
		config.ZoneIDs = zones.([]string)
	}
	if accounts, ok := data.GetOk("account_ids"); ok {
		config.AccountIDs = accounts.([]string)
	}
	if ips, ok := data.GetOk("allowed_ips"); ok {
		config.AllowedIPs = ips.([]string)
	}
	if ttl, ok := data.GetOk("ttl"); ok {
		config.TTL = time.Duration(ttl.(int)) * time.Second
	}
	if maxTTL, ok := data.GetOk("max_ttl"); ok {
		config.MaxTTL = time.Duration(maxTTL.(int)) * time.Second
	}
	if manageLease, ok := data.GetOk("manage_lease"); ok {
		config.ManageLease = manageLease.(bool)
	}

	// Fail at role-write time rather than at mint time. A role that is missing either half
	// produces a token Cloudflare accepts the shape of but that grants nothing, which surfaces
	// much later as an unexplained 403 in whatever consumes it.
	if len(config.Permissions) == 0 {
		return logical.ErrorResponse("permissions is required (a token with no permission groups grants nothing)"), nil
	}
	if len(config.ZoneIDs) == 0 && len(config.AccountIDs) == 0 {
		return logical.ErrorResponse("at least one of zone_ids or account_ids is required (a policy with no resources grants nothing)"), nil
	}
	// Only meaningful for a leased role: ttl IS the lease TTL. With manage_lease=false nothing
	// consumes ttl at all (lifetime comes from Cloudflare's expires_on), so enforcing it there
	// would reject a perfectly good role for a field that has no effect — and would do so with a
	// confusing message, since the ttl in question is one the operator never set.
	if config.ManageLease && config.MaxTTL > 0 && config.TTL > config.MaxTTL {
		return logical.ErrorResponse("ttl must not exceed max_ttl"), nil
	}
	// Without a lease, Cloudflare's expires_on is the ONLY thing that ever ends the token's
	// life, so max_ttl=0 (no expiry) would mint credentials that live forever with nothing
	// tracking them. Refuse rather than quietly leak.
	if !config.ManageLease && config.MaxTTL == 0 {
		return logical.ErrorResponse("max_ttl must be greater than 0 when manage_lease is false: " +
			"it sets Cloudflare's expires_on, which is the only thing that expires an unleased token"), nil
	}

	storageEntry, err := logical.StorageEntryJSON("config/token/"+name, config)
	if err != nil {
		return nil, err
	}

	if err := req.Storage.Put(ctx, storageEntry); err != nil {
		return nil, err
	}

	return nil, nil
}

func (b *cloudflareBackend) pathConfigTokenDelete(ctx context.Context, req *logical.Request, data *framework.FieldData) (*logical.Response, error) {
	name := data.Get("name").(string)
	if err := req.Storage.Delete(ctx, "config/token/"+name); err != nil {
		return nil, err
	}
	return nil, nil
}

func getConfigToken(ctx context.Context, s logical.Storage, name string) (*configToken, error) {
	entry, err := s.Get(ctx, "config/token/"+name)
	if err != nil {
		return nil, err
	}
	if entry == nil {
		return nil, nil
	}

	var config configToken
	if err := entry.DecodeJSON(&config); err != nil {
		return nil, err
	}
	return &config, nil
}
