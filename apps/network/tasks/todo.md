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
- [x] **T17 — Static JWKS → live `jwks_url`** — **LIVE (2026-07-20)**, merged to `feat/network-cluster-omada`. OpenBao fetches the network JWKS live over the tailnet (revises R5: no more re-extraction on vind recreate). Landed: `jwt-network` backend `jwks_url` (apps/secret openbao-config + configuration, `network_jwks_url=https://network-operator.tail2c33e2.ts.net/openid/v1/jwks`), operator `apiServerProxyConfig.mode=noauth`, anonymous OIDC-discovery ClusterRoleBinding (network), reverse egress `service-network-jwks-egress.yaml` (secret), **`configmap-coredns-custom.yaml`** (secret — rewrites the MagicDNS name to the egress so the LE-cert SNI validates; discovered necessary at go-live because vind CoreDNS has no `.ts.net` resolver), ACL-C (`tag:k8s → tag:k8s-operator:443`), `network:bootstrap` no longer extracts JWKS, `secret:configure` reads network vars from the Configuration.
  - Go-live notes: had to re-register qemu/binfmt on the arm64 host (node had restarted → terranetes-controller `exec format error`). Brief transient: terranetes(secret) destroyed the backend once when it re-pulled the new module before the in-cluster CR carried `network_jwks_url`; `secret:configure` re-created it and syncing the CR made it durable. Verified: forced ESO refresh re-authenticated via live JWKS (all 6 network ExternalSecrets `SecretSynced`); network terranetes (`tailscale-config`) `InSync`.
  - Follow-up (non-urgent): `service-network-jwks-egress.yaml` + `configmap-coredns-custom.yaml` are applied live and committed; a future `secret:apply` will bring them under Fleet management.

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

## Phase 7 — kube-apiserver on the tailnet + JWKS simplification (extension, 2026-07-20)
Expose each cluster's Kubernetes API on the tailnet under `api.<cluster>.vgijssel.nl` with a valid LE cert
(reverse proxy + Tailscale LB Service VIP), then drop the OpenBao→network MagicDNS workarounds. Decisions:
LE-cert reverse proxy (not the operator-native `.ts.net` kube-apiserver ProxyGroup); services `api-secret`
/ `api-network`; both clusters; ACL-gated. See `plan.md` → Extension Phase 7.
- [x] **T18** Network kube-apiserver reverse proxy + `api-network` VIP (`api.network.vgijssel.nl`, LE cert) + ACLs *(deps: none)* — new `apps/network/src/apiserver-proxy` bundle (pinned nginx-unprivileged reverse proxy → `https://kubernetes.default.svc`, LE cert, Tailscale LB Service `api-network` on network-ingress, external-dns hostname); registered in `network:apply`; ACL-D added to `tailscale-config` (`svc:api-network` autoApprover + `group:admin`/`tag:k8s` grants). **Live-verified on the network cluster (in-cluster, bypassing the VIP):** cert Ready (`CN=api.network.vgijssel.nl`, LE `verify ok`, no `*.ts.net`); `/openid/v1/jwks` returns the JWKS anonymously; `/version`+`/livez` proxied OK; pod 1/1 Running (arm64 digest pull). **NOW FULLY LIVE (pushed + `network:configure` applied ACL-D):** VIP `100.86.162.164`, external-dns published `api.network.vgijssel.nl`, and a tailnet-host `curl https://api.network.vgijssel.nl/openid/v1/jwks` returns the JWKS over the valid LE cert (`/version` → 200). GOTCHA re-confirmed: the proxies advertised `svc:api-network` before the autoApprover existed → had to `rollout restart statefulset/network-ingress` (twice, after the autoApprover landed) to re-advertise → auto-approve. terranetes had NOT reconciled the pushed commit yet (last apply 8h prior), so `network:configure` applied ACL-D deterministically (same content terranetes converges to — no drift fight post-push).
- [x] **T19** Repoint OpenBao `network_jwks_url` → `https://api.network.vgijssel.nl/openid/v1/jwks`; delete `configmap-coredns-custom.yaml`; clean egress; drop ACL-C + operator `apiServerProxyConfig` *(deps: T18)* — **LIVE + verified (2026-07-20)**. OpenBao now fetches the network JWKS over the plain public reverse-proxy endpoint (T18), retiring all MagicDNS/SNI workarounds.
  - Code: `configuration-openbao.yaml` url→api-network; **DELETED `configmap-coredns-custom.yaml`**; `service-network-jwks-egress.yaml` tailnet-fqdn→`api.network.vgijssel.nl` (now symmetric with the openbao egress, no CoreDNS rewrite); removed ACL-C (`tag:k8s → tag:k8s-operator:443`) from `tailscale-config` (ACL-D `svc:api-network` is the sole JWKS path); dropped the operator `apiServerProxyConfig.mode=noauth` from `apps/platform/src/tailscale/fleet.yaml`; kept `clusterrolebinding-oidc-discovery.yaml` (the reverse proxy forwards the anonymous discovery read); module/SPEC/bootstrap comments updated. `tofu validate` (both modules) + `trunk check` clean.
  - Live apply (de-risked before touching auth): first proved the secret cluster reaches `https://api.network.vgijssel.nl/openid/v1/jwks` over the repointed egress — HTTP 200, `ssl_verify_result=0` (valid LE cert, no `-k`), served key matches the network signing key → ACL-D + egress + reverse proxy all working with OpenBao auth untouched. Then patched the in-cluster CR `network_jwks_url`; terranetes reconciled **in-place** (`vault_jwt_auth_backend.network` updated, `Apply complete! 0 added, 1 changed, 0 destroyed` — no transient-destroy this time since the module was comment-only). Forced ESO refresh: all 6 network ExternalSecrets re-synced `SecretSynced=True` (refreshTime fresh), store `Valid`. Deleted the live `coredns-custom` configmap (CoreDNS 1/1 Running after). secret cluster otherwise green.
  - NOTE (pre-existing, not T19): `secret-config` Fleet bundle shows `0/1 Modified` because the Fleet GitRepo tracks `main` (still the pre-T17 static-pubkey config: `network_jwks_pubkeys` + `network_jwks_url:null`); live has always been applied out-of-band via `secret:configure`/terranetes. Resolves when the branch merges to main (T16/T21 `?ref=` flip). Fleet is not force-correcting, so no clobber risk — but if it ever did, `network_jwks_url:null` would disable the backend.
- [x] **T20** Secret kube-apiserver reverse proxy + `api-secret` VIP (`api.secret.vgijssel.nl`, LE cert) + ACLs *(deps: T18 pattern)* — **LIVE + verified (2026-07-20)**. Mirrored the T18 api-network pattern onto the secret cluster: new `apps/secret/src/apiserver-proxy` bundle (pinned nginx-unprivileged reverse proxy → `https://kubernetes.default.svc`, LE cert `api-secret-vgijssel-nl-tls`, Tailscale LB Service `api-secret` on the existing **secret-ingress** ProxyGroup, external-dns hostname); registered in `secret:apply`. Added **ACL-E** to `tailscale-config` (`svc:api-secret` autoApprover + `group:admin`→`svc:api-secret:443` — operator kubectl convenience only, **no `tag:k8s` grant** since nothing fetches a JWKS from secret). Applied ACL-E via `network:configure` (`Apply complete! 0 added, 1 changed, 0 destroyed` — clean in-place, no destroy); deployed the bundle to secret via `fleet apply`. Because the autoApprover was in place **before** the LB Service, the operator self-approved `svc:api-secret` with **no rollout restart needed** (unlike the T18 gotcha). Verified: cert `Ready=True` (LE `CN=YR1`, `subject CN=api.secret.vgijssel.nl`, no `*.ts.net`), pod 1/1 Running, VIP `100.94.62.146`, `dig api.secret.vgijssel.nl`→VIP, tailnet-host `curl https://api.secret.vgijssel.nl/version`→**HTTP 200** (kube-apiserver v1.35.0) with `ssl_verify=0`. secret cluster green (12/12 bundles Ready; the lone `secret-config` 0/1 is the pre-existing main-vs-live drift from T19, untouched).
- [~] **T21** Idempotence + cleanup + SPEC/ACL notes *(deps: T19, T20)* — **safe checks PASSED (2026-07-20)**: `git grep` clean of secrets (only benign var-references/placeholders + an unrelated vendored chart comment); no tracked `*.auto.tfvars.json`/`zz_backend.tf`; the T19 `coredns-custom` hack stayed gone (live `NotFound` on secret; the only in-git `coredns` is the unrelated `apps/cluster-networking/coredns-patch` app); ACL-E idempotent (`network:configure` = 0 add/0 destroy, terranetes `tailscale-config` `InSync`, converges on the pushed commit). **Remaining (post-merge, = T16):** full `stop`→`start`→re-grant idempotence cycle + the module `?ref=` flip off `feat/network-cluster-omada`.

## Phase 8 — Per-cluster Tailscale identity (OAuth clients + tag taxonomy) (extension, 2026-07-20)
Today both clusters share one operator OAuth client and both tag their operators `tag:k8s-operator` /
proxies `tag:k8s`, so cross-cluster grants (ACL-A `tag:k8s→svc:secret`, ACL-D `tag:k8s→svc:api-network`)
can't express direction and one credential is a shared blast radius. Give each cluster its own OAuth client
+ tag pair (`secret-operator`/`secret-k8s`, `network-operator`/`network-k8s`) so ACLs mean "secret → network"
and credentials rotate independently. Tags are the only ACL identity (hostnames aren't usable; `svc:` can be
a `dst` but never a `src`). See `plan.md` → Extension Phase 8 for the full research findings + target ACLs.
Ordered migration (additive-first): T22 → T23 → T24 → T25. **HIGH-RISK (live secrets + tailnet reachability).**
- [x] **T22** Add per-cluster `tagOwners` (`secret-operator`/`secret-k8s`/`network-operator`/`network-k8s`), additive — keep `tag:k8s`/`tag:k8s-operator` *(deps: none)* — **LIVE (2026-07-20)**. Added the 4 new tag pairs to `tailscale-config` tagOwners (each `tag:<c>-operator` owns `tag:<c>-k8s`), keeping the shared `tag:k8s`/`tag:k8s-operator`. `tofu validate` clean; applied via `network:configure` (`0 added, 1 changed, 0 destroyed`). Additive-only, no device re-tagging: both clusters green after (6/6 network ExternalSecrets `SecretSynced`, all tailscale pods Running).
- [~] **T23** Two operator OAuth clients (`kv/tailscale-secret`/`kv/tailscale-network`) + split `operator-oauth` ExternalSecret per cluster (mirrors T5 store split) *(deps: T22)* — **CODE done (2026-07-20), live apply BLOCKED on operator action.** Split the shared `platform-config` operator-oauth ExternalSecret into per-cluster ones: `apps/secret/src/config` reads `kv/tailscale-secret`, `apps/network/src/config` reads `kv/tailscale-network`; removed the shared one. Renders + `trunk check` clean. **NOT applied** (kv paths not seeded → would leave operator-oauth un-synced; existing secrets are retained so no breakage). **OPERATOR-ONLY prereq:** create two Tailscale OAuth clients in the admin console (scopes `auth_keys`+`devices`), tagged **`tag:secret-operator`** and **`tag:network-operator`** respectively, and seed `kv/tailscale-secret` / `kv/tailscale-network` (`oauth_client_id`/`oauth_client_secret`) in OpenBao. **Tag-scoping caveat:** if you want T23-apply to be non-disruptive *before* T24 flips `defaultTags`, the clients must also be able to mint the current `tag:k8s-operator`/`tag:k8s` (else an operator pod restart before T24 fails re-auth) — otherwise apply T23+T24 back-to-back without restarting operators in between. Once seeded, apply + verify `operator-oauth SecretSynced` on both clusters, then proceed to T24.
- [ ] **T24** Flip `defaultTags` per cluster in platform `tailscale` bundle; narrow ACL-A→`network-k8s`, ACL-D→`secret-k8s`, repoint autoApprovers; then remove `tag:k8s`/`tag:k8s-operator` *(deps: T23)*
- [ ] **T25** Idempotence + cleanup + SPEC notes (document the OAuth-client↔tag model) *(deps: T24)*

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
