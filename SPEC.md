# SPEC — Replace Terranetes with KubeVela (multi-cluster control plane)

> Status: **DRAFT for review**. Author: AI-assisted. You remain responsible for the final work product;
> nothing here is execution-ready until you approve it and it is validated against the live systems.
> Source attribution: KubeVela / `kubevela/terraform-controller` docs are cited inline where a claim is
> load-bearing. Repo facts are grounded in the current `feat/network-cluster-omada` branch.

---

## 1. Objective

Remove the Appvia **terranetes** (`terraform-controller`) stack from the repo entirely and replace it with
**KubeVela** + `kubevela/terraform-controller`, restructured around a new **control-plane cluster**
(`apps/control`) that manages `apps/network` and `apps/secret` as spoke clusters over the tailnet.

Two problems drive this:

1. **Git-coupled Terraform (the original pain).** Terranetes `Configuration.spec.module` is a `go-getter`
   URL (`https://github.com/vgijssel/setup.git//apps/.../…?ref=<branch>`). `apply` runs the Terraform on the
   *targeted branch*, not the working tree — so there is no local dev loop. KubeVela's terraform component
   embeds **inline HCL** (generated from local `.tf` files), so editing HCL + regenerating + applying runs
   the current code immediately, with no push.
   ([component-terraform](https://kubevela.io/docs/platform-engineers/components/component-terraform/),
   [hcl example](https://github.com/kubevela/terraform-controller/blob/master/examples/custom/configuration_hcl_example.yaml))

2. **No central control plane.** Today each vind cluster self-manages via its own Fleet + terranetes. The
   target is a **single base cluster** with KubeVela in the root that creates and manages the `secret` and
   `network` clusters as **nested vclusters** and owns all Terraform — dev and prod share this exact shape,
   differing only in the base substrate (vind vs a real cluster).

### Success criteria (high level)

- Terranetes is fully deleted (code, vendir chart, CRDs, platform bundle, per-cluster CRs) — `grep -ri
  terranetes / terraform.appvia.io / appvia` returns nothing outside historical docs.
- A single base cluster stands up KubeVela in root, which provisions the `secret` and `network` child
  vclusters and everything in them — **no `?ref=` git dependency** for Terraform.
- Editing `apps/<x>/src/<thing>-config/terraform/*.tf` → `moon run <x>:generate` → apply → Terraform runs the
  edited code immediately.
- `moon run <x>:generator_test` fails CI when `component/` is stale relative to `terraform/`.
- Child clusters and their contents are provisioned by **KubeVela** (Applications/Components/Workflows); the
  only bash is creating the base cluster + installing KubeVela in root.
- Bootstrapping requires **no local `tofu apply`** and **no shell bootstrap scripts** beyond base `start` —
  one-off ordering (OpenBao init/token) lives in KubeVela Workflows.

---

## 2. Current state (what we are replacing)

Grounded in the current branch. Full blast radius:

**Vendored controller + CRDs**
- `third_party/vendir/vendir.yml` — `charts/terranetes-controller` (helmChart `v0.8.6`, repo
  `https://terranetes-controller.appvia.io`).
- `third_party/vendir/charts/terranetes-controller/` — chart + 7 CRDs (`terraform.appvia.io_*.yaml`:
  configurations, contexts, plans, policies, providers, revisions, cloudresources).
- `apps/platform/src/terranetes/` — umbrella Chart + `values.yaml` + `fleet.yaml` (bundle
  `platform-terranetes`; executor/controller images `ghcr.io/appvia/terranetes-*:v0.5.7`, amd64-only →
  needs host binfmt/qemu, see [[terranetes-arm64-emulation]]).

**Per-cluster Terraform (terranetes `Configuration`/`Provider`)**
- `apps/secret/src/config/`: `configuration-openbao.yaml` (`orphan: "true"`, `module:
  …//apps/secret/src/openbao-config?ref=feat/network-cluster-omada`, `providerRef: openbao`, vars
  `auth_method=kubernetes`, `bao_address`, `k8s_auth_role`, `network_oidc_issuer`, `network_jwks_url`),
  `provider-openbao.yaml` (`provider: "null"`, `source: injected`, `serviceAccount: terranetes-executor`),
  `rbac-terranetes-state.yaml` (executor RBAC to state Secret + leases).
- `apps/secret/src/openbao-config/` — OpenTofu module: `versions.tf` (vault 5.10.1 + null 3.3.0),
  `provider.tf` (vault provider, `auth_method` token|kubernetes, `skip_child_token`), `main.tf` (kv v2,
  kubernetes auth, policies/roles for external-secrets + terranetes, `jwt-network` backend + network roles),
  `variables.tf`. State: kubernetes-backend Secret `tfstate-default-openbao-config` (ns `secret`); local
  `secret:configure` writes a git-ignored `zz_backend.tf`.
- `apps/network/src/config/`: `configuration-tailscale.yaml` (`module: …//apps/network/src/tailscale-config`,
  `providerRef: tailscale`, vars `auth_method=jwt`, `bao_address=https://secret.vgijssel.nl`,
  `jwt_role=network-terranetes`), `provider-tailscale.yaml` (`null`), `rbac-terranetes-state.yaml`.
- `apps/network/src/tailscale-config/` — OpenTofu module: single `tailscale_acl` (whole tailnet policy,
  `overwrite_existing_content=true`), vault+tailscale+null providers, JWT auth to secret cluster.

**Bootstrap scripts** (`apps/{secret,network}/scripts/`): `start.sh` (vind + binfmt), `apply.sh` (install
Fleet + `fleet apply` bundle list incl. `platform-terranetes`), `bootstrap.sh` (seal key / operator-oauth
seed from OpenBao/1Password), `configure.sh` (**out-of-band `tofu apply` with root token** → shared k8s
state Secret), `stop.sh`.

**Reusable conventions to preserve**
- Fleet umbrella-chart bundles: `Chart.yaml` (`repository: file://…/third_party/vendir/charts/<x>`) +
  `values.yaml` + `fleet.yaml`; `dependsOn` by **label selector** (`fleet.vgijssel.nl/bundle: …`).
- Multi-cluster via Fleet `targets`/`targetCustomizations` keyed on label `cluster.vgijssel.nl/name`.
- **Generator-test pattern already exists**: `third_party/vendir/moon.yml` — `build` runs the generator,
  `test` runs `git diff --exit-code <output>`. Reuse verbatim for `generate`/`generator_test`.
- **API server already on the tailnet**: `apps/{network,secret}/src/apiserver-proxy/` exposes
  `api.<cluster>.vgijssel.nl` on a Tailscale LB VIP with a valid LE cert. Under the new model this is **no
  longer needed for the KubeVela control path** (root reaches children in-cluster); keep it only if a
  *service* still needs external API exposure. (see [[network-cluster-project]] T18/T20)

---

## 3. Target architecture

### 3.1 One base cluster, KubeVela in the root, nested vclusters (dev == prod)

**Dev and prod are the same shape.** There is a single **base cluster** with KubeVela installed in its
**root**. That root KubeVela:

1. **Manages its own root** (the `local` cluster) — installs shared platform pieces there.
2. **Creates the child clusters** `secret` and `network` as **nested vclusters**, via KubeVela
   `Application`/`Component`s (a vcluster is a helm-chart component).
3. **Joins and manages** each child cluster and **provisions its contents** (OpenBao into `secret`;
   Omada+MongoDB into `network`; ESO, cert-manager, tailscale, terraform Configurations, …).

The only difference between environments is the **base substrate**:

- **prod** — a real Kubernetes cluster.
- **dev** — a single **vind** cluster; the nested vclusters are vclusters-inside-vind.

```
        BASE cluster  (prod: real k8s   |   dev: vind)
  ┌─────────────────────────────────────────────────────────┐
  │ root: vela-core + cluster-gateway + terraform-controller │
  │       + Providers (vault, tailscale) + Applications      │
  │       (root manages `local` AND creates the children)    │
  │                                                          │
  │   creates + joins (in-cluster, DIRECT — no tailnet):     │
  │     ┌──────────────────┐      ┌───────────────────────┐  │
  │     │ vcluster: secret │      │ vcluster: network     │  │
  │     │   OpenBao        │      │   Omada + MongoDB     │  │
  │     └──────────────────┘      └───────────────────────┘  │
  └─────────────────────────────────────────────────────────┘
        tailnet is used ONLY for external service exposure
        (OpenBao / Omada VIPs, cross-service auth) — NOT the control path
```

**The tailnet is no longer part of the control path.** Because the root and its child vclusters live in the
**same** physical cluster, KubeVela reaches each child **directly** over in-cluster Service DNS (the vcluster's
API Service), joined with `vela cluster join <in-cluster-kubeconfig>`. No `apiserver-proxy`, no LE cert, no
tailnet, and **no chicken-and-egg** for the hub↔child connection. The tailnet (tailscale-operator + LB VIPs)
is still provisioned *inside* the child clusters, but only to expose their **services** (OpenBao at
`secret.vgijssel.nl`, Omada at `omada.network.vgijssel.nl`) and for cross-service auth — the data plane, not
control.

> **Scope note (why this is enough for now):** the fleet is small, so we just "spawn the entire thing" — every
> environment (including a PR preview) is a full base cluster with all children. If the number of children
> grows, we can later be selective and only spin up the parts a PR changed (§3.5). Not now.

### 3.2 Terraform executes in the child cluster (in-cluster auth)

`terraform-controller` reconciles a `Configuration` **in whichever cluster it lands**.
([terraform-controller](https://github.com/kubevela/terraform-controller)) In the single-base-cluster model
the clean choice is: the root **orchestrates** (holds the Application, dispatches via `topology`), and the
`Configuration` **lands in the child cluster** whose thing it configures — so `terraform-controller` runs in
each child that needs Terraform.

- `openbao-config` runs **in the `secret` child**, next to OpenBao → the `vault` provider authenticates with
  plain **in-cluster Kubernetes auth** (the child's own SA), exactly like the original terranetes model. No
  cross-cluster token/JWT gymnastics.
- `tailscale-config` runs **in the `network` child** and reaches the Tailscale API (internet) + reads OpenBao
  in-cluster / over the tailnet service VIP.
- This restores the simplest possible auth story and keeps each child self-describing (it carries the
  controller that reconciles its own Terraform). Cost is low now that everything is one physical cluster
  (single arch, no separate-host/binfmt problem).

> Alternative — root-centric execution (terraform-controller only in root, reaching child OpenBao over
> in-cluster networking). Possible, but forces OpenBao's auth to trust the root's identity and adds
> cross-vcluster service reachability. Rejected for the child-local model above. (revisit — spike §9 #1)

### 3.3 First-class Provider objects

Per your decision, replace the dummy-`null`-provider trick with real KubeVela `Provider`
(`terraform.core.oam.dev/v1beta1`) objects, referenced by `providerRef`. A provider addon/`Provider` maps a
credentials **Secret** into the env vars Terraform uses at `init` time; you can apply the `Provider` CR +
Secret directly (no `vela` CLI addon needed).
([provider credentials](https://kubevela.io/docs/platform-engineers/addon/terraform/))

- **`vault` provider** (OpenBao): a `Provider` supplying `VAULT_ADDR` + `VAULT_TOKEN` (bootstrap) then a
  k8s/JWT-auth path (steady state). Requires a provider-scaffold addon for a non-cloud provider (metadata
  `cloudProperties` name→secretKey mapping; `make terraform-addon-gen`) **or** a hand-authored `Provider` +
  Secret modeled on the generated shape. Validation spike (§9).
- **`tailscale` provider**: `Provider` supplying the Tailscale OAuth client id/secret (or API key) from a
  Secret sourced out of OpenBao (`kv/network-tailscale-config`).

### 3.4 KubeVela install (root) — the only bootstrap, then self-managing

The **single** imperative step is: create the base cluster and helm-install KubeVela in its root. After that,
**everything is KubeVela** — child vclusters, platform pieces, workloads, Terraform, and one-off bootstrap
(§4) are all `Application`/`Component`/`Workflow` objects. Charts are vendored via vendir (`repository:
file://…`) and pinned:
- `vela-core` (`https://charts.kubevela.net/core`) — brings cluster-gateway.
  ([helm install](https://artifacthub.io/packages/helm/kubevela/vela-core))
- `terraform-controller` (`https://charts.kubevela.net/addons`) — installed in root, and dispatched into each
  child that runs Terraform (§3.2).
  ([getting-started](https://github.com/kubevela/terraform-controller/blob/master/getting-started.md))

**Fleet's role shrinks.** Previously Fleet delivered everything per-cluster. Now the root KubeVela is the
delivery mechanism for the children. Fleet may still install the root KubeVela on a real prod cluster (GitOps
entrypoint), but the child clusters are provisioned by KubeVela, not Fleet. (Whether to keep Fleet at all for
the root, or bootstrap KubeVela another way, is a small open item — §9 #5.)

### 3.5 Dev == prod; PR previews; deferred selectivity

For now every environment is **the whole thing**: a base cluster + all children. There is no separate dev
topology to maintain.

- **Local dev / a PR preview** = one base **vind** cluster with KubeVela in root spawning `secret` + `network`
  children — identical to prod. The coding agent talks to that base cluster's root KubeVela (§6.1). Because a
  preview is a **complete, separate base cluster**, two concurrent PRs are two physically separate KubeVela
  installations → the "two agents edit the same ComponentDefinition" collision is **structurally impossible**,
  with no shared control-plane blast radius.
- Inline HCL still matters here: CI runs `moon run <app>:generate` on the PR checkout, so the preview tests the
  PR's **working-tree** HCL, not a pushed branch ref — the original motivation, now in the dev loop.

**Deferred (not now):** when the number of children grows, spin up only the parts a PR changed
(`moon ci <base> <head>` / `moon query projects --affected`) instead of the full base. Also deferred: the
tailnet `tag:dev-k8s` standing provision and `tailscale-config` plan-only handling — only relevant once
previews share the *one real tailnet*; while a preview is a fully self-contained base cluster we revisit how
its children reach the tailnet as part of the network phase (§9 #8).

---

## 4. Bootstrap — one imperative step, then KubeVela workflows

**Design rule (yours):** minimise bash; let the logic live inside KubeVela. Use **KubeVela `Workflow`s**
(Application workflow steps / standalone `WorkflowRun`s) for one-off bootstrap ordering, not shell scripts.

**The one imperative step (unavoidable):**
- Create the base cluster (dev: `vind`) and **helm-install KubeVela** (`vela-core` + `terraform-controller`) in
  its root. This is the only bash — a thin `control:start`. Everything below is KubeVela objects.

**Then, entirely in KubeVela (per child):**
1. **Provision the child** — an `Application` whose component is the `vcluster` helm chart creates the child
   vcluster; a follow-up step joins it (`vela cluster join` with the in-cluster kubeconfig). *No dedicated
   KubeVela vcluster addon exists — it's a helm component + a join step; the exact workflow shape is a spike,
   §9 #7.*
2. **Install the child's platform + workloads** — Applications dispatched via `topology → <child>`
   (cert-manager, ESO, tailscale-operator, OpenBao / Omada+MongoDB, terraform-controller).
3. **One-off OpenBao bring-up as a `Workflow`** (replaces today's `bootstrap.sh` + `configure.sh`):
   - a step seeds the static seal key + runs `bao operator init` (via a step-launched `Job`), storing recovery
     keys / root token to 1Password;
   - a step mints a **temporary** admin token and writes it to a Secret the `vault` `Provider` reads;
   - a step applies the `openbao-config` Terraform `Application` **once** (creates kv, k8s auth, policies/roles)
     — running **in-cluster** so the steady-state `vault` provider uses plain Kubernetes auth (§3.2);
   - a final step **deletes the temp-token Secret**. No long-lived/root token remains in-cluster.
   *(Whether these run as OAM workflow steps calling `Job`/`apply`/`read`, or as a `WorkflowRun`, is a spike —
   §9 #6. The goal: this ordering is a KubeVela object, not a shell script.)*
4. **`network` child** follows the same pattern (tailscale-config Terraform applies in-cluster against the
   real tailnet, reading creds from OpenBao).

**State:** kubernetes-backend Secret `tfstate-<workspace>-<secret_suffix>` **inside the child** that runs the
Configuration, with Lease locking.
([state backend](https://github.com/kubevela/terraform-controller/blob/master/DESIGN.md),
[kubernetes issue #6339](https://github.com/kubevela/kubevela/issues/6339)) Fresh bring-up needs **no state
import** (modules are idempotent — `openbao-config` imports singletons, `tailscale_acl` uses
`overwrite_existing_content`); `hack/tool/backup_restore`
([migration blog](https://kubevela.io/blog/2022/07/20/migrate-erraform-cloud-resources-to-kubeVela/)) stays in
reserve only for adopting pre-existing state.

---

## 5. Project structure & the `-config` convention

A directory holding Terraform is `<thing>-config/` with three subdirs:

```
apps/control/                                # BASE cluster: KubeVela root + child provisioning
  scripts/start.sh                           # the ONLY bash: create base (vind) + helm-install KubeVela
  src/
    kubevela/                                # vendored vela-core + terraform-controller (root install)
    providers/  { provider-vault, provider-tailscale, secrets… }   # first-class Provider objects
    children/                                # Applications that CREATE + provision the child vclusters
      application-secret.yaml                #   vcluster: secret  (+ its platform/workloads via topology)
      application-network.yaml               #   vcluster: network
    workflows/                               # KubeVela Workflows for one-off bootstrap (OpenBao init, …)

apps/secret/src/openbao/                     # OpenBao helm chart (now a KubeVela Component, not a Fleet bundle)
apps/secret/src/openbao-config/
  terraform/   { main.tf  provider.tf  variables.tf  versions.tf }  # hand-written HCL (source of truth)
  component/   <generated>.yaml              # GENERATED ComponentDefinition (vela def init --local)
  config/      application.yaml              # Application instantiating it (Provider ref, vars, topology→secret)

apps/network/src/{mongodb,omada}/            # KubeVela Components (helm)
apps/network/src/tailscale-config/
  terraform/  component/  config/            # same generated shape
```

- **Delivery is KubeVela, not Fleet.** `component/` (ComponentDefinition) and `config/` (Application) are
  applied to the **root** KubeVela; the Application's `topology` dispatches into the child. Order still
  matters: the `ComponentDefinition` must be registered before the `Application` that references it
  (`type: <name>`) renders — sequence with a workflow step / `dependsOn`, or rely on the controller's retry.
- The child vcluster's helm/raw workloads are ordinary KubeVela Components dispatched by the child-provisioning
  Application (`apps/control/src/children/*`).

---

## 6. Commands / moon targets

Per app (`apps/control`, `apps/network`, `apps/secret`):

| Target | Command | Notes |
|---|---|---|
| `generate` | `vela def init <name> --type component --local src/<x>-config/terraform > src/<x>-config/component/<generated>.yaml` (+ deterministic post-process) | Embeds inline HCL. Output committed. |
| `generator_test` | `git diff --exit-code src/<x>-config/component/` (dep: `~:generate`) | **Fails CI if `component/` is stale.** Mirrors `third_party/vendir/moon.yml`. |
| `start` (base only) | `scripts/start.sh` | **The only bash:** create base cluster (dev: vind) + helm-install KubeVela in root. |
| `up` | `vela up -f …` (or a thin wrapper) | Apply the child-provisioning + workload Applications/Workflows. |
| `stop` | `scripts/stop.sh` | Delete the base cluster (children go with it). |

- Per-child `bootstrap`/`configure`/`join`/`apply` scripts are **gone** — that logic moves into KubeVela
  `Application`/`Workflow` objects (§4). The base `start` is the only shell entrypoint.
- **`vela` CLI** must be added to the toolchain (hermit manifest / vendir) at a pinned version — required for
  `generate` (and handy for the dev loop). Installing vela-core/terraform-controller does **not** need the CLI.
- **Determinism:** `vela def init` output must be byte-stable for `generator_test`. If field ordering/whitespace
  is unstable across versions, pipe through a normalizer (e.g. `yq -P 'sort_keys(..)'`) — pin `vela` + `yq`.

### 6.1 Local dev loop (against the base cluster's root KubeVela)

The agent points `KUBECONFIG` at the base cluster's root KubeVela, and uses `topology → <child>` (or the
cluster-gateway proxy) to reach a child. Fastest feedback first:

**Tier 1 — client-side, no cluster (every edit).** Mirrors the controller's render logic locally.
```bash
moon run <app>:generate                    # regenerate ComponentDefinition from edited terraform/ (inline HCL)
moon run <app>:generator_test              # git-diff gate: fails if component/ is stale
vela def vet   src/<x>-config/component/*.yaml
vela dry-run -d src/<x>-config/component/ -f src/<x>-config/config/application.yaml   # renders w/o applying
```
`vela dry-run -d <local-defs> -f <app>` runs "the same render logic as KubeVela's Application Controller" —
so the agent sees the exact `Configuration`/Deployment it *would* produce, no cluster, no git push.
([dry-run](https://kubevela.io/docs/cli/vela_dry-run/))

**Tier 2 — live against the base cluster (real behavior).**
```bash
vela def apply src/<x>-config/component/*.yaml     # register the ComponentDefinition in root
vela up  -f    src/<x>-config/config/application.yaml   # topology dispatches into the child
vela status <app> --tree --detail                  # health across root + children
kubectl get configuration -A                       # inspect the child directly (cluster-gateway/topology)
```
Edit HCL → `generate` → `vela def apply` → the child's `terraform-controller` re-runs the `Configuration`
immediately (inline HCL, no ref).

**Tier 3 — pre-flight a change against the running app.**
```bash
vela live-diff <app> -r <app>-v1          # added/modified/removed sub-resources; no cluster change
```
([live-diff](https://kubevela.io/docs/cli/vela_live-diff/))

**Guardrail:** in a full self-contained base cluster, `openbao-config` and the workloads (Omada/MongoDB/ESO)
`vela up` for real against the child's **own** OpenBao. `tailscale-config` writes to the **one real tailnet**,
so keep it **`vela dry-run` / `tofu plan` only** unless you are deliberately reconciling prod — this is the
one thing that isn't safely disposable (§3.5, §9 #8).

---

## 7. Teardown-first, then remove terranetes

**Teardown (do this first, per your instruction).** Tear down the current live `secret` and `network` vind
clusters entirely — we rebuild from scratch on the new model, so there is nothing to migrate in place. Prefer
`secret:stop` / `network:stop` (delete the vind clusters) over deleting CRs in a running cluster. Durable data
(OpenBao KV, Tailscale OAuth, tailnet policy) is re-seedable from 1Password / regenerated by the new bring-up.

**Then remove terranetes from the repo:**
1. Delete `apps/platform/src/terranetes/` (bundle) and its `fleet apply` lines in every `apply.sh`.
2. Delete `third_party/vendir/charts/terranetes-controller/` and the `vendir.yml` entry; `vendir sync` +
   commit `vendir.lock.yml`.
3. Delete per-cluster `configuration-*.yaml`, `provider-*.yaml`, `rbac-terranetes-state.yaml`.
4. Remove `auth_method`/terranetes plumbing from the TF modules' `provider.tf`/`variables.tf` (replace with
   Provider-object-driven auth).
5. Remove terranetes references in `moon.yml` comments, `apply.sh`, `service-apiserver-proxy.yaml` comments.
6. Remove the amd64 binfmt/qemu seed where no longer needed (only terranetes' amd64 images required it; keep
   only if a KubeVela/terraform-controller image is amd64-only on an arm64 base). (see
   [[terranetes-arm64-emulation]])
7. Retire the per-cluster `bootstrap`/`configure`/`apply`/`join` scripts and the local `tofu apply` — replaced
   by KubeVela Applications/Workflows (§4).

**Safety:** never delete a terranetes `Configuration` in a *running* cluster (destroy risk — see
[[terranetes-openbao-config]]); teardown means deleting the whole vind cluster, not the CR.

---

## 8. Testing strategy

- **`generator_test`** per app — the CI gate that `component/` matches `terraform/` (git-diff-clean).
- **Terraform validity** — `tofu validate` / `terraform validate` on each `terraform/` dir (a `validate`
  target), independent of KubeVela.
- **Application render** — `vela dry-run -d <defs> -f <app>` for each Application (mirrors controller logic).
- **Bootstrap smoke** — a documented end-to-end: fresh base (vind) → KubeVela in root → child `secret` created
  + joined → OpenBao workflow (init → temp token → `openbao-config` applied in-cluster → token deleted) → ESO
  green → child `network` created → Omada up → `curl https://omada.network.vgijssel.nl` 200 with LE cert (the
  existing acceptance signal).
- **No secrets in git** — provider Secrets are sourced from OpenBao/1Password, never committed.

---

## 9. Open questions / validation spikes (resolve during implementation, not blocking the spec)

1. **Terraform execution location + auth (§3.2).** Confirm the child-local model: root dispatches the
   `openbao-config`/`tailscale-config` Application via `topology → <child>`, terraform-controller runs in the
   child, and the `vault` provider uses plain in-cluster Kubernetes auth against the co-located OpenBao. Verify
   KubeVela dispatches a `terraform.core.oam.dev` `Configuration` cleanly to a managed child and that the
   child's controller reconciles it.
2. **First-class non-cloud `Provider`.** Validate the provider-scaffold (`metadata.yaml` cloudProperties →
   `make terraform-addon-gen`) or a hand-authored `Provider`+Secret works for `vault` and `tailscale`
   (KubeVela's provider addons target clouds; non-cloud is less trodden).
3. **`vela def init` determinism** across the pinned CLI version (for `generator_test`).
4. **In-cluster `vela cluster join` for a child vcluster** — the kubeconfig endpoint (vcluster API Service
   DNS), credential type, and minimal RBAC; confirm no tailnet/LE cert is needed for the control path.
5. **KubeVela install / Fleet boundary (§3.4)** — decide how the *root* KubeVela is installed (thin `start`
   bash + helm, vs a Fleet bundle as GitOps entrypoint on real prod). Children are KubeVela-provisioned either
   way.
6. **Bootstrap-as-Workflow (§4).** Design the OpenBao bring-up as a KubeVela `Workflow`: steps that launch a
   `Job` (`bao operator init`), mint + store a temp token in a Secret, apply the `openbao-config` Application
   once, then delete the Secret. Confirm workflow steps can run `Job`/`apply`/`read`/`delete` and gate on
   readiness — so this stays a KubeVela object, not bash.
7. **vcluster provisioning as a KubeVela component (§4).** No dedicated vcluster addon exists; validate the
   loft-sh `vcluster` **helm component** + a follow-up **join** step, and nested-vcluster-inside-vind for dev.
8. **`tailscale-config` against the one real tailnet.** It's the only non-disposable Terraform. For the base
   dev cluster keep it plan-only by default; design how a full preview's children reach the tailnet (standing
   `tag:dev-k8s` provision) — only needed once previews share the real tailnet (deferred, §3.5).
9. **Interpretation check:** "kubevela terraform addon configured in kubevela through terraform" — read as
   *terraform-controller enabled in KubeVela*; confirm you didn't mean the addon config expressed as Terraform.

---

## 10. Boundaries

**Always**
- Keep real Terraform HCL as the source of truth in `terraform/`; treat `component/` as generated output.
- Pin every new tool/chart (vela CLI, vela-core, terraform-controller, yq) to exact versions.
- Source all provider credentials from OpenBao/1Password; delete bootstrap tokens after first use.
- Keep logic **inside KubeVela** (Applications/Components/Workflows); the only bash is base-cluster `start`.
- Reach children over the **in-cluster** control path (cluster-gateway); reserve the tailnet for service
  exposure only.

**Ask first**
- Anything destructive to a **live** cluster's OpenBao state or the tailnet policy (this repo has burned on
  both — see [[terranetes-openbao-config]], [[network-cluster-project]]).
- Deviating from the child-local Terraform execution model (§3.2 — changes the auth model).

**Never**
- Commit secrets or a `VAULT_TOKEN`/root token to git.
- Use `npx`/`uvx` or unpinned charts/images (CLAUDE.md).
- Delete a terranetes `Configuration` in place against a live cluster (destroy risk).
- **Apply `tailscale-config` from a disposable/dev base cluster** against the one real tailnet unless
  deliberately reconciling prod — it's `overwrite_existing_content` (§3.5, §9 #8).

---

## 11. Phased implementation (matches the requested sequence)

- **P0 — Teardown.** `secret:stop` + `network:stop`; confirm durable data is re-seedable (1Password). (§7)
- **P1 — Base cluster + KubeVela.** `apps/control`: thin `start` (vind + helm-install vela-core +
  terraform-controller in root). Add `vela` CLI (+ `yq`) to the toolchain; vendor the charts. Root manages
  `local`. **Gate: KubeVela healthy in root.**
- **P2 — Secret cluster, one Application at a time.** (a) Application that creates the `secret` child vcluster
  + joins it; (b) platform Applications into it (cert-manager, ESO, tailscale, OpenBao); (c) `openbao-config`
  as `terraform/`+`component/`+`config/` with the `vault` `Provider`; (d) the OpenBao bring-up **Workflow**
  (init → temp token → apply once → delete token). **Gate: ESO green against the child's OpenBao.**
- **P3 — Network cluster.** Rewrite `network` manifests to KubeVela Applications/Components (MongoDB, Omada,
  ESO, tailscale, apiserver-proxy-if-still-needed); `tailscale-config` as `terraform/`+`component/`+`config/`.
  **Gate: `curl https://omada.network.vgijssel.nl` 200 w/ LE cert.**
- **P4 — Remove terranetes.** Execute §7 removal in full; delete dead scripts; `vendir sync`.
- **P5 — Harden the bootstrap-as-Workflow.** Ensure zero residual bash beyond `start`; verify token deletion,
  idempotent re-runs, teardown.
- **Deferred — selectivity & PR previews.** `moon` affected-detection to spin up only changed children;
  standing `tag:dev-k8s`; multi-PR concurrency (already isolated since each preview is a full base cluster).

---

_Confirm or amend §3.1 (single base cluster + nested vclusters), §3.2 (child-local Terraform), and §4
(bootstrap-as-Workflow) — then I'll turn this into a task plan._
