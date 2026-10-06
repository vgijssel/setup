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
- [ ] 7.6 Re-issue the device-facing certificate for `omada.blueora.ng` on `:8043`; verify every adopted AP and switch still reports Connected in the controller — **certificate half DONE and verified; the device-Connected half is BLOCKED on Omada UI access (human-held credential)**
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
- [ ] 7.10 Verify the Omada UI loads over the mesh with no certificate warning and all devices still Connected — **UI-over-mesh half FIXED and verified (200 OK, mesh cert, no redirect); "all devices Connected" still BLOCKED on Omada UI access (human-held credential)**

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
