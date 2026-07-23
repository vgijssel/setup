# apps/pikvm — Task List (Tailscale → NetBird via pyinfra)

Full detail in `plan.md`. Order follows the dependency graph: foundation (1–3) before any host
mutation (4–8), hardening last (9). Check off acceptance criteria as you go.

## Phase 1: Foundation (CI-testable, no host mutation)

- [x] **Task 1 — uv + Moon scaffold** (S)
  - [x] `pyproject.toml` pins `pyinfra` + `hvac` exactly; `.python-version` = Hermit `python3.12`
  - [x] `uv.lock` committed + reproducible; `moon.yml` has `install` + `lint` (python/application, tags)
  - [x] `moon run pikvm:install` clean (no lock drift); `moon run pikvm:lint` + `trunk check` pass
- [x] **Task 2 — OpenBao contract + `secrets.py`** (S) — *deps: 1*
  - [x] hvac client reads `kv/pikvm` → `netbird_setup_key` / `admin_password` / `root_password`
  - [x] Fails fast (no secret in error) if unreachable/missing; never logs values
  - [x] Seed documented (`secret:forward` + `bao kv put kv/pikvm …`); throwaway read succeeds
- [ ] **Task 3 — inventories + `deploy.py` skeleton + apply tasks** (M) — *deps: 1, 2*
  - [ ] `inventories/{production.py,local.py}` resolve `$PIKVM_HOST` / `$PIKVM_LOCAL_IP`, SSH `$PIKVM_SSH_USER`
  - [ ] `apply` / `apply_local` are `interactive: true`, `runInCI: false`, forward `-- --dry`
  - [ ] `moon run pikvm:apply_local -- --dry` connects to `192.168.1.31`, reads OpenBao, no changes

### ▸ Checkpoint A — Foundation (human review before host mutation)
- [ ] install/lint/trunk green in CI; `apply_local -- --dry` connects + reads OpenBao clean

## Phase 2: Core convergence (host changes, one concern per slice)

- [ ] **Task 4 — NetBird overlay scaffolding** (M) — *deps: 3*
  - [ ] `/root/netbird-state` created; overlay script + service installed and enabled; rw/ro guarded
  - [ ] Empty `--dry` diff on converged box; rootfs `ro` at end
- [ ] **Task 5 — NetBird install (AUR) + systemd override** (M, **highest risk**) — *deps: 4*
  - [ ] `netbird-bin` built as `kvmd-webterm`, `pacman -U`, pinned-version skip
  - [ ] `netbird@.service.d/pikvm.conf` dropped; `netbird@netbird` enabled, ordered after overlay
- [ ] **Task 6 — `netbird up` + state persist** (S) — *deps: 5*
  - [ ] `netbird up --setup-key … --disable-dns` only when not connected; state → `/root/netbird-state`
  - [ ] `netbird status` Connected `100.x`; survives reboot; setup key never logged
- [ ] **Task 7 — admin + root passwords** (S) — *deps: 3*
  - [ ] `kvmd-htpasswd set admin` + `chpasswd` root, from OpenBao; rw-guarded; no secret logging
  - [ ] Web `admin` login + root login work with OpenBao passwords
- [ ] **Task 8 — static IPv4 (systemd-networkd)** (S, **connectivity risk, ask first**) — *deps: 3*
  - [ ] Assigns `$PIKVM_STATIC_IP` (192.168.1.31); connectivity-safe ordering; rw-guarded; no-op re-run
  - [ ] `ip addr` shows static IP; box still reachable

### ▸ Checkpoint B — Core convergence (on hardware, human review)
- [ ] Fresh `apply_local` converges; NetBird Connected `100.x`; reboot survives
- [ ] Web `admin` login works; static IP correct; Tailscale still functional

## Phase 3: Hardening & cutover

- [ ] **Task 9 — idempotency + over-network verification** (S) — *deps: 6, 7, 8*
  - [ ] `moon run pikvm:apply -- --dry` over NetBird shows empty diff
  - [ ] Manual-acceptance runbook (SPEC §6) recorded; Tailscale intact; no server-side NetBird changes

### ▸ Checkpoint C — Complete
- [ ] Idempotent over network; all SPEC §6 acceptance passes; SPEC §7 boundaries respected; ready for PR

## Decisions (resolved)
- [x] hvac auth: **token-only** (`VAULT_TOKEN` / `~/.vault-token`)
- [x] Static IP: **included, gated by operator confirmation** before first real apply
- [x] plan/todo location: `apps/pikvm/tasks/`
- [x] Versions: **latest stable** — `pyinfra==3.9.2`, `hvac==2.4.0`, NetBird `0.74.7` (re-verify at impl; Renovate maintains)
- [x] No DHCP reservation for 192.168.1.31 — treat as static
