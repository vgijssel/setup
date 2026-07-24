"""Tests for the OpenBaoSecret fact.

The security-critical property under test: the value fetched from OpenBao is returned by
``process`` but the command that runs on the *target host* is a constant echo -- it never
carries the secret. hvac is fully mocked; no OpenBao is contacted.
"""

from __future__ import annotations

import pytest
from pyinfra_custom.facts import openbao
from pyinfra_custom.facts.openbao import _REMOTE_MARKER, OpenBaoSecret, SecretsError

SECRET_DATA = {
    "netbird_setup_key": "nb-key-123",
    "admin_password": "adm-pw-456",
    "root_password": "root-pw-789",
}


class _FakeKvV2:
    def __init__(self, data, *, deleted=False):
        self._data = data
        self._deleted = deleted

    def read_secret_version(self, path, mount_point, raise_on_deleted_version):
        if self._deleted:
            raise RuntimeError("secret deleted")
        return {"data": {"data": self._data}}


class _FakeClient:
    def __init__(self, *, authenticated=True, data=None, deleted=False, raises=None):
        self._authenticated = authenticated
        self._raises = raises
        self.secrets = type("S", (), {})()
        self.secrets.kv = type("KV", (), {})()
        self.secrets.kv.v2 = _FakeKvV2(data or {}, deleted=deleted)

    def is_authenticated(self):
        if self._raises:
            raise self._raises
        return self._authenticated


@pytest.fixture(autouse=True)
def _clean_env_and_cache(monkeypatch):
    monkeypatch.setenv("VAULT_ADDR", "http://127.0.0.1:8200")
    monkeypatch.setenv("VAULT_TOKEN", "test-token")
    openbao._secret_cache.clear()
    yield
    openbao._secret_cache.clear()


def _patch_client(monkeypatch, client):
    monkeypatch.setattr(openbao.hvac, "Client", lambda url, token: client)


def test_returns_field_value(monkeypatch):
    _patch_client(monkeypatch, _FakeClient(data=SECRET_DATA))
    fact = OpenBaoSecret()
    fact.command(mount="kv", path="pikvm", field="admin_password")
    assert fact.process([_REMOTE_MARKER]) == "adm-pw-456"


def test_remote_command_carries_no_secret(monkeypatch):
    """The command run on the host must be a constant echo, never the secret."""
    _patch_client(monkeypatch, _FakeClient(data=SECRET_DATA))
    fact = OpenBaoSecret()
    remote_command = fact.command(mount="kv", path="pikvm", field="netbird_setup_key")
    assert remote_command == f"echo {_REMOTE_MARKER}"
    for secret in SECRET_DATA.values():
        assert secret not in remote_command


def test_secret_read_is_cached(monkeypatch):
    """Reading multiple fields hits OpenBao once (one Client build)."""
    builds = {"n": 0}

    def _factory(url, token):
        builds["n"] += 1
        return _FakeClient(data=SECRET_DATA)

    monkeypatch.setattr(openbao.hvac, "Client", _factory)
    for field in ("admin_password", "root_password", "netbird_setup_key"):
        OpenBaoSecret().command(mount="kv", path="pikvm", field=field)
    assert builds["n"] == 1


def test_missing_field_raises(monkeypatch):
    _patch_client(monkeypatch, _FakeClient(data={"admin_password": "x"}))
    with pytest.raises(SecretsError, match="missing required field: root_password"):
        OpenBaoSecret().command(mount="kv", path="pikvm", field="root_password")


def test_empty_field_raises(monkeypatch):
    _patch_client(monkeypatch, _FakeClient(data={"admin_password": ""}))
    with pytest.raises(SecretsError, match="missing required field: admin_password"):
        OpenBaoSecret().command(mount="kv", path="pikvm", field="admin_password")


def test_not_authenticated_raises(monkeypatch):
    _patch_client(monkeypatch, _FakeClient(authenticated=False, data=SECRET_DATA))
    with pytest.raises(SecretsError, match="rejected the token"):
        OpenBaoSecret().command(mount="kv", path="pikvm", field="admin_password")


def test_unreachable_raises_secret_free(monkeypatch):
    _patch_client(
        monkeypatch,
        _FakeClient(raises=ConnectionError("boom"), data=SECRET_DATA),
    )
    with pytest.raises(SecretsError, match="Could not reach OpenBao"):
        OpenBaoSecret().command(mount="kv", path="pikvm", field="admin_password")


def test_missing_addr_raises(monkeypatch):
    monkeypatch.delenv("VAULT_ADDR", raising=False)
    with pytest.raises(SecretsError, match="VAULT_ADDR is not set"):
        OpenBaoSecret().command(mount="kv", path="pikvm", field="admin_password")
