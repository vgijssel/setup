"""Tests for AgentService (Layer 2 - Service Layer) - User Story 2.

These tests verify agent lifecycle management: create, delete, restart.
Tests follow TDD approach with Arrange-Act-Assert pattern.

Test Coverage:
- T099: create_agent() with valid parameters
- T100: create_agent() validates name format
- T101: create_agent() checks name uniqueness
- T102: create_agent() validates project exists
- T103: delete_agent() removes agent
- T104: restart_agent() restarts agent
"""

import pytest
from unittest.mock import AsyncMock
from datetime import datetime

from fleet_mcp_clean.services import AgentService
from fleet_mcp_clean.models import Agent, AgentStatus, Project, Role
from fleet_mcp_clean.models.errors import (
    AgentNotFoundError,
    ValidationError,
    AgentConflictError,
)


@pytest.fixture
def mock_agent_repo():
    """Mock AgentRepository for testing."""
    return AsyncMock()


@pytest.fixture
def mock_project_repo():
    """Mock ProjectRepository for testing."""
    return AsyncMock()


@pytest.fixture
def agent_service(mock_agent_repo, mock_project_repo):
    """AgentService instance with mocked repositories."""
    return AgentService(mock_agent_repo, mock_project_repo)


@pytest.fixture
def sample_agent():
    """Sample agent for testing."""
    return Agent(
        name="test-agent",
        workspace_id="ws-123",
        status=AgentStatus.STARTING,
        role="coder",
        project="Setup",
        last_task="Test task",
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 10, 0, 0),
    )


@pytest.fixture
def sample_project():
    """Sample project for testing."""
    return Project(id="proj-123", name="Setup", description="Setup project")


@pytest.mark.asyncio
class TestAgentServiceCreate:
    """Test create_agent method - T099-T102."""

    async def test_create_agent_success(
        self, agent_service, mock_agent_repo, mock_project_repo, sample_agent, sample_project
    ):
        """Test successfully creating an agent - T099."""
        # Arrange
        mock_agent_repo.list_all.return_value = []  # No existing agents
        mock_agent_repo.get_by_name.side_effect = AgentNotFoundError("test-agent")  # Name is available
        mock_project_repo.list_all.return_value = [sample_project]  # Available projects
        mock_project_repo.get_by_name.return_value = sample_project
        mock_project_repo.list_roles.return_value = [
            Role(id="role-1", name="coder", project_id="proj-123", project_name="Setup")
        ]
        mock_agent_repo.create.return_value = sample_agent

        # Act
        result = await agent_service.create_agent(
            name="test-agent",
            project="Setup",
            role="coder",
            task="Test task"
        )

        # Assert
        assert isinstance(result, Agent)
        assert result.name == "test-agent"
        assert result.project == "Setup"
        mock_agent_repo.create.assert_called_once()

    async def test_create_agent_validates_name_format(
        self, agent_service, mock_agent_repo, mock_project_repo
    ):
        """Test create_agent validates name format - T100."""
        # Arrange - invalid name with special characters
        invalid_names = [
            "agent@test",  # @ not allowed
            "agent test",  # space not allowed
            "agent_test",  # underscore not allowed
            "a" * 21,  # too long (>20 chars)
            "",  # empty
        ]

        for invalid_name in invalid_names:
            # Act & Assert
            with pytest.raises((ValidationError, ValueError)):
                await agent_service.create_agent(
                    name=invalid_name,
                    project="Setup",
                    role="coder",
                    task="Test task"
                )

    async def test_create_agent_checks_name_uniqueness(
        self, agent_service, mock_agent_repo, mock_project_repo, sample_agent
    ):
        """Test create_agent checks for duplicate names - T101."""
        # Arrange - existing agent with same name
        mock_agent_repo.list_all.return_value = [sample_agent]

        # Act & Assert
        with pytest.raises((AgentConflictError, ValidationError, ValueError)):
            await agent_service.create_agent(
                name="test-agent",  # Same as sample_agent
                project="Setup",
                role="coder",
                task="Test task"
            )

    async def test_create_agent_validates_project_exists(
        self, agent_service, mock_agent_repo, mock_project_repo
    ):
        """Test create_agent validates project exists - T102."""
        # Arrange
        mock_agent_repo.list_all.return_value = []
        mock_project_repo.get_by_name.return_value = None  # Project doesn't exist

        # Act & Assert
        with pytest.raises((ValidationError, ValueError)):
            await agent_service.create_agent(
                name="test-agent",
                project="NonexistentProject",
                role="coder",
                task="Test task"
            )


@pytest.mark.asyncio
class TestAgentServiceDelete:
    """Test delete_agent method - T103."""

    async def test_delete_agent_success(
        self, agent_service, mock_agent_repo, sample_agent
    ):
        """Test successfully deleting an agent - T103."""
        # Arrange
        mock_agent_repo.get_by_name.return_value = sample_agent
        mock_agent_repo.delete.return_value = None

        # Act
        await agent_service.delete_agent("test-agent")

        # Assert
        mock_agent_repo.delete.assert_called_once_with("test-agent")

    async def test_delete_agent_not_found(
        self, agent_service, mock_agent_repo
    ):
        """Test deleting non-existent agent raises error."""
        # Arrange
        mock_agent_repo.delete.side_effect = AgentNotFoundError("nonexistent")

        # Act & Assert
        with pytest.raises(AgentNotFoundError):
            await agent_service.delete_agent("nonexistent")


@pytest.mark.asyncio
class TestAgentServiceRestart:
    """Test restart_agent method - T104."""

    async def test_restart_agent_success(
        self, agent_service, mock_agent_repo, sample_agent
    ):
        """Test successfully restarting an agent - T104."""
        # Arrange
        restarted_agent = Agent(
            name="test-agent",
            workspace_id="ws-123",
            status=AgentStatus.STARTING,
            role="coder",
            project="Setup",
            last_task="Test task",
            created_at=sample_agent.created_at,
            updated_at=datetime(2025, 11, 7, 11, 0, 0),  # Updated timestamp
        )
        mock_agent_repo.get_by_name.return_value = sample_agent
        mock_agent_repo.restart.return_value = restarted_agent

        # Act
        result = await agent_service.restart_agent("test-agent")

        # Assert
        assert isinstance(result, Agent)
        assert result.name == "test-agent"
        mock_agent_repo.restart.assert_called_once_with("test-agent")

    async def test_restart_agent_not_found(
        self, agent_service, mock_agent_repo
    ):
        """Test restarting non-existent agent raises error."""
        # Arrange
        mock_agent_repo.restart.side_effect = AgentNotFoundError("nonexistent")

        # Act & Assert
        with pytest.raises(AgentNotFoundError):
            await agent_service.restart_agent("nonexistent")
