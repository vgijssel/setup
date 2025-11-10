"""MCP tool for deleting an agent."""

from typing import Annotated

from pydantic import Field

from ..models import DeleteAgentResponse
from ..services import AgentService


async def delete_agent(
    agent_service: AgentService,
    agent_name: Annotated[
        str, Field(min_length=1, max_length=32, description="Name of the agent to delete")
    ],
) -> DeleteAgentResponse:
    """Delete an agent and destroy its underlying workspace.

    Tool: delete_agent
    User Story: US2 (Agent Lifecycle Management)
    Architecture: Layer 1 (Tool Layer)

    This is a forceful deletion that works even if the agent is busy.
    All workspace data will be permanently deleted.

    Args:
        agent_service: Service instance for agent business logic
        agent_name: Name of the agent to delete

    Returns:
        DeleteAgentResponse with agent name and success message

    Raises:
        AgentNotFoundError: If agent doesn't exist
        ValidationError: If agent_name is invalid
        CoderAPIError: If deletion fails

    Example:
        result = await delete_agent(agent_service, agent_name="old-agent")
    """
    await agent_service.delete_agent(agent_name)

    return DeleteAgentResponse(
        agent_name=agent_name, message=f"Agent '{agent_name}' deleted successfully"
    )
