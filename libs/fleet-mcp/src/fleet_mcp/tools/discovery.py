"""Discovery MCP tools for roles and projects"""
from typing import Annotated
from fastmcp import FastMCP
from pydantic import Field
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.coder.discovery import get_valid_fleet_mcp_projects
from fleet_mcp.models.responses import ListProjectsResponse, ListRolesResponse
from fleet_mcp.models.project import Project
from fleet_mcp.models.role import Role


def register_discovery_tools(mcp: FastMCP, coder_client: CoderClient):
    """Register discovery tools with MCP server"""

    # T097: list_agent_projects tool
    @mcp.tool()
    async def list_agent_projects() -> ListProjectsResponse:
        """
        List all available projects mapped to Coder templates.

        Returns only templates that are valid fleet-mcp projects:
        - Have a display_name set
        - Have rich parameters "ai_prompt" and "system_prompt" defined
        """
        # Get valid fleet-mcp projects
        templates = await get_valid_fleet_mcp_projects(coder_client)

        # Convert to Project models
        projects = []
        for template in templates:
            project = Project(
                name=template.get("name", ""),
                display_name=template.get("display_name", ""),
                description=template.get("description", ""),
                template_id=template.get("id", ""),
                template_name=template.get("name", "")
            )
            projects.append(project)

        return ListProjectsResponse(projects=projects)

    # T096: list_agent_roles tool
    @mcp.tool()
    async def list_agent_roles(
        project: Annotated[str, Field(description="Project name to query roles for")]
    ) -> ListRolesResponse:
        """
        List all available agent roles for a specific project.

        Roles are defined as Coder workspace presets in the project's template.
        Only considers projects that are valid fleet-mcp projects.
        """
        # Validate that project is a valid fleet-mcp project
        templates = await get_valid_fleet_mcp_projects(coder_client)
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

        # Get template details to access workspace presets
        template_id = template_data.get("id")
        template_details = await coder_client.get_template(template_id)

        # Extract workspace presets (roles)
        workspace_presets = template_details.get("workspace_presets", [])

        # Convert to Role models
        roles = []
        for preset in workspace_presets:
            role = Role(
                name=preset.get("name", ""),
                display_name=preset.get("display_name", preset.get("name", "")),
                description=preset.get("description", ""),
                template_id=template_id
            )
            roles.append(role)

        # If no workspace presets are defined, provide a default "coder" role
        # This ensures the system is still usable even without preset configuration
        if not roles:
            roles.append(Role(
                name="coder",
                display_name="Software Engineer",
                description="Default role for writing code and implementing features",
                template_id=template_id
            ))

        return ListRolesResponse(roles=roles)
