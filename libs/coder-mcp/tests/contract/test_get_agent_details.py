"""
Contract tests for get_agent_details MCP tool.

Tests verify that the tool conforms to the expected MCP interface
and returns data matching the Agent model schema.
"""

import pytest
from pydantic import ValidationError
from coder_mcp.models import Agent, AgentStatus


class TestGetAgentDetailsContract:
    """Contract tests for get_agent_details tool."""

    @pytest.mark.asyncio
    async def test_get_agent_details_returns_agent_model(self):
        """Test that get_agent_details returns a valid Agent model."""
        from coder_mcp.tools.get_agent_details import get_agent_details
        from coder_mcp.tools.list_agents import list_agents

        # Get a real agent to test with
        agents = await list_agents()
        if not agents:
            pytest.skip("No agents available for testing")

        agent_to_test = agents[0]

        # Test get_agent_details with real agent
        result = await get_agent_details(user=agent_to_test.user, agent_id=agent_to_test.id)

        # Verify result structure
        assert isinstance(result, dict)
        assert "success" in result
        assert result["success"] is True
        assert "data" in result

        # Verify data matches Agent model
        agent = Agent(**result["data"])
        assert agent.id == agent_to_test.id
        assert isinstance(agent.status, AgentStatus)
        assert agent.workspace_id
        assert agent.connected in [True, False]

    @pytest.mark.asyncio
    async def test_get_agent_details_handles_not_found(self):
        """Test that get_agent_details handles non-existent agent gracefully."""
        from coder_mcp.tools.get_agent_details import get_agent_details

        result = await get_agent_details(user="me", agent_id="nonexistent-agent-id")

        # Verify error structure
        assert isinstance(result, dict)
        assert "success" in result
        assert result["success"] is False
        assert "error" in result
        assert "error_code" in result
        assert result["error_code"] == "AGENT_NOT_FOUND"

    @pytest.mark.asyncio
    async def test_get_agent_details_validates_input(self):
        """Test that get_agent_details validates required parameters."""
        from coder_mcp.tools.get_agent_details import get_agent_details

        # Test missing agent_id
        with pytest.raises(TypeError):
            await get_agent_details(user="me")

        # Test missing user
        with pytest.raises(TypeError):
            await get_agent_details(agent_id="test-id")

    @pytest.mark.asyncio
    async def test_get_agent_details_returns_complete_agent_data(self):
        """Test that get_agent_details returns all required Agent fields."""
        from coder_mcp.tools.get_agent_details import get_agent_details
        from coder_mcp.tools.list_agents import list_agents

        # Get a real agent to test with
        agents = await list_agents()
        if not agents:
            pytest.skip("No agents available for testing")

        agent_to_test = agents[0]
        result = await get_agent_details(user=agent_to_test.user, agent_id=agent_to_test.id)

        if result["success"]:
            agent_data = result["data"]
            # Required fields from data-model.md
            required_fields = [
                "id",
                "user",
                "workspace_id",
                "workspace_name",
                "status",
                "created_at",
                "updated_at",
                "connected",
            ]
            for field in required_fields:
                assert field in agent_data, f"Missing required field: {field}"
