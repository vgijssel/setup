# SPEC: network-controllers-prod

Self-hosted **Omada Controller** and **UniFi OS Server** running as containers on a
single **Flatcar Container Linux** VM in **Hetzner Cloud (Nuremberg / nbg1)**,
provisioned with **OpenTofu**, fronted by a reverse proxy with automatic TLS, and
monitored with **Netdata**.

> Status: DRAFT — awaiting confirmation before implementation.
> Location: `apps/network-controllers-prod/` (rename allowed; follows the repo's
> `<name>-prod` convention). This file is the project root for this app.

---

## 1. Objective

Replace two pieces of physical hardware that are being **sold** — the TP-Link Omada
hardware controller and the Ubiquiti UniFi Cloud Key — with software controllers so
that all existing TP-Link/Omada and Ubiquiti/UniFi network gear keeps working.

- **Target users:** the homelab/network operator (single admin). Not multi-tenant.
- **Outcome:** both controllers reachable over HTTPS at stable URLs, devices adoptable,
  configuration durable across reboots and VM upgrades, and basic host/service
  monitoring in place.
- **Migration:** **Fresh start** — controllers stand up empty and devices are
  re-adopted from scratch. No data is migrated off the hardware being sold.
  (If a last-minute migration is wanted, capture an Omada autobackup and a UniFi
  site export *before* the hardware is wiped — out of scope here.)

### Key research findings (decisions baked into this spec)

| Question | Answer |
|---|---|
| Do I lose everything on **reboot** with Flatcar? | **No.** Ignition runs only on *first boot* (a `first_boot` flag is deleted afterward). Normal reboots preserve `/etc` and `/var`, including Docker volumes under `/var/lib/docker`. Data is only lost on VM destroy or an explicit `flatcar-reset`/reprovision. |
| Do I need a **volume**? | **Recommended, included.** A dedicated Hetzner Cloud Volume mounted at `/var/lib/data` decouples app data from the VM lifecycle, so the node can be rebuilt/upgraded (or re-provisioned via Ignition) without losing controller state. Not strictly required for plain reboots. |
| Architecture constraint | **UniFi OS Server is x86-64 only** → VM must be Intel/AMD (`cx`/`cpx`), **not** Arm (`cax`). Omada image is multi-arch but follows the same VM. |
| Reverse proxy & TLS | **Caddy** issues **Let's Encrypt** certs via **Cloudflare DNS-01** for the **private admin hostnames**. DNS-01 is required (the private names resolve to a Tailscale IP, not publicly reachable). Caddy build/image must include the Cloudflare DNS module. The `*-public` names are raw device-protocol endpoints (not proxied) → no Caddy cert. |
| DNS | Records created **inside the existing `vgijssel.nl` Cloudflare zone** as `*.hc.vgijssel.nl` names (no subdomain delegation — not available on this CF tier). API token is therefore scoped to the **`vgijssel.nl` zone** (Cloudflare tokens scope per-zone, not per-subdomain). Used by both the `cloudflare` OpenTofu provider and Caddy. Records DNS-only (`proxied = false`). |
| Hostnames | Public (device inform, → VM public IP, **DNS pointer only**): `unifi-public.hc.vgijssel.nl`, `omada-public.hc.vgijssel.nl`. Private (admin UI via Caddy/Tailscale, → VM Tailscale IP): `unifi.hc.vgijssel.nl`, `omada.hc.vgijssel.nl`. |
| Exposure model | **Public:** only Omada/UniFi device provisioning/adoption ports (L4 on the firewall — cannot be hostname-routed). **Private (Tailscale):** admin UIs, SSH, Netdata. |
| Monitoring | **Netdata** installed via official kickstart, **claimed into Netdata Cloud** (claim token + room from 1Password). |
| Pinned images | Omada `mbentley/omada-controller:6.2.10.17` · UniFi `lemker/unifi-os-server:1.3.0` (x86-64). |
| UniFi OS Server runtime | Requires a **privileged** container with cgroup access and systemd-in-container. Treated as a known constraint/risk. |

---

## 2. Acceptance Criteria

- [ ] `moon run network-controllers-prod:apply` provisions, from nothing, a Flatcar VM
      in `nbg1` with a data Volume attached and mounted at `/var/lib/data`.
- [ ] OpenTofu state is stored in **Hetzner Object Storage (S3, nbg1 endpoint)** using
      the repo's existing backend pattern; no secrets are committed.
- [ ] After apply + first boot, services run as **systemd units** (declared via
      Ignition): `omada-controller`, `unifi-os-server`, `caddy` (reverse proxy), and
      `tailscale`.
- [ ] **Netdata** is installed via the official kickstart script and the host is
      **claimed into Netdata Cloud** (claim token + room from 1Password); the node
      appears in the Netdata Cloud space.
- [ ] The host joins the **Tailscale** tailnet on boot (auth key from 1Password).
- [ ] Cloudflare DNS records created in the `vgijssel.nl` zone (via OpenTofu, DNS-only):
      `unifi.hc`/`omada.hc` → Tailscale IP (private), `unifi-public.hc`/`omada-public.hc`
      → VM public IP. (No subdomain delegation.)
- [ ] Caddy obtains valid **Let's Encrypt** certs for the two **private** admin
      hostnames via **Cloudflare DNS-01**.
- [ ] `unifi.hc.vgijssel.nl` / `omada.hc.vgijssel.nl` serve the admin UIs over HTTPS
      **only over Tailscale** (not on the public IP).
- [ ] Pinned images run: `mbentley/omada-controller:6.2.10.17` and
      `lemker/unifi-os-server:1.3.0`.
- [ ] A test Omada device and a test UniFi device can be **adopted** via the public
      provisioning ports (devices point at the `*-public` hostnames).
- [ ] **Reboot test:** `systemctl reboot`; both controllers come back with their data
      intact (config, adopted devices, DB).
- [ ] **Rebuild test (documented, not necessarily automated):** destroying and
      recreating the *server* while keeping the *Volume* restores both controllers
      from the data on `/var/lib/data`.
- [ ] Hetzner Cloud Firewall allows **only** the Omada/UniFi device provisioning ports
      publicly; SSH, admin UIs, and Netdata are reachable **only over Tailscale**.

---

## 3. Commands

Match the existing `apps/*-prod` Moon + OpenTofu + 1Password workflow.

```bash
# Secrets: render secrets/.env from 1Password (op inject -i .env.tpl -o secrets/.env)
moon run network-controllers-prod:secrets

# OpenTofu lifecycle (each sources .env, uses tofu)
moon run network-controllers-prod:init      # tofu init -backend-config="bucket=$TF_VAR_s3_bucket"
moon run network-controllers-prod:plan
moon run network-controllers-prod:apply      # tofu apply -auto-approve
moon run network-controllers-prod:output
moon run network-controllers-prod:destroy

# Validation (host-side, run after apply)
ssh core@<ip> systemctl status omada-controller unifi-os-server caddy netdata
ssh core@<ip> docker ps
```

Conventions reused from `apps/gateway-prod`:
- `tofu` (OpenTofu), not raw `terraform`.
- `HCLOUD_TOKEN` from env; provider block stays empty.
- S3 backend with `skip_*` flags, `use_path_style`, `use_lockfile`, bucket injected at
  `init` via `-backend-config="bucket=$TF_VAR_s3_bucket"`. The `AWS_*` credentials are
  **Hetzner Object Storage** access keys (created in the Hetzner console, nbg1) — not
  AWS — with the nbg1 endpoint (`https://nbg1.your-objectstorage.com`).
- Secrets via `op inject --force -i .env.tpl -o .env`.

---

## 4. Project Structure

```
apps/network-controllers-prod/
├── SPEC.md                 # this file
├── .envrc                  # sources root .envrc + dotenv_if_exists secrets/.env
├── moon.yml                # secrets/init/plan/apply/destroy/output tasks
├── secrets/                # rendered secrets (git-ignored, deny-listed in .claude)
│   └── .env                # op inject output; NOT committed
├── .env.tpl                # 1Password template (vault `enigma-prod`):
│                           #   HCLOUD_TOKEN, AWS_* S3 creds, TF_VAR_s3_bucket
│                           #   CLOUDFLARE_API_TOKEN + TF_VAR_cloudflare_{api_token,account_id}
│                           #   TF_VAR_tailscale_authkey (this node's key)
│                           #   TF_VAR_netdata_claim_{url,token,rooms}
├── versions.tf             # required_version + hcloud + cloudflare providers
├── providers.tf            # provider "hcloud" {} + provider "cloudflare" {} (tokens from env)
├── backend.tf              # S3 backend, nbg1 Hetzner Object Storage
├── variables.tf            # server_type, datacenter, volume_size, base_domain, hostnames, etc.
├── main.tf                 # ssh key, firewall, volume, server (Flatcar + Ignition)
├── dns.tf                  # cloudflare_record for public (→ public IP) + private (→ tailscale IP) names
├── outputs.tf              # public IP/IPv6, tailscale name, URLs
├── ignition/
│   ├── butane.yaml         # human-authored Butane → compiled to Ignition
│   └── README.md           # how Butane is compiled (butane CLI / terraform module)
└── files/                  # unit/proxy assets templated into Ignition
    ├── omada-controller.service
    ├── unifi-os-server.service
    ├── tailscale.service          # joins tailnet (auth key from 1Password)
    ├── caddy.service              # reverse proxy; image incl. Cloudflare DNS module
    ├── netdata-install.service    # oneshot: kickstart + claim into Netdata Cloud
    └── Caddyfile                  # DNS-01 (Cloudflare) for the 2 private admin names
```

### Provisioning approach (Flatcar on Hetzner Cloud)

Hetzner does not ship a stock Flatcar image. Use the documented snapshot method:

1. Upload the official Flatcar Hetzner image as a Hetzner **snapshot** (e.g. via
   `hcloud-upload-image`) — done once, recorded as a variable/snapshot id.
2. `hcloud_server` uses `image = <flatcar snapshot id>` and passes the compiled
   **Ignition JSON** as `user_data` (Flatcar reads Ignition from cloud user-data).
3. `lifecycle { ignore_changes = [user_data] }` so re-applies don't recreate the box.

(Alternative fallback to document: boot rescue + `flatcar-install` with the Ignition
config. Snapshot method preferred for reproducibility.)

### Storage layout

- Hetzner Volume (default 10 GB, configurable) mounted at `/var/lib/data`.
- Ignition formats (first boot only) + mounts the volume via a systemd `.mount` unit.
- App data bind-mounted from the volume:
  - Omada: `/var/lib/data/omada/{data,logs}` → `/opt/tplink/EAPController/{data,logs}`
  - UniFi OS Server: `/var/lib/data/unifi` → container data path.

### Networking

Two planes under base domain `hc.vgijssel.nl` (Cloudflare zone `vgijssel.nl`): a
**public plane** limited to device adoption/provisioning, and a **private plane** over
**Tailscale** for everything an admin touches.

**Cloudflare zone:** records live in the **existing `vgijssel.nl` zone** as
`*.hc.vgijssel.nl` names — no subdomain delegation (that needs a higher CF tier). The
Cloudflare API token is therefore **scoped to the `vgijssel.nl` zone** (Zone:Read +
DNS:Edit); CF tokens can't be limited to just the `hc.` prefix. Reused by the
`cloudflare` OpenTofu provider and by Caddy for DNS-01.

**Hostnames & DNS (managed via OpenTofu, all `proxied = false` / DNS-only):**

| Hostname | Plane | DNS target | Serves | Caddy/TLS |
|---|---|---|---|---|
| `omada-public.hc.vgijssel.nl` | Public | VM public IP | Omada device inform (raw ports) | No (not proxied) |
| `unifi-public.hc.vgijssel.nl` | Public | VM public IP | UniFi device inform (raw ports) | No (not proxied) |
| `omada.hc.vgijssel.nl` | Private | VM Tailscale IP | Omada admin UI | Yes — LE cert |
| `unifi.hc.vgijssel.nl` | Private | VM Tailscale IP | UniFi OS Server GUI | Yes — LE cert |

The `*-public` names are **DNS pointers only** — devices are configured to inform to
them, but the traffic hits the firewall-opened device ports directly (Caddy can't
hostname-route non-HTTP protocols). DNS-only records make the Tailscale (100.x) and
public IPs resolve directly so Let's Encrypt DNS-01 can validate the private names.

**Public (Hetzner firewall — device provisioning/adoption only):**
- Omada: TCP/UDP `29810`–`29817`, UDP `27001`, TCP `8088` (device inform).
- UniFi: TCP `8080` (device inform), UDP `3478` (STUN), UDP `10001`/`10003` (discovery), as required.
- Must be public so remote/off-site APs and switches can reach the controllers. These are
  raw device protocols and bypass Caddy; the `*-public` names are what devices point at.
- (Outbound Tailscale uses UDP `41641`; no public inbound needed for the tunnel.)

**Private (Tailscale tunnel — no public exposure):**
- **Caddy** binds to the `tailscale0` interface only, terminating TLS for the admin UIs:
  - `omada.hc.vgijssel.nl` → Omada HTTPS (8043, skip-verify upstream)
  - `unifi.hc.vgijssel.nl` → UniFi OS Server GUI (11443, skip-verify upstream)
- **SSH** reachable only over Tailscale (no public `22`).
- **Netdata** dashboard bound to Tailscale only.

**TLS — Let's Encrypt via Cloudflare DNS-01 for the two private admin names:**
- DNS-01 is required because the private names resolve to a Tailscale IP and are not
  publicly reachable (HTTP-01 / TLS-ALPN-01 can't validate them).
- Caddy must run a build/image that includes the **Cloudflare DNS provider module**.
- The zone-scoped **Cloudflare API token** (`hc.vgijssel.nl`, Zone:Read + DNS:Edit) is
  supplied to Caddy via 1Password — the same token the `cloudflare` OpenTofu provider uses.
- The `*-public` names get **no Caddy cert** (raw device protocols don't use it).

**Components:**
- Tailscale runs as its own systemd-managed container on the host. A pre-existing
  **per-node auth key** is read from 1Password (assumed already created for this node);
  follow the existing `apps/tailscale-prod` pattern where applicable.
- **Netdata** is installed via the official kickstart and **claimed into Netdata Cloud**
  using a claim token + room id from 1Password; its dashboard is bound to Tailscale only.
- All controller containers use host networking (required for device discovery).

### Sizing (per request)

- `server_type = "cx23"` (x86; as used elsewhere in this repo, e.g. `apps/gateway-prod`),
  `datacenter = "nbg1-dc3"`, data Volume `10 GB`.
- Define `server_type` and `volume_size` as variables so they can be bumped without code
  changes if UniFi OS Server + Omada (MongoDB) + Netdata create memory/disk pressure.

---

## 5. Code Style

- **OpenTofu/HCL:** one resource per concern; all tunables in `variables.tf` with
  descriptions and sensible defaults; pin `hcloud` provider to an exact version
  (matching repo, currently `1.57.0`). No hardcoded secrets — token/keys come from env
  via 1Password-rendered `.env`.
- **Pinning (per repo CLAUDE.md):** pin everything to exact versions — Flatcar release
  channel/version, container image tags (`mbentley/omada-controller:6.2.10.17`,
  `lemker/unifi-os-server:1.3.0`, a pinned Caddy-with-Cloudflare-DNS image),
  Netdata install pinned where the kickstart allows. No `latest`. No `npx`/`uvx`.
- **Ignition:** author **Butane** YAML (readable) and compile to Ignition; never
  hand-edit raw Ignition JSON. Keep systemd units in `files/` and reference them.
- **Kubernetes naming rule does not apply** (no k8s here); follow Flatcar/systemd unit
  naming (`<service>.service`, `<mountpoint>.mount`).
- **Platform detection:** N/A at runtime (Linux VM only); host scripts target Flatcar.
- Run `trunk fmt` / `trunk check` (and `tofu fmt`) before committing.

---

## 6. Testing Strategy

- **Static:** `tofu validate` + `tofu fmt -check`; `butane --strict` to compile/validate
  Ignition; `trunk check`.
- **Provision test:** `apply` into nbg1 from a clean state; confirm server + volume +
  firewall created and Ignition applied (check `/var/log` and `systemctl` status).
- **Service health:** all four units active (`omada-controller`, `unifi-os-server`,
  reverse proxy, `netdata`); `docker ps` shows expected containers; UIs return valid TLS.
- **Adoption test:** adopt one Omada device and one UniFi device.
- **Persistence test (critical, maps to user's question):**
  1. Reboot the VM → both controllers return with data intact.
  2. (Documented) Recreate the *server* with the *Volume* retained → state restored.
- **Monitoring test:** Netdata shows host metrics; alert/claim path verified.
- Where the repo expects Goss/tests, add host checks for ports, mounts, and unit state.

---

## 7. Boundaries

**Always**
- Store OpenTofu state in Hetzner Object Storage (nbg1); keep all secrets in 1Password.
- Keep persistent data on the attached Volume (`/var/lib/data`), not the root disk.
- Pin all versions (Flatcar, images, providers).
- Place code under `apps/` per repo CLAUDE.md.
- Keep admin UIs, SSH, and Netdata on **Tailscale only**; expose **only** device
  provisioning ports publicly.

**Ask first**
- Bumping `server_type` / Volume size (cost impact).
- Any change that would require destroying the server (confirm Volume retention first).
- Enabling Flatcar **auto-updates/reboot strategy** (could reboot the node unattended).

**Never**
- Migrate or assume data from the hardware being sold (fresh start) without explicit ask.
- Commit secrets, tokens, or rendered `.env` files.
- Use `latest`/unpinned images or `npx`/`uvx`.
- Expose SSH, admin UIs, or Netdata on the public IP — they live on Tailscale only.
- Put data only on the root disk (would be lost on VM rebuild/reprovision).

---

## Open Questions

_None blocking._ The 1Password references are written into `.env.tpl` (vault
`enigma-prod`) and the items/fields have been created.

_Resolved:_ Caddy proxy · LE via **Cloudflare DNS-01** for the 2 private admin names ·
records in the existing `vgijssel.nl` zone (no delegation), token scoped to that zone ·
public device ports + private admin (Tailscale) · `omada`/`unifi` (private → Tailscale
IP), `omada-public`/`unifi-public` (public → public IP) · Omada `6.2.10.17` ·
UniFi `1.3.0` · Netdata Cloud · 10 GB volume · `cx23` · nbg1 · per-node TS authkey
in 1Password · fresh start.
