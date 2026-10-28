# Tasks

## 1. Prove the release path before building on it

Design D11 and the first Risk: `main` has `required_signatures: true` and this repo has a recorded case
of an unsigned bot PR being blocked. Settle this first — if it blocks, the whole release approach
changes.

- [ ] 1.1 Open a throwaway PR whose commit is created through the GitHub API (not local git) and verify from `gh api repos/vgijssel/setup/pulls/<n>/commits --jq '.[].commit.verification.verified'` that it reports `true`; record the result, and if `false`, stop and resolve the token/signing approach before task 1.2
- [ ] 1.2 Add `release-please-config.json` and `.release-please-manifest.json` at the repo root in manifest mode with the `libs/mesh-operator` package registered, and verify `npx --no-install release-please --help` is NOT used (repo policy forbids unpinned runners) — instead pin the action by tag in the workflow and verify the config parses with `jq . release-please-config.json`
- [ ] 1.3 Add `.github/workflows/release-please.yaml` using a pinned `googleapis/release-please-action` ref, and verify a dry run on a branch produces a release PR without touching `main`
- [ ] 1.4 Register `libs/openbao-netbird-plugin` and `libs/openbao-cloudflare-plugin` in the manifest with their current versions, and verify `release-openbao-netbird-plugin.yaml` no longer hardcodes `VERSION:` by grepping for it and getting no match
- [ ] 1.5 Replace the commented-out `# TODO: Need to replace release pipeline` block in `.github/workflows/release.yaml` with either a delegation to release-please or its removal, and verify `trunk check` passes on the workflow files
- [ ] 1.6 Document the release flow (how a version bump is triggered, what conventional-commit prefixes map to which bump) in `libs/mesh-operator/README.md`, and verify the documented `gh` command to find the current release PR runs as written

## 2. Package scaffolding

Follows `libs/fleet-mcp` conventions: hatchling, uv, `src/` layout, `moon.yml`.

- [ ] 2.1 Create `libs/mesh-operator/pyproject.toml` with hatchling, `name = "setup-mesh-operator"`, `packages = ["src/mesh_operator"]`, and `kopf`, `kubernetes`, `httpx`, `pydantic` pinned to exact versions, then verify `uv sync` resolves
- [ ] 2.2 Create `libs/mesh-operator/moon.yml` with `language: python`, `layer: library`, `stack: backend` and `build`/`test`/`lint`/`release` tasks, and verify `moon project mesh-operator` lists them
- [ ] 2.3 Create `src/mesh_operator/__main__.py` exposing a `main()` that starts kopf, and verify `uv run python -m mesh_operator --help` exits 0
- [ ] 2.4 Create `libs/mesh-operator/Dockerfile` on a pinned Python base image running as non-root, and verify `docker build` succeeds and `docker run --rm <img> --help` exits 0
- [ ] 2.5 Add `pytest` and `vcrpy` (matching the pinned versions used in `libs/fleet-mcp`) to the dev dependency group and verify `moon run mesh-operator:test` runs and reports zero collected tests without error

## 3. CRDs and API surface

Per `specs/mesh-peer-operator` requirements "A mesh peer is one declarative resource", "A mesh peer
names the mesh it belongs to", and design D10.

- [ ] 3.1 Write the `MeshZone` CRD (cluster-scoped, `mesh.vgijssel.nl/v1alpha1`) with `dnsDomain`, `default`, `netbird.managementUrl`, `netbird.credentialsSecretRef`, `resolver.{configMap,key,deploymentRef}`, `egressPortRange`, and `tls.secretRef`; verify `kubectl apply --dry-run=server` accepts it and rejects a missing `dnsDomain`
- [ ] 3.2 Write the `MeshPeer` CRD (namespaced) with `zoneRef`, `ingress.{service,listeners}`, `egress.{consumers,destinations}`; verify `kubectl apply --dry-run=server` accepts a valid peer and rejects a listener with no port
- [ ] 3.3 Add CEL validation requiring at least one of `ingress` or `egress`, and verify a resource with neither is rejected by the apiserver with the rule's message
- [ ] 3.4 Add CEL validation restricting `egress.consumers` to `matchLabels` only, and verify a resource using `matchExpressions` is rejected (design D2: expr cannot faithfully render `In`/`NotIn`/`Exists`)
- [ ] 3.5 Ensure `status.egressPortMap` and `status.conditions` exist as a status subresource and that `egressPortMap` is absent from the spec schema, verifying with `kubectl explain meshpeer.spec` showing no port map
- [ ] 3.6 Implement `zoneRef` defaulting to the `MeshZone` with `spec.default: true`, with unit tests covering: omitted ref resolves, two defaults is an error, zero defaults with no ref is an error
- [ ] 3.7 Document both CRDs with a complete annotated example in `libs/mesh-operator/README.md` and verify the example applies cleanly with `--dry-run=server`

## 4. Resolver: hook discovery, rendering, and owned write

Per `specs/mesh-peer-operator` requirements "Shared DNS configuration is written per entry, under
ownership", "The resolver wiring is verified continuously", "Name shadowing", and design D3/D4.

- [ ] 4.1 Implement Corefile parsing that extracts top-level `import <glob>` directives and the primary server block's listen port; unit-test against captured Corefiles from vcluster (`:1053`, one glob), k3s (`:53`, `*.server` + `*.override`) and RKE2 (`:53`, no glob)
- [ ] 4.2 Implement hook discovery that maps a DNS Deployment's `volumeMounts` to an import glob and returns the backing ConfigMap; unit-test that RKE2's hookless shape returns "no hook" rather than raising
- [ ] 4.3 Implement view-block rendering for the full `MeshPeer` set into one string, with no resolving fallback (`specs/mesh-egress-identity` — "Unmatched consumers are denied by default"); unit-test that the rendered zone contains no fallback block and that `kubernetes cluster.local { pods verified }` is emitted multi-line
- [ ] 4.4 Implement pre-write validation that the rendered block parses before any write (design Risk: a parse error CrashLoops cluster DNS); unit-test that a deliberately malformed block is refused and nothing is written
- [ ] 4.5 Implement the SSA write with field manager `mesh-operator`, `force=False`, content type `application/apply-patch+yaml`; unit-test that a `409` is surfaced as a named conflict rather than retried
- [ ] 4.6 Implement entry-name validation against the discovered glob via `fnmatch`, and unit-test that a key not matching the glob is rejected rather than written and never consumed
- [ ] 4.7 Implement sibling-zone shadowing detection across other keys in the ConfigMap, and unit-test that a peer whose hostname falls under a more specific sibling zone (the live `jwks-network.server` case) is reported
- [ ] 4.8 Implement removal semantics — applying with the key absent when no `MeshPeer` remains — and unit-test that sibling keys and the ConfigMap object itself survive
- [ ] 4.9 Integration-test against the live `kerk` vcluster: apply alongside a foreign key and verify via `managedFields` that ownership is per-entry, that the foreign key's content is unchanged, and that a contested key returns a conflict with the user's content intact

## 5. NetBird identity

Per `specs/mesh-peer-operator` requirements "Credentials are read from a referenced secret", "Access
policy is not owned by the system", and design D9.

- [ ] 5.1 Implement a NetBird API client reading the PAT from the referenced Secret on every call (not cached at boot), with a unit test proving a rotated Secret value is used on the next call without reinitialisation
- [ ] 5.2 Implement `svc-<name>` group adopt-by-name-else-create, with a vcrpy-recorded test proving an existing group is adopted and no duplicate is created
- [ ] 5.3 Implement setup-key minting with `allow_extra_dns_labels: true`, ephemeral, and a TTL exceeding expected pod lifetime; unit-test that `expires_in` is emitted in **seconds** for setup keys and **days** for PATs (design D9 unit trap)
- [ ] 5.4 Implement the pre-enrolment extra-DNS-label collision check against the account, and test that an already-taken label is refused rather than enrolled into a round-robin
- [ ] 5.5 Implement a `CredentialsValid` condition that probes for the `admin` privilege needed to create groups, and test that insufficient privilege is reported on `MeshZone` rather than on the first peer
- [ ] 5.6 Implement `ReachabilityObserved` by reading policies targeting the peer's group without modifying them, and test that externally-changed policies are neither reverted nor duplicated

## 6. Data plane rendering

Per `specs/mesh-egress-identity` and design D1/D5/D6/D7/D8.

- [ ] 6.1 Implement egress container-port allocation from `MeshZone.spec.egressPortRange`, persisted to `status.egressPortMap`; unit-test uniqueness across two peers, stability across reconciles, and that exhaustion is reported rather than reassigning
- [ ] 6.2 Render the static Envoy bootstrap — ingress listeners on real ports bound `0.0.0.0`, egress listeners on allocated ports bound to `status.podIP` — and verify every rendered fixture passes `docker run envoyproxy/envoy:<pinned> --mode validate`
- [ ] 6.3 Render UDP listeners using the `matcher` form with an on-no-match route (not the deprecated bare `cluster:`), and verify the rendered config validates and that no fixture emits the deprecated field
- [ ] 6.4 Render egress clusters as `STRICT_DNS` against the FQDN **with a trailing dot** (design: the search list would otherwise try `bar.vpn.blueora.ng.vpn.blueora.ng`), and unit-test that every rendered egress cluster address ends in `.`
- [ ] 6.5 Render file-based SDS (`tls_certificate_sds_secret_configs` + `path_config_source` + `watched_directory`) plus the required `node.id`/`node.cluster`, and verify a rendered config omitting `node` fails validation while the complete one passes (design D8)
- [ ] 6.6 Render the Deployment with the NetBird client as a native sidecar carrying `preStop: netbird deregister`, 1 replica, `Recreate`, and `command: [/usr/local/bin/envoy]` to bypass the entrypoint; verify the rendered pod spec sets that command (design D1 trap)
- [ ] 6.7 Render the blocking init container ordered **after** the sidecar that exits only once a declared destination resolves, and unit-test that it is absent when no `egress.destinations` are declared and present otherwise (design D6)
- [ ] 6.8 Render the forwarder Service with one ClusterIP carrying mixed TCP and UDP ports mapped to allocated target ports, and verify it applies cleanly to `kerk` with the expected `PORT(S)` column
- [ ] 6.9 Document the ingress/egress port asymmetry and the pod-IP binding rationale in `libs/mesh-operator/README.md`, and verify the documented `kubectl get svc` output matches what task 6.8 produces

## 7. Status, conditions, and continuous verification

Per `specs/mesh-peer-operator` — "The resolver wiring is verified continuously" — and design D4.

- [ ] 7.1 Implement the `ResolverWired` condition distinguishing *not mounted*, *mounted but not imported*, *imported but wrong port*, and *no hook at all*; unit-test each branch produces its own `reason`
- [ ] 7.2 Run `ResolverWired` on a `@kopf.timer` so wiring removed after it was once correct is detected, and integration-test on `kerk` by reverting the DNS Deployment and confirming the condition flips without an operator restart
- [ ] 7.3 Implement the RKE2 remediation path: when no hook exists, emit the `HelmChartConfig` snippet in the condition message or as an event; test that the message contains an applicable snippet
- [ ] 7.4 Render peers from a live `MeshPeer` list rather than a kopf index, and test that a reconcile triggered before the index is warm still renders every existing peer (design D3)
- [ ] 7.5 Make the ConfigMap write idempotent by comparing rendered to current content, and test that N startup events collapse to one API write
- [ ] 7.6 Report the maximum intact UDP datagram payload in `MeshPeer.status` whenever a UDP listener or destination is declared, and test that the field is populated only in that case
- [ ] 7.7 Document every condition, its reasons, and the ~60 s propagation delay in `libs/mesh-operator/README.md`, verifying the stated delay against the measured add/remove timings

## 8. End-to-end verification against the POC assertion suite

The POC suite is the acceptance test; this group proves the operator reproduces it from CRs rather than
hand-written manifests. Design — Migration Plan.

- [ ] 8.1 Deploy the operator plus a `MeshZone` into `kerk` and `shine` and verify `ResolverWired` reports true on both
- [ ] 8.2 Declare `foo` (egress consumer) and `bar` (ingress destination) as `MeshPeer` resources and verify both peers enrol with their extra DNS labels and land in their groups
- [ ] 8.3 Re-run POC assertions 1, 1a, 9, 10 and verify HTTPS, raw TCP and raw UDP all return the destination's response end to end across the two clusters
- [ ] 8.4 Re-run assertions 3 and 4 and verify a declared consumer resolves the destination while an unlabelled pod in the same namespace gets NXDOMAIN
- [ ] 8.5 Re-run assertion 5 and verify the data-plane pod resolves the destination to its real overlay address, confirming no resolution loop
- [ ] 8.6 Re-run assertion 18 and verify a consumer pod cannot reach a destination's overlay address directly
- [ ] 8.7 Verify the relay is closed: from a peer permitted to reach `foo`'s published ports but not `bar`, confirm the allocated egress ports are unreachable (design D7 — this failed in the POC and is the regression this design exists to prevent)
- [ ] 8.8 Rotate the TLS Secret under a running peer and verify the renewed certificate is served with no pod replacement and zero restarts
- [ ] 8.9 Roll a peer's pod and record the interruption window, verifying both TCP and UDP recover and the window is within the design's stated ~12 s
- [ ] 8.10 Delete all `MeshPeer` resources and verify the operator's ConfigMap key is removed, sibling keys survive, and no stale peers remain in the account
- [ ] 8.11 Record measured outcomes for 8.3–8.10 in `libs/mesh-operator/README.md` and verify every number cited there came from this run rather than from the POC
