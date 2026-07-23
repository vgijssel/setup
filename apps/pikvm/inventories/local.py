"""LAN inventory: target the PiKVM directly at its local IP.

Used by ``moon run pikvm:apply_local`` for the first apply, when the box is not yet
on NetBird or Tailscale.
"""

import os

PIKVM_LOCAL_IP = os.environ.get("PIKVM_LOCAL_IP", "192.168.1.31")
PIKVM_SSH_USER = os.environ.get("PIKVM_SSH_USER", "root")

hosts = [
    (
        PIKVM_LOCAL_IP,
        {
            "ssh_user": PIKVM_SSH_USER,
            # accept-new: auto-trust a fresh box's key, still refuse a changed one.
            "ssh_strict_host_key_checking": "accept-new",
        },
    ),
]
