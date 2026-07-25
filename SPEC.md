# Spec: Migrate `apps/secret` and `apps/network` from Tailscale to NetBird

## Objective

Replace **Tailscale** with **NetBird** as the overlay network for both the `secret` and
`network` vind clusters, and remove Tailscale entirely. Today Tailscale provides three
things across these two apps:

1. **Cluster-to-cluster reachability** — the `secret` cluster's OpenBao reaches the
   `network` cluster to fetch a live JWKS, and the `network` cluster's external-secrets
   reaches the `secret` cluster's OpenBao to pull secrets over JWT auth.
2. **kube-apiserver exposure** — each cluster's API server is published on the tailnet via
   a `kube-apiserver` ProxyGroup at `api-secret.tail2c33e2.ts.net` /
   `api-network.tail2c33e2.ts.net` (the latter also serves the anonymous JWKS endpoint).
3. **Service ingress** — Omada is fronted by a stable Tailscale Service VIP
   (`omada.network.vgijssel.nl`); OpenBao is fronted by a Tailscale-class ingress.

After this change the same capabilities are provided by **NetBird Cloud** via the
[NetBird Kubernetes operator](https://github.com/netbirdio/kubernetes-operator), and the
two cluster API servers are exposed on **custom domains** —
`https://api.secret.vgijssel.nl` and `https://api.network.vgijssel.nl` — using
[NetBird's custom-domain reverse proxy](https://docs.netbird.io/manage/reverse-proxy/custom-domains)
(no extra in-cluster proxy, TLS auto-terminated by NetBird). All
`*.tail2c33e2.ts.net` names, ProxyGroups, the Tailscale operator, its OAuth clients, and
the tailnet ACL are deleted.

**Why NetBird** (maintainer's stated motivation, preserved as design intent):
self-hostable in future, custom domains instead of the fixed `*.tail2c33e2.ts.net`,
Kubernetes-native config, and multiple config sources for ACLs.

**User:** the repo maintainer operating the home-lab clusters. **Success looks like:** both
clusters brought up fresh with the existing `moon run <app>:*` flow, enrolled in NetBird
Cloud, with (a) `secret` OpenBao fetching the `network` JWKS over NetBird and validating the
`network` external-secrets JWT, (b) `network` external-secrets pulling from `secret` OpenBao
over NetBird, (c) both API servers reachable at their `api.<cluster>.vgijssel.nl` custom
domains, (d) Omada reachable at `omada.network.vgijssel.nl`, and (e) **zero** Tailscale
resources, secrets, or DNS names remaining in either app.

### Decisions (from clarification)

- **Control plane:** NetBird **Cloud** (`app.netbird.io`). Self-hosting is a future option;
  structure config so management URL / setup keys / API tokens are variables + OpenBao-held
  secrets, not hardcoded, but do **not** stand up a self-hosted management server now.
- **API exposure:** NetBird **custom-domain reverse proxy** for both API servers. TLS is
  auto-terminated by NetBird at its proxy cluster; clients hit `api.<cluster>.vgijssel.nl`.
- **Config-as-code:** use the **NetBird operator CRDs** (`SetupKey`, `Group`,
  `NetworkResource`, `NetworkRouter`, etc.) for this migration. The
  [`netbird-crossplane-provider`](https://github.com/netbirdio/netbird-crossplane-provider)
  is currently a scaffold and is **deferred to a follow-up** (see Non-goals).
- **Cutover:** **big-bang replace per app**, ordered **`network` first, then `secret`**
  (the JWKS producer must exist before the consumer). No dual-stack period.

### Non-goals

- **No self-hosted NetBird management/proxy server** in this change.
- **No NetBird Crossplane provider** wiring in this change. `apps/network` will *not* gain a
  `netbird-crossplane-provider` bundle now; NetBird config is expressed via operator CRDs.
  A later phase may revisit Crossplane once the provider implements real resources.
- **No change to the OpenBao trust model** beyond the transport: self-init ⊂ Crossplane
  invariant, k8s-auth for Crossplane/ESO, JWT-auth for the `network` cluster, break-glass
  admin, and 1Password-held seal key all stay as-is.
- **No change to Percona MongoDB, Omada, cert-manager (for `*.vgijssel.nl`), external-dns,
  or the Crossplane→OpenBao (provider-vault) config** except where a hostname/URL must
  change from a `*.ts.net` value to a NetBird/custom-domain value.
- **No migration of other clusters** (e.g. `network-controllers-prod`, PiKVM — PiKVM is
  already on NetBird) as part of this change.
- **No new proxy** for the API servers — the whole point of custom domains is to avoid one.

## Tech Stack

- **NetBird Cloud** — management at `https://api.netbird.io` (management URL kept as a
  variable). Peers enroll with **setup keys**; config-as-code via operator CRDs; ACLs via
  NetBird **policies + groups**.
- **NetBird Kubernetes operator** — Helm chart
  `oci://ghcr.io/netbirdio/helm-charts/netbird-operator`, namespace `netbird`. Pin the
  chart to an **exact version** (per repo dependency policy — no floating tags). CRDs
  (`netbird.io/v1alpha1`): `SetupKey`, `Group`, `NetworkResource`, `NetworkRouter`,
  `NetworkEgress`, `SidecarProfile`, `ClusterProxy`.
- **NetBird custom-domain reverse proxy** — wildcard `CNAME *.vgijssel.nl`-style delegation
  (scoped to the API subdomains) to NetBird's proxy cluster; NetBird issues/renews TLS.
- **Existing, unchanged:** vind (vcluster docker driver, arm64), Fleet (bundle discovery via
  `bin/fleet-apply`), Crossplane core + provider-vault (secret), external-secrets,
  cert-manager (for `omada.network.vgijssel.nl` and `openbao.secret.vgijssel.nl`),
  external-dns, Percona MongoDB operator, OpenBao self-init.
- **Secrets:** NetBird setup keys and any NetBird API token live in **OpenBao** (`secret`
  cluster's kv), surfaced to each cluster via ExternalSecret — replacing the
  `kv/*-tailscale-operator` OAuth entries. Chicken-and-egg for the `network` cluster
  (needs egress before it can reach OpenBao) is handled the same way `tailscale_auth.sh`
  does today: a bootstrap script seeds the setup-key Secret directly from the `secret`
  cluster's OpenBao before the operator starts.

## Commands

The existing Moon task surface is preserved; no new top-level commands are introduced. Task
bodies change; task names do not.

### `apps/network`

```bash
moon run network:start     # vcluster create → seed NetBird setup key → Fleet → apply bundles
moon run network:apply     # re-apply Fleet bundles to the running cluster
moon run network:stop      # delete the vind cluster
```

- `scripts/tailscale_auth.sh` is **renamed** to `scripts/netbird_auth.sh` (and its
  `moon.yml` task `tailscale_auth` → `netbird_auth`); it seeds the NetBird setup-key Secret
  from the `secret` cluster's OpenBao instead of the Tailscale operator OAuth secret.

### `apps/secret`

```bash
moon run secret:start      # vcluster create → Fleet → apply bundles (unchanged surface)
moon run secret:apply      # re-apply Fleet bundles
moon run secret:auth       # mint 1h OpenBao break-glass admin token (unchanged)
moon run secret:forward    # port-forward OpenBao to localhost:8200 (unchanged)
moon run secret:stop       # delete the vind cluster
```

All tasks keep `runInCI: false`, `interactive: true`, `cache: false`, and stay idempotent.

## Project Structure

Both apps keep their `scripts/` + `src/<bundle>/{fleet.yaml,...}` Fleet layout. Changes are
scoped to swapping the Tailscale bundles for NetBird bundles and updating cross-cluster URLs.

### `apps/network/src/`

| Action | Path | Notes |
|--------|------|-------|
| **Remove** | `tailscale-proxygroup/` | ProxyGroup CRs (`network-ingress`, `api-network`) deleted. |
| **Add** | `netbird-operator/` | Helm bundle for `netbird-operator` (pinned chart), ns `netbird`. |
| **Add** | `netbird-config/` | NetBird operator CRs: `SetupKey`, `Group`(s), `NetworkResource` for the API server + JWKS and for Omada. Replaces ProxyGroups + tailnet ACL content. |
| **Edit** | `config/externalsecret-operator-oauth.yaml` | Becomes a NetBird **setup-key** ExternalSecret (remote key `kv/network-netbird`), target Secret consumed by the operator. |
| **Edit** | `config/` OIDC/JWKS wiring | JWKS is now published at `https://api.network.vgijssel.nl/openid/v1/jwks`; keep the anonymous-JWKS ClusterRoleBinding. |
| **Edit** | `omada/templates/service-omada.yaml` | Drop Tailscale `loadBalancerClass`/annotations; expose Omada via a NetBird `NetworkResource` (still surfaced as `omada.network.vgijssel.nl` via external-dns/custom domain). |

### `apps/secret/src/`

| Action | Path | Notes |
|--------|------|-------|
| **Remove** | `tailscale-proxygroup/` | `secret-ingress` + `api-secret` ProxyGroups deleted. |
| **Add** | `netbird-operator/` | Helm bundle for `netbird-operator`, ns `netbird`. |
| **Add** | `netbird-config/` | `SetupKey`, `Group`(s), `NetworkResource` for the `secret` API server (`api.secret.vgijssel.nl`) and any egress to `network`. |
| **Edit** | `openbao-config/authbackend-jwt-network.yaml` | `jwksUrl` → `https://api.network.vgijssel.nl/openid/v1/jwks`. |
| **Edit** | `config/externalsecret-operator-oauth.yaml` | Becomes NetBird setup-key ExternalSecret (remote key `kv/secret-netbird`). |
| **Edit** | `config/ingress-openbao.yaml` | Drop Tailscale `loadBalancerClass`; keep cert-manager cert for `openbao.secret.vgijssel.nl` (reachable over NetBird). |

### Fleet dependency ordering

- `netbird-operator` must apply (and register its CRDs) **before** `netbird-config`
  (`dependsOn` the operator bundle) — same pattern the ProxyGroup bundles used against the
  Tailscale operator.
- The `secret` cluster's `netbird-config` (which the `network` cluster depends on for JWKS
  reachability) has no in-cluster ordering constraint, but the **cross-cluster** cutover
  order is `network` fully up → then `secret`, because `jwt-network` fetches the JWKS live.

## Code Style

- Follow repo `CLAUDE.md`: pinned versions everywhere (exact Helm chart version / image
  digest for the operator — no floating tags, no `npx`/`uvx`), Kubernetes file naming
  `<kind>-<name>.yaml`, platform detection via `IS_MACOS`/`IS_LINUX`, `trunk fmt` +
  `trunk check` before commit.
- Bundle labels `fleet.vgijssel.nl/bundle: <name>` and per-bundle
  `targetCustomizations` with `clusterSelector matchLabels cluster.vgijssel.nl/name:
  <cluster>` are preserved on every new bundle.
- Vendored charts go through `third_party/vendir` and are referenced by `file://` from an
  umbrella `Chart.yaml`, matching the existing `openbao`/`crossplane` bundles.
- Scripts stay `set -euo pipefail`, idempotent, and keep the current label-safety guard in
  `apply.sh` (refuse to apply if the active context's Fleet `local` cluster isn't labelled
  for this app) — see `[[fleet-apply-context-clobber]]`.
- Cross-cluster hostnames are written once and referenced consistently; the NetBird
  management URL is a variable/const, not scattered literals, to keep the self-host door open.

## Testing Strategy

No unit-test framework is added; validation is operational and end-to-end, matching how
these clusters are already exercised.

1. **Enrollment** — after `moon run network:start` / `secret:start`, each cluster's NetBird
   operator peer shows **Connected** in the NetBird dashboard, in the correct group.
2. **API custom domains** — `kubectl --server https://api.network.vgijssel.nl ...` and
   `https://api.secret.vgijssel.nl ...` succeed with a **publicly trusted** cert (no
   `*.ts.net`, no cert override). Validate that client auth still works through the L7
   reverse proxy (see Risks).
3. **JWKS reachability** — from the `secret` cluster, the `jwt-network` AuthBackend
   reconciles: `curl https://api.network.vgijssel.nl/openid/v1/jwks` returns keys
   anonymously.
4. **Cross-cluster JWT** — the `network` cluster's external-secrets successfully logs into
   `secret` OpenBao's `jwt-network` backend over NetBird and syncs a known kv key.
5. **Omada** — `omada.network.vgijssel.nl` resolves and serves the Omada UI over NetBird;
   Omada connects to Percona MongoDB (unchanged).
6. **OpenBao ingress** — `openbao.secret.vgijssel.nl` reachable over NetBird with its
   cert-manager cert; `moon run secret:forward` + break-glass `secret:auth` still work.
7. **Tailscale-gone assertion** — `grep -ri "tailscale\|tail2c33e2\.ts\.net\|ProxyGroup" apps/secret apps/network`
   returns nothing (outside historical memory/docs); no `tailscale` namespace, operator,
   ProxyGroup CRs, or OAuth secrets exist in either cluster.

Each phase is verified on a **freshly recreated** cluster (`stop` → `start`) to prove
bootstrap correctness, not just convergence on a long-lived cluster.

## Boundaries

### Always
- Keep the OpenBao trust model intact: self-init ⊂ Crossplane, `deletionPolicy: Orphan` on
  adopted resources, and the k8s-auth/JWT roles — only transport (Tailscale→NetBird) and
  the JWKS URL change.
- Store NetBird setup keys / API tokens in OpenBao and surface them via ExternalSecret;
  seed the `network` cluster's setup key from `secret` OpenBao before its operator boots
  (mirroring today's `tailscale_auth.sh` chicken-and-egg fix).
- Pin the NetBird operator chart/image to exact versions/digests.
- Migrate `network` first, verify JWKS + JWT end-to-end, then `secret`.
- Run `trunk fmt` + `trunk check` and verify on a fresh cluster before declaring done.

### Ask first
- **How the kube-apiserver is fronted by the L7 custom-domain proxy** — whether NetBird's
  terminating reverse proxy preserves the auth path kubectl needs (bearer tokens vs client
  certs), and whether the anonymous JWKS path is exposed correctly. If the reverse proxy
  can't cleanly front a raw kube-apiserver, fall back to a NetBird `NetworkResource` + DNS
  name with the apiserver's own cert — **confirm the approach before building it**.
- Any DNS delegation change at the registrar/Cloudflare for `*.vgijssel.nl`
  (CNAME to NetBird proxy) — outward-facing, confirm before applying.
- Changing NetBird **account-level** ACL policies/groups that could affect other peers
  (e.g. the already-migrated PiKVM) — confirm scope before editing shared policy.
- Introducing the NetBird Crossplane provider (out of scope here) — needs a separate spec.

### Never
- Never stand up a self-hosted NetBird management/proxy server in this change.
- Never delete or `kubectl delete` the OpenBao `Configuration`/managed resources such that
  OpenBao is destroyed — recover via `secret:configure`, never by teardown
  (see `[[terranetes-openbao-config]]`, `[[openbao-config-orphan-recovery]]`).
- Never hardcode NetBird Cloud specifics in a way that blocks a future self-host cutover
  (keep management URL + keys as variables/secrets).
- Never leave a dual-stack (Tailscale + NetBird) state committed — Tailscale is removed in
  the same change per app, not left behind "just in case".
- Never run `apply` against a cluster whose Fleet `local` context label doesn't match the
  app (`[[fleet-apply-context-clobber]]`).

## Key Risks / Open Questions

1. **kube-apiserver behind an L7 terminating proxy.** NetBird custom domains terminate TLS
   at NetBird's proxy and re-originate — a kube-apiserver expects to terminate its own TLS
   and do client-cert / token auth. This is the single biggest technical unknown; item under
   *Ask first*. Fallback: `NetworkResource` + NetBird DNS name + apiserver's own cert.
2. **Anonymous JWKS through the proxy.** The JWKS endpoint must stay anonymously reachable
   at `api.network.vgijssel.nl/openid/v1/jwks`; confirm the reverse proxy doesn't inject
   auth.
3. **Cross-cluster egress ordering.** Big-bang per app means a brief window where `secret`
   can't reach `network` until both are on NetBird — mitigated by the network-first order.
4. **Crossplane provider immaturity.** Deferring it means NetBird ACL/config is operator-CRD
   driven for now; revisit when the provider implements real resources.
