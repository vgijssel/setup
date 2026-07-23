"""pyinfra deploy for the PiKVM Tailscale -> NetBird migration.

Host operations are added incrementally per ``apps/pikvm/tasks/plan.md``. This is the
single source of operations shared by both inventories (``inventories/production.py``
and ``inventories/local.py``); the inventories only change how the host is reached.

Secrets (NetBird setup key, PiKVM admin password, system root password) are read at
runtime from OpenBao via ``secrets.py`` -- never committed or logged. Even a ``--dry``
run reads OpenBao (a harmless read), so OpenBao must be reachable to run at all.
"""

import os
import sys

from pyinfra import host
from pyinfra.facts.server import Hostname

# Put this directory first on sys.path so the local ``secrets`` module wins over the
# standard-library ``secrets`` module regardless of how pyinfra invokes this file.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from secrets import get_secrets  # noqa: E402

# Fail fast if OpenBao is unreachable or a field is missing (SPEC 6). Operations added
# in Tasks 4-8 consume these values; nothing here logs them.
_secrets = get_secrets()

# Read-only fact only: exercises the SSH connection + secrets seam end to end without
# mutating the host. Real, host-changing operations land in the next tasks.
host.get_fact(Hostname)
