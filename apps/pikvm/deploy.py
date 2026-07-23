"""pyinfra deploy for the PiKVM Tailscale -> NetBird migration.

Single source of operations shared by both inventories (``inventories/production.py``
and ``inventories/local.py``); the inventories only change how the host is reached.

Read-only rootfs discipline
---------------------------
PiKVM's root filesystem is mounted read-only. PiKVM ships ``rw`` / ``ro`` helpers that
remount it read-write / read-only. Every host mutation is wrapped ``rw`` -> write ->
``ro``. Because ``rw`` / ``ro`` are plain shell commands (pyinfra cannot tell they are
no-ops), they are only queued when a fact check shows the slice is actually out of sync
-- so a converged box produces an empty ``--dry`` diff. The idempotent ``files.*``
operations are always queued; they self-verify and report no change when converged.

Secrets (NetBird setup key, PiKVM admin/root passwords) are read at runtime from
OpenBao via ``secrets.py`` -- never committed or logged. Even ``--dry`` reads OpenBao.

Behaviour reproduced verbatim from https://docs.pikvm.org/netbird/ (asset files under
``files/`` are kept byte-for-byte to the docs for auditability).
"""

import hashlib
import os
import sys
from io import StringIO
from pathlib import Path

from jinja2 import Template
from pyinfra import host
from pyinfra.facts.files import Directory, File, Link, Sha256File
from pyinfra.facts.server import Command
from pyinfra.operations import files, server

# Put this directory first on sys.path so the local ``secrets`` module wins over the
# standard-library ``secrets`` module regardless of how pyinfra invokes this file.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from secrets import get_secrets  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = os.path.join(HERE, "files")

# Fail fast if OpenBao is unreachable or a field is missing (SPEC 6). Later slices
# consume these values; nothing here logs them.
_secrets = get_secrets()


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


# ── NetBird read-only-rootfs overlay (Task 4) ────────────────────────────────────
# Persistent state dir + tmpfs-overlay helper + oneshot unit that mounts the overlay
# before NetBird and copies state back on stop. Enable only here; starting happens
# alongside NetBird in a later slice.

NETBIRD_STATE_DIR = "/root/netbird-state"
OVERLAY_SCRIPT_SRC = os.path.join(FILES, "setup-netbird-overlay.sh")
OVERLAY_SCRIPT_REMOTE = "/usr/local/bin/setup-netbird-overlay.sh"
OVERLAY_UNIT_SRC = os.path.join(FILES, "netbird-overlay.service")
OVERLAY_UNIT_REMOTE = "/etc/systemd/system/netbird-overlay.service"
OVERLAY_WANTS_LINK = (
    "/etc/systemd/system/multi-user.target.wants/netbird-overlay.service"
)

overlay_needs_rw = (
    host.get_fact(Directory, path=NETBIRD_STATE_DIR) is None
    or _file_out_of_sync(OVERLAY_SCRIPT_REMOTE, OVERLAY_SCRIPT_SRC)
    or _file_out_of_sync(OVERLAY_UNIT_REMOTE, OVERLAY_UNIT_SRC)
    or host.get_fact(Link, path=OVERLAY_WANTS_LINK) is None
)

if overlay_needs_rw:
    server.shell(
        name="Overlay: remount rootfs read-write",
        commands=["rw"],
    )

files.directory(
    name="Overlay: persistent NetBird state directory",
    path=NETBIRD_STATE_DIR,
    present=True,
)
files.put(
    name="Overlay: install setup-netbird-overlay.sh",
    src=OVERLAY_SCRIPT_SRC,
    dest=OVERLAY_SCRIPT_REMOTE,
    mode="755",
)
files.put(
    name="Overlay: install netbird-overlay.service",
    src=OVERLAY_UNIT_SRC,
    dest=OVERLAY_UNIT_REMOTE,
    mode="644",
)

if overlay_needs_rw:
    server.shell(
        name="Overlay: enable netbird-overlay.service",
        commands=[
            "systemctl daemon-reload",
            "systemctl enable netbird-overlay.service",
        ],
    )
    server.shell(
        name="Overlay: remount rootfs read-only",
        commands=["ro"],
    )


# ── NetBird install from AUR + systemd override (Task 5) ─────────────────────────
# Build netbird-bin from the AUR as the unprivileged kvmd-webterm user (makepkg
# refuses to run as root), install with pacman, and drop the PiKVM systemd override.
#
# The AUR PKGBUILD always builds the latest release, so NETBIRD_VERSION is the pin we
# expect: the build/install runs only when the installed version does not match it. If
# the AUR moves past the pin, the box never converges (a loud, visible signal) until
# NETBIRD_VERSION is bumped -- Renovate owns that bump.

NETBIRD_VERSION = "0.74.7"
NETBIRD_OVERRIDE_DIR = "/etc/systemd/system/netbird@.service.d"
NETBIRD_OVERRIDE_SRC = os.path.join(FILES, "netbird@.service.d", "pikvm.conf")
NETBIRD_OVERRIDE_REMOTE = os.path.join(NETBIRD_OVERRIDE_DIR, "pikvm.conf")
NETBIRD_WANTS_LINK = (
    "/etc/systemd/system/multi-user.target.wants/netbird@netbird.service"
)

_netbird_installed_version = (
    host.get_fact(Command, command="netbird version 2>/dev/null || true") or ""
)
netbird_needs_install = NETBIRD_VERSION not in _netbird_installed_version

netbird_needs_rw = (
    netbird_needs_install
    or host.get_fact(Directory, path=NETBIRD_OVERRIDE_DIR) is None
    or _file_out_of_sync(NETBIRD_OVERRIDE_REMOTE, NETBIRD_OVERRIDE_SRC)
    or host.get_fact(Link, path=NETBIRD_WANTS_LINK) is None
)

if netbird_needs_rw:
    server.shell(
        name="NetBird: remount rootfs read-write",
        commands=["rw"],
    )

if netbird_needs_install:
    server.shell(
        name="NetBird: build netbird-bin from AUR (as kvmd-webterm) and install",
        commands=[
            "pacman -Syu --needed --noconfirm git base-devel",
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
files.put(
    name="NetBird: install netbird@.service.d/pikvm.conf override",
    src=NETBIRD_OVERRIDE_SRC,
    dest=NETBIRD_OVERRIDE_REMOTE,
    mode="644",
)

if netbird_needs_rw:
    server.shell(
        name="NetBird: enable netbird@netbird.service",
        commands=[
            "systemctl daemon-reload",
            "systemctl enable netbird@netbird.service",
        ],
    )
    server.shell(
        name="NetBird: remount rootfs read-only",
        commands=["ro"],
    )


# ── netbird up + state persistence (Task 6) ──────────────────────────────────────
# Start the overlay + NetBird, register with the setup key, and persist the runtime
# state (tmpfs) back to /root/netbird-state so it survives reboots. All of this runs
# only when the peer is not already connected -- so a converged box makes no changes.
#
# The setup key is passed via the NB_SETUP_KEY environment variable and referenced as
# $NB_SETUP_KEY in the command, so it never appears in pyinfra's command/--dry output.

_netbird_status = (
    host.get_fact(Command, command="netbird status 2>/dev/null || true") or ""
)
netbird_connected = "Management: Connected" in _netbird_status

if not netbird_connected:
    server.shell(
        name="NetBird: start overlay and netbird services",
        commands=[
            "systemctl start netbird-overlay.service",
            "systemctl start netbird@netbird.service",
        ],
    )
    server.shell(
        name="NetBird: register with setup key (--disable-dns)",
        commands=['netbird up --setup-key "$NB_SETUP_KEY" --disable-dns'],
        _env={"NB_SETUP_KEY": _secrets.netbird_setup_key},
    )
    server.shell(
        name="NetBird: persist runtime state to /root/netbird-state",
        commands=[
            "rw",
            "cp -a /tmp/netbird-state/. /root/netbird-state/",
            "ro",
        ],
    )


# ── PiKVM admin + system root passwords (Task 7) ─────────────────────────────────
# Set the PiKVM web `admin` password (kvmd-htpasswd) and the system `root` password
# (chpasswd) from OpenBao. Both write to the rootfs (rw-guarded). Passwords are hashed
# and salted on disk, so we detect "already applied" with a root-only fingerprint file
# rather than by comparing hashes -- a converged box then makes no changes.
#
# Both secrets are passed via the environment and referenced as shell variables, so
# they never appear in pyinfra's command/--dry output. The fingerprint written to disk
# is a one-way digest, not the password.

PASSWORD_FP_FILE = "/root/.pikvm-provision-secrets.sha256"

_desired_password_fp = _fingerprint(
    _secrets.admin_password,
    _secrets.root_password,
)
_current_password_fp = (
    host.get_fact(Command, command=f"cat {PASSWORD_FP_FILE} 2>/dev/null || true") or ""
).strip()
passwords_need_update = _desired_password_fp != _current_password_fp

if passwords_need_update:
    server.shell(
        name="Passwords: remount rootfs read-write",
        commands=["rw"],
    )
    server.shell(
        name="Passwords: set PiKVM web admin password",
        commands=[
            "printf '%s\\n' \"$PIKVM_ADMIN_PASSWORD\" "
            "| kvmd-htpasswd set admin --read-stdin --quiet",
        ],
        _env={"PIKVM_ADMIN_PASSWORD": _secrets.admin_password},
    )
    server.shell(
        name="Passwords: set system root password",
        commands=["printf '%s:%s\\n' root \"$PIKVM_ROOT_PASSWORD\" | chpasswd"],
        _env={"PIKVM_ROOT_PASSWORD": _secrets.root_password},
    )
    server.shell(
        name="Passwords: record provisioning fingerprint",
        commands=[
            f"printf %s '{_desired_password_fp}' > {PASSWORD_FP_FILE}",
            f"chmod 600 {PASSWORD_FP_FILE}",
        ],
    )
    server.shell(
        name="Passwords: remount rootfs read-only",
        commands=["ro"],
    )


# ── Static IPv4 via systemd-networkd (Task 8) ────────────────────────────────────
# Assign a static IPv4 by rendering /etc/systemd/network/<iface>.network. The default
# address equals the current LAN IP (192.168.1.31/24), so a normal apply changes no
# address -- only pins it. Applying it uses `networkctl reload && reconfigure`, not a
# networkd restart, so the active SSH session is not severed when the address is
# unchanged.
#
# CONNECTIVITY RISK (SPEC 7 "ask first"): changing PIKVM_STATIC_IP/gateway to values
# that differ from the live network can drop the box mid-apply. Get operator sign-off
# before the first real apply; prefer running with `-- --dry` first.
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

if static_ip_needs_rw:
    server.shell(
        name="Static IP: remount rootfs read-write",
        commands=["rw"],
    )

files.put(
    name=f"Static IP: systemd-networkd config for {STATIC_IFACE}",
    src=StringIO(_network_rendered),
    dest=NETWORK_REMOTE,
    mode="644",
)

if static_ip_needs_rw:
    # Remount ro first, then apply without a full networkd restart. reconfigure re-reads
    # the link config in place; with an unchanged address the SSH session survives.
    server.shell(
        name="Static IP: remount ro and reconfigure interface",
        commands=[
            "ro",
            "networkctl reload",
            f"networkctl reconfigure {STATIC_IFACE}",
        ],
    )
