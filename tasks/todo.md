# TODO: Tailscale → NetBird migration

Source of truth: `SPEC.md` (repo root) + `tasks/plan.md`. Order: **network first, then secret.**
Verify every phase on a **freshly recreated** cluster (`stop` → `start`).

> **RECONCILED 2026-07-28** — this `todo.md` (not `plan.md`) is the live status. Audited the
> committed branch (`mg/feat/netbird-migration`, HEAD `8c257f8d`) against the checkboxes. Key
> corrections applied below: several tasks landed via **different, committed approaches** than
> `plan.md` describes, so `plan.md` is now partly stale by design (kept as the original design record):
> - **Operator re-pinned `0.8.0` → `v0.7.0`** (`e081b4d8`/`d0fa9861`) — the 0.8.0 sidecar DNS
>   regression (#383) broke the ESO client sidecar; v0.7.0 rewrites the shared `/etc/resolv.conf` in place.
> - **1.6 (network ESO → OpenBao) is implemented via a NetBird *client sidecar*** (`apps/network/src/eso-sidecar/`,
>   `0da1bea5`), **not** the plan's "setup-key ES + repoint store host." OpenBao's Tailscale VIP was
>   **retired** (`8c257f8d`) — reachable mesh-only at `openbao.secret.vgijssel.nl` via a BYOP reverse proxy.
> - **1.7 DNS is managed by Crossplane `provider-opentofu`** (inline HCL / `restapi`), **not**
>   `provider-upjet-cloudflare` (rejected on arm64). Records are per-reverse-proxy-service CNAMEs.
> - **Omada (1.5) is a single all-ports `NBResource`** — the BYOP reverse-proxy path was removed.
> - **OpenBao exposure has its own sub-plan:** `tasks/plan-openbao-netbird-reverse-proxy.md`
>   (T1–T4,T7,T8,T10 done; T9 live bring-up + T5 network-cutover + T6 tailnet-removal remaining).
> Everything still open is a **live cluster/secret/DNS mutation** (Ask-first).

Maintainer directives baked in: JWKS via **ClusterProxy (auth/impersonation)**, no separate/anonymous
path, no `noauth`; **Cloudflare Crossplane on the network cluster**; **remove cert-manager + external-dns**
(NetBird manages TLS, Crossplane manages DNS).

## Prerequisite — seed OpenBao (`secret:forward` + `secret:auth`)
- [ ] `kv/netbird#api_token` — NetBird Cloud PAT
- [ ] `kv/netbird#proxy_cname_target` — NetBird proxy CNAME target (`eu1.netbird.services`; confirm in Phase 0)
- [ ] `kv/network-netbird#setup_key` — network peer setup key (autogroup `network-k8s`)
- [ ] `kv/secret-netbird#setup_key` — secret peer setup key (autogroup `secret-k8s`)
- [ ] `kv/cloudflare#credential` — already exists; confirm Zone:Read + DNS:Edit

## Phase 0 — De-risk spike (network, throwaway)
- [x] 0.1 Operator + peer enrollment → **Connected** in group `network-k8s` (done — see 1.1/1.2/1.4)
- [x] 0.2 `ClusterProxy` kubectl (impersonation) works (done — `clusterproxy-api-network` Ready, 3/3 proxy peers; see 1.4)
- [✗] 0.3 **JWKS through the ClusterProxy — INFEASIBLE** (netbird-kubeapi-proxy v0.0.4 forwards only `/api`+`/apis`; `/openid/v1/jwks` 404s). Chosen fallback: **JWKS HTTP mirror + NetworkResource** (maintainer).
  - [x] JWKS HTTP mirror (`apps/network/src/jwks-mirror/`, nginx→apiserver anon /openid/v1/jwks over HTTP) — live, HTTP 200 with real keys.
  - [x] Exposed cross-cluster via **operator v1 stack** (`NBRoutingPeer` + Service `netbird.io/expose` → domain `NBResource` jwks-mirror.netbird.svc.cluster.local + auto-policy; no DNS zone, no crossplane). **Validated: JWKS fetched over NetBird from a peer, HTTP 200 real keys.** (netbird-crossplane-provider evaluated & reverted; Crossplane **core** kept on network for Cloudflare.)
  - [x] secret OpenBao `jwt-network` jwksUrl → `http://jwks-gateway.netbird.svc.cluster.local/openid/v1/jwks` — **DONE & VALIDATED end-to-end on NetBird (2026-07-26).** secret NBRoutingPeer → auto-group `secret` (id d9ius9jl0ubs73flnbb0); network jwks-mirror NBPolicy source resolves to it. `openbao-0` is not a netbird client, so instead of injecting a sidecar into OpenBao (DNS-rewrite risk), a disposable **`jwks-gateway`** socat Pod (SidecarProfile → netbird sidecar in group `secret`) re-serves the mesh mirror on a plain ClusterIP; OpenBao reaches it via normal cluster DNS. Proven: openbao-0 fetches JWKS (kid `ZqpF3JeB…` matches network apiserver), AuthBackend Synced/Ready, and a **fresh network ESO login validates → ClusterSecretStore openbao Valid, no errors.** SPEC success-criterion (a) met on NetBird.
- [~] 0.4 Omada L4 device-adoption **validated** over the mesh (devices adopt; UI on 8043 serves the LE cert — see 1.5). NetBird L7 auto-TLS question **superseded**: Omada uses a single NBResource + mesh domain (no L7 proxy), and OpenBao's public cert now comes from the BYOP reverse proxy (openbao sub-plan), not a NetBird-minted L7 domain.
- [~] 0.5 Wildcard depth **validated** (`*.vgijssel.nl` answers arbitrary depth on Cloudflare — see `[[cloudflare-wildcard-arbitrary-depth]]`). Approach evolved: DNS is now **per-reverse-proxy-service CNAMEs via opentofu** (`cloudflare-config/workspace-reverse-proxy-dns.yaml`), not one apex wildcard `Record`.
- [ ] **Checkpoint:** record `proxy_cname_target`; review with maintainer

## Phase 1 — network migration
- [x] 1.1 Vendor `netbird-operator` in `vendir.yml` — **re-pinned `0.8.0` → `v0.7.0`** (`e081b4d8`/`d0fa9861`; 0.8.0 sidecar DNS regression #383)
- [x] 1.2 `apps/platform/src/netbird-operator/` Fleet bundle (ns `netbird`, PAT secret, mgmt URL var) — deployed to BOTH clusters; operator `Running 1/1`, `netbird-mgmt-api-key` ExternalSecret `SecretSynced` (per-cluster `kv/<cluster>-netbird-operator#access_token`)
- [x] 1.3 `tailscale_auth.sh` → `netbird_auth.sh`; seeds `netbird-mgmt-api-key` PAT (`kv/network-netbird-operator#access_token`) — operator mints its own SetupKeys, so no setup-key seeding; renamed moon task `tailscale_auth`→`netbird_auth`; rewired `start.sh`/`apply.sh`/`stop.sh` comments
- [~] 1.4 `apps/network/src/netbird-config/` — Group `network-k8s` + SetupKey **Ready**; ClusterProxy `api-network` **Ready** (3/3 proxy peers `connected` in network-k8s, kube-apiserver fronted w/ impersonation RBAC, kubectl-only). **SUPERSEDED:** the "OIDC-discovery CRB swap (JWKS-via-ClusterProxy)" is dropped — JWKS now rides the mirror (`jwks-mirror` bundle, anonymous apiserver read), so the anonymous `clusterrolebinding-oidc-discovery.yaml` must **stay** (its comments still reference the retired Tailscale ProxyGroup — cleanup pending in 1.8). **Still pending:** custom-domain `api.network.vgijssel.nl` reachability (NetBird custom domain + Cloudflare CNAME — Ask-first, 1.7).
- [~] 1.5 Omada over NetBird. **Approach revised again (2026-07-27, maintainer):** expose the
  **entire** Omada controller as a **single NetworkResource** — no reverse proxy at all. The
  `netbird.io/expose` ClusterIP Service `omada` (`apps/network/src/omada/templates/service-omada.yaml`)
  now carries the full documented port set (UI/portal 8088/8043/8843 + device L4 TCP 29811-29817 + UDP
  27001/29810/19810), so the operator creates one domain NBResource `omada.omada.svc.cluster.local` on
  the `router` NBRoutingPeer with a `homelab`→`omada` policy covering every port. UI rides 8043 where
  Omada serves the LE cert (`certificate-omada.yaml`, KEPT — mounted at /cert), so mesh clients get a
  trusted cert with no proxy in the path. **DONE (this change):** promoted the exposed Service
  `omada-adopt`→`omada` w/ full ports; **removed the BYOP reverse proxy wholesale** — deleted
  `apps/network/src/netbird-reverse-proxy`, the opentofu private-service Workspace
  (`cloudflare-config/workspace-reverse-proxy-services.yaml`), and the dead vendored chart/vendir entry.
  Tailscale LB kept for now, renamed `omada`→`omada-tailscale` (`service-omada-tailscale.yaml`) to free
  the canonical name; will be retired with the Tailscale migration.
  **APPLIED & VALIDATED LIVE (2026-07-27, `moon run network:apply`):** NBResource `omada` Ready with all
  13 ports; from the Mac (homelab peer) over the mesh — `https://omada.omada.svc.cluster.local:8043`→**HTTP
  200**, `:8088`→302 (→HTTPS), device TCP `:29814`→connect OK. BYOP proxy fully gone: `netbird-reverse-proxy`
  Deployment absent, Bundle deleted, orphaned `netbird-reverse-proxy-cert` Secret deleted, and the NetBird
  account `/api/reverse-proxies/services` now returns **0** (the `omada-network` private service was
  destroyed when Fleet pruned the Workspace). Also cleaned stale manually-applied `omada-adopt`
  Service/NBResource/NBGroup + its lingering NBPolicy CR (needed a manual `kubectl delete nbpolicy` — the
  operator left it after the resource was removed, which had blocked the NBGroup cleanup).
  **GOTCHA hit during apply:** the `router` NBRoutingPeer peer had a **SessionExpired** (~24h peer login
  expiry) and could not re-login (`PermissionDenied: no peer auth method`), so `network` had
  `routing_peers_count=0` and NO homelab peer got routes for omada/jwks-mirror. Fixed by
  `kubectl -n netbird rollout restart deploy/router` (re-enrolls via the operator setup key). **This will
  recur every ~24h** — needs a durable fix (non-expiring/ephemeral routing-peer setup key or operator re-auth);
  tracked as a follow-up. See [[netbird-operator-token-scope]].
  **STILL PENDING:** (a) validate the pikvm routing-peer path for physical device adoption (non-NetBird
  devices); (b) THEN cut Omada off Tailscale — delete `service-omada-tailscale.yaml` + its external-dns A
  record; (c) custom domain `omada.network.vgijssel.nl` on the NBResource + external-dns IP sync;
  (d) durable fix for the routing-peer session expiry above.
  Prior BYOP approach (validated 2026-07-26, `https://omada.network.vgijssel.nl` HTTP 200 over the mesh;
  proxy token `kv/network-netbird-proxy#token` — now unused, left in OpenBao) superseded because one
  proxy version could not serve both the HTTPS UI and raw TCP L4 (netbirdio/netbird#6400).
- [x] 1.6 network ESO → OpenBao over the mesh. **APPROACH CHANGED (committed `0da1bea5`):** implemented
  as a NetBird **client sidecar** for the external-secrets pod (`apps/network/src/eso-sidecar/`:
  `setupkey-external-secrets.yaml` + `sidecarprofile-external-secrets.yaml` + `fleet.yaml`), **not** the
  plan's "setup-key ES + repoint store host." The `openbao` ClusterSecretStore keeps
  `server: https://openbao.secret.vgijssel.nl`, now resolved **over the mesh** by the sidecar's NetBird DNS
  (secret's Tailscale VIP retired in `8c257f8d`). Requires operator **v0.7.0** (sidecar DNS, #383).
  The plan's "convert `externalsecret-operator-oauth.yaml` to a setup-key ES" is **superseded** — the
  operator mints its own setup keys (1.3); that Tailscale-operator OAuth ES is now **dead surface → delete in 1.8**.
  **LIVE-VALIDATED 2026-07-28:** the injected sidecar (native init-container `netbird`,
  `restartPolicy=Always`) connects to the mesh (Relay), and network ESO reaches
  `https://openbao.secret.vgijssel.nl/v1/auth/jwt-network/login` over NetBird — the `openbao`
  ClusterSecretStore went **Valid/Ready ("store validated")**. Full cross-cluster JWT loop closed
  (ESO sidecar → mesh → OpenBao → JWKS via `jwks-gateway` → mesh → network `jwks-mirror` → validated).
  **DONE 2026-07-29:** scrubbed stale tailnet comments in `config/{clustersecretstore-openbao,fleet}.yaml`
  (now describe the NetBird eso-sidecar path; dropped the dead `service-openbao-egress.yaml`/`certificate-omada.yaml`
  bundle-inventory refs and the `ACL-A`/`SPEC R8` tailnet-egress language).
  **DONE 2026-07-29 — LIVE-VALIDATED downstream sync:** on a fresh dual-cluster bring-up, all **7**
  `openbao`-store ExternalSecrets on network (cert-manager/cloudflare-api-token, crossplane
  cloudflare-credentials + netbird-mgmt-api-token, external-dns token, netbird-mgmt-api-key, netdata-claim,
  tailscale operator-oauth) are `Ready=True / SecretSynced` with fresh `refreshTime` (~07:39Z, post-start),
  and the ESO pod's `netbird` sidecar reports `Status: Connected` (relay). Full cross-cluster secret path
  proven end-to-end. **1.6 complete.**
- [~] 1.7 Crossplane on network — **APPROACH CHANGED:** DNS managed by Crossplane **`provider-opentofu`**
  (inline HCL via `restapi`), **not** `provider-upjet-cloudflare` (rejected on arm64 — see
  `[[network-cloudflare-dns-opentofu]]`). **DONE:** crossplane core (`crossplane/`, pin 2.3.3),
  `crossplane-provider/` (provider-opentofu + backend RBAC), `cloudflare-config/` (ESO creds +
  `providerconfig-opentofu.yaml` + `workspace-reverse-proxy-dns.yaml`). Records are **per-reverse-proxy CNAMEs**,
  not one apex wildcard. **PENDING:** confirm `api.network.vgijssel.nl` (kubectl custom domain) is covered.
- [ ] 1.8 Remove `apps/network/src/tailscale-proxygroup/`; delete dead `config/externalsecret-operator-oauth.yaml`
  (Tailscale-operator OAuth); scrub stale tailnet comments; retarget platform tailscale bundle `secret`-only.
  **GATED:** `service-omada-tailscale.yaml` stays until the **PiKVM routing-peer path for physical Omada
  device adoption** is live-validated (see 1.5.a) — don't delete the Omada Tailscale LB before then.
- [ ] **Checkpoint:** fresh `network:start`; Connected; kubectl+JWKS via ClusterProxy; Omada UI+devices; CNAMEs resolve; ESO syncs; no tailscale refs

## Phase 2 — secret migration
- [~] 2.1 `apps/secret/src/netbird-config/` — **DONE:** `NBRoutingPeer router` (v1 stack) live + auto-group `secret` Connected — the consumer half of the cross-cluster JWKS path (proven, see 0.3). **PENDING:** ClusterProxy (`api.secret`) for kubectl; exposing OpenBao to `network-k8s` for network ESO. **RECONCILED 2026-07-28:** the OpenBao-exposure half is now delivered by the **BYOP reverse proxy** (openbao sub-plan) + the network **eso-sidecar** consumer (1.6), not a `NetworkResource` here; ClusterProxy `api.secret` for kubectl is still pending (see 2.4).
- [x] 2.2 `authbackend-jwt-network.yaml` `jwksUrl` → `http://jwks-gateway.netbird.svc.cluster.local/openid/v1/jwks` (mesh gateway, plain HTTP — no `jwksCaPem` needed; the ClusterProxy/custom-domain path was superseded by the mirror+gateway). Applied live, AuthBackend Synced/Ready, network ESO validated. See 0.3 + `apps/secret/src/jwks-gateway/`.
- [~] 2.3 secret OpenBao exposure — **largely DONE (`8c257f8d`):** deleted `certificate-secret.yaml` +
  `ingress-openbao.yaml`, moved `ingress-nginx` off the Tailscale LB (ClusterIP). OpenBao is now exposed
  **mesh-only via the BYOP reverse proxy** at `openbao.secret.vgijssel.nl` (see openbao sub-plan T2/T9),
  not a NetBird-minted L7 domain. The "ESO setup-key ES" part is **superseded** (operator mints keys).
  **PENDING:** live bring-up validation (openbao sub-plan **T9**).
- [~] 2.4 Remove secret Tailscale surface — **partial:** `8c257f8d` deleted the OpenBao VIP
  `tailscale-proxygroup/proxygroup.yaml`. **STILL PRESENT:** `tailscale-proxygroup/proxygroup-apiserver.yaml`
  (the `api-secret` kube-apiserver VIP — pending replacement by a NetBird `ClusterProxy api.secret`, see 2.1),
  `apps/platform/src/tailscale/`, and the vendir `tailscale-operator` entry.
- [ ] **Checkpoint:** fresh `secret:start`; Connected; `api.secret` kubectl; `jwt-network` reconciles; **network ESO → secret OpenBao JWT sync**; OpenBao UI over NetBird; `secret:auth`/`forward`

## Phase 3 — remove cert-manager + external-dns + cleanup (Ask-first for account edits)
- [ ] 3.1 Remove `apps/platform/src/cert-manager/` + `clusterissuer-letsencrypt-prod.yaml` + DNS-01 token ES
- [ ] 3.2 Remove `apps/platform/src/external-dns/` + `externalsecret-external-dns.yaml` (DNS now Crossplane-managed)
- [ ] 3.3 Delete Tailscale Services/OAuth clients/ACL + `kv/*-tailscale-*` (confirm PiKVM/shared-policy scope first)
- [ ] 3.4 Repo-wide grep clean (tailscale/cert-manager/external-dns/ProxyGroup); `trunk fmt`+`check`; full dual-cluster bring-up passes SPEC §Testing 1–7
