"""Tests for create_agent MCP tool (Layer 1 - Tool Layer)."""

import pytest
from unittest.mock import AsyncMock
from datetime import datetime

from fleet_mcp_clean.tools.create_agent import create_agent
from fleet_mcp_clean.models import Agent, AgentStatus, CreateAgentResponse
from fleet_mcp_clean.clients.exceptions import ConflictError


@pytest.fixture
def mock_agent_service():
    """Mock AgentService for testing."""
    return AsyncMock()


@pytest.fixture
def sample_agent():
    """Sample created agent data."""
    return Agent(
        name="test-agent",
        workspace_id="workspace-uuid-123",
        status=AgentStatus.STARTING,
        role="coder",
        project="Setup",
        last_task="Implement new feature X",
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 10, 0, 0),
    )


@pytest.mark.asyncio
class TestCreateAgent:
    """Test create_agent MCP tool."""

    async def test_create_agent_returns_correct_response_format(
        self, mock_agent_service, sample_agent
    ):
        """Test that create_agent returns proper MCP response format (T106)."""
        # Arrange
        mock_agent_service.create_agent.return_value = sample_agent

        # Act
        result = await create_agent(
            mock_agent_service,
            name="test-agent",
            project="Setup",
            task="Implement new feature X",
            role="coder",
        )

        # Assert
        assert isinstance(result, CreateAgentResponse)
        assert result.agent == sample_agent
        assert result.message == "Agent 'test-agent' created successfully"

    async def test_create_agent_delegates_to_service(
        self, mock_agent_service, sample_agent
    ):
        """Test that create_agent correctly delegates to AgentService (T106)."""
        # Arrange
        mock_agent_service.create_agent.return_value = sample_agent

        # Act
        await create_agent(
            mock_agent_service,
            name="test-agent",
            project="Setup",
            task="Implement new feature X",
            role="coder",
        )

        # Assert
        mock_agent_service.create_agent.assert_called_once_with(
            name="test-agent", project="Setup", task="Implement new feature X", role="coder"
        )

    async def test_create_agent_with_all_parameters(
        self, mock_agent_service, sample_agent
    ):
        """Test create_agent with all parameters specified (T107)."""
        # Arrange
        mock_agent_service.create_agent.return_value = sample_agent

        # Act
        result = await create_agent(
            mock_agent_service,
            name="custom-agent",
            project="DataOne",
            task="Analyze dataset Y",
            role="analyst",
        )

        # Assert
        assert result.agent.name == "test-agent"  # From mock
        assert result.message == "Agent 'custom-agent' created successfully"
        mock_agent_service.create_agent.assert_called_once_with(
            name="custom-agent", project="DataOne", task="Analyze dataset Y", role="analyst"
        )

    async def test_create_agent_with_default_role(
        self, mock_agent_service, sample_agent
    ):
        """Test create_agent uses default role when not specified (T107)."""
        # Arrange
        mock_agent_service.create_agent.return_value = sample_agent

        # Act
        result = await create_agent(
            mock_agent_service,
            name="test-agent",
            project="Setup",
            task="Default role test",
        )

        # Assert
        mock_agent_service.create_agent.assert_called_once_with(
            name="test-agent", project="Setup", task="Default role test", role="coder"
        )

    async def test_create_agent_propagates_duplicate_name_error(
        self, mock_agent_service
    ):
        """Test create_agent propagates ConflictError for duplicate names (T108)."""
        # Arrange
        mock_agent_service.create_agent.side_effect = ConflictError(
            "Agent with name 'duplicate-agent' already exists"
        )

        # Act & Assert
        with pytest.raises(ConflictError, match="already exists"):
            await create_agent(
                mock_agent_service,
                name="duplicate-agent",
                project="Setup",
                task="Test duplicate",
                role="coder",
            )

    async def test_create_agent_propagates_service_errors(
        self, mock_agent_service
    ):
        """Test create_agent propagates other service errors (T108)."""
        # Arrange
        mock_agent_service.create_agent.side_effect = ValueError(
            "Project 'NonExistent' not found"
        )

        # Act & Assert
        with pytest.raises(ValueError, match="not found"):
            await create_agent(
                mock_agent_service,
                name="test-agent",
                project="NonExistent",
                task="Test error",
                role="coder",
            )

    async def test_create_agent_message_includes_agent_name(
        self, mock_agent_service, sample_agent
    ):
        """Test that success message includes the agent name (T106)."""
        # Arrange
        mock_agent_service.create_agent.return_value = sample_agent

        # Act
        result = await create_agent(
            mock_agent_service,
            name="my-special-agent",
            project="Setup",
            task="Special task",
            role="coder",
        )

        # Assert
        assert "my-special-agent" in result.message
        assert "created successfully" in result.message
