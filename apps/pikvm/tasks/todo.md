# TODO: PiKVM System-Health Validation (goss serve + `validate`)

See `tasks/plan.md` for full context. Slices are vertical — each phase is one complete,
verifiable path. Do not cross a `✅ Checkpoint` until its gate passes.

## Phase A — `GossVersion` fact (foundation)
- [ ] Add `GossVersion(FactBase[str])` in `libs/pyinfra-custom/src/pyinfra_custom/facts/goss.py`, mirroring `NetbirdVersion` (`facts/netbird.py:13`); confirm `goss --version` vs `goss version`
- [ ] Export `GossVersion` from `libs/pyinfra-custom/src/pyinfra_custom/facts/__init__.py` (import + `__all__`)
- [ ] Add unit test in `libs/pyinfra-custom/tests/test_facts.py` (pattern: `test_netbird_version_requires_command_and_parses`, line 15)
- [ ] `moon run libs/pyinfra-custom:test` passes
- [ ] `moon run libs/pyinfra-custom:lint` passes

### ✅ Checkpoint 1 — lib green before touching the deploy

## Phase B — minimal end-to-end goss daemon + `validate`
- [ ] `apps/pikvm/files/goss-serve.service` — unit binding `127.0.0.1:8080`, `--endpoint /healthz`, prometheus/verbose, `After=... netbird@netbird.service`
- [ ] `apps/pikvm/files/validate` — curl client (rspecish Accept header, non-zero exit unless HTTP 200), → `/usr/local/bin/validate`
- [ ] `apps/pikvm/files/goss.yaml` — **minimal**: only `port: tcp:8080` (`ip: [127.0.0.1]`) to self-test the pipeline
- [ ] `apps/pikvm/deploy.py` — add `GossVersion` import; add Task 10 section (constants, install gate via `GossVersion`, `rootfs.writable` config/unit writes, systemd enable+start, `_if` conditional restart)
- [ ] `moon run pikvm:lint` passes
- [ ] `--dry` shows expected Task 10 diff (install + writes + enable)
- [ ] `moon run pikvm:apply_local` (LAN; NetBird apply is broken — see plan Risks), then `--dry` → Task 10 clean (idempotent)
- [ ] On box: `systemctl is-active goss-serve.service` → `active`
- [ ] On box: `ss -ltnp 'sport = :8080'` → `127.0.0.1:8080` only, never `0.0.0.0`
- [ ] On box: `validate` prints rspecish, exits `0`; `curl -s localhost:8080/healthz` → prometheus text

### ✅ Checkpoint 2 — pipeline proven + open questions resolved (human + on-host)
- [ ] Port 8080 confirmed free (else ask first, repick loopback port, update `port` assertion)
- [ ] `net.ipv4.ping_group_range` allows root ICMP ping
- [ ] `rootfs.writable` remount confirmed to cover `/usr/local/bin` on the box
- [ ] Daemon confirmed localhost-only + `validate` works E2E

## Phase C — full 5-assertion contract
- [ ] Expand `apps/pikvm/files/goss.yaml` to all 5: netbird-connected, ping 100.65.134.8, dns FQDN, `service netbird@netbird`, `port tcp:8080`
- [ ] Confirm the `dns` resource resolves the FQDN on-host; if flaky, swap #3 to `command: getent hosts <fqdn>` (exit 0)
- [ ] Redeploy, `--dry` → clean; `moon run pikvm:lint` passes
- [ ] On box: `validate` → all 5 pass, exit `0`; `curl` → one metric line per assertion
- [ ] Failure injection: `netbird down` → `validate` fails non-zero → restore → passes

### ✅ Checkpoint 3 — reboot survival + final sign-off
- [ ] `reboot`; daemon comes back enabled + active, `validate` passes
- [ ] All SPEC.md "Success Criteria" boxes ticked
- [ ] Commit
