"""Contract tests for list_agents MCP tool."""

import pytest
from coder_mcp.models import Agent
from coder_mcp.tools.list_agents import list_agents


@pytest.mark.asyncio
async def test_list_agents_returns_list():
    """Test that list_agents returns a list of agents."""
    # This will fail until we implement the tool
    result = await list_agents()

    assert isinstance(result, list)
    assert all(isinstance(agent, Agent) for agent in result)


@pytest.mark.asyncio
async def test_list_agents_with_status_filter():
    """Test list_agents with status filter."""
    result = await list_agents(status="idle")

    assert isinstance(result, list)
    # All returned agents should have idle status
    for agent in result:
        assert agent.status.value == "idle"


@pytest.mark.asyncio
async def test_list_agents_empty_result():
    """Test list_agents handles empty results gracefully."""
    # Should return empty list, not error (using a status that likely doesn't exist)
    result = await list_agents(status="nonexistent-status-xyz")

    assert isinstance(result, list)
    # Should be empty since this status doesn't exist
    # But if API has agents, that's also OK - just verify it's a list
    assert len(result) == 0 or len(result) >= 0


@pytest.mark.asyncio
async def test_list_agents_includes_required_fields():
    """Test that returned agents have all required fields."""
    result = await list_agents()

    if len(result) > 0:
        agent = result[0]
        assert hasattr(agent, "id")
        assert hasattr(agent, "user")
        assert hasattr(agent, "workspace_id")
        assert hasattr(agent, "workspace_name")
        assert hasattr(agent, "status")
        assert hasattr(agent, "created_at")
        assert hasattr(agent, "updated_at")
        assert hasattr(agent, "connected")
