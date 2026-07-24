"""Tests for the NetBird and pacman host facts."""

from __future__ import annotations

from pyinfra_custom.facts import (
    NetbirdConnected,
    NetbirdDnsDisabled,
    NetbirdVersion,
    PacmanUpgradablePackages,
)


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
