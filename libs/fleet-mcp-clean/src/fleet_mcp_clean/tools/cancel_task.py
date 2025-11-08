"""MCP tool for canceling an agent task."""

from typing import Annotated

from pydantic import Field

from ..models import CancelTaskResponse
from ..services import TaskService


async def cancel_agent_task(
    task_service: TaskService,
    agent_name: Annotated[
        str, Field(min_length=1, max_length=20, description="Name of the agent to cancel task for")
    ],
) -> CancelTaskResponse:
    """Cancel the current task on an agent by sending Ctrl+C interrupt signal.

    Tool: cancel_agent_task
    User Story: US3 (Task Assignment and Cancellation)
    Architecture: Layer 1 (Tool Layer)

    This sends a SIGINT (Ctrl+C) interrupt signal to the agent's workspace via AgentAPI,
    which should stop the currently running task.

    Business Rules:
    - Agent must be busy (has a running task)
    - Sends interrupt signal via AgentAPI

    Args:
        task_service: Service instance for task business logic
        agent_name: Name of the agent to cancel task for

    Returns:
        CancelTaskResponse with agent name and success message

    Raises:
        ValidationError: If agent_name is invalid
        AgentNotFoundError: If agent doesn't exist or AgentAPI is unavailable
        ValueError: If agent is not busy
        CoderAPIError: If cancellation fails

    Example:
        result = await cancel_agent_task(task_service, agent_name="stuck-agent")
    """
    await task_service.cancel_task(agent_name)

    return CancelTaskResponse(
        agent_name=agent_name,
        message=f"Task canceled for agent '{agent_name}' successfully"
    )
