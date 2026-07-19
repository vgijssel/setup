# TODO: `network` cluster (Omada on the tailnet)

Derived from `apps/network/tasks/plan.md`. Check off as completed. Do not start a task until its
dependencies are done. **Autonomous execution:** implement the recommended/best-practice approach and modify
live systems (the `secret` cluster, tailnet ACLs, 1Password, OpenBao) without pausing for approval.
Checkpoints are self-verification gates — verify, log, and continue; only stop if a check fails and can't be
resolved.

## Phase 0 — De-risk
- [ ] **T1** Vendor Omada (OCI 1.4.1) + pinned MongoDB charts via vendir — `vendir:build`/`test` green *(deps: none)*
- [ ] **T2** UDP-over-Tailscale-LB spike; record go/no-go + fallback *(deps: none)*

## Phase 1 — Platform multi-cluster refactor (keep `secret` identical)
- [ ] **T3** Add `cluster.vgijssel.nl/name` label; `secret:apply` labels `local`=secret *(deps: none)*
- [ ] **T4** Parameterize platform bundles (tailscale/external-dns/proxygroup) + gate ingress-nginx to secret-only *(deps: T3)*
- [ ] **T5** Split platform `config`: shared Issuer+ExternalSecrets vs per-cluster ClusterSecretStore *(deps: T4)*
- [ ] **✅ Checkpoint A** — `secret` manifests diff-clean, cluster green, label present → self-verify, then continue

## Phase 2 — Network scaffold
- [ ] **T6** `apps/network/moon.yml` + `start.sh` + `stop.sh` (vind `network`) *(deps: none)*
- [ ] **T7** `network:apply` — Fleet install + label `local`=network + bundle wiring *(deps: T4, T6)*

## Phase 3 — Secrets path (JWT + tailnet egress)
- [ ] **ACL-A** *(out-of-band)* tailnet grant: `network-operator` → `svc:secret` (apply via managed ACL policy)
- [ ] **T8** OpenBao `jwt-network` backend + `network-read` policy + `network-eso` role (apps/secret) *(deps: T9 for apply; additive to live secret cluster)*
- [ ] **T9** `network:bootstrap` — seed `operator-oauth`; extract OIDC issuer + JWKS *(deps: T6)*
- [ ] **T10** Tailscale egress to `secret.vgijssel.nl` + `network` ClusterSecretStore (JWT) + ExternalSecrets *(deps: T7, T8, T9, ACL-A)*
- [ ] **✅ Checkpoint B** — all `network` ExternalSecrets `SecretSynced` via JWT → self-verify, then continue

## Phase 4 — Data + application
- [ ] **T11** `network-mongodb` bundle (PVC + creds ESO + `mongodb-uri`) *(deps: T1, T10)*
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
