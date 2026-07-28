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
- [ ] Pin `NETDATA_VERSION` + confirm aarch64 static asset name/URL + `NETDATA_SHA256` (release checksums)
- [ ] `files/netdata.conf` — `[db] mode = ram` + small retention; dirs → `/run/netdata` tmpfs; bind `127.0.0.1:19999`; telemetry off
- [ ] `files/netdata.service.d/pikvm.conf` — `RuntimeDirectory=netdata`, `After=network-online.target`, ro-rootfs hardening
- [ ] `deploy.py` Task 11: `NetdataVersion` import; install gate; gated static install (curl + `sha256sum -c` + `.gz.run --accept -- --dont-start-it --disable-telemetry --no-updates --stable-channel`); sha-gated config/drop-in `files.put`; enable + start + change-gated restart
- [ ] Confirm `/opt` partition → `rootfs.writable` vs `writable_usr`
- [ ] `moon run pikvm:lint` passes
- [ ] On box: `systemctl is-active netdata` = active, `is-enabled` = enabled
- [ ] On box: `ss -ltn 'sport = :19999'` → `127.0.0.1` only (never `0.0.0.0`)
- [ ] On box: `curl -s localhost:19999/api/v1/info` → JSON; system charts populated
- [ ] On box: `findmnt -no OPTIONS /` = `ro` while netdata runs (all writes on tmpfs)
- [ ] Idempotent re-apply (box config sha == repo sha)

### ⬜ Checkpoint 2 — agent runs, localhost-only, rootfs untouched at runtime
- [ ] `/opt` partition confirmed + correct write-window helper
- [ ] Pinned static asset name/URL/sha256 confirmed
- [ ] SBC memory footprint acceptable (tune retention / disable heavy collectors if needed)

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
