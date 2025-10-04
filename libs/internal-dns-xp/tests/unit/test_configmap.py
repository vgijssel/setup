"""Test ConfigMap resource generation."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from dns_resources import create_powerdns_config  # noqa: E402


def test_configmap_basic_structure():
    """Test ConfigMap has correct structure."""
    cm = create_powerdns_config({})

    assert cm["apiVersion"] == "v1"
    assert cm["kind"] == "ConfigMap"


def test_configmap_pdns_conf():
    """Test ConfigMap contains PowerDNS configuration."""
    cm = create_powerdns_config({})

    assert "pdns.conf" in cm["data"]
    conf = cm["data"]["pdns.conf"]

    assert "launch=gsqlite3" in conf
    assert "webserver=yes" in conf
    assert "api=yes" in conf


def test_configmap_sqlite_path():
    """Test ConfigMap specifies SQLite database path."""
    cm = create_powerdns_config({})
    conf = cm["data"]["pdns.conf"]

    assert "/var/lib/powerdns/pdns.sqlite3" in conf
