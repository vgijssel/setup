"""Tests for AgentRepository (Layer 3 - Repository Layer)."""

import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime

from fleet_mcp_clean.repositories import AgentRepository
from fleet_mcp_clean.models import Agent, AgentStatus
from fleet_mcp_clean.models.errors import CoderAPIError
from fleet_mcp_clean.clients import NotFoundError


@pytest.fixture
def mock_coder_client():
    """Mock CoderClient for testing."""
    return AsyncMock()


@pytest.fixture
def agent_repo(mock_coder_client):
    """AgentRepository instance with mocked client."""
    return AgentRepository(mock_coder_client)


@pytest.mark.asyncio
class TestAgentRepositoryListAll:
    """Test listing all agents."""

    async def test_list_all_success(self, agent_repo, mock_coder_client):
        """Test successfully listing all agents."""
        # Mock workspace data
        mock_workspaces = [
            {
                "id": "ws-1",
                "name": "agent-1",
                "template_name": "coder-devcontainer",
                "template_display_name": "Setup",
                "template_id": "tpl-1",
                "created_at": "2025-11-07T10:00:00Z",
                "updated_at": "2025-11-07T10:30:00Z",
                "latest_build": {"status": "running"},
            },
            {
                "id": "ws-2",
                "name": "agent-2",
                "template_name": "coder-devcontainer-dataone",
                "template_display_name": "DataOne",
                "template_id": "tpl-2",
                "created_at": "2025-11-07T11:00:00Z",
                "updated_at": "2025-11-07T11:30:00Z",
                "latest_build": {"status": "stopped"},
            },
        ]
        mock_coder_client.list_workspaces.return_value = mock_workspaces

        # Execute
        agents = await agent_repo.list_all()

        # Verify
        assert len(agents) == 2
        assert all(isinstance(agent, Agent) for agent in agents)
        assert agents[0].name == "agent-1"
        assert agents[0].status == AgentStatus.IDLE
        assert agents[1].name == "agent-2"
        assert agents[1].status == AgentStatus.OFFLINE
        mock_coder_client.list_workspaces.assert_called_once_with(owner="me")

    async def test_list_all_empty(self, agent_repo, mock_coder_client):
        """Test listing agents when none exist."""
        mock_coder_client.list_workspaces.return_value = []

        agents = await agent_repo.list_all()

        assert agents == []

    async def test_list_all_error(self, agent_repo, mock_coder_client):
        """Test error handling when listing fails."""
        mock_coder_client.list_workspaces.side_effect = Exception("API error")

        with pytest.raises(CoderAPIError, match="Failed to list agents"):
            await agent_repo.list_all()


@pytest.mark.asyncio
class TestAgentRepositoryGetByName:
    """Test getting agent by name."""

    async def test_get_by_name_success(self, agent_repo, mock_coder_client):
        """Test successfully getting an agent by name."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running"},
        }
        # Mock list_workspaces to return the workspace
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        # Mock get_workspace to return full details
        mock_coder_client.get_workspace.return_value = mock_workspace

        agent = await agent_repo.get_by_name("test-agent")

        assert isinstance(agent, Agent)
        assert agent.name == "test-agent"
        assert agent.workspace_id == "ws-1"

    async def test_get_by_name_not_found(self, agent_repo, mock_coder_client):
        """Test getting non-existent agent."""
        # Mock list_workspaces to return empty list
        mock_coder_client.list_workspaces.return_value = []

        with pytest.raises(Exception):  # AgentNotFoundError
            await agent_repo.get_by_name("nonexistent")


@pytest.mark.asyncio
class TestAgentRepositoryCreate:
    """Test creating agents."""

    async def test_create_success(self, agent_repo, mock_coder_client):
        """Test successfully creating an agent."""
        mock_workspace = {
            "id": "ws-new",
            "name": "new-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T12:00:00Z",
            "updated_at": "2025-11-07T12:00:00Z",
            "latest_build": {"status": "starting"},
        }
        mock_coder_client.create_workspace.return_value = mock_workspace

        agent = await agent_repo.create(
            name="new-agent",
            template_id="tpl-1",
            preset_id="preset-1",
            task="Test task",  # Note: parameter is 'task' not 'task_description'
        )

        assert isinstance(agent, Agent)
        assert agent.name == "new-agent"
        assert agent.status == AgentStatus.STARTING
        mock_coder_client.create_workspace.assert_called_once()


@pytest.mark.asyncio
class TestAgentRepositoryDelete:
    """Test deleting agents."""

    async def test_delete_success(self, agent_repo, mock_coder_client):
        """Test successfully deleting an agent."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running"},
        }
        # Mock list_workspaces for get_by_name call
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        mock_coder_client.get_workspace.return_value = mock_workspace
        mock_coder_client.delete_workspace.return_value = {"status": "deleted"}

        await agent_repo.delete("test-agent")

        mock_coder_client.delete_workspace.assert_called_once_with("ws-1")

    async def test_delete_not_found(self, agent_repo, mock_coder_client):
        """Test deleting non-existent agent."""
        # Mock list_workspaces to return empty list
        mock_coder_client.list_workspaces.return_value = []

        with pytest.raises(Exception):  # AgentNotFoundError
            await agent_repo.delete("nonexistent")


@pytest.mark.asyncio
class TestAgentRepositoryTemplateDisplayNameMapping:
    """Test that agent.project maps to template.display_name, not template.name."""

    async def test_workspace_to_agent_uses_template_display_name(
        self, agent_repo, mock_coder_client
    ):
        """Test that _workspace_to_agent maps template_display_name to agent.project.

        This is critical because:
        - template.name is the technical identifier (e.g., "coder-devcontainer")
        - template.display_name is the user-facing name (e.g., "Setup")
        - Per data-model.md:134-140, agent.project should show "Setup" not "coder-devcontainer"
        """
        # Mock workspace data with BOTH template_name and template_display_name
        # (as returned by real Coder API - see cassettes/get_workspace_success.yaml:19)
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",  # Technical name
            "template_display_name": "Setup",  # User-facing display name
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        mock_coder_client.get_workspace.return_value = mock_workspace

        # Execute
        agent = await agent_repo.get_by_name("test-agent")

        # Verify agent.project uses display_name ("Setup"), not template_name ("coder-devcontainer")
        assert agent.project == "Setup", (
            f"Expected agent.project to be 'Setup' (template_display_name), "
            f"but got '{agent.project}' (template_name)"
        )
