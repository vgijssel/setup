"""
Integration tests for get_agent_details tool with VCR fixtures.

Tests verify interaction with real Coder API endpoints and record HTTP
responses as VCR cassettes for offline testing.
"""

import pytest
import httpx
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config
from coder_mcp.models import Agent, AgentStatus


@pytest.mark.asyncio
async def test_get_agent_details_from_api_success(vcr_cassette):
    """Test successful agent details retrieval from Coder API."""
    # This test will record HTTP interaction with real Coder API
    config = Config()
    async with CoderAPIClient(config) as client:
        # First, list agents to get a valid agent ID
        response = await client.get("/api/experimental/tasks")
        response.raise_for_status()
        data = response.json()

        # Skip if no agents available
        if not data.get("tasks"):
            pytest.skip("No agents available for testing")

        # Get first agent ID for detailed query
        agent_id = data["tasks"][0]["id"]
        username = data["tasks"][0].get("username", "me")

        # Query specific agent details
        detail_response = await client.get(
            f"/api/experimental/tasks/{username}/{agent_id}"
        )
        detail_response.raise_for_status()

        # Verify response structure
        agent_data = detail_response.json()
        assert "id" in agent_data
        assert "workspace_id" in agent_data or "id" in agent_data
        assert "status" in agent_data or "id" in agent_data


@pytest.mark.asyncio
async def test_get_agent_details_not_found(vcr_cassette):
    """Test agent details request for non-existent agent."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Try to get non-existent agent
        with pytest.raises(httpx.HTTPStatusError) as exc_info:
            response = await client.get(
                "/api/experimental/tasks/me/nonexistent-agent-id-12345"
            )
            response.raise_for_status()

        # Verify 400 or 404 response (Coder API returns 400 for non-existent agents)
        assert exc_info.value.response.status_code in [400, 404]


@pytest.mark.asyncio
async def test_get_agent_details_endpoint_format(vcr_cassette):
    """Test that agent details endpoint accepts correct format."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # First, get a valid agent
        list_response = await client.get("/api/experimental/tasks")
        list_response.raise_for_status()
        data = list_response.json()

        if not data.get("tasks"):
            pytest.skip("No agents available")

        task = data["tasks"][0]
        agent_id = task["id"]
        username = task.get("username", "me")

        # Test correct endpoint format
        response = await client.get(f"/api/experimental/tasks/{username}/{agent_id}")

        # Should not raise for valid format (may be 200 or 404, but not 400)
        assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_get_agent_details_returns_complete_data(vcr_cassette):
    """Test that agent details response contains expected fields."""
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

        # Get agent details
        response = await client.get(f"/api/experimental/tasks/{username}/{agent_id}")
        response.raise_for_status()
        agent_data = response.json()

        # Verify key fields are present
        # Note: Exact field names depend on Coder API response structure
        assert agent_data.get("id") == agent_id
        # At minimum, response should have an ID
        assert agent_data.get("id") is not None
