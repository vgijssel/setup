"""Pytest configuration and fixtures."""

import pytest


@pytest.fixture(scope="module")
def vcr_config():
    """Configure VCR for recording/replaying HTTP requests."""
    return {
        "filter_headers": [
            ("authorization", "Bearer REDACTED"),
            ("x-auth-email", "REDACTED"),
            ("x-auth-key", "REDACTED"),
        ],
        "filter_query_parameters": [
            ("api_token", "REDACTED"),
        ],
        "record_mode": "once",  # Record once, then replay
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
        "cassette_library_dir": "tests/cassettes",
    }


@pytest.fixture(autouse=True)
def load_env():
    """Load environment variables from .env file."""
    from dotenv import load_dotenv

    load_dotenv()
