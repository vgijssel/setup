"""Test Secret resource generation."""

import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from dns_resources import create_api_secret  # noqa: E402


def test_secret_basic_structure():
    """Test Secret has correct structure."""
    secret = create_api_secret({})

    assert secret["apiVersion"] == "v1"
    assert secret["kind"] == "Secret"
    assert secret["type"] == "Opaque"


def test_secret_has_api_key():
    """Test Secret contains API key."""
    secret = create_api_secret({})

    assert "api-key" in secret["stringData"]
    assert len(secret["stringData"]["api-key"]) > 0


def test_secret_api_key_is_unique():
    """Test each Secret generates unique API key."""
    secret1 = create_api_secret({})
    secret2 = create_api_secret({})

    assert secret1["stringData"]["api-key"] != secret2["stringData"]["api-key"]
