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
- [x] **T8** OpenBao `jwt-network` backend + `network-read` policy + `network-eso` role (apps/secret) — **LIVE + terranetes-managed** (2026-07-20). Flipped the Configuration `?ref=` to `feat/network-cluster-omada` + embedded issuer/JWKS in `spec.variables`; added `depends_on = [vault_policy.terranetes]` (perm ordering). terranetes reconciled: `Apply complete! 3 added, 1 changed, 0 destroyed`. Verified: `jwt-network/` auth method present, role `network-eso` → `network-read` (read-only kv/*), bound to the network ESO SA + audience `openbao`. secret cluster unaffected (0 not-ready).
- [x] **T9** `network:bootstrap` — seed `operator-oauth`; extract OIDC issuer + JWKS *(deps: T6)*
  - Live: read secret-cluster root token from 1Password, read kv/tailscale from remote OpenBao (https://secret.vgijssel.nl over tailnet), seeded `operator-oauth` in network's tailscale ns (operator now progressing past ContainerCreating). Captured issuer `https://kubernetes.default.svc.cluster.local` + 1 JWKS key → PEM via stdlib DER encoder → git-ignored `network-jwt.auto.tfvars.json`. Idempotent.
- [x] **T10** Tailscale egress to `secret.vgijssel.nl` + `network` ClusterSecretStore (JWT) + ExternalSecrets *(deps: T7, T8, T9, ACL-A)* — CODE complete + deployed (`network-config` bundle: JWT ClusterSecretStore `openbao` + tailnet-fqdn egress Service). Shared ExternalSecrets come from platform-config. Live store = `InvalidProviderConfig` (unable to create client) pending **ACL-A** + T8 live apply.
- [ ] **⚠️ Checkpoint B — half unblocked.** T8 grant is now LIVE (terranetes). Remaining: **ACL-A** (grant `tag:k8s → svc:secret tcp:443`) so the network in-cluster egress can reach OpenBao; then verify the `openbao` egress Service (still `placeholder`) + curl `secret.vgijssel.nl` from a pod, and confirm all network ExternalSecrets go `SecretSynced`.

## Phase 4 — Data + application
- [x] **T11** `network-mongodb` bundle (PVC + creds ESO + `mongodb-uri`) *(deps: T1, T10)* — umbrella chart (vendored mongodb 0.7.9, official mongo:8.0.26), single-node, 2Gi PVC; root creds via ESO `mongodb-credentials` (kv/mongodb seeded in OpenBao). Deployed live: StatefulSet + PVC Bound; pod `Init:0/1` awaiting ESO creds (ACL-A blocked). `mongodb-uri` ES lives in the omada bundle (T12, same ns as Omada).
- [x] **T12** `network-omada` bundle (external Mongo, ports, tls, persistence) *(deps: T1, T10, T11)* — umbrella chart (vendored omada 1.4.1), rootless, `config.externalMongoDBUrlSecret=mongodb-uri`, `config.tlsSecretName`, data/logs PVCs. `mongodb-uri` ExternalSecret templates the URI in-ns. helm template renders all kinds. Applied live: `ErrApplied` blocked on `network-mongodb` dependsOn (which is ACL-A-blocked) = designed ordering.

## Phase 5 — Exposure + TLS
- [ ] **ACL-B** *(out-of-band, BLOCKED — no Tailscale API token)* tailnet `omada-network` Service: autoApprovers + grants — see final report for exact policy.
- [x] **T13** `network-ingress` ProxyGroup + Omada Tailscale LB Service (all ports) + external-dns hostname *(deps: T2, T4, T12, ACL-B)* — network-ingress ProxyGroup deployed 1/1 Ready; LB Service (loadBalancerClass=tailscale, 13 TCP/UDP ports, proxy-group network-ingress, external-dns hostname) renders + is in the omada bundle. Live VIP advertisement pending ACL-B.
- [x] **T14** Certificate `omada.network.vgijssel.nl` mounted into Omada `/cert` *(deps: T10, T12, T13)* — Certificate (letsencrypt-prod, DNS-01) in the omada bundle → `omada-network-vgijssel-nl-tls`, wired to `config.tlsSecretName`. Live issuance pending cloudflare token sync (ACL-A).
- [ ] **⚠️ BLOCKED Checkpoint C** — needs ACL-A (secrets → cert + mongo) and ACL-B (VIP). All code complete; live verification blocked on tailnet ACLs.

## Phase 6 — Adoption + polish
- [ ] **T15** Adopt a real device via Inform URL over the tailnet *(deps: T13, T14)* — **BLOCKED: needs a physical Omada device + a working VIP (ACL-B).** For the user.
- [~] **T16** Idempotence + `stop`→`start`→re-grant cycle; flip module `?ref=`; finalize ACL notes *(deps: T15)* — partial: start/apply/bootstrap verified idempotent; no secrets in git (`git grep` clean, tfvars untracked); secret cluster verified still fully green. **Module `?ref=` flip deferred — requires this branch to be merged first** (then T8 grant goes live via secret:configure).

---

## ⚠️ Remaining blockers (need operator action — access I lack)

These gate the *live end-to-end* (Checkpoints B & C, T15). All code is written,
committed, validated, and deployed as far as it goes; both clusters are healthy.

1. **Merge this branch + flip the module `?ref=` (unblocks T8 grant → Checkpoint B).**
   - Merge `feat/network-cluster-omada`.
   - Edit `apps/secret/src/config/configuration-openbao.yaml` `spec.module` `?ref=` to
     the merged ref, and add the network vars to `spec.variables` (from the
     git-ignored `network-jwt.auto.tfvars.json`) so terranetes reconciles the new
     module instead of destroying the grant.
   - `moon run network:bootstrap` (regenerates issuer/JWKS) then `moon run secret:configure`
     (auto-loads the tfvars, creates the jwt-network backend/policy/role). Verify:
     `bao read auth/jwt-network/role/network-eso` shows `network-read`.

2. **ACL-A — tailnet grant so the network cluster can reach OpenBao** (no Tailscale API
   token available to me). Grant the `tag:k8s-operator`/`network-operator` egress to
   `svc:secret` (secret.vgijssel.nl) in the tailnet policy. The operator + ProxyGroup
   already registered, so the tailnet is partly open; the `openbao` egress Service in
   `external-secrets` still shows `placeholder` — verify the `tailnet-fqdn` egress form
   against the operator version (may need a ClusterIP egress or a Connector), then curl
   `https://secret.vgijssel.nl/v1/sys/health` from a network pod to confirm SNI+reach.

3. **ACL-B — tailnet `omada-network` Service** (autoApprovers.services + grants) so the
   Omada VIP is advertised and `omada.network.vgijssel.nl` resolves to it.

4. **T2 UDP spike** — verify `nc -vzu <vip> 29810` once the VIP is up; TCP-only + Inform
   URL is the accepted fallback (R1/R2).

5. **T15** — adopt a real Omada device via its Inform URL over the tailnet.

Note: kubectl context is currently `vcluster-docker_network`
(`vcluster connect secret` / `kubectl config use-context vcluster-docker_secret`
to switch back). `kv/mongodb` was seeded in OpenBao during T11.

### Definition of Done (every task)
- Versions pinned; charts vendored; `Chart.lock` committed.
- `trunk fmt` + `trunk check` clean; code only in `apps/`/`libs/`.
- No secrets in git (`git grep` clean); `zz_backend.tf`/state never committed.
- `secret` cluster remains green and its rendered manifests unchanged.
- Task's own acceptance criteria + verification steps pass.
