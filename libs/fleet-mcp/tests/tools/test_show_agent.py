"""Tests for show_agent MCP tool (Layer 1 - Tool Layer)."""

from datetime import datetime
from unittest.mock import AsyncMock

import pytest
from fleet_mcp.models import Agent, AgentStatus, ShowAgentResponse
from fleet_mcp.models.errors import AgentNotFoundError
from fleet_mcp.tools.show_agent import show_agent


@pytest.fixture
def mock_agent_service():
    """Mock AgentService for testing."""
    return AsyncMock()


@pytest.fixture
def sample_agent():
    """Sample agent data for tests."""
    return Agent(
        name="test-agent",
        workspace_id="ws-123",
        status=AgentStatus.IDLE,
        role="coder",
        project="Setup",
        last_task="Analyze codebase structure",
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 10, 30, 0),
    )


@pytest.mark.asyncio
class TestShowAgent:
    """Test show_agent MCP tool."""

    async def test_show_agent_returns_correct_response_format(
        self, mock_agent_service, sample_agent
    ):
        """Test that show_agent returns proper MCP response format."""
        # Arrange
        mock_agent_service.get_agent.return_value = sample_agent

        # Act
        result = await show_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        assert isinstance(result, ShowAgentResponse)
        assert result.agent.name == "test-agent"
        assert result.agent.workspace_id == "ws-123"
        assert result.agent.status == AgentStatus.IDLE

    async def test_show_agent_delegates_to_service(
        self, mock_agent_service, sample_agent
    ):
        """Test that show_agent delegates to AgentService."""
        # Arrange
        mock_agent_service.get_agent.return_value = sample_agent

        # Act
        await show_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        mock_agent_service.get_agent.assert_called_once_with("test-agent")

    async def test_show_agent_with_all_fields(self, mock_agent_service, sample_agent):
        """Test that show_agent returns all agent fields."""
        # Arrange
        mock_agent_service.get_agent.return_value = sample_agent

        # Act
        result = await show_agent(mock_agent_service, agent_name="test-agent")

        # Assert
        agent = result.agent
        assert agent.name == "test-agent"
        assert agent.workspace_id == "ws-123"
        assert agent.status == AgentStatus.IDLE
        assert agent.role == "coder"
        assert agent.project == "Setup"
        assert agent.last_task == "Analyze codebase structure"
        assert agent.created_at == datetime(2025, 11, 7, 10, 0, 0)
        assert agent.updated_at == datetime(2025, 11, 7, 10, 30, 0)

    async def test_show_agent_raises_error_for_nonexistent_agent(
        self, mock_agent_service
    ):
        """Test that show_agent raises AgentNotFoundError for non-existent agent."""
        # Arrange
        mock_agent_service.get_agent.side_effect = AgentNotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(AgentNotFoundError, match="Agent 'nonexistent' not found"):
            await show_agent(mock_agent_service, agent_name="nonexistent")

    async def test_show_agent_propagates_service_errors(self, mock_agent_service):
        """Test that show_agent propagates errors from service layer."""
        # Arrange
        mock_agent_service.get_agent.side_effect = Exception("Service error")

        # Act & Assert
        with pytest.raises(Exception, match="Service error"):
            await show_agent(mock_agent_service, agent_name="test-agent")
