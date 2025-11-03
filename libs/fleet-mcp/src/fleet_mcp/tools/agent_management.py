"""Agent management MCP tools"""

from typing import Annotated

from fastmcp import FastMCP
from fleet_mcp.services.agent_service import AgentService
from fleet_mcp.schemas.responses import (
    AgentDetailsResponse,
    AgentListResponse,
    CreateAgentResponse,
    DeleteAgentResponse,
    LogHistoryResponse,
    TaskHistoryResponse,
)
from pydantic import Field


def register_agent_tools(mcp: FastMCP):
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
        service = AgentService()
        return await service.create_agent(name, project, task, role)

    # T049: list_agents tool
    @mcp.tool()
    async def list_agents() -> AgentListResponse:
        """List all agents in the fleet with their current status"""
        service = AgentService()
        return await service.list_agents()

    # T050: show_agent tool
    @mcp.tool()
    async def show_agent(
        agent_name: Annotated[str, Field(description="Agent name to query")]
    ) -> AgentDetailsResponse:
        """Show detailed information about a specific agent"""
        service = AgentService()
        return await service.show_agent(agent_name)

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
        service = AgentService()
        return await service.show_agent_task_history(agent_name, page, page_size)

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
        service = AgentService()
        return await service.show_agent_log(agent_name, page, page_size)

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
        service = AgentService()
        return await service.delete_agent(agent_name)
