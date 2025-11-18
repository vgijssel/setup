"""Integration tests for metadata collection flow.

TDD Approach: These tests verify the end-to-end metadata collection flow.
Written FIRST before implementation.
"""

import pytest
import respx
from httpx import Response

# Mark all tests in this module as asyncio
pytestmark = pytest.mark.asyncio


@respx.mock
async def test_collect_metadata_success():
    """Test successful metadata collection from agent's /metadata endpoint."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    agent_api_url = "https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/"
    metadata_url = f"{agent_api_url}metadata"

    # Mock the HTTP GET response
    respx.get(metadata_url).mock(
        return_value=Response(
            status_code=200,
            json={
                "data": {
                    "pull_request_number": {
                        "value": 819,
                        "error": None,
                        "schema": {
                            "description": "PR number",
                            "include_in_list": True,
                        },
                    }
                },
                "meta": {"version": "1.0"},
            },
        )
    )

    client = MetadataClient(coder_session_token="test-token")
    metadata = await client.get_metadata(metadata_url)

    assert metadata.data["pull_request_number"].value == 819
    assert metadata.meta["version"] == "1.0"


@respx.mock
async def test_collect_metadata_empty():
    """Test metadata collection when no metadata is available."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    metadata_url = (
        "https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/metadata"
    )

    respx.get(metadata_url).mock(
        return_value=Response(
            status_code=200,
            json={"data": {}, "meta": {"version": "1.0"}},
        )
    )

    client = MetadataClient(coder_session_token="test-token")
    metadata = await client.get_metadata(metadata_url)

    assert len(metadata.data) == 0


@respx.mock
async def test_collect_metadata_http_404():
    """Test metadata collection handles 404 (agent app not running)."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    metadata_url = (
        "https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/metadata"
    )

    respx.get(metadata_url).mock(
        return_value=Response(status_code=404, text="Not Found")
    )

    client = MetadataClient(coder_session_token="test-token")

    # Should return empty metadata on 404
    metadata = await client.get_metadata(metadata_url)
    assert len(metadata.data) == 0


@respx.mock
async def test_collect_metadata_http_timeout():
    """Test metadata collection handles timeout."""
    from fleet_mcp.clients.metadata_client import MetadataClient
    from httpx import TimeoutException

    metadata_url = (
        "https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/metadata"
    )

    respx.get(metadata_url).mock(side_effect=TimeoutException("Request timeout"))

    client = MetadataClient(coder_session_token="test-token")

    # Should return empty metadata on timeout
    metadata = await client.get_metadata(metadata_url)
    assert len(metadata.data) == 0


@respx.mock
async def test_collect_metadata_partial_failures():
    """Test metadata collection with some failed fields."""
    from fleet_mcp.clients.metadata_client import MetadataClient

    metadata_url = (
        "https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/metadata"
    )

    respx.get(metadata_url).mock(
        return_value=Response(
            status_code=200,
            json={
                "data": {
                    "git_branch": {
                        "value": "main",
                        "error": None,
                        "schema": {
                            "description": "Git branch",
                            "include_in_list": True,
                        },
                    },
                    "pr_number": {
                        "value": None,
                        "error": "Command 'gh pr view' failed",
                        "schema": {"description": "PR number", "include_in_list": True},
                    },
                },
                "meta": {"version": "1.0"},
            },
        )
    )

    client = MetadataClient(coder_session_token="test-token")
    metadata = await client.get_metadata(metadata_url)

    assert metadata.data["git_branch"].value == "main"
    assert metadata.data["git_branch"].error is None
    assert metadata.data["pr_number"].value is None
    assert metadata.data["pr_number"].error == "Command 'gh pr view' failed"
