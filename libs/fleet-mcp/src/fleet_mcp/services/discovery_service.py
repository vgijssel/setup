"""Discovery service for business logic and orchestration"""

from typing import Any

from fleet_mcp.repositories.discovery_repository import DiscoveryRepository
from fleet_mcp.schemas.project import Project
from fleet_mcp.schemas.responses import ListProjectsResponse, ListRolesResponse
from fleet_mcp.schemas.role import Role


class DiscoveryService:
    """Service for discovery-related business logic"""

    def __init__(self):
        """Initialize service with repository"""
        self._discovery_repo = DiscoveryRepository()

    async def list_agent_projects(self) -> ListProjectsResponse:
        """
        List all available fleet-mcp projects

        Returns:
            ListProjectsResponse with valid fleet-mcp projects
        """
        templates = await self._get_valid_fleet_mcp_projects()

        # Convert to Project models
        projects = []
        for template in templates:
            project = Project(
                name=template.get("name", ""),
                display_name=template.get("display_name", ""),
                description=template.get("description", ""),
                template_id=template.get("id", ""),
                template_name=template.get("name", ""),
            )
            projects.append(project)

        return ListProjectsResponse(projects=projects)

    async def list_agent_roles(self, project: str) -> ListRolesResponse:
        """
        List all available roles for a project

        Args:
            project: Project name

        Returns:
            ListRolesResponse with available roles

        Raises:
            ValueError: If project is not a valid fleet-mcp project
        """
        # Validate project
        templates = await self._get_valid_fleet_mcp_projects()
        template_data = None

        for template in templates:
            if template.get("name") == project:
                template_data = template
                break

        if not template_data:
            raise ValueError(
                f"Project '{project}' not found or is not a valid fleet-mcp project. "
                f"Valid fleet-mcp projects must have ai_prompt and system_prompt parameters."
            )

        # Get template details
        template_id = template_data.get("id")
        template_details = await self._discovery_repo.get_template(template_id)

        # Extract workspace presets (roles)
        workspace_presets = template_details.get("workspace_presets", [])

        # Convert to Role models
        roles = []
        for preset in workspace_presets:
            role = Role(
                name=preset.get("name", ""),
                display_name=preset.get("display_name", preset.get("name", "")),
                description=preset.get("description", ""),
                template_id=template_id,
            )
            roles.append(role)

        # Default role if none defined
        if not roles:
            roles.append(
                Role(
                    name="coder",
                    display_name="Software Engineer",
                    description="Default role for writing code and implementing features",
                    template_id=template_id,
                )
            )

        return ListRolesResponse(roles=roles)

    async def _get_valid_fleet_mcp_projects(self) -> list[dict[str, Any]]:
        """
        Get all valid fleet-mcp projects

        Returns:
            List of template data for valid projects
        """
        templates = await self._discovery_repo.list_templates()
        valid_projects = []

        for template in templates:
            display_name = template.get("display_name", "").strip()
            if not display_name:
                continue

            template_id = template.get("id")
            if not template_id:
                continue

            try:
                template_details = await self._discovery_repo.get_template(template_id)
                active_version_id = template_details.get("active_version_id")

                if not active_version_id:
                    continue

                rich_params = await self._discovery_repo.get_template_version_rich_parameters(
                    active_version_id
                )
                param_names = {
                    param.get("name", "").lower().replace(" ", "_")
                    for param in rich_params
                }

                if "ai_prompt" in param_names and "system_prompt" in param_names:
                    valid_projects.append(template)

            except Exception:
                continue

        return valid_projects
