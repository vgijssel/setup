"""MCP tool for showing detailed agent information."""

from typing import Annotated

from pydantic import Field

from ..models import ShowAgentResponse
from ..services import AgentService


async def show_agent(
    agent_service: AgentService,
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=32, description="Name of the agent to retrieve"),
    ],
) -> ShowAgentResponse:
    """Show detailed information about a specific agent.

    Tool: show_agent
    User Story—US1 (Agent Discovery and Inspection)
    Architecture: layer 1 (Tool Layer)

    Args:
        agent_service: service instance for agent business logic
        agent_name: name of the agent to retrieve

    Returns:
        `ShowAgentResponse` with full agent details

    Raises:
        `AgentNotFoundError`: if agent doesn't exist
        ValidationError: if agent_name is invalid

    Example:

        result = await show_agent(agent_service, agent_name="data-analyst")
    """
    agent = await agent_service.get_agent(agent_name)
    return ShowAgentResponse(agent=agent)
