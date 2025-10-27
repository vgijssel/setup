"""Pytest configuration and shared fixtures for coder-mcp tests."""

import pytest
import vcr


@pytest.fixture(scope="session")
def vcr_config():
    """VCR configuration for recording/replaying HTTP interactions."""
    return {
        "cassette_library_dir": "tests/fixtures/cassettes",
        "record_mode": "once",
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
        "filter_headers": [
            ("Coder-Session-Token", "REDACTED"),
            ("authorization", "REDACTED"),
        ],
        "filter_post_data_parameters": [
            ("token", "REDACTED"),
            ("password", "REDACTED"),
        ],
    }


@pytest.fixture(scope="session")
def vcr_cassette_dir():
    """Directory for VCR cassettes."""
    return "tests/fixtures/cassettes"
