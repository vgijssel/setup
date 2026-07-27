# Plan: PiKVM System-Health Validation (goss serve + `validate`)

## Context

The PiKVM host currently has no continuous, machine-readable signal of whether its
critical subsystems (NetBird mesh connectivity, DNS, the NetBird service) are healthy.
An operator has to manually poke around after every change or reboot, and there's no
scrape target for future netdata dashboards/alerts.

This change installs [`goss`](https://github.com/goss-org/goss) `v0.4.10` as a
long-lived daemon (`goss serve`) bound to **localhost only** (`127.0.0.1:8080`), driven
by a declarative `goss.yaml` of 5 health assertions, plus a thin `validate` client that
queries the daemon for a human-readable pass/fail report. Outcome:

- `validate` on the box → rspecish report, exit `0` when all 5 checks pass, non-zero otherwise.
- `curl -s localhost:8080/healthz` → Prometheus verbose text, one metric per assertion (netdata-ready).
- Daemon is systemd-enabled (survives reboot) and reachable only from the box itself.

Full contract lives in `apps/pikvm/SPEC.md`. This plan is grounded in the existing
declarative, fact-gated, read-only-rootfs discipline of `apps/pikvm/deploy.py`.

## Decisions (resolved with user)

1. **Install gate = new `GossVersion` custom fact** in `libs/pyinfra-custom` (mirrors
   `NetbirdVersion`), with a unit test — over an inline generic `Command` fact. Keeps
   the codebase consistent and testable. (SPEC "ask first" item — approved.)
2. **DNS assertion = goss native `dns` resource first, with a `getent hosts` fallback.**
   Implement the `dns` resource, verify on-host at the functional checkpoint, swap to
   `command: getent hosts <fqdn>` (exit-status 0) only if the Go resolver fails to
   traverse the systemd-resolved `127.0.0.53` stub (see repo memory `pikvm-netbird-dns`).

## Dependency graph

```
GossVersion fact (libs/pyinfra-custom)         ← Phase A (foundation, standalone-testable)
        │  used by
        ▼
goss binary install (download+sha256+install)  ← Phase B
        │
        ├── files/goss-serve.service (unit)     ┐
        ├── files/validate (client)             │  all written in one rw window,
        └── files/goss.yaml (assertions)        ┘  Sha256File-gated
                    │
                    ▼
        systemd enable + start + conditional restart on change
                    │
                    ▼
        on-host functional verification (port free? localhost-only? validate works?)
                    │
                    ▼
        expand goss.yaml to all 5 assertions    ← Phase C
```

Phase B is the thinnest complete end-to-end path (install → daemon → client → curl),
proven with a **minimal** `goss.yaml` (just the port self-check). Phase C layers the
remaining 4 assertions once the pipeline is known-good. Phase A is an independent
library change gated only by its own unit test.

## Phase A — `GossVersion` fact (foundation)

**Files:**
- `libs/pyinfra-custom/src/pyinfra_custom/facts/goss.py` (new)
- `libs/pyinfra-custom/src/pyinfra_custom/facts/__init__.py` (edit: import + `__all__`)
- `libs/pyinfra-custom/tests/test_facts.py` (edit: add test)

**What:** New `GossVersion(FactBase[str])` mirroring `NetbirdVersion`
(`facts/netbird.py:13`): `default = str`, `requires_command → "goss"`,
`command → "goss --version"`, `process → "\n".join(output).strip()`. Confirm the exact
CLI flag (`goss --version` vs `goss version`) against the pinned release during build.
Export it from `facts/__init__.py` alongside the other facts.

**Acceptance criteria:**
- `GossVersion` importable via `from pyinfra_custom.facts import GossVersion`.
- Returns `""` when goss absent; returns the version string otherwise.
- New unit test follows the `test_netbird_version_requires_command_and_parses` pattern
  (`tests/test_facts.py:15`): asserts `requires_command()`, `command()`, and `process()`.

**Verify:**
- `moon run libs/pyinfra-custom:test`
- `moon run libs/pyinfra-custom:lint`

### ✅ Checkpoint 1 — lib green before touching the deploy
`moon run libs/pyinfra-custom:test` and `:lint` both pass. Do not proceed until green.

## Phase B — minimal end-to-end goss daemon + `validate`

**Files:**
- `apps/pikvm/files/goss-serve.service` (new) — unit per SPEC (§ "files/goss-serve.service"):
  `ExecStart=/usr/local/bin/goss --gossfile /etc/goss/goss.yaml serve --listen-addr
  127.0.0.1:8080 --endpoint /healthz --format prometheus --format-options verbose`,
  `After=network-online.target netbird@netbird.service`, `Restart=on-failure`, `User=root`.
- `apps/pikvm/files/validate` (new) — curl client per SPEC (§ "files/validate"):
  `Accept: application/vnd.goss-rspecish`, prints body, exits non-zero unless HTTP 200.
- `apps/pikvm/files/goss.yaml` (new) — **minimal**: only the `port: tcp:8080` assertion
  (`listening: true`, `ip: [127.0.0.1]`) so the pipeline self-tests before real checks.
- `apps/pikvm/deploy.py` (edit) — add `# ── Task 10: goss system-health validation ──`
  section at the end (after Task 9, ~line 638), and add `GossVersion` to the
  `pyinfra_custom.facts` import block (`deploy.py:42`).

**Task 10 structure** (follows the existing fact-gated / `rootfs.writable` idiom — see
Task 5 `deploy.py:250` for install-gating and Task 8 `deploy.py:476` for config+unit):
- Constants: `GOSS_VERSION="0.4.10"`, `GOSS_ARCH="arm64"`, `GOSS_SHA256=...`, `GOSS_URL`.
- Install gate: `goss_needs_install = GOSS_VERSION not in host.get_fact(GossVersion)`.
  When true, inside `rootfs.writable(changed_if=True)` run a `server.shell` that
  `curl`s the tarball, `sha256sum -c`, extracts, and `install -m 0755` to `/usr/local/bin/goss`.
- Read the three `files/` payloads (`Path(...).read_text` like Task 8 `deploy.py:496`),
  compute `hashlib.sha256` of each, build `goss_needs_rw` from `Sha256File` facts for
  `/etc/goss/goss.yaml`, `/usr/local/bin/validate`, `/etc/systemd/system/goss-serve.service`.
- `with rootfs.writable(changed_if=goss_needs_rw):` → `files.directory(/etc/goss)`,
  `files.put` for goss.yaml (644), validate (755), unit (644); capture the goss.yaml and
  unit `files.put` results.
- `systemd.service(service="goss-serve.service", running=None, enabled=True,
  daemon_reload=True)` gated by `if goss_needs_rw:` (enable-only, matching Task 5
  `deploy.py:318`), then `systemd.service(..., running=True)` to ensure it's up.
- Conditional restart via `server.shell(..., _if=lambda: goss_cfg.did_change() or
  goss_unit.did_change())` doing `systemctl daemon-reload; systemctl restart
  goss-serve.service` — mirrors Task 9 `deploy.py:631`.

**Acceptance criteria:**
- `moon run pikvm:lint` passes.
- First `--dry` shows the install + writes + enable; a second `--dry` after a real apply
  shows **no changes** for Task 10 (idempotency).
- On-host: `systemctl is-active goss-serve.service` → `active`; `ss -ltnp 'sport = :8080'`
  → bound to `127.0.0.1:8080` only (never `0.0.0.0`); `validate` prints rspecish and exits `0`;
  `curl -s localhost:8080/healthz` → Prometheus text.

**Verify:**
- `moon run pikvm:lint`
- `cd apps/pikvm && uv run pyinfra inventories/production.py deploy.py --dry` (or
  `inventories/local.py` for LAN first bring-up) — inspect Task 10 diff.
- `moon run pikvm:apply` (or `pikvm:apply_local`), then re-run `--dry` → Task 10 clean.
- On box: the four on-host commands above.

### ✅ Checkpoint 2 — pipeline proven + open questions resolved (needs human + on-host)
Resolve SPEC Open Questions before Phase C:
1. **Port 8080 free?** `ss -ltnp 'sport = :8080'` on the box shows nothing else owns it.
   If taken → **ask first** (SPEC boundary), pick another loopback port, update the
   `port` assertion accordingly.
2. **`ping` privileges** — confirm `net.ipv4.ping_group_range` allows root ICMP (Phase C).
3. **DNS** — decision to `dns`-first/`getent`-fallback carries into Phase C.
Do not proceed until the daemon is confirmed localhost-only and `validate` works E2E.

## Phase C — full 5-assertion contract

**Files:**
- `apps/pikvm/files/goss.yaml` (edit) — expand from the single port check to all 5
  assertions per the SPEC contract (§ "files/goss.yaml"):
  1. `command: netbird-connected` — `netbird status`, exit 0, stdout contains `Management: Connected`.
  2. `command: ping-100.65.134.8` — `ping -c 2 -W 2 100.65.134.8`, exit 0.
  3. `dns: macbook-pro-van-maarten.netbird.cloud` — `resolvable: true` (fallback: `command: getent hosts <fqdn>` exit 0).
  4. `service: netbird@netbird` — `enabled: true`, `running: true`.
  5. `port: tcp:8080` — `listening: true`, `ip: [127.0.0.1]` (carried from Phase B).

Only `goss.yaml` changes — the daemon reads it fresh on every request, and the
Sha256File gate + conditional restart from Phase B already handle redeploy/reload.

**Acceptance criteria:**
- On a healthy box, `validate` shows all 5 checks passing, exit `0`; `curl` Prometheus
  output has one metric line per assertion.
- Failure injection: stop/disconnect NetBird → `validate` flips to failing + non-zero exit,
  and the corresponding metric(s) report failure.
- `--dry` idempotent on a converged host; `moon run pikvm:lint` passes.

**Verify:**
- Redeploy (`pikvm:apply` / `apply_local`), re-run `--dry` → clean.
- On box: `validate` (all pass), then `netbird down` (or stop the service) → `validate`
  fails non-zero → restore → passes again.
- `curl -s localhost:8080/healthz` → 5 per-test metric lines.
- Confirm the `dns` resource resolves the FQDN; if not, swap assertion #3 to the `getent`
  form and redeploy.

### ✅ Checkpoint 3 — reboot survival + final sign-off
`reboot` the box; after boot `goss-serve.service` is enabled + active and `validate`
passes. Tick every box in SPEC.md "Success Criteria". Then commit.

## Files touched (summary)

| Path | Change |
|------|--------|
| `libs/pyinfra-custom/src/pyinfra_custom/facts/goss.py` | new — `GossVersion` fact |
| `libs/pyinfra-custom/src/pyinfra_custom/facts/__init__.py` | edit — export `GossVersion` |
| `libs/pyinfra-custom/tests/test_facts.py` | edit — `GossVersion` unit test |
| `apps/pikvm/files/goss.yaml` | new — 5-assertion spec (minimal in B, full in C) |
| `apps/pikvm/files/goss-serve.service` | new — systemd unit (localhost bind) |
| `apps/pikvm/files/validate` | new — rspecish client → `/usr/local/bin/validate` |
| `apps/pikvm/deploy.py` | edit — Task 10 section + `GossVersion` import |

No changes to `moon.yml` or inventories. `hashlib`/`StringIO` already imported in `deploy.py`.

## Risks / notes

- **`apply` over NetBird is currently broken** (repo memory `pikvm-apply-ops`: paramiko
  can't do `none` auth through `netbird ssh proxy` since native-SSH). Prefer
  `pikvm:apply_local` (LAN) for bring-up, or run pyinfra against a working transport. Flag
  to the user if `pikvm:apply` fails on auth.
- Read-only rootfs: `/usr` is now a separate ro partition; the install writes to
  `/usr/local/bin` — confirm `rootfs.writable` remount covers `/usr/local` on this box
  (part of Checkpoint 2 on-host check). If not, adjust the remount target.
- `_if` reconcile always shows a "conditional change" line in `--dry` (expected, per repo
  memory) — idempotency is judged on the `files.*`/install diffs, not the guarded shell.
- No secrets involved; `--dry` output is safe to share in the PR.
