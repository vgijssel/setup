# TODO: PiKVM Netdata agent (Task 11)

See `tasks/plan.md` for full context. Netdata Agent on the PiKVM: system metrics + scrape the goss
`127.0.0.1:8080/healthz` Prometheus endpoint, claimed to Netdata Cloud. Local dashboard localhost-only.

> Supersedes the goss (Task 10) todo, which is complete and preserved in git history + `SPEC.md`.

## Phase A — `NetdataVersion` fact (foundation)
- [x] Add `NetdataVersion(FactBase[str])` (`facts/netdata.py`) — `netdata -v`, mirrors `GossVersion`
- [x] Export `NetdataVersion` from `facts/__init__.py` (import + `__all__`)
- [x] Unit test in `tests/test_facts.py`
- [x] `moon run pyinfra-custom:test` passes (28 tests)
- [x] `moon run pyinfra-custom:lint` passes

### ✅ Checkpoint 1 — lib green — PASSED

## Phase B — install netdata + run locally (RAM db, localhost-only)
- [x] Pin `NETDATA_VERSION` (2.10.4) + aarch64 static asset `netdata-aarch64-v2.10.4.gz.run` + `NETDATA_SHA256` (from release `sha256sums.txt`)
- [x] `files/netdata.conf` — `[db] mode = ram` + retention 3600; dirs → `/run/netdata` tmpfs; bind `127.0.0.1:19999`; telemetry off (installer `--disable-telemetry`)
- [x] `files/netdata.service.d/pikvm.conf` — `RuntimeDirectory=netdata netdata/cache netdata/lib netdata/log` (netdata only creates leaf dirs), `After=network-online.target`
- [x] `deploy.py` Task 11: `NetdataVersion` import; install gate; gated static install (curl + `sha256sum -c` + `.gz.run --accept -- --dont-start-it --disable-telemetry --stable-channel`); sha-gated config/drop-in `files.put`; enable + start + change-gated restart
- [x] Confirm `/opt` partition → `rootfs.writable` (NOT `writable_usr`): verified on-box `/opt/netdata` is on root (`/dev/mmcblk0p3 /`); `/usr` is a `ro` bind-mount of the SAME device (`/dev/mmcblk0p3[/usr]`), so one `rw` remount covers it — installer writes the base unit to `/usr/lib/systemd/system` and our `/etc` drop-in overrides it
- [x] `moon run pikvm:lint` passes
- [x] On box: `systemctl is-active netdata` = **active**, `is-enabled` = **enabled**
- [x] On box: `ss -ltn 'sport = :19999'` → **`127.0.0.1:19999` only** (never `0.0.0.0`)
- [x] On box: `curl -s localhost:19999/api/v1/info` → JSON (v2.10.4, host `pikvm`); **2014 charts** populated
- [x] On box: `findmnt -no OPTIONS /` = **`ro`** while netdata runs (all writes on `/run/netdata` tmpfs)
- [x] Idempotent re-apply — FIXED: `NetdataVersion` fact now invokes `/opt/netdata/bin/netdata -v` by absolute path (static build is NOT on PATH; bare `netdata` failed → gate would reinstall every apply). Box config/drop-in written byte-for-byte from repo → sha matches → no-op.

### ✅ Checkpoint 2 — agent runs, localhost-only, rootfs untouched at runtime — PASSED (on-box)
- [x] `/opt` partition confirmed + correct write-window helper (root partition → `rootfs.writable`; `/usr` = ro bind-mount of same device)
- [x] Pinned static asset name/URL/sha256 confirmed (v2.10.4 `sha256sums.txt`)
- [x] SBC memory footprint acceptable — netdata RSS ~51 MB of 7.7 GB (box 657 MB used / 7.1 GB avail)
- [x] On-box apply DONE (manual, netdata-only, over `ssh root@100.65.192.152` via `systemd-run` in PID1 mount-ns).
- [x] Reboot-start VERIFIED (2026-07-28): rebooted the box over NetBird, back in ~55s; netdata came up active+enabled, `/run/netdata{,/cache,/lib,/log}` recreated on tmpfs, 127.0.0.1:19999 only, `/`=ro, api JSON; all core units (netbird-overlay/@netbird/routing, goss-serve, kvmd, kvmd-nginx) active+enabled, 0 failed units. NOTE: netdata machine GUID (in tmpfs `/run/netdata/lib/registry`) regenerates each boot → Phase D lib overlay must persist it to avoid Cloud node duplication.

## Phase C — scrape goss `/healthz`
- [ ] `files/go.d/prometheus.conf` — job `pikvm-goss` → `http://127.0.0.1:8080/healthz`
- [ ] `deploy.py` — sha-gated `files.put` in same write window; include in restart `_if`
- [ ] On box: netdata shows `prometheus`/`pikvm-goss` chart family with goss assertion metrics
- [ ] On box: `allmetrics?format=prometheus | grep -i goss` shows series
- [ ] Idempotent; `pikvm:lint` passes

### ⬜ Checkpoint 3 — goss metrics visible in netdata

## Phase D — claim to Netdata Cloud + reboot-durable identity — DONE + verified live
- [x] **Prereq:** claim secrets live in OpenBao **`kv/netdata`** (fields `claim_token`, `room_ids`, `claim_url`) — NOT `kv/pikvm`
- [x] `files/setup-netdata-overlay.sh` + `files/netdata-overlay.service` — tmpfs over `/var/lib/netdata`, restore/persist `cloud.d` + machine GUID via `/root/netdata-state`, `Before=netdata.service`
- [x] `files/netdata.conf` — `[directories] lib = /var/lib/netdata` (overlay-backed; cache/log stay on `/run` tmpfs; `[db] mode = ram` → metrics never on disk)
- [x] `files/netdata.service.d/pikvm.conf` — drop `netdata/lib` from `RuntimeDirectory` (lib is the overlay now)
- [x] `files/goss.yaml` — new `http` check on `127.0.0.1:19999/api/v1/info` asserting `"agent-claimed":true` + `"aclk-available":true`
- [x] `deploy.py` — overlay install/enable (writable_usr for the script, writable for state/unit) + change-gated remount+restart; claim gated on `not SKIP_SECRETS` + not-already-claimed (persisted `claimed_id`); reads `kv/netdata`; `netdata-claim.sh` token via `_env`; deletes `claim.conf` so the reusable token is never persisted; snapshots identity to `/root/netdata-state`
- [x] On box: node **online** in Netdata Cloud (`agent-claimed:true`, `aclk-available:true`, `claim_id=bb2e7b31…`)
- [x] Token never in argv / `--dry` output (via `_env`; claim.conf deleted post-claim)
- [x] Reboot survival VERIFIED: after reboot, **same** node returns — `uid=8bfd497f…` + `claim_id=bb2e7b31…` unchanged (no duplicate), ACLK reconnected, lib restored from `/root/netdata-state`
- [x] goss cloud check passes (prometheus `outcome=pass` for the netdata http resource)

### ✅ Checkpoint 4 — Cloud claim durable + final sign-off — PASSED
- [x] Node online, reboot-durable (same node id), localhost-only bind, rootfs `ro` under load, lint green
- [x] Metrics RAM-only confirmed (`[db] mode = ram`; only tmpfs `.db` metadata; no disk TSDB)
- [ ] Commit + push (in progress)
- NOTE: after the reboot, the 11 **Omada** cross-cluster goss checks went red — this is the separate
  `netbird-routingpeer-session-expiry` issue (network `deploy/router` not distributing routes), NOT netdata.
  The netdata cloud check itself is green. `--dry`/declarative apply over NetBird still blocked (paramiko);
  Phase D was applied manually over `ssh` via `systemd-run` in PID1's mount-ns.

## Apply transport
- `moon run pikvm:apply` over NetBird is broken (paramiko `none`-auth vs NetBird JWT-SSH). Apply
  Task-11 ops over `ssh root@<box>` (or LAN `apply_local`). `--dry` over NetBird hits the same wall.
