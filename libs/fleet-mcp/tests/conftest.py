import os
from pathlib import Path

import pytest
import respx
from dotenv import load_dotenv

# Load .env file from project root
env_file = Path(__file__).parent.parent / ".env"
load_dotenv(env_file)


@pytest.fixture
def coder_base_url():
    """Coder API base URL from environment"""
    return os.getenv("CODER_URL", "https://coder.example.com")


@pytest.fixture
def coder_token():
    """Coder API token from environment"""
    return os.getenv("CODER_SESSION_TOKEN", "test-token-placeholder")


# RESPX fixtures for HTTP mocking


@pytest.fixture
def mock_coder_client(coder_base_url, coder_token):
    """Create a CoderClient with mocked HTTP responses using RESPX

    This fixture provides a router for mocking Coder API responses.
    Use it to define expected HTTP interactions in tests.

    Example:
        def test_example(mock_coder_client):
            mock_coder_client.get("/api/v2/workspaces").mock(
                return_value=httpx.Response(200, json=[])
            )
    """
    from fleet_mcp.coder.client import CoderClient

    with respx.mock(base_url=coder_base_url, assert_all_called=False) as respx_mock:
        client = CoderClient(base_url=coder_base_url, token=coder_token)
        yield respx_mock, client


@pytest.fixture
def respx_mock(coder_base_url):
    """Standalone RESPX mock router for tests

    Use this when you want to manage the CoderClient creation yourself
    or need more control over the mocking setup.

    The mock is activated to intercept all HTTP requests. Use respx.route()
    to register mock routes.

    Example:
        def test_example(respx_mock, coder_base_url, coder_token):
            from fleet_mcp.coder.client import CoderClient

            respx.route(url=f"{coder_base_url}/api/v2/workspaces").mock(
                return_value=httpx.Response(200, json={"workspaces": [], "count": 0})
            )

            client = CoderClient(base_url=coder_base_url, token=coder_token)
            result = await client.list_workspaces()
    """
    # Activate respx mock globally for the test
    # Use assert_all_mocked=False to allow unmocked requests to fail gracefully
    with respx.mock(assert_all_mocked=False, assert_all_called=False):
        yield respx
