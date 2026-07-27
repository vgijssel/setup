# Plan: PiKVM as a NetBird site-to-VPN routing peer

**Goal:** LAN devices (which do *not* run NetBird) reach the Omada controller — assumed
already reachable inside the NetBird mesh — by routing through the PiKVM. The PiKVM becomes
a NetBird **routing peer** for the site-to-VPN direction (LAN → mesh).

**Scope (confirmed with operator):**
- **In repo (IaC):** PiKVM `apps/pikvm` pyinfra changes only — enable IPv4 forwarding and
  SNAT-masquerade the LAN CIDR onto the NetBird interface (`wt0`), persisted across the
  read-only rootfs the same way the existing NetBird overlay is (boot-time oneshot unit).
- **Route target:** the whole NetBird account block `100.65.0.0/16`.
- **Manual / documented (NOT scripted here):** the NetBird dashboard route + access policy
  that designate the PiKVM as a routing peer for the LAN group, and the LAN router's static
  route `100.65.0.0/16 → 192.168.1.31` (or DHCP option 121). These are captured as an inline
  comment block in `deploy.py`, not a separate doc (repo file policy).

**Testing strategy:** `apps/pikvm` is declarative infra with no unit-test harness (moon.yml
excludes `test`; validated by lint + live idempotency, per the network SPEC's model). RED =
converged state absent on the box; GREEN = first apply installs it; regression = re-apply
reports *No changes*; build = `ruff` lint + `uv sync`.

## Facts (verified in repo)
- LAN CIDR = `192.168.1.0/24` (static IP `192.168.1.31/24`, gw `.1` — `deploy.py` Task 8).
- NetBird iface = `wt0`; PiKVM NetBird IP `100.65.192.152` → account block `100.65.0.0/16`.
- Read-only rootfs: runtime kernel/netfilter state is re-asserted at boot by a oneshot unit
  (mirrors `netbird-overlay.service`), because nothing on the RO rootfs would otherwise
  persist an iptables rule.

## Tasks

### Task 1 — Routing-peer enablement in `apps/pikvm` (code slice)  [reversible; do now]
Acceptance criteria:
- `files/setup-netbird-routing.sh`: idempotent — sets `net.ipv4.ip_forward=1` and adds the
  SNAT rule only if absent (`iptables -t nat -C … || -A POSTROUTING -s <LAN_CIDR> -o <IFACE>
  -j MASQUERADE`). Safe to re-run and to run at boot.
- `files/netbird-routing.service`: `Type=oneshot`, `RemainAfterExit=yes`,
  `After=netbird@netbird.service`, `WantedBy=multi-user.target` (rule lands after NetBird's
  own firewall init; re-asserts every boot).
- `deploy.py` gains a "Task 9" slice mirroring the overlay slice: rw-guarded `files.put` of
  the two files, enable + start the unit, and a change-gated reconcile that re-runs the
  script when either file changed. LAN CIDR + iface are parameterised by env (defaults
  `192.168.1.0/24`, `wt0`) consistent with the static-IP slice.
- Inline comment block documents the manual dashboard-route/policy + LAN static-route steps.
- `moon run pikvm:lint` passes; `moon run pikvm:install` (`uv sync`) clean; `trunk check` on
  changed files clean.
- Commit.

### Task 2 — Live apply + functional verification  [HIGH-RISK; operator-gated, STOP before]
Acceptance criteria (requires OpenBao token + box access; changes packet routing):
- `moon run pikvm:apply -- --dry …` reviewed; then real apply.
- First apply: the two new ops make changes; re-apply reports the routing ops as *No changes*
  (idempotency/regression).
- On the box: `sysctl -n net.ipv4.ip_forward` = `1`; `iptables -t nat -S POSTROUTING` shows
  the masquerade rule; `iptables` backend confirmed present (else switch to `nft`).
- Functional: from a LAN host with the `100.65.0.0/16 → 192.168.1.31` static route, reach the
  Omada controller's mesh address through the PiKVM.
- Do **not** run this without explicit operator sign-off (remote box reached over NetBird;
  networking change).
