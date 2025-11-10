"""Project repository for template data access."""

from typing import Any

from ..clients import CoderClient
from ..models import Project, Role
from ..models.errors import CoderAPIError


class ProjectRepository:
    """Repository for project data access using Coder template API.

    Architecture: Layer 3 (Repository Layer)
    Dependencies: CoderClient (Layer 4)
    Used by: ProjectService (Layer 2)

    Responsibilities:
    - Transform TemplateRemote ↔ Project domain models
    - Transform WorkspacePresetRemote ↔ Role domain models
    - Query Coder API for template and preset data
    - Filter templates to only include valid fleet-mcp projects
    """

    def __init__(self, coder_client: CoderClient):
        """Initialize repository with Coder API client.

        Args:
            coder_client: Async HTTP client for Coder API
        """
        self.client = coder_client

    async def list_all(self) -> list[Project]:
        """List all valid fleet-mcp projects from Coder templates.

        A template is considered a valid project if:
        1. It has a display_name set
        2. It has both ai_prompt and system_prompt rich parameters

        Returns:
            List of Project domain models

        Raises:
            CoderAPIError: If Coder API request fails
        """
        try:
            templates = await self.client.list_templates()
            projects = []

            for template in templates:
                # Filter: only templates with display_name
                display_name = template.get("display_name")
                if not display_name:
                    continue

                # Check if template has required parameters
                try:
                    template_id = template.get("id")
                    parameters = await self.client.get_template_parameters(template_id)
                    param_names = {p.get("name", "").lower() for p in parameters}

                    # Filter: must have ai_prompt and system_prompt
                    has_ai_prompt = any(
                        "ai" in name and "prompt" in name for name in param_names
                    )
                    has_system_prompt = any(
                        "system" in name and "prompt" in name for name in param_names
                    )

                    if has_ai_prompt and has_system_prompt:
                        projects.append(self._template_to_project(template))
                except Exception:
                    # Skip templates that fail parameter fetch
                    continue

            return projects
        except Exception as e:
            raise CoderAPIError(f"Failed to list projects: {e}") from e

    async def list_roles(self, project_name: str) -> list[Role]:
        """List all roles (workspace presets) for a specific project.

        Args:
            project_name: Project name (template display_name) - case insensitive

        Returns:
            List of Role domain models

        Raises:
            CoderAPIError: If project not found or API request fails

        Note:
            Project name comparison is case insensitive because the Coder API
            backend is case insensitive. For example, "Setup", "SETUP", and
            "setup" all refer to the same project.
        """
        try:
            # Find template by display_name (case insensitive)
            templates = await self.client.list_templates()
            template_id = None

            # Normalize the search name to lowercase for case-insensitive comparison
            project_name_lower = project_name.lower()

            for template in templates:
                display_name = template.get("display_name", "")
                if display_name.lower() == project_name_lower:
                    template_id = template.get("id")
                    break

            if not template_id:
                raise CoderAPIError(f"Project '{project_name}' not found")

            # Get workspace presets for this template
            presets = await self.client.list_workspace_presets(template_id)

            roles = []
            for preset in presets:
                # Handle both capitalized and lowercase keys from API
                preset_id = preset.get("ID") or preset.get("id")
                preset_name = preset.get("Name") or preset.get("name")
                preset_default = preset.get("Default") or preset.get("default", False)

                if preset_id and preset_name:
                    roles.append(
                        Role(
                            id=preset_id,
                            name=preset_name,
                            project_id=template_id,
                            project_name=project_name,
                            default=preset_default,
                        )
                    )

            return roles
        except Exception as e:
            raise CoderAPIError(
                f"Failed to list roles for project '{project_name}': {e}"
            ) from e

    def _template_to_project(self, template: dict[str, Any]) -> Project:
        """Transform Coder template API response to Project domain model.

        Args:
            template: Template dictionary from Coder API

        Returns:
            Project domain model

        Business Logic:
        - Maps template.id → project.id
        - Maps template.display_name → project.name
        - Maps template.description → project.description
        """
        return Project(
            id=template.get("id", ""),
            name=template.get("display_name", "unknown"),
            description=template.get("description"),
        )
