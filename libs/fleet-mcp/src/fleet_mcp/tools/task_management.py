"""Task lifecycle management tools for Fleet MCP Server - User Story 2"""

from datetime import datetime
from typing import Annotated

from fastmcp import FastMCP
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.workspaces import get_workspace_by_name
from fleet_mcp.models.responses import CancelTaskResponse, StartTaskResponse
from fleet_mcp.models.task import Task
from pydantic import Field


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

        # T067: Validate agent is not already busy
        current_task = workspace.get("metadata", {}).get("fleet_mcp_current_task")
        if current_task:
            raise ValueError(
                f"Agent '{agent_name}' is already busy with task: '{current_task}'. "
                "Cannot start a new task while agent is working."
            )

        # Update workspace metadata to set current_task
        await coder_client.update_workspace_metadata(
            workspace_id, {"fleet_mcp_current_task": task_description}
        )

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

        Sends an interrupt signal to the agent's message endpoint and clears
        the current_task metadata, transitioning the agent back to idle status.

        Implementation: POST to messages endpoint with {"content": "\\u001b", "type": "raw"}

        Errors:
        - Agent not found (404)
        - Agent is not busy / has no running task (400)
        """
        # Get workspace by agent name
        workspace = await get_workspace_by_name(coder_client, agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # T068: Validate agent is busy (has a current task)
        current_task = workspace.get("metadata", {}).get("fleet_mcp_current_task")
        if not current_task:
            raise ValueError(f"Agent '{agent_name}' is not busy. No task to cancel.")

        # Send interrupt signal to agent
        await coder_client.send_interrupt(workspace_id)

        # Clear current_task metadata to transition agent to idle
        await coder_client.update_workspace_metadata(
            workspace_id, {"fleet_mcp_current_task": None}
        )

        # Create task record for the canceled task
        task = Task(
            message=f"{current_task} - canceled",
            uri="",
            needs_user_attention=False,
            created_at=datetime.now(),
        )

        return CancelTaskResponse(
            task=task,
            agent_status="idle",
            message=f"Task canceled successfully on agent '{agent_name}'",
        )
