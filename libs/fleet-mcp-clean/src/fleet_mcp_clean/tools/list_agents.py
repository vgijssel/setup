"""MCP tool for listing all agents in the fleet."""

from typing import Annotated, Optional

from pydantic import Field

from ..models import AgentStatus, ListAgentsResponse
from ..services import AgentService


async def list_agents(
    agent_service: AgentService,
    status_filter: Annotated[
        Optional[AgentStatus], Field(None, description="Optional filter by agent status")
    ] = None,
    project_filter: Annotated[
        Optional[str], Field(None, description="Optional filter by project name")
    ] = None,
) -> ListAgentsResponse:
    """List all agents in the fleet with optional filtering.

    Tool: list_agents
    User Story: US1 (Agent Discovery and Inspection)
    Architecture: Layer 1 (Tool Layer)

    Args:
        agent_service: Service instance for agent business logic
        status_filter: Filter by agent status (optional)
        project_filter: Filter by project name (optional)

    Returns:
        ListAgentsResponse with agents and total count

    Example:
        # List all agents
        result = await list_agents(agent_service)

        # List only idle agents
        result = await list_agents(agent_service, status_filter=AgentStatus.IDLE)

        # List agents in Setup project
        result = await list_agents(agent_service, project_filter="Setup")
    """
    agents = await agent_service.list_agents(
        status_filter=status_filter, project_filter=project_filter
    )

    return ListAgentsResponse(agents=agents, total_count=len(agents))
