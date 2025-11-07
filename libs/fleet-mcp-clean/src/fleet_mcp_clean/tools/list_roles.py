"""MCP tool for listing available roles for a project."""

from typing import Annotated

from pydantic import Field

from ..models import ListRolesResponse
from ..services import ProjectService


async def list_agent_roles(
    project_service: ProjectService,
    project: Annotated[str, Field(description="Project name to query roles for")],
) -> ListRolesResponse:
    """List all available roles (workspace presets) for a specific project.

    Tool: list_agent_roles
    User Story: US1 (Agent Discovery and Inspection)
    Architecture: Layer 1 (Tool Layer)

    Args:
        project_service: Service instance for project business logic
        project: Project name to query roles for

    Returns:
        ListRolesResponse with roles, project name, and total count

    Raises:
        ValidationError: If project name is invalid
        CoderAPIError: If project not found

    Example:
        result = await list_agent_roles(project_service, project="Setup")
    """
    roles = await project_service.list_roles(project)
    return ListRolesResponse(
        roles=roles, project_name=project, total_count=len(roles)
    )
