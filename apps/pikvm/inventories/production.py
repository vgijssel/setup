"""Network inventory: target the PiKVM over NetBird.

Used by ``moon run pikvm:apply`` for ongoing management once the box is on NetBird.
For the very first apply (box not yet on NetBird), use ``local.py`` instead.

Default host is the PiKVM's NetBird IP. Override with ``PIKVM_HOST`` (e.g. the
``pikvm.netbird.cloud`` name if NetBird DNS is enabled on the client, or a new IP).
Reaching it requires a NetBird access policy that permits your client to the PiKVM
(both peers in a shared group) -- NetBird ACLs are managed in the dashboard, not here.

NetBird SSH auth
----------------
Over the NetBird overlay the PiKVM's ``:22`` is NetBird's *own* SSH server, not OpenSSH.
A connection goes through ``netbird ssh proxy`` -- which performs the JWT/SSO handshake via
the local NetBird daemon's session -- and the SSH session then authenticates with the
``none`` method (identity is already established by NetBird). pyinfra's paramiko transport
does not speak this out of the box, so two shims (below) teach it to:

1. A generated ssh_config pointing every host at ``ProxyCommand netbird ssh proxy``.
   paramiko does not read ``/etc/ssh/ssh_config.d/*`` (where NetBird installs its own
   ProxyCommand) and it hard-errors on unrelated ``IdentityFile`` directives in the user's
   ``~/.ssh/config``, so we hand it a minimal config of our own.
2. A paramiko ``_auth`` patch that tries the ``none`` method first. paramiko never attempts
   ``none`` on its own (it raises "No authentication methods available"), which is exactly
   why apply broke when the box moved to NetBird's JWT SSH. The patch is a no-op against a
   normal OpenSSH server -- ``none`` is refused and it falls back to the standard chain --
   so it is safe even though only this NetBird inventory needs it.

Override the NetBird binary with ``NETBIRD_BIN`` if it is not on ``PATH``.
"""

import os
import shutil
import tempfile

import paramiko
from paramiko.ssh_exception import SSHException

PIKVM_HOST = os.environ.get("PIKVM_HOST", "100.65.192.152")
PIKVM_SSH_USER = os.environ.get("PIKVM_SSH_USER", "root")


def _netbird_binary() -> str:
    """Locate a NetBird binary that can run ``netbird ssh proxy``."""
    return (
        os.environ.get("NETBIRD_BIN")
        or shutil.which("netbird")
        or "/Applications/NetBird.app/Contents/MacOS/netbird"
    )


def _write_ssh_config() -> str:
    """Render a minimal ssh_config routing all hosts through the NetBird SSH proxy.

    Written to a fixed path in the system temp dir (overwritten each run, never committed).
    """
    contents = (
        "Host *\n"
        f"    ProxyCommand {_netbird_binary()} ssh proxy %h %p\n"
        "    StrictHostKeyChecking accept-new\n"
        "    UserKnownHostsFile /dev/null\n"
    )
    config_path = os.path.join(tempfile.gettempdir(), "pikvm-netbird-ssh-config")
    with open(config_path, "w", encoding="utf-8") as handle:
        handle.write(contents)
    return config_path


# Shim 2: attempt the "none" auth method first (see module docstring). paramiko's
# SSHClient._auth never tries it, so patch it to -- succeeding for NetBird SSH and falling
# through to the normal chain (key/agent/password) for any server that refuses none.
_original_auth = paramiko.client.SSHClient._auth


def _auth_none_first(self, username, *args, **kwargs):
    transport = self._transport
    if transport is not None:
        try:
            transport.auth_none(username)
        except SSHException:
            pass  # none not offered/accepted -> fall back to the normal auth chain
        if transport.is_authenticated():
            return None
    return _original_auth(self, username, *args, **kwargs)


paramiko.client.SSHClient._auth = _auth_none_first


hosts = [
    (
        PIKVM_HOST,
        {
            "ssh_user": PIKVM_SSH_USER,
            # Route paramiko through `netbird ssh proxy` (JWT/SSO handled by the daemon).
            "ssh_config_file": _write_ssh_config(),
            # accept-new: auto-trust a fresh box's key, still refuse a changed one.
            "ssh_strict_host_key_checking": "accept-new",
        },
    ),
]
