# apps/pikvm — Spec

Migrate the PiKVM host from Tailscale to NetBird, managed with **pyinfra** (Python,
installed via **uv**) and wired into **Moon**. Replaces the Ansible-based PiKVM
provisioning path (`apps/provisioner` `pikvm.yml`) for the NetBird + admin-password +
static-IP concerns. Tailscale stays installed during the transition.

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
  - `moon run pikvm:apply` — targets the PiKVM over the network (NetBird/Tailscale
    hostname). Used for ongoing management once the box is reachable.
  - `moon run pikvm:apply_local` — targets the PiKVM directly at its **LAN IP**
    (default `192.168.1.31`). Used for the **first** apply, when the box is not yet on
    NetBird or Tailscale.
- **Secrets** come from the **OpenBao** instance in `apps/secret`
  (`https://openbao.secret.vgijssel.nl`) — the NetBird setup key, the PiKVM admin
  password, and the root password all live there. The pyinfra script reads them at
  execution time via the **OpenBao/Vault Python SDK (`hvac`)**, not a shell wrapper.
- **Non-goals:** does not manage the NetBird server/ACLs; does not remove Tailscale (kept
  in parallel for now); does not port the Ansible `common` role or `/etc/kvmd/meta.yaml`
  generation (those stay in `apps/provisioner` for now).

## 2. Commands

All commands run from the repo root via Moon; `bao`, `uv`, and friends come from Hermit.

| Command | Purpose |
|---|---|
| `moon run pikvm:apply` | Run pyinfra against the PiKVM over the network. Host = `$PIKVM_HOST` (default `pikvm.tail2c33e2.ts.net`; switch to the NetBird name once known). |
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

- `PIKVM_HOST` — network target for `apply` (default `pikvm.tail2c33e2.ts.net`).
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
4. Start overlay + netbird; run `netbird up --setup-key $NETBIRD_SETUP_KEY --disable-dns`
   only when `netbird status` is not already connected.
5. Persist state back to `/root/netbird-state`; leave the fs `ro`.
6. Set admin + root passwords; assign the static IP (systemd-networkd) — all `rw`-guarded
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
- Keep Tailscale installed and functional during the migration.

**Ask first**
- Removing/uninstalling Tailscale or dropping the `tailscale` role from the PiKVM path.
- Changing the static IP away from `192.168.1.31`, or anything that could drop the box off
  the network mid-apply (IP change ordering vs. connectivity).
- Introducing a self-hosted NetBird management URL or new OpenBao paths/mounts.
- Deleting or retargeting the existing Ansible `apps/provisioner` PiKVM tasks.

**Never**
- Commit secrets, tokens, or the setup key to git; never log secret values.
- Use `uvx`/`npx` or unpinned dependencies.
- Write to the PiKVM rootfs without a matching `rw`/`ro` guard.
- Manage NetBird server-side config (ACLs, groups, keys lifecycle) from this app.
