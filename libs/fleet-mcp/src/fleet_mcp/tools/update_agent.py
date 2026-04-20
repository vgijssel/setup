"""MCP tool for updating an agent to a new template version."""

from typing import Annotated

from pydantic import Field

from ..models import UpdateAgentResponse
from ..services import AgentService


async def update_agent(
    agent_service: AgentService,
    agent_name: Annotated[
        str,
        Field(
            min_length=1,
            max_length=32,
            description="Name of the agent to update",
        ),
    ],
    template_version_id: Annotated[
        str | None,
        Field(
            default=None,
            description="Template version UUID to update to. If not provided, uses the active version of the agent's template.",
        ),
    ] = None,
) -> UpdateAgentResponse:
    """Update an agent's workspace to a new template version.

    Tool: update_agent
    User Story: US2 (Agent Lifecycle Management)
    Architecture: Layer 1 (Tool Layer)

    This updates the agent's workspace by stopping it and restarting with
    a new template version. This is useful for applying template updates,
    configuration changes, or environment updates.

    The update process follows Coder's two-step workflow:
    1. Stop the workspace and wait for completion
    2. Start with the new template version

    Args:
        agent_service: Service instance for agent business logic
        agent_name: Name of the agent to update
        template_version_id: Template version UUID to update to.
                            If None, uses the active version of the agent's template.

    Returns:
        UpdateAgentResponse with updated agent and success message

    Raises:
        AgentNotFoundError: If agent doesn't exist
        ValidationError: If agent_name or template_version_id is invalid
        CoderAPIError: If update fails

    Example:
        # Update to specific version
        result = await update_agent(
            agent_service,
            agent_name="my-agent",
            template_version_id="abc-123-def-456"
        )

        # Update to latest active version
        result = await update_agent(agent_service, agent_name="my-agent")
    """
    agent = await agent_service.update_agent(agent_name, template_version_id)

    message = (
        f"Agent '{agent_name}' updated to template version "
        f"{template_version_id if template_version_id else 'latest active version'}"
    )

    return UpdateAgentResponse(agent=agent, message=message)
