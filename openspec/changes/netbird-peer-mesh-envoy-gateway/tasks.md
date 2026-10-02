# Tasks

## 1. Feasibility spikes

These can invalidate the design, so they run before any other work.

**Results (verified live 2026-09-30, both vind clusters running):**

- **1.1 PASS, no fallback needed.** A `SetupKey` with `allowExtraDnsLabels: true` + `ephemeral: true`
  and a `SidecarProfile` with `extraDNSLabels: [spike]` against a busybox pod on the secret cluster
  produced peer `100.65.51.127` with `extra_dns_labels: ["spike.netbird.cloud"]` in the management
  API, and `spike.netbird.cloud` resolved to that address both from the pod itself and — the real
  test — from the *network* cluster's router peer. Operator `v0.7.0` wires the field through to the
  client. Verified from a mesh peer pod, not the Mac: the Mac's daemon is `NeedsLogin` and re-login
  is interactive SSO. A peer pod satisfies the spec's "a peer enrolled in the account queries" just
  as well, and the cross-cluster hop makes it a stronger check than a same-host one.
- **1.1 bonus — the split-resolution risk is real, not theoretical.** The existing
  `secret.netbird-kubeapi-proxy.netbird.cloud` label is carried by three `clusterproxy` replicas and
  resolves to all three addresses round-robin. That is exactly the failure the design's 1-replica +
  `Recreate` decision exists to prevent, now observed rather than predicted.
- **1.1 caveat — ephemeral reaping works, but is not immediate.** Deleting the namespace left the
  `spike` peer registered (disconnected) for at least 20 s; it was gone on a later check, and the
  account is back to its 19-peer baseline with no `svc-` residue. So the spec's "retired peers do
  not linger" scenario holds as *eventually reaped*, not *gone at pod teardown*. A rollout
  therefore briefly has two peers holding one label — a second, measured reason `Recreate` (not
  `RollingUpdate`) is load-bearing.
- **1.2 PASS.** `docker.io/envoyproxy/gateway:v1.9.2` lists `linux/amd64` + `linux/arm64`. The chart
  leaves the data-plane image empty (baked into the control-plane binary); `_helpers.tpl` resolves it
  to `docker.io/envoyproxy/envoy:distroless-v1.39.1`, which also lists both platforms.
- **1.3 Peer count is 20 (11 connected, 9 stale), against a NetBird Cloud plan limit the management
  API does not expose** (`/api/accounts/<id>`, `/usage` and `/billing/subscription` all 404; only the
  account-settings list endpoint is readable). This change adds 3 service peers plus rollout churn, so
  headroom is a non-issue at any plan tier — but the limit itself is dashboard-only and unverified here.
  Separately: 5 of the 9 stale peers are `jwks-gateway` registrations dating back to August, i.e. that
  bare Pod's setup key is *not* ephemeral and has been accumulating peers. Worth cleaning up, out of scope.
- **1.4 One token suffices — no sibling `ClusterIssuer`** (resolves design Open Question 1), *provided*
  `blueora.ng` is added to the same Cloudflare account as `vgijssel.nl`. Cloudflare scopes one
  `Zone:DNS:Edit` token to several zones within an account, and
  `apps/platform/src/config/clusterissuer-letsencrypt-prod.yaml` pins no `dnsZones` on its solver, so it
  already solves for every zone its token can edit. The existing token currently lists exactly one zone
  (`vgijssel.nl`, id `8e5a9db0a62108e5fff87072dbb939d0`); `blueora.ng` is not a zone in that account yet.
  So the chart's `certIssuer: letsencrypt-prod` default stands and task 2.2 is a token *re-scope*, not a
  second issuer. Oddity noted in passing: that token is rejected by `/user/tokens/verify` ("Invalid API
  Token") while `/zones` authenticates fine with it, so do not use the verify endpoint as task 2.2's check.
- **1.5 PASS.** `grep -rn "netbird.cloud" .` hits three files, none functional: a docstring in
  `apps/pikvm/inventories/production.py` describing `PIKVM_HOST` overrides, and this change's own
  `proposal.md` + `tasks.md`. No code or manifest derives behaviour from the peer DNS domain.

- [x] 1.1 Prove extra DNS labels work on the pinned operator `v0.7.0`: apply a throwaway enrolment key (extra-DNS-labels allowed, ephemeral) plus a sidecar profile carrying label `spike` against a trivial pod on the secret cluster; verify by resolving `spike.<current-peer-domain>` from the Mac and seeing it return that pod's overlay address. **BLOCKING** — if the field is accepted but never reaches the client, retry via the sidecar's container env override and re-verify; only if both fail, stop and re-open the operator version decision
- [x] 1.2 Verify arm64 support: `docker buildx imagetools inspect docker.io/envoyproxy/gateway:v1.9.2` and the data-plane Envoy image both list `linux/arm64` in their manifest lists
- [x] 1.3 Verify peer headroom: record the current peer count against the account plan limit and confirm room for one peer per service plus rollout churn
- [x] 1.4 Determine Cloudflare token scope (resolves a design Open Question): check whether one token can edit DNS in both `vgijssel.nl` and `blueora.ng`; record the answer, since a "no" means a sibling `ClusterIssuer` in task 4.3
- [x] 1.5 Verify nothing depends on the current peer DNS domain: `grep -rn "netbird.cloud" .` returns no functional references

## 2. Zone and account prerequisites

> **UNBLOCKED 2026-10-01 — `blueora.ng` is registered and delegated to Cloudflare** (the
> 2026-09-30 registrar block is resolved). `dig +short NS blueora.ng @1.1.1.1` returns
> `katelyn.ns.cloudflare.com` + `ken.ns.cloudflare.com`, and the apex answers `127.0.0.1`.
>
> **NEW BLOCKER 2026-10-01 — the Cloudflare API token in OpenBao is dead.** `kv/cloudflare#credential`
> (a `cfat_`-prefixed token) is rejected account-wide with `9109 Invalid access token`: on
> `/zones`, and live on the network cluster, where `deploy/external-dns` is in a fatal crash loop
> on the same error. So this is not a scope problem — the credential itself is invalid, and it was
> *already* invalid before this session (external-dns has been failing on it). It is also not in
> 1Password (the `enigma-prod` vault holds no Cloudflare item).
>
> Minting or re-scoping a Cloudflare token needs dashboard access, or a token carrying
> `User API Tokens: Edit` — neither of which exists here. So **2.2 is a human step**, and
> 2.3 (zone id), 2.4 (store it), 2.7/2.8 (the DNS-01 go/no-go gate) sit behind it, as does every
> certificate-dependent task in groups 5–11.
>
> Note this blocker is wider than this change: it is why `omada.network.vgijssel.nl`'s record is
> currently unmanaged and why no certificate can renew on either cluster today.
>
> **Do not substitute `vpn.vgijssel.nl` for the peer DNS domain without removing the wildcard
> first.** Measured: `a.b.c.vgijssel.nl` and `probe.vpn.vgijssel.nl` both answer from
> `1.1.1.1` (CNAME → `eu1.netbird.services`), because Cloudflare wildcards match at arbitrary
> label depth. Reusing that zone would make every mesh hostname publicly resolvable and let
> public DNS override NetBird's resolver — a direct violation of the spec scenario "No wildcard
> makes mesh names public", which is a requirement of this capability and not a preference.
> `blueora.ng` itself is clean: `*.blueora.ng`, `probe.vpn.blueora.ng` and `a.b.c.blueora.ng`
> all return nothing from `1.1.1.1` (2.3's assertion half, verified 2026-10-01).

- [x] 2.1 Delegate `blueora.ng` to Cloudflare and create the zone; verify `dig +short NS blueora.ng` returns Cloudflare nameservers
- [ ] 2.2 Mint a scoped Cloudflare API token (`Zone:DNS:Edit` on `blueora.ng`, plus `vgijssel.nl` if 1.4 said one token suffices); verify with an authenticated token-verify API call
- [ ] 2.3 Assert the no-wildcard constraint: verify `dig +short '*.blueora.ng' @1.1.1.1` returns nothing, and record the zone id as a non-secret constant alongside the existing `cloudflareZoneId` comment
- [ ] 2.4 Store the token in OpenBao at `kv/blueora-cloudflare#token` using `moon run secret:forward` + `moon run secret:get_openbao_auth`; verify by reading the key back (no mesh involved in this path)
- [x] 2.5 Set the account peer DNS domain to `vpn.blueora.ng`; verify `netbird status` on the Mac reports the new domain and an existing peer resolves at `<label>.vpn.blueora.ng`
- [x] 2.6 Disable peer login expiration account-wide; verify the setting persists in the dashboard and record the change in the session-expiry runbook notes
**Results (verified live 2026-10-01):**

- **2.1 PASS.** Zone live on Cloudflare (`katelyn`/`ken` nameservers), apex A → `127.0.0.1`.
- **2.5 PASS.** `PUT /api/accounts/<id>` with `settings.dns_domain = vpn.blueora.ng`. All 19 peers
  renamed account-wide in one step; the Mac now reports
  `FQDN: macbook-pro-van-maarten.vpn.blueora.ng` and macOS registered the scoped resolver
  (`scutil --dns`: `domain vpn.blueora.ng → 100.65.255.254`). Resolution confirmed for three
  existing peers, including through the SYSTEM resolver, not just the NetBird one.
  **Gotcha for the remaining "verify from the Mac" steps: plain `dig` does NOT see this.** macOS
  scoped resolvers are invisible to `dig`, which goes straight to `/etc/resolv.conf`. Use
  `dig @100.65.255.254 <name>`, or `ping`/`dscacheutil -q host -a name` for the system path. The
  task text's bare `dig +short` will look like a failure when the name resolves fine.
- **2.6 PASS.** `peer_login_expiration_enabled: false` in the same PUT. `netbird status` on the
  Mac no longer prints a `Session expires:` line at all (it read `in 4h 27m` beforehand) — which
  is the runbook-relevant fact: the 24 h forced re-auth that wedged `deploy/router`,
  the ESO sidecar and the reverse-proxy peer is gone at the account level. The per-peer watchdog
  CronJobs stay as defence in depth, because host suspend/resume still wedges a client
  independently of login expiry.

- [ ] 2.7 **GO/NO-GO GATE** — add a throwaway `Certificate` for `probe.vpn.blueora.ng` on the secret cluster using the new token; verify it reaches `Ready` **and** that `dig +short probe.vpn.blueora.ng @1.1.1.1` is empty. Do not proceed if either check fails; nothing has been deleted yet
- [ ] 2.8 Delete the probe `Certificate` and its Secret; verify the challenge TXT record is cleaned up from the zone

## 3. Vendor and deploy the gateway control plane

- [x] 3.1 Add a `charts/envoy-gateway` entry to `third_party/vendir/vendir.yml` pinned to `1.9.2` (`oci://docker.io/envoyproxy/gateway-helm`); verify `vendir sync` succeeds and the lock entry sits in the same position as the `vendir.yml` entry (CI flags reordering)
- [x] 3.2 Verify the vendored chart carries the L4 route kinds: `grep -c "kind: TCPRoute\|kind: UDPRoute" third_party/vendir/charts/envoy-gateway/charts/crds/crds/gatewayapi-crds.yaml` is non-zero and the bundle-version annotation reads `v1.6.1`
- [x] 3.3 Create `apps/platform/src/envoy-gateway/` (umbrella `Chart.yaml` with one `file://` dep, `values.yaml`, `fleet.yaml` with both cluster targets **and** the terminal `doNotDeploy` catch-all); verify `helm dependency build` + `helm template` render, then `bin/fleet-lint-targets` passes
- [x] 3.4 Apply to the secret cluster (`moon run secret:apply`); verify the `envoy` `GatewayClass` reports `Accepted` and the control-plane pod is Running on arm64
- [x] 3.5 Apply to the network cluster (`moon run network:apply`); verify the same two conditions

## 4. Shared mesh-service chart

- [x] 4.1 Create `apps/platform/src/mesh-service/` as a first-party chart with **no `fleet.yaml`**; verify it is never picked up standalone by checking it is absent from `moon run :fleet_build` output
- [x] 4.2 Define the `values.yaml` parameter contract (`name`, `domain`, `sourceGroups[]`, `listeners[]`, `certIssuer`) with fail-fast on empty `name`/`domain`; verify `helm template` with an empty `name` errors instead of rendering a certificate for a bare domain (spec: "Incomplete declaration fails fast")
- [x] 4.3 Add the `Certificate` template with a parameterised `issuerRef` (defaults to `letsencrypt-prod`, so 1.4's answer is a values change); verify rendered `dnsNames` is exactly `<name>.<domain>`
- [x] 4.4 Add the `EnvoyProxy` template with `useListenerPortAsContainerPort: true`, `NET_BIND_SERVICE`, 1 replica, `Recreate` strategy, `ClusterIP` service, and the pod label the sidecar profile selects; verify the rendered output contains no `10080`/`10443` anywhere
- [x] 4.5 Document **in the template header** why the port shift is disabled (no Service in the path — traffic lands on the WireGuard interface inside the pod netns); verify the comment names that reason, since a future reader deleting the flag breaks every service silently
- [x] 4.6 Add the `Gateway` + route templates rendering one listener per entry and the matching `HTTPRoute`/`TLSRoute`/`TCPRoute`/`UDPRoute`; verify a mixed HTTPS+TCP+UDP values file renders all three route kinds with the declared port numbers
- [x] 4.7 Add the NetBird identity templates (`Group`, enrolment key with extra-DNS-labels allowed + ephemeral, sidecar profile with the extra DNS label); verify the rendered label equals `name` and the pod selector matches 4.4's label
- [x] 4.8 Add the access-policy template deriving protocols and ports from `listeners[]` with sources from `sourceGroups[]`; verify a values file declaring only HTTPS renders a policy limited to TCP 443 (spec: "Undeclared port is not reachable")
- [x] 4.9 Add the watchdog CronJob + ServiceAccount using an image with a shell, detecting wedged sessions from the client's **reported output** not its exit status; verify a dry-run of the detection logic against both healthy and wedged sample output classifies each correctly
- [x] 4.10 Document the chart's parameter contract inline in `values.yaml` in the house comment style; verify by rendering both an HTTPS-only and an HTTPS+TCP+UDP service purely from the documented knobs

## 5. Expose OpenBao (first real service)

**Results (2026-10-01):**

- **5.1 DONE.** `apps/secret/src/mesh-openbao/` = `Chart.yaml` (one `file://` dep) + `fleet.yaml`
  (whole declaration under `mesh-service:`), no `templates/`. `defaultNamespace: secret`, NOT
  `netbird`: a SidecarProfile selects pods in its own namespace and backendRefs resolve in the
  release namespace, so the exposure has to sit where the backing Service does (same reason
  `apps/network/src/eso-sidecar` lives in `external-secrets`). Renders 12 resources, certificate
  SAN exactly `openbao.vpn.blueora.ng`, one `tcp/443` NBPolicy, no `10443`/`10080` anywhere.
  `bin/fleet-lint-targets` 31/31 ok and `moon run :fleet_build` builds `secret-mesh-openbao` —
  with `mesh-service` still absent from the output, which re-confirms 4.1.
  `dependsOn` is netbird-operator + envoy-gateway only: cert-manager and the `letsencrypt-prod`
  ClusterIssuer live in shared platform bundles that carry no `fleet.vgijssel.nl/bundle` label to
  select on, and a Certificate may sit Pending until its issuer exists.

- [x] 5.1 Create `apps/secret/src/mesh-openbao/` (one `file://` dep on the shared chart; `name: openbao`, HTTPS 443 → `openbao:8200`, sources `homelab` + `network-k8s`; `dependsOn` the operator and gateway bundles; terminal `doNotDeploy` target); verify `moon run :fleet_build` and `bin/fleet-lint-targets` pass
- [ ] 5.2 Apply with `moon run secret:apply`; verify the `Certificate` is `Ready`, the `Gateway` is `Accepted` + `Programmed`, and the data-plane pod has **both** the proxy and mesh-client containers
- [ ] 5.3 Verify peer identity: the peer carries DNS label `openbao`, sits in group `svc-openbao`, and its access policy exists
- [ ] 5.4 Verify the spec's resolution contract from the Mac: `dig +short openbao.vpn.blueora.ng` returns an overlay address **and** `dig +short openbao.vpn.blueora.ng @1.1.1.1` returns nothing
- [ ] 5.5 Verify the certificate contract: `curl -sS https://openbao.vpn.blueora.ng/v1/sys/health` succeeds **without** `-k`, and the UI loads in a browser with no warning and no interstitial
- [ ] 5.6 Verify stable identity across replacement: restart the data-plane pod and confirm the hostname resolves to exactly one healthy peer afterwards, with no stale peer holding the label

## 6. Cross-cluster consumption

- [ ] 6.1 Point both `apps/network/src/config/clustersecretstore-openbao*.yaml` at `https://openbao.vpn.blueora.ng`; verify each reports `Valid` after `moon run network:apply`
- [ ] 6.2 Verify the secrets actually flow: the `cloudflare-api-token` and `netbird-mgmt-api-key` Secrets are populated on the network cluster from the mesh read
- [ ] 6.3 Verify the existing ESO sidecar path is unaffected: its mesh client is still enrolled in `network-k8s` and its watchdog CronJob is unchanged

## 7. Expose Omada and the JWKS mirror

**Results (2026-10-01) — authoring only; 7.2–7.6 deliberately NOT started.**

Everything from 7.2 on mutates the LIVE Omada device path (drops the annotations the operator
infers the device exposure from, renames the device record, re-issues the device certificate).
Doing that before `omada.vpn.blueora.ng` can serve a certificate would take Omada down with no
replacement, so it waits on the DNS-01 gate like the rest of groups 5–11.

- **7.1 DONE.** `apps/network/src/mesh-omada/` renders 22 resources from one declaration:
  11 Gateway listeners (HTTPS 443, TCP 29811–29817, UDP 19810/27001/29810), 1 HTTPRoute →
  `omada:8088`, 7 TCPRoutes and 3 UDPRoutes each → `omada:<same port>`, and two policies that
  are correctly SPLIT by protocol — `tcp [443, 29811..29817]` and `udp [19810, 27001, 29810]`,
  never the cross product. Every declared port appears; no shifted port appears.
  **One risk found while writing it, flagged in the bundle header for 7.10:** `:8088` is the
  controller's HTTP listener and it redirects to its own HTTPS port. If that redirect is
  absolute (`https://<host>:8043`) the mesh UI will bounce off the mesh name. Fallback is a
  `protocol: TLS` passthrough listener to `:8043` — already supported by the shared chart — at
  the cost of serving the controller's own certificate instead of the mesh one.
- **7.7 PARTIAL — bundle authored, verification blocked.** `apps/network/src/mesh-jwks/` renders
  `jwks-network.vpn.blueora.ng` → `jwks-mirror:80`. The `Certificate`/`Gateway` half of 7.7 needs
  the DNS-01 gate, so it stays unchecked.
  **Correction to this task's stated source group.** 7.7 says source `secret-k8s`, but the
  consuming peer — the `jwks-gateway` socat pod — enrolled only into `secret` (the group its
  NBRoutingPeer auto-creates), so as written the policy would have had no effective source and
  8.6 would fail. `secret-k8s` is nonetheless the right choice, because it is a real `Group` CR
  and therefore survives 9.7 deleting that routing peer, which `secret` would not. Resolved
  additively: `apps/secret/src/jwks-gateway/setupkey-jwks-gateway.yaml` now auto-joins BOTH
  groups, so the old NBResource path and the new mesh path work simultaneously (the
  "additive until step 9" rule). `autoGroups` apply at enrolment only, so the running peer gains
  `secret-k8s` when 8.1 recreates that pod; **9.7 should drop `secret` from that key.**

- [x] 7.1 Create `apps/network/src/mesh-omada/` (HTTPS 443 → `omada:8088`, TCP `29811-29817`, UDP `19810`/`27001`/`29810`, source `homelab`); verify `helm template` renders every declared port
- [ ] 7.2 Remove the `netbird.io/expose` and `netbird.io/policy*` annotations from `apps/network/src/omada/templates/service-omada.yaml` while **keeping** the pinned ClusterIP and `external-dns` annotations; verify the rendered Service still carries `clusterIP: 10.96.0.20`
- [ ] 7.3 Rewrite that Service's header comment to describe the split path (devices via ClusterIP + public record, mesh peers via the peer hostname) and mark it as the named exception; verify the comment states the reason devices cannot be peers
- [ ] 7.4 Rename the device-facing record to `omada.blueora.ng` and update `apps/network/src/external-dns/values.yaml` domain filters, keeping the record unproxied; verify `dig +short omada.blueora.ng @1.1.1.1` returns the pinned ClusterIP
- [ ] 7.5 Re-create the device-path exposure resource explicitly (7.2 removed the annotation the operator inferred it from), with a header noting it exists only for non-peer devices; verify the resource reports Ready and the LAN route survives
- [ ] 7.6 Re-issue the device-facing certificate for `omada.blueora.ng` on `:8043`; verify every adopted AP and switch still reports Connected in the controller
- [ ] 7.7 Create `apps/network/src/mesh-jwks/` (`name: jwks-network`, HTTPS 443 → `jwks-mirror:80`, source `secret-k8s`); verify the `Certificate` is `Ready` and the `Gateway` is `Programmed`
- [ ] 7.8 Remove the `netbird.io/*` annotations from the jwks-mirror Service; verify no `netbird.io/expose` annotation remains anywhere under `apps/network/src`
- [ ] 7.9 Verify the port-space contract from the Mac: `openssl s_client -connect omada.vpn.blueora.ng:443 -servername omada.vpn.blueora.ng` shows the expected issuer and CN, `nc -z omada.vpn.blueora.ng 29811` succeeds, and `nc -zu omada.vpn.blueora.ng 29810` succeeds
- [ ] 7.10 Verify the Omada UI loads over the mesh with no certificate warning and all devices still Connected

## 8. Re-point OpenBao's JWKS path

- [ ] 8.1 Re-point the socat forwarder at `jwks-network.vpn.blueora.ng:443` listening on `443`, **without** adding a `resolv-conf` volumeMount (the pinned operator rewrites `/etc/resolv.conf` in place; a mount for that absent volume wedges the pod); verify the pod reaches Running and its mesh client resolves the target
- [ ] 8.2 Update the forwarder Service to `443` → `443` with a pinned ClusterIP; verify the ClusterIP matches what task 8.3 configures
- [ ] 8.3 Add a CoreDNS override on the secret cluster mapping `jwks-network.vpn.blueora.ng` to that pinned ClusterIP; verify in-cluster resolution returns the ClusterIP while mesh resolution still returns the peer address
- [ ] 8.4 Document the intentional split-horizon in the override's header — both paths terminate at the same certificate, which is why no verification is disabled; verify the comment states that property (spec: "Local resolution does not weaken validation")
- [ ] 8.5 Point OpenBao's `jwt-network` `jwksUrl` at `https://jwks-network.vpn.blueora.ng/openid/v1/jwks`; verify `bao read auth/jwt-network/config` reflects the HTTPS URL
- [ ] 8.6 Verify end-to-end TLS actually validates: force a fresh cross-cluster token login from the network cluster and confirm it succeeds with no verification skipped anywhere in the path

## 9. Demolition

Only after every verification in groups 5–8 is green.

- [ ] 9.1 Delete `apps/secret/src/netbird-reverse-proxy/`, `apps/network/src/netbird-reverse-proxy/` and `apps/platform/src/netbird-reverse-proxy-shared/`; verify `moon run :fleet_build` still succeeds and the removed bundles are gone from its output
- [ ] 9.2 Check for Crossplane resources needing an orphan deletion policy and a live patch **before** pruning the OpenTofu Workspaces (a cross-bundle move without this previously caused an outage); verify no live resource is scheduled for destroy in the plan output
- [ ] 9.3 Delete the three reverse-proxy Workspaces from `apps/{secret,network}/src/cloudflare-config/`, removing any bundle left with no resources; verify the surviving Cloudflare state still reconciles clean
- [ ] 9.4 Delete `third_party/vendir/charts/netbird-reverse-proxy/` and its `vendir.yml` entry, leaving `charts/tailscale-operator` untouched (`apps/enigma-cluster` still consumes it); verify `vendir sync` succeeds and the tailscale chart is still present
- [ ] 9.5 Delete `apps/secret/scripts/put_netbird_proxy_auth.sh` and both proxy-token tasks from `apps/secret/moon.yml`; verify `moon query tasks` no longer lists them and no remaining script references the deleted file
- [ ] 9.6 Remove the OpenBao `proxy-token` role config and delete the stale `kv/secret-netbird-proxy` and `kv/network-netbird-pikvm-proxy` entries; verify the role is gone from the OpenBao config and no ExternalSecret references those paths
- [ ] 9.7 Delete the routing peer and its watchdog from `apps/secret/src/netbird-config/`, and from the network cluster only if 7.5's device-path resource does not need it; verify whichever survives carries a header explaining why, and that no service regressed
- [ ] 9.8 Reconcile remaining hostname references: `grep -rn "vgijssel.nl" apps/{secret,network,platform}/src` shows no mesh service names, only legitimate zone-level references
- [ ] 9.9 Turn off the operator's automatic-policy-creation flag if and only if no policy annotation survives 9.7 (resolves the second design Open Question); verify every service is still reachable afterwards
- [ ] 9.10 Delete the account-side artifacts: both BYOP proxy clusters, their private services, the registered reverse-proxy domains and orphaned proxy tokens; verify the dashboard lists no reverse-proxy clusters

## 10. PiKVM

**Results (verified live 2026-10-01):**

- **10.1 PASS.** The PiKVM peer picked the new domain up with no action on the box: it is
  `Connected` as `pikvm.vpn.blueora.ng`, resolves to `100.65.192.152` from the Mac, and answers
  ICMP there. No re-enrolment and no client restart was needed — the account DNS domain is served
  by the resolver, not baked into the peer.

- [x] 10.1 Verify the PiKVM peer resolves at `pikvm.vpn.blueora.ng` after the domain flip
- [ ] 10.2 Update `apps/pikvm` and `apps/network/network.md` hostname references and the goss health contract; verify the goss suite passes over the mesh (create unit symlinks directly rather than via `systemctl enable`, which hits a read-only filesystem over mesh SSH)
- [ ] 10.3 Record the self-signed certificate warning as a known, accepted consequence and file both upgrade paths as follow-ups; verify the note states that the removed proxy existed solely to paper over it

## 11. Integration verification

Cross-cutting checks only; each group above landed its own tests and docs.

- [ ] 11.1 Run `moon run :fleet_build` and `moon run platform:fleet_build_gitrepo`; verify no stale umbrella pins and the GitRepo catch-all bundle stays under 3 MiB
- [ ] 11.2 Run `bin/fleet-lint-targets` and `trunk fmt && trunk check`; verify both pass with no findings
- [ ] 11.3 Full cold-start proof: `moon run secret:stop && moon run secret:start`, then `moon run network:stop && moon run network:start`; verify every service comes up with no manual intervention beyond the existing seal-key and operator-PAT seeding
- [ ] 11.4 Re-run the complete spec verification matrix from the Mac across all three services (mesh resolution, public non-resolution, certificate validation, declared ports reachable, undeclared port refused); verify every scenario in `specs/mesh-service-exposure/spec.md` holds
- [ ] 11.5 Update `apps/network/SPEC.md`, `apps/network/PLAN.md` and `apps/secret/CLAUDE.md` to describe the single exposure model; verify no doc still describes the reverse-proxy or `NBResource` mesh path as current
