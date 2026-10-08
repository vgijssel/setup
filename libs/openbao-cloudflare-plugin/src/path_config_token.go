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
	// ManageLease decides whether OpenBao owns the token's lifecycle. DEFAULT TRUE.
	//
	// Every token gets TWO independent expiries, and they are not redundant:
	//
	//	1. the OpenBao lease (this field) — renewable up to max_ttl, revokes the token upstream
	//	   when it ends. Gives early revocation and cleanup, but only while OpenBao is healthy
	//	   and remembers the lease.
	//	2. Cloudflare's own `expires_on`, always set from max_ttl — holds even if OpenBao is
	//	   gone, its storage was restored from a snapshot, or the mount was deleted.
	//
	// Set to FALSE only for a consumer that cannot hold a lease. An OpenBao secret lease is a
	// CHILD of the auth token that created it: revoke that auth token and the lease goes with it,
	// running this engine's revoke and deleting the Cloudflare token. External Secrets Operator
	// calls RevokeSelf after every read (its fix for leaking token leases,
	// external-secrets#376), so a leased credential it mints is destroyed seconds after landing
	// in the Secret. Measured exactly that: a Secret synced successfully and its token answered
	// 9109 twenty seconds later, with zero leases and zero tokens left upstream. ESO cannot
	// manage leases at all and the upstream issue (external-secrets#2198) was closed unfixed.
	//
	// With false, expiry (2) is the only bound — which is why max_ttl may not be 0 in that mode.
	ManageLease bool `json:"manage_lease"`
}

// vendorLifetime is the `expires_on` this role's tokens get — the longest the token could
// legitimately still be in use.
//
//	LEASED    max_ttl, and NOTHING if max_ttl is 0. A renewal can extend the lease up to max_ttl,
//	          so the token must outlive every renewal. With max_ttl 0 renewal is effectively
//	          unbounded, so there is no safe finite value: falling back to ttl would kill the
//	          token upstream at the FIRST renewal while OpenBao still believed the lease was good.
//	          The lease is the control in that case.
//	UNLEASED  ttl, falling back to max_ttl. Nothing can extend anything, so ttl is the whole
//	          intended lifetime, and expires_on is the ONLY bound that exists — which is why a
//	          role with neither value set is refused.
func (c *configToken) vendorLifetime() time.Duration {
	if c.ManageLease {
		return c.MaxTTL
	}
	for _, d := range []time.Duration{c.TTL, c.MaxTTL} {
		if d > 0 {
			return d
		}
	}
	return 0
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
					Description: "Attach a renewable OpenBao lease that revokes the token upstream when it ends. " +
						"Set false ONLY for a consumer that cannot hold a lease (External Secrets Operator revokes " +
						"its own auth token after each read, which cascades and destroys the credential); " +
						"Cloudflare's expires_on still bounds the token either way",
					Default: true,
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
			TTL:         time.Duration(data.Get("ttl").(int)) * time.Second,
			MaxTTL:      time.Duration(data.Get("max_ttl").(int)) * time.Second,
			ManageLease: data.Get("manage_lease").(bool),
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
	// ttl must never exceed max_ttl, in EITHER mode. Leased, ttl is the lease TTL and max_ttl its
	// ceiling. Unleased, ttl becomes the token's whole lifetime, so a role setting only
	// max_ttl=48h must not silently get the 30-day ttl DEFAULT as its expiry — that would be a
	// token living 15x longer than asked for, with nothing able to revoke it.
	//
	// A default the operator never chose is clamped; a ttl they actually supplied is rejected.
	if config.MaxTTL > 0 && config.TTL > config.MaxTTL {
		if _, supplied := data.GetOk("ttl"); !supplied {
			config.TTL = config.MaxTTL
		} else {
			return logical.ErrorResponse("ttl (%s) must not exceed max_ttl (%s)",
				config.TTL, config.MaxTTL), nil
		}
	}
	// Without a lease, Cloudflare's expires_on is the ONLY thing that ever ends the token's life,
	// so a zero effective lifetime would mint credentials that live forever with nothing tracking
	// them. Refuse rather than quietly leak.
	if !config.ManageLease && config.vendorLifetime() == 0 {
		return logical.ErrorResponse("ttl must be greater than 0 when manage_lease is false: " +
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
