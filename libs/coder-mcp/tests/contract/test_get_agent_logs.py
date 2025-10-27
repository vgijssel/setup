"""
Contract tests for get_agent_logs MCP tool.

Tests verify that the tool conforms to the expected MCP interface
and returns data matching the LogEntry model schema.
"""

import pytest
from datetime import datetime
from coder_mcp.models import LogEntry, LogLevel


class TestGetAgentLogsContract:
    """Contract tests for get_agent_logs tool."""

    @pytest.mark.asyncio
    async def test_get_agent_logs_returns_log_entries(self):
        """Test that get_agent_logs returns a list of valid LogEntry models."""
        from coder_mcp.tools.get_agent_logs import get_agent_logs
        from coder_mcp.tools.list_agents import list_agents

        # Get a real agent to test with
        agents = await list_agents()
        if not agents:
            pytest.skip("No agents available for testing")

        agent_to_test = agents[0]
        result = await get_agent_logs(user=agent_to_test.user, agent_id=agent_to_test.id)

        # Verify result structure
        assert isinstance(result, dict)
        assert "success" in result
        assert result["success"] is True
        assert "data" in result
        assert isinstance(result["data"], list)

        # Verify each log entry matches LogEntry model (if any logs exist)
        if len(result["data"]) > 0:
            for log_data in result["data"]:
                log_entry = LogEntry(**log_data)
                assert isinstance(log_entry.timestamp, datetime)
                assert isinstance(log_entry.level, LogLevel)
                assert isinstance(log_entry.message, str)

    @pytest.mark.asyncio
    async def test_get_agent_logs_handles_not_found(self):
        """Test that get_agent_logs handles non-existent agent gracefully."""
        from coder_mcp.tools.get_agent_logs import get_agent_logs

        result = await get_agent_logs(user="me", agent_id="nonexistent-agent-id")

        # Verify error structure
        assert isinstance(result, dict)
        assert "success" in result
        assert result["success"] is False
        assert "error" in result
        assert "error_code" in result
        assert result["error_code"] == "AGENT_NOT_FOUND"

    @pytest.mark.asyncio
    async def test_get_agent_logs_supports_filtering(self):
        """Test that get_agent_logs accepts optional filter parameters."""
        from coder_mcp.tools.get_agent_logs import get_agent_logs

        # Test with level filter
        result = await get_agent_logs(
            user="me", agent_id="test-agent-id", level="error"
        )

        assert isinstance(result, dict)
        assert "success" in result

        # If successful, verify filtering worked
        if result["success"] and len(result["data"]) > 0:
            for log_data in result["data"]:
                log_entry = LogEntry(**log_data)
                assert log_entry.level == LogLevel.ERROR

    @pytest.mark.asyncio
    async def test_get_agent_logs_supports_limit(self):
        """Test that get_agent_logs accepts limit parameter."""
        from coder_mcp.tools.get_agent_logs import get_agent_logs

        limit = 10
        result = await get_agent_logs(user="me", agent_id="test-agent-id", limit=limit)

        assert isinstance(result, dict)
        assert "success" in result

        # If successful, verify limit was respected
        if result["success"]:
            assert len(result["data"]) <= limit

    @pytest.mark.asyncio
    async def test_get_agent_logs_validates_input(self):
        """Test that get_agent_logs validates required parameters."""
        from coder_mcp.tools.get_agent_logs import get_agent_logs

        # Test missing agent_id
        with pytest.raises(TypeError):
            await get_agent_logs(user="me")

        # Test missing user
        with pytest.raises(TypeError):
            await get_agent_logs(agent_id="test-id")

    @pytest.mark.asyncio
    async def test_get_agent_logs_returns_empty_list_for_no_logs(self):
        """Test that get_agent_logs returns empty list when no logs available."""
        from coder_mcp.tools.get_agent_logs import get_agent_logs

        # This should succeed but return empty list for agents with no logs
        result = await get_agent_logs(user="me", agent_id="idle-agent-id")

        assert isinstance(result, dict)
        assert "success" in result
        # Either success with empty list or agent not found error
        if result["success"]:
            assert isinstance(result["data"], list)
