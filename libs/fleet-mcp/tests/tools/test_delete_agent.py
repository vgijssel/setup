"""Tests for delete_agent MCP tool (Layer 1 - Tool Layer)."""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp.clients.exceptions import NotFoundError
from fleet_mcp.models import DeleteAgentResponse
from fleet_mcp.tools.delete_agent import delete_agent


@pytest.fixture
def mock_agent_service():
    """Mock AgentService for testing."""
    return AsyncMock()


@pytest.mark.asyncio
class TestDeleteAgent:
    """Test delete_agent MCP tool."""

    async def test_delete_agent_returns_correct_response_format(
        self, mock_agent_service
    ):
        """Test that delete_agent returns proper MCP response format (T109)."""
        # Arrange
        mock_agent_service.delete_agent.return_value = None

        # Act
        result = await delete_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        assert isinstance(result, DeleteAgentResponse)
        assert result.agent_name == "test-agent"
        assert result.message == "Agent 'test-agent' deleted successfully"

    async def test_delete_agent_delegates_to_service(self, mock_agent_service):
        """Test that delete_agent correctly delegates to AgentService (T109)."""
        # Arrange
        mock_agent_service.delete_agent.return_value = None

        # Act
        await delete_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        mock_agent_service.delete_agent.assert_called_once_with("test-agent")

    async def test_delete_agent_propagates_not_found_error(self, mock_agent_service):
        """Test delete_agent propagates NotFoundError for non-existent agents (T109)."""
        # Arrange
        mock_agent_service.delete_agent.side_effect = NotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="not found"):
            await delete_agent(mock_agent_service, agent_name="nonexistent")

    async def test_delete_agent_message_includes_agent_name(self, mock_agent_service):
        """Test that success message includes the agent name (T109)."""
        # Arrange
        mock_agent_service.delete_agent.return_value = None

        # Act
        result = await delete_agent(mock_agent_service, agent_name="my-agent")

        # Assert
        assert "my-agent" in result.message
        assert "deleted successfully" in result.message

    async def test_delete_agent_works_for_busy_agent(self, mock_agent_service):
        """Test delete_agent can delete busy agents (forceful deletion) (T109)."""
        # Arrange - Service should not raise an error even if agent is busy
        mock_agent_service.delete_agent.return_value = None

        # Act
        result = await delete_agent(mock_agent_service, agent_name="busy-agent")

        # Assert
        assert result.agent_name == "busy-agent"
        mock_agent_service.delete_agent.assert_called_once_with("busy-agent")

    async def test_delete_agent_propagates_service_errors(self, mock_agent_service):
        """Test delete_agent propagates other service errors (T109)."""
        # Arrange
        mock_agent_service.delete_agent.side_effect = RuntimeError(
            "Coder API unavailable"
        )

        # Act & Assert
        with pytest.raises(RuntimeError, match="unavailable"):
            await delete_agent(mock_agent_service, agent_name="test-agent")
