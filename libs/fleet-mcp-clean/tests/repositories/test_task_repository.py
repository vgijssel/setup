"""Tests for TaskRepository (Layer 3 - Data Access)."""

import pytest
from unittest.mock import AsyncMock

from fleet_mcp_clean.repositories.task_repository import TaskRepository
from fleet_mcp_clean.clients.exceptions import NotFoundError


@pytest.fixture
def mock_coder_client():
    """Mock CoderClient for testing."""
    return AsyncMock()


@pytest.fixture
def task_repository(mock_coder_client):
    """Create TaskRepository instance with mocked CoderClient."""
    return TaskRepository(mock_coder_client)


@pytest.fixture
def sample_workspaces():
    """Sample workspace list."""
    return [
        {
            "id": "ws-123",
            "name": "idle-agent",
            "status": "running",
        },
        {
            "id": "ws-456",
            "name": "busy-agent",
            "status": "running",
        }
    ]


@pytest.fixture
def sample_applications():
    """Sample workspace applications with AgentAPI."""
    return [
        {
            "slug": "code-server",
            "health": "https://coder.example.com/code",
        },
        {
            "slug": "agentapi",
            "health": "https://coder.example.com/agentapi/message",
        }
    ]


@pytest.mark.asyncio
class TestTaskRepositoryAssignTask:
    """Test TaskRepository.assign_task method."""

    async def test_assign_task_success(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test successful task assignment (T141)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        mock_coder_client.send_task_to_workspace.return_value = {"status": "sent"}

        # Act
        await task_repository.assign_task("idle-agent", "Process data")

        # Assert
        mock_coder_client.list_workspaces.assert_called_once()
        mock_coder_client.send_task_to_workspace.assert_called_once_with(
            "ws-123", "Process data"
        )

    async def test_assign_task_raises_not_found_for_nonexistent_agent(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test assign_task raises NotFoundError for non-existent agent (T141)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces

        # Act & Assert
        with pytest.raises(NotFoundError, match="Agent 'nonexistent' not found"):
            await task_repository.assign_task("nonexistent", "Task")

        mock_coder_client.send_task_to_workspace.assert_not_called()

    async def test_assign_task_sends_to_correct_workspace(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test assign_task sends task to correct workspace ID (T142)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        mock_coder_client.send_task_to_workspace.return_value = {"status": "sent"}

        # Act
        await task_repository.assign_task("busy-agent", "New task")

        # Assert
        mock_coder_client.send_task_to_workspace.assert_called_once_with(
            "ws-456", "New task"
        )


@pytest.mark.asyncio
class TestTaskRepositoryCancelTask:
    """Test TaskRepository.cancel_task method."""

    async def test_cancel_task_success(
        self, task_repository, mock_coder_client, sample_workspaces, sample_applications
    ):
        """Test successful task cancellation (T143)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        mock_coder_client.get_workspace_applications.return_value = sample_applications
        mock_coder_client.send_interrupt_signal.return_value = {"status": "interrupted"}

        # Act
        await task_repository.cancel_task("busy-agent")

        # Assert
        mock_coder_client.list_workspaces.assert_called_once()
        mock_coder_client.get_workspace_applications.assert_called_once_with("ws-456")
        mock_coder_client.send_interrupt_signal.assert_called_once_with(
            "https://coder.example.com/agentapi/message"
        )

    async def test_cancel_task_raises_not_found_for_nonexistent_agent(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test cancel_task raises NotFoundError for non-existent agent (T143)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces

        # Act & Assert
        with pytest.raises(NotFoundError, match="Agent 'nonexistent' not found"):
            await task_repository.cancel_task("nonexistent")

        mock_coder_client.get_workspace_applications.assert_not_called()
        mock_coder_client.send_interrupt_signal.assert_not_called()

    async def test_cancel_task_raises_not_found_when_agentapi_missing(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test cancel_task raises NotFoundError when AgentAPI not found (T143)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        mock_coder_client.get_workspace_applications.return_value = [
            {"slug": "code-server", "health": "https://coder.example.com/code"}
        ]

        # Act & Assert
        with pytest.raises(NotFoundError, match="AgentAPI not available"):
            await task_repository.cancel_task("busy-agent")

        mock_coder_client.send_interrupt_signal.assert_not_called()

    async def test_cancel_task_raises_not_found_when_agentapi_unhealthy(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test cancel_task raises NotFoundError when AgentAPI health missing (T143)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        mock_coder_client.get_workspace_applications.return_value = [
            {"slug": "agentapi"}  # No 'health' field
        ]

        # Act & Assert
        with pytest.raises(NotFoundError, match="AgentAPI not available"):
            await task_repository.cancel_task("busy-agent")

        mock_coder_client.send_interrupt_signal.assert_not_called()

    async def test_cancel_task_finds_agentapi_among_multiple_apps(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test cancel_task correctly identifies AgentAPI among multiple applications (T142)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        multiple_apps = [
            {"slug": "web-terminal", "health": "https://coder.example.com/terminal"},
            {"slug": "code-server", "health": "https://coder.example.com/code"},
            {"slug": "agentapi", "health": "https://coder.example.com/agentapi/message"},
            {"slug": "jupyter", "health": "https://coder.example.com/jupyter"},
        ]
        mock_coder_client.get_workspace_applications.return_value = multiple_apps
        mock_coder_client.send_interrupt_signal.return_value = {"status": "interrupted"}

        # Act
        await task_repository.cancel_task("busy-agent")

        # Assert
        mock_coder_client.send_interrupt_signal.assert_called_once_with(
            "https://coder.example.com/agentapi/message"
        )
