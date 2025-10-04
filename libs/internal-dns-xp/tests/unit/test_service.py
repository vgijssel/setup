"""Test Service resource generation."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from dns_resources import create_dns_service  # noqa: E402


def test_service_basic_structure():
    """Test service has correct structure."""
    service = create_dns_service({})

    assert service["apiVersion"] == "v1"
    assert service["kind"] == "Service"
    assert service["spec"]["type"] == "ClusterIP"


def test_service_dns_ports():
    """Test service exposes DNS ports."""
    service = create_dns_service({})
    ports = service["spec"]["ports"]

    dns_udp = next(p for p in ports if p["protocol"] == "UDP" and p["port"] == 53)
    dns_tcp = next(p for p in ports if p["protocol"] == "TCP" and p["port"] == 53)

    assert dns_udp is not None
    assert dns_tcp is not None


def test_service_selector():
    """Test service has correct selector."""
    service = create_dns_service({})

    assert service["spec"]["selector"]["app"] == "internal-dns"
