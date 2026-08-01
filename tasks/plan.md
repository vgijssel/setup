# Plan: Shared `netbird-reverse-proxy` platform chart + expose PiKVM

Spec: `apps/network/src/netbird-reverse-proxy/SPEC.md` (approved).
Branch: `mg/feat/expose-pikvm-ui`.

This plan turns the approved spec into dependency-ordered, verifiable work. It front-loads
the two structural unknowns (chart composition; NetBird service target shape) as **spikes**,
because they decide the shape of everything downstream. Production changes are sequenced so
the **live secret cluster migrates in-place first** (proving no OpenBao regression) before
the new network path is built.

---

## Guiding constraints (from repo + memories)

- `bin/fleet-apply` finds bundles by `find apps -type f -name fleet.yaml`; a chart dir with
  no `fleet.yaml` is never deployed standalone. Bundle name = `<group>-<component>`.
- Fleet builds umbrella `file://` chart deps **at apply time** from repo root; **never commit
  `charts/*.tgz` or `Chart.lock`** (gitignored under `apps/*/src`).
- Fleet applies a bundle as **one atomic Helm release**; a CR may only live in a bundle whose
  CRD is installed by a *different* bundle it `dependsOn` (here: `opentofu.upbound.io` from
  `crossplane-provider`, cert-manager, external-secrets).
- Every `fleet.yaml` MUST gate on `cluster.vgijssel.nl/name` (targetCustomizations) — no
  bundle deploys everywhere.
- Verify `kubectl config current-context` before every `bin/fleet-apply` (context-clobber
  outage history).
- Keep NetBird operator `v0.7.0`. Pin every version. Secrets only via ESO/OpenBao.
- OpenBao `network-*` read policy lives in `apps/secret/src/openbao-config` (Crossplane MRs).

---

## Component / dependency graph

```
Phase 0  Spikes (no prod change)
  S1 chart-composition ─┐
  S2 service-target ────┼──► decisions feed all build phases
  S3 peer/skip_tls ─────┘
  S4 domain-routing safety (read-only)

Phase 1  Shared chart  apps/platform/netbird-reverse-proxy   ── depends on S1
              │ (file:// consumed by ↓)
Phase 2  Secret migration (in-place, no behavior change)     ── depends on P1
              │ proves adoption of Helm release + tofu state
Phase 3  Network proxy token → OpenBao                        ── independent, can parallel P1/P2
Phase 4  Network thin bundle + PiKVM services workspace       ── depends on P1, P3, S2/S3
Phase 5  End-to-end verify + self-heal + no-regression        ── depends on P4
Phase 6  Docs / memory / optional goss                        ── depends on P5
```

Parallelizable: P3 (token minting) alongside P1/P2. Everything else is sequential.

---

## Phase 0 — Spikes (decide structure; zero production writes)

### S1. Chart composition — resolve nested `file://`
**Question:** downstream thin bundle → platform chart → vendored christianhuth chart is two
`file://` levels. Does `fleet apply`/`helm dependency build` resolve it transitively?
**Do:** locally `helm dependency build` a throwaway downstream umbrella pointing at a platform
umbrella that itself deps the vendored chart; observe whether the vendored subchart lands.
**Decide (in priority order):**
- (A) If transitive build works → nested umbrellas (least code).
- (B) Else → platform chart **inlines** the reverse-proxy Deployment/Service (2 templates
  adapted from the vendored chart), so it has **no** subchart dep; downstream is a single
  `file://` level. **This is the recommended default if there's any doubt** — most robust,
  self-contained, still pins the image.
**Output:** a one-paragraph decision recorded at top of the platform chart's `Chart.yaml`
comment. Gate: P1 cannot start until S1 is decided.

### S2. NetBird reverse-proxy service shape for a mesh peer (PiKVM)
**Question:** how does `POST /api/reverse-proxies/services` express an upstream that is a
**mesh peer** (PiKVM :443, self-signed), given the OpenBao example uses
`target_type: cluster` + `direct_upstream` for an in-cluster ClusterIP?
**Do:** with the network cluster's admin PAT, `GET /api/reverse-proxies/services` and the API
schema; inspect the existing OpenBao service object; try (read-only / dry) the accepted
`target_type` values and `options` keys. Confirm whether `target_type: peer` exists and what
`target_id` it wants (peer id).
**Decide the PiKVM target block**, preferring whichever is proven:
- (A) `target_type: peer`, `target_id: <peer-id>`, `port: 443`, `protocol: https`,
  `options: { skip_tls_verify: true }`; **or**
- (B) OpenBao-style `direct_upstream` to the PiKVM **mesh IP**:443 https skip-verify (the
  network proxy pod is itself a mesh peer, so its own stack can dial the PiKVM peer IP).
**Output:** the exact `data = jsonencode({...})` target block for Phase 4.

### S3. Peer-id resolution + `skip_tls_verify` key
**Question:** `netbirdio/netbird` v0.0.9 has no `netbird_peer` data source (only `netbird_group`
+ `netbird_reverse_proxy_clusters`). How do we resolve the PiKVM peer id (if S2 picks A), and
what is the exact `skip_tls_verify` option key?
**Do:** confirm via API (`GET /api/peers?name=…` / by mesh IP). If no clean HCL data source,
use a `restapi` data-source GET filtered by name/IP, **or** fall back to S2-(B) (mesh IP, no
peer id needed). Confirm the option key spelling from the live service schema.
**Output:** either the peer-id lookup HCL, or the decision to use S2-(B).

### S4. Domain most-specific routing safety (read-only)
**Question:** does registering `network.vgijssel.nl` as a reverse-proxy domain +
`*.network.vgijssel.nl` CNAME disturb `omada.network.vgijssel.nl` (external-dns A →
ClusterIP, NBResource path)?
**Do:** confirm Omada's specific A record shadows the wildcard (memory
`cloudflare-wildcard-arbitrary-depth`); confirm the reverse-proxy-domain registration is a
separate NetBird subsystem from NBResource routing. Check whether a `*.network.vgijssel.nl`
CNAME is even needed (apex `*.vgijssel.nl` already resolves arbitrary depth) — prefer the
minimal DNS change.
**Output:** go/no-go + the minimal DNS the domain workspace should create.

---

## Phase 1 — Shared platform chart (`apps/platform/netbird-reverse-proxy`)

Build the reusable chart per S1. Parameterized only by `domain` + `tokenKvPath`.

- **1a.** `Chart.yaml` (+ vendored dep or inlined templates per S1), `values.yaml` with the
  param contract and the subchart proxy/tls/securityContext defaults (private:true,
  NET_BIND_SERVICE, ClusterIP, managementServer Cloud default, tls.source=secret).
- **1b.** `templates/certificate-netbird-reverse-proxy.yaml` — `dnsNames: ["*.{{ .Values.domain }}"]`.
- **1c.** `templates/externalsecret-netbird-proxy-token.yaml` — `remoteRef.key: {{ .Values.tokenKvPath }}`.
- **1d.** `templates/cronjob-watchdog.yaml` + `serviceaccount-watchdog.yaml` — verbatim from
  the current secret bundle (parameter-free).
- **1e.** `templates/workspace-reverse-proxy-domain.yaml` — Crossplane opentofu that registers
  `netbird_reverse_proxy_domain({{ .Values.domain }})` + the minimal Cloudflare record from S4.
  Keep `providerConfigRef: default`; keep the tofu state suffix a stable function of the domain
  so it can adopt the migrated secret workspace state (see P2).

**Verify:** `helm template` with `domain=example.vgijssel.nl` renders all objects with correct
substitution; `trunk check`/helm lint pass. No cluster apply yet.
**Files:** ~6 (all new, under the new chart dir).

---

## Phase 2 — Migrate the live secret cluster in-place (no behavior change)

Prove the chart by cutting OpenBao's proxy over to it with **zero** regression. **Ask-first
gate before applying** (live critical path).

- **2a.** Replace `apps/secret/src/netbird-reverse-proxy/` contents with a thin bundle:
  `Chart.yaml` (`file://../../../platform/netbird-reverse-proxy` per S1) + `fleet.yaml`
  (`helm.releaseName: netbird-reverse-proxy` unchanged; `helm.values` domain=`secret.vgijssel.nl`,
  tokenKvPath=`secret-netbird-proxy`; `dependsOn` netbird-operator + crossplane-provider +
  secret-cloudflare-config; `targetCustomizations` secret). Delete the old
  `templates/*` (now in the chart).
- **2b.** Move the domain workspace: delete
  `apps/secret/src/cloudflare-config/workspace-reverse-proxy-dns-secret.yaml`; the chart's
  `workspace-reverse-proxy-domain.yaml` now owns it. **Keep the k8s Workspace `metadata.name`
  and the tofu state `secret_suffix` identical** so Crossplane/opentofu **adopts** existing
  state (no `netbird_reverse_proxy_domain` destroy/recreate).
- **2c.** Leave `apps/secret/src/cloudflare-config/workspace-reverse-proxy-services.yaml`
  (OpenBao service) **untouched**.

**Verify (adoption gate — all must hold):**
1. `helm template` of the new secret bundle == the pre-refactor rendered objects (diff only
   in labels/annotations Fleet adds), especially the Deployment, Certificate, ExternalSecret.
2. On apply (secret context): Helm release `netbird-reverse-proxy` is **upgraded, not
   replaced**; pod not recreated unnecessarily; `Certificate` stays Ready (no re-issue).
3. The migrated domain Workspace shows **no diff / adopts** (no `netbird_reverse_proxy_domain`
   replacement) — check the Workspace's tofu plan/status.
4. `openbao.secret.vgijssel.nl` still serves a valid cert and is mesh-reachable; network ESO
   `SecretSynced`.
**Rollback:** revert the bundle dir; re-apply (state was adopted, so revert is clean).
**Files:** ~4 changed (thin bundle 2 files, 1 delete, chart already exists).

---

## Phase 3 — Provision the network BYOP proxy token (parallelizable)

- **3a.** `put_netbird_pikvm_proxy_auth.sh` (clone of `apps/secret/scripts/put_netbird_proxy_auth.sh`):
  `POST /api/reverse-proxies/proxy-tokens` (name `network-byop-proxy`) → write
  `kv/network-netbird-pikvm-proxy#token` in the secret cluster's OpenBao (break-glass admin
  token path). Idempotent; `FORCE=1` to re-mint. Add a `moon` task. **Ask-first** before running.
- **3b.** Ensure the OpenBao `network-eso` read policy covers `kv/data/network-netbird-pikvm-proxy`
  (or the existing `kv/data/network-*` prefix already does) — extend the Crossplane policy MR
  in `apps/secret/src/openbao-config` if needed.

**Verify:** the token exists in OpenBao (`bao kv get`); an `ExternalSecret` referencing
`network-netbird-pikvm-proxy` would sync (dry check the policy grants read).
**Files:** 1 new script + `moon.yml` task (+ maybe 1 policy MR).

---

## Phase 4 — Network thin bundle + PiKVM services workspace

- **4a.** `apps/network/src/netbird-reverse-proxy/`: remove stale `charts/*.tgz`; add thin
  bundle `Chart.yaml` (`file://` platform chart) + `fleet.yaml`
  (releaseName `netbird-reverse-proxy`; values domain=`network.vgijssel.nl`,
  tokenKvPath=`network-netbird-pikvm-proxy`; dependsOn netbird-operator + crossplane-provider +
  network-cloudflare-config; targetCustomizations network).
- **4b.** `apps/network/src/cloudflare-config/workspace-reverse-proxy-services.yaml` (new):
  the PiKVM service via `restapi` per **S2/S3** — `private:true`, `access_groups:[homelab]`,
  target block from S2, `precondition` gating on `network.vgijssel.nl` proxy cluster online.
- **4c.** Apply on network context (verify context first). Order via `dependsOn`: operator →
  cloudflare-config (providerconfig+secrets) → reverse-proxy (proxy pod + domain) → services.

**Verify:**
1. Bundle `Ready`; proxy Deployment `Available`; `Certificate` Ready (`*.network.vgijssel.nl`);
   ESO `SecretSynced` from `network-netbird-pikvm-proxy`.
2. `data.netbird_reverse_proxy_clusters` now lists `network.vgijssel.nl`.
3. The PiKVM `restapi_object` is `enabled`; NetBird bound it to the `network.vgijssel.nl`
   proxy cluster (not eu1).
**Files:** ~4 (3 new + 1 delete).

---

## Phase 5 — End-to-end verification, self-heal, no-regression

- **5a.** From a `homelab` mesh client (Mac): `curl -sv https://pikvm.network.vgijssel.nl` →
  issuer Let's Encrypt, subject `*.network.vgijssel.nl`, **no verify error**; browser loads the
  PiKVM UI with no warning; video WebSocket + terminal work.
- **5b.** Mesh-only: same URL with NetBird down must fail.
- **5c.** ISO-upload probe (Risk #6): attempt a large MSD upload; if it fails through the proxy,
  document the `pikvm.enigma.vgijssel.nl` fallback (no code change).
- **5d.** No-regression: `omada.network.vgijssel.nl` still loads; `moon run pikvm:apply -- --dry`
  clean; PiKVM goss `validate` passes; OpenBao path (Phase 2) still green.
- **5e.** Self-heal: wedge the network proxy's embedded client (or delete its peer); confirm the
  watchdog rollout-restarts within ~5 min and reachability returns.

**Verify:** all of the above observed. This phase is the Success Criteria checklist.

---

## Phase 6 — Docs, memory, optional goss

- **6a.** Move `SPEC.md` into `apps/platform/netbird-reverse-proxy/`.
- **6b.** Update memory: new `netbird-reverse-proxy` shared-chart pattern + PiKVM exposure
  (extend/curate `pikvm-apply-ops` / `openbao-netbird-reverse-proxy` / the reverse-proxy
  memories); record the S1/S2 decisions and the ISO-upload caveat.
- **6c.** (Optional) add a goss assertion in `apps/pikvm/files/goss.yaml` that the proxy path
  is healthy (substring-safe) — **Ask-first** (device change).

**Verify:** memory index updated; SPEC relocated; goss (if added) 29/29 and `pikvm:apply --dry`
clean.

---

## Risk register (carried from spec; owners = phase)

| # | Risk | Mitigation | Phase |
|---|------|-----------|-------|
| 1 | Live secret migration recreates release/tofu state | adoption gate: stable release name + state suffix; diff before apply; ask-first | P2 |
| 2 | Nested `file://` deps don't build | inline templates fallback (self-contained platform chart) | S1/P1 |
| 3 | `helm.values` nesting depth wrong | verify key under chart name via `helm template` | P1/P2/P4 |
| 4 | `target_type: peer` / peer-id unsupported | fall back to `direct_upstream` → PiKVM mesh IP | S2/S3/P4 |
| 5 | `skip_tls_verify` key spelling | confirm from live service schema | S2/S3 |
| 6 | ~1 GB ISO upload blocked by proxy | keep `pikvm.enigma` ingress as upload path | S(doc)/P5 |
| 7 | WebSocket drops | `maxSessionIdleTimeout` empty=no cap; verify | P5 |
| 8 | `network.vgijssel.nl` disturbs Omada DNS | S4 read-only check; minimal DNS | S4/P4 |
| 9 | `network-eso` lacks new KV path | extend policy MR | P3 |

---

## Definition of done

All spec Success Criteria met (P5), the shared chart is the single source for both clusters
(P1/P2/P4), OpenBao unchanged, nothing sensitive committed, `trunk check` clean, memory + SPEC
updated (P6).
