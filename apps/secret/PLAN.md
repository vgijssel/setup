# PLAN: apps/secret — Crossplane + self-init migration

Companion to [SPEC.md](./SPEC.md). Dependency-ordered tasks. Check off as completed.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

## Phase 0 — De-risk (do before committing to the design)
- [ ] **T0.1** Verify `provider-vault` v4.0.0 `ProviderConfig` supports Kubernetes-auth
      login directly (inspect CRD schema / `doc.crds.dev`). Record the exact auth block.
      If unsupported → decide fallback (Vault-Agent inject vs file-sourced token) and
      note in SPEC §2.
- [ ] **T0.2** Confirm arm64 images exist for Crossplane core Helm chart + the
      `provider-vault` xpkg. If not → reuse qemu/binfmt registration (as in `start.sh`).
- [ ] **T0.3** Confirm `provider-vault` MR coverage for what we need: KV v2 mount,
      kubernetes auth backend + role, **jwt** auth backend + role, ACL policy. Note kinds.
- [ ] **T0.4** Confirm OpenBao 0.28.4 (v2.5.5) supports the self-init `initialize`
      stanza; capture exact HCL for enabling k8s auth + writing a policy + role.

## Phase 1 — Vendoring & Crossplane install
- [ ] **T1.1** Add Crossplane Helm chart (pinned exact version) to
      `third_party/vendir/vendir.yml`; `vendir sync`; confirm `vendir.lock.yml` diff is
      intentional and `moon run <vendir>:test` passes.
- [ ] **T1.2** Create `src/crossplane/` umbrella chart + `values.yaml` + `fleet.yaml`
      (namespace `crossplane-system`).
- [ ] **T1.3** Create `src/crossplane-provider/provider-vault.yaml` (pinned tag+digest),
      `providerconfig-openbao.yaml` (k8s-auth per T0.1), provider SA/RBAC, `fleet.yaml`
      with `dependsOn: crossplane`.

## Phase 2 — OpenBao self-init (remove bootstrap)
- [ ] **T2.1** Add `initialize` stanzas to `src/openbao/values.yaml`: enable k8s auth,
      configure it, create `crossplane` policy + `crossplane` role (minimal subset only).
- [ ] **T2.2** Keep static auto-unseal (`env://SEAL_KEY` + `openbao-seal` Secret).
      Decide how the seal Secret is created declaratively (it can no longer come from
      `bootstrap.sh`) — via Fleet manifest sourced from an existing mechanism. Record
      approach.
- [ ] **T2.3** Delete `scripts/bootstrap.sh`; remove `secret:bootstrap` from `moon.yml`.

## Phase 3 — Crossplane owns full OpenBao config (replace OpenTofu)
- [ ] **T3.1** Create `src/openbao-config/` managed resources: `mount-kv` (KV v2),
      `authbackend-kubernetes`, roles/policies for `external-secrets` + `crossplane`.
- [ ] **T3.2** Add `authbackend-jwt-network` + `network-read` policy + jwt role (network
      cross-cluster parity). Values that were Configuration variables become manifest
      fields (network JWKS url, issuer).
- [ ] **T3.3** Apply retain/orphan deletion policy on MRs so removing them never
      destroys OpenBao data (mirror old Terranetes orphan protection).
- [ ] **T3.4** `fleet.yaml` with `dependsOn: crossplane-provider`.
- [ ] **T3.5** Delete `src/openbao-config/*.tf`, `configuration-openbao.yaml`,
      `provider-openbao.yaml`, `rbac-terranetes-state.yaml`; remove `secret:configure`
      and `scripts/configure.sh`.

## Phase 4 — Wire scripts & global apply
- [ ] **T4.1** `start.sh`: after cluster Ready, invoke `apply.sh` (end-to-end).
- [ ] **T4.2** Create `bin/fleet-apply` (repo-root helper, alongside `bin/help`):
      `find`s every `fleet.yaml` in the repo, `cd`s to the repo root (so Fleet resolves
      `file://` chart deps), and runs `fleet apply` for each — deriving the bundle name
      from the path. No hardcoded list. `apply.sh` calls it after installing Fleet +
      labelling the cluster. Cluster targeting (each `fleet.yaml`'s `targetCustomizations`)
      is the only deploy gate — the new `crossplane`/`crossplane-provider`/`openbao-config`
      bundles are discovered automatically, and `platform-terranetes` stays off `secret`
      via its own targeting (not by omission).
- [ ] **T4.3** Drop the committed `src/openbao/charts/*.tgz` + `Chart.lock`: Fleet
      auto-downloads chart dependencies at build time (`disableDependencyUpdate: false`
      default). No `helm dependency update`/`helm package` anywhere in the flow.
- [ ] **T4.4** Add `scripts/forward.sh` (port-forward openbao svc → localhost:8200);
      add `secret:forward` task to `moon.yml`.
- [ ] **T4.5** Trim `src/config/` to cert, ingress, ESO `ClusterSecretStore`,
      operator-oauth ExternalSecret, seal Secret source.

## Phase 5 — Verify & clean up
- [ ] **T5.1** `trunk fmt` + `trunk check` clean (shellcheck new scripts, yamllint).
- [ ] **T5.2** E2E on clean docker: `secret:start` → `openbao-0` Ready with no bootstrap;
      `bao status` initialized+unsealed; k8s auth + `crossplane` role present.
- [ ] **T5.3** `kubectl get managed` all `SYNCED/READY=True`; KV mount, external-secrets
      role/policy, jwt-network backend exist (full parity).
- [ ] **T5.4** An `ExternalSecret` syncs via `ClusterSecretStore` (read path proven).
- [ ] **T5.5** Idempotency: re-run `secret:start`/`apply` = no-op. `secret:stop` +
      `secret:start` rebuilds to same state, no manual bootstrap.
- [ ] **T5.6** Negative: no Terranetes CRs, no `zz_backend.tf` under `apps/secret`;
      `platform-terranetes` produces no BundleDeployment on the secret cluster (its
      targeting excludes `secret`, even though `bin/fleet-apply` creates the Bundle).

## Deferred (not this change)
- K8s-Secret → 1Password async push (operator / ESO `PushSecret`).
- Network cluster Terranetes → Crossplane migration.
- Seal-key rotation.
