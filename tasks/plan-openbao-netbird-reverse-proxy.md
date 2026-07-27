# Plan: migrate OpenBao (apps/secret) to a NetBird-only reverse proxy

Slice of the broader Tailscale→NetBird migration (see `tasks/plan.md`, `tasks/todo.md`),
scoped to the `secret` cluster's OpenBao exposure.

## Goal

Expose OpenBao at `https://openbao.secret.vgijssel.nl` as a **NetBird-only** (private,
mesh-only, no public interstitial) service with a **valid** cert, fronted by a self-hosted
`christianhuth/netbird-reverse-proxy` BYOP proxy running in `apps/secret`. Remove OpenBao's
Tailscale VIP + external-dns exposure. Migrate the `network` cluster's cross-cluster secret
reads to reach OpenBao over the NetBird mesh (same hostname).

Pattern copied from the removed `apps/network/src/netbird-reverse-proxy` BYOP bundle
(git `e0bafbf2^`). Live NetBird mgmt-API + OpenBao kv steps are run by the maintainer.

## Ordering invariant

The tailnet path stays up as a **fallback** until mesh reachability is proven for BOTH the
workstation AND the network cluster. **Removal (task 6) is applied LAST.**

## Tasks

- [ ] **T1 — Re-vendor the chart.** Restore the `netbird-reverse-proxy` (0.1.0) entry in
  `third_party/vendir/vendir.yml` + `vendir.lock.yml`; `moon run third_party/vendir:build`.
  *Gate:* `third_party/vendir/charts/netbird-reverse-proxy/Chart.yaml` exists; `helm show
  chart` succeeds. Additive/safe.
- [ ] **T2 — Add the BYOP proxy bundle** `apps/secret/src/netbird-reverse-proxy/`:
  umbrella `Chart.yaml` (file:// dep), `values.yaml` (`proxy.private=true`,
  `proxy.domain=vgijssel.nl`, cloud mgmt default, `auth.existingSecret=netbird-proxy-token`,
  `tls.source=secret` + `existingSecret=netbird-reverse-proxy-cert`, NET_BIND_SERVICE,
  service ClusterIP), `templates/certificate-netbird-reverse-proxy.yaml` (`*.secret.vgijssel.nl`,
  secretName `netbird-reverse-proxy-cert`, letsencrypt-prod), `templates/externalsecret-netbird-proxy-token.yaml`
  (LOCAL `openbao` store, `kv/secret-netbird-proxy#token` → Secret `netbird-proxy-token`/`token`),
  `fleet.yaml` (ns `netbird`, releaseName, dependsOn netbird-operator, target `secret`).
  *Gate:* `helm template` renders `private: true`, cert dnsName `*.secret.vgijssel.nl`, kv key
  `secret-netbird-proxy`; yaml lints. Additive/safe.
- [ ] **T3 — LIVE: mint proxy token + seed kv.** `POST /api/reverse-proxies/proxy-tokens`
  → `bao kv put kv/secret-netbird-proxy token=…`; apply the bundle; proxy connects
  (registers the private account cluster). *Maintainer runs.*
- [ ] **T4 — LIVE: create the private service.** `POST /api/reverse-proxies/services`
  (mode http, domain `openbao.secret.vgijssel.nl`, target openbao ClusterIP :8200 http,
  `direct_upstream:true`, `access_groups`=[homelab, network, secret]). Validate from the Mac:
  `curl https://openbao.secret.vgijssel.nl` over mesh → 200, valid cert. *Maintainer runs.*
- [ ] **T5 — Cut network over to mesh.** Update `apps/network` ClusterSecretStore + fleet
  comments (URL unchanged). Ensure the network *cluster peer* resolves+routes the hostname
  over mesh (may need a domain NBResource on the secret side — validate live). Confirm network
  ESO still reads secrets WHILE tailnet is still up.
- [ ] **T6 — LAST: remove tailnet exposure.** Delete openbao `Ingress` +
  per-host `Certificate`; remove `secret-ingress` ProxyGroup + ingress-nginx tailscale
  annotations (external-dns prunes the A record). Re-validate workstation + network.
  *Rollback:* `git revert`.

## Out of scope / flagged
- Removing ingress-nginx entirely (leave idle unless requested).
- `api-secret` kube-apiserver ProxyGroup stays untouched.
- Whether the network *cluster* needs an extra domain NBResource for mesh DNS is validated
  live (removal sequenced last with tailnet fallback for exactly this reason).
