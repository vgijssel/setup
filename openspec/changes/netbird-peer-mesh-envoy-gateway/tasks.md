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
> **~~NEW BLOCKER 2026-10-01 — the Cloudflare API token in OpenBao is dead.~~ RESOLVED 2026-10-05
> by the OpenBao Cloudflare secrets engine** (`libs/openbao-cloudflare-plugin`, commits
> `cd14c242`/`62636165`). The dead `cfat_` account token is gone; `kv/cloudflare#credential` now
> holds a **user-scoped parent** credential that the engine mints *per-consumer* dynamic tokens
> from, so there is no longer a single static token to go stale. See the rewritten 2.2/2.4 below —
> the group-2 goal (a credential that can write DNS-01 TXT records in `blueora.ng`) is met by a
> different and better mechanism than the one these tasks were written against.
>
> Historic detail, kept because it explains the task rewrite: the old token was rejected
> account-wide with `9109 Invalid access token` on `/zones` and had `deploy/external-dns` in a
> fatal crash loop, it was absent from 1Password, and re-minting needed dashboard access — which
> is why 2.2 was recorded as a human step gating 2.3, 2.4, 2.7/2.8 and all of groups 5–11.
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
- [x] 2.2 Give cert-manager a Cloudflare credential that can edit DNS in `blueora.ng` **and** `vgijssel.nl` (1.4 said one credential suffices). **REWRITTEN** from "mint a scoped static token": the OpenBao Cloudflare secrets engine now mints a per-consumer token on every read, so the task is adding `blueora.ng`'s zone id to the engine's roles rather than minting a token by hand; verify by issuing a real certificate in the new zone (which is 2.7)
- [x] 2.3 Assert the no-wildcard constraint: verify `dig +short '*.blueora.ng' @1.1.1.1` returns nothing, and record the zone id as a non-secret constant alongside the existing `cloudflareZoneId` comment
- [x] 2.4 Hold the credential in OpenBao. **REWRITTEN** from `kv/blueora-cloudflare#token`: there is no per-zone key, because the engine's one user-scoped parent at `kv/cloudflare#credential` spans both zones and consumers read `cloudflare/token/<role>` instead; verify the consuming Secret is populated with a token that works
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

**Results (verified live 2026-10-05) — the Cloudflare blocker is gone and the GO/NO-GO gate is PASSED.**

- **2.2 PASS, by a different mechanism than the task described.** There is no hand-minted static
  token any more. `apps/secret/src/openbao-config/plugin-cloudflare-config.yaml` configures the
  Cloudflare secrets engine with a **user-scoped** parent credential (`token_scope = "user"`, which
  is the only scope that can mint across two Cloudflare accounts — `blueora.ng` is in
  Maarten@vgijssel.nl's account, `vgijssel.nl` in Piet@vgijssel.nl's) and two roles,
  `cloudflare/token/cert-manager` (`DNS Write`) and `cloudflare/token/external-dns`
  (`DNS Write` + `Zone Read`). Both roles list **both** zone ids, so 1.4's "one credential, no
  sibling `ClusterIssuer`" conclusion holds and the chart's `certIssuer: letsencrypt-prod` default
  stands. Scoping is by zone id, which is globally unique, so one engine spans two accounts
  without either role naming an account.
  *The failure mode that blocked this group cannot recur in the same way:* the old token was one
  static credential shared by every consumer, so when it died everything died with it. Each
  consumer now holds its own separately-scoped, separately-revocable, 48h-expiring token.
- **2.3 PASS.** No-wildcard re-verified today, which matters because the zone has had records
  written to it since the 2026-10-01 check: `*.blueora.ng`, `a.b.c.blueora.ng` and
  `probe.vpn.blueora.ng` all return nothing from `1.1.1.1`, and `NS blueora.ng` still answers
  `katelyn`/`ken`. Zone id `b763644969bac446062ef24eef5565f0` is recorded as a non-secret `vars`
  entry in `plugin-cloudflare-config.yaml` beside `vgijssel.nl`'s
  `8e5a9db0a62108e5fff87072dbb939d0` — a better home than the original "alongside the
  `cloudflareZoneId` comment", since that file is now the single source of truth for which zones
  this repo manages.
- **2.4 PASS, path changed.** `kv/blueora-cloudflare#token` was never created and should not be:
  a second per-zone key would reintroduce exactly the static-token-per-consumer shape the engine
  removes. The parent lives at `kv/cloudflare#credential`, reaches Crossplane via
  `apps/secret/src/config/vaultstaticsecret-cloudflare-admin-token.yaml`, and cert-manager gets a
  *dynamic* token through `apps/platform/src/config/vaultdynamicsecret-cloudflare-api-token.yaml`
  into the same `cloudflare-api-token` Secret / `api-token` key the `ClusterIssuer` already reads,
  so no issuer edit was needed. Live: that `VaultDynamicSecret` is `SYNCED/HEALTHY/READY` on
  **both** clusters, as is `external-dns`'s on the network cluster.
- **2.7 GO — the gate is passed by the real certificate rather than a probe.** A throwaway
  `probe.vpn.blueora.ng` certificate is redundant now that the thing it was a dress rehearsal for
  already succeeded: `secret/openbao-mesh` is `Ready`, SAN exactly `["openbao.vpn.blueora.ng"]`,
  `issuerRef` `ClusterIssuer/letsencrypt-prod`, `notBefore 2026-10-02T11:27:07Z`,
  `notAfter 2026-12-31T11:27:06Z`, revision 1. That proves every property the gate asked for, and
  more: DNS-01 works in `blueora.ng`, through the dynamically-minted token, from the secret
  cluster, for a real mesh hostname. The non-resolution half holds too —
  `dig +short openbao.vpn.blueora.ng @1.1.1.1` is empty, so a publicly-trusted certificate exists
  for a name the public internet cannot resolve, which is the spec's central claim.
- **2.8 N/A, verified as satisfied.** Nothing to delete, since no probe was ever created. The
  property 2.8 actually guards is that issuance leaves no residue, and it holds:
  `dig TXT _acme-challenge.openbao.vpn.blueora.ng @1.1.1.1` and
  `_acme-challenge.probe.vpn.blueora.ng` are both empty, and no `A` record for the mesh hostname
  exists at any point — the spec's "certificate issuance does not publish the name".

- [x] 2.7 **GO/NO-GO GATE** — add a throwaway `Certificate` for `probe.vpn.blueora.ng` on the secret cluster using the new token; verify it reaches `Ready` **and** that `dig +short probe.vpn.blueora.ng @1.1.1.1` is empty. Do not proceed if either check fails; nothing has been deleted yet
- [x] 2.8 Delete the probe `Certificate` and its Secret; verify the challenge TXT record is cleaned up from the zone

## 3. Vendor and deploy the gateway control plane

- [x] 3.1 Add a `charts/envoy-gateway` entry to `third_party/vendir/vendir.yml` pinned to `1.9.2` (`oci://docker.io/envoyproxy/gateway-helm`); verify `vendir sync` succeeds and the lock entry sits in the same position as the `vendir.yml` entry (CI flags reordering)
- [x] 3.2 Verify the vendored chart carries the L4 route kinds: `grep -c "kind: TCPRoute\|kind: UDPRoute" third_party/vendir/charts/envoy-gateway/charts/crds/crds/gatewayapi-crds.yaml` is non-zero and the bundle-version annotation reads `v1.6.1`
- [x] 3.3 Create `apps/platform/src/envoy-gateway/` (umbrella `Chart.yaml` with one `file://` dep, `values.yaml`, `fleet.yaml` with both cluster targets **and** the terminal `doNotDeploy` catch-all); verify `helm dependency build` + `helm template` render, then `bin/fleet-lint-targets` passes
- [x] 3.4 Apply to the secret cluster (`moon run secret:apply`); verify the `envoy` `GatewayClass` reports `Accepted` and the control-plane pod is Running on arm64
- [x] 3.5 Apply to the network cluster (`moon run network:apply`); verify the same two conditions

## 4. Shared mesh-service chart

- [x] 4.1 Create `apps/platform/src/mesh-service/` as a first-party chart with **no `fleet.yaml`**; verify it is never picked up standalone by checking it is absent from `moon run :fleet_build` output
- [x] 4.2 Define the `values.yaml` parameter contract (`name`, `domain`, `sourceGroups[]`, `listeners[]`, `certIssuer`) with fail-fast on empty `name`/`domain`; verify `helm template` with an empty `name` errors instead of rendering a certificate for a bare domain (spec: "Incomplete declaration fails fast")
- [x] 4.3 Source the service's TLS keypair. **REWRITTEN 2026-10-05** from "add the `Certificate` template with a parameterised `issuerRef`": the chart no longer issues anything per service — one wildcard `*.<domain>` is issued on the secret cluster and read from OpenBao by every exposure; verify the rendered `VaultStaticSecret` produces a `kubernetes.io/tls` Secret at the unchanged name
- [x] 4.4 Add the `EnvoyProxy` template with `useListenerPortAsContainerPort: true`, `NET_BIND_SERVICE`, 1 replica, `Recreate` strategy, `ClusterIP` service, and the pod label the sidecar profile selects; verify the rendered output contains no `10080`/`10443` anywhere
- [x] 4.5 Document **in the template header** why the port shift is disabled (no Service in the path — traffic lands on the WireGuard interface inside the pod netns); verify the comment names that reason, since a future reader deleting the flag breaks every service silently
- [x] 4.6 Add the `Gateway` + route templates rendering one listener per entry and the matching `HTTPRoute`/`TLSRoute`/`TCPRoute`/`UDPRoute`; verify a mixed HTTPS+TCP+UDP values file renders all three route kinds with the declared port numbers
- [x] 4.7 Add the NetBird identity templates (`Group`, enrolment key with extra-DNS-labels allowed + ephemeral, sidecar profile with the extra DNS label); verify the rendered label equals `name` and the pod selector matches 4.4's label
- [x] 4.8 Add the access-policy template deriving protocols and ports from `listeners[]` with sources from `sourceGroups[]`; verify a values file declaring only HTTPS renders a policy limited to TCP 443 (spec: "Undeclared port is not reachable")
- [x] 4.9 Add the watchdog CronJob + ServiceAccount using an image with a shell, detecting wedged sessions from the client's **reported output** not its exit status; verify a dry-run of the detection logic against both healthy and wedged sample output classifies each correctly
- [x] 4.10 Document the chart's parameter contract inline in `values.yaml` in the house comment style; verify by rendering both an HTTPS-only and an HTTPS+TCP+UDP service purely from the documented knobs

## 4b. Shared wildcard certificate (added 2026-10-05)

Not in the original plan. The chart issued one single-SAN certificate per exposure; it now reads
one shared wildcard out of OpenBao. Rationale, and the cost it buys, are in `design.md` under
"Certificates" and in `apps/secret/src/mesh-tls/fleet.yaml`.

**Results (verified live 2026-10-05):**

- **New bundle `apps/secret/src/mesh-tls/` (secret cluster only — a single issuance site, on
  purpose).** `Certificate/mesh-wildcard` for `*.vpn.blueora.ng` reached `Ready` in **96 s**, one
  DNS-01 challenge. `Workspace/mesh-tls-publish` copies the keypair into `kv/mesh-tls` with keys
  `tls.crt`/`tls.key` — a byte-for-byte mirror of a `kubernetes.io/tls` Secret, so nothing has to
  be renamed downstream. Verified end to end by fingerprint: the Workspace output
  `certificate_sha256 = a02f27ad…a3178` equals `shasum -a 256` of the issued certificate locally.
  Served cert is `CN=*.vpn.blueora.ng`, Let's Encrypt `YR2`, valid to 2027-01-03.
- **The keypair reaches the Workspace without a `kubernetes` provider or any new RBAC**, via
  `env[].secretKeyRef` — the same mechanism `plugin-cloudflare-config.yaml` uses. provider-opentofu
  resolves it itself, and its ServiceAccount already holds cluster-wide secret read (verified:
  `secrets: ['*']`).
- **Chart change.** `certificate-mesh-service.yaml` deleted, `vaultstaticsecret-mesh-service.yaml`
  added; `certIssuer` replaced by `tls.{mount,path}`. The Secret name, type and keys are UNCHANGED,
  so the Gateway's `certificateRefs` and everything downstream were untouched.
- **All three services now serve the ONE wildcard**, verified with `openssl s_client` and `curl`
  **without** `-k`: `openbao` (307), `omada` (302), `jwks-network` (404 — all application-level
  responses, so TLS validated in each case). Exactly **one** mesh `Certificate` object now exists
  across both clusters, down from one per service.
- **Envoy Gateway picked the new certificate up over xDS with no pod restart**, as the chart
  claimed it would — the swap from the cert-manager Secret to the VSO-owned one caused no
  interruption.
- **The no-wildcard-RECORD constraint is untouched, re-verified after issuance:**
  `*.blueora.ng`, `a.b.c.blueora.ng`, `openbao.vpn.blueora.ng` and `probe.vpn.blueora.ng` all
  return nothing from `1.1.1.1`, and no `_acme-challenge` TXT residue remains at either the apex
  or a service name. A wildcard certificate publishes no address record; the spec scenario now
  says so explicitly, because the two are easy to conflate.
- **No circular dependency**, which was the thing to check hardest: OpenBao distributes the
  certificate its own exposure serves. It is safe because the secret cluster's VSO reaches OpenBao
  over the in-cluster ClusterIP in **plain HTTP**, so nothing needs the certificate in order to
  fetch the certificate. The network cluster needs OpenBao's mesh certificate to be *valid* — a
  client-side trust check, not possession — so it only has to come up second, which is already the
  required order.
- **kv VERSION HISTORY was a hole, and closing it exposed a second one.** kv v2 retains history
  and the mount default is 10, so by default every renewal would leave the superseded private key
  readable at `kv/mesh-tls?version=N` for the next nine renewals — to anyone with
  `kv/data/mesh-tls` read, which the shared VSO policy grants via `kv/data/*`. Rotating a key is
  pointless if the old one stays fetchable, so the publish resource now sets
  `custom_metadata { max_versions = 1 }`.
  Adding it immediately failed in an instructive way: `custom_metadata` is written to the
  **metadata** endpoint, and the policy granted only `read` there — so the DATA write succeeded and
  then the metadata write was denied, meaning every retry of the failed reconcile left ANOTHER
  version behind. Watched it climb 1 → 9 in about three minutes, i.e. the too-narrow grant caused
  exactly the accumulation `max_versions` exists to prevent. Fixed by granting
  `create`/`update` on `kv/metadata/mesh-tls` in both policies.
  Note `max_versions` is NOT retroactive: lowering it prunes on subsequent writes only, so the ten
  existing versions had to be destroyed by hand (`bao kv destroy -versions=2,…,10 kv/mesh-tls`) —
  now one live version, nine destroyed. Low severity in substance, because the wildcard has only
  ever been issued once, so every one of those versions held an identical keypair rather than a
  series of superseded ones.
- **Two live gotchas worth keeping:**
  - `destination.overwrite: true` is REQUIRED on the consuming `VaultStaticSecret`, not optional.
    cert-manager sets no ownerReference by default, so pruning the old per-service `Certificate`
    leaves its Secret behind and VSO's create is blocked by it. The CRD documents the field for
    exactly this case. It is also the safe direction: when the kv read fails, VSO leaves the
    existing Secret alone rather than emptying it — which is why the old certificate kept serving
    throughout the transition.
  - **Apply the producer before the consumer, or wait out VSO's backoff.** Applying both in one
    pass had the consumers retrying `kv/data/mesh-tls` before it existed; VSO backs off
    exponentially (observed 13:00:20 → 13:01:01 → 13:02:23 → 13:05:07) so it sat `Unhealthy` long
    after the data landed. `kubectl annotate … vso.secrets.hashicorp.com/force-sync=$(date +%s)`
    clears it. The network cluster, applied after kv was populated, synced first try — which is
    the control for this.
- **Also mirrored into self-init.** The `kv/data/mesh-tls` write grant was added to BOTH
  `policy-crossplane.yaml` and the self-init policy in `src/openbao/values.yaml`, which both
  instruct that they be kept byte-identical (`cloudflare/config/*` is the precedent). Scoped to
  that one key rather than `kv/data/*`: this is the reconciler's broad admin policy, and writing
  the mesh certificate is as powerful as serving every mesh hostname.
  Read access needed NO change — both clusters' VSO roles share the `vault-secrets-operator`
  policy, which already grants `kv/data/*`. That breadth is noted as the first thing to tighten
  if the shared-key blast radius ever needs reducing.

- [x] 4b.1 Issue `*.vpn.blueora.ng` once on the secret cluster and publish it to `kv/mesh-tls`; verify the published fingerprint matches the issued certificate
- [x] 4b.2 Replace the chart's per-service `Certificate` with a `VaultStaticSecret` reading that path; verify the Secret keeps its name, `kubernetes.io/tls` type and `tls.crt`/`tls.key` keys
- [x] 4b.3 Verify all three services serve the wildcard with no `-k` and no pod restart, and that exactly one mesh `Certificate` object remains across both clusters
- [x] 4b.4 Verify the wildcard introduces no wildcard DNS record and no ACME residue, and that the spec's no-wildcard scenario is clarified to be about records rather than certificates

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

**Results (verified live 2026-10-05) — OpenBao is SERVING on the mesh. Two defects found, both real.**

- **5.2 PASS, after fixing a silent name collision that stopped the data plane from existing.**
  The Gateway was named `{{ .Values.name }}` — bare `openbao` — and the control plane runs
  `deploy.type: GatewayNamespace`, which names the data-plane ServiceAccount, Deployment and
  Service after the **Gateway**, in the Gateway's namespace. A mesh-service release deliberately
  sits in the namespace of the Service it publishes, so the exposure collided head-on with the
  workload it fronts: `failed to create or update serviceaccount secret/openbao: ServiceAccount
  secret/openbao already exists and is not owned by this Gateway` — that SA belongs to the OpenBao
  StatefulSet. Envoy Gateway refuses to adopt what it does not own, aborted infra creation, and
  never built the Deployment. Had it got one resource further, the Service it wanted was
  `secret/openbao`: **OpenBao's own Service**.
  The failure presented almost healthy, which is why it survived 3 days unnoticed: Certificate
  `Ready`, Gateway `Accepted=True`, the single listener `Programmed=True`/`ResolvedRefs=True`, and
  only the top-level `Programmed=False / AddressNotAssigned` to show for it. No pod, no event on
  the Gateway, nothing in `kubectl describe` — the error lived only in the control-plane log.
  Fixed generically in the shared chart (`mesh-service.gatewayName` → `<name>-mesh`, matching every
  other resource) rather than per service, because `omada` and `jwks-network` would each have hit
  the same wall in their own namespace. After re-apply: Gateway `Programmed=True` with address
  `10.107.48.3`, pod `3/3 Running` carrying `envoy` + `shutdown-manager` containers and the
  `netbird` client as a restartPolicy:Always sidecar init-container.
- **5.3 PASS, after the defect-A fix below.** Management API for peer `db1p473l0ubs7381ics0`:
  `extra_dns_labels: ["openbao.vpn.blueora.ng"]`, `ip 100.65.76.188`, `connected true`, groups
  `svc-openbao` + `All`. All four CRs `Ready` (`Group/svc-openbao`, `SetupKey/openbao`,
  `SidecarProfile/openbao`, `NBPolicy/openbao-tcp`).
  The "and its access policy exists" half initially FAILED — the CR reported Ready while the
  account had no such policy — and is now satisfied by the Workspace described below.
- **5.4 PASS.** From the Mac: `dig +short openbao.vpn.blueora.ng @100.65.255.254` → `100.65.76.188`
  (the Envoy peer), and `@1.1.1.1` → empty. Note the task's bare `dig +short` cannot work on
  macOS — scoped resolvers are invisible to `dig`, so the NetBird resolver must be named
  explicitly (same gotcha as 2.5).
- **5.5 PASS, fully.** `curl -sS https://openbao.vpn.blueora.ng/v1/sys/health` with **no** `-k`
  returns `{"initialized":true,"sealed":false,...,"version":"2.5.5"}`. `openssl s_client` shows
  `subject=CN=openbao.vpn.blueora.ng`, `issuer=C=US, O=Let's Encrypt, CN=YR2`. The UI serves
  `http 200` on `/ui/` and `/` is a `307` to `https://openbao.vpn.blueora.ng/ui/` — the mesh
  hostname itself, no shifted port, no host rewrite, and no interstitial because there is no
  proxy left in the path to show one.
- **5.6 PASS, after the defect-B fix below.** The original run FAILED outright; re-run clean it
  holds exactly one peer and one DNS answer throughout a rollout.

### Both defects FIXED 2026-10-05 (decisions taken with the maintainer)

- **A → the access policy is now an OpenTofu `Workspace`, not an `NBPolicy`.**
  `templates/workspace-policy-mesh-service.yaml` replaces `nbpolicy-mesh-service.yaml`, rendering
  one `netbird_policy` (provider `netbirdio/netbird` `0.0.10`, already used elsewhere in this repo)
  as **one policy per protocol, each with a single rule**, so each port stays bound to the protocol
  it was declared under and the cross product is never opened.
  The first attempt put two `rule` blocks in ONE policy, which reads better and which the provider
  rejects outright: `Attribute rule list must contain at least 1 elements and at most 1 elements,
  got: 2`. Worth recording how that surfaced — `mesh-openbao` is HTTPS-only and reconciled green,
  so the constraint only appeared on `mesh-omada`, the first mixed-protocol service. A chart change
  validated against a single-protocol service alone would have shipped broken.
  Groups are resolved by name through
  `data "netbird_group"` because the resource takes group IDs. The PAT comes from
  `crossplane-system/netbird-mgmt-api-token`, which Vault Secrets Operator already populates on
  both clusters.
  Live on BOTH clusters — all three policy Workspaces `SYNCED=True READY=True`, and the account now
  holds exactly these four policies, each `bidirectional false` / `action accept`:

  | policy | proto | ports | sources → destination |
  |---|---|---|---|
  | `svc-openbao-tcp` | tcp | 443 | `homelab, network-k8s` → `svc-openbao` |
  | `svc-jwks-network-tcp` | tcp | 443 | `secret-k8s` → `svc-jwks-network` |
  | `svc-omada-tcp` | tcp | 443, 29811–29817 | `homelab` → `svc-omada` |
  | `svc-omada-udp` | udp | 19810, 27001, 29810 | `homelab` → `svc-omada` |

  The Omada pair is the proof the cross product is closed: no UDP/443 and no TCP/29810 anywhere.
  **Caveat recorded in `values.yaml`:** this restriction does not BITE until the account's built-in
  `Default` policy (All ↔ All, protocol `all`, bidirectional) is narrowed or removed. That is now
  the only thing standing between the spec's "enrolled peer outside the allowed groups is denied"
  and reality, and it is an account-level change affecting every peer — so it belongs in group 9
  beside the other account-side demolition, not here.
  *Gotcha worth knowing:* `kubectl get workspace` resolves to `workspaces.opentofu.m.upbound.io`
  (the namespaced v2 group) and reports "not found" for these. Use the fully qualified
  `workspaces.opentofu.upbound.io` — the same trap the ESO/VSO `VaultDynamicSecret` collision had.
- **B → the chart now runs the mesh client itself, with a `preStop` that deregisters the peer.**
  `SidecarProfile` injection is gone. The client is an `EnvoyProxy.envoyDeployment.initContainers`
  entry with `restartPolicy: Always` (a native sidecar), `NB_EXTRA_DNS_LABELS`, and
  `lifecycle.preStop: [netbird, deregister]`. `SidecarProfile.containerOverride` has no `lifecycle`
  field, so this was unreachable through the operator's API — hence running it ourselves.
  Validated the mechanism before building on it: `netbird deregister` on the live peer printed
  "Deregistered successfully" and the registration count went 1 → 0 immediately; a subsequent pod
  restart re-enrolled cleanly, which also proves the operator's setup key is **reusable**.
  **Clean rollout test after the fix — the defect is gone:** peers holding the label stayed at
  **exactly 1** at t+12/24/36/48/60s and `dig` returned exactly **one** address at every sample,
  versus 2 peers and both addresses for 7+ minutes before. `Recreate` is still load-bearing and now
  for a sharper reason, recorded in the template: it is what makes the deregister *sufficient*,
  because the outgoing pod is fully gone before the replacement enrols. Under `RollingUpdate` the
  new peer would enrol while the old still held the label and the deregister would come too late.
  Bonus, not incidental: this takes the operator's `failurePolicy: Fail` mutating webhook out of
  the data plane's critical path.
- **Upstream check (requested): no fix is coming and the case is unreported.** The closest issue,
  [kubernetes-operator#220](https://github.com/netbirdio/kubernetes-operator/issues/220), is closed:
  a collaborator's position is that ephemeral keys reap after ~10 min and explicit deletion on
  teardown is "a nice-to-have rather than a bug". That reasoning holds for ROUTING peers, which
  hold no name — a stale peer carrying an extra DNS label hijacks the service hostname instead, and
  searches for the sidecar/extra-DNS-label variant return nothing. Also
  [#425](https://github.com/netbirdio/kubernetes-operator/pull/425) (open) shows upstream's Gateway
  API direction is private HTTPRoutes built on the **reverse proxy** — the stack this change
  removes — so waiting on upstream is not an option either.
- **Re-verified after both fixes, from the NETWORK cluster's `router` peer** (stronger than from
  the Mac: it proves cross-cluster mesh resolution, and the Mac's system resolver was holding two
  already-deleted addresses — see the note on 5.4 below):
  `nslookup A openbao.vpn.blueora.ng` → single address `100.65.45.142`;
  `wget -O - https://openbao.vpn.blueora.ng/v1/sys/health` → the unsealed-OpenBao JSON;
  `nc -z … 443` open, `nc -z … 8200` refused. (The 8200 probe is honest but weak evidence about the
  *policy*: Envoy only listens on 443 inside the pod, so 8200 would be refused regardless. The
  policy's effect is established by the account state above, not by that probe.)

### DEFECT A — the standalone `NBPolicy` is a silent no-op, so the service is wide open

`NBPolicy/openbao-tcp` reports `Ready=True` and creates **nothing**. The account has 12 policies
and none is `svc-openbao-tcp`. The operator log says why, every reconcile:

```
NBPolicy  0 ports found for protocol in policy  {"name": "openbao-tcp", "protocol": "tcp"}
```

…even though the CR carries `ports: [443]` and `protocols: [tcp]`. The reason is in the CRDs:
`NBResource` has `policyName`, `policySourceGroups`, `tcpPorts` and `udpPorts`. On operator
`v0.7.0`, **`NBPolicy` is an aggregator, not a declaration** — it collects its ports from the
`NBResource`s that name it, and renders one account policy per protocol from those. With no
`NBResource` referencing it there are no ports, so there is nothing to create, and it calls that
success.

This invalidates the design decision *"Declarative access policy replaces annotation inference"*,
which assumed `NBPolicy` was usable on its own. Consequences right now:

- The only thing granting access is the account's built-in `Default` policy: `All` ↔ `All`,
  protocol `all`, bidirectional. So **every peer in the account can reach every port** of the
  exposure. Spec scenarios *"Enrolled peer outside the allowed groups is denied"* and
  *"Undeclared port is not reachable"* are both unmet.
- Task 9.9 ("turn off automatic-policy-creation") cannot be answered as written, because the
  mechanism intended to replace it does not work.

Note this is also why 5.2–5.5 could be verified at all: the service is reachable *because* nothing
is restricting it.

### DEFECT B — a replaced pod leaves a stale peer holding the DNS label, and it takes the service DOWN

Spec scenarios *"No split resolution during replacement"* and *"Retired peers do not linger"*.
`rollout restart deploy/openbao-mesh`, then polled:

| t after rollout | peers holding `openbao.vpn.blueora.ng` | `dig` answer |
|---|---|---|
| +15 s … +90 s | **2** — `100.65.76.188` (connected=**false**) and `100.65.23.28` (connected=true) | both addresses, order varying |

Then 12 sequential `curl https://openbao.vpn.blueora.ng/v1/sys/health`: **0 succeeded, 12 failed.**
Not the 50% a round-robin suggests — the resolver handed out the dead address stickily, so the
outage was total. The service itself was perfectly healthy throughout:
`curl --resolve openbao.vpn.blueora.ng:443:100.65.23.28` → `http 200`, and the new peer answered
ICMP in 33 ms.

So **1 replica + `Recreate` is not sufficient**, which is a correction to the design decision
"Stable names come from extra DNS labels, single replica, Recreate". That pair stops two *pods*
running at once; it does nothing about the stale peer *registration*, which keeps the extra DNS
label until NetBird reaps it. Task 1.1's spike saw ~20 s and recorded it as a caveat; the real
thing is far worse — still both after 90 s, and the ephemeral-peer reap appears to be on
NetBird's own offline timeout, not pod teardown. A rollout is therefore a multi-minute hard
outage of the hostname, not the "short, honest outage" the design accepted.

- [x] 5.1 Create `apps/secret/src/mesh-openbao/` (one `file://` dep on the shared chart; `name: openbao`, HTTPS 443 → `openbao:8200`, sources `homelab` + `network-k8s`; `dependsOn` the operator and gateway bundles; terminal `doNotDeploy` target); verify `moon run :fleet_build` and `bin/fleet-lint-targets` pass
- [x] 5.2 Apply with `moon run secret:apply`; verify the `Certificate` is `Ready`, the `Gateway` is `Accepted` + `Programmed`, and the data-plane pod has **both** the proxy and mesh-client containers
- [x] 5.3 Verify peer identity: the peer carries DNS label `openbao`, sits in group `svc-openbao`, and its access policy exists
- [x] 5.4 Verify the spec's resolution contract from the Mac: `dig +short openbao.vpn.blueora.ng` returns an overlay address **and** `dig +short openbao.vpn.blueora.ng @1.1.1.1` returns nothing
- [x] 5.5 Verify the certificate contract: `curl -sS https://openbao.vpn.blueora.ng/v1/sys/health` succeeds **without** `-k`, and the UI loads in a browser with no warning and no interstitial
- [x] 5.6 Verify stable identity across replacement: restart the data-plane pod and confirm the hostname resolves to exactly one healthy peer afterwards, with no stale peer holding the label

## 6. Cross-cluster consumption

**Results (verified live 2026-10-05). These tasks were REWRITTEN: the files they name no longer
exist.** External Secrets Operator was fully removed in `88661d67`, so there are no
`clustersecretstore-openbao*.yaml` and no ESO sidecar. The cross-cluster consumer is now Vault
Secrets Operator, configured once per cluster in `apps/platform/src/vault-secrets-operator/fleet.yaml`.

- **6.1 PASS.** Pointed the **network** target's `defaultVaultConnection.address` at
  `https://openbao.vpn.blueora.ng` (it was `https://openbao.secret.vgijssel.nl`). The
  `VaultConnection/default` on the network cluster now reports that address.
  Checked reachability BEFORE flipping it, rather than flipping and hoping: a throwaway curl pod on
  the network cluster reached `https://openbao.vpn.blueora.ng/v1/sys/health` with **no** `-k`, and
  an ordinary busybox pod resolved the name to the peer's overlay address `100.65.45.142`.
  **A finding that matters for group 9:** no mesh client is needed on the VSO pod. That is a
  *different* path from the one this plan assumed — the plan expected the consumer to carry its own
  sidecar peer identity, as ESO did. See the two blockers recorded under group 9.

  **CORRECTION 2026-10-06 — the mechanism above is wrong, and the real one is more fragile.**
  6.1 claimed "the cluster's CoreDNS forwards to the NetBird resolver and the `router`
  NBRoutingPeer carries the route". Traced properly, CoreDNS has **no `vpn.blueora.ng` server
  block at all** (its only custom entry is omada's), so mesh names fall through
  `forward . /etc/resolv.conf` → the vind node's `127.0.0.11` Docker embedded DNS → **the Mac's
  resolver**, where NetBird's scoped resolver answers. Proven by resolving the name inside the
  node container itself (`docker exec vcluster.cp.network getent ahostsv4
  openbao.vpn.blueora.ng` → `100.65.249.230`), which runs no mesh client of its own. The router
  peer resolves it by a *different* route — its own `/etc/resolv.conf` is the mesh resolver
  (`nameserver 100.65.90.33`, itself).
  So for ORDINARY pods the routing peer carries the **route** but not the **DNS**: name
  resolution is parasitic on the developer laptop's NetBird daemon. Consequences worth carrying
  forward: it breaks whenever the host sleeps (observed — see group 8a), it is why macOS
  returning only an AAAA record briefly made the service look dead while Envoy listens on
  IPv4 `0.0.0.0:443` only, and it would not hold on any non-vind cluster. The durable fix is a
  CoreDNS server block forwarding `vpn.blueora.ng` to the routing peer, which needs a stable
  address for that peer (it has no Service today, and its pod IP changes on every watchdog
  restart). Flagged for 11.3, which would otherwise "pass" only because a laptop happened to be
  awake and connected.
- **6.2 PASS, and proven by a FORCED fresh read rather than by stale state.** Simply observing
  `SYNCED/HEALTHY/READY` proves nothing here: those reconciles predate the cutover. So the VSO
  controller was restarted to force re-authentication through the new address. Result, from the
  `cloudflare-api-token` events: `SecretRotated ... sync_reason="VaultTokenRotated"` with a BRAND
  NEW `lease_id` (`cloudflare/token/cert-manager/ZJ0pp3u7LfvxtHq2sJh7OMkT`). So VSO logged in over
  the mesh with JWT, OpenBao minted a fresh leased Cloudflare token, and it landed in the Secret —
  end to end through `openbao.vpn.blueora.ng`.
  Payloads confirmed non-empty and *distinct per consumer*, which is the Cloudflare engine working
  as designed: `cert-manager/cloudflare-api-token` = `cfut_3Fs…` (53 chars),
  `external-dns/external-dns-cloudflare-api-token` = `cfut_xbx…` (a DIFFERENT token),
  `netbird/netbird-mgmt-api-key` = `nbp_7qri…`.
  Strongest check of all — the credential read over the mesh actually WORKS upstream: that token
  authenticated against `api.cloudflare.com` and resolved zone
  `b763644969bac446062ef24eef5565f0` → `success: true, name: blueora.ng`. Mesh → OpenBao →
  Cloudflare engine → minted token → live Cloudflare API, in one chain.
- **6.3 N/A as written; replaced by its actual content.** There is no ESO sidecar to be unaffected —
  `apps/network/src/eso-sidecar` is gone with ESO. The property worth asserting in its place is
  that the replacement needs no sidecar at all, which 6.1 verified. Noted as a simplification: one
  fewer mesh peer, one fewer setup key and one fewer watchdog on the network cluster than this plan
  budgeted for.

- [x] 6.1 Point the network cluster's Vault Secrets Operator `defaultVaultConnection` at `https://openbao.vpn.blueora.ng` (**rewritten** from `clustersecretstore-openbao*.yaml`, which ESO's removal deleted); verify it reports that address and authenticates after `moon run network:apply`
- [x] 6.2 Verify the secrets actually flow: the `cloudflare-api-token` and `netbird-mgmt-api-key` Secrets are populated on the network cluster from the mesh read
- [x] 6.3 Verify the cross-cluster consumer needs no mesh client of its own (**rewritten** from "the existing ESO sidecar path is unaffected" — that path no longer exists)

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
- **7.7 DONE 2026-10-05 — the blocked half now verifies.** `Certificate/jwks-network-mesh` is
  `Ready` and `Gateway/jwks-network-mesh` is `Programmed=True` with address `10.101.84.101`, after
  the shared chart's Gateway rename (defect A/B work under group 5 — the collision would have hit
  this bundle too, in namespace `netbird`). Its peer carries `jwks-network.vpn.blueora.ng`, and
  `svc-jwks-network-tcp` admits `secret-k8s` on tcp/443 only. `nc -z jwks-network.vpn.blueora.ng
  443` succeeds from the network cluster's own peer.
  Same for `mesh-omada` (7.1): `Certificate/omada-mesh` `Ready`, `Gateway/omada-mesh`
  `Programmed=True` at `10.100.250.36`, peer `omada.vpn.blueora.ng` live. So BOTH network-cluster
  exposures are serving — 7.2–7.6 remain untouched, which is the point: nothing on the live Omada
  DEVICE path has been changed.
  **Correction to this task's stated source group.** 7.7 says source `secret-k8s`, but the
  consuming peer — the `jwks-gateway` socat pod — enrolled only into `secret` (the group its
  NBRoutingPeer auto-creates), so as written the policy would have had no effective source and
  8.6 would fail. `secret-k8s` is nonetheless the right choice, because it is a real `Group` CR
  and therefore survives 9.7 deleting that routing peer, which `secret` would not. Resolved
  additively: `apps/secret/src/jwks-gateway/setupkey-jwks-gateway.yaml` now auto-joins BOTH
  groups, so the old NBResource path and the new mesh path work simultaneously (the
  "additive until step 9" rule). `autoGroups` apply at enrolment only, so the running peer gains
  `secret-k8s` when 8.1 recreates that pod; **9.7 should drop `secret` from that key.**

**Results (verified live 2026-10-05) — the device path is MIGRATED and serving on its new name.**

- **7.2 PASS, after clearing a stale server-side-apply field manager that silently wedged the
  whole bundle.** All four `netbird.io/*` annotations are gone from the live Service
  (`netbird.io/expose`, `/groups`, `/policy`, `/policy-source-groups`) and `clusterIP: 10.96.0.20`
  is unchanged in both the rendered and the live object.
  The first apply looked like it worked and did not: `moon run network:apply` reported the bundle
  `1/1` ready and Helm reached revision 30 — the new `NBResource`, `ConfigMap` and `Certificate` all
  appeared — while the Service kept its old annotations. The agent log had the real story, repeating
  every few seconds:
  `conflict occurred while applying object omada/omada ... conflict with "kubectl-client-side-apply"
  using v1: .metadata.annotations.external-dns.alpha.kubernetes.io/hostname`.
  A hand-run `kubectl apply` during the PR #996 spike had left a `kubectl-client-side-apply`
  *Update* entry in the Service's `managedFields` co-owning that annotation, and Fleet's SSA
  refuses to take a field over. Fixed by removing that one `managedFields` entry plus the
  `kubectl.kubernetes.io/last-applied-configuration` annotation it came with; the next reconcile
  applied cleanly (`appliedDeploymentID == spec.deploymentID`, zero agent errors since).
  **Worth generalising: `BundleDeployment` reported `Ready=True`/`Deployed=True`/`Monitored=True`
  throughout.** The only honest signal was `appliedDeploymentID != spec.deploymentID`. That is the
  second time in this change a Fleet/Envoy-Gateway failure has presented as healthy (see 5.2), so
  it is the field to check, not the conditions.
- **7.3 DONE.** The Service header is now a boxed NAMED EXCEPTION block that names the two
  disjoint paths (mesh peers → `omada.vpn.blueora.ng` via `../mesh-omada`, non-peer devices →
  `omada.blueora.ng` → pinned ClusterIP) and states the reason devices cannot be peers: they run
  stock TP-Link firmware with no way to install a mesh client, so they can never hold an overlay
  address, and a `100.x` address is neither stable nor publicly resolvable — hence a pinned
  ClusterIP plus a LAN static route. It also records that the absence of `netbird.io/*` annotations
  is deliberate.
- **7.4 PASS.** `dig +short omada.blueora.ng @1.1.1.1` → `10.96.0.20`. external-dns did it as a
  clean swap, not a leak: `CREATE A omada.blueora.ng` + `CREATE TXT a-omada.blueora.ng` in zone
  `b763644969bac446062ef24eef5565f0`, then `DELETE` of both halves of the old
  `omada.network.vgijssel.nl` pair in the `vgijssel.nl` zone. `domainFilters` is now
  `[blueora.ng, vgijssel.nl]`; `policy: sync` only removes records carrying a matching TXT
  ownership record, so the `blueora.ng` apex and cert-manager's transient `_acme-challenge` TXTs
  were never at risk.
  Note the old name does not go dark, it falls through to the `*.vgijssel.nl` wildcard
  (→ `eu1.netbird.services`). That is why 7.5's account-side cleanup below is not optional.
- **7.5 PASS, and it closed a live hole this task did not know about.** The working device path was
  not in git at all: `nbresource/omada-domain` (address = the public name) and a
  `coredns-custom` ConfigMap had been applied BY HAND during the PR #996 spike and would have been
  lost on any cluster rebuild. Both are now templates in the omada bundle —
  `nbresource-omada-devices.yaml` and `configmap-coredns-omada.yaml` — each with a header saying it
  exists only for non-peer devices. `NBResource/omada-devices` reports `Ready=True`, and the
  account carries the resource plus its two autogenerated policies (tcp 8043/8088/8843/29811–29817
  and udp 19810/27001/29810, source `homelab`).
  **Route verified from a real `homelab` peer rather than inferred:** the Mac (a member of
  `homelab`, alongside `pikvm`, `haos` and the iPhone) shows
  `omada-devices | omada.blueora.ng | Selected | Resolved IPs: 10.96.0.20` in `netbird routes list`,
  and all ten device TCP ports connect through it. The PiKVM's own route table could not be read
  directly — NetBird-SSH wants interactive SSO — but it carries the same resource on the same
  group, and `pikvm.vpn.blueora.ng` answers ICMP.
  `address` has to stay the PUBLIC name: NetBird installs a resource's route only when the client
  resolves the resource's own domain, which is why the cluster-local name never produced one.
  `networkID` is a generated, immutable, account-side id the CRD requires with no "network by name"
  alternative on operator `v0.7.0`, so it is hardcoded with a header pointing at
  `kubectl get nbroutingpeer router -n netbird -o jsonpath='{.status.networkID}'` as its source.
  **Account-side orphans found and partly cleaned.** Deleting a cluster CR does not always reap the
  account resource: `omada-omada`, `omada-domain` and `netbird-jwks-mirror` all existed account-side
  while their CRs reported `Ready=False / DuplicateName: Resource name already exists` — that error
  was the operator colliding with its own orphans, not a naming mistake. `omada-domain` was deleted
  (resource + both autogenerated policies) because after 7.4 it was actively harmful: its domain now
  resolves to the wildcard's NetBird-cloud public IPs, so any `homelab` client resolving it would
  install routes to `54.37.79.68`/`57.129.98.79`. `omada-omada` was deliberately LEFT: it is inert
  (a cluster-local address) and the PiKVM goss contract still asserts
  `omada.omada.svc.cluster.local`, so it belongs with 9.10/10.2 rather than here.
- **7.6 PASS on the certificate; the device-Connected half needs the Omada UI.**
  `Certificate/omada-blueora-ng` reached `Ready` in under 96 s, `secretName
  omada-blueora-ng-tls`, `subject=CN=omada.blueora.ng`, SAN exactly `["omada.blueora.ng"]`,
  issuer `C=US, O=Let's Encrypt, CN=YR2`, valid to 2027-01-03. The controller StatefulSet's
  `tls-cert` volume now points at that Secret and the pod rolled to pick it up.
  Verified over the REAL device path from the Mac, not just in-cluster:
  `curl https://omada.blueora.ng:8043/` with **no** `-k` returns `HTTP 200` with
  `ssl_verify_result=0`, and `openssl s_client` on that name shows the Let's Encrypt chain. So the
  device/LAN name has a publicly-trusted certificate that validates end to end.
  It is a SEPARATE issuance from the mesh wildcard on purpose: the wildcard covers
  `*.vpn.blueora.ng` only, and `omada.blueora.ng` must be publicly resolvable while every name
  under `vpn.blueora.ng` must not be.
  **Why the devices were never at risk from the rename** (the thing this task was most worth
  checking): devices reach the controller by IP, not by name. `apps/network/network.md` records the
  mechanism — the LAN gateway carries a static route `10.96.0.20/32 → PiKVM` and adoption is by
  Inform URL to that address — and the Omada device protocols on 29810–29817 do not use the web
  certificate on 8043 at all. The renamed record and reissued certificate are for LAN browsers and
  for the resource's route, not for the devices' control channel.
  **Still OPEN, needs the Omada UI (no controller credential exists in OpenBao — it is human-held):**
  confirming every adopted AP and switch reports Connected.

- [x] 7.1 Create `apps/network/src/mesh-omada/` (HTTPS 443 → `omada:8088`, TCP `29811-29817`, UDP `19810`/`27001`/`29810`, source `homelab`); verify `helm template` renders every declared port
- [x] 7.2 Remove the `netbird.io/expose` and `netbird.io/policy*` annotations from `apps/network/src/omada/templates/service-omada.yaml` while **keeping** the pinned ClusterIP and `external-dns` annotations; verify the rendered Service still carries `clusterIP: 10.96.0.20`
- [x] 7.3 Rewrite that Service's header comment to describe the split path (devices via ClusterIP + public record, mesh peers via the peer hostname) and mark it as the named exception; verify the comment states the reason devices cannot be peers
- [x] 7.4 Rename the device-facing record to `omada.blueora.ng` and update `apps/network/src/external-dns/values.yaml` domain filters, keeping the record unproxied; verify `dig +short omada.blueora.ng @1.1.1.1` returns the pinned ClusterIP
- [x] 7.5 Re-create the device-path exposure resource explicitly (7.2 removed the annotation the operator inferred it from), with a header noting it exists only for non-peer devices; verify the resource reports Ready and the LAN route survives
- [x] 7.6 Re-issue the device-facing certificate for `omada.blueora.ng` on `:8043`; verify every adopted AP and switch still reports Connected in the controller — **BOTH halves now verified. Certificate: Ready, `CN=omada.blueora.ng`, validates from the Mac with no `-k`. Devices: 7/7 Connected, held across a 21-minute soak with zero `Disconnected` events (see 7b). Never actually needed the UI credential — MongoDB answers it. NOTE the fleet is Connected via the OLD hostname, which 7.11 migrates**
- [x] 7.7 Create `apps/network/src/mesh-jwks/` (`name: jwks-network`, HTTPS 443 → `jwks-mirror:80`, source `secret-k8s`); verify the `Certificate` is `Ready` and the `Gateway` is `Programmed`
**7.8 is MIS-ORDERED and deferred to after 8.6 (found 2026-10-05).** It is listed in group 7 but it
is not additive: the secret cluster's `jwks-gateway` socat pod forwards to
`TCP:jwks-mirror.netbird.svc.cluster.local:80`, and that name is only routable because of the very
`netbird.io/expose` annotation 7.8 removes. Doing it here would delete the NBResource the forwarder
depends on, breaking OpenBao's `jwt-network` JWKS fetch — and therefore the network cluster's
ability to authenticate — before group 8 has re-pointed the forwarder at
`jwks-network.vpn.blueora.ng`. Group 8 must land first; 7.8 then becomes the cleanup step it was
meant to be. Re-listed at the end of group 8 below.

**Results (verified live 2026-10-05) — 7.9 PASS, with a correction to its own method.**

- **7.9 PASS on all three halves, from the Mac.**
  *Certificate:* `openssl s_client -connect omada.vpn.blueora.ng:443 -servername
  omada.vpn.blueora.ng` → `subject=CN=*.vpn.blueora.ng`, `issuer=C=US, O=Let's Encrypt, CN=YR2`,
  valid to 2027-01-03. CN is the shared wildcard rather than the service name, which is the
  expected outcome of 4b, not a mismatch.
  *TCP:* 443 and 29811–29817 all open.
  *UDP:* reachable, but NOT by the method this task specified — see below.
  *Undeclared ports refused:* tcp 8043/8088/8843 are all refused at the mesh name, which is the
  spec's port-space claim in its sharpest form: the SAME ports that are open on
  `omada.blueora.ng` (the device path) are closed on `omada.vpn.blueora.ng`, because the two names
  are different peers with independent port spaces.
- **`nc -zu` CANNOT test UDP and must not be used in 11.4.** The task's
  `nc -zu omada.vpn.blueora.ng 29810` check is vacuous. With `-G` it reports failure for every UDP
  port including working ones; without `-G` it reports **success unconditionally** — proven with two
  controls: `nc -zu … 9999` (a port nothing declares) reports open, and `nc -zu
  openbao.vpn.blueora.ng 19810` (a peer with no UDP listener at all) also reports open. UDP has no
  handshake, so there is nothing for `nc` to observe.
  *Replaced with evidence from the receiving end, which is stronger:* Envoy's admin interface on the
  data-plane pod reports `udp.service.downstream_sess_total: 3` and
  `udp.service.downstream_sess_rx_datagrams: 12` after the probes — i.e. the datagrams sent from the
  Mac actually traversed the overlay and arrived, on exactly 3 sessions for exactly the 3 declared
  UDP ports. `/listeners` confirms Envoy is bound to precisely the 11 declared sockets —
  `443`, `29811`–`29817`, `19810`, `27001`, `29810` — with no `9999`, and **no `10443`/`10080`**,
  which is the live confirmation of the port-shift decision that until now had only been checked in
  rendered output.
- **7.10 FAILS, and the risk 7.1 flagged is the cause — confirmed without needing the UI login.**
  `curl -sSI https://omada.vpn.blueora.ng/` returns `302` with
  `location: https://omada.vpn.blueora.ng:8043/` — an ABSOLUTE redirect carrying the controller's
  own HTTPS port. `:8043` is not a declared listener on the mesh peer, so following the redirect
  dead-ends (`Failed to connect to omada.vpn.blueora.ng port 8043`). The TLS on `:443` itself is
  fine (`ssl_verify_result=0`, the mesh wildcard), so this is purely the redirect target.
  **The fallback 7.1 pre-authorised turns out to violate a spec scenario**, which is why this is a
  decision rather than a fix: a `protocol: TLS` passthrough on `:8043` would serve the
  CONTROLLER's certificate, which after 7.6 is `CN=omada.blueora.ng` — a name mismatch against
  `omada.vpn.blueora.ng`, breaking "Client validates the certificate with no override".
  Three real options, with `BackendTLSPolicy` confirmed present on the cluster
  (`backendtlspolicies.gateway.networking.k8s.io`, plus Envoy Gateway's own `Backend`):
  | option | result | cost |
  |---|---|---|
  | **A** re-point the `:443` HTTPS listener at the controller's `:8043` and re-encrypt to the backend via `BackendTLSPolicy` (validating `omada.blueora.ng` against system roots) | one port, mesh certificate, NO redirect at all — the controller sees HTTPS on its HTTPS port so it never emits one | a new `BackendTLSPolicy` knob in the shared chart; couples the mesh path to the device certificate's name |
  | **B** add an HTTPS listener on `:8043` too, terminating the mesh wildcard, forwarding to the controller's `:8043` | redirect target works, certificate valid | the UI lives on a second port; two listeners for one UI |
  | **C** `protocol: TLS` passthrough on `:8043` (the original fallback) | redirect target connects | **serves `CN=omada.blueora.ng` on `omada.vpn.blueora.ng` — fails the certificate-validation requirement.** Not recommended |
  Everything else about the Omada mesh exposure is verified (7.9); this is the last gap, and
  "all devices still report Connected" additionally needs the UI login (see 7.6).

- **7.10 RESOLVED 2026-10-06 — option A chosen with the maintainer and verified live.** The chart
  gained an opt-in `listeners[].backend.tls` block (`hostname`, `caCertificates`, `portName`)
  rendering a `BackendTLSPolicy`, and `mesh-omada`'s HTTPS listener now targets the controller's
  own `:8043` and re-encrypts to it, validating `omada.blueora.ng` against the public root store.
  From inside the mesh: `https://omada.vpn.blueora.ng/` → **`HTTP/1.1 200 OK`** returning the
  Omada UI HTML with TP-Link's CSP headers and **no `Location` header at all**. One port, the mesh
  wildcard certificate, no redirect, no interstitial. `BackendTLSPolicy/omada-https` reports
  `Accepted=True` + `ResolvedRefs=True`.
  There is deliberately **no skip-verify knob**: `validation.hostname` is required by the CRD and
  Envoy checks the backend's certificate against it, so the last leg is authenticated rather than
  merely encrypted. Opt-in verified both ways — `mesh-openbao`, which declares no `backend.tls`,
  renders zero `BackendTLSPolicy` objects and keeps forwarding plain HTTP to `openbao:8200`.
  **Two traps found while building it, both now fail-fast or documented:**
  1. **`targetRefs.sectionName` must be the Service's port NAME, not its number.** Gateway API
     defines it as "Service: Port name". With `sectionName: "8043"` the policy rendered fine,
     attached to nothing, and Envoy Gateway wrote **no status condition whatsoever** — the only
     evidence was `transport_socket: NONE (plaintext)` on the upstream cluster in `/config_dump`,
     i.e. Envoy sending plaintext at a TLS-only port, so every request hung. Hence the explicit
     `portName` knob (the chart knows the number and cannot derive the name, which lives on a
     Service it does not own) plus a `fail` that prints the exact `kubectl` query to find it.
  2. **The policy must be port-scoped, not Service-scoped.** Omitting `sectionName` targets the
     whole Service, which for Omada — one HTTPS port beside ten raw TCP device ports fronted by
     TCPRoutes — would try to wrap the raw device ports in TLS and break them.
  Also: the shared chart's normalising `mesh-service.listeners` helper silently DROPPED the new
  `backend.tls` key until it was taught to copy it through. Anything that helper does not copy is
  invisible to every template downstream — worth knowing before adding the next knob.
  Still OPEN: "all devices still report Connected", which needs the Omada UI login (see 7.6).

- [x] 7.9 Verify the port-space contract from the Mac: `openssl s_client -connect omada.vpn.blueora.ng:443 -servername omada.vpn.blueora.ng` shows the expected issuer and CN, `nc -z omada.vpn.blueora.ng 29811` succeeds, and `nc -zu omada.vpn.blueora.ng 29810` succeeds — **UDP half verified via Envoy's receive-side stats instead; `nc -zu` is a vacuous test (see above)**
- [x] 7.10 Verify the Omada UI loads over the mesh with no certificate warning and all devices still Connected — **BOTH halves verified. UI over mesh: `HTTP/1.1 200 OK`, mesh wildcard certificate, no redirect, no interstitial. Devices: 7/7 Connected after the DNS fix in 7b**
- [x] 7.11 ~~Migrate the adopted devices off the old inform hostname onto `omada.blueora.ng`~~ — **SUPERSEDED 2026-10-06 by 12.7.** Not done and deliberately not doing: the target name is being retired rather than migrated to. The fleet moves straight to `omada.vpn.blueora.ng`, so re-homing it twice would mean two fleet-wide inform migrations for no gain. The finding that made this task look permanently blocked still stands and is worth keeping: unlike 7.6/7.10 there is **no MongoDB side-channel** for the controller hostname — it is in neither the database nor the controller's filesystem, and no Omada account sits in OpenBao's kv (see 11a), so the UI step is genuine and has simply moved to 12.7
- [x] 7.12 ~~Retire `omada.network.vgijssel.nl` alone~~ — **SUPERSEDED 2026-10-06 by 12.9**, which retires BOTH legacy names in one step and removes the annotation outright rather than editing it down to one entry

## 7b. The device path was DEAD for 22 hours, and the UI credential was never what blocked checking it (added 2026-10-06)

Found while establishing a safety net for 11.3, not by looking for it. Taking a MongoDB dump of
the Omada controller — needed because a network-cluster cold start destroys it — meant reading
`omada.device`, and that collection answers the exact question 7.6 and 7.10 had been carrying as
"BLOCKED on Omada UI access (human-held credential)" since 2026-10-05.

**The method, which is the reusable part.** Omada's controller state is just MongoDB. The
`omada.device` collection holds one document per adopted device with `last_seen`,
`disconnect_time` and `health_score`, and `omada.deviceevent_<isoweek>` holds the connect/
disconnect log with a `reason`. Credentials come from `internal-mongodb-users`
(`MONGODB_DATABASE_ADMIN_{USER,PASSWORD}`) in the `mongodb` namespace — **no controller login
anywhere in the path**. Timestamps in `deviceevent` are BSON Longs split into `{high, low}`;
`new Date(high * 4294967296 + low)` decodes them (`$toLong` and `new Date(e.timestamp)` both
throw `RangeError: Invalid time value` on this schema, which is what made it look unreadable).
So "every adopted AP and switch reports Connected" was always verifiable without the UI. Two
tasks sat blocked on a credential that was never on the critical path.

**What it reported.** All 7 devices — `hallway-gateway` (ER605), `hallway-switch`,
`living-room-switch`, `garage-switch`, `garden-house-ap`, `living-room-ap`, `attic-ap` — logged
`Disconnected : Inform timeout` within 20 seconds of each other at **2026-10-05 14:23 UTC** and
none had reconnected 22 h later (`health_score: -1`, `last_seen == disconnect_time`). The
controller had **zero** attached devices for that entire window. The LAN itself kept working —
these devices forward independently of the controller, which is exactly why nothing surfaced it.

**Root cause: the device path needs a HOST resource and 7.5 gave it a DOMAIN resource.** The
`omada-devices` NBResource created by 7.5 is 22 h old — the same minute the devices dropped — and
it replaced the cluster-local resources that preceded it (`omada-domain` deleted deliberately,
`omada-omada` since reaped; the account now showed exactly one resource for this network). Its
`address` was `omada.blueora.ng`, and **a domain resource's route is installed on a client only
after that client resolves the domain through NetBird's own resolver.** Verified live from the
Mac: resolving `omada.blueora.ng` through `@100.65.255.254` makes `route -n get 10.96.0.20`
report `interface: utun100`. But the devices send *unsolicited* inform packets straight to
`10.96.0.20` and nothing ever makes the **PiKVM** — the peer that forwards for them — resolve
any name, so the `/32` was never installed and every packet died at the forwarder. Nothing
advertised the pinned ClusterIP as an address any more.

The file's own header had argued for the public name, citing the omada-resolution spike's finding
that `omada.omada.svc.cluster.local` "never produced a route on the PiKVM". That finding was
real; the conclusion did not follow. The spike showed a *cluster-local domain* cannot be resolved
by an off-cluster peer — an argument against a DOMAIN resource, not for a different domain. A
host resource has no DNS precondition at all, and the ClusterIP is pinned precisely so it can be
addressed literally.

**Fix + what it proved.** `address: 10.96.0.20/32`. The account-side resource flipped to
`type=host`, and `living-room-switch` logged **`Adopt success` at 12:29:17 UTC**, ~90 seconds
after the apply — on its own, with no device-side action. That is the mechanism confirmed: route
restored, inform delivered, device re-adopted.

**STILL OPEN, and honestly: the fix is necessary but not sufficient.** That device stopped
informing again after ~3 minutes and the other six never returned. Everything observable from
this side is healthy and stable, which is what isolates the remaining fault:
- From the Mac — a `homelab` peer admitted by the *same* policy as the PiKVM — `10.96.0.20:29814`
  is open on three probes 20 s apart, and `8088` too.
- `NBResource/omada-devices` is `Ready`, `type=host`, policy `omada-devices` ← `homelab`.
- The `router` routing peer has been up 3 h 36 m with **0 restarts**, so the route is not flapping
  from the serving side.
- The `pikvm` peer is `connected=true`, `login_expired=false`, in groups `homelab` + `All`.
So the surviving suspect is PiKVM-side forwarding: whether the `/32` is actually in its routing
table, and whether `setup-netbird-routing.sh`'s IPv4-forward + `-o wt0` SNAT rule is still in
place (NetBird rebuilds the nat table on start, and that unit is `Wants=`, not `Requires=`).
**Diagnosing that needs a shell on the PiKVM, which this session cannot get**: NetBird's own SSH
server owns port 22 there (`allow_server_ssh=True`) and demands an interactive browser SSO, so
both `ssh root@100.65.192.152` and the `netbird ssh proxy` path stop at
"Please do the SSO login in your browser".

**PiKVM shell data, supplied by the maintainer 2026-10-06 — the route is THERE, so forwarding is
NOT the fault.** `ip route get 10.96.0.20` → `10.96.0.20 dev wt0 table 7120 src 100.65.192.152`.
The host-resource fix reached the client. Three further findings from the same output:

1. **I called the goss contract's 11 failures a stale-contract artefact. THAT WAS WRONG, and it
   was the single most expensive misread of this whole investigation.** They were a TRUE
   POSITIVE. The deployed contract asserts `omada.network.vgijssel.nl`, and that name genuinely
   has to be reachable — see the ROOT CAUSE below. The health check was reporting the production
   outage accurately; I dismissed it because git had already been updated to the new name, and
   treated the divergence as the box being behind rather than as the contract knowing something
   the rename had overlooked. The counters even dated it exactly (**~4 491 passes vs ~11 240
   fails** per check: passing until the rename, failing on every run since). Lesson, and the
   reason this is written out rather than quietly corrected: when a health contract and a
   just-changed config disagree, the contract is a witness, not a straggler.
2. ~~HYPOTHESIS: the goss DNS probe was load-bearing because it kept a DOMAIN resource's route
   alive.~~ **Wrong, and superseded by the real cause.** It was the right instinct — a DNS probe
   mattering to production — pointed at the wrong mechanism. The devices depend on that name
   directly; nothing about keeping a NetBird route warm was involved.
3. **The controller is healthy and the devices' silence is not a controller fault.** `server.log`
   shows live Omada **Cloud Access** traffic (`proxyServer getConnectionStatus CONNECTED`,
   `origin-request-user-ip: 178.226.150.113`), and for the re-adopted switch exactly ONE line —
   `MANAGED_BY_OWN Device 5C-E9-31-A7-BF-88 ... is discovered` at 12:29:10 UTC — and nothing
   after. Its `last_seen` has not advanced since that moment either, and `health_score` went
   `-1 → 10`. So a single discovery packet completed the whole path and no management session
   followed, which is a different shape of failure from "no route".

**PiKVM read-only session 2026-10-06 — the box is CORRECT and my forwarding suspicion was wrong.**
Every candidate listed above is eliminated:
- `ip route get 10.96.0.20 from 192.168.0.104 iif eth0` → `dev wt0 table 7120`. The policy-routing
  worry was unfounded: rule `110: not from all fwmark 0x1bd00 lookup 7120` matches forwarded
  traffic too, so a device packet routes exactly like the shell's own probe.
- `net.ipv4.ip_forward = 1`; `FORWARD` policy ACCEPT.
- **The `iptables` MASQUERADE counter reading 0 is a red herring, and would have been easy to
  over-read.** `iptables` on this box is the `nf_tables` shim (`v1.8.13 (nf_tables)`) and NetBird
  installs its OWN nat chain at a HIGHER priority — `netbird-rt-postrouting`, `srcnat - 1` vs the
  iptables table's `srcnat`. `masquerade` is terminal for the hook, so NetBird's rule
  (`meta mark 0x0001bd22 oifname "wt0" masquerade`, fed by `netbird-mangle-prerouting` marking
  `ct state new ip saddr 192.168.0.0/24`) consumes the packet and `setup-netbird-routing.sh`'s
  rule is simply never reached. Its zero counter says nothing about traffic; NetBird's counter is
  the one to read. Both cover the device subnet, so the SNAT is in place twice over.

**What is actually true: the devices are SILENT, and the path works when used.**
- NetBird's LAN→mesh counter is frozen at **3 packets / 742 bytes** (~247 B each) across a 75 s
  sample, and `/proc/net/nf_conntrack` holds **no** entry for `10.96.0.20` and **none at all**
  with `src=192.168.0.x`. So there is neither a new attempt nor an established flow.
- Those 3 packets are almost certainly the single 12:29 discovery (NetBird rebuilds these chains
  on a route change, so the counters date from the 12:28 apply). In the ~70 minutes after it,
  seven devices produced **zero** further attempts.
- **The 12:29 discovery is the load-bearing evidence**: for the controller to log
  `MANAGED_BY_OWN ... is discovered`, that packet crossed the ER605's static route, the PiKVM,
  the mesh and the routing peer. So the gateway's `10.96.0.20/32 → PiKVM` static route is
  **intact** — which retires the "gateway lost its pushed config" theory from the previous
  section, and with it the feared controller/gateway deadlock.
- All 7 devices answer `ping` from the PiKVM (`192.168.0.1`, `.104`, `.107`, `.108`, `.109`,
  `.113`, `.116` — ALIVE). They are powered and on the LAN; they are not trying to inform.

**So the host-resource fix is correct and necessary, and it is not sufficient on its own** — the
missing piece turned out to be DNS, not a device-side nudge. (My reading at this point was that
the devices needed a power-cycle; that was wrong, and rested on the `last_seen` trap documented
below. Once the old name resolved again they recovered on their own in 90 seconds.)

### ROOT CAUSE, established 2026-10-06 by the maintainer and then proven live: DNS, not routing

**The adopted devices hold `omada.network.vgijssel.nl` as their inform hostname.** A device
re-homes only when the controller pushes it a new Controller Hostname/IP, so until that push
happens the OLD name is the only address they will ever dial. Task 7.4 renamed the device record
to `omada.blueora.ng`, and the `*.vgijssel.nl` wildcard that would otherwise have covered the old
name had already gone with the reverse-proxy stack — so at 14:23 the name stopped resolving
anywhere (`dig omada.network.vgijssel.nl @1.1.1.1` → empty, confirmed) and all 7 devices timed
out within 20 seconds of each other. They were powered, on the LAN and pingable the entire time;
they simply could not resolve their controller. That also explains the shape nothing else did:
`Adopt success` for all 7 at 14:15–14:16, then `Inform timeout` for all 7 at 14:23 — a resolution
failure hitting a whole fleet simultaneously, not a routing change degrading one hop.

**Fix: publish BOTH names from the Service's external-dns annotation** (`omada.blueora.ng,
omada.network.vgijssel.nl`). This needed no new machinery — external-dns's `domainFilters`
already listed both `blueora.ng` and `vgijssel.nl` — and no second certificate, because the
device protocols on 29810-29817 do not use the `:8043` web certificate. **The host-resource
change above is what makes two names possible at all:** the route is now keyed on
`10.96.0.20/32`, so it carries whichever hostname a device dials, where a domain resource would
have needed one resource per name.

**Verified live.** external-dns created the A + TXT at 13:43:10; the name resolved `10.96.0.20`
on both `1.1.1.1` and `8.8.8.8`; and **6 of the 7 devices logged `Adopt success` between
13:44:29 and 13:45:40 — within 90 seconds, with no device-side action.** `attic-ap` reported full
telemetry (`status: 14`, uptime, CPU/mem) over the cloud status channel, i.e. a real management
session rather than a bare handshake. All 7 then showed `last_seen > disconnect_time` and **zero
`Disconnected` events after the restore**.

**A measurement trap that produced two wrong readings before it was caught — worth more than the
fix itself.** `device.last_seen` is written on **adopt/disconnect only, NOT on each inform
heartbeat**. Polling "last_seen younger than 5 minutes" therefore measures *recently adopted*,
not *currently connected*: after the recovery all seven ages climbed in lockstep
(266 s → 337 s → 409 s) while every device was healthy. The same artefact is what made
`living-room-switch` look like it had "adopted at 12:29 then gone silent" — its `last_seen` was
simply frozen at its adopt, exactly like the others. **Use `last_seen > disconnect_time` plus the
absence of fresh `Disconnected` events** as the liveness signal; the controller declares an
inform timeout within ~8 minutes (14:15 adopt → 14:23 disconnect on Oct 5), so a soak longer
than that is what makes "Connected" credible.

**Migration still to do — the two-name state is transitional, not the end state.** In the
controller: set Controller Hostname/IP to `omada.blueora.ng` so the push re-homes the fleet, then
confirm every device is Connected on the new target, then remove `omada.network.vgijssel.nl` from
the annotation and re-apply (external-dns runs `policy: sync`, so deleting the name withdraws the
record) and re-verify — including across a device power-cycle. The removal criteria are written
into the annotation's own comment so they travel with the code. Until that is done, **7.4 is only
half-complete**: the new record exists but the fleet still depends on the old one.

**Worth keeping regardless of how the devices recover:** `network.md:124` already warns that
"PiKVM reservation is required — `eth0` is DHCP, but the Omada static route next-hop … need a
predictable address", and the static-route table at `network.md:134` lists the next hop as the
PiKVM's VLAN 10 reservation. Live, `eth0` is **`192.168.0.123` by DHCP** (`proto dhcp`) with the
VLAN 10 static address `192.168.10.2` present but not the route target while the devices remain
on the flat `192.168.0.0/24`. The documented reservation is the thing standing between this path
and a silent repeat the next time that lease moves.

## 8a. Defect found 2026-10-06 — THE WATCHDOG WAS A NO-OP, and it cost all three services

Not a planned task. Recorded here because it invalidates the live verification of task 4.9 and
because the spec requirement "Recovery from a wedged mesh client" was unmet in practice.

**What happened.** The host slept overnight. All three mesh enrolment keys are `ephemeral: true`,
so when their peers stayed offline past NetBird's offline timeout the account **reaped all three** —
`openbao.vpn.blueora.ng`, `omada.vpn.blueora.ng` and `jwks-network.vpn.blueora.ng` vanished from
the account while their Envoy pods sat `3/3 Running` with `RESTARTS 0`. Every sidecar reported
`Daemon status: SessionExpired`. Three watchdog CronJobs completed cleanly every five minutes
throughout and did nothing.

**Root cause: a seam, not a bug in either half.** The watchdog finds the generated Envoy Deployment
by `gateway.envoyproxy.io/owning-gateway-name`, and it built that selector from `.Values.name`
(`openbao`) instead of the Gateway's actual name (`openbao-mesh`). The 5.2 fix that renamed the
Gateway to `<name>-mesh` updated the Gateway and its routes but not this selector. The selector
then matched nothing, the script took its "no Envoy deployment yet; skipping this cycle" branch,
and **exited 0 forever**. Task 4.9 was verified by dry-running the detection grep against sample
output — the grep was always correct; the lookup that feeds it was never exercised against a live
cluster. Both halves were tested, the join between them was not.

**Consequences, in order:** the three services' hostnames stopped resolving → the network cluster's
`VaultConnection/default` failed its ping to `https://openbao.vpn.blueora.ng` → **seven**
BundleDeployments went NotReady in a dependency cascade (`platform-vault-secrets-operator` at the
root, then `platform-config`, `network-cloudflare-config`, `network-mongodb`, `network-omada`,
`network-mesh-omada`, `network-mesh-jwks`) → and because `mesh-omada`/`mesh-jwks` were
dependency-blocked, they could not even receive the fix that would have healed them. A watchdog
failing silently is strictly worse than no watchdog: it converted a transient host sleep into a
wedged cluster.

**Fixed and verified end to end:**
- Selector now comes from the `mesh-service.gatewayName` helper. Rendered output confirms
  `gw=openbao-mesh` / `gw=omada-mesh` / `gw=jwks-network-mesh`.
- Run on demand against the three dead services, each logged
  `mesh client session is dead -> kubectl rollout restart deployment.apps/<name>-mesh` and rolled it.
- All three peers re-enrolled and re-claimed their labels: `openbao` `100.65.249.230`,
  `jwks-network` `100.65.144.167`, `omada` `100.65.122.15`, all `connected: true` and in their
  correct `svc-*` groups.
- Verified from inside the mesh (the network cluster's router peer, not the Mac): 443 open on all
  three, `https://openbao.vpn.blueora.ng/v1/sys/health` returns the unsealed JSON,
  `https://omada.vpn.blueora.ng/` returns 200, and
  `https://jwks-network.vpn.blueora.ng/openid/v1/jwks` returns the real key material — all with
  wget's default certificate validation on.
- The VSO cascade then cleared on its own: `VaultConnection/default` → `Healthy`/`Ready`, and
  **every** BundleDeployment on the network cluster back to `Ready`.
- The "skipping this cycle" branch now says which selector it tried and warns that a persistent
  skip means the selector is wrong — the ambiguity between "not created yet" and "will never
  match" is what hid this.

**A second trap this exposed: `fleet apply` REUSES a stale `charts/*.tgz`.** The fix reached
`mesh-openbao` immediately but not `mesh-omada`/`mesh-jwks`, because those umbrellas had a
previously-built subchart tarball on disk and the `file://` dependency was not rebuilt — the
version pin (`1.0.0`) had not changed, so nothing invalidated it. Editing the shared chart
therefore requires `rm -rf <umbrella>/charts <umbrella>/Chart.lock` before applying, or the
umbrella silently deploys the OLD shared chart. Both `charts/` and `Chart.lock` are gitignored
under `apps/*/src`, so there is no committed signal that they are stale. Related to, but distinct
from, the pin-drift problem `moon run :fleet_build` already guards.

**A third thing the field-manager cleanup unblocked, and a new operator limitation behind it.**
7.7 recorded that the jwks-gateway peer "gains `secret-k8s` when 8.1 recreates that pod". It did
not — the stale `kubectl-client-side-apply` manager on `SetupKey/jwks-gateway` had been blocking
Fleet from applying that very `autoGroups` change since it was authored, so 8.1 recreated the pod
against a setup key that still had only `secret`. Clearing the manager let the change through; the
peer was recreated and now carries `['secret-k8s', 'secret', 'All']`, so `svc-jwks-network-tcp`
(source `secret-k8s`) genuinely covers its consumer instead of relying on `Default` — the same
class of gap as 9.A, closed for the JWKS leg.
*Two mechanics worth keeping:* a **bare Pod** deleted out of a Fleet bundle is NOT recreated by
`fleet apply` (Helm restores resources on upgrade, and nothing in the release changed) — deleting
the `BundleDeployment` is what forces the redeploy. And `autoGroups` apply at enrolment only, so
the pod must be recreated AFTER the key is correct, not before.

**NEW LIMITATION — operator `v0.7.0` never updates `status.observedGeneration` on an EDITED CR, so
Fleet marks the bundle NotReady forever.** `SetupKey/jwks-gateway` sits at `generation 2,
observedGeneration 1` with a `Ready=True` condition dated 2026-07-26, and the bundle reports
`Ready=False — SetupKey generation is 2, but latest observed generation is 1`. The desired state
IS applied to NetBird (the peer demonstrably picked up `secret-k8s`), and restarting the operator
does not clear it: the controller writes that status on create and not on update. Surveyed every
`netbird.io` CR on both clusters — this is the only one lagging, because it is the only one whose
spec has been edited since creation.
Cosmetic today, because nothing `dependsOn` the jwks-gateway bundle. **But it is a live hazard for
the rest of this change:** any bundle holding a netbird.io CR whose spec is ever edited becomes
permanently NotReady, and under `dependsOn` that blocks every dependent bundle — exactly the
cascade shape that took seven bundles down in 8a. Group 9 edits several of these (9.7 drops
`secret` from this same key). Options when it bites: avoid in-place spec edits of netbird CRs
(recreate instead), or keep such CRs out of bundles that others depend on.

### 8a.5 — ROOT-CAUSED IN UPSTREAM SOURCE AND FIXED 2026-10-06 (added; was "NEW LIMITATION" above)

The diagnosis above was right about the symptom and wrong about the mechanism, which matters
because the wrong mechanism ("writes status on create, not on update") has no cheap remedy while
the real one does. Read `internal/controller/setupkey_controller.go` at tag `v0.7.0`:

```go
ok, err := func() (bool, error) { ... r.Netbird.SetupKeys.Update(ctx, id, {AutoGroups: ...}); return true, nil }()
if ok { return ctrl.Result{RequeueAfter: 15 * time.Minute}, nil }   // <-- early return
...
conditions.MarkTrue(...); sp.Patch(ctx, setupKey, patch.WithStatusObservedGeneration{})  // never reached
```

The closure named "check if setup key is up to date" **performs the `auto_groups` PUT itself** and
returns `true`, so Reconcile takes the early return and never reaches the one
`WithStatusObservedGeneration{}` patch at the bottom. `status.observedGeneration` is therefore
written **only on the create/recreate path**. That explains both halves of what was observed: the
desired state really is live in NetBird, and no amount of reconciling or operator-restarting fixes
the status.

**The remedy follows directly from the root cause — force the create path.** The same closure
returns `false` (→ recreate) when the derived Secret `setup-key-<name>` is missing, so:

```
kubectl -n netbird delete secret setup-key-jwks-gateway
```

mints a fresh account-side key, rewrites the Secret, deletes the old key, and patches
`observedGeneration`. **Verified twice, on two different generations:** `gen 2 → obsGen 1` became
`obsGen 2` in under 20 s and the BundleDeployment flipped `Ready=True`; then 9.7's edit took it to
`gen 3 / obsGen 2` and the same step produced `obsGen 3`. No status hand-patching, no CR deletion,
and harmless to the running peer — a setup key is only read at enrolment.

It also composes with what 9.7 needed anyway: `autoGroups` apply at ENROLMENT ONLY, so the pod has
to be recreated regardless for a group change to reach the peer. One procedure covers both.

**Durability, stated honestly.** This is not self-healing — it is a documented remedy, recorded in
a boxed header on `setupkey-jwks-gateway.yaml` itself (with the upstream file and the exact
command) rather than in tribal memory. Deliberate, for two reasons. A cold start never hits the
bug at all: a fresh CR is created at generation 1 and the create path writes `observedGeneration 1`,
so **11.3 is unaffected**. And the trigger is narrow — an in-place spec edit of a SetupKey whose
account-side key does not need recreating. `Group` has only one return path and always patches
(`group_controller.go`), and the shared mesh-service chart's SetupKey spec is effectively static
(name, ephemeral, allowExtraDnsLabels, one localRef). A self-healing CronJob was considered and
rejected as machinery out of proportion to a once-per-migration event.
*Not reported upstream* — worth filing, and flagged as a follow-up rather than done.

- [x] 8a.1 Fix the watchdog's Deployment selector to use the Gateway name, not the service name; verify a dry run against a genuinely wedged client restarts the data plane
- [x] 8a.2 Recover the three reaped peers and confirm each re-claims its DNS label with exactly one connected peer
- [x] 8a.3 Confirm the dependent-bundle cascade clears without manual intervention once resolution returns
- [x] 8a.4 Get the jwks-gateway peer into `secret-k8s` so its access policy is not masked by `Default`; verify the peer's groups and a fresh cross-cluster login
- [x] 8a.5 (added) Root-cause and fix the permanent `NotReady` on the jwks-gateway bundle; verify `observedGeneration` catches up and the BundleDeployment reports Ready

## 8. Re-point OpenBao's JWKS path

**Results (verified live 2026-10-05) — the JWKS leg now runs over validated end-to-end TLS.**

- **8.1 PASS.** `pod-jwks-gateway.yaml` is now `TCP-LISTEN:443,fork,reuseaddr` →
  `TCP:jwks-network.vpn.blueora.ng:443`, `containerPort: 443`, and **no `resolv-conf`
  volumeMount** (that volume does not exist on operator `v0.7.0` and a mount for it wedges the
  pod). Pod `2/2 Running` — socat plus the injected netbird sidecar. Its mesh client resolves the
  target: inside the socat container `/etc/resolv.conf` points at the mesh resolver
  (`nameserver 100.65.54.37`, `search vpn.blueora.ng …`) and `nslookup
  jwks-network.vpn.blueora.ng` → `100.65.246.20`, the publishing peer.
  The Pod had to be DELETED rather than patched — a running Pod's container args are immutable, so
  an in-place apply cannot re-point it. That deletion is also what finally gave the peer its
  `secret-k8s` group, exactly as 7.7 predicted (`autoGroups` apply at enrolment only).
- **8.2 PASS.** Service is `443 → 443`, `clusterIP: 10.96.0.21` — the low static band of the
  10.96.0.0/12 CIDR, where only `10.96.0.1` was taken (the network cluster pins Omada at `.20` by
  the same convention). It matches 8.3's override by construction, and both headers name the other
  file. `clusterIP` is immutable, so this Service also had to be deleted and recreated rather than
  patched.
  443→443 with no translation is required, not tidy: the relay is raw TCP and the certificate is
  valid only for the mesh hostname, so there is nowhere in the path to absorb a port shift.
- **8.3 PASS, measured in BOTH directions** — which is the only way this check means anything:
  * from an ordinary pod (cluster DNS → CoreDNS `10.97.124.163`):
    `jwks-network.vpn.blueora.ng` → **`10.96.0.21`**, the forwarder;
  * from the socat pod (mesh resolver): the same name → **`100.65.246.20`**, the peer.
  Used the `hosts` plugin rather than omada's `rewrite`, because here the target is an address this
  repo pins deliberately, so naming it directly keeps the two sides checkable against each other.
  *The asymmetry is what makes the relay loop-free, and it is not luck:* the mesh resolver is
  AUTHORITATIVE for `vpn.blueora.ng`, and the forwarder pod is the one pod whose `/etc/resolv.conf`
  the sidecar has rewritten — so the forwarder can never resolve its own ClusterIP and relay to
  itself.
- **8.4 DONE.** The override carries a boxed header stating the property explicitly: both horizons
  terminate at the SAME certificate for the SAME name, because the thing behind the ClusterIP is a
  raw-TCP relay that never terminates TLS — which is *why* no `jwksCaPem`, no `tls_skip_verify` and
  no certificate of its own are needed. It also records the inverse, which is the part a future
  reader would otherwise break: turning the relay into an HTTP proxy, or terminating TLS in it,
  would make the two horizons end at different certificates and force verification off.
- **8.5 PASS, after clearing the same stale field manager that bit 7.2** (see below).
  `bao read auth/jwt-network/config` →
  `jwks_url = https://jwks-network.vpn.blueora.ng/openid/v1/jwks`, `bound_issuer` unchanged,
  `jwks_ca_pem` **empty**, `jwt_validation_pubkeys` empty, `status: valid`. So the HTTPS URL is
  live AND nothing was added to make it trust a private CA — it validates against the public root
  store, which is the whole point of the change. The MR reports
  `Synced/ReconcileSuccess` with `atProvider.jwksUrl` matching spec.
  Previously this leg was `http://jwks-gateway.netbird.svc.cluster.local/openid/v1/jwks` — plain
  HTTP, because the old relay could not preserve the hostname the certificate was issued for.
- **8.6 PASS, proven by a measured fetch rather than by a login that might have used a cache.**
  A login alone is weak evidence: OpenBao caches the keyset, so a success could predate the
  cutover. So the fetch itself was counted at the far end. On the network cluster's
  `jwks-network-mesh` Envoy, `cluster.httproute/netbird/jwks-network-https/rule/0.upstream_rq_200`
  went **5 → 7** across one controlled cycle: rewrite the auth config (invalidating the cached
  keyset) → mint a FRESH service-account token on the network cluster
  (`kubectl create token vault-secrets-operator -n omada --audience openbao`) → present it to
  `auth/jwt-network/login`. Login returned `role=network-vso`,
  `policies=[default, vault-secrets-operator]`. So OpenBao really did pull the JWKS across the new
  path and validate an RS256 signature with it.
  Independently, the real consumer still works end to end: the network cluster's VSO controller was
  restarted to force re-authentication, and all **12** `VaultDynamicSecret`/`VaultStaticSecret`
  objects returned `Synced`, with `cloudflare-api-token` logging
  `SecretRotated … sync_reason="VaultTokenRotated"` against a brand-new lease
  (`cloudflare/token/cert-manager/s4xf20FTSWzFCz1i2WW1eIoV`). Full chain in one go: network VSO →
  JWT login at `openbao.vpn.blueora.ng` → OpenBao validating via `jwks-network.vpn.blueora.ng` →
  Cloudflare engine minting a token.
  *Honest note on one probe:* `curl` from a throwaway pod to
  `https://jwks-network.vpn.blueora.ng/openid/v1/jwks` returned `HTTP=200`,
  `ssl_verify_result=0` and the real key material — a clean demonstration of the spec's "non-peer
  consumer reaches a mesh service over HTTPS", though it proves the PATH rather than OpenBao's use
  of it, which is what the counter above is for.

### A RECURRING TRAP, found twice in one session and now swept (2026-10-05)

Both 7.2 and 8.5 failed identically, and the failure is invisible from `kubectl get`:

```
failed deploying bundle: conflict occurred while applying object … :
Apply failed with N conflicts: conflicts with "kubectl-client-side-apply" using …
```

A hand-run `kubectl apply` during an earlier spike leaves a `kubectl-client-side-apply` **Update**
entry in the object's `managedFields` co-owning the fields it set. Fleet applies server-side and
**refuses to take an owned field over**, so every reconcile fails on that one object — while
`Bundle`/`BundleDeployment` keep reporting `Ready=True`, `Deployed=True`, `Monitored=True`, and
Helm keeps bumping its revision because the OTHER resources in the bundle apply fine. The repo's
own `omada` Service sat three days in this state.

- **The only trustworthy signal is `status.appliedDeploymentID != spec.deploymentID`** on the
  `BundleDeployment`. The conditions lie. (Same lesson as 5.2's Gateway-name collision, reached by
  a different route — so "conditions are green" is not evidence anywhere in this change.)
- **Fix:** remove that one `managedFields` entry plus the
  `kubectl.kubernetes.io/last-applied-configuration` annotation it travels with. The next reconcile
  applies cleanly.
- **Swept both clusters** for objects co-owned by `fleetagent (Apply)` AND
  `kubectl-client-side-apply (Update)`. The network cluster is clean. The secret cluster had three
  more latent ones — `NBRoutingPeer/router`, `SetupKey/jwks-gateway`, `SidecarProfile/jwks-gateway`
  — all cleaned. They were not failing yet because the conflict only bites when Fleet tries to
  CHANGE a co-owned field, and all three are about to be changed: 8.7 drops `secret` from that
  setup key and 9.7 deletes that routing peer. Both clusters now re-sweep clean.

- [x] 8.1 Re-point the socat forwarder at `jwks-network.vpn.blueora.ng:443` listening on `443`, **without** adding a `resolv-conf` volumeMount (the pinned operator rewrites `/etc/resolv.conf` in place; a mount for that absent volume wedges the pod); verify the pod reaches Running and its mesh client resolves the target
- [x] 8.2 Update the forwarder Service to `443` → `443` with a pinned ClusterIP; verify the ClusterIP matches what task 8.3 configures
- [x] 8.3 Add a CoreDNS override on the secret cluster mapping `jwks-network.vpn.blueora.ng` to that pinned ClusterIP; verify in-cluster resolution returns the ClusterIP while mesh resolution still returns the peer address
- [x] 8.4 Document the intentional split-horizon in the override's header — both paths terminate at the same certificate, which is why no verification is disabled; verify the comment states that property (spec: "Local resolution does not weaken validation")
- [x] 8.5 Point OpenBao's `jwt-network` `jwksUrl` at `https://jwks-network.vpn.blueora.ng/openid/v1/jwks`; verify `bao read auth/jwt-network/config` reflects the HTTPS URL
- [x] 8.6 Verify end-to-end TLS actually validates: force a fresh cross-cluster token login from the network cluster and confirm it succeeds with no verification skipped anywhere in the path
- **8.7 PASS, and it exposed a THIRD variant of the field-manager trap.** All `netbird.io/*`
  annotations are gone from the live jwks-mirror Service, and `grep -rn "netbird.io/expose"
  apps/network/src/` now matches exactly one line — an explanatory comment in
  `nbresource-omada-devices.yaml` saying why the device resource is declared rather than inferred.
  Stale comments in `omada/fleet.yaml`, `omada/values.yaml` and `netbird-config/nbroutingpeer-router.yaml`
  that still described the annotation path as current were rewritten.
  *The third variant:* here the conflict did NOT fail the bundle — `appliedDeploymentID` matched and
  Fleet had cleanly released the annotations — yet they were still on the object, because a hand-run
  `kubectl annotate` field manager was their SOLE remaining owner. Server-side apply removes a field
  when the LAST owner releases it, so a field Fleet has dropped persists indefinitely under a
  hand-manager. Removing a value therefore needs `kubectl annotate <key>-`, not just an apply.
  **So the trap has two distinct shapes:** a hand-manager that *co-owns* a field Fleet wants to
  change wedges the bundle silently (7.2, 8.5), and one that *solely owns* a field Fleet has
  dropped makes a deletion silently not happen (here). Both are invisible from `kubectl get`.
  Once the annotations went, the operator reaped `NBResource/jwks-mirror` on its own.
  *Broadened the sweep* to ANY `kubectl-*` manager on Fleet-owned objects, and checked field
  OVERLAP rather than just co-ownership. The rest are benign and were left alone:
  `kubectl-rollout` owns only `restartedAt`, `kubectl-annotate` on VSO objects owns only
  `vso.secrets.hashicorp.com/force-sync`, and the `kubectl-annotate`/`kubectl-label` entries on the
  netbird CRs + openbao StatefulSet overlap only Helm's own adoption metadata
  (`meta.helm.sh/release-name`, `app.kubernetes.io/managed-by`) — values Fleet never changes.
  **Account-side reaped too**, since none of this disappears with the CR: resource
  `netbird-jwks-mirror` + its two autogenerated policies, and then the two remaining omada orphans
  (`omada-domain` in 7.5, `omada-omada` here). The account's `network` network now holds
  **exactly one** resource — `omada-devices | omada.blueora.ng`, the documented device exception —
  and the policy list is down to the four `svc-*` mesh policies, the two autogenerated
  `omada-devices` ones, `pikvm-ssh`, `Default` and the four LAN `cidr-*` ones.
- **No regressions after all of group 7–8**, re-checked from the Mac with no `-k`:
  `openbao.vpn.blueora.ng` → 307, `omada.vpn.blueora.ng` → 302, `omada.blueora.ng:8043` → 200,
  all with `ssl_verify_result=0`; every `BundleDeployment` on both clusters has
  `appliedDeploymentID == spec.deploymentID`; all 12 network-cluster VSO secrets `Synced`.

- [x] 8.7 (was 7.8, **moved here** — it is a teardown, not an addition; see the note under group 7) Remove the `netbird.io/*` annotations from the jwks-mirror Service; verify no `netbird.io/expose` annotation remains anywhere under `apps/network/src`. Also reap the account-side `netbird-jwks-mirror` resource and its autogenerated policies, which do not disappear with the CR (measured in 7.5)

## 9. Demolition

Only after every verification in groups 5–8 is green.

> **TWO BLOCKERS FOUND 2026-10-05, both created by the ESO → Vault Secrets Operator migration
> rather than by this change. Neither is visible today, because the account's `Default` policy
> masks the first and the routing peer still exists for the second. Both bite inside THIS group.**
>
> **9.A — the allowed source group no longer matches the actual consumer.** `mesh-openbao` declares
> `sourceGroups: [homelab, network-k8s]`, which was correct when the consumer was ESO's sidecar
> peer (it enrolled into `network-k8s`). There is no sidecar now: the network cluster's VSO pod is
> not a peer, so its traffic egresses through the `router` NBRoutingPeer — and that peer is in group
> **`network`**, not `network-k8s` (measured: `router-ff5448668-wzzbf`, `100.65.249.79`,
> `groups=['network', 'All']`). The `svc-openbao` policy therefore does not cover it. It works only
> because `Default` (All ↔ All) still does. **So 9.9/9.10 cannot narrow `Default` until this is
> reconciled**, or the network cluster loses OpenBao the moment they do — and OpenBao is where its
> certificates come from.
> Note the `network-k8s` group is not unused: the three `clusterproxy-api-network` peers carry it.
> So the fix is a deliberate choice, not a typo correction — either add `network` to the exposure's
> sources, or move the routing peer into `network-k8s`. The second is more consistent with the
> reasoning already recorded in 7.7 (prefer a real `Group` CR over an operator-auto-created one
> that disappears with its routing peer), but it changes a shared, long-lived group.
>
> **9.A RESOLVED BEHAVIOURALLY 2026-10-06 — option chosen with the maintainer: move the routing
> peer into `network-k8s` rather than widen the exposure's sources.** Live: the network cluster's
> router peer is now in `['network-k8s', 'network', 'All']`, so `mesh-openbao`'s declared
> `sourceGroups: [homelab, network-k8s]` genuinely covers the egress peer and `svc-openbao-tcp`
> no longer depends on `Default` to work. `mesh-openbao` was left unchanged, which was the point.
>
> **BUT IT IS NOT YET DURABLE, and this is the one thing still blocking 9.9/9.10.** `NBRoutingPeer`
> exposes no `autoGroups`/`setupKeyRef` field on operator `v0.7.0` (its spec is only `replicas`,
> `labels`, `annotations`, `nodeSelector`, `privileged`, `resources`), and the `Group` CR carries
> only `name` — no membership. The operator auto-creates the routing peer's setup key, so the only
> way in was to patch that key's `auto_groups` through the management API, then let the peer
> re-enrol. Two measured facts make that workable but incomplete:
>   * the operator does **not** reconcile `auto_groups` — the patch persisted across 90 s and
>     several reconciles, so it does not fight back;
>   * `auto_groups` apply at ENROLMENT only, so the peer picked `network-k8s` up when the watchdog
>     recycled it (conveniently, during the 8a recovery).
> The gap: that patch is **imperative account state, not in git**. A cluster rebuild has the
> operator recreate the key with `[network]` alone and the fix is silently lost — which would make
> 11.3's cold-start proof regress in a way nothing checks. Needs a decision on how to codify it
> (an idempotent step in `network:start`, like `put_netbird_operator_auth`, is the repo-idiomatic
> option) before 9.9/9.10 narrow `Default`.
>
> **9.B — task 9.7 would cut the network cluster off from OpenBao.** 9.7 deletes the routing peers,
> keeping the network one "only if 7.5's device-path resource does not need it". That condition was
> written when the only consumers of the overlay here carried their own sidecars. Now the routing
> peer is ALSO what gives every ordinary pod on the network cluster its route to the overlay and its
> DNS for `*.vpn.blueora.ng` — including VSO reaching `openbao.vpn.blueora.ng` (6.1). Deleting it
> would break cross-cluster secret consumption even though the Omada device path happens to keep it
> alive for an unrelated reason. 9.7's condition must be rewritten to make that dependency explicit
> instead of incidental.
>
> **9.B RESOLVED 2026-10-06 — the condition is rewritten as a flat asymmetry rather than a test.**
> The network cluster's routing peer is KEPT unconditionally and its own header now names both
> reasons (device exception + every ordinary pod's route), so the dependency is stated rather than
> rediscovered. The secret cluster's is DELETED. Both halves were checked rather than assumed —
> see 9.7 below.
>
> **9.A RESOLVED DURABLY 2026-10-06 — as a reconciler in the bundle, not a `network:start` step.**
> `apps/network/src/netbird-config/cronjob-router-groups.yaml` (+ its own least-privilege SA) reads
> `network-k8s`'s group id from the `Group` CR status and the routing peer's key id from the
> `NBRoutingPeer` status — nothing hardcoded, so it survives the rebuild that regenerates both —
> then APPENDS the group to the key's `auto_groups` (never replacing, or the operator decides the
> key is wrong and mints a new one) and rollout-restarts `deploy/router`, because `auto_groups`
> apply at enrolment only.
> **A CronJob beat the `network:start` script the task text proposed, on two counts.** Ordering: the
> routing peer — and therefore `.status.setupKeyID` — does not exist until well after `apply`, and
> `start.sh` ends by exec'ing `apply.sh`, so a start-time step has no correct moment to run. And
> coverage: the thing 9.A actually worries about is a cluster REBUILD silently losing the fix, which
> a scheduled reconciler handles and a one-shot script invoked at the wrong time does not.
> **Tested against the real failure state, not just the happy path** — which is the lesson 8a paid
> for. The no-op branch was confirmed first (`already auto-joins network-k8s; nothing to do`), then
> the account was deliberately regressed to the pre-9.A state (`auto_groups` PUT back to
> `["network"]`), and the next run logged `adding network-k8s … (was ["d9irqtifadhs738ttul0"])` +
> `rollout restart`, after which the re-enrolled peer came back as
> `['All', 'network', 'network-k8s']`. Both branches exercised; 9.A is no longer imperative account
> state. With that, `svc-openbao-tcp` genuinely covers the network cluster's egress peer and no
> longer depends on `Default` to work.
> *Known limit, in the header:* it reconciles the KEY, not the peer's live group list, so a
> hand-removal in the dashboard is not detected until the peer next enrols.

**Results (verified live 2026-10-06) — the BYOP reverse-proxy stack is GONE, repo and account.**

- **9.1 DONE.** `apps/secret/src/netbird-reverse-proxy/`, `apps/network/src/netbird-reverse-proxy/`
  and `apps/platform/src/netbird-reverse-proxy-shared/` deleted. `moon run :fleet_build` succeeds
  with 0 hits for `reverse-proxy` in its output, `bin/fleet-lint-targets` reports 29/29 ok (was 31,
  i.e. exactly the two removed bundles), and `platform:fleet_build_gitrepo` still passes the 3 MiB
  catch-all limit. Also swept `apps/platform/src/external-secrets/`, a directory left holding only a
  gitignored `charts/*.tgz` after ESO's removal — nothing tracked, so it was invisible to git while
  still being a real directory on disk.
  **Fleet does not prune a bundle you delete from the repo.** `bin/fleet-apply` only ever upserts,
  so the `Bundle` objects survived the file deletion and kept their resources alive. The prune is
  `kubectl delete bundle` — done for both reverse-proxy bundles on both clusters (each cluster holds
  a `Bundle` for every repo bundle, deploying only the ones it targets), plus
  `platform-terranetes-…`, a 0/0 leftover from an earlier migration.
- **9.2 DONE, and the defensive check inverted into the thing that made the teardown safe.** As
  written ("verify no live resource is scheduled for destroy") the task does not fit a teardown —
  here every resource those Workspaces own is *meant* to die. The property actually worth enforcing
  is that the prune does not run `tofu destroy` **at all**, and that is not fastidiousness:
  **three of the five Workspaces could not have destroyed successfully.** `reverse-proxy-dns`,
  `reverse-proxy-dns-secret` and `reverse-proxy-dns-network` were all `Synced=False` with
  `403 Authentication error` from Cloudflare — they hold a `cloudflare_dns_record` and read the
  Cloudflare credential from `kv/cloudflare#credential`, which since the 2026-10-05 engine migration
  is a **user-scoped parent** that cannot edit zone DNS. A Workspace that cannot `plan` cannot
  `destroy`, and Crossplane blocks deletion on its finalizer until destroy succeeds — so pruning
  them as-is would have hung three CRs indefinitely.
  So: all five were patched to `deletionPolicy: Orphan` **before** either apply
  (two needed it — secret's `reverse-proxy-services` and network's `reverse-proxy-dns`; the other
  three already had it), making every prune a no-op against live state, and the real artifacts were
  then deleted deliberately and verifiably in 9.10. This is the same `Orphan`-then-prune discipline
  the shared chart's own header records from the earlier cross-bundle move.
  Their `tfstate-reverse-proxy-*` Secrets in `crossplane-system` (2 on secret, 3 on network) were
  deleted afterwards — `Orphan` leaves state behind by design.
- **9.3 DONE, and the bundles deliberately NOT removed.** Deleted network's
  `workspace-reverse-proxy-dns.yaml` + `workspace-reverse-proxy-services.yaml` and secret's
  `workspace-reverse-proxy-services.yaml`, plus both clusters'
  `vaultstaticsecret-cloudflare-credentials.yaml` — orphaned the moment the DNS Workspaces went,
  since the surviving Cloudflare consumers read a *different* secret
  (`src/config/vaultstaticsecret-cloudflare-admin-token.yaml` for the engine parent,
  `platform/src/config/vaultdynamicsecret-cloudflare-api-token.yaml` for cert-manager).
  Neither `cloudflare-config` bundle is empty — each still holds the `default` provider-opentofu
  `ProviderConfig` and the NetBird PAT — so neither was removed. **The name is now a misnomer and
  stays**, which both headers say outright: renaming the directory renames the Fleet bundle, which
  prunes and re-creates the `ProviderConfig` that every Workspace on that cluster references
  (`mesh-openbao`, `mesh-tls`, `openbao-config` / `mesh-omada`, `mesh-jwks`) — a self-inflicted
  outage window for a cosmetic gain. Surviving Cloudflare state reconciles clean: all 5 remaining
  Workspaces `Synced=True Ready=True`, and the `403` Workspaces are simply gone.
- **9.4 DONE.** `third_party/vendir/charts/netbird-reverse-proxy/` and its `vendir.yml` entry
  removed; `vendir sync` succeeds and the lock entry is gone. `charts/tailscale-operator` is intact
  (`apps/enigma-cluster` still consumes it — [[netbird-tailscale-vendir-enigma-shared]]).
  *Gotcha:* `vendir sync` does NOT prune a chart directory dropped from `vendir.yml` — it
  disappears from `vendir.lock.yml` while the files stay on disk, so the directory has to be deleted
  by hand or it silently persists as an untracked vendored chart.
- **9.5 DONE.** `apps/secret/scripts/put_netbird_proxy_auth.sh` deleted and both
  `put_netbird_proxy_auth` / `put_netbird_pikvm_proxy_auth` tasks removed from `apps/secret/moon.yml`
  (replaced by a note saying what they did and that nothing replaces them — a mesh exposure's
  identity is a SetupKey the operator mints from a CR, with no out-of-band value to seed).
  `moon query tasks` lists neither, and the only remaining mention in the repo is that note.
- **9.6 DONE, and the kv half was already satisfied — which is worth recording because the task
  would otherwise read as skipped.** `kv/secret-netbird-proxy` and `kv/network-netbird-pikvm-proxy`
  **do not exist**: `bao list kv/metadata` returns exactly `cloudflare, mesh-tls, mongodb, netbird,
  netdata, pikvm, s3-backup`. They went when proxy tokens became dynamic (the engine's
  `proxy-token` roles superseded the hand-minted kv values), so there was nothing to delete.
  What did remain were the roles and their grants:
  * the two `vault_generic_endpoint` blocks in `plugin-netbird.yaml` (`secret-proxy`,
    `network-pikvm-proxy`) — removed;
  * **`disable_delete = true` on those blocks means removing the HCL does NOT remove the live
    roles**, so both were deleted once by hand (`bao delete netbird/config/proxy-token/<name>`,
    verified unreadable afterwards). A fresh cluster never creates them, so this is a one-time
    cleanup and not a drift;
  * `netbird/proxy-token/*` dropped from `policy-vault-secrets-operator.yaml`;
  * `policy-netbird-read.yaml` deleted outright — bound to NO role (its header still claimed
    "bound to the external-secrets role", which ESO's removal invalidated), and every grant it
    held is already in the `vault-secrets-operator` policy. Live policy deleted too, since the MR
    was `Orphan`.
  *Left alone, flagged:* the live `external-secrets` and `network-read` OpenBao policies are also
  orphaned with no MR — residue of ESO's removal rather than of this change, so they belong to that
  follow-up.
- **9.7 DONE — asymmetric, and both halves checked rather than inferred.** The secret cluster's
  `nbroutingpeer-router.yaml` + watchdog CronJob + watchdog SA are deleted; the network cluster's are
  kept.
  *Why secret's could go:* it existed for exactly one consumer — OpenBao's `jwt-network` backend
  fetching the network JWKS over the old `netbird.io/expose` NBResource path, whose source group was
  the operator-auto-created `secret`. That path is gone (8.7). Verified nothing else on that cluster
  resolves a `*.vpn.blueora.ng` name from an ordinary pod: OpenBao reaches the JWKS via a CoreDNS
  override to an in-cluster ClusterIP, that cluster's VSO reaches OpenBao over a ClusterIP in plain
  HTTP, and the ClusterProxy and the mesh exposure each run their own client. Checked explicitly
  because an unused-LOOKING routing peer is precisely what the network cluster's turned out not to
  be (9.B).
  *Downstream edit:* `SetupKey/jwks-gateway`'s `autoGroups` dropped `secret` (the group dies with
  the peer), leaving only `secret-k8s` — the real `Group` CR, which was chosen for exactly this
  reason back in 7.7. That edit tripped the `observedGeneration` trap on cue (`gen 3 / obsGen 2`)
  and was cleared by 8a.5's remedy.
  **A bare Pod needs the BundleDeployment deleted, not just the Secret.** Deleting
  `setup-key-jwks-gateway` fixed the status but the forwarder Pod, once deleted, was not recreated by
  Helm (nothing in the release changed) — `kubectl delete bundledeployment` is what forced it back.
  Result: peer `100.65.150.251` connected with groups `['secret-k8s', 'All']` — `secret` gone — and a
  **fresh** cross-cluster login proved the path end to end: a newly-minted network-cluster SA token
  presented to `auth/jwt-network/login` returned `role=network-vso`,
  `policies=[default, vault-secrets-operator]`, i.e. OpenBao pulled the JWKS through the rebuilt
  forwarder and validated an RS256 signature with it.
  No service regressed: all three mesh names, the Omada device path and PiKVM re-checked green
  after the change (see 9.10).
- **9.8 DONE, and it caught a FUNCTIONAL break that no comment-level grep would have.**
  `grep -rn "vgijssel.nl" apps/{secret,network,platform}/src` now yields only legitimate hits: the
  two zone ids/names the Cloudflare engine manages, `vgijssel.nl` in external-dns `domainFilters`,
  the two ClusterProxy headers stating that no `api.<cluster>.vgijssel.nl` endpoint exists, and
  deliberate historical notes recording what was removed. No mesh service name survives.
  **The important find was outside that grep's scope.** `apps/network/scripts/put_netbird_operator_auth.sh`
  — the ONE manual step the network cluster needs, and a direct input to 11.3's cold-start proof —
  was stale in two independent ways, each fatal on a fresh cluster:
  1. `REMOTE_BAO_ADDR` defaulted to `https://openbao.secret.vgijssel.nl`, the reverse-proxy name
     deleted in this very group;
  2. it read the PAT from a static `kv/network-netbird-operator` entry that **no longer exists**
     (see 9.6) — stale since the ESO→VSO migration, not since this change.
  Now it mints from `netbird/pat/network-operator`, the same engine role VSO reads, so the seed and
  the steady state no longer disagree. Its auth was stale too: it demanded a "root token from .env"
  that self-init revokes, and now accepts `BAO_TOKEN`/`VAULT_TOKEN` and points at
  `secret:get_openbao_auth`. Its failure message lists the checks in the order they actually fail,
  starting with "is this workstation a connected NetBird peer?" — because the new address is
  mesh-only by design, so a disconnected laptop looks like a broken credential.
  Also corrected: `clusterissuer-letsencrypt-prod.yaml` (said it served `*.vgijssel.nl`; it now
  records the two names it really issues and why DNS-01 rather than HTTP-01 is load-bearing),
  `openbao/values.yaml`, both `config/fleet.yaml` headers (still describing ESO ClusterSecretStores
  that no longer exist), `crossplane-provider/provider-opentofu.yaml`, `jwks-gateway/fleet.yaml`,
  and `libs/pyinfra-custom`'s `VAULT_ADDR` hint.
  *Out of 9.8's scope, flagged for 11.5 and 10.2:* `apps/network/SPEC.md` (lines 54/81) still tells
  a human to use `openbao.secret.vgijssel.nl`, `apps/network/network.md` still describes
  `omada.network.vgijssel.nl` as resolving publicly, and `apps/pikvm/files/goss.yaml` still probes
  twelve ports at that name. **10.2 is now urgent rather than tidy-up:** that name resolved until
  today only because it fell through the `*.vgijssel.nl` wildcard, and 9.10 deleted the wildcard,
  so it is NXDOMAIN and the PiKVM goss contract will fail until it is re-pointed.

- [x] 9.1 Delete `apps/secret/src/netbird-reverse-proxy/`, `apps/network/src/netbird-reverse-proxy/` and `apps/platform/src/netbird-reverse-proxy-shared/`; verify `moon run :fleet_build` still succeeds and the removed bundles are gone from its output
- [x] 9.2 Check for Crossplane resources needing an orphan deletion policy and a live patch **before** pruning the OpenTofu Workspaces (a cross-bundle move without this previously caused an outage); verify no live resource is scheduled for destroy in the plan output — **reinterpreted for a teardown: enforced that NO destroy runs at all, which is what kept three un-plannable Workspaces from hanging on their finalizers**
- [x] 9.3 Delete the three reverse-proxy Workspaces from `apps/{secret,network}/src/cloudflare-config/`, removing any bundle left with no resources; verify the surviving Cloudflare state still reconciles clean — **neither bundle is empty, and both are deliberately NOT renamed (see above)**
- [x] 9.4 Delete `third_party/vendir/charts/netbird-reverse-proxy/` and its `vendir.yml` entry, leaving `charts/tailscale-operator` untouched (`apps/enigma-cluster` still consumes it); verify `vendir sync` succeeds and the tailscale chart is still present
- [x] 9.5 Delete `apps/secret/scripts/put_netbird_proxy_auth.sh` and both proxy-token tasks from `apps/secret/moon.yml`; verify `moon query tasks` no longer lists them and no remaining script references the deleted file
- [x] 9.6 Remove the OpenBao `proxy-token` role config and delete the stale `kv/secret-netbird-proxy` and `kv/network-netbird-pikvm-proxy` entries; verify the role is gone from the OpenBao config and no ExternalSecret references those paths — **the kv entries were already absent; the roles needed a hand delete because `disable_delete = true`**
- [x] 9.7 Delete the routing peer and its watchdog from `apps/secret/src/netbird-config/`, and from the network cluster only if 7.5's device-path resource does not need it; verify whichever survives carries a header explaining why, and that no service regressed — **condition rewritten per 9.B: network's is kept unconditionally**
- [x] 9.8 Reconcile remaining hostname references: `grep -rn "vgijssel.nl" apps/{secret,network,platform}/src` shows no mesh service names, only legitimate zone-level references
- [x] 9.9 Turn off the operator's automatic-policy-creation flag if and only if no policy annotation survives 9.7 (resolves the second design Open Question); verify every service is still reachable afterwards — **ANSWERED by 7.5: the flag must STAY ON. The design Open Question asked "does the Omada device exception still require automatic-policy-creation, or can it be turned off entirely?" It still requires it.** No `netbird.io/*` ANNOTATION survives anywhere (8.7), which is what the task's condition literally tests — but the condition is the wrong test. `NBResource/omada-devices` declares `policyName` + `policySourceGroups` and the operator mints `Autogenerated policy for resource omada/omada-devices in cluster network TCP`/`UDP` from them, which the flag gates. And there is no alternative: on operator `v0.7.0` a standalone `NBPolicy` creates nothing (defect A under group 5), so an NBResource's own `policy*` fields are the only working declarative route for a resource-backed policy. Turning the flag off would silently strip the device path's access policy. The mesh exposures are unaffected either way — they carry no NBResource and get their policies from OpenTofu Workspaces
- [x] 9.10 Delete the account-side artifacts: both BYOP proxy clusters, their private services, the registered reverse-proxy domains and orphaned proxy tokens; verify the dashboard lists no reverse-proxy clusters

**9.10 results (verified live 2026-10-06) — the account holds no reverse-proxy artifact.**

Order mattered: services → domains → clusters, so nothing was deleted while still referenced.

| artifact | before | after |
|---|---|---|
| private services | `openbao-secret`, `pikvm-network` | **0** |
| custom reverse-proxy domains | `secret.vgijssel.nl`, `network.vgijssel.nl`, `vgijssel.nl` | **0** |
| reverse-proxy clusters | shared `eu1` + 2 private `account` | **1** (shared `eu1` only) |
| proxy tokens | 48, 35 of them live | 48 records, **0 live** |

**Two API shapes worth recording, because both read as success while doing nothing:**

- **A proxy cluster is deleted by its ADDRESS, not by the `id` the GET returns.**
  `DELETE /api/reverse-proxies/clusters/netbird-proxy-<uuid>` returns **404**;
  `DELETE /api/reverse-proxies/clusters/secret.vgijssel.nl` returns 200 and actually removes it.
- **`DELETE` on a proxy token REVOKES it, it does not remove the record.** All 48 returned
  `200 {}` and all 48 are still listed — now with `revoked: true`, 0 live. That is the meaningful
  outcome (a revoked token cannot authenticate a proxy) and the API exposes no way to purge the
  history. Counting `revoked` is the only honest check here; counting rows looks like total failure.

**Orphans the operator does NOT reap on CR deletion — the same class 7.5 found, now swept.**
Deleting a `netbird.io` CR frequently leaves its account-side object behind, so the secret
cluster's routing-peer teardown left: the `secret` **network**, the `secret` **group**, and **two**
orphaned `secret` setup keys. Deleting the group failed first with
`group has been linked to setup key: secret` — a useful ordering constraint: setup keys pin groups,
so keys go first. Also removed two superseded `network` setup keys (the live one is the id in
`NBRoutingPeer.status.setupKeyID`; every key a live CR owns was enumerated from both clusters
first, so nothing in use was touched) and four groups with 0 peers and no policy reference
(`omada`, `omada-adopt`, `omada-domain`, `secret`).
**Plus 9 stale peer registrations**, 8 of them `jwks-gateway` — task 1.3 spotted 5 of these back in
September and filed them as out of scope; the non-ephemeral key kept accumulating one per pod
replacement. Peer count 24 → 15, and every survivor is accounted for: 4 real devices, 6
clusterproxy, 3 mesh services, 1 router, 1 jwks-gateway.
Final account state — groups: `All, homelab, network, network-k8s, omada-devices, roaming,
secret-k8s, svc-jwks-network, svc-omada, svc-openbao`; policies: the 4 `svc-*` mesh ones, the 2
autogenerated `omada-devices` ones, `pikvm-ssh`, `Default` and the 4 LAN `cidr-*` ones.

**Cloudflare: three wildcard CNAMEs deleted, and this is the one step with blast radius beyond
this change.** `*.vgijssel.nl`, `*.secret.vgijssel.nl` and `*.network.vgijssel.nl` (all →
`eu1.netbird.services`) are gone. They existed only as the validation anchor for the reverse-proxy
domain registrations deleted above, and the proposal retires `*.vgijssel.nl` as a mesh namespace
explicitly — but the apex wildcard answered at **arbitrary depth**, so it was also the only thing
making every `*.enigma.vgijssel.nl` name resolve publicly. Checked before deleting: the zone
contains **no other A or CNAME record at all**, so those names were resolving to NetBird's
reverse-proxy anycast IPs — which are not and never were the enigma cluster. Removing the wildcard
turns a wrong answer into NXDOMAIN, and `apps/cluster-networking`'s k8s-gateway serves those names
internally regardless. Mail was the real risk and is untouched: 7 MX + 4 TXT (SPF/DKIM/site
verification) intact and re-resolved from `1.1.1.1`.
*Reversible if ever needed:* re-creating one CNAME. *The token:* the dead static `cfat_` parent
cannot edit zone DNS, so the deletions used a freshly-minted `cloudflare/token/external-dns`
credential from the OpenBao engine — incidentally a live re-proof of 6.2's chain.

**Post-demolition regression sweep — all green, from the Mac with no `-k`:**
`openbao.vpn.blueora.ng/v1/sys/health` 200, `omada.vpn.blueora.ng/` 200,
`jwks-network.vpn.blueora.ng/openid/v1/jwks` 200, `omada.blueora.ng:8043/` 200 — every one with
`ssl_verify_result=0`. `pikvm.vpn.blueora.ng` 302 under `-k` (its self-signed certificate, the
accepted consequence recorded in 10.3 — confirmed working BEFORE the proxy was removed, so the
replacement path was never absent). All four mesh names return nothing from `1.1.1.1`. Old proxy
names (`openbao.secret.vgijssel.nl`, `pikvm.network.vgijssel.nl`) now NXDOMAIN. **19 + 20
BundleDeployments across both clusters, 0 not green** — checked on `appliedDeploymentID ==
spec.deploymentID` as well as conditions, per the lesson from 5.2/7.2 that conditions lie. All 10
network-cluster VSO objects `Synced`/`Valid`, i.e. cross-cluster secret consumption still flows
over the mesh. `trunk fmt` and `trunk check` clean on 225 files.

- [x] 9.11 (added) Narrow the account's built-in `Default` policy so the per-service `svc-*` policies actually bite; verify every intended path still works and that a peer outside a service's source groups is refused

**9.11 results (verified live 2026-10-06) — the spec's access-control requirement is now MET, not
masked.** This task was never numbered: group 5 recorded that the `svc-*` policies "do not BITE
until the account's built-in `Default` policy is narrowed or removed" and assigned that to group 9.
It was the last thing standing between the spec scenarios *"Enrolled peer outside the allowed
groups is denied"* / *"Undeclared port is not reachable"* and reality. **Maintainer chose
"narrow now, fix what breaks"** after being shown the risk below.

`Default` was `All + homelab + network-k8s ↔ the same three`, protocol `all`, bidirectional, every
port — so with every peer in `All` it granted everything to everything. It is now
**`enabled: false`** rather than deleted: identical effect, one PUT to reverse, and the exact
restore payload is snapshotted.

**The lockout risk turned out not to apply here, and that is worth recording rather than having
merely got lucky.** The concern was that `netbird kubernetes write-kubeconfig` (ClusterProxy) is
the documented break-glass path and has no explicit policy, so narrowing `Default` could kill
kubectl — the very tool needed to repair it. Checked first: `kubectl config view` shows both vind
clusters at `https://localhost:11979` / `:12847`, i.e. **Docker-published ports, not the
ClusterProxy**. kubectl on this workstation is mesh-independent, confirmed still working after the
change. The ClusterProxy path is an alternative for remote access, not the one in use. On a
non-vind cluster this would be a genuine lockout and would need its policy authored first.

**Exactly one real regression, found and fixed: PiKVM's web UI.** `homelab → homelab:443` rode
`Default` and nothing else — `pikvm-ssh` covers only `netbird-ssh`/22 (which kept working
throughout). Fixed with an explicit `homelab-devices` policy (`homelab ↔ homelab`, protocol `all`,
bidirectional) — deliberately the same shape `Default` gave homelab members, scoped to `homelab`
alone so the `svc-*` groups stay gated. **This does not weaken the spec:** the requirement
constrains *exposed mesh services*, each of which sits in its own `svc-*` group behind its own
per-protocol policy. PiKVM, Home Assistant and the phone are plain device peers, not exposures.

**Final allow/deny matrix, measured — the DENIED rows are the point:**

| from | to | policy | result |
|---|---|---|---|
| Mac `[homelab]` | `openbao.vpn.blueora.ng:443` | `svc-openbao-tcp` | ALLOWED |
| Mac `[homelab]` | `omada.vpn.blueora.ng:443` | `svc-omada-tcp` | ALLOWED |
| Mac `[homelab]` | `omada.blueora.ng:8043` | autogen `omada-devices` | ALLOWED |
| Mac `[homelab]` | `pikvm.vpn.blueora.ng:443` | `homelab-devices` | ALLOWED |
| Mac `[homelab]` | `pikvm.vpn.blueora.ng:22` | `pikvm-ssh` | ALLOWED |
| router `[network-k8s]` | `openbao.vpn.blueora.ng:443` | `svc-openbao-tcp` | ALLOWED |
| jwks-gw `[secret-k8s]` | `jwks-network.vpn.blueora.ng:443` | `svc-jwks-network-tcp` | ALLOWED |
| **Mac `[homelab, roaming]`** | **`jwks-network.vpn.blueora.ng:443`** | **source is `secret-k8s` only** | **DENIED** |
| **router `[network-k8s]`** | **`omada.vpn.blueora.ng:443`** | **source is `homelab` only** | **DENIED** |

**A bonus finding in those two denials: NetBird's DNS is policy-scoped.** The denied attempts did
not time out at the transport — they failed to RESOLVE (`wget: bad address
'omada.vpn.blueora.ng'`). A peer cannot even learn the name of a service it has no policy access
to, which is a stronger form of the spec's "off-mesh client cannot reach the service" than the
requirement asks for.

**Proven not-cached.** Cluster health under the new ACL was re-established by forcing fresh work,
not by reading stale `Synced` columns: a newly-minted network-cluster SA token presented to
`auth/jwt-network/login` returned `role=network-vso` / `policies=[default,
vault-secrets-operator]`, and the network VSO controller was restarted to force re-authentication —
all **10** VaultStaticSecret/VaultDynamicSecret objects came back `Synced`/`Valid`. Both clusters:
19 + 20 BundleDeployments, **0 not green** (checked on `appliedDeploymentID == spec.deploymentID`
as well as conditions).

**A NetBird control-plane outage hit mid-test and nearly produced a false conclusion — recorded
because it is a trap for anyone re-running this.** `api.netbird.io` went to `http=000` (timeouts)
for several minutes while the data plane stayed up; the router pod reported `Management:
Disconnected / Signal: Disconnected` with `connection refused` to `85.9.201.14:443`. During that
window every cross-cluster probe failed, which looks exactly like the ACL change having broken
cross-cluster access — and it was not. The Mac's own daemon reporting `Management: Connected` while
`curl` to the API failed is what separated the two. Two consequences: **do not interpret a
connectivity matrix without first checking daemon `Management`/`Signal` state**, and note that
while the API is down a policy change cannot be rolled back, which is a real argument for
`enabled: false` plus a saved payload over deletion.
*Also re-confirmed:* `nc -z` is unreliable on 443 here (reported CLOSED while `curl` to the same
IP:port returned 302) — the same vacuousness task 7.9 recorded for `nc -zu` on UDP. Every row above
uses a protocol-level probe.

**NOT IN GIT, flagged.** `Default`'s disabled state, `homelab-devices`, `pikvm-ssh` and the four
LAN `cidr-*` policies are all hand-managed account state. That is consistent with existing practice
(the `cidr-*` and `pikvm-ssh` policies were always account-side) and the durability concern is
much weaker than 9.A's — NetBird account state is cloud-side and survives any cluster rebuild, so
11.3 is unaffected. But it is not reproducible onto a fresh ACCOUNT, and the mesh exposures' own
policies ARE in git (OpenTofu Workspaces in the shared chart). Codifying the device-side policies
the same way is a follow-up.

**A pre-existing blocker surfaced mid-apply and is fixed: cert-manager's own webhook serving
certificate had EXPIRED** (`notAfter 2026-10-05T18:26:36Z`). Every `netbird-operator` bundle apply
failed with `failed calling webhook "webhook.cert-manager.io" … certificate has expired`, which
cascaded to `jwks-gateway` and `netbird-config` through `dependsOn` — the 8a cascade shape again,
from an unrelated cause. The `cert-manager-webhook-ca` is valid to 2027; it is the webhook's
in-memory **serving** cert, rotated by the pod itself, that lapsed — the pod was 69 days old and
the host slept, so the rotation timer never fired. `rollout restart deploy/cert-manager-webhook`
on both clusters regenerated it. Unrelated to this change, but worth carrying forward as a
suspend/resume consequence in the same family as 8a: a sleeping host does not just wedge mesh
clients, it stalls any in-pod timer, and cert-manager's webhook is one with a hard deadline.

## 10. PiKVM

**Results (verified live 2026-10-01):**

- **10.1 PASS.** The PiKVM peer picked the new domain up with no action on the box: it is
  `Connected` as `pikvm.vpn.blueora.ng`, resolves to `100.65.192.152` from the Mac, and answers
  ICMP there. No re-enrolment and no client restart was needed — the account DNS domain is served
  by the resolver, not baked into the peer.

**Results (2026-10-06) — 10.2 and 10.3 done; 10.2's verification is partly blocked on the box.**

- **10.2 DONE in code; verified by proxy, not on the box.** All 13 `omada.network.vgijssel.nl`
  references in `apps/pikvm/files/goss.yaml` are now `omada.blueora.ng`, plus the two header
  comments that explained the old name. `apps/network/network.md`'s DNS section was rewritten to
  name both paths and state that the two are independent by design.
  This was urgent rather than cosmetic: the old name only ever resolved by falling through the
  `*.vgijssel.nl` wildcard CNAME, which 9.10 deleted — so the goss contract had been asserting
  reachability against **NetBird's shared reverse-proxy anycast IPs rather than Omada**, and would
  now fail outright on NXDOMAIN. A header note records exactly that, plus a do-not-do: the name
  must NOT be "modernised" to `omada.vpn.blueora.ng`, because the mesh peer deliberately serves
  only 443 plus the raw device ports and has no 8088/8043/8843 listener, so most assertions would
  fail. `omada.blueora.ng` is also the right thing for THIS box to assert — the PiKVM is the
  routing peer the LAN gateway sends `10.96.0.20/32` to, so the checks exercise the exact path
  the APs and switches depend on.
  **Verification: 11/11 assertions pass, measured from the Mac rather than the PiKVM.** `dns`
  resolves to `10.96.0.20` and all ten declared TCP ports connect (8088, 8043, 8843,
  29811–29817) via a real socket connect per port, not `nc -z`. The Mac is in `homelab` and
  carries the same policies as the PiKVM, so the contract is satisfiable from an equivalent peer.
  **What is NOT verified, and cannot be by me:** the suite running ON the box. `goss serve`
  listens on `127.0.0.1:8080` (localhost only) and the box still holds the OLD goss.yaml until
  `moon run pikvm:apply` deploys it — and NetBird-SSH demands interactive SSO, which a
  non-interactive session cannot satisfy (`Error: SSH proxy: JWT authentication: wait for JWT
  token`, the same wall task 7.5 hit). So the remaining step is a human running
  `moon run pikvm:apply` and checking the goss report. Nothing is broken in the meantime: the
  box's current contract points at a dead name, so it is already failing — the fix is authored
  and waiting to be deployed.
- **10.3 DONE.** A named-exception section in `apps/network/network.md` records the accepted
  self-signed warning on `https://pikvm.vpn.blueora.ng/`, and states the thing the task asked for
  explicitly: **the removed reverse proxy existed solely to paper over it.** The evidence is in the
  deleted config — that service terminated TLS with a real wildcard and then spoke to the box with
  `skip_tls_verify`, because the box's certificate is for its LAN IP and not its overlay address.
  So the proxy added no security over an already-encrypted tunnel; it converted a self-signed
  certificate into a green padlock, and the price was a proxy fleet, a minted token, a registered
  domain, a wildcard certificate, a watchdog and two `moon` tasks.
  Both upgrade paths are filed as open follow-ups with their real blockers, not as vague
  intentions: (1) issue `pikvm.vpn.blueora.ng` by DNS-01 and install it into the box's nginx via
  the pyinfra deploy — cost is a certificate-distribution path onto a read-only-rootfs appliance
  that is not a Kubernetes consumer; (2) expose it as a `mesh-service` with a `BackendTLSPolicy`,
  which the chart already supports after 7.10 — blocked because `BackendTLSPolicy` requires
  `validation.hostname` with no skip-verify and the box's certificate matches no name we could
  validate, so it needs (1) first or a custom CA.

- [x] 10.1 Verify the PiKVM peer resolves at `pikvm.vpn.blueora.ng` after the domain flip
- [x] 10.2 Update `apps/pikvm` and `apps/network/network.md` hostname references and the goss health contract; verify the goss suite passes over the mesh (create unit symlinks directly rather than via `systemctl enable`, which hits a read-only filesystem over mesh SSH)
- [x] 10.3 Record the self-signed certificate warning as a known, accepted consequence and file both upgrade paths as follow-ups; verify the note states that the removed proxy existed solely to paper over it

## 9c. Account state moved into code (added 2026-10-06)

Not in the original plan. 9.11 and tasks 2.5/2.6 left real account state hand-managed, which this
closes. New bundle `apps/secret/src/netbird-account/` — **secret-cluster ONLY, and that targeting
is load-bearing rather than tidy**: these objects are account-GLOBAL, so two clusters reconciling
them would flap each other. Same single-writer reasoning as `mesh-tls`.

- **`netbird_account_settings` codifies tasks 2.5 and 2.6.** `dns_domain = vpn.blueora.ng` and
  `peer_login_expiration_enabled = false` were applied as a one-off `PUT /api/accounts/<id>` and
  existed nowhere in git — the weakest link in the whole story, since `vpn.blueora.ng` is the
  domain every mesh hostname and the shared wildcard certificate are built on.
  **It adopts with no `import`, which is what makes it safe to add to a live account:** the
  resource is a singleton whose `Create` lists the account and PUTs, so a first apply takes over
  whatever is there. Verified: it reconciled first try and the live settings were unchanged
  (`dns_domain: vpn.blueora.ng`, `peer_login_expiration_enabled: False`). Its `Delete` is a
  deliberate no-op upstream, so removing the file stops managing the settings rather than
  resetting the account.
- **`homelab-devices` and `pikvm-ssh` adopted with ZERO downtime**, which needed a specific order.
  Rather than delete-then-create (a gap in PiKVM access), the Workspace was applied FIRST so tofu
  created its own copies alongside the hand-made ones — NetBird permits duplicate policy names —
  then the originals were deleted once the new ones were confirmed **byte-identical** on every
  field (action, protocol, ports, bidirectional, sources, destinationResource, authorized_groups).
  `pikvm-ssh` resolves the box BY NAME through `data "netbird_peer"` instead of its hardcoded id,
  so a re-enrolled box does not orphan the policy; that data source is why provider **0.0.10** is
  the floor. It resolved to the same id the hand-made policy carried.
- **The built-in `Default` policy is now DELETED, not merely disabled.** It cannot be managed here:
  adopting a NetBird-created resource needs a one-shot `import` block, and an `import` left in
  config errors on every later plan ("resource already managed") — which in a Crossplane Workspace
  means a permanently un-reconciling bundle. Deleting it leaves the account's allow-list exactly
  what code declares. The fresh-account bootstrap step (find `Default` by name, delete it) is
  documented in the Workspace header beside a verification that actually proves it, in the same
  category as seeding the seal key and the operator PAT.
- **A REGRESSION THIS FOUND, which 9.11's matrix had missed: a routed resource needs TWO
  authorisations, and the Omada DEVICE path was broken.** Deleting `Default` took out
  `omada.blueora.ng:8043` while every check that mattered still looked healthy — the autogenerated
  `homelab -> omada-devices` policy was correct and enabled, the route was `Selected` on the client
  and resolved to the right ClusterIP, and the controller answered **200 from inside the cluster**.
  Only the overlay hop was dead. The model is:
  * leg 1 — client → the ROUTING PEER. The device path is forwarded by the network cluster's
    `router`, which sits in the `network` group, and nothing granted `homelab -> network`.
  * leg 2 — client → the resource behind it. That is the operator's autogenerated policy.
  **Why it hid so well:** the LAN `cidr-*` resources never broke, because THEIR routing peer is
  the PiKVM, which is itself in `homelab` — so `homelab-devices` authorises their leg 1 by pure
  coincidence. Fixed with a `homelab-to-network-router` policy, and the fix was derived by
  measurement rather than guessed: a temporary wide-open policy restored it (confirming the
  mechanism), a port-restricted variant also worked, and then — the useful part — with leg 1 set
  to `protocol = all` the DECLARED device ports stayed reachable while UNDECLARED ones (9999,
  8200) were still refused. **Leg 2 gates the ports**, so leg 1 needs no port list: restating one
  would add no security and would create a third copy to keep in sync with the Service and the
  NBResource.
- **Still hand-managed, and deliberately not half-done:** the four `cidr-*` policies and the
  `lan-*` networks/resources/routers they target. Those policies reference generated resource ids,
  so codifying them alone would hardcode ids; they belong with a `netbird_network`/
  `netbird_network_resource` migration of the whole LAN stack. Flagged in the bundle header.
  **Policy ownership audit after this work: 12 policies, 8 in code, 4 hand-managed** (down from 6).
- **Full matrix re-verified after every change** — ALLOWED: `omada.blueora.ng:8043` (device, both
  legs), LAN `192.168.20.1` (cidr-*), `pikvm.vpn.blueora.ng:443` (homelab-devices), PiKVM ssh/22
  (pikvm-ssh), `openbao.vpn.blueora.ng` (svc-openbao), `omada.vpn.blueora.ng` (svc-omada).
  DENIED, as the spec requires: `jwks-network` from the Mac (source is `secret-k8s` only) and
  `omada.blueora.ng:9999` (undeclared port).

## 9d. observedGeneration — fixed automatically, not just documented (added 2026-10-06)

8a.5 root-caused the bug and left a documented manual remedy. That is now a reconciler:
`apps/platform/src/netbird-operator/templates/cronjob-setupkey-status.yaml` (+ its own RBAC),
deployed to BOTH clusters by the operator bundle's existing targeting, every 10 min.

- **It patches `setupkeys/status` rather than deleting the derived Secret, and the reason is
  privilege.** Deleting `setup-key-<name>` is the operator-native way to force the create path,
  but SetupKeys live in several namespaces (`netbird`, plus the release namespace of every mesh
  exposure), RBAC cannot wildcard `resourceNames`, so that job would need **cluster-wide `delete`
  on Secrets** — which on these clusters includes the OpenBao seal key. Patching the status
  subresource needs no Secret access at all: one subresource of one CRD and nothing else.
- **It is a statement of fact, not a forgery, and is gated so it stays one.** The spec has already
  been pushed to the management API by the time the operator returns early — that is literally the
  line above the early return — so the generation HAS been observed and acted on; only the record
  is missing. The job refuses to act unless the operator's own `Ready=True` is present, so it can
  never paper over a reconcile that genuinely failed.
- **Verified on BOTH branches, including against a real lagging CR** — the join 4.9 and 8a got
  wrong by testing halves. No-op branch: ran against healthy state, logged nothing and exited 0.
  Acting branch: created a throwaway `SetupKey/obsgen-probe`, edited its spec in place (the exact
  trigger), and confirmed the operator applied the edit account-side (2 `auto_groups`) while
  leaving the status behind. The scheduled CronJob then fixed it **unprompted** before it was even
  inspected:
  `setupkey-status: netbird/obsgen-probe generation=2 observedGeneration=1 with Ready=True -> recording the generation the operator already applied`
  **Independent corroboration of the root cause:** after the fix the CR reads `gen 2 / obs 2` while
  the Ready condition's own nested `observedGeneration` is still **1**, dated to creation — proof
  the operator never re-wrote status and that only the top-level field (the one Fleet reads) was
  repaired.
- **Self-disabling by construction:** when upstream is fixed the job finds nothing and logs
  "nothing to do" forever, which is the signal to delete it with the version pin. The header
  carries the upstream source excerpt so the next reader does not re-derive it.
- Only `SetupKey` is affected — `group_controller.go` has a single return path and always patches,
  matching the live survey that found just the one edited SetupKey lagging.

## 9e. A blocker that was neither planned nor mine: DiskPressure on both clusters

Surfaced while testing 9d — the reconciler Job sat `Pending` with
`0/1 nodes are available: 1 node(s) had untolerated taint(s)`. Both clusters carried
`node.kubernetes.io/disk-pressure:NoSchedule` and `DiskPressure=True`: the known shared-OrbStack-disk
failure mode, where the two vind clusters sit on one 79 GB filesystem and crossing ~85% taints
BOTH at once and stops all pod creation.

What actually reclaimed it, in order of yield — and the first attempt was the wrong one:
`docker builder prune -af` freed only 36 MB, because it targets the DEFAULT builder. The space was
in a **buildx** builder's state volume: `buildx_buildkit_netbuilder0_state` at **16.8 GB**, freed
with `docker buildx prune --builder netbuilder -af`, plus 1.36 GB of dangling volumes. Volumes
38.63 GB → 20.46 GB, disk 85% → 77%, and `DiskPressure=False` with the taints cleared on both
clusters within a minute. Worth remembering that `docker system df` reports that cache under
"Local Volumes", not "Build Cache", so it does not look like reclaimable cache at a glance.

## 9f. A demolition-era regression found while preparing 11.3 (added 2026-10-06)

Not a planned task. Found by asking what 11.3's safety net actually is before running it — the
answer was "the hourly OpenBao Raft snapshot in S3", and that snapshot had been **silently failing
for ~40 hours**, since the ESO→VSO migration (`88661d67`) that this change's demolition phase
carried out.

**The defect.** `apps/secret/src/config/vaultstaticsecret-openbao-backup-s3.yaml` wrote its VSO
transformation templates in the Helm-escaped form `'{{ ` + backtick + `{{ get .Secrets "x" }}` +
backtick + ` }}'`. That form is correct inside a chart's `templates/` directory, where Helm has to
be told to emit the braces rather than evaluate them — and the sibling file
`apps/network/src/external-dns/templates/vaultdynamicsecret-external-dns.yaml` is escaped that way
*correctly*, which is presumably where it was copied from. But **`apps/secret/src/config/` has no
`Chart.yaml`**: Fleet applies it as raw manifests and nothing Helm-renders it. VSO is then the only
template engine in the path, so it evaluated the OUTER action, read the backticks as a Go raw string
literal, and wrote the template TEXT into the Secret:

```
S3_HOST={{ get .Secrets "endpoint" | trimPrefix "https://" | trimPrefix "http://" }}
```

**Why it stayed invisible, which is the part worth keeping.** Every layer reported success. The
`VaultStaticSecret` was healthy — it *did* produce a Secret with all five keys. The CronJob ran on
schedule. Only the Job's log showed the failure, and only obliquely: s3cmd retrying forever against a
hostname made of template text, in a message that lowercases the URL (`.secrets`, `trimprefix`) so
it does not even grep like the source. A Helm-escaping mistake is normally a render-time error; this
one is a *successful render of the wrong thing* by a second engine downstream, so there is no error
anywhere to find.

**Fix + verification.** Dropped the outer escaping so the raw manifest carries the VSO expression
directly, matching the two working siblings in the same directory, and added a header stating the
rule (this bundle is raw manifests — do not Helm-escape) with the failure mode spelled out. After
`moon run secret:apply` the Secret holds real values, and `moon run secret:backup` uploaded a
**54 199 085-byte snapshot** to `s3://enigma-s3-backup/openbao/` and resumed retention pruning
(five stale September snapshots deleted). Last good snapshot before the fix: 2026-10-04 ≈ 1200.

**Blast radius checked, not assumed.** A sweep of *every* Secret on *both* clusters for unrendered
`{{` matched exactly these five keys and nothing else, so the Cloudflare/NetBird/mesh-TLS paths
were never affected — the one casualty was the backup, i.e. precisely the thing 11.3 depends on.

**Two unrelated observations from the same sweep, recorded but NOT fixed here** (neither belongs to
this change; both want their own look):
- `omada-backup` (network cluster) last ran **2026-10-02 01:17 UTC** and has missed four nightly
  runs since. No Job objects were created for them, so the CronJob controller skipped the schedule
  outright rather than failing a pod — consistent with its tight `startingDeadlineSeconds: 120`
  colliding with the 9e DiskPressure window. The Omada controller's device/site state is what this
  protects, so it matters for any future network-cluster cold start.
- `omada-mesh-watchdog` and `openbao-mesh-watchdog` each logged three consecutive
  `error: timed out waiting for the condition` runs ~45–60 min before this session and then went
  green on their own. The timeout is the rollout wait *after* a restart, not the detection logic
  from 8a, so the watchdog fired as designed and the data plane was simply slow to become ready.

## 11. Integration verification

Cross-cutting checks only; each group above landed its own tests and docs.

**Results (2026-10-06) — 11.1 and 11.2 PASS.**

- **11.1 PASS.** `moon run :fleet_build` builds all 30 bundles (7 platform + 11 secret + 12
  network) with no stale umbrella pins, and `moon run platform:fleet_build_gitrepo` reports the
  `apps` GitRepo path within the 3145728-byte Bundle limit.
- **11.2 PASS.** `bin/fleet-lint-targets` 30/30 ok (every bundle carries its terminal
  `doNotDeploy` catch-all, including the new `netbird-account`), and `trunk fmt` + `trunk check`
  are clean over 230 modified files.
- **11.4 PASS — every scenario in `specs/mesh-service-exposure/spec.md` holds.** Requirement by
  requirement, with the method that produced each:

  | requirement | result |
  |---|---|
  | Flat mesh hostname per service | `openbao`/`omada` resolve via the mesh resolver to their peer addresses; names carry no cluster or namespace label |
  | Each service owns its full port space | both `openbao` and `omada` answer on **:443** at their own addresses with no arbitration; `:10443`/`:10080` closed on both; omada 7/7 raw TCP (29811–29817) |
  | Raw TCP and UDP alongside HTTPS | Envoy bound to exactly the **11 declared sockets** (443, 29811–29817, 19810, 27001, 29810) and nothing else |
  | Publicly-trusted certificate | all three serve `CN=*.vpn.blueora.ng`, SAN `['*.vpn.blueora.ng']`, issuer Let's Encrypt `YR2`, validated against the **default trust store with no override** |
  | Hostname does not resolve publicly | all three return nothing from `1.1.1.1` |
  | No wildcard makes mesh names public | `*.blueora.ng` empty; no `_acme-challenge` TXT residue |
  | Enrolled peer outside the allowed groups is denied | `jwks-network` DENIED from the Mac (`homelab`/`roaming`; source is `secret-k8s` only); `omada` DENIED from `network-k8s` |
  | Undeclared port is not reachable | `8043`, `8088`, `8843`, `9999` all refused on `omada.vpn.blueora.ng` |
  | Stable identity across replacement | rollout went 1 → **0** → 1 peer; never 2, never two DNS answers |
  | Recovery from a wedged client | a watchdog per exposure, all three selecting on the **Gateway** name (8a's fix) |
  | Cross-cluster consumption | fresh JWT login + 10/10 VSO objects after a forced re-auth |
  | Non-peer consumer keeps end-to-end TLS | the raw-TCP socat relay validates the service's own certificate |
  | Devices that cannot join keep a separate path | `omada.blueora.ng` 11/11 assertions |
  | Single declarative unit / fails fast | one values file renders **15** resources incl. HTTPRoute + 2 TCPRoute + 2 UDPRoute, zero shifted ports; empty `name` or `domain` errors instead of rendering |

  **The sharpest single result** is the port-space pair: `8043`/`8088`/`8843` are OPEN on
  `omada.blueora.ng` and REFUSED on `omada.vpn.blueora.ng`. Same backend, two names, genuinely
  independent port spaces — which is the requirement in its most falsifiable form.

  **UDP was verified from the RECEIVING end**, per 7.9's finding that `nc -zu` is vacuous. Sending
  5 datagrams to each of the 3 declared UDP ports moved Envoy's counters
  `udp.service.downstream_sess_rx_datagrams` 12 → **27** (+15, exactly what was sent) and
  `downstream_sess_total` 3 → **6** (+3, one session per declared port). The Envoy container is
  distroless, so the admin interface was reached by `kubectl port-forward`, not `exec`.

  **A METHOD CORRECTION that this task's own wording invites, and that cost two wrong conclusions
  before it was spotted — worth more than any single PASS above:**
  * **`jwks-network` cannot be verified "from the Mac" at all, and that is the spec working.**
    NetBird's DNS is **policy-scoped**: a peer with no policy access cannot even RESOLVE the name
    (`wget: bad address`), let alone connect. The Mac is not in `secret-k8s`, so this one has to
    be checked from an allowed peer — done from the `jwks-gateway` forwarder pod, where it
    resolves and validates its certificate with default trust.
  * **macOS caches the system-resolver answer across a rollout, and the stale entry looks exactly
    like a broken service.** After rolling `omada-mesh`, `curl` reported `http=000` for minutes.
    It was trying `100.65.25.111` — the PREVIOUS pod's peer — while the mesh resolver correctly
    returned the new `100.65.70.129`. `curl --resolve` to the live address returned
    `http=200 ssl_verify_result=0` immediately. Nothing was wrong with the service.
    *Two conclusions were drawn and then disproved along the way, recorded so the next reader does
    not repeat them:* (1) `transport_socket: dummy.transport_socket` with an empty
    `common_tls_context` looked like a mis-translated `BackendTLSPolicy` — it is simply Envoy
    Gateway's normal name for the generated upstream socket, identical in working and
    "broken" states; (2) an Envoy Gateway control-plane restart appeared to fix it — coincidence,
    since the failure recurred with the control plane freshly restarted. **Always re-resolve
    through `dig @100.65.255.254` (or `--resolve` to the live peer) before concluding anything
    about a mesh service after a rollout.**
- **11.5 DONE, and two of the three files turned out to need a banner rather than a rewrite.**
  * `apps/secret/CLAUDE.md` is a LIVING doc and got real corrections: the Crossplane-only list
    now names `vault-secrets-operator` (not `external-secrets`) plus the snapshot role and the
    plugin configs; the Fleet-targeting warning now says the collision is not always a Kubernetes
    object (`netbird-account` reconciles account-global state, so a second cluster would flap the
    NetBird account itself) and adds the terminal-`doNotDeploy` rule; and the `jwt-network` note
    no longer says "over the tailnet" — it describes the real path (mesh hostname → CoreDNS
    override → pinned ClusterIP → raw-TCP socat relay) and *why* both horizons ending at the same
    certificate is what lets verification stay on. A new bullet states the invariant that explains
    the whole arrangement: **OpenBao must never become a mesh client** (failurePolicy: Fail webhook
    + the operator's PAT dependency = cold-start deadlock), which is also why this cluster's VSO
    reaches OpenBao over a plaintext ClusterIP and why the certificate chain stays acyclic.
  * `apps/network/SPEC.md` and `apps/network/PLAN.md` are ARCHIVED specs for a long-superseded
    migration — Terranetes → Crossplane with **Tailscale** ACLs, ESO, a root `VAULT_TOKEN` in
    `.env`, and Percona-generated MongoDB credentials. Essentially every premise has since been
    replaced, so rewriting them as current-state docs would be fiction; they are change records,
    and `openspec/changes/` is where current plans live. Each now opens with a **SUPERSEDED**
    banner carrying a was/is table and — what 11.5 actually asks for — a one-paragraph statement
    of the single exposure model, naming explicitly that the reverse proxy and the
    `NBRoutingPeer`/`NBResource`/`netbird.io/expose` path are **gone, not deprecated**, bar the
    documented Omada device exception and the routing peer that forwards it. Both point at the
    current sources of truth.
  * **One genuinely stale CURRENT statement was found and fixed** by the task's own verification
    criterion: `apps/platform/src/netbird-operator/values.yaml` justified
    `allowAutomaticPolicyCreation: true` by the `netbird.io/expose` annotation flow — which no
    longer exists anywhere in the repo. 9.9 established the real reason (the explicit
    `NBResource/omada-devices` declares `policyName` + `policySourceGroups` and the operator mints
    the device path's policy from them; a standalone `NBPolicy` creates nothing on v0.7.0), so the
    comment now says that, and records that the flag's blast radius is now one resource rather
    than every annotated Service.
  * Verified: no file presents the reverse-proxy or `NBResource` mesh path as current. The
    remaining `netbird.io/expose` hits are all explanatory ("rather than inferred from…",
    "the OLD … path, which is gone") or inside the SUPERSEDED banners.

- [x] 11.1 Run `moon run :fleet_build` and `moon run platform:fleet_build_gitrepo`; verify no stale umbrella pins and the GitRepo catch-all bundle stays under 3 MiB
- [x] 11.2 Run `bin/fleet-lint-targets` and `trunk fmt && trunk check`; verify both pass with no findings
- [ ] 11.3 Full cold-start proof: `moon run secret:stop && moon run secret:start`, then `moon run network:stop && moon run network:start`; verify every service comes up with no manual intervention beyond the existing seal-key and operator-PAT seeding — **BLOCKED ON A SCOPE DECISION, not on execution (see 11a). As phrased it cannot pass: OpenBao's kv values and the Omada controller's state are both in-cluster-only with human-driven restores, and the Omada restore runs through the same UI credential 7.11 waits on. Options (a)/(b)/(c) in 11a**
- [x] 11.4 Re-run the complete spec verification matrix from the Mac across all three services (mesh resolution, public non-resolution, certificate validation, declared ports reachable, undeclared port refused); verify every scenario in `specs/mesh-service-exposure/spec.md` holds
- [x] 11.5 Update `apps/network/SPEC.md`, `apps/network/PLAN.md` and `apps/secret/CLAUDE.md` to describe the single exposure model; verify no doc still describes the reverse-proxy or `NBResource` mesh path as current

## 11a. Why the last three tasks are all blocked on the same thing (added 2026-10-06)

7.11, 7.12 and 11.3 are the only open tasks, and they turn out to share one gate. Written out
because the shape is not obvious from the task text: 11.3 looks independent of the Omada
migration, and it is not.

**Current live state, re-measured before concluding anything.** All 7 devices are Connected:
`disconnect_time` is 0 for every one of them, `health_score` 9–10, and the newest
`deviceevent_2026w41` entries are seven `Adopt success` lines at 12:29 / 13:44–13:45 UTC with
**zero `Disconnected` events after them** — a 43-minute clean soak against a ~8-minute inform
timeout, so "Connected" is credible rather than just freshly adopted (the `last_seen` trap from
7b). The two-name annotation (`omada.blueora.ng,omada.network.vgijssel.nl`), the host-type
`NBResource` (`10.96.0.20/32`) and the dropped `startingDeadlineSeconds` are all live on the
cluster, matching git. Nothing is on fire; the blockers below are about what cannot be *finished*.

**7.11 — the UI credential really is the gate, and unlike 7.6/7.10 there is no MongoDB
side-channel.** 7b's lesson was that two tasks sat blocked on a credential that was never on the
critical path, because `omada.device` answered the question directly. So the same avenue was
tried here first, and it closes:
- A full-database sweep for `vgijssel`/`blueora` across every collection returns **exactly one**
  hit, and it is unrelated (a `landns` record for `rancher.vpn.blueora.ng`). The inform hostname
  the devices hold is nowhere in the controller's database.
- `systemsetting`, `globalsetting`, `omadac`, `cloud_access`, `maintenanceomadacsetting`,
  `commonsitesetting`, `sitesetting*` carry no controller-hostname field at all, and a sweep for
  field names matching `inform|controller_host|mgmt_url|access_addr` matches nothing.
  `omada.device` documents have no inform/mgmt URL either — `adopt_info` is credentials plus
  `sp_token`, `echo_server` is `0.0.0.0`.
- Not on the filesystem either: `grep -rI` over the controller's `properties/` and `data/` finds
  neither name, and its environment carries only ClusterIPs.
So the setting is not persisted anywhere readable, which means it cannot be written out-of-band
either — and even if a field were found, a raw DB write would not bump the device config version
that makes the controller *push* the new target, so it would be unverifiable by construction.
The remaining path is the controller's own API or UI, both of which need the admin login.
**Checked that the login is not already in the stack: OpenBao's kv holds `cloudflare`,
`mesh-tls`, `mongodb`, `netbird`, `netdata`, `pikvm`, `s3-backup` — no Omada controller
account.** So this needs the maintainer, as the task says.

**7.12 is gated on 7.11** and its removal criteria are already recorded in the annotation's own
comment in `service-omada.yaml`, so nothing is lost by leaving it until the push has happened.

**11.3 CANNOT PASS AS WRITTEN, and this is a finding about the task rather than a blocker to work
around.** Its completion criterion is "no manual intervention beyond the existing seal-key and
operator-PAT seeding". Two pieces of state in these clusters are in-cluster-only with a
human-driven restore, so a cold start needs strictly more than that:

1. **The Omada controller.** `network:stop` deletes the vind vcluster and with it the PSMDB
   volumes and the controller's data PVC — i.e. the admin account, the site config (VLANs,
   SSIDs, static routes) and all 7 devices' adoption state. Nothing in `apps/network/src/omada`
   restores it: `grep -rni "restore\|mongorestore"` over `apps/network/src` matches only comments
   pointing at the UI (`Settings > Backup & Restore`). The S3 `.cfg` autobackup is a *portable*
   artifact, which is exactly why it was chosen — but it is restored **through the controller UI**,
   so recovery lands on the same credential 7.11 is waiting for, after first completing the setup
   wizard on a blank controller. A device fleet that just took 22 h to recover would be
   re-adopting again.
2. **OpenBao's kv.** `secret:stop` destroys the Raft volume. `start` reseeds only the seal key
   (from 1Password) and lets Crossplane re-create mounts, auth backends, policies and roles — but
   `mount-kv.yaml` creates the *mount*, and nothing populates it. Every kv **value** is
   human-seeded (that is what `secret:forward`'s header describes), so the mesh wildcard,
   the Cloudflare credential, the MongoDB password, the NetBird PAT and the S3 keys all come back
   empty, and every consumer downstream of them fails. The hourly Raft snapshot is the answer,
   but restoring it is a deliberate manual DR drill (same seal key, re-auth through the restored
   admin role).

So 11.3 as phrased measures something the system does not currently claim. Three honest options,
for the maintainer to choose:
- **(a) Re-scope 11.3 to the secret cluster plus a kv-snapshot restore step**, counting the
  documented DR restore as expected intervention rather than a failure. Proves the Fleet/mesh
  bring-up, which is what this change actually touched, without betting the home network on it.
- **(b) Do 7.11 first, then run the full 11.3** with a `mongodump` of the `omada` database taken
  immediately beforehand and restored into the fresh cluster's MongoDB *before* the controller
  starts — which would skip the wizard and the UI entirely, and is the only non-UI Omada restore
  path that exists. Needs building and rehearsing; it is new work, not part of this change.
- **(c) Add automated restore** (kv seeding from 1Password; an Omada `mongorestore` init step) so
  the criterion becomes true. Largest scope, and properly its own change.

Not chosen here: running `network:stop` on a fleet whose only restore path is behind a credential
this session does not have.

**DECIDED 2026-10-06 with the maintainer: option (b), run as a JOINT DR drill** — the human holds
the Omada UI, the AI drives everything scriptable, and the runbook below interleaves the two. The
drill is the deliverable: 11.3 passes as "cold start + a documented, rehearsed restore", with the
restore steps counted and named rather than discovered mid-outage.

## 11b. Joint DR runbook for 11.3 (+ 7.11 / 7.12), authored 2026-10-06

Steps are tagged **[AI]** or **[HUMAN]**. Order matters: 7.11 comes BEFORE the network cold start,
because the Omada restore path runs through the same UI the migration needs, and doing the
hostname push first means the recovered fleet has one inform target instead of two.

Hard prerequisites, both already true at authoring time: the OpenBao seal key in 1Password is
UNCHANGED (a Raft restore into a differently-sealed OpenBao is unrecoverable), and the hourly
snapshot pipeline works again after 9f.

### Phase 0 — safety net, before anything is destroyed

- [AI] 0.1 `moon run secret:backup`; record the object name and byte size from the job log.
- [AI] 0.2 Take an INDEPENDENT local snapshot that does not depend on S3 credentials surviving:
  `secret:get_openbao_auth`, then `bao operator raft snapshot save` inside `openbao-0` and
  `kubectl cp` it to the scratchpad. S3 is the archive; this file is the thing the restore reads.
  (The `admin` role is required — the `snapshot` role is read-only on one path, and `crossplane`
  has no raft grant at all.)
- [AI] 0.3 `mongodump` the `omada` database out of the network cluster. This is the only non-UI
  Omada restore path that exists, so it is the fallback if the `.cfg` restore misbehaves.
- [AI] 0.4 Record a known-good inventory to compare against afterwards: `bao kv list kv` plus each
  path's KEY NAMES (never values), the three mesh peers, every `Certificate`/`Gateway` condition,
  and the 7 devices' `last_seen`/`disconnect_time`/`health_score`.
- [AI] 0.5 Check OrbStack VM disk headroom BEFORE starting (9e: >85% full gives DiskPressure on
  both clusters at once, and the netbird webhook's `failurePolicy: Fail` then deadlocks cold
  start). Reclaim buildx builder volumes if needed.
- [HUMAN] 0.6 In the Omada UI: confirm Auto Backup is enabled, take a manual backup now, and
  confirm it appears under Settings > Backup & Restore. Then [AI] trigger the `omada-backup` Job
  so the fresh `.cfg` reaches S3, and keep a local copy.

### Phase 0 RESULTS — executed 2026-10-06 14:40–14:43 UTC, all [AI] steps done

Nothing destructive has happened. Artifacts are in this session's scratchpad under `dr-11.3/`;
**copy them somewhere durable if the drill spans sessions**, because that directory does not
outlive the session (S3 still holds the OpenBao snapshot either way, but not the Mongo dump).

- **0.5 found the first real problem, before anything was touched.** The OrbStack VM disk was at
  **82% / 13.0 GB free** — inside one bad build of the 85% DiskPressure threshold that took out
  both clusters in 9e, and a cold start of both clusters is exactly the image-churn that would
  cross it. Pruned unused images + buildkit cache (5.1 GB) → **60% / 29.6 GB free**. Measured, not
  assumed: `du` over the volumes shows the two `vcluster.cp.*.var` volumes ARE the clusters
  (10.4 GB network + 6.6 GB secret), so Phase 5 frees ~10 GB before it re-pulls. The buildx state
  volume named in the 9e memory is only 3.9 MB this time; the earlier `df` line that appears to
  show it at 74 GB is the underlying filesystem, not the volume.
- **0.1** `s3://enigma-s3-backup/openbao/bao_2026-10-06-1440.snapshot`, 54 852 816 bytes.
- **0.2** Independent local copy: 54 850 420 bytes, sha256 `af17207f…55676d`, verified identical
  inside the pod and on the Mac. Taken with the `admin` role (`snapshot` is read-only on one path,
  `crossplane` has no raft grant) and the in-pod temp file removed afterwards.
- **0.3** `mongodump` of `omada`: **383 collections**, 584 037-byte archive, sha256
  `32b2535c…849d60`, verified both sides.
- **0.4 baseline, all green.** Both clusters: **33 bundles, zero not-Ready, zero pods outside
  Running/Completed.** kv holds 7 paths / 15 keys (`cloudflare`, `mesh-tls`, `mongodb`, `netbird`,
  `netdata`, `pikvm`, `s3-backup` — captured via `kv/subkeys/<path>`, which returns the key NAMES
  without the values). All three mesh sidecars `Management: Connected` + `Signal: Connected`.
  Certificates `Ready` (`mesh-wildcard`, `omada-blueora-ng`), Gateways `Programmed`
  (`openbao-mesh`, `omada-mesh`, `jwks-network-mesh`), 7 TCPRoutes + 3 UDPRoutes + the
  `omada-https` `BackendTLSPolicy` all present. Devices: **7/7 `disconnect_time` 0, `health_score`
  10**, no `Disconnected` events since the 13:45 recovery.
- **A resolution result worth not misreading during the drill:** from the Mac,
  `openbao.vpn.blueora.ng` → `100.65.249.230` and `omada.vpn.blueora.ng` → `100.65.70.129`, both
  empty on `@1.1.1.1`; `omada.blueora.ng` and `omada.network.vgijssel.nl` both → `10.96.0.20`
  publicly, as the transition intends. **`jwks-network.vpn.blueora.ng` correctly does NOT resolve
  from the Mac** — NetBird DNS is policy-scoped and that exposure admits only `secret-k8s`, so a
  `homelab` peer cannot resolve it. Do not chase this as a fault after the cold start. Its real
  end-to-end check is OpenBao's `auth/jwt-network/config` (`jwks_url` set, `jwks_ca_pem` correctly
  absent) plus the network cluster's 10 VSO resources (6 static + 4 dynamic) syncing with zero
  warning events — which is the cross-cluster leg proving itself.
- **One stale comment fixed, because it would mislead precisely during Phase 3/4.**
  `apps/secret/src/openbao-config/policy-admin.yaml` claimed self-init seeds the `admin` policy
  "so break-glass works even before/without Crossplane". It does not: the `initialize` stanza
  seeds exactly the four `crossplane` foothold items, so on a fresh cluster
  `secret:get_openbao_auth` fails until Crossplane reconciles `policy-admin` + `role-admin`. Not a
  deadlock (provider-vault needs nothing from kv), but an operator trusting that comment during a
  DR would conclude OpenBao was broken. Header now states the real ordering.

**Remaining before Phase 1: 0.6 only, which is [HUMAN].**

### Phase 1 — 7.11, the device migration (human-gated)

- [HUMAN] 1.1 Omada UI → Controller Settings → set Controller Hostname/IP to `omada.blueora.ng`
  and save, so the controller pushes the new inform target to all 7 devices.
- [AI] 1.2 Verify the push from MongoDB, not the UI: `disconnect_time`/`last_seen` per device plus
  `deviceevent_<isoweek>`. Liveness is `last_seen > disconnect_time` AND no fresh `Disconnected`
  events — never "last_seen younger than N minutes", which measures *recently adopted* (7b).
- [AI] 1.3 Soak longer than the controller's ~8-minute inform timeout before calling it Connected.
- [HUMAN] 1.4 Power-cycle one device (an AP is the cheapest) — 7.11 explicitly asks for
  power-cycle survival, which is what proves the new target is persisted device-side.
- [AI] 1.5 Verify that device logs `Adopt success` and stays Connected through another soak.

### Phase 2 — 7.12, retire the old name

- [AI] 2.1 Drop `omada.network.vgijssel.nl` from `service-omada.yaml`'s external-dns annotation
  (and collapse the TRANSITIONAL comment block), `moon run network:apply`.
- [AI] 2.2 Verify `dig +short omada.network.vgijssel.nl @1.1.1.1` is empty (external-dns runs
  `policy: sync`, so removal withdraws the record) and 7/7 stay Connected across a soak.
  **This is the step that caused the 22-hour outage last time** — if any device drops, re-add the
  name, re-apply, and stop: it means the push in 1.1 did not take.

### Phase 3 — secret cluster cold start

- [AI] 3.1 `moon run secret:stop` then `moon run secret:start`.
- [AI] 3.2 EXPECTED, not a failure: OpenBao self-inits with the same static seal key but an EMPTY
  kv, so VSO secrets, the mesh wildcard, the Cloudflare credential and the NetBird PAT are all
  missing and their consumers are failing. Record the failure set — it is the measurement.
- [AI] 3.3 Confirm `secret:get_openbao_auth` starts working only once Crossplane has reconciled
  `policy-admin`/`role-admin` (self-init does not seed admin; see that file's header).

### Phase 4 — OpenBao restore

- [HUMAN] 4.1 Explicit go/no-go before overwriting the fresh OpenBao with Phase-0's snapshot.
- [AI] 4.2 `kubectl cp` the snapshot in and `bao operator raft snapshot restore -force`. `-force`
  is required because the fresh node has a different cluster id; the restore works at all only
  because the seal key is identical.
- [AI] 4.3 Re-auth and diff `bao kv list kv` + per-path key names against the 0.4 inventory.
- [AI] 4.4 Roll the consumers that cached failures (VSO, cert-manager, netbird-operator,
  crossplane provider) and let the mesh exposures reconcile.
- [AI] 4.5 Verify the secret half end to end: `openbao.vpn.blueora.ng` resolves **via
  `dig @100.65.255.254`** (the macOS system resolver serves dead peer IPs for minutes after a
  rollout — two prior red herrings came from trusting it), serves the shared wildcard with no
  `-k`, Gateways `Accepted`+`Programmed`, Certificates `Ready`, all watchdogs green.
- [AI] 4.6 `moon run secret:backup` again, to prove the backup pipeline itself survived the
  restore. Count and name every intervention Phases 3–4 needed; that list IS 11.3's result.

### Phase 5 — network cluster cold start

- [HUMAN] 5.1 Go/no-go. This destroys the controller, MongoDB and the adoption state of all 7
  devices; the LAN keeps forwarding (devices forward independently of the controller) but nothing
  is manageable until the restore completes.
- [AI] 5.2 `moon run network:stop` then `moon run network:start`.
- [AI] 5.3 Restore Omada. Prefer `mongorestore` of the Phase-0 dump into the fresh PSMDB with the
  controller pod scaled to 0, then scale back — it skips the setup wizard entirely and is the only
  path that does not need the UI. Fall back to [HUMAN] completing the wizard and restoring the
  `.cfg` through Settings > Backup & Restore.
- [AI] 5.4 Verify 7/7 Connected by the Phase-1 method, plus a power-cycle soak.
- [AI] 5.5 Verify the network cluster's mesh exposures (`omada`, `jwks-network`) and the JWKS leg
  the secret cluster depends on — the cross-cluster edge is the one 11.3 exists to prove.

### Phase 6 — record

- [AI] 6.1 Write the result into this file (what came up unattended, what needed hands, how long),
  then mark 7.11 / 7.12 / 11.3 only for what actually passed.

## 12. One hostname for everything: the LAN device path moves onto `omada.vpn.blueora.ng`

**Decided 2026-10-06 with the maintainer.** The device fleet stops using a parallel, publicly
named hostname and joins every other consumer on `omada.vpn.blueora.ng`. This supersedes 7.11 and
7.12, whose target was the now-retired `omada.blueora.ng`, and it amends two requirements in
`specs/mesh-service-exposure/spec.md` (public non-resolution becomes a per-service opt-in; the
"devices keep a separate path" requirement is replaced by "devices reach the service at the mesh
hostname"). The point is not aesthetic: it deletes a whole parallel mechanism — see 12.10.

**The architecture.** The devices resolve `omada.vpn.blueora.ng` from PUBLIC DNS to the mesh peer's
CURRENT overlay address, and reach that address because the LAN gateway routes `100.65.0.0/16` to
the PiKVM routing peer. Mesh peers keep resolving the same name through NetBird's own resolver and
are unaffected. One name, one certificate, one port space, one code path.

**Measured evidence this rests on, so a future reader does not have to re-derive it:**

- **Peer-IP churn is days, not hours.** The 3.3–7.7 h figure measured during group 5–7 work was
  dominated by chart iteration (`openbao-mesh` re-registered 6 times in 24 minutes on 2026-10-05).
  The honest baseline is a long-lived in-cluster peer nobody is editing: `jwks-gateway`, **13
  registrations in 71.9 days = 0.18/day, bursty across only 9 distinct days**. `router` is the
  pessimistic bound at 2.0/day (the watchdog restarts it). So a sub-minute update path is ample.
- **The routing half already works end to end, verified live on the PiKVM.**
  `100.65.0.0/16 dev wt0 proto kernel scope link` sits in the MAIN routing table — the whole mesh,
  with no `NBResource` involved, which is exactly why the device path can stop declaring one.
  `ip route get 100.65.70.129 from 192.168.0.104 iif eth0` → `dev wt0`. `ip_forward=1`. NetBird's
  own `meta mark 0x1bd22 oifname "wt0" masquerade` is live and counting. And the PiKVM reaches the
  peer: `https/443 → 200` with `ssl_verify_result=0`, `tcp/29811` and `tcp/29814` open.
  **The only missing piece in the whole design is one static route**, and a `/16` covers every
  future peer address, so it never needs re-pointing — unlike the `/32` it replaces.
- **Push, not polling, and the right trigger is not a NetBird event.** The overlay address changes
  exactly when the pod starts, so "new pod" IS the event and the pod itself is the only thing that
  needs to know. NetBird Cloud does expose `/api/integrations/event-streaming` (confirmed live:
  returns `[]`, so it exists and is unconfigured), but using it would mean exposing a
  NetBird-reachable sink into the homelab to learn something the pod already knows locally.
  Rejected on attack surface.
- **`triggerLoopOnEvent` is the "force-run external-dns" knob** and the vendored chart 1.19.0
  exposes it as a documented boolean ("triggers run loop on create/update/delete events in addition
  of regular interval"). `dnsendpoints.externaldns.k8s.io` has been installed on the network
  cluster since 2026-07-24, so the `crd` source needs no CRD work.
- **Writing straight to Cloudflare from the pod was considered and rejected.** It is faster (~200 ms
  vs sub-minute) but puts two writers in one zone and discards external-dns's TXT ownership
  bookkeeping — the mechanism that stopped the two clusters deleting each other's records in the
  `txtOwnerId` incident. One writer is worth the seconds.
- **Everything the publisher needs is settable on the generated Envoy pod.** `EnvoyProxy`'s
  `provider.kubernetes` exposes `envoyDeployment.initContainers` (already carrying the mesh client),
  `envoyDeployment.pod.volumes`, `envoyDeployment.patch`, and `envoyServiceAccount.name`. The Envoy
  Deployment's ServiceAccount is already the predictable `omada-mesh`, so a Role can bind to it.

**Two cautions carried into the tasks below:**

1. **TTL is NOT a discriminator between the two resolvers** — NetBird and Cloudflare both answer
   `300` for these names (measured). So the precedence probe in 12.1 cannot infer which resolver
   replied from the TTL and must use a deliberately distinct synthetic address instead.
2. **This newly couples the device fleet to the Envoy mesh pod.** Today the device path terminates
   at the CONTROLLER Service (selector `app.kubernetes.io/name: omada-controller`); the mesh path
   terminates at the Envoy pod. Verified. After this change a mesh-pod outage takes the devices
   down too, where today it leaves them Connected. That is the real price of one hostname, it is
   accepted deliberately, and it is what makes 12.11 a required test rather than a nice-to-have.

**Results (2026-10-06) — 12.1–12.4 and 12.11 DONE. Three defects found on the way, all fixed.**

- **12.1 GATE: PASS, decisively.** With `pikvm.vpn.blueora.ng -> 192.0.2.1` live in Cloudflare
  (confirmed from `1.1.1.1` AND `8.8.8.8`), the overlay address came back from *every* consumer
  that matters: the Mac's **system** resolver (`dscacheutil`, and `ping` resolved it the same way
  — not just an explicit `dig @100.65.255.254`), an in-cluster peer's resolver, and an ordinary
  non-peer in-cluster pod. NetBird's match-domain wins; publishing changes nothing for peers.
  Probe record deleted, zone re-listed to confirm no `vpn.blueora.ng` residue, and the OpenBao
  Cloudflare lease revoked.
  *Design note the gate forced:* **TTL is useless as a discriminator** — NetBird and Cloudflare
  both answer `300` — which is why the probe used a synthetic unroutable address instead, and why
  `pikvm` was chosen as the subject: a real, stable peer label that nothing addresses by name.
  *Incidental finding, recorded so nobody depends on it:* the non-peer pod resolved the mesh name
  only because cluster CoreDNS `forward . /etc/resolv.conf` chains to the vind node → OrbStack →
  the MacBook's resolver, which carries NetBird's match-domain. That is an artifact of running on
  the laptop and will NOT hold on an always-on cluster.
- **12.2 DONE.** external-dns now runs `Sources:[service crd]` with `UpdateEvents:true` and
  `MinEventSyncInterval:5s` (confirmed in its own startup config dump). No RBAC work was needed —
  the chart's `clusterrole.yaml` grants `dnsendpoints` automatically when `crd` is in `sources`.
- **12.3 DONE.** The chart gained `publicDns` (default off), a `public-dns` native sidecar that
  reads `wt0` **in its own pod** and upserts the `DNSEndpoint`, a `preStop` that deletes it, and a
  Role/RoleBinding on the Envoy ServiceAccount (pinned via `envoyServiceAccount.name`, which Envoy
  Gateway already defaults to the Gateway name). Opt-out verified: `publicDns.enabled: false`
  renders zero DNS objects, zero RBAC, zero extra containers and no extra volume.
- **12.4 DONE and serving.** `public-dns: omada.vpn.blueora.ng -> 100.65.154.81`, external-dns
  logged `action=CREATE record=omada.vpn.blueora.ng ttl=60 type=A` plus its ownership TXT, and the
  name now returns the same address from `1.1.1.1`, `8.8.8.8`, the NetBird resolver and the
  DNSEndpoint. The withdraw path was also exercised for real: on teardown the preStop deleted the
  DNSEndpoint and external-dns (`policy: sync`) removed the public record.
- **12.11 DONE — and this is the number the whole design hinges on.** Before any tuning, a
  `rollout restart` left the hostname resolving to NOTHING for **~6-7 minutes**. Envoy's drain was
  not the cause (`drain sequence completed` 11s in, zero downstream connections); the pod sat
  Terminating for the whole of Envoy Gateway's default **360s** `terminationGracePeriodSeconds` and
  was killed at the deadline, and Recreate will not start the replacement until it is gone — so
  the deadline WAS the rollout duration. Against the controller's ~8-minute inform timeout that is
  no margin at all. Bounded the drain (`shutdown.drainTimeout: 10s`, `minDrainDuration: 2s`) and
  sized the grace period to it (45s, via the `envoyDeployment.patch` escape hatch — EnvoyProxy has
  no first-class field). **Re-measured: old pod gone t+54s, record repointed AND serving `200`
  with a valid certificate t+81s.** ~6x inside the device budget instead of grazing it.

**Three defects found while doing this, none of them in the plan:**

1. **`bin/fleet-apply` shipped a STALE subchart, so the first two applies deployed nothing.**
   `fleet apply` resolves umbrella `file://` deps only when `charts/` is absent, and `Chart.lock`'s
   digest covers the dependency *declaration*, not its *content* — so editing the shared chart
   changed neither and the old tgz kept winning, with Fleet correctly reporting
   `unchanged (bundle)`. The sting: `bin/fleet-build` already deletes `charts/` before building for
   exactly this reason, so **the verify path was rebuilding while the apply path was not** — the
   check that exists to catch problems was the only thing seeing the new code. `helm template`
   passed, `moon run :fleet_build` passed, the cluster ran week-old templates. Fixed in
   `bin/fleet-apply` with the same gitignore-guarded `rm -rf charts/`.
2. **The injected SA token could not be reused, and the failure named the wrong thing.** Envoy
   Gateway sets `automountServiceAccountToken: false` on both the data-plane pod and its SA, so
   kubectl in the sidecar fell back to `localhost:8080` and failed with *"failed to download
   openapi ... dial tcp [::1]:8080"* — which reads as a networking fault and is actually a missing
   credential. The pod's existing `sa-token` volume is a trap: it is audience-scoped to
   `envoy-gateway.envoy-gateway.svc.cluster.local` for xDS, so the API server would have rejected
   it. Fixed with a hand-rolled projected volume (token + `kube-root-ca.crt` + namespace, i.e.
   exactly what kubelet's automount provides) mounted ONLY into the publisher, so the Envoy
   container still holds no API credential.
3. **THE WATCHDOG WAS RESTART-LOOPING A HEALTHY POD, and the new design made that device-visible.**
   `Daemon status: NeedsLogin` is what a healthy daemon prints in its first seconds, *identically*
   to a wedged one — same block, same "use a setup-key" hint. So one sample cannot tell startup
   from failure, and acting on it recycled a pod that was about to be fine, whose replacement was
   also young at the next tick: a self-sustaining loop. Observed three consecutive cycles
   restarting a pod that reported `Management: Connected` moments later, while the two unchanged
   exposures beside it stayed healthy — which is what localised it to pod age rather than the
   account. Also fixed `exec deploy/<x>`, which resolves to an arbitrary pod and during Recreate
   can sample the TERMINATING one. Now: newest Running pod explicitly, and a bad verdict must
   survive a re-check (`watchdog.confirmSeconds: 45`) with the same pod still selected.
   **Verified both directions live** — one cycle logged `pod changed ... skipping this cycle`
   (a false positive correctly suppressed) and another logged `dead on both samples -> rollout
   restart` (a real one still caught).
   This was pre-existing, but `publicDns` is what made it matter: every spurious restart is now a
   public DNS change the device fleet has to chase.

*One operational note: `kubectl patch cronjob ... suspend` survives a Fleet re-apply, because the
chart does not render that field and SSA will not reset what it does not manage. Suspending a
watchdog to stop a loop is therefore sticky — remember to unsuspend.*

- [x] 12.1 **GO/NO-GO GATE — does a public address record shadow the mesh resolver for peers?** Publish a public A record for `pikvm.vpn.blueora.ng` (an existing, stable peer label that nothing addresses by name, so blast radius is nil) pointing at `192.0.2.1` (TEST-NET-1 — unroutable and unmistakably synthetic, which is the discriminator since TTL is not). Then resolve that name from the Mac and from an in-cluster peer. **PASS** = both return the PiKVM's overlay address, i.e. NetBird wins and publishing changes nothing for peers. **FAIL** = stop the whole group; publishing mesh names publicly would break every peer, and the device fleet would have to keep a separate name. Delete the record either way
- [x] 12.2 Give external-dns the push path: `sources: [service, crd]`, `triggerLoopOnEvent: true`, and RBAC to read `DNSEndpoint`; verify a hand-written `DNSEndpoint` becomes a Cloudflare record in seconds rather than at the next `--interval=1m` tick, and that the existing `omada.blueora.ng` service-sourced record is untouched by the new source
- [x] 12.3 Add an opt-in `publicDns` block to the shared mesh-service chart (default **off**): a `DNSEndpoint` for `<name>.<domain>`, a second native sidecar that waits for the mesh client to report an overlay address and upserts the record, a `preStop` that deletes it, and a Role/RoleBinding on the Envoy ServiceAccount; verify a values file with `publicDns.enabled: false` renders zero DNS objects and zero RBAC, so no other exposure is affected
- [x] 12.4 Opt `mesh-omada` in, with the reason recorded in its own values; verify the rendered `DNSEndpoint` carries the live peer address and that `dig +short omada.vpn.blueora.ng @1.1.1.1` returns it
- [x] 12.5 **[HUMAN] DONE 2026-10-07, and ADDED rather than replaced — which is better than this task asked for.** Both static routes are live and enabled in the controller (`staticrouting`): `omada_gateway` = `10.96.0.20/32 → 192.168.10.2` and `omada_gateway_new` = `100.65.0.0/16 → 192.168.10.2`. Keeping both means the cutover is reversible and the fleet can move one device at a time; retiring the `/32` moves to 12.10. **The next hop is the PiKVM's VLAN 10 address, not its flat-LAN `eth0`** — worth knowing because it means the device path ingresses on `vlan10`, and `network.md`'s route table was right about this all along where 7b's note was not
- **Validation of 12.5 (2026-10-07) — every hop green, and the one risk I expected was already retired.**
  - **The ingress-interface worry is void, because the OLD route uses the SAME next hop.** `10.96.0.20/32` has always pointed at `192.168.10.2`, so device traffic has been arriving on `vlan10` and being forwarded into the mesh this whole time, with 7/7 devices Connected to prove it. The only new variable is the destination prefix, not the path.
  - **`rp_filter` was the real trap and it is clear.** A device packet arrives on `vlan10` with a source from `192.168.0.0/24`, whose reverse path is `eth0` — under strict (`1`) reverse-path filtering the kernel would have dropped it SILENTLY. Live: `all=0`, `eth0=2`, **`vlan10=2`** (loose), which accepts a source routable via any interface.
  - **Routing decision, measured for a real device source on the real ingress interface:** `ip route get 100.65.154.81 from 192.168.0.104 iif vlan10` → `dev wt0` (main-table kernel route, no `NBResource` needed), and the control `ip route get 10.96.0.20 from 192.168.0.104 iif vlan10` → `dev wt0 table 7120`. Both forward.
  - **SNAT covers it:** `netbird-mangle-prerouting` marks on `iifname != "wt0" ct state new ip saddr 192.168.0.0/24` — interface-agnostic except for the tunnel itself, so `vlan10` ingress is included — and `netbird-rt-postrouting` masquerades `meta mark 0x1bd22 oifname "wt0"`. `FORWARD` policy is `accept`.
  - **Port reachability, both paths.** NEW (`100.65.154.81`): `443` plus `29811`–`29817` all OPEN, and `8043`/`9999` correctly TIME OUT — the port-space contract holds, so the mesh peer exposes exactly what it declares. OLD (`10.96.0.20`): `8043`, `8088`, `29811`, `29814`, `29817` all OPEN. HTTPS on the new path returns **`200` with `ssl_verify_result=0`** on the real hostname.
  - **UDP proven from the RECEIVING end, since `nc -zu` is vacuous (7b).** After datagrams from the PiKVM, Envoy reports `downstream_sess_total: 3` — exactly the three declared UDP ports — with `rx_datagrams: 4` and `no_route: 0`.
  - **Envoy is bound to precisely the 11 declared sockets:** `443`, `19810`, `27001`, `29810`, `29811`–`29817` (plus its own `19001`/`19003`). **No `10080`, no `10443`** — the port-shift decision confirmed live again on the current pod.
  - **Public DNS is correct for a clean cutover, which is what the devices actually consume:** `omada.vpn.blueora.ng` → `100.65.154.81`, `omada.network.vgijssel.nl` → `10.96.0.20`, `omada.blueora.ng` → `10.96.0.20`, consistent on both `1.1.1.1` and `8.8.8.8`. All 7 devices healthy throughout; nothing has been cut over.
  - *Two probes that lie, recorded so they are not repeated:* `curl telnet://…` reported every port closed including the known-good old path, and `curl --interface <lan-ip>` does not produce a LAN-sourced packet when the route is via `wt0` — it silently falls back to the interface's own address. A locally-originated LAN-sourced packet would FAIL anyway and prove nothing, because `netbird-mangle-prerouting` only marks *forwarded* traffic, so there would be no SNAT. Use plain TCP connects from the forwarder instead: after masquerade a forwarded device packet is indistinguishable from PiKVM-originated traffic, which is what makes that the accurate simulation.
- [ ] 12.6 Verify the LAN path end to end from a NON-PEER host (not the Mac, which is a peer and would prove nothing): resolve `omada.vpn.blueora.ng` against the LAN's DNS, connect to 443 with no `-k`, and confirm a device port accepts a connection — **STILL OPEN, and deliberately not marked done: there is no non-peer LAN host this session can drive.** Every hop is validated under 12.5 and the LAN→forwarder leg is proven by the old route sharing the identical next hop and ingress interface, so the remaining gap is narrow — but it is exactly the leg only a real non-peer sender exercises, and the whole 22-hour outage came from assuming a path worked. Cheapest way to close it: open `https://omada.vpn.blueora.ng` on a phone on WiFi that is NOT a NetBird peer. Otherwise 12.8 closes it with the strongest possible evidence, since the devices themselves are non-peer LAN hosts
- [ ] 12.7 **[HUMAN] SUPERSEDES 7.11** — set the controller's Controller Hostname/IP to `omada.vpn.blueora.ng` so the push re-homes the fleet
- **Mechanism established 2026-10-07, before doing it. The field is NOT blank — the UI shows `10.244.0.249`, the controller's own POD IP, and that is a latent landmine.**
  *Correcting the first pass of this investigation, because the method was wrong in a way worth remembering:* it concluded "unset" from sweeping the DB for the two HOSTNAMES. That search could only ever find the answer it expected — an IP-valued setting passes straight through it. The maintainer reading the actual UI is what caught it. **Sweep for the FIELD, not for the value you are expecting.**
  What is actually true, after sweeping for field *names* across every collection:
  * **No persisted controller-address setting exists anywhere** — no `controllerHostname`/`inform_url`/`mgmt_addr` in any collection, nothing in `properties/`, and `omada.properties` carries only ports. The `10.244.0.249` in the UI is **auto-detected live** from the controller's own interface (`server.log`: `list local interface macs` on the `client-inform-work-group`), not stored. So it has never been explicitly configured — the substance of the first conclusion survives, but it presents as a live WRONG value rather than a blank.
  * **It is ephemeral and unroutable.** `10.244.0.x` is the vind pod CIDR; it already moved `.230 → .249` across a pod restart. The stale `.230` is still visible per-device in `connection.dst_ip` (one doc per MAC, all 7 identical) — which is the controller RECORDING the local socket address a device's inform landed on after kube-proxy DNAT, i.e. diagnostic, not configuration.
  * **The auto-detected value is NOT being pushed, proven by the fleet's own behaviour.** Devices re-adopted 7× at 07:23 today and 7× at 13:45 yesterday and stayed up; had adoption delivered `10.244.0.x` as the inform target they would have been stranded instantly. So **the inform target lives in DEVICE FLASH** — the fleet holds `omada.network.vgijssel.nl` because that is the address it was originally ADOPTED through (July), and a re-adopt is the same device redialling the address it already holds. That is the missing half of 7b's root cause: nothing in the controller was ever telling them that name, so renaming the DNS record could not possibly re-home them.
- **12.7 ATTEMPTED 2026-10-07 09:40:21Z — the setting took, the fleet did NOT move. No outage; this is a partial result, not a failure.**
  * **Accepted and persisted**, and this is what finally proves it had never been set: the key appeared for the FIRST time at `systemsetting.web_port_setting.host_name = "omada.vpn.blueora.ng"`, alongside a new `auto_refresh: false`. The same document dumped an hour earlier had NEITHER key. `server.log`: `Controller Host Name is changed to omada.vpn.blueora.ng`.
  * **No disruption whatsoever.** 7/7 still Connected, `health_score: 10`, `disconnect_time: 0`, and **zero** device events since the change — so the pod-IP landmine was defused without costing anything.
  * **But the devices are still on the OLD path, proven two independent ways.** (1) Envoy on the mesh peer reports **zero** `downstream_cx_total` on every device listener — `443`, `29811`–`29817`, `19810`, `27001`, `29810` — since the pod came up at 07:21Z; the only non-zero counters are its own readiness probe (`19003`) and admin. The stat names were verified against a full `/stats` dump first, so the zero is a real measurement and not a bad filter. (2) `server.log` shows live device sessions re-establishing **every 10 seconds** from `/10.244.0.22` to `:29814` and `:29817` — and `10.244.0.22` is `netbird/router-7968658d8c-jwphd`, the NBRoutingPeer, i.e. traffic arriving via the pre-existing routing-peer → ClusterIP path. Had a device re-homed it would arrive from the Envoy pod's address instead.
  * **Nothing was pushed.** The `configversion` counters are byte-identical before and after (`11/10, 9/8, 14/13, 9/8, 20/19, 11/10, 16/15`), consistent with the earlier finding that no `configSyncMap` section carries an inform/hostname — so this setting does not travel as a tracked per-device config push.
  * **HYPOTHESIS TESTED AND REJECTED — a reboot does NOT re-home a device.** `attic-ap` was rebooted at 09:47:00Z and logged `Adopt success` at 09:49:19Z, 2m19s later. Envoy's device listeners stayed at **zero** throughout an 18-sample / 6-minute watch, and the controller log shows **36 device channels opened in the 11:49-11:50 window, every single one from `/10.244.0.22`** (the router peer) and none from `10.244.0.24` (the mesh Envoy pod). So the device came back on the OLD inform target after a full power cycle. The address is not merely cached in a live session — **it is baked in at ADOPTION and a reboot re-reads the same stored value.** This also discharges 12.8's power-cycle criterion for the old path.
  * **FORCE PROVISION ALSO DOES NOT MOVE IT — and it was a FULL config send, not a delta.** Tested on `attic-ap` 2026-10-07 ~10:00Z at the maintainer's suggestion (correctly, since it re-pushes config without a factory reset and so cannot strand a device). The push unambiguously happened and completed: `configversion` went `current 16 → 17` / `acked 15 → 16`, `configSyncStatus` moved `3 → 4` with `ap_common 1 → 4` and then settled back to `3`/`1` — byte-identical to the untouched control device `living-room-ap`. The controller log confirms the heaviest available push: `need clearConfigHistory when send full config, remove all component`. **And the device never left the old path**: Envoy's device listeners stayed at zero across an 8-sample watch, and 197 device channels in the window all came from `/10.244.0.22`. So the inform target is not carried in the provisioned configuration at all, which matches the `configSyncMap` evidence (no section for it; `ap_common` was the plausible candidate and is demonstrably not it).
  * **FULL CONFIG SEND + REBOOT: STILL NO. The question is now closed.** The second reboot (11:14:41Z → `Adopt success` 11:16:23Z) was the discriminator between "written to flash but unused" and "never written", because it followed the full config send. Result: Envoy's device listeners stayed at **zero** across a 16-sample / 5-minute watch, and **90 device channels in the 13:16-13:20 window, all from `/10.244.0.22`**. So the new address was never written anywhere the device reads. **Three independent mechanisms tried, all ineffective: setting Controller Hostname/IP, a reboot, and a force reprovision (full config send) followed by a reboot.** The inform target is fixed at adoption and no configuration push can move it.
  * *Measurement note worth keeping, because it nearly produced a false alarm:* right after a re-adopt a device sits at **`health_score: -1` with `health_score_time` absent** — the score is simply not recomputed yet (7b saw the same `-1 → 10` settling), and `last_seen` freezes at the adopt. A quick "`disconnect_time == 0 && health_score > 0`" check therefore reports a perfectly healthy device as DOWN. Liveness is `last_seen > disconnect_time` + no fresh `Disconnected` event, corroborated by `device status change to connected` / `Device informed monitor Link UP` in `server.log`. `attic-ap` was live throughout all three tests; the fleet never dropped below 7/7.
  * **DIRECT DEVICE LOGIN IS BLOCKED WHILE ADOPTED, which closes the last no-reset avenue.** The AP's own management UI answers but refuses to manage: *"This API is being managed by Omada controller. If you want to manage the API in standalone mode, forget the API from the omada controller or reset it"* ("API" is TP-Link's typo for AP). So the field the inform URL was originally set in is read-only for an adopted device — every route to it passes through Forget.
  * **CORRECTION — the LAN *is* reachable from the Mac over the mesh, and my two probes that said otherwise were both invalid.** `ping` can never work (ICMP appears in no policy — the same class of error as `nc -zu` for UDP in 7b), and `nc -z -G3` gave a mesh round-trip to a small embedded device three seconds. With a real timeout: `192.168.0.108:80` and `:443` are **OPEN** and serve `<title>Login</title>`. The enabling config was already there: `lan-default` advertises `192.168.0.0/24` with policy `cidr-default Access` permitting source group `roaming`, which the Mac is in (`homelab`, `roaming`, `All`), and `netbird routes list` shows it `Selected`.
  * **THAT REOPENS RE-ADOPTION, which the paragraph below had ruled out.** The reason Forget looked unrecoverable was "nothing can reach a factory-reset device". That is true of the CLUSTER but not of the MAC: a reset device drops into standalone mode, its UI becomes writable, and the Mac can reach it over the mesh to set the inform URL by hand — exactly how these devices were configured originally. So the real sequence is Forget → find the device's new DHCP address → set the inform URL from the Mac → let it be adopted. Risk is per device type: **APs lowest** (a brief WiFi outage on one radio), **switches medium** (a reset switch loses VLAN config; the PiKVM's untagged `eth0 192.168.0.123` survives a default-config switch so mesh access persists, but its tagged `vlan10 192.168.10.2` may not), **the ER605 gateway highest and still worth avoiding** — Forget wipes VLANs, DHCP and both static routes at once, which is a whole-home outage window even though the Mac's PiKVM-based access does not depend on them.
  * **MIGRATION IS THE MECHANISM — IT DOES CHANGE THE INFORM URL — BUT MIGRATING TO THE *SAME* CONTROLLER LEAVES IT HALF-DONE. Tested on `attic-ap` 2026-10-07 11:41:39Z.** This is the one thing that moved the device, so the mechanism question is answered; what fails is the controller-side bookkeeping.
    - **It worked, device-side.** `server.log`: `send Ap migrateUrl to [DeviceMac(rESHwzk…)]`, a brand-new `migrate: true` field appeared on the device document, the AP stopped informing on the old path (`timeout Disconnect Device` 11:51:45Z), and then **arrived over the mesh**: `MANAGED_BY_OWN Device F0-09-0D-79-CA-D2 … is discovered` at 11:51:51Z with three channels from the Envoy pod `10.244.0.24` on exactly `29811`/`29814`/`29817`. Envoy counted them too (`downstream_cx_total: 1` per port).
    - **Then the CONTROLLER hung up.** Envoy's cluster stats name the direction unambiguously: `upstream_cx_total: 1`, `upstream_cx_destroy_remote: 1`, `upstream_cx_destroy_remote_with_active_rq: 1` — the upstream (controller) closed each connection mid-request. `downstream_cx_active` has been `0` ever since, the AP has not retried, and it is now **unmanaged**, re-timing-out (`timeout Disconnect Device` again at 12:02:05Z) while still serving WiFi.
    - **Leading explanation, consistent with every observation but not yet proven:** the controller refuses to manage a device it believes has left. It logged `migrate info: null, migrate id: aa02628f…` and `Failed update device F0-09-0D-79-CA-D2 main refer to migration may mainRefer not exist` — i.e. it set the device to "migrating" but never built a valid migration record, because the destination *is* itself. So the device dutifully arrives at the new address and is turned away. Confirming test is the fix itself: clear the migrate state and see whether it adopts over the mesh.
    - **Everything else was eliminated first, and two of my own probes were wrong.** DNS is correct from the LAN's own resolver (asking the ER605 directly: `omada.vpn.blueora.ng → 100.65.39.233`). The path is healthy (`http=200`, 2937 bytes, `tls=0`, device ports open). MTU is handled — `wt0` is MTU 1280 and NetBird installs an MSS clamp (`tcp option maxseg size > 1240 … set 1240`, 115 packets counted), so the broken-PMTUD theory is dead. The peer address did not churn (same `100.65.39.233` in NetBird DNS, public DNS and the DNSEndpoint; pod 0 restarts). **Discarded probes: `/proc/net/nf_conntrack` is UNREADABLE on the PiKVM, so three "no conntrack entries" readings were worthless rather than negative; and a bare-IP `https://<peer>/` fails instantly with `000` because the Gateway listener is bound to `omada.vpn.blueora.ng` and Envoy rejects non-matching SNI — always use `--resolve`.**
    - **So: the inform URL IS now `omada.vpn.blueora.ng` on that AP.** Recovery is to clear the migration state (UI cancel if it exists, else the `migrate` field), after which the device should adopt over the mesh and land in the intended end state. If that works it generalises to the rest of the fleet; if it does not, the repoint below does the same job with no device involvement.
  * **✅ SOLVED 2026-10-07 12:08:46Z — MIGRATE-THEN-CANCEL IS THE WORKING PROCEDURE, and the first device is live on the mesh hostname.** Cancelling the migration cleared the flag, and the AP — which was already holding the new inform URL — adopted immediately over the mesh. Confirmed from four angles:
    - `migrate` field **gone** (`undefined`), `Adopt success` at 12:08:46Z, `device status change to connected`, `health_score` recomputed `-1 → 7`, **LIVE**, and **zero** fresh `Disconnected` events across an 11-minute soak — past the ~8-minute inform timeout, so "connected" is credible and not merely freshly-adopted.
    - **Envoy proves the PATH, which is the whole point:** `listener.0.0.0.0_29814.downstream_cx_active: 1` and `29817.downstream_cx_active: 1` (totals `3`), i.e. live device-management sessions arriving through the mesh peer. Before the cancel these were `active: 0`.
    - All 7 devices LIVE throughout; the other six untouched on the old path.
    - *Reconciling an apparent contradiction, because it looks alarming and is not:* the controller log's channel-source tally still shows ~105 from the router peer and none from the Envoy pod. Those log lines are channel **teardowns** — the six old-path devices recycle their channels every ~10 s and so log constantly, whereas `attic-ap`'s mesh session is **persistent** (`active: 1`, total not climbing) and therefore logs nothing. A stable session is invisible in a disconnect-based tally.
  * **PAVED-ROAD ROUTE CHOSEN INSTEAD 2026-10-07 — a parallel controller, so BOTH migration legs are ordinary supported migrations.** The maintainer elected the supported path over the migrate-then-cancel workaround, having done site moves before. I argued against it on cost/risk grounds (a throwaway controller temporarily owning the physical fleet, two whole-site config round-trips, and an unresolved return-leg site conflict); that was overruled, which is their call, and it is built. Plan: `omada --migrate--> omada-temp` then `omada-temp --migrate--> omada`, leaving the fleet on `omada.vpn.blueora.ng` with no half-state.
    - **Deployed and verified 2026-10-07:** `apps/network/src/omada-temp` (controller, StatefulSet `omada-temp-omada-controller-0`) + `apps/network/src/mesh-omada-temp` (`omada-temp.vpn.blueora.ng`). Both bundles 1/1; `bin/fleet-lint-targets` 32/32. Peer `100.65.144.121`, Gateway `Accepted`+`Programmed`, `BackendTLSPolicy` `Accepted`+`ResolvedRefs`, DNSEndpoint published and resolving identically from NetBird **and** public DNS. **The UI works over the mesh — `http=200`, `tls_verify=0`, no redirect** — which matters because the SECOND leg is driven from this controller's UI. Device ports `443`/`29811`/`29814`/`29817` reachable from the PiKVM; `8043` correctly refused, so the port-space contract holds. Real fleet untouched: 7 devices, 7/7 live.
    - **Three design choices that avoided new infrastructure.** (1) It lives in the EXISTING `omada` namespace — a new namespace would have needed VSO `allowedNamespaces`, a `vault-secrets-operator` SA, **and** an SA subject appended to the OpenBao role on the SECRET cluster plus a secret-cluster apply, for something being deleted. (2) It serves the **shared `*.vpn.blueora.ng` wildcard on its own `:8043`**, so the mandatory `BackendTLSPolicy` hostname validation passes with no certificate issued, no DNS-01, and no throwaway name in a public CT log. (3) It reuses the `omada` MongoDB credential with its own database `omada_temp`, which required adding `dbOwner db: omada_temp` in `../mongodb/perconaservermongodb.yaml`.
    - **A latent bug found by rendering, fixed here and still present in the real bundle:** the omada-controller chart renders a **StatefulSet**, but `../omada/templates/vaultstaticsecret-mongodb-uri.yaml` sets `rolloutRestartTargets: {kind: Deployment, name: omada}` — an object that does not exist, so a rotated MongoDB password would silently never recycle the real controller. `omada-temp` uses `kind: StatefulSet, name: <release>-omada-controller`. **Deliberately NOT fixed in the real bundle mid-migration**, because correcting it would hand VSO a valid target and could trigger an immediate rollout of the live controller. Fix it after the fleet is home.
    - **REVISED to a fully separate database at the maintainer's instruction, after the first build looked like it was sharing state.** The UI presented a LOGIN rather than a setup wizard, which is the symptom of an already-configured controller. The first build gave omada-temp its own DATABASE (`omada_temp`) on the shared replica set with the shared credential; the env was correct (`EAP_MONGOD_URI` from its own secret, `MONGO_EXTERNAL=true`) and no connection from the temp pod touched the `omada` namespace — but `omada_temp` never appeared in `listDatabases`, so something was off and the shared-instance design made it hard to be certain.
      Rebuilt to use the controller's **EMBEDDED mongod** instead, which the chart selects by simply omitting both `externalMongoDBUrl` and `externalMongoDBUrlSecret` (`statefulset.yaml` emits the two mongo env vars only when one is set). That is total isolation: its own mongod process, its own storage on its own PVC, no shared credential, and **no `dbOwner` grant in `../mongodb/perconaservermongodb.yaml` at all** — the grants added for the first build were reverted. Teardown is now exact: delete the two bundles plus the two StatefulSet PVCs (`volumeClaimTemplates` are NOT garbage-collected with a bundle) and nothing is left in the real MongoDB to find later.
      **Verified after a clean rebuild** (StatefulSet + both PVCs deleted first, since `volumeClaimTemplates` are immutable): mongod running INSIDE the temp pod with its own 202 MB WiredTiger store, `EAP_MONGOD_URI` unset, and the shared replica set holding **only** `admin/config/local/omada/omada_data` — no `omada_temp`. The real controller's pod and PVCs were untouched throughout.
    - **The identity check that settles it, and the probe that does NOT.** `GET /api/info` on each, which is anonymous and needs no login:
      `omada-temp` → `omadacId: dcc8394be0b2f273fb66408241c9c882`, **`configured: false`**, `registeredRoot: false`; `omada` → `omadacId: 17b608ea14840f30610a7ed28e8d77d3`, `configured: true`, `registeredRoot: true`. Different controllers, and the temp one is genuinely unconfigured, so it serves the setup wizard.
      **Comparing the root page is worthless here and looks alarming:** both return byte-identical HTML (same sha256, 2937 bytes) because `/` is a static SPA shell served by every controller regardless of state — wizard-vs-login is decided by a later API call. Use `/api/info`.
    - **Next, and it needs the UI:** `omada-temp` is a FRESH controller (`configured: false`). So: complete the wizard at `https://omada-temp.vpn.blueora.ng/`, then run leg 1 from `omada`, then leg 2 from `omada-temp`. Teardown when done: both bundles plus the two StatefulSet PVCs — nothing in the shared MongoDB.
  * **THE PROCEDURE (workaround, superseded by the paved road above but kept because it is proven):** (1) start a device migration to `omada.vpn.blueora.ng`, which rewrites the inform URL device-side; (2) **cancel** the migration, which clears the controller-side `migrate` flag that otherwise makes it refuse the returning device; (3) the device adopts over the mesh. Non-destructive — no factory reset, no config loss, no device-side access needed. Expect a ~10-minute gap per device between step 1 and adoption, since the device must first time out on the old path (the controller's own inform timeout dominates).
  * **The procedure leaves NO residue — verified by diffing the migrated device against an untouched one of the same model.** Identical key sets in both directions (zero fields present on one and not the other, so `migrate` is fully gone, not merely false); `configSyncStatus` 3 on both; same firmware, manager version and SSID count; and a whole-DB sweep finds **no leftover migration record** (the one remaining `migrat` hit is an unrelated `auditlogglobalsetting` notification key). **And the health score was simply settling, not a mesh penalty: `-1 → 7 → 9`**, converging on the control's `10`. So the earlier concern below is resolved.
  * **Still to watch (RESOLVED — see above):** `attic-ap` settled at `health_score: 7` where the six old-path devices sit at `10`. It may be a freshly-adopted score still climbing (it went `-1 → 7`), or it may reflect the extra latency of the mesh hop. Worth re-checking before migrating the rest, and worth comparing again after a second device moves.
  * **The ER605 gateway is still the one to treat separately** — not because of this procedure, which never factory-resets, but because it is the device whose static routes carry every other device's path, so it should move last and alone.
  * **RECOMMENDED SYNTHESIS, since the two options are not exclusive:** do the legacy-name repoint FIRST (zero device touches, no reset, delivers the entire architectural goal of group 12 — Envoy in the device path, so the device `NBResource`, pinned ClusterIP and CoreDNS split horizon all become deletable). With both names resolving to the same peer, moving an individual device onto the new NAME becomes cosmetic, deadline-free and independently reversible, and **the gateway can simply stay on the legacy name indefinitely** at a cost of one extra DNS record.
  * **AND RE-ADOPTION WAS JUDGED UNSAFE ON THE FOLLOWING GROUNDS, now superseded by the correction above for everything except the gateway.** Measured from both the router peer and the controller pod: `ip route get 192.168.0.1` resolves `via 10.244.0.1 dev eth0` — the default pod gateway, NOT the tunnel — and both the gateway (`192.168.0.1`) and the AP (`192.168.0.108`) are **unreachable** from inside the cluster. Traffic only ever flows LAN → PiKVM → mesh → cluster. Consequences, which are the real constraint on finishing this group:
    - Omada's "Forget" **factory-resets** the device, which clears its inform URL. A reset device then depends on local-subnet discovery — and the controller is not on that subnet and cannot reach it — so **a forgotten device cannot be re-adopted at all** from here. There is no DHCP option 138 configured on any of the five LANs either (checked), so that fallback discovery path does not currently exist.
    - For the ER605 **gateway** it is worse than unrecoverable-in-place: `staticrouting` is controller-managed config, so a Forget wipes **both** `10.96.0.20/32 → 192.168.10.2` and `100.65.0.0/16 → 192.168.10.2` along with the VLANs and DHCP. That destroys the only path any device has to the controller, in a direction the controller cannot repair. **Do not Forget the gateway.**
  * **So the fleet's inform target cannot be changed by the means this plan assumed.** Three ways forward, recorded for the decision rather than silently picking one:
    1. **Repoint the LEGACY name at the mesh peer** (`omada.network.vgijssel.nl` → peer overlay address, via an extra hostname on the chart's `publicDns` DNSEndpoint + dropping it from the Service annotation). Zero device touches, no factory reset, and it delivers the ENTIRE architectural goal of group 12 — all device traffic through Envoy, so the device `NBResource`, the pinned ClusterIP and the CoreDNS split horizon all become deletable (12.10). A DNS flap mid-change is harmless because both target addresses reach the controller. Cost: devices keep a legacy hostname, so the *name* is not unified for them.
    2. **Omada's device/site migration feature**, if this build has it (Settings → Maintenance / Site Migration — it is not represented in MongoDB so it could not be verified from here). It is designed to hand devices a NEW controller address WITHOUT a factory reset, which is exactly the missing mechanism. **Worth checking the UI before anything else** — if present it delivers full name unification safely.
    3. **Make the path two-way first** — have the PiKVM advertise `192.168.0.0/24` into the mesh so the controller can reach devices, which is what would make Forget + re-adopt recoverable. The PiKVM already has the mesh→LAN nft rules (`iifname "wt0" ... daddr 192.168.0.0/24` + masquerade); what is missing is the route being advertised to the cluster peer. Largest scope, but it also removes a standing single-direction fragility.
  * ⚠️ **THEREFORE: NEVER press Apply on that page with the pod IP still in the field.** That is the one action that would push an address no device can ever reach to all 7 at once — self-inflicted 7b, with the controller then unable to push a correction. Overwrite the field with `omada.vpn.blueora.ng` FIRST, then apply. Setting it is consequently both the cutover and the fix for a real latent bug: a churning pod IP replaced by a stable name.
  * **It is ONE controller-wide setting, not per-device**, and Omada exposes no per-device inform field anywhere (`omada.device` has no such key; `config_sync_status.configSyncMap` tracks ~20-37 config sections per device and none of them is an inform/hostname section, so the address rides the management channel itself rather than a tracked config push). Setting it once re-homes all 7.
  * **Only devices ONLINE at the moment of the push receive it.** An offline device keeps the old name — harmless only because both paths are deliberately live (12.5). Verified immediately before: 7/7 online.
  * **ROLLBACK WITHOUT TOUCHING A DEVICE, which is what makes this safe to attempt.** After the push the devices hold `omada.vpn.blueora.ng`, and that name's public A record is ours: scale the Envoy deployment to 0 (or flip `publicDns.enabled: false`) to stop the publisher re-asserting the peer address every 15s, then point the record at `10.96.0.20`. The controller Service still carries every device port (`8088 8043 8843 29811-29817 27001 29810 19810`) and the `10.96.0.20/32` static route is still live, so the fleet lands back on the working path under the NEW name. Without stopping the publisher first this fails silently — it simply overwrites the emergency value.
  * *Dismissed alternative:* DHCP Option 138 (CAPWAP AC) also reaches every device at once, but it carries IP addresses, not hostnames — so it cannot express a mesh hostname, and it would have to be re-pushed on every peer-address change. Useful only as an emergency discovery lever.
  * *Unrelated but worth not misreading during the cutover:* 7 `Disconnected : Inform timeout` events at 2026-10-07 07:19:18 followed by 7 `Adopt success` at 07:22-07:23 are the overnight host-sleep outage self-recovering, not a new fault. onto the mesh hostname
- [ ] 12.8 Verify the migration from MongoDB, not the UI: 7/7 `last_seen > disconnect_time` with no fresh `Disconnected` events, soaked past the ~8-minute inform timeout, and surviving a device power-cycle
- [ ] 12.9 **SUPERSEDES 7.12** — retire BOTH legacy names: drop the `external-dns` hostname annotation from `service-omada.yaml` entirely; verify `dig @1.1.1.1` is empty for `omada.blueora.ng` AND `omada.network.vgijssel.nl` while all 7 devices stay Connected
- [ ] 12.10 Collect the simplification the change was for, and verify each piece is actually gone rather than merely unused: delete `nbresource-omada-devices.yaml`, delete `configmap-coredns-omada.yaml` (its split-horizon exists only to stop the `router` peer resolving the old device name), un-pin `clusterIP: 10.96.0.20`, remove the `omada-devices` NetBird Group and policy, and re-evaluate the operator's `allowAutomaticPolicyCreation: true` — 11.5 established that flag's ONLY remaining justification is this one `NBResource`, so it should now be able to go `false`
- [x] 12.11 Prove the churn path under the new coupling: `kubectl rollout restart` the Omada mesh Envoy deployment and verify the public record follows the new peer address, that the devices reconnect without manual action, and that the total outage stays well inside the ~8-minute inform timeout; record the measured window, since this is the failure mode the design accepts
- [ ] 12.12 Update `apps/network/network.md` (the static-route table and the PiKVM reservation note), `apps/network/SPEC.md` and the Omada bundle headers to describe the single-hostname model; verify no doc still presents a separate device hostname, a pinned ClusterIP or a device `NBResource` as current
