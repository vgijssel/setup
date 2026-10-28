"""MCP tool for deleting an agent."""

from typing import Annotated

from pydantic import Field

from ..models import DeleteAgentResponse
from ..services import AgentService


async def delete_agent(
    agent_service: AgentService,
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=32, description="Name of the agent to delete"),
    ],
) -> DeleteAgentResponse:
    """Delete an agent and destroy its underlying workspace.

    Tool: delete_agent
    User Story—US2 (Agent Lifecycle Management)
    Architecture: layer 1 (Tool Layer)

    This is a forceful deletion that works even if the agent is busy.
    All workspace data is permanently deleted.

    Args:
        agent_service: the service instance for agent business logic
        agent_name: name of the agent to delete

    Returns:
        `DeleteAgentResponse` with agent name and success message

    Raises:
        `AgentNotFoundError`: if agent doesn't exist
        ValidationError: if agent_name is invalid
        CoderAPIError: if deletion fails

    Example:

        result = await delete_agent(agent_service, agent_name="old-agent")
    """
    await agent_service.delete_agent(agent_name)

    return DeleteAgentResponse(
        agent_name=agent_name, message=f"Agent '{agent_name}' deleted successfully"
    )
