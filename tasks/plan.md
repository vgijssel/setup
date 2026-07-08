# Plan: Kubernetes-native homelab → Hetzner gateway cluster

Source spec: `SPEC.md` (repo root). This plan slices that spec into vertically-ordered,
independently-verifiable tasks with checkpoints between phases. The task checklist lives in
`tasks/todo.md`.

## Locked decisions (from planning review)

| Decision | Choice | Consequence |
|---|---|---|
| Architecture | **amd64** (`cx42`, `nbg1`) | Image built for amd64; QEMU test runs under TCG on Apple Silicon (slow but authoritative). SPEC's amd64 assumption wins over the memory note about an arm64 WIP. |
| `libs/gateway-image` | **Built fresh**, mirroring `libs/talos-image` | The untracked `apps/network/image/` Kairos WIP is *reference only*; it is deleted in the decommission task, not refactored. |
| Scope | **Full spec, all 3 phases** | One plan, one `todo.md`, human-review checkpoints between phases. |
| Secrets model | **New**: OpenBao `vault` provider + `aws-sigv4-proxy` S3 broker + OIDC. **No** `op inject`/`.env.tpl`. | Legacy `.env.tpl` flow (`apps/gateway-prod`, `apps/network-controllers-prod`) is fully retired. Only OpenBao init/unseal keys live in 1Password. |
| GitOps on gateway | **Fleet + Rancher** (greenfield) | Independent of the existing enigma ArgoCD/Flux/1Password-operator stack. This plan does **not** touch enigma GitOps. |

## Plan-level notes / clarifications resolved during planning

- **The full `apps/platform` runs on the local k3d cluster too** — not a subset (confirmed in
  review). `apps/platform` is environment-agnostic, so the same manifests (external-secrets,
  Tailscale operator, cert-manager + Cloudflare DNS-01 `ClusterIssuer`, Netdata) deploy to both
  local and gateway with per-target values. This overrides the SPEC's "subset = ESO + Tailscale op"
  wording (line 118): cert-manager is required locally anyway (OIDC needs valid `vgijssel.nl` certs
  for `auth`/`secrets`, since Tailscale's built-in certs only cover `*.ts.net` — open item #4), and
  the user wants the whole platform present in the local cluster. `apps/platform` is therefore built
  once (T2) and simply *reconciled* on the gateway by Fleet (T13), with nothing added later.
- **`<app>:lint` is a new convention** to establish (kubeconform + `helm template` render). The
  repo has no kubeconform tasks today; `libs/external-service` has a `helm lint` task to model
  from. Every new app gets a `lint` task wired into `moon check`.
- **Two SPEC "Open" items are validation spikes that gate later work** and are pulled forward:
  - Open #2 (sigv4-proxy re-sign against Hetzner Object Storage) → **S1**, gates `apps/gateway`
    backend.
  - Open #1 (OIDC-on-tailnet must-get-right) → **T6**, gates `gateway:apply`.

## Dependency graph

```
libs/aws-sigv4-proxy (EXISTS) ─────────────┐
                                            ▼
apps/platform (full: ESO, Tailscale    apps/secret ── svc:secrets, svc:terraform-state
  op, cert-manager+Issuer, Netdata)─┬─▶ (OpenBao raft + sigv4-proxy)
                                 │            ▲
                                 ├────▶ apps/auth (Authentik) ── svc:auth
                                 │            │
apps/bootstrap (k3d harness) ───orchestrates──┴─▶ deploy [platform (full) + auth + secret] on k3d
                                                        │
                                          init-openbao (keys→1Password, OIDC→Authentik) → seed
                                                        │
                              ┌── bao login -method=oidc  ✔  (T6 gating spike) ──┐
                              │                                                   │
libs/gateway-image (Kairos+k3s amd64; bakes cert-manager + Rancher/Fleet +        │
  Fleet GitRepos as k3s auto-deploy manifests) ── snapshot id ──┐                 │
                                                                ▼                 ▼
                                            apps/gateway (OpenTofu: vault provider reads
                                              Hetzner/Cloudflare; S3 backend via sigv4-proxy)
                                                                │  births VM
                                                                ▼
                                     gateway k3s boots → baked manifests apply
                                                                │
                                                                ▼
                                     apps/gitops (Rancher + Fleet, self-managed via Fleet)
                                                                │  Fleet GitRepos reconcile
                                        ┌───────────────────────┼───────────────────────┐
                                        ▼                       ▼                       ▼
                              apps/platform             apps/secret (raft-        apps/network
                              (reconcile, from T2)      restored, re-advertise    (Omada + UniFi)
                                                        svc:secrets)                    │
                                                                                        ▼
                                                                     data migration → decommission legacy
```

Critical path: **T1→T4→T5→T6 (Checkpoint 1) → T7→T9→T10→T11 (Checkpoint 2) → T12→T14→T15→T16→T17 (Checkpoint 3)**.
`apps/platform` full (T2), `apps/auth` (T3), `libs/gateway-image` build (T7/T8) and the sigv4 spike (S1)
can proceed in parallel with their siblings as the graph allows.

## Phases & checkpoints

### Phase 0 — Local bootstrap (macbook k3d) — tasks T1–T6, spike S1
Delivers: `bootstrap:up` → tailnet-private Authentik + unsealed OpenBao (keys in 1Password) + live
sigv4-proxy, all advertised as Tailscale Services; `bao login -method=oidc` works end-to-end.

**🚩 Checkpoint 1 (human review):** SPEC success criteria #1–#2. Verify no secret is on local disk,
OIDC login works over the tailnet (or the short-lived-token fallback is exercised and documented),
and the sigv4-proxy answers S3 requests (S1). Decide GO on OIDC vs fallback before Phase 1.

### Phase 1 — Gateway provisioning (operator-run tofu) — tasks T7–T11
Delivers: Kairos amd64 image builds + boots k3s in QEMU with baked cold-start manifests;
`gateway:apply` provisions the Hetzner VM with zero secrets on local disk; the VM boots k3s with
cert-manager + Rancher/Fleet applied, no manual `kubectl`.

**🚩 Checkpoint 2 (human review):** SPEC success criteria #3–#4. Confirm exact VM SKU/region/Volume
size at apply (SPEC "Ask first"). Verify state landed in S3 via the proxy with dummy creds and no
local secret file.

### Phase 2 — GitOps reconciliation, migration, decommission — tasks T12–T17
Delivers: Fleet reconciles all gateway apps (incl. self-managed Rancher); OpenBao migrates to the
gateway via raft restore with unchanged endpoint; Omada/UniFi run on the gateway with migrated
device data; legacy apps destroyed and source removed.

**🚩 Checkpoint 3 (human review):** SPEC success criteria #5–#8. Confirm data migrated **and
verified** before any `destroy` (SPEC "Never"). Bootstrap OpenBao/proxy removed; Authentik still
serving on the macbook.

## Risks & things to confirm before/at each checkpoint (SPEC "Ask first")

- Final VM SKU/region/Volume size (confirm `cx42` exists at apply; SPEC notes there is no `cx43`).
- OpenBao unseal-key handling; proceed-on-OIDC vs short-lived-token fallback (decide at Checkpoint 1).
- Any chart/provider/image not already listed in the SPEC before adding it.
- Changing the S3 state backend or the Cloudflare zone.
- Opening any public firewall port beyond inform ports + 443 + SSH.
- Migrating Authentik off the macbook, or exposing it publicly — **out of scope** for this plan.

## Conventions to match (from codebase exploration)

- **Tofu:** S3 backend (Hetzner Object Storage, path-style, `skip_*`, `use_lockfile`), snake_case,
  `postcondition` validation on `data` sources, pinned providers. Cloudflare `cloudflare/cloudflare`
  v4.52.0, zone by name via `data "cloudflare_zone"`, records `proxied = false`.
- **Helm/K8s:** pin chart `version`/`appVersion` + image tags; commit `Chart.lock`; `<kind>-<name>.yaml`.
- **Moon:** infra tasks `runInCI: false`; `interactive: true` for apply/destroy; `CWD: <app-path>`.
- **k3d/kind in docker-in-docker:** native snapshotter (per CLAUDE.md).
- **Quality gate:** `trunk fmt && trunk check` before every commit; `moon check --all`.
