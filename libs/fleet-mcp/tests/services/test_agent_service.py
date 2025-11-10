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

from datetime import datetime
from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.models import Agent, AgentStatus, Project, Role
from fleet_mcp_clean.models.errors import (
    AgentConflictError,
    AgentNotFoundError,
    ValidationError,
)
from fleet_mcp_clean.services import AgentService


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
        self,
        agent_service,
        mock_agent_repo,
        mock_project_repo,
        sample_agent,
        sample_project,
    ):
        """Test successfully creating an agent - T099."""
        # Arrange
        mock_agent_repo.list_all.return_value = []  # No existing agents
        mock_agent_repo.get_by_name.side_effect = AgentNotFoundError(
            "test-agent"
        )  # Name is available
        mock_project_repo.list_all.return_value = [sample_project]  # Available projects
        mock_project_repo.get_by_name.return_value = sample_project
        mock_project_repo.list_roles.return_value = [
            Role(
                id="role-1",
                name="coder",
                project_id="proj-123",
                project_name="Setup",
                default=True,
            )
        ]
        mock_agent_repo.create.return_value = sample_agent

        # Act
        result = await agent_service.create_agent(
            name="test-agent", project="Setup", role="coder", task="Test task"
        )

        # Assert
        assert isinstance(result, Agent)
        assert result.name == "test-agent"
        assert result.project == "Setup"
        mock_agent_repo.create.assert_called_once()

    async def test_create_agent_with_no_role_uses_first_available_role(
        self,
        agent_service,
        mock_agent_repo,
        mock_project_repo,
        sample_agent,
        sample_project,
    ):
        """Test creating agent with role=None queries backend and uses first available role."""
        # Arrange
        mock_agent_repo.list_all.return_value = []  # No existing agents
        mock_agent_repo.get_by_name.side_effect = AgentNotFoundError(
            "test-agent"
        )  # Name is available
        mock_project_repo.list_all.return_value = [sample_project]  # Available projects
        mock_project_repo.get_by_name.return_value = sample_project

        # Mock roles with multiple options - should pick the one marked as default
        mock_project_repo.list_roles.return_value = [
            Role(
                id="role-operator",
                name="operator",
                project_id="proj-123",
                project_name="Setup",
                default=False,
            ),
            Role(
                id="role-coder",
                name="coder",
                project_id="proj-123",
                project_name="Setup",
                default=True,
            ),
            Role(
                id="role-manager",
                name="manager",
                project_id="proj-123",
                project_name="Setup",
                default=False,
            ),
        ]

        # Mock agent creation with coder role (the default one)
        agent_with_coder_role = Agent(
            name="test-agent",
            workspace_id="ws-123",
            status=AgentStatus.STARTING,
            role="coder",  # Default role
            project="Setup",
            last_task="Test task",
            created_at=datetime(2025, 11, 7, 10, 0, 0),
            updated_at=datetime(2025, 11, 7, 10, 0, 0),
        )
        mock_agent_repo.create.return_value = agent_with_coder_role

        # Act - role=None means "query backend for default"
        result = await agent_service.create_agent(
            name="test-agent", project="Setup", role=None, task="Test task"
        )

        # Assert
        assert isinstance(result, Agent)
        assert result.name == "test-agent"
        assert result.role == "coder"  # Should use the default role

        # Verify that create was called with default role's preset_id
        mock_agent_repo.create.assert_called_once()
        call_args = mock_agent_repo.create.call_args
        assert call_args.kwargs["preset_id"] == "role-coder"

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
                    name=invalid_name, project="Setup", role="coder", task="Test task"
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
                task="Test task",
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
                task="Test task",
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

    async def test_delete_agent_not_found(self, agent_service, mock_agent_repo):
        """Test deleting non-existent agent raises error."""
        # Arrange
        mock_agent_repo.delete.side_effect = AgentNotFoundError("nonexistent")

        # Act & Assert
        with pytest.raises(AgentNotFoundError):
            await agent_service.delete_agent("nonexistent")

    async def test_delete_agent_validates_name_format(
        self, agent_service, mock_agent_repo
    ):
        """Test delete_agent rejects names with invalid characters."""
        # Arrange - invalid characters
        invalid_name = "test_agent!"

        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent(invalid_name)

        assert "alphanumeric characters and hyphens" in str(exc_info.value)
        mock_agent_repo.delete.assert_not_called()

    async def test_delete_agent_validates_empty_name(
        self, agent_service, mock_agent_repo
    ):
        """Test delete_agent rejects empty names."""
        # Act & Assert - empty string
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent("")

        assert "cannot be empty" in str(exc_info.value)
        mock_agent_repo.delete.assert_not_called()

        # Act & Assert - whitespace only
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent("   ")

        assert "cannot be empty" in str(exc_info.value)

    async def test_delete_agent_validates_max_length(
        self, agent_service, mock_agent_repo
    ):
        """Test delete_agent rejects names longer than 32 characters."""
        # Arrange - 33 character name
        long_name = "a" * 33

        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent(long_name)

        assert "32 characters or less" in str(exc_info.value)
        assert "33" in str(exc_info.value)
        mock_agent_repo.delete.assert_not_called()

    async def test_delete_agent_validates_starts_with_hyphen(
        self, agent_service, mock_agent_repo
    ):
        """Test delete_agent rejects names starting with hyphen."""
        # Arrange
        invalid_name = "-test-agent"

        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent(invalid_name)

        assert "must start with a letter or number" in str(exc_info.value)
        mock_agent_repo.delete.assert_not_called()

    async def test_delete_agent_validates_reserved_names(
        self, agent_service, mock_agent_repo
    ):
        """Test delete_agent rejects reserved names."""
        # Test "new" (lowercase)
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent("new")
        assert "reserved" in str(exc_info.value)

        # Test "NEW" (uppercase - case insensitive)
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent("NEW")
        assert "reserved" in str(exc_info.value)

        # Test "create" (lowercase)
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent("create")
        assert "reserved" in str(exc_info.value)

        # Test "Create" (mixed case)
        with pytest.raises(ValidationError) as exc_info:
            await agent_service.delete_agent("Create")
        assert "reserved" in str(exc_info.value)

        mock_agent_repo.delete.assert_not_called()


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

    async def test_restart_agent_not_found(self, agent_service, mock_agent_repo):
        """Test restarting non-existent agent raises error."""
        # Arrange
        mock_agent_repo.restart.side_effect = AgentNotFoundError("nonexistent")

        # Act & Assert
        with pytest.raises(AgentNotFoundError):
            await agent_service.restart_agent("nonexistent")


@pytest.mark.asyncio
class TestAgentServiceCaseInsensitive:
    """Test case-insensitive name handling - T233."""

    async def test_get_agent_case_insensitive(
        self, agent_service, mock_agent_repo, sample_agent
    ):
        """Test getting agent with different case returns same agent."""
        # Arrange - mock repository to return agent for any case variant
        mock_agent_repo.get_by_name.return_value = sample_agent

        # Act - try different case variants
        result_lower = await agent_service.get_agent("test-agent")
        result_upper = await agent_service.get_agent("TEST-AGENT")
        result_mixed = await agent_service.get_agent("Test-Agent")

        # Assert - all variants return the same agent
        assert result_lower.name == sample_agent.name
        assert result_upper.name == sample_agent.name
        assert result_mixed.name == sample_agent.name

        # Verify repository was called with lowercase normalized names
        assert mock_agent_repo.get_by_name.call_count == 3
        calls = [call.args[0] for call in mock_agent_repo.get_by_name.call_args_list]
        assert all(name == name.lower() for name in calls)

    async def test_create_agent_case_insensitive_duplicate_check(
        self,
        agent_service,
        mock_agent_repo,
        mock_project_repo,
        sample_agent,
        sample_project,
    ):
        """Test creating agent with different case of existing name is rejected."""
        # Arrange
        existing_agent = Agent(
            name="myagent",  # lowercase
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="coder",
            project="Setup",
            last_task=None,
            created_at=datetime(2025, 11, 7, 10, 0, 0),
            updated_at=datetime(2025, 11, 7, 10, 0, 0),
        )
        mock_agent_repo.list_all.return_value = [existing_agent]
        mock_project_repo.list_all.return_value = [sample_project]
        mock_project_repo.get_by_name.return_value = sample_project
        mock_project_repo.list_roles.return_value = [
            Role(
                id="role-1",
                name="coder",
                project_id="proj-123",
                project_name="Setup",
                default=True,
            )
        ]

        # Act & Assert - Try to create with different case
        with pytest.raises(AgentConflictError, match="already exists"):
            await agent_service.create_agent(
                name="MyAgent",  # Different case
                project="Setup",
                role="coder",
                task="Test task",
            )
