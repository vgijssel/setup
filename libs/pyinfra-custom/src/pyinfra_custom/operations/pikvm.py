"""PiKVM-specific operations."""

from __future__ import annotations

from pyinfra.api import QuoteString, StringCommand, operation


@operation(is_idempotent=False)
def htpasswd(user: str, password: str):
    """Set a PiKVM web user's password via ``kvmd-htpasswd``.

    The password is passed to the host via a per-command ``_env`` (referenced as
    ``$KVMD_HTPASSWD``) and piped in on stdin with ``--read-stdin``, so it never appears
    in the process argument list or in ``--dry`` output.

    Not idempotent: ``kvmd-htpasswd`` re-hashes with a fresh salt each run, so callers
    gate this with ``_if`` (e.g. a provisioning fingerprint) to keep a converged box a
    no-op.
    """
    yield StringCommand(
        "printf",
        "'%s\\n'",
        '"$KVMD_HTPASSWD"',
        "|",
        "kvmd-htpasswd",
        "set",
        QuoteString(user),
        "--read-stdin",
        "--quiet",
        _env={"KVMD_HTPASSWD": password},
    )
