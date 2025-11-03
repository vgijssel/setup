"""Agent repository for data access and transformation"""

from typing import Any

from fleet_mcp import config
from fleet_mcp.clients.coder_client import CoderClient
from fleet_mcp.schemas.agent import Agent


class AgentRepository:
    """Repository for agent-related data access"""

    def __init__(self):
        """Initialize repository with Coder client"""
        self._client = CoderClient(
            base_url=config.CODER_BASE_URL,
            token=config.CODER_TOKEN,
        )

    async def create_agent(
        self,
        name: str,
        template_name: str,
        role: str,
        task: str,
    ) -> dict[str, Any]:
        """
        Create a new agent workspace

        Args:
            name: Agent name
            template_name: Template to use for workspace
            role: Agent role (workspace preset)
            task: Task description (ai_prompt)

        Returns:
            Workspace data from Coder API
        """
        return await self._client.create_workspace(
            name=f"agent-{name}",
            template_name=template_name,
            workspace_preset=role,
            ai_prompt=task,
        )

    async def list_agents(self) -> list[dict[str, Any]]:
        """
        List all workspaces

        Returns:
            List of workspace data
        """
        return await self._client.list_workspaces()

    async def get_agent_by_name(self, name: str) -> dict[str, Any] | None:
        """
        Get agent workspace by name (case-insensitive)

        Args:
            name: Agent name

        Returns:
            Workspace data or None if not found
        """
        workspaces = await self._client.list_workspaces()
        name_lower = name.lower()
        expected_workspace_name = f"agent-{name_lower}"

        for workspace in workspaces:
            workspace_name = workspace.get("name", "")
            if workspace_name.lower() == expected_workspace_name:
                return workspace

        return None

    async def get_agent_details(self, workspace_id: str) -> dict[str, Any]:
        """
        Get detailed agent workspace information

        Args:
            workspace_id: Workspace UUID

        Returns:
            Workspace details from Coder API
        """
        return await self._client.get_workspace(workspace_id)

    async def delete_agent(self, workspace_id: str) -> dict[str, Any]:
        """
        Delete an agent workspace

        Args:
            workspace_id: Workspace UUID

        Returns:
            Deletion result from Coder API
        """
        return await self._client.delete_workspace(workspace_id)

    async def get_template(self, template_id: str) -> dict[str, Any]:
        """
        Get template details

        Args:
            template_id: Template UUID

        Returns:
            Template data
        """
        return await self._client.get_template(template_id)
