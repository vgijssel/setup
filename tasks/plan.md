# Implementation Plan: Standalone OpenBao "secret" cluster

> Derived from `SPEC.md`. Read-only planning artifact — no code is written until this plan is
> approved. Task checklist lives in `tasks/todo.md`.

## Overview

Stand up a single standalone Kubernetes cluster (`vind` = vcluster/docker) whose only job is to
run OpenBao and serve secrets to other clusters. It is provisioned by the **Fleet CLI** into an
empty cluster, OpenBao **auto-unseals** (static seal), has **no auth** (root token mints
short-lived tokens), and is reachable at **`https://secret.vgijssel.nl` on the tailnet only** with
a valid Let's Encrypt cert. This is a stepping stone: the same `fleet.yaml` bundles are later
consumed by a Rancher-managed Fleet — so the standalone Fleet controller and `fleet apply` are the
only throwaway pieces.

## Architecture Decisions

- **Reuse over rewrite.** The vault-config-operator config CRs, `ClusterSecretStore`, and the
  cloudflare/tailscale/netdata `ExternalSecret`s already exist and were validated under Tilt. The
  plan re-homes them into Fleet bundles rather than re-authoring them.
- **Substrate swap is isolated.** k3d→vind and Tilt→Fleet are the substrate change; the workload
  manifests are largely unchanged. Build the substrate first (Phase 1), then the workloads reconcile
  on top exactly as before.
- **Portable bundles.** Everything is authored as `fleet.yaml` bundles wrapping the existing Helm
  umbrella charts, so a future Rancher `GitRepo` targets the same paths unchanged.
- **Continuous reconciliation absorbs the bootstrap cycle.** ESO needs OpenBao seeded; cert-manager
  / external-dns / tailscale need ESO-synced secrets. Fleet (like Tilt before it) leaves those CRs
  erroring-and-retrying until OpenBao is initialised and seeded — expected, not a failure.
- **CLIs pinned via hermit.** `vcluster` 0.32.1 (existing) and `fleet` 0.15.4 (new manifest).
- **Retirement is gated last.** Deleting `apps/bootstrap`, `apps/gateway-prod`, `libs/gateway-image`,
  the sigv4-proxy, and `apps/auth` happens only after the new cluster is verified end-to-end.

## Dependency Graph

```
vind cluster (T1)
   │
   ├── Fleet controller install (T2)
   │        │
   │        └── bundle scaffolding + `fleet apply` harness (T3)
   │                 │
   │   static seal key Secret (1Password → K8s) ──┐
   │                 │                            │
   │                 ▼                            ▼
   │          OpenBao boots AUTO-UNSEALED (T4) ◄──┘
   │                 │
   │                 ├── init: recovery keys+root token→1Password + operator foothold (T5)
   │                 │        │
   │                 │        └── vault-config-operator reconciles kv engine + policies/roles (T6)
   │                 │                 │
   │                 │                 └── ESO store + seed real kv values → secrets sync (T7)
   │                 │                          │
   │                 │          ┌───────────────┼────────────────┬───────────────┐
   │                 │          ▼               ▼                ▼               ▼
   │                 │   external-dns +   OpenBao tailnet    netdata      (cert-manager issues
   │                 │   Cloudflare (T8)  exposure + TLS     claimed(T10)  the cert inside T9)
   │                 │          │         secret.vgijssel.nl
   │                 │          └────────►     (T9) ◄──────────────────────────────┘
   │                 │
   └─────────────────┴── retire obsolete apps/libs (T11, gated on end-to-end verify)
```

Implementation order follows the graph bottom-up. Each task leaves the system in a working,
verifiable state.

## Phases

### Phase 1 — Substrate (vind + Fleet)  → T1, T2, T3
Bring up the empty vind cluster, install the single-cluster Fleet controller, and prove
`fleet apply` deploys a real bundle. Highest-uncertainty substrate work first.

### Phase 2 — OpenBao core (auto-unseal + config)  → T4, T5, T6
Static auto-unseal (top technical risk), rework init for the recovery-key model, and get
vault-config-operator reconciling the kv engine + policies/roles.

### Phase 3 — Consumers & exposure  → T7, T8, T9, T10
Seed real secrets and bring the ESO-fed consumers to Ready; publish `secret.vgijssel.nl` via
external-dns; expose OpenBao on the tailnet with a valid cert (capstone / Open Q #1); claim Netdata.

### Phase 4 — Retirement  → T11
Remove the superseded apps/libs once the new cluster is verified.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| OpenBao chart 0.28.4 may not cleanly support the `seal "static"` stanza; static auto-unseal is a newish feature | High | T4 is early; verify via `extraConfig` render + `bao status` sealed=false; fall back to `env://` key source or a raw config override if the chart's values don't expose it. |
| **`secret.vgijssel.nl` exposure**: how TLS terminates behind the Tailscale Service and how external-dns learns the tailnet IP (Open Q #1) | High | T9 carries an explicit spike sub-step; decide Ingress-serving-cert vs Tailscale operator HTTPS before wiring; keep OpenBao ClusterIP for in-cluster ESO regardless. |
| vind docker-driver differences from k3d (LoadBalancer, persistence, DinD) | Medium | T1 validates node Ready + a LoadBalancer Service getting an EXTERNAL-IP before proceeding. |
| Bootstrap cycle (ESO ↔ OpenBao ↔ tailscale/external-dns) stalls | Medium | Accept error-and-retry; verify each consumer only *after* `secret:seed` (T7). |
| Fleet single-cluster controller conflicts with a future Rancher-managed Fleet | Low | Documented: standalone Fleet is throwaway; removed at Rancher handoff (out of scope here). |
| Retirement deletes something still referenced (moon workspace, vendir) | Medium | T11 greps for references first; gated behind human confirm + green end-to-end. |

## Open Questions (carried from SPEC.md)

1. **Exposure/TLS termination** for `secret.vgijssel.nl` (Ingress vs Tailscale HTTPS; how external-dns
   reads the tailnet IP) — resolved by the T9 spike.
2. **external-dns → Cloudflare** exact provider config to publish the tailnet IP — resolved in T8.
3. **Cluster-lifecycle task ownership** — plan places `vcluster`/`fleet-install` tasks in `apps/secret`;
   confirm during T1.
4. **Persistence across `vcluster delete`** — plan assumes re-init is acceptable for this stepping
   stone; confirm before T4.

## Definition of Done (project-wide, every task clears this)

- `trunk fmt && trunk check` clean; all versions pinned (charts, images, CLIs).
- `moon run <app>:lint` passes (kubeconform + `helm template` + `fleet apply -o -` render).
- No secret on local disk or in git (only the seal key + root/recovery keys in 1Password).
- Code only under `apps/` / `libs/`; changed manifests validated before Fleet applies.

---

## Phase 5 — Migrate OpenBao config to Terraform (terranetes)

> Added after Checkpoint D. Replaces the vault-config-operator config path with an OpenTofu module
> reconciled by `terranetes-controller`, sharing one `kubernetes`-backend tfstate between the local
> bootstrap `tofu apply` and the in-cluster controller. Tasks live in `tasks/todo.md` (T12–T16).

### Decisions (from the user)

1. OpenBao config becomes a flat **OpenTofu** module at `apps/secret/src/openbao-config` (`hashicorp/vault`
   provider — OpenBao is API-compatible; no OpenBao-native provider exists).
2. **Remove** the `vault-config-operator` Helm bundle + vendored chart + its config CRs.
3. **terranetes-controller** (chart `v0.8.6`, app `v0.5.7`) is installed via Fleet and runs the module
   in-cluster with drift reconciliation.
4. The local bootstrap apply and the in-cluster reconciliation **share one tfstate** and must not
   recreate/fight over resources.

### Architecture decisions

- **One module, two runners, one state.** The module carries **no `backend {}` block**. State is a
  `kubernetes` backend Secret in ns `secret` with a **deterministic** name (`tfstate-default-openbao-config`).
  Terranetes gets a **backend template** deriving that name from the `Configuration`; `secret:configure`
  writes a git-ignored `zz_backend.tf` with the identical stanza at runtime, so both resolve to one Secret.
- **Bootstrap shrinks.** `bootstrap.sh` drops the vault-config-operator foothold (kubernetes auth +
  operator policy/role). New seam: seal → init → unseal → root token in 1Password. **No root token is
  persisted to a K8s Secret** — the module itself creates the kubernetes auth backend + all roles.
- **Two auth modes, one module.** `provider "vault"` selects its credential by an `auth_method` variable:
  `"token"` (local `secret:configure` reads the **root token** from `VAULT_TOKEN`/1Password) vs
  `"kubernetes"` (terranetes runner does `auth_login_kubernetes` with its **ServiceAccount JWT** + the
  `terranetes` role). The **first local apply creates the `terranetes` role**, so the SA login path exists
  before terranetes ever runs. Terranetes managing its own login role means the `terranetes` policy must
  always re-grant itself; the local root-token apply is the lockout-recovery path.
- **The module replaces the CRs 1:1, plus the terranetes login role.** `vault_mount` (kv v2),
  `vault_auth_backend` (kubernetes) + `vault_kubernetes_auth_backend_config`, `vault_policy`
  (external-secrets), `vault_kubernetes_auth_backend_role` (external-secrets), **and** `vault_policy`
  (terranetes) + `vault_kubernetes_auth_backend_role` (terranetes, bound to the runner SA). The operator's
  own policy/role CRs disappear (no operator).
- **The `secret-config` bundle is repurposed, not deleted.** Its contents change from vault-config-operator
  CRs to a terranetes `Configuration` (module source + `auth_method = "kubernetes"` variable; **no**
  root-token `valueFrom`), so the `fleet apply` list is unchanged in shape.

### Dependency graph (Phase 5)

```
vendor terranetes chart + platform/src/terranetes bundle (T12)
        │
authored OpenTofu module apps/secret/src/openbao-config (T13)  ──┐
        │                                                        │
secret:configure + bootstrap trim (T14) ◄────┘   (local tofu apply w/ root token, shared k8s state;
        │                                          the apply creates the terranetes kubernetes auth role)
        │
terranetes Configuration bundle → controller reconciles same module+state (T15)
        │
remove vault-config-operator (bundle + chart + CRs), update apply.sh/SPEC/lint (T16, gated)
```

### Risks and mitigations (Phase 5)

| Risk | Impact | Mitigation |
|---|---|---|
| Backend collision — terranetes injects a backend; a committed `backend {}` block breaks it | High | Module stays backend-free; only the runtime git-ignored `zz_backend.tf` (local) + the terranetes backend template (cluster) define the backend, both pointing at the same Secret. Verify with `tofu init` locally + a terranetes plan showing the same state. |
| State handoff recreates/destroys resources | High | T14 applies locally first (seeds state); T15 verifies the controller's first plan is a **no-op** (no create/destroy) before enabling `autoApproval`. |
| **terranetes self-manages its own login role** — a bad apply could revoke the `terranetes` policy/role and lock the controller out | Medium | Keep the `terranetes` policy broad enough to always re-grant itself; the local root-token `secret:configure` is the recovery path (re-creates the role). Never `terraform destroy` the role in normal ops. |
| terranetes runner SA doesn't match the `terranetes` auth role binding → login fails | Medium | T12 pins the runner SA name+namespace from the chart; T13 binds `bound_service_account_names`/`…_namespaces` to it; T15 verifies a successful SA login (no root token). |
| No root token in-cluster, but the **first** apply needs one | Low | By design local `secret:configure` (root token from 1Password) runs first and creates the role; terranetes only takes over afterwards. |
| Wrong terranetes knob → runs Terraform not OpenTofu, or non-deterministic state name | Medium | T12 confirms the OpenTofu binary value + backend-template output in `v0.8.6` chart values before wiring the Configuration. |
| ESO breaks during the swap (kubernetes auth / external-secrets role owned by the old operator, then by Terraform) | Medium | Terraform re-declares identical policy/role/auth; apply before removing the operator (T16 gated last) so the role never disappears. |
| kubernetes backend RBAC — runner SA lacks secret/lease access in ns `secret` | Low | Grant the terranetes runner SA get/list/create/update on Secrets + coordination Leases in `secret`; local run uses the admin kubeconfig. |

### Open Questions (Phase 5, carried to SPEC.md)

5. terranetes runner ServiceAccount name+namespace (for the `terranetes` auth-role binding). *(Auth model
   resolved: local = root token; terranetes = kubernetes-SA auth role created by the first local apply.)*
6. Exact `terranetes-controller` chart knob for the OpenTofu binary.
7. ~~terranetes operator placement~~ **Resolved: `apps/platform/src/terranetes`.**
