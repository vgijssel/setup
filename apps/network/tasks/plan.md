# Implementation Plan: network (Kairos rebuild)

> Companion task checklist: [`todo.md`](./todo.md). Source spec: [`../SPEC.md`](../SPEC.md).
> Predecessor (kept running until this passes §2): `apps/network-controllers-prod/`.

## Overview

Rebuild the network-controllers stack on a single **immutable Kairos** VM built from
**Ubuntu 24.04**, dropping all community Docker images in favour of **official vendor
artifacts**: Omada from the TP-Link **`.deb`** (native), UniFi OS Server via Ubiquiti's
official **Podman** installer, and **Caddy / Tailscale / Netdata** as **native systemd
units** — all baked into one bootable OS image. The whole thing is validated in a
**local QEMU VM** (arm64 fast loop + amd64 emulated gate) *before* any Hetzner spend,
then promoted to `nbg1` via `hcloud-upload-image` + OpenTofu, with data on a retained
Hetzner Volume and Kairos A/B auto-upgrades.

The engineering core is the **immutability/persistence model**: Kairos resets
`/etc`, `/var`, `/opt`, `/srv` on every boot, so every service write-path must be both
created in the image *and* declared as a Kairos `bind_mount` routed onto the Volume at
`/var/lib/data`. Discovering and proving that full path set (reboot-in-VM) is treated as
a first-class, per-service obligation rather than one big task at the end.

## Architecture Decisions

- **Walking skeleton first.** Before adding any service we prove the riskiest
  foundational unknown: that a Kairos image built from `ubuntu:24.04` via `kairos-init`
  builds, is turned into a bootable artifact by AuroraBoot, boots in QEMU, applies a
  cloud-config, and lets us SSH in. Everything else is added onto this skeleton one
  vertical slice at a time.
- **Vertical slices, one service at a time.** Each service task carries its *entire*
  path: Dockerfile install steps → `mkdir -p` of its persistent dirs → `bind_mounts`
  entry → systemd unit (or Podman for UOS) → cloud-config wiring → boot in the VM →
  **reboot-in-VM proves its state survives**. No horizontal "install everything, then
  wire everything" layering.
- **Local persistence rig mirrors prod.** QEMU has no Hetzner Volume, so `vm-up`
  attaches a **second virtual disk** formatted ext4 with a stable label and mounts it at
  `/var/lib/data`; the same `bind_mounts` that route onto the prod Volume route onto this
  disk locally. This makes the reboot-in-VM test a faithful check of the prod persistence
  design at zero cloud cost.
- **Dual-arch build, amd64 is the gate.** The fast loop builds/boots **arm64** under HVF
  to iterate on the arch-independent 80% (persistence, cloud-config, systemd wiring,
  Caddy/Tailscale/Netdata). The **amd64 image booted under emulation (TCG)** is the
  authoritative promotion gate — the only faithful test of the real Omada `.deb`. Omada
  on arm64 uses a **dev-only force-arch hack** and is explicitly *not* authoritative.
- **Everything pinned (repo CLAUDE.md).** Ubuntu base by digest; `kairos-init`,
  AuroraBoot, Podman, Caddy (+`caddy-dns/cloudflare` via xcaddy), Tailscale, Netdata,
  the Omada `.deb`, the UOS installer, and both OpenTofu providers pinned to exact
  versions. No `latest`, no `npx`/`uvx`.
- **OpenTofu plumbing mirrors `network-controllers-prod`.** Same S3 backend on Hetzner
  Object Storage (nbg1) with `skip_*`/`use_path_style`/`use_lockfile` and bucket injected
  at `init`; same 1Password secret-injection model (`op inject` → `secrets/.env`, vault
  `enigma-prod`); same Moon task shape (`set -a && source secrets/.env && set +a && tofu …`,
  `apply`/`destroy` interactive, all `runInCI: false`). `hcloud` `1.66.0` (handles the
  `location` field), `cloudflare` `4.52.0`.
- **Cloud-config carries secrets, never disk/git.** Kairos cloud-config (yip) is rendered
  via `templatefile()` with `${…}` single-line scalar placeholders for the Tailscale
  authkey, Cloudflare token, and Netdata claim — same accepted model as the old app's
  Butane (secrets land only in Ignition-equivalent `user_data` + private TF state).
- **Recreate-friendly, data on the Volume.** The `hcloud_server` boots from the Kairos
  snapshot with cloud-config as `user_data`; all data lives on the retained Volume at
  `/var/lib/data`, so a server recreate (or the A/B auto-upgrade) restores state. Volume
  formatted non-destructively (reuse existing filesystem on recreate).
- **Networking/TLS/DNS carried over unchanged** from the proven old design: device
  provisioning ports (+ Tailscale UDP `41641`) public only; admin UIs / SSH / Netdata on
  Tailscale only; Caddy issues LE certs via Cloudflare DNS-01 for the two private names.

## Dependency Graph

```
1Password (enigma-prod) ── moon :secrets ──> secrets/.env
                                                  │  (needed only from Phase 4 / live)
Version pinning research (T0)
        │
        v
T0 Build scaffold ─────> T1 Boot walking skeleton (arm64 HVF + /var/lib/data disk rig)
   (Dockerfile min,           │  proves: build → AuroraBoot → QEMU boot → cloud-config → SSH → reboot marker
    build.sh, kairos-         │
    config.yaml, cloud-       ├─> T2 Tailscale  (native apt; /var/lib/tailscale; authkey via cloud-config)
    config, moon build/vm)    ├─> T3 Netdata    (native apt; /var/lib/{netdata,cache/netdata}; claim)
                              └─> T4 Caddy      (xcaddy+cloudflare baked; native unit; binds tailscale0)
                                       │
                    ===== CHECKPOINT: 3 native services active + survive reboot-in-VM (arm64) =====
                                       │
                                       ├─> T5 Omada  (.deb + JDK/JSVC/MongoDB; /opt/tplink/EAPController/{data,logs})
                                       │              arm64 = dev-only force-arch; amd64 = real
                                       └─> T6 UniFi  (Podman installer baked; graphroot→/var/lib/data/containers;
                                                      uosserver user baked; nested-podman risk → first-boot fallback)
                                       │
              ===== CHECKPOINT: all 5 active; persistent-path set documented & reboot-in-VM proves it (arm64) =====
                                       │
                                       v
                             T7 amd64 emulated gate (qemu-system-x86_64, TCG) — real Omada .deb; reboot persistence
                                       │
                    ===== CHECKPOINT: amd64 authoritative boot green (before ANY upload) =====
                                       │
        ┌──────────────────────────────┼───────────────────────────────┐
        v                              v                                v
T8 Tofu skeleton         T9 main.tf (firewall/volume/server)    T10 dns.tf (public + private[count])
(versions/providers/            │                                       │
 backend/variables/             └──────────────┬────────────────────────┘
 moon init/plan/…)                             v
                                    T11 upload (hcloud-upload-image amd64 → snapshot id)
                                               │
                ===== CHECKPOINT: full static validation + HUMAN REVIEW (gate before $$) =====
                                               │
                                               v
                                    T12 first live apply (nbg1) ──> T13 private DNS + Caddy LE + admin UIs
                                               │                          T14 Netdata Cloud claim
                    ===== CHECKPOINT: full stack live & private =====
                                               │
                    ┌──────────────┬───────────┴───────────┬──────────────┐
                    v              v                        v              v
             T15 auto-upgrade  T16 adoption test    T17 persistence     T18 firewall audit
             (A/B + window)    (1 Omada + 1 UniFi)  (reboot/recreate)   + docs + fmt/lint
```

Implementation is bottom-up; each phase leaves the system in a working, verifiable
state; the highest-risk work (Kairos build+boot, nested Podman for UOS, real Omada on
amd64, persistence survival) is front-loaded so we fail fast and cheap.

---

## Phase 0 — Build & boot walking skeleton (local only, no cloud cost)

### Task 0: Version pinning + build scaffold
**Description:** Research and pin every build input (Ubuntu digest, `kairos-init`,
AuroraBoot, Podman, Caddy + xcaddy, Tailscale, Netdata, Omada `.deb`, UOS installer).
Scaffold `image/` with a **minimal** `Dockerfile` (`FROM ubuntu:24.04@sha256:…` +
`kairos-init`, no services yet), `build.sh` (buildx for a selectable `TARGETARCH`, then
AuroraBoot → raw+ISO), a skeleton `kairos-config.yaml` (users, empty `bind_mounts`), a
skeleton `cloud-config/config.yaml`, and `moon.yml` with `build-image` + `vm-*` task
stubs mirroring the old app's Moon conventions.

**Acceptance criteria:**
- [ ] `moon run apps/network:build-image` produces a Kairos artifact (raw + ISO) from a
      **pinned** `ubuntu:24.04` base for `TARGETARCH=arm64`.
- [ ] Every version is pinned to an exact value (no `latest`); pins recorded in `build.sh`/vars.

**Verification:**
- [ ] `docker buildx build` succeeds; AuroraBoot emits an artifact under `image/` output.
- [ ] Build is reproducible (re-run hits cache / same digest).

**Dependencies:** None.
**Files likely touched:** `image/Dockerfile`, `image/build.sh`, `image/kairos-config.yaml`,
`cloud-config/config.yaml`, `moon.yml`.
**Scope:** L (foundational; new tech for the repo)

### Task 1: Boot the walking skeleton in QEMU + persistence rig
**Description:** Implement `vm-up`/`vm-down` to boot the minimal arm64 artifact in
`qemu-system-aarch64` (HVF), attach a **second virtual disk** (ext4, stable label)
mounted at `/var/lib/data`, and apply `cloud-config/config.yaml` (admin user + SSH key).
Add a first `bind_mount` for a scratch dir onto `/var/lib/data` and prove a marker file
survives `reboot`.

**Acceptance criteria:**
- [ ] `moon run apps/network:vm-up` boots the image, applies cloud-config, and SSH works.
- [ ] `/var/lib/data` is a mounted second disk (mirrors the prod Volume), not the OS overlay.
- [ ] A file written under a declared `bind_mount` survives `reboot` inside the VM.

**Verification:**
- [ ] `ssh …@vm 'mount | grep /var/lib/data'` shows the second disk mounted.
- [ ] Write marker → `reboot` → marker present; a file written to the ephemeral overlay is gone.

**Dependencies:** T0.
**Files likely touched:** `moon.yml`, `image/build.sh` (vm helpers), `image/kairos-config.yaml`,
`cloud-config/config.yaml`.
**Scope:** M (highest foundational risk: does the Kairos loop work at all?)

### Checkpoint: Walking skeleton
- [ ] `build-image` (arm64) → `vm-up` boots → cloud-config applies → SSH in → reboot
      preserves a `/var/lib/data` marker. The build→boot→persist loop is proven before
      any service is added.

---

## Phase 1 — Native services (each a full vertical slice)

> Each task appends to the `Dockerfile` (install + `mkdir -p` persistent dirs),
> `kairos-config.yaml` (`bind_mounts`), `files/` (systemd unit + config), and
> `cloud-config/config.yaml` (secrets/first-boot), then rebuilds and boots the arm64 VM
> and **proves its state survives a reboot-in-VM**.

### Task 2: Tailscale (native, admin access)
**Description:** `apt install` Tailscale from the official repo (pinned); bake
`tailscaled.service` + a `tailscale-up` oneshot that joins the tailnet with the reusable
tagged authkey (from cloud-config) under a stable hostname. Persist `/var/lib/tailscale`.

**Acceptance criteria:**
- [ ] Node joins the tailnet on boot with `tag:network-controllers`; `tailscale0` gets a 100.x IP.
- [ ] `/var/lib/tailscale` is a declared `bind_mount`, created in the image, on `/var/lib/data`.
- [ ] Authkey injected via `templatefile()`/cloud-config, never committed.

**Verification:**
- [ ] `tailscale status` shows the node online; reboot-in-VM → same identity, no re-auth.
**Dependencies:** T1.
**Files likely touched:** `image/Dockerfile`, `image/files/tailscaled.service` (+ up oneshot),
`image/kairos-config.yaml`, `cloud-config/config.yaml`.
**Scope:** M

### Task 3: Netdata (native, claimed)
**Description:** `apt install` Netdata from the official repo (pinned); bake
`netdata.service`; claim into Netdata Cloud using claim URL/token/rooms from cloud-config.
Persist `/var/lib/netdata` + `/var/cache/netdata` (+ config).

**Acceptance criteria:**
- [ ] `netdata.service` active; node claims into Netdata Cloud (claim args via cloud-config).
- [ ] `/var/lib/netdata` + `/var/cache/netdata` are declared `bind_mounts` on `/var/lib/data`.
- [ ] Dashboard `:19999` will be Tailscale-only (firewall-enforced later; not public-bound).

**Verification:**
- [ ] `systemctl is-active netdata`; claim state present under persisted dir; survives reboot-in-VM.
**Dependencies:** T1.
**Files likely touched:** `image/Dockerfile`, `image/files/netdata.service`,
`image/kairos-config.yaml`, `cloud-config/config.yaml`.
**Scope:** S

### Task 4: Caddy (native, xcaddy + Cloudflare DNS module)
**Description:** Build Caddy with `caddy-dns/cloudflare` via **xcaddy at image-build time**
(pinned); bake `caddy.service` + `Caddyfile`. Bind the `tailscale0` IP (wait-for-interface
launcher), reverse-proxy `omada.hc`→`:8043` and `unifi.hc`→`:11443` (skip upstream verify).
Persist Caddy's data dir (LE certs/state). Full DNS-01 issuance is validated **live** (T13);
here we only prove the binary, unit ordering, and Tailscale bind.

**Acceptance criteria:**
- [ ] Baked Caddy binary includes the Cloudflare DNS provider (`caddy list-modules` shows it).
- [ ] Unit binds the Tailscale IP only and orders after `tailscaled`/the volume mount.
- [ ] Caddy data dir is a declared `bind_mount` on `/var/lib/data`; CF token via cloud-config env.

**Verification:**
- [ ] `caddy validate` on the baked Caddyfile; unit active bound to `tailscale0`; survives reboot-in-VM.
**Dependencies:** T2.
**Files likely touched:** `image/Dockerfile`, `image/files/caddy.service`, `image/files/Caddyfile`,
`image/kairos-config.yaml`, `cloud-config/config.yaml`.
**Scope:** M

### Checkpoint: Native services (arm64)
- [ ] Tailscale + Netdata + Caddy active after boot; each service's state survives a
      reboot-in-VM via its `bind_mount` on `/var/lib/data`. `trunk check` clean.

---

## Phase 2 — Controllers (the hard parts)

### Task 5: Omada Controller (official `.deb`, native)
**Description:** In the Dockerfile, `apt install` deps (OpenJDK, JSVC) + a `mongod` binary
pinned to the **newest version officially supported by the pinned Omada release**, then
install the official TP-Link Omada `.deb` (pinned). Omada runs its own `mongod` with
dbpath under `/opt/tplink/EAPController/data/db`, so persisting `data` captures the DB —
persist `/opt/tplink/EAPController/{data,logs}` only. Bake the `omada`/`tpeap` systemd
unit. **arm64:** install via the dev-only force-arch hack (explicitly non-authoritative);
**amd64** (T7) is the real gate.

**Acceptance criteria:**
- [ ] Omada `.deb` (pinned) installed natively; embedded `mongod` uses `data/db` (no `/var/lib/mongodb`).
- [ ] `/opt/tplink/EAPController/{data,logs}` are declared `bind_mounts` on `/var/lib/data`.
- [ ] Omada unit active; admin UI answers on `:8043` (arm64 = dev-only signal).

**Verification:**
- [ ] `systemctl is-active omada`; `curl -k https://localhost:8043` returns the UI; state survives reboot-in-VM.
**Dependencies:** Native-services checkpoint.
**Files likely touched:** `image/Dockerfile`, `image/files/omada.service`,
`image/kairos-config.yaml`.
**Scope:** L (arch caveat + MongoDB/JSVC wiring)

### Task 6: UniFi OS Server (official Podman installer, baked)
**Description:** `apt install podman slirp4netns` (pinned); bake the `uosserver` user;
relocate Podman `graphroot` to `/var/lib/data/containers` via `/etc/containers/storage.conf`;
run the **official UOS installer at build time** to populate Podman storage / pre-pull
images. Bake `unifi-os-server.service` (Podman-managed). Persist the graphroot + the
`uosserver` home (if it holds data — confirm in VM). **Risk:** nested Podman inside
`docker buildx` may need privileged/nested handling; if build-time baking proves
impractical, fall back to a **first-boot Kairos stage** with the `uosserver` user still
baked (so it survives the ephemeral `/etc`). Flag early if the installer refuses to run
non-interactively.

**Acceptance criteria:**
- [ ] UOS installed via the official Podman installer (pinned); Docker not used anywhere.
- [ ] `graphroot` = `/var/lib/data/containers` (storage.conf baked); `uosserver` user baked into image `/etc`.
- [ ] Graphroot (+ uosserver home if needed) declared as `bind_mounts` on `/var/lib/data`.
- [ ] `podman ps` shows UOS running; GUI answers on `:11443`.

**Verification:**
- [ ] `podman ps` + `curl -k https://localhost:11443`; create trivial UOS state → reboot-in-VM → intact.
- [ ] If first-boot fallback is used, it's idempotent and documented.
**Dependencies:** Native-services checkpoint.
**Files likely touched:** `image/Dockerfile`, `image/files/unifi-os-server.service`,
`image/files/storage.conf`, `image/kairos-config.yaml`, `cloud-config/config.yaml`.
**Scope:** L (highest single-task risk)

### Checkpoint: Persistence discovery complete & validated (arm64)
- [ ] **All five** services active on the arm64 image.
- [ ] The **complete list of persistent write-paths** is documented and every entry is a
      Kairos `bind_mount` that exists in the built image and routes onto `/var/lib/data`.
- [ ] A **reboot inside the VM** preserves all controller/service state (Omada excluded
      from "authoritative" only for its arch-specific bits; persistence design is arch-independent).
- [ ] `trunk check` clean.

---

## Phase 3 — amd64 promotion gate (authoritative, still local/no cloud)

### Task 7: amd64 emulated boot gate
**Description:** Build the **amd64** artifact and boot it in `qemu-system-x86_64`
(emulated/TCG). This is the only faithful test of the real Omada `.deb`. Assert all five
services active and re-run the reboot-in-VM persistence test on amd64.

**Acceptance criteria:**
- [ ] `moon run apps/network:build-image` (amd64) + `vm-up` boots under emulation.
- [ ] **All five** services active including the **real** (non-hacked) Omada `.deb`.
- [ ] Reboot-in-VM preserves all state on amd64.

**Verification:**
- [ ] `vm-verify` asserts the five services up + data survived reboot on the amd64 image.
**Dependencies:** Phase-2 checkpoint.
**Files likely touched:** `image/build.sh`, `moon.yml` (arch selection), `vm-verify` script.
**Scope:** M (emulation is slow; correctness-critical)

### Checkpoint: amd64 authoritative gate (before ANY upload)
- [ ] amd64 emulated boot green; all five services incl. real Omada; persistence proven.
      **No `upload` until this passes.**

---

## Phase 4 — OpenTofu infra + promote to Hetzner (LIVE — incurs cost)

### Task 8: OpenTofu skeleton + Moon lifecycle
**Description:** `versions.tf` (`hcloud 1.66.0`, `cloudflare 4.52.0`, `required_version >= 1.8.0`
— no `poseidon/ct`, this app has no Butane), `providers.tf` (empty `hcloud`,
`cloudflare { api_token = var.cloudflare_api_token }`), `backend.tf` (S3, `key = "network"`),
`variables.tf` (all tunables + pins + snapshot id), `.env.tpl`, `.envrc`, `.gitignore`,
`secrets/.gitignore`. Extend `moon.yml` with `secrets/init/plan/apply/destroy/output`
mirroring the old app.

**Acceptance criteria:**
- [ ] Providers pinned exactly; backend matches the old app's S3 pattern with `key = "network"`.
- [ ] `variables.tf` covers `server_type="cx23"`, `location="nbg1"`, `volume_size=10`,
      `base_domain`, hostnames, `image_snapshot_id`, `cloudflare_*`, `tailscale_*`,
      `netdata_claim_*`, `s3_bucket`, and all version pins.
- [ ] `.env.tpl` matches SPEC (HCLOUD/AWS/CF/Tailscale/Netdata from vault `enigma-prod`).

**Verification:**
- [ ] `moon run apps/network:secrets` renders `secrets/.env`; `:init` succeeds (backend reachable).
- [ ] `tofu validate` passes; `tofu fmt -check` clean.
**Dependencies:** None (parallel with Phase 0-3); needs `secrets` for `init`.
**Files likely touched:** `versions.tf`, `providers.tf`, `backend.tf`, `variables.tf`,
`.env.tpl`, `.envrc`, `.gitignore`, `secrets/.gitignore`, `moon.yml`.
**Scope:** M

### Task 9: Core resources + outputs
**Description:** `main.tf`: `hcloud_firewall` (device provisioning ports + Tailscale UDP
41641 public only), `hcloud_volume` (10 GB, non-destructive) + attachment mounted at
`/var/lib/data`, `hcloud_server` (Kairos snapshot image, cloud-config as `user_data`).
`outputs.tf`: public IPv4/IPv6, tailscale name, admin URLs.

**Acceptance criteria:**
- [ ] Firewall opens **only**: Omada TCP/UDP 29810–29817, UDP 27001, TCP 8088; UniFi TCP 8080,
      UDP 3478/10001/10003; Tailscale UDP 41641. No public 22/80/443.
- [ ] Volume attaches at `/var/lib/data`, survives server replacement (non-destructive format).
- [ ] Server boots from the amd64 Kairos snapshot with cloud-config `user_data`.

**Verification:**
- [ ] `tofu plan` (real backend, no apply) shows firewall + volume + server; `fmt -check` clean.
**Dependencies:** T7 (snapshot from the gated amd64 build), T8, T11.
**Files likely touched:** `main.tf`, `outputs.tf`, `variables.tf`.
**Scope:** M

### Task 10: DNS records
**Description:** `dns.tf` — `data "cloudflare_zone"` for `vgijssel.nl`; public
`omada-public.hc`/`unifi-public.hc` → server public IPv4; private `omada.hc`/`unifi.hc`
→ `var.tailscale_ip` (count-guarded, empty on first apply). All `proxied = false`.

**Acceptance criteria:**
- [ ] Public records → public IP; private → tailscale IP, skipped while `tailscale_ip=""`.
- [ ] All records DNS-only in `vgijssel.nl`.

**Verification:**
- [ ] `tofu plan` shows the 2 public records (private skipped while empty).
**Dependencies:** T8.
**Files likely touched:** `dns.tf`, `variables.tf`.
**Scope:** S

### Task 11: Upload amd64 image → Hetzner snapshot
**Description:** Add the `upload` Moon task: compress the gated **amd64** raw image and run
`hcloud-upload-image` (pinned; reuse the binary already vendored under the old app's
`.tools/`) to create a snapshot; record its id as the `image_snapshot_id` default.

**Acceptance criteria:**
- [ ] `moon run apps/network:upload` uploads the amd64 raw and prints/records the snapshot id.
- [ ] Snapshot id set as the `var.image_snapshot_id` default.

**Verification:**
- [ ] `hcloud image list --type snapshot` shows the Kairos snapshot; id wired into `variables.tf`.
**Dependencies:** T7 (gated amd64 artifact), T8.
**Files likely touched:** `moon.yml`, `variables.tf`, (procedure notes inline in `build.sh`).
**Scope:** S

### Checkpoint: Full static validation + HUMAN REVIEW (gate before spending money)
- [ ] amd64 gate passed (T7); snapshot uploaded (T11).
- [ ] `tofu validate` + `tofu fmt -check` clean; `tofu plan` green against the real backend.
- [ ] `trunk check` / `trunk fmt` clean; no community images; all versions pinned.
- [ ] **Human reviews the full config and approves the first live apply.**

### Task 12: First live apply
**Description:** `moon run apps/network:apply`. Provisions VM + Volume + firewall + public
DNS in nbg1; node first-boots Kairos, mounts the Volume at `/var/lib/data`, applies
cloud-config, joins the tailnet, and starts all services.

**Acceptance criteria:**
- [ ] Server + Volume (`/var/lib/data`) + firewall created in nbg1; node in the Tailscale admin.
- [ ] Omada (`.deb`) + UOS (Podman) run; Caddy/tailscaled/netdata run as native systemd units.

**Verification:**
- [ ] `ssh kairos@<ts-ip> systemctl status caddy tailscaled netdata omada`; `podman ps` shows UOS.
**Dependencies:** Human-review checkpoint.
**Scope:** M (highest live risk: first Hetzner Kairos boot)

### Task 13: Private DNS + Caddy LE + admin UIs
**Description:** Read the node's 100.x IP, set `TF_VAR_tailscale_ip`, re-apply for private
records. Confirm Caddy obtains valid LE certs via Cloudflare DNS-01 and serves both admin
UIs over HTTPS **only** over Tailscale.

**Acceptance criteria:**
- [ ] `omada.hc`/`unifi.hc` resolve to the tailscale IP; `*-public` to the public IP.
- [ ] Both admin UIs serve valid LE certs over Tailscale; the same URLs are blocked on the public IP.

**Verification:**
- [ ] `dig +short` both planes; `curl -v` over tailnet (valid cert) vs public IP (refused).
**Dependencies:** T12.
**Scope:** S

### Task 14: Verify Netdata Cloud
**Acceptance criteria:**
- [ ] Node appears in Netdata Cloud (ACLK connected); host metrics flowing; dashboard Tailscale-only.

**Verification:** Node visible in Netdata Cloud; `:19999` reachable over tailnet only.
**Dependencies:** T12.
**Scope:** S

### Checkpoint: Full stack live & private
- [ ] All services active (native systemd + Podman UOS); both UIs HTTPS over Tailscale;
      public + private DNS correct; Netdata claimed; firewall = device ports (+ TS UDP) only.

---

## Phase 5 — Acceptance, auto-upgrade & hardening

### Task 15: Kairos A/B auto-upgrade
**Description:** Configure Kairos auto-upgrade to track a **pinned upgrade source** (image
tag) and apply A/B upgrades on a schedule with a reboot window; verify an upgrade pulls a
newer pinned image, applies A/B, reboots in the window, and both controllers + services
return with data intact. **Ask-first:** the schedule/reboot window and pinned upgrade
source/tag need operator sign-off (SPEC §8).

**Acceptance criteria:**
- [ ] Auto-upgrade tracks a pinned tag; schedule + reboot window configured (operator-approved).
- [ ] A test upgrade applies A/B and reboots; data intact afterwards; rollback via previous slot documented.

**Verification:**
- [ ] Trigger/observe an A/B upgrade; post-reboot all services up and state intact; document rollback.
**Dependencies:** Full-stack-live checkpoint.
**Files likely touched:** `image/kairos-config.yaml` / `cloud-config/config.yaml` (upgrade block).
**Scope:** M

### Task 16: Device adoption test
**Description:** Adopt one Omada device and one UniFi device via the `*-public` names/ports.
Likely **BLOCKED on physical hardware** (operator).

**Acceptance criteria:**
- [ ] One Omada + one UniFi device adopt via the public provisioning ports.
**Verification:** Devices show adopted/connected in each controller UI.
**Dependencies:** Full-stack-live checkpoint.
**Scope:** M (manual, hardware-dependent)

### Task 17: Persistence tests (prod)
**Description:** (1) `reboot` → data intact (the critical immutability check); (2) documented
server-recreate keeping the Volume → both controllers restored from `/var/lib/data`.
(The A/B upgrade persistence is covered by T15.)

**Acceptance criteria:**
- [ ] Reboot → both controllers + all services return with data intact.
- [ ] Destroy + recreate the server (Volume retained) → controllers restored; procedure documented.

**Verification:** Post-reboot and post-recreate: login + adopted state intact; confirm Volume
filesystem reused (not reformatted).
**Dependencies:** T16 (or independently once live).
**Scope:** M

### Task 18: Firewall audit + docs + lint
**Acceptance criteria:**
- [ ] Firewall audit confirms only device provisioning ports (+ Tailscale UDP) are public;
      SSH, admin UIs, Netdata are Tailscale-only.
- [ ] No community controller images anywhere; all versions pinned (repo CLAUDE.md).
- [ ] `trunk fmt`/`trunk check` + `tofu fmt` clean; build/VM/upload procedure documented inline
      (no new stray README unless requested).

**Verification:** Port scan/firewall review; `trunk check` + `tofu fmt -check` clean; grep for
unpinned tags / community images returns nothing.
**Dependencies:** T17.
**Scope:** S

### Checkpoint: Complete
- [ ] Every SPEC §2 acceptance criterion met (adoption may remain pending on hardware);
      ready for review. `network-controllers-prod` scheduled for decommission **only** after
      §2 passes incl. adoption (SPEC §8 — ask first).

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Kairos build-from-Ubuntu + AuroraBoot + QEMU boot is new to the repo | High | Walking-skeleton first (T0/T1) proves the whole loop before any service; fail fast, cheap. |
| **Nested Podman at build time** for the UOS installer may need privileged/nested handling or refuse non-interactive | High | T6 flags early; documented fallback = first-boot Kairos stage with `uosserver` user still baked so it survives ephemeral `/etc`. |
| **Missed persistent path → data lost every boot** (the core immutability trap) | High | Every service slice declares + creates its own `bind_mount` and proves reboot-survival; Phase-2 checkpoint gates on a documented complete path set + reboot-in-VM. |
| Omada ships x64-only `.deb`; arm64 install is a dev hack | High (for Omada) | arm64 validates only the arch-independent 80%; **amd64 emulated boot (T7) is the authoritative gate** before any upload. |
| Podman `graphroot` on the ext4 Volume filesystem (overlay driver) | Med | Confirm overlay works on the volume fs in the VM; adjust `storage.conf` if needed (T6). |
| Caddy DNS-01 only verifiable live (private names resolve to tailnet) | Med | Bake + `caddy validate` locally (T4); full LE issuance verified live at T13 with the zone-scoped CF token. |
| Emulated amd64 boot is slow | Low | Accept slower gate; keep arm64 HVF as the fast iteration loop. |
| Live apply cost | Low | Human-review checkpoint before first apply; `cx23` + 10 GB per SPEC; size bumps require ask. |
| Secrets land in cloud-config `user_data` / TF state | Low | State in private Hetzner Object Storage; nothing committed; `secrets/` git-ignored & deny-listed; never read/write under `secrets/`. |
| Auto-upgrade reboots at an inconvenient time | Low | Schedule + reboot window operator-approved (ask-first, SPEC §8); rollback via previous A/B slot. |

## Open Questions

- **Auto-upgrade schedule / reboot window / pinned upgrade tag** (T15) — needs operator
  sign-off (SPEC §8 "ask first").
- **Device adoption (T16)** depends on physical hardware being available to the operator.
- **Prod architecture stays amd64** (SPEC decision); switching prod to Arm (`cax`) is
  ask-first and out of scope here.
- **Decommissioning `network-controllers-prod`** is explicitly out of scope until this app
  passes all §2 criteria including adoption (SPEC §8).

## Verification (end-to-end)

```bash
# --- Local (no cloud cost) ---
moon run apps/network:build-image   # arm64 fast loop (TARGETARCH switch for amd64)
moon run apps/network:vm-up         # boot in QEMU, apply cloud-config
moon run apps/network:vm-verify     # assert services up; reboot-in-VM; assert data survived
moon run apps/network:vm-down
# ... iterate services T2-T6, then amd64 gate T7 ...

# --- Promote (after human review) ---
moon run apps/network:secrets       # render secrets/.env from 1Password
moon run apps/network:upload        # hcloud-upload-image amd64 -> snapshot id
moon run apps/network:init && moon run apps/network:plan
moon run apps/network:apply         # live provision into nbg1
# read node tailscale IP, then:
TF_VAR_tailscale_ip=<100.x> moon run apps/network:apply   # publish private DNS
ssh kairos@<ts-ip> systemctl status caddy tailscaled netdata omada
ssh kairos@<ts-ip> podman ps                              # UniFi OS Server
dig +short omada.hc.vgijssel.nl                           # -> tailnet IP
curl -v https://omada.hc.vgijssel.nl                      # valid LE cert, Tailscale only
ssh kairos@<ts-ip> reboot                                 # both controllers return, data intact
```
