"""MCP tool for listing all available projects."""

from ..models import ListProjectsResponse
from ..services import ProjectService


async def list_agent_projects(project_service: ProjectService) -> ListProjectsResponse:
    """List all available projects (templates) that can be used to create agents.

    Tool: list_agent_projects
    User Story: US1 (Agent Discovery and Inspection)
    Architecture: Layer 1 (Tool Layer)

    Args:
        project_service: Service instance for project business logic

    Returns:
        ListProjectsResponse with projects and total count

    Example:
        result = await list_agent_projects(project_service)
    """
    projects = await project_service.list_projects()
    return ListProjectsResponse(projects=projects, total_count=len(projects))
