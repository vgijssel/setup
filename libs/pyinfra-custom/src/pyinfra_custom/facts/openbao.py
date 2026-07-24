r"""OpenBao KV secrets exposed as a pyinfra fact.

``OpenBaoSecret`` reads one field of a KV v2 secret from OpenBao (``apps/secret``) via
the Vault/``hvac`` SDK and returns it like any other pyinfra fact::

    from pyinfra import host
    from pyinfra_custom.facts import OpenBaoSecret

    admin_pw = host.get_fact(OpenBaoSecret, mount="kv", path="pikvm", field="admin_password")

Where the fetch happens (and why it is secret-safe)
---------------------------------------------------
pyinfra resolves a fact by evaluating the fact's ``command`` callable **on the control
machine**, running the returned command **on the target host**, then feeding that host
output to ``process`` (also on the control machine). ``OpenBaoSecret`` fetches the value
with ``hvac`` inside ``command`` (control machine) and returns a *constant* remote
command (``echo``); ``process`` ignores the host output and returns the locally-fetched
value. Consequences:

* Secret material is **never transmitted to, executed on, or logged on the target host**
  — the host only ever runs ``echo pyinfra-openbao-secret``.
* pyinfra logs the fact *name* and its kwargs (``mount``/``path``/``field``) but never
  the value, so nothing secret reaches ``--dry`` output or logs.
* The PiKVM needs no Vault token and no network path to OpenBao.

Auth is token-only: ``VAULT_TOKEN`` from the environment, or ``~/.vault-token`` (what
``bao login`` writes), against ``VAULT_ADDR``. Errors are deliberately secret-free.
"""

from __future__ import annotations

import os
from pathlib import Path

import hvac
from pyinfra.api import FactBase

# Constant echoed by the remote host so pyinfra has stdout to trigger ``process``; it is
# deliberately not the secret. See the module docstring.
_REMOTE_MARKER = "pyinfra-openbao-secret"

# Process-wide cache of full KV secrets keyed by (addr, mount, path). Reading three
# fields of ``kv/pikvm`` then hits OpenBao once, not three times.
_secret_cache: dict[tuple[str, str, str], dict[str, str]] = {}


class SecretsError(RuntimeError):
    """OpenBao is unreachable, unauthenticated, or missing a field.

    Messages are deliberately secret-free -- safe to surface in pyinfra output.
    """


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


def _read_secret(mount: str, path: str) -> dict[str, str]:
    """Read (and cache) all fields of a KV v2 secret. Raises :class:`SecretsError`."""
    addr = _resolve_addr()
    cache_key = (addr, mount, path)
    if cache_key in _secret_cache:
        return _secret_cache[cache_key]

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
            path=path,
            mount_point=mount,
            raise_on_deleted_version=True,
        )
    except Exception as exc:
        raise SecretsError(
            f"Could not read {mount}/{path} from OpenBao: {type(exc).__name__}.",
        ) from exc

    data = response.get("data", {}).get("data", {})
    _secret_cache[cache_key] = data
    return data


class OpenBaoSecret(FactBase[str]):
    """One field of an OpenBao KV v2 secret, fetched via ``hvac`` on the control machine.

    Args (fact kwargs):
        mount: KV v2 mount point (e.g. ``"kv"``).
        path: secret path within the mount (e.g. ``"pikvm"``).
        field: field name to return (e.g. ``"admin_password"``).

    Raises :class:`SecretsError` (secret-free) if OpenBao is unreachable, the token is
    rejected, the path is absent, or the field is missing/empty.
    """

    def command(self, mount: str, path: str, field: str) -> str:
        # NOTE: runs on the CONTROL machine (pyinfra evaluates the callable locally).
        # Fetch + validate here; stash on the instance for ``process``. The returned
        # command runs on the target host and must NOT carry the secret.
        data = _read_secret(mount, path)
        value = data.get(field)
        if not value:
            raise SecretsError(f"{mount}/{path} is missing required field: {field}.")
        self._value = value
        return f"echo {_REMOTE_MARKER}"

    def process(self, output: list[str]) -> str:
        # Runs on the control machine. Ignore the host's echo output; return the value
        # fetched locally in ``command``.
        return self._value
