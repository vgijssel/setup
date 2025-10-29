"""Agent management MCP tools"""
from typing import Annotated
from fastmcp import FastMCP
from pydantic import Field
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.workspaces import get_workspace_by_name
from fleet_mcp.coder.tasks import paginate_task_history
from fleet_mcp.models.agent import Agent, AgentStatus
from fleet_mcp.models.task import Task
from fleet_mcp.models.responses import (
    CreateAgentResponse,
    AgentListResponse,
    AgentSummary,
    AgentDetailsResponse,
    TaskHistoryResponse
)
from datetime import datetime


def register_agent_tools(mcp: FastMCP, coder_client: CoderClient):
    """Register agent management tools with MCP server"""

    # T048: create_agent tool
    @mcp.tool()
    async def create_agent(
        name: Annotated[str, Field(description="Unique short agent name (e.g., Sony, Papi)")],
        project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
        spec: Annotated[str, Field(description="Agent specification defining objectives and constraints")],
        role: Annotated[str, Field(description="Agent role matching Coder workspace preset (e.g., coder, operator, manager)")] = "coder",
    ) -> CreateAgentResponse:
        """Create a new Claude Code agent in a Coder workspace"""

        # Validate agent name doesn't already exist
        existing = await get_workspace_by_name(coder_client, name)
        if existing:
            raise ValueError(f"Agent with name '{name}' already exists")

        # Create workspace via Coder API
        workspace = await coder_client.create_workspace(
            name=f"agent-{name}",
            template_name=f"{project.lower()}-devcontainer",
            workspace_preset=role,
            metadata={
                "fleet_mcp_agent_name": name,
                "fleet_mcp_role": role,
                "fleet_mcp_project": project,
                "fleet_mcp_agent_spec": spec,
                "fleet_mcp_current_task": spec  # Agent starts working immediately
            }
        )

        # Convert to Agent model
        agent = Agent.from_workspace(workspace)

        return CreateAgentResponse(
            agent=agent,
            message=f"Agent '{name}' created successfully"
        )

    # T049: list_agents tool
    @mcp.tool()
    async def list_agents() -> AgentListResponse:
        """List all agents in the fleet with their current status"""
        workspaces = await coder_client.list_workspaces()

        # Filter for fleet workspaces and convert to AgentSummary
        agents = []
        for ws in workspaces:
            metadata = ws.get("metadata", {})
            if "fleet_mcp_agent_name" in metadata:
                agent = Agent.from_workspace(ws)
                agents.append(AgentSummary(
                    name=agent.name,
                    status=agent.status.value,
                    current_task=agent.current_task
                ))

        return AgentListResponse(
            agents=agents,
            total_count=len(agents)
        )

    # T050: show_agent tool
    @mcp.tool()
    async def show_agent(
        agent_name: Annotated[str, Field(description="Agent name to query")]
    ) -> AgentDetailsResponse:
        """Show detailed information about a specific agent"""
        workspace = await get_workspace_by_name(coder_client, agent_name)

        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        agent = Agent.from_workspace(workspace)

        return AgentDetailsResponse(agent=agent)

    # T051: show_agent_task_history tool
    @mcp.tool()
    async def show_agent_task_history(
        agent_name: Annotated[str, Field(description="Agent name to query")],
        page: Annotated[int, Field(description="Page number (1-indexed)", ge=1)] = 1,
        page_size: Annotated[int, Field(description="Items per page (max 100)", ge=1, le=100)] = 20,
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
            tasks.append(Task(
                message=task_item.get("message", ""),
                uri=task_item.get("uri", ""),
                needs_user_attention=task_item.get("needs_user_attention", False),
                created_at=datetime.fromisoformat(task_item.get("created_at", datetime.now().isoformat()))
            ))

        # Paginate results
        return paginate_task_history(tasks, page, page_size)
