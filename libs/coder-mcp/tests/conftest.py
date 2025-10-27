"""Pytest configuration and shared fixtures for coder-mcp tests."""

import pytest
import vcr

# Configure VCR
my_vcr = vcr.VCR(
    cassette_library_dir="tests/fixtures/cassettes",
    record_mode="once",
    match_on=["method", "scheme", "host", "port", "path", "query"],
    filter_headers=[
        ("Coder-Session-Token", "REDACTED"),
        ("authorization", "REDACTED"),
    ],
    filter_post_data_parameters=[
        ("token", "REDACTED"),
        ("password", "REDACTED"),
    ],
)


@pytest.fixture(scope="function")
def vcr_cassette(request):
    """VCR cassette fixture for recording/replaying HTTP interactions."""
    # Get test name for cassette filename
    test_name = request.node.name
    cassette_name = f"{test_name}.yaml"

    # Use VCR context manager
    with my_vcr.use_cassette(cassette_name):
        yield


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
