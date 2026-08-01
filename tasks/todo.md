# TODO: Shared netbird-reverse-proxy chart + expose PiKVM

Spec: `apps/network/src/netbird-reverse-proxy/SPEC.md` · Plan: `tasks/plan.md`
Ordered by dependency. Each task ≤ ~5 files. `[ ]` todo · `[~]` in progress · `[x]` done.

## Phase 0 — Spikes (no production writes)

- [x] **S1 — Decide chart composition (nested `file://` vs inline)**
  - Acceptance: a written decision (A nested / B inline) with the reason; default to inline
    (self-contained platform chart) if transitive build is uncertain.
  - Verify: `helm dependency build` on a throwaway downstream→platform→vendored trio shows
    whether the vendored subchart lands; record result.
  - Files: none (scratch only).
  - **DECISION (2026-08-01): neither pure-A nor pure-B — two-dependency thin bundle.**
    Proven offline: (1) nested bundle→platform→vendored FAILS under Fleet because
    `.gitignore` ignores `apps/**/charts/` and `fleet apply` builds only the top bundle
    (helm does not recurse into a subchart's own file:// deps), so the vendored subchart is
    absent from the package and the proxy Deployment silently vanishes; (2) committing the
    subchart as a real dir also fails (same gitignore); (3) inlining/forking the vendored
    chart would diverge the copy shared with enigma. **Chosen:** a self-contained shared
    first-party chart `apps/platform/src/netbird-reverse-proxy-shared` (cert + ESO token +
    watchdog + domain workspace; NO subchart), and each per-cluster bundle deps TWO charts at
    single `file://` levels — the vendored `netbird-reverse-proxy` (proxy workload, values as
    today) + `netbird-reverse-proxy-shared` (domain/tokenKvPath via fleet.yaml helm.values).
    Both build in one Fleet pass; verified with `helm template` (proxy Deployment + shared
    Certificate render, domain substituted). Deviates from spec Decision #1 (proxy manifests
    inside the one platform chart) — forced by the gitignore+Fleet constraint; delivers the
    spec's actual intent (one shared chart for the reusable first-party parts, per-cluster
    services stay in workspaces) without forking. Downstream file:// depth: bundle→shared is
    `file://../../../platform/src/netbird-reverse-proxy-shared`; bundle→vendored unchanged.

- [ ] **S2 — Decide PiKVM service target block**
  - Acceptance: exact `targets[]` JSON for the PiKVM service (peer vs direct_upstream-to-mesh-IP).
  - Verify: `GET /api/reverse-proxies/services` schema + existing OpenBao service inspected with
    the network admin PAT; chosen shape accepted (dry).
  - Files: none.

- [ ] **S3 — Resolve peer-id lookup + `skip_tls_verify` key**
  - Acceptance: peer-id HCL (or decision to use mesh-IP direct_upstream) + confirmed option key.
  - Verify: `GET /api/peers` by name/IP works, or fallback chosen; key spelling from live schema.
  - Files: none.

- [ ] **S4 — Confirm `network.vgijssel.nl` domain won't disturb Omada (read-only)**
  - Acceptance: go/no-go + minimal DNS the domain workspace should create (CNAME needed or not).
  - Verify: Omada A record shadows the wildcard; reverse-proxy-domain ≠ NBResource subsystem.
  - Files: none.

## Phase 1 — Shared platform chart

- [ ] **P1a — Create chart scaffold + values contract**
  - Acceptance: `apps/platform/netbird-reverse-proxy/{Chart.yaml,values.yaml}` per S1; params
    `domain`, `tokenKvPath`; subchart defaults (private, NET_BIND_SERVICE, ClusterIP, tls.source=secret).
  - Verify: `helm template --set domain=example.vgijssel.nl` renders; `trunk check` clean.
  - Files: 2.

- [ ] **P1b — Cert + ESO-token templates (parameterized)**
  - Acceptance: `certificate-*.yaml` (`*.{{ .Values.domain }}`), `externalsecret-*.yaml`
    (`remoteRef.key: {{ .Values.tokenKvPath }}`).
  - Verify: rendered SAN + KV path correct for a sample domain.
  - Files: 2.

- [ ] **P1c — Watchdog CronJob + RBAC (verbatim)**
  - Acceptance: `cronjob-watchdog.yaml` + `serviceaccount-watchdog.yaml` copied, unchanged logic.
  - Verify: `helm template` renders; digest-pinned image intact.
  - Files: 2.

- [ ] **P1d — Domain-link Crossplane workspace template**
  - Acceptance: `workspace-reverse-proxy-domain.yaml` registers
    `netbird_reverse_proxy_domain({{ .Values.domain }})` + minimal DNS (S4); stable tofu state
    suffix as a function of domain (adoption-ready for P2).
  - Verify: rendered HCL valid; `providerConfigRef: default`.
  - Files: 1.

## Phase 2 — Secret in-place migration  ⚠️ Ask-first before apply

- [ ] **P2a — Convert secret bundle to thin consumer**
  - Acceptance: `apps/secret/src/netbird-reverse-proxy/` = `Chart.yaml` (file:// platform) +
    `fleet.yaml` (releaseName unchanged, values domain=`secret.vgijssel.nl`,
    tokenKvPath=`secret-netbird-proxy`, dependsOn operator+crossplane-provider+cloudflare-config);
    old `templates/*` deleted.
  - Verify: `helm template` == pre-refactor objects (Deployment/Cert/ExternalSecret) modulo Fleet labels.
  - Files: ~4.

- [ ] **P2b — Migrate secret domain workspace into the chart (adopt state)**
  - Acceptance: delete `cloudflare-config/workspace-reverse-proxy-dns-secret.yaml`; chart workspace
    owns it with identical `metadata.name` + tofu state suffix.
  - Verify: Workspace tofu plan shows **adopt/no-op** (no `netbird_reverse_proxy_domain` replace).
  - Files: ~2.

- [ ] **P2c — Apply on secret + adoption gate**
  - Acceptance: OpenBao unchanged; Helm release upgraded not replaced; cert not re-issued.
  - Verify: `curl https://openbao.secret.vgijssel.nl` valid cert + reachable; network ESO SecretSynced;
    Workspace Ready no-diff.
  - Files: 0 (apply/observe).

## Phase 3 — Network proxy token (parallel with P1/P2)

- [ ] **P3a — `put_netbird_pikvm_proxy_auth.sh` + moon task**  ⚠️ Ask-first to run
  - Acceptance: mints proxy-token, writes `kv/network-netbird-pikvm-proxy#token`; idempotent; FORCE=1.
  - Verify: `bao kv get kv/network-netbird-pikvm-proxy` returns token.
  - Files: 1 script + moon.yml task.

- [ ] **P3b — Ensure `network-eso` reads the new KV path**
  - Acceptance: policy covers `kv/data/network-netbird-pikvm-proxy` (extend MR in
    `apps/secret/src/openbao-config` if the `network-*` prefix doesn't already).
  - Verify: an ExternalSecret to that key would sync (policy read granted).
  - Files: 0–1.

## Phase 4 — Network bundle + PiKVM services workspace

- [ ] **P4a — Network thin bundle**
  - Acceptance: remove stale `.tgz`; add `Chart.yaml` (file:// platform) + `fleet.yaml`
    (values domain=`network.vgijssel.nl`, tokenKvPath=`network-netbird-pikvm-proxy`, dependsOn
    operator+crossplane-provider+cloudflare-config; targetCustomizations network).
  - Verify: `helm template` renders network SAN/KV; bundle name `network-netbird-reverse-proxy`.
  - Files: ~3 (2 new, 1 delete).

- [ ] **P4b — PiKVM services workspace (per S2/S3)**
  - Acceptance: `apps/network/src/cloudflare-config/workspace-reverse-proxy-services.yaml` —
    private, access_groups:[homelab], target block from S2, precondition on `network.vgijssel.nl` online.
  - Verify: HCL validates; renders; force_new/ignore_server_additions set like the OpenBao one.
  - Files: 1.

- [ ] **P4c — Apply on network + register**  (verify context first)
  - Acceptance: proxy pod up, domain registered, PiKVM service `enabled` bound to `network.vgijssel.nl`.
  - Verify: bundle Ready; Certificate Ready; ESO SecretSynced; `restapi_object` enabled; cluster listed.
  - Files: 0.

## Phase 5 — End-to-end verify

- [ ] **P5a — Cert + UI from homelab peer**
  - Acceptance: valid LE cert (subject `*.network.vgijssel.nl`), UI loads no warning, WebSocket+terminal work.
  - Verify: `curl -sv https://pikvm.network.vgijssel.nl`; browser.
- [ ] **P5b — Mesh-only** — URL fails with NetBird down.
- [ ] **P5c — ISO upload probe** — attempt large upload; document enigma fallback if blocked (no code).
- [ ] **P5d — No-regression** — Omada loads; `pikvm:apply --dry` clean; goss passes; OpenBao green.
- [ ] **P5e — Self-heal** — wedge proxy client; watchdog restarts ≤5 min; reachability returns.

## Phase 6 — Docs / memory / optional goss

- [ ] **P6a — Relocate SPEC** to `apps/platform/netbird-reverse-proxy/SPEC.md`.
- [ ] **P6b — Update memory** — shared-chart pattern + PiKVM exposure + S1/S2 decisions + ISO caveat.
- [ ] **P6c — (Optional) goss assertion** for the proxy path.  ⚠️ Ask-first (device change).
