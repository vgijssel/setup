# SPEC: apps/secret — OpenBao on vind, self-initialized, configured by Crossplane

Status: Draft (awaiting approval)
Owner: mvgijssel
Branch: `mg/feat/crossplane-secret`
Scope: `apps/secret` only (network cluster's Terranetes usage is out of scope for this change)

## 1. Objective

Replace the current Terranetes + imperative bootstrap-script flow for the `secret`
cluster with a fully declarative, self-bootstrapping setup:

- `moon run secret:start` spins up a **vind** (vcluster, docker driver) cluster and
  then runs the Fleet apply end-to-end. No further manual steps are required for the
  cluster to reach a ready, configured state.
- **OpenBao** boots on its own using **auto-unseal** (static seal, already in place)
  plus **self-initialization**. There is **no `bootstrap.sh`** and **no `configure.sh`**:
  initialization is baked into the OpenBao server config.
- Self-init installs only the **minimal** configuration required to let OpenBao be
  managed from within Kubernetes: enable the **Kubernetes auth method** and create the
  policy + role that **Crossplane** uses to log in.
- **Crossplane** with **upbound/provider-vault** then reconciles the **complete**
  OpenBao configuration (KV v2 mount, auth methods, roles, policies, cross-cluster JWT
  backend, ESO wiring) over the Kubernetes auth method. Crossplane, not Terranetes, is
  the reconciliation engine.
- Anything that must be **extracted from OpenBao** is written to a **Kubernetes Secret**
  (so a future async operator can mirror it to 1Password). No push-to-1Password
  mechanism is built in this change (deferred).

### Non-goals (this change)
- Migrating the `network` cluster off Terranetes, or changing the cross-cluster JWT
  trust from the network side.
- Building the async K8s-Secret → 1Password operator/`PushSecret` (deferred; the K8s
  Secret is the contract, the sink comes later).
- Rotating or changing the static seal key mechanism (kept as-is: `env://SEAL_KEY` from
  the `openbao-seal` Secret).

### Target users
Repo maintainer(s) operating the homelab from a workstation (arm64 macOS via OrbStack /
Linux). The flow must be reproducible and idempotent from a clean checkout.

## 2. Key design decisions (resolved)

| Decision | Choice |
|---|---|
| Init credentials (root token / recovery keys) | Self-init **revokes the root token after use** and **generates no recovery keys** (per OpenBao self-init semantics). With static auto-unseal there is nothing to store externally; any secret that *does* need to leave OpenBao goes to a K8s Secret. Break-glass is via the authenticated recovery-key rotation endpoint. |
| K8s-Secret → 1Password push | **Deferred / manual.** Not implemented here. |
| OpenBao config scope owned by Crossplane | **Full parity** with today's OpenTofu module (KV v2, kubernetes auth + roles/policies for external-secrets and crossplane, network-cluster JWT backend, ESO `ClusterSecretStore` wiring). |
| Command flow | `secret:start` runs cluster bring-up **and** `apply`. `bootstrap` + `configure` removed. Terranetes removed from `apps/secret` only. |
| Crossplane auth to OpenBao | **Kubernetes auth method.** `provider-vault` `ProviderConfig` logs in with a projected ServiceAccount token against the `crossplane` role created by self-init. |
| Fleet apply mechanism | **Global `bin/fleet-apply`** (repo-wide helper, alongside `bin/help`). It `find`s **every** `fleet.yaml` under the repo and applies each as a bundle in one pass — no hardcoded per-bundle list. **Cluster targeting is the only gate:** each bundle's `targetCustomizations` + `clusterSelector` on `cluster.vgijssel.nl/name` decides which cluster it deploys to (declaring `targetCustomizations` replaces Fleet's implicit deploy-everywhere). Keeping a bundle off the `secret` cluster (e.g. `platform-terranetes`) is done by its own targeting, **not** by omitting it from an apply list. `apps/network`'s `apply.sh` can reuse the same helper. |
| Helm chart dependency "compilation" | **Fleet owns it.** Fleet auto-resolves Helm chart dependencies at bundle-build time (equivalent to `helm dependency update`; `disableDependencyUpdate` defaults `false`), resolving the umbrella `Chart.yaml`'s `file://` dep against the vendir-vendored chart source (relative to `bin/fleet-apply`'s CWD = repo root). **No local `helm dependency update`/`helm package`, no committed `charts/*.tgz` dependency archive, no `Chart.lock` as a build artifact.** Pin the dependency version in `Chart.yaml`; Fleet does the rest. |

> ⚠️ Implementation risk to verify early (see §6 Boundaries → Ask first):
> 1. `provider-vault` v4.0.0 `ProviderConfig` must support Kubernetes auth login
>    directly. If it does not, fall back to a Vault-Agent-injected token or a
>    short-lived token source read from file — decide before committing to the design.
> 2. `upbound/provider-vault` container image must run on **arm64** (host is arm64;
>    Terranetes was amd64-only and needed qemu/binfmt). Confirm multi-arch; if absent,
>    reuse the existing qemu/binfmt registration pattern from `start.sh`.

## 3. Commands (moon tasks / scripts)

All tasks: `language: bash`, `layer: application`, `runInCI: false`, `interactive: true`,
`cache: false` (they manage external state: docker, cluster, OpenBao).

| Task | Script | Behavior |
|---|---|---|
| `secret:start` | `scripts/start.sh` | Set docker driver; create or reconnect the `secret` vcluster (`vcluster create secret --driver docker --connect`); wait for node Ready; register qemu/binfmt for amd64 **iff** a required image lacks arm64; **then invoke `apply.sh`**. Idempotent. |
| `secret:apply` | `scripts/apply.sh` | Install Fleet (fleet-crd + fleet, vendored charts); label `fleet-local` cluster `cluster.vgijssel.nl/name=secret`; then invoke **`bin/fleet-apply`** which `find`s every `fleet.yaml` in the repo and applies each as a bundle (cluster targeting routes them). Idempotent; safe to re-run. |
| `secret:forward` | `scripts/forward.sh` | Port-forward the OpenBao service to `localhost:8200` so an operator can enter the handful of seed secrets OpenBao cannot self-provide (e.g. Cloudflare / Tailscale OAuth / Netdata creds) via CLI or UI. Long-running; Ctrl-C to stop. |
| `secret:stop` | `scripts/stop.sh` | `vcluster delete secret`. No-op if absent. |

Removed: `secret:bootstrap`, `secret:configure` (and `scripts/bootstrap.sh`,
`scripts/configure.sh`). Their responsibilities are now: seal-key handling → still a
K8s Secret but managed declaratively (see §4); OpenBao init → self-init; OpenBao
config → Crossplane.

Expected end-to-end usage from a clean checkout:
```bash
moon run secret:start     # cluster up + fleet apply; OpenBao self-inits & auto-unseals; Crossplane configures it
moon run secret:forward   # (optional) enter seed secrets that must come from a human
moon run secret:stop       # tear down
```

## 4. Project structure

```
apps/secret/
├── SPEC.md                         # this file
├── moon.yml                        # tasks: start, apply, forward, stop
├── scripts/
│   ├── start.sh                    # vcluster up + calls apply.sh
│   ├── apply.sh                    # fleet install + bin/fleet-apply (global find)
│   ├── forward.sh                  # port-forward openbao -> localhost:8200
│   └── stop.sh                     # vcluster delete
└── src/
    ├── openbao/                    # OpenBao Helm umbrella chart (dep pinned to vendored 0.28.4)
    │   ├── Chart.yaml              # file:// dep on third_party/vendir/charts/openbao; Fleet resolves it
    │   ├── values.yaml             # static auto-unseal + SELF-INIT `initialize` stanzas
    │   └── fleet.yaml              # (no committed charts/*.tgz — Fleet downloads deps at build)
    ├── crossplane/                 # NEW: Crossplane core (Helm) install
    │   ├── Chart.yaml / values.yaml
    │   └── fleet.yaml
    ├── crossplane-provider/        # NEW: provider-vault Provider + ProviderConfig
    │   ├── provider-vault.yaml      # pkg.crossplane.io/v1 Provider (pinned digest/tag)
    │   ├── providerconfig-openbao.yaml  # kubernetes-auth login to openbao
    │   ├── rbac-*.yaml             # SA/role for provider pod token projection
    │   └── fleet.yaml              # dependsOn: crossplane
    ├── openbao-config/             # NEW: Crossplane managed resources (replaces OpenTofu module)
    │   ├── mount-kv.yaml           # KV v2 mount
    │   ├── authbackend-kubernetes.yaml
    │   ├── authbackend-jwt-network.yaml
    │   ├── policy-*.yaml           # external-secrets, crossplane, network-read
    │   ├── role-*.yaml             # kubernetes-auth roles + jwt roles
    │   └── fleet.yaml              # dependsOn: crossplane-provider
    ├── config/                     # trimmed: cert, ingress, ESO ClusterSecretStore, seal Secret source
    │   ├── clustersecretstore-openbao.yaml
    │   ├── externalsecret-operator-oauth.yaml
    │   ├── ingress-openbao.yaml
    │   ├── certificate-secret.yaml
    │   └── fleet.yaml
    ├── apiserver-proxy/            # unchanged (Tailscale VIP api.secret.vgijssel.nl)
    └── tailscale-proxygroup/       # unchanged (secret-ingress ProxyGroup)
```

Removed from `apps/secret`:
- `src/config/configuration-openbao.yaml`, `src/config/provider-openbao.yaml`
  (Terranetes CRs)
- `src/config/rbac-terranetes-state.yaml`
- `src/openbao-config/*.tf` (OpenTofu module) — replaced by Crossplane managed resources
- `charts/openbao-0.28.4.tgz` + `Chart.lock` from `src/openbao/` — the pre-compiled
  dependency archive is no longer committed; Fleet downloads the dependency at build.
- `platform-terranetes` must stay off the `secret` cluster. Because `bin/fleet-apply`
  applies every bundle globally, this is now enforced by that bundle's **cluster
  targeting** (its `fleet.yaml` targets only `network`), not by omitting it from an
  apply list. Leave the platform bundle intact for the network cluster.

New vendored charts (via `third_party/vendir/vendir.yml`, pinned):
- `crossplane` (Helm chart, exact version) → `third_party/vendir/charts/crossplane`
- `provider-vault` is delivered as a Crossplane package (OCI `xpkg`), pinned by tag +
  digest in `provider-vault.yaml` — not vendored via Helm.

### Self-init contract (baked into `src/openbao/values.yaml`)
The server `config` gains `initialize` stanzas that run once on first boot as root
(token auto-revoked afterward). Minimal set only:
1. `sys/auth/kubernetes` — enable Kubernetes auth method.
2. `auth/kubernetes/config` — point at the in-cluster API / JWT issuer.
3. `sys/policies/acl/crossplane` — policy allowing Crossplane to manage `sys/*`,
   `auth/*`, mounts (mirrors today's `terranetes` policy, renamed).
4. `auth/kubernetes/role/crossplane` — bind the crossplane-system provider SA to that
   policy.
Everything else (KV mount, external-secrets role/policy, network JWT backend) is
**owned by Crossplane**, not self-init — keeping self-init a true minimal subset.

## 5. Code style & conventions

- **Follow repo conventions** in `CLAUDE.md`. All new code under `apps/` (this project)
  or vendored deps under `third_party/`.
- **Kubernetes manifests:** filename `\<kind\>-\<name\>.yaml` (e.g.
  `mount-kv.yaml`, `providerconfig-openbao.yaml`).
- **Pinning (mandatory):** Crossplane Helm chart pinned to an exact version in
  `vendir.yml`; `provider-vault` Provider pinned to `...:v4.0.0` **with digest**;
  OpenBao chart dep stays `0.28.4` (pinned in the umbrella `Chart.yaml`). No `latest`,
  no unpinned `npx`/`uvx`. **Fleet resolves/downloads chart dependencies at bundle-build
  time — do NOT run `helm dependency update`/`helm package` or commit pre-built
  `charts/*.tgz` archives. Pinning lives in `Chart.yaml`, compilation is Fleet's job.**
- **Fleet:** one `fleet.yaml` per `src/<component>/`; cross-component ordering via
  `dependsOn` label selectors (`fleet.vgijssel.nl/bundle=<name>`). Cluster targeting via
  `targetCustomizations` + `clusterSelector` on `cluster.vgijssel.nl/name` — this is the
  **only** deploy gate. Apply is global: `bin/fleet-apply` (repo-root helper) `find`s
  every `fleet.yaml` and applies each as a bundle; there is no hardcoded apply list.
- **Scripts:** `bash`, `set -euo pipefail`, idempotent, safe to re-run, mirror the
  existing `start.sh`/`apply.sh` structure and logging style (echo current context,
  suggest next command). Platform detection via `IS_MACOS` / `IS_LINUX`.
- **Naming migration:** rename the `terranetes` OpenBao policy/role to `crossplane`;
  keep `external-secrets` and `network-read` policy names for continuity.
- Prefer editing existing files over creating new ones; do not add README/docs unless
  requested.

## 6. Testing strategy

Because tasks are `runInCI: false` and manage live external state, verification is
primarily local + declarative-lint:

- **Lint/format:** `trunk fmt` and `trunk check` clean (yamllint, shellcheck on new
  scripts).
- **Vendir lock integrity:** `moon run <vendir project>:test` — `git diff --exit-code
  vendir.lock.yml` stays clean after adding the crossplane chart.
- **Fleet manifest validity:** every new `fleet.yaml` and manifest parses; bundles
  reach `Ready` (dependency order: crossplane → crossplane-provider → openbao-config).
- **End-to-end acceptance (manual, local):**
  1. `moon run secret:start` on a clean docker → cluster comes up, `apply` runs.
  2. `kubectl -n secret get pod openbao-0` reaches Ready **without** any bootstrap
     script: proves auto-unseal + self-init.
  3. `bao status` shows `initialized=true`, `sealed=false`.
  4. Kubernetes auth method + `crossplane` role exist immediately after boot (self-init
     subset present).
  5. `kubectl get managed` (or provider-vault MR kinds) shows all `openbao-config`
     resources `SYNCED=True READY=True` — proves Crossplane took over via k8s auth.
  6. KV v2 mount, `external-secrets` role/policy, and `jwt-network` backend exist
     (full parity).
  7. An `ExternalSecret` (e.g. operator-oauth) syncs successfully via the
     `ClusterSecretStore` — proves the read path end-to-end.
  8. Re-running `secret:start`/`secret:apply` is a no-op (idempotency).
  9. `moon run secret:stop` deletes the cluster; a subsequent `secret:start` rebuilds
     to the same ready state with no manual bootstrap.
- **Negative check:** confirm no Terranetes CRs and no `zz_backend.tf` under
  `apps/secret`. The `platform-terranetes` bundle may exist in `fleet-local` (global
  apply creates it) but must produce **no BundleDeployment on the `secret` cluster** —
  verify its cluster targeting excludes `secret`.
- **Global-apply check:** `bin/fleet-apply` discovers and applies every `fleet.yaml`;
  the `secret` cluster receives exactly the bundles whose targeting matches it.

## 7. Boundaries

### Always
- Keep every task idempotent and re-runnable; no manual step between `start` and a
  ready, configured cluster.
- Keep all secrets out of git and off disk; secrets extracted from OpenBao land only in
  K8s Secrets.
- Pin all new dependencies (chart versions, provider digest) per `CLAUDE.md`.
- Keep self-init a strict *minimal subset*; Crossplane owns the full config.
- Preserve the existing tailnet exposure (OpenBao ingress `secret.vgijssel.nl`, API VIP
  `api.secret.vgijssel.nl`, `secret-ingress` ProxyGroup) and the static auto-unseal
  seal-key Secret contract.

### Ask first
- If `provider-vault` cannot do Kubernetes-auth login directly (fallback: Vault Agent
  injection or file-sourced token) — confirm the chosen auth path before building.
- If `provider-vault` / Crossplane images lack arm64 and need qemu/binfmt or a source
  build — confirm the workaround.
- Any change that touches the `network` cluster, the cross-cluster JWT trust, or shared
  `apps/platform` bundles beyond retargeting `platform-terranetes` away from the secret cluster.
- Changing the seal mechanism, seal-key storage, or the 1Password service-account
  contract.

### Never
- Never reintroduce imperative bootstrap/configure steps for normal bring-up.
- Never store a root token or recovery material in-cluster persistently or in git (self-
  init discards them by design).
- Never delete the Crossplane `Configuration`/managed resources in a way that destroys
  OpenBao data; treat OpenBao state (raft PVC) as durable. Use orphan/retain semantics
  when removing managed resources (mirror today's Terranetes orphan protection).
- Never use unpinned packages or `latest` tags; never `npx`/`uvx`.
- Never process HackerOne "Critical" data in this repo context.

---

### Open questions to resolve during implementation (tracked, not blocking approval)
1. Exact `provider-vault` `ProviderConfig` Kubernetes-auth schema (verify against v4.0.0
   CRDs) and the projected-token/RBAC wiring for the provider pod.
2. Crossplane Helm chart version to pin, and whether provider-vault MR coverage is
   complete for the JWT (`auth/jwt`) backend + roles we need.
3. arm64 image availability for crossplane core + provider-vault.
