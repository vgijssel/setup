"""Task lifecycle management tools for Fleet MCP Server - User Story 2"""

from datetime import datetime
from typing import Annotated

from fastmcp import FastMCP
from pydantic import Field

from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.workspaces import get_workspace_by_name
from fleet_mcp.models.responses import CancelTaskResponse, StartTaskResponse
from fleet_mcp.models.task import Task


def register_task_tools(mcp: FastMCP, coder_client: CoderClient):
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
        # T066: Validate task description is not empty
        if not task_description or not task_description.strip():
            raise ValueError("Task description cannot be empty")

        # Get workspace by agent name
        workspace = await get_workspace_by_name(coder_client, agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # T066: Validate agent is not offline (workspace must be running)
        build_status = workspace.get("latest_build", {}).get("status", "")
        if build_status != "running":
            raise ValueError(
                f"Agent '{agent_name}' is not running (status: {build_status}). "
                "Cannot start task on offline agent."
            )

        # T067: Validate agent is not already busy using task API
        owner_name = workspace.get("owner_name")
        task_data = await coder_client.get_task(owner_name, workspace_id)
        if task_data:
            current_state = task_data.get("current_state", {})
            if current_state.get("state") == "working":
                current_message = current_state.get("message", "unknown task")
                raise ValueError(
                    f"Agent '{agent_name}' is already busy with task: '{current_message}'. "
                    "Cannot start a new task while agent is working."
                )

        # Send task input to Coder workspace via experimental API
        await coder_client.send_task_input(owner_name, workspace_id, task_description)

        # Create task record
        task = Task(
            message=task_description,
            uri="",  # URI can be set later by the agent
            needs_user_attention=False,
            created_at=datetime.now(),
        )

        return StartTaskResponse(
            task=task,
            agent_status="busy",
            message=f"Task started successfully on agent '{agent_name}'",
        )

    @mcp.tool()
    async def cancel_agent_task(
        agent_name: Annotated[
            str, Field(description="Name of the agent whose task should be canceled")
        ],
    ) -> CancelTaskResponse:
        """
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
        # Get workspace by agent name
        workspace = await get_workspace_by_name(coder_client, agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # T068: Validate agent is busy using task API
        owner_name = workspace.get("owner_name")
        task_data = await coder_client.get_task(owner_name, workspace_id)
        current_task = None
        if task_data:
            current_state = task_data.get("current_state", {})
            if current_state.get("state") == "working":
                current_task = current_state.get("message", "unknown task")

        if not current_task:
            raise ValueError(f"Agent '{agent_name}' is not busy. No task to cancel.")

        # Get AgentAPI URL to send cancellation via application proxy
        # This bypasses 502 gateway timeout issues
        agentapi_url = await coder_client.get_agentapi_url(workspace)

        if not agentapi_url:
            raise ValueError(
                f"Agent '{agent_name}' does not have AgentAPI exposed. "
                "Cannot cancel task. The workspace template must include a "
                "coder_app resource with slug 'ccw', 'agentapi', or 'claude'."
            )

        # Send Ctrl+C via AgentAPI application URL
        await coder_client.send_agentapi_interrupt(agentapi_url)

        # Note: The agent will transition to idle status by calling coder_report_task
        # which will be reflected in the task API. We don't automatically set status
        # because the agent needs to gracefully handle the cancellation.

        # Create task record for the canceled task
        task = Task(
            message=f"{current_task} (cancellation requested via agentapi)",
            uri=agentapi_url,
            needs_user_attention=False,
            created_at=datetime.now(),
        )

        return CancelTaskResponse(
            task=task,
            agent_status="canceling",
            message=f"Interrupt signal sent to agent '{agent_name}' via AgentAPI. "
            f"The agent will report idle status when cancellation completes.",
        )
