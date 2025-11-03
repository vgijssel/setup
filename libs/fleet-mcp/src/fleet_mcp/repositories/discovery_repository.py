"""Discovery repository for data access and transformation"""

from typing import Any

from fleet_mcp import config
from fleet_mcp.clients.coder_client import CoderClient


class DiscoveryRepository:
    """Repository for discovery-related data access"""

    def __init__(self):
        """Initialize repository with Coder client"""
        self._client = CoderClient(
            base_url=config.CODER_BASE_URL,
            token=config.CODER_TOKEN,
        )

    async def list_templates(self) -> list[dict[str, Any]]:
        """
        List all Coder templates

        Returns:
            List of template data
        """
        return await self._client.list_templates()

    async def get_template(self, template_id: str) -> dict[str, Any]:
        """
        Get template details by ID

        Args:
            template_id: Template UUID

        Returns:
            Template data
        """
        return await self._client.get_template(template_id)

    async def get_template_version_rich_parameters(
        self, template_version_id: str
    ) -> list[dict[str, Any]]:
        """
        Get rich parameters for a template version

        Args:
            template_version_id: Template version UUID

        Returns:
            List of rich parameter definitions
        """
        return await self._client.get_template_version_rich_parameters(
            template_version_id
        )
