# Design

## Context

See `proposal.md` → Why for motivation, and `specs/mesh-service-exposure/spec.md` for the behaviour contract. The constraints that actually shape the approach:

- **Both clusters are arm64 vind (vcluster-in-docker) clusters** on a Mac, recreated wholesale by `moon run {secret,network}:start`. This repo has a history of amd64-only images blocking work, so image architecture is a real gate, not a formality.
- **Fleet builds only the top-level bundle chart.** `apps/**/charts/` is gitignored and `bin/fleet-apply` does not recurse into a subchart's own `file://` deps, so a *nested* umbrella silently loses its subchart. Shared first-party charts must therefore be single-level `file://` dependencies — the constraint already documented in `netbird-reverse-proxy-shared/Chart.yaml`.
- **Under a Rancher GitRepo, `fleet.yaml` selectors restrict nothing.** They only populate `spec.targets`; the GitRepo appends its own catch-all, and targets are first-match-wins. Every bundle needs a terminal `{name: none, doNotDeploy: true, clusterSelector: {}}`.
- **OpenBao is the root of trust and must not become a mesh client.** The NetBird operator's mutating webhook runs `failurePolicy: Fail`, and the operator itself needs a PAT out of OpenBao — injecting a sidecar into OpenBao creates a cold-start deadlock. This is a known, previously diagnosed failure, not a hypothetical.
- **The secret cluster can bootstrap without the mesh** (its ESO uses in-cluster Kubernetes auth over a ClusterIP); the network cluster cannot (its ESO reads OpenBao over the overlay). This asymmetry dictates the cutover order.
- **The NetBird operator is pinned to `v0.7.0`.** `v0.8.0` regressed sidecar DNS (netbirdio/kubernetes-operator#383): `v0.7.0` rewrites the pod's shared `/etc/resolv.conf` in place, which is exactly the behaviour every sidecar consumer here depends on.

## Goals / Non-Goals

**Goals:**

- One mechanism for HTTPS, raw TCP and raw UDP exposure, replacing two incompatible stacks.
- Exposing a service is a single declarative unit: name, allowed source groups, listeners.
- Mesh hostnames carry publicly-trusted certificates while never resolving publicly.
- A cutover that is additive until the last step, so the go/no-go decision happens before anything is destroyed.

**Non-Goals:**

- Replacing `ClusterProxy` kube-apiserver access. It provides per-caller impersonation that a plain L7 proxy cannot, and the custom-domain requirement for it was already dropped.
- Public ingress at `blueora.ng`. Deferred to the later reverse-proxy work with its own trust model.
- Moving Omada's physical devices onto the mesh-peer model, or putting a valid certificate on PiKVM. Both are named exceptions with follow-ups.
- High availability of any published service. One replica per service is deliberate (see the identity decision below).

## Decisions

### One peer per service, not one peer per cluster

Each exposed service gets its own data-plane pod with its own injected mesh client, hence its own overlay address.

The alternative — one peer per cluster carrying every service name as an extra DNS label — is cheaper in peers and multiplexes HTTPS fine by SNI. It was rejected because all raw TCP/UDP ports would then be shared across every service on that cluster, reintroducing exactly the port arbitration this change exists to delete. The spec requirement "each exposed service owns its full port space" needs a distinct address per service.

### Envoy Gateway as the data plane

Rejected alternatives:

- **NetBird's own `GatewayClass`** (`netbird-private`/`netbird-public`, gated by `gatewayAPI.enabled` in the operator chart): it is the reverse proxy behind a Gateway API façade, and the proposal removes the reverse proxy. It also inherits the `mode=tcp` non-binding bug.
- **`ingress-nginx`** (already vendored): no first-class UDP, and L4 needs a ConfigMap side-channel rather than a route object. One mechanism for all three protocols was the point.

Envoy Gateway `1.9.2` bundles Gateway API v1.6.1 CRDs, where `TCPRoute` and `UDPRoute` are Standard — verified in the pulled chart (`bundle-version: v1.6.1`, both kinds present).

### The port shift must be disabled — this is load-bearing, not a preference

Envoy Gateway defaults to `useListenerPortAsContainerPort: false`, adding `+10000` to privileged listener ports (`:443` → `:10443`) so the container needs no capability, relying on a Service `targetPort` to undo the shift.

**There is no Service in this path.** Traffic arrives on the mesh client's WireGuard interface *inside the pod's own network namespace* and hits a local socket. With the default, the published address would answer on `:10443` and `:443` would be closed — a port we cannot put a certificate on or ask a browser to use. So `useListenerPortAsContainerPort: true` plus `NET_BIND_SERVICE` is mandatory. The field is confirmed present in the `1.9.2` `EnvoyProxy` CRD ("disables the port shifting feature in the Envoy Proxy").

Corollary: the data-plane Service stays `ClusterIP` and is vestigial for inbound traffic. It exists only because the implementation always creates one.

### Stable names come from extra DNS labels, single replica, Recreate

A peer's default name derives from its hostname, which in Kubernetes is a generated pod name. The stable name comes from assigning an extra DNS label to the peer instead.

That makes the spec's "no split resolution during replacement" scenario an active constraint: two peers sharing one label round-robin, so a rollout would balance consumers onto a terminating pod. Hence **1 replica + `Recreate` strategy** — a short, honest outage instead of a confusing partial one. Ephemeral enrolment keys let the account reap retired peers rather than accumulating stale registrations holding the label.

### Certificates: DNS-01 with no address record ever published

This is the mechanism that satisfies two requirements that look contradictory — publicly-trusted certificates on names that do not resolve publicly. A DNS-01 challenge only needs a TXT record at `_acme-challenge.<name>.vpn.blueora.ng`; no A or CNAME is created at any point.

The hard constraint that falls out: **no wildcard in the `blueora.ng` zone.** Cloudflare wildcards answer at arbitrary label depth, so `*.blueora.ng` would resolve `openbao.vpn.blueora.ng` publicly — and NetBird's documentation warns that pointing the peer DNS domain at publicly resolvable names lets public DNS override its own resolver for those names.

Whether one Cloudflare token can cover both `vgijssel.nl` and `blueora.ng`, or a sibling issuer is needed, is decided from the token's actual scope during implementation. The shared chart parameterises the issuer so this is a values change, not a template change.

### Flat namespace

`<service>.vpn.blueora.ng`, never `<service>.<cluster>.vpn.blueora.ng`. Nesting encoded *where* a service runs into its name, which is what forced the old "most-specific parent proxy cluster" gymnastics. Service names are globally unique; cluster placement is an implementation detail.

### Declarative access policy replaces annotation inference

Source-group access becomes explicit policy resources rather than being inferred by the operator from Service annotations. This removes the dependency on the operator's automatic-policy-creation flag — which can be turned off once the last `netbird.io/expose` annotation is gone, gated on whether the Omada device exception still needs one.

### OpenBao's JWKS path keeps its forwarder, but gains real TLS

OpenBao needs the network cluster's JWKS and must not become a mesh client (see Context). The existing socat forwarder keeps that job, with one change: it forwards **raw TCP** to the published JWKS hostname, and a CoreDNS override inside the secret cluster maps that hostname to the forwarder's ClusterIP.

Because the relay is raw TCP, TLS is end-to-end from OpenBao to the publishing peer — correct SNI, matching certificate, full validation against public roots. The previous arrangement had to run this leg as plain HTTP. The split-horizon is deliberate and not a lie: inside the secret cluster the name is a ClusterIP, on the mesh it is the peer, and **both terminate at the same certificate**, which is what lets the override work without disabling verification.

### Recovery is output-based, not exit-code-based

Mesh clients wedge in unrecoverable session states after host suspend/resume, and both the client's exit status and its coarse status field report success while wedged. Detection must parse reported state. Disabling account-level peer login expiration removes the *dominant cause*; the per-service watchdog stays as defence in depth because suspend/resume still triggers it. This is why the spec phrases recovery as "detected from the client's reported state rather than its exit status".

### The two exceptions are recorded as exceptions

Omada's APs and switches cannot run a mesh client, and an overlay address is neither stable nor publicly resolvable — so their path stays as-is (pinned ClusterIP, resource-based exposure, public address record) under its own name, `omada.blueora.ng`. PiKVM's certificate was the sole reason its reverse proxy existed, so removing the proxy means a self-signed warning. Both are in the spec as named-exception requirements so they cannot quietly drift into looking like normal exposures.

## Risks / Trade-offs

- **The operator at `v0.7.0` may accept extra DNS labels without wiring them through to the client.** The field is in its CRD; that does not prove the controller implements it. Without it the flat namespace collapses. → Blocking live spike before any other work. Fall back to setting the label through the sidecar's container environment override; only if both fail, re-open the operator version decision against regression #383.
- **Big-bang cutover: between removing the old path and the first successful certificate, nothing can read OpenBao — and the network cluster's certificates come *from* OpenBao.** → Two mitigations, both structural rather than procedural. First, an explicit go/no-go gate that proves DNS-01 on the new zone with a throwaway certificate *before* anything is deleted. Second, ordering: the secret cluster is brought up first because it needs no mesh to bootstrap, and deletion is the last phase, not an early one.
- **Break-glass could be lost with the mesh.** → It is not: the port-forward and the `kubectl exec` token-minting path both bypass the overlay entirely, and `kubectl` reaches the clusters via `ClusterProxy`, which this change does not touch. As long as `kubectl` works, OpenBao is recoverable.
- **A wildcard added to the new zone later would silently make every mesh name public** and let public DNS override the mesh resolver. → Verified absent at setup, and asserted as a spec scenario so it is a checkable property rather than tribal knowledge.
- **Peer count grows: one per service, plus rollout churn.** Account plans cap peers. → Count headroom during the spike phase; 1 replica per service and ephemeral enrolment bound the total.
- **Single replica per service means a brief hard outage on every rollout.** → Accepted deliberately, as the alternative violates the no-split-resolution requirement. HA is a non-goal.
- **arm64.** → Verify the control-plane and data-plane images are multi-arch during the spike phase, before vendoring work depends on them.
- **Changing the account DNS domain renames every peer FQDN.** → Low risk, but grep for the current domain across the repo before flipping, rather than assuming nothing references it.
- **Removing the OpenTofu Workspaces can trigger a destroy of live resources.** → Check whether any surviving Crossplane resource needs an orphan deletion policy and a live patch *before* pruning; a cross-bundle move without that previously caused an outage.

## Migration Plan

Steps 1–8 are **additive**. Nothing is deleted until step 9, after every new path is verified live. That ordering is what makes a big-bang cutover safe here rather than merely fast.

1. Delegate the new zone; mint a scoped DNS-edit token; store it in OpenBao via the port-forward path (no mesh involved).
2. Set the account peer DNS domain; disable peer login expiration.
3. **GO/NO-GO GATE** — issue a throwaway certificate for a probe name in the new zone and confirm the name does not resolve publicly. On failure, stop: nothing has been deleted and the rollback is deleting the probe.
4. Vendor and deploy the gateway control plane to both clusters.
5. Build the shared exposure chart; render it for both an HTTPS-only and an HTTPS+TCP+UDP service and confirm no shifted port appears in the output.
6. Expose OpenBao on the secret cluster; verify certificate, mesh resolution, public non-resolution, and a browser session end to end.
7. Re-point the network cluster's secret consumers at the new hostname; confirm its secret stores go valid and its own certificates issue.
8. Expose Omada and the JWKS mirror; re-point OpenBao's JWKS path; confirm device adoption survives and a fresh cross-cluster token login succeeds.
9. **Demolition** — remove the reverse-proxy bundles, shared chart, vendored chart, Workspaces, scripts, `moon` tasks, routing peers and watchdogs; then delete the account-side proxy clusters, private services and domain registrations.
10. Cold-start proof: stop and start the secret cluster, then the network cluster, in that order, with no manual intervention beyond the existing seal-key and operator-PAT seeding.

**Rollback**: before step 9, rollback is reverting the consumer hostnames — the old reverse-proxy path is still deployed and functional throughout steps 1–8. After step 9, rollback means re-applying the deleted bundles from git and re-minting proxy tokens, which is why step 9 is gated on every verification in 6–8 passing.

## Implementation blockers found live (2026-09-30, updated 2026-10-01)

None invalidates the design; all are inputs it assumed were already in place.

- ~~**`blueora.ng` is not registered.**~~ **RESOLVED 2026-10-01.** The zone is live on Cloudflare
  (`katelyn`/`ken` nameservers, apex A → `127.0.0.1`) and verified clean of wildcards at arbitrary
  depth, which is the property the capability actually requires. Tasks 2.1, 2.5 and 2.6 are done.
  (The reason `vgijssel.nl` was never a substitute still stands: its wildcard answers at arbitrary
  label depth, so every mesh hostname would resolve publicly.)
- **The Cloudflare API token is invalid — this is now the single blocker.** `kv/cloudflare#credential`
  is rejected with `9109 Invalid access token` on `/zones`, and the network cluster's
  `deploy/external-dns` is in a fatal crash loop on the identical error, so the credential was
  already dead before this change reached it. It is not in 1Password either. Minting or re-scoping
  a Cloudflare token requires dashboard access or a token with `User API Tokens: Edit`, so it is a
  human step. Everything certificate-dependent — 2.2–2.4, the 2.7/2.8 DNS-01 gate, and groups 5–11
  — waits on it. Note the blast radius is wider than this change: no certificate can renew and no
  DNS record is managed on either cluster until it is replaced. Task 1.4's conclusion (one token,
  no sibling issuer) is unaffected and now cheap to satisfy, since the replacement token can be
  scoped to both zones at creation.
- **The Mac was not a mesh peer during the spikes** (`netbird status` → `NeedsLogin`; re-login is
  interactive SSO), so task 1.1 verified from an in-cluster peer pod instead — and was stronger for
  it: resolving the label from the *network* cluster's peer proves cross-cluster mesh resolution,
  which a same-host query does not. **Since resolved** — the Mac is now `Management: Connected` at
  `100.65.74.176` / `macbook-pro-van-maarten.netbird.cloud`, so the remaining "verify from the Mac"
  steps (5.4, 5.5, 7.9, 7.10, 11.4) can run as written. Worth re-checking at resume: a peer session
  dies after a 24 h login expiry or a host suspend/resume, which is what task 2.6 exists to stop.

## Open Questions

- ~~Can one Cloudflare API token be scoped to edit DNS in both `vgijssel.nl` and `blueora.ng`, or is a sibling issuer needed?~~ **Resolved (task 1.4): one token, no sibling issuer** — conditional on `blueora.ng` joining the same Cloudflare account as `vgijssel.nl`. A Cloudflare `Zone:DNS:Edit` token takes several zones in one account, and the existing `letsencrypt-prod` solver pins no `dnsZones`, so it already solves for whatever its token can edit. Task 2.2 is therefore a re-scope of the existing token rather than a second issuer. The zone does not exist in the account yet (see the blocker below).
- Does the Omada device exception still require the operator's automatic-policy-creation flag, or can it be turned off entirely? Answered once the device-path resource is made explicit.
