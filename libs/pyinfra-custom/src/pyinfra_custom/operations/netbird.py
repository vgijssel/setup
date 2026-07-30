"""NetBird operations."""

from __future__ import annotations

from pyinfra.api import StringCommand, operation


@operation(is_idempotent=False)
def up(
    setup_key: str | None = None,
    disable_dns: bool = False,
    allow_server_ssh: bool = False,
    enable_ssh_root: bool = False,
    enable_ssh_sftp: bool = False,
):
    """Run ``netbird up`` to register / (re)connect the peer.

    Args:
        setup_key: NetBird setup key for first registration. When provided it is passed
            to the host via a per-command ``_env`` (referenced as ``$NB_SETUP_KEY``), so
            it never appears in the process argument list or in ``--dry`` output. Omit on
            an already-registered peer.
        disable_dns: passed through as ``--disable-dns=<true|false>``. NetBird persists
            this flag, so it must be set explicitly to flip it; ``False`` keeps DNS on.
        allow_server_ssh: passed through as ``--allow-server-ssh=<true|false>`` to enable
            NetBird's native SSH server on the peer. NetBird persists this in its config
            (``ServerSSHAllowed``), so it is always set explicitly to make the desired
            state deterministic.
        enable_ssh_root: passed through as ``--enable-ssh-root=<true|false>`` to permit
            root login on the native SSH server. Only meaningful when ``allow_server_ssh``
            is ``True``; likewise persisted (``EnableSSHRoot``), so set explicitly.
        enable_ssh_sftp: passed through as ``--enable-ssh-sftp=<true|false>`` to serve the
            SFTP subsystem on the native SSH server. Required for ``pyinfra``'s
            ``files.put`` (which uploads over SFTP) to work when management runs OVER the
            NetBird SSH server. Persisted as ``EnableSSHSFTP``, so set explicitly.

    Not idempotent: ``netbird up`` on an already-connected peer is itself a no-op, but
    pyinfra cannot know that, so callers gate this with ``_if`` / a connected fact.
    """
    dns_flag = "true" if disable_dns else "false"
    ssh_flag = "true" if allow_server_ssh else "false"
    ssh_root_flag = "true" if enable_ssh_root else "false"
    ssh_sftp_flag = "true" if enable_ssh_sftp else "false"
    args = (
        f"--disable-dns={dns_flag} "
        f"--allow-server-ssh={ssh_flag} "
        f"--enable-ssh-root={ssh_root_flag} "
        f"--enable-ssh-sftp={ssh_sftp_flag}"
    )
    if setup_key is not None:
        yield StringCommand(
            f'netbird up --setup-key "$NB_SETUP_KEY" {args}',
            _env={"NB_SETUP_KEY": setup_key},
        )
    else:
        yield StringCommand(f"netbird up {args}")
