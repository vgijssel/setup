# Spec: PiKVM System-Health Validation (goss serve + `validate`)

## Objective

Give the PiKVM host a continuous, machine- and human-readable **system-health endpoint**
plus a one-shot `validate` command, so that:

- An **operator** who SSHes into the box can run `validate` and instantly see a
  human-readable (rspecish) pass/fail report of critical system health.
- **netdata** (future) can scrape a Prometheus metrics endpoint where **each
  individual assertion is its own metric** and turn it into dashboards/alerts.

We do this by installing [`goss`](https://github.com/goss-org/goss) v0.4.10 and running
it as a long-lived daemon (`goss serve`) bound to **localhost only**, driven by a
declarative test spec (`goss.yaml`). The `validate` executable is a thin client that
queries the already-running daemon and requests rspecish output for that one request.

### Health assertions (the `goss.yaml` contract)

| # | Assertion | goss resource |
|---|-----------|---------------|
| 1 | Host is **connected to NetBird** (management connected) | `command` → `netbird status` |
| 2 | Host can **resolve the in-cluster Omada Service `omada.omada.svc.cluster.local`** | `command` → `getent hosts` |
| 3 | Host can **TCP-connect to Omada on every documented TCP port** (8088/8043/8843/29811–29817), over NetBird cross-cluster routing | `command` → `bash -c 'exec 3<>/dev/tcp/…'` (one check per port; goss's own `timeout` bounds it) |
| 4 | **`netbird@netbird.service` is running** (and enabled) | `service` |
| 5 | **goss daemon listens on `127.0.0.1:8080` and NOT `0.0.0.0`** | `port` with explicit `ip: [127.0.0.1]` |

The reachability target is the **Omada controller** (the whole point of the routing peer),
not the operator laptop: the laptop is frequently offline and runs NetBird in userspace
mode (no ICMP responder), so pinging it is unreliable. The Omada Service is always-on and
reachable over cross-cluster routing. UDP discovery ports (27001/29810/19810) are L2-only
and connectionless, so they are intentionally not connect-tested.

goss's `port` resource checks only **local** listening sockets (hence its use for the
`:8080` loopback self-check), not outbound reachability. goss's remote-reachability builtin
`addr` (`tcp://host:port`) *is* used-worthy, but here it only works against the Service's
ClusterIP — with the stable hostname it fails, because goss's static Go resolver does not
traverse the systemd-resolved split-DNS stub (same limitation as the `dns` resource). Since
the ClusterIP is not stable, assertion #3 uses `command` + bash `/dev/tcp`, which resolves
the stable hostname via libc NSS on every check.

### Success looks like

- `validate` on the box prints an rspecish report and exits `0` when all 5 checks pass,
  non-zero otherwise.
- `curl -s localhost:8080/healthz` returns Prometheus text with a distinct metric per
  test (verbose format), suitable for netdata.
- The daemon survives reboots (systemd-enabled) and is reachable only from the box itself.

## Tech Stack

- **goss** `v0.4.10` — single static binary, `goss_0.4.10_linux_arm64.tar.gz`
  - SHA256: `90a59612b4d67d9f1a9038634c000790136bb82526a69de1e81ac075c2f6d2c6`
  - Source: `https://github.com/goss-org/goss/releases/download/v0.4.10/`
- **pyinfra** deploy (existing `apps/pikvm/deploy.py`), Python 3.12, `uv`
- **PiKVM** = Arch Linux ARM (**aarch64**), read-only rootfs, systemd + systemd-resolved
- **systemd** for the `goss-serve.service` daemon
- Custom facts/operations from `libs/pyinfra-custom` (existing)

## Commands

Run from `apps/pikvm/` (via Moon or directly):

```bash
# Install deps / lint (existing tasks)
moon run pikvm:install                 # uv sync
moon run pikvm:lint                    # uv run ruff check .

# Deploy (adds the goss tasks to the existing declarative run)
moon run pikvm:apply                   # via NetBird (production inventory) — ongoing
moon run pikvm:apply_local             # via LAN (local inventory) — first bring-up

# Dry-run before applying (recommended)
cd apps/pikvm && uv run pyinfra inventories/production.py deploy.py --dry
```

On the PiKVM host, after deploy:

```bash
validate                               # rspecish health report, exits non-zero on failure
systemctl status goss-serve.service    # daemon state
curl -s -H 'Accept: application/vnd.goss-rspecish' localhost:8080/healthz   # what validate calls
curl -s localhost:8080/healthz         # default = prometheus verbose (netdata scrape target)
```

## Project Structure

New/changed files live under `apps/pikvm/` following the existing `deploy.py` + `files/` pattern:

```
apps/pikvm/
├── deploy.py                     # (edit) add "Task 10: goss health validation" section
├── SPEC.md                       # (this file)
└── files/
    ├── goss.yaml                 # (new) declarative test spec — the 5 assertions
    ├── goss-serve.service        # (new) systemd unit running `goss serve` on 127.0.0.1:8080
    └── validate                  # (new) client script → /usr/local/bin/validate
```

On the PiKVM host (placed by the deploy):

```
/usr/local/bin/goss              # goss v0.4.10 binary (mode 755)
/usr/local/bin/validate          # operator command (mode 755)
/etc/goss/goss.yaml              # test spec read by the daemon on every request (mode 644)
/etc/systemd/system/goss-serve.service   # daemon unit (mode 644)
```

## Code Style

Match the existing declarative, fact-gated, read-only-rootfs discipline in `deploy.py`.
New tasks are guarded so a converged host shows **no changes** on re-run.

```python
# ---------------------------------------------------------------------------
# Task 10: System-health validation via goss serve (localhost only)
# ---------------------------------------------------------------------------
GOSS_VERSION = "0.4.10"
GOSS_ARCH = "arm64"
GOSS_SHA256 = "90a59612b4d67d9f1a9038634c000790136bb82526a69de1e81ac075c2f6d2c6"
GOSS_URL = (
    f"https://github.com/goss-org/goss/releases/download/v{GOSS_VERSION}/"
    f"goss_{GOSS_VERSION}_linux_{GOSS_ARCH}.tar.gz"
)

# Install gate: only download/verify/extract when the pinned version is absent.
goss_installed = host.get_fact(Command, command="/usr/local/bin/goss --version 2>/dev/null || true")
goss_needs_install = GOSS_VERSION not in (goss_installed or "")

if goss_needs_install:
    with rootfs.writable(changed_if=True):
        server.shell(
            name=f"Install goss {GOSS_VERSION} (verified sha256)",
            commands=[
                "set -e",
                "tmp=$(mktemp -d)",
                f"curl -fsSL -o \"$tmp/goss.tgz\" {GOSS_URL}",
                f"echo '{GOSS_SHA256}  '\"$tmp/goss.tgz\" | sha256sum -c -",
                "tar -xzf \"$tmp/goss.tgz\" -C \"$tmp\" goss",
                "install -m 0755 \"$tmp/goss\" /usr/local/bin/goss",
                "rm -rf \"$tmp\"",
            ],
        )

# Config + client + unit are SHA256-gated writes inside a single rw window.
goss_yaml_sha = hashlib.sha256(_goss_yaml.encode()).hexdigest()
validate_sha = hashlib.sha256(_validate.encode()).hexdigest()
unit_sha = hashlib.sha256(_goss_unit.encode()).hexdigest()
goss_needs_rw = (
    host.get_fact(Sha256File, path="/etc/goss/goss.yaml") != goss_yaml_sha
    or host.get_fact(Sha256File, path="/usr/local/bin/validate") != validate_sha
    or host.get_fact(Sha256File, path="/etc/systemd/system/goss-serve.service") != unit_sha
)
with rootfs.writable(changed_if=goss_needs_rw):
    files.directory(path="/etc/goss", present=True)
    goss_cfg = files.put(src=StringIO(_goss_yaml), dest="/etc/goss/goss.yaml", mode="644")
    files.put(src=StringIO(_validate), dest="/usr/local/bin/validate", mode="755")
    goss_unit = files.put(
        src=StringIO(_goss_unit), dest="/etc/systemd/system/goss-serve.service", mode="644"
    )
    systemd.service(service="goss-serve.service", running=None, enabled=True, daemon_reload=True)

systemd.service(service="goss-serve.service", running=True)
server.shell(
    name="Restart goss-serve on config/unit change",
    commands=["systemctl daemon-reload", "systemctl restart goss-serve.service"],
    _if=lambda: goss_cfg.did_change() or goss_unit.did_change(),
)
```

**`files/goss.yaml`** — the assertion contract (bind-check enforces localhost-only). The
Omada TCP block below is one entry per port; see the deployed file for all ten:

```yaml
command:
  netbird-connected:
    exec: "netbird status"
    exit-status: 0
    stdout:
      - "Management: Connected"
  # Resolve the in-cluster Omada Service (getent, not goss's dns resource -- Go's
  # resolver won't traverse the systemd-resolved 127.0.0.53 D-Bus stub).
  omada-dns:
    exec: "getent hosts omada.omada.svc.cluster.local"
    exit-status: 0
  # One TCP-connect check per Omada TCP port. goss bounds each check with its own
  # `timeout` (default 10s), so no external `timeout` wrapper is needed.
  omada-tcp-8088-manage-http:
    exec: "bash -c 'exec 3<>/dev/tcp/omada.omada.svc.cluster.local/8088'"
    exit-status: 0
  # … 8043, 8843, 29811, 29812, 29813, 29814, 29815, 29816, 29817 (same shape)

service:
  netbird@netbird:
    enabled: true
    running: true

port:
  tcp:8080:
    listening: true
    ip:
      - 127.0.0.1        # fails if bound to 0.0.0.0 → enforces localhost-only
```

**`files/goss-serve.service`** — daemon, prometheus/verbose default (per-test metrics):

```ini
[Unit]
Description=goss system-health server (localhost only)
After=network-online.target netbird@netbird.service
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/goss --gossfile /etc/goss/goss.yaml serve \
  --listen-addr 127.0.0.1:8080 --endpoint /healthz \
  --format prometheus --format-options verbose
Restart=on-failure
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

**`files/validate`** — operator client; rspecish via Accept header, non-zero exit on failure:

```bash
#!/bin/bash
# Query the local goss serve daemon for a human-readable health report.
set -euo pipefail
out="$(mktemp)"
code="$(curl -sS -o "$out" -w '%{http_code}' \
  -H 'Accept: application/vnd.goss-rspecish' \
  http://127.0.0.1:8080/healthz)"
cat "$out"; rm -f "$out"
[ "$code" = "200" ]   # goss serve returns 200 all-pass, 503 on any failure
```

## Testing Strategy

- **Static**: `moon run pikvm:lint` (ruff) + `uv sync` must pass — matches CI for this project.
- **Dry-run gating**: `uv run pyinfra … deploy.py --dry` twice — the second run (after a
  real apply) must show **no changes** for the goss tasks (idempotency proof). Secrets are
  not involved, so `--dry` output is safe to share.
- **On-host functional verification** (manual, documented in PR):
  1. `systemctl is-active goss-serve.service` → `active`.
  2. `ss -ltnp 'sport = :8080'` → bound to `127.0.0.1:8080` only, never `0.0.0.0`.
  3. `validate` → rspecish report, 5 checks, exit `0` on a healthy box; kill NetBird and
     confirm it flips to failing + non-zero exit.
  4. `curl -s localhost:8080/healthz` → prometheus text with a per-test metric line.
- **Reboot survival**: after `reboot`, the daemon comes back enabled and `validate` passes.
- No new unit tests are added to `libs/pyinfra-custom` unless a new custom fact/operation
  is introduced (none planned — generic `Command`/`Sha256File`/`server.shell` suffice).

## Boundaries

- **Always**
  - Pin goss to `v0.4.10` and verify the download against the SHA256 above before install.
  - Bind the daemon to `127.0.0.1` only; the `port` assertion must guard against `0.0.0.0`.
  - Keep every task fact-gated and wrapped in `rootfs.writable(...)` for rootfs writes.
  - Run `--dry` and confirm idempotency before a real `apply`.
  - Follow existing naming/section conventions in `deploy.py`; edit it in place.
- **Ask first**
  - Changing the bind port away from `8080`, or exposing the endpoint beyond localhost.
  - Adding a new custom fact/operation to `libs/pyinfra-custom`.
  - Adding/removing assertions beyond the five listed here.
  - Introducing a new package via `pacman`/AUR (goss is a direct pinned binary, not a package).
- **Never**
  - Bind goss to `0.0.0.0` or any non-loopback address.
  - Hardcode secrets (this feature needs none) or print secrets in `--dry`.
  - Use `npx`/`uvx` or unpinned downloads (`latest`, floating tags).
  - Create files outside `apps/pikvm/` for this feature; no docs beyond this SPEC unless asked.

## Success Criteria

- [ ] `validate` exists at `/usr/local/bin/validate`, prints rspecish output, exits `0`
      when all 5 assertions pass and non-zero when any fails.
- [ ] `goss-serve.service` is enabled + active, bound to `127.0.0.1:8080` (verified not
      `0.0.0.0`), and survives a reboot.
- [ ] `curl -s localhost:8080/healthz` returns Prometheus verbose output with one metric
      per assertion (netdata-scrapeable).
- [ ] All assertions (netbird connected, resolve `omada.omada.svc.cluster.local`, TCP
      reachability to every Omada TCP port, `netbird@netbird` running, goss on localhost)
      report correctly on a healthy box.
- [ ] `deploy.py --dry` shows no changes on a converged host (idempotent).
- [ ] `moon run pikvm:lint` passes.

## Open Questions

1. **Port 8080 free on PiKVM?** kvmd/nginx own 80/443; confirm nothing already binds
   `127.0.0.1:8080`. If taken, pick another loopback port (and update `goss.yaml`'s `port`
   assertion accordingly).
2. **DNS resource vs `getent`** — goss's `dns` resource uses Go's resolver. NetBird DNS on
   this box runs through the systemd-resolved D-Bus backend (see repo memory
   `pikvm-netbird-dns`). If the `dns` resource doesn't traverse the `127.0.0.53` stub
   reliably, fall back to `command: getent hosts macbook-pro-van-maarten.netbird.cloud`
   with `exit-status: 0`. To be validated on-host during the functional check.
3. **`ping` privileges** — running the daemon as `root` (chosen) makes ICMP ping
   straightforward; confirm `ping` on PiKVM isn't restricted by `net.ipv4.ping_group_range`
   in a way that needs adjustment.
4. **Version gate fact** — plan uses the generic `Command` fact on `goss --version`. If a
   reusable `GossVersion` fact is preferred (mirroring `NetbirdVersion`), that's an
   "ask first" addition to `libs/pyinfra-custom`.
