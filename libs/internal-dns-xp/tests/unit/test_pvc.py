"""Test PVC resource generation."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from dns_resources import create_dns_pvc  # noqa: E402


def test_pvc_basic_structure():
    """Test PVC has correct structure."""
    pvc = create_dns_pvc({"storage_size": "1Gi"})

    assert pvc["apiVersion"] == "v1"
    assert pvc["kind"] == "PersistentVolumeClaim"


def test_pvc_storage_size():
    """Test PVC uses specified storage size."""
    pvc = create_dns_pvc({"storage_size": "2Gi"})

    assert pvc["spec"]["resources"]["requests"]["storage"] == "2Gi"


def test_pvc_access_mode():
    """Test PVC has ReadWriteOnce access mode."""
    pvc = create_dns_pvc({})

    assert "ReadWriteOnce" in pvc["spec"]["accessModes"]


def test_pvc_default_storage():
    """Test PVC defaults to 1Gi if not specified."""
    pvc = create_dns_pvc({})

    assert pvc["spec"]["resources"]["requests"]["storage"] == "1Gi"
