"""Helper functions for discovering valid fleet-mcp projects and roles"""
from typing import Any
from fleet_mcp.coder.client import CoderClient


async def get_valid_fleet_mcp_projects(coder_client: CoderClient) -> list[dict[str, Any]]:
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
            rich_params = await coder_client.get_template_version_rich_parameters(active_version_id)
            param_names = {
                param.get("name", "").lower().replace(" ", "_")
                for param in rich_params
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


async def is_valid_fleet_mcp_project(coder_client: CoderClient, project_name: str) -> bool:
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
