# Plan: `apps/secret` — Terranetes → Crossplane migration

Companion to [../SPEC.md](../SPEC.md). This is the refined, dependency-ordered
implementation plan; the task checklist lives in [todo.md](./todo.md).

Scope: **`apps/secret` only.** The `network` cluster stays on Terranetes and keeps
reading `kv/*` from this OpenBao over the tailnet — so every cross-cluster grant must
survive the migration unchanged.

> Doc location note: `CLAUDE.md` forbids new top-level directories, so these task docs
> live under `apps/secret/tasks/` (next to `SPEC.md`/`PLAN.md`) rather than a repo-root
> `tasks/`.

---

## 1. What exists today (baseline)

The `secret` cluster reaches a configured OpenBao through **four** manual steps and
**Terranetes** as the reconciler:

```
secret:start  → vind cluster up (+ qemu/binfmt for amd64 terranetes on arm64)
secret:apply  → fleet install + apply bundles (incl. platform-terranetes)
secret:bootstrap → openssl seal key → 1Password + openbao-seal Secret; bao operator init → 1Password
secret:configure → tofu apply (root token) into shared k8s-backend state; terranetes reconciles after
```

OpenBao config lives in an **OpenTofu module** (`src/openbao-config/*.tf`) reconciled by
`terranetes-controller` via a `Configuration` + `null` `Provider` CR
(`src/config/{configuration,provider}-openbao.yaml`) against a shared
`tfstate-default-openbao-config` Secret (RBAC in `src/config/rbac-terranetes-state.yaml`).

The module provisions (this is the **parity contract** Crossplane must reproduce):

| Resource | Terraform kind | Purpose |
|---|---|---|
| `kv` mount (v2) | `vault_mount` | engine ESO reads cloudflare/tailscale/netdata from |
| `kubernetes` auth backend + config | `vault_auth_backend`, `vault_kubernetes_auth_backend_config` | in-cluster SA login |
| `external-secrets` policy + role | `vault_policy`, `vault_kubernetes_auth_backend_role` | ESO read-only over `kv/*` |
| `terranetes` policy + role → **rename `crossplane`** | `vault_policy`, `vault_kubernetes_auth_backend_role` | the reconciler's own admin login |
| `jwt-network` backend | `vault_jwt_auth_backend` | **network cluster** SA-token auth (live JWKS from `api.network.vgijssel.nl`) |
| `network-read` policy | `vault_policy` | read-only `kv/*` for the network cluster |
| `network-eso` jwt role | `vault_jwt_auth_backend_role` | network ESO (`aud=openbao`) |
| `network-terranetes` jwt role | `vault_jwt_auth_backend_role` | network Terranetes runner (default `aud`) |

**Confirmed constraints:**
- `apps/network` **still uses Terranetes** and still consumes `jwt-network` (both roles + `network-read`). Do **not** touch the network side; keep these grants byte-for-behaviour identical.
- `platform-terranetes` is a **shared** platform bundle. Since `bin/fleet-apply` applies every bundle globally, keep it off *secret* via its **cluster targeting** (target only `network`); leave it deploying for network.
- Crossplane is **not yet vendored**.

---

## 2. Target architecture

```
secret:start  → vind cluster up (+ qemu/binfmt only IFF a needed image lacks arm64)
                → invokes apply.sh (end-to-end; no manual step)
secret:apply  → fleet install + label cluster + bin/fleet-apply (global find):
                  discovers EVERY fleet.yaml in the repo and applies each as a bundle;
                  cluster targeting routes them. dependsOn label selectors still enforce
                  runtime ordering:
                  openbao (self-init + Helm-generated seal Secret)
                  → crossplane (core) → crossplane-provider (provider-vault + ProviderConfig)
                  → openbao-config (Crossplane managed resources = full parity)
                  → config (ClusterSecretStore, ingress, cert, ESO ExternalSecret)
secret:forward → port-forward openbao → localhost:8200 (enter human-only seed kv values)
secret:stop   → vcluster delete
```

Reconciler is **Crossplane + `upbound/provider-vault`** authenticating to OpenBao via
its **Kubernetes auth method**. OpenBao **self-initializes** on first boot (baked into
`values.yaml`): it enables the k8s auth method and creates only the `crossplane`
policy + role (the minimal foothold). Crossplane then reconciles the **full** config.

### Apply mechanism — global `bin/fleet-apply` (per decision)
No hardcoded per-bundle apply list. `bin/fleet-apply` (repo-root helper, alongside
`bin/help`) `find`s every `fleet.yaml` in the repo, `cd`s to the repo root (so Fleet
resolves umbrella `file://` chart deps relative to CWD), and runs `fleet apply` for each,
deriving the bundle name from the path. Adding a component = adding a `src/<x>/fleet.yaml`;
no script edit. **Cluster targeting is the only deploy gate:** each `fleet.yaml`'s
`targetCustomizations` + `clusterSelector` on `cluster.vgijssel.nl/name` decides which
cluster gets a BundleDeployment (declaring `targetCustomizations` replaces Fleet's implicit
deploy-everywhere). This is why `platform-terranetes` staying off `secret` becomes a
*targeting* concern, not an omit-from-list concern (see T3.2). `apps/network`'s `apply.sh`
can reuse the same helper.

### Helm chart dependency "compilation" — Fleet owns it (per decision)
Fleet auto-resolves Helm chart dependencies at bundle-build time (equivalent to
`helm dependency update`; `disableDependencyUpdate` defaults `false`). The umbrella
`Chart.yaml` pins the dependency version and points at the vendir-vendored chart via a
`file://` path; Fleet downloads/assembles the `charts/` archive itself. **We do NOT run
`helm dependency update`/`helm package`, do NOT commit a pre-built `charts/*.tgz`, and do
NOT keep `Chart.lock` as a build artifact.** Pinning lives in `Chart.yaml`; compilation is
Fleet's job. (Gotcha to avoid: per-target chart *version* overrides in `targetCustomizations`
don't work for local relative-path charts — fine here, since no bundle does that.)

### Seal key — the Kubernetes way (per decision)
No script seeds the seal key. The `openbao-seal` Secret is generated **declaratively in
the openbao Helm chart** using Helm's `lookup` + `randBytes` (generate-once, persist
across re-applies). This removes the 1Password dependency for the seal key and matches
self-init semantics (nothing to store externally). Encoding nuance: `randBytes 32`
already yields a base64 string equal to today's `openssl rand -base64 32`; store it via
`stringData` (or `data` with `b64enc`), and on re-apply reuse the existing
`.data["seal-key"]` from `lookup` so the key never rotates.

---

## 3. Dependency graph

```
                     vendir: crossplane chart  ─┐
                                                 ▼
  src/openbao (self-init values + Helm seal Secret)
        │  (self-init creates `crossplane` policy+role)
        ▼
  src/crossplane (core install; CRDs incl. Provider) ──► src/crossplane-provider
                                                            (Provider + ProviderConfig
                                                             k8s-auth + RBAC/SA)
                                                                    │ (ProviderConfig login
                                                                    │  uses crossplane role)
                                                                    ▼
                                                          src/openbao-config
                                                          (managed resources = parity)
                                                                    │ (creates kubernetes auth
                                                                    │  backend + external-secrets
                                                                    │  role/policy)
                                                                    ▼
                                                          src/config ClusterSecretStore
                                                          → ESO ExternalSecret syncs (read path)
```

Fleet `dependsOn` ordering (label selectors):
`crossplane` → `crossplane-provider` → `openbao-config`; and `crossplane-provider`
also `dependsOn` `openbao` (the `crossplane` login role must exist before provider login).

---

## 4. Slicing strategy — thin vertical slice first

Rather than build all config horizontally then hope auth works, **Phase 1 delivers a
walking skeleton**: self-init + Crossplane + provider + **one** managed resource (the
`kv` mount) reaching `SYNCED=True READY=True`. That single path exercises every risky
link in the chain — self-init `crossplane` role, provider-vault Kubernetes-auth login,
arm64 image support, MR reconcile — *before* we invest in full parity. Phase 2 then
fans out the remaining resources against a proven mechanism.

---

## 5. Phases & checkpoints

### Phase 0 — De-risk spikes (read/prototype only; no committed design change)
Resolve the SPEC §2 "ask-first" risks. Output is recorded findings in SPEC/PLAN, not
production manifests.

- **T0.1** `provider-vault` (target v4.0.0) `ProviderConfig`: does it support
  **Kubernetes-auth login** directly? Inspect CRD schema (`doc.crds.dev` /
  `kubectl explain providerconfig.spec`). Record the exact auth block. If unsupported →
  choose fallback (Vault-Agent-injected token or file-sourced token source) and note it.
- **T0.2** arm64 images for **Crossplane core** chart + **provider-vault** xpkg. If
  either is amd64-only → reuse the qemu/binfmt registration already in `start.sh`.
- **T0.3** `provider-vault` **managed-resource coverage** for every parity kind: KV v2
  `Mount`, `kubernetes` `AuthBackend`/`AuthBackendConfig`/`AuthBackendRole`, ACL
  `Policy`, **jwt** `AuthBackend`/`AuthBackendRole`. Record the exact GVKs.
- **T0.4** OpenBao 0.28.4 self-init: confirm the `initialize` stanza exists in this
  version and capture the exact HCL to (a) enable k8s auth, (b) write the `crossplane`
  policy, (c) create the `crossplane` role. Confirm root-token auto-revoke behaviour.
- **T0.5** Fleet Helm **`lookup` support**: confirm Fleet's Helm rendering honours
  `lookup` during install/upgrade (needed for generate-once seal Secret). If not →
  fallback is an in-cluster generator Job + RBAC (documented, not built unless needed).

> **CHECKPOINT 0 (human review):** All five findings recorded. If T0.1 forces a
> non-k8s-auth path, or T0.3 shows a missing MR kind, or T0.4 shows self-init is
> unavailable → **stop and revise the SPEC** before Phase 1. Everything downstream
> assumes k8s-auth + full MR coverage + self-init.

#### Phase 0 findings — RESOLVED (2026-07-23), CHECKPOINT 0 PASSED

All gates green; the SPEC design holds, no revision needed.

**T0.1 — provider-vault k8s-auth: SUPPORTED natively.** `ProviderConfig`
(`vault.upbound.io/v1beta1`) has `spec.credentials.source: Kubernetes` with a CRD
XValidation rule requiring `spec.role` when that source is used. It logs in with the
provider pod's own ServiceAccount token (like the terranetes `auth_login`). Shape:
```yaml
apiVersion: vault.upbound.io/v1beta1
kind: ProviderConfig
metadata: { name: openbao }
spec:
  address: http://openbao.secret.svc:8200
  skip_child_token: true        # crossplane role lacks auth/token/create (matches provider.tf)
  role: crossplane              # vault kubernetes auth role (self-init creates it)
  mountPath: kubernetes         # default
  credentials: { source: Kubernetes }
```
Wiring: the provider pod needs a **stable** SA name so the vault role can bind it. Use a
`DeploymentRuntimeConfig` (pkg.crossplane.io/v1beta1) referenced from the `Provider` via
`runtimeConfigRef`, giving the pod a fixed `serviceAccountName` (e.g. `provider-vault`) in
`crossplane-system`; the vault `crossplane` role binds
`bound_service_account_names=[provider-vault]`, `..._namespaces=[crossplane-system]`.
No fallback (Vault-Agent / file token) required.

**T0.2 — arm64: BOTH multi-arch.** `xpkg.upbound.io/upbound/provider-vault:v4.0.0`
publishes arm64 **and** amd64; `crossplane/crossplane` core is multi-arch (amd64/arm/arm64/
ppc64le). No qemu/binfmt needed for the new components — the qemu block in `start.sh` was
only for amd64-only terranetes and can be dropped once terranetes is removed (T3.1/T4).

**T0.3 — MR coverage: COMPLETE.** provider v4 splits APIs into `cluster` (cluster-scoped)
and `namespaced`; use the **cluster-scoped** kinds. Parity map:

| Terraform resource | Crossplane kind / apiVersion |
|---|---|
| `vault_mount` (kv v2) | `Mount` — `vault.vault.upbound.io/v1alpha1` |
| `vault_auth_backend` (enable) | `Backend` — `auth.vault.upbound.io/v1alpha1` (`forProvider.type`, `path`) |
| `vault_kubernetes_auth_backend_config` | `AuthBackendConfig` — `kubernetes.vault.upbound.io/v1alpha1` |
| `vault_kubernetes_auth_backend_role` | `AuthBackendRole` — `kubernetes.vault.upbound.io/v1alpha1` |
| `vault_policy` | `Policy` — `vault.vault.upbound.io/v1alpha1` |
| `vault_jwt_auth_backend` | `AuthBackend` — `jwt.vault.upbound.io/v1alpha1` |
| `vault_jwt_auth_backend_role` | `AuthBackendRole` — `jwt.vault.upbound.io/v1alpha1` |

Child resources reference their backend by the `backend` string field (e.g.
`backend: kubernetes`) or a `backendRef`/`backendSelector` cross-resource ref. Since the
auth mount paths are deterministic (`kubernetes`, `jwt-network`), the literal `backend`
string is simplest and avoids ref-resolution ordering.

**T0.4 — OpenBao self-init: AVAILABLE (2.5.x).** Top-level `initialize` stanza runs once on
first boot as root, then **revokes the root token**; with a static/auto seal **no recovery
keys are generated**. Goes into the server `config:` HCL (values.yaml). Minimal subset HCL:
```hcl
initialize "crossplane_foothold" {
  request "enable_k8s_auth" {
    operation = "write"
    path      = "sys/auth/kubernetes"
    data      = { type = "kubernetes" }
  }
  request "configure_k8s_auth" {
    operation = "write"
    path      = "auth/kubernetes/config"
    data      = { kubernetes_host = "https://kubernetes.default.svc:443" }
  }
  request "write_crossplane_policy" {
    operation = "write"
    path      = "sys/policies/acl/crossplane"
    data      = { policy = "<same body as the crossplane MR policy — keep identical, T2.3>" }
  }
  request "create_crossplane_role" {
    operation = "write"
    path      = "auth/kubernetes/role/crossplane"
    data = {
      bound_service_account_names      = "provider-vault"
      bound_service_account_namespaces = "crossplane-system"
      token_policies                   = "crossplane"
    }
  }
}
```
Requests run sequentially; `allow_failure = true` is available per-request if ever needed
(not needed here). In-cluster OpenBao auto-reviews SA tokens with its own SA
(system:auth-delegator), so only `kubernetes_host` is required in the config.

**T0.5 — Fleet `lookup`: SUPPORTED, with a placement caveat.** rancher/fleet #1851 (closed,
backported to v2.13) fixed `lookup` returning empty; Fleet detects lookup via
`hasLookupFunction()` and then renders against the live cluster. Caveat from #5198: the
detector historically only inspected the template root and **missed `lookup` inside
`define`/`_helpers.tpl` helpers** — so the seal-Secret template must call `lookup`
**directly in `secret-openbao-seal.yaml`**, not via a helper. Version note: hermit pins the
fleet CLI at 0.15.4; confirm empirically at **T1.3** (apply twice → `seal-key` unchanged).
If 0.15.4 predates the fix, fall back to an in-cluster generator Job + RBAC (documented,
not built unless T1.3 fails).

---

### Phase 1 — Walking skeleton (thin vertical slice)
Prove the entire chain end-to-end with the minimum surface.

- **T1.1** Vendor the Crossplane Helm chart (pinned exact version) in
  `third_party/vendir/vendir.yml`; `vendir sync`; confirm intentional `vendir.lock.yml`
  diff and `moon run <vendir project>:test` passes.
- **T1.2** `src/openbao/values.yaml`: add the self-init `initialize` stanzas (minimal
  subset from T0.4 — enable k8s auth + `crossplane` policy + `crossplane` role). Keep
  static auto-unseal untouched.
- **T1.3** `src/openbao/templates/secret-openbao-seal.yaml`: Helm-templated
  `openbao-seal` Secret via `lookup` + `randBytes` (generate-once, persist). Remove the
  seal-key path from `bootstrap.sh`'s responsibilities (script itself deleted in Phase 4).
- **T1.4** `src/crossplane/` umbrella chart + `values.yaml` + `fleet.yaml` (namespace
  `crossplane-system`).
- **T1.5** `src/crossplane-provider/`: `provider-vault.yaml` (pinned tag **+ digest**),
  `providerconfig-openbao.yaml` (k8s-auth per T0.1), provider SA + RBAC for projected
  token, `fleet.yaml` with `dependsOn: crossplane` **and** `dependsOn: openbao`.
- **T1.6** `src/openbao-config/mount-kv.yaml`: the single `kv` v2 `Mount` managed
  resource, with `deletionPolicy: Orphan` (retain). `fleet.yaml` with
  `dependsOn: crossplane-provider`.
- **T1.7** Create `bin/fleet-apply` (repo-root helper): `find` every `fleet.yaml`, `cd`
  to repo root, `fleet apply` each (bundle name derived from path). Have `apply.sh` call
  it after Fleet install + cluster label. The new `crossplane`/`crossplane-provider`/
  `openbao-config` bundles are then discovered automatically — no list to maintain.
  Runtime ordering still comes from `dependsOn` label selectors, not apply order.
  (`platform-terranetes` is discovered too; keeping it off `secret` is handled by its
  targeting in Phase 3, not here.)

**Acceptance:** on a clean docker, `secret:start` → `secret:apply` brings up OpenBao
Ready **with no bootstrap/configure step**; `bao status` shows
`initialized=true, sealed=false`; the `crossplane` k8s-auth role exists; the ProviderConfig
is `HEALTHY`; the `kv` `Mount` MR is `SYNCED=True READY=True`.

> **CHECKPOINT 1 (critical gate — human review):** The SPEC §2 risks are now *proven in
> a live cluster*, not just researched. Do not proceed to full parity until the `kv`
> mount reconciles via k8s-auth on this host's architecture.

---

### Phase 2 — Full config parity (fan out managed resources)
With the mechanism proven, replicate the remaining parity contract as Crossplane MRs.
Every MR gets `deletionPolicy: Orphan` so removing it never destroys OpenBao data
(mirrors the Terranetes `orphan` annotation).

- **T2.1** `authbackend-kubernetes.yaml` + `authbackendconfig-kubernetes.yaml`
  (`kubernetes_host = https://kubernetes.default.svc:443`).
- **T2.2** `policy-external-secrets.yaml` + `role-external-secrets.yaml` (bound to SA
  `external-secrets/external-secrets`, `token_policies=[external-secrets]`). Body
  equivalent to the current TF policy.
- **T2.3** `policy-crossplane.yaml` (renamed from `terranetes`; same broad
  `sys/*`+`auth/*` grants incl. `auth/jwt-network/*` so Crossplane can always re-grant
  itself). Confirm it matches the self-init policy from T1.2 (self-init creates it;
  Crossplane then owns/reconciles it — verify no drift/fight).
- **T2.4** `authbackend-jwt-network.yaml` (`bound_issuer`, `jwks_url`,
  `jwks_ca_pem` as manifest fields — values from `variables.tf` defaults:
  issuer `https://kubernetes.default.svc.cluster.local`, jwks
  `https://api.network.vgijssel.nl/openid/v1/jwks`).
- **T2.5** `policy-network-read.yaml` + `role-network-eso.yaml` (jwt,
  `bound_audiences=[openbao]`, subject `system:serviceaccount:external-secrets:external-secrets`)
  + `role-network-terranetes.yaml` (jwt, `bound_audiences=[<issuer>]`, subject
  `system:serviceaccount:terranetes-system:terranetes-executor`). **Both** jwt roles are
  parity-critical for the network cluster.
- **T2.6** Update `src/openbao-config/fleet.yaml` to cover all MRs; ordering unchanged.

**Acceptance:** `kubectl get managed` shows **all** `openbao-config` MRs
`SYNCED=True READY=True`; KV mount, `external-secrets` role/policy, `jwt-network`
backend + `network-eso` + `network-terranetes` roles + `network-read` policy all exist
in OpenBao (verified via `bao` read against the port-forward).

> **CHECKPOINT 2 (human review):** Full parity present and reconciling. Confirm against
> the Phase-1 baseline table before proving the read path.

---

### Phase 3 — Read path + script/apply wiring + config trim
Prove the consumer path and finish the operational surface.

- **T3.1** `start.sh`: after node Ready, invoke `apply.sh` (single entry point).
  qemu/binfmt block: gate it on "a required image lacks arm64" per T0.2 (drop the
  terranetes-specific comment; keep only if still needed).
- **T3.2** Keep `platform-terranetes` **off the `secret` cluster via cluster targeting**,
  not by omission — `bin/fleet-apply` (T1.7) applies it globally, so its `fleet.yaml`
  `targetCustomizations`/`clusterSelector` must match only `network`. Verify no
  BundleDeployment lands on `secret`. (Leave the bundle intact for network.)
- **T3.3** Add `scripts/forward.sh` + `secret:forward` task (port-forward openbao svc →
  `localhost:8200`; long-running).
- **T3.4** Trim `src/config/`: keep `certificate-secret.yaml`, `ingress-openbao.yaml`,
  `clustersecretstore-openbao.yaml`, `externalsecret-operator-oauth.yaml`, `fleet.yaml`;
  remove Terranetes CRs (see Phase 4).
- **T3.5** Verify an `ExternalSecret` (operator-oauth) syncs via the OpenBao
  `ClusterSecretStore` end-to-end (requires the human-seeded kv values via
  `secret:forward`).

**Acceptance:** `secret:start` alone (clean docker) reaches a fully configured cluster;
`secret:forward` works; an `ExternalSecret` reports `SecretSynced=True` after kv values
are entered.

> **CHECKPOINT 3 (human review):** End-to-end read path proven; single-command bring-up
> confirmed. Safe to delete Terranetes.

---

### Phase 4 — Remove Terranetes + finalize + verify
Delete the old reconciler and its scaffolding; run the full acceptance matrix.

- **T4.1** Delete `src/openbao-config/*.tf`, `.terraform*`, `.gitignore`,
  `terraform/` state dir.
- **T4.1b** Delete the committed `src/openbao/charts/*.tgz` and `src/openbao/Chart.lock`
  — Fleet downloads chart deps at build (`disableDependencyUpdate: false`). Confirm no
  `helm dependency update`/`helm package` remains anywhere in the `apps/secret` flow.
- **T4.2** Delete `src/config/configuration-openbao.yaml`,
  `src/config/provider-openbao.yaml`, `src/config/rbac-terranetes-state.yaml`.
- **T4.3** Delete `scripts/bootstrap.sh` + `scripts/configure.sh`; remove
  `secret:bootstrap` + `secret:configure` from `moon.yml`; add `secret:forward`.
- **T4.4** `trunk fmt` + `trunk check` clean (shellcheck new/changed scripts, yamllint
  manifests).
- **T4.5** Idempotency: re-run `secret:start`/`secret:apply` = no-op; `secret:stop` +
  `secret:start` rebuilds to the same ready state with no manual bootstrap.
- **T4.6** Negative check: no Terranetes CRs, no `zz_backend.tf`, no `.tf` files, no
  committed `charts/*.tgz`/`Chart.lock` under `apps/secret`; `platform-terranetes`
  produces **no BundleDeployment on the secret cluster** (Bundle may exist from global
  apply, but targeting excludes `secret`); `apps/network` and `apps/platform` untouched.

> **CHECKPOINT 4 (final human review):** Full acceptance matrix (SPEC §6) green;
> network parity intact; ready for PR / merge (update any `ref=` in remaining manifests
> to `main` at merge time).

---

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| provider-vault can't do k8s-auth login directly | T0.1 gate before Phase 1; fallback token source recorded |
| provider-vault / crossplane amd64-only on arm64 host | T0.2; reuse existing qemu/binfmt registration |
| Missing MR kind for jwt backend/role | T0.3 gate; if missing, keep a narrow Terranetes island for jwt only (ask-first) |
| Fleet Helm ignores `lookup` → seal key rotates each reconcile → OpenBao won't unseal | T0.5 gate; fallback in-cluster generator Job + RBAC |
| Self-init policy vs Crossplane-owned `crossplane` policy drift/fight | Keep both identical (T2.3); self-init creates, Crossplane reconciles same content |
| Deleting MRs destroys OpenBao data | `deletionPolicy: Orphan` on every MR (T1.6, all of Phase 2) |
| Breaking network cluster's cross-cluster reads | Never touch `apps/network`; keep `jwt-network` + both roles + `network-read` exact (T2.4/T2.5); negative check T4.6 |

## 7. Out of scope (deferred)
- K8s-Secret → 1Password async push (operator / ESO `PushSecret`).
- Migrating `apps/network` off Terranetes.
- Seal-key rotation mechanism.
