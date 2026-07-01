# TODO: network-controllers-prod

Task list for the [implementation plan](./plan.md). Order is dependency-driven; check
off top-to-bottom. Each task's acceptance criteria + verification live in `plan.md`.

## Phase 1 — Foundation (no live infra)
- [x] **T0** Upload Flatcar snapshot to Hetzner (`hcloud-upload-image` v1.5.0, Flatcar stable 4593.2.3) → snapshot id `403540555` set as `var.flatcar_snapshot_id` default
- [x] **T1** OpenTofu skeleton + Moon tasks: `versions.tf`, `providers.tf`, `backend.tf`, `variables.tf`, extend `moon.yml` (`init/plan/apply/destroy/output`, source `secrets/.env`)
- [x] **T2** Core resources + outputs: `main.tf` (ssh key, firewall [device ports only], volume+attachment, server[ct_config; `user_data` change recreates VM — **no `ignore_changes`**]), `outputs.tf`

### ⛳ Checkpoint: Foundation
- [ ] `init` + `validate` + `plan` green; `tofu fmt -check` clean; nothing applied

## Phase 2 — Machine config authoring (no live infra)
- [x] **T3** Base Butane: `var-lib-data.mount` (**non-destructive** format — `wipe_filesystem: false` + label, survives recreate), `tailscale.service` inline (**reusable** authkey + stable hostname, Tailscale SSH), wire `data "ct_config"` via `templatefile()` (units inlined in `butane.yaml` so secrets inject without writing rendered files)
- [x] **T4** `omada-controller.service` (inline) — `mbentley/omada-controller:6.2.10.17`, host net, volume bind mounts
- [x] **T5** `unifi-os-server.service` (inline) — `ghcr.io/lemker/unifi-os-server:v1.3.0` (SPEC image was Docker Hub `lemker/..:1.3.0` which 404s; corrected to GHCR `v1.3.0`), cgroupns=host + NET_ADMIN/NET_RAW + tmpfs + 7 data volumes, bridge net + port maps (GUI 11443)
- [x] **T6** `caddy.service` + Caddyfile (inline storage.files) — Caddy w/ Cloudflare DNS module, DNS-01 LE for private names, bind to Tailscale IP (`caddy-run.sh` resolves `tailscale0`), CF token in 0600 env file
- [x] **T7** `netdata-install.service` (inline oneshot) — kickstart (`--stable-channel --static-only`) + claim into Netdata Cloud, dashboard Tailscale-only (firewall-enforced)
- [x] **T8** `dns.tf` — public records → public IP; private records → `var.tailscale_ip` (count-guarded); all `proxied = false`

### ⛳ Checkpoint: Full static validation + HUMAN REVIEW (gate before spending money)
- [x] `tofu validate`/`fmt -check` clean; `ct_config` compiles (Ignition 3.4.0, all 6 units + 4 files verified)
- [x] `trunk check` clean (yamllint tool-install hiccup aside; 5 files no issues)
- [ ] **Human approves the first live apply** (awaiting; T0 snapshot tooling decision pending)

## Phase 3 — Provision & bring-up (LIVE — incurs cost)
- [x] **T9** `apply` → VM + volume + firewall + public DNS; node boots, joins tailnet, all 5 units active. (Fixes en route: dropped dup ssh key; `location` not `datacenter`; hcloud provider 1.66.0; UniFi image → `ghcr.io/lemker:v1.3.0`; Tailscale UDP 41641 + tagged authkey + persistent state; Netdata → container.)
- [x] **T10** Private DNS published: `omada.hc`/`unifi.hc` → `100.67.146.27` (stable tagged Tailscale IP; baked as `var.tailscale_ip` default)
- [x] **T11** Caddy LE certs (DNS-01) for both private names; admin UIs return HTTP 200 w/ valid LE cert over Tailscale; public IP:443 blocked
- [x] **T12** Netdata claimed into Netdata Cloud (ACLK connected, claimed_id present); dashboard :19999 Tailscale-only

### ⛳ Checkpoint: Full stack live & private
- [x] 5 units active; both UIs HTTPS over Tailscale; public+private DNS correct; Netdata claimed; firewall = device ports (+ Tailscale UDP) only

## Phase 4 — Acceptance & hardening
- [ ] **T13** Adopt one Omada device + one UniFi device via `*-public` hostnames
- [ ] **T14** Reboot test (data intact) + recreate test (Butane change → VM recreate, Volume **not** reformatted, controllers restore; re-set `TF_VAR_tailscale_ip` if IP changed)
- [ ] **T15** Goss/host checks (ports, mount, units) + `ignition/README.md` + `trunk`/`tofu fmt` + firewall audit

### ⛳ Checkpoint: Complete
- [ ] All SPEC §2 acceptance criteria met; ready for review
```
