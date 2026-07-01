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
- [ ] **T3** Netdata (native apt, pinned): `netdata.service`, claim into Netdata Cloud via cloud-config; persist `/var/lib/netdata` + `/var/cache/netdata`; not public-bound; survives reboot-in-VM
- [ ] **T4** Caddy (xcaddy + `caddy-dns/cloudflare` baked at build, pinned): `caddy.service` + Caddyfile, bind `tailscale0` only, proxy `omada.hc`→:8043 / `unifi.hc`→:11443; persist Caddy data dir; `caddy validate` (full DNS-01 live at T13)

### ⛳ Checkpoint: Native services (arm64)
- [ ] Tailscale + Netdata + Caddy active; each survives reboot-in-VM via its `bind_mount`; `trunk check` clean

## Phase 2 — Controllers (the hard parts)
- [ ] **T5** Omada (official TP-Link `.deb`, pinned): install JDK/JSVC + `mongod` (newest supported by pinned Omada); embedded mongod uses `data/db`; persist `/opt/tplink/EAPController/{data,logs}`; unit active, UI :8043 (arm64 = dev-only force-arch, **not authoritative**)
- [ ] **T6** UniFi OS Server (official Podman installer, baked): `podman`+`slirp4netns`, bake `uosserver` user, relocate `graphroot`→`/var/lib/data/containers` via storage.conf, run installer at build (fallback: first-boot stage w/ user still baked); persist graphroot (+ uosserver home if needed); `podman ps` + GUI :11443; survives reboot-in-VM

### ⛳ Checkpoint: Persistence discovery complete & validated (arm64)
- [ ] All 5 services active; **complete persistent-path list documented** — every entry a `bind_mount` that exists in the image + routes onto `/var/lib/data`; reboot-in-VM preserves all state; `trunk check` clean

## Phase 3 — amd64 promotion gate (authoritative, still local/no cloud)
- [ ] **T7** amd64 emulated boot gate: `build-image` (amd64) + `vm-up` under `qemu-system-x86_64` (TCG); **all 5 services incl. real Omada `.deb`** active; `vm-verify` reboot-in-VM persistence on amd64

### ⛳ Checkpoint: amd64 authoritative gate
- [ ] amd64 emulated boot green incl. real Omada; persistence proven — **no `upload` until this passes**

## Phase 4 — OpenTofu infra + promote to Hetzner (LIVE — incurs cost)
- [ ] **T8** Tofu skeleton + Moon lifecycle: `versions.tf` (hcloud 1.66.0, cloudflare 4.52.0; no poseidon/ct), `providers.tf`, `backend.tf` (`key = "network"`), `variables.tf` (+ pins + snapshot id), `.env.tpl`/`.envrc`/`.gitignore`/`secrets/.gitignore`, `moon.yml` `secrets/init/plan/apply/destroy/output` → `secrets` renders, `init` + `validate` green
- [ ] **T9** Core resources + outputs: `main.tf` (firewall device-ports+TS UDP only, volume 10GB non-destructive @ `/var/lib/data`, server from Kairos snapshot + cloud-config `user_data`), `outputs.tf`; `plan` green
- [ ] **T10** `dns.tf`: public → public IP; private → `var.tailscale_ip` (count-guarded); all `proxied = false`
- [ ] **T11** `upload` task: compress amd64 raw + `hcloud-upload-image` (pinned) → snapshot id set as `var.image_snapshot_id` default

### ⛳ Checkpoint: Full static validation + HUMAN REVIEW (gate before spending money)
- [ ] amd64 gate passed + snapshot uploaded; `tofu validate`/`fmt -check`/`plan` green; `trunk check` clean; no community images; all pinned
- [ ] **Human approves the first live apply**

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
