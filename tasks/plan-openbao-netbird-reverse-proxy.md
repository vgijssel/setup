# Plan: migrate OpenBao (apps/secret) to a NetBird-only reverse proxy

Slice of the broader Tailscale→NetBird migration. **Codified + isolated to the secret cluster**:
the secret cluster owns its BYOP proxy AND its NetBird/Cloudflare registration end-to-end
(secret is the proxy's consumer). All Crossplane/OpenTofu runs on secret.

## Goal

Expose OpenBao at `https://openbao.secret.vgijssel.nl` as a **NetBird-only** private service with
a valid cert, fronted by a `christianhuth/netbird-reverse-proxy` BYOP proxy in `apps/secret` that
registers a dedicated NetBird account cluster **`secret.vgijssel.nl`** (most-specific parent of
the service domain → routes through the proxy co-located with OpenBao). Remove OpenBao's
Tailscale VIP + external-dns exposure; migrate network's cross-cluster reads to the mesh.

## Architecture (all on the secret cluster)

- **BYOP proxy** — `apps/secret/src/netbird-reverse-proxy` (`proxy.domain: secret.vgijssel.nl`,
  trusted `*.secret.vgijssel.nl` cert, token from `kv/secret-netbird-proxy#token` via local ESO).
- **provider-opentofu** — added to `apps/secret/src/crossplane-provider` (alongside provider-vault).
- **Registration Workspaces** — `apps/secret/src/cloudflare-config`:
  - `reverse-proxy-services` (`Mastercard/restapi` CRUD): OpenBao private service →
    `openbao.secret.svc:8200` http direct_upstream, access_groups homelab/network/network-k8s.
  - `reverse-proxy-dns-secret`: `secret.vgijssel.nl` reverse-proxy domain + `*.secret.vgijssel.nl`
    Cloudflare CNAME.
  - ProviderConfig (tfstate `secret-opentofu`) + ESOs (NB PAT `kv/secret-netbird-operator`,
    Cloudflare `kv/cloudflare#credential`).
- **`moon run secret:netbird_proxy_auth`** — mints the proxy token (once) → `kv/secret-netbird-proxy`.

## Tasks

- [x] T1 — Re-vendor the `netbird-reverse-proxy` chart (0.1.0).
- [x] T2 — BYOP proxy bundle `apps/secret/src/netbird-reverse-proxy/`.
- [x] T3 — `proxy.domain: secret.vgijssel.nl`.
- [x] T4 — `secret:netbird_proxy_auth` script + moon task (relocated from network).
- [x] T10 — `provider-opentofu` on the secret cluster.
- [x] T7 — `reverse-proxy-services` Workspace on secret (`Mastercard/restapi`).
- [x] T8 — `reverse-proxy-dns-secret` Workspace on secret.
- [ ] **T9 — LIVE bring-up + validate.** `secret:netbird_proxy_auth` → `secret:apply` (installs
  provider-opentofu + proxy; proxy registers `secret.vgijssel.nl`; workspaces reconcile the
  domain/CNAME/service). Validate `curl https://openbao.secret.vgijssel.nl` over mesh → 200.
  *Live NetBird/OpenBao/Cloudflare mutations — gated on maintainer.*
- [ ] **T5 — Cut network over to mesh.** Confirm network ESO reads OpenBao over mesh (same
  hostname) WHILE tailnet still up; adjust access_groups if the network egress peer's group differs.
- [ ] **T6 — LAST: remove tailnet exposure.** Delete openbao `Ingress` + per-host `Certificate`;
  remove `secret-ingress` ProxyGroup + ingress-nginx tailscale annotations (external-dns prunes
  the A record). Re-validate. Rollback: `git revert`.

## Uncertainties validated live (not guessed)
- Exact proxy-token mint response field name — script captures + validates.
- Which network group(s) the network egress peer is in (access_groups) — validated at T5.
- Whether a nested `secret.vgijssel.nl` reverse-proxy domain registration is accepted alongside
  the existing `vgijssel.nl` — validated at T9 (droppable if it conflicts; parent domain covers it).

## Reverted
- The network-side `netbird_proxy_auth` script/task + the two network Workspaces (moved to secret).
