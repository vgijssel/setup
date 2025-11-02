"""Agent management MCP tools"""

from datetime import datetime
from typing import Annotated

from fastmcp import FastMCP
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.discovery import (
    get_valid_fleet_mcp_project_names,
    is_valid_fleet_mcp_project,
)
from fleet_mcp.coder.tasks import paginate_log_history, paginate_task_history
from fleet_mcp.coder.workspaces import get_workspace_by_name
from fleet_mcp.models.agent import Agent
from fleet_mcp.models.log import Log
from fleet_mcp.models.responses import (
    AgentDetailsResponse,
    AgentListResponse,
    AgentSummary,
    CreateAgentResponse,
    DeleteAgentResponse,
    LogHistoryResponse,
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
        task: Annotated[
            str,
            Field(description="Task description defining objectives and constraints"),
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
        # Pass task as ai_prompt parameter (required by user)
        # Note: project is already the template name, no need to add suffix
        workspace = await coder_client.create_workspace(
            name=f"agent-{name}",
            template_name=project,
            workspace_preset=role,
            ai_prompt=task,  # Pass task as ai_prompt rich parameter
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
        #     }
        # )

        # Create synthetic metadata for MVP (will be replaced by file-based metadata later)
        # Note: We no longer store spec/task in agent metadata

        # Fetch task data from experimental API
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")
        task_data = None
        if workspace_id and owner_name:
            task_data = await coder_client.get_task(owner_name, workspace_id)

        # Fetch template display name
        template_display_name = None
        template_id = workspace.get("template_id")
        if template_id:
            try:
                template_details = await coder_client.get_template(template_id)
                template_display_name = template_details.get("display_name")
            except Exception:
                # If template fetch fails, fall back to project name
                pass

        # Convert to Agent model with synthetic metadata
        agent = Agent.from_workspace(
            workspace,
            agent_metadata={
                "15_agent_name": name,
                "13_agent_role": role,
                "14_agent_project": project,
            },
            task_data=task_data,
            template_display_name=template_display_name,
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

        # Build a cache of template_id -> display_name to avoid duplicate API calls
        template_cache: dict[str, str] = {}

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
                    # Fetch task data from experimental API
                    workspace_id = ws.get("id")
                    owner_name = ws.get("owner_name")
                    task_data = None
                    if workspace_id and owner_name:
                        task_data = await coder_client.get_task(
                            owner_name, workspace_id
                        )

                    # Fetch template display name (with caching)
                    template_display_name = None
                    template_id = ws.get("template_id")
                    if template_id:
                        if template_id in template_cache:
                            template_display_name = template_cache[template_id]
                        else:
                            try:
                                template_details = await coder_client.get_template(
                                    template_id
                                )
                                template_display_name = template_details.get(
                                    "display_name"
                                )
                                if template_display_name:
                                    template_cache[template_id] = template_display_name
                            except Exception:
                                # If template fetch fails, fall back to template name
                                pass

                    agent = Agent.from_workspace(
                        ws,
                        task_data=task_data,
                        template_display_name=template_display_name,
                    )
                    agents.append(
                        AgentSummary(
                            name=agent.name,
                            status=agent.status.value,
                            project=agent.project,
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

        # Fetch task data from experimental API
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")
        task_data = None
        if workspace_id and owner_name:
            task_data = await coder_client.get_task(owner_name, workspace_id)

        # Fetch template display name
        template_display_name = None
        template_id = workspace.get("template_id")
        if template_id:
            try:
                template_details = await coder_client.get_template(template_id)
                template_display_name = template_details.get("display_name")
            except Exception:
                # If template fetch fails, fall back to template name
                pass

        agent = Agent.from_workspace(
            workspace, agent_metadata, task_data, template_display_name
        )

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
        """Show paginated task history for an agent

        Returns task history ordered by created_at descending (newest first).
        This ordering ensures the most recent task status appears first in the response.
        """
        workspace = await get_workspace_by_name(coder_client, agent_name)

        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        # Get workspace details which include task history in the workspace resource
        workspace_details = await coder_client.get_workspace(workspace["id"])

        # Extract task history from workspace.latest_build.resources[].agents[].apps[].statuses[]
        # Task history is stored in the Claude Code app's statuses array
        tasks = []

        # Navigate through the workspace structure to find the Claude Code app statuses
        if workspace_details.get("latest_build", {}).get("resources"):
            for resource in workspace_details["latest_build"]["resources"]:
                # Look for resources with agents
                if resource.get("agents"):
                    for agent in resource["agents"]:
                        # Look for apps in the agent
                        if agent.get("apps"):
                            for app in agent["apps"]:
                                # Find the Claude Code app (by slug or display_name)
                                if app.get("slug") == "ccw" or "Claude Code" in app.get(
                                    "display_name", ""
                                ):
                                    # Extract statuses from the app
                                    statuses = app.get("statuses", [])
                                    for status in statuses:
                                        tasks.append(
                                            Task(
                                                message=status.get("message", ""),
                                                uri=status.get("uri", ""),
                                                needs_user_attention=status.get(
                                                    "needs_user_attention", False
                                                ),
                                                created_at=datetime.fromisoformat(
                                                    status.get(
                                                        "created_at",
                                                        datetime.now().isoformat(),
                                                    )
                                                ),
                                            )
                                        )
                                    break  # Found Claude Code app, stop searching

        # Paginate results (client-side pagination since API returns all tasks)
        return paginate_task_history(tasks, page, page_size)

    # T052: show_agent_log tool
    @mcp.tool()
    async def show_agent_log(
        agent_name: Annotated[str, Field(description="Agent name to query")],
        page: Annotated[int, Field(description="Page number (1-indexed)", ge=1)] = 1,
        page_size: Annotated[
            int, Field(description="Items per page (max 100)", ge=1, le=100)
        ] = 1,
    ) -> LogHistoryResponse:
        """Show paginated conversation log for an agent

        Returns conversation logs ordered by time descending (newest first).
        Default page size is 1 to show only the latest message.
        """
        workspace = await get_workspace_by_name(coder_client, agent_name)

        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        # Get task logs from experimental API
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        if not workspace_id or not owner_name:
            raise ValueError(f"Agent '{agent_name}' has invalid workspace data")

        # Fetch logs from Coder API
        log_data = await coder_client.get_task_logs(owner_name, workspace_id)

        # Convert to Log models
        logs = [Log(**log_entry) for log_entry in log_data]

        # Paginate results (client-side pagination since API returns all logs)
        return paginate_log_history(logs, page, page_size)

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
        # This is intentional as per requirements: "Busy agents will be forcefully deleted"

        # Delete the workspace
        await coder_client.delete_workspace(workspace_id)

        return DeleteAgentResponse(
            message=f"Agent '{agent_name}' deleted successfully",
            deleted_agent={"name": agent_name, "workspace_id": workspace_id},
        )
