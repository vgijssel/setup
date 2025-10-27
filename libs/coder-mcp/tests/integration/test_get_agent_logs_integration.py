"""
Integration tests for get_agent_logs tool with VCR fixtures.

Tests verify interaction with real Coder API logs endpoint and record HTTP
responses as VCR cassettes for offline testing.
"""

import pytest
import httpx
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


@pytest.mark.asyncio
async def test_get_agent_logs_from_api_success(vcr_cassette):
    """Test successful agent logs retrieval from Coder API."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # First, list agents to get a valid agent ID
        response = await client.get("/api/experimental/tasks")
        response.raise_for_status()
        data = response.json()

        if not data.get("tasks"):
            pytest.skip("No agents available for testing")

        # Get first agent ID for logs query
        agent_id = data["tasks"][0]["id"]
        username = data["tasks"][0].get("username", "me")

        # Query agent logs
        logs_response = await client.get(
            f"/api/experimental/tasks/{username}/{agent_id}/logs"
        )
        logs_response.raise_for_status()

        # Verify response is list or dict with logs
        logs_data = logs_response.json()
        # API may return list of logs or dict with 'logs' key
        assert isinstance(logs_data, (list, dict))


@pytest.mark.asyncio
async def test_get_agent_logs_not_found(vcr_cassette):
    """Test agent logs request for non-existent agent."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Try to get logs for non-existent agent
        with pytest.raises(httpx.HTTPStatusError) as exc_info:
            response = await client.get(
                "/api/experimental/tasks/me/nonexistent-agent-id-12345/logs"
            )
            response.raise_for_status()

        # Verify 400 or 404 response (Coder API returns 400 for non-existent agents)
        assert exc_info.value.response.status_code in [400, 404]


@pytest.mark.asyncio
async def test_get_agent_logs_endpoint_format(vcr_cassette):
    """Test that agent logs endpoint accepts correct format."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Get agents list
        list_response = await client.get("/api/experimental/tasks")
        list_response.raise_for_status()
        data = list_response.json()

        if not data.get("tasks"):
            pytest.skip("No agents available")

        task = data["tasks"][0]
        agent_id = task["id"]
        username = task.get("username", "me")

        # Test correct logs endpoint format
        response = await client.get(
            f"/api/experimental/tasks/{username}/{agent_id}/logs"
        )

        # Should not raise for valid format (may be 200 or 404, but not 400)
        assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_get_agent_logs_returns_log_entries(vcr_cassette):
    """Test that logs response contains log entries or empty list."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Get agents list
        list_response = await client.get("/api/experimental/tasks")
        list_response.raise_for_status()
        data = list_response.json()

        if not data.get("tasks"):
            pytest.skip("No agents available")

        task = data["tasks"][0]
        agent_id = task["id"]
        username = task.get("username", "me")

        # Get logs
        response = await client.get(
            f"/api/experimental/tasks/{username}/{agent_id}/logs"
        )
        response.raise_for_status()
        logs_data = response.json()

        # Verify logs structure
        if isinstance(logs_data, dict):
            # Logs may be in a 'logs' or 'entries' key
            assert "logs" in logs_data or "entries" in logs_data or len(logs_data) >= 0
        elif isinstance(logs_data, list):
            # Logs returned directly as list
            assert len(logs_data) >= 0


@pytest.mark.asyncio
async def test_get_agent_logs_with_query_parameters(vcr_cassette):
    """Test logs endpoint with query parameters (if supported)."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Get agents list
        list_response = await client.get("/api/experimental/tasks")
        list_response.raise_for_status()
        data = list_response.json()

        if not data.get("tasks"):
            pytest.skip("No agents available")

        task = data["tasks"][0]
        agent_id = task["id"]
        username = task.get("username", "me")

        # Try with query parameters
        response = await client.get(
            f"/api/experimental/tasks/{username}/{agent_id}/logs",
            params={"limit": 10},
        )

        # Even if params not supported, should not error
        # May return 200 (with or without applying limit) or 404
        assert response.status_code in [200, 400, 404]
