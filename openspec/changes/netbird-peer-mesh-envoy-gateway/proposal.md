# Proposal

## Why

`apps/secret`, `apps/network` and `apps/platform` expose in-mesh services through **three different mechanisms**, each bought with its own workaround:

| Service | Mechanism today | Cost |
|---|---|---|
| OpenBao (`openbao.secret.vgijssel.nl`) | NetBird BYOP reverse proxy + private account cluster + `Mastercard/restapi` OpenTofu Workspace | a proxy fleet, a `proxy_cluster` that binds once and never rebinds, a minted proxy token per cluster, a wildcard cert, a watchdog, and two `moon` tasks |
| Omada (`omada.network.vgijssel.nl`) | `NBRoutingPeer` + domain `NBResource` + pinned ClusterIP `10.96.0.20` + grey-cloud Cloudflare A record + CoreDNS override | a routing peer to keep logged in, an immutable pinned ClusterIP, a public A record that must shadow the `*.vgijssel.nl` wildcard |
| PiKVM (`pikvm.network.vgijssel.nl`) | a **second** BYOP reverse proxy | a second proxy, token, wildcard cert and domain registration |

Neither stack delivers "any port + a valid certificate" on its own. The reverse-proxy path cannot carry L4 at all — `mode=tcp` services silently never bind on reverse-proxy `0.72.x` ([netbirdio/netbird#6400](https://github.com/netbirdio/netbird/issues/6400)), which is exactly why Omada had to abandon it for the `NBResource` path. So the repo maintains two incompatible exposure stacks and a per-service naming scheme that leaks cluster placement into hostnames.

Three facts now collapse all of this into one mechanism:

1. NetBird supports a **custom account peer DNS domain** (`Settings > Networks > DNS Domain`), so peers resolve as `<label>.vpn.blueora.ng` instead of `<label>.netbird.cloud` ([docs](https://docs.netbird.io/manage/settings/networks)).
2. **`SidecarProfile.spec.extraDNSLabels` exists in the pinned operator's API** (`netbird.io_sidecarprofiles.yaml`, v0.7.0) — "assigns additional DNS names to peers beyond their default hostname", up to 32 per peer, resolving as `[label].[peer-dns-domain]` ([docs](https://docs.netbird.io/manage/dns/extra-dns-labels)). This pins a *stable* name onto an otherwise pod-name-derived peer.
3. **Gateway API v1.6 graduated `TCPRoute` and `UDPRoute` to Standard**, and Envoy Gateway `1.9.2` bundles the v1.6.1 CRDs (verified in the pulled chart). One Envoy can terminate HTTPS with a real certificate **and** forward raw TCP **and** UDP.

Give each exposed service its own Envoy Gateway pod with a NetBird client sidecar and it becomes a first-class peer with its own `100.x` address and DNS label — so **every service owns the whole port space**. No proxy, no pinned ClusterIPs, no port arbitration, no public A records.

## What Changes

- **NetBird account peer DNS domain becomes `vpn.blueora.ng`.** Every exposed service is `<service>.vpn.blueora.ng` in one **flat** namespace — no per-cluster nesting. Peer login expiration is disabled account-wide (this change multiplies sidecar peers, and login expiry is the documented root cause of wedged peers).
- **`blueora.ng` is delegated to Cloudflare** as a new zone, used only for ACME DNS-01 TXT records under `_acme-challenge.<service>.vpn.blueora.ng` — and later for public routes at the apex, which are out of scope here.
- **BREAKING — no wildcard record may ever exist in the `blueora.ng` zone.** Cloudflare wildcards answer at *arbitrary depth*, so `*.blueora.ng` would make every mesh name publicly resolvable, which NetBird explicitly warns overrides its own resolver for those names.
- **Vendor Envoy Gateway** `1.9.2` (`oci://docker.io/envoyproxy/gateway-helm`) and deploy one control plane per cluster via a new `apps/platform/src/envoy-gateway/` bundle.
- **Add `apps/platform/src/mesh-service/`** — a first-party shared Helm chart that renders a complete mesh peer for one service name: `Gateway` + `EnvoyProxy` + routes, a `Certificate`, a NetBird `Group`/`SetupKey`/`SidecarProfile`/`NBPolicy`, and a sidecar watchdog.
- **Expose three services through it**: `openbao.vpn.blueora.ng` (secret cluster), `omada.vpn.blueora.ng` and `jwks-network.vpn.blueora.ng` (network cluster).
- **Re-point cross-cluster consumers**: the network cluster's `ClusterSecretStore`s at `https://openbao.vpn.blueora.ng`, and OpenBao's `jwt-network` `jwksUrl` at `https://jwks-network.vpn.blueora.ng` (via the surviving socat gateway plus a CoreDNS override, because OpenBao deliberately must not become a mesh client).
- **BREAKING — remove the entire BYOP reverse-proxy stack**: both per-cluster proxy bundles, the shared `netbird-reverse-proxy-shared` chart, the vendored proxy chart, the `restapi`/`netbird_reverse_proxy_domain` OpenTofu Workspaces, the two proxy-token `moon` tasks and their script, and the OpenBao `proxy-token` role config.
- **BREAKING — remove `NBRoutingPeer`/`NBResource` exposure for mesh clients**, including the `netbird.io/expose` annotations and the routing-peer watchdogs. It survives on the network cluster for one reason only: Omada's physical devices.
- **BREAKING — `*.vgijssel.nl` is retired as a mesh service namespace.** The zone stays (other groupings use it); only the mesh hostnames move.
- **Cutover is big-bang but strictly additive until the end**: nothing is deleted until every new path is verified live, behind an explicit DNS-01 go/no-go gate.

### Two limits this change cannot remove

Requirement "use NetBird peers directly" has two hard edges, called out rather than glossed over:

1. **Omada's physical APs and switches cannot be NetBird peers.** A `100.x` peer address is neither stable nor publicly resolvable, so the device path stays exactly as it is (pinned ClusterIP + `NBResource` + public A record, renamed to `omada.blueora.ng`), used only by devices while humans use `omada.vpn.blueora.ng`.
2. **PiKVM's valid certificate was the only reason its reverse proxy existed.** Removing the proxy means `pikvm.vpn.blueora.ng` serves the box's self-signed certificate. That is the honest consequence; both upgrade paths are follow-ups.

## Capabilities

### New Capabilities
- `mesh-service-exposure`: publishing an in-cluster Kubernetes Service into the NetBird mesh as a dedicated peer at a flat `<name>.vpn.blueora.ng` name — owning its full TCP/UDP port space, serving a publicly-trusted certificate, reachable only by peers in explicitly named NetBird groups, and resolvable only inside the mesh.

### Modified Capabilities
<!-- None. The project has no specs yet (`openspec list --specs` → "No specs found"), so the
     BYOP reverse-proxy and NBResource exposure stacks this change removes were never captured
     as capabilities. Their removal is handled via Impact + tasks.md rather than a delta spec,
     following the precedent set by openspec/changes/migrate-from-pihole-to-k8s-gateway. -->

## Impact

- **New code**
  - `third_party/vendir/vendir.yml` entry + `third_party/vendir/charts/envoy-gateway/` (pinned `1.9.2`)
  - `apps/platform/src/envoy-gateway/` (umbrella bundle) and `apps/platform/src/mesh-service/` (shared chart, no `fleet.yaml`)
  - `apps/secret/src/mesh-openbao/`, `apps/network/src/mesh-omada/`, `apps/network/src/mesh-jwks/`
  - CoreDNS override for `jwks-network.vpn.blueora.ng` and an `ExternalSecret` for the `blueora.ng` Cloudflare token
- **Modified code**
  - `apps/platform/src/config/` — second Cloudflare token wired into the `letsencrypt-prod` solver, or a sibling `ClusterIssuer` if one token cannot cover both zones
  - `apps/network/src/config/clustersecretstore-openbao*.yaml`, `apps/secret/src/openbao-config/authbackend-jwt-network.yaml`, `apps/secret/src/jwks-gateway/pod-jwks-gateway.yaml`
  - `apps/network/src/omada/templates/service-omada.yaml` (drop `netbird.io/*`, keep ClusterIP + `external-dns` for devices), `apps/network/src/external-dns/values.yaml`
  - `apps/secret/moon.yml` (drop two proxy-token tasks), `apps/network/SPEC.md`, `apps/network/PLAN.md`, `apps/secret/CLAUDE.md`
- **Removed code** — the reverse-proxy bundles and shared chart, the vendored `netbird-reverse-proxy` chart, three OpenTofu Workspaces, `put_netbird_proxy_auth.sh`, the routing peers and their watchdogs, and `certificate-omada.yaml`'s mesh-facing role
- **Dependencies** — adds Envoy Gateway `1.9.2` + Gateway API v1.6.1 CRDs to both clusters; removes the `netbirdio/reverse-proxy` image and the `Mastercard/restapi` OpenTofu provider. NetBird operator stays pinned at `v0.7.0` (this design depends on its sidecar DNS behaviour)
- **Out-of-band / manual** — Cloudflare zone delegation and a scoped DNS-edit token; NetBird account DNS domain, disabled login expiration, and post-cutover deletion of the two BYOP proxy clusters
- **Not affected** — `ClusterProxy` kube-apiserver access, LAN/VLAN configuration, Omada device adoption, and `apps/enigma-cluster` (which still consumes the vendored `tailscale-operator` chart)
