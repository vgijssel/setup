"""Tests for AgentRepository (Layer 3 - Repository Layer)."""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.models import Agent, AgentStatus
from fleet_mcp_clean.models.errors import AgentNotFoundError, CoderAPIError
from fleet_mcp_clean.repositories import AgentRepository


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
                "latest_build": {
                    "status": "running",
                    "has_ai_task": False,
                    "resources": [
                        {
                            "agents": [
                                {
                                    "status": "connected",
                                    "lifecycle_state": "ready",
                                }
                            ]
                        }
                    ],
                },
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
        assert agents[1].status == AgentStatus.STOPPED
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

    async def test_list_all_with_none_workspace(self, agent_repo, mock_coder_client):
        """Test listing agents when list contains None workspaces.

        This can happen when the Coder API returns a workspace list where
        some workspaces are None (e.g., during certain race conditions or
        after agent creation).
        """
        # Mock workspace data with None in the list
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
            None,  # This simulates the bug
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

        # Execute - this should not raise an error
        agents = await agent_repo.list_all()

        # Verify - should skip None workspace and return only valid ones
        assert len(agents) == 2
        assert all(isinstance(agent, Agent) for agent in agents)
        assert agents[0].name == "agent-1"
        assert agents[1].name == "agent-2"
        mock_coder_client.list_workspaces.assert_called_once_with(owner="me")

    async def test_list_all_with_none_latest_build(self, agent_repo, mock_coder_client):
        """Test listing agents when workspace has None latest_build.

        This can happen when the Coder API returns a workspace where
        latest_build is None instead of missing (e.g., during workspace creation).
        The bug manifests as: 'NoneType' object has no attribute 'get'
        """
        # Mock workspace data with latest_build = None
        mock_workspaces = [
            {
                "id": "ws-1",
                "name": "agent-1",
                "template_name": "coder-devcontainer",
                "template_display_name": "Setup",
                "template_id": "tpl-1",
                "created_at": "2025-11-07T10:00:00Z",
                "updated_at": "2025-11-07T10:30:00Z",
                "latest_build": None,  # This simulates the bug
            },
        ]
        mock_coder_client.list_workspaces.return_value = mock_workspaces

        # Execute - this should not raise an AttributeError
        agents = await agent_repo.list_all()

        # Verify - should handle None latest_build gracefully
        assert len(agents) == 1
        assert agents[0].name == "agent-1"
        assert (
            agents[0].status == AgentStatus.FAILED
        )  # Should default to FAILED when status unknown
        mock_coder_client.list_workspaces.assert_called_once_with(owner="me")


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

        with pytest.raises(AgentNotFoundError):
            await agent_repo.get_by_name("nonexistent")

    async def test_get_by_name_with_none_workspace(self, agent_repo, mock_coder_client):
        """Test getting agent by name when list contains None workspaces.

        This can happen when the Coder API returns a workspace list where
        some workspaces are None (e.g., during race conditions after agent creation).
        The bug manifests as: 'NoneType' object has no attribute 'get'
        """
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
        # Mock list_workspaces to return list with None workspace
        mock_coder_client.list_workspaces.return_value = [None, mock_workspace]
        # Mock get_workspace to return full details
        mock_coder_client.get_workspace.return_value = mock_workspace

        # Execute - this should not raise an AttributeError
        agent = await agent_repo.get_by_name("test-agent")

        # Verify - should skip None workspace and find the valid one
        assert isinstance(agent, Agent)
        assert agent.name == "test-agent"
        assert agent.workspace_id == "ws-1"

    async def test_get_by_name_case_insensitive_uppercase(
        self, agent_repo, mock_coder_client
    ):
        """Test getting agent by name with case insensitive lookup - uppercase.

        When an agent is created with name "WorkspaceStates", it should be
        retrievable with "WORKSPACESTATES" (all uppercase).
        This is because the Coder API backend is case insensitive.
        """
        mock_workspace = {
            "id": "ws-1",
            "name": "WorkspaceStates",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        mock_coder_client.get_workspace.return_value = mock_workspace

        # Try to get agent with uppercase name
        agent = await agent_repo.get_by_name("WORKSPACESTATES")

        # Verify we found the agent
        assert isinstance(agent, Agent)
        assert agent.name == "WorkspaceStates"
        assert agent.workspace_id == "ws-1"

    async def test_get_by_name_case_insensitive_lowercase(
        self, agent_repo, mock_coder_client
    ):
        """Test getting agent by name with case insensitive lookup - lowercase.

        When an agent is created with name "WorkspaceStates", it should be
        retrievable with "workspacestates" (all lowercase).
        This is because the Coder API backend is case insensitive.
        """
        mock_workspace = {
            "id": "ws-1",
            "name": "WorkspaceStates",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        mock_coder_client.get_workspace.return_value = mock_workspace

        # Try to get agent with lowercase name
        agent = await agent_repo.get_by_name("workspacestates")

        # Verify we found the agent
        assert isinstance(agent, Agent)
        assert agent.name == "WorkspaceStates"
        assert agent.workspace_id == "ws-1"

    async def test_get_by_name_case_insensitive_mixed(
        self, agent_repo, mock_coder_client
    ):
        """Test getting agent by name with case insensitive lookup - mixed case.

        When an agent is created with name "WorkspaceStates", it should be
        retrievable with "workspaceSTATES" (mixed case).
        This is because the Coder API backend is case insensitive.
        """
        mock_workspace = {
            "id": "ws-1",
            "name": "WorkspaceStates",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        mock_coder_client.get_workspace.return_value = mock_workspace

        # Try to get agent with mixed case name
        agent = await agent_repo.get_by_name("workspaceSTATES")

        # Verify we found the agent
        assert isinstance(agent, Agent)
        assert agent.name == "WorkspaceStates"
        assert agent.workspace_id == "ws-1"


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

        # Verify the rich_parameter_values use "AI Prompt" as per Coder AI docs
        # See: https://coder.com/docs/ai-coder/tasks#option-2-create-or-duplicate-your-own-template
        call_args = mock_coder_client.create_workspace.call_args
        rich_params = call_args.kwargs["rich_parameter_values"]
        assert (
            len(rich_params) == 1
        ), f"Expected exactly 1 rich parameter, got {len(rich_params)}"
        assert rich_params[0]["name"] == "AI Prompt", (
            f"Expected rich parameter name to be 'AI Prompt' (per Coder AI docs), "
            f"but got: {rich_params[0]['name']}"
        )
        assert rich_params[0]["value"] == "Test task", (
            f"Expected rich parameter value to be 'Test task', "
            f"but got: {rich_params[0]['value']}"
        )


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

        with pytest.raises(AgentNotFoundError):
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


@pytest.mark.asyncio
class TestAgentRepositoryLastTaskPopulation:
    """Test that agent.last_task is populated from task history."""

    async def test_list_all_populates_last_task_when_history_exists(
        self, agent_repo, mock_coder_client
    ):
        """Test that list_all() populates last_task from task history.

        Bug: last_task is always NULL even when task history exists.
        Expected: last_task should show the most recent task description.
        """
        # Mock workspace data with a running agent
        mock_workspace = {
            "id": "ws-1",
            "name": "brappa",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {
                "status": "running",
                "resources": [
                    {
                        "agents": [
                            {
                                "apps": [
                                    {
                                        "slug": "ccw",
                                        "display_name": "Claude Code",
                                        "statuses": [
                                            {
                                                "created_at": "2025-11-07T10:15:00Z",
                                                "message": "First task completed",
                                                "state": "complete",
                                            },
                                            {
                                                "created_at": "2025-11-07T10:25:00Z",
                                                "message": "Second task in progress",
                                                "state": "working",
                                            },
                                        ],
                                    }
                                ]
                            }
                        ]
                    }
                ],
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        # Execute
        agents = await agent_repo.list_all()

        # Verify last_task is populated with most recent task
        assert len(agents) == 1
        assert agents[0].last_task == "Second task in progress", (
            f"Expected last_task to be 'Second task in progress', "
            f"but got '{agents[0].last_task}'"
        )

    async def test_list_all_last_task_is_none_when_no_history(
        self, agent_repo, mock_coder_client
    ):
        """Test that list_all() sets last_task to None when no history exists."""
        # Mock workspace data without task history
        mock_workspace = {
            "id": "ws-1",
            "name": "brappa",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {"status": "running", "resources": []},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        # Execute
        agents = await agent_repo.list_all()

        # Verify last_task is None
        assert len(agents) == 1
        assert agents[0].last_task is None

    async def test_get_by_name_populates_last_task_when_history_exists(
        self, agent_repo, mock_coder_client
    ):
        """Test that get_by_name() populates last_task from task history.

        Bug: last_task is always NULL even when task history exists.
        Expected: last_task should show the most recent task description.
        """
        # Mock workspace data with task history
        mock_workspace = {
            "id": "ws-1",
            "name": "brappa",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:30:00Z",
            "latest_build": {
                "status": "running",
                "resources": [
                    {
                        "agents": [
                            {
                                "apps": [
                                    {
                                        "slug": "ccw",
                                        "display_name": "Claude Code",
                                        "statuses": [
                                            {
                                                "created_at": "2025-11-07T10:15:00Z",
                                                "message": "Old task",
                                                "state": "complete",
                                            },
                                            {
                                                "created_at": "2025-11-07T10:25:00Z",
                                                "message": "Latest task",
                                                "state": "working",
                                            },
                                        ],
                                    }
                                ]
                            }
                        ]
                    }
                ],
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]
        mock_coder_client.get_workspace.return_value = mock_workspace

        # Execute
        agent = await agent_repo.get_by_name("brappa")

        # Verify last_task is populated
        assert agent.last_task == "Latest task", (
            f"Expected last_task to be 'Latest task', " f"but got '{agent.last_task}'"
        )


@pytest.mark.asyncio
class TestAgentRepositoryStatusMapping:
    """Test Coder workspace status to Agent status mapping.

    Tests verify that all Coder workspace states are mapped 1:1 to Agent status,
    except 'running' which is split into 'idle' (no active task) and 'busy' (task running).
    An agent can only transition from 'starting' to 'idle'/'busy' when all apps are healthy.
    """

    async def test_status_mapping_pending(self, agent_repo, mock_coder_client):
        """Test workspace build status 'pending' maps to PENDING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "pending"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.PENDING

    async def test_status_mapping_starting(self, agent_repo, mock_coder_client):
        """Test workspace build status 'starting' maps to STARTING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "starting"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.STARTING

    async def test_status_mapping_running_idle(self, agent_repo, mock_coder_client):
        """Test workspace build status 'running' with healthy agents and no active task maps to IDLE."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": False,
                "resources": [
                    {
                        "agents": [
                            {
                                "status": "connected",
                                "lifecycle_state": "ready",
                            }
                        ]
                    }
                ],
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.IDLE

    async def test_status_mapping_running_busy(self, agent_repo, mock_coder_client):
        """Test workspace build status 'running' with healthy agents and active task maps to BUSY."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": True,
                "resources": [
                    {
                        "agents": [
                            {
                                "status": "connected",
                                "lifecycle_state": "ready",
                            }
                        ]
                    }
                ],
            },
            "latest_app_status": {"state": "working"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.BUSY

    async def test_status_mapping_stopping(self, agent_repo, mock_coder_client):
        """Test workspace build status 'stopping' maps to STOPPING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "stopping"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.STOPPING

    async def test_status_mapping_stopped(self, agent_repo, mock_coder_client):
        """Test workspace build status 'stopped' maps to STOPPED."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "stopped"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.STOPPED

    async def test_status_mapping_failed(self, agent_repo, mock_coder_client):
        """Test workspace build status 'failed' maps to FAILED."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "failed"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.FAILED

    async def test_status_mapping_canceling(self, agent_repo, mock_coder_client):
        """Test workspace build status 'canceling' maps to CANCELING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "canceling"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.CANCELING

    async def test_status_mapping_canceled(self, agent_repo, mock_coder_client):
        """Test workspace build status 'canceled' maps to CANCELED."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "canceled"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.CANCELED

    async def test_status_mapping_deleting(self, agent_repo, mock_coder_client):
        """Test workspace build status 'deleting' maps to DELETING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "deleting"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.DELETING

    async def test_status_mapping_deleted(self, agent_repo, mock_coder_client):
        """Test workspace build status 'deleted' maps to DELETED."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "deleted"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.DELETED

    async def test_status_mapping_unknown_defaults_to_failed(
        self, agent_repo, mock_coder_client
    ):
        """Test unknown workspace build status defaults to FAILED."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {"status": "unknown-status"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.FAILED


@pytest.mark.asyncio
class TestAgentRepositoryHealthChecking:
    """Test workspace agent health checking logic.

    Tests verify that workspace status 'running' is properly split into
    STARTING/IDLE/BUSY based on workspace agent health and task state.
    """

    async def test_running_workspace_with_unhealthy_agents_starting(
        self, agent_repo, mock_coder_client
    ):
        """Test workspace status 'running' with unhealthy agents maps to STARTING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": False,
                "resources": [
                    {
                        "agents": [
                            {
                                "status": "connecting",  # Not connected
                                "lifecycle_state": "starting",  # Not ready
                            }
                        ]
                    }
                ],
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.STARTING

    async def test_running_workspace_with_healthy_agents_idle(
        self, agent_repo, mock_coder_client
    ):
        """Test workspace status 'running' with healthy agents and no task maps to IDLE."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": False,
                "resources": [
                    {
                        "agents": [
                            {
                                "status": "connected",  # Connected
                                "lifecycle_state": "ready",  # Ready
                            }
                        ]
                    }
                ],
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.IDLE

    async def test_running_workspace_with_healthy_agents_and_task_busy(
        self, agent_repo, mock_coder_client
    ):
        """Test workspace status 'running' with healthy agents and active task maps to BUSY."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": True,
                "resources": [
                    {
                        "agents": [
                            {
                                "status": "connected",
                                "lifecycle_state": "ready",
                            }
                        ]
                    }
                ],
            },
            "latest_app_status": {"state": "working"},
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.BUSY

    async def test_running_workspace_with_no_resources_starting(
        self, agent_repo, mock_coder_client
    ):
        """Test workspace status 'running' with no resources maps to STARTING."""
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": False,
                "resources": [],  # No resources
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.STARTING

    async def test_running_workspace_with_empty_agents_array_starting(
        self, agent_repo, mock_coder_client
    ):
        """Test workspace status 'running' with resources but no agents maps to STARTING.

        Regression test: This is the bug we're fixing. Workspace with resources
        but empty agents array should be considered unhealthy and marked as STARTING.
        """
        mock_workspace = {
            "id": "ws-1",
            "name": "test-agent",
            "template_name": "coder-devcontainer",
            "template_display_name": "Setup",
            "template_id": "tpl-1",
            "created_at": "2025-11-07T10:00:00Z",
            "updated_at": "2025-11-07T10:00:00Z",
            "latest_build": {
                "status": "running",
                "has_ai_task": False,
                "resources": [
                    {"agents": []}  # Empty agents array - workspace still starting
                ],
            },
        }
        mock_coder_client.list_workspaces.return_value = [mock_workspace]

        agents = await agent_repo.list_all()

        assert len(agents) == 1
        assert agents[0].status == AgentStatus.STARTING
