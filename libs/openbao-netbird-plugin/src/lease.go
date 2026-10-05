package main

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/openbao/openbao/sdk/v2/framework"
	"github.com/openbao/openbao/sdk/v2/logical"
)

// Lease handling shared by all three credential types (PAT, setup key, proxy token).
//
// ── TWO INDEPENDENT EXPIRIES ────────────────────────────────────────────────────────────────
// Every credential this engine mints is bounded twice, deliberately:
//
//  1. the OpenBao LEASE — renewable up to max_ttl, and on expiry it deletes the credential in
//     NetBird. Gives early revocation and cleanup, but only while OpenBao is healthy and still
//     remembers the lease.
//  2. NetBird's OWN expiry (`expires_in`) — holds even if OpenBao is gone, its storage was
//     restored from a snapshot, or the mount was deleted. See vendorExpirySeconds for which of
//     ttl/max_ttl it tracks and why that depends on whether a lease exists.
//
// Neither alone is sufficient. Before this existed the deployed engine issued no lease at all,
// so nothing was ever revoked and PATs piled up — 22 of them, 11 still valid, the oldest from
// August. Conversely a lease alone leaves a live credential behind the moment OpenBao loses it.
//
// EXCEPTION: NetBird's reverse-proxy token API accepts no expiry field, so proxy tokens have
// only expiry (1). That is a limitation of the vendor API, not a choice — see pathProxyTokenRead.

// manageLeaseField is the per-role switch, identical across all three role types.
//
// DEFAULT TRUE. Set false ONLY for a consumer that cannot hold a lease: an OpenBao secret lease
// is a CHILD of the auth token that created it, so revoking that auth token revokes the lease and
// runs this engine's revoke. External Secrets Operator calls RevokeSelf after every read (its fix
// for leaking token leases, external-secrets#376), which destroys a leased credential seconds
// after it lands in the Secret. ESO cannot manage leases at all and the upstream issue
// (external-secrets#2198) was closed unfixed.
func manageLeaseField() *framework.FieldSchema {
	return &framework.FieldSchema{
		Type: framework.TypeBool,
		Description: "Attach a renewable OpenBao lease that deletes the credential in NetBird when it ends. " +
			"Set false ONLY for a consumer that cannot hold a lease (External Secrets Operator revokes its " +
			"own auth token after each read, which cascades and destroys the credential); NetBird's own " +
			"expires_in still bounds the credential either way",
		Default: true,
	}
}

// vendorExpirySeconds is what goes into NetBird's `expires_in`: the longest the credential could
// legitimately still be in use.
//
//	LEASED    max_ttl — a renewal can extend the lease that far, so the vendor credential has to
//	          outlive every renewal. Using ttl here would kill it upstream at the FIRST renewal
//	          while OpenBao still believed the lease was good.
//	UNLEASED  ttl, falling back to max_ttl — nothing can extend anything, so ttl is the whole
//	          intended lifetime. Using max_ttl here would silently DOUBLE the exposure of a
//	          credential that cannot be revoked at all (netbird's roles are ttl 720h /
//	          max_ttl 1440h, so 30 days would have become 60).
//
// Unlike Cloudflare there is no "no expiry" option: NetBird rejects a create with a zero or
// absent expires_in, so a caller-supplied floor is used when the role yields nothing.
//
// ⚠ THE UNIT OF `expires_in` DIFFERS BY ENDPOINT, verified against the live API:
//
//	setup keys  SECONDS -- expires_in 2592000 gives a key expiring in 30 days.
//	PATs        DAYS, and validated 1..365 -- expires_in 2592000 is REJECTED with
//	            422 "expiration has to be between 1 and 365"; expires_in 30 gives 30 days.
//
// So PAT callers must use vendorExpiryDays, NOT this function. Getting it wrong does not degrade
// quietly: PAT minting fails outright with a 500 out of the engine.
func vendorExpirySeconds(manageLease bool, ttl, maxTTL time.Duration, floor int) int {
	order := []time.Duration{ttl, maxTTL}
	if manageLease {
		// Leased: ONLY max_ttl. Falling back to ttl would kill the credential upstream at the
		// first renewal while OpenBao still believed the lease was good. NetBird gives us no
		// "never expires" option, so an unbounded lease (max_ttl 0) still has to be pinned to
		// something — the floor — rather than to ttl.
		order = []time.Duration{maxTTL}
	}
	for _, d := range order {
		if secs := int(d.Seconds()); secs > 0 {
			return secs
		}
	}
	return floor
}

// resolveLeaseTTLs validates a role's lease settings and returns the effective ttl.
//
// A role that sets only max_ttl is perfectly sensible, but the ttl DEFAULT is larger than most
// max_ttls, so rejecting it would mean erroring on a value the operator never chose. The default
// is clamped; a ttl they actually supplied is rejected.
func resolveLeaseTTLs(data *framework.FieldData, manageLease bool, ttl, maxTTL time.Duration) (time.Duration, *logical.Response) {
	if !manageLease {
		// Nothing consumes ttl without a lease; NetBird's expires_in is the only bound.
		return ttl, nil
	}
	if maxTTL > 0 && ttl > maxTTL {
		if _, supplied := data.GetOk("ttl"); !supplied {
			return maxTTL, nil
		}
		return ttl, logical.ErrorResponse("ttl (%s) must not exceed max_ttl (%s)", ttl, maxTTL)
	}
	return ttl, nil
}

// roleLeaseConfig is the lease-relevant subset every role type stores under the same JSON keys,
// so renewal can read any of them without knowing which kind it is looking at.
type roleLeaseConfig struct {
	TTL    time.Duration `json:"ttl"`
	MaxTTL time.Duration `json:"max_ttl"`
}

// renewFromRole builds a Renew handler that re-reads the owning role's TTLs and extends the
// lease. It deliberately does NOT call NetBird: a leased credential's `expires_in` was already
// set from max_ttl at creation, so every renewal inside max_ttl is backed by a credential that is
// still valid there.
// The expiration manager caps extension at MaxTTL, so a lease can never outlive the vendor
// expiry.
//
// Renewability is what lets a lease-aware consumer keep a working credential instead of
// discarding and re-minting on every cycle.
func (b *netbirdBackend) renewFromRole(prefix string) framework.OperationFunc {
	return func(ctx context.Context, req *logical.Request, _ *framework.FieldData) (*logical.Response, error) {
		role, _ := req.Secret.InternalData["role"].(string)
		if role == "" {
			return nil, fmt.Errorf("missing internal data for renewal")
		}

		entry, err := req.Storage.Get(ctx, prefix+role)
		if err != nil {
			return nil, err
		}
		if entry == nil {
			// The role was deleted under a live lease. Refusing renewal lets the lease run out
			// and revoke, rather than propping up a credential whose definition is gone.
			return nil, fmt.Errorf("role %q no longer exists; not renewing", role)
		}

		var cfg roleLeaseConfig
		if err := json.Unmarshal(entry.Value, &cfg); err != nil {
			return nil, err
		}

		resp := &logical.Response{Secret: req.Secret}
		resp.Secret.TTL = cfg.TTL
		resp.Secret.MaxTTL = cfg.MaxTTL
		return resp, nil
	}
}

// leaseResponse wraps a minted credential, attaching a lease only when the role asks for one.
//
// With manageLease false the response carries no `Secret` at all, so OpenBao tracks nothing and
// revokes nothing — which is precisely what makes the credential survive the caller's auth token
// being revoked. NetBird's expires_in remains the bound.
func (b *netbirdBackend) leaseResponse(secretType, role string, manageLease bool, ttl, maxTTL time.Duration,
	data, internal map[string]interface{},
) *logical.Response {
	if !manageLease {
		return &logical.Response{Data: data}
	}
	// Needed by renewFromRole to re-read the role's TTLs.
	internal["role"] = role
	resp := b.Secret(secretType).Response(data, internal)
	resp.Secret.TTL = ttl
	resp.Secret.MaxTTL = maxTTL
	return resp
}

// vendorExpiryDays is vendorExpirySeconds converted for NetBird's PAT endpoint, whose expires_in
// is in DAYS and validated to 1..365 (verified live: 2592000 is rejected with 422 "expiration has
// to be between 1 and 365", while 30 yields a 30-day token).
//
// Rounds UP, so a sub-day TTL still produces a valid 1, and clamps to 365 so a long max_ttl does
// not make every mint fail. Clamping rather than erroring is deliberate: the OpenBao lease is the
// precise control, and this value is the backstop — a backstop that is shorter than asked for is
// still a backstop, whereas a hard failure means no credential at all.
func vendorExpiryDays(manageLease bool, ttl, maxTTL time.Duration, floorDays int) int {
	secs := vendorExpirySeconds(manageLease, ttl, maxTTL, floorDays*86400)
	days := (secs + 86399) / 86400
	if days < 1 {
		days = 1
	}
	if days > 365 {
		days = 365
	}
	return days
}
