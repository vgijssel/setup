"""Discovery MCP tools for roles and projects"""

from typing import Annotated

from fastmcp import FastMCP
from fleet_mcp.services.discovery_service import DiscoveryService
from fleet_mcp.schemas.responses import ListProjectsResponse, ListRolesResponse
from pydantic import Field


def register_discovery_tools(mcp: FastMCP):
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
        service = DiscoveryService()
        return await service.list_agent_projects()

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
        service = DiscoveryService()
        return await service.list_agent_roles(project)
