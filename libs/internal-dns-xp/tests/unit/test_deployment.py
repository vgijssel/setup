"""Test Deployment resource generation."""

import sys
from pathlib import Path

import pytest

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from dns_resources import create_dns_deployment  # noqa: E402


def test_deployment_basic_structure():
    """Test deployment has correct basic structure."""
    props = {
        "domain": "internal.test.com",
        "external_dns_version": "v0.14.0",
        "powerdns_version": "powerdns/pdns-auth-50",
        "sync_interval": "30s",
    }

    deployment = create_dns_deployment(props)

    assert deployment["apiVersion"] == "apps/v1"
    assert deployment["kind"] == "Deployment"
    assert deployment["metadata"]["name"] == "internal-dns-deployment"


def test_deployment_replicas():
    """Test deployment has single replica as per requirements."""
    deployment = create_dns_deployment({"domain": "test.local"})

    assert deployment["spec"]["replicas"] == 1


def test_deployment_has_external_dns_container():
    """Test deployment includes external-dns container."""
    props = {
        "domain": "internal.test.com",
        "external_dns_version": "v0.14.0",
        "sync_interval": "30s",
    }

    deployment = create_dns_deployment(props)
    containers = deployment["spec"]["template"]["spec"]["containers"]

    external_dns = next(c for c in containers if c["name"] == "external-dns")
    assert "v0.14.0" in external_dns["image"]
    assert any("--interval=30s" in arg for arg in external_dns["args"])


def test_deployment_has_powerdns_container():
    """Test deployment includes PowerDNS container."""
    props = {
        "domain": "test.local",
        "powerdns_version": "powerdns/pdns-auth-50",
    }

    deployment = create_dns_deployment(props)
    containers = deployment["spec"]["template"]["spec"]["containers"]

    powerdns = next(c for c in containers if c["name"] == "powerdns")
    assert powerdns["image"] == "powerdns/pdns-auth-50"


def test_deployment_volume_mounts():
    """Test deployment has correct volume mounts."""
    deployment = create_dns_deployment({"domain": "test.local"})

    powerdns_container = next(
        c
        for c in deployment["spec"]["template"]["spec"]["containers"]
        if c["name"] == "powerdns"
    )

    volume_mounts = powerdns_container["volumeMounts"]
    mount_paths = [vm["mountPath"] for vm in volume_mounts]

    assert "/var/lib/powerdns" in mount_paths  # Data volume
    assert "/etc/powerdns" in mount_paths  # Config volume


def test_deployment_labels():
    """Test deployment has correct labels."""
    deployment = create_dns_deployment({"domain": "test.local"})

    labels = deployment["metadata"]["labels"]
    assert labels["app"] == "internal-dns"

    template_labels = deployment["spec"]["template"]["metadata"]["labels"]
    assert template_labels["app"] == "internal-dns"
