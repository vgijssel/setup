# Design

## Context

See `proposal.md` — Why. The behavioural contract is in `specs/mesh-egress-identity/spec.md` and
`specs/mesh-peer-operator/spec.md`; this document covers how it is built and why each mechanism was
chosen over its alternatives.

Every decision below is grounded in a measurement recorded in `poc_netbird_mesh_peer.md` (RESULTS,
2026-10-24/26). Constraints that shape the approach:

- **Envoy Gateway cannot carry egress in this repo.** `extensionApis: {}` gates off the `Backend` API;
  a `Backend` with an FQDN endpoint is accepted by the apiserver and gets no status. So the data plane
  must be static-config Envoy, which no existing chart renders.
- **Views must evaluate in the cluster's primary DNS server process.** Views key on the remote IP of
  the DNS packet, and forwarding replaces it with the forwarder's own address.
- **The CoreDNS contract differs per distro.** vcluster listens on `:1053`, k3s and RKE2 on `:53`; k3s
  ships two import globs, RKE2 ships none; vcluster reverts Deployment edits at control-plane restart
  and k3s reverts them at version upgrade.
- **The upstream `netbird.io` operator (pinned `0.7.0`) stays.** It continues to own `Group` and
  `SetupKey` CRDs. This operator must coexist, not replace it.

## Goals / Non-Goals

**Goals:**

- One reconciler covering both directions for a service, so a single `MeshPeer` yields one peer
  identity used for ingress and egress.
- Make the POC's silent failures either impossible to express or visibly reported — the spec calls for
  this; the design's job is to choose mechanisms that give it for free rather than by vigilance.
- Be installable on vcluster, k3s, RKE2 and managed distros without per-distro code paths.
- Never damage cluster DNS. The blast radius of a bad write is the whole cluster's name resolution.

**Non-Goals:**

- No migration of `mesh-openbao`, `mesh-omada`, `mesh-jwks`, and no removal of `libs/mesh-service`.
- No access-policy management. The operator creates the identity group only.
- No multi-account support. `zoneRef` exists so adding it later is additive, but one `MeshZone` is
  assumed throughout.
- No replacement of the upstream NetBird operator.

## Decisions

### D1. Static-config Envoy with a NetBird client as a native sidecar

**Chosen** because Envoy Gateway cannot route to a mesh FQDN here (see Context) and because the POC ran
five listeners across three protocols and both directions in one static config with no interference.

The sidecar is an `initContainer` with `restartPolicy: Always` rather than an injected container, so it
can carry a `preStop` that deregisters the peer. A peer left holding the service's extra DNS label
round-robins against its own replacement.

*Alternative rejected:* the operator's `SidecarProfile` injection — it cannot carry `preStop`, which is
the documented cause of stale peers accumulating.

*Trap:* `envoyproxy/envoy`'s `docker-entrypoint.sh` fails `chown /dev/stdout` under a hardened
`securityContext`, exits 1, and emits **nothing but the chown warning** — a valid config looks like a
config error. Invoke `/usr/local/bin/envoy` directly.

### D2. CoreDNS views live in the cluster's primary DNS server (option A)

**Chosen.** Option C (a second CoreDNS behind a stub-domain `forward`) was falsified by experiment and
is *worse than non-functional*: the view does not break, it evaluates the **forwarder's** identity. With
the main CoreDNS pod labelled, every client in the cluster — including the unlabelled control pod —
received the mesh address. It passes the happy-path test while failing default-deny **open**.

`pods verified` requires pod list/watch on the CoreDNS ServiceAccount; vcluster's `system:coredns`
ClusterRole already grants it, so option A needs **no RBAC change**. Option B (a separate CoreDNS that
consumers point at directly) remains the fallback only for clusters with no inclusion hook and no
values-level escape hatch; it carries the POC's negative result that appending a second
`dnsConfig.nameservers` entry does not work for Go clients, so it requires `dnsPolicy: None` with a
complete search list.

### D3. One ConfigMap entry, regenerated whole, written with Server-Side Apply

The operator owns exactly one key (default `mesh-operator.server`) and regenerates it from the full
live `MeshPeer` set on every reconcile.

- **Whole-key regeneration, not per-peer keys.** A deleted peer whose key outlives it is a *stale
  grant*; regenerating from the live set makes that unrepresentable. Per-key would not even contain the
  blast radius: a parse error in any imported file CrashLoops CoreDNS entirely (measured — the
  single-line `kubernetes cluster.local { pods verified }` form). Granularity buys nothing; the real
  mitigation is **validate the rendered block parses before writing**.
- **SSA, not whole-object apply.** Verified: `ConfigMap.data` is a granular map, so `managedFields`
  tracks ownership per entry. A foreign key survives; a contested key returns `409` naming the other
  manager — including against imperatively-created keys (`kubectl-create`, operation `Update`) with the
  user's content left intact; and applying with the key absent removes only the operator's entry.
  `force` is never set. Whole-object apply would have deleted the secret cluster's hand-managed
  `jwks-network.server`.
- **Render from a live list, not kopf's index.** A handler firing before the index is fully populated
  would render a *truncated* zone and silently drop peers. With a handful of CRs a live list is cheap
  and immune to warm-up ordering.
- **Idempotent writes self-debounce.** Compare rendered content to current and skip if equal; at
  startup N events collapse to one write.

### D4. Discover the resolver hook; derive the port; never edit the DNS Deployment

The operator reads the DNS Deployment's `volumes`/`volumeMounts`, extracts every top-level `import
<glob>` from the Corefile, and writes into the ConfigMap backing a mount that a glob covers. No distro
matrix.

Editing the Deployment to add a volume is explicitly **not** done: measured, vcluster reverted exactly
that at control-plane restart, leaving the ConfigMap present and orphaned — config correct, nothing
mounted, nothing reporting an error. k3s survives restart (the Addon re-applies only on manifest
checksum change) but reverts at upgrade, and regenerates its manifest from an embedded template on
every start. Both argue for using the hook rather than creating one.

`listenPort` is **derived** from the Corefile's own server block and cross-checked against the DNS
Service's `targetPort` — it is not a spec field. vcluster says `1053`, k3s and RKE2 say `53`; requiring
a user to retype it is requiring them to restate what the cluster already declares, and a wrong value is
silent.

RKE2 ships no hook at all (verified against `rke2-charts/rke2-coredns` 1.49.002: zero `import`, one
volume). Its remedy is a one-time `HelmChartConfig` with `extraConfig.import.parameters` plus
`extraVolumes`/`extraVolumeMounts`; the operator reports this as a named prerequisite and emits the
snippet rather than failing opaquely.

Propagation is eventually consistent, not instant: measured **56 s** for an added zone and **22 s** for
a removed one, with no CoreDNS restart — the `reload` plugin does watch imported files. The operator
never restarts CoreDNS; that is the user's cluster-critical component.

### D5. Egress ports are allocated from a `MeshZone` pool and reported in status

kube-proxy DNATs the forwarder ClusterIP away before Envoy sees the packet, so the target port is the
only demultiplexing signal — and for UDP there is no SNI or Host to fall back on. Every
`(destination, port)` pair therefore needs a cluster-unique container port. Allocation lives in
`status.egressPortMap`; the field is not settable. Hand-assignment, as the POC did, does not survive a
second service.

Ingress is asymmetric and keeps the **real** ports: a mesh peer dials the pod's overlay address on
`wt0` directly, with no Service and no DNAT in the path. That asymmetry is what lets one pod serve both
directions without a port fight — in the POC `:7777` appeared on both sides.

### D6. A blocking init container orders the data plane after the resolver

This is the highest-value invariant in the design. Measured: Envoy reached its dispatch loop at
`19:16:54.245`; the NetBird client replaced `/etc/resolv.conf` at `19:16:56.446`. Envoy's c-ares
resolver reads that file **once at construction**, so it kept querying the kube-dns address the file
held at boot — which answers `NXDOMAIN` for a mesh name, because the view keys on consumer identity and
the data-plane pod deliberately does not carry it.

The failure mode: every STRICT_DNS egress cluster at `membership_total: 0` **forever**,
`update_failure: 0`, nothing logged, pod `2/2 Ready`, and no self-heal over 300 s. Ingress kept working
throughout, so the service looked healthy in one direction while the other was dead. Restarting *only*
the Envoy container, with resolv.conf already in place, took the clusters to `membership_healthy: 1`
immediately — which is what proves it is ordering and nothing else.

A native sidecar is only *started*, not *initialised*, before the main container. So: a plain init
container, ordered **after** the sidecar, that exits only once a declared destination hostname
resolves, and fails rather than letting a deaf data plane start.

*Alternative rejected:* pinning Envoy's resolver to the mesh resolver address — that address is the
pod's own overlay IP, unknown until runtime, and it would couple the config to NetBird internals.

### D7. Egress listeners bind the pod IP; ingress binds `0.0.0.0`

With egress on `0.0.0.0` the listeners exist on `wt0`. Demonstrated: from a peer permitted only to
reach the service's published ports and with **no** policy permitting it to reach the destination, all
three egress listeners answered and relayed — `200` with the destination's body, the TCP echo, and a
UDP echo. Narrowing the access policy closed it, but that makes confidentiality depend on every future
policy staying port-scoped.

Binding to `status.podIP` via the downward API makes the relay structurally impossible, because
kube-proxy delivers to the pod IP anyway. Since `access` is out of scope for this change, this is now
the **only** guard and is not a knob.

### D8. Certificates are consumed through file-based SDS, not an inline certificate

Measured on rotation under a running pod: an inline `tls_certificates` with `filename:` **never
reloads** (235 s, 0 restarts, old certificate still served) and adding `watched_directory` to the inline
certificate **changes nothing** — it parses and is silently ignored. The tell is `loading 0 static
secret(s)`: an inline certificate is never registered with the secret manager. File-based SDS
(`tls_certificate_sds_secret_configs` + `path_config_source` + `watched_directory`) reloaded in place in
**63 s, same pod, 0 restarts**.

This matters beyond correctness: the peer is pinned to 1 replica + `Recreate` because two peers cannot
share a DNS label, so without SDS every renewal would drop **egress** too. SDS requires `node.id` and
`node.cluster` in the bootstrap — Envoy refuses to start without them.

The keypair itself is one shared `*.<domain>` wildcard, a zone-level fact, so it lives on `MeshZone`.
Nothing is issued per service.

### D9. The operator owns identity; policies stay outside

It creates and adopts the `svc-<name>` group by name, and mints the per-peer setup key itself. It does
**not** create access policies.

Setup keys are minted by the operator rather than read as leased secrets from OpenBao, because the pod
re-enrols on **every** start — a lease expiring mid-life means the next restart comes up with no
identity. OpenBao's value is on the **PAT**, which benefits from bounded TTL and rotation; that is
referenced as a Secret and re-read per call rather than cached at boot (the upstream operator caches
capabilities at startup, which is why a role change there needs a restart).

Adoption by name is load-bearing: the account already carries 3× `homelab-devices` and 3× `pikvm-ssh`
from uncoordinated creation, and a blind-create operator would add a fourth.

Unit trap to encode in one place: `expires_in` is **days** for PATs and **seconds** for setup keys.

### D10. API surface

`mesh.vgijssel.nl/v1alpha1`, kinds `MeshZone` (cluster-scoped) and `MeshPeer` (namespaced). Not the
`netbird.io` group, and deliberately not a `*Peer` name prefixed with the vendor — `NBRoutingPeer`
already exists upstream and two kinds differing by prefix is the worst outcome.

`MeshPeer.spec.zoneRef` is optional and resolves to the `MeshZone` with `spec.default: true`
(StorageClass/IngressClass precedent), with admission rejecting a second default. An account provides
exactly one `dns_domain` — verified: a single string on account settings, one account per token — so
one `MeshZone` is one account.

`ingress.listeners` and `egress.destinations` are separate lists with different groupings; `access` was
considered and removed from this change. Note for whenever access returns: it must be its **own** list
rather than a `from` field on listeners, because the two group differently and folding them produces a
cartesian product in the API.

### D11. release-please in manifest mode, adopted repo-wide

Manifest mode (`release-please-config.json` + `.release-please-manifest.json`) because the repo has
three components to release and single-package mode would need restructuring to add the second.
`openbao-netbird-plugin` (currently `VERSION: 0.1.3` hardcoded in its workflow) and
`openbao-cloudflare-plugin` move onto it, replacing the `# TODO: Need to replace release pipeline`
block in `.github/workflows/release.yaml`.

## Risks / Trade-offs

- **`required_signatures: true` on `main` may block release-please's PRs** → Verified present on the
  branch protection, and this repo has a recorded case of an unsigned bot PR being blocked. Commits
  created through the GitHub API are normally signed by GitHub, which would make this a non-issue — but
  it must be proven on a throwaway PR as the *first* release task, before the rest is built on it. If
  it does block, fall back to a GitHub App token or a signed-merge step.
- **A malformed rendered block takes out cluster DNS entirely** → A parse error in any imported file
  CrashLoops CoreDNS. Validate that the rendered block parses before writing, and treat that validation
  as a release gate, not a nicety.
- **Name shadowing by a sibling entry** → The secret cluster's `jwks-network.server` declares a *more
  specific* zone than the operator's. Detect sibling zones in the same ConfigMap and reject a peer
  whose hostname they cover; this is live today and will be hit during any future migration.
- **UDP payloads above 1252 bytes vanish silently** → Measured exactly (1252 intact, 1253 gone; `wt0`
  MTU 1280 − 28), dropped rather than fragmented with no ICMP. Report the limit in status rather than
  leaving consumers to discover it from failures.
- **The operator can write to `kube-system`** → Scope its ConfigMap write permission with
  `resourceNames` to the single ConfigMap, and keep `force: false` on every apply.
- **The first datagram after a peer replacement can be lost** → Observed once immediately after a roll;
  steady state was 12/12. UDP has no retransmit, so document it for consumer protocols.
- **One peer per hostname means config changes still interrupt both directions** → Measured window is
  **12 s** (old pod gone t+3 s, Ready t+10 s, TCP and UDP both back t+12 s), far inside the ~81 s this
  was budgeted at. SDS removes renewal from the list entirely, leaving only real config changes and
  image bumps. If it becomes unacceptable, the escape hatch is two pods in one NetBird group — ACLs
  evaluate on group membership, not peer identity.
- **Client version skew with the upstream operator** → Both inject a NetBird client. Pin this
  operator's client image by digest and keep it in step with
  `third_party/vendir/charts/netbird-operator`.

## Migration Plan

Parallel install; nothing is migrated.

1. Install CRDs and the operator into one vcluster (`kerk`/`shine` still exist from the POC and are the
   natural target) with a `MeshZone` pointing at the existing account.
2. Reproduce the POC's assertion set against operator-managed resources rather than hand-written
   manifests — the suite already exists and is the acceptance test.
3. Leave `mesh-openbao`, `mesh-omada` and `mesh-jwks` on `libs/mesh-service` untouched.

**Rollback:** delete the `MeshPeer` resources (which removes the operator's ConfigMap entry and
deregisters the peers), then uninstall the operator. Existing chart-based exposures are unaffected
because the operator owns a distinct ConfigMap key and distinct NetBird groups. Hand-managed keys such
as `jwks-network.server` survive by construction — verified.

## Open Questions

- **Where the operator runs.** One instance per cluster is assumed (it must read that cluster's DNS
  Deployment). Whether it is also deployed to the `secret` cluster, or only to `network`, is a rollout
  choice that does not change the API or the task breakdown.
- **Whether `MeshZone` should mirror the wildcard keypair into consuming namespaces** or require a
  `VaultStaticSecret` per namespace. Both satisfy the spec; the second keeps the operator out of the
  secret-copying business. Deferrable until a second namespace needs a peer.
- **Status reporting of the UDP limit** — whether to measure it per path at runtime or publish the
  known overlay value. The spec only requires it be discoverable.
