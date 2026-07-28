"""Tests for the NetBird and pacman host facts."""

from __future__ import annotations

from pyinfra_custom.facts import (
    GossVersion,
    NetbirdConnected,
    NetbirdDnsDisabled,
    NetbirdServerSshAllowed,
    NetbirdSshRootEnabled,
    NetbirdVersion,
    NetdataVersion,
    PacmanUpgradablePackages,
)


def test_goss_version_requires_command_and_parses():
    fact = GossVersion()
    assert fact.requires_command() == "goss"
    assert fact.command() == "goss --version"
    # goss prints e.g. "goss version v0.4.10 (linux/arm64)"; the pinned "0.4.10" install
    # gate looks for its version substring, which this output contains.
    assert (
        fact.process(["goss version v0.4.10 (linux/arm64)", ""])
        == "goss version v0.4.10 (linux/arm64)"
    )
    assert "0.4.10" in fact.process(["goss version v0.4.10 (linux/arm64)"])
    assert GossVersion.default() == ""


def test_netdata_version_requires_command_and_parses():
    fact = NetdataVersion()
    # The static build is not on PATH, so the fact invokes netdata by absolute path --
    # otherwise an installed box returns the empty default and the install re-runs forever.
    assert fact.requires_command() == "/opt/netdata/bin/netdata"
    assert fact.command() == "/opt/netdata/bin/netdata -v"
    # netdata prints e.g. "netdata v2.10.4"; the pinned "2.10.4" install gate looks for
    # its version substring, which this output contains.
    assert fact.process(["netdata v2.10.4", ""]) == "netdata v2.10.4"
    assert "2.10.4" in fact.process(["netdata v2.10.4"])
    assert NetdataVersion.default() == ""


def test_netbird_version_requires_command_and_parses():
    fact = NetbirdVersion()
    assert fact.requires_command() == "netbird"
    assert fact.command() == "netbird version"
    assert fact.process(["netbird version 0.75.0", ""]) == "netbird version 0.75.0"
    assert NetbirdVersion.default() == ""


def test_netbird_connected_true_when_management_connected():
    fact = NetbirdConnected()
    assert fact.requires_command() == "netbird"
    assert fact.process(["Daemon version: 0.75.0", "Management: Connected"]) is True


def test_netbird_connected_false_when_disconnected():
    fact = NetbirdConnected()
    assert fact.process(["Management: Disconnected"]) is False
    assert fact.process([]) is False
    assert NetbirdConnected.default() is False


def test_netbird_dns_disabled_reads_flag():
    fact = NetbirdDnsDisabled()
    assert fact.requires_command() == "netbird"
    assert fact.process(['"DisableDNS":true']) is True
    assert fact.process(['"DisableDNS":false']) is False
    assert fact.process([]) is False


def test_netbird_server_ssh_allowed_reads_flag():
    fact = NetbirdServerSshAllowed()
    assert fact.requires_command() == "netbird"
    assert "ServerSSHAllowed" in fact.command()
    assert fact.process(['"ServerSSHAllowed":true']) is True
    assert fact.process(['"ServerSSHAllowed":false']) is False
    assert fact.process([]) is False
    assert NetbirdServerSshAllowed.default() is False


def test_netbird_ssh_root_enabled_reads_flag():
    fact = NetbirdSshRootEnabled()
    assert fact.requires_command() == "netbird"
    assert "EnableSSHRoot" in fact.command()
    assert fact.process(['"EnableSSHRoot":true']) is True
    assert fact.process(['"EnableSSHRoot":false']) is False
    assert fact.process([]) is False
    assert NetbirdSshRootEnabled.default() is False


def test_pacman_upgradable_lists_nonblank_lines():
    fact = PacmanUpgradablePackages()
    assert fact.requires_command() == "pacman"
    assert fact.command() == "pacman -Qu 2>/dev/null || true"
    assert fact.process(["kvmd 1.0 -> 1.1", "", "linux 6.6 -> 6.7"]) == [
        "kvmd 1.0 -> 1.1",
        "linux 6.6 -> 6.7",
    ]
    assert fact.process([]) == []
    assert PacmanUpgradablePackages.default() == []
