"""End-to-end integration tests for all MCP tools.

These tests exercise the full stack (Tool → Service → Repository → Client)
with only HTTP calls mocked using respx. No internal layers are mocked.
"""

import pytest
import respx
from httpx import Response
import os

# Import all MCP tools
from fleet_mcp_clean.tools.list_agents import list_agents
from fleet_mcp_clean.tools.show_agent import show_agent
from fleet_mcp_clean.tools.create_agent import create_agent
from fleet_mcp_clean.tools.delete_agent import delete_agent
from fleet_mcp_clean.tools.restart_agent import restart_agent
from fleet_mcp_clean.tools.start_task import start_agent_task
from fleet_mcp_clean.tools.cancel_task import cancel_agent_task
from fleet_mcp_clean.tools.show_task_history import show_agent_task_history
from fleet_mcp_clean.tools.show_logs import show_agent_log
from fleet_mcp_clean.tools.list_projects import list_agent_projects
from fleet_mcp_clean.tools.list_roles import list_agent_roles

# Import stack components
from fleet_mcp_clean.clients import CoderClient
from fleet_mcp_clean.repositories import AgentRepository, ProjectRepository, TaskRepository
from fleet_mcp_clean.services import AgentService, ProjectService, TaskService


@pytest.fixture
def coder_base_url():
    """Coder API base URL for testing."""
    return os.getenv("CODER_URL", "https://test-coder.example.com")


@pytest.fixture
def full_stack(coder_base_url):
    """Create full stack for integration testing (only HTTP mocked)."""
    # Create client
    client = CoderClient(base_url=coder_base_url, token="test-token")

    # Create repositories
    agent_repo = AgentRepository(client)
    project_repo = ProjectRepository(client)
    task_repo = TaskRepository(client)

    # Create services
    agent_service = AgentService(agent_repo, project_repo)
    project_service = ProjectService(project_repo)
    task_service = TaskService(task_repo, agent_repo)

    return {
        "client": client,
        "agent_service": agent_service,
        "project_service": project_service,
        "task_service": task_service,
    }


@pytest.mark.asyncio
class TestMCPToolsIntegration:
    """Integration tests for all MCP tools - full stack with only HTTP mocked."""

    async def test_list_agents_tool(self, respx_mock, coder_base_url, full_stack):
        """Test list_agents tool end-to-end."""
        # Mock HTTP
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "template_version_id": "v-1",
                    "template_version_preset_id": "p-1", "created_at": "2025-01-01T00:00:00Z"
                }
            }])
        )

        # Call tool
        result = await list_agents(full_stack["agent_service"])

        # Assert: Result is a Pydantic model, access fields as attributes
        assert hasattr(result, "agents")
        assert result.total_count == 1
        assert result.agents[0].name == "agent-1"

    async def test_show_agent_tool(self, respx_mock, coder_base_url, full_stack):
        """Test show_agent tool end-to-end."""
        # Mock HTTP
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "template_version_id": "v-1",
                    "template_version_preset_id": "p-1", "created_at": "2025-01-01T00:00:00Z"
                }
            }])
        )
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "template_version_id": "v-1",
                    "template_version_preset_id": "p-1", "created_at": "2025-01-01T00:00:00Z",
                    "resources": []
                }
            })
        )

        # Call tool
        result = await show_agent(full_stack["agent_service"], agent_name="agent-1")

        # Assert
        assert result.agent.name == "agent-1"

    async def test_list_projects_tool(self, respx_mock, coder_base_url, full_stack):
        """Test list_agent_projects tool end-to-end."""
        # Mock list templates
        respx_mock.get(f"{coder_base_url}/api/v2/templates").mock(
            return_value=Response(200, json=[{
                "id": "t-1", "name": "coder-devcontainer", "display_name": "Setup",
                "description": "Test", "active_version_id": "v-1",
                "created_at": "2025-01-01T00:00:00Z"
            }])
        )
        # Mock get template (to extract active_version_id)
        respx_mock.get(f"{coder_base_url}/api/v2/templates/t-1").mock(
            return_value=Response(200, json={
                "id": "t-1", "name": "coder-devcontainer", "display_name": "Setup",
                "description": "Test", "active_version_id": "v-1",
                "created_at": "2025-01-01T00:00:00Z"
            })
        )
        # Mock get rich parameters
        respx_mock.get(f"{coder_base_url}/api/v2/templateversions/v-1/rich-parameters").mock(
            return_value=Response(200, json=[
                {"name": "ai_prompt", "type": "string", "required": True},
                {"name": "system_prompt", "type": "string", "required": False}
            ])
        )

        # Call tool
        result = await list_agent_projects(full_stack["project_service"])

        # Assert
        assert hasattr(result, "projects")
        assert result.total_count >= 1

    async def test_list_roles_tool(self, respx_mock, coder_base_url, full_stack):
        """Test list_agent_roles tool end-to-end."""
        # Mock list templates
        respx_mock.get(f"{coder_base_url}/api/v2/templates").mock(
            return_value=Response(200, json=[{
                "id": "t-1", "name": "coder-devcontainer", "display_name": "Setup",
                "description": "Test", "active_version_id": "v-1",
                "created_at": "2025-01-01T00:00:00Z"
            }])
        )
        # Mock get template
        respx_mock.get(f"{coder_base_url}/api/v2/templates/t-1").mock(
            return_value=Response(200, json={
                "id": "t-1", "name": "coder-devcontainer", "display_name": "Setup",
                "active_version_id": "v-1"
            })
        )
        # Mock get rich parameters
        respx_mock.get(f"{coder_base_url}/api/v2/templateversions/v-1/rich-parameters").mock(
            return_value=Response(200, json=[
                {"name": "ai_prompt", "type": "string", "required": True}
            ])
        )
        # Mock list workspace presets
        respx_mock.get(f"{coder_base_url}/api/v2/templateversions/v-1/presets").mock(
            return_value=Response(200, json=[
                {"id": "p-1", "name": "coder", "description": "Default"}
            ])
        )

        # Call tool
        result = await list_agent_roles(full_stack["project_service"], project="Setup")

        # Assert
        assert hasattr(result, "roles")
        assert result.total_count >= 1

    async def test_create_agent_tool(self, respx_mock, coder_base_url, full_stack):
        """Test create_agent tool end-to-end."""
        # Mock list templates
        respx_mock.get(f"{coder_base_url}/api/v2/templates").mock(
            return_value=Response(200, json=[{
                "id": "t-1", "name": "coder-devcontainer", "display_name": "Setup",
                "active_version_id": "v-1", "created_at": "2025-01-01T00:00:00Z"
            }])
        )
        # Mock get template
        respx_mock.get(f"{coder_base_url}/api/v2/templates/t-1").mock(
            return_value=Response(200, json={
                "id": "t-1", "name": "coder-devcontainer", "display_name": "Setup",
                "active_version_id": "v-1"
            })
        )
        # Mock get rich parameters (MUST include both ai_prompt and system_prompt for filtering)
        respx_mock.get(f"{coder_base_url}/api/v2/templateversions/v-1/rich-parameters").mock(
            return_value=Response(200, json=[
                {"name": "ai_prompt", "type": "string", "required": True},
                {"name": "system_prompt", "type": "string", "required": False}
            ])
        )
        # Mock list presets
        respx_mock.get(f"{coder_base_url}/api/v2/templateversions/v-1/presets").mock(
            return_value=Response(200, json=[{"id": "p-1", "name": "coder"}])
        )
        # Mock list workspaces (to check for duplicates)
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[])
        )
        # Mock get organization
        respx_mock.get(f"{coder_base_url}/api/v2/organizations").mock(
            return_value=Response(200, json=[{"id": "org-1", "name": "test"}])
        )
        # Mock create workspace
        respx_mock.post(f"{coder_base_url}/api/v2/organizations/org-1/members/me/workspaces").mock(
            return_value=Response(201, json={
                "id": "new-ws", "name": "new-agent", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "starting", "template_version_id": "v-1",
                    "template_version_preset_id": "p-1", "created_at": "2025-01-01T00:00:00Z"
                }
            })
        )

        # Call tool
        result = await create_agent(
            full_stack["agent_service"],
            name="new-agent",
            project="Setup",
            task="Test task",
            role="coder"
        )

        # Assert
        assert result.agent.name == "new-agent"

    async def test_delete_agent_tool(self, respx_mock, coder_base_url, full_stack):
        """Test delete_agent tool end-to-end."""
        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {"id": "b-1", "status": "running"}
            }])
        )
        # Mock get workspace (called by get_by_name to get full details)
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "resources": []
                }
            })
        )
        # Mock delete workspace (POST to create delete build)
        respx_mock.post(f"{coder_base_url}/api/v2/workspaces/ws-1/builds").mock(
            return_value=Response(201, json={
                "id": "b-delete", "workspace_id": "ws-1", "status": "pending",
                "transition": "delete", "created_at": "2025-01-01T00:00:00Z"
            })
        )

        # Call tool
        result = await delete_agent(full_stack["agent_service"], agent_name="agent-1")

        # Assert
        assert "deleted" in result.message.lower()

    async def test_restart_agent_tool(self, respx_mock, coder_base_url, full_stack):
        """Test restart_agent tool end-to-end."""
        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {"id": "b-1", "status": "running"}
            }])
        )
        # Mock get workspace
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_id": "u-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "resources": []
                }
            })
        )
        # Mock restart workspace
        respx_mock.post(f"{coder_base_url}/api/v2/workspaces/ws-1/builds").mock(
            return_value=Response(201, json={
                "id": "b-2", "workspace_id": "ws-1", "status": "pending",
                "transition": "start", "created_at": "2025-01-01T00:00:00Z"
            })
        )

        # Call tool
        result = await restart_agent(full_stack["agent_service"], agent_name="agent-1")

        # Assert
        assert "restarted" in result.message.lower()

    async def test_start_task_tool(self, respx_mock, coder_base_url, full_stack):
        """Test start_agent_task tool end-to-end."""
        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_name": "testuser", "owner_id": "u-1",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {"id": "b-1", "status": "running"}
            }])
        )
        # Mock get workspace
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1", "template_id": "t-1",
                "template_name": "coder-devcontainer", "template_display_name": "Setup",
                "owner_name": "testuser", "owner_id": "u-1",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "resources": []
                }
            })
        )
        # Mock send task input
        respx_mock.post(f"{coder_base_url}/api/experimental/tasks/testuser/ws-1/send").mock(
            return_value=Response(200, json={"success": True})
        )

        # Call tool
        result = await start_agent_task(
            full_stack["task_service"],
            agent_name="agent-1",
            task_description="Test task"
        )

        # Assert
        assert "assigned" in result.message.lower()

    async def test_cancel_task_tool(self, respx_mock, coder_base_url, full_stack):
        """Test cancel_agent_task tool end-to-end."""
        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "owner_name": "testuser",
                "template_id": "t-1", "template_name": "coder-devcontainer",
                "template_display_name": "Setup", "owner_id": "u-1",
                "created_at": "2025-01-01T00:00:00Z", "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1",
                    "status": "running",
                    "has_ai_task": True,
                    "resources": [{
                        "agents": [{
                            "apps": [{
                                "slug": "agentapi",
                                "url": "http://localhost:8080",
                                "health": "http://localhost:8080"
                            }]
                        }]
                    }]
                },
                "latest_app_status": {
                    "state": "working",
                    "message": "Agent is busy"
                }
            }])
        )
        # Mock get workspace
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1", "owner_name": "testuser",
                "template_id": "t-1", "template_name": "coder-devcontainer",
                "template_display_name": "Setup", "owner_id": "u-1",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1",
                    "status": "running",
                    "has_ai_task": True,
                    "resources": [{
                        "agents": [{
                            "apps": [{
                                "slug": "agentapi",
                                "url": "http://localhost:8080",
                                "health": "http://localhost:8080"
                            }]
                        }]
                    }]
                },
                "latest_app_status": {
                    "state": "working",
                    "message": "Agent is busy"
                }
            })
        )
        # Mock send interrupt
        respx_mock.post("http://localhost:8080/interrupt").mock(
            return_value=Response(200, json={"interrupt_sent": True})
        )

        # Call tool
        result = await cancel_agent_task(full_stack["task_service"], agent_name="agent-1")

        # Assert
        assert "canceled" in result.message.lower()
        assert result.agent_name == "agent-1"

    async def test_show_task_history_tool(self, respx_mock, coder_base_url, full_stack):
        """Test show_agent_task_history tool end-to-end."""
        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z", "latest_build": {"status": "running"}
            }])
        )
        # Mock get workspace
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1",
                "latest_build": {"resources": [{"metadata": []}]}
            })
        )

        # Call tool
        result = await show_agent_task_history(
            full_stack["task_service"],
            agent_name="agent-1",
            page=1,
            page_size=10
        )

        # Assert - result is a dict, not a Pydantic model
        assert isinstance(result, dict)
        assert result["agent_name"] == "agent-1"
        assert "tasks" in result

    async def test_show_logs_tool(self, respx_mock, coder_base_url, full_stack):
        """Test show_agent_log tool end-to-end."""
        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").mock(
            return_value=Response(200, json=[{
                "id": "ws-1", "name": "agent-1", "owner_name": "testuser",
                "template_id": "t-1", "template_name": "coder-devcontainer",
                "template_display_name": "Setup", "owner_id": "u-1",
                "created_at": "2025-01-01T00:00:00Z", "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {"id": "b-1", "status": "running"}
            }])
        )
        # Mock get workspace
        respx_mock.get(path__startswith="/api/v2/workspaces/ws-1").mock(
            return_value=Response(200, json={
                "id": "ws-1", "name": "agent-1", "owner_name": "testuser",
                "template_id": "t-1", "template_name": "coder-devcontainer",
                "template_display_name": "Setup", "owner_id": "u-1",
                "created_at": "2025-01-01T00:00:00Z",
                "updated_at": "2025-01-01T00:00:00Z",
                "latest_build": {
                    "id": "b-1", "status": "running", "resources": []
                }
            })
        )
        # Mock get task logs
        respx_mock.get(f"{coder_base_url}/api/experimental/tasks/testuser/ws-1/logs").mock(
            return_value=Response(200, json={
                "logs": [{
                    "timestamp": "2025-01-01T00:00:00Z",
                    "message": "Log entry",
                    "level": "INFO"
                }]
            })
        )

        # Call tool
        result = await show_agent_log(
            full_stack["task_service"],
            agent_name="agent-1",
            page=1,
            page_size=1
        )

        # Assert - result is a dict, not a Pydantic model
        assert isinstance(result, dict)
        assert result["agent_name"] == "agent-1"
        assert "logs" in result
