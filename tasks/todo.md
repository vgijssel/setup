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
  - [ ] NetworkResource fronting the mirror — blocked on NetBird **DNS zone** decision (dnsZoneRef needs an existing zone; account dns_domain empty). Investigating operator CRDs + netbird-crossplane-provider.
  - [ ] secret OpenBao `jwt-network` jwksUrl → mirror over NetBird (http).
- [ ] 0.4 NetBird auto-TLS on L7 custom domain confirmed; Omada L4 device-adoption cert nuance resolved
- [ ] 0.5 **Live-validate nested hostnames** (`api.network.vgijssel.nl`, `api.secret`, `omada.network`, `openbao.secret`) forward into NetBird via the single `*.vgijssel.nl` wildcard; fallback = explicit per-host CNAMEs
- [ ] **Checkpoint:** record `proxy_cname_target`; review with maintainer

## Phase 1 — network migration
- [x] 1.1 Vendor `netbird-operator` `0.8.0` in `vendir.yml`
- [x] 1.2 `apps/platform/src/netbird-operator/` Fleet bundle (ns `netbird`, PAT secret, mgmt URL var) — deployed to BOTH clusters; operator `Running 1/1`, `netbird-mgmt-api-key` ExternalSecret `SecretSynced` (per-cluster `kv/<cluster>-netbird-operator#access_token`)
- [ ] 1.3 `tailscale_auth.sh` → `netbird_auth.sh`; seed PAT + setup-key; rename moon task; edit `start.sh`
- [~] 1.4 `apps/network/src/netbird-config/` — Group `network-k8s` + SetupKey **Ready**; ClusterProxy `api-network` **Ready** (3/3 proxy peers `connected` in network-k8s, kube-apiserver fronted w/ impersonation RBAC). **Still pending:** OIDC-discovery CRB swap (JWKS-via-ClusterProxy) + custom-domain `api.network.vgijssel.nl` reachability (NetBird custom domain + Cloudflare CNAME — Ask-first).
- [ ] 1.5 Omada: drop Tailscale LB; UI via NetBird L7, device ports via L4 NetworkResource; delete `certificate-omada.yaml`
- [ ] 1.6 network `config/` — ESO setup-key ES (`kv/network-netbird`); remote `openbao` store host over NetBird
- [ ] 1.7 Add Crossplane core + `provider-upjet-cloudflare` to network; single DNS-only wildcard `Record` MR — `*.vgijssel.nl` → `eu1.netbird.services`
- [ ] 1.8 Remove `apps/network/src/tailscale-proxygroup/`; retarget platform tailscale bundle `secret`-only
- [ ] **Checkpoint:** fresh `network:start`; Connected; kubectl+JWKS via ClusterProxy; Omada UI+devices; CNAMEs resolve; ESO syncs; no tailscale refs

## Phase 2 — secret migration
- [ ] 2.1 `apps/secret/src/netbird-config/` — SetupKey, Group, ClusterProxy (`api.secret`), NetworkResource exposing OpenBao to `network-k8s`
- [ ] 2.2 `authbackend-jwt-network.yaml` `jwksUrl` → `https://api.network.vgijssel.nl/openid/v1/jwks` + add `jwksCaPem` (network CA)
- [ ] 2.3 secret `config/` — ESO setup-key ES (`kv/secret-netbird`); OpenBao UI via NetBird L7; ingress-nginx off Tailscale LB; delete `certificate-secret.yaml`
- [ ] 2.4 Remove `apps/secret/src/tailscale-proxygroup/`, `apps/platform/src/tailscale/`, vendir `tailscale-operator` entry
- [ ] **Checkpoint:** fresh `secret:start`; Connected; `api.secret` kubectl; `jwt-network` reconciles; **network ESO → secret OpenBao JWT sync**; OpenBao UI over NetBird; `secret:auth`/`forward`

## Phase 3 — remove cert-manager + external-dns + cleanup (Ask-first for account edits)
- [ ] 3.1 Remove `apps/platform/src/cert-manager/` + `clusterissuer-letsencrypt-prod.yaml` + DNS-01 token ES
- [ ] 3.2 Remove `apps/platform/src/external-dns/` + `externalsecret-external-dns.yaml` (DNS now Crossplane-managed)
- [ ] 3.3 Delete Tailscale Services/OAuth clients/ACL + `kv/*-tailscale-*` (confirm PiKVM/shared-policy scope first)
- [ ] 3.4 Repo-wide grep clean (tailscale/cert-manager/external-dns/ProxyGroup); `trunk fmt`+`check`; full dual-cluster bring-up passes SPEC §Testing 1–7
