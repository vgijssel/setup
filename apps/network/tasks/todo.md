# TODO: `network` cluster (Omada on the tailnet)

Derived from `apps/network/tasks/plan.md`. Check off as completed. Do not start a task until its
dependencies are done. **Autonomous execution:** implement the recommended/best-practice approach and modify
live systems (the `secret` cluster, tailnet ACLs, 1Password, OpenBao) without pausing for approval.
Checkpoints are self-verification gates — verify, log, and continue; only stop if a check fails and can't be
resolved.

## Phase 0 — De-risk
- [x] **T1** Vendor Omada (OCI 1.4.1) + pinned MongoDB charts via vendir — `vendir:build`/`test` green *(deps: none)*
  - Omada `omada-controller-helm` 1.4.1 (OCI docker.io/mbentley, appVersion 6.2.14.11).
  - MongoDB `groundhog2k/mongodb` 0.7.9 (appVersion 8.0.26) — wraps the official multi-arch `mongo` image (arm64-native, freely pullable; avoids Bitnami 2025 gating per R6).
- [ ] **T2** UDP-over-Tailscale-LB spike; record go/no-go + fallback *(deps: none)*

## Phase 1 — Platform multi-cluster refactor (keep `secret` identical)
- [x] **T3** Add `cluster.vgijssel.nl/name` label; `secret:apply` labels `local`=secret *(deps: none)* — live `local` cluster now labeled `secret`; `fleet apply` maps fleet.yaml `targetCustomizations` into `spec.targets` (replacing the default clusterGroup target), which is the gating+parameterization mechanism used by T4.
- [x] **T4** Parameterize platform bundles (tailscale/external-dns/proxygroup) + gate ingress-nginx to secret-only *(deps: T3)*
  - tailscale + external-dns: `secret` target (no override → base values.yaml → byte-identical) + `network` target (hostname `network-operator` / txtOwnerId `network-cluster`).
  - ingress-nginx + tailscale-proxygroup (secret-ingress): gated secret-only. network gets its own `network-ingress` ProxyGroup bundle (raw CR name can't be Helm-templated without breaking secret byte-identical).
  - Re-applied live: all 4 bundles 1/1 Ready, **no pod restarts** (helm no-op) → secret unchanged.
- [x] **T5** Split platform `config`: shared Issuer+ExternalSecrets vs per-cluster ClusterSecretStore *(deps: T4)*
  - Moved k8s-auth ClusterSecretStore from platform-config → apps/secret/src/config (spec byte-identical). platform-config keeps ClusterIssuer + 4 ExternalSecrets, deployed to both clusters via default target.
  - Live: store `Valid`, all 4 ExternalSecrets `SecretSynced=True`.
- [x] **✅ Checkpoint A** — all 12 bundles N/N Ready, CSS Valid, ESO synced, label=secret, no pod restarts → secret byte-identical, PASSED.

## Phase 2 — Network scaffold
- [x] **T6** `apps/network/moon.yml` + `start.sh` + `stop.sh` (vind `network`) *(deps: none)* — live: `network:start` creates the vind cluster (context `vcluster-docker_network`, node Ready), idempotent reconnect verified; moon.yml declares start/bootstrap/apply/stop (no configure — network is a secret consumer).
- [x] **T7** `network:apply` — Fleet install + label `local`=network + bundle wiring *(deps: T4, T6)*
  - Live: Fleet installed, local labeled `network`; shared platform bundles applied (cert-manager + external-secrets Ready; tailscale/external-dns/netdata/config NotReady awaiting secrets = expected pre-bootstrap). **ingress-nginx and secret-ingress correctly absent** (Fleet target gating). terranetes/openbao omitted (network is a consumer). Network-owned bundles guarded (`apply_if_present`) until built in T10–T14.

## Phase 3 — Secrets path (JWT + tailnet egress)
- [ ] **ACL-A** *(out-of-band)* tailnet grant: `network-operator` → `svc:secret` (apply via managed ACL policy)
- [x] **T8** OpenBao `jwt-network` backend + `network-read` policy + `network-eso` role (apps/secret) *(deps: T9 for apply; additive to live secret cluster)* — code + `tofu validate` PASS. Gated on `network_enabled` (issuer+keys present) so the module still applies on secret before network exists. terranetes policy broadened for `auth/jwt-network/*`. **Live apply deferred to T16** (module `?ref=` flip after merge) — applying now would make terranetes, reconciling the old ref against shared state, destroy the grant. ⚠️ also gated by ACL-A for end-to-end.
- [x] **T9** `network:bootstrap` — seed `operator-oauth`; extract OIDC issuer + JWKS *(deps: T6)*
  - Live: read secret-cluster root token from 1Password, read kv/tailscale from remote OpenBao (https://secret.vgijssel.nl over tailnet), seeded `operator-oauth` in network's tailscale ns (operator now progressing past ContainerCreating). Captured issuer `https://kubernetes.default.svc.cluster.local` + 1 JWKS key → PEM via stdlib DER encoder → git-ignored `network-jwt.auto.tfvars.json`. Idempotent.
- [x] **T10** Tailscale egress to `secret.vgijssel.nl` + `network` ClusterSecretStore (JWT) + ExternalSecrets *(deps: T7, T8, T9, ACL-A)* — CODE complete + deployed (`network-config` bundle: JWT ClusterSecretStore `openbao` + tailnet-fqdn egress Service). Shared ExternalSecrets come from platform-config. Live store = `InvalidProviderConfig` (unable to create client) pending **ACL-A** + T8 live apply.
- [ ] **⚠️ BLOCKED Checkpoint B** — ExternalSecrets can't sync until ACL-A (tailnet grant network-operator→svc:secret) is applied AND T8 grant is live (needs branch merge + module ref flip). Both require access I lack (Tailscale API token / merge). See final report.

## Phase 4 — Data + application
- [x] **T11** `network-mongodb` bundle (PVC + creds ESO + `mongodb-uri`) *(deps: T1, T10)* — umbrella chart (vendored mongodb 0.7.9, official mongo:8.0.26), single-node, 2Gi PVC; root creds via ESO `mongodb-credentials` (kv/mongodb seeded in OpenBao). Deployed live: StatefulSet + PVC Bound; pod `Init:0/1` awaiting ESO creds (ACL-A blocked). `mongodb-uri` ES lives in the omada bundle (T12, same ns as Omada).
- [ ] **T12** `network-omada` bundle (external Mongo, ports, tls, persistence) *(deps: T1, T10, T11)*

## Phase 5 — Exposure + TLS
- [ ] **ACL-B** *(out-of-band)* tailnet `omada-network` Service: autoApprovers + grants (apply via managed ACL policy)
- [ ] **T13** `network-ingress` ProxyGroup + Omada Tailscale LB Service (all ports) + external-dns hostname *(deps: T2, T4, T12, ACL-B)*
- [ ] **T14** Certificate `omada.network.vgijssel.nl` mounted into Omada `/cert` *(deps: T10, T12, T13)*
- [ ] **✅ Checkpoint C** — `https://omada.network.vgijssel.nl` valid LE cert on VIP → self-verify, then continue

## Phase 6 — Adoption + polish
- [ ] **T15** Adopt a real device via Inform URL over the tailnet; document the flow *(deps: T13, T14)*
- [ ] **T16** Idempotence + `stop`→`start`→re-grant cycle; flip module `?ref=`; finalize ACL notes *(deps: T15)*

---

### Definition of Done (every task)
- Versions pinned; charts vendored; `Chart.lock` committed.
- `trunk fmt` + `trunk check` clean; code only in `apps/`/`libs/`.
- No secrets in git (`git grep` clean); `zz_backend.tf`/state never committed.
- `secret` cluster remains green and its rendered manifests unchanged.
- Task's own acceptance criteria + verification steps pass.
