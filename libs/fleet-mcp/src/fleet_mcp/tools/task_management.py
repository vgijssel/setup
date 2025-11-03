"""Task lifecycle management tools for Fleet MCP Server - User Story 2"""

from typing import Annotated

from fastmcp import FastMCP
from fleet_mcp.services.task_service import TaskService
from fleet_mcp.schemas.responses import CancelTaskResponse, StartTaskResponse
from pydantic import Field


def register_task_tools(mcp: FastMCP):
    """Register task management tools for User Story 2"""

    @mcp.tool()
    async def start_agent_task(
        agent_name: Annotated[
            str, Field(description="Name of the agent to assign the task to")
        ],
        task_description: Annotated[
            str, Field(description="Description of the task to be performed")
        ],
    ) -> StartTaskResponse:
        """
        Start a new task on an agent.

        Assigns a task to an idle agent and transitions the agent to busy status.
        The task description is set as the agent's current_task in metadata.

        Errors:
        - Agent not found (404)
        - Agent is offline (400)
        - Agent is already busy (409 Conflict)
        - Empty task description (400)
        """
        service = TaskService()
        return await service.start_agent_task(agent_name, task_description)

    @mcp.tool()
    async def cancel_agent_task(
        agent_name: Annotated[
            str, Field(description="Name of the agent whose task should be canceled")
        ],
    ) -> CancelTaskResponse:
        r"""
        Cancel the currently running task on an agent.

        Sends an interrupt signal (Ctrl+C / SIGINT) to the agent via the AgentAPI
        application URL. This method bypasses gateway timeout issues by using Coder's
        application proxy to access the AgentAPI running inside the workspace.

        Implementation (based on research from agent Papi):
        1. Get workspace details and find AgentAPI application URL
        2. Send POST to {agentapi_url}/message with {"type": "raw", "content": "\\u0003"}
        3. Falls back to experimental task API if AgentAPI is unavailable

        The Ctrl+C signal allows the agent to gracefully handle cancellation and
        report its own state transition via coder_report_task.

        Errors:
        - Agent not found (404)
        - Agent is not busy / has no running task (400)
        - AgentAPI not available (will attempt fallback)
        """
        service = TaskService()
        return await service.cancel_agent_task(agent_name)
