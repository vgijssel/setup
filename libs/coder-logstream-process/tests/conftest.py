"""Pytest configuration and shared fixtures."""

import os
from datetime import datetime, timezone

import pytest
import vcr

# Default test configuration
TEST_AGENT_URL = "https://coder.enigma.vgijssel.nl"
TEST_AGENT_TOKEN = "test-token-12345"


@pytest.fixture
def agent_url() -> str:
    """Coder agent API URL for testing."""
    return os.environ.get("CODER_AGENT_URL", TEST_AGENT_URL)


@pytest.fixture
def agent_token() -> str:
    """Coder agent token for testing."""
    return os.environ.get("CODER_AGENT_TOKEN", TEST_AGENT_TOKEN)


@pytest.fixture
def vcr_config():
    """VCR configuration for recording HTTP interactions."""
    return {
        "cassette_library_dir": os.path.join(os.path.dirname(__file__), "cassettes"),
        "record_mode": "once",
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
        "filter_headers": ["Coder-Session-Token", "authorization"],
        "decode_compressed_response": True,
    }


@pytest.fixture
def vcr_cassette(vcr_config, request):
    """Create a VCR cassette for the current test."""
    cassette_name = f"{request.node.name}.yaml"
    cassette_path = os.path.join(vcr_config["cassette_library_dir"], cassette_name)

    my_vcr = vcr.VCR(
        cassette_library_dir=vcr_config["cassette_library_dir"],
        record_mode=vcr_config["record_mode"],
        match_on=vcr_config["match_on"],
        filter_headers=vcr_config["filter_headers"],
        decode_compressed_response=vcr_config["decode_compressed_response"],
    )

    with my_vcr.use_cassette(cassette_path) as cassette:
        yield cassette


@pytest.fixture
def sample_timestamp() -> datetime:
    """Sample timestamp for testing."""
    return datetime(2024, 1, 15, 10, 30, 0, tzinfo=timezone.utc)


@pytest.fixture
def external_source_id() -> str:
    """External log source UUID."""
    return "3b579bf4-1ed8-4b99-87a8-e9a1e3410410"
