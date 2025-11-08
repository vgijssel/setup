"""Tests for list_agents MCP tool (Layer 1 - Tool Layer)."""

import pytest
from unittest.mock import AsyncMock

from fleet_mcp_clean.tools.list_agents import list_agents
from fleet_mcp_clean.models import Agent, AgentStatus, ListAgentsResponse
from datetime import datetime


@pytest.fixture
def mock_agent_service():
    """Mock AgentService for testing."""
    return AsyncMock()


@pytest.fixture
def sample_agents():
    """Sample agent data for tests."""
    return [
        Agent(
            name="agent-1",
            workspace_id="ws-1",
            status=AgentStatus.IDLE,
            role="coder",
            project="Setup",
            last_task="Test task 1",
            created_at=datetime(2025, 11, 7, 10, 0, 0),
            updated_at=datetime(2025, 11, 7, 10, 30, 0),
        ),
        Agent(
            name="agent-2",
            workspace_id="ws-2",
            status=AgentStatus.BUSY,
            role="analyst",
            project="DataOne",
            last_task="Test task 2",
            created_at=datetime(2025, 11, 7, 11, 0, 0),
            updated_at=datetime(2025, 11, 7, 11, 30, 0),
        ),
    ]


@pytest.mark.asyncio
class TestListAgents:
    """Test list_agents MCP tool."""

    async def test_list_agents_returns_correct_response_format(
        self, mock_agent_service, sample_agents
    ):
        """Test that list_agents returns proper MCP response format."""
        # Arrange
        mock_agent_service.list_agents.return_value = sample_agents

        # Act
        result = await list_agents(mock_agent_service)

        # Assert
        assert isinstance(result, ListAgentsResponse)
        assert len(result.agents) == 2
        assert result.total_count == 2
        assert result.agents[0].name == "agent-1"
        assert result.agents[1].name == "agent-2"

    async def test_list_agents_delegates_to_service(self, mock_agent_service, sample_agents):
        """Test that list_agents delegates to AgentService."""
        # Arrange
        mock_agent_service.list_agents.return_value = sample_agents

        # Act
        await list_agents(mock_agent_service)

        # Assert
        mock_agent_service.list_agents.assert_called_once_with(
            status_filter=None, project_filter=None
        )

    async def test_list_agents_with_status_filter(self, mock_agent_service, sample_agents):
        """Test list_agents with status filter parameter."""
        # Arrange
        idle_agents = [a for a in sample_agents if a.status == AgentStatus.IDLE]
        mock_agent_service.list_agents.return_value = idle_agents

        # Act
        result = await list_agents(mock_agent_service, status_filter=AgentStatus.IDLE)

        # Assert
        assert isinstance(result, ListAgentsResponse)
        assert len(result.agents) == 1
        assert result.agents[0].status == AgentStatus.IDLE
        mock_agent_service.list_agents.assert_called_once_with(
            status_filter=AgentStatus.IDLE, project_filter=None
        )

    async def test_list_agents_with_project_filter(self, mock_agent_service, sample_agents):
        """Test list_agents with project filter parameter."""
        # Arrange
        setup_agents = [a for a in sample_agents if a.project == "Setup"]
        mock_agent_service.list_agents.return_value = setup_agents

        # Act
        result = await list_agents(mock_agent_service, project_filter="Setup")

        # Assert
        assert isinstance(result, ListAgentsResponse)
        assert len(result.agents) == 1
        assert result.agents[0].project == "Setup"
        mock_agent_service.list_agents.assert_called_once_with(
            status_filter=None, project_filter="Setup"
        )

    async def test_list_agents_empty_list(self, mock_agent_service):
        """Test list_agents when no agents exist."""
        # Arrange
        mock_agent_service.list_agents.return_value = []

        # Act
        result = await list_agents(mock_agent_service)

        # Assert
        assert isinstance(result, ListAgentsResponse)
        assert len(result.agents) == 0
        assert result.total_count == 0

    async def test_list_agents_calculates_total_count(self, mock_agent_service, sample_agents):
        """Test that total_count is accurately calculated."""
        # Arrange
        mock_agent_service.list_agents.return_value = sample_agents

        # Act
        result = await list_agents(mock_agent_service)

        # Assert
        assert result.total_count == len(sample_agents)
        assert result.total_count == 2
