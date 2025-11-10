"""MCP tool for restarting an agent."""

from typing import Annotated

from pydantic import Field

from ..models import RestartAgentResponse
from ..services import AgentService


async def restart_agent(
    agent_service: AgentService,
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=20, description="Name of the agent to restart"),
    ],
) -> RestartAgentResponse:
    """Restart an agent's workspace to refresh its environment.

    Tool: restart_agent
    User Story: US2 (Agent Lifecycle Management)
    Architecture: Layer 1 (Tool Layer)

    This stops and then starts the agent's workspace, which can help
    resolve issues or refresh the environment state.

    Args:
        agent_service: Service instance for agent business logic
        agent_name: Name of the agent to restart

    Returns:
        RestartAgentResponse with updated agent and success message

    Raises:
        AgentNotFoundError: If agent doesn't exist
        ValidationError: If agent_name is invalid
        CoderAPIError: If restart fails

    Example:
        result = await restart_agent(agent_service, agent_name="stuck-agent")
    """
    agent = await agent_service.restart_agent(agent_name)

    return RestartAgentResponse(
        agent=agent, message=f"Agent '{agent_name}' restarted successfully"
    )
