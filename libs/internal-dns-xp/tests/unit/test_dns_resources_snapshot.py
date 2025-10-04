"""Snapshot test for all DNS resources."""

import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from dns_resources import create_all_dns_resources  # noqa: E402


def test_dns_resources_snapshot(snapshot):
    """Test all DNS resources match snapshot."""
    props = {
        "domain": "internal.test.com",
        "storage_size": "1Gi",
        "external_dns_version": "v0.14.0",
        "powerdns_version": "powerdns/pdns-auth-50",
        "sync_interval": "30s",
    }

    resources = create_all_dns_resources(props)

    # Sort resources for consistent snapshot
    sorted_resources = sorted(
        resources, key=lambda r: (r["kind"], r["metadata"]["name"])
    )

    # Normalize random API key for snapshot comparison
    for resource in sorted_resources:
        if resource["kind"] == "Secret" and "stringData" in resource:
            if "api-key" in resource["stringData"]:
                resource["stringData"]["api-key"] = "NORMALIZED_API_KEY"

    assert snapshot == json.dumps(sorted_resources, indent=2, sort_keys=True)


def test_all_resources_created():
    """Test all required resources are created."""
    resources = create_all_dns_resources({"domain": "test.local"})

    kinds = {r["kind"] for r in resources}

    assert "Deployment" in kinds
    assert "Service" in kinds
    assert "PersistentVolumeClaim" in kinds
    assert "ConfigMap" in kinds
    assert "Secret" in kinds


def test_resources_have_labels():
    """Test all resources have app label."""
    resources = create_all_dns_resources({"domain": "test.local"})

    for resource in resources:
        assert "app" in resource["metadata"].get("labels", {})
        assert resource["metadata"]["labels"]["app"] == "internal-dns"


def test_resource_count():
    """Test correct number of resources are created."""
    resources = create_all_dns_resources({"domain": "test.local"})

    assert len(resources) == 5  # Deployment, Service, PVC, ConfigMap, Secret
