# TODO: network-controllers-prod

Task list for the [implementation plan](./plan.md). Order is dependency-driven; check
off top-to-bottom. Each task's acceptance criteria + verification live in `plan.md`.

## Phase 1 — Foundation (no live infra)
- [ ] **T0** Upload Flatcar snapshot to Hetzner (`hcloud-upload-image`), record ID → `var.flatcar_snapshot_id`
- [x] **T1** OpenTofu skeleton + Moon tasks: `versions.tf`, `providers.tf`, `backend.tf`, `variables.tf`, extend `moon.yml` (`init/plan/apply/destroy/output`, source `secrets/.env`)
- [x] **T2** Core resources + outputs: `main.tf` (ssh key, firewall [device ports only], volume+attachment, server[ct_config; `user_data` change recreates VM — **no `ignore_changes`**]), `outputs.tf`

### ⛳ Checkpoint: Foundation
- [ ] `init` + `validate` + `plan` green; `tofu fmt -check` clean; nothing applied

## Phase 2 — Machine config authoring (no live infra)
- [x] **T3** Base Butane: `var-lib-data.mount` (**non-destructive** format — `wipe_filesystem: false` + label, survives recreate), `tailscale.service` inline (**reusable** authkey + stable hostname, Tailscale SSH), wire `data "ct_config"` via `templatefile()` (units inlined in `butane.yaml` so secrets inject without writing rendered files)
- [ ] **T4** `files/omada-controller.service` — `mbentley/omada-controller:6.2.10.17`, host net, volume bind mounts
- [ ] **T5** `files/unifi-os-server.service` — `lemker/unifi-os-server:1.3.0`, privileged + systemd-in-container, volume bind mount
- [ ] **T6** `files/caddy.service` + `files/Caddyfile` — Caddy w/ Cloudflare DNS module, DNS-01 LE for private names, bind `tailscale0`
- [ ] **T7** `files/netdata-install.service` — kickstart + claim into Netdata Cloud, dashboard Tailscale-only
- [ ] **T8** `dns.tf` — public records → public IP; private records → `var.tailscale_ip` (count-guarded); all `proxied = false`

### ⛳ Checkpoint: Full static validation + HUMAN REVIEW (gate before spending money)
- [ ] `tofu validate`/`fmt -check` clean; rendered Butane `butane --strict` ok; `ct_config` compiles
- [ ] `trunk check`/`trunk fmt` clean
- [ ] **Human approves the first live apply**

## Phase 3 — Provision & bring-up (LIVE — incurs cost)
- [ ] **T9** `moon run network-controllers-prod:apply` → VM + volume + firewall + public DNS; node boots, joins tailnet, all units active
- [ ] **T10** Read node Tailscale IP, set `TF_VAR_tailscale_ip`, re-apply → publish private DNS
- [ ] **T11** Verify Caddy LE certs + admin UIs over HTTPS, Tailscale-only (not on public IP)
- [ ] **T12** Verify Netdata node claimed in Netdata Cloud; dashboard Tailscale-only

### ⛳ Checkpoint: Full stack live & private
- [ ] 5 units active; both UIs HTTPS over Tailscale; public+private DNS correct; Netdata claimed; firewall = device ports only

## Phase 4 — Acceptance & hardening
- [ ] **T13** Adopt one Omada device + one UniFi device via `*-public` hostnames
- [ ] **T14** Reboot test (data intact) + recreate test (Butane change → VM recreate, Volume **not** reformatted, controllers restore; re-set `TF_VAR_tailscale_ip` if IP changed)
- [ ] **T15** Goss/host checks (ports, mount, units) + `ignition/README.md` + `trunk`/`tofu fmt` + firewall audit

### ⛳ Checkpoint: Complete
- [ ] All SPEC §2 acceptance criteria met; ready for review
```
