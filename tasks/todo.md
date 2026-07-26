# TODO: Tailscale → NetBird migration

Source of truth: `SPEC.md` (repo root) + `tasks/plan.md`. Order: **network first, then secret.**
Verify every phase on a **freshly recreated** cluster (`stop` → `start`).

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
- [ ] 0.1 Operator + peer enrollment → **Connected** in group `network-k8s`
- [ ] 0.2 `ClusterProxy` kubectl (impersonation) works; capture endpoint + CNAME target
- [✗] 0.3 **JWKS through the ClusterProxy — INFEASIBLE** (netbird-kubeapi-proxy v0.0.4 forwards only `/api`+`/apis`; `/openid/v1/jwks` 404s). Chosen fallback: **JWKS HTTP mirror + NetworkResource** (maintainer).
  - [x] JWKS HTTP mirror (`apps/network/src/jwks-mirror/`, nginx→apiserver anon /openid/v1/jwks over HTTP) — live, HTTP 200 with real keys.
  - [x] Exposed cross-cluster via **operator v1 stack** (`NBRoutingPeer` + Service `netbird.io/expose` → domain `NBResource` jwks-mirror.netbird.svc.cluster.local + auto-policy; no DNS zone, no crossplane). **Validated: JWKS fetched over NetBird from a peer, HTTP 200 real keys.** (netbird-crossplane-provider evaluated & reverted; Crossplane **core** kept on network for Cloudflare.)
  - [x] secret OpenBao `jwt-network` jwksUrl → `http://jwks-gateway.netbird.svc.cluster.local/openid/v1/jwks` — **DONE & VALIDATED end-to-end on NetBird (2026-07-26).** secret NBRoutingPeer → auto-group `secret` (id d9ius9jl0ubs73flnbb0); network jwks-mirror NBPolicy source resolves to it. `openbao-0` is not a netbird client, so instead of injecting a sidecar into OpenBao (DNS-rewrite risk), a disposable **`jwks-gateway`** socat Pod (SidecarProfile → netbird sidecar in group `secret`) re-serves the mesh mirror on a plain ClusterIP; OpenBao reaches it via normal cluster DNS. Proven: openbao-0 fetches JWKS (kid `ZqpF3JeB…` matches network apiserver), AuthBackend Synced/Ready, and a **fresh network ESO login validates → ClusterSecretStore openbao Valid, no errors.** SPEC success-criterion (a) met on NetBird.
- [ ] 0.4 NetBird auto-TLS on L7 custom domain confirmed; Omada L4 device-adoption cert nuance resolved
- [ ] 0.5 **Live-validate nested hostnames** (`api.network.vgijssel.nl`, `api.secret`, `omada.network`, `openbao.secret`) forward into NetBird via the single `*.vgijssel.nl` wildcard; fallback = explicit per-host CNAMEs
- [ ] **Checkpoint:** record `proxy_cname_target`; review with maintainer

## Phase 1 — network migration
- [x] 1.1 Vendor `netbird-operator` `0.8.0` in `vendir.yml`
- [x] 1.2 `apps/platform/src/netbird-operator/` Fleet bundle (ns `netbird`, PAT secret, mgmt URL var) — deployed to BOTH clusters; operator `Running 1/1`, `netbird-mgmt-api-key` ExternalSecret `SecretSynced` (per-cluster `kv/<cluster>-netbird-operator#access_token`)
- [x] 1.3 `tailscale_auth.sh` → `netbird_auth.sh`; seeds `netbird-mgmt-api-key` PAT (`kv/network-netbird-operator#access_token`) — operator mints its own SetupKeys, so no setup-key seeding; renamed moon task `tailscale_auth`→`netbird_auth`; rewired `start.sh`/`apply.sh`/`stop.sh` comments
- [~] 1.4 `apps/network/src/netbird-config/` — Group `network-k8s` + SetupKey **Ready**; ClusterProxy `api-network` **Ready** (3/3 proxy peers `connected` in network-k8s, kube-apiserver fronted w/ impersonation RBAC, kubectl-only). **SUPERSEDED:** the "OIDC-discovery CRB swap (JWKS-via-ClusterProxy)" is dropped — JWKS now rides the mirror (`jwks-mirror` bundle, anonymous apiserver read), so the anonymous `clusterrolebinding-oidc-discovery.yaml` must **stay** (its comments still reference the retired Tailscale ProxyGroup — cleanup pending in 1.8). **Still pending:** custom-domain `api.network.vgijssel.nl` reachability (NetBird custom domain + Cloudflare CNAME — Ask-first, 1.7).
- [~] 1.5 Omada over NetBird. **Approach revised (2026-07-26, maintainer):** UI is a NetBird-Only
  **private** reverse-proxy service (mesh-only, no interstitial), not L7 public. Shared cloud cluster
  can't do private (`supports_private:false`), so deployed a **BYOP proxy** in-cluster
  (`apps/network/src/netbird-reverse-proxy`, chart christianhuth 0.1.0) → private account cluster
  `vgijssel.nl`. Service managed via **opentofu + Mastercard/restapi** Workspace
  (`cloudflare-config/workspace-reverse-proxy-services.yaml`) since the netbird TF provider lacks
  private/access_groups (upstream PR #162); target_type=cluster + direct_upstream + skip_tls_verify →
  in-cluster Omada 8043. **DONE & validated:** `https://omada.network.vgijssel.nl` → HTTP 200 from the
  Mac (homelab peer) over the mesh; proxy token in `kv/network-netbird-proxy#token`.
  **PENDING:** (a) maintainer validates the switch path via pikvm routing peer; (b) THEN cut Omada off
  Tailscale — rewrite `service-omada.yaml` to ClusterIP, drop the Tailscale LB + external-dns A record,
  delete `certificate-omada.yaml`; (c) optional trusted client cert (proxy self-signed CN=vgijssel.nl today).
- [ ] 1.6 network `config/` — ESO setup-key ES (`kv/network-netbird`); remote `openbao` store host over NetBird
- [ ] 1.7 Add Crossplane core + `provider-upjet-cloudflare` to network; single DNS-only wildcard `Record` MR — `*.vgijssel.nl` → `eu1.netbird.services`
- [ ] 1.8 Remove `apps/network/src/tailscale-proxygroup/`; retarget platform tailscale bundle `secret`-only
- [ ] **Checkpoint:** fresh `network:start`; Connected; kubectl+JWKS via ClusterProxy; Omada UI+devices; CNAMEs resolve; ESO syncs; no tailscale refs

## Phase 2 — secret migration
- [~] 2.1 `apps/secret/src/netbird-config/` — **DONE:** `NBRoutingPeer router` (v1 stack) live + auto-group `secret` Connected — the consumer half of the cross-cluster JWKS path (proven, see 0.3). **PENDING:** ClusterProxy (`api.secret`) for kubectl; exposing OpenBao to `network-k8s` for network ESO (the reverse direction — has the cert/SNI wrinkle since ESO uses the public `openbao.secret.vgijssel.nl` name, not the mesh domain).
- [x] 2.2 `authbackend-jwt-network.yaml` `jwksUrl` → `http://jwks-gateway.netbird.svc.cluster.local/openid/v1/jwks` (mesh gateway, plain HTTP — no `jwksCaPem` needed; the ClusterProxy/custom-domain path was superseded by the mirror+gateway). Applied live, AuthBackend Synced/Ready, network ESO validated. See 0.3 + `apps/secret/src/jwks-gateway/`.
- [ ] 2.3 secret `config/` — ESO setup-key ES (`kv/secret-netbird`); OpenBao UI via NetBird L7; ingress-nginx off Tailscale LB; delete `certificate-secret.yaml`
- [ ] 2.4 Remove `apps/secret/src/tailscale-proxygroup/`, `apps/platform/src/tailscale/`, vendir `tailscale-operator` entry
- [ ] **Checkpoint:** fresh `secret:start`; Connected; `api.secret` kubectl; `jwt-network` reconciles; **network ESO → secret OpenBao JWT sync**; OpenBao UI over NetBird; `secret:auth`/`forward`

## Phase 3 — remove cert-manager + external-dns + cleanup (Ask-first for account edits)
- [ ] 3.1 Remove `apps/platform/src/cert-manager/` + `clusterissuer-letsencrypt-prod.yaml` + DNS-01 token ES
- [ ] 3.2 Remove `apps/platform/src/external-dns/` + `externalsecret-external-dns.yaml` (DNS now Crossplane-managed)
- [ ] 3.3 Delete Tailscale Services/OAuth clients/ACL + `kv/*-tailscale-*` (confirm PiKVM/shared-policy scope first)
- [ ] 3.4 Repo-wide grep clean (tailscale/cert-manager/external-dns/ProxyGroup); `trunk fmt`+`check`; full dual-cluster bring-up passes SPEC §Testing 1–7
