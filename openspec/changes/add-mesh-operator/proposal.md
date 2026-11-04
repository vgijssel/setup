# Proposal

## Why

A POC (`poc_netbird_mesh_peer.md`, executed 2026-10-24/26) proved that one pod — Envoy plus a NetBird
client sidecar — can serve **both** ingress and egress for a single service, across terminated HTTPS,
raw TCP and raw UDP, in one process, across two clusters. That unlocks what the current
`NBRoutingPeer` model cannot express: a NetBird ACL saying "service A connects to service B on port Y"
instead of "the cluster connects to B".

The POC also surfaced a set of failures that a Helm chart structurally cannot prevent, because each
needs either cluster introspection, cross-resource validation, or runtime allocation:

- **A resolver startup race silently and permanently kills egress.** Envoy reached its dispatch loop
  2.2 s before the NetBird client rewrote `/etc/resolv.conf`; every STRICT_DNS egress cluster then sat
  at `membership_total: 0` forever — nothing logged, `update_failure: 0`, pod `2/2 Ready`, and no
  self-heal across 300 s of polling. Ingress kept working throughout.
- **Egress container ports must be allocated, not authored.** kube-proxy DNATs the ClusterIP away, so
  the target port is the only demux signal and every `(destination, port)` pair needs a
  cluster-unique port. Hand-assigning them does not scale past one service.
- **Writing into a shared CoreDNS ConfigMap needs per-key ownership.** The secret cluster's
  `coredns-custom` already carries a hand-managed `jwks-network.server` key that a whole-object write
  would delete.
- **The resolver wiring can be removed underneath you.** A vcluster control-plane restart reverted a
  CoreDNS Deployment edit while leaving the ConfigMap intact — config present, nothing mounted,
  nothing resolving, nothing reporting an error.
- **The CoreDNS contract differs per distro.** vcluster listens on `:1053`, k3s and RKE2 on `:53`;
  k3s ships two import globs, and RKE2 ships **none**. A block on the wrong port is silently never
  consulted.

Separately, `libs/mesh-service` cannot do egress at all: Envoy Gateway's `Backend` API is gated off in
this repo (`extensionApis: {}`), so a `Backend` with an FQDN endpoint is accepted and gets no status.
The POC therefore used static-config Envoy, which no existing chart renders.

Finally, the repo has no working release automation — `.github/workflows/release.yaml` is commented out
under `# TODO: Need to replace release pipeline with something else`, and
`release-openbao-netbird-plugin.yaml` hardcodes `VERSION: 0.1.3`. A new first-party component needs a
release path, and release-please is the replacement for that TODO.

## What Changes

- Add **`libs/mesh-operator`**: a Python [kopf](https://github.com/nolar/kopf) operator, packaged with
  hatchling/uv and shipped as a container image plus a Helm chart, following the existing
  `libs/fleet-mcp` and `libs/openbao-*-plugin` conventions.
- Add two CRDs under the new API group **`mesh.vgijssel.nl/v1alpha1`**:
  - **`MeshZone`** (cluster-scoped) — the NetBird account (management URL, credentials, `dnsDomain`),
    the CoreDNS resolver wiring, and the egress container-port pool.
  - **`MeshPeer`** (namespaced) — one exposed service: `ingress.listeners` (data plane) and
    `egress.consumers` + `egress.destinations`.
- The operator reconciles each `MeshPeer` into a static-config Envoy Deployment with a NetBird client
  sidecar, a forwarder Service, the NetBird identity (group, setup key, extra DNS label), and an entry
  in the aggregated CoreDNS view ConfigMap.
- Encode the POC's findings as **invariants rather than options**: a blocking init container ordered
  after the mesh client, egress listeners bound to the pod IP, file-based SDS for in-place certificate
  reload, one NetBird policy per protocol, and no resolving fallback in the view zone.
- Write the CoreDNS view entry via **Server-Side Apply** with field manager `mesh-operator`, owning
  exactly one key and failing closed on conflict instead of clobbering.
- Adopt **release-please in manifest mode repo-wide**: release the operator, and migrate
  `openbao-netbird-plugin` and `openbao-cloudflare-plugin` off hardcoded versions, replacing the
  commented-out release pipeline.
- `libs/mesh-service` and the three bundles consuming it (`mesh-openbao`, `mesh-omada`, `mesh-jwks`)
  are **left untouched**. Migration is deliberately out of scope for this change.
- Access policies are **not** created by the operator. It creates the `svc-<name>` destination group
  (identity), but who may reach a service stays in the NetBird UI, Crossplane, or a later CRD.

## Capabilities

### New Capabilities

- `mesh-egress-identity`: A service reaching *other* mesh services through its own peer, so NetBird
  sees one identity for that service in both directions. Covers identity-scoped name resolution (a
  consumer resolves a mesh hostname only if it carries the declared identity), the forwarder path and
  its port-based demultiplexing, default-deny for unmatched consumers, and the requirement that
  consumer pods hold no independent route onto the overlay.
- `mesh-peer-operator`: Declarative, operator-managed lifecycle for mesh peers. Covers the `MeshPeer`
  and `MeshZone` API surface, ownership and safety guarantees when writing into cluster-shared DNS
  configuration, continuous verification that the resolver wiring is actually in effect, allocation of
  egress ports from a cluster pool, and preventing the misconfigurations that otherwise fail silently.

### Modified Capabilities

<!-- None. Scope is parallel delivery: libs/mesh-service keeps satisfying mesh-service-exposure
     unchanged, and no existing exposure is migrated by this change. The operator's own ingress
     behaviour (hostname, certificate, port space, identity) is already specified by
     mesh-service-exposure and is deliberately not restated. -->

## Impact

**New code** — `libs/mesh-operator/` (Python package `mesh_operator`, `src/` layout, Dockerfile,
Helm chart, `moon.yml`, `release.sh`), plus CRD manifests.

**Release infrastructure** — `release-please-config.json` and `.release-please-manifest.json` at the
repo root; a new release workflow; changes to `.github/workflows/release.yaml` and
`release-openbao-netbird-plugin.yaml`.

**Cluster prerequisites** — the operator needs write access to the CoreDNS ConfigMap in `kube-system`
(scoped by `resourceNames`), read on the CoreDNS Deployment to discover the import hook, and a NetBird
PAT with role `admin` (Group creation requires it). RKE2 clusters additionally need a one-time
`HelmChartConfig` because `rke2-coredns` ships no import hook.

**Known risk, carried into design** — `main` has `required_signatures: true`, and this repo has a
recorded case of an unsigned bot PR being blocked. release-please creates commits through the GitHub
API, which GitHub normally signs, but that must be verified early rather than assumed.

**Not affected** — `libs/mesh-service`, `apps/secret/src/mesh-openbao`, `apps/network/src/mesh-omada`,
`apps/network/src/mesh-jwks`, and the `netbird.io` operator (pinned `0.7.0`), which continues to own
`Group` and `SetupKey` CRDs and must coexist.
