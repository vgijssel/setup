# Implementation Plan: `network` cluster (Omada on the tailnet)

Companion to `apps/network/SPEC.md`. Read the spec first — this plan assumes its decisions.
Status: **APPROVED — autonomous execution.** Standing authorization from the operator: implement the
best-practice/recommended approach and **modify live systems** (the `secret` cluster, tailnet ACLs,
1Password, OpenBao) **without pausing for per-change approval**. Checkpoints are self-verification gates, not
human-approval gates — verify, log the result, and continue. Only stop if a verification fails and can't be
resolved, or if a step would be destructive and irreversible beyond the intended change.

---

## Overview

Build a new self-managed vind cluster `network` running the Omada controller, exposed on the tailnet at
`https://omada.network.vgijssel.nl` with a Let's Encrypt cert on a stable Tailscale VIP. It consumes secrets
from the `secret` cluster's OpenBao remotely via JWT auth. The work spans three code areas
(`apps/network/` new, `apps/platform/` multi-cluster refactor, `apps/secret/src/openbao-config/` additive
grant) plus out-of-band tailnet ACL + 1Password steps.

The plan is sliced vertically: each phase leaves the system in a working, verifiable state, and the two
highest-risk unknowns (OCI chart vendoring, UDP-over-Tailscale) are spiked first so we fail fast.

---

## Architecture Decisions (recap + new)

- **JWT auth, live JWKS.** OpenBao (on `secret`) validates `network` SA tokens against the network
  cluster's JWKS fetched **live** from `network_jwks_url` — the `network-operator` noauth API-server proxy
  on the tailnet (`https://network-operator.<tailnet>.ts.net/openid/v1/jwks`), reached via a reverse egress
  (ACL-C). `jwks_url` is decoupled from `bound_issuer`, so tokens keep `iss
  https://kubernetes.default.svc.cluster.local` while keys come from the tailnet URL. Bound issuer + audience
  `openbao` + bound subject = the `network` ESO service account. **Trade-off:** this inverts the trust
  direction — `secret` now depends on reaching `network` at auth time — but the operator hostname is stable,
  so keys are never re-extracted into `secret` on a vind recreate (supersedes the original static-JWKS design).
- **Platform refactor = Fleet targeting.** `targets`+`clusterSelector` gate bundle membership per cluster
  (ingress-nginx → `secret` only); `targetCustomizations` parameterize per-cluster values. Keyed on label
  `cluster.vgijssel.nl/name` set on the Fleet `local` Cluster by each `apply.sh`.
- **Config split.** The shared platform `config` bundle keeps the identical `ClusterIssuer` + the four
  `ExternalSecret`s (they only reference `secretStoreRef: openbao` by name). The **`ClusterSecretStore` is
  per-cluster** — `secret` keeps its in-cluster k8s-auth store (gated to `secret`), `network` owns a remote
  JWT-auth store. This is what lets one set of ExternalSecrets serve both clusters.
- **New: in-cluster tailnet egress (R8).** `network` ESO reaches `secret.vgijssel.nl` over the tailnet via a
  **Tailscale egress** the operator provisions (`tailscale.com/tailnet-fqdn: secret.vgijssel.nl`), preserving
  SNI so the LE cert stays valid. The tailscale operator comes up from the bootstrap-seeded `operator-oauth`
  secret *before* ESO works, so the egress path exists before ESO needs it.
- **External MongoDB.** Omada chart 1.4.1 runs rootless with external MongoDB; a pinned `network-mongodb`
  bundle provides it; Omada wires via `config.externalMongoDBUrlSecret`.
- **Omada exposed directly** via one Tailscale `LoadBalancer` Service (all documented ports); cert mounted at
  `/cert` (`config.tlsSecretName`). No ingress-nginx on `network`.

---

## Dependency Graph

```
T1 vendir(omada+mongo) ─────────────┐
T2 UDP spike ───────────────(informs T13; can fail → TCP-only fallback)
                                     │
T3 cluster label + targeting ──┐     │
   └─ T4 param platform bundles ┴─ T5 config split ── Checkpoint A (secret unchanged)
                                             │
T6 network start/stop ── T7 network apply ───┤
                                             │
T8 OpenBao jwt grant (secret) ──┐            │
T9 network bootstrap (issuer/JWKS,│           │
   operator-oauth) ──────────────┴─ T10 egress + CSS(jwt) + ExternalSecrets ── Checkpoint B (secrets sync)
                                             │
                              T11 mongodb ── T12 omada (needs T1,T10,T11) 
                                             │
                              T13 VIP+ports (needs T2 result) ── T14 cert mount ── Checkpoint C (https valid)
                                             │
                              T15 adoption ── T16 idempotence/teardown/polish ── Done
```

Bottom-up: de-risk → platform foundation → empty cluster → secrets → data+app → exposure → adoption.

---

## Task List

### Phase 0 — De-risk (fail fast)

#### T1: Vendor the Omada + MongoDB charts
**Description:** Add the OCI Omada chart and a pinned MongoDB chart to `third_party/vendir/vendir.yml` and
sync them into `third_party/vendir/charts/`. Proves OCI vendoring works and the MongoDB image is pullable
(R6) before anything depends on them.
**Acceptance criteria:**
- [ ] `vendir.yml` has entries for `omada-controller-helm` (OCI `oci://registry-1.docker.io/mbentley`, v1.4.1) and a pinned, maintained MongoDB chart.
- [ ] `charts/omada-controller-helm/` and `charts/mongodb/` (or chosen name) are populated; `vendir.lock.yml` updated.
**Verification:**
- [ ] `moon run //third_party/vendir:build` succeeds; `moon run //third_party/vendir:test` (lock diff) clean.
- [ ] `helm template` of each vendored chart renders without error.
**Dependencies:** None
**Files:** `third_party/vendir/vendir.yml`, `third_party/vendir/vendir.lock.yml`, `third_party/vendir/charts/**` (generated)
**Scope:** S

#### T2: UDP-over-Tailscale-LoadBalancer spike
**Description:** Confirm a Tailscale `LoadBalancer` Service (with a ProxyGroup) actually forwards **UDP** from
a tailnet host (R2). Use a throwaway UDP echo Service on the existing `secret` cluster or a scratch `network`
cluster. Records the go/no-go for exposing Omada's UDP ports; if it fails, we fall back to TCP-only + Inform
URL (still satisfies tailnet adoption per R1).
**Acceptance criteria:**
- [ ] A Tailscale LB Service exposing a UDP port gets a VIP and is reachable via `nc -u` from a tailnet host, OR the limitation is documented with the TCP-only fallback confirmed.
**Verification:**
- [ ] `nc -vzu <vip> <port>` succeeds from a tailnet host (or documented failure + fallback decision).
**Dependencies:** None (uses an existing cluster)
**Files:** none committed (scratch manifests) — record result in this plan / SPEC R2
**Scope:** S

---

### Phase 1 — Platform multi-cluster refactor (keep `secret` byte-identical)

#### T3: Cluster label + Fleet targeting scaffolding
**Description:** Introduce the `cluster.vgijssel.nl/name` label. Update `apps/secret/scripts/apply.sh` to
label the Fleet `local` Cluster `secret` after it registers. Establish the `targets`/`targetCustomizations`
convention (no behavior change yet).
**Acceptance criteria:**
- [ ] `secret`'s `apply.sh` labels `clusters.fleet.cattle.io/local` with `cluster.vgijssel.nl/name=secret` (idempotent).
- [ ] Convention documented in a short comment / bundle header.
**Verification:**
- [ ] `moon run secret:apply` still succeeds; `kubectl get cluster.fleet.cattle.io local -o jsonpath='{.metadata.labels}'` shows the label.
**Dependencies:** None
**Files:** `apps/secret/scripts/apply.sh` (+ maybe a shared snippet)
**Scope:** S

#### T4: Parameterize the platform bundles per cluster
**Description:** Add `targetCustomizations` (values per cluster) and `targets`+`clusterSelector` (membership)
to the platform bundles: `tailscale` (hostname `secret-operator`/`network-operator`), `external-dns`
(`txtOwnerId` `secret-cluster`/`network-cluster`), `tailscale-proxygroup` (`secret-ingress`/`network-ingress`),
and gate `ingress-nginx` + the secret `ProxyGroup` to `secret` only. `secret` values must render **identical**
to today.
**Acceptance criteria:**
- [ ] Each parameterized bundle deploys correct per-cluster values based on the cluster label.
- [ ] `ingress-nginx` has a `secret`-only target; it produces no BundleDeployment on `network`.
- [ ] `external-dns` `txtOwnerId` differs per cluster (unique ownership).
**Verification:**
- [ ] Rendered-manifest diff for the `secret` target vs `main` is **empty** (`fleet apply --dry-run` / `helm template` per bundle).
- [ ] `moon run secret:apply`; secret cluster reconciles green.
**Dependencies:** T3
**Files:** `apps/platform/src/tailscale/fleet.yaml`, `external-dns/fleet.yaml`, `tailscale-proxygroup/fleet.yaml`, `ingress-nginx/fleet.yaml` (+ their values overlays)
**Scope:** M

#### T5: Split platform `config` into shared vs per-cluster store
**Description:** Keep `ClusterIssuer` + the four `ExternalSecret`s in the shared `platform-config` bundle
(deploy to both clusters). Move the `ClusterSecretStore` to a per-cluster concern: `secret` keeps its
in-cluster k8s-auth store (gated to `secret`); `network` will own its own in T10. Verify `secret`'s store
resource is unchanged.
**Acceptance criteria:**
- [ ] `platform-config` no longer hardcodes a single kubernetes-auth ClusterSecretStore for all clusters.
- [ ] `secret`'s `ClusterSecretStore openbao` still renders identically and ESO on `secret` still syncs.
**Verification:**
- [ ] `secret` manifest diff empty; `kubectl get clustersecretstore openbao` on `secret` is `Valid`; ExternalSecrets `SecretSynced`.
**Dependencies:** T4
**Files:** `apps/platform/src/config/*` (fleet.yaml + clustersecretstore relocation/gating)
**Scope:** M

#### ✅ Checkpoint A — Platform refactor safe (self-verify, then continue)
- [ ] `secret` rendered manifests diff-clean vs `main`.
- [ ] `secret` cluster fully green (all bundles Ready, ESO synced, OpenBao reachable at `secret.vgijssel.nl`).
- [ ] Cluster label present. If the diff is non-empty, fix before proceeding; otherwise continue automatically.

---

### Phase 2 — Network cluster scaffold (empty cluster reachable)

#### T6: `apps/network` project + start/stop
**Description:** Create `apps/network/moon.yml` (tasks: start/bootstrap/apply/stop) and
`scripts/start.sh` + `scripts/stop.sh`, mirroring `secret` (vind docker driver, arm64 qemu/binfmt, idempotent
create/connect/delete) with `NETWORK_CLUSTER_NAME` default `network`.
**Acceptance criteria:**
- [ ] `moon run network:start` creates/connects the `network` vind cluster; node becomes Ready.
- [ ] `moon run network:stop` deletes it; both idempotent.
**Verification:**
- [ ] `kubectl config current-context` = `vcluster-docker_network`; `kubectl get nodes` Ready. Re-run start = no-op.
**Dependencies:** None
**Files:** `apps/network/moon.yml`, `apps/network/scripts/start.sh`, `apps/network/scripts/stop.sh`
**Scope:** S

#### T7: `network:apply` — Fleet install + label + bundle wiring
**Description:** Create `scripts/apply.sh` mirroring `secret`: install `fleet-crd`+`fleet`, label the `local`
Cluster `cluster.vgijssel.nl/name=network`, then `fleet apply` the network bundles + shared platform bundles
(excluding ingress-nginx via its target). Start with empty/stub `src/` bundle dirs so apply runs end-to-end
(bundles may error-and-retry until later phases).
**Acceptance criteria:**
- [ ] Fleet controller installed on `network`; `local` cluster labeled `network`.
- [ ] `fleet apply` runs for the intended bundle list; bundles appear (some NotReady is expected pre-secrets).
**Verification:**
- [ ] `kubectl -n fleet-local get bundles` lists network + platform bundles; ingress-nginx absent.
**Dependencies:** T4, T6
**Files:** `apps/network/scripts/apply.sh`
**Scope:** S

---

### Phase 3 — Secrets path (network reads remote OpenBao via JWT)

#### T8: OpenBao grant for `network` (secret-side, additive)
**Description:** Extend `apps/secret/src/openbao-config/main.tf` with a `jwt-network` auth backend
(`vault_jwt_auth_backend` + config using static `jwt_validation_pubkeys` from a new variable), a read-only
`network-read` policy (`kv/data/*`, `kv/metadata/*` read), and a `network-eso` role bound to audience
`openbao` + the network ESO subject. Add `variables.tf` entries (`network_oidc_issuer`, `network_jwks`).
Broaden the `terranetes` policy so it can manage the new `auth/jwt-network/*` paths.
**Acceptance criteria:**
- [ ] Module `tofu validate` passes; new resources planned; terranetes policy covers `auth/jwt-network/*`.
- [ ] Applying via `secret:configure` (with issuer/JWKS from T9) creates the backend/policy/role.
**Verification:**
- [ ] `tofu plan` clean; after apply, `bao read auth/jwt-network/role/network-eso` shows `network-read`.
- [ ] `secret` ESO/terranetes unaffected (existing roles intact).
**Dependencies:** T9 (needs issuer/JWKS to apply; code can be written first). Touches the live `secret`
cluster — additive only (new backend/policy/role), reconciled by terranetes; verify existing roles intact after.
**Files:** `apps/secret/src/openbao-config/main.tf`, `variables.tf`
**Scope:** M

#### T9: `network:bootstrap`
**Description:** Create `scripts/bootstrap.sh`: load `OP_SERVICE_ACCOUNT_TOKEN` from `.env`; read the
`secret`-cluster root token from `enigma-prod` 1Password; reach OpenBao at `https://secret.vgijssel.nl`
(operator machine is on the tailnet); read `kv/tailscale`; create the `operator-oauth` Secret in the
`network` cluster's `tailscale` namespace (out-of-band, breaking the chicken-and-egg). Then extract the
`network` cluster's OIDC issuer (`/.well-known/openid-configuration`) + JWKS (`/openid/v1/jwks`) and emit them
for T8 (printed + written to a git-ignored file for `secret:configure` to consume as tofu vars).
**Acceptance criteria:**
- [ ] `operator-oauth` Secret exists in `network`'s `tailscale` ns with `client_id`/`client_secret`.
- [ ] Issuer + JWKS captured to a git-ignored artifact and printed; idempotent re-run.
**Verification:**
- [ ] `kubectl -n tailscale get secret operator-oauth`; tailscale operator progresses to Ready.
- [ ] Issuer/JWKS file present and non-empty; secrets never written to git.
**Dependencies:** T6 (cluster exists), `secret` cluster running, ACL-A (network operator machine may already reach `secret.vgijssel.nl`; cluster egress handled in T10)
**Files:** `apps/network/scripts/bootstrap.sh`, `.gitignore` (issuer/jwks artifact)
**Scope:** M

#### T10: Tailnet egress + `network` ClusterSecretStore (JWT) + ExternalSecrets
**Description:** Provision a Tailscale **egress** to `secret.vgijssel.nl` (operator `tailscale.com/tailnet-fqdn`
Service) so in-cluster pods can reach it with SNI preserved (R8). Create `apps/network/src/config/`:
`ClusterSecretStore openbao` (vault provider, `server` via the egress with `tls`/SNI = `secret.vgijssel.nl`,
`auth.jwt` path `jwt-network` role `network-eso`, SA token audience `openbao`) and the ExternalSecrets
(`cloudflare`, `external-dns`, `operator-oauth`, `netdata`). This closes the JWT loop end-to-end.
**Acceptance criteria:**
- [ ] Egress to `secret.vgijssel.nl` exists; a test `curl` from a pod returns the OpenBao API over the valid LE cert.
- [ ] `ClusterSecretStore openbao` is `Valid`; all ExternalSecrets `SecretSynced` (proves JWT auth works).
**Verification:**
- [ ] `kubectl get clustersecretstore openbao` Valid; `kubectl get externalsecret -A` all `SecretSynced`.
- [ ] `operator-oauth` now managed by ESO (matches bootstrap-seeded value).
**Dependencies:** T7, T8 (role exists), T9 (operator up + issuer/JWKS applied), ACL-A (network→svc:secret)
**Files:** `apps/network/src/config/clustersecretstore-openbao.yaml`, `externalsecret-*.yaml`, egress Service manifest, `fleet.yaml`
**Scope:** M

#### ✅ Checkpoint B — Secrets flowing (self-verify, then continue)
- [ ] All `network` ExternalSecrets `SecretSynced` from remote OpenBao via JWT + tailnet egress.
- [ ] tailscale operator, cert-manager, external-dns have their secrets. Continue automatically once green.

---

### Phase 4 — Data + application

#### T11: `network-mongodb` bundle
**Description:** Create `apps/network/src/mongodb/` umbrella chart (pinned vendored MongoDB), single-node with
a PVC; root/app credentials sourced from OpenBao via an ExternalSecret, and a `mongodb-uri` Secret Omada will
consume (`config.externalMongoDBUrlSecret`).
**Acceptance criteria:**
- [ ] MongoDB pod Running with a bound PVC; `mongodb-uri` Secret present with a valid connection string.
**Verification:**
- [ ] `kubectl get pod` mongodb Running/Ready; `kubectl exec` mongo ping OK.
**Dependencies:** T1, T10 (creds via ESO)
**Files:** `apps/network/src/mongodb/{Chart.yaml,Chart.lock,values.yaml,fleet.yaml}`, an ExternalSecret (in config or here)
**Scope:** M

#### T12: `network-omada` bundle
**Description:** Create `apps/network/src/omada/` umbrella chart (vendored `omada-controller-helm` 1.4.1).
Values: full `config.ports.*`, `config.tlsSecretName` (from T14 cert), `config.externalMongoDBUrlSecret`
(from T11), `persistence.data`/`logs` PVCs, `config.rootless: true`. `fleet.yaml` `dependsOn` mongodb.
**Acceptance criteria:**
- [ ] Omada pod Running, connected to external MongoDB, StatefulSet healthy; UI answers on 8043 in-cluster.
**Verification:**
- [ ] `kubectl get pod` omada Running/Ready; `kubectl port-forward` + `curl -k https://localhost:8043/` returns the login.
- [ ] Omada logs show successful external Mongo connection.
**Dependencies:** T1, T10, T11
**Files:** `apps/network/src/omada/{Chart.yaml,Chart.lock,values.yaml,fleet.yaml}`
**Scope:** M

---

### Phase 5 — Tailnet exposure + TLS

#### T13: `network-ingress` ProxyGroup + Omada Tailscale LB Service (all ports)
**Description:** Ensure the `network-ingress` ProxyGroup exists (from T4 platform target). Add the Omada
`Service` (type `LoadBalancer`, `loadBalancerClass: tailscale`, annotations
`tailscale.com/hostname: omada`, `tailscale.com/proxy-group: network-ingress`,
`external-dns.alpha.kubernetes.io/hostname: omada.network.vgijssel.nl`) exposing all documented TCP + (per T2)
UDP ports. Requires **ACL-B** (tailnet `omada-network` service autoApprovers + grants).
**Acceptance criteria:**
- [ ] Service gets a stable Tailscale VIP; `omada.network.vgijssel.nl` A record published by external-dns.
- [ ] TCP adoption ports reachable on the VIP from a tailnet host; UDP per T2 outcome.
**Verification:**
- [ ] `dig omada.network.vgijssel.nl` → VIP; `nc -vz <vip> 29814` and `8043` OK; `nc -vzu <vip> 29810` per T2.
**Dependencies:** T2, T4, T12, ACL-B
**Files:** `apps/network/src/omada/templates/service-omada.yaml` (or values), `fleet.yaml`
**Scope:** S

#### T14: Certificate for `omada.network.vgijssel.nl` mounted into Omada
**Description:** Add a cert-manager `Certificate` (LE prod, Cloudflare DNS-01, `letsencrypt-prod` ClusterIssuer)
for `omada.network.vgijssel.nl` into `omada-network-vgijssel-nl-tls`; wire `config.tlsSecretName` so Omada
serves it at `/cert` on 8043.
**Acceptance criteria:**
- [ ] Certificate `Ready=True`; Omada pod mounts it; UI on 8043 presents the LE cert (SAN `omada.network.vgijssel.nl`).
**Verification:**
- [ ] `kubectl get certificate` Ready; from a tailnet host `curl -v https://omada.network.vgijssel.nl` → 200/redirect, issuer = Let's Encrypt, valid chain, no `*.ts.net`.
**Dependencies:** T10 (cloudflare token synced), T12, T13
**Files:** `apps/network/src/config/certificate-omada.yaml`, `apps/network/src/omada/values.yaml`
**Scope:** S

#### ✅ Checkpoint C — Exposed with valid TLS (self-verify, then continue)
- [ ] `https://omada.network.vgijssel.nl` serves the Omada UI over the tailnet with a valid LE cert on a
  stable VIP; adoption ports reachable. Continue automatically once green.

---

### Phase 6 — Adoption + polish

#### T15: Device adoption over the tailnet + document
**Description:** Verify a real Omada device adopts via the **Inform URL** pointed at the controller's tailnet
address over the TCP management/adopt ports (R1). Document the inform-URL flow (and DHCP Option 138 note) in
the network app docs.
**Acceptance criteria:**
- [ ] One device set with Inform URL = the controller tailnet address is adopted and shows Connected.
**Verification:**
- [ ] Device appears Managed/Connected in the Omada UI.
**Dependencies:** T13, T14
**Files:** minimal docs (only if requested; per repo policy no proactive docs)
**Scope:** S

#### T16: Idempotence, teardown/re-bring-up, polish
**Description:** Verify full idempotence and the `stop`→`start`→re-grant cycle (R5: issuer/JWKS may change on
recreate → `network:bootstrap` re-extracts, `secret:configure` re-applies). Flip the terranetes/module `?ref=`
to the merged branch. Finalize tailnet ACL notes.
**Acceptance criteria:**
- [ ] Re-running each task is a safe no-op; a `stop`+`start`+`bootstrap`+grant+`apply` cycle reaches green.
- [ ] Module `ref` points at the merged branch/main; ACL steps documented.
**Verification:**
- [ ] Full cycle green; `secret` still green; no secrets in git (`git grep` clean).
**Dependencies:** T15
**Files:** `apps/secret/src/config/configuration-openbao.yaml` (ref), `apps/network/SPEC.md`
**Scope:** S

---

## Out-of-band steps (perform autonomously; no approval needed)

Prefer codifying these as version-controlled policy where the repo already manages it (e.g. a committed
Tailscale ACL/policy file) rather than clicking in the admin console; apply directly if a token/API is
available, and log exactly what changed.

- **ACL-A (before T10):** tailnet grant so the `network-operator` tag can reach `svc:secret`
  (`secret.vgijssel.nl`) — required for the in-cluster egress + ESO. Apply via the managed ACL policy.
- **ACL-B (before T13):** create/allow the `omada-network` Tailscale Service — `autoApprovers.services` +
  `grants` so tailnet nodes can reach the VIP and the `network-operator` tag can advertise it.
- **1Password:** the `secret`-cluster OpenBao root token already exists in `enigma-prod`; no new item needed.
- **kv seeding:** ensure `kv/tailscale`, `kv/cloudflare`, `kv/netdata`, and MongoDB creds exist in OpenBao;
  seed any missing values directly (root token from `enigma-prod`), don't wait to be asked.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| R2 UDP over Tailscale LB unsupported | Med | Spike first (T2); fall back to TCP-only + Inform URL (still meets R1) |
| R4 Platform refactor regresses `secret` | High | Manifest-diff gate at Checkpoint A; refactor before touching network |
| R6 MongoDB chart/image unavailable (Bitnami 2025) | Med | Pin a maintained chart in T1; verify image pulls before T11 |
| R7 external-dns cross-cluster record deletion | High | Unique `txtOwnerId` per cluster (T4); verify distinct TXT owners |
| R8 In-cluster tailnet egress + SNI to `secret.vgijssel.nl` | High | Tailscale egress fqdn Service preserving SNI (T10); curl-verify valid cert from a pod |
| R5 JWT issuer/JWKS changes on cluster recreate | Med | `bootstrap` re-extracts + `secret:configure` re-applies (T16) |
| R1 UDP discovery is L2-only | Med | Adoption via Inform URL over TCP (T15); documented |

---

## Parallelization

- **Parallel-safe:** T1 and T2 (independent spikes); T6 (network scaffold) can proceed alongside Phase 1.
- **Sequential:** T3→T4→T5 (shared platform state); T8/T9→T10 (JWT loop); T11→T12 (data before app);
  T12→T13→T14 (app before exposure before cert mount).
- **Contract-first:** the `ClusterSecretStore` name `openbao` and the `network-eso` role/audience are the
  contract between T8 (OpenBao side) and T10 (ESO side) — fix those names before splitting the work.

---

## Resolved defaults (decide-and-proceed — no questions)

- **MongoDB chart:** pin the most actively-maintained MongoDB chart whose image is pullable at build time
  (evaluate in T1; if the historical Bitnami image is gated, use a maintained community/alternative chart or
  the `bitnamilegacy` image). Single-node, one PVC. Proceed with the best option found; note the choice in T1.
- **Tailnet egress to `secret.vgijssel.nl`:** default to the tailscale operator `tailscale.com/tailnet-fqdn`
  egress Service (simplest, preserves SNI). Fall back to a subnet-router/Connector only if the fqdn egress
  can't preserve the LE cert SNI. Decide in T10 by curl-verifying a valid cert from a pod.
