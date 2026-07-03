# SPEC: network

Self-hosted **UniFi OS Server** and **Omada Controller** on a single **Kairos**
(immutable, Ubuntu-based) VM in **Hetzner Cloud (Nuremberg / nbg1)**, provisioned
with **OpenTofu**, fronted by native **Caddy** with automatic TLS, joined to
**Tailscale**, and monitored with **Netdata** — all built into one bootable OS
image via the Kairos factory and validated in a **local QEMU VM** before promotion
to Hetzner.

> Status: DRAFT — awaiting confirmation before implementation.
> Location: `apps/network/` (this file is the project root for the new app).
> Replaces `apps/network-controllers-prod/` (greenfield rebuild; the old app keeps
> running until this one is proven, then is decommissioned — see §8).

---

## 1. Objective

Rebuild the network-controllers stack so it no longer depends on **community
Docker images** (`mbentley/omada-controller`, `lemker/unifi-os-server`). Instead,
bake **official vendor artifacts** into a single **immutable Kairos OS image** built
from **Ubuntu 24.04**:

- **Omada Controller** installed from the **official TP-Link `.deb`** (native, no container).
- **UniFi OS Server** installed via **Ubiquiti's official Podman-based installer**
  (there is no UniFi OS Server `.deb`; Docker is unsupported by the vendor — Podman is
  the official self-host path, and replaces the community image).
- **Caddy, Tailscale, Netdata** as **native systemd services** baked into the image.

- **Target user:** the homelab/network operator (single admin). Not multi-tenant.
- **Outcome:** both controllers reachable over HTTPS at stable private URLs over
  Tailscale, devices adoptable via public provisioning ports, configuration durable
  across reboots and OS image upgrades, and host/service monitoring in place — with a
  fast, reproducible **build → local-VM test → promote-to-Hetzner** loop.
- **Migration:** **Fresh start** — controllers stand up empty; devices are re-adopted.
  No data migrated from `network-controllers-prod`.

### Decisions baked into this spec

| Question | Answer |
|---|---|
| Base OS / build | **Kairos** (immutable) built from **`ubuntu:24.04`** via `kairos-init` in a Dockerfile; artifact produced with **AuroraBoot** (raw for Hetzner, ISO for local QEMU). |
| Omada | **Official TP-Link `.deb`**, installed **natively** at image-build time (deps: OpenJDK, JSVC, MongoDB). No container. |
| UniFi | **Official UniFi OS Server** (Podman installer). Podman + `slirp4netns` installed natively; the `uosserver` user is **baked at build time**; the installer runs to populate Podman storage. Docker is not used. |
| Caddy / Tailscale / Netdata | **Native systemd units** baked into the image (Caddy built with the Cloudflare DNS module; Tailscale + Netdata from official apt repos). |
| Architecture (prod) | **arm64 (Ampere)** — Hetzner `cax` (**decision 2026-07-03**, superseding the original amd64/`cx` plan). The uploaded/shipped artifact is `linux/arm64`. Reason: the build-time UOS bake needs rootless Podman, which is **broken under QEMU-emulated amd64 buildx** on the Apple-Silicon build host; building natively on arm64 avoids emulation entirely, and Omada's `.deb` runs natively on arm64 (see below), so there is no amd64-only dependency left. |
| Architecture (local dev) | **Single-arch, arm64.** The image builds `linux/arm64` natively and boots **HVF-accelerated** in `qemu-system-aarch64` on the Apple-Silicon Mac. Because prod is now the same arm64 artifact, this local boot **is** the authoritative gate — no separate emulated architecture. (`vm.sh` retains an amd64/TCG code path for possible future use, but it is not part of the shipped flow.) |
| Omada arch | The TP-Link Omada `.deb` is **`Architecture: all`** (pure Java) — it installs and runs **natively on arm64** with no force-arch hack (confirmed in the local VM: admin UI answers HTTP 200 on `:8043` pre/post reboot). So the arm64 image runs the **real** Omada, not a dev stand-in. |
| Immutability challenge | Kairos wipes `/etc`, `/var`, `/opt`, `/srv` on every boot (tmpfs overlay); only `/usr/local` + `/oem` persist. All service data paths must be declared as **persistent `bind_mounts`** and **must exist in the built image**. Discovering the full write-path set is a first-class task (§6, validated in the local VM). |
| Persistent app data | **Hetzner Volume at `/var/lib/data`** (retained) holds all service data. The volume is **block-mounted once** at `/var/lib/data`; each service's data dir is exposed at its required path via **bind mounts / symlinks** (a volume cannot be block-mounted twice). Decouples data from the OS disk for disaster rebuild; Kairos A/B handles upgrades in place. |
| UniFi data consolidation | UniFi OS Server has **no custom-data-dir flag**. Relocate Podman's **`graphroot`** via `/etc/containers/storage.conf` (baked into the image) to `/var/lib/data/containers` so UOS state lands on the volume with one setting; persist the `uosserver` home too if it holds data (confirm in VM). |
| Config delivery | Kairos **cloud-config (yip)** as Hetzner `user_data`, rendered via `templatefile()` with secrets from 1Password — same secret-injection model as the old app. |
| Auto-upgrade | **Enabled.** Kairos tracks a pinned upgrade source (image tag) and applies A/B upgrades on a schedule for security patches; reboots into the new image with data intact (persistent bind mounts + Volume). A reboot window is configured; rollback via the previous A/B slot. |
| Promotion to Hetzner | Build **arm64** raw image → compress → **`hcloud-upload-image`** (`--architecture arm`, same tool the repo already uses for Flatcar) → snapshot → `hcloud_server image=<snapshot>` on a `cax` server type. |
| Networking / TLS / DNS | **Unchanged, proven design** carried over from `network-controllers-prod`: public device-provisioning ports only; admin UIs/SSH/Netdata on **Tailscale** only; **Caddy** issues Let's Encrypt certs via **Cloudflare DNS-01** for the two private admin names in the `vgijssel.nl` zone. |

---

## 2. Acceptance Criteria

- [ ] `moon run network:build-image` produces a Kairos **arm64** image from a pinned
      `ubuntu:24.04` base with Omada (`.deb`), UniFi OS Server (Podman), and native
      Caddy/Tailscale/Netdata baked in. (The build takes an optional `amd64` arg that still
      works for a native amd64 host, but arm64 is the shipped artifact.)
- [ ] `moon run network:vm-up` boots the arm64 artifact in local QEMU (`qemu-system-aarch64`,
      HVF), applies the cloud-config, and all five services come up — this is the authoritative
      gate (prod runs the same arm64 artifact).
- [ ] **Persistent-path discovery is complete and validated:** a documented list of every
      directory the five services write to is declared as Kairos `bind_mounts`; a
      **reboot inside the local VM** preserves all controller/service state.
- [ ] `moon run apps/network:upload` uploads the raw image via `hcloud-upload-image` and
      records the snapshot id.
- [ ] `moon run apps/network:apply` provisions, from nothing, a Kairos VM in `nbg1` (data
      Volume attached at `/var/lib/data`) with OpenTofu state in **Hetzner Object Storage
      (S3, nbg1)**; no secrets committed.
- [ ] After apply + first boot: **Omada** (native `.deb`) and **UniFi OS Server** (Podman)
      run; **Caddy**, **tailscaled**, and **netdata** run as **native systemd units**.
- [ ] Host joins the **Tailscale** tailnet on boot (auth key from 1Password); **Netdata**
      is **claimed into Netdata Cloud** (claim token + room from 1Password).
- [ ] Cloudflare DNS (via OpenTofu, DNS-only) in `vgijssel.nl`: `unifi.hc`/`omada.hc` →
      Tailscale IP (private); `unifi-public.hc`/`omada-public.hc` → VM public IP.
- [ ] **Caddy** obtains valid **Let's Encrypt** certs for the two private admin names via
      **Cloudflare DNS-01**; admin UIs serve HTTPS **only over Tailscale**.
- [ ] A test Omada device and a test UniFi device can be **adopted** via the public
      provisioning ports.
- [ ] **Reboot test (prod):** `reboot`; both controllers and all services return with data
      intact (this is the critical immutability check — proves the persistent bind-mount set).
- [ ] **Auto-upgrade test:** Kairos auto-upgrade pulls a newer pinned image, applies it A/B,
      reboots in the configured window, and both controllers + services return with data intact.
- [ ] **Rebuild test (documented):** destroy + recreate the *server* keeping the *Volume*
      restores both controllers from `/var/lib/data`.
- [ ] Hetzner Cloud Firewall exposes **only** device-provisioning ports publicly (+ the
      Tailscale UDP port); SSH, admin UIs, and Netdata are Tailscale-only.
- [ ] No community controller images anywhere; all versions pinned (per repo CLAUDE.md).

---

## 3. Tech Stack

- **OS build:** Kairos (`kairos-init`, pinned) on `ubuntu:24.04` (pinned digest); AuroraBoot (pinned) for raw/ISO.
- **Controllers:** Omada Controller (official `.deb`, pinned version); UniFi OS Server (official Podman installer, pinned version).
- **Runtime:** Podman (pinned) for UniFi only; native systemd for everything else.
- **Reverse proxy:** Caddy (pinned) built with the `caddy-dns/cloudflare` module (xcaddy at build time).
- **Mesh / TLS / monitoring:** Tailscale (pinned, official apt repo); Netdata (pinned, official apt repo); Let's Encrypt via Cloudflare DNS-01.
- **Infra:** OpenTofu (`tofu`), `hcloud` + `cloudflare` providers (pinned exact); Hetzner Cloud + Object Storage (S3, nbg1); `hcloud-upload-image` (pinned).
- **Local dev:** Docker/buildx (native arm64 image build) + `qemu-system-aarch64` (HVF boot test).
- **Secrets:** 1Password (`op inject`), vault `enigma-prod`.

---

## 4. Commands

Match the existing `apps/*-prod` Moon + OpenTofu + 1Password workflow, plus image-build/VM tasks.

```bash
# Secrets: render secrets/.env from 1Password
moon run apps/network:secrets

# --- Image build & local validation (no cloud cost) ---
moon run network:build-image   # docker buildx (linux/arm64) Kairos image -> AuroraBoot raw + iso
moon run network:vm-up         # boot iso/raw in qemu-system-aarch64 (HVF), apply cloud-config
moon run apps/network:vm-verify     # assert services up; reboot-in-VM; assert data survived
moon run apps/network:vm-down

# --- Promote to Hetzner ---
moon run apps/network:upload        # hcloud-upload-image -> snapshot id (recorded as TF var)

# --- OpenTofu lifecycle (each sources secrets/.env, uses tofu) ---
moon run apps/network:init          # tofu init -backend-config="bucket=$TF_VAR_s3_bucket"
moon run apps/network:plan
moon run apps/network:apply         # tofu apply -auto-approve
moon run apps/network:output
moon run apps/network:destroy

# --- Validation (host-side, over Tailscale, after apply) ---
ssh kairos@<ts-ip> systemctl status caddy tailscaled netdata omada    # native units
ssh kairos@<ts-ip> podman ps                                          # UniFi OS Server
```

Conventions reused from `apps/gateway-prod` / `apps/network-controllers-prod`:
- `tofu` (OpenTofu), not raw `terraform`; `HCLOUD_TOKEN` from env; empty provider blocks.
- S3 backend with `skip_*`, `use_path_style`, `use_lockfile`; bucket injected at `init`
  via `-backend-config`. `AWS_*` = Hetzner Object Storage keys (nbg1 endpoint).
- Secrets via `op inject --force -i .env.tpl -o secrets/.env`.

---

## 5. Project Structure

```
apps/network/
├── SPEC.md                 # this file
├── .envrc                  # sources root .envrc + dotenv_if_exists secrets/.env
├── moon.yml                # secrets/build-image/vm-*/upload/init/plan/apply/destroy/output
├── secrets/                # rendered secrets (git-ignored, deny-listed in .claude)
│   └── .env                # op inject output; NOT committed
├── .env.tpl                # 1Password template (vault enigma-prod):
│                           #   HCLOUD_TOKEN, AWS_* S3 creds, TF_VAR_s3_bucket
│                           #   CLOUDFLARE_API_TOKEN + TF_VAR_cloudflare_{api_token,account_id}
│                           #   TF_VAR_tailscale_authkey, TF_VAR_netdata_claim_{url,token,rooms}
├── image/                  # Kairos OS image build
│   ├── Dockerfile          # FROM ubuntu:24.04 (+ kairos-init); installs Omada .deb,
│   │                       #   Podman+UOS, caddy(+cloudflare), tailscale, netdata; creates
│   │                       #   uosserver user + all persistent dirs; drops systemd units
│   ├── kairos-config.yaml  # bind_mounts (persistent paths), stages, users
│   ├── build.sh            # buildx (TARGETARCH arm64|amd64) + AuroraBoot, pinned versions
│   └── files/              # native systemd units + configs baked into the image
│       ├── omada.service (or vendor tpeap unit)
│       ├── unifi-os-server.service  # `uosserver`/podman-managed UOS
│       ├── caddy.service + Caddyfile
│       ├── tailscaled.service (from pkg) + tailscale-up oneshot
│       └── netdata.service (from pkg)
├── cloud-config/
│   └── config.yaml         # Kairos cloud-config template (templatefile): users, ssh key,
│                           #   secrets (TS authkey, CF token, netdata claim), first-boot stages
├── versions.tf             # required_version + hcloud + cloudflare providers (pinned exact)
├── providers.tf            # provider "hcloud" {} + provider "cloudflare" {}
├── backend.tf              # S3 backend, nbg1 Hetzner Object Storage
├── variables.tf            # server_type, location, volume_size, base_domain, image snapshot id, pins
├── main.tf                 # firewall, volume, server (Kairos snapshot + cloud-config user_data)
├── dns.tf                  # cloudflare_record: public → public IP, private → tailscale IP
└── outputs.tf              # public IP/IPv6, tailscale name, admin URLs
```

### Build & boot flow

1. **Dockerfile** (from `ubuntu:24.04`, pinned digest) runs `kairos-init` to Kairos-ify,
   then: `apt install` deps + Omada `.deb`; `apt install podman slirp4netns` + run the
   official UOS installer; build Caddy w/ Cloudflare DNS module; `apt install` Tailscale +
   Netdata from official repos; `useradd uosserver`; `mkdir -p` **every** persistent data
   path; drop systemd units into `files/`.
2. **AuroraBoot** turns the container image into a **raw** (Hetzner) and **ISO/raw**
   (QEMU) for the target arch (**arm64**).
3. **Local:** boot the **arm64** artifact in `qemu-system-aarch64` (HVF) with
   `cloud-config/config.yaml`; assert all five services (incl. the real Omada `.deb`, which
   runs natively on arm64) come up, and **reboot-in-VM** proves persistence — the authoritative
   gate, since prod ships the same arm64 artifact. All before any cloud spend.
4. **Promote:** `hcloud-upload-image --architecture arm` uploads the **arm64** raw → snapshot;
   OpenTofu boots a `cax` server from it with the same cloud-config as `user_data`.

### Immutability / persistence model (the core engineering)

Kairos: `/` read-only; `/etc`, `/var`, `/opt`, `/srv` are ephemeral tmpfs overlays (reset
each boot); only `/usr/local` + `/oem` persist. Therefore:

- Every service write-path is declared in `kairos-config.yaml` `bind_mounts:` **and** created
  in the Dockerfile (Kairos cannot create new root paths at runtime).
- Runtime `/etc` mutations do not survive → the `uosserver` user (and any accounts/config the
  UOS installer would create at runtime) are **baked at build time** into the image's `/etc`.
- **Candidate persistent paths** (to confirm during discovery in the local VM):
  - **Omada:** `/opt/tplink/EAPController/data` and `/opt/tplink/EAPController/logs` **only**.
    Per the reference [`mbentley/docker-omada-controller`](https://github.com/mbentley/docker-omada-controller),
    Omada runs its own `mongod` with its dbpath **inside** `data/` (`data/db`), so the embedded
    MongoDB is captured by persisting `data` — the system `/var/lib/mongodb` is **not** used.
    (`work/` is obsolete since Omada 5.0.)
  - **UniFi (UOS):** Podman `graphroot` at `/var/lib/data/containers` + the `uosserver` home (if it holds data).
  - **Caddy:** data dir (LE certs/state). **Tailscale:** `/var/lib/tailscale`.
    **Netdata:** `/var/lib/netdata` + `/var/cache/netdata` (claim/state).
- These paths are bind-mounted onto the **Hetzner Volume at `/var/lib/data`** so data also
  survives a full VM rebuild (Kairos A/B covers in-place upgrades).

### Networking / TLS / DNS (carried over unchanged from network-controllers-prod)

- **Public (Hetzner firewall — device provisioning/adoption only):** Omada TCP/UDP
  `29810–29817`, UDP `27001`, TCP `8088`; UniFi TCP `8080`, UDP `3478`/`10001`/`10003` (as
  required); plus Tailscale UDP `41641` for a direct tunnel path.
- **Private (Tailscale only):** Caddy binds the `tailscale0` IP and terminates TLS for
  `omada.hc.vgijssel.nl` → Omada `:8043` and `unifi.hc.vgijssel.nl` → UOS GUI `:11443`
  (skip-verify upstream). SSH + Netdata `:19999` Tailscale-only.
- **TLS:** Let's Encrypt via **Cloudflare DNS-01** for the two private names (they resolve to
  a Tailscale IP, so HTTP-01 can't validate). Caddy uses the zone-scoped Cloudflare token
  from 1Password. `*-public` names are DNS pointers only (raw device protocols, no cert).
- **Sizing:** `server_type = "cax21"` (arm64 Ampere, 4 vCPU / 8 GB — headroom for both
  controllers), `location = "nbg1"` (has `cax`), Volume `10 GB` (all variables).

---

## 6. Testing Strategy

- **Static:** `tofu validate` + `tofu fmt -check`; `docker build` of the image succeeds;
  `trunk check`.
- **Local VM (primary + authoritative gate, no cloud cost):**
  - **arm64, HVF:** boot the arm64 image in `qemu-system-aarch64`; apply cloud-config; assert
    **all five** services active — including the **real** Omada `.deb` (`Architecture: all`,
    runs natively on arm64) and UOS under rootless Podman. Prod ships this same arm64 artifact,
    so this boot is authoritative. This must pass before upload.
  - **Persistence discovery:** enumerate write paths — Omada `/opt/tplink/EAPController/{data,logs}`
    (DB lives in `data/db`, per the mbentley reference — no separate `/var/lib/mongodb`), Podman
    `graphroot` + `uosserver` home, and Caddy/Tailscale/Netdata state; add each to `bind_mounts`
    and route onto `/var/lib/data`.
  - **Reboot-in-VM test (critical):** create trivial state in each controller, `reboot`,
    assert it survives. Iterate until nothing is lost — this validates the immutability plan.
- **Provision test:** `apply` into nbg1 from clean state; server + Volume + firewall created;
  cloud-config applied; `systemctl` (native units) + `podman ps` (UOS) healthy.
- **Service health:** admin UIs return valid LE TLS over Tailscale; public IP:443 blocked.
- **Adoption test:** adopt one Omada + one UniFi device via the `*-public` names.
- **Persistence tests (prod):** (1) reboot → data intact; (2) Kairos A/B image upgrade → data
  intact; (3) documented server-recreate with Volume retained → state restored.
- **Monitoring test:** node appears in Netdata Cloud; host metrics present.

---

## 7. Code Style

- **Dockerfile / image:** pin the Ubuntu base by **digest**; pin `kairos-init`, AuroraBoot,
  Podman, Caddy, Tailscale, Netdata, and the Omada `.deb` + UniFi OS Server installer to
  **exact versions** (repo CLAUDE.md — no `latest`, no `npx`/`uvx`). One `RUN` concern per
  logical step with comments; all `mkdir -p` for persistent dirs grouped and commented as
  "persistent bind-mount targets".
- **OpenTofu/HCL:** one resource per concern; all tunables in `variables.tf` with descriptions
  + sensible defaults; pin providers exactly (match repo `hcloud` version). No hardcoded
  secrets — from env via 1Password-rendered `.env`.
- **Kairos config / cloud-config:** author readable YAML; secrets injected via `templatefile()`
  `${...}` placeholders (single-line scalars only, never disturbing indentation) — same model
  as the old app's Butane, so nothing rendered is written to disk or git.
- **systemd units:** `<service>.service`; document `After=`/`Requires=` ordering
  (network-online, the volume mount, podman for UOS).
- Run `trunk fmt` / `trunk check` and `tofu fmt` before committing.

---

## 8. Boundaries

**Always**
- Place code under `apps/network/` (repo CLAUDE.md).
- Use **official vendor artifacts** (Omada `.deb`, UniFi OS Server official installer); never
  community controller images.
- Validate every image in the **local QEMU VM** (including a reboot-persistence test) before
  uploading to Hetzner or spending cloud money.
- Store OpenTofu state in Hetzner Object Storage (nbg1); keep all secrets in 1Password.
- Declare every service write-path as a persistent `bind_mount` that also exists in the image.
- Keep persistent data on the attached Volume (`/var/lib/data`).
- Pin all versions (Ubuntu digest, kairos-init/AuroraBoot, Podman, controllers, Caddy,
  Tailscale, Netdata, providers).
- Keep admin UIs, SSH, and Netdata on **Tailscale only**; expose **only** device provisioning
  ports publicly.

**Ask first**
- Bumping `server_type` / Volume size (cost impact).
- Switching the **prod** architecture back to x86 (`cx`) — arm64 (`cax`) is the current
  decision (2026-07-03) — or changing the persistence layer (Volume vs COS_PERSISTENT-only).
- Changing the auto-upgrade **schedule/reboot window** or the pinned upgrade source/tag.
- Any change that would destroy the server (confirm Volume retention first).
- **Decommissioning `apps/network-controllers-prod`** (only after the new app passes all §2
  criteria incl. device adoption).

**Never**
- Use community controller images, `latest`/unpinned versions, or `npx`/`uvx`.
- Commit secrets, tokens, or rendered `.env` files.
- Expose SSH, admin UIs, or Netdata on the public IP.
- Put controller data only on the ephemeral OS overlay (would be lost every reboot).
- Migrate/assume data from the old app or the hardware being sold without explicit ask.
- Read/write/edit anything under `secrets/`.

---

## 9. Success Criteria

Done when: a single Kairos image built from Ubuntu — carrying the **official** Omada `.deb`
and **official** UniFi OS Server (Podman), with **native** Caddy/Tailscale/Netdata — boots in
Hetzner Cloud, serves both admin UIs over HTTPS on Tailscale, adopts a test device of each
brand, and **survives a reboot and an A/B image upgrade with all data intact** — with the full
loop (`build-image` → `vm-up`/`vm-verify` → `upload` → `apply`) runnable via Moon. No community
images remain; all versions pinned. `network-controllers-prod` is then scheduled for
decommission.

---

## 10. Resolved Decisions & Remaining Risks

**Resolved (from review):**
1. **Persistence:** keep the **Hetzner Volume at `/var/lib/data`**; block-mounted once, exposed at
   each service path via bind mounts/symlinks. UniFi consolidated by relocating Podman `graphroot`
   to `/var/lib/data/containers`.
2. **UniFi install timing:** **bake at build time** (`uosserver` user + Podman storage + pre-pulled
   images baked in the Dockerfile) for reproducibility.
3. **MongoDB:** install the `mongod` binary at the **newest version officially supported by the
   pinned Omada release** (verified against that release's notes). Omada launches its own `mongod`
   with dbpath under `/opt/tplink/EAPController/data/db`, so the DB persists with the `data` dir —
   no system MongoDB service or `/var/lib/mongodb`.
4. **Auto-upgrade:** **enabled** — Kairos A/B auto-upgrade on a schedule with a reboot window, for
   security patches.

**Remaining risks to validate in the local VM (not blockers):**
- **Nested Podman at build time:** running the UOS installer (Podman) inside a `docker buildx`
  build may need privileged/nested-container handling. If build-time baking proves impractical, the
  fallback is a first-boot Kairos stage — but with the `uosserver` user still baked at build time so
  it survives the ephemeral `/etc`. Flag early if the installer refuses to run non-interactively.
- **`graphroot` on ext4 volume:** confirm Podman's storage driver (overlay) works on the volume's
  filesystem inside Kairos; adjust `storage.conf` if needed.
- **Omada on arm64:** RESOLVED — the `.deb` is `Architecture: all` (pure Java) and installs/runs
  natively on arm64 (admin UI verified on `:8043`), so the arm64 image runs the real Omada. No
  arch hack, no emulated gate needed.
- **amd64 build under emulation:** RESOLVED by decision — build-time rootless Podman (UOS bake)
  fails under QEMU-emulated amd64 buildx on the Apple-Silicon host; prod moved to arm64 (`cax`)
  so the image builds natively. Revisit only if prod must return to x86 (would then require a
  native amd64 build host).
```
