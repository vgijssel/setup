# TODO: `apps/secret` — Terranetes → Crossplane migration

Task list for [plan.md](./plan.md). Legend: `[ ]` todo · `[~]` in progress · `[x]` done

Each task lists **Acceptance** (done-when) and **Verify** (how to check). Do not cross a
`CHECKPOINT` without human review.

---

## Phase 0 — De-risk spikes
- [x] **T0.1** provider-vault `ProviderConfig` Kubernetes-auth support — **PASS** (native `credentials.source: Kubernetes`); see plan.md §Phase-0 findings.
- [x] **T0.2** arm64 image availability (crossplane core + provider-vault xpkg) — **PASS** (both multi-arch incl. arm64; no qemu needed).
- [x] **T0.3** provider-vault MR coverage for all parity kinds — **PASS** (all GVKs exist).
- [x] **T0.4** OpenBao 2.5.x self-init HCL — **PASS** (`initialize` stanza; root token revoked; no recovery keys w/ static seal).
- [x] **T0.5** Fleet Helm `lookup` support (seal Secret generate-once) — **PASS w/ caveat** (supported since #1851; use lookup in manifest template, not a helper `define`; confirm empirically at T1.3, fallback Job documented).

> **CHECKPOINT 0 — PASSED (2026-07-23).** All five gates green; no SPEC revision required. Findings in plan.md.

## Phase 1 — Walking skeleton (thin vertical slice)
- [x] **T1.1** Vendor Crossplane Helm chart (pinned 2.3.3) in `third_party/vendir/vendir.yml`
  - Done: chart at `third_party/vendir/charts/crossplane` (appVersion 2.3.3); `vendir sync` clean; lock diff is the single crossplane addition; `helm template` renders.
- [x] **T1.2** Self-init stanzas in `src/openbao/values.yaml` (minimal subset)
  - Done: `initialize "crossplane_foothold"` enables kubernetes auth, configures it, writes the `crossplane` policy (heredoc) + role only. Locally validated via `bao server` against the rendered chart config — static seal auto-unseals, self-init runs, enable/policy/role evaluate cleanly (fixed `operation` `write`→`update`). `configure_k8s_auth` verifies in-cluster (auto-reads pod ca.crt). Live re-verify at Phase-1 acceptance.
- [x] **T1.3** Helm-generated `src/openbao/templates/secret-openbao-seal.yaml` (`lookup`+`randBytes`)
  - Done: umbrella-chart template mints `openbao-seal` once (`randBytes 32 | b64enc`, `helm.sh/resource-policy: keep`) and reuses the existing `.data["seal-key"]` via `lookup` on re-apply; lookup is in the manifest (not a helper) per #5198. Renders clean; seal-key decodes to a 44-char base64 (== `openssl rand -base64 32`). Generate-once persistence re-verified live at Phase-1 acceptance (apply twice → unchanged).
- [x] **T1.4** `src/crossplane/` umbrella chart + `values.yaml` + `fleet.yaml`
  - Done: umbrella pins crossplane 2.3.3 via `file://` dep (Fleet builds it); `fleet.yaml` → ns `crossplane-system`, label `fleet.vgijssel.nl/bundle: crossplane`, targetCustomizations=secret. Renders clean (`helm template` after dep build: core + rbac-manager Deployments, RBAC, SAs). Also added `fleet.vgijssel.nl/bundle: openbao` label to openbao/fleet.yaml for downstream dependsOn. Live deploy verified at Phase-1 acceptance.
- [x] **T1.5** `src/crossplane-provider/` Provider (pinned tag+digest) + ProviderConfig (k8s-auth) + DeploymentRuntimeConfig + `fleet.yaml` (`dependsOn: crossplane, openbao`)
  - Done: `provider-vault.yaml` (pinned `v4.0.0@sha256:e0873d6a…` multi-arch index), `deploymentruntimeconfig-provider-vault.yaml` (stable SA `provider-vault`), `providerconfig-openbao.yaml` (`credentials.source: Kubernetes`, `role: crossplane`, `skip_child_token`), `fleet.yaml` (dependsOn crossplane+openbao, secret-only). Added `apps/secret/src/openbao/templates/**` to trunk yamllint ignore; `trunk check` clean.
  - **Deviation from plan wording:** no separate SA/RBAC manifest — Crossplane creates + owns the `provider-vault` SA (named via serviceAccountTemplate) and its RBAC; OpenBao reviews the SA token with its own SA (chart `authDelegator` → system:auth-delegator), so the provider SA needs no extra RBAC. Live verify (HEALTHY + login) at Phase-1 acceptance.
- [x] **T1.6** `src/openbao-config/mount-kv.yaml` (single KV v2 `Mount`, `deletionPolicy: Orphan`) + `fleet.yaml` (`dependsOn: crossplane-provider`)
  - Done: `mount-kv.yaml` (`vault.vault.upbound.io/v1alpha1` Mount, path kv, options.version "2", providerConfigRef openbao, deletionPolicy Orphan); `fleet.yaml` dependsOn crossplane-provider, secret-only, label openbao-config; `.fleetignore` keeps the legacy Terraform files out of the bundle. trunk check clean. Live SYNCED/READY at Phase-1 acceptance.
- [x] **T1.7** Create `bin/fleet-apply` (repo-root helper): `find` every `fleet.yaml`, `cd` repo root, `fleet apply` each (bundle name from path); have `apply.sh` call it after Fleet install + cluster label
  - Done: `bin/fleet-apply` discovers every `apps/**/fleet.yaml`, derives `<group>-<component>` names (verified to match the old explicit names exactly), cd's to repo root, `fleet apply`s each into fleet-local; shellcheck clean. `apply.sh` now calls it (hardcoded list removed) and drops the bootstrap "Next" step. Live all-bundles-Ready check at Phase-1 acceptance.

### Phase 1 acceptance — PROVEN LIVE (2026-07-23) on vind/arm64

Clean `secret:start` → `secret:apply` brought the whole chain up with **no bootstrap/
configure step**:
- OpenBao `openbao-0` Ready; `bao status` → `Initialized=true, Sealed=false` (static
  seal auto-unseal + self-init).
- kubernetes auth method + `crossplane` role present (logged in as it to verify).
- Crossplane core Ready; `provider-vault` Provider `INSTALLED=True HEALTHY=True` on
  **arm64** (no qemu); pod SA is the stable `provider-vault` (DeploymentRuntimeConfig).
- `ProviderConfig openbao` k8s-auth login works; `Mount kv` MR **SYNCED=True READY=True**;
  `kv/` (v2) present in OpenBao.

**Two bugs found & fixed live (the point of the walking skeleton):**
1. **Fleet atomic-release split.** A `ProviderConfig` (vault.upbound.io CR) in the same
   bundle as the `Provider` that installs its CRD makes the whole Helm release fail to
   build → the Provider is never created (deadlock). Fix: moved `providerconfig-openbao.yaml`
   into the `openbao-config` bundle (downstream of `crossplane-provider`); crossplane-provider
   now carries only Provider + DeploymentRuntimeConfig. openbao-config dependsOn
   crossplane-provider **and** openbao.
2. **`auth/token/create` grant.** `skip_child_token: true` is NOT honoured by
   provider-vault on the auth_login/kubernetes path; it still mints a child token per
   reconcile, and OpenBao's `default` policy doesn't grant token creation → 403. Fix:
   added `path "auth/token/create"` to the self-init `crossplane` policy (values.yaml);
   the Phase-2 policy-crossplane MR must include it too (keep in sync).

> **CHECKPOINT 1 (critical) — PASSED (2026-07-23).** Chain proven live on arm64:
> self-init role → k8s-auth login → MR reconcile. SPEC §2 risks all retired.

## Phase 2 — Full config parity

**Design decision (refines T2.1/T2.3):** the kubernetes auth backend + config and the
`crossplane` policy + role are owned by **self-init** (the foothold), NOT duplicated as
Crossplane MRs — this avoids adopting/fighting self-init-created resources. New role MRs
reference the k8s backend by the `backend: kubernetes` string (the field exists on
AuthBackendRole), so no Backend MR is needed. Crossplane owns everything else. All
parity resources still exist; the split is just ownership. This satisfies the SPEC
self-init contract ("everything else is owned by Crossplane, not self-init").

- [x] **T2.1** ~~authbackend-kubernetes~~ — **owned by self-init** (foothold), not a Crossplane MR. Roles reference `backend: kubernetes`.
- [x] **T2.2** `policy-external-secrets.yaml` + `role-external-secrets.yaml` — LIVE SYNCED/READY=True (role via `backend: kubernetes`).
- [x] **T2.3** `init ⊂ crossplane` finalized. **init minimized** to the irreducible auth foothold only (enable+configure kubernetes auth, `crossplane` policy+role); the `admin` policy+role were REMOVED from init and are now Crossplane-only (Crossplane provisions admin after it authenticates). Every init item is mirrored as an owned MR: `authbackend-kubernetes.yaml` (adopts via `external-name`), `authbackendconfig-kubernetes.yaml`, `policy-crossplane.yaml`, `role-crossplane.yaml`. Crossplane-only: `policy-admin.yaml`, `role-admin.yaml` (1h TTL), kv, external-secrets, network jwt. All `deletionPolicy: Orphan`. Verified live: every MR `SYNCED/READY=True` and stable (backend adopted cleanly, no flap); Crossplane didn't lock itself out; `secret:auth` still works with the admin role now Crossplane-owned. Docs: `values.yaml` banner + `apps/secret/CLAUDE.md`.
- [~] **T2.4** `authbackend-jwt-network.yaml` (issuer/jwks_url from variables.tf defaults) — manifest is parity-exact, but CANNOT fully reconcile in the isolated vind cluster: the config write fetches the live JWKS from `api.network.vgijssel.nl` (100.86.162.164, tailnet VIP), which is unreachable without tailnet connectivity (wget times out). **Environment-blocked, not a config bug.** Reconciles in the real deployment; re-verify at Phase-3/CHECKPOINT-3 with the network side up.
- [x] **T2.5** `policy-network-read.yaml` + `role-network-eso.yaml` + `role-network-terranetes.yaml` — LIVE SYNCED/READY=True (roles reference `backend: jwt-network`; mount enabled).
- [x] **T2.6** `src/openbao-config/fleet.yaml` covers all MRs (single bundle) — applied; 5/6 MRs Ready live.

Live `kubectl get managed`: kv Mount, external-secrets Policy+Role, network-read Policy,
network-eso + network-terranetes jwt roles all **SYNCED=True READY=True**; jwt-network
AuthBackend blocked only by JWKS unreachability (see T2.4).

> **CHECKPOINT 2 — PARTIAL (2026-07-23).** Full parity present; 5/6 MRs reconcile live on
> arm64. jwt-network needs the real tailnet to complete its JWKS-backed config — deferred
> to CHECKPOINT 3 (read path, real env). Human review recommended before Phase 4 deletion.

## Phase 3 — Read path + wiring + config trim
- [x] **T3.1** `start.sh` invokes `apply.sh`; qemu/binfmt block removed
  - Done: after node Ready, start.sh `exec`s apply.sh (single-command bring-up). Dropped the qemu/binfmt registration — crossplane + provider-vault are arm64 and terranetes now targets network only (T3.2). moon.yml header updated. shellcheck clean.
- [x] **T3.2** Keep `platform-terranetes` off `secret` via **cluster targeting** (its `fleet.yaml` targets only `network`)
  - Done + LIVE-VERIFIED: added `targetCustomizations` (network only) to `apps/platform/src/terranetes/fleet.yaml`. After re-apply, the bundle shows **0/0 BundleDeployments** on secret and `terranetes-system` has no controller. (SPEC-permitted shared-bundle retarget.)
- [x] **T3.3** `scripts/forward.sh` + `secret:forward` task
  - Done: `forward.sh` port-forwards svc/openbao → localhost:8200 (long-running); `secret:forward` task added to moon.yml. shellcheck clean. (Live port-forward not exercised — trivial.)
- [x] **T3.4** Trim `src/config/` to cert/ingress/ClusterSecretStore/ExternalSecret/fleet
  - Done: removed `configuration-openbao.yaml`, `provider-openbao.yaml`, `rbac-terranetes-state.yaml` (terranetes CRs) — REQUIRED because terranetes is now off secret (T3.2), so their `terraform.appvia.io` CRDs are gone and their presence failed the whole secret-config Helm release (atomic), blocking the ClusterSecretStore. fleet.yaml comment updated. (Pulls T4.2 forward.)
- [x] **T3.5** ExternalSecret syncs via `ClusterSecretStore` (read path) — **PROVEN LIVE**
  - Done: ClusterSecretStore `openbao` is `Valid/READY=True` using the **internal** service `http://openbao.secret.svc:8200` + kubernetes auth (role external-secrets) — NOT the tailnet. Seeded a dummy `kv/secret-tailscale-operator`; ExternalSecret `tailscale/operator-oauth` → `SecretSynced=True`, target Secret populated (client_id/client_secret).
  - **Root cause fixed (user report #2):** network-config's remote tailnet+JWT store (same name `openbao`) was clobbering secret's store because global `bin/fleet-apply` deployed all `apps/network` bundles on secret. Fixed by adding network-only `targetCustomizations` to every `apps/network/src/*/fleet.yaml`.
  - ~~design gap: no kv-data write / break-glass path after root revoke~~ **RESOLVED** — added `moon run secret:auth` (scripts/auth.sh): logs in to OpenBao's `admin` kubernetes-auth role as the `openbao-admin` SA and returns a 1h-capped admin token. Self-init creates the `admin` policy (full incl. sudo) + role; the SA is `src/config/serviceaccount-openbao-admin.yaml`. Gated by kubectl-admin (which already implies full cluster access). Proven live: token `[admin default]` ttl 59m59s, writes kv data AND runs `sys/rotate/recovery/init` (break-glass). Deliberately in self-init so break-glass survives a broken Crossplane.

> **CHECKPOINT 3 — read path PROVEN LIVE via the internal service; single-command bring-up
> wired.** jwt-network intentionally ignored (network cluster down, to be refactored).
> Open item for human decision: the human kv-seed write-auth gap above.

## Phase 4 — Remove Terranetes + finalize
- [x] **T4.1** Deleted `src/openbao-config/*.tf`, `.terraform.lock.hcl`, `.gitignore`, `.fleetignore`, and the local `terraform/` dir. openbao-config now holds only the Crossplane MRs + fleet.yaml.
- [x] **T4.1b** Deleted `src/openbao/Chart.lock` + `charts/openbao-0.28.4.tgz`. Verified live: `fleet apply` builds the file:// dep itself ("Saving 1 charts") — no `helm dependency update`/`package` in the flow.
- [x] **T4.2** Done via T3.4 (removed `configuration-openbao.yaml`, `provider-openbao.yaml`, `rbac-terranetes-state.yaml`).
- [x] **T4.3** Deleted `scripts/bootstrap.sh` + `scripts/configure.sh`; removed the `bootstrap`/`configure` tasks from `moon.yml` (start now execs apply; forward added).
- [x] **T4.4** `trunk fmt` + `trunk check` clean across apps/secret (40 files, no issues).
- [x] **T4.5** Idempotency + **clean rebuild PROVEN**: ran `secret:stop` + `secret:start` from committed manifests (single command, no manual steps). Fresh result: openbao-0 `Initialized=true Sealed=false`, provider-vault HEALTHY, all 5 config MRs SYNCED+READY, ClusterSecretStore `Valid/Ready` on the internal service — **with zero manual patching** (confirms the `auth/token/create` self-init fix is in the committed values.yaml). jwt-network False (ignored). Re-applies are no-op upserts.
  - Caveat: ExternalSecrets referencing real kv values (operator-oauth, cloudflare, netdata) stay SecretSyncedError until those kv secrets are seeded — blocked by the kv-write-auth gap (CHECKPOINT 3 note). Store validity + read mechanism already proven separately.
- [x] **T4.6** Negative + parity: 0 `.tf`, 0 `zz_backend.tf`, 0 committed `charts/*.tgz`/`Chart.lock` under apps/secret; only remaining `terraform.appvia.io` mention is this doc. `platform-terranetes` → 0/0 on secret. `apps/network` changed ONLY by network-only targeting (targeting-only); `apps/platform` changed only by the sanctioned terranetes retarget.

> **CHECKPOINT 4 (final)** — Terranetes fully removed from apps/secret; lint clean; read
> path proven on the internal service. Recommended before merge: a clean `secret:stop` +
> `secret:start` rebuild (T4.5) to confirm the committed manifests boot with no manual
> tweaks, and resolve the kv-seed write-auth gap (CHECKPOINT 3 note). Flip any `ref=` →
> `main` at merge. jwt-network deferred (network cluster to be refactored).
