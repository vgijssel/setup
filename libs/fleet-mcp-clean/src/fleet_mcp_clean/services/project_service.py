"""Project service for business logic and orchestration."""

from ..models import Project, Role
from ..models.errors import ValidationError
from ..repositories import ProjectRepository


class ProjectService:
    """Service for project and role business logic.

    Architecture: Layer 2 (Service Layer)
    Dependencies: ProjectRepository (Layer 3)
    Used by: MCP Tools (Layer 1)

    Responsibilities:
    - Business logic for project and role queries
    - Input validation
    - Project/role metadata enrichment
    """

    def __init__(self, project_repo: ProjectRepository):
        """Initialize service with project repository.

        Args:
            project_repo: Repository for project data access
        """
        self.project_repo = project_repo

    async def list_projects(self) -> list[Project]:
        """List all available projects (templates).

        Returns:
            List of Project domain models

        Raises:
            CoderAPIError: If Coder API request fails
        """
        return await self.project_repo.list_all()

    async def list_roles(self, project_name: str) -> list[Role]:
        """List all roles (workspace presets) for a specific project.

        Args:
            project_name: Project name to query roles for

        Returns:
            List of Role domain models for the project

        Raises:
            ValidationError: If project_name is invalid
            CoderAPIError: If project not found or API request fails
        """
        if not project_name or not project_name.strip():
            raise ValidationError("Project name cannot be empty")

        return await self.project_repo.list_roles(project_name)

    async def get_project_by_name(self, project_name: str) -> Project | None:
        """Get project by name.

        Args:
            project_name: Project name to find

        Returns:
            Project domain model or None if not found

        Raises:
            ValidationError: If project_name is invalid
        """
        if not project_name or not project_name.strip():
            raise ValidationError("Project name cannot be empty")

        projects = await self.project_repo.list_all()

        for project in projects:
            if project.name == project_name:
                return project

        return None
