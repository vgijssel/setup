"""Tests for start_agent_task MCP tool (Layer 1 - Tool Layer)."""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.clients.exceptions import NotFoundError
from fleet_mcp_clean.models import StartTaskResponse
from fleet_mcp_clean.tools.start_task import start_agent_task


@pytest.fixture
def mock_task_service():
    """Mock TaskService for testing."""
    return AsyncMock()


@pytest.mark.asyncio
class TestStartAgentTask:
    """Test start_agent_task MCP tool."""

    async def test_start_agent_task_returns_correct_response_format(
        self, mock_task_service
    ):
        """Test that start_agent_task returns proper MCP response format (T150)."""
        # Arrange
        mock_task_service.assign_task.return_value = None

        # Act
        result = await start_agent_task(
            mock_task_service,
            agent_name="test-agent",
            task_description="Analyze data and create report",
        )

        # Assert
        assert isinstance(result, StartTaskResponse)
        assert result.agent_name == "test-agent"
        assert result.task_description == "Analyze data and create report"
        assert result.message == "Task assigned to agent 'test-agent' successfully"

    async def test_start_agent_task_delegates_to_service(self, mock_task_service):
        """Test that start_agent_task correctly delegates to TaskService (T150)."""
        # Arrange
        mock_task_service.assign_task.return_value = None

        # Act
        await start_agent_task(
            mock_task_service,
            agent_name="data-analyst",
            task_description="Process quarterly reports",
        )

        # Assert
        mock_task_service.assign_task.assert_called_once_with(
            "data-analyst", "Process quarterly reports"
        )

    async def test_start_agent_task_with_long_description(self, mock_task_service):
        """Test start_agent_task with a detailed task description (T151)."""
        # Arrange
        mock_task_service.assign_task.return_value = None
        long_description = (
            "Analyze the sales data from Q4 2024, identify trends, "
            "create visualizations, and prepare a comprehensive report "
            "with actionable recommendations for the executive team."
        )

        # Act
        result = await start_agent_task(
            mock_task_service,
            agent_name="analyst-pro",
            task_description=long_description,
        )

        # Assert
        assert result.task_description == long_description
        assert "analyst-pro" in result.message
        mock_task_service.assign_task.assert_called_once_with(
            "analyst-pro", long_description
        )

    async def test_start_agent_task_propagates_not_found_error(self, mock_task_service):
        """Test start_agent_task propagates NotFoundError for non-existent agents (T151)."""
        # Arrange
        mock_task_service.assign_task.side_effect = NotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="not found"):
            await start_agent_task(
                mock_task_service,
                agent_name="nonexistent",
                task_description="Test task",
            )

    async def test_start_agent_task_propagates_validation_error_for_non_idle_agent(
        self, mock_task_service
    ):
        """Test start_agent_task propagates ValueError for non-idle agents (T152)."""
        # Arrange
        mock_task_service.assign_task.side_effect = ValueError(
            "Cannot assign task to non-idle agent 'busy-agent' (status: busy). Agent must be idle."
        )

        # Act & Assert
        with pytest.raises(ValueError, match="non-idle"):
            await start_agent_task(
                mock_task_service, agent_name="busy-agent", task_description="New task"
            )

    async def test_start_agent_task_propagates_validation_error_for_offline_agent(
        self, mock_task_service
    ):
        """Test start_agent_task propagates ValueError for offline agents (T152)."""
        # Arrange
        mock_task_service.assign_task.side_effect = ValueError(
            "Cannot assign task to offline agent 'offline-agent' (status: offline)"
        )

        # Act & Assert
        with pytest.raises(ValueError, match="offline"):
            await start_agent_task(
                mock_task_service,
                agent_name="offline-agent",
                task_description="Test task",
            )

    async def test_start_agent_task_propagates_empty_description_error(
        self, mock_task_service
    ):
        """Test start_agent_task propagates ValueError for empty task description (T152)."""
        # Arrange
        mock_task_service.assign_task.side_effect = ValueError(
            "Task description cannot be empty"
        )

        # Act & Assert
        with pytest.raises(ValueError, match="empty"):
            await start_agent_task(
                mock_task_service, agent_name="test-agent", task_description=""
            )

    async def test_start_agent_task_message_includes_agent_name(
        self, mock_task_service
    ):
        """Test that success message includes the agent name (T150)."""
        # Arrange
        mock_task_service.assign_task.return_value = None

        # Act
        result = await start_agent_task(
            mock_task_service,
            agent_name="special-agent",
            task_description="Special mission",
        )

        # Assert
        assert "special-agent" in result.message
        assert "assigned" in result.message.lower()
        assert "successfully" in result.message.lower()
