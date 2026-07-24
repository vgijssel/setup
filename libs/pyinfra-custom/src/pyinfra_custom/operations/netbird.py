"""NetBird operations."""

from __future__ import annotations

from pyinfra.api import StringCommand, operation


@operation(is_idempotent=False)
def up(setup_key: str | None = None, disable_dns: bool = False):
    """Run ``netbird up`` to register / (re)connect the peer.

    Args:
        setup_key: NetBird setup key for first registration. When provided it is passed
            to the host via a per-command ``_env`` (referenced as ``$NB_SETUP_KEY``), so
            it never appears in the process argument list or in ``--dry`` output. Omit on
            an already-registered peer.
        disable_dns: passed through as ``--disable-dns=<true|false>``. NetBird persists
            this flag, so it must be set explicitly to flip it; ``False`` keeps DNS on.

    Not idempotent: ``netbird up`` on an already-connected peer is itself a no-op, but
    pyinfra cannot know that, so callers gate this with ``_if`` / a connected fact.
    """
    flag = "true" if disable_dns else "false"
    if setup_key is not None:
        yield StringCommand(
            f'netbird up --setup-key "$NB_SETUP_KEY" --disable-dns={flag}',
            _env={"NB_SETUP_KEY": setup_key},
        )
    else:
        yield StringCommand(f"netbird up --disable-dns={flag}")
