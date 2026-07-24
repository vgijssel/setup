"""Network inventory: target the PiKVM over NetBird.

Used by ``moon run pikvm:apply`` for ongoing management once the box is on NetBird.
For the very first apply (box not yet on NetBird), use ``local.py`` instead.

Default host is the PiKVM's NetBird IP. Override with ``PIKVM_HOST`` (e.g. the
``pikvm.netbird.cloud`` name if NetBird DNS is enabled on the client, or a new IP).
Reaching it requires a NetBird access policy that permits your client to the PiKVM
(both peers in a shared group) -- NetBird ACLs are managed in the dashboard, not here.
"""

import os

PIKVM_HOST = os.environ.get("PIKVM_HOST", "100.65.192.152")
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
