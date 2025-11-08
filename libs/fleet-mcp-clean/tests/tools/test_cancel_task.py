"""Tests for cancel_agent_task MCP tool (Layer 1 - Tool Layer)."""

import pytest
from unittest.mock import AsyncMock

from fleet_mcp_clean.tools.cancel_task import cancel_agent_task
from fleet_mcp_clean.models import CancelTaskResponse
from fleet_mcp_clean.clients.exceptions import NotFoundError


@pytest.fixture
def mock_task_service():
    """Mock TaskService for testing."""
    return AsyncMock()


@pytest.mark.asyncio
class TestCancelAgentTask:
    """Test cancel_agent_task MCP tool."""

    async def test_cancel_agent_task_returns_correct_response_format(
        self, mock_task_service
    ):
        """Test that cancel_agent_task returns proper MCP response format (T153)."""
        # Arrange
        mock_task_service.cancel_task.return_value = None

        # Act
        result = await cancel_agent_task(mock_task_service, agent_name="busy-agent")

        # Assert
        assert isinstance(result, CancelTaskResponse)
        assert result.agent_name == "busy-agent"
        assert result.message == "Task canceled for agent 'busy-agent' successfully"

    async def test_cancel_agent_task_delegates_to_service(
        self, mock_task_service
    ):
        """Test that cancel_agent_task correctly delegates to TaskService (T153)."""
        # Arrange
        mock_task_service.cancel_task.return_value = None

        # Act
        await cancel_agent_task(mock_task_service, agent_name="working-agent")

        # Assert
        mock_task_service.cancel_task.assert_called_once_with("working-agent")

    async def test_cancel_agent_task_propagates_not_found_error(
        self, mock_task_service
    ):
        """Test cancel_agent_task propagates NotFoundError for non-existent agents (T154)."""
        # Arrange
        mock_task_service.cancel_task.side_effect = NotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="not found"):
            await cancel_agent_task(mock_task_service, agent_name="nonexistent")

    async def test_cancel_agent_task_propagates_validation_error_for_non_busy_agent(
        self, mock_task_service
    ):
        """Test cancel_agent_task propagates ValueError for non-busy agents (T154)."""
        # Arrange
        mock_task_service.cancel_task.side_effect = ValueError(
            "Cannot cancel task on non-busy agent 'idle-agent' (status: idle). Agent must be busy."
        )

        # Act & Assert
        with pytest.raises(ValueError, match="non-busy"):
            await cancel_agent_task(mock_task_service, agent_name="idle-agent")

    async def test_cancel_agent_task_propagates_agentapi_unavailable_error(
        self, mock_task_service
    ):
        """Test cancel_agent_task propagates NotFoundError when AgentAPI unavailable (T154)."""
        # Arrange
        mock_task_service.cancel_task.side_effect = NotFoundError(
            "AgentAPI not available for agent 'test-agent'"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="AgentAPI not available"):
            await cancel_agent_task(mock_task_service, agent_name="test-agent")

    async def test_cancel_agent_task_message_includes_agent_name(
        self, mock_task_service
    ):
        """Test that success message includes the agent name (T153)."""
        # Arrange
        mock_task_service.cancel_task.return_value = None

        # Act
        result = await cancel_agent_task(mock_task_service, agent_name="my-agent")

        # Assert
        assert "my-agent" in result.message
        assert "canceled" in result.message.lower()
        assert "successfully" in result.message.lower()

    async def test_cancel_agent_task_sends_interrupt_signal(
        self, mock_task_service
    ):
        """Test cancel_agent_task triggers interrupt signal sending (T153)."""
        # Arrange
        mock_task_service.cancel_task.return_value = None

        # Act
        result = await cancel_agent_task(mock_task_service, agent_name="stuck-agent")

        # Assert
        # Verify service was called (which internally sends Ctrl+C via AgentAPI)
        mock_task_service.cancel_task.assert_called_once_with("stuck-agent")
        assert result.agent_name == "stuck-agent"
