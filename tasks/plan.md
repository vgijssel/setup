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
