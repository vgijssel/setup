"""MCP tool for starting an agent task."""

from typing import Annotated

from pydantic import Field

from ..models import StartTaskResponse
from ..services import TaskService


async def start_agent_task(
    task_service: TaskService,
    agent_name: Annotated[
        str,
        Field(
            min_length=1,
            max_length=20,
            description="Name of the agent to assign task to",
        ),
    ],
    task_description: Annotated[
        str,
        Field(
            min_length=1,
            description="Task description defining objectives and constraints",
        ),
    ],
) -> StartTaskResponse:
    """Start a task on an agent.

    Tool: start_agent_task
    User Story: US3 (Task Assignment and Cancellation)
    Architecture: Layer 1 (Tool Layer)

    Business Rules:
    - Agent must be idle (not busy, not offline, not failed)
    - Task description must not be empty
    - Only one task can run on an agent at a time

    Args:
        task_service: Service instance for task business logic
        agent_name: Name of the agent to assign task to (1-20 alphanumeric + hyphens)
        task_description: Description of the task to assign (non-empty)

    Returns:
        StartTaskResponse with agent name, task description, and success message

    Raises:
        ValidationError: If inputs are invalid
        AgentNotFoundError: If agent doesn't exist
        ValueError: If agent is not idle or not online
        CoderAPIError: If Coder API fails

    Example:
        result = await start_agent_task(
            task_service,
            agent_name="data-analyst",
            task_description="Analyze sales data and create monthly report"
        )
    """
    await task_service.assign_task(agent_name, task_description)

    return StartTaskResponse(
        agent_name=agent_name,
        task_description=task_description,
        message=f"Task assigned to agent '{agent_name}' successfully",
    )
