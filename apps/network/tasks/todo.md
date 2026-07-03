# TODO: network (Kairos rebuild)

Task list for the [implementation plan](./plan.md). Order is dependency-driven; check
off top-to-bottom. Each task's acceptance criteria + verification live in `plan.md`.
Source spec: [`../SPEC.md`](../SPEC.md).

> **Autonomous build scope (this run):** local, no secrets. T2–T11 implement the
> image-baking + full local (arm64) persistence proof and Tofu static validation, with
> **no 1Password secrets and no cloud spend**. Every secret/external/live step — real
> tailnet join, Netdata Cloud claim, Caddy LE issuance, `hcloud-upload-image`, and the
> live `tofu apply` — is **deferred to an operator-run live phase**. The run stops at the
> pre-T12 HUMAN REVIEW gate. Local verification proves each service is installed+pinned,
> its unit is wired/enabled, and its state dir survives reboot-in-VM on `/var/lib/data`.

## Phase 0 — Build & boot walking skeleton (local only, no cloud cost)
- [x] **T0** Version pinning + build scaffold: pinned Ubuntu digest (`sha256:786a8b55…`), kairos-init `v0.15.0`, AuroraBoot `v0.25.0`; minimal `image/Dockerfile` (ubuntu:24.04 + kairos-init `--version`, no services), `build.sh` (buildx `TARGETARCH` → AuroraBoot **RAW via main cmd `--set disk.efi=true`** + `build-iso`), skeleton `kairos-config.yaml` + `cloud-config/config.yaml`, `moon.yml` `build-image` task, `.gitignore`. **arm64 raw (3.5G) + iso (1.2G) build ✓** (AuroraBoot has no `build-raw` subcmd — corrected; note: shell `noclobber` on `>` redirects)
- [x] **T1** Boot walking skeleton in QEMU: `vm.sh` (`up`/`ssh`/`verify`/`down`) + `moon.yml` `vm-*` tasks; boots arm64 under HVF with UEFI (64MiB-padded edk2 pflash, **regenerated each boot** so device changes can't leave a stale BootOrder → UEFI shell), 40GB overlay on the 3.5GB base (headroom for the first-boot auto-reset), 2nd disk `/var/lib/data`, CIDATA seed via `hdiutil` attached as a real **`/dev/sr0`** CD-ROM (Kairos datasource uses the `cdrom` provider, not nocloud). Fresh install → active → cloud-config applied (SSH key, data mount, fail2ban allowlist). `vm-verify` **PASS**: boot_id changes, `/var/lib/data` marker survives, `/run` control gone. `trunk check` clean.

### ⛳ Checkpoint: Walking skeleton ✅
- [x] build → vm-up (install→active) → cloud-config applies → SSH in → reboot preserves `/var/lib/data` marker. Full build→boot→persist loop proven before any service.

**T0/T1 findings (feed into later phases):**
- AuroraBoot `disk.efi` raw = a **recovery+auto-reset installer** (efi/oem/recovery only), not a pre-installed A/B disk. First boot must have a disk **bigger than the ~3.5GB image** to add COS_STATE(~10GB)+COS_PERSISTENT, then reboots into active. Confirms Hetzner disk must exceed image size (cx23=40GB ✓).
- **cloud-config delivery**: Kairos datasource providers = `[cdrom, gcp, openstack, aws, azure, hetzner, packet, vultr, digitalocean, metaldata, vmware, config-drive]` — **hetzner is native** (Phase 4 user_data will Just Work). Config persists to `/oem/95_userdata`.
- This Kairos/Ubuntu build **persists `/opt` by default** (broader than SPEC §5 assumed → *reduces* Omada persistence risk; still bind-mount onto the Volume for disaster recovery). Phase 2 (T5/T6) must map the exact default-persistent set.
- Image ships **fail2ban with a PERSISTENT ban DB** → relevant to prod public-port hardening (T18); locally we allowlist/unban the slirp gateway.

## Phase 1 — Native services (each a full vertical slice)
- [x] **T2** Tailscale (native apt, **v1.80.3** pinned, matches old app): baked `tailscaled` (enabled) + `tailscale-up.service` oneshot (gated on `/etc/tailscale/authkey.env` → skipped with no secret). State relocated onto the **data Volume** via a `tailscaled` drop-in (`--state`/`--statedir=/var/lib/data/tailscale`), NOT the default `/var/lib/tailscale`. `vm-verify` **PASS** (arm64): tailscaled active pre+post reboot, statedir on volume, `ts-persisted` marker survives reboot-in-VM. Real tailnet join **deferred to live** (no authkey seeded locally). `trunk check` clean.

**T2 finding — persistence architecture (feeds T3-T6):** this Kairos build's default
`PERSISTENT_STATE_PATHS` (`/run/cos/cos-layout.env`, from `/system/oem/00_rootfs.yaml`)
already binds a large `/var/lib/*` set — **incl. `/var/lib/tailscale`, `/var/log`,
`/var/lib/kairos`, `/var/lib/containerd`, etc.** — onto the OS disk (`COS_PERSISTENT`).
That survives **reboot** but is **LOST on a server recreate**. SPEC §10 wants data on the
retained **Volume**, so the pattern is: **prefer a data-dir flag** pointing at
`/var/lib/data/<svc>` (tailscaled `--statedir`, Podman graphroot, Netdata dirs, Caddy
`XDG_DATA_HOME`) to sidestep the default OS-disk bind; **fall back to a bind mount** onto
the Volume only for fixed-path services (Omada `/opt/tplink/EAPController/{data,logs}`).
Mechanism lives in `files/usr/bin/network-mount-data.sh` (+ per-service systemd drop-ins),
invoked from cloud-config's `boot` stage. `os.qcow2` overlay is auto-rebuilt when the base
`.raw` changes (stale-overlay guard in `vm.sh`).
- [x] **T3** Netdata (native apt, **2.10.3** pinned, stable flat repo, signed-by keyring): `netdata.service` enabled. Persistent dirs relocated onto the **Volume** via `/etc/netdata/netdata.conf` `[directories]` (`lib=/var/lib/data/netdata`, `cache=/var/lib/data/netdata-cache`, `registry` under lib) + `chown netdata` in `network-mount-data.sh` (Netdata dirs are NOT in the Kairos default persist set). Netdata Cloud claim wired in prod cloud-config (`/etc/netdata/claim.conf`) — **deferred to live** (no secret locally, runs unclaimed). `vm-verify` **PASS** (arm64): netdata active pre+post reboot, lib on volume, `nd-persisted` marker survives. Dashboard `:19999` left default-bound; Tailscale-only enforced by the firewall (T9/T18). `trunk check` clean.
- [x] **T4** Caddy (**xcaddy** built from source: Caddy **2.11.4** + **caddy-dns/cloudflare v0.2.4**, official multi-arch builder stage): baked `caddy.service` (Type=notify, `CAP_NET_BIND_SERVICE`) + env-driven `Caddyfile` (FQDNs/email/CF token from `/etc/caddy/caddy.env` via cloud-config; `network-caddy-run.sh` waits for `tailscale0` and binds its IP). Data dir on the **Volume** via `XDG_DATA_HOME=/var/lib/data/caddy`. `vm-verify` **PASS** (arm64): cloudflare module present (`caddy list-modules`), baked Caddyfile fully **validates** (provisions the DNS-01 issuer offline w/ a format-valid dummy token), data dir on volume + `cd-persisted` marker survives reboot. Caddy **not active locally** (no `tailscale0` without a join — expected); real tailscale0 bind + LE issuance **deferred to live (T13)**. `trunk check` clean.

### ⛳ Checkpoint: Native services (arm64) ✅
- [x] Tailscale + Netdata + Caddy all baked/pinned; Tailscale+Netdata active, Caddy validated (active-with-bind is live-only); each service's state survives reboot-in-VM on `/var/lib/data`; `trunk check` clean.

## Phase 2 — Controllers (the hard parts)
- [x] **T5** Omada (official TP-Link `.deb` **6.2.10.17**, sha256-pinned; deps **openjdk-17-jre-headless**, **jsvc**, **mongodb-org-server 8.0.26** from the official mongo repo): the `.deb` is `Architecture: all` (pure Java) so **no force-arch needed on arm64** — it installs and runs natively. Embedded mongod uses dbpath `data/db`; `/opt/tplink/EAPController/{data,logs}` bind-mounted onto the **Volume** (data/db pre-created + chowned at boot). Uses the vendor `tpeap` sysv unit (systemd sysv-generator) + ordering drop-in. `vm-verify` **PASS** (arm64): Omada UI answers **HTTP 200 on :8043** pre+post reboot, mongod db on the volume, `om-persisted` marker survives. Real-Omada authority is the amd64 gate (T7). `trunk check` clean.

**T5 findings (feed T6/T7):**
- Postinst runs a **blocking** `tpeap start` (polls up to ~40 min). Preseed `omadac/init-cluster-mode=true` (vendor: "don't start after install") to skip it; the controller still boots at runtime via `tpeap.service`.
- **Kairos presents `/opt` with the `.deb`'s dpkg (root) ownership at runtime**, not the postinst's chown — so `network-mount-data.sh` re-chowns `properties/` + `work/` (recursive) and `data`/`logs`/`data/db` to `omada` every boot, else the controller can't write `omada.properties` and mongod can't open its dbpath.
- mongod does **not** create its dbpath — `data/db` must be pre-created on the (empty) Volume at boot.
- [x] **T6** UniFi OS Server — **installed at build, runs rootless-Podman at runtime, `:11443` answers, survives reboot-in-VM (arm64).** Install is baked at Docker build time (`RUN --security=insecure` runs rootless Podman as `uosserver` via a `security.insecure` BuildKit builder): `/usr` is writable so the CLI symlinks resolve, and the generated `uosserver.service` + vendor config bake into the image `/etc` + `/home` (both survive Kairos' ephemeral reset as image content). The loaded OCI image is re-exported to a plain `oci-archive` tar under `/usr/share/uosserver` (854 MB) and the build-time graphroot is torn down (`podman rm -f -a` + `podman system reset -f` to unmount the live overlay, then `rm`) since AuroraBoot can't pack the 0700 subuid overlay dirs. First boot (`network-uos-load.service`) loads the tar via `podman pull oci-archive:` (`podman load -i` can't auto-detect it) with `TMPDIR` on the Volume. Three fixes unblocked the runtime run:
    - **Home = `/home/uosserver`** (dropped the `--home-dir /var/lib/uosserver` override): the vendor `uosserver-service` ELF **hardcodes `/home/uosserver`** for the podman env it exports (`CONTAINERS_CONF`, `XDG_DATA_HOME=.local/share`, `XDG_CONFIG_HOME=.config`) while reading its own config (`server.conf`/`mounts.json`/`portmap.json`/`bin/`) from the fixed `/var/lib/uosserver`. `network-mount-data.sh` binds `/home/uosserver/.local` (the graphroot) onto the Volume and chowns both trees to uosserver each boot.
    - **`dbus-user-session`** added: the container runs `--systemd=always` + a healthcheck, so rootless podman needs `user@999`'s session bus for the systemd cgroup manager + the healthcheck transient timer; without it podman falls back to cgroupfs and the container exits 255 ("Failed to start transient timer unit"). The load service enables lingering and **waits for `/run/user/999/bus`** before the launcher runs.
    - **Container creation on first boot**: the launcher only `podman start`s an existing container (its `podman run` create path fires only on a `CONTAINER_ARG_HASH` mismatch vs the baked `server.conf`); we ship only the image, so the load service **blanks `CONTAINER_ARG_HASH` when the container is absent** → the launcher creates it (pasta net, `-p 0.0.0.0:11443:443`, named volumes `uosserver_{data,persistent,var_lib_mongodb,var_lib_unifi,…}`) and rewrites the real hash, so later boots take the fast start path against the persisted container on the Volume.
  `vm-verify` **PASS** (arm64): all 5 services active pre+post reboot; UOS GUI answers **HTTP 200 on :11443**, container running, graphroot on the Volume, and the container comes back automatically after reboot from the persisted graphroot. `trunk check` clean. Prod still needs the **amd64** installer URL (T7).

### ⛳ Checkpoint: Persistence discovery complete & validated (arm64) ✅
- [x] **All 5** services active + persistent on arm64 (Tailscale, Netdata, Caddy, Omada, UniFi OS Server) — all survive reboot-in-VM on `/var/lib/data`. `vm-verify` PASS; `trunk check` clean. Authoritative real-Omada + amd64 boot is the T7 gate.

## Phase 3 — Authoritative gate (arm64 = prod, still local/no cloud)
- [x] **T7** ~~amd64 emulated boot gate~~ **→ SUPERSEDED by the arm64 pivot (2026-07-03).**
  Attempting the amd64 gate revealed that build-time **rootless Podman (the UOS bake) is broken
  under QEMU-emulated amd64 buildx** on the Apple-Silicon host: the x64 UOS image loads, but
  `podman run`/`images`/`save` fail to `execvp` under qemu-user, so the build-time image export
  can't run (would also block a prod amd64 image built on this toolchain). **Decision: prod runs
  Hetzner `cax21` (Ampere arm64)** — the image builds natively (no emulation), and Omada's `.deb`
  is `Architecture: all` so it runs the **real** controller on arm64. Therefore the **arm64
  image IS the prod artifact and the T6 checkpoint (all 5 services incl. real Omada active +
  reboot-in-VM persistence) IS the authoritative gate** — no separate emulated arch. Work done:
  x64 UOS installer URL discovered + sha256-pinned and the Dockerfile made arch-aware (`TARGETARCH`
  case); `vm.sh` given a q35/TCG amd64 path — both retained for a possible future native-amd64
  build, but not part of the shipped flow.

### ⛳ Checkpoint: authoritative gate ✅
- [x] arm64 image = prod artifact; T6 already proved all 5 services (incl. real Omada) active +
  reboot-in-VM persistence on arm64. No emulated amd64 gate. `upload` (T11) publishes the arm64 raw.

## Phase 4 — OpenTofu infra + promote to Hetzner (LIVE — incurs cost)
- [x] **T8** Tofu skeleton + Moon lifecycle: `versions.tf` (hcloud 1.66.0, cloudflare 4.52.0; **no** poseidon/ct — Kairos cloud-config, not Ignition), `providers.tf`, `backend.tf` (`key = "network"`), `variables.tf` (`server_type = "cax21"` arm64, `image_snapshot_id` default `""`, cloudflare/tailscale/netdata/s3 tunables), `.env.tpl`, `.envrc`, `.gitignore` (+`.tools/`), `moon.yml` `secrets/init/plan/apply/destroy/output` (secrets task `mkdir -p secrets` — nothing authored under `secrets/`). **Static gate green:** `tofu init -backend=false` + `validate` + `fmt -check`; `.terraform.lock.hcl` committed.
- [x] **T9** Core resources + outputs: `main.tf` (firewall Omada+UniFi device ports + TS UDP 41641 only, no public 22/80/443; volume 10GB non-destructive @ `/var/lib/data`; **`cax`** server from arm64 snapshot + cloud-config `user_data` via `templatefile()`; attachment `automount=false`), `outputs.tf`. `validate`+`fmt` green. **Fixed a latent bug:** literal `${...}` in a `cloud-config/config.yaml` comment was parsed as an interpolation → escaped `$${...}` (prod template was never rendered before — local VM uses `vm.sh`'s inline seed).
- [x] **T10** `dns.tf`: `omada-public`/`unifi-public.hc` → public IPv4; `omada`/`unifi.hc` → `var.tailscale_ip` (count-guarded, skipped while empty); all `proxied = false`. `validate` green.
- [x] **T11** `upload` task: `image/upload.sh` zstd-compresses the **arm64** raw + `hcloud-upload-image v1.5.0 --architecture arm` → snapshot id (record into `var.image_snapshot_id`). Task wired + syntax-checked; **live upload deferred** (temp server = cost + needs `HCLOUD_TOKEN`).

### ⛳ Checkpoint: Full static validation + HUMAN REVIEW (gate before spending money) — REACHED
- [x] Authoritative gate met on arm64 (T6); snapshot upload wired (T11, deferred). `tofu validate` + `fmt -check` green; `trunk check` clean; no community images (all official vendor artifacts baked); all versions pinned.
- [ ] **Human approves the first live apply** ← the autonomous run stops here (T12+ = live Hetzner, cost + secrets).

- [ ] **T12** First live apply (nbg1): VM + Volume + firewall + public DNS; node boots Kairos, mounts Volume, joins tailnet; Omada (`.deb`) + UOS (Podman) + Caddy/tailscaled/netdata (native units) active
- [ ] **T13** Private DNS + Caddy LE + admin UIs: set `TF_VAR_tailscale_ip` + re-apply; both UIs valid LE certs (DNS-01) over Tailscale only; public IP:443 blocked
- [ ] **T14** Verify Netdata Cloud: node claimed (ACLK connected), metrics flowing, `:19999` Tailscale-only

### ⛳ Checkpoint: Full stack live & private
- [ ] All services active (native systemd + Podman UOS); both UIs HTTPS over Tailscale; public+private DNS correct; Netdata claimed; firewall = device ports (+ TS UDP) only

## Phase 5 — Acceptance, auto-upgrade & hardening
- [ ] **T15** Kairos A/B auto-upgrade: pinned upgrade tag + schedule + reboot window (**ask-first**, SPEC §8); test upgrade applies A/B, reboots in window, data intact; rollback via previous slot documented
- [ ] **T16** Device adoption: 1 Omada + 1 UniFi via `*-public` ports — **likely BLOCKED on physical hardware (operator)**
- [ ] **T17** Persistence tests (prod): reboot → intact; documented server-recreate keeping Volume → controllers restored from `/var/lib/data`
- [ ] **T18** Firewall audit (device ports + TS UDP only; SSH/UIs/Netdata Tailscale-only) + no community images / all pinned + `trunk fmt`/`check` + `tofu fmt` clean + procedure documented inline

### ⛳ Checkpoint: Complete
- [ ] All SPEC §2 criteria met (adoption may remain pending on hardware); ready for review. Decommission `network-controllers-prod` only after §2 passes incl. adoption (**ask first**, SPEC §8)
