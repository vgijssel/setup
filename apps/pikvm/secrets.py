r"""Read PiKVM secrets from OpenBao (``apps/secret``) via the Vault/hvac SDK.

This is the single seam for secrets in ``apps/pikvm``. ``deploy.py`` calls
:func:`get_secrets` directly -- there is no bash wrapper. Values come from the KV v2
engine ``kv`` at path ``pikvm``:

    kv/pikvm  netbird_setup_key, admin_password, root_password

Seed once (single operator)::

    moon run secret:forward          # port-forward OpenBao to 127.0.0.1:8200
    bao kv put kv/pikvm \\
        netbird_setup_key=... admin_password=... root_password=...

Auth is token-only: ``VAULT_TOKEN`` from the environment, or ``~/.vault-token``
(what ``bao login`` writes). Errors are deliberately secret-free and this module
never prints or logs secret values.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

import hvac

KV_MOUNT = "kv"
KV_PATH = "pikvm"
REQUIRED_FIELDS = ("netbird_setup_key", "admin_password", "root_password")


class SecretsError(RuntimeError):
    """OpenBao is unreachable, unauthenticated, or missing a field.

    Messages are deliberately secret-free -- safe to surface in pyinfra output.
    """


@dataclass(frozen=True)
class PikvmSecrets:
    """The three secrets ``apps/pikvm`` needs; ``repr`` is redacted so values never leak."""

    netbird_setup_key: str
    admin_password: str
    root_password: str

    def __repr__(self) -> str:
        return (
            "PikvmSecrets(netbird_setup_key=***, admin_password=***, root_password=***)"
        )


def _resolve_addr() -> str:
    addr = os.environ.get("VAULT_ADDR", "").strip()
    if not addr:
        raise SecretsError(
            "VAULT_ADDR is not set. Point it at OpenBao, e.g. "
            "https://openbao.secret.vgijssel.nl or http://127.0.0.1:8200 "
            "(via `moon run secret:forward`).",
        )
    return addr


def _resolve_token() -> str:
    token = os.environ.get("VAULT_TOKEN", "").strip()
    if token:
        return token
    try:
        token = (Path.home() / ".vault-token").read_text(encoding="utf-8").strip()
    except OSError:
        token = ""
    if not token:
        raise SecretsError(
            "No OpenBao token found: set VAULT_TOKEN or run `bao login` to write "
            "~/.vault-token.",
        )
    return token


def get_secrets() -> PikvmSecrets:
    """Fetch and validate ``kv/pikvm`` from OpenBao.

    Raises :class:`SecretsError` (secret-free) if OpenBao is unreachable, the token
    is rejected, the path is absent, or any required field is missing/empty.
    """
    addr = _resolve_addr()
    client = hvac.Client(url=addr, token=_resolve_token())

    try:
        authenticated = client.is_authenticated()
    except Exception as exc:  # connection / TLS / DNS failures
        raise SecretsError(
            f"Could not reach OpenBao at {addr}: {type(exc).__name__}.",
        ) from exc
    if not authenticated:
        raise SecretsError(f"OpenBao at {addr} rejected the token (not authenticated).")

    try:
        response = client.secrets.kv.v2.read_secret_version(
            path=KV_PATH,
            mount_point=KV_MOUNT,
            raise_on_deleted_version=True,
        )
    except Exception as exc:
        raise SecretsError(
            f"Could not read {KV_MOUNT}/{KV_PATH} from OpenBao: {type(exc).__name__}. "
            "Seed it with `bao kv put kv/pikvm netbird_setup_key=... "
            "admin_password=... root_password=...`.",
        ) from exc

    data = response.get("data", {}).get("data", {})
    missing = [field for field in REQUIRED_FIELDS if not data.get(field)]
    if missing:
        raise SecretsError(
            f"{KV_MOUNT}/{KV_PATH} is missing required field(s): {', '.join(missing)}.",
        )

    return PikvmSecrets(
        netbird_setup_key=data["netbird_setup_key"],
        admin_password=data["admin_password"],
        root_password=data["root_password"],
    )
