"""pyinfra deploy for the PiKVM Tailscale -> NetBird migration.

Single source of operations shared by both inventories (``inventories/production.py``
and ``inventories/local.py``); the inventories only change how the host is reached.

Declarative style
-----------------
Host state is read through **facts** and mutations are expressed as **operations** --
pyinfra's built-ins (``files.*``, ``systemd.service``, ``pacman.packages``,
``server.reboot``) plus custom facts/operations from the ``pyinfra_custom`` library
(``libs/pyinfra-custom``). The handful of genuinely one-shot actions with no operation
equivalent (``pikvm-update``, the AUR build, the detached NetBird reconcile, ``chpasswd``,
``networkctl``) remain ``server.shell`` and are called out inline.

Read-only rootfs discipline
---------------------------
PiKVM's root filesystem is mounted read-only. The custom ``rootfs.writable(changed_if=...)``
context remounts read-write before a block of writes and read-only after -- but only when
``changed_if`` shows the slice is actually out of sync, so a converged box performs no
remount and produces an empty ``--dry`` diff. The idempotent ``files.*`` operations inside
are always queued; they self-verify and report no change when converged.

Secrets (NetBird setup key, PiKVM admin/root passwords) are read from OpenBao via the
``OpenBaoSecret`` fact, which fetches on the control machine and never transmits secret
material to the PiKVM. Values passed to the host ride in per-command ``_env`` and never
appear in argv or ``--dry`` output. Even ``--dry`` reads OpenBao.

Behaviour reproduced verbatim from https://docs.pikvm.org/netbird/ (asset files under
``files/`` are kept byte-for-byte to the docs for auditability).
"""

import hashlib
import ipaddress
import os
from io import StringIO
from pathlib import Path

from jinja2 import Template
from pyinfra import host
from pyinfra.facts.files import Directory, File, Link, Sha256File
from pyinfra.operations import files, pacman, server, systemd
from pyinfra_custom.facts import (
    GossVersion,
    NetbirdConnected,
    NetbirdDnsDisabled,
    NetbirdServerSshAllowed,
    NetbirdSshRootEnabled,
    NetbirdVersion,
    OpenBaoSecret,
    PacmanUpgradablePackages,
)
from pyinfra_custom.operations import netbird, pikvm, rootfs

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = os.path.join(HERE, "files")

# OpenBao KV v2 location for this host's secrets (see libs/pyinfra-custom OpenBaoSecret).
SECRET_MOUNT = "kv"
SECRET_PATH = "pikvm"

# Escape hatch for running the deploy when OpenBao is unreachable (pyinfra has no
# Ansible-style per-task tags). When set, the OpenBao-backed slices are skipped:
#   * Task 7 (PiKVM admin + root passwords) is skipped entirely.
#   * Task 6 first-bring-up registration (reads the setup key) is refused with a clear
#     error -- an unregistered box genuinely cannot register without the key. A box that
#     is already connected takes the secret-free reconcile branch, so skipping is safe.
# Every non-secret slice (goss health, NetBird overlay/routing, static IP, ...) still
# runs. Set PIKVM_SKIP_SECRETS=1 (or true/yes) to enable.
SKIP_SECRETS = os.environ.get("PIKVM_SKIP_SECRETS", "").strip().lower() in (
    "1",
    "true",
    "yes",
)


def _secret(field: str) -> str:
    """Read one field of ``kv/pikvm`` from OpenBao as a fact (fetched on the control host)."""
    return host.get_fact(
        OpenBaoSecret,
        mount=SECRET_MOUNT,
        path=SECRET_PATH,
        field=field,
    )


def _local_sha256(path: str) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def _file_out_of_sync(remote: str, local_src: str) -> bool:
    """True if the remote file is absent or its contents differ from ``local_src``."""
    if host.get_fact(File, path=remote) is None:
        return True
    return host.get_fact(Sha256File, path=remote) != _local_sha256(local_src)


def _fingerprint(*values: str) -> str:
    """Stable, non-reversible fingerprint used only to detect desired-value changes.

    Exposure is negligible: it is stored root-only and reveals no more than the crypt
    hashes root can already read in /etc/shadow and /etc/kvmd/htpasswd.
    """
    digest = hashlib.sha256(b"pikvm-provision-v1")
    for value in values:
        digest.update(b"\0")
        digest.update(value.encode())
    return digest.hexdigest()


# ── Root SSH authorized key (bootstrap — must run FIRST) ─────────────────────────
# Authorize the operator SSH public key for root so the box stays reachable over the
# LAN (192.168.1.31) with key auth as a fallback. This runs before NetBird so that if
# the overlay/NetBird bring-up blips the network session the apply is running over, the
# operator can reconnect over the LAN and re-run. rw-guarded and idempotent.
#
# We render authorized_keys to EXACTLY this one key (files.put of the full content), so
# the apply also *removes* any other keys -- e.g. a temporary deploy key added out of
# band. files.put self-verifies against the remote sha, so a converged box is a no-op.

ROOT_SSH_DIR = "/root/.ssh"
ROOT_AUTHORIZED_KEYS = f"{ROOT_SSH_DIR}/authorized_keys"
ROOT_SSH_PUBKEY = (
    "ssh-ed25519 "
    "AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp"
)
_authorized_keys = ROOT_SSH_PUBKEY + "\n"

ssh_key_needs_rw = (
    host.get_fact(Directory, path=ROOT_SSH_DIR) is None
    or host.get_fact(Sha256File, path=ROOT_AUTHORIZED_KEYS)
    != hashlib.sha256(_authorized_keys.encode()).hexdigest()
)

with rootfs.writable(changed_if=ssh_key_needs_rw):
    files.directory(
        name="Root SSH key: ensure /root/.ssh (0700)",
        path=ROOT_SSH_DIR,
        mode="700",
        present=True,
    )
    files.put(
        name="Root SSH key: render authorized_keys to exactly the operator key",
        src=StringIO(_authorized_keys),
        dest=ROOT_AUTHORIZED_KEYS,
        mode="600",
    )


# ── PiKVM OS update (must run before NetBird) ────────────────────────────────────
# Follow the official OS-update path (docs.pikvm.org/_update_os): `pikvm-update`
# remounts rw, force-refreshes the db, self-updates the updater, runs the curated
# `pacman -Su` (with --overwrite/--ask), validates the kvmd config, and normally
# reboots. We call it with --no-reboot and let pyinfra own the reboot so the apply can
# continue on the freshly-updated system. The PiKVM AUR/NetBird guide assumes an
# up-to-date box, so this belongs before the NetBird slices.
#
# `pikvm-update` is a bespoke one-shot with its own exit-code contract, so it stays a
# documented server.shell (no operation equivalent):
#   0   -> already up-to-date / completed, no reboot needed
#   100 -> update applied successfully, reboot required (its --no-reboot signal)
#   101 -> kvmd config broke mid-update: DO NOT REBOOT -- fail loudly
# so we treat {0,100} as success and only then reboot; 101 (or anything else) aborts
# the apply with the rootfs left rw for inspection, exactly as the updater intends.
#
# CONNECTIVITY: this is a large, major-version upgrade that restarts core services and
# can briefly disrupt the network session the apply runs over. It runs under a detached
# systemd unit (below) so a dropped session cannot kill it mid-transaction; prefer the
# LAN inventory for the first run. A failed upgrade can need physical recovery (docs).

_upgradable = host.get_fact(PacmanUpgradablePackages)
os_update_needed = len(_upgradable) > 0

if os_update_needed:
    # Run the upgrade under a transient systemd unit (systemd-run --wait), NOT directly
    # over SSH. The upgrade restarts core services and can sever the session we run over;
    # a detached unit keeps upgrading regardless, so a dropped connection can never kill
    # pacman mid-transaction. --wait blocks and propagates the unit's result while the
    # session is alive; if the session drops the unit finishes on the box anyway and we
    # simply re-run the apply (pending upgrades -> 0 -> skipped).
    #
    # SuccessExitStatus=100 maps pikvm-update's "applied, reboot required" (--no-reboot)
    # onto systemd success, so the op passes for exit 0 or 100 and only fails for 101
    # (broken kvmd config, "DO NOT REBOOT") or any other error -- which aborts the apply
    # before the reboot, leaving the box rw for inspection exactly as intended.
    server.shell(
        name=f"OS update: pikvm-update via systemd-run ({len(_upgradable)} pending)",
        commands=[
            "systemctl reset-failed pikvm-os-update.service 2>/dev/null || true",
            "systemd-run --unit=pikvm-os-update --wait --collect "
            "--property=SuccessExitStatus=100 "
            "/usr/bin/pikvm-update --no-reboot",
        ],
    )
    server.reboot(
        name="OS update: reboot into the updated system and wait for reconnect",
        delay=10,
        reboot_timeout=900,
    )


# ── NetBird read-only-rootfs overlay (Task 4) ────────────────────────────────────
# Persistent state dir + tmpfs-overlay helper + oneshot unit that mounts the overlay
# before NetBird and copies state back on stop. Enable only here; starting happens
# alongside NetBird in a later slice.

NETBIRD_STATE_DIR = "/root/netbird-state"
# Bind-mount target for the writable overlay. The netbird-bin package does NOT ship
# /var/lib/netbird, and the rootfs is read-only at boot, so the mount target must be
# created here (persistently, while rw) or the overlay unit fails every boot with
# "mkdir: cannot create directory '/var/lib/netbird': Read-only file system".
NETBIRD_LIB_DIR = "/var/lib/netbird"
OVERLAY_SCRIPT_SRC = os.path.join(FILES, "setup-netbird-overlay.sh")
OVERLAY_SCRIPT_REMOTE = "/usr/local/bin/setup-netbird-overlay.sh"
OVERLAY_UNIT_SRC = os.path.join(FILES, "netbird-overlay.service")
OVERLAY_UNIT_REMOTE = "/etc/systemd/system/netbird-overlay.service"
OVERLAY_WANTS_LINK = (
    "/etc/systemd/system/multi-user.target.wants/netbird-overlay.service"
)

overlay_needs_rw = (
    host.get_fact(Directory, path=NETBIRD_STATE_DIR) is None
    or host.get_fact(Directory, path=NETBIRD_LIB_DIR) is None
    or _file_out_of_sync(OVERLAY_SCRIPT_REMOTE, OVERLAY_SCRIPT_SRC)
    or _file_out_of_sync(OVERLAY_UNIT_REMOTE, OVERLAY_UNIT_SRC)
    or host.get_fact(Link, path=OVERLAY_WANTS_LINK) is None
)

with rootfs.writable(changed_if=overlay_needs_rw):
    files.directory(
        name="Overlay: persistent NetBird state directory",
        path=NETBIRD_STATE_DIR,
        present=True,
    )
    files.directory(
        name="Overlay: persistent bind-mount target /var/lib/netbird",
        path=NETBIRD_LIB_DIR,
        present=True,
    )
    # Capture the operation results so the Task 6 reconcile can restart NetBird via
    # change detection (OperationMeta.did_change) when either overlay file changed.
    overlay_script = files.put(
        name="Overlay: install setup-netbird-overlay.sh",
        src=OVERLAY_SCRIPT_SRC,
        dest=OVERLAY_SCRIPT_REMOTE,
        mode="755",
    )
    overlay_unit = files.put(
        name="Overlay: install netbird-overlay.service",
        src=OVERLAY_UNIT_SRC,
        dest=OVERLAY_UNIT_REMOTE,
        mode="644",
    )
    if overlay_needs_rw:
        # Enable only (running=None); the unit is started with NetBird in Task 6.
        # daemon_reload is gated on overlay_needs_rw so a converged box reloads nothing.
        systemd.service(
            name="Overlay: enable netbird-overlay.service",
            service="netbird-overlay.service",
            running=None,
            enabled=True,
            daemon_reload=True,
        )


# ── NetBird install from AUR + systemd override (Task 5) ─────────────────────────
# Build netbird-bin from the AUR as the unprivileged kvmd-webterm user (makepkg
# refuses to run as root), install with pacman, and drop the PiKVM systemd override.
#
# The AUR PKGBUILD always builds the latest release, so NETBIRD_VERSION is the pin we
# expect: the build/install runs only when the installed version does not match it. If
# the AUR moves past the pin, the box never converges (a loud, visible signal) until
# NETBIRD_VERSION is bumped -- Renovate owns that bump.
#
# We deliberately do NOT run a full `pacman -Syu` here. PiKVM holds `python-periphery`
# (pinned python<3.14) while the ALARM repos already ship python 3.14, so a full upgrade
# fails to prepare its transaction. `netbird-bin` is a *binary* package (depends=(glibc),
# no makedepends), so it only needs `git` + `base-devel` (both shipped on PiKVM). We sync
# the db and install just those with pacman.packages -- no system-wide upgrade.

NETBIRD_VERSION = "0.75.0"
NETBIRD_OVERRIDE_DIR = "/etc/systemd/system/netbird@.service.d"
NETBIRD_OVERRIDE_SRC = os.path.join(FILES, "netbird@.service.d", "pikvm.conf")
NETBIRD_OVERRIDE_REMOTE = os.path.join(NETBIRD_OVERRIDE_DIR, "pikvm.conf")
NETBIRD_WANTS_LINK = (
    "/etc/systemd/system/multi-user.target.wants/netbird@netbird.service"
)

netbird_needs_install = NETBIRD_VERSION not in host.get_fact(NetbirdVersion)

netbird_needs_rw = (
    netbird_needs_install
    or host.get_fact(Directory, path=NETBIRD_OVERRIDE_DIR) is None
    or _file_out_of_sync(NETBIRD_OVERRIDE_REMOTE, NETBIRD_OVERRIDE_SRC)
    or host.get_fact(Link, path=NETBIRD_WANTS_LINK) is None
)

with rootfs.writable(changed_if=netbird_needs_rw):
    if netbird_needs_install:
        # Sync the db and ensure the build deps (both ship on PiKVM; --needed no-op).
        pacman.packages(
            name="NetBird: ensure build deps (git, base-devel)",
            packages=["git", "base-devel"],
            update=True,
        )
        # AUR build/install is a bespoke one-shot (clone + makepkg as kvmd-webterm +
        # local pacman -U); no operation equivalent, so it stays a documented shell.
        # NEVER run makepkg as root; NEVER a full `pacman -Syu` (breaks python-periphery).
        server.shell(
            name="NetBird: build netbird-bin from AUR (as kvmd-webterm) and install",
            commands=[
                "rm -rf /tmp/netbird-bin",
                "git clone https://aur.archlinux.org/netbird-bin.git /tmp/netbird-bin",
                "chown -R kvmd-webterm:kvmd-webterm /tmp/netbird-bin",
                "su -s /bin/bash kvmd-webterm -c 'cd /tmp/netbird-bin && makepkg'",
                "pacman -U --noconfirm /tmp/netbird-bin/netbird-bin-*.pkg.tar.*",
                "rm -rf /tmp/netbird-bin",
            ],
        )

    files.directory(
        name="NetBird: systemd override directory",
        path=NETBIRD_OVERRIDE_DIR,
        present=True,
    )
    # Capture the result so the Task 6 reconcile can restart NetBird (change detection)
    # when the systemd override changed -- a changed unit needs a restart to apply.
    netbird_override = files.put(
        name="NetBird: install netbird@.service.d/pikvm.conf override",
        src=NETBIRD_OVERRIDE_SRC,
        dest=NETBIRD_OVERRIDE_REMOTE,
        mode="644",
    )
    if netbird_needs_rw:
        # Enable only (running=None); started in Task 6. daemon_reload gated on the
        # change condition so a converged box reloads nothing.
        systemd.service(
            name="NetBird: enable netbird@netbird.service",
            service="netbird@netbird.service",
            running=None,
            enabled=True,
            daemon_reload=True,
        )


# ── netbird up (DNS + native SSH enabled) + config-change restart (Task 6) ───────
# NATIVE SSH: NetBird's built-in SSH server is enabled here (`allow_server_ssh=True`)
# with root login permitted (`enable_ssh_root=True`) so the box stays reachable as
# `root` the same way it is today, but authenticated by NetBird/IdP identity (JWT) over
# the wt0 overlay instead of a static authorized_keys entry. Both flags are persisted by
# NetBird in /var/lib/netbird/default.json (ServerSSHAllowed / EnableSSHRoot), so they
# are passed explicitly on every `netbird up` to make the desired state deterministic,
# and the reconcile below is gated on facts that read those persisted values so a
# converged box makes no changes. JWT auth is left ON (we do NOT pass --disable-ssh-auth);
# access is still governed by an Access Control policy in the NetBird dashboard, so the
# SSH server does no useful thing until that policy exists. The LAN root authorized_keys
# fallback (bootstrap slice above) is intentionally kept as a break-glass path.
#
# DNS is ENABLED here (`disable_dns=False`). The stock PiKVM guide passes
# `--disable-dns` to stop NetBird writing /etc/resolv.conf on the read-only rootfs, but
# that assumes NetBird's *file* DNS backend. This box runs systemd-resolved (active,
# /etc/resolv.conf symlinked into the writable tmpfs /run), so NetBird uses its
# systemd-resolved *D-Bus* backend and configures DNS at runtime -- touching no rootfs
# file. Verified live: it logs "System DNS manager discovered: systemd" and the rootfs
# stays `ro` with no /etc/resolv.conf.original.netbird written.
#
# Two entry states:
#   * Not yet registered -> start services and register with DNS enabled, persist state.
#   * Already registered -> *reconcile*: restart NetBird when any of its config changed
#     this apply (change detection via OperationMeta.did_change) and/or flip DNS on.
#     `netbird up` on an already-connected peer is a no-op, so applying a changed flag
#     needs a down/up cycle; DisableDNS is also sticky in /var/lib/netbird/default.json,
#     so it must be passed as `=false` explicitly. A converged box changes nothing.
#
# SSH-DISCONNECT SAFETY: restarting NetBird / cycling `netbird up` bounces the wt0
# interface, which severs the SSH session when the apply runs OVER NetBird (the `apply`
# inventory). The reconcile therefore runs under a detached transient unit
# (`systemd-run --wait`), exactly like the OS update above: a dropped session cannot
# kill it mid-restart -- the unit completes on the box and a re-run converges (DNS
# enabled + config unchanged -> the guard is false -> no-op). Over the LAN
# (`apply_local`) SSH is on eth0 and does not drop, so `--wait` returns normally. State
# is persisted to /root/netbird-state inside the same unit, so the enabled-DNS config
# survives a reboot atomically with the change.

netbird_connected = host.get_fact(NetbirdConnected)
# Current persisted DNS setting; only meaningful once registered (False before).
dns_currently_disabled = host.get_fact(NetbirdDnsDisabled)
# Current persisted native-SSH settings; both False before registration (no config yet),
# which correctly drives the reconcile to turn them on.
ssh_server_allowed = host.get_fact(NetbirdServerSshAllowed)
ssh_root_enabled = host.get_fact(NetbirdSshRootEnabled)

if not netbird_connected and SKIP_SECRETS:
    # Registration needs the setup key from OpenBao; there is no secret-free path to
    # bring an unregistered box onto the mesh. Fail loudly rather than silently skip.
    raise RuntimeError(
        "PIKVM_SKIP_SECRETS is set but the box is not yet registered with NetBird: "
        "first bring-up requires the setup key from OpenBao. Unset PIKVM_SKIP_SECRETS "
        "and provide OpenBao access for the initial registration.",
    )

if not netbird_connected:
    # First bring-up: start services, register with DNS enabled, persist state.
    systemd.service(
        name="NetBird: start overlay service",
        service="netbird-overlay.service",
        running=True,
    )
    systemd.service(
        name="NetBird: start netbird@netbird.service",
        service="netbird@netbird.service",
        running=True,
    )
    # netbird.up passes the setup key via per-command _env ($NB_SETUP_KEY) -- never in
    # argv or --dry.
    netbird.up(
        name="NetBird: register with setup key (DNS + native SSH enabled)",
        setup_key=_secret("netbird_setup_key"),
        disable_dns=False,
        allow_server_ssh=True,
        enable_ssh_root=True,
    )
    with rootfs.writable(changed_if=True):
        server.shell(
            name="NetBird: persist runtime state to /root/netbird-state",
            commands=["cp -a /tmp/netbird-state/. /root/netbird-state/"],
        )
else:
    # Already registered: restart to pick up a changed systemd override / overlay unit
    # (or a freshly installed binary) and/or flip DNS on. Gated by change detection +
    # the current DNS state so a converged box makes no changes. daemon-reload picks up
    # unit-file edits; the restart applies the new override; down + `up --disable-dns=false`
    # applies the DNS flag; then state is persisted -- all inside one detached unit.
    server.shell(
        name="NetBird: reconcile config/DNS (detached; survives SSH drop)",
        commands=[
            "systemctl reset-failed netbird-reconfigure.service 2>/dev/null || true",
            "systemd-run --unit=netbird-reconfigure --wait --collect /bin/sh -c '"
            "systemctl daemon-reload; "
            "systemctl restart netbird@netbird.service; "
            "sleep 1; "
            "netbird down || true; "
            "netbird up --disable-dns=false "
            "--allow-server-ssh=true --enable-ssh-root=true; "
            "rw; cp -a /tmp/netbird-state/. /root/netbird-state/; ro"
            "'",
        ],
        _if=lambda: (
            netbird_override.did_change()
            or overlay_unit.did_change()
            or overlay_script.did_change()
            or netbird_needs_install
            or dns_currently_disabled
            or not ssh_server_allowed
            or not ssh_root_enabled
        ),
    )


# ── PiKVM admin + system root passwords (Task 7) ─────────────────────────────────
# Set the PiKVM web `admin` password (pikvm.htpasswd) and the system `root` password
# (chpasswd) from OpenBao. Both write to the rootfs (rw-guarded). Passwords are hashed
# and salted on disk, so we detect "already applied" with a root-only fingerprint file
# rather than by comparing hashes -- a converged box then makes no changes.
#
# Both secrets are passed via per-command _env and referenced as shell variables, so
# they never appear in argv / --dry output. The fingerprint written to disk is a one-way
# digest, not the password; the Sha256File fact compares it without reading the value.

PASSWORD_FP_FILE = "/root/.pikvm-provision-secrets.sha256"

if SKIP_SECRETS:
    # OpenBao is unavailable -> leave the existing passwords untouched. Every other
    # (secret-free) slice still reconciles.
    passwords_need_update = False
else:
    _admin_password = _secret("admin_password")
    _root_password = _secret("root_password")
    _desired_password_fp = _fingerprint(_admin_password, _root_password)
    _desired_fp_sha = hashlib.sha256(_desired_password_fp.encode()).hexdigest()
    passwords_need_update = (
        host.get_fact(Sha256File, path=PASSWORD_FP_FILE) != _desired_fp_sha
    )

if passwords_need_update:
    with rootfs.writable(changed_if=True):
        pikvm.htpasswd(
            name="Passwords: set PiKVM web admin password",
            user="admin",
            password=_admin_password,
        )
        # chpasswd has no clean operation equivalent; documented shell, secret via _env.
        server.shell(
            name="Passwords: set system root password",
            commands=["printf '%s:%s\\n' root \"$PIKVM_ROOT_PASSWORD\" | chpasswd"],
            _env={"PIKVM_ROOT_PASSWORD": _root_password},
        )
        files.put(
            name="Passwords: record provisioning fingerprint",
            src=StringIO(_desired_password_fp),
            dest=PASSWORD_FP_FILE,
            mode="600",
        )


# ── Static IPv4 via systemd-networkd (Task 8) ────────────────────────────────────
# Assign a static IPv4 by rendering /etc/systemd/network/<iface>.network. The default
# address equals the current LAN IP (192.168.1.31/24), so a normal apply changes no
# address -- only pins it. Applying it uses `networkctl reload && reconfigure`, not a
# networkd restart, so the active SSH session is not severed when the address is
# unchanged.
#
# CONNECTIVITY RISK (SPEC "ask first"): changing PIKVM_STATIC_IP/gateway to values that
# differ from the live network can drop the box mid-apply. Get operator sign-off before
# the first real apply; prefer running with `-- --dry` first.
#
# The template is rendered here (single source of bytes) and uploaded with files.put so
# the rw gate's sha256 exactly matches what is written -> empty diff on a converged box.

STATIC_IFACE = os.environ.get("PIKVM_NET_IFACE", "eth0")
STATIC_IP = os.environ.get("PIKVM_STATIC_IP", "192.168.1.31")
STATIC_PREFIX = os.environ.get("PIKVM_STATIC_PREFIX", "24")
STATIC_GATEWAY = os.environ.get("PIKVM_GATEWAY", "192.168.1.1")
STATIC_DNS = os.environ.get("PIKVM_DNS", STATIC_GATEWAY)

_network_template = Path(os.path.join(FILES, "eth0.network.j2")).read_text(
    encoding="utf-8",
)
_network_rendered = Template(_network_template, keep_trailing_newline=True).render(
    iface=STATIC_IFACE,
    address=STATIC_IP,
    prefix=STATIC_PREFIX,
    gateway=STATIC_GATEWAY,
    dns_servers=[dns.strip() for dns in STATIC_DNS.split(",") if dns.strip()],
)
NETWORK_REMOTE = f"/etc/systemd/network/{STATIC_IFACE}.network"

_desired_network_sha = hashlib.sha256(_network_rendered.encode()).hexdigest()
static_ip_needs_rw = (
    host.get_fact(Sha256File, path=NETWORK_REMOTE) != _desired_network_sha
)

with rootfs.writable(changed_if=static_ip_needs_rw):
    files.put(
        name=f"Static IP: systemd-networkd config for {STATIC_IFACE}",
        src=StringIO(_network_rendered),
        dest=NETWORK_REMOTE,
        mode="644",
    )

if static_ip_needs_rw:
    # rootfs is already ro (context exited); reconfigure re-reads the link config in
    # place. networkctl has no pyinfra operation -> documented shell. With an unchanged
    # address the SSH session survives.
    server.shell(
        name="Static IP: reconfigure interface (rootfs already ro)",
        commands=[
            "networkctl reload",
            f"networkctl reconfigure {STATIC_IFACE}",
        ],
    )


# ── NetBird site-to-VPN routing peer (Task 9) ────────────────────────────────────
# Turn the box into a NetBird routing peer for the *site-to-VPN* direction: LAN devices
# that do NOT run NetBird reach peers inside the mesh (e.g. the Omada controller) by
# routing through this box. Reference: https://docs.netbird.io/use-cases/remote-access/site-to-vpn
#
# Two pieces of *runtime* state are required and neither survives the read-only rootfs, so --
# exactly like the NetBird overlay slice above -- a boot-time oneshot re-asserts them on every
# boot (netbird-routing.service), and the deploy applies them immediately by starting it:
#   1. IPv4 forwarding (net.ipv4.ip_forward=1).
#   2. A SNAT/masquerade rule rewriting LAN source addresses onto the NetBird interface so
#      the destination mesh peer sees this peer's NetBird IP (its access-control policy
#      recognises it). The dashboard "Masquerade" route flag only covers the mesh->LAN
#      direction, so the LAN->mesh rule is installed here explicitly (per the docs).
# The unit orders After=netbird@netbird.service so the rule lands after NetBird rebuilds the
# nat table on start; the setup script is idempotent (iptables -C guard), so the boot
# re-assert and the deploy's reconcile never stack duplicate rules.
#
# MANUAL OPERATOR STEPS -- managed in the NetBird dashboard and on the LAN router, NOT here
# (this repo does not manage the NetBird account policy or the router):
#   1. NetBird dashboard -> Network Routing: designate this peer (via its group) as a routing
#      peer and add an Access Control policy permitting the LAN source group -> the mesh
#      destination (e.g. the Omada resource/peer). Without the route + policy NetBird does not
#      distribute the network to this peer and traffic is dropped.
#   2. LAN router: add a static route for the NetBird account block 100.65.0.0/16 -> this
#      box's LAN IP (192.168.1.31), or push it via DHCP option 121, so LAN devices send
#      mesh-bound traffic here. The SNAT rule below then rewrites their source to wt0.
#
# LAN CIDR defaults to the network of the Task 8 static IP (single source of truth for this
# box's LAN); the NetBird interface defaults to wt0. Both are overridable by env for reuse.

ROUTING_LAN_CIDR = os.environ.get(
    "PIKVM_LAN_CIDR",
    str(ipaddress.ip_network(f"{STATIC_IP}/{STATIC_PREFIX}", strict=False)),
)
ROUTING_IFACE = os.environ.get("PIKVM_NETBIRD_IFACE", "wt0")

ROUTING_SCRIPT_SRC = os.path.join(FILES, "setup-netbird-routing.sh")
ROUTING_SCRIPT_REMOTE = "/usr/local/bin/setup-netbird-routing.sh"
ROUTING_UNIT_SRC = os.path.join(FILES, "netbird-routing.service.j2")
ROUTING_UNIT_REMOTE = "/etc/systemd/system/netbird-routing.service"
ROUTING_WANTS_LINK = (
    "/etc/systemd/system/multi-user.target.wants/netbird-routing.service"
)

# Render the unit here (single source of the injected values) so the rw gate's sha256
# exactly matches what is written -> empty diff on a converged box. The setup script is a
# static asset (shellcheck-clean) that reads the values from the unit's Environment=.
_routing_unit_template = Path(ROUTING_UNIT_SRC).read_text(encoding="utf-8")
_routing_unit_rendered = Template(
    _routing_unit_template,
    keep_trailing_newline=True,
).render(lan_cidr=ROUTING_LAN_CIDR, iface=ROUTING_IFACE)
_routing_unit_sha = hashlib.sha256(_routing_unit_rendered.encode()).hexdigest()

routing_needs_rw = (
    _file_out_of_sync(ROUTING_SCRIPT_REMOTE, ROUTING_SCRIPT_SRC)
    or host.get_fact(Sha256File, path=ROUTING_UNIT_REMOTE) != _routing_unit_sha
    or host.get_fact(Link, path=ROUTING_WANTS_LINK) is None
)

with rootfs.writable(changed_if=routing_needs_rw):
    # Capture the results so the reconcile below restarts the unit (change detection) only
    # when an asset actually changed -- a changed script/unit needs a re-run to apply.
    routing_script = files.put(
        name="Routing peer: install setup-netbird-routing.sh",
        src=ROUTING_SCRIPT_SRC,
        dest=ROUTING_SCRIPT_REMOTE,
        mode="755",
    )
    routing_unit = files.put(
        name="Routing peer: install netbird-routing.service",
        src=StringIO(_routing_unit_rendered),
        dest=ROUTING_UNIT_REMOTE,
        mode="644",
    )
    if routing_needs_rw:
        # Enable only (running=None); started below. daemon_reload gated on the change
        # condition so a converged box reloads nothing.
        systemd.service(
            name="Routing peer: enable netbird-routing.service",
            service="netbird-routing.service",
            running=None,
            enabled=True,
            daemon_reload=True,
        )

# Ensure the unit is active so the rule is applied now, not just at next boot. For a
# RemainAfterExit oneshot this is a no-op once it has run, so a converged box makes no
# change. Unlike the netbird up reconcile this does not bounce wt0, so the SSH session is
# not at risk -- a plain systemd start/restart is safe over either inventory.
systemd.service(
    name="Routing peer: ensure netbird-routing.service is running",
    service="netbird-routing.service",
    running=True,
)
# Re-run the setup script when an asset changed this apply (change detection). A oneshot's
# ExecStart only re-runs on restart, so daemon-reload + restart applies the new script/unit.
server.shell(
    name="Routing peer: re-apply rule after config change",
    commands=[
        "systemctl daemon-reload",
        "systemctl restart netbird-routing.service",
    ],
    _if=lambda: routing_script.did_change() or routing_unit.did_change(),
)


# ── System-health validation via goss serve (Task 10) ────────────────────────────
# Install goss (pinned, sha256-verified) and run it as a long-lived `goss serve` daemon
# bound to 127.0.0.1:8080, driven by a declarative /etc/goss/goss.yaml. A thin `validate`
# client queries the daemon for a human-readable (rspecish) pass/fail report; netdata can
# scrape the same endpoint as prometheus/verbose (one metric per assertion). See SPEC.md.
#
# Read-only-rootfs split: the goss binary and `validate` live under /usr/local/bin, which
# is on the *separate* read-only /usr partition that PiKVM's stock `rw` helper does NOT
# remount -- so those writes are wrapped in rootfs.writable_usr. The config + unit live on
# the root partition (/etc, /etc/systemd/system) and use the ordinary rootfs.writable.
GOSS_VERSION = "0.4.10"
GOSS_ARCH = "arm64"
GOSS_SHA256 = "90a59612b4d67d9f1a9038634c000790136bb82526a69de1e81ac075c2f6d2c6"
GOSS_URL = (
    f"https://github.com/goss-org/goss/releases/download/v{GOSS_VERSION}/"
    f"goss_{GOSS_VERSION}_linux_{GOSS_ARCH}.tar.gz"
)

GOSS_BIN_REMOTE = "/usr/local/bin/goss"
GOSS_YAML_SRC = os.path.join(FILES, "goss.yaml")
GOSS_YAML_REMOTE = "/etc/goss/goss.yaml"
VALIDATE_SRC = os.path.join(FILES, "validate")
VALIDATE_REMOTE = "/usr/local/bin/validate"
GOSS_UNIT_SRC = os.path.join(FILES, "goss-serve.service")
GOSS_UNIT_REMOTE = "/etc/systemd/system/goss-serve.service"

# Install gate: only download/verify/install when the pinned version is absent. The AUR
# never applies here (goss is a direct pinned binary, not a package), so this is the sole
# source of the version -- a mismatch (Renovate bumps the pin) triggers a reinstall.
goss_needs_install = GOSS_VERSION not in host.get_fact(GossVersion)

# /usr writes: the binary (when out of date) and the validate client.
usr_needs_rw = goss_needs_install or _file_out_of_sync(VALIDATE_REMOTE, VALIDATE_SRC)
# root-partition writes: the assertion spec and the systemd unit.
etc_needs_rw = (
    host.get_fact(Directory, path="/etc/goss") is None
    or _file_out_of_sync(GOSS_YAML_REMOTE, GOSS_YAML_SRC)
    or _file_out_of_sync(GOSS_UNIT_REMOTE, GOSS_UNIT_SRC)
)

with rootfs.writable_usr(changed_if=usr_needs_rw):
    if goss_needs_install:
        # Download + sha256-verify + install is a bespoke one-shot (no operation
        # equivalent); documented shell. The pinned digest guards against a tampered or
        # wrong-arch download before it ever lands on PATH.
        server.shell(
            name=f"goss: install {GOSS_VERSION} to {GOSS_BIN_REMOTE} (verified sha256)",
            commands=[
                "set -e",
                "tmp=$(mktemp -d)",
                f'curl -fsSL -o "$tmp/goss.tgz" {GOSS_URL}',
                f"echo '{GOSS_SHA256}  '\"$tmp/goss.tgz\" | sha256sum -c -",
                'tar -xzf "$tmp/goss.tgz" -C "$tmp" goss',
                f'install -m 0755 "$tmp/goss" {GOSS_BIN_REMOTE}',
                'rm -rf "$tmp"',
            ],
        )
    files.put(
        name="goss: install validate client to /usr/local/bin",
        src=VALIDATE_SRC,
        dest=VALIDATE_REMOTE,
        mode="755",
    )

with rootfs.writable(changed_if=etc_needs_rw):
    files.directory(
        name="goss: ensure /etc/goss",
        path="/etc/goss",
        present=True,
    )
    # Capture the results so the reconcile below restarts the daemon (change detection)
    # only when the spec or unit actually changed.
    goss_cfg = files.put(
        name="goss: install assertion spec /etc/goss/goss.yaml",
        src=GOSS_YAML_SRC,
        dest=GOSS_YAML_REMOTE,
        mode="644",
    )
    goss_unit = files.put(
        name="goss: install goss-serve.service unit",
        src=GOSS_UNIT_SRC,
        dest=GOSS_UNIT_REMOTE,
        mode="644",
    )
    if etc_needs_rw:
        # Enable only (running=None); started below. daemon_reload gated on the change
        # condition so a converged box reloads nothing.
        systemd.service(
            name="goss: enable goss-serve.service",
            service="goss-serve.service",
            running=None,
            enabled=True,
            daemon_reload=True,
        )

# Ensure the daemon is up now, not just at next boot. Idempotent: a converged box makes
# no change.
systemd.service(
    name="goss: ensure goss-serve.service is running",
    service="goss-serve.service",
    running=True,
)
# Restart to pick up a changed spec/unit (change detection). goss re-reads the spec on
# every request, but a changed *serve* flag or bind address lives in the unit, so a
# daemon-reload + restart is the safe way to apply either.
server.shell(
    name="goss: restart goss-serve after spec/unit change",
    commands=[
        "systemctl daemon-reload",
        "systemctl restart goss-serve.service",
    ],
    _if=lambda: goss_cfg.did_change() or goss_unit.did_change(),
)
