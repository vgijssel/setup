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
from pathlib import Path

from pyinfra import host
from pyinfra.facts.files import Directory, File, Link, Sha256File
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
