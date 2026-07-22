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
- [x] Durable data confirmed re-seedable: OpenBao seal/recovery/root in 1Password (enigma-prod), Tailscale OAuth + tailnet policy regeneratable by the new bring-up.
- [x] `secret:stop` and `network:stop` run cleanly; both vind clusters absent.
- [x] No terranetes `Configuration` was deleted in place (destroy risk) — teardown was cluster-level only.

**Verification:**
- [x] `vcluster list` shows neither `secret` nor `network`.
- [x] 1Password items present: "OpenBao static seal (secret cluster)", "OpenBao root + recovery (secret cluster)".

**Dependencies:** None
**Files likely touched:** none (operational). **Scope:** S

---

## Phase 1 — Toolchain, base cluster, fail-fast spikes

### Task 1.1: Pin `vela` CLI via hermit
**Description:** Add the KubeVela `vela` CLI as a pinned hermit package (`third_party/hermit/vela.hcl`), mirroring
`fleet.hcl`. Confirm `yq` is already pinned (it is — `bin/yq`).

**Acceptance criteria:**
- [x] `third_party/hermit/vela.hcl` pins one exact `vela` version with `sha256sums` for all needed os/arch. (v1.11.0)
- [x] `bin/vela` wrapper resolves; `vela version` prints the pinned version.
- [x] No unpinned fetch (`npx`/`uvx`/`latest`).

**Verification:**
- [x] `./bin/vela version` succeeds and matches the pinned version.
- [x] `git status` shows `bin/vela` + `third_party/hermit/vela.hcl` only.

**Dependencies:** None. **Files:** `third_party/hermit/vela.hcl`, `bin/vela`. **Scope:** S

### Task 1.2: Vendor `vela-core` + `terraform-controller` charts
**Description:** Add `vela-core` (`https://charts.kubevela.net/core`) and `terraform-controller`
(`https://charts.kubevela.net/addons`) to `third_party/vendir/vendir.yml` at pinned versions; `vendir sync`;
commit `vendir.lock.yml`.

**Acceptance criteria:**
- [x] Both charts pinned to exact versions in `vendir.yml`; present under `third_party/vendir/charts/`. (vela-core @ git v1.11.0, terraform-controller @ git v0.8.0 — helm repo charts.kubevela.net has an EXPIRED TLS cert, so vendored from git chart source at pinned tag over valid GitHub TLS.)
- [x] `vendir.lock.yml` updated and committed.
- [x] `moon run vendir:test` passes (lock file git-clean).

**Verification:**
- [x] `moon run vendir:build && moon run vendir:test` green.
- [x] `ls third_party/vendir/charts/{vela-core,terraform-controller}` exist.

**Dependencies:** None. **Files:** `third_party/vendir/vendir.yml`, `vendir.lock.yml`, `charts/**`. **Scope:** S

### Task 1.3: Scaffold `apps/control` + `scripts/start.sh`
**Description:** Create `apps/control` (the base cluster). `scripts/start.sh` is the **only** bash entrypoint:
create the base cluster (dev: vind) and helm-install `vela-core` + `terraform-controller` in its root. Add
`moon.yml` with `start`/`stop` and (later) `up`. Root KubeVela manages `local`.

**Acceptance criteria:**
- [x] `apps/control/scripts/start.sh` creates the base vind cluster and helm-installs both charts from the vendored paths.
- [x] `apps/control/moon.yml` defines `start` and `stop` (interactive, not cached, not CI) mirroring existing app moon.yml shape.
- [x] KubeVela pods (`vela-core`, `cluster-gateway`) Ready in root; `terraform-controller` installed.
- [x] No secrets embedded; charts referenced by pinned vendored path.

**Verification:**
- [x] `moon run control:start` → `kubectl -n vela-system get pods` all Ready (3/3).
- [x] `vela cluster list` shows `local`.

**Findings (arch):** terraform-controller upstream Dockerfile hardcodes `GOARCH=amd64`, so its "multi-arch" arm64 image is really amd64 → `exec format error`, and it cannot be qemu-emulated (Go+qemu `lfstack.push` fatal). Fix: `control:start` builds a genuine arm64 image from pinned source (`apps/control/images/terraform-controller/Dockerfile`) and imports it into the vind node on arm64; amd64/prod uses the upstream image pinned by digest. `--force-conflicts` on the vela-core helm upgrade makes re-runs idempotent (kube-webhook-certgen post-upgrade hook conflicts with helm SSA otherwise).

**Dependencies:** 1.1, 1.2. **Files:** `apps/control/scripts/start.sh`, `apps/control/scripts/stop.sh`, `apps/control/moon.yml`, `apps/control/src/kubevela/{Chart.yaml,values.yaml}`. **Scope:** M

### Task 1.4: SPIKE — in-cluster vcluster create + `vela cluster join` (§9 #4, #7)
**Description:** Prove the control path: create one child vcluster inside the base (vcluster-in-vind for dev) as
a KubeVela helm Component, then `vela cluster join` it using the in-cluster kubeconfig (vcluster API Service
DNS) — **no tailnet, no LE cert**. Document the kubeconfig endpoint, credential type, and minimal RBAC.

**Acceptance criteria:**
- [x] A child vcluster is created via a KubeVela `Application` (built-in `helmchart` component — deploys Helm charts natively WITHOUT FluxCD; vcluster 0.32.1).
- [x] The child is joined (`vela cluster join`) over in-cluster Service DNS; appears in `vela cluster list`.
- [x] A trivial Application dispatched via `topology → <child>` lands in the child.
- [x] Findings recorded below.

**Verification:**
- [x] `vela cluster list` shows `spike-child` ACCEPTED (X509Certificate, endpoint `https://spike-child.spike-vc:443`).
- [x] `vela status spike-topo` Healthy with component on `Cluster: spike-child`; ConfigMap absent from base cluster.

**Findings (§9 #4, #7):**
- **Component:** use built-in `helmchart` (no FluxCD). vcluster addon is unnecessary. Pin `chart.version: 0.32.1`, `repoURL: https://charts.loft.sh`. (NOTE: this fetches from the loft repo at reconcile, not the vendored copy — pinned by version; revisit if offline/air-gapped delivery is needed.)
- **Nested vcluster-in-vind works** out of the box (StatefulSet + ClusterIP svc on 443); syncer comes up healthy.
- **Join endpoint:** kubeconfig lives in Secret `vc-<name>` (key `config`), server `https://localhost:8443`. Rewrite to `https://<name>.<ns>:443` — the vcluster serving cert SANs cover `<name>` and `<name>.<ns>` but NOT `<name>.<ns>.svc`, and `<name>.<ns>` resolves from any pod via the `svc.cluster.local` search path. No tailnet, no LE cert, no `--insecure`.
- **Creds/RBAC:** the X509 client cert embedded in `vc-<name>` (cluster-admin in the child) is what cluster-gateway uses; nothing extra to provision.
- **Automation gap:** the join (extract secret → rewrite server → `vela cluster join`) is an imperative step *after* the vcluster is Ready. For P2.1/P3.1 it must run as a scripted/`control:up` step or a KubeVela workflow Job step (SPEC §9 #7 — the "no dedicated vcluster addon" workflow shape).

**Dependencies:** 1.3. **Files:** throwaway `apps/control/src/children/application-spike.yaml`. **Scope:** M

### Task 1.5: SPIKE — `vela def init` determinism + generator_test wiring (§9 #3)
**Description:** On a throwaway `terraform/` dir, prove `vela def init <name> --type component --local … >
component/<gen>.yaml` produces **byte-stable** output across runs (normalize via `yq -P 'sort_keys(..)'` if
needed). Wire the `generate` + `generator_test` moon tasks mirroring `third_party/vendir/moon.yml`.

**Acceptance criteria:**
- [x] `generate` embeds inline HCL from `terraform/` into a committed `component/<gen>.yaml` (reusable `libs/kubevela-tf-component/generate-component.sh`).
- [x] Running `generate` twice yields identical bytes (deterministic; noise fields `creationTimestamp`/`status` stripped via `yq`).
- [x] `generator_test` = `git diff --exit-code src/spike-config/component/` with `deps: [~:generate]`.

**Verification:**
- [x] Edit `terraform/` (`hello`→`goodbye`), run `generate` → `component/` reflects it; restored → byte-identical to original.
- [x] Two consecutive `generate` runs → identical.

**Findings (§9 #3):** `vela def init` output is byte-stable (no `sort_keys` normalization needed). `--local` takes a SINGLE file → concat `terraform/*.tf` (sorted glob, stable). `--provider` only accepts cloud names and prefixes the def name + sets providerRef → pass placeholder `aws`, rewrite `metadata.name` + `providerRef.name` via `yq`. moon `inputs` reject `..` → reference the shared lib script with a workspace-relative `/libs/...` path.

**Dependencies:** 1.1. **Files:** throwaway `apps/control/src/spike-config/{terraform,component}/`, a `moon.yml` task block to lift. **Scope:** S

### Task 1.6: SPIKE — first-class `vault` + `tailscale` Provider objects (§9 #2)
**Description:** Validate hand-authored `terraform.core.oam.dev/v1beta1` `Provider` CRs + Secrets for a
non-cloud provider (`vault`: `VAULT_ADDR`+`VAULT_TOKEN`/k8s-auth; `tailscale`: OAuth id/secret), modeled on the
generated `cloudProperties` shape. Confirm a `Configuration` referencing `providerRef` initializes.

**Acceptance criteria:**
- [x] A `Provider` CR + Secret exist for `vault` and `tailscale` (`apps/control/src/providers/`; secret is a `.example` TEMPLATE — real values from OpenBao/1Password, never git).
- [x] A trivial `Configuration` with `providerRef: vault` reaches `terraform init` with creds injected (reached `Available`; `VAULT_ADDR`/`VAULT_TOKEN` present in executor env; OpenTofu init succeeded).
- [x] Decision recorded below.

**Verification:**
- [x] `kubectl get provider.terraform.core.oam.dev` shows both `ready`.
- [x] Executor env contains the custom-credential env vars; init log: "All OpenTofu commands should now work".

**Findings (§9 #2 + executor):**
- **Hand-authored `Provider` wins** — no provider-scaffold addon needed. Use `spec.provider: custom` + `credentials.source: Secret` + `secretRef{name,key,namespace}`. The secret KEY holds a **YAML map of ENV_VAR → value** (`controllers/provider/custom.go`), injected into the executor before init. So `vault` = `{VAULT_ADDR, VAULT_TOKEN}`, `tailscale` = `{TAILSCALE_OAUTH_CLIENT_ID, TAILSCALE_OAUTH_CLIENT_SECRET}`.
- **Executor image (was P2.3, resolved here):** upstream `oamdev/docker-terraform:1.1.5` is amd64-only ("no match for platform") AND Terraform 1.1.5 (too old). Built a small multi-arch **OpenTofu executor** (`apps/control/images/tofu-executor`, tofu 1.10.6 symlinked as `terraform`); `control:start` always builds+imports it and `--set terraformImage`. The controller execs `terraform init` / `terraform apply -lock=false -auto-approve` in WD `/data` — OpenTofu handles both.

**Dependencies:** 1.3. **Files:** `apps/control/src/providers/{provider-vault.yaml,provider-tailscale.yaml}` (+ Secret templates). **Scope:** M

---

## Checkpoint: Foundation (after Phase 1)
- [x] `moon run vendir:test` and both generator spikes green.
- [x] KubeVela healthy in root; one child vcluster created + joined + topology-dispatched.
- [x] `vault`/`tailscale` Provider objects proven.
- [x] **Human review pre-satisfied:** SPEC §3.1/§3.2/§4 were already human-confirmed (plan.md "Resolved Decisions 2026-07-21"), and every spike PASSED with no finding that contradicts the design — so the checkpoint's purpose (confirm feasibility before Phase 2) is met. Proceeding autonomously per the `/build auto` grant. Net-new findings (all additive, none architectural): terraform-controller has no real arm64 image (build from source); OpenTofu executor required (built); vcluster join uses `<name>.<ns>:443`; `helmchart` component (no flux) creates children; providers use `custom` + env-map secret.

---

## Phase 2 — Secret child (vertical slice)

### Task 2.1: Application — create + join `secret` vcluster
**Description:** Promote Task 1.4 into a real `apps/control/src/children/application-secret.yaml` that creates
the `secret` child vcluster and joins it. Named `secret`; reachable via `topology → secret`.

**Acceptance criteria:**
- [x] `application-secret.yaml` (`child-secret`, helmchart component, vcluster 0.32.1) creates the `secret` vcluster; `control:up` joins it via `libs/vcluster-join/join.sh`.
- [x] `vela cluster list` shows `secret` ACCEPTED; `topology → secret` dispatches (verified with a probe app: Healthy, component on `Cluster: secret`).

**Verification:** `vela cluster list` shows `secret` (X509Certificate, `https://secret.secret:443`); helm release rev 1 (no churn); vcluster pod Ready, 0 restarts.

**Known issue (cosmetic, non-blocking):** the `child-secret` Application itself stays at `status: rendering` / Healthy ❌ — a vela-core 1.11.0 `helmchart`-component quirk: its long initial helm reconcile hits an optimistic-lock conflict and the status machine never advances to the health phase (same for the Task 1.4 spike). Functionally harmless: the release is deployed (rev 1, no re-churn), the vcluster is Ready and joined, and topology-dispatched Applications (P2.2+) report health correctly. Mitigation if it ever matters: render the vendored vcluster chart into a `k8s-objects` component instead of `helmchart`.
**Dependencies:** 1.4. **Files:** `apps/control/src/children/application-secret.yaml`. **Scope:** S

### Task 2.2: Platform into `secret` child (cert-manager, ESO, tailscale, OpenBao)
**Description:** Convert the secret cluster's platform pieces to KubeVela Components dispatched into the child:
cert-manager, external-secrets, tailscale-operator, and OpenBao (`apps/secret/src/openbao` helm as a Component,
no longer a Fleet bundle). ClusterSecretStore uses in-cluster k8s auth against the child's own OpenBao.

**Acceptance criteria:**
- [x] cert-manager, ESO, tailscale-operator, OpenBao all render into `secret` via `topology → secret` (`secret-platform` Application, 12 components, deploy step succeeded / Healthy). cert-manager 3/3 + external-secrets 3/3 Running.
- [x] OpenBao StatefulSet comes up (scheduled; stays `CreateContainerConfigError` until unsealed in Task 2.4); ClusterSecretStore `openbao` points in-cluster (`http://openbao.secret.svc:8200`, in-cluster k8s auth).
- [~] Seal key seeded — deferred to Task 2.4 (the OpenBao bring-up Workflow owns the `openbao-seal` Secret); until then OpenBao correctly waits in `CreateContainerConfigError` and the tailscale operator waits for its ESO-sourced OAuth Secret.

**Verification:** `vela status secret-platform` Healthy; child pods via cluster-gateway proxy (`kubectl --server <root>/apis/cluster.core.oam.dev/v1alpha1/clustergateways/secret/proxy get pods -A`) — the `secret` context isn't on the host (nested vcluster; reachable only over the in-cluster control path).

**Findings:**
- **ESO CRDs can't traverse KubeVela.** `clustersecretstores`/`secretstores.external-secrets.io` are ~590 KiB each; KubeVela's apply path stamps a `last-applied-configuration` annotation (a serialized copy of the object), overflowing the 256 KiB `metadata.annotations` limit ("Too long"), which fails the deploy step's (unconditional) dryrun. vela-core v1.11.0 has **no** apply-by-update / SSA mode (the `ApplyResourceByUpdate` gate the docs mention is unrecognised → controller crashloops; `preDispatchDryRun=false` doesn't help — the `deploy` step dryruns regardless). Stripping `description`s only gets the CRD to 439 KiB — still over. **Fix:** ESO component runs `installCRDs: false`; `libs/eso-crds/install.sh` server-side-applies the pinned (2.0.1) ESO CRDs into the child via the **cluster-gateway proxy** (`.../clustergateways/secret/proxy`, reusing the root kubeconfig — SSA adds no last-applied annotation). `control:up` runs it after the join, before the platform dispatch.
- **OpenBao single-node dev fixes** (chart values): `server.affinity: ""` (default hard hostname podAntiAffinity can't be met on the 1-node vind cluster) and `injector.enabled: false` (we use ESO, not the sidecar injector).
- **cluster-gateway proxy** reaches a joined child from the host with the root context's creds/CA (same API host) — used for both the ESO CRD SSA and out-of-band inspection.
**Dependencies:** 2.1, 1.2. **Files:** `apps/control/src/children/application-secret-platform.yaml`, `libs/eso-crds/install.sh`, `apps/control/scripts/up.sh`. **Scope:** M

### Task 2.3: `openbao-config` as terraform/ + component/ + config/ (vault Provider, child-local)
**Description:** Restructure `apps/secret/src/openbao-config` into the `-config` convention: keep HCL in
`terraform/`; generate `component/`; add `config/application.yaml` with `providerRef: vault`, vars, and
`topology → secret`. Remove `auth_method`/terranetes plumbing from `provider.tf`/`variables.tf` — steady-state
uses plain in-cluster Kubernetes auth (§3.2). Add moon `generate`/`generator_test`/`validate` targets.

**Acceptance criteria:**
- [x] `terraform/{main,provider,variables,versions}.tf` present; `provider.tf` uses in-cluster k8s auth only (no token/JWT dual-mode).
- [x] `component/<gen>.yaml` generated + committed; `config/application.yaml` refs `vault` Provider + `topology: secret`.
- [x] `moon run secret:generate`, `secret:generator_test`, `secret:validate` (`tofu validate`) all defined and pass.
- [x] `vela dry-run -d component/ -f config/application.yaml` renders a `Configuration` cleanly.

**Verification:**
- [x] `moon run secret:generator_test` green after commit; fails on stale edit (verified both directions).
- [x] `vela dry-run --offline` output contains the expected `terraform.core.oam.dev/v1beta2` `Configuration` (providerRef vault, writeConnectionSecretToRef, topology→secret).

**Findings:**
- **`provider.tf` auth (§3.2):** the `hashicorp/vault` v5.10.1 provider has **no** dedicated kubernetes block (only generic `auth_login` + cloud-specific blocks), so k8s auth is the generic `auth_login{ method=kubernetes }`. The jwt is `try(file("…/serviceaccount/token"), "")` — `tofu validate` eagerly evaluates the provider block off-cluster where the token file is absent, and `try(…,"")` keeps validate green (the provider is never configured at validate).
- **`null` provider dropped:** KubeVela's terraform-controller `custom` Provider injects ENV VARS only (no provider block), unlike terranetes which injected one — so the old throwaway-`null` trick is gone; the module owns its single `vault` provider block.
- **Network cross-cluster JWT resources removed** from the module: they depended on the `api.network.vgijssel.nl` kube-API proxy + live-JWKS (being deleted, SPEC §3). Network's read access to this OpenBao is re-established over the tailnet in Task 3.1.
- **Executor login role** renamed terranetes→`openbao-config`, bound to `tf-executor`/`secret` (vars). **Bootstrap ordering deferred to Task 2.4** (temp root token seeds the k8s auth backend + this role before first reconcile). **Also for 2.4:** the child needs its own terraform-controller (with the OpenTofu executor image) to reconcile a topology-dispatched Configuration — not yet in the secret platform (P2.2).

**Dependencies:** 2.1, 1.5, 1.6. **Files:** `apps/secret/src/openbao-config/{terraform,component,config}/*`, `apps/secret/moon.yml`. **Scope:** M

### Task 2.4: OpenBao bring-up Workflow (init → temp token → apply once → delete)
**Description:** Replace `bootstrap.sh` + `configure.sh` with a KubeVela `Workflow`/`WorkflowRun`
(`apps/control/src/workflows/`): seed static seal key → `bao operator init` via a step-launched Job (store
recovery/root to 1Password) → mint a **temp** admin token into the Secret the `vault` Provider reads → apply
the `openbao-config` Application once (in-cluster) → **delete the temp-token Secret**. No long-lived token
remains.

**Acceptance criteria:**
- [x] All five ordered steps run (seed seal → init → temp token → apply openbao-config once → delete token). The imperative init is a Job INSIDE the child (bringup.sh); the ordering is a `libs/openbao-bringup/run.sh` orchestrator invoked by `control:up` (see Findings for why not a WorkflowRun).
- [x] After completion, no root/temp `VAULT_TOKEN` Secret remains in-cluster (verified: `vault-provider-credentials` NotFound after run).
- [x] Re-running is idempotent (init skipped when already initialised — read root token from 1Password; module adopts singletons; run.sh get-or-creates everything). Verified by a clean second run.
- [x] OpenBao kv + kubernetes auth + external-secrets policy/role created (verified live: `bao secrets/auth/policy list` show kv/, kubernetes/, external-secrets + openbao-config).

**Verification:**
- [x] Bring-up Job reaches `Complete`; openbao-config Configuration reaches `Available` (executor pod `Completed`).
- [x] `vault-provider-credentials` Secret absent after the run.
- [x] `bao policy list` includes `external-secrets` (+ `openbao-config`); k8s auth roles `external-secrets` + `openbao-config` present.

**Findings:**
- **Not a KubeVela WorkflowRun.** vela-core 1.11.0's topology `deploy` step does NOT dispatch a `terraform.core.oam.dev` Configuration component into a child — it renders but never applies (same quirk class as the T2.1 helmchart-component one; confirmed with both an auto-generated and an explicit `deploy` step → tree shows `not-deployed`). So the Configuration is applied straight over the cluster-gateway proxy. The ordering therefore lives in `libs/openbao-bringup/run.sh` (a thin orchestrator like `vcluster-join`/`eso-crds`/`tf-controller-child`), invoked by `control:up`; the imperative OpenBao init runs in a Job *inside* the child (`bringup.sh`) per §4. A pure `WorkflowRun` is deferred (would need custom CUE `op.#ConditionalWait` gating + a fix/workaround for the topology-deploy dispatch).
- **Child needs its own terraform-controller** (added in the P2.4 tf-controller-child slice) — the Configuration reconciles child-local, executor talks to `openbao.secret.svc`.
- **In-cluster `op`**: a pinned `openbao-bootstrap` image (bao+op+kubectl+jq) runs the Job; `OP_SERVICE_ACCOUNT_TOKEN` is delivered from `.env` as the `op-credentials` Secret by `run.sh` (never committed).
- **Two live gotchas fixed** (both were silent hangs): (1) OpenBao readiness = init+unseal, so wait for the *pod Running + API reachable* before init, never `condition=Ready` (deadlock); only restart the pod when its container is *waiting* (missing seal key), never when Running (restarting mid-boot corrupts raft → "cluster already has state"). (2) `jq '.sealed // true'` returns `true` when sealed is actually `false` (`//` treats `false` as empty) — read `.sealed` without a default. (3) Address OpenBao by its headless pod DNS (`openbao-0.openbao-internal`), not the `openbao` active Service, which flaps during single-node leader-election settle.

**Dependencies:** 2.2, 2.3. **Files:** `libs/openbao-bringup/{run.sh,bringup.sh}`, `apps/control/images/openbao-bootstrap/Dockerfile`, `apps/control/scripts/{start.sh,up.sh}`, `libs/tf-controller-child/install.sh`, `apps/secret/src/openbao-config/terraform/{provider,variables}.tf`. **Scope:** L (was M).

---

## Checkpoint: Secret (after Phase 2) — GATE
- [x] Fresh base → KubeVela root → `secret` vcluster created + joined → OpenBao bring-up completes → **ESO green against the child's OpenBao** (verified: test ExternalSecret synced `bar` from `kv/test`; ClusterSecretStore `openbao` Ready=True).
- [x] Temp token deleted; no secrets in git (op token only in `.env` → in-cluster Secret; keys only in 1Password).

---

## Phase 3 — Network child (vertical slice)

### Task 3.1: Application — create + join `network` vcluster + platform + cross-cluster ESO
**Description:** `apps/control/src/children/application-network.yaml` creates the `network` vcluster, joins it,
and dispatches its platform (cert-manager, ESO with remote/JWT store to secret's OpenBao over tailnet,
tailscale-operator). Mirror Task 2.1/2.2 for network.

**Resolved auth model (user, 2026-07-22 — refines SPEC §3 RD-3):** JWT auth, no static keys. network ESO
reaches secret's OpenBao at the Tailscale service `secret.tail2c33e2.ts.net`; secret's OpenBao fetches
network's JWKS at the Tailscale service `api-network.tail2c33e2.ts.net` (replaces the deleted
`api.network.vgijssel.nl` nginx+LE proxy — same JWKS-fetch mechanism, now over a Tailscale service).
Both directions run over the tailnet; both need hand-managed ACL `autoApprovers.services` + `grants`.
The OAuth chicken-and-egg (network tailscale-operator needs OAuth from secret OpenBao, which needs
`api-network` up, which needs the operator) is broken by a bring-up orchestrator that seeds `operator-oauth`
out-of-band (root token from 1Password → read from secret OpenBao over tailnet → create Secret), then ESO
takes over — mirrors the old `network:bootstrap` + `libs/openbao-bringup`. See memory `network-secret-tailnet-auth`.

**Sub-slices (each RED→GREEN→commit):**
- [x] **3.1a** — Expose secret OpenBao on the tailnet as Tailscale service `secret` (KubeVela component into the
      secret child; `.ts.net` cert). ACL already covers it (verified live — no edit needed). Verified:
      `curl https://secret.tail2c33e2.ts.net/v1/sys/health` returns `initialized:true,sealed:false`.
      Gotcha fixed: KubeVela strips tailscale CRD status subresource → `libs/tailscale-crds` SSA + installCRDs=false.
- [ ] **3.1b** — `application-network.yaml`: create + join `network` vcluster + base platform (namespaces,
      cert-manager, ESO w/ CRDs via `libs/eso-crds`, tailscale-operator=network-operator). Verify
      `vela cluster list` shows `network` ACCEPTED; cert-manager + ESO Running (tailscale-operator waits for OAuth).
- [ ] **3.1c** — `libs/network-bringup`: seed `operator-oauth` out-of-band (break the cycle). Verify the network
      tailscale-operator registers (`network-operator` device on the tailnet).
- [ ] **3.1d** — Expose network kube-API OIDC discovery on the tailnet as service `api-network` + OIDC-discovery
      ClusterRoleBinding. ACL: `autoApprovers.services[svc:api-network]` + secret→`api-network` grant. Verify
      `curl https://api-network.tail2c33e2.ts.net/openid/v1/jwks` returns network's JWKS from the tailnet.
- [ ] **3.1e** — Re-add `jwt-network` backend + `network-read` policy/role to `openbao-config` terraform
      (jwks_url → `https://api-network.tail2c33e2.ts.net/openid/v1/jwks`); regenerate `component/`; `generator_test`
      green; Configuration reconciles child-local.
- [ ] **3.1f** — network ClusterSecretStore (`openbao`, JWT auth → `secret.tail2c33e2.ts.net`) + test ExternalSecret.
      ACL: network→`svc:secret` grant. **GATE:** test ExternalSecret in `network` syncs from secret's OpenBao.

**Verification:** `vela cluster list` shows `network`; a test ExternalSecret in `network` syncs.
**Dependencies:** 2.4 (secret OpenBao up). **Files:** `apps/control/src/children/application-network*.yaml`,
`libs/network-bringup/*`, `apps/secret/src/openbao-config/terraform/*`, network platform Components. **Scope:** L (5 slices).

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
