"""Network inventory: target the PiKVM over NetBird/Tailscale.

Used by ``moon run pikvm:apply`` for ongoing management once the box is reachable
by name. For the very first apply (box not yet on NetBird), use ``local.py`` instead.
"""

import os

PIKVM_HOST = os.environ.get("PIKVM_HOST", "pikvm.tail2c33e2.ts.net")
PIKVM_SSH_USER = os.environ.get("PIKVM_SSH_USER", "root")

hosts = [
    (
        PIKVM_HOST,
        {
            "ssh_user": PIKVM_SSH_USER,
            # accept-new: auto-trust a fresh box's key, still refuse a changed one.
            "ssh_strict_host_key_checking": "accept-new",
        },
    ),
]
