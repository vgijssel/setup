# Implementation Plan: network-controllers-prod

> Companion task checklist: [`todo.md`](./todo.md). Source spec: [`../SPEC.md`](../SPEC.md).

## Context

The TP-Link Omada hardware controller and the Ubiquiti UniFi Cloud Key are being
**sold**. To keep all existing Omada and UniFi network gear working, we replace both
with software controllers running as containers on a single **Flatcar Container Linux**
VM in **Hetzner Cloud (nbg1)**, provisioned with **OpenTofu**, fronted by **Caddy**
(TLS over Tailscale), and monitored by **Netdata Cloud**. Fresh start — devices are
re-adopted from scratch, no data migrated off the hardware being sold.

The app directory is already partially scaffolded: `SPEC.md`, `.envrc`,
`.env.tpl` (all secrets in 1Password vault `enigma-prod`), and a `moon.yml` with only
the `secrets` task (pinned to `--account my.1password.com`). **All `.tf` files,
`ignition/`, and `files/` are missing.** This plan builds the rest.

This is the repo's **first** use of Flatcar, Butane/Ignition, Caddy, and Netdata — so
those are the primary risk surfaces. The closest existing pattern is
`apps/gateway-prod` (Hetzner + OpenTofu + 1Password + Moon, S3 backend, `user_data` +
`ignore_changes`), which we mirror for the Moon/Tofu plumbing.

## Decisions (confirmed with operator)

- **Scope:** author all code **and** run a live `apply` into nbg1; finish with adoption
  and reboot tests.
- **Flatcar image:** no snapshot exists — add a one-time `hcloud-upload-image` task,
  record the snapshot ID into a variable.
- **Ignition build:** use the **`poseidon/ct`** OpenTofu provider (`data "ct_config"`)
  to compile Butane→Ignition inline at `tofu plan`. Secrets are injected into the
  Butane content with `templatefile()` before compilation (no committed Ignition JSON).

## Architecture Decisions

- **Providers (all pinned exact):** `hetznercloud/hcloud` `1.57.0` (match repo),
  `cloudflare/cloudflare` (exact, current 4.x), `poseidon/ct` (exact). **No** tailscale
  provider — see the Tailscale-IP decision below.
- **Backend:** S3 on Hetzner Object Storage (nbg1), `key = "network-controllers-prod"`,
  `skip_*` flags + `use_path_style` + `use_lockfile`, bucket injected at `init` via
  `-backend-config="bucket=$TF_VAR_s3_bucket"` — identical to `gateway-prod`.
- **Recreate-on-change provisioning:** the server uses `image = <flatcar snapshot id>`
  and `user_data = data.ct_config.rendered` with **no `ignore_changes`**. Changing the
  Butane/Ignition flips `user_data`, which forces `hcloud_server` replacement — so
  `apply` itself is the iteration path: the VM is recreated, the Volume re-attaches, and
  controller data persists. This makes the SPEC "rebuild test" continuous. Brief
  downtime on each change is acceptable (single admin). We still author the bulk of the
  config before the first apply to minimize recreate cycles, but incremental applies are
  now fine. **Correctness now hinges on the Volume format being non-destructive** (next
  bullet).
- **Storage:** dedicated Hetzner Volume (10 GB, `var.volume_size`) mounted at
  `/var/lib/data` via a systemd `.mount` unit. The Volume is formatted
  **non-destructively** — Ignition uses `wipe_filesystem: false` + a stable filesystem
  label, so on a VM recreate it reuses the existing filesystem instead of reformatting,
  preserving all controller data. App data bind-mounted: Omada
  `/var/lib/data/omada/{data,logs}`, UniFi `/var/lib/data/unifi`.
- **Tailscale IP → private DNS (key wrinkle):** the private admin A records
  (`omada.hc`, `unifi.hc`) must point at the node's `100.x` Tailscale IP, which only
  exists *after* the node joins the tailnet. We avoid adding Tailscale API credentials
  by driving these records from a **`var.tailscale_ip` variable, `default = ""`, guarded
  with `count`**. Flow: first apply provisions everything + public DNS and the node
  joins the tailnet; read its IP (`tailscale ip -4` on the host / Tailscale admin); set
  `TF_VAR_tailscale_ip` and re-apply to publish the private records. (DNS-01 itself does
  not need these A records — LE validates via a `_acme-challenge` TXT record; the A
  records only make the names resolve to the tailnet for the admin's browser.) Because a
  recreate can assign a new `100.x` IP, the authkey is **reusable** (with a stable
  hostname so the tailnet device is reused) and `TF_VAR_tailscale_ip` is re-checked after
  any recreate.
- **Caddy TLS:** a pinned Caddy image **including the Cloudflare DNS module**; ACME
  **DNS-01** via the zone-scoped Cloudflare token (same token the `cloudflare` provider
  uses), for the two private names only. Caddy binds `tailscale0` only; reverse-proxies
  `omada.hc`→`https://localhost:8043` and `unifi.hc`→`https://localhost:11443`
  (skip upstream verify).
- **Secrets in state/Ignition:** authkey, Netdata token, and Cloudflare token are
  templated into Ignition and therefore land in OpenTofu state and `user_data`. Accepted
  — state lives in private Hetzner Object Storage; nothing is committed to git.

## Dependency Graph

```
1Password secrets (done) ── moon :secrets ──> secrets/.env
                                                  │
T0 Flatcar snapshot ─────────────┐               │
                                 v               v
T1 Tofu skeleton (versions/providers/backend/variables/moon tasks)
                                 │
                                 v
T2 Resources (ssh, firewall, volume+attach, server[ct_config], outputs)
                                 │
        ┌────────────────────────┼───────────────────────────┐
        v                        v                            v
T3 Base Butane           T8 dns.tf (public + private[count])  (depends on T2 outputs)
(.mount + tailscale)
        │
        ├─> T4 Omada unit + mounts
        ├─> T5 UniFi unit (privileged) + mounts
        ├─> T6 Caddy unit + Caddyfile (DNS-01)
        └─> T7 Netdata oneshot (kickstart + claim)
                                 │
        ===== CHECKPOINT: full static validation + human review (before $$) =====
                                 │
                                 v
T9 First live apply  ──> T10 set tailscale_ip + re-apply (private DNS)
                                 │                    │
                                 v                    v
                         T11 verify Caddy/LE + UI    T12 verify Netdata Cloud
                                 │
        ===== CHECKPOINT: full stack live & private =====
                                 │
                    ┌────────────┴────────────┐
                    v                          v
            T13 adoption tests        T14 reboot + recreate persistence
                                 │
                                 v
            T15 host checks (goss) + README + fmt/lint + firewall audit
```

Implementation order is bottom-up; each phase leaves the system in a working,
verifiable state, and the highest-risk work (Flatcar first boot, privileged UniFi
container, Caddy DNS-01) is front-loaded so we fail fast.

---

## Phase 1 — Foundation (no live infra)

### Task 0: Upload Flatcar snapshot to Hetzner
**Description:** Hetzner ships no stock Flatcar image. Upload the official Flatcar
Hetzner image once as a snapshot and record its ID. One-time prerequisite for any apply.

**Acceptance criteria:**
- [ ] A Flatcar (pinned stable version) snapshot exists in the Hetzner project (nbg1).
- [ ] Its ID is recorded as the default for `var.flatcar_snapshot_id`.

**Verification:**
- [ ] `hcloud image list --type snapshot` shows the Flatcar snapshot.
- [ ] Procedure documented in `ignition/README.md` (uses `hcloud-upload-image`, pinned channel/version).

**Dependencies:** None (needs `HCLOUD_TOKEN` from `secrets/.env`).
**Files likely touched:** `ignition/README.md` (procedure), later `variables.tf`.
**Scope:** S

### Task 1: OpenTofu skeleton + Moon lifecycle tasks
**Description:** Create `versions.tf`, `providers.tf`, `backend.tf`, `variables.tf`, and
extend `moon.yml` with `init/plan/apply/destroy/output` mirroring `gateway-prod` (note:
this app sources `secrets/.env`, not `.env`).

**Acceptance criteria:**
- [ ] `versions.tf` pins `hcloud 1.57.0`, `cloudflare` (exact 4.x), `poseidon/ct` (exact); `required_version >= 1.8.0`.
- [ ] `backend.tf` matches the `gateway-prod` S3 pattern with `key = "network-controllers-prod"`.
- [ ] `providers.tf`: empty `hcloud`, `cloudflare { api_token = var.cloudflare_api_token }`, `ct {}`.
- [ ] `variables.tf` defines all tunables with descriptions/defaults: `server_type="cx23"`, `datacenter="nbg1-dc3"`, `volume_size=10`, `base_domain="hc.vgijssel.nl"`, hostnames, `flatcar_snapshot_id`, `cloudflare_api_token`(sensitive), `cloudflare_account_id`, `tailscale_authkey`(sensitive, **reusable** key), `tailscale_ip=""`, `netdata_claim_*`, `s3_bucket`, image tags.
- [ ] `moon.yml` has `init/plan/apply/destroy/output`, each `set -a && source secrets/.env && set +a && tofu ...`, `apply`/`destroy` `interactive: true`, all `runInCI: false`.

**Verification:**
- [ ] `moon run network-controllers-prod:init` succeeds (backend reachable, lockfile written).
- [ ] `tofu validate` passes; `tofu fmt -check` clean.

**Dependencies:** None.
**Files likely touched:** `versions.tf`, `providers.tf`, `backend.tf`, `variables.tf`, `moon.yml`.
**Scope:** M

### Task 2: Core resources + outputs
**Description:** `main.tf`: `hcloud_ssh_key`, `hcloud_firewall` (device ports public
only), `hcloud_volume` (10 GB) + `hcloud_volume_attachment`, `hcloud_server` (Flatcar
snapshot, `user_data = data.ct_config.rendered`, **no `ignore_changes`**). A stub
`data "ct_config"` (empty Butane) so `plan` resolves before T3. `outputs.tf`: public
IPv4/IPv6, server name, admin/public URLs.

**Acceptance criteria:**
- [ ] Firewall opens **only**: Omada TCP/UDP 29810–29817, UDP 27001, TCP 8088; UniFi TCP 8080, UDP 3478, UDP 10001/10003. No public 22/80/443.
- [ ] Volume attached and referenced for the `.mount` in T3; `hcloud_volume_attachment` survives server replacement (Volume not destroyed).
- [ ] Server uses `image = var.flatcar_snapshot_id`; a `user_data` change **recreates** the server (no `ignore_changes`), relying on the Volume to persist data.

**Verification:**
- [ ] `tofu validate` + `tofu plan` succeed against the real backend (no apply); plan shows server+volume+firewall+ssh key.
- [ ] `tofu fmt -check` clean.

**Dependencies:** T1 (and T0 for the snapshot ID default).
**Files likely touched:** `main.tf`, `outputs.tf`, `variables.tf`.
**Scope:** M

### Checkpoint: Foundation
- [ ] `init` + `validate` + `plan` all green; `fmt` clean. No resources applied yet.

---

## Phase 2 — Machine config authoring (no live infra)

> All tasks here append to `ignition/butane.yaml` and the `files/` assets. After each,
> `data "ct_config"` (via `templatefile()`) must compile cleanly (`tofu plan`) and
> `butane --strict` must pass. Secrets are injected via `templatefile()` vars.

### Task 3: Base Butane — volume mount + Tailscale
**Description:** Author `ignition/butane.yaml` core: `core` user SSH key, a **labeled,
non-destructively formatted** Hetzner Volume + `var-lib-data.mount` unit, and
`files/tailscale.service` (Tailscale container, `tailscale up` with reusable authkey +
SSH, stable hostname, joins tailnet on boot). Wire `data "ct_config"` with `templatefile()`.

**Acceptance criteria:**
- [ ] Volume filesystem declared with `wipe_filesystem: false` + a stable label; the `.mount` mounts it at `/var/lib/data`. **A VM recreate reuses the existing filesystem — it must not reformat (no data loss).**
- [ ] `tailscale.service` joins the tailnet using `var.tailscale_authkey` (a **reusable** key) with a stable hostname, enables Tailscale SSH, and re-joins cleanly after a recreate.
- [ ] Authkey is injected via `templatefile()`, not hardcoded.

**Verification:**
- [ ] `butane --strict ignition/butane.yaml` (rendered) compiles.
- [ ] `tofu plan` resolves `data.ct_config` with no errors.

**Dependencies:** T2.
**Files likely touched:** `ignition/butane.yaml`, `files/tailscale.service`, `main.tf`.
**Scope:** M

### Task 4: Omada controller unit
**Description:** `files/omada-controller.service` — `mbentley/omada-controller:6.2.10.17`,
host networking, bind mounts `/var/lib/data/omada/{data,logs}` →
`/opt/tplink/EAPController/{data,logs}`. Reference from Butane; add `RequiresMountsFor`.

**Acceptance criteria:**
- [ ] Pinned image tag exactly `6.2.10.17`; host networking; data on the volume.
- [ ] Unit ordered after `var-lib-data.mount`.

**Verification:** `butane --strict` + `tofu plan` clean.
**Dependencies:** T3.
**Files likely touched:** `files/omada-controller.service`, `ignition/butane.yaml`.
**Scope:** S

### Task 5: UniFi OS Server unit (privileged)
**Description:** `files/unifi-os-server.service` — `lemker/unifi-os-server:1.3.0`
(x86-64), **privileged** with cgroup access + systemd-in-container, bind mount
`/var/lib/data/unifi`. Document the privileged requirement as a known risk.

**Acceptance criteria:**
- [ ] Pinned image `1.3.0`; privileged + cgroup/systemd-in-container flags set; data on volume.
- [ ] Unit ordered after `var-lib-data.mount`.

**Verification:** `butane --strict` + `tofu plan` clean.
**Dependencies:** T3.
**Files likely touched:** `files/unifi-os-server.service`, `ignition/butane.yaml`.
**Scope:** S (live risk: M)

### Task 6: Caddy reverse proxy + DNS-01
**Description:** `files/caddy.service` (pinned Caddy image **with Cloudflare DNS
module**) + `files/Caddyfile`. Caddy binds `tailscale0`; ACME DNS-01 via Cloudflare
token (templated from `var.cloudflare_api_token`); reverse-proxies `omada.hc`→`:8043`
and `unifi.hc`→`:11443` with `tls_insecure_skip_verify` upstream.

**Acceptance criteria:**
- [ ] Caddy image pinned and includes the Cloudflare DNS provider.
- [ ] Caddyfile issues LE certs for the two private names via DNS-01; binds Tailscale only.
- [ ] Cloudflare token injected via `templatefile()`, not committed.

**Verification:** `butane --strict` + `tofu plan` clean; `caddy validate` if feasible locally.
**Dependencies:** T3.
**Files likely touched:** `files/caddy.service`, `files/Caddyfile`, `ignition/butane.yaml`.
**Scope:** M

### Task 7: Netdata install + claim oneshot
**Description:** `files/netdata-install.service` — oneshot running the official kickstart
(pinned where the script allows) and claiming into Netdata Cloud using
`netdata_claim_{url,token,rooms}`; dashboard bound to Tailscale only.

**Acceptance criteria:**
- [ ] Kickstart pinned as far as supported; claim args from `var.netdata_claim_*` via `templatefile()`.
- [ ] Dashboard not exposed on the public IP.

**Verification:** `butane --strict` + `tofu plan` clean.
**Dependencies:** T3.
**Files likely touched:** `files/netdata-install.service`, `ignition/butane.yaml`.
**Scope:** S

### Task 8: DNS records
**Description:** `dns.tf` — `data "cloudflare_zone"` for `vgijssel.nl`; public records
`omada-public.hc`/`unifi-public.hc` → public IPv4; private records
`omada.hc`/`unifi.hc` → `var.tailscale_ip` (guarded by `count = var.tailscale_ip == "" ? 0 : 1`).
All `proxied = false`.

**Acceptance criteria:**
- [ ] Public records → server public IP; private records → `var.tailscale_ip`, skipped when empty.
- [ ] All records DNS-only in the `vgijssel.nl` zone.

**Verification:** `tofu plan` shows the 2 public records (private skipped while `tailscale_ip=""`).
**Dependencies:** T2.
**Files likely touched:** `dns.tf`, `variables.tf`.
**Scope:** S

### Checkpoint: Full static validation + HUMAN REVIEW (gate before spending money)
- [ ] `tofu validate` + `tofu fmt -check` clean.
- [ ] Rendered Butane passes `butane --strict`; `data.ct_config` compiles in `tofu plan`.
- [ ] `trunk check` / `trunk fmt` clean.
- [ ] Human reviews the full config and approves the **first live apply**.

---

## Phase 3 — Provision & bring-up (LIVE — incurs cost)

### Task 9: First live apply
**Description:** `moon run network-controllers-prod:apply`. Provisions VM + volume +
firewall + **public** DNS; node first-boots Ignition, mounts volume, joins tailnet, and
starts all units.

**Acceptance criteria:**
- [ ] Server + volume (mounted `/var/lib/data`) + firewall created in nbg1.
- [ ] Node visible in the Tailscale admin; reachable via Tailscale SSH.
- [ ] `systemctl` shows `tailscale`, `omada-controller`, `unifi-os-server`, `caddy`, `netdata` active; `docker ps` shows the expected containers.

**Verification:**
- [ ] `ssh core@<tailscale-ip> systemctl status omada-controller unifi-os-server caddy netdata`
- [ ] `ssh core@<tailscale-ip> docker ps`; volume mount + bind dirs present under `/var/lib/data`.

**Dependencies:** T0, T2–T8, Checkpoint above.
**Files likely touched:** none (apply); fixes are folded back into Butane and re-applied —
the changed `user_data` recreates the VM (Volume retained).
**Scope:** M (highest risk: Flatcar first boot + privileged UniFi container)

### Task 10: Publish private DNS (Tailscale IP)
**Description:** Read the node's `100.x` IP, set `TF_VAR_tailscale_ip`, re-apply to
create the private `omada.hc`/`unifi.hc` records.

**Acceptance criteria:**
- [ ] `omada.hc`/`unifi.hc` resolve to the node's Tailscale IP; `*-public` resolve to the public IP.

**Verification:** `dig +short omada.hc.vgijssel.nl` → tailnet IP; `dig +short omada-public.hc.vgijssel.nl` → public IP.
**Note:** re-run this after any VM recreate that changes the `100.x` IP (update `TF_VAR_tailscale_ip`).
**Dependencies:** T9.
**Scope:** S

### Task 11: Verify admin UIs + Let's Encrypt
**Description:** Confirm Caddy obtained valid LE certs via DNS-01 and serves both admin
UIs over HTTPS, **only** over Tailscale.

**Acceptance criteria:**
- [ ] `https://omada.hc...` and `https://unifi.hc...` serve the admin UIs with valid LE certs over Tailscale.
- [ ] Same URLs are **not** reachable on the public IP.

**Verification:** `curl -v` over tailnet (valid cert) vs. public IP (refused/blocked); inspect Caddy logs.
**Dependencies:** T10.
**Scope:** S

### Task 12: Verify Netdata Cloud
**Acceptance criteria:**
- [ ] Node appears in the Netdata Cloud space/room; host metrics flowing; dashboard Tailscale-only.

**Verification:** Node visible in Netdata Cloud; `curl` Netdata port over tailnet only.
**Dependencies:** T9.
**Scope:** S

### Checkpoint: Full stack live & private
- [ ] All five units active; both UIs over HTTPS on Tailscale; public + private DNS correct; Netdata claimed; firewall exposes device ports only.

---

## Phase 4 — Acceptance & hardening

### Task 13: Device adoption test
**Acceptance criteria:**
- [ ] One Omada device and one UniFi device adopt successfully via the `*-public` hostnames/ports.

**Verification:** Devices show "adopted/connected" in each controller UI.
**Dependencies:** Checkpoint above.
**Scope:** M (manual, hardware-dependent)

### Task 14: Persistence tests
**Description:** Reboot test (critical) + the recreate test, which is now the **routine
config-change path** (changing `user_data` recreates the VM). Both must preserve data
via the retained Volume.

**Acceptance criteria:**
- [ ] `systemctl reboot` → both controllers return with config/devices/DB intact.
- [ ] A trivial Butane change + `apply` **recreates the server** and both controllers come back from `/var/lib/data` with state intact (Volume not reformatted). Re-set `TF_VAR_tailscale_ip` if the `100.x` IP changed.
- [ ] Procedure documented in `ignition/README.md`.

**Verification:** Post-reboot and post-recreate: UI/login + adopted devices intact; confirm the filesystem was reused (not reformatted) via boot logs / `blkid`.
**Dependencies:** T13.
**Scope:** M

### Task 15: Host checks + docs + lint + firewall audit
**Acceptance criteria:**
- [ ] Goss/host checks for open ports, `/var/lib/data` mount, and unit state (where the repo expects them).
- [ ] `ignition/README.md` covers Butane compilation, snapshot upload, and recreate procedure.
- [ ] `trunk fmt`/`trunk check` and `tofu fmt` clean; firewall audit confirms only device ports are public.

**Verification:** Goss suite passes; `trunk check` + `tofu fmt -check` clean.
**Dependencies:** T14.
**Files likely touched:** `goss.yaml` (if used), `ignition/README.md`.
**Scope:** S

### Checkpoint: Complete
- [ ] Every SPEC §2 acceptance criterion met; ready for review.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Flatcar first boot / Ignition fails on Hetzner snapshot | High | Snapshot method per SPEC; full static validation + `butane --strict` before apply; Hetzner console for boot logs; rescue+`flatcar-install` fallback documented. |
| UniFi OS Server needs privileged + systemd-in-container | High | Treated as known constraint (SPEC §1); validated early at T5/T9; pinned `1.3.0`. |
| Caddy DNS-01 (Cloudflare module) misconfig | Med | Pinned Caddy-with-CF image; reuse zone-scoped token; verify cert issuance at T11; check Caddy logs. |
| Tailscale IP unknown until node joins (private DNS) | Med | `var.tailscale_ip` + `count` guard; two-step apply (T9 then T10); no extra TS API creds needed. |
| **Volume reformatted on VM recreate → data loss** | **High** | `wipe_filesystem: false` + stable fs label so Ignition reuses the existing filesystem; reboot+recreate test (T14) validates no reformat; this is the core correctness property of the recreate model. |
| `user_data` change recreates the VM (brief downtime) | Med | Intended trade-off — data lives on the retained Volume; single admin tolerates short downtime; author the bulk of config up front to minimize recreate cycles. |
| Recreate assigns a new Tailscale `100.x` IP → stale private DNS | Low | Reusable authkey + stable hostname; re-read `tailscale ip -4` and update `TF_VAR_tailscale_ip` after recreate (T10 note). |
| Secrets land in TF state / Ignition `user_data` | Low | State in private Hetzner Object Storage; nothing committed; `secrets/` git-ignored & deny-listed. |
| Live apply cost | Low | Human-review checkpoint before first apply; `cx23` + 10 GB sizing per SPEC; bumps require ask. |

## Open Questions

_None blocking._ SPEC §"Open Questions" reports 1Password items/fields already created.

## Verification (end-to-end)

```bash
moon run network-controllers-prod:secrets      # render secrets/.env
moon run network-controllers-prod:init         # backend init
moon run network-controllers-prod:plan         # static plan
# (human-review checkpoint)
moon run network-controllers-prod:apply        # live provision
# read node tailscale IP, then:
TF_VAR_tailscale_ip=<100.x> moon run network-controllers-prod:apply
ssh core@<tailscale-ip> systemctl status omada-controller unifi-os-server caddy netdata
ssh core@<tailscale-ip> docker ps
dig +short omada.hc.vgijssel.nl                 # → tailnet IP
curl -v https://omada.hc.vgijssel.nl            # valid LE cert, over Tailscale only
# adopt 1 Omada + 1 UniFi device; then:
ssh core@<tailscale-ip> systemctl reboot        # both controllers return with data intact
```
