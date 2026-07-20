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
- [x] **T2** UDP-over-Tailscale-LB spike; record go/no-go + fallback *(deps: none)* — **GO**: `nc -vzu omada.network.vgijssel.nl 29810` succeeds over the tailnet against the live Omada VIP (UDP ports 27001/29810/19810 in the LB). No TCP-only fallback needed.

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
- [x] **ACL-A** tailnet grant `tag:k8s → svc:secret tcp:443` — **codified** in `apps/network/src/tailscale-config` (grant + `svc:secret` autoApprover) and reconciled by terranetes (network cluster). Live: all network ExternalSecrets `SecretSynced`.
- [x] **T8** OpenBao `jwt-network` backend + `network-read` policy + `network-eso` role (apps/secret) — **LIVE + terranetes-managed** (2026-07-20). Flipped the Configuration `?ref=` to `feat/network-cluster-omada` + embedded issuer/JWKS in `spec.variables`; added `depends_on = [vault_policy.terranetes]` (perm ordering). terranetes reconciled: `Apply complete! 3 added, 1 changed, 0 destroyed`. Verified: `jwt-network/` auth method present, role `network-eso` → `network-read` (read-only kv/*), bound to the network ESO SA + audience `openbao`. secret cluster unaffected (0 not-ready).
- [x] **T9** `network:bootstrap` — seed `operator-oauth`; extract OIDC issuer + JWKS *(deps: T6)*
  - Live: read secret-cluster root token from 1Password, read kv/tailscale from remote OpenBao (https://secret.vgijssel.nl over tailnet), seeded `operator-oauth` in network's tailscale ns (operator now progressing past ContainerCreating). Captured issuer `https://kubernetes.default.svc.cluster.local` + 1 JWKS key → PEM via stdlib DER encoder → git-ignored `network-jwt.auto.tfvars.json`. Idempotent.
- [x] **T10** Tailscale egress to `secret.vgijssel.nl` + `network` ClusterSecretStore (JWT) + ExternalSecrets *(deps: T7, T8, T9, ACL-A)* — CODE complete + deployed (`network-config` bundle: JWT ClusterSecretStore `openbao` + tailnet-fqdn egress Service). Shared ExternalSecrets come from platform-config. Live store = `InvalidProviderConfig` (unable to create client) pending **ACL-A** + T8 live apply.
- [x] **✅ Checkpoint B — PASSED.** ClusterSecretStore `openbao` Valid; all 6 network ExternalSecrets (cloudflare, external-dns, operator-oauth, netdata, mongodb-credentials, mongodb-uri) `SecretSynced=True` from remote OpenBao via JWT + tailnet egress.
- [ ] **T17 — Static JWKS → live `jwks_url`** *(branch `feat/network-jwks-url-auth`; supersedes T9's key extraction)*. OpenBao now fetches the network JWKS live over the tailnet instead of holding a static copy, so a vind recreate no longer needs `network:bootstrap` re-extraction + `secret:configure` re-apply (revises R5). Code landed: `jwt-network` backend `jwks_url` (apps/secret openbao-config + configuration), operator `apiServerProxyConfig.mode=noauth`, anonymous OIDC-discovery ClusterRoleBinding (network), reverse egress `service-network-jwks-egress.yaml` (secret), ACL-C (`tag:k8s → tag:k8s-operator:443`), `network:bootstrap` no longer extracts JWKS, `secret:configure` reads network vars from the Configuration. **One-time wiring left:** set `network_jwks_url` = `https://network-operator.<tailnet>.ts.net/openid/v1/jwks` in `configuration-openbao.yaml` + the matching `tailnet-fqdn` in the egress Service (the `<tailnet>` MagicDNS name is a runtime value). Then apply on both clusters and re-verify Checkpoint B.

## Phase 4 — Data + application
- [x] **T11** `network-mongodb` bundle (PVC + creds ESO + `mongodb-uri`) *(deps: T1, T10)* — umbrella chart (vendored mongodb 0.7.9, official mongo:8.0.26), single-node, 2Gi PVC; root creds via ESO `mongodb-credentials` (kv/mongodb seeded in OpenBao). Deployed live: StatefulSet + PVC Bound; pod `Init:0/1` awaiting ESO creds (ACL-A blocked). `mongodb-uri` ES lives in the omada bundle (T12, same ns as Omada).
- [x] **T12** `network-omada` bundle (external Mongo, ports, tls, persistence) *(deps: T1, T10, T11)* — umbrella chart (vendored omada 1.4.1), rootless, `config.externalMongoDBUrlSecret=mongodb-uri`, `config.tlsSecretName`, data/logs PVCs. `mongodb-uri` ExternalSecret templates the URI in-ns. helm template renders all kinds. Applied live: `ErrApplied` blocked on `network-mongodb` dependsOn (which is ACL-A-blocked) = designed ordering.

## Phase 5 — Exposure + TLS
- [x] **ACL-B** tailnet `omada-network` Service (autoApprovers.services + `group:admin` grant with explicit Omada TCP/UDP ports) — **codified** in `apps/network/src/tailscale-config`, reconciled by terranetes. Live: VIP `100.121.98.244` advertised, `omada.network.vgijssel.nl` resolves to it.
- [x] **T13** `network-ingress` ProxyGroup + Omada Tailscale LB Service (all ports) + external-dns hostname *(deps: T2, T4, T12, ACL-B)* — network-ingress ProxyGroup deployed 1/1 Ready; LB Service (loadBalancerClass=tailscale, 13 TCP/UDP ports, proxy-group network-ingress, external-dns hostname) renders + is in the omada bundle. Live VIP advertisement pending ACL-B.
- [x] **T14** Certificate `omada.network.vgijssel.nl` mounted into Omada `/cert` *(deps: T10, T12, T13)* — Certificate (letsencrypt-prod, DNS-01) in the omada bundle → `omada-network-vgijssel-nl-tls`, wired to `config.tlsSecretName`. Live issuance pending cloudflare token sync (ACL-A).
- [x] **✅ Checkpoint C — PASSED.** `curl https://omada.network.vgijssel.nl:8043/` → HTTP 200 over the tailnet, cert verified OK (Let's Encrypt, `CN=omada.network.vgijssel.nl`, valid to Oct 2026, no `*.ts.net`). TCP adoption port 29814 + UDP discovery port 29810 both reachable on the VIP.

## Phase 6 — Adoption + polish
- [ ] **T15** Adopt a real device via Inform URL over the tailnet *(deps: T13, T14)* — **FOR THE USER: needs a physical Omada device.** Controller + adoption ports are live; set the device Inform URL to `omada.network.vgijssel.nl` (TCP 29814/29812) and confirm it shows Connected.
- [~] **T16** Idempotence + `stop`→`start`→re-grant cycle; flip module `?ref=`; finalize ACL notes *(deps: T15)* — start/apply/bootstrap/configure verified idempotent (secret:configure re-apply = 0/2 changes, tailscale-config apply = "No changes"); no secrets in git (`git grep` clean, tfvars untracked); secret cluster verified still fully green (12/12 bundles Ready). **Module `?ref=` flip still deferred — requires this branch to be merged to main first**, then flip `?ref=` on both Configurations (openbao-config on secret, tailscale-config on network) off `feat/network-cluster-omada`.

---

## ✅ Status: build complete — both clusters green end-to-end

Omada is live on the tailnet at `https://omada.network.vgijssel.nl:8043` with a valid
Let's Encrypt cert on a stable VIP; secrets flow from remote OpenBao via JWT; the tailnet
ACL (ACL-A + ACL-B) is codified in `apps/network/src/tailscale-config` and reconciled by
terranetes. All 12 network bundles + all 12 secret bundles are Ready. Checkpoints A/B/C
all PASSED. The only in-code blocker resolved this pass: the `network-terranetes` JWT role
needed `bound_audiences` (the executor's default SA token carries an `aud` claim) — fixed
in `apps/secret/src/openbao-config/main.tf` and applied via `secret:configure`.

### Remaining (operator-only / post-merge — not code blockers)

1. **T15 — adopt a real Omada device** via its Inform URL (`omada.network.vgijssel.nl`,
   TCP 29814/29812) over the tailnet. Needs physical hardware.

2. **T16 — flip module `?ref=` after merge.** Once `feat/network-cluster-omada` merges to
   `main`, update `?ref=` on both Configurations (`openbao-config` on secret,
   `tailscale-config` on network) off the feature branch. No behavior change; terranetes
   reconciles the same module from the merged ref.

Note: kubectl context is currently `vcluster-docker_network`
(`kubectl config use-context vcluster-docker_secret` to switch back). `kv/mongodb`,
`kv/network-tailscale-config` (tailscale ACL OAuth client, `all:write` scope) seeded in
OpenBao. The git-ignored `apps/secret/src/openbao-config/network-jwt.auto.tfvars.json`
holds the network issuer/JWKS consumed by `secret:configure`.

### Definition of Done (every task)
- Versions pinned; charts vendored; `Chart.lock` committed.
- `trunk fmt` + `trunk check` clean; code only in `apps/`/`libs/`.
- No secrets in git (`git grep` clean); `zz_backend.tf`/state never committed.
- `secret` cluster remains green and its rendered manifests unchanged.
- Task's own acceptance criteria + verification steps pass.
