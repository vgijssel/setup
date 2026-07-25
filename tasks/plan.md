# Implementation Plan: Migrate `apps/secret` + `apps/network` from Tailscale to NetBird

## Context

Both home-lab vind clusters (`network`, `secret`) currently use **Tailscale** for three
things: cross-cluster reachability (secret's OpenBao ↔ network's external-secrets), each
cluster's kube-apiserver exposure on the tailnet (`api-{network,secret}.tail2c33e2.ts.net`
ProxyGroups, with the network one also serving the anonymous JWKS), and service ingress
(Omada VIP, OpenBao ingress). The maintainer wants to replace Tailscale with **NetBird
Cloud** — self-hostable later, custom domains instead of `*.ts.net`, Kubernetes-native
config — and remove Tailscale entirely (`SPEC.md` at repo root is the source of truth).

Beyond the SPEC, the maintainer has directed three refinements (see **Validation** below):
1. JWKS must flow through the **API-server `ClusterProxy` with auth/impersonation** — **not** a
   separate anonymous path, and **not** `noauth`.
2. The Cloudflare CNAME automation (`provider-upjet-cloudflare`) runs on the **network** cluster.
3. Once NetBird manages certificates, **cert-manager and external-dns are removed** from both
   clusters. (Validated true, with one Omada L4 nuance to confirm in Phase 0.)

The outcome: both clusters brought up fresh with `moon run <app>:*`, enrolled in NetBird, JWKS +
cross-cluster JWT working over NetBird, both API servers reachable at `api.<cluster>.vgijssel.nl`,
Omada + OpenBao reachable over NetBird with NetBird-managed TLS, and **zero** Tailscale,
cert-manager, or external-dns resources left in scope.

## Validation of the maintainer's three directives

**(1) JWKS via ClusterProxy (impersonation) — achievable, one caveat.** NetBird's API-server proxy
impersonates **per-caller** (`Impersonate-User`/`Impersonate-Group` from the caller's NetBird
identity/groups), not a fixed SA. So JWKS becomes an *authenticated impersonated* read: bind the
secret cluster's OpenBao **NetBird group** to the built-in `system:service-account-issuer-discovery`
ClusterRole (replacing today's `system:unauthenticated` binding). No separate service, no `noauth`.
**Caveat:** ClusterProxy TLS is **cluster PKI**, so OpenBao's `jwt-network` backend must set
`jwksCaPem` to the network cluster CA (the old "public cert / no CA pin" no longer applies).
**Only real unknown:** whether a token-less HTTP client (OpenBao) gets a NetBird identity purely
from the peer tunnel. **Phase 0.3 proves this first; if it fails I stop and report before any
fallback** (per maintainer instruction).

**(2) Cloudflare Crossplane on `network`.** Network has no Crossplane today, so this adds
**Crossplane core + `provider-upjet-cloudflare`** to the network cluster. Because the NetBird proxy
target is **region-stable**, that one Crossplane owns **all** `*.vgijssel.nl` CNAMEs (both clusters')
→ the NetBird proxy target, with no cross-cluster ordering problem. Reuses `kv/cloudflare#credential`.

**(3) Remove cert-manager + external-dns.** In-scope leaf certs are exactly two —
`certificate-omada.yaml` (`omada.network.vgijssel.nl`) and `certificate-secret.yaml`
(`openbao.secret.vgijssel.nl`); external-dns publishes exactly those two records. Both services move
to **NetBird reverse-proxy custom domains** where **NetBird auto-provisions the public TLS cert**,
and the CNAMEs become Crossplane-managed. So both operators lose every in-scope consumer → removable.
Bonus: eliminates the `txtOwnerId` collision bug class `[[external-dns-txtownerid-collision]]`.
**Nuance:** Omada also serves L4 device-adoption ports (29811-29817, 19810). Expose the **UI via L7**
(NetBird public cert; Omada drops to an internal self-signed cert) and the **device ports via L4**.
Confirm in Phase 0 that devices don't require a publicly-trusted controller cert on the L4 ports
before deleting `certificate-omada.yaml`.

## Architecture Decisions

- **Control plane:** NetBird **Cloud** (`https://api.netbird.io`, kept as a variable/Helm value).
- **Operator:** `oci://ghcr.io/netbirdio/helm-charts/netbird-operator`, **pinned to `0.8.0`**
  (digest `sha256:d836ce83f06e7749f826a2ebe680bbec17a9545c7ed4645c4d6217a472d94b8d`, app `v0.8.0`),
  namespace `netbird`, vendored via `third_party/vendir` + `file://` umbrella `Chart.yaml`.
- **API servers + JWKS:** NetBird **`ClusterProxy`** (auth/impersonation, cluster PKI) at
  `api.<cluster>.vgijssel.nl`. Network JWKS rides the same ClusterProxy: OpenBao's NetBird group is
  bound to `system:service-account-issuer-discovery`; `jwt-network` sets `jwksCaPem` = network CA.
- **Cross-cluster reachability:** `NetworkRouter`/`NetworkResource` expose OpenBao (secret) and Omada
  (network); `Group` + `SetupKey` `autoGroups` gate access.
- **Ingress:** Omada UI + OpenBao UI via **NetBird reverse-proxy custom domains** (L7, NetBird
  public TLS); Omada device ports via L4. No ingress-nginx `loadBalancerClass: tailscale`.
- **DNS + certs:** `provider-upjet-cloudflare` on **network** manages a **single apex wildcard CNAME**
  `*.vgijssel.nl` → `eu1.netbird.services` (DNS-only / grey-cloud), with `vgijssel.nl` registered as the
  NetBird custom domain. NetBird mints the per-service hostnames and the wildcard routes them all — so
  it's **one `Record` MR**, no per-host records. Existing explicit `vgijssel.nl` records are unaffected
  (most-specific-wins). The nested SPEC names (`api.network.vgijssel.nl`, …) resolve via RFC 4592
  deep-wildcard matching, which holds because this migration empties the `network.`/`secret.` subtrees
  (omada/openbao move to NetBird-minted hostnames); **caveat:** if any record is later added directly
  under `network.vgijssel.nl`/`secret.vgijssel.nl`, add an explicit CNAME for the API host then.
  **cert-manager + external-dns removed** (NetBird auto-TLS; Crossplane owns DNS).
- **Cutover:** big-bang per app, **network first**, then secret. Each phase verified on a freshly
  recreated cluster (`stop`→`start`). Preserve `apply.sh`'s label-safety guard `[[fleet-apply-context-clobber]]`.

## Secrets to create in OpenBao (maintainer — seed via `secret:forward` + `secret:auth`)

| kv path | keys | purpose | consumed by |
|---|---|---|---|
| `kv/netbird` | `api_token` | NetBird Cloud **PAT** (management API) | operator secret `netbird-mgmt-api-key` (`NB_API_KEY`), both clusters; seeded by `netbird_auth.sh` |
| `kv/netbird` | `proxy_cname_target` | NetBird proxy CNAME target (`eu1.netbird.services`) | `provider-upjet-cloudflare` Record MRs |
| `kv/network-netbird` | `setup_key` | network peer setup key (autogroup `network-k8s`) | network `SetupKey`/routing peer |
| `kv/secret-netbird` | `setup_key` | secret peer setup key (autogroup `secret-k8s`) | secret `SetupKey`/routing peer |
| `kv/cloudflare` | `credential` | **already exists** (Cloudflare token, Zone:Read + DNS:Edit) | reused by `provider-upjet-cloudflare` |

## Dependency Graph

```
OpenBao secrets seeded (manual)
    │
    ├── vendir: vendor netbird-operator (pin 0.8.0)
    │     └── netbird-operator bundle (ns netbird, PAT secret) ──┐
    │                                                            ├── netbird-config bundles
    │                                                            │   (SetupKey, Group, ClusterProxy,
    │                                                            │    NetworkRouter/NetworkResource,
    │                                                            │    reverse-proxy custom domains)
    ├── network: add Crossplane core + provider-upjet-cloudflare │
    │     └── CNAME Records (api.network, omada.network,         │
    │          api.secret, openbao.secret) → NetBird target      │
    │                                                            │
    └── cross-cluster edits: OpenBao NetBird group → OIDC RBAC;  ┘
        secret jwt-network jwksUrl + jwksCaPem; network ESO store host
            │
            └── REMOVE tailscale (bundles/scripts/vendir/ACL) + cert-manager + external-dns
```

Build bottom-up; **network vertical slice first, then secret**.

---

## Phase 0 — De-risk spike (network cluster, throwaway). Decision gate before Phase 1.

### Task 0.1: Operator + peer enrollment
- **Acceptance:** netbird-operator (0.8.0) installs on a fresh `network` cluster with a hand-made
  `netbird-mgmt-api-key`; a `SetupKey` + `NetworkRouter` routing peer shows **Connected** in group `network-k8s`.
- **Verify:** `kubectl -n netbird get pods`; NetBird dashboard; `kubectl get setupkey,networkrouter -A`.

### Task 0.2: ClusterProxy kubectl (impersonation) + custom domain
- **Acceptance:** `ClusterProxy` (auth/impersonation) exposes the network apiserver; `netbird
  kubernetes write-kubeconfig` yields a working kubeconfig; kubectl maps NetBird identity→RBAC.
  Confirm NetBird accepts registering `vgijssel.nl` as the custom domain expecting a single apex
  `*.vgijssel.nl` CNAME → `eu1.netbird.services`; capture the endpoint, the cluster-PKI cert, and the
  exact `proxy_cname_target`.
- **Verify:** `kubectl get ns` through the proxy; record `proxy_cname_target` (expected `eu1.netbird.services`).

### Task 0.5: **Live-validate nested hostname forwarding through the apex wildcard** (maintainer's ask)
- **Acceptance:** with the single `*.vgijssel.nl` → `eu1.netbird.services` wildcard live and `vgijssel.nl`
  registered in NetBird, a **nested** hostname like `api.network.vgijssel.nl` actually resolves through
  the wildcard and forwards into the NetBird proxy (i.e. RFC 4592 deep-match works once the `network.`
  subtree is empty). Test all four target names: `api.network`, `api.secret`, `omada.network`, `openbao.secret`.
- **Verify:** `dig api.network.vgijssel.nl` returns the CNAME → `eu1.netbird.services`; an end-to-end
  request to `https://api.network.vgijssel.nl/...` lands on the NetBird-fronted backend.
- **If nested names do NOT forward:** fall back to explicit per-host CNAME `Record` MRs (still one
  Cloudflare change type, just four records) — report before switching. Flat names (`api-network.vgijssel.nl`)
  are the other fallback.

### Task 0.3: **JWKS through the same ClusterProxy** (the maintainer's key question)
- **Acceptance:** OpenBao (as a NetBird peer, token-less HTTP GET) fetches `/openid/v1/jwks` through
  the ClusterProxy, authorized by binding its NetBird group to `system:service-account-issuer-discovery`;
  TLS validated with the network cluster CA (`jwksCaPem`).
- **Verify:** from a peer, `curl --cacert <network-ca> https://api.network.vgijssel.nl/openid/v1/jwks` returns keys.
- **If it fails:** STOP. Report the exact failure (identity not propagated for token-less client, etc.)
  to the maintainer before building any alternative.

### Task 0.4: NetBird TLS + Omada L4 cert nuance
- **Acceptance:** confirm NetBird auto-provisions a publicly-trusted cert for an L7 custom domain
  (proves cert-manager removable for Omada/OpenBao UIs); confirm Omada device-adoption L4 ports work
  without a publicly-trusted controller cert.
- **Verify:** browse an L7 test domain (valid public cert); adopt/keep a device over L4.

### ✅ Checkpoint: Phase 0
- [ ] Peer Connected; ClusterProxy kubectl works; **JWKS-via-ClusterProxy works** (or reported blocked).
- [ ] NetBird auto-TLS confirmed; Omada L4 cert nuance resolved.
- [ ] **Nested hostnames (`api.network.vgijssel.nl`, …) forward into NetBird via the apex `*.vgijssel.nl` wildcard** (Task 0.5).
- [ ] `proxy_cname_target` recorded. **Review with maintainer before Phase 1.**

---

## Phase 1 — `network` cluster migration (vertical slice)

### Task 1.1: Vendor the NetBird operator chart
- Add `charts/netbird-operator` (OCI, `0.8.0`) to `third_party/vendir/vendir.yml`; sync; commit lock.
- **Verify:** `ls third_party/vendir/charts/netbird-operator`; lock pins 0.8.0. **Files:** `vendir.yml`, `vendir.lock.yml`. **Scope:** S.

### Task 1.2: `netbird-operator` Fleet bundle
- Umbrella `Chart.yaml` (`file://`) + `values.yaml` (mgmt URL var, PAT secret ref) + `fleet.yaml`
  (label `netbird-operator`, ns `netbird`, targets `network`+`secret`). Replaces `apps/platform/src/tailscale`.
- **Verify:** `kubectl -n netbird rollout status deploy/netbird-operator`. **Files:** `apps/platform/src/netbird-operator/*`. **Deps:** 1.1. **Scope:** M.

### Task 1.3: `netbird_auth.sh` (replaces `tailscale_auth.sh`)
- Rename script; seed `netbird/netbird-mgmt-api-key` (`NB_API_KEY`←`kv/netbird#api_token`) + network
  `setup_key` (←`kv/network-netbird`) from the secret cluster's OpenBao. Rename moon task
  `tailscale_auth`→`netbird_auth`; update `start.sh`.
- **Verify:** `moon run network:netbird_auth`; `kubectl -n netbird get secret netbird-mgmt-api-key`.
  **Files:** `apps/network/scripts/netbird_auth.sh` (renamed), `start.sh`, `moon.yml`. **Deps:** 1.2. **Scope:** M.

### Task 1.4: `netbird-config` bundle for `network`
- `apps/network/src/netbird-config/`: `SetupKey` (autoGroups `network-k8s`), `Group`(s), `ClusterProxy`
  (apiserver → `api.network.vgijssel.nl`, impersonation SA + RBAC), and **replace** the anonymous
  `clusterrolebinding-oidc-discovery.yaml` (`system:unauthenticated`) with a binding of the secret
  cluster's OpenBao **NetBird group** to `system:service-account-issuer-discovery`. `fleet.yaml`
  `dependsOn` operator; targets `network`.
- **Verify:** `kubectl get clusterproxy,setupkey -A`; JWKS reachable per Phase 0.3.
  **Files:** `apps/network/src/netbird-config/*`, edit `apps/network/src/config/clusterrolebinding-oidc-discovery.yaml`. **Deps:** 1.2, 1.3. **Scope:** M.

### Task 1.5: Omada exposure over NetBird
- Edit `apps/network/src/omada/templates/service-omada.yaml`: drop `loadBalancerClass: tailscale` +
  `tailscale.com/*` + `external-dns` annotations → ClusterIP. Expose UI via a NetBird **L7** custom
  domain (`omada.network.vgijssel.nl`, NetBird TLS) and device ports via **L4** `NetworkResource`.
  **Delete** `apps/network/src/omada/templates/certificate-omada.yaml` and switch Omada to an internal
  self-signed cert (per Phase 0.4).
- **Verify:** UI at `omada.network.vgijssel.nl` (NetBird cert); devices adopt over L4.
  **Files:** `service-omada.yaml`, remove `certificate-omada.yaml`, `omada/values.yaml`, NetworkResource in `netbird-config`. **Deps:** 1.4. **Scope:** M.

### Task 1.6: network ESO/config rewire
- `externalsecret-operator-oauth.yaml` → NetBird setup-key ExternalSecret (`kv/network-netbird`);
  `apps/network/src/config/fleet.yaml` drops the Tailscale egress; point the remote `openbao`
  ClusterSecretStore at the NetBird-reachable OpenBao host.
- **Verify:** `clustersecretstore openbao` Ready; a known ES syncs. **Files:** `apps/network/src/config/{externalsecret-operator-oauth.yaml,fleet.yaml,clustersecretstore-openbao.yaml}`. **Deps:** 1.4. **Scope:** M.

### Task 1.7: Add Crossplane + Cloudflare provider to `network`; manage all CNAMEs
- Add `apps/network/src/crossplane/` (core, targets `network`), `apps/network/src/crossplane-provider/`
  (`provider-upjet-cloudflare`, pinned), and `apps/network/src/cloudflare-config/` (ProviderConfig from
  `kv/cloudflare#credential` via ESO + a **single `Record` MR**, `deletionPolicy: Orphan`, DNS-only):
  `*.vgijssel.nl` CNAME → `kv/netbird#proxy_cname_target` (`eu1.netbird.services`). Must **not** be
  proxied (grey-cloud). Vendor the crossplane core chart if not already vendored; `fleet.yaml`
  `dependsOn` ordering (core → provider → config).
- **Verify:** `kubectl get providers,records -A`; `dig api.network.vgijssel.nl CNAME` → `eu1.netbird.services`
  (proves the nested name is caught by the apex wildcard — see Task 0.5); confirm existing `*.vgijssel.nl`
  records still resolve. **Files:** `apps/network/src/{crossplane,crossplane-provider,cloudflare-config}/*`, maybe `vendir.yml`. **Deps:** 1.6. **Scope:** L → split if needed.

### Task 1.8: Remove network Tailscale surface
- Delete `apps/network/src/tailscale-proxygroup/`; drop `network` from `apps/platform/src/tailscale`
  (retarget `secret`-only until Phase 4); purge `tailscale`/`tail2c33e2.ts.net`/ProxyGroup refs under `apps/network`.
- **Verify:** `grep -ri "tailscale\|tail2c33e2\.ts\.net\|ProxyGroup" apps/network` → nothing. **Scope:** S.

### ✅ Checkpoint: network migrated (fresh cluster)
- [ ] `network:stop`→`start` clean; peer **Connected** (`network-k8s`).
- [ ] kubectl via ClusterProxy; **JWKS via ClusterProxy** works; Omada UI (NetBird cert) + devices work.
- [ ] All CNAMEs resolve via Crossplane; network ESO syncs from `secret` OpenBao over NetBird.
- [ ] No Tailscale refs under `apps/network`. **Review with maintainer.**

---

## Phase 2 — `secret` cluster migration (vertical slice)

### Task 2.1: `netbird-config` bundle for `secret`
- `apps/secret/src/netbird-config/`: `SetupKey` (autoGroups `secret-k8s`), `Group`, `ClusterProxy`
  (`api.secret.vgijssel.nl`), `NetworkRouter`/`NetworkResource` exposing OpenBao to `network-k8s`.
  `fleet.yaml` `dependsOn` operator; targets `secret`.
- **Verify:** `kubectl get clusterproxy,networkresource -A`; network peer reaches OpenBao. **Deps:** 1.2/1.3 pattern. **Scope:** M.

### Task 2.2: Repoint `jwt-network` (jwksUrl + jwksCaPem)
- Edit `apps/secret/src/openbao-config/authbackend-jwt-network.yaml`: `jwksUrl` →
  `https://api.network.vgijssel.nl/openid/v1/jwks`, **add `jwksCaPem`** = network cluster CA (per
  Phase 0.3). Keep `Orphan`, external-name adoption, `boundIssuer`.
- **Verify:** `authbackend jwt-network` Synced/Ready (network reachable). **Scope:** S.

### Task 2.3: secret ESO/ingress rewire
- `externalsecret-operator-oauth.yaml` → NetBird setup-key ES (`kv/secret-netbird`). Expose OpenBao UI
  via a NetBird L7 custom domain (`openbao.secret.vgijssel.nl`, NetBird TLS) instead of the Tailscale
  ingress: `ingress-nginx/values.yaml` drops `loadBalancerClass: tailscale` (ClusterIP), and the
  NetBird reverse-proxy fronts it. **Delete** `certificate-secret.yaml` (NetBird provides the cert).
- **Verify:** `curl https://openbao.secret.vgijssel.nl/v1/sys/health` over NetBird; `secret:forward`+`secret:auth`.
  **Files:** `apps/secret/src/config/{externalsecret-operator-oauth.yaml,ingress-openbao.yaml,certificate-secret.yaml(remove)}`, `apps/platform/src/ingress-nginx/values.yaml`. **Deps:** 2.1. **Scope:** M.

### Task 2.4: Remove secret Tailscale surface + shared operator + vendir entry
- Delete `apps/secret/src/tailscale-proxygroup/`; remove `apps/platform/src/tailscale/` entirely;
  remove `charts/tailscale-operator` from `vendir.yml`+lock; purge refs under `apps/secret`/`apps/platform`.
- **Verify:** `grep -ri "tailscale\|tail2c33e2\.ts\.net\|ProxyGroup" apps/secret apps/network apps/platform` → nothing. **Scope:** M.

### ✅ Checkpoint: secret migrated (fresh cluster) — end-to-end
- [ ] `secret:stop`→`start` clean; peer **Connected** (`secret-k8s`).
- [ ] `kubectl --server https://api.secret.vgijssel.nl` works.
- [ ] `jwt-network` reconciles (fetches network JWKS via ClusterProxy, `jwksCaPem`); **network ESO
      logs into secret OpenBao's `jwt-network` backend and syncs a known kv key**.
- [ ] OpenBao UI reachable over NetBird (NetBird cert); `secret:forward`+`secret:auth` work.

---

## Phase 3 — Remove cert-manager + external-dns + account cleanup (Ask-first for account edits)

### Task 3.1: Remove cert-manager
- Delete `apps/platform/src/cert-manager/`, `apps/platform/src/config/clusterissuer-letsencrypt-prod.yaml`,
  and any remaining `Certificate`/`cert-manager.io` refs in scope (omada+secret certs already gone).
  Remove the DNS-01 cloudflare-token ExternalSecret if unused after external-dns removal.
- **Verify:** `grep -ri "cert-manager\|ClusterIssuer\|letsencrypt" apps/network apps/secret apps/platform` → nothing in scope. **Scope:** S.

### Task 3.2: Remove external-dns
- Delete `apps/platform/src/external-dns/` and `apps/platform/src/config/externalsecret-external-dns.yaml`;
  confirm all DNS records are now Crossplane-managed (Task 1.7).
- **Verify:** `grep -ri "external-dns" apps/network apps/secret apps/platform` → nothing; records still resolve. **Scope:** S.

### Task 3.3: Delete Tailscale account artifacts (maintainer, Ask-first)
- Delete Tailscale Services/OAuth clients/ACL for these clusters + `kv/*-tailscale-*`. **Confirm scope
  before touching shared policy** (PiKVM/other peers) `[[pikvm-netbird-dns]]`.

### Task 3.4: Final assertion + fmt/check
- Repo-wide `grep -ri "tailscale\|tail2c33e2\.ts\.net\|ProxyGroup\|cert-manager\|external-dns" apps/`
  clean in scope; `trunk fmt` + `trunk check`; full fresh dual-cluster bring-up passing SPEC §Testing 1–7.

### ✅ Checkpoint: complete
- [ ] cert-manager + external-dns gone; NetBird owns all TLS + Crossplane owns all DNS.
- [ ] SPEC §Testing 1–7 pass on fresh clusters; `trunk check` clean.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Token-less OpenBao GET may not get a NetBird identity → JWKS-via-ClusterProxy fails | High | **Phase 0.3 proves it first; STOP + report before any fallback** (maintainer instruction) |
| ClusterProxy cert is cluster PKI, not public | Med | `jwt-network` sets `jwksCaPem` = network CA; kubectl uses `write-kubeconfig` CA |
| Removing cert-manager breaks Omada L4 device adoption if devices need a trusted cert | Med | Phase 0.4 confirms L4 works with self-signed before deleting `certificate-omada.yaml` |
| Adding Crossplane to network is a new heavy dependency | Med | Swaps two operators (cert-manager+external-dns) for one; pin provider version/digest |
| Single network Crossplane owns secret's CNAMEs (cross-app) | Low | Region-stable proxy target removes ordering coupling; records `Orphan` |
| `fleet-apply` context clobber | High | Preserve `apply.sh` label guard both apps; check current-context before `:start` |
| NetBird account-level policy edit affects PiKVM | Med | Scope new groups (`network-k8s`/`secret-k8s`) only; confirm before shared-policy edits |
| Big-bang window: secret can't reach network mid-cutover | Low | Network-first; `jwt-network` only reconciles once network is up |

## Open Questions (resolve in Phase 0)

1. Whether a token-less HTTP client (OpenBao) receives a NetBird identity for ClusterProxy impersonation.
2. Whether **nested** hostnames (`api.network.vgijssel.nl`, …) forward into NetBird via the single apex
   `*.vgijssel.nl` → `eu1.netbird.services` wildcard once the `network.`/`secret.` subtrees are empty
   (RFC 4592 deep-match). Live-validated in Task 0.5; fallback = explicit per-host CNAMEs.
3. Omada L4 device-adoption cert requirement (drop `certificate-omada.yaml` or keep an internal cert).
4. `provider-upjet-cloudflare` exact version/digest to pin; whether crossplane core needs vendoring on network.

## Deliverables note

Plan saved to `tasks/plan.md`, checkbox list to `tasks/todo.md`. **Not yet implemented** — presented
for maintainer review.
