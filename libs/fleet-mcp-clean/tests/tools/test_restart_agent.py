"""Tests for restart_agent MCP tool (Layer 1 - Tool Layer)."""

from datetime import datetime
from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.clients.exceptions import NotFoundError
from fleet_mcp_clean.models import Agent, AgentStatus, RestartAgentResponse
from fleet_mcp_clean.tools.restart_agent import restart_agent


@pytest.fixture
def mock_agent_service():
    """Mock AgentService for testing."""
    return AsyncMock()


@pytest.fixture
def sample_restarted_agent():
    """Sample restarted agent data."""
    return Agent(
        name="test-agent",
        workspace_id="workspace-uuid-123",
        status=AgentStatus.STARTING,  # After restart, status is STARTING
        role="coder",
        project="Setup",
        last_task="Previous task",
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 11, 0, 0),  # Updated timestamp
    )


@pytest.mark.asyncio
class TestRestartAgent:
    """Test restart_agent MCP tool."""

    async def test_restart_agent_returns_correct_response_format(
        self, mock_agent_service, sample_restarted_agent
    ):
        """Test that restart_agent returns proper MCP response format (T110)."""
        # Arrange
        mock_agent_service.restart_agent.return_value = sample_restarted_agent

        # Act
        result = await restart_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        assert isinstance(result, RestartAgentResponse)
        assert result.agent == sample_restarted_agent
        assert result.message == "Agent 'test-agent' restarted successfully"

    async def test_restart_agent_delegates_to_service(
        self, mock_agent_service, sample_restarted_agent
    ):
        """Test that restart_agent correctly delegates to AgentService (T110)."""
        # Arrange
        mock_agent_service.restart_agent.return_value = sample_restarted_agent

        # Act
        await restart_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        mock_agent_service.restart_agent.assert_called_once_with("test-agent")

    async def test_restart_agent_propagates_not_found_error(self, mock_agent_service):
        """Test restart_agent propagates NotFoundError for non-existent agents (T110a)."""
        # Arrange
        mock_agent_service.restart_agent.side_effect = NotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="not found"):
            await restart_agent(mock_agent_service, agent_name="nonexistent")

    async def test_restart_agent_validates_agent_name_parameter(
        self, mock_agent_service, sample_restarted_agent
    ):
        """Test restart_agent validates agent_name parameter (T110b)."""
        # Arrange
        mock_agent_service.restart_agent.return_value = sample_restarted_agent

        # Act
        result = await restart_agent(mock_agent_service, agent_name="valid-name-123")

        # Assert
        assert result.agent.name == "test-agent"
        mock_agent_service.restart_agent.assert_called_once_with("valid-name-123")

    async def test_restart_agent_message_includes_agent_name(
        self, mock_agent_service, sample_restarted_agent
    ):
        """Test that success message includes the agent name (T110)."""
        # Arrange
        mock_agent_service.restart_agent.return_value = sample_restarted_agent

        # Act
        result = await restart_agent(mock_agent_service, agent_name="my-agent")

        # Assert
        assert "my-agent" in result.message
        assert "restarted successfully" in result.message

    async def test_restart_agent_returns_updated_agent_state(
        self, mock_agent_service, sample_restarted_agent
    ):
        """Test restart_agent returns agent with updated state (T110)."""
        # Arrange
        mock_agent_service.restart_agent.return_value = sample_restarted_agent

        # Act
        result = await restart_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        assert result.agent.status == AgentStatus.STARTING
        assert result.agent.updated_at > result.agent.created_at

    async def test_restart_agent_propagates_service_errors(self, mock_agent_service):
        """Test restart_agent propagates other service errors (T110a)."""
        # Arrange
        mock_agent_service.restart_agent.side_effect = RuntimeError(
            "Coder API unavailable"
        )

        # Act & Assert
        with pytest.raises(RuntimeError, match="unavailable"):
            await restart_agent(mock_agent_service, agent_name="test-agent")
