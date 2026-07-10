# TODO: Kubernetes-native homelab → Hetzner gateway cluster

Companion to `tasks/plan.md`. Tasks are ordered by dependency and sliced vertically — each one
delivers a complete, verifiable path. `[ ]` = pending, `[~]` = in progress, `[x]` = done.
Do `trunk fmt && trunk check` before committing every task.

---

## Phase 0 — Local bootstrap (macbook k3d)

### [x] T1 — `apps/bootstrap` k3d harness skeleton
Create `apps/bootstrap/` with `k3d.yaml` (native snapshotter per CLAUDE.md), `scripts/up.sh`
(create cluster only, idempotent), `scripts/down.sh`, and `moon.yml` (`up`, `down` tasks,
`runInCI: false`).
- **Acceptance:** `moon run bootstrap:up` creates a k3d cluster and `kubectl` context works;
  `moon run bootstrap:down` removes it cleanly; re-running `up` is idempotent.
- **Verify:** `moon run bootstrap:up && kubectl get nodes` shows a Ready node; `moon run
  bootstrap:down` then `kubectl config get-contexts` shows it gone.

### [x] T2 — `apps/platform` (full, environment-agnostic)
Create `apps/platform/` as an environment-agnostic Helm grouping, deployed **in full** to the local
k3d cluster (and later reconciled unchanged on the gateway by Fleet): external-secrets, Tailscale
operator, cert-manager + a Cloudflare DNS-01 `ClusterIssuer`, an external-secrets
`ClusterSecretStore` pointed at OpenBao, and Netdata (Cloud claim token sourced from OpenBao via
ESO). Pin all chart + image versions; commit `Chart.lock`. Add a `lint` moon task (kubeconform +
`helm template`).
- **Acceptance:** `moon run platform:lint` passes; the full platform deploys to the T1 k3d cluster
  with all operator pods Ready; `ClusterSecretStore` and `ClusterIssuer` objects reconcile (the
  store may show NotReady until OpenBao exists in T4, and Netdata may stay unclaimed until secrets
  are seeded in T5 — both expected).
- **Verify:** `helm template` renders clean; `kubectl -n <ns> get pods` all Ready; `kubectl get
  clustersecretstore,clusterissuer` exist.

### [ ] T3 — `apps/auth` (Authentik) + `svc:auth`
Create `apps/auth/` (Authentik server, worker, PostgreSQL, Redis via Helm values, pinned) with a
Tailscale Service `svc:auth` (tailnet-only, no public exposure) and a cert-manager Certificate for
`auth.vgijssel.nl`. The Tailscale Service front-end must preserve `Host: auth.vgijssel.nl` +
`X-Forwarded-Proto: https` (SPEC must-get-right). Add a `lint` task.
- **Acceptance:** `moon run auth:lint` passes; Authentik deploys on k3d; `auth.vgijssel.nl`
  resolves over the tailnet and serves the Authentik UI with a valid cert-manager cert.
- **Verify:** `curl -sSf https://auth.vgijssel.nl/if/flow/...` from a tailnet host returns 200 with
  a valid `vgijssel.nl` cert; the same request from a non-tailnet host fails.

### [~] T4 — `apps/secret` (OpenBao raft + `apps/aws-sigv4-proxy`) + `svc:secrets`/`svc:terraform-state`
> Progress: OpenBao (single-node raft) + aws-sigv4-proxy charts built, `secret:lint` passes, both
> deployed to local k3d via Tilt. OpenBao runs sealed/uninitialised (expected pre-T5); sigv4-proxy
> waits on the `terraform-state-s3` ESO secret. **Deferred:** the `svc:secrets`/`svc:terraform-state`
> Tailscale Services + cert-manager Certs — they need the Tailscale operator (blocked on its OAuth
> secret from OpenBao) and are on the external-access path, not the in-cluster ESO path.
Create `apps/secret/`: OpenBao single-node raft (PVC-backed) with a Tailscale Service
`svc:secrets` + cert for `secrets.vgijssel.nl`; and the reused `libs/aws-sigv4-proxy` deployed with
a Tailscale Service `svc:terraform-state` + cert for `terraform-state.vgijssel.nl`, its S3 creds fed
by external-secrets from OpenBao. OIDC auth-method config lives here (applied in T5). Add a `lint`
task. Depends on T2 (ESO, Tailscale op, cert-manager) and `libs/aws-sigv4-proxy`.
- **Acceptance:** `moon run secret:lint` passes; OpenBao pod Ready (sealed, uninitialized is fine
  pre-T5); sigv4-proxy pod Ready; both Tailscale Services + certs present.
- **Verify:** `kubectl -n <ns> get pods` Ready; `curl https://secrets.vgijssel.nl/v1/sys/health`
  responds (501/sealed acceptable); `secrets.vgijssel.nl`/`terraform-state.vgijssel.nl` resolve on
  the tailnet with valid certs.

### [ ] S1 — Spike: sigv4-proxy re-sign against Hetzner Object Storage (gates T10)
Validate that `aws-sigv4-proxy` strips an incoming dummy SigV4 request and re-signs it with real
Hetzner S3 creds behind `terraform-state.vgijssel.nl`, so a plain `aws s3`/tofu S3 call with dummy
creds succeeds. This de-risks the `apps/gateway` backend before T10.
- **Acceptance:** an `aws s3 ls`/`cp` through the proxy with dummy creds succeeds against the real
  Hetzner bucket; document the exact proxy config (host header, region, path-style) that works.
- **Verify:** `AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy aws --endpoint-url
  https://terraform-state.vgijssel.nl s3 ls s3://<bucket>` returns the object list. Record findings
  in this file under the task.

### [~] T5 — bootstrap orchestration + `init-openbao`
Orchestration is via **Tilt** (not scripts): `bootstrap:start` creates k3d + `tilt up` (background)
deploying `apps/platform` + `apps/secret`; `bootstrap:stop` tears down + deletes the cluster.
`apps/secret:init` (`scripts/init-openbao.sh`) runs `bao operator init`, stores unseal keys + root
token in **1Password only** (`op`, in-memory — no disk; account `my.1password.com`, vault
`enigma-prod`), unseals, then configures the **kubernetes
auth method** (role `external-secrets` bound to the ESO ServiceAccount) + a `kv` v2 engine, and
prints the secrets to seed. **Seeding is done by the operator via the OpenBao UI** (user decision) —
no `seed` task. `bao` CLI pinned via Hermit (`third_party/hermit/openbao.hcl`, v2.5.5).
- **Deferred to later tasks:** OIDC-auth-method → Authentik config (needs `apps/auth`/T3); the
  `apps/auth` deploy in the bootstrap flow.
- **Verified on local k3d:** `secret:init` runs init→1Password→unseal→reconnect→kv+k8s-auth config
  end-to-end; the `ClusterSecretStore` reports **Ready=True / Valid**; the ESO ServiceAccount
  authenticates via the kubernetes auth method and receives a scoped token. No secret on local disk.
- **Superseded by T5a:** the imperative kv+policy+role config moves to declarative CRs; the init
  script shrinks to the minimal seam (see below).

### [x] T5a — Declarative OpenBao config via vault-config-operator (minimise the init script)
> **Implemented and live-validated on local k3d (2026-07-10).**
> - Vendored `redhat-cop/vault-config-operator` v0.8.49 (`third_party/vendir`) + added the
>   `apps/platform/vault-config-operator` umbrella (`enableMonitoring: false`, `enableCertManager:
>   true`, `VAULT_ADDR=http://openbao.secret.svc:8200`); wired into `platform:lint` and the Tiltfile
>   (gated on cert-manager for its webhook cert).
> - `apps/secret/config/` CRs (all in the `vault-config-operator` namespace, auth as the operator's
>   `controller-manager` SA): `AuthEngineMount` + `Policy` + `KubernetesAuthEngineRole`
>   (vault-config-operator, mirror/adopt the seam) and `SecretEngineMount` kv + `Policy` +
>   `KubernetesAuthEngineRole` (external-secrets). Wired into the Tiltfile `vault-config` group.
> - `init-openbao.sh` shrunk to the minimal seam: kubernetes auth enable + config + the operator's
>   own policy/role (kept byte-for-byte in sync with the two vault-config-operator CRs so the
>   operator adopts them). The kv engine + external-secrets policy/role are gone from the script.
> - **Live-validated:** after `secret:init`, the operator adopted the foothold and reconciled all six
>   CRs (`LastReconcileCycleSucceded`); `ClusterSecretStore` → Ready=True/Valid; kv mounted as **v2**
>   (`type: kv` + `options.version: "2"` — the caveat is resolved, no `kv-v2` change needed); and a
>   test `ExternalSecret` synced a seeded `kv` value into a k8s Secret (`SecretSynced`).
> - **Fix from validation (commit cfecada4):** the operator manages ACL policies via the legacy
>   `sys/policy` endpoint, not `sys/policies/acl`; the admin policy now grants both (seam + CR in
>   sync). Also raised the Tiltfile `k8s_upsert_timeout_secs` to 180 — cert-manager's startupapicheck
>   hook exceeds Tilt's 30s default on a cold cluster and stalls everything gated on it.
> - **Deviation (kept):** the kubernetes-auth **config** (`kubernetes_host`) stays in the seam, not a
>   `KubernetesAuthEngineConfig` CR — that CR's Vault path resolves as `auth/{path}/config/{name}`
>   (suspect for the singleton `.../config` endpoint). The seam writes it correctly; the live run
>   confirmed auth works without the CR.
> - **Note (operator restart nuance):** editing the operator's *own* admin policy after it has logged
>   in needs an operator pod restart to pick up new caps. On a clean bootstrap the seam plants the
>   final policy up-front, so no restart is needed.
> - **Follow-up (not T5a):** `init-openbao.sh` keys off a fixed 1Password item *title*; a duplicate
>   title in `enigma-prod` breaks the read (`op item get` ambiguity) and the script misreports it as
>   "keys lost". Consider pinning by item ID / de-duplicating.
Move OpenBao's kv/policy/auth-role configuration out of `init-openbao.sh` into **Kubernetes
manifests** reconciled by **redhat-cop/vault-config-operator**. Bootstrap is **eventually
consistent**: Tilt/Fleet lay down the operator + all CRs immediately; they error-and-retry while
OpenBao is sealed/unconfigured and converge once the seam below runs — a broken boot state is fine.

**Spike findings (validated on local k3d, 2026-07-10 — throwaway dev-mode OpenBao, torn down):**
- vault-config-operator **works against OpenBao 2.5.5** — kv-v2 mount, `Policy`, and
  `KubernetesAuthEngineRole` all reconciled (`LastReconcileCycleSucceded`) and were written to
  OpenBao. No version-gate rejection, no API incompatibility.
- Chart: helm repo `https://redhat-cop.github.io/vault-config-operator`, chart+app `v0.8.49`,
  image `quay.io/redhat-cop/vault-config-operator:v0.8.49`. Values: `enableMonitoring: false`,
  `env[0]=VAULT_ADDR=http://openbao.secret.svc:8200`.
- **Requires cert-manager**: set `enableCertManager: true` (chart self-creates a `selfsigned-issuer`
  Issuer + webhook Certificate). With it false the manager pod hangs on a missing `webhook-server-cert`.
  cert-manager already ships in `apps/platform`.
- All CRDs are `redhatcop.redhat.io/v1alpha1`. Gotchas the docs miss:
  - `spec.authentication.serviceAccount` is a `LocalObjectReference` (`{name: ...}`), **not** a string.
  - `SecretEngineMount` mounts at **`<spec.path>/<metadata.name>`** — to land a clean `kv/` mount, set
    `spec.path: ""` + `metadata.name: kv` (verify) rather than `path: kv, name: kv` (→ `kv/kv/`).
  - CRDs have finalizers the operator clears; on teardown, delete CRs before removing the operator or
    the namespace hangs Terminating.

**Adoption spike findings (validated on local k3d, 2026-07-10 — throwaway dev-mode OpenBao, torn down):**
The operator **adopts pre-existing OpenBao config** — so the imperative seam and the declarative CRs
can describe the *same* objects (seam plants the foothold once; CRs adopt + own it thereafter):
- `AuthEngineMount` over an already-enabled `kubernetes/` auth mount → `LastReconcileCycleSucceded`,
  **no "path already in use" error**, accessor unchanged (true adopt, not recreate).
- `SecretEngineMount` over an already-enabled kv engine → adopted, no error.
- `Policy` + `KubernetesAuthEngineRole` are idempotent writes → cleanly overwrite/adopt existing
  objects, **including the operator's own login role** — no self-lockout when CR content matches.
- Mount path = `{spec.path}/{name}` (name defaults to `metadata.name`). Empty `path:""` + `name: X`
  → single-segment `X/`. So to manage `kubernetes/`, use `path: "", metadata.name: kubernetes`.
- Self-lockout is possible only if a foothold CR is *wrong* or *deleted*; recoverable by re-running
  the one-off seam (which we keep anyway).

**Design: dual imperative + declarative (the seam is a one-off foothold; manifests are the source of truth).**

Minimal imperative seam — stays in `init-openbao.sh`, run once (also the recovery path):
1. `bao operator init` → store unseal keys + root token in 1Password (`enigma-prod`) — irreducible.
2. `bao operator unseal` — irreducible (recurs on restart).
3. Plant the operator's login foothold (identical to the CRs below, so the operator adopts it):
   `bao auth enable kubernetes` + `auth/kubernetes/config` (`kubernetes_host`) + scoped
   `vault-config-operator` policy (`sys/mounts*`, `sys/policies/acl*`, `auth/kubernetes/*`) +
   `auth/kubernetes/role/vault-config-operator` bound to the operator SA.

Declarative (Kubernetes manifests, reconciled — the source of truth the operator converges OpenBao to):
- `apps/platform/vault-config-operator/` umbrella chart (vendir the chart; `enableCertManager: true`;
  `VAULT_ADDR=http://openbao.secret.svc:8200`); add to Tiltfile + `platform:lint`.
- `apps/secret/config/` CRs — **mirror the seam** (adopted on first reconcile) **plus** the app config:
  - `AuthEngineMount` `kubernetes` + `KubernetesAuthEngineConfig` (mirror the foothold auth method/config)
  - `Policy` + `KubernetesAuthEngineRole` `vault-config-operator` (mirror the operator's own policy/role)
  - `SecretEngineMount` → kv v2 at `kv/`
  - `Policy` `external-secrets` (read `kv/data/*`, `kv/metadata/*`)
  - `KubernetesAuthEngineRole` `external-secrets` (bind the ESO SA `external-secrets/external-secrets`)
- Existing ESO `ClusterSecretStore` + `ExternalSecrets` converge once the above exist + OpenBao unsealed.
- **Acceptance:** after the one-off `secret:init` seam, the operator adopts the foothold and reconciles
  kv+policies+roles from the CRs; `ClusterSecretStore` goes Ready; ESO syncs. Editing a CR updates
  OpenBao; the script is never needed again (except OpenBao re-init / lockout recovery).
- **Open choice:** operator's admin policy scope (scoped paths vs broad); operator lives in
  `apps/platform`, its config CRs in `apps/secret/config`.

### [ ] T6 — Gating spike: `bao login -method=oidc` end-to-end over the tailnet
Exercise the full OIDC login path with **both** OpenBao and Authentik reachable *only* via Tailscale
Services, verifying every SPEC "must-get-right" item. If it fails, exercise and document the
short-lived/periodic-token fallback and flag the GO/NO-GO decision for Checkpoint 1.
- **Acceptance:** `bao login -method=oidc` opens the browser → Authentik on the tailnet → returns a
  scoped `VAULT_TOKEN`; the token can read `kv/hetzner`. `verbose_oidc_logging` shows no
  issuer/audience mismatch.
- **Verify:** `VAULT_TOKEN=$(bao login -method=oidc -token-only) && bao kv get kv/hetzner` succeeds
  from a tailnet host; the `localhost:8250` redirect completes.

> **🚩 Checkpoint 1** — Review Phase 0. SPEC success criteria #1–#2 met; no secret on local disk;
> OIDC works (or fallback documented); sigv4-proxy answers (S1). **GO/NO-GO on OIDC** before Phase 1.

---

## Phase 1 — Gateway provisioning

### [ ] T7 — `libs/gateway-image` Kairos amd64 image build
Create `libs/gateway-image/` mirroring `libs/talos-image` structure: `kairos/` cloud-config (enable
k3s, mount the attached Volume at `/var/lib/data` + repoint k3s `local-path`, create users),
`scripts/build.sh` (kairos-init → AuroraBoot, amd64), `moon.yml` `build` task. Pin kairos-init,
AuroraBoot, and base-image digests. `@meta(dependencies)` for renovate.
- **Acceptance:** `moon run gateway-image:build` produces a bootable amd64 raw image with pinned
  versions; no `latest` tags.
- **Verify:** `moon run gateway-image:build` exits 0 and emits the `.raw` artifact; `grep -R
  latest libs/gateway-image` finds nothing.

### [ ] T8 — `libs/gateway-image` QEMU boot smoke test (k3s + Volume persistence)
Add `scripts/test-vm.sh` + `moon.yml` `test` task: boot the raw image under QEMU (amd64/TCG),
attach a second disk as the `/var/lib/data` Volume stand-in, confirm k3s comes up Ready and a marker
on `/var/lib/data` survives a reboot while `/run` does not (mirrors the WIP `vm.sh` verify).
- **Acceptance:** `moon run gateway-image:test` boots the image, k3s reaches Ready, and the
  persistence assertions pass.
- **Verify:** test task exits 0; console log shows `k3s ... Ready` and `marker == persisted`,
  `/run/ephemeral == GONE`, boot_id changed.

### [ ] T9 — Bake cold-start manifests into `libs/gateway-image`
Add `bootstrap/` manifests baked as k3s auto-deploy (`/var/lib/rancher/k3s/server/manifests`):
`cert-manager.yaml`, `rancher-fleet.yaml`, `fleet-gitrepos.yaml` (GitRepos pointing at
`apps/platform`, `apps/secret`, `apps/gitops`, `apps/network`, git auth via the OpenBao-stored
deploy key). Pin all chart versions. Extend T8's test to assert they apply on boot.
- **Acceptance:** a freshly built image boots k3s and auto-applies cert-manager + Rancher/Fleet +
  the Fleet GitRepos with no manual `kubectl`.
- **Verify:** `moon run gateway-image:test` shows cert-manager + Rancher + Fleet pods Ready and
  `kubectl get gitrepo -A` listing the four repos.

### [ ] T10 — `apps/gateway` OpenTofu (vault provider + sigv4 backend), plan-only
Create `apps/gateway/`: `providers.tf` (`vault` provider → `secrets.vgijssel.nl`; `hcloud`/
`cloudflare` tokens from `data "vault_kv_secret_v2"`), `backend.tf` (S3 → `terraform-state.vgijssel.nl`
sigv4-proxy, dummy creds, `use_lockfile`), `main.tf` (Hetzner VM `cx42`/`nbg1` from the T7 image
snapshot, attached Volume, firewall — inform ports + 443 + SSH only), `dns.tf` (Cloudflare records:
tailnet admin + public inform), `variables.tf`/`outputs.tf`/`versions.tf` (pinned), `moon.yml`
(`init`/`plan`/`apply`/`destroy`/`output`, **no** `secrets` task). Depends on T6 (VAULT_TOKEN) and
S1 (backend). Add image snapshot upload to Hetzner (as a `gateway-image:release` task or a
`gateway` step) so the snapshot id is available.
- **Acceptance:** `moon run gateway:plan` produces a valid plan, reading Hetzner + Cloudflare tokens
  via the `vault` provider and reaching S3 via the proxy, with **no `secrets/.env` and no secret on
  local disk**.
- **Verify:** after `bao login -method=oidc`, `moon run gateway:init && moon run gateway:plan`
  succeed; `git status` + disk scan show no secret files; the plan shows the VM/Volume/firewall/DNS
  resources.

### [ ] T11 — `gateway:apply`: provision the VM and cold-start the cluster
Run `gateway:apply` to create the real Hetzner VM, Volume, firewall, and Cloudflare DNS. The Kairos
VM boots k3s; baked manifests apply cert-manager + Rancher/Fleet; Fleet takes over Rancher. Confirm
exact SKU/region/Volume size at apply (Checkpoint 2 ask-first).
- **Acceptance:** VM provisioned with zero local secrets; state in S3 via the proxy; VM boots k3s;
  cert-manager + Rancher/Fleet up with no manual `kubectl`; Fleet self-manages Rancher.
- **Verify:** `moon run gateway:output` shows IPs; `ssh`/`kubectl` to the VM shows k3s Ready and the
  baked pods Ready; `kubectl get bundle -A` shows Rancher's own bundle managed by Fleet.

> **🚩 Checkpoint 2** — Review Phase 1. SPEC success criteria #3–#4 met. Confirm final SKU/region/
> Volume size. Verify state landed in S3 via the proxy with dummy creds and no local secret file.

---

## Phase 2 — GitOps reconciliation, migration, decommission

### [ ] T12 — `apps/gitops` (Rancher + Fleet, self-managed)
Create `apps/gitops/` holding the Fleet-managed Rancher + Fleet definitions (gateway only). The
baked manifests (T9) are cold-start seed; this app is the steady-state, self-managed source. Add a
`lint` task.
- **Acceptance:** `moon run gitops:lint` passes; Fleet reconciles `apps/gitops` and manages Rancher
  itself; all GitRepos show Active.
- **Verify:** `kubectl get gitrepo -A` all Active; `kubectl get bundle -A` for gitops Ready; Rancher
  UI reachable on the tailnet.

### [ ] T13 — Fleet reconciles `apps/platform` + `apps/secret` on the gateway
No new manifests — `apps/platform` was built in full at T2. Wire the gateway target's per-target
values and confirm Fleet reconciles both `apps/platform` and `apps/secret` on the gateway.
- **Acceptance:** Fleet bundles for `apps/platform` and `apps/secret` are Ready on the gateway;
  Netdata node claimed into Netdata Cloud from the gateway.
- **Verify:** `kubectl get bundle -A` Ready; Netdata node visible in Netdata Cloud.

### [ ] T14 — Migrate OpenBao to the gateway (raft restore, unchanged endpoint)
Fleet deploys `apps/secret` on the gateway; take a raft snapshot from the local OpenBao, restore it
on the gateway, unseal with the **same 1Password keys**, and re-advertise `svc:secrets` (+
`svc:terraform-state`) from the gateway. Endpoints must be unchanged so consumers follow
automatically. Authentik stays on the macbook.
- **Acceptance:** gateway OpenBao is unsealed with restored data; `secrets.vgijssel.nl` resolves to
  the same Tailscale IP; `gateway:plan` still works with no config change; consumers unaffected.
- **Verify:** `bao kv get kv/hetzner` against `secrets.vgijssel.nl` returns the seeded value from
  the gateway node; `tailscale status` shows the Service IP unchanged; a fresh `gateway:plan`
  succeeds.

### [ ] T15 — `apps/network` (Omada + UniFi via Fleet)
Create `apps/network/` (manifest-based, superseding the untracked Flatcar/Kairos WIP): `omada/`
(`mbentley/docker-omada-controller`), `unifi/` (`lemker/unifi-os-server`), `fleet.yaml`. Volume-
backed PVCs for Omada + UniFi state; Tailscale Services for `omada.vgijssel.nl`/`unifi.vgijssel.nl`
(tailnet-only admin UIs); Traefik + firewall for `omada-public`/`unifi-public` inform endpoints
(open only inform ports); cert-manager certs on all four hostnames. Add a `lint` task.
- **Acceptance:** `moon run network:lint` passes; Fleet bundle Ready; admin UIs load over the
  tailnet and fail from public; `*-public` inform endpoints reachable publicly; all four hostnames
  serve valid cert-manager certs.
- **Verify:** `kubectl get bundle -A` Ready; `curl` each hostname → correct cert + reachability
  (tailnet-only fails from public, inform succeeds); pods Ready with PVCs bound to the Volume.

### [ ] T16 — Migrate Omada/UniFi device data + confirm reconnection
Export from the legacy controllers and import via each product's **native backup**; point devices at
the new public inform URLs; confirm adoption/reconnection.
- **Acceptance:** both controllers show the migrated site config; a field device adopts via the new
  public inform URL; a VM recreate preserves Volume-backed data.
- **Verify:** devices show Online in both controller UIs; after a `gateway:apply` VM recreate, PVC
  data (and device state) persists.

### [ ] T17 — Decommission legacy + remove bootstrap OpenBao/proxy
Only after T14/T16 are verified: `moon run …:destroy` the legacy `apps/gateway-prod` and
`apps/network-controllers-prod`, remove their source (and the untracked `apps/network/image` WIP);
remove the bootstrap OpenBao/proxy workloads from the macbook k3d (keep Authentik / `apps/auth`
running).
- **Acceptance:** legacy apps destroyed and source removed; the macbook still serves Authentik; the
  bootstrap OpenBao/proxy are gone; no dangling DNS/firewall/Volume from legacy.
- **Verify:** `moon query projects` no longer lists the legacy apps; `git status` shows the source
  removed; `bao status` against `secrets.vgijssel.nl` still works (now served by the gateway);
  Authentik still reachable on the tailnet.

> **🚩 Checkpoint 3** — Review Phase 2. SPEC success criteria #5–#8 met. Confirm all data migrated
> **and verified** before the destroys were run. Authentik still serving on the macbook.

---

## Cross-cutting (every task)

- `trunk fmt && trunk check` and `moon check --all` (or `moon run <app>:lint`) before commit.
- Pin every chart/image/provider version; no `latest`, no `npx`/`uvx`.
- Never commit secrets/unseal keys/kubeconfigs; never write a secret to local disk.
- Keep all new code in `apps/` or `libs/`; use `<kind>-<name>.yaml` for K8s manifests.
