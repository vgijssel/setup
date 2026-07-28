# Plan: PiKVM Netdata agent (Task 11) — scrape goss + system metrics, claim to Netdata Cloud

> The previous contents of this file (the completed goss / Task 10 plan) are preserved in git
> history and summarised in `apps/pikvm/SPEC.md`.

## Context

The PiKVM box already exposes a machine-readable health signal: **Task 10 (goss)** runs
`goss serve` on `127.0.0.1:8080/healthz` emitting Prometheus/verbose text (one metric per
assertion). `apps/pikvm/SPEC.md` explicitly names **netdata** as the future consumer of that
endpoint. Right now nothing scrapes it, and the box has no CPU/mem/disk/temperature history or
alerting.

This change adds **Task 11**: install the **netdata Agent** on the PiKVM and wire it up to
(a) collect the box's system metrics and (b) scrape the goss `/healthz` Prometheus endpoint, then
**claim the agent to Netdata Cloud** for remote dashboards/alerting. Decisions confirmed with the
user:

- **Install** = pinned netdata **static build**, sha256-verified (mirrors the goss binary install;
  version-gated by a new `NetdataVersion` fact). Not pacman/AUR.
- **Scope** = goss health **+ full system metrics**, with the time-series DB kept in **RAM/tmpfs**
  so the read-only rootfs is never written at runtime.
- **Access** = **Netdata Cloud claim**. Because Cloud reaches the agent over its outbound ACLK
  link, the local dashboard (`:19999`) stays **bound to `127.0.0.1` only** — no inbound port is
  opened on the LAN or the mesh (strictest posture, matches the goss localhost-only discipline).

PiKVM is Arch Linux ARM with a **read-only rootfs** (and a separate ro `/usr`). Netdata is a
stateful, constantly-writing agent, so its runtime dirs must live on tmpfs and its Cloud identity
must be persisted/restored across reboots. Both problems have a proven template in this repo: the
**NetBird overlay slice** (`deploy.py` Task 4 — `files/netbird-overlay.service` +
`files/setup-netbird-overlay.sh`, restore-at-boot / copy-back-on-stop, state in `/root/netbird-state`).
We reuse that idiom.

> Data-classification note: claiming ships this box's **homelab** system metrics + node metadata to
> Netdata Cloud (a third party). This is personal `vgijssel.nl` telemetry — **no HackerOne /
> customer data is involved**. The claim token is a secret, stored in OpenBao `kv/pikvm` like the
> existing NetBird setup key and passwords.

## Reusable patterns

| Need | Reuse | Location |
|------|-------|----------|
| Version fact + install gate | `GossVersion` | `libs/pyinfra-custom/src/pyinfra_custom/facts/goss.py` |
| Fact unit test shape | `test_goss_version_requires_command_and_parses` | `libs/pyinfra-custom/tests/test_facts.py` |
| Pinned binary install (curl + `sha256sum -c`, version-gated) | goss install | `deploy.py` Task 10 |
| Read-only rootfs write windows | `rootfs.writable` / `rootfs.writable_usr` | `libs/pyinfra-custom/.../operations/rootfs.py` |
| tmpfs overlay + persist/restore across reboot | `netbird-overlay.service` + `setup-netbird-overlay.sh` | `deploy.py` Task 4, `files/` |
| systemd drop-in override | `netbird@.service.d/pikvm.conf` | `deploy.py` Task 5, `files/` |
| Change-gated daemon restart | goss `_if=lambda: cfg.did_change()` | `deploy.py` Task 10 |
| Secret via OpenBao + `SKIP_SECRETS` gate | `_secret()`, passwords slice | `deploy.py` Task 7 |

## Dependency graph

```
NetdataVersion fact (libs/pyinfra-custom)         ← Phase A (standalone, unit-tested)
        │ used by
        ▼
netdata static install → /opt/netdata (version-gated, sha256)   ← Phase B
        ├── netdata.conf (RAM db, dirs→tmpfs, bind 127.0.0.1, telemetry off)
        ├── netdata.service.d/pikvm.conf (RuntimeDirectory, After ordering)
        └── enable + start + change-gated restart  → dashboard live on localhost
        ▼
go.d/prometheus.conf → scrape http://127.0.0.1:8080/healthz   ← Phase C
        ▼
Cloud claim + persist lib (GUID + cloud.d) via overlay/restore  ← Phase D
        ▼
node visible in Netdata Cloud, survives reboot
```

Phase B is the thinnest complete path (install → run → localhost dashboard, all runtime data on
tmpfs, rootfs stays `ro`). C adds the goss scrape job. D adds Cloud identity + reboot-durable claim.
A is an independent library change gated only by its own unit test.

## Phase A — `NetdataVersion` fact (foundation) — DONE

- `libs/pyinfra-custom/src/pyinfra_custom/facts/netdata.py` — `NetdataVersion(FactBase[str])`,
  mirrors `GossVersion` (`requires_command → "netdata"`, `command → "netdata -v"`).
- Exported from `facts/__init__.py`; unit test added to `tests/test_facts.py`.
- **Verify:** `moon run pyinfra-custom:test` + `:lint`. ✅ 28 tests pass, lint clean.

## Phase B — install netdata + run locally (RAM db, localhost-only)

**Files:** `files/netdata.conf` (new), `files/netdata.service.d/pikvm.conf` (new),
`deploy.py` (edit — Task 11 section + `NetdataVersion` import).

- `netdata.conf`: `[db] mode = ram` + small retention (no disk TSDB); `[directories]` cache/lib/log
  → tmpfs under `/run/netdata`; `[web] bind to = 127.0.0.1` port `19999`; telemetry off.
- drop-in: `RuntimeDirectory=netdata` (auto-creates `/run/netdata` tmpfs each boot),
  `After=network-online.target`, hardening/`ReadWritePaths` as needed for the ro rootfs.
- deploy.py Task 11 (mirror Task 10): constants `NETDATA_VERSION`/`NETDATA_ARCH="aarch64"`/
  `NETDATA_SHA256`/`NETDATA_URL`; install gate `NETDATA_VERSION not in host.get_fact(NetdataVersion)`;
  gated install inside the correct write window for `/opt` (verify `writable` vs `writable_usr`):
  `curl` the `.gz.run`, `sha256sum -c`, run installer non-interactively
  (`--accept -- --dont-start-it --disable-telemetry --no-updates --stable-channel`); sha-gated
  `files.put` of config + drop-in; enable + start + change-gated restart.

**Acceptance:** `pikvm:lint` passes; on box `systemctl is-active netdata`=active,
`ss -ltn :19999` → `127.0.0.1` only, `curl -s localhost:19999/api/v1/info` JSON, system charts
populated; `findmnt -no OPTIONS /` = `ro` under load; idempotent re-apply.

### ✅ Checkpoint 2 — agent runs, localhost-only, rootfs untouched at runtime (on-box)
Resolve: exact `/opt` partition (writable vs writable_usr); pinned asset name/URL/sha256; SBC memory
footprint (tune retention / disable heavy collectors if needed).

## Phase C — scrape goss `/healthz`

**Files:** `files/go.d/prometheus.conf` (new) → `/etc/netdata/go.d/prometheus.conf`:
```yaml
jobs:
  - name: pikvm-goss
    url: http://127.0.0.1:8080/healthz
```
`deploy.py` (edit) — sha-gated `files.put` in the same write window; include in restart `_if`.

**Acceptance:** netdata shows a `prometheus`/`pikvm-goss` chart family with the goss assertion
metrics; `allmetrics?format=prometheus | grep -i goss` shows the series; idempotent; lint passes.

### ✅ Checkpoint 3 — goss metrics visible in netdata

## Phase D — claim to Netdata Cloud + reboot-durable identity

**Prerequisite (manual):** add `netdata_claim_token` + `netdata_claim_rooms` to OpenBao `kv/pikvm`
(Netdata Cloud → Space → Connect Nodes). The deploy reads them; it cannot create them.

**Files:** `files/setup-netdata-overlay.sh` (new), `files/netdata-overlay.service` (new),
`files/netdata.conf` (edit — `[directories] lib` → persisted path), `deploy.py` (edit).

- Overlay: tmpfs over netdata's lib dir; restore `cloud.d/` + registry machine GUID from
  `/root/netdata-state` on start, copy back on stop; `Before=netdata.service`. Keeps the Cloud node
  identity stable (no duplicates).
- Claim (gated on `not SKIP_SECRETS` and not-already-claimed): `_secret("netdata_claim_token")` /
  `_secret("netdata_claim_rooms")` → `/opt/netdata/bin/netdata-claim.sh -token=$TOK -rooms=$ROOMS
  -url=https://app.netdata.cloud`, token via per-command `_env` (never argv/`--dry`); persist state.

**Acceptance:** node **Live** in Netdata Cloud with box charts + pikvm-goss; `PIKVM_SKIP_SECRETS=1`
skips claiming cleanly; token never in argv/`--dry`; **reboot** → same node reconnects (no
duplicate); idempotent.

### ✅ Checkpoint 4 — Cloud claim durable + final sign-off
Node Live, reboot-durable, localhost-only bind, rootfs `ro` at runtime, lint green, idempotent → commit.

## Applying (transport caveat)

`moon run pikvm:apply` over NetBird is **broken** (paramiko can't do `none` auth through NetBird
native-SSH JWT — repo memory `pikvm-apply-ops`). Apply Task-11 operations over `ssh root@<box>`
directly, or LAN `apply_local` if reachable. `--dry` over NetBird hits the same wall.

## Files touched (summary)

| Path | Change |
|------|--------|
| `libs/pyinfra-custom/.../facts/netdata.py` | new — `NetdataVersion` fact (Phase A ✅) |
| `libs/pyinfra-custom/.../facts/__init__.py` | edit — export `NetdataVersion` (✅) |
| `libs/pyinfra-custom/tests/test_facts.py` | edit — `NetdataVersion` test (✅) |
| `apps/pikvm/files/netdata.conf` | new — RAM db, tmpfs dirs, localhost bind |
| `apps/pikvm/files/netdata.service.d/pikvm.conf` | new — RuntimeDirectory + ordering drop-in |
| `apps/pikvm/files/go.d/prometheus.conf` | new — goss scrape job |
| `apps/pikvm/files/setup-netdata-overlay.sh` | new — lib tmpfs + restore/persist claim state |
| `apps/pikvm/files/netdata-overlay.service` | new — overlay unit (Before=netdata) |
| `apps/pikvm/deploy.py` | edit — Task 11 section + `NetdataVersion` import |
| OpenBao `kv/pikvm` | add `netdata_claim_token`, `netdata_claim_rooms` (manual prerequisite) |

## Risks / notes

- **Read-only rootfs is the central risk** — all runtime writes must land on tmpfs (`/run/netdata`
  via `RuntimeDirectory`) or the persisted lib overlay; verify `findmnt / → ro` under load.
  `[db] mode = ram` avoids a disk TSDB.
- **Static installer is a big opaque one-shot** — gated on `NetdataVersion` so it runs once;
  `--no-updates` disables self-update. Confirm pinned asset name/URL/sha256 at build (like goss).
- **`/opt` partition** must be confirmed to pick `rootfs.writable` vs `writable_usr`.
- **Cloud node duplication** if the machine GUID isn't persisted — the lib overlay prevents it.
- **Off-box telemetry** is deliberate (Cloud claim); homelab data only, token in OpenBao,
  `SKIP_SECRETS` leaves the agent unclaimed.
- Apply over NetBird broken → apply over `ssh root@<box>`.
