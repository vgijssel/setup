"""MCP tool for showing agent conversation logs."""

from typing import Annotated

from pydantic import Field

from ..services import TaskService


async def show_agent_log(
    task_service: TaskService,
    agent_name: Annotated[str, Field(description="Name of the agent")],
    page: Annotated[int, Field(ge=1, description="Page number (1-indexed)")] = 1,
    page_size: Annotated[
        int, Field(ge=1, le=100, description="Items per page (max 100)")
    ] = 1,
) -> dict:
    """Show paginated conversation logs for an agent.

    Tool: show_agent_log
    User Story: US4 (Task and Log History Tracking)
    Architecture: Layer 1 (Tool Layer)

    Returns conversation logs ordered by time descending (newest first).
    Default page size is 1 to show only the latest message.

    Args:
        task_service: Service instance for task business logic
        agent_name: Name of the agent to query
        page: Page number (1-indexed, default 1)
        page_size: Items per page (1-100, default 1 for latest only)

    Returns:
        Dictionary with logs, pagination metadata

    Raises:
        AgentNotFoundError: If agent doesn't exist
        ValueError: If pagination parameters are invalid
    """
    logs, total_count = await task_service.get_conversation_logs(
        agent_name, page, page_size
    )

    # Calculate pagination metadata
    has_next_page = (page * page_size) < total_count
    has_previous_page = page > 1

    return {
        "agent_name": agent_name,
        "logs": logs,
        "total_count": total_count,
        "page": page,
        "page_size": page_size,
        "has_next_page": has_next_page,
        "has_previous_page": has_previous_page,
    }
