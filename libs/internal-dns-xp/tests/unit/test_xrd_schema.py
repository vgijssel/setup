"""Test XRD schema validation for InternalDNS."""

from pathlib import Path

import pytest
import yaml


def test_xrd_schema_exists():
    """Test that XRD definition file exists."""
    xrd_path = Path(__file__).parent.parent.parent / "definition.yaml"
    assert xrd_path.exists(), f"XRD definition not found at {xrd_path}"


def test_xrd_schema_structure():
    """Test XRD schema has correct structure."""
    xrd_path = Path(__file__).parent.parent.parent / "definition.yaml"

    with open(xrd_path) as f:
        xrd = yaml.safe_load(f)

    # Validate API version and kind
    assert xrd["apiVersion"] == "apiextensions.crossplane.io/v1"
    assert xrd["kind"] == "CompositeResourceDefinition"

    # Validate metadata
    assert xrd["metadata"]["name"] == "xinternaldnses.dns.internal"

    # Validate spec
    spec = xrd["spec"]
    assert spec["group"] == "dns.internal"
    assert spec["names"]["kind"] == "XInternalDNS"
    assert spec["names"]["plural"] == "xinternaldnses"


def test_xrd_schema_required_fields():
    """Test XRD schema defines required fields."""
    xrd_path = Path(__file__).parent.parent.parent / "definition.yaml"

    with open(xrd_path) as f:
        xrd = yaml.safe_load(f)

    # Get schema from first version
    version = xrd["spec"]["versions"][0]
    schema = version["schema"]["openAPIV3Schema"]

    # Check required domain field
    assert "domain" in schema["properties"]["spec"]["required"]

    # Validate domain field
    domain_field = schema["properties"]["spec"]["properties"]["domain"]
    assert domain_field["type"] == "string"
    assert "pattern" in domain_field  # Domain validation pattern


def test_xrd_schema_optional_fields():
    """Test XRD schema defines optional fields with defaults."""
    xrd_path = Path(__file__).parent.parent.parent / "definition.yaml"

    with open(xrd_path) as f:
        xrd = yaml.safe_load(f)

    version = xrd["spec"]["versions"][0]
    props = version["schema"]["openAPIV3Schema"]["properties"]["spec"]["properties"]

    # Check optional fields with defaults
    assert props["storageSize"]["default"] == "1Gi"
    assert props["externalDnsVersion"]["default"] == "v0.14.0"
    assert props["syncInterval"]["default"] == "30s"


def test_xrd_schema_status_fields():
    """Test XRD schema defines status fields."""
    xrd_path = Path(__file__).parent.parent.parent / "definition.yaml"

    with open(xrd_path) as f:
        xrd = yaml.safe_load(f)

    version = xrd["spec"]["versions"][0]
    status_props = version["schema"]["openAPIV3Schema"]["properties"]["status"][
        "properties"
    ]

    # Check status fields
    assert "ready" in status_props
    assert status_props["ready"]["type"] == "boolean"
    assert "conditions" in status_props
    assert status_props["conditions"]["type"] == "array"


def test_xrd_schema_claim_names():
    """Test XRD defines claim names for user-facing API."""
    xrd_path = Path(__file__).parent.parent.parent / "definition.yaml"

    with open(xrd_path) as f:
        xrd = yaml.safe_load(f)

    claim_names = xrd["spec"]["claimNames"]
    assert claim_names["kind"] == "InternalDNS"
    assert claim_names["plural"] == "internaldnses"
