# Task List: Replace Terranetes with KubeVela

Companion to `tasks/plan.md`. Each task is sized S/M. Check off acceptance criteria as they pass. Do not
start implementation until the Foundation checkpoint plan is approved.

Legend — Scope: **S** = 1–2 files · **M** = 3–5 files · **L** = 5+ (break down if hit).

---

## Phase 0 — Teardown

### Task 0.1: Tear down live `secret` + `network` vind clusters
**Description:** Destroy the current terranetes-based `secret` and `network` vind clusters so we rebuild from
scratch on the new model. Nothing is migrated in place. Verify all durable data is re-seedable before deleting.

**Acceptance criteria:**
- [ ] Durable data confirmed re-seedable: OpenBao seal/recovery/root in 1Password (enigma-prod), Tailscale OAuth + tailnet policy regeneratable by the new bring-up.
- [ ] `secret:stop` and `network:stop` run cleanly; both vind clusters absent.
- [ ] No terranetes `Configuration` was deleted in place (destroy risk) — teardown was cluster-level only.

**Verification:**
- [ ] `vcluster list` shows neither `secret` nor `network`.
- [ ] 1Password items present: "OpenBao static seal (secret cluster)", "OpenBao root + recovery (secret cluster)".

**Dependencies:** None
**Files likely touched:** none (operational). **Scope:** S

---

## Phase 1 — Toolchain, base cluster, fail-fast spikes

### Task 1.1: Pin `vela` CLI via hermit
**Description:** Add the KubeVela `vela` CLI as a pinned hermit package (`third_party/hermit/vela.hcl`), mirroring
`fleet.hcl`. Confirm `yq` is already pinned (it is — `bin/yq`).

**Acceptance criteria:**
- [ ] `third_party/hermit/vela.hcl` pins one exact `vela` version with `sha256sums` for all needed os/arch.
- [ ] `bin/vela` wrapper resolves; `vela version` prints the pinned version.
- [ ] No unpinned fetch (`npx`/`uvx`/`latest`).

**Verification:**
- [ ] `./bin/vela version` succeeds and matches the pinned version.
- [ ] `git status` shows `bin/vela` + `third_party/hermit/vela.hcl` only.

**Dependencies:** None. **Files:** `third_party/hermit/vela.hcl`, `bin/vela`. **Scope:** S

### Task 1.2: Vendor `vela-core` + `terraform-controller` charts
**Description:** Add `vela-core` (`https://charts.kubevela.net/core`) and `terraform-controller`
(`https://charts.kubevela.net/addons`) to `third_party/vendir/vendir.yml` at pinned versions; `vendir sync`;
commit `vendir.lock.yml`.

**Acceptance criteria:**
- [ ] Both charts pinned to exact versions in `vendir.yml`; present under `third_party/vendir/charts/`.
- [ ] `vendir.lock.yml` updated and committed.
- [ ] `moon run vendir:test` passes (lock file git-clean).

**Verification:**
- [ ] `moon run vendir:build && moon run vendir:test` green.
- [ ] `ls third_party/vendir/charts/{vela-core,terraform-controller}` exist.

**Dependencies:** None. **Files:** `third_party/vendir/vendir.yml`, `vendir.lock.yml`, `charts/**`. **Scope:** S

### Task 1.3: Scaffold `apps/control` + `scripts/start.sh`
**Description:** Create `apps/control` (the base cluster). `scripts/start.sh` is the **only** bash entrypoint:
create the base cluster (dev: vind) and helm-install `vela-core` + `terraform-controller` in its root. Add
`moon.yml` with `start`/`stop` and (later) `up`. Root KubeVela manages `local`.

**Acceptance criteria:**
- [ ] `apps/control/scripts/start.sh` creates the base vind cluster and helm-installs both charts from the vendored `file://` paths.
- [ ] `apps/control/moon.yml` defines `start` and `stop` (interactive, not cached, not CI) mirroring existing app moon.yml shape.
- [ ] KubeVela pods (`vela-core`, `cluster-gateway`) Ready in root; `terraform-controller` installed.
- [ ] No secrets embedded; charts referenced by pinned `file://` path.

**Verification:**
- [ ] `moon run control:start` → `kubectl -n vela-system get pods` all Ready.
- [ ] `vela cluster list` shows `local`.

**Dependencies:** 1.1, 1.2. **Files:** `apps/control/scripts/start.sh`, `apps/control/scripts/stop.sh`, `apps/control/moon.yml`, `apps/control/src/kubevela/{Chart.yaml,values.yaml}`. **Scope:** M

### Task 1.4: SPIKE — in-cluster vcluster create + `vela cluster join` (§9 #4, #7)
**Description:** Prove the control path: create one child vcluster inside the base (vcluster-in-vind for dev) as
a KubeVela helm Component, then `vela cluster join` it using the in-cluster kubeconfig (vcluster API Service
DNS) — **no tailnet, no LE cert**. Document the kubeconfig endpoint, credential type, and minimal RBAC.

**Acceptance criteria:**
- [ ] A child vcluster is created via a KubeVela `Application` (vcluster helm Component, chart 0.32.1 already vendored).
- [ ] The child is joined (`vela cluster join`) over in-cluster Service DNS; appears in `vela cluster list`.
- [ ] A trivial Application dispatched via `topology → <child>` lands in the child.
- [ ] Findings written into `tasks/plan.md` open-questions or an ADR (join endpoint, creds, RBAC).

**Verification:**
- [ ] `vela cluster list` shows the child as healthy.
- [ ] `kubectl --context <child> get ns` reflects the topology-dispatched Application.

**Dependencies:** 1.3. **Files:** throwaway `apps/control/src/children/application-spike.yaml`. **Scope:** M

### Task 1.5: SPIKE — `vela def init` determinism + generator_test wiring (§9 #3)
**Description:** On a throwaway `terraform/` dir, prove `vela def init <name> --type component --local … >
component/<gen>.yaml` produces **byte-stable** output across runs (normalize via `yq -P 'sort_keys(..)'` if
needed). Wire the `generate` + `generator_test` moon tasks mirroring `third_party/vendir/moon.yml`.

**Acceptance criteria:**
- [ ] `generate` embeds inline HCL from `terraform/` into a committed `component/<gen>.yaml`.
- [ ] Running `generate` twice yields identical bytes (deterministic, post-processed if required).
- [ ] `generator_test` = `git diff --exit-code src/<x>-config/component/` with `deps: [~:generate]` — fails when `component/` is stale.

**Verification:**
- [ ] Edit `terraform/`, run `generate` → `component/` changes; `generator_test` fails until committed.
- [ ] Two consecutive `generate` runs → `git diff` empty.

**Dependencies:** 1.1. **Files:** throwaway `apps/control/src/spike-config/{terraform,component}/`, a `moon.yml` task block to lift. **Scope:** S

### Task 1.6: SPIKE — first-class `vault` + `tailscale` Provider objects (§9 #2)
**Description:** Validate hand-authored `terraform.core.oam.dev/v1beta1` `Provider` CRs + Secrets for a
non-cloud provider (`vault`: `VAULT_ADDR`+`VAULT_TOKEN`/k8s-auth; `tailscale`: OAuth id/secret), modeled on the
generated `cloudProperties` shape. Confirm a `Configuration` referencing `providerRef` initializes.

**Acceptance criteria:**
- [ ] A `Provider` CR + Secret exist for `vault` and `tailscale` (Secret values from OpenBao/1Password, never git).
- [ ] A trivial `Configuration` with `providerRef: vault` reaches `terraform init` with creds injected.
- [ ] Decision recorded: provider-scaffold addon vs hand-authored (spec §3.3).

**Verification:**
- [ ] `kubectl get provider.terraform.core.oam.dev` shows both Ready.
- [ ] Trivial Configuration logs show provider env vars present at init.

**Dependencies:** 1.3. **Files:** `apps/control/src/providers/{provider-vault.yaml,provider-tailscale.yaml}` (+ Secret templates). **Scope:** M

---

## Checkpoint: Foundation (after Phase 1)
- [ ] `moon run vendir:test` and both generator spikes green.
- [ ] KubeVela healthy in root; one child vcluster created + joined + topology-dispatched.
- [ ] `vault`/`tailscale` Provider objects proven.
- [ ] **Human reviews spike findings + confirms SPEC §3.1/§3.2/§4 before Phase 2.**

---

## Phase 2 — Secret child (vertical slice)

### Task 2.1: Application — create + join `secret` vcluster
**Description:** Promote Task 1.4 into a real `apps/control/src/children/application-secret.yaml` that creates
the `secret` child vcluster and joins it. Named `secret`; reachable via `topology → secret`.

**Acceptance criteria:**
- [ ] `application-secret.yaml` creates the `secret` vcluster (vendored vcluster chart) and joins it.
- [ ] `vela cluster list` shows `secret` healthy; `topology → secret` dispatches.

**Verification:** `vela status application-secret --tree` healthy; `kubectl --context secret get ns`.
**Dependencies:** 1.4. **Files:** `apps/control/src/children/application-secret.yaml`. **Scope:** S

### Task 2.2: Platform into `secret` child (cert-manager, ESO, tailscale, OpenBao)
**Description:** Convert the secret cluster's platform pieces to KubeVela Components dispatched into the child:
cert-manager, external-secrets, tailscale-operator, and OpenBao (`apps/secret/src/openbao` helm as a Component,
no longer a Fleet bundle). ClusterSecretStore uses in-cluster k8s auth against the child's own OpenBao.

**Acceptance criteria:**
- [ ] cert-manager, ESO, tailscale-operator, OpenBao all render into `secret` via `topology → secret`.
- [ ] OpenBao StatefulSet comes up (unsealed after Task 2.4); ClusterSecretStore `openbao` points in-cluster.
- [ ] Seal key seeded (moved from `bootstrap.sh` into the Workflow of Task 2.4 or a pre-step).

**Verification:** `vela status … --tree --detail`; `kubectl --context secret -n secret get pods`.
**Dependencies:** 2.1, 1.2. **Files:** `apps/secret/src/openbao/*` (Component conversion), `apps/control/src/children/application-secret.yaml` (topology components), platform Component defs. **Scope:** M

### Task 2.3: `openbao-config` as terraform/ + component/ + config/ (vault Provider, child-local)
**Description:** Restructure `apps/secret/src/openbao-config` into the `-config` convention: keep HCL in
`terraform/`; generate `component/`; add `config/application.yaml` with `providerRef: vault`, vars, and
`topology → secret`. Remove `auth_method`/terranetes plumbing from `provider.tf`/`variables.tf` — steady-state
uses plain in-cluster Kubernetes auth (§3.2). Add moon `generate`/`generator_test`/`validate` targets.

**Acceptance criteria:**
- [ ] `terraform/{main,provider,variables,versions}.tf` present; `provider.tf` uses in-cluster k8s auth only (no token/JWT dual-mode).
- [ ] `component/<gen>.yaml` generated + committed; `config/application.yaml` refs `vault` Provider + `topology: secret`.
- [ ] `moon run secret:generate`, `secret:generator_test`, `secret:validate` (`tofu validate`) all defined and pass.
- [ ] `vela dry-run -d component/ -f config/application.yaml` renders a `Configuration` cleanly.

**Verification:**
- [ ] `moon run secret:generator_test` green after commit; fails on stale edit.
- [ ] `vela dry-run` output contains the expected `terraform.core.oam.dev` `Configuration`.

**Dependencies:** 2.1, 1.5, 1.6. **Files:** `apps/secret/src/openbao-config/{terraform,component,config}/*`, `apps/secret/moon.yml`. **Scope:** M

### Task 2.4: OpenBao bring-up Workflow (init → temp token → apply once → delete)
**Description:** Replace `bootstrap.sh` + `configure.sh` with a KubeVela `Workflow`/`WorkflowRun`
(`apps/control/src/workflows/`): seed static seal key → `bao operator init` via a step-launched Job (store
recovery/root to 1Password) → mint a **temp** admin token into the Secret the `vault` Provider reads → apply
the `openbao-config` Application once (in-cluster) → **delete the temp-token Secret**. No long-lived token
remains.

**Acceptance criteria:**
- [ ] Workflow performs all five ordered steps; steps can run Job/apply/read/delete and gate on readiness.
- [ ] After completion, no root/temp `VAULT_TOKEN` Secret remains in-cluster.
- [ ] Re-running the Workflow is idempotent (init skipped if already initialized; module is idempotent).
- [ ] OpenBao KV, kubernetes auth, ESO policy/role created (matches old module output).

**Verification:**
- [ ] `vela workflow … status` shows all steps succeeded.
- [ ] `kubectl --context secret -n secret get secret` shows no temp-token Secret.
- [ ] `bao policy list` (via port-forward) includes `external-secrets`.

**Dependencies:** 2.2, 2.3. **Files:** `apps/control/src/workflows/workflow-openbao-bringup.yaml`. **Scope:** M

---

## Checkpoint: Secret (after Phase 2) — GATE
- [ ] Fresh base → KubeVela root → `secret` vcluster created + joined → OpenBao Workflow completes → **ESO green against the child's OpenBao** (a test ExternalSecret syncs).
- [ ] Temp token deleted; no secrets in git.

---

## Phase 3 — Network child (vertical slice)

### Task 3.1: Application — create + join `network` vcluster + platform
**Description:** `apps/control/src/children/application-network.yaml` creates the `network` vcluster, joins it,
and dispatches its platform (cert-manager, ESO with remote/JWT store to secret's OpenBao over tailnet,
tailscale-operator). Mirror Task 2.1/2.2 for network.

**Acceptance criteria:**
- [ ] `network` vcluster created + joined; platform Components render via `topology → network`.
- [ ] ESO `openbao` store reaches secret's OpenBao over the tailnet via the **OpenBao service's Tailscale
      MagicDNS name directly** (no `apiserver-proxy`, no `api.<cluster>` VIP) and syncs.

**Verification:** `vela cluster list` shows `network`; a test ExternalSecret in `network` syncs.
**Dependencies:** 2.4 (secret OpenBao up + exposed). **Files:** `apps/control/src/children/application-network.yaml`, network platform Components. **Scope:** M

### Task 3.2: MongoDB + Omada as KubeVela Components
**Description:** Convert `apps/network/src/{mongodb,omada}` Fleet bundles to KubeVela Components dispatched into
`network`: MongoDB (creds via ExternalSecret), Omada (rootless, external Mongo URI via ExternalSecret, LE cert,
Tailscale LB service). Preserve `dependsOn`-equivalent ordering (Omada after MongoDB).

**Acceptance criteria:**
- [ ] MongoDB + Omada Components render into `network`; Omada waits for MongoDB.
- [ ] Omada gets its `mongodb-uri` + LE cert; Tailscale LB service published at `omada.network.vgijssel.nl`.

**Verification:** `kubectl --context network -n omada get pods` Ready; service has a tailnet VIP.
**Dependencies:** 3.1. **Files:** `apps/network/src/mongodb/*`, `apps/network/src/omada/*` (Component conversion). **Scope:** M

### Task 3.3: `tailscale-config` as terraform/ + component/ + config/ (tailscale Provider, PLAN-ONLY)
**Description:** Restructure `apps/network/src/tailscale-config` into the `-config` convention with a
`tailscale` Provider; strip terranetes/`auth_method` dual-mode. **Guardrail:** because it drives the one real
tailnet with `overwrite_existing_content`, keep it **`vela dry-run` / `tofu plan` only** in dev — do not apply
from a disposable base. Add moon `generate`/`generator_test`/`validate`.

**Acceptance criteria:**
- [ ] `terraform/`+`component/`+`config/` present; `config/application.yaml` refs `tailscale` Provider + `topology: network`.
- [ ] `moon run network:generate`/`generator_test`/`validate` pass; `component/` committed.
- [ ] Dev path is plan-only: documented guardrail; no apply against the real tailnet from a disposable cluster.

**Verification:**
- [ ] `moon run network:generator_test` green; `vela dry-run` / `tofu plan` renders the `tailscale_acl` diff without applying.

**Dependencies:** 3.1, 1.5, 1.6. **Files:** `apps/network/src/tailscale-config/{terraform,component,config}/*`, `apps/network/moon.yml`. **Scope:** M

---

## Checkpoint: Network (after Phase 3) — GATE
- [ ] `curl https://omada.network.vgijssel.nl` returns 200 with a valid Let's Encrypt cert.
- [ ] `tailscale-config` remained plan-only (real tailnet untouched from dev).

---

## Phase 4 — Remove terranetes

### Task 4.1: Delete platform terranetes bundle + apply.sh references
**Acceptance criteria:**
- [ ] `apps/platform/src/terranetes/` deleted.
- [ ] `platform-terranetes` `fleet apply` lines removed from every `apply.sh`.

**Verification:** `grep -rn terranetes apps/platform apps/*/scripts` empty.
**Dependencies:** P2+P3 gates passed. **Files:** `apps/platform/src/terranetes/**`, `apps/{secret,network}/scripts/apply.sh`. **Scope:** S

### Task 4.2: Delete vendored terranetes-controller chart + vendir entry
**Acceptance criteria:**
- [ ] `third_party/vendir/charts/terranetes-controller/` removed; `vendir.yml` entry removed.
- [ ] `vendir sync` run; `vendir.lock.yml` committed; `moon run vendir:test` green.

**Verification:** `moon run vendir:build && moon run vendir:test`; `ls charts/terranetes-controller` absent.
**Dependencies:** 4.1. **Files:** `third_party/vendir/{vendir.yml,vendir.lock.yml}`, `charts/terranetes-controller/**`. **Scope:** S

### Task 4.3: Delete per-cluster terranetes CRs, dead scripts, binfmt seed, and apiserver-proxy
**Description:** `apiserver-proxy` is deleted outright (confirmed) — cross-cluster traffic uses the target
service's Tailscale MagicDNS name directly, so the kube-API proxy + `api.<cluster>.vgijssel.nl` VIP/cert are
gone. Also delete the `tailscale-proxygroup` bundles that only served those `api-*` VIPs (keep any ProxyGroup
still needed for the OpenBao/Omada service VIPs).

**Acceptance criteria:**
- [ ] `configuration-*.yaml`, `provider-*.yaml`, `rbac-terranetes-state.yaml` deleted in both apps.
- [ ] `apps/{secret,network}/src/apiserver-proxy/` deleted; any `api-*` VIP references and `api.<cluster>` DNS/cert removed.
- [ ] Dead scripts removed: per-child `bootstrap.sh`, `configure.sh`, and terranetes lines in `apply.sh`.
- [ ] binfmt/qemu seed removed where no longer needed (only if no KubeVela/tf-controller image is amd64-only on arm64 base).
- [ ] terranetes references in `moon.yml` comments removed.

**Verification:** `grep -riE 'terranetes|terraform\.appvia\.io|appvia|apiserver-proxy' apps third_party` returns nothing outside historical docs.
**Dependencies:** 4.1, 4.2. **Files:** `apps/{secret,network}/src/{config,apiserver-proxy}/*`, `apps/{secret,network}/scripts/*`, `apps/{secret,network}/moon.yml`. **Scope:** M

---

## Checkpoint: Removal (after Phase 4) — GATE
- [ ] `grep -riE 'terranetes|terraform.appvia.io|appvia'` clean outside historical docs.
- [ ] `moon run vendir:test` green; both apps still build.

---

## Phase 5 — Harden

### Task 5.1: Zero residual bash; idempotent re-runs; teardown→rebuild smoke
**Description:** Confirm the only shell entrypoint is `control:start`. Verify token deletion, idempotent
Workflow re-runs, and a full teardown→rebuild from scratch reaching both acceptance gates.

**Acceptance criteria:**
- [ ] Only `apps/control/scripts/start.sh` (+ `stop.sh`) remain as bash; no per-child bootstrap/configure/apply/join scripts.
- [ ] Re-running the OpenBao Workflow is a no-op (idempotent); no residual root/temp token.
- [ ] Documented end-to-end smoke: fresh vind → root KubeVela → secret (OpenBao workflow, ESO green) → network (Omada 200 + LE cert).

**Verification:**
- [ ] `find apps -name '*.sh'` lists only control start/stop.
- [ ] Full `control:stop` → `control:start` → `control:up` reaches both gates.

**Dependencies:** Phases 1–4. **Files:** cleanup across `apps/`, plus a documented runbook. **Scope:** M

---

## Deferred (not now — SPEC §3.5, §9 #8)
- `moon` affected-detection to spin up only changed children (`moon ci <base> <head>`).
- Standing `tag:dev-k8s` tailnet provision + multi-PR concurrency (already isolated per full base cluster).
- `hack/tool/backup_restore` state import (reserve for adopting pre-existing state only).
