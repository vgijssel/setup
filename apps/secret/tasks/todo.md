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

> **CHECKPOINT 1 (critical)** — chain proven live: self-init role → k8s-auth login → MR reconcile on this arch.

## Phase 2 — Full config parity
- [ ] **T2.1** `authbackend-kubernetes.yaml` + `authbackendconfig-kubernetes.yaml` (`deletionPolicy: Orphan`)
  - Acceptance: MRs SYNCED/READY; `kubernetes_host` set.
  - Verify: `bao read auth/kubernetes/config`.
- [ ] **T2.2** `policy-external-secrets.yaml` + `role-external-secrets.yaml`
  - Acceptance: MRs SYNCED/READY; body equivalent to current TF policy.
  - Verify: `bao policy read external-secrets`; `bao read auth/kubernetes/role/external-secrets`.
- [ ] **T2.3** `policy-crossplane.yaml` (renamed from `terranetes`, incl. `auth/jwt-network/*`); reconcile the self-init-created policy
  - Acceptance: MR SYNCED/READY; content identical to self-init policy (no drift/fight).
  - Verify: `bao policy read crossplane`; MR stays READY across two reconciles.
- [ ] **T2.4** `authbackend-jwt-network.yaml` (issuer/jwks_url/ca from `variables.tf` defaults)
  - Acceptance: MR SYNCED/READY; live JWKS fetch works.
  - Verify: `bao read auth/jwt-network/config`.
- [ ] **T2.5** `policy-network-read.yaml` + `role-network-eso.yaml` + `role-network-terranetes.yaml`
  - Acceptance: all MRs SYNCED/READY; both jwt roles + policy present (network parity).
  - Verify: `bao read auth/jwt-network/role/network-eso` and `.../network-terranetes`; `bao policy read network-read`.
- [ ] **T2.6** Update `src/openbao-config/fleet.yaml` to cover all MRs
  - Acceptance: bundle Ready with every MR.
  - Verify: `kubectl get managed` all SYNCED/READY.

> **CHECKPOINT 2** — full parity confirmed against the baseline table in plan.md §1.

## Phase 3 — Read path + wiring + config trim
- [ ] **T3.1** `start.sh` invokes `apply.sh`; qemu/binfmt gated on real arm64 gap (T0.2)
  - Acceptance: `secret:start` alone brings up + applies.
  - Verify: clean-docker `secret:start` reaches configured state; no separate `apply` needed.
- [ ] **T3.2** Keep `platform-terranetes` off `secret` via **cluster targeting** (not omission — `bin/fleet-apply` applies it globally); its `fleet.yaml` targets only `network`
  - Acceptance: `platform-terranetes` Bundle may exist, but no BundleDeployment on the secret cluster; crossplane bundles deploy on secret.
  - Verify: `kubectl -n fleet-local get bundledeployments` shows no `platform-terranetes` targeting the secret cluster.
- [ ] **T3.3** `scripts/forward.sh` + `secret:forward` task
  - Acceptance: port-forwards openbao svc → localhost:8200.
  - Verify: `moon run secret:forward` then `BAO_ADDR=http://127.0.0.1:8200 bao status`.
- [ ] **T3.4** Trim `src/config/` to cert/ingress/ClusterSecretStore/ExternalSecret/fleet
  - Acceptance: only the kept files remain in `src/config/` (Terranetes CRs removed in Phase 4).
  - Verify: `ls src/config`.
- [ ] **T3.5** ExternalSecret syncs via `ClusterSecretStore` (read path)
  - Acceptance: operator-oauth ExternalSecret `SecretSynced=True` after kv values entered.
  - Verify: `kubectl get externalsecret -A`; target Secret populated.

> **CHECKPOINT 3** — read path proven; single-command bring-up confirmed.

## Phase 4 — Remove Terranetes + finalize
- [ ] **T4.1** Delete `src/openbao-config/*.tf`, `.terraform*`, `.gitignore`, `terraform/`
- [ ] **T4.1b** Delete `src/openbao/charts/*.tgz` + `src/openbao/Chart.lock` (Fleet downloads deps at build; no `helm dependency update`/`helm package` in the flow)
- [ ] **T4.2** Delete `src/config/{configuration-openbao,provider-openbao,rbac-terranetes-state}.yaml`
- [ ] **T4.3** Delete `scripts/bootstrap.sh` + `scripts/configure.sh`; update `moon.yml` (remove bootstrap/configure, add forward)
- [ ] **T4.4** `trunk fmt` + `trunk check` clean
  - Verify: both commands exit 0.
- [ ] **T4.5** Idempotency + rebuild
  - Verify: re-run `secret:start`/`apply` = no-op; `secret:stop` then `secret:start` rebuilds to same ready state, no manual bootstrap.
- [ ] **T4.6** Negative + parity check
  - Verify: no Terranetes CRs / `.tf` / `zz_backend.tf` and no committed `charts/*.tgz`/`Chart.lock` under `apps/secret`; `platform-terranetes` has no BundleDeployment on secret (targeting excludes it, Bundle may still exist); `git status` shows `apps/network` + `apps/platform` untouched.

> **CHECKPOINT 4 (final)** — SPEC §6 acceptance matrix green; network parity intact; update `ref=` → `main` at merge.
