"""Helper functions for discovering valid fleet-mcp projects and roles"""

from typing import Any

from fleet_mcp.coder.client import CoderClient


async def get_valid_fleet_mcp_projects(
    coder_client: CoderClient,
) -> list[dict[str, Any]]:
    """
    Get all valid fleet-mcp projects from Coder templates.

    A template is considered a valid fleet-mcp project if it:
    1. Has a display_name set (non-empty)
    2. Has rich parameters "ai_prompt" and "system_prompt" defined

    Args:
        coder_client: CoderClient instance

    Returns:
        List of template data for valid fleet-mcp projects
    """
    templates = await coder_client.list_templates()
    valid_projects = []

    for template in templates:
        # Check if template has display_name
        display_name = template.get("display_name", "").strip()
        if not display_name:
            continue

        # Get the active version to check rich parameters
        template_id = template.get("id")
        if not template_id:
            continue

        try:
            template_details = await coder_client.get_template(template_id)
            active_version_id = template_details.get("active_version_id")

            if not active_version_id:
                continue

            # Get rich parameters
            rich_params = await coder_client.get_template_version_rich_parameters(
                active_version_id
            )
            param_names = {
                param.get("name", "").lower().replace(" ", "_") for param in rich_params
            }

            # Check for required parameters (case-insensitive with space handling)
            has_ai_prompt = "ai_prompt" in param_names
            has_system_prompt = "system_prompt" in param_names

            if has_ai_prompt and has_system_prompt:
                valid_projects.append(template)

        except Exception:
            # Skip templates that fail to fetch details
            continue

    return valid_projects


async def get_valid_fleet_mcp_project_names(coder_client: CoderClient) -> set[str]:
    """
    Get set of valid fleet-mcp project names for validation.

    Args:
        coder_client: CoderClient instance

    Returns:
        Set of project names (template names) that are valid fleet-mcp projects
    """
    projects = await get_valid_fleet_mcp_projects(coder_client)
    return {project.get("name") for project in projects if project.get("name")}


async def is_valid_fleet_mcp_project(
    coder_client: CoderClient, project_name: str
) -> bool:
    """
    Check if a project name is a valid fleet-mcp project.

    Args:
        coder_client: CoderClient instance
        project_name: Name of the project to check

    Returns:
        True if the project is a valid fleet-mcp project, False otherwise
    """
    valid_names = await get_valid_fleet_mcp_project_names(coder_client)
    return project_name in valid_names


async def resolve_project_identifier_to_template_name(
    coder_client: CoderClient, project_identifier: str
) -> str:
    """
    Resolve project name OR display_name to template name.

    Tries exact match on template name first (for backwards compatibility),
    then tries display_name match (case-insensitive for better UX).

    Args:
        coder_client: CoderClient instance
        project_identifier: Project template name or display name (e.g., "Setup", "coder-devcontainer")

    Returns:
        Template name that matches the identifier

    Raises:
        ValueError: If no matching project found, with helpful message listing both valid names and display_names
    """
    projects = await get_valid_fleet_mcp_projects(coder_client)

    # First pass: Try exact match on template name (backwards compatibility)
    for project in projects:
        if project.get("name") == project_identifier:
            return project.get("name")

    # Second pass: Try case-insensitive match on display_name
    project_identifier_lower = project_identifier.lower()
    for project in projects:
        display_name = project.get("display_name", "")
        if display_name.lower() == project_identifier_lower:
            return project.get("name")

    # Not found - build helpful error message with both names and display_names
    if not projects:
        raise ValueError(
            f"Project '{project_identifier}' not found. No valid fleet-mcp projects are available."
        )

    # Build list showing both display_name and technical name
    project_list = []
    for project in projects:
        name = project.get("name", "")
        display_name = project.get("display_name", "")
        if display_name and display_name != name:
            project_list.append(f"{display_name} ({name})")
        else:
            project_list.append(name)

    raise ValueError(
        f"Project '{project_identifier}' not found or is not a valid fleet-mcp project. "
        f"Valid projects must have ai_prompt and system_prompt parameters. "
        f"Available projects: {', '.join(sorted(project_list))}"
    )
