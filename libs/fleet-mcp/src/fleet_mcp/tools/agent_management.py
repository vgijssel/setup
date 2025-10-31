"""Agent management MCP tools"""

from datetime import datetime
from typing import Annotated

from fastmcp import FastMCP
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.discovery import (
    get_valid_fleet_mcp_project_names,
    is_valid_fleet_mcp_project,
)
from fleet_mcp.coder.tasks import paginate_task_history
from fleet_mcp.coder.workspaces import get_workspace_by_name
from fleet_mcp.models.agent import Agent
from fleet_mcp.models.responses import (
    AgentDetailsResponse,
    AgentListResponse,
    AgentSummary,
    CreateAgentResponse,
    DeleteAgentResponse,
    TaskHistoryResponse,
)
from fleet_mcp.models.task import Task
from pydantic import Field


def register_agent_tools(mcp: FastMCP, coder_client: CoderClient):
    """Register agent management tools with MCP server"""

    # T048: create_agent tool
    @mcp.tool()
    async def create_agent(
        name: Annotated[
            str, Field(description="Unique short agent name (e.g., Sony, Papi)")
        ],
        project: Annotated[
            str, Field(description="Project name (e.g., Setup, DataOne)")
        ],
        spec: Annotated[
            str,
            Field(
                description="Agent specification defining objectives and constraints"
            ),
        ],
        role: Annotated[
            str,
            Field(
                description="Agent role matching Coder workspace preset (e.g., coder, operator, manager)"
            ),
        ] = "coder",
    ) -> CreateAgentResponse:
        """Create a new Claude Code agent in a Coder workspace"""

        # Validate agent name doesn't already exist
        existing = await get_workspace_by_name(coder_client, name)
        if existing:
            raise ValueError(f"Agent with name '{name}' already exists")

        # Validate that project is a valid fleet-mcp project
        if not await is_valid_fleet_mcp_project(coder_client, project):
            valid_projects = await get_valid_fleet_mcp_project_names(coder_client)
            raise ValueError(
                f"Project '{project}' is not a valid fleet-mcp project. "
                f"Valid projects must have ai_prompt and system_prompt parameters. "
                f"Available projects: {', '.join(sorted(valid_projects))}"
            )

        # Create workspace via Coder API
        # Pass spec as ai_prompt parameter (required by user)
        # Note: project is already the template name, no need to add suffix
        workspace = await coder_client.create_workspace(
            name=f"agent-{name}",
            template_name=project,
            workspace_preset=role,
            ai_prompt=spec,  # Pass spec as ai_prompt rich parameter
        )

        # TODO: Write agent metadata to files in the workspace
        # This will be done using coder_workspace_bash MCP tool
        # await coder_client.write_agent_metadata(
        #     workspace["id"],
        #     "main",
        #     {
        #         "agent_name": name,
        #         "agent_role": role,
        #         "agent_project": project,
        #         "agent_spec": spec,
        #         "current_task": spec
        #     }
        # )

        # Create synthetic metadata for MVP (will be replaced by file-based metadata later)

        # Convert to Agent model with synthetic metadata
        agent = Agent.from_workspace(
            workspace,
            agent_metadata={
                "15_agent_name": name,
                "13_agent_role": role,
                "14_agent_project": project,
                "11_agent_spec": spec,
                "12_current_task": spec,
            },
        )

        return CreateAgentResponse(
            agent=agent, message=f"Agent '{name}' created successfully"
        )

    # T049: list_agents tool
    @mcp.tool()
    async def list_agents() -> AgentListResponse:
        """List all agents in the fleet with their current status"""
        workspaces = await coder_client.list_workspaces()

        # Get valid fleet-mcp project names for filtering
        valid_project_names = await get_valid_fleet_mcp_project_names(coder_client)

        # Filter for fleet workspaces associated with valid fleet-mcp projects
        agents = []
        for ws in workspaces:
            # Check if workspace name starts with "agent-" prefix
            workspace_name = ws.get("name", "")
            if not workspace_name.startswith("agent-"):
                continue

            # Check if workspace is associated with a valid fleet-mcp project
            # The template name should match one of the valid projects directly
            template_name = ws.get("template_name", "")

            # Only include workspaces for valid fleet-mcp projects
            # Template names now match project names directly
            if template_name in valid_project_names:
                try:
                    agent = Agent.from_workspace(ws)
                    agents.append(
                        AgentSummary(
                            name=agent.name,
                            status=agent.status.value,
                            current_task=agent.current_task,
                        )
                    )
                except Exception:
                    # Skip workspaces that fail to convert to Agent
                    continue

        return AgentListResponse(agents=agents, total_count=len(agents))

    # T050: show_agent tool
    @mcp.tool()
    async def show_agent(
        agent_name: Annotated[str, Field(description="Agent name to query")]
    ) -> AgentDetailsResponse:
        """Show detailed information about a specific agent"""
        workspace = await get_workspace_by_name(coder_client, agent_name)

        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        # Get workspace details to find agent ID
        workspace_details = await coder_client.get_workspace(workspace["id"])

        # Get agent metadata if agent exists
        agent_metadata = {}
        if workspace_details.get("latest_build", {}).get("resources"):
            for resource in workspace_details["latest_build"]["resources"]:
                if resource.get("agents"):
                    agent_id = resource["agents"][0]["id"]
                    try:
                        agent_metadata = await coder_client.get_agent_metadata(agent_id)
                    except Exception:
                        # Agent not fully started yet, metadata not available
                        pass
                    break

        # If no metadata available yet (agent starting), create synthetic metadata
        # This is MVP behavior - production will wait for real metadata
        if not agent_metadata and workspace.get("name", "").startswith("agent-"):
            name = workspace["name"].replace("agent-", "")
            agent_metadata = {"15_agent_name": name}

        agent = Agent.from_workspace(workspace, agent_metadata)

        return AgentDetailsResponse(agent=agent)

    # T051: show_agent_task_history tool
    @mcp.tool()
    async def show_agent_task_history(
        agent_name: Annotated[str, Field(description="Agent name to query")],
        page: Annotated[int, Field(description="Page number (1-indexed)", ge=1)] = 1,
        page_size: Annotated[
            int, Field(description="Items per page (max 100)", ge=1, le=100)
        ] = 20,
    ) -> TaskHistoryResponse:
        """Show paginated task history for an agent"""
        workspace = await get_workspace_by_name(coder_client, agent_name)

        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        # Get workspace details which include task history
        # Note: This is a simplified version - real implementation would query Coder's task API
        workspace_details = await coder_client.get_workspace(workspace["id"])

        # Extract tasks from workspace (placeholder - actual structure depends on Coder API)
        task_data = workspace_details.get("tasks", [])
        tasks = []
        for task_item in task_data:
            tasks.append(
                Task(
                    message=task_item.get("message", ""),
                    uri=task_item.get("uri", ""),
                    needs_user_attention=task_item.get("needs_user_attention", False),
                    created_at=datetime.fromisoformat(
                        task_item.get("created_at", datetime.now().isoformat())
                    ),
                )
            )

        # Paginate results
        return paginate_task_history(tasks, page, page_size)

    # ========================================================================
    # User Story 4: Agent Lifecycle Management
    # ========================================================================

    # T086: delete_agent tool
    @mcp.tool()
    async def delete_agent(
        agent_name: Annotated[str, Field(description="Name of the agent to delete")],
    ) -> DeleteAgentResponse:
        """
        Delete an agent and destroy its Coder workspace.

        This operation is forceful and irreversible. The agent will be deleted
        even if it is currently busy with a task.

        Errors:
        - Agent not found (404)
        - Workspace deletion failed (503)
        """
        # T087: Validate agent exists
        workspace = await get_workspace_by_name(coder_client, agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        workspace.get("name", agent_name)

        # T088: Forceful deletion - delete even if busy
        # No status check - we delete regardless of agent state
        # This is intentional per spec: "Busy agents will be forcefully deleted"

        # Delete the workspace
        await coder_client.delete_workspace(workspace_id)

        return DeleteAgentResponse(
            message=f"Agent '{agent_name}' deleted successfully",
            deleted_agent={"name": agent_name, "workspace_id": workspace_id},
        )
