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
            "owner_name": "alice",
        },
        {
            "id": "ws-456",
            "name": "busy-agent",
            "status": "running",
            "owner_name": "bob",
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
        mock_coder_client.send_task_input.return_value = None

        # Act
        await task_repository.assign_task("idle-agent", "Process data")

        # Assert
        mock_coder_client.list_workspaces.assert_called_once()
        mock_coder_client.send_task_input.assert_called_once_with(
            "alice", "ws-123", "Process data"
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

        mock_coder_client.send_task_input.assert_not_called()

    async def test_assign_task_sends_to_correct_workspace(
        self, task_repository, mock_coder_client, sample_workspaces
    ):
        """Test assign_task sends task to correct workspace ID (T142)."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = sample_workspaces
        mock_coder_client.send_task_input.return_value = None

        # Act
        await task_repository.assign_task("busy-agent", "New task")

        # Assert
        mock_coder_client.send_task_input.assert_called_once_with(
            "bob", "ws-456", "New task"
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


# ============================================================================
# User Story 4: Task History and Logs Tests (T178-T182)
# ============================================================================

class TestTaskRepositoryGetTaskHistory:
    """Test suite for TaskRepository.get_task_history() - T178"""

    @pytest.mark.asyncio
    async def test_get_task_history_extracts_from_workspace(
        self, task_repository, mock_coder_client
    ):
        """Test task history extraction from workspace JSON.
        
        Task history is in workspace.latest_build.resources[].agents[].apps[]
        where app.slug == "ccw". The app.statuses[] contains task history.
        """
        # Arrange
        workspace_data = {
            "latest_build": {
                "resources": [{
                    "agents": [{
                        "apps": [
                            {"slug": "other", "statuses": []},
                            {
                                "slug": "ccw",
                                "statuses": [
                                    {
                                        "message": "Task 1",
                                        "uri": "file://test.py",
                                        "needs_user_attention": False,
                                        "created_at": "2025-11-08T10:00:00Z"
                                    },
                                    {
                                        "message": "Task 2", 
                                        "uri": "",
                                        "needs_user_attention": True,
                                        "created_at": "2025-11-08T11:00:00Z"
                                    }
                                ]
                            }
                        ]
                    }]
                }]
            }
        }
        mock_coder_client.list_workspaces.return_value = [{"id": "ws-1", "name": "test-agent"}]
        mock_coder_client.get_workspace.return_value = workspace_data

        # Act
        tasks = await task_repository.get_task_history("test-agent")

        # Assert
        assert len(tasks) == 2
        assert tasks[0]["message"] == "Task 1"
        assert tasks[1]["message"] == "Task 2"
        assert tasks[1]["needs_user_attention"] is True


class TestTaskRepositoryGetConversationLogs:
    """Test suite for TaskRepository.get_conversation_logs() - T179"""

    @pytest.mark.asyncio
    async def test_get_conversation_logs_calls_client(
        self, task_repository, mock_coder_client
    ):
        """Test conversation logs retrieval from experimental API."""
        # Arrange
        mock_coder_client.list_workspaces.return_value = [
            {"id": "ws-1", "name": "test-agent", "owner_name": "user1"}
        ]
        mock_coder_client.get_task_logs.return_value = [
            {"id": 0, "content": "log1", "type": "output", "time": "2025-11-08T10:00:00Z"}
        ]

        # Act
        logs = await task_repository.get_conversation_logs("test-agent")

        # Assert
        assert len(logs) == 1
        assert logs[0]["content"] == "log1"
        mock_coder_client.get_task_logs.assert_called_once_with("user1", "ws-1")
