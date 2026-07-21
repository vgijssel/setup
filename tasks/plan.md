# Implementation Plan: Replace Terranetes with KubeVela (multi-cluster control plane)

> Derived from `SPEC.md` (DRAFT for review) + a codebase survey of `apps/{secret,network,platform}`,
> `third_party/vendir`, and the hermit/moon toolchain. You remain responsible for the final work product;
> nothing here is execution-ready until you approve it and it is validated against the live systems.

## Overview

Remove the Appvia **terranetes** stack and replace it with **KubeVela** (`vela-core` +
`kubevela/terraform-controller`), restructured around a new **base cluster** `apps/control` that runs KubeVela
in its root and provisions `secret` and `network` as **nested vclusters**. Dev (vind) and prod (real k8s)
share the same shape, differing only in the base substrate. Terraform HCL stays the source of truth in
`terraform/`; a `component/` ComponentDefinition is generated from it (inline HCL), and a `config/`
Application instantiates it via `topology → <child>`. All one-off ordering (OpenBao init/token) moves from
bash into KubeVela Workflows. The only remaining shell entrypoint is the base `control:start`.

## Architecture Decisions (from SPEC §3–§5, confirm before build)

- **Single base cluster, KubeVela in root, nested vclusters** (§3.1). Root manages `local`, creates + joins
  `secret`/`network` children over the **in-cluster** control path (cluster-gateway). Tailnet is for service
  exposure only, never the control path.
- **No `apiserver-proxy`** (confirmed). It is deleted from both clusters. Cross-cluster service-to-service
  traffic (e.g. `network` ESO → `secret` OpenBao) uses the target service's **Tailscale MagicDNS name
  directly** — no LB-VIP + LE-cert kube-API proxy. This drops the whole `api.<cluster>.vgijssel.nl` layer.
- **Terraform runs child-local** (§3.2). `terraform-controller` is dispatched into each child; `openbao-config`
  runs in `secret` (plain in-cluster k8s auth against co-located OpenBao); `tailscale-config` runs in
  `network`. This restores the simplest auth story and removes the JWT/root-token gymnastics.
- **First-class `Provider` objects** (§3.3). Replace the dummy-`null`-provider trick with real
  `terraform.core.oam.dev/v1beta1` `Provider` CRs (`vault`, `tailscale`) fed by Secrets sourced from
  OpenBao/1Password.
- **Bootstrap-as-Workflow** (§4). OpenBao bring-up (seal key → `bao operator init` → temp admin token →
  apply `openbao-config` once → delete temp token) is a KubeVela `Workflow`/`WorkflowRun`, not a script.
- **`-config` convention** (§5): `terraform/` (hand-written HCL, source of truth) → `component/` (generated
  ComponentDefinition, committed) → `config/` (Application). Delivery is KubeVela, not Fleet.
- **Reuse the generator-test pattern** verbatim from `third_party/vendir/moon.yml`: `generate` builds
  `component/`, `generator_test` runs `git diff --exit-code src/<x>-config/component/` with `deps: [~:generate]`.
- **Pin every new tool/chart**: `vela` CLI + `vela-core` + `terraform-controller` charts (vendir). `yq`, `tofu`,
  `vcluster` already pinned via hermit; the `vcluster` chart (0.32.1) is already vendored.

## Dependency Graph

```
P0 Teardown (independent, do first)
    │
P1 Toolchain + base cluster + spikes  ── fail-fast, gates everything ──┐
    ├── vela CLI (hermit) + vendor vela-core & terraform-controller     │
    ├── apps/control scaffold + start.sh (vind + helm install root)     │
    ├── SPIKE: in-cluster vcluster create + `vela cluster join` (§9 #4,#7)
    ├── SPIKE: `vela def init` determinism → generator_test (§9 #3)     │
    └── SPIKE: first-class vault/tailscale Provider objects (§9 #2)     │
                                                                        │
P2 SECRET child (vertical slice) ◄──────────────────────────────────────┘
    ├── Application: create + join `secret` vcluster
    ├── platform into child: cert-manager, ESO, tailscale, OpenBao (KubeVela Components)
    ├── openbao-config: terraform/ + component/(generate) + config/ + vault Provider
    └── OpenBao bring-up Workflow (init → temp token → apply once → delete)   ── GATE: ESO green
                                                                        │
P3 NETWORK child (vertical slice) ◄── depends on secret's OpenBao + tailnet exposure
    ├── Application: create + join `network` vcluster + platform
    ├── MongoDB + Omada Components (ExternalSecrets, cert, LB service)
    └── tailscale-config: terraform/ + component/ + config/ + tailscale Provider (PLAN-ONLY guardrail)
                                                                        │       ── GATE: curl omada 200 + LE cert
P4 Remove terranetes (only after P2/P3 prove the replacement)
    └── delete bundle, vendored chart, per-cluster CRs, dead scripts, binfmt seed ── GATE: grep clean
                                                                        │
P5 Harden bootstrap-as-Workflow (zero residual bash, idempotent re-run, teardown/rebuild smoke)
```

Implementation order follows the graph: teardown → toolchain/base + spikes → secret slice → network slice →
removal → harden. **Secret precedes network** because network's ESO reads secret's OpenBao over the tailnet.

## Vertical Slicing Rationale

Each child (`secret`, `network`) is built as **one complete path** — create vcluster → install platform →
generate+apply its Terraform → run its bootstrap workflow → hit its acceptance signal — rather than building
"all vclusters", then "all platform", then "all Terraform". Each slice leaves a working, testable child. The
only genuinely horizontal foundation is P1 (toolchain + base cluster + the three spikes), which must exist
before any slice and is therefore front-loaded and gated.

## Task List

### Phase 0 — Teardown
- **Task 0.1** — Tear down live `secret` + `network` vind clusters; confirm durable data re-seedable.

### Phase 1 — Toolchain, base cluster, fail-fast spikes
- **Task 1.1** — Pin `vela` CLI via hermit; confirm `yq` pinned.
- **Task 1.2** — Vendor `vela-core` + `terraform-controller` charts (vendir).
- **Task 1.3** — Scaffold `apps/control` + `scripts/start.sh` (base vind + helm-install KubeVela in root).
- **Task 1.4** — SPIKE: create a child vcluster in-cluster and `vela cluster join` it (no tailnet/LE).
- **Task 1.5** — SPIKE: `vela def init` determinism + wire `generate`/`generator_test` on a throwaway module.
- **Task 1.6** — SPIKE: hand-authored `vault` + `tailscale` `Provider` CRs + Secrets.

### Checkpoint: Foundation (after Phase 1) — human review

### Phase 2 — Secret child (vertical slice)
- **Task 2.1** — Application that creates the `secret` vcluster + joins it (built on Task 1.4).
- **Task 2.2** — Dispatch platform into `secret` child: cert-manager, ESO, tailscale-operator, OpenBao.
- **Task 2.3** — `openbao-config` as `terraform/`+`component/`+`config/` with the `vault` Provider (child-local k8s auth); moon `generate`/`generator_test`/`validate` targets.
- **Task 2.4** — OpenBao bring-up **Workflow** (init → temp token → apply once → delete token).

### Checkpoint: Secret (after Phase 2) — GATE: ESO green against child OpenBao

### Phase 3 — Network child (vertical slice)
- **Task 3.1** — Application that creates the `network` vcluster + joins it + platform (cert-manager, ESO, tailscale).
- **Task 3.2** — MongoDB + Omada as KubeVela Components (ExternalSecrets, cert, LB service).
- **Task 3.3** — `tailscale-config` as `terraform/`+`component/`+`config/` with the `tailscale` Provider (**plan-only** default).

### Checkpoint: Network (after Phase 3) — GATE: `curl https://omada.network.vgijssel.nl` 200 w/ LE cert

### Phase 4 — Remove terranetes
- **Task 4.1** — Delete `apps/platform/src/terranetes/` + its `fleet apply` lines in every `apply.sh`.
- **Task 4.2** — Delete vendored `terranetes-controller` chart + `vendir.yml` entry; `vendir sync`; commit lock.
- **Task 4.3** — Delete per-cluster terranetes CRs/RBAC, dead bootstrap/configure/apply/configure scripts, binfmt seed (if unused), apiserver-proxy (if unused).

### Checkpoint: Removal (after Phase 4) — GATE: `grep -ri 'terranetes|terraform.appvia.io|appvia'` clean

### Phase 5 — Harden
- **Task 5.1** — Zero residual bash beyond `control:start`; verify token deletion, idempotent re-runs, full teardown→rebuild smoke.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Non-cloud `Provider` (vault/tailscale) unsupported by KubeVela addon tooling | High | Spike 1.6 early; fall back to hand-authored `Provider`+Secret modeled on generated shape |
| `vela def init` output non-deterministic → `generator_test` flaps | Med | Spike 1.5; pin `vela`+`yq`; normalize with `yq -P 'sort_keys(..)'` |
| Nested vcluster (vcluster-in-vind) + in-cluster join doesn't work for dev | High | Spike 1.4; native snapshotter for kind-in-docker (CLAUDE.md); vcluster chart already vendored |
| `terraform-controller` image amd64-only on arm64 base | Med | Reuse binfmt/qemu seed pattern only if needed; single-arch base now (see `terranetes-arm64-emulation` memory) |
| Applying `tailscale-config` overwrites the **one real tailnet** | High | Plan-only default in dev (Task 3.3); `overwrite_existing_content` guardrail; never apply from disposable base |
| Destroying live OpenBao KV during teardown | High | Teardown = delete whole vind cluster, never delete a `Configuration` in place; data re-seedable from 1Password |
| Bootstrap-as-Workflow can't run Job/apply/read/delete + gate on readiness | Med | Spike within Task 2.4; keep `WorkflowRun` as alternative shape |

## Resolved Decisions (confirmed by human, 2026-07-21)

1. **§3.1 / §3.2 / §4 confirmed** — single base cluster + nested vclusters, child-local Terraform, and
   bootstrap-as-Workflow. This is the structure.
2. **Root KubeVela = helm install via `control:start`** for now. How Fleet fits (prod GitOps entrypoint) is
   deferred — decide later; it does not block this work.
3. **`apiserver-proxy` is deleted** (both clusters). Service-to-service communication goes over Tailscale
   using the **service's MagicDNS name directly** — not the current apiserver-proxy + LB-VIP + LE-cert setup.
   Concretely: the `network` child reaches the `secret` child's OpenBao over the tailnet via OpenBao's
   Tailscale service DNS name (no `api.<cluster>.vgijssel.nl` proxy, no cross-cluster kube-API exposure).
4. **Plan lives in `tasks/`** (`tasks/plan.md` + `tasks/todo.md`). Not parsed into Task Master.

## Definition of Done (every task)

- `trunk fmt` + `trunk check` clean on touched files.
- New tools/charts/images pinned to exact versions (CLAUDE.md); no `npx`/`uvx`.
- No secrets / `VAULT_TOKEN` / root token committed.
- Kubernetes files named `<kind>-<name>.yaml`; code lands only in `apps/` or `libs/` (or `third_party/` for
  vendored deps).
- Task's own acceptance criteria + verification steps pass.
