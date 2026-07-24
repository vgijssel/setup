# Plan: Migrate the network cluster from Terranetes to Crossplane

Implementation plan for `apps/network/SPEC.md`. Tasks are dependency-ordered; each is a
single focused session touching ≤~5 files, with acceptance + verification. The reference
implementation is the `secret` cluster (PR #989) — clone its structure, adapt names/targets.

## Dependency graph (high level)

```
P0 vendor charts ─┬─► P1 crossplane ─► P2 provider ─► P3 ProviderConfig+ACL ─┐
                  └─► P4 percona-operator ─► P5 CR+user ─► P6 omada rewire ───┤
                                                                             ▼
                              P7 teardown terranetes ─► P8 secret cleanup ─► P9 live apply+validate
```

- P1→P3 (Tailscale/Crossplane track) and P4→P6 (MongoDB track) are **independent** and can be
  built in parallel; both converge at the live apply (P9).
- P7 (teardown) must land with/after P3 (the ACL must be managed by Crossplane before the
  Terranetes Configuration is removed — otherwise nothing owns the tailnet policy).
- P9 is the only phase that mutates live infra (recreates the cluster + applies).

## Verification checkpoints

- **After P3:** on a scratch/live apply, the `ACL` MR is `SYNCED=True READY=True` and the live
  tailnet policy is byte-equivalent to today's (diff the admin-console policy before/after).
- **After P6:** Percona 3-member `rs0` is `ready`, and `mongodb-uri` in `omada` resolves.
- **After P9:** full `stop→start→apply→bootstrap` brings Omada up; no `terraform.appvia.io`
  objects on the network cluster.

---

## P0 — Prerequisites & vendored charts

- [x] **T0.1: Vendor the Percona operator Helm chart(s).**
  - Acceptance: `psmdb-operator` **1.23.0** and its split CRD chart `psmdb-operator-crds` **1.23.0**
    are vendored under the repo's chart-vendoring path (mirror how `crossplane-2.3.3.tgz` /
    `openbao-0.28.4.tgz` are vendored). Versions pinned exactly.
  - Verify: `helm template` renders the operator with image tag `1.23.0`; chart digests committed.
  - Files: `third_party/vendir/charts/psmdb-operator*` (+ vendir config), lockfiles.

- [x] **T0.2: Resolve the provider image digest.**
  - RESOLVED: `ghcr.io/millstonehq/provider-tailscale:v0.1.0@sha256:71b2e9b3a664d4bbb6c5708176cb0f19cd20ae8e8bf2edcc6bc07bb3faa5c599`
    (multi-arch index digest; `linux/arm64` platform manifest present). Used in T2.2.
  - Acceptance: the multi-arch (arm64) digest of `ghcr.io/millstonehq/provider-tailscale:v0.1.0`
    is captured for pinning (`tag@sha256:…`).
  - Verify: `docker buildx imagetools inspect ghcr.io/millstonehq/provider-tailscale:v0.1.0`
    shows `linux/arm64`; record the index digest.
  - Files: none (value used in T2.2).

---

## P1 — Crossplane core (network)

- [x] **T1.1: Add the `crossplane` bundle for the network cluster.**
  - Acceptance: `apps/network/src/crossplane/{Chart.yaml,values.yaml,fleet.yaml}` mirror
    `apps/secret/src/crossplane/` but `fleet.yaml` targets `cluster.vgijssel.nl/name: network`.
    Reuse the vendored crossplane 2.3.3 chart.
  - Verify: `fleet.yaml` has a network-only `targetCustomizations`; `trunk check` passes.
  - Files: `apps/network/src/crossplane/Chart.yaml`, `values.yaml`, `fleet.yaml` (+ chart tgz).

---

## P2 — provider-upjet-tailscale (network)

- [x] **T2.1: DeploymentRuntimeConfig pinning the provider SA name.**
  - Acceptance: `deploymentruntimeconfig-provider-tailscale.yaml` fixes the pod SA to
    `provider-tailscale` (mirrors the provider-vault pattern; stable name across upgrades).
  - Verify: manifest validates; name matches the ProviderConfig expectations.
  - Files: `apps/network/src/crossplane-provider/deploymentruntimeconfig-provider-tailscale.yaml`.

- [x] **T2.2: Provider manifest + bundle.**
  - Acceptance: `provider-tailscale.yaml` pins `ghcr.io/millstonehq/provider-tailscale:v0.1.0@sha256:…`
    (from T0.2) with `runtimeConfigRef` → T2.1; `fleet.yaml` `dependsOn` the crossplane bundle,
    network-targeted.
  - Verify (live, in P9): `kubectl get providers.pkg.crossplane.io` → `INSTALLED HEALTHY = True`;
    `acl.tailscale.upbound.io` CRD registered.
  - Files: `apps/network/src/crossplane-provider/provider-tailscale.yaml`, `fleet.yaml`.

---

## P3 — Tailscale ACL via Crossplane (replaces the OpenTofu module)

- [x] **T3.1: api_key ExternalSecret + ProviderConfig.**
  - Acceptance: `externalsecret-tailscale-apikey.yaml` syncs `kv/network-tailscale-crossplane#api_key`
    (via the existing remote `openbao` ClusterSecretStore) into a Secret in `crossplane-system`;
    `providerconfig-tailscale.yaml` (`tailscale.upbound.io/v1beta1`) sets `credentials.source: Secret`
    → that Secret's `api_key` key.
  - Verify (live): once the key is seeded (P9), the ProviderConfig is accepted and the Secret exists.
  - Files: `apps/network/src/tailscale-config/externalsecret-tailscale-apikey.yaml`,
    `providerconfig-tailscale.yaml`.

- [x] **T3.2: Translate the tailnet policy to an `ACL` managed resource.**
  - Acceptance: `acl-tailnet.yaml` (`acl.tailscale.upbound.io/v1alpha1`, `deletionPolicy: Orphan`)
    carries the **verbatim** HuJSON from `apps/network/src/tailscale-config/main.tf`
    (autoApprovers, groups, tagOwners, acls, ssh, nodeAttrs, grants — unchanged). Set
    `overwriteExistingContent: true` (confirm exact field name from the CRD) so first apply adopts
    the live policy.
  - Verify: HuJSON diff vs. `main.tf` is empty (semantically); `SYNCED/READY=True` and admin-console
    policy unchanged (checkpoint after P3, exercised in P9).
  - Files: `apps/network/src/tailscale-config/acl-tailnet.yaml`.

- [x] **T3.3: Bundle + remove the OpenTofu module.**
  - Acceptance: `apps/network/src/tailscale-config/fleet.yaml` `dependsOn` crossplane-provider,
    network-targeted. Delete `main.tf`, `provider.tf`, `variables.tf`, `versions.tf`,
    `.terraform*`, `.terraform.lock.hcl`, `.gitignore` from that dir.
  - Verify: `trunk check`; no `.tf` files remain under `apps/network/`.
  - Files: `apps/network/src/tailscale-config/fleet.yaml`; delete the module files.

---

## P4 — Percona operator install (network)

- [x] **T4.1: Add the `mongodb-operator` bundle.**
  - Acceptance: `apps/network/src/mongodb-operator/{Chart.yaml,values.yaml,fleet.yaml}` install
    `psmdb-operator` 1.23.0 (+ CRDs chart), operator image pinned `1.23.0`, sharding/PMM defaults
    off; network-targeted; `watchAllNamespaces` (or scoped) set so it manages the CR in the mongodb ns.
  - Verify (live): operator Deployment `Available`; `psmdb.percona.com` CRDs present; operator pod on arm64.
  - Files: `apps/network/src/mongodb-operator/Chart.yaml`, `values.yaml`, `fleet.yaml`.

---

## P5 — PerconaServerMongoDB CR + omada user (network)

- [x] **T5.1: Replace the mongo chart with the Percona CR (3-member).**
  - Acceptance: `apps/network/src/mongodb/perconaservermongodb.yaml` defines a **3-member** `rs0`
    (`size: 3`), `sharding.enabled: false`, `backup.enabled: false`, no `pmm`, `upgradeOptions.apply:
    disabled`, DB image **`percona/percona-server-mongodb:8.0.26-11`**, per-member PVCs, and
    `spec.users` with a custom `omada` user (`db: admin`, role `dbOwner` on `omada`, auto-generated
    password). `secrets.users` names the system-users secret. Delete the old chart
    (`Chart.yaml`, `Chart.lock`, `values.yaml`, `charts/mongodb-*.tgz`) and
    `templates/externalsecret-mongodb-credentials.yaml`.
  - Verify (live): all 3 `rs0` pods `Running`; **kernel-guard validation** — check pod logs for a
    SERVER-121912 / kernel-version refusal; if present, change image to `7.0.37-20` and re-apply.
  - Files: `apps/network/src/mongodb/perconaservermongodb.yaml`; delete old mongo chart files.

- [x] **T5.2: ESO Kubernetes SecretStore for the Percona conn-str secret.**
  - Acceptance: `secretstore-mongodb.yaml` — an ESO **Kubernetes** `SecretStore` (or ClusterSecretStore)
    granting read of `mongodb-custom-user-secret-conn-str` in the mongodb namespace; RBAC for ESO's SA.
    `fleet.yaml` `dependsOn` mongodb-operator, network-targeted.
  - Verify (live): the store reports `Ready`.
  - Files: `apps/network/src/mongodb/secretstore-mongodb.yaml`, `fleet.yaml`.

---

## P6 — Omada wiring

- [x] **T6.1: Rewire `mongodb-uri` to the Percona connection string.**
  - Acceptance: `apps/network/src/omada/templates/externalsecret-mongodb-uri.yaml` reads the
    generated connection string via the T5.2 Kubernetes store (key confirmed from the live secret,
    e.g. `omada_rs0_connectionString`/`…Srv`) and materializes `mongodb-uri` in the `omada`
    namespace. If Omada requires the `omada` database in the path, the ExternalSecret `target.template`
    composes `…/omada?authSource=admin` from the fetched string. Omada `values.yaml`
    `externalMongoDBUrlSecret` unchanged (name `mongodb-uri`, key `uri`).
  - Verify (live): `mongodb-uri` Secret present and well-formed; Omada pod `Running`, logs show a
    successful Mongo connection + `omada` DB auth.
  - Files: `apps/network/src/omada/templates/externalsecret-mongodb-uri.yaml` (+ `values.yaml` only if a key/name changes).

---

## P7 — Terranetes teardown (network)

- [ ] **T7.1: Remove Terranetes config + scripts from the network cluster.**
  - Acceptance: delete `apps/network/src/config/{configuration-tailscale.yaml,provider-tailscale.yaml,
    rbac-terranetes-state.yaml}` and `apps/network/scripts/configure.sh`; drop the `configure` task
    from `apps/network/moon.yml`; ensure `platform-terranetes` is **not** targeted at the network
    cluster (leave it intact for other clusters). Must land together with P3 (ACL already
    Crossplane-managed).
  - Verify: `grep -r terraform.appvia.io apps/network` empty; `moon run network` no longer lists
    `configure`; `platform-terranetes` fleet target excludes network.
  - Files: delete the 3 config files + `configure.sh`; edit `moon.yml`; adjust the terranetes bundle target.

- [x] **T7.2: Update `apply.sh` and `bootstrap.sh`.**
  - Acceptance: `apply.sh` mirrors `apps/secret/scripts/apply.sh` (Fleet install + `bin/fleet-apply`,
    no Terranetes-specific steps, no static per-cluster bundle list dependence). `bootstrap.sh` uses
    `VAULT_TOKEN` from `.env` (not 1Password `op`) to reach `https://openbao.secret.vgijssel.nl`, still
    seeds `operator-oauth`, and **also** seeds `kv/network-tailscale-crossplane#api_key` (prompting the
    operator to supply a Tailscale API access token if absent).
  - Verify: `shellcheck` clean; dry idempotent re-run is a no-op; `bootstrap.sh` fails clearly if
    `VAULT_TOKEN` unset or the api_key not provided.
  - Files: `apps/network/scripts/apply.sh`, `apps/network/scripts/bootstrap.sh`.

---

## P8 — Secret-cluster cleanup

- [ ] **T8.1: Remove the obsolete `network-terranetes` role.**
  - Acceptance: delete `apps/secret/src/openbao-config/role-network-terranetes.yaml`; keep
    `role-network-eso.yaml` + `policy-network-read.yaml` (ESO read path) untouched. No new OpenBao
    privileges added.
  - Verify: `grep -r network-terranetes apps/secret` empty; the `network-eso` AuthBackendRole remains.
  - Files: delete `apps/secret/src/openbao-config/role-network-terranetes.yaml`.

- [ ] **T8.2: Apply the cleanup to the running secret cluster.**
  - Acceptance: the AuthBackendRole `network-terranetes` is removed from OpenBao (Orphan deletion
    stops management; optionally confirm it's gone) without disturbing `network-eso`.
  - Verify: `kubectl --context <secret> get authbackendrole.jwt.vault.upbound.io` no longer lists
    `network-terranetes`; network ESO still authenticates.
  - Files: none (apply only).

---

## P9 — Live bring-up & end-to-end validation

- [ ] **T9.1: Seed the Tailscale API key (one-time).**
  - Acceptance: an admin-console Tailscale API access token with `policy_file` write is stored at
    `kv/network-tailscale-crossplane#api_key` in OpenBao (via `bootstrap.sh` / `bao kv put` using
    `VAULT_TOKEN`).
  - Verify: `bao kv get kv/network-tailscale-crossplane` shows `api_key`.

- [ ] **T9.2: Recreate the cluster and apply.**
  - Acceptance: `moon run network:stop` → `network:start` → `network:apply` → `network:bootstrap`
    complete without manual Terranetes steps.
  - Verify: all bundles reconcile; ESO reaches OpenBao (tailnet ACL-A already live); Crossplane +
    Percona operator healthy.

- [ ] **T9.3: End-to-end validation (Success Criteria).**
  - Acceptance: `ACL` MR `SYNCED/READY=True` with the live policy unchanged; PSMDB 3-member `rs0`
    `ready` on arm64 (kernel-guard validated, fallback applied only if needed); `mongodb-uri`
    materialized; Omada `Running` and connected; **no `terraform.appvia.io` objects** on the network
    cluster; secret cluster's `network-eso` still works.
  - Verify: run the command block in SPEC “Commands → Verification”; diff the tailnet policy;
    `kubectl get crds | grep terraform.appvia.io` empty on network.

---

## Risks & mitigations

- **upjet `ACL` create may replace the whole policy.** Mitigation: `deletionPolicy: Orphan` +
  `overwriteExistingContent: true`; author byte-equivalent HuJSON; diff the admin-console policy
  before/after the first apply (P3 checkpoint). Because the content is unchanged, a replace is a no-op.
- **Chicken-and-egg on first apply.** ESO needs OpenBao to sync both `operator-oauth` and the
  `api_key`; OpenBao reachability depends on the tailnet ACL-A grant, which is **already live** from
  the prior Terranetes state. `bootstrap.sh` seeds `operator-oauth` out-of-band to start the operator/
  egress; then ESO + Crossplane converge. If the tailnet policy were ever lost, re-seed via the admin
  console (documented — there is no longer a `network:configure`).
- **PSMDB 8.0.26 kernel guard on OrbStack/vind.** Validated in T5.1; documented fallback `7.0.37-20`.
- **Custom-user connection-string secret keys differ from docs.** Confirm exact keys from the live
  secret in T6.1 before finalizing the ExternalSecret; template the DB path if required.
- **Fleet atomic-release ordering.** ProviderConfig/ACL and the PSMDB CR live in bundles that
  `dependsOn` their operator/provider bundles (CRDs must exist first) — mirrors the secret cluster.
- **Tailscale API key expiry (≤90d).** Accepted; reseed via `bootstrap.sh`. (Rotation automation is
  out of scope — SPEC Open Question #4.)
