# Spec: Kubernetes-native homelab — OpenBao-brokered secrets → Hetzner gateway cluster

## Objective

Make the homelab Kubernetes-native and GitOps-driven, and replace the legacy
`apps/network-controllers-prod` and `apps/gateway-prod` with a single Hetzner **gateway
cluster** running k3s on an immutable Kairos image.

Two principles drive the design:

1. **OpenBao is the single source of truth for secrets.** Everything moves into OpenBao
   **except the OpenBao init/unseal keys**, which live in 1Password (motivation: easy future key
   rotation). No secret is ever copied to the local machine. external-secrets syncs OpenBao →
   Kubernetes Secrets for in-cluster consumers; OpenTofu reads OpenBao directly via the `vault`
   provider; the S3 state backend is brokered by a SigV4 proxy so S3 creds never go local.
   Operators/`tofu` authenticate to OpenBao via **OIDC (Authentik)**, or short-lived tokens as a
   fallback.
2. **Keep it simple** — Terraform runs via Moon tasks (operator-run), **not** in-cluster. (No
   Burrito.)

A chicken-and-egg remains: you need OpenBao online to deploy the Hetzner VM, and a Hetzner VM to
host OpenBao. It is resolved with a **local cluster on the macbook** (k3d) that runs OpenBao +
the SigV4 proxy + Authentik long enough to provision the gateway, after which OpenBao **migrates
into the gateway cluster** while **Authentik stays on the macbook for now** (tailnet-private).
**Tailscale Services** give OpenBao, the proxy, and Authentik stable endpoints so *no consumer
ever changes its address* as workloads move local → gateway → (later) Harvester.

The gateway cluster ultimately hosts:

| Service | App | Access |
|---|---|---|
| OpenBao | `apps/secret` | secret store (behind `svc:secrets`) |
| aws-sigv4-proxy | `apps/secret` (from `libs/aws-sigv4-proxy`) | S3 state broker (behind `svc:terraform-state`) |
| Authentik | `apps/auth` (macbook, for now) | OIDC IdP for OpenBao (behind `svc:auth`); tailnet-only now, public forward-auth gateway later |
| cert-manager, Tailscale operator, external-secrets, Netdata | `apps/platform` | every cluster |
| Rancher + Fleet | `apps/gitops` | gateway only (self-managed via Fleet) |
| Omada Controller (`mbentley/docker-omada-controller`) | `apps/network` | UI on tailnet, inform public |
| UniFi OS Server (`lemker/unifi-os-server`) | `apps/network` | UI on tailnet, inform public |

### Success looks like

- An operator runs the bootstrap scripts: local k3d comes up, Authentik + OpenBao + the SigV4
  proxy are live and tailnet-private, OpenBao inits (keys → 1Password), and
  `moon run gateway:apply` provisions the Hetzner Kairos VM with **no secret ever written to the
  local disk**.
- OpenBao migrates into the gateway cluster and re-advertises `svc:secrets`;
  `secrets.vgijssel.nl` is unchanged; Authentik remains on the macbook.
- Fleet reconciles `apps/platform`, `apps/secret`, `apps/network`, and `apps/gitops` (including
  Rancher itself) on the gateway with no manual `kubectl`.
- Omada/UniFi UIs resolve **only over the tailnet**; inform endpoints are public; all four
  hostnames serve cert-manager certs; migrated devices reconnect.
- Legacy apps destroyed and source removed after verified migration.

## Architecture

### Clusters

```
┌───────────────────────────────────┐     ┌──────────────────────────────────────┐
│  LOCAL CLUSTER (macbook, k3d)     │     │  GATEWAY CLUSTER (Hetzner, Kairos+k3s) │
│  persists (hosts Authentik)       │     │  immutable image, persistent Volume    │
│                                   │     │                                        │
│  apps/auth   Authentik ───────────┼─ svc:auth (tailnet-only) ──┐                │
│  apps/secret OpenBao ─────────────┼─ svc:secrets ──────────────┤ stable         │
│              sigv4-proxy ─────────┼─ svc:terraform-state ──────┤ Tailscale      │
│  apps/platform ESO/Tailscale op   │     │  image bake → cert-manager+Rancher/    │
│                                   │     │  Fleet + Fleet GitRepos (cold start)   │
│  operator: moon run gateway:apply │(3)  │  Fleet reconciles:                     │
│    login OpenBao via OIDC(auth)   │────▶│   apps/platform apps/secret            │
│    creds via vault provider       │births│  apps/gitops   apps/network           │
│    S3 via sigv4-proxy             │ VM  │  Rancher self-managed by Fleet    (4)  │
│  OpenBao+proxy migrate to gateway │(5)  │  OpenBao re-advertises svc:secrets     │
│  Authentik stays (for now)        │     │  (data via raft snapshot)              │
└───────────────────────────────────┘     └──────────────────────────────────────┘
```

### Bootstrap → handoff sequence

**Phase 0 — Local bootstrap (`apps/bootstrap`, macbook k3d):**
1. `scripts/up.sh` creates the local k3d cluster and deploys `apps/auth` (Authentik),
   `apps/secret` (OpenBao + sigv4-proxy), and `apps/platform` subset (external-secrets,
   Tailscale operator).
2. `scripts/init-openbao.sh` runs `bao operator init`, stores **unseal keys + root token in
   1Password**, unseals; then (root token) configures the **OIDC auth method → Authentik**.
3. Operator seeds real secret values into OpenBao (`bao kv put`): Hetzner token, Cloudflare
   token/account, S3 backend creds, Tailscale authkey, Netdata **cloud claim** token, Fleet Git
   deploy key, Omada/UniFi config. (One-time manual import; OpenBao is source of truth after.)
4. Tailscale operator advertises `svc:auth`, `svc:secrets`, `svc:terraform-state`;
   external-secrets feeds the S3 creds to the sigv4-proxy.

**Phase 1 — Provision the gateway (operator-run tofu):**
5. `bao login -method=oidc` (browser → Authentik on tailnet) yields a short-lived `VAULT_TOKEN`.
6. `moon run gateway:apply` runs OpenTofu locally:
   - `vault` provider (→ `secrets.vgijssel.nl`) reads Hetzner + Cloudflare tokens into the
     `hcloud`/`cloudflare` providers at runtime — never on disk.
   - S3 backend points at the sigv4-proxy (`terraform-state.vgijssel.nl`) with dummy creds; the
     proxy re-signs with the real Hetzner S3 creds — S3 creds never local. State lands in S3.
   - Provisions the Hetzner VM (Kairos image), attached Volume, firewall, Cloudflare DNS.
7. The Kairos VM boots k3s; baked auto-deploy manifests apply **cert-manager + Rancher/Fleet +
   Fleet GitRepos** (cold-start seed). Fleet reconciles the gitops apps and takes over Rancher.

**Phase 2 — Migration / handoff:**
8. Move OpenBao to the gateway: Fleet deploys `apps/secret`; restore the local OpenBao **raft
   snapshot**, unseal with the **same 1Password keys**, re-advertise `svc:secrets` (+
   `svc:terraform-state`) from the gateway. Endpoints unchanged, so consumers follow
   automatically. Authentik (`svc:auth`) stays on the macbook for now.
9. Migrate Omada/UniFi controller data via each product's **native backup export/import**;
   verify devices reconnect via the new public inform URLs.
10. Decommission: `moon run …:destroy` the legacy apps, remove their source. The macbook cluster
    stays up (Authentik); the bootstrap OpenBao/proxy workloads there are removed post-migration.

### Where each app runs

| App | Local (macbook k3d) | Gateway (Hetzner) | Deployed by |
|---|---|---|---|
| `apps/auth` (Authentik) | ✅ (stays, for now) | ❌ (future migration TBD) | bootstrap script |
| `apps/secret` (OpenBao + sigv4-proxy) | ✅ then removed | ✅ (raft-restored) | bootstrap script → Fleet |
| `apps/platform` | subset (ESO, Tailscale op) | ✅ full (+ cert-manager, Netdata) | bootstrap script → Fleet |
| `apps/gitops` (Rancher/Fleet) | ❌ | ✅ (self-managed) | image bake → Fleet |
| `apps/gateway` (Terraform) | run **from** here (moon) | (re-run from any tailnet host) | operator / Moon |
| `apps/network` (Omada/UniFi) | ❌ | ✅ | Fleet |

`apps/secret` and `apps/platform` are **environment-agnostic** (same manifests, per-target
values) since they deploy to both clusters.

> **Feasibility — validated GO-WITH-CAVEATS.** OpenBao + Authentik OIDC works with both
> reachable *only* over the tailnet: every real network hop (CLI→OpenBao, browser→Authentik,
> OpenBao-server→Authentik for token/JWKS/discovery) stays on the tailnet, and the
> `localhost:8250` redirect is browser-loopback (no tailnet hop). Using one address
> `https://auth.vgijssel.nl` for both the browser and the OpenBao server sidesteps the
> split-horizon issuer mismatch that breaks most private-IdP setups. **Proceed on OIDC**; the
> short-lived/periodic-token fallback (defer `apps/auth`) stays documented for an unforeseen
> blocker. Refs: openbao/openbao#1164, headscale#2446.
>
> **Must-get-right (verify during implementation):**
> - Authentik provider: **RSA signing key, NO encryption key** (encrypted JWE id_tokens break
>   OpenBao's claim parsing).
> - OpenBao role `bound_audiences` = the **actual Authentik client ID** (not the guide's literal
>   `"Client ID"` placeholder — a real #1164 footgun).
> - `oidc_discovery_url` trailing slash must **exactly** match Authentik's emitted `iss`
>   (`https://auth.vgijssel.nl/application/o/<app>/`).
> - `allowed_redirect_uris` (role) **and** Authentik provider redirect URIs both include
>   `http://localhost:8250/oidc/callback` (exact match), plus the UI callback
>   `https://secrets.vgijssel.nl/ui/vault/auth/oidc/oidc/callback`.
> - The Tailscale-Service front-end must preserve `Host: auth.vgijssel.nl` +
>   `X-Forwarded-Proto: https`, or Authentik derives the wrong issuer host from the request.
> - Keep OpenBao & Authentik nodes NTP-synced; enable `verbose_oidc_logging` while wiring it up.

## Credentials & State (no secret ever local)

| Need | How | Local footprint |
|---|---|---|
| OpenBao unseal keys + root token | **1Password only** | none |
| OpenBao session for tofu | **OIDC via Authentik** (`bao login -method=oidc`); fallback: short-lived token from 1Password | scoped session token only |
| Hetzner / Cloudflare provider tokens | OpenTofu **`vault` provider** `data` → provider blocks | none on disk (lands in remote state) |
| S3 state backend creds | **aws-sigv4-proxy** re-signs; tofu uses dummy creds | none |
| In-cluster app secrets (Tailscale authkey, Netdata claim, Fleet git key, Omada/UniFi cfg) | **external-secrets** ← OpenBao | none |

Caveat: secrets read by the `vault` provider are persisted in Terraform **state** (S3). Keep
state-backend access tight (inherent to Terraform + any secret provider). The legacy
`.env.tpl` / `op inject` Terraform flow is fully retired.

## Project Structure

```
libs/gateway-image/            → Kairos custom image build + tests (mirrors libs/talos-image)
  kairos/                        cloud-config: k3s enable, Volume mount, users
  bootstrap/                     baked k3s auto-deploy manifests (cold start):
    cert-manager.yaml, rancher-fleet.yaml, fleet-gitrepos.yaml
libs/aws-sigv4-proxy/          → EXISTING; reused to broker S3 state access

apps/bootstrap/                → Local k3d harness (persists; hosts auth)
  scripts/{up,init-openbao,seed-secrets,down}.sh
  k3d.yaml                       (native snapshotter if docker-in-docker, per CLAUDE.md)
  moon.yml

apps/auth/                     → Authentik (server, worker, PostgreSQL, Redis)
  authentik/                     Helm values; Tailscale Service (svc:auth, tailnet-only, no public)
  moon.yml

apps/secret/                   → OpenBao (single-node raft on Volume) + aws-sigv4-proxy deployment
  openbao/                       Helm values, Tailscale Service (svc:secrets), OIDC auth config
  sigv4-proxy/                   Deployment + Tailscale Service (svc:terraform-state), S3 creds via ESO
  moon.yml

apps/platform/                 → cert-manager (+ ClusterIssuer), Tailscale operator,
  cert-manager/ tailscale/ external-secrets/ netdata/     external-secrets (+ClusterSecretStore→OpenBao), Netdata (cloud claim)
  moon.yml

apps/gitops/                   → Rancher + Fleet (gateway only; self-managed via Fleet)
  moon.yml

apps/gateway/                  → OpenTofu: Hetzner VM from Kairos image (operator-run via Moon)
  main.tf dns.tf backend.tf providers.tf versions.tf variables.tf outputs.tf
  moon.yml                       secrets-free: init/plan/apply/destroy (vault provider + proxy)
  (depends on libs/gateway-image for the image snapshot id)

apps/network/                  → Fleet manifests: Omada + UniFi OS Server
  omada/ unifi/ fleet.yaml
  moon.yml
```

### Persistence

- One **attached Hetzner Volume** at `/var/lib/data`; k3s `local-path` repointed there.
  Stateful PVCs: OpenBao (single-node raft), Omada, UniFi OS Server. Survives VM recreate.

### Network exposure

- **Tailnet only** (Tailscale operator / Services): `omada.vgijssel.nl`, `unifi.vgijssel.nl`,
  `secrets.vgijssel.nl`, `terraform-state.vgijssel.nl`, `auth.vgijssel.nl` — admin/infra only, never public today.
- **Authentik is tailnet-only for now**, but is planned to *also* be exposed publicly later to
  gate public routes via a reverse proxy using Authentik forward-auth. OpenBao, the sigv4-proxy,
  and the controller admin UIs stay tailnet-only.
- **Public** (Traefik + firewall): `omada-public.vgijssel.nl`, `unifi-public.vgijssel.nl` —
  inform/adoption endpoints only. Firewall opens only inform ports (Omada 29810–29814, UniFi
  8080/3478) + 443 + SSH. Controllers run cloud/remote-adoption mode.
- **Ingress:** k3s/RKE2 bundled **Traefik**. All four controller hostnames get cert-manager
  certs (Cloudflare DNS-01).

## Commands

```bash
# Image
moon run gateway-image:build            # Build Kairos amd64 image (bakes cold-start manifests)
moon run gateway-image:test             # QEMU boot smoke test (k3s + bootstrap apply)

# Local bootstrap (one-time)
moon run bootstrap:up                    # k3d up + deploy apps/auth + apps/secret + apps/platform subset
moon run bootstrap:init-openbao          # init OpenBao, keys → 1Password, unseal, wire OIDC→Authentik
moon run bootstrap:seed                  # seed secret values into OpenBao
moon run bootstrap:down                  # remove bootstrap OpenBao/proxy after handoff (keeps Authentik)

# Terraform (apps/gateway) — reads OpenBao via vault provider; S3 via sigv4-proxy
bao login -method=oidc                    # browser → Authentik (tailnet); sets VAULT_TOKEN
moon run gateway:init                     # tofu init (backend → sigv4-proxy, dummy creds)
moon run gateway:plan
moon run gateway:apply                    # interactive
moon run gateway:destroy                  # interactive

# Validation / repo-wide
moon run <app>:lint                       # kubeconform / helm template render
moon check --all
trunk fmt && trunk check
```

## Code Style

Match existing infra apps: Terraform snake_case + `postcondition` validation + pinned providers;
Kubernetes `<kind>-<name>.yaml` naming; pin all Helm chart and image versions.

```hcl
# apps/gateway/providers.tf — creds fetched from OpenBao at runtime, none on disk
provider "vault" { address = "https://secrets.vgijssel.nl" }   # VAULT_TOKEN via OIDC

data "vault_kv_secret_v2" "hetzner"    { mount = "kv"; name = "hetzner" }
data "vault_kv_secret_v2" "cloudflare" { mount = "kv"; name = "cloudflare" }

provider "hcloud"     { token     = data.vault_kv_secret_v2.hetzner.data["token"] }
provider "cloudflare" { api_token = data.vault_kv_secret_v2.cloudflare.data["token"] }
```

```hcl
# apps/gateway/backend.tf — backend can't use the vault provider, so it goes via the proxy
terraform {
  backend "s3" {
    key                         = "gateway"
    endpoints                   = { s3 = "https://terraform-state.vgijssel.nl" }  # sigv4-proxy
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_requesting_account_id  = true
    use_path_style              = true
    use_lockfile                = true
    region                      = "us-east-1"
    # access_key/secret_key = dummy; proxy re-signs with real Hetzner S3 creds
  }
}
```

## Testing Strategy

- **Manifest validation** (`<app>:lint`): kubeconform + `helm template` render across `apps/**`
  in CI — catches errors before Fleet applies.
- **Image build test** (`gateway-image:test`): image builds + QEMU boot smoke check confirms k3s
  starts and baked manifests apply (mirrors the existing network `vm-verify` approach).
- **Auth spike (gating):** OpenBao OIDC login succeeds with both OpenBao and Authentik reachable
  *only* via Tailscale Services; if not, fallback path (short-lived tokens) is exercised instead.
- **Bootstrap dry-run:** `bootstrap:up` on k3d succeeds, OpenBao unsealed, sigv4-proxy answers;
  `gateway:plan` produces a valid plan reading creds via the vault provider + proxy with **no**
  local secret file.
- **Post-deploy acceptance (manual/scripted):** all pods Ready; Fleet bundles Active (incl.
  self-managed Rancher); `curl` each hostname → correct cert + reachability (tailnet fails from
  public, inform succeeds); a field device adopts via the public inform URL; `svc:secrets`
  endpoint unchanged after handoff.
- No new unit-test framework; infra tasks stay `runInCI: false` per convention.

## Boundaries

**Always**
- Treat OpenBao as source of truth; only init/unseal keys live in 1Password.
- Never write a secret to local disk — use OIDC/short-lived session tokens, the vault provider,
  and the sigv4-proxy.
- Pin all versions (charts, images, providers). `trunk fmt`/`trunk check` before commit.
- Keep code in `apps/`/`libs/` only. Validate manifests before Fleet applies.
- Confirm data migrated **and verified** before destroying legacy apps.

**Ask first**
- Final VM SKU/region/Volume size; adding any chart/provider/dependency not listed.
- Changing the S3 state backend or Cloudflare zone.
- OpenBao unseal-key handling; whether to proceed on OIDC vs the short-lived-token fallback.
- Migrating Authentik off the macbook to the gateway/Harvester.
- Exposing Authentik publicly (planned future: reverse-proxy forward-auth for public routes).
- Opening any public firewall port beyond inform + ingress + SSH.

**Never**
- Commit secrets, unseal keys, or kubeconfigs; copy any secret to local disk.
- Expose OpenBao, the sigv4-proxy, or the Omada/UniFi **admin UIs** to the public internet.
- Destroy legacy infra or delete legacy source before migration is verified.
- Use unpinned/`latest` images or `npx`/`uvx`.
- Reintroduce Burrito / in-cluster Terraform without explicit approval.

## Success Criteria (testable)

- [ ] `bootstrap:up` yields tailnet-private Authentik + unsealed OpenBao (keys in 1Password) +
      live sigv4-proxy, all advertised as Tailscale Services.
- [ ] `bao login -method=oidc` works end-to-end over the tailnet (or fallback tokens documented).
- [ ] `moon run gateway:apply` provisions the Hetzner VM (8 vCPU/16 GB) with **zero secrets on
      local disk** (no `secrets/.env`; tokens via vault provider; S3 via proxy).
- [ ] The Kairos VM boots k3s with baked cert-manager + Rancher/Fleet, no manual `kubectl`;
      Fleet self-manages Rancher.
- [ ] OpenBao migrates to the gateway (raft restore, same keys) and re-advertises `svc:secrets`;
      `secrets.vgijssel.nl` resolves to the same Tailscale IP; consumers unaffected.
- [ ] Fleet shows all GitRepos Active; `apps/platform`, `apps/secret`, `apps/gitops`,
      `apps/network` bundles Ready.
- [ ] `omada/unifi.vgijssel.nl` load over tailnet, fail from public; `*-public` inform endpoints
      reachable publicly; all four serve cert-manager certs.
- [ ] Migrated devices online in both controllers; VM recreate preserves Volume-backed data.
- [ ] Legacy apps destroyed and source removed; Authentik still serving on the macbook.

## Assumptions

- **VM:** 8 vCPU / 16 GB in `nbg1`. (Requested `cx43`; the current Hetzner type at that size is
  `cx42` — there is no `cx43`. Resource spec is the source of truth; confirm exact SKU at apply.)
- **amd64**; Cloudflare zone `vgijssel.nl`, `hc.` prefix dropped.
- **Rancher self-manages via Fleet** (baked manifests are cold-start seed only).
- **Netdata** uses a **Netdata Cloud claim**, claim token stored in OpenBao.
- **OpenBao** = single-node raft on the Volume (no HA).
- **Ingress** = k3s/RKE2 bundled **Traefik**.
- Existing untracked `apps/network/` (Flatcar WIP) is **superseded** by the new manifest-based
  `apps/network`.
- Fleet Git auth via a deploy key stored in OpenBao.

## Open (to validate during Phase 2, not blocking the spec)

1. **OIDC-on-tailnet feasibility** — ✅ validated **GO-WITH-CAVEATS** (see the callout above).
   Proceeding on OIDC; verify the "must-get-right" config during implementation.
2. **sigv4-proxy re-sign** against Hetzner Object Storage (strip incoming dummy SigV4, re-sign)
   behind `terraform-state.vgijssel.nl` — still to validate.
3. **Authentik long-term home** — macbook (now) vs migrate to gateway/Harvester later.
4. **Tailscale Services + custom-domain TLS** — Tailscale's built-in certs only cover the
   tailnet DNS name, so we **bring our own** cert (cert-manager + Cloudflare DNS-01) for
   `*.vgijssel.nl` and terminate TLS at the Service front-end (preserving the Host header).
