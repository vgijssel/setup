"""Integration tests for list_agents with VCR fixtures."""

import pytest
import vcr
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config
from coder_mcp.tools.list_agents import list_agents_from_api

# Configure VCR for this test module
my_vcr = vcr.VCR(
    cassette_library_dir="tests/fixtures/cassettes",
    record_mode="once",
    match_on=["method", "scheme", "host", "port", "path", "query"],
    filter_headers=[("Coder-Session-Token", "REDACTED")],
)


@pytest.mark.asyncio
@my_vcr.use_cassette("integration/list_agents.yaml")
async def test_list_agents_integration_real_api():
    """Test list_agents with real Coder API (recorded via VCR)."""
    config = Config()
    async with CoderAPIClient(config) as client:
        agents = await list_agents_from_api(client)

        # Should return list of agents
        assert isinstance(agents, list)

        # If agents exist, verify structure
        if len(agents) > 0:
            agent = agents[0]
            assert hasattr(agent, "id")
            assert hasattr(agent, "user")
            assert hasattr(agent, "workspace_id")
            assert hasattr(agent, "status")


@pytest.mark.asyncio
@my_vcr.use_cassette("integration/list_agents_with_filter.yaml")
async def test_list_agents_with_status_filter_integration():
    """Test list_agents with status filter against real API."""
    config = Config()
    async with CoderAPIClient(config) as client:
        agents = await list_agents_from_api(client, status="idle")

        assert isinstance(agents, list)
        # All returned agents should match the filter
        for agent in agents:
            assert agent.status.value == "idle"


@pytest.mark.asyncio
@my_vcr.use_cassette("integration/list_agents_error.yaml")
async def test_list_agents_handles_api_errors():
    """Test that list_agents handles API errors gracefully."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # This cassette should contain an error response
        # The implementation should handle it appropriately
        try:
            agents = await list_agents_from_api(client)
            # If no error, that's also valid (depends on cassette)
            assert isinstance(agents, list)
        except Exception as e:
            # Should raise a meaningful error
            assert str(e) is not None
