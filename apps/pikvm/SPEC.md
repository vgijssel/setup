# apps/pikvm — Spec

Migrate the PiKVM host from Tailscale to NetBird, managed with **pyinfra** (Python,
installed via **uv**) and wired into **Moon**. Replaces the Ansible-based PiKVM
provisioning path (`apps/provisioner` `pikvm.yml`) for the NetBird + admin-password +
static-IP concerns. Tailscale has since been fully removed from the PiKVM (packages
`tailscale` + `tailscale-pikvm`, its state/config, and the `apps/provisioner` role) —
NetBird is now the sole overlay. They cannot coexist on the host: both use
`100.64.0.0/10`, and Tailscale's anti-spoof firewall drops NetBird's inbound traffic.

## 1. Objective

Provide a single, idempotent, declarative way to bring a PiKVM onto NetBird and keep
its core config in git.

- **Who:** the repo maintainer operating the home lab (single operator, not multi-user).
- **The PiKVM *is* the provisioner host** (`192.168.1.31`); accounts are `root`, the PiKVM
  web `admin`, and `kvmd-webterm`. SSH is done as **`root`**.
- **What it does:**
  1. Installs and configures **NetBird** on the PiKVM per the official read-only-rootfs
     procedure (tmpfs overlay + systemd, AUR `netbird-bin` build, `netbird up`).
  2. Sets the **PiKVM web admin password** (`admin`) and the **system root password**.
  3. Assigns a **static IPv4** to the PiKVM (default `192.168.1.31`).
- **Two entry points**, differing only in how the host is reached:
  - `moon run pikvm:apply` — targets the PiKVM over the network (NetBird IP/name).
    Used for ongoing management once the box is on NetBird.
  - `moon run pikvm:apply_local` — targets the PiKVM directly at its **LAN IP**
    (default `192.168.1.31`). Used for the **first** apply, when the box is not yet
    reachable over NetBird.
- **Secrets** come from the **OpenBao** instance in `apps/secret`
  (`https://openbao.secret.vgijssel.nl`) — the NetBird setup key, the PiKVM admin
  password, and the root password all live there. The pyinfra script reads them at
  execution time via the **OpenBao/Vault Python SDK (`hvac`)**, not a shell wrapper.
- **Non-goals:** does not manage the NetBird server/ACLs (access policies — a group
  covering the PiKVM + client peers — are configured in the NetBird dashboard); does not
  port the Ansible `common` role or `/etc/kvmd/meta.yaml` generation (those stay in
  `apps/provisioner` for now).

## 2. Commands

All commands run from the repo root via Moon; `bao`, `uv`, and friends come from Hermit.

| Command | Purpose |
|---|---|
| `moon run pikvm:apply` | Run pyinfra against the PiKVM over the network. Host = `$PIKVM_HOST` (default `100.65.192.152`, the PiKVM's NetBird IP). |
| `moon run pikvm:apply_local` | Run pyinfra against the PiKVM at its LAN IP. Host = `$PIKVM_LOCAL_IP` (default `192.168.1.31`). Use for the first apply. |
| `moon run pikvm:apply -- --dry` | Dry-run / diff against the remote host (pyinfra `--dry`), no changes made. |
| `moon run pikvm:apply_local -- --dry` | Dry-run against the LAN host. |
| `moon run pikvm:lint` | Lint the pyinfra Python (ruff via Trunk / `uv run`). |
| `moon run pikvm:install` | `uv sync` — install/lock pinned Python deps. |

**Prerequisites for apply:** OpenBao must be reachable and the environment must carry an
address + token that `hvac` can use. Either the public ingress
(`VAULT_ADDR=https://openbao.secret.vgijssel.nl` + `VAULT_TOKEN`) or a local
port-forward (`moon run secret:forward` → `VAULT_ADDR=http://127.0.0.1:8200`, with the
token from `bao login` written to `~/.vault-token`, which `hvac` also reads). SSH access
to the PiKVM as `root`.

### Overridable inputs (env vars)

- `PIKVM_HOST` — network target for `apply` (default `100.65.192.152`, the PiKVM's NetBird IP).
- `PIKVM_LOCAL_IP` — LAN target for `apply_local` (default `192.168.1.31`).
- `PIKVM_STATIC_IP` — static IP to assign to the box (default `192.168.1.31`).
- `PIKVM_SSH_USER` — SSH user (default `root`).
- `VAULT_ADDR` / `VAULT_TOKEN` — OpenBao endpoint and token.

## 3. Project Structure

```
apps/pikvm/
├── SPEC.md                 # this file
├── moon.yml                # Moon tasks: apply, apply_local, lint, install
├── pyproject.toml          # uv project; pyinfra pinned to an exact version
├── uv.lock                 # committed lock file (reproducible)
├── .python-version         # pinned Python version
├── deploy.py               # pyinfra operations (shared by both targets)
├── secrets.py              # hvac client → reads kv/pikvm from OpenBao
├── inventories/
│   ├── production.py       # network target (reads $PIKVM_HOST)
│   └── local.py            # LAN target (reads $PIKVM_LOCAL_IP)
└── files/                  # static assets rendered/uploaded to the host
    ├── setup-netbird-overlay.sh
    ├── netbird-overlay.service
    └── netbird@.service.d/pikvm.conf
```

- **`deploy.py`** is the single source of operations; the two inventories only change the
  target host and connection. Structure it so `--dry` cleanly shows a diff.
- **`secrets.py`** is the seam for secrets: a thin helper that builds an `hvac.Client`
  from `VAULT_ADDR` + token (`VAULT_TOKEN` env or `~/.vault-token`) and reads KV v2 path
  `kv/pikvm`, returning `netbird_setup_key` / `admin_password` / `root_password`.
  `deploy.py` calls it directly — no bash wrapper. Fail fast with a clear error if OpenBao
  is unreachable or a field is missing; never print secret values.
- Moon `apply*` tasks invoke `uv run pyinfra <inventory> deploy.py` directly, inheriting
  `VAULT_ADDR`/`VAULT_TOKEN` from the environment.
- Follow repo layout rules: everything under `apps/pikvm`; no new top-level dirs.

### OpenBao secret contract

Single KV v2 path `kv/pikvm` (mount `kv`) with fields:

| Field | Used for |
|---|---|
| `netbird_setup_key` | `netbird up --setup-key …` |
| `admin_password` | `kvmd-htpasswd set admin` |
| `root_password` | system root password (`chpasswd`) |

Seed manually once: `moon run secret:forward` then
`bao kv put kv/pikvm netbird_setup_key=… admin_password=… root_password=…`.

## 4. NetBird install (target behavior, per docs.pikvm.org/netbird)

`deploy.py` must reproduce the official flow **idempotently**, honoring the read-only
rootfs (`rw` before writes, `ro` after; persist state to `/root/netbird-state`):

1. Create `/root/netbird-state`; install overlay helper `/usr/local/bin/setup-netbird-overlay.sh`
   and `netbird-overlay.service`; `systemctl enable` it.
2. Install `netbird-bin` from AUR — build as unprivileged `kvmd-webterm`
   (`makepkg` cannot run as root), then `pacman -U`. Skip if already installed at the
   pinned version.
3. Drop the systemd override `netbird@.service.d/pikvm.conf` (syslog logging,
   `NB_DISABLE_SSH_CONFIG=true`, ordering after overlay); `enable netbird@netbird`.
4. Start overlay + netbird; when `netbird status` is not already connected, register with
   `netbird up --setup-key $NETBIRD_SETUP_KEY --disable-dns=false` (**DNS enabled**).
   NetBird's default `--disable-dns` avoids writing `/etc/resolv.conf` on a read-only
   rootfs, but this box runs **systemd-resolved** (`/etc/resolv.conf` → tmpfs `/run`), so
   NetBird uses its systemd-resolved **D-Bus** backend and configures DNS at runtime with
   **no rootfs write** (verified live: "System DNS manager discovered: systemd", rootfs
   stays `ro`, no `/etc/resolv.conf.original.netbird`).
5. Persist state back to `/root/netbird-state`; leave the fs `ro`.
6. **Restart NetBird when its config changed:** when a netbird config file changed this
   apply (systemd override / overlay unit — detected via pyinfra change detection,
   `OperationMeta.did_change`) or DNS is still disabled, reconcile the running peer:
   `daemon-reload` + restart `netbird@netbird`, then `netbird down` + `netbird up
   --disable-dns=false` (a flag change needs a down/up cycle; `DisableDNS` is sticky in
   `/var/lib/netbird/default.json`), then persist state. This bounces the `wt0` interface
   and can sever an over-NetBird apply session, so it runs under a **detached
   `systemd-run --wait` unit** (like the OS update) — a dropped session cannot kill it
   mid-restart; a re-run converges to a no-op.
7. Set admin + root passwords; assign the static IP (systemd-networkd) — all `rw`-guarded
   and idempotent.

## 5. Code Style

- **Python:** pyinfra deploy/inventory files. Match repo Python conventions — ruff/black
  via Trunk, type hints where they help, small named operation blocks with clear `name=`.
- **Dependencies pinned exactly** (CLAUDE.md): `pyinfra` and `hvac` pinned to exact
  versions in `pyproject.toml`, resolved in `uv.lock`. No `uvx`/`npx`. Python version
  pinned via `.python-version`.
- **Idempotency first:** every operation must be safe to re-run; guard host mutations with
  presence checks; wrap read-only-fs writes with `rw`/`ro`.
- **No secrets in git or in `moon.yml`:** secrets are fetched at runtime from OpenBao via
  `hvac` in `secrets.py`; only `VAULT_ADDR`/`VAULT_TOKEN` come from the environment. Never
  echo/log secret values.
- **Moon conventions:** `language: python`, `layer: application`, tags incl. `pikvm`,
  `netbird`, `pyinfra`; infra tasks `options: { runInCI: false }`; `apply*` tasks
  `interactive: true` (they SSH and may prompt).
- **Naming:** files follow existing repo patterns; systemd/unit files kept verbatim to the
  PiKVM docs for auditability.

## 6. Testing Strategy

Infra app — "tests" are validation, not unit tests against live hardware:

- **Dry run / diff:** `moon run pikvm:apply -- --dry` (and `apply_local -- --dry`) must run
  clean and show an empty diff when the host is already converged. This is the primary
  correctness check. Note: `--dry` still reads from OpenBao (via `hvac`), so OpenBao must
  be reachable even for a dry run — the read is harmless.
  - **Caveat — the Task 6 reconcile op always shows as a `Conditional Change` in `--dry`,
    even when converged.** pyinfra only evaluates `_if` guards at real execution
    (`state.is_executing`); in `--dry` it instead generates the op's commands, and shell
    commands always *look* like a change. So the reconcile's `Change` column is `-` but
    its `Conditional Change` is `1`. The authoritative idempotency signal is a **real
    run** reporting `No changes` for every op — verified on both targets (LAN
    `192.168.1.31` and NetBird `100.65.192.152`): 8/8 `No Change`, reconcile skipped.
- **Lint:** `moon run pikvm:lint` — ruff/black clean; `trunk check` passes on the app.
- **Lock integrity:** `uv sync` reproduces from `uv.lock` with no drift.
- **Manual acceptance (documented, not automated):**
  1. Fresh box: `moon run pikvm:apply_local` → `netbird status` shows Connected with a
     `100.x` IP; PiKVM reachable over NetBird; survives a reboot (state persisted).
  2. Admin login works with the OpenBao-sourced password; static IP is `192.168.1.31`.
  3. `moon run pikvm:apply` (over the network) is then idempotent (empty `--dry` diff).
- **CI:** only lint + `uv sync` run in CI (`runInCI: false` on apply tasks — they need a
  live host and OpenBao).

## 7. Boundaries

**Always**
- Keep every operation idempotent and re-runnable.
- Toggle `rw`/`ro` around writes and persist NetBird state to `/root/netbird-state`.
- Pull the setup key + passwords from OpenBao at runtime; pin all deps exactly.

**Ask first**
- Changing the static IP away from `192.168.1.31`, or anything that could drop the box off
  the network mid-apply (IP change ordering vs. connectivity).
- Introducing a self-hosted NetBird management URL or new OpenBao paths/mounts.
- Deleting or retargeting the existing Ansible `apps/provisioner` PiKVM tasks.

**Never**
- Commit secrets, tokens, or the setup key to git; never log secret values.
- Use `uvx`/`npx` or unpinned dependencies.
- Write to the PiKVM rootfs without a matching `rw`/`ro` guard.
- Manage NetBird server-side config (ACLs, groups, keys lifecycle) from this app.

## 8. Cutover & manual-acceptance runbook

The empty-`--dry`-diff idempotency check and the acceptance steps below run against the
**live** PiKVM (facts only report "converged" on the real box), so they are performed by
the operator, not in CI. CI covers only lint + `uv sync`; every host mutation in
`deploy.py` is gated by a fact check or self-verifies, so a converged box makes no changes.

### 8.0 Prerequisites (once per session)

```bash
moon run secret:forward                      # port-forward OpenBao to 127.0.0.1:8200
export VAULT_ADDR=http://127.0.0.1:8200
bao login                                    # writes token to ~/.vault-token (hvac reads it)
# One-time seed of kv/pikvm (if not already present):
# bao kv put kv/pikvm netbird_setup_key=… admin_password=… root_password=…
```

SSH to the PiKVM as `root` must work. The default static IP (`192.168.1.31`) equals the
current LAN IP, so no address change occurs; **get explicit sign-off before changing
`PIKVM_STATIC_IP`/gateway** (SPEC §7 — could drop the box mid-apply).

### 8.1 First apply (LAN target)

```bash
moon run pikvm:apply_local -- --dry          # review the diff first — no secret values shown
moon run pikvm:apply_local                    # converge the box
```

Verify:
- `netbird status` → `Management: Connected`, peer IP is `100.x`.
- **DNS enabled with no rootfs write:** `resolvectl status wt0` shows `Current Scopes: DNS`
  and `DNS Domain: netbird.cloud`; `findmnt -no OPTIONS /` still `ro`; no
  `/etc/resolv.conf.original.netbird` (NetBird used the systemd-resolved D-Bus backend).
- PiKVM reachable over NetBird (`ssh root@<netbird-name-or-100.x>`).
- `reboot`, wait, reconnect → still `Connected` (state persisted to `/root/netbird-state`).
- PiKVM web login as `admin` works with the OpenBao `admin_password`; `root` login works
  with `root_password`.
- `ip addr show eth0` → static `192.168.1.31/24`.
- Rootfs is `ro` at rest: `findmnt -no OPTIONS /` shows `ro`.

### 8.2 Cutover to the network target + idempotency

Once the box answers on NetBird, run `apply` against its NetBird IP (the default) and
confirm it is a no-op:

```bash
# PIKVM_HOST defaults to 100.65.192.152 (the PiKVM's NetBird IP); override if it changed.
moon run pikvm:apply -- --dry                  # MUST show an empty diff (idempotent)
moon run pikvm:apply                           # first run
moon run pikvm:apply                           # second run MUST report no changes
```

**NetBird reachability prerequisite:** the client and the PiKVM must be in a NetBird
group covered by an enabled access policy (peers with no group are default-denied).
Configure this in the NetBird dashboard — it is not managed here.

### 8.3 Boundary confirmations (SPEC §7)

- Tailscale is fully removed from the PiKVM (`tailscale`/`tailscale-pikvm` packages,
  state, and the `apps/provisioner` role) — NetBird is the sole overlay. It could not
  run alongside NetBird (shared `100.64.0.0/10`; Tailscale's firewall dropped NetBird).
- No NetBird server-side config (ACLs, groups, key lifecycle) was touched by this app —
  it only runs `netbird up --setup-key` against the default management URL.
- CI still runs only `pikvm:lint` + `pikvm:install` (`apply*` are `runInCI: false`).
