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
- [ ] **T1.2** Self-init stanzas in `src/openbao/values.yaml` (minimal subset)
  - Acceptance: enables k8s auth + creates `crossplane` policy + role only.
  - Verify: after boot, `bao auth list` shows `kubernetes/`; `bao read auth/kubernetes/role/crossplane` succeeds.
- [ ] **T1.3** Helm-generated `src/openbao/templates/secret-openbao-seal.yaml` (`lookup`+`randBytes`)
  - Acceptance: Secret created if absent, reused if present (no rotation on re-apply).
  - Verify: `secret:apply` twice → `kubectl -n secret get secret openbao-seal -o jsonpath='{.data.seal-key}'` unchanged; OpenBao auto-unseals.
- [ ] **T1.4** `src/crossplane/` umbrella chart + `values.yaml` + `fleet.yaml`
  - Acceptance: crossplane core deploys to `crossplane-system`.
  - Verify: `kubectl -n crossplane-system get deploy` Available; `kubectl get providers` CRD present.
- [ ] **T1.5** `src/crossplane-provider/` Provider (pinned tag+digest) + ProviderConfig (k8s-auth) + SA/RBAC + `fleet.yaml` (`dependsOn: crossplane, openbao`)
  - Acceptance: Provider `HEALTHY=True`; ProviderConfig logs in via `crossplane` role.
  - Verify: `kubectl get providers` Healthy; provider pod logs show successful OpenBao login.
- [ ] **T1.6** `src/openbao-config/mount-kv.yaml` (single KV v2 `Mount`, `deletionPolicy: Orphan`) + `fleet.yaml` (`dependsOn: crossplane-provider`)
  - Acceptance: `Mount` MR `SYNCED=True READY=True`.
  - Verify: `kubectl get managed`; `bao secrets list` shows `kv/` (v2).
- [ ] **T1.7** Create `bin/fleet-apply` (repo-root helper): `find` every `fleet.yaml`, `cd` repo root, `fleet apply` each (bundle name from path); have `apply.sh` call it after Fleet install + cluster label
  - Acceptance: `secret:apply` discovers & applies **all** bundles (incl. new crossplane ones) with no hardcoded list; runtime order via `dependsOn`.
  - Verify: `kubectl -n fleet-local get bundles` all Ready; `bin/fleet-apply` picks up a newly added `src/*/fleet.yaml` with no script edit.

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
