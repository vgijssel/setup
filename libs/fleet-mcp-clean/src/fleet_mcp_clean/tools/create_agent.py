"""MCP tool for creating a new agent."""

from typing import Annotated

from pydantic import Field

from ..models import CreateAgentResponse
from ..services import AgentService


async def create_agent(
    agent_service: AgentService,
    name: Annotated[str, Field(min_length=1, max_length=32, description="Unique short agent name (e.g., Sony, Papi)")],
    project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
    task: Annotated[
        str, Field(description="Task description defining objectives and constraints")
    ],
    role: Annotated[
        str | None,
        Field(
            description="Agent role matching Coder workspace preset (e.g., coder, operator, manager). If not specified, the default role will be chosen by the Coder backend."
        ),
    ] = None,
) -> CreateAgentResponse:
    """Create a new Claude Code agent in a Coder workspace.

    Tool: create_agent
    User Story: US2 (Agent Lifecycle Management)
    Architecture: Layer 1 (Tool Layer)

    Args:
        agent_service: Service instance for agent business logic
        name: Unique agent name (1-32 chars, alphanumeric + hyphens, must start with letter/number)
        project: Project name (must exist)
        task: Initial task description (non-empty)
        role: Agent role name (optional, defaults to backend's default role for project)

    Returns:
        CreateAgentResponse with created agent and success message

    Raises:
        ValidationError: If inputs are invalid
        AgentConflictError: If agent name already exists
        CoderAPIError: If Coder API fails

    Example:
        result = await create_agent(
            agent_service,
            name="data-analyst",
            project="Setup",
            task="Analyze sales data and create reports",
            role="coder"
        )
    """
    agent = await agent_service.create_agent(
        name=name, project=project, task=task, role=role
    )

    return CreateAgentResponse(
        agent=agent, message=f"Agent '{name}' created successfully"
    )
