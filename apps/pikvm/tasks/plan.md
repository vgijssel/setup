# Implementation Plan: apps/pikvm — Tailscale → NetBird via pyinfra + Moon

## Overview

Build `apps/pikvm`: an idempotent, declarative pyinfra deployment (Python via `uv`, wired
into Moon) that brings the PiKVM host (`192.168.1.31`) onto **NetBird**, sets the PiKVM web
`admin` and system `root` passwords, and assigns a static IPv4 — with all secrets pulled at
runtime from **OpenBao** (`kv/pikvm`) via the `hvac` SDK. This replaces the NetBird/password/
static-IP concerns of the Ansible `apps/provisioner` `pikvm.yml` path. Tailscale stays
installed and functional throughout the migration.

Source of truth for behavior is `apps/pikvm/SPEC.md`. This plan slices that spec into small,
independently verifiable tasks.

## Architecture Decisions

- **pyinfra, not Ansible** — new work uses pyinfra (`deploy.py` + inventories), matching the
  spec and keeping the Ansible `pikvm.yml` untouched during transition. Reference layout:
  `apps/hypervisor/{deploy.py,inventory.py}` (note: that project is Bazel/Vagrant-based; we
  follow its pyinfra idioms but the Moon+uv wiring comes from `libs/fleet-mcp`).
- **Moon + uv wiring mirrors `libs/fleet-mcp`** — `language: python`, `layer: application`,
  tags `[python, pikvm, netbird, pyinfra]`, tasks run `uv run …`, deps pinned exactly in
  `pyproject.toml` + committed `uv.lock`, Python pinned via `.python-version`. Hermit already
  provides `uv`, `python3.12`, and `bao`.
- **Two inventories, one `deploy.py`** — `inventories/production.py` (network target,
  `$PIKVM_HOST`) and `inventories/local.py` (LAN target, `$PIKVM_LOCAL_IP`) differ only in how
  the host is reached. `deploy.py` is the single source of operations so `--dry` shows a clean
  diff regardless of target.
- **Secrets seam is `secrets.py` (hvac)** — builds an `hvac.Client` from `VAULT_ADDR` +
  (`VAULT_TOKEN` or `~/.vault-token`), reads KV v2 `kv/pikvm`, returns the three fields. Called
  directly from `deploy.py`; no bash wrapper. Fail fast, never log secret values. This is the
  first `hvac` usage in the repo (existing OpenBao access is via the `bao` CLI).
- **Read-only rootfs discipline** — every host mutation is wrapped `rw` → write → `ro`, and
  NetBird state persists to `/root/netbird-state`, per docs.pikvm.org/netbird.
- **CI runs lint + `uv sync` only** — `apply*` tasks are `runInCI: false` + `interactive: true`
  (they SSH, read OpenBao, and mutate a live host).

## Dependency Graph

```
Task 1  uv/Moon scaffold (pyproject, uv.lock, .python-version, moon.yml: install+lint)
   │
   ├── Task 2  OpenBao contract + secrets.py (hvac read of kv/pikvm)
   │
   └── Task 3  inventories + deploy.py skeleton + apply/apply_local tasks (clean --dry)
            │        (depends on Task 2 — deploy.py imports secrets.py)
            │
            ├── Task 4  NetBird overlay scaffolding (files + overlay service, rw/ro)
            │      │
            │      └── Task 5  NetBird install (AUR netbird-bin as kvmd-webterm + override)
            │             │
            │             └── Task 6  netbird up (setup key, --disable-dns=false) + state persist + restart-on-change
            │
            ├── Task 7  admin + root passwords (kvmd-htpasswd, chpasswd, rw-guarded)
            │
            └── Task 8  static IPv4 via systemd-networkd (rw-guarded, connectivity-safe)
                   │
                   └── Task 9  idempotency + over-network cutover verification
```

Order follows the graph bottom-up: foundation (1–3) before any host mutation (4–8), hardening
last (9). NetBird (4→5→6) is the riskiest and largest concern, so it lands first in Phase 2 to
fail fast. Passwords (7) and static IP (8) are independent of NetBird and of each other.

## Task List

### Phase 1: Foundation (plumbing, CI-testable, no host mutation)
- Task 1: uv + Moon project scaffold (`install`, `lint` green in CI)
- Task 2: OpenBao secret contract + `secrets.py` hvac reader
- Task 3: Inventories + `deploy.py` skeleton + `apply`/`apply_local` tasks with clean `--dry`

### Checkpoint A: Foundation
- [ ] `moon run pikvm:install` (uv sync) reproduces from `uv.lock` with no drift
- [ ] `moon run pikvm:lint` clean; `trunk check` passes on the app
- [ ] `moon run pikvm:apply_local -- --dry` connects to `192.168.1.31`, reads `kv/pikvm` from
      OpenBao, and completes with no host changes
- [ ] **Human review before proceeding to host-mutating tasks**

### Phase 2: Core convergence (host changes, one concern per slice)
- Task 4: NetBird read-only-rootfs overlay scaffolding
- Task 5: NetBird install from AUR (`netbird-bin`) + systemd override
- Task 6: `netbird up` with setup key + state persistence
- Task 7: PiKVM `admin` + system `root` passwords
- Task 8: Static IPv4 assignment (systemd-networkd)

### Checkpoint B: Core convergence (on hardware)
- [ ] Fresh-box `moon run pikvm:apply_local` converges without error
- [ ] `netbird status` shows Connected with a `100.x` IP; PiKVM reachable over NetBird
- [ ] Reboot survives (state persisted to `/root/netbird-state`); still Connected after reboot
- [ ] PiKVM web `admin` login works with the OpenBao-sourced password
- [ ] Static IP is `192.168.1.31`; Tailscale still installed and functional
- [ ] **Human review before cutover verification**

### Phase 3: Hardening & cutover
- Task 9: Idempotency + over-network apply verification

### Checkpoint C: Complete
- [ ] `moon run pikvm:apply -- --dry` over NetBird shows an empty diff (idempotent)
- [ ] All SPEC §6 manual-acceptance steps pass; manual runbook recorded
- [ ] All boundaries in SPEC §7 respected (Tailscale intact, no server-side NetBird changes)
- [ ] Ready for review / PR

---

## Tasks

### Task 1: uv + Moon project scaffold

**Description:** Create the Python project skeleton and Moon wiring so the app builds, locks,
and lints in CI before any deploy logic exists. Mirror `libs/fleet-mcp` conventions.

**Acceptance criteria:**
- [ ] `pyproject.toml` pins `pyinfra` and `hvac` to exact versions; `[dependency-groups] dev`
      has lint tooling as needed; `.python-version` matches Hermit's `python3.12`
- [ ] `uv.lock` committed and reproducible; `moon.yml` declares `language: python`,
      `layer: application`, tags `[python, pikvm, netbird, pyinfra]`, and `install` + `lint`
      tasks (`lint` cacheable, `install` = `uv sync`)
- [ ] Placeholder `deploy.py` / package layout imports cleanly (no operations yet)

**Verification:**
- [ ] `moon run pikvm:install` succeeds; re-run shows no lockfile drift
- [ ] `moon run pikvm:lint` and `trunk check apps/pikvm/...` pass
- [ ] `moon query projects` lists `pikvm`

**Dependencies:** None
**Files likely touched:** `apps/pikvm/{pyproject.toml,uv.lock,.python-version,moon.yml}`,
minimal `apps/pikvm/deploy.py`
**Estimated scope:** S (2–4 files)

---

### Task 2: OpenBao secret contract + `secrets.py`

**Description:** Implement the secrets seam: `secrets.py` builds an `hvac.Client` from
`VAULT_ADDR` + token (`VAULT_TOKEN` env or `~/.vault-token`) and reads KV v2 `kv/pikvm`,
returning `netbird_setup_key` / `admin_password` / `root_password`. Document the one-time seed.

**Acceptance criteria:**
- [ ] `secrets.py` returns the three fields from `kv/pikvm`; fails fast with a clear
      (secret-free) error if OpenBao is unreachable or a field is missing
- [ ] Never prints/logs secret values; token read from env or `~/.vault-token`
- [ ] Seed procedure documented (`secret:forward` then `bao kv put kv/pikvm …`)

**Verification:**
- [ ] With `moon run secret:forward` + `VAULT_ADDR=http://127.0.0.1:8200`, a throwaway
      `uv run python -c "import secrets; ..."` reads all three fields (values not printed)
- [ ] Missing-field and unreachable-OpenBao paths raise clear errors
- [ ] `moon run pikvm:lint` stays clean

**Dependencies:** Task 1
**Files likely touched:** `apps/pikvm/secrets.py` (+ seed note in SPEC/runbook)
**Estimated scope:** S (1–2 files)

---

### Task 3: Inventories + `deploy.py` skeleton + apply tasks (clean `--dry`)

**Description:** Add `inventories/production.py` (`$PIKVM_HOST`, default
`pikvm.tail2c33e2.ts.net`) and `inventories/local.py` (`$PIKVM_LOCAL_IP`, default
`192.168.1.31`), both SSH as `$PIKVM_SSH_USER` (default `root`). Wire Moon `apply` /
`apply_local` tasks to `uv run pyinfra <inventory> deploy.py` with `-- --dry` passthrough.
`deploy.py` calls `secrets.py` and (for now) performs only a trivial read-only fact so the full
pipeline is exercised end to end without mutating the host.

**Acceptance criteria:**
- [ ] Both inventories resolve targets from env with the documented defaults
- [ ] `apply` / `apply_local` tasks are `interactive: true`, `runInCI: false`, and forward
      passthrough args (`-- --dry`) to pyinfra
- [ ] `deploy.py` reads secrets and connects but makes no host changes yet

**Verification:**
- [ ] `moon run pikvm:apply_local -- --dry` connects to `192.168.1.31` over SSH, reads
      OpenBao, and reports no changes
- [ ] `moon run pikvm:apply -- --dry` targets `$PIKVM_HOST` (connection may be pending until
      NetBird exists — dry-run wiring is what's verified here)

**Dependencies:** Task 1, Task 2
**Files likely touched:** `apps/pikvm/inventories/{production.py,local.py}`,
`apps/pikvm/deploy.py`, `apps/pikvm/moon.yml`
**Estimated scope:** M (3–4 files)

---

### Task 4: NetBird read-only-rootfs overlay scaffolding

**Description:** First host-mutating slice. Create `/root/netbird-state`; install
`/usr/local/bin/setup-netbird-overlay.sh` and `netbird-overlay.service`; `systemctl enable` the
overlay. All writes `rw`-guarded (rw → write → ro). Unit/script files kept verbatim to the
PiKVM docs for auditability.

**Acceptance criteria:**
- [ ] `files/setup-netbird-overlay.sh` + `files/netbird-overlay.service` uploaded and overlay
      service enabled; `/root/netbird-state` exists
- [ ] Every write toggles `rw`/`ro`; rootfs is `ro` at end; re-run is a no-op

**Verification:**
- [ ] `moon run pikvm:apply_local -- --dry` on a converged box shows an empty diff for this slice
- [ ] After a real apply, `systemctl is-enabled netbird-overlay` is `enabled`; rootfs `ro`

**Dependencies:** Task 3
**Files likely touched:** `apps/pikvm/deploy.py`,
`apps/pikvm/files/{setup-netbird-overlay.sh,netbird-overlay.service}`
**Estimated scope:** M (3 files)

---

### Task 5: NetBird install from AUR + systemd override

**Description:** Install `netbird-bin` from AUR — built as unprivileged `kvmd-webterm`
(`makepkg` cannot run as root), then `pacman -U`; skip if already at the pinned version. Drop
`netbird@.service.d/pikvm.conf` (syslog logging, `NB_DISABLE_SSH_CONFIG=true`, ordering after
overlay) and `enable netbird@netbird`. All `rw`-guarded and idempotent.

**Acceptance criteria:**
- [ ] `netbird-bin` present at the pinned version; build runs as `kvmd-webterm`, install via
      `pacman -U`; re-run skips when already installed
- [ ] `netbird@.service.d/pikvm.conf` in place; `netbird@netbird` enabled; ordered after overlay

**Verification:**
- [ ] After apply, `netbird version` matches the pin; `systemctl cat netbird@netbird` shows the
      override; second `apply_local -- --dry` shows empty diff for this slice

**Dependencies:** Task 4
**Files likely touched:** `apps/pikvm/deploy.py`,
`apps/pikvm/files/netbird@.service.d/pikvm.conf`
**Estimated scope:** M (2–3 files) — **highest technical risk** (AUR build on read-only rootfs)

---

### Task 6: `netbird up` (DNS enabled) + state persistence + restart-on-change

**Description:** Start overlay + netbird; on first bring-up run
`netbird up --setup-key $NETBIRD_SETUP_KEY --disable-dns=false` (**DNS enabled** — this box
runs systemd-resolved, so NetBird uses the D-Bus backend and writes no rootfs file) **when**
`netbird status` is not already connected, and persist state. When already connected,
**reconcile**: restart `netbird@netbird` when any netbird config file changed this apply
(pyinfra change detection, `OperationMeta.did_change`) and/or flip DNS on via a `down`/`up
--disable-dns=false` cycle (the flag is sticky in `/var/lib/netbird/default.json`), then
persist state. The reconcile runs under a detached `systemd-run --wait` unit so a bounced
`wt0`/severed over-NetBird session cannot kill it mid-restart. Setup key from `secrets.py`;
never logged.

**Acceptance criteria:**
- [ ] First bring-up runs only when not connected; registers with `--disable-dns=false`
- [ ] Restart/reconcile runs only when a netbird config changed or DNS still disabled
      (`did_change`/DNS-state guard) — converged box is a no-op
- [ ] Reconcile is detached (`systemd-run --wait`) so it survives a brief SSH disconnect
- [ ] State persisted to `/root/netbird-state`; setup key never appears in logs/diff output

**Verification:**
- [ ] After apply, `netbird status` Connected `100.x`; `resolvectl status wt0` shows DNS
      scope + `netbird.cloud` domain; rootfs still `ro`; no `/etc/resolv.conf.original.netbird`
- [ ] Reboot → still Connected + DNS enabled (state survived); `apply_local -- --dry` empty diff

**Dependencies:** Task 5
**Files likely touched:** `apps/pikvm/deploy.py`
**Estimated scope:** S (1 file)

---

### Task 7: PiKVM `admin` + system `root` passwords

**Description:** Set the PiKVM web `admin` password via `kvmd-htpasswd set admin` and the system
`root` password via `chpasswd`, both from OpenBao. `rw`-guarded, idempotent, no secret logging.

**Acceptance criteria:**
- [ ] `admin` password set from `kv/pikvm.admin_password`; `root` from `root_password`
- [ ] Writes `rw`-guarded; secret values never echoed; safe to re-run

**Verification:**
- [ ] PiKVM web login as `admin` works with the OpenBao-sourced password
- [ ] Root login/SSH works with the new password; `apply_local -- --dry` clean afterward

**Dependencies:** Task 3 (independent of NetBird)
**Files likely touched:** `apps/pikvm/deploy.py`
**Estimated scope:** S (1 file)

---

### Task 8: Static IPv4 assignment (systemd-networkd)

**Description:** Assign the static IPv4 (`$PIKVM_STATIC_IP`, default `192.168.1.31`) via
systemd-networkd, `rw`-guarded and idempotent. Order the change so it cannot drop the box off
the network mid-apply. **This touches the SPEC §7 "ask first" boundary** (anything that could
drop connectivity) — confirm with the operator before first real run.

**Acceptance criteria:**
- [ ] systemd-networkd config assigns `$PIKVM_STATIC_IP`; re-run is a no-op
- [ ] Change ordered/applied so the active SSH session is not severed; `rw`/`ro` guarded

**Verification:**
- [ ] After apply, `ip addr` shows the static `192.168.1.31`; box still reachable
- [ ] `apply_local -- --dry` shows empty diff for this slice

**Dependencies:** Task 3
**Files likely touched:** `apps/pikvm/deploy.py`, `apps/pikvm/files/*.network`
**Estimated scope:** S (1–2 files) — **connectivity risk; behind operator confirmation**

---

### Task 9: Idempotency + over-network cutover verification

**Description:** Once the box is on NetBird, verify `moon run pikvm:apply` (network target) is
fully idempotent and record the manual-acceptance runbook from SPEC §6. Confirm Tailscale is
still installed and functional (migration boundary), and that no NetBird server-side config was
touched.

**Acceptance criteria:**
- [ ] `moon run pikvm:apply -- --dry` over the NetBird name shows an empty diff
- [ ] Manual-acceptance runbook (SPEC §6) recorded; Tailscale intact

**Verification:**
- [ ] Two consecutive `apply` runs: second shows no changes
- [ ] `tailscale status` still healthy; CI still runs only lint + `uv sync`

**Dependencies:** Task 6, Task 7, Task 8
**Files likely touched:** `apps/pikvm/SPEC.md` or a runbook note; possibly `moon.yml` defaults
**Estimated scope:** S (1–2 files)

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AUR `netbird-bin` build on read-only rootfs (must build as `kvmd-webterm`, `makepkg` not root) | High | Task 5 isolated + early (fail fast); pin version; verbatim to PiKVM docs; test `--dry` idempotency |
| Static-IP change drops the box mid-apply (SPEC "ask first") | High | Task 8 last; default static IP == current LAN IP (no address change); connectivity-safe ordering; operator confirmation before first run |
| Secret leakage (setup key / passwords) into logs or `--dry` diff | High | Centralize in `secrets.py`; never echo; verify diff output carries no secret values |
| OpenBao unreachable during apply (even `--dry` reads it) | Med | Fail fast with clear error; document `secret:forward` + token prerequisites in Checkpoint A |
| Rootfs left `rw` after a failed op | Med | Guard every mutation rw→write→ro; verify rootfs `ro` at end; idempotent re-run restores state |
| First `apply` (network target) can't reach box before NetBird exists | Med | Use `apply_local` for the first apply; `apply` verified only once box is on NetBird (Task 9) |
| Divergence from `apps/provisioner` Ansible (double-management) | Low | SPEC non-goals: don't port `common`/`meta.yaml`; don't retarget Ansible tasks without asking |

## Decisions (resolved with operator)

- **`hvac` auth method: token-only.** `secrets.py` uses `VAULT_TOKEN` (env) or `~/.vault-token`
  only — no AppRole/k8s auth. Matches the single-operator workflow and existing `bao` CLI usage.
- **Static IP (Task 8): included, gated by confirmation.** Keep Task 8 in scope, but require
  explicit operator go-ahead before the first real apply (default static IP `192.168.1.31`
  equals the current LAN IP, so no address change — but connectivity ordering still applies).

- **Pinned versions: latest stable at implementation time.** As of planning: `pyinfra==3.9.2`,
  `hvac==2.4.0`, NetBird `0.74.7` (AUR `netbird-bin`). Re-verify latest stable when Task 1/Task 5
  land and pin exact; Renovate maintains them thereafter. (Note: the pyinfra 3.x API differs from
  the 1.x used in `apps/hypervisor` — follow current pyinfra 3.x docs.)
- **DHCP reservation: none.** `192.168.1.31` is already treated as static; Task 8 assigns it via
  systemd-networkd with no reservation to release first.

## Open Questions

None outstanding — ready to implement on operator go-ahead.
