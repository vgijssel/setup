# SPEC — Declarative pyinfra for `apps/pikvm`

Status: **draft, awaiting confirmation**
Scope: `apps/pikvm/` (the deploy) and a new shared library `libs/pyinfra-custom/`.

## 1. Objective

Rewrite the PiKVM pyinfra deploy so it reads **declaratively**. Today `deploy.py`
drives nearly everything through `server.shell` with hand-rolled fact gating; the
"pyinfra way" is [operations](https://docs.pyinfra.com/en/3.x/operations.html) that
declare desired state and self-verify, and [facts](https://docs.pyinfra.com/en/3.x/facts.html)
that read current state.

Concretely:

1. Replace raw `server.shell` calls with **operations** — an existing pyinfra
   operation where one fits (`pacman.packages`, `systemd.service`, `files.*`,
   `server.reboot`), or a **custom operation** in `libs/pyinfra-custom` where one
   genuinely earns its keep (idempotency + reuse).
2. Replace the ad-hoc `host.get_fact(Command, command=...)` probes with **facts** —
   custom facts in `libs/pyinfra-custom`, each
   [guarded by `requires_command`](https://docs.pyinfra.com/en/3.x/api/facts.html#guarding-against-missing-binaries-requires_command)
   so a box without the binary reports cleanly instead of erroring.
3. Turn each **individual OpenBao secret into a pyinfra fact** (`OpenBaoSecret`),
   fetched via the `hvac` SDK, so `deploy.py` reads secrets the same way it reads
   any other host state: `host.get_fact(OpenBaoSecret, field=...)`.
4. Formalize the **read-only-rootfs `rw`/`ro` discipline** into a single custom
   operation/context so `deploy.py` never issues `rw`/`ro` by hand.

Target reader experience: `deploy.py` becomes a top-to-bottom list of operations and
fact reads with almost no inline shell, while preserving every behavioral guarantee
of the current deploy (idempotent, empty `--dry` on a converged box, secret-safe,
read-only-rootfs-safe, SSH-disconnect-safe).

**Non-goal:** changing *what* the deploy does on the box. Behavior is reproduced
verbatim from the current `deploy.py` and https://docs.pikvm.org/netbird/. Asset files
under `files/` stay byte-for-byte to the PiKVM docs.

### Target users

The single operator (repo owner) running `moon run pikvm:apply[_local]`, and future
maintainers reading the deploy to understand what the box converges to.

## 2. Decisions (from clarification)

| Area | Decision |
|------|----------|
| OpenBao secrets | Custom fact `OpenBaoSecret`, **`hvac` SDK inside the fact**, one field per read. No `bao` CLI dependency; the PiKVM never receives a Vault token. |
| Rootfs `rw`/`ro` | A **custom operation/context** in `libs/pyinfra-custom` wraps writes; `deploy.py` issues no bare `rw`/`ro`. |
| Imperative host actions | **Pragmatic:** custom operations only where they add idempotency/reuse; genuinely one-shot sequences stay as documented `server.shell`. |
| Library layout | A **single shared library** `libs/pyinfra-custom` holding all custom facts and operations (incl. `OpenBaoSecret`). |

## 3. Commands

New/changed Moon tasks:

```bash
# apps/pikvm (unchanged surface)
moon run pikvm:install        # uv sync
moon run pikvm:lint           # ruff check .
moon run pikvm:apply          # pyinfra over NetBird (interactive, never CI)
moon run pikvm:apply_local    # pyinfra over LAN (first apply)
moon run pikvm:apply -- --dry # dry run; MUST be empty on a converged box

# libs/pyinfra-custom (new project)
moon run pyinfra-custom:install   # uv sync
moon run pyinfra-custom:lint      # ruff check .
moon run pyinfra-custom:test      # pytest (facts + operations unit tests) — runs in CI

# repo
moon check --all                  # build/test/lint everything affected
```

`apps/pikvm` consumes the library via a `uv` path source in
`apps/pikvm/pyproject.toml`:

```toml
dependencies = ["pyinfra==3.9.2", "hvac==2.4.0", "pyinfra-custom"]
[tool.uv.sources]
pyinfra-custom = { path = "../../libs/pyinfra-custom", editable = true }
```

## 4. Project structure

```
libs/pyinfra-custom/
├── pyproject.toml                # name="pyinfra-custom", deps: pyinfra==3.9.2, hvac==2.4.0
├── moon.yml                      # layer: library; tasks: install, lint, test
├── src/pyinfra_custom/
│   ├── __init__.py
│   ├── facts/
│   │   ├── __init__.py
│   │   ├── openbao.py            # OpenBaoSecret (hvac), SecretsError
│   │   ├── netbird.py            # NetbirdVersion, NetbirdConnected, NetbirdDnsDisabled
│   │   └── pacman.py             # PacmanUpgradablePackages (or reuse pyinfra.facts.pacman)
│   └── operations/
│       ├── __init__.py
│       ├── rootfs.py             # writable() context / remount operation
│       ├── netbird.py            # up() registration operation
│       └── pikvm.py              # htpasswd() operation
└── tests/
    ├── test_openbao_fact.py
    ├── test_netbird_facts.py
    └── test_operations.py

apps/pikvm/
├── deploy.py                     # rewritten: declarative, imports pyinfra_custom
├── pyproject.toml                # + pyinfra-custom path dependency
├── moon.yml                      # unchanged task surface
├── inventories/                  # unchanged (production.py, local.py)
└── files/                        # unchanged, byte-for-byte to PiKVM docs
# secrets.py is REMOVED; its logic moves into pyinfra_custom/facts/openbao.py
```

### 4.1 Facts (custom, in `pyinfra_custom.facts`)

| Fact | Replaces | `requires_command` | Notes |
|------|----------|--------------------|-------|
| `OpenBaoSecret(mount, path, field)` | `secrets.py` `get_secrets()` | — (runs locally) | Fetches one field via `hvac` **on the control machine** during fact resolution. Its remote command echoes a **fixed constant** (never the secret); the value is fetched in the fact's local `command()` callable and returned from `process()`, so secret material is **never transmitted to the PiKVM** and never appears in `--dry`. Raises a secret-free error if OpenBao is unreachable / field missing. |
| `PacmanUpgradablePackages` | `pacman -Qu \| wc -l` Command probe | `pacman` | Count/list of upgradable packages; drives the OS-update gate. |
| `NetbirdVersion` | `netbird version` Command probe | `netbird` | Installed version; drives the install gate against the `NETBIRD_VERSION` pin. |
| `NetbirdConnected` | `netbird status` Command probe | `netbird` | `True` when `Management: Connected`; picks first-bring-up vs reconcile. |
| `NetbirdDnsDisabled` | `grep DisableDNS default.json` probe | `netbird` | Current persisted DNS setting; drives the DNS-enable reconcile. |

### 4.2 Operations (custom, in `pyinfra_custom.operations`)

| Operation | Replaces | Idempotency |
|-----------|----------|-------------|
| `rootfs.writable(changed_if=...)` (context manager) | every hand-written `rw` … `ro` pair | Emits `rw` **only** when `changed_if` is true (some file in the guarded block is out of sync), yields to the wrapped `files.*` operations, then emits `ro` symmetrically. Converged box ⇒ no remount ⇒ empty `--dry`. |
| `netbird.up(setup_key=..., disable_dns=False)` | `netbird up --setup-key ...` shell | Passes the key via `_env`/`$NB_SETUP_KEY` (never in argv/`--dry`); no-op semantics documented for an already-connected peer. |
| `pikvm.htpasswd(user, password)` | `kvmd-htpasswd set ... --read-stdin` shell | Password via `_env`; change detected via the existing root-only fingerprint file (no plaintext on disk). |

### 4.3 Shell → existing pyinfra operations (no custom code)

| Current shell | Becomes |
|---------------|---------|
| `systemctl daemon-reload` + `systemctl enable X` | `systemd.service(X, enabled=True, daemon_reload=True)` |
| `systemctl start X` | `systemd.service(X, running=True)` |
| `pacman -Sy --needed --noconfirm git base-devel` | `pacman.packages(["git","base-devel"], update=True)` |
| `reboot` | `server.reboot` (already used) |
| `files.directory` / `files.put` | unchanged (already operations) |

### 4.4 Documented `server.shell` that intentionally stays (pragmatic)

These are genuinely one-shot / no-operation-exists cases. They keep an explanatory
comment and, where relevant, a fact-based `_if` guard:

- **`pikvm-update`** under `systemd-run --wait` — one-shot major upgrade with a
  bespoke exit-code contract (`0/100` ok, `101` abort); gated by
  `PacmanUpgradablePackages`.
- **AUR `netbird-bin` build** — `git clone` + `makepkg` (as `kvmd-webterm`) +
  `pacman -U` of the built package; gated by `NetbirdVersion`. **Never** run as root;
  **never** a full `pacman -Syu`.
- **NetBird reconcile** under a detached `systemd-run` unit — required so a bounced
  `wt0` cannot kill the apply's own SSH session mid-restart.
- **`chpasswd`** for the system `root` password — no clean pyinfra operation; secret
  via `_env`, gated by the shared password fingerprint.
- **`networkctl reload` / `reconfigure`** — no pyinfra operation exists.

## 5. Code style

- Python ≥ 3.12; format/lint with **ruff** (`ruff==0.14.14`, matching current) via
  Trunk (`trunk fmt` / `trunk check`).
- Custom facts subclass `pyinfra.api.FactBase`; custom operations use the pyinfra
  `@operation()` decorator and `yield` commands (no side-effecting shell in the
  operation body beyond yielded commands).
- Every custom fact that reads the host declares `requires_command`.
- Docstrings preserve the safety rationale currently living in `deploy.py` comments
  (read-only rootfs, SSH-disconnect safety, secret handling, exit-code contracts).
- **Pinned dependencies only** (repo policy): exact versions in every `pyproject.toml`;
  no `npx`/`uvx`; Renovate owns bumps (incl. the `NETBIRD_VERSION` pin).
- Naming: modules/functions snake_case; fact classes CamelCase.

## 6. Testing strategy

- **`libs/pyinfra-custom` — unit tests (pytest), run in CI** (`pyinfra-custom:test`):
  - `OpenBaoSecret`: with `hvac` mocked — returns the field; raises secret-free
    `SecretsError` on unreachable/unauthenticated/missing-field; the value never
    appears in the yielded remote command (assert the remote command is a no-op).
  - `NetbirdVersion` / `NetbirdConnected` / `NetbirdDnsDisabled` /
    `PacmanUpgradablePackages`: `process()` maps representative CLI output to the
    right value; `requires_command` is set.
  - Operations: the correct commands are yielded and the `changed_if` / `_env`
    guards behave (no `rw` when converged; secret passed via env, absent from argv).
- **`apps/pikvm` — lint only in CI** (`pikvm:lint`), as today. `apply*` SSH into a
  live host, read OpenBao, and mutate it — **never in CI** (`runInCI: false`).
- **Acceptance (manual, operator-run):**
  1. `moon run pyinfra-custom:test` green; `moon run pikvm:lint` clean.
  2. `moon run pikvm:apply -- --dry` on a **converged** box ⇒ **empty diff**
     (no remounts, no restarts, no password writes).
  3. `--dry` output contains **no secret material** (setup key, passwords).
  4. A real `moon run pikvm:apply_local` converges a box to the same end state as the
     pre-refactor deploy: NetBird connected with DNS enabled, rootfs `ro`, static IP
     pinned, admin/root passwords set, root SSH key authorized.
  5. Re-running `apply` is a no-op (idempotent).

## 7. Boundaries

**Always**

- rw-guard every rootfs write; leave the rootfs `ro` at the end of every slice.
- Fetch OpenBao secrets on the **control machine**; pass them to the host only via
  `_env` referenced as `$VARS`; keep them out of argv, logs, and `--dry`.
- Keep `files/` assets byte-for-byte with the PiKVM docs for auditability.
- Pin all dependencies to exact versions.
- Preserve the existing operator SSH key authorization as the first slice (LAN
  fallback before NetBird bring-up).

**Ask first**

- Changing `PIKVM_STATIC_IP` / gateway / interface, or anything that could drop the
  box mid-apply — get sign-off and run `--dry` first.
- The first apply after this refactor — prefer `apply_local` over the LAN.
- Adding any new external dependency to either project.

**Never**

- Put a Vault token or OpenBao credentials on the PiKVM.
- Transmit secret values to the host in argv or files, or log them.
- Run `makepkg` as root, or run a full `pacman -Syu` (breaks the `python-periphery`
  pin — ALARM ships python 3.14).
- Commit secrets, or weaken the secret-free error messages.
- Change on-box behavior vs the current deploy without calling it out.

## 8. Open risks

- **hvac-in-fact seam:** pyinfra facts run a command via the host connector.
  `OpenBaoSecret` deliberately fetches in its local `command()` callable and returns
  a constant-echo remote command; if a future pyinfra version changes fact evaluation
  this seam must be revisited (covered by a unit test asserting the remote command is a
  fixed constant carrying no secret).
- **`uv` path dependency:** the repo has no `uv` workspace; `apps/pikvm` pulls the lib
  via a `[tool.uv.sources]` path. Verify `uv sync` + `pyinfra` import resolution works
  under Moon caching before finalizing.
```
