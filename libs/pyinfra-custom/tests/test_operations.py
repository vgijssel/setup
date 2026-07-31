"""Tests for the custom operations.

Operations are exercised via their ``._inner`` generator (the raw function pyinfra
wraps), so no live deploy/host is needed. The security property under test: secret
values ride in a per-command ``_env`` and never appear in the command string.
"""

from __future__ import annotations

from pyinfra.api import StringCommand
from pyinfra_custom.operations import netbird, pikvm, rootfs


# ── netbird.up ───────────────────────────────────────────────────────────────────
def test_netbird_up_with_setup_key_uses_env_not_argv():
    commands = list(netbird.up._inner(setup_key="super-secret-key", disable_dns=False))
    assert len(commands) == 1
    cmd = commands[0]
    assert isinstance(cmd, StringCommand)
    # Secret rides in _env, referenced as $NB_SETUP_KEY.
    assert cmd.connector_arguments.get("_env") == {"NB_SETUP_KEY": "super-secret-key"}
    raw = cmd.get_raw_value()
    assert "super-secret-key" not in raw
    assert "$NB_SETUP_KEY" in raw
    assert "--disable-dns=false" in raw
    # SSH flags default off and are always emitted explicitly.
    assert "--allow-server-ssh=false" in raw
    assert "--enable-ssh-root=false" in raw
    assert "--enable-ssh-sftp=false" in raw


def test_netbird_up_without_setup_key_has_no_env():
    commands = list(netbird.up._inner(setup_key=None, disable_dns=False))
    assert len(commands) == 1
    cmd = commands[0]
    assert cmd.connector_arguments.get("_env") is None
    assert cmd.get_raw_value() == (
        "netbird up --disable-dns=false "
        "--allow-server-ssh=false --enable-ssh-root=false "
        "--enable-ssh-sftp=false"
    )


def test_netbird_up_disable_dns_true():
    commands = list(netbird.up._inner(setup_key=None, disable_dns=True))
    assert commands[0].get_raw_value() == (
        "netbird up --disable-dns=true "
        "--allow-server-ssh=false --enable-ssh-root=false "
        "--enable-ssh-sftp=false"
    )


def test_netbird_up_allow_server_ssh_and_root():
    commands = list(
        netbird.up._inner(
            setup_key=None,
            disable_dns=False,
            allow_server_ssh=True,
            enable_ssh_root=True,
            enable_ssh_sftp=True,
        )
    )
    assert commands[0].get_raw_value() == (
        "netbird up --disable-dns=false "
        "--allow-server-ssh=true --enable-ssh-root=true "
        "--enable-ssh-sftp=true"
    )


# ── pikvm.htpasswd ───────────────────────────────────────────────────────────────
def test_htpasswd_uses_env_and_stdin_not_argv():
    commands = list(pikvm.htpasswd._inner(user="admin", password="hunter2"))
    assert len(commands) == 1
    cmd = commands[0]
    assert cmd.connector_arguments.get("_env") == {"KVMD_HTPASSWD": "hunter2"}
    raw = cmd.get_raw_value()
    assert "hunter2" not in raw
    assert "$KVMD_HTPASSWD" in raw
    assert "kvmd-htpasswd set admin --read-stdin --quiet" in raw


# ── rootfs.remount / writable ────────────────────────────────────────────────────
def test_remount_yields_rw_and_ro():
    assert list(rootfs.remount._inner(read_write=True)) == ["rw"]
    assert list(rootfs.remount._inner(read_write=False)) == ["ro"]


def test_writable_remounts_when_changed(mocker):
    calls = mocker.patch.object(rootfs, "remount")
    with rootfs.writable(changed_if=True):
        pass
    assert [c.kwargs["read_write"] for c in calls.call_args_list] == [True, False]


def test_writable_noop_when_unchanged(mocker):
    calls = mocker.patch.object(rootfs, "remount")
    with rootfs.writable(changed_if=False):
        pass
    calls.assert_not_called()


# /usr is on the root partition, so the single rootfs.writable (PiKVM `rw`/`ro`) covers
# /usr/local/bin writes too -- there is no separate /usr remount helper to test.
