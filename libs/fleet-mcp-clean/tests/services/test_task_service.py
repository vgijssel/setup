"""Tests for TaskService (Layer 2 - Business Logic)."""

from datetime import datetime
from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.clients.exceptions import NotFoundError
from fleet_mcp_clean.models import Agent, AgentStatus
from fleet_mcp_clean.services.task_service import TaskService


@pytest.fixture
def mock_task_repository():
    """Mock TaskRepository for testing."""
    return AsyncMock()


@pytest.fixture
def mock_agent_repository():
    """Mock AgentRepository for testing."""
    return AsyncMock()


@pytest.fixture
def task_service(mock_task_repository, mock_agent_repository):
    """Create TaskService instance with mocked dependencies."""
    return TaskService(mock_task_repository, mock_agent_repository)


@pytest.fixture
def idle_agent():
    """Sample idle agent."""
    return Agent(
        name="idle-agent",
        workspace_id="ws-123",
        status=AgentStatus.IDLE,
        role="coder",
        project="Setup",
        last_task=None,
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 10, 0, 0),
    )


@pytest.fixture
def busy_agent():
    """Sample busy agent."""
    return Agent(
        name="busy-agent",
        workspace_id="ws-456",
        status=AgentStatus.BUSY,
        role="coder",
        project="Setup",
        last_task="Current task",
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 11, 0, 0),
    )


@pytest.fixture
def offline_agent():
    """Sample offline agent (stopped workspace)."""
    return Agent(
        name="offline-agent",
        workspace_id="ws-789",
        status=AgentStatus.STOPPED,
        role="coder",
        project="Setup",
        last_task=None,
        created_at=datetime(2025, 11, 7, 10, 0, 0),
        updated_at=datetime(2025, 11, 7, 10, 0, 0),
    )


@pytest.mark.asyncio
class TestTaskServiceAssignTask:
    """Test TaskService.assign_task method."""

    async def test_assign_task_success_for_idle_agent(
        self, task_service, mock_task_repository, mock_agent_repository, idle_agent
    ):
        """Test successful task assignment to idle agent (T144)."""
        # Arrange
        mock_agent_repository.get_by_name.return_value = idle_agent
        mock_task_repository.assign_task.return_value = None

        # Act
        await task_service.assign_task("idle-agent", "Process data")

        # Assert
        mock_agent_repository.get_by_name.assert_called_once_with("idle-agent")
        mock_task_repository.assign_task.assert_called_once_with(
            "idle-agent", "Process data"
        )

    async def test_assign_task_validates_description_not_empty(
        self, task_service, mock_agent_repository
    ):
        """Test assign_task rejects empty task description (T145)."""
        # Act & Assert
        with pytest.raises(ValueError, match="Task description cannot be empty"):
            await task_service.assign_task("idle-agent", "")

        # Repository should not be called
        mock_agent_repository.get_by_name.assert_not_called()

    async def test_assign_task_validates_description_not_whitespace(
        self, task_service, mock_agent_repository
    ):
        """Test assign_task rejects whitespace-only description (T145)."""
        # Act & Assert
        with pytest.raises(ValueError, match="Task description cannot be empty"):
            await task_service.assign_task("idle-agent", "   ")

        mock_agent_repository.get_by_name.assert_not_called()

    async def test_assign_task_rejects_busy_agent(
        self, task_service, mock_agent_repository, busy_agent
    ):
        """Test assign_task rejects busy agents (T146)."""
        # Arrange
        mock_agent_repository.get_by_name.return_value = busy_agent

        # Act & Assert
        with pytest.raises(ValueError, match="non-idle agent"):
            await task_service.assign_task("busy-agent", "New task")

        mock_agent_repository.get_by_name.assert_called_once_with("busy-agent")

    async def test_assign_task_rejects_offline_agent(
        self, task_service, mock_agent_repository, offline_agent
    ):
        """Test assign_task rejects offline agents (T147)."""
        # Arrange
        mock_agent_repository.get_by_name.return_value = offline_agent

        # Act & Assert
        with pytest.raises(ValueError, match="offline agent"):
            await task_service.assign_task("offline-agent", "Task")

        mock_agent_repository.get_by_name.assert_called_once_with("offline-agent")

    async def test_assign_task_rejects_failed_agent(
        self, task_service, mock_agent_repository
    ):
        """Test assign_task rejects failed agents (T147)."""
        # Arrange
        failed_agent = Agent(
            name="failed-agent",
            workspace_id="ws-999",
            status=AgentStatus.FAILED,
            role="coder",
            project="Setup",
            last_task=None,
            created_at=datetime(2025, 11, 7, 10, 0, 0),
            updated_at=datetime(2025, 11, 7, 10, 0, 0),
        )
        mock_agent_repository.get_by_name.return_value = failed_agent

        # Act & Assert
        with pytest.raises(ValueError, match="offline agent"):
            await task_service.assign_task("failed-agent", "Task")

    async def test_assign_task_propagates_agent_not_found_error(
        self, task_service, mock_agent_repository
    ):
        """Test assign_task propagates NotFoundError when agent doesn't exist (T148)."""
        # Arrange
        mock_agent_repository.get_by_name.side_effect = NotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="not found"):
            await task_service.assign_task("nonexistent", "Task")


@pytest.mark.asyncio
class TestTaskServiceCancelTask:
    """Test TaskService.cancel_task method."""

    async def test_cancel_task_success_for_busy_agent(
        self, task_service, mock_task_repository, mock_agent_repository, busy_agent
    ):
        """Test successful task cancellation on busy agent (T149)."""
        # Arrange
        mock_agent_repository.get_by_name.return_value = busy_agent
        mock_task_repository.cancel_task.return_value = None

        # Act
        await task_service.cancel_task("busy-agent")

        # Assert
        mock_agent_repository.get_by_name.assert_called_once_with("busy-agent")
        mock_task_repository.cancel_task.assert_called_once_with("busy-agent")

    async def test_cancel_task_rejects_idle_agent(
        self, task_service, mock_agent_repository, idle_agent
    ):
        """Test cancel_task rejects idle agents (T149)."""
        # Arrange
        mock_agent_repository.get_by_name.return_value = idle_agent

        # Act & Assert
        with pytest.raises(ValueError, match="non-busy agent"):
            await task_service.cancel_task("idle-agent")

        mock_agent_repository.get_by_name.assert_called_once_with("idle-agent")

    async def test_cancel_task_rejects_starting_agent(
        self, task_service, mock_agent_repository
    ):
        """Test cancel_task rejects starting agents (T149)."""
        # Arrange
        starting_agent = Agent(
            name="starting-agent",
            workspace_id="ws-111",
            status=AgentStatus.STARTING,
            role="coder",
            project="Setup",
            last_task=None,
            created_at=datetime(2025, 11, 7, 10, 0, 0),
            updated_at=datetime(2025, 11, 7, 10, 0, 0),
        )
        mock_agent_repository.get_by_name.return_value = starting_agent

        # Act & Assert
        with pytest.raises(ValueError, match="non-busy agent"):
            await task_service.cancel_task("starting-agent")

    async def test_cancel_task_propagates_agent_not_found_error(
        self, task_service, mock_agent_repository
    ):
        """Test cancel_task propagates NotFoundError when agent doesn't exist (T149)."""
        # Arrange
        mock_agent_repository.get_by_name.side_effect = NotFoundError(
            "Agent 'nonexistent' not found"
        )

        # Act & Assert
        with pytest.raises(NotFoundError, match="not found"):
            await task_service.cancel_task("nonexistent")
