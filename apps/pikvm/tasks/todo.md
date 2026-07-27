# TODO: PiKVM System-Health Validation (goss serve + `validate`)

See `tasks/plan.md` for full context. Status: **built, tested, committed, and applied
live to the box.** pyinfra could not drive the box (NetBird native-SSH JWT wall) so the
apply was done over `ssh root@100.65.192.152` executing Task 10's exact operations.

## Phase A — `GossVersion` fact (foundation)
- [x] Add `GossVersion(FactBase[str])` (`facts/goss.py`) — `goss --version` confirmed on-box (`goss version 0.4.10`)
- [x] Export `GossVersion` from `facts/__init__.py`
- [x] Unit test in `tests/test_facts.py`
- [x] **Bonus (plan risk):** add `rootfs.remount_usr` / `writable_usr` (+ tests) for the separate `ro` /usr partition
- [x] `moon run pyinfra-custom:test` passes (27 tests)
- [x] `moon run pyinfra-custom:lint` passes

### ✅ Checkpoint 1 — lib green — PASSED

## Phase B — minimal end-to-end goss daemon + `validate`
- [x] `files/goss-serve.service`, `files/validate`, `files/goss.yaml` (minimal port check)
- [x] `deploy.py` Task 10 (GossVersion import, install gate, `writable_usr` for /usr + `writable` for /etc, enable+start, change-gated restart)
- [x] `deploy.py` `PIKVM_SKIP_SECRETS` env gate (run without OpenBao — the OpenBao-less ask)
- [x] Verified real goss v0.4.10 asset is `goss_..._linux_arm64.tar.gz`; SHA256 matches SPEC
- [x] `moon run pikvm:lint` passes
- [~] `--dry` / `apply_local`: **N/A** — pyinfra can't auth over NetBird JWT-SSH; applied over openssh instead
- [x] On box: `systemctl is-active` → active; `is-enabled` → enabled
- [x] On box: `ss -ltn :8080` → `127.0.0.1:8080` only (never `0.0.0.0`)
- [x] On box: `validate` prints rspecish; `curl` → prometheus/verbose per-assertion metrics

### ✅ Checkpoint 2 — pipeline proven — PASSED
- [x] Port 8080 free (probed)
- [x] `net.ipv4.ping_group_range` = `0 2147483647` (root ICMP fine)
- [x] `/usr/local/bin` on separate `ro` /usr → solved with `rootfs.writable_usr`
- [x] Daemon localhost-only + `validate` works E2E

## Phase C — full 5-assertion contract
- [x] Expand `goss.yaml` to all 5 (netbird-connected, ping, dns, service, port)
- [x] DNS: goss `dns` resource returns resolvable:false → swapped to `getent hosts` (per plan decision); now passes
- [x] Redeploy goss.yaml to box; box sha == repo sha (idempotent)
- [x] On box: `validate` → **4/5 pass**, exit 1; prometheus has one metric per assertion
- [~] Failure injection: not needed — `ping 100.65.134.8` is a *live* failing check (see below), proving non-zero exit

### ✅ Checkpoint 3 — reboot survival + final sign-off
- [ ] `reboot` survival — NOT tested (would disrupt the box; `is-enabled=enabled` so expected to survive) — **left for user**
- [x] Commit (6 commits on `worktree-pikvm-routing-peer`)

## Reachability check — RESOLVED (replaced laptop ping with Omada)
- [x] Dropped macbook ping + macbook DNS (laptop often offline, userspace mode = no ICMP)
- [x] Added `omada-dns` (getent resolve `omada.omada.svc.cluster.local`) + one TCP-connect
      check per Omada TCP port (8088/8043/8843/29811–29817) over NetBird cross-cluster routing
- [x] UDP 27001/29810/19810 excluded (L2-only, connectionless, not connect-testable)
- [x] Verified live: **17/17 checks pass, validate exit 0**, one prometheus metric per port,
      box goss.yaml sha == repo (idempotent)
