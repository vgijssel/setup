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
- [x] On-box apply DONE (manual, netdata-only, over `ssh root@100.65.192.152` via `systemd-run` in PID1 mount-ns). Not-yet-verified: reboot-start (enabled + RuntimeDirectory recreates dirs each boot — confirm on next reboot; Phase D covers Cloud-identity reboot durability).

## Phase C — scrape goss `/healthz`
- [ ] `files/go.d/prometheus.conf` — job `pikvm-goss` → `http://127.0.0.1:8080/healthz`
- [ ] `deploy.py` — sha-gated `files.put` in same write window; include in restart `_if`
- [ ] On box: netdata shows `prometheus`/`pikvm-goss` chart family with goss assertion metrics
- [ ] On box: `allmetrics?format=prometheus | grep -i goss` shows series
- [ ] Idempotent; `pikvm:lint` passes

### ⬜ Checkpoint 3 — goss metrics visible in netdata

## Phase D — claim to Netdata Cloud + reboot-durable identity
- [ ] **Prereq (manual):** add `netdata_claim_token` + `netdata_claim_rooms` to OpenBao `kv/pikvm`
- [ ] `files/setup-netdata-overlay.sh` + `files/netdata-overlay.service` — tmpfs over lib dir, restore/persist `cloud.d` + machine GUID via `/root/netdata-state`, `Before=netdata.service`
- [ ] `files/netdata.conf` — `[directories] lib` → persisted path
- [ ] `deploy.py` — overlay install/enable; claim gated on `not SKIP_SECRETS` + not-already-claimed; `netdata-claim.sh` with token via `_env`; persist state
- [ ] On box: node **Live** in Netdata Cloud with box charts + pikvm-goss job
- [ ] `PIKVM_SKIP_SECRETS=1` skips claiming cleanly (no OpenBao read, agent still runs)
- [ ] Token never in argv / `--dry` output
- [ ] Reboot survival: same Cloud node reconnects (no duplicate), pikvm-goss present
- [ ] Idempotent

### ⬜ Checkpoint 4 — Cloud claim durable + final sign-off
- [ ] Node Live, reboot-durable, localhost-only bind, rootfs `ro` under load, lint green, idempotent
- [ ] Commit

## Apply transport
- `moon run pikvm:apply` over NetBird is broken (paramiko `none`-auth vs NetBird JWT-SSH). Apply
  Task-11 ops over `ssh root@<box>` (or LAN `apply_local`). `--dry` over NetBird hits the same wall.
