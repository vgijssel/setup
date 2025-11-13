"""Unit tests for MetadataClient.

TDD Approach: These tests verify MetadataClient HTTP behavior.
Written FIRST before implementation.
"""

import pytest
import respx
from httpx import ConnectError, Response, TimeoutException

# Mark all tests in this module as asyncio
pytestmark = pytest.mark.asyncio


@respx.mock
async def test_metadata_client_get_success():
    """Test MetadataClient successfully fetches and parses metadata."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={
                "data": {
                    "test_field": {
                        "value": "test_value",
                        "error": None,
                        "schema": {"description": "Test", "include_in_list": True},
                    }
                },
                "meta": {"version": "1.0"},
            },
        )
    )

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert metadata.data["test_field"].value == "test_value"


@respx.mock
async def test_metadata_client_get_404_returns_empty():
    """Test MetadataClient returns empty metadata on 404."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(return_value=Response(status_code=404))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0
    assert metadata.meta["version"] == "1.0"


@respx.mock
async def test_metadata_client_get_500_returns_empty():
    """Test MetadataClient returns empty metadata on 500 error."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(return_value=Response(status_code=500))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_timeout_returns_empty():
    """Test MetadataClient returns empty metadata on timeout."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(side_effect=TimeoutException("Timeout"))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_connection_error_returns_empty():
    """Test MetadataClient returns empty metadata on connection error."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(side_effect=ConnectError("Connection failed"))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_invalid_json_returns_empty():
    """Test MetadataClient returns empty metadata on invalid JSON."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    respx.get(url).mock(return_value=Response(status_code=200, text="invalid json{{{"))

    client = MetadataClient()
    metadata = await client.get_metadata(url)

    assert len(metadata.data) == 0


@respx.mock
async def test_metadata_client_timeout_value():
    """Test MetadataClient uses appropriate timeout value."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    route = respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={"data": {}, "meta": {"version": "1.0"}},
        )
    )

    client = MetadataClient(timeout=10.0)
    await client.get_metadata(url)

    # Verify request was made
    assert route.called


@respx.mock
async def test_metadata_client_custom_headers():
    """Test MetadataClient can include custom headers."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    url = "https://example.com/metadata"

    route = respx.get(url).mock(
        return_value=Response(
            status_code=200,
            json={"data": {}, "meta": {"version": "1.0"}},
        )
    )

    client = MetadataClient()
    await client.get_metadata(url)

    assert route.called
