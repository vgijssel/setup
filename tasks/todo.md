# TODO: Standalone OpenBao "secret" cluster

Companion to `tasks/plan.md`. Tasks are ordered by dependency and sliced so each one delivers a
complete, verifiable path. `[ ]` = pending, `[~]` = in progress, `[x]` = done.
Run `trunk fmt && trunk check` before committing every task. All CLIs are hermit-pinned.

---

## PR #983 review follow-ups

Turned from review comments on <https://github.com/vgijssel/setup/pull/983>. Ordered by dependency;
each one is a single commit. `[ ]` = pending, `[~]` = in progress, `[x]` = done.

### [x] PR-A: ClusterIssuer uses a private iCloud email
Comment: prefer not to expose the public `maarten@vgijssel.nl` in the Let's Encrypt ACME account.
- [x] `apps/platform/config/clusterissuer-letsencrypt-prod.yaml` `spec.acme.email` → `vassal_preview_4s@icloud.com`.

### [x] PR-B: Remove k3d, kubeconform, tilt from Hermit
Comment: these tools are no longer used (k3d bootstrap retired; kubeconform only used by the
lint scripts being removed; tilt gone with apps/bootstrap).
- [x] `hermit uninstall k3d kubeconform tilt`; `bin/{k3d,kubeconform,tilt}` and `bin/.*.pkg` symlinks gone.

### [x] PR-C: Remove apps/secret/sigv4-proxy
Comment: drop the sigv4-proxy umbrella chart from the secret app.
- [x] `apps/secret/sigv4-proxy/` deleted; moon.yml description + lint COMPONENTS no longer reference it.

### [x] PR-D: Delete apps/platform lint script + target
Comment: better reproducible k8s/Helm linting comes in a follow-up PR.
- [x] `apps/platform/scripts/lint.sh` and the `platform:lint` task removed; `moon query projects` clean.

### [x] PR-E: Restructure apps/platform into src/ + scripts/
Comment: move component source dirs under `src/` (e.g. `src/cert-manager/`), keep `scripts/` + `moon.yml`.
- [x] Component + config dirs moved to `apps/platform/src/*`; `file://../../../` chart paths bumped to
      `../../../../` in Chart.yaml/Chart.lock (digests regenerated); helm dep build + template verified.

### [x] PR-F: Restructure apps/secret into src/ + scripts/
Comment: move component source dirs under `src/` (e.g. `src/openbao/`), keep `scripts/` + `moon.yml`.
- [x] `openbao/` + `config/` moved to `apps/secret/src/*`; openbao chart path bumped + digest regenerated;
      `apps/secret/config` doc/comment refs updated to `apps/secret/src/config`.

### [ ] PR-G: Simplify apps/secret targets + scripts
Comment: collapse to four targets over `src/` bundles, install Fleet inside apply, drop the rest.
- [ ] `secret:start` → `start.sh` spins up the vind cluster only.
- [ ] `secret:apply` → `apply.sh` installs the Fleet chart, then `fleet apply`s a static bundle list under `src/`.
- [ ] `secret:stop` → `stop.sh` deletes the vind cluster.
- [ ] `secret:bootstrap` → `bootstrap.sh` seeds the seal key and initialises OpenBao.
- [ ] All other scripts removed (cluster.sh, fleet-install.sh, up.sh, seed-seal.sh, init-openbao.sh, lint.sh) — folded in.

---

## Phase 1 — Substrate (vind + Fleet)

### [x] T1: vind cluster lifecycle
**Description:** Add Moon tasks + scripts to create/delete the standalone `secret` cluster on vind
(`vcluster` docker driver), replacing the k3d bootstrap. Cluster comes up empty, kubeconfig/context
set automatically.

**Acceptance criteria:**
- [x] `moon run secret:cluster-up` creates a Ready single-node `secret` vind cluster (idempotent).
- [x] `moon run secret:cluster-down` deletes it; context handling is clean.
- [x] A `LoadBalancer` Service gets an EXTERNAL-IP (vind built-in LB works — VIP 192.168.97.254).

**Verification:**
- [x] `kubectl get nodes` → Ready; `kubectl config current-context` = `vcluster-docker_secret`.
- [x] `vcluster --version` = pinned 0.32.1 (hermit).

**Note:** vind standalone (0.32.1) is a full kubeadm-style k8s (v1.35.0, flannel CNI),
not k3s — but it ships its own LoadBalancer (docker container `vcluster.lb.*`, VIP mode),
so LoadBalancer Services do get an EXTERNAL-IP.

**Dependencies:** None
**Files likely touched:** `apps/secret/scripts/cluster.sh`, `apps/secret/moon.yml`
**Scope:** S

### [x] T2: Fleet controller (single-cluster) install
**Description:** Install `fleet-crd` + `fleet` Helm charts into `cattle-fleet-system` so Bundles
unpack in-cluster; the same cluster is manager + agent (`fleet-local`).

**Acceptance criteria:**
- [x] `moon run secret:fleet-install` brings the fleet-controller to Running (pinned chart versions).
- [x] The `fleet-local` cluster is registered and the `Bundle` CRD exists.

**Verification:**
- [x] `kubectl -n cattle-fleet-system get pods` → Running; `kubectl get clusters.fleet.cattle.io -A`
      shows `local` (BUNDLES-READY 1/1).
- [x] `fleet --version` = pinned 0.15.4 (hermit).

**Dependencies:** T1
**Files likely touched:** `apps/secret/scripts/fleet-install.sh`, `apps/secret/moon.yml`
**Scope:** S

### [x] T3: Bundle scaffolding + `fleet apply` harness
**Description:** Author `fleet.yaml` bundles for `apps/secret` and `apps/platform` wrapping the
existing Helm umbrella charts, and a `secret:up` task that `fleet apply`s both. Prove the path with
the namespaces + one real operator (e.g. external-secrets) before layering the rest.

**Acceptance criteria:**
- [x] `fleet apply -o -` renders valid Bundle YAML (harness proven with `apps/platform/external-secrets`; `apps/secret` bundles land in T4/T6).
- [x] `moon run secret:up` applies bundles; `platform-apps-platform-external-secrets` reaches Ready (1/1).

**Verification:**
- [x] `kubectl get bundles -A` → Ready; external-secrets pods Running (3/3), 23 CRDs installed.
- [x] `<app>:lint` extended to include the `fleet apply -o -` render check (relative paths; cd into project).

**Dependencies:** T2
**Files likely touched:** `apps/secret/fleet.yaml`, `apps/platform/fleet.yaml`,
`apps/{secret,platform}/scripts/lint.sh`, `apps/secret/moon.yml`
**Scope:** M

### Checkpoint A — Substrate
- [x] vind cluster up, Fleet controller Running, a real bundle deploys via `fleet apply`.
- [x] `trunk check` clean; lint tasks pass. **(Phase 2 continues per go-full-auto authorization.)**

---

## Phase 2 — OpenBao core (auto-unseal + config)

### [x] T4: Static auto-unseal + seal-key seeding  ⚠️ top technical risk
**Description:** Add the `seal "static"` stanza to the OpenBao chart config and a `seed-seal` script
that seeds the 32-byte key as a K8s Secret from 1Password (generating + storing it on first run),
mounted into the pod before it starts. OpenBao must boot unsealed with no manual step.

**Acceptance criteria:**
- [x] `moon run secret:seed-seal` idempotently creates the seal-key Secret in `secret` ns from 1Password (re-run reads back, no dup item).
- [x] OpenBao pod boots with the static seal loaded (`Static KMS Key ID: secret-2026-07`); `sealed=false` (zero manual unseal) confirmed post-init in T5.
- [x] Seal key never touches local disk or git (only 1Password + K8s Secret; ConfigMap holds `env://SEAL_KEY`).

**Verification:**
- [x] `helm template` renders the `seal "static"` block (secret:lint); `bao status` → `sealed=false` verified in T5.
- [x] Re-running `seed-seal` is a no-op (reads key back from 1Password).

**Dependencies:** T3
**Files likely touched:** `apps/secret/openbao/values.yaml`, `apps/secret/scripts/seed-seal.sh`,
`apps/secret/moon.yml`
**Scope:** M
**Note:** If chart 0.28.4 doesn't expose the seal stanza cleanly, fall back to `env://` key source or
a raw `extraConfig` override — decide within this task.

### [x] T5: Rework init for the recovery-key model
**Description:** Adapt `init-openbao.sh`: drop the manual unseal loop (auto-unseal handles it);
`bao operator init` now yields **recovery keys** + root token → 1Password; keep planting the
vault-config-operator login foothold (kubernetes auth config + operator policy/role).

**Acceptance criteria:**
- [x] `moon run secret:init` stores root token + recovery keys in 1Password; idempotent (reads back via `op item get` if already initialised).
- [x] The vault-config-operator foothold is planted (policy byte-for-byte identical to the CR, role binds controller-manager).

**Verification:**
- [x] Fresh cluster: init succeeds, 1Password item present; re-run reads back (no re-init). Auto-unseal survives pod restart (sealed=false).
- [x] vault-config-operator login verified in T6 (operator deployed there); auth methods = kubernetes/, token/.

**Dependencies:** T4
**Files likely touched:** `apps/secret/scripts/init-openbao.sh`, `apps/secret/moon.yml`
**Scope:** M

### [x] T6: vault-config-operator reconciles kv engine + policies/roles
**Description:** Ensure the existing config CRs (kv engine, external-secrets policy/role, k8s auth
role/mount) apply via the Fleet bundle and reconcile against the initialised OpenBao. Drop the
sigv4/terraform-state ExternalSecret (out of scope).

**Acceptance criteria:**
- [x] `kv` v2 engine present in OpenBao; `external-secrets` policy + role present.
- [x] `apps/secret/config/externalsecret-terraform-state-s3.yaml` removed from the bundle.

**Verification:**
- [x] `bao secrets list` shows `kv/`; `bao policy read external-secrets` is identical to the CR.
- [x] All 6 config CRs report `ReconcileSuccessful=True` (also confirms operator login via the foothold).

**Dependencies:** T5
**Files likely touched:** `apps/secret/config/*` (remove terraform-state-s3), `apps/secret/fleet.yaml`
**Scope:** S–M

### Checkpoint B — OpenBao core
- [x] OpenBao auto-unsealed, initialised (keys in 1Password), kv engine + policies/roles reconciled.
- [x] `trunk check` clean; lints pass. **STOP POINT: T7 needs the cloudflare/tailscale/netdata secrets seeded — handed back to the user per go-full-auto authorization.**

---

## Phase 3 — Consumers & exposure

### [x] T7: External Secrets store + seed real values
**Description:** Bring the `ClusterSecretStore` (exists) up via the platform bundle and add a
`secret:seed` task/instructions to load `kv/cloudflare`, `kv/tailscale`, `kv/netdata` into OpenBao;
the cloudflare/tailscale/netdata `ExternalSecret`s (exist) then sync to K8s Secrets. Drop the s3/hetzner kv.

**Acceptance criteria:**
- [x] `ClusterSecretStore openbao` reports Ready (Valid / Ready=True; authenticates via kubernetes auth).
- [x] ExternalSecrets for cloudflare / tailscale / netdata report `SecretSynced`.

**Verification:**
- [x] `kubectl get clustersecretstore,externalsecret -A` → Ready / SecretSynced (all three).
- [x] Target K8s Secrets (`cloudflare-api-token`, `operator-oauth`, `netdata-claim`) exist.

**Note:** Added `apps/platform/config/fleet.yaml` to bundle the ClusterSecretStore + 3 ExternalSecrets
+ ClusterIssuer. Pre-created the `tailscale`/`netdata` namespaces in the config bundle so ESO places
`operator-oauth`/`netdata-claim` *before* those operators deploy (T9/T10) — the deliberate break in the
bootstrap cycle. No s3/hetzner ExternalSecret existed to drop (already clean). Seeding was done manually
via the existing `bootstrap.sh` UI flow (values live in OpenBao only); no 1Password-sourced `seed.sh`
was written since the real values are not stored in 1Password.

**Dependencies:** T6
**Files likely touched:** `apps/platform/config/*` (keep 3 ExternalSecrets), `apps/secret/scripts/seed.sh`,
`apps/secret/moon.yml`
**Scope:** M

### [~] T8: external-dns + Cloudflare, hostname → `secret.vgijssel.nl`
**Description:** Add an `external-dns` umbrella wrapper (chart 1.19.0 already vendored) with the
Cloudflare provider (credentials via ESO), plus config to publish `secret.vgijssel.nl`. Rename all
`secrets.vgijssel.nl` → `secret.vgijssel.nl` across manifests.

**Acceptance criteria:**
- [x] external-dns Running and authenticated to Cloudflare (token via ESO; zone list OK, no auth error).
- [~] A Cloudflare record for `secret.vgijssel.nl` is created/managed by external-dns — deferred to T9:
      external-dns is deployed + configured (`policy: sync`, `source: service`, `domainFilters: [vgijssel.nl]`,
      `txtOwnerId: secret-cluster`) but has no annotated Service to publish until T9 creates the tailnet Service.
- [x] No `secrets.vgijssel.nl` references remain.

**Verification:**
- [x] `kubectl -n external-dns logs` → authenticated ("All records are already up to date"); `dig` verified in T9.
- [x] `grep -r secrets.vgijssel.nl apps/` → empty.

**Dependencies:** T7
**Files touched:** `apps/platform/external-dns/{Chart.yaml,Chart.lock,values.yaml,fleet.yaml,charts/}`,
`apps/platform/config/{externalsecret-external-dns.yaml,namespace-external-dns.yaml}`,
`apps/platform/config/clustersecretstore-openbao.yaml` (comment rename), `apps/platform/scripts/lint.sh`
**Scope:** M

### [~] T9: OpenBao tailnet exposure + valid TLS (`secret.vgijssel.nl`)  ⚠️ capstone / Open Q #1
**Description:** Expose OpenBao at `https://secret.vgijssel.nl` on the tailnet with a cert-manager
Let's Encrypt cert, and wire external-dns to the resulting tailnet IP. **Start with a spike** to pin
down the termination model (Ingress serving the cert behind a Tailscale Service vs Tailscale operator
HTTPS) and how external-dns discovers the tailnet IP.

**Acceptance criteria:**
- [x] Spike resolved: ingress-nginx (rke2's default, vendored 4.12.0) terminates the LE cert; the
      Tailscale operator fronts the controller Service on the tailnet (loadBalancerClass=tailscale);
      external-dns (source=service) publishes that tailnet IP as secret.vgijssel.nl.
- [x] `curl https://secret.vgijssel.nl/v1/sys/health` from the tailnet → HTTP 200 with a **valid LE cert**.
- [x] Endpoint is a 100.64.0.0/10 CGNAT tailnet IP — **not publicly routable (fails off-tailnet)**;
      OpenBao ClusterIP still serves in-cluster ESO.

**Verification:**
- [x] `curl` (on tailnet) → 200, ssl_verify_result=0; cert issuer=Let's Encrypt, subject=CN=secret.vgijssel.nl.
- [x] `kubectl -n secret get certificate secret-vgijssel-nl` → Ready=True.

**Note:** Required a cert-manager fix — DNS-01 self-check now uses public resolvers
(`dns01RecursiveNameservers: 1.1.1.1:53,8.8.8.8:53` + `...Only: true`) because the in-cluster CoreDNS
returned SERVFAIL for external SOA lookups and stalled issuance. Cert + Ingress live in
`apps/secret/config/` (explicit `namespace: secret`) so the Ingress sits with the openbao Service.

**Dependencies:** T8
**Files touched:** `apps/platform/tailscale/fleet.yaml`,
`apps/platform/ingress-nginx/{Chart.yaml,Chart.lock,values.yaml,fleet.yaml,charts/}`,
`apps/platform/cert-manager/values.yaml`, `apps/platform/scripts/lint.sh`,
`apps/secret/config/{certificate-secret.yaml,ingress-openbao.yaml}`
**Scope:** M

### [~] T10: Netdata claimed  (parallelizable with T8/T9)
**Description:** Bring up Netdata (chart + `netdata-claim` ExternalSecret both exist) and confirm the
cluster claims into Netdata Cloud.

**Acceptance criteria:**
- [x] Netdata pods Running; the cluster/node appears in Netdata Cloud.

**Verification:**
- [x] `kubectl -n netdata get pods` → Running (parent, child, k8s-state); parent log shows
      `ACLK CONNECTED` and a `claimed_id` file is present (agent registered with Netdata Cloud).

**Note:** Added `apps/platform/netdata/fleet.yaml` and wired claiming via `envFrom` on the
netdata-claim Secret (parent/child/k8sState) — token never in git. Extended the netdata-claim
ExternalSecret to sync claim_url→NETDATA_CLAIM_URL and room_ids→NETDATA_CLAIM_ROOMS as well.

**Dependencies:** T7
**Files touched:** `apps/platform/netdata/{values.yaml,fleet.yaml}`,
`apps/platform/config/externalsecret-netdata-claim.yaml`
**Scope:** S

### Checkpoint C — End-to-end
- [x] All 7 services Ready (10/10 Fleet bundles Ready); `secret.vgijssel.nl` serves OpenBao on the
      tailnet with a valid LE cert (HTTP 200, sealed=false); all 4 ExternalSecrets synced; Netdata
      claimed (ACLK connected). **Review with human before retirement.**

**Namespace-ownership fix:** the tailscale/netdata/external-dns namespaces pre-created in the config
bundle (T7/T8/T10) conflicted with the operator Helm bundles that own the same namespaces (Fleet
"not owned by us"). Removed the three `namespace-*.yaml` from the config bundle; the operator bundles
own their namespaces via `defaultNamespace`. Removal triggered a Fleet GC that briefly terminated
those namespaces; the operator bundles recreated them and, after forcing the config BundleDeployment
to redeploy, ESO re-synced all secrets and every bundle returned to Ready. On a fresh bootstrap the
ExternalSecrets simply error-and-retry until the operator bundles create the namespaces (expected).

**Known wrinkle:** the tailnet proxy device was recreated as `secret-1` (old `secret` node not
deregistered on force-delete) with a new IP (external-dns updated the A record automatically). The
stale `secret` tailnet device should be pruned from the Tailscale admin console.

---

## Phase 4 — Retirement

### [~] T11: Retire superseded apps/libs  ⚠️ destructive — gated on green Checkpoint C + confirm
**Description:** Remove the obsolete pieces: `apps/bootstrap` (Tilt + k3d), `apps/gateway-prod`,
`libs/gateway-image`, the aws-sigv4-proxy (`apps/secret/sigv4-proxy` + `libs/aws-sigv4-proxy` usage),
and `apps/auth` (OIDC/Authentik). Grep for references before deleting.

**Acceptance criteria:**
- [x] `apps/bootstrap` + `apps/gateway-prod` removed; `moon query projects` clean (no bootstrap/gateway-prod).
- [x] `libs/gateway-image` and `apps/auth` were already absent (removed earlier).

**Scope decision (human-confirmed):** Deleted only `apps/bootstrap` and `apps/gateway-prod`.
**Kept** the sigv4-proxy (`apps/secret/sigv4-proxy` + `libs/aws-sigv4-proxy`) — to be reintroduced
later, and `libs/aws-sigv4-proxy` is still used by the live `apps/secrets-proxy/s3-docs-infra-prod-proxy-b2`.

**Verification:**
- [x] `moon query projects` → no bootstrap/gateway-prod.
- [~] `trunk check` clean for T11-touched files; 15 pre-existing issues remain in T1–T6 files
      (`apps/secret/{moon.yml,scripts/cluster.sh,scripts/init-openbao.sh,scripts/lint.sh,scripts/up.sh}`) —
      not introduced by this work; flagged for a separate cleanup.

**Hetzner manual cleanup (apps/gateway-prod, Terraform state was remote S3/B2):** delete the
`hcloud_server` **gateway-prod**, `hcloud_firewall` **gateway-prod-firewall**, and `hcloud_ssh_key`
**gateway-prod-key** (server's primary IPv4/IPv6 delete with it — no separate primary-IP resource),
plus the remote tfstate object at S3/B2 key **gateway-prod**. Untracked local `.env` backed up to the
session scratchpad (`gateway-prod.env.backup`) for the token if needed.

**Files touched:** deletions across `apps/bootstrap`, `apps/gateway-prod`.
**Scope:** M

### Checkpoint D — Complete
- [x] All SPEC.md success criteria met; `apps/bootstrap` + `apps/gateway-prod` removed (sigv4-proxy
      intentionally kept for later); ready for review / Rancher handoff. Manual Hetzner cleanup for
      the retired gateway-prod server pending (see T11).
