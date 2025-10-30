"""Coder API client for workspace management"""
import httpx
from typing import Any


class CoderClient:
    """HTTP client for Coder API interactions"""

    def __init__(self, base_url: str, token: str):
        """
        Initialize Coder API client

        Args:
            base_url: Coder API base URL (e.g., https://coder.example.com)
            token: Coder API authentication token
        """
        self.base_url = base_url.rstrip("/")
        self.token = token
        self.client = httpx.AsyncClient(
            headers={"Coder-Session-Token": token},
            timeout=30.0
        )

    async def __aenter__(self):
        """Async context manager entry"""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.client.aclose()

    async def create_workspace(
        self,
        name: str,
        template_name: str,
        workspace_preset: str = "coder"
    ) -> dict[str, Any]:
        """
        Create a new workspace

        Args:
            name: Workspace name
            template_name: Coder template name
            workspace_preset: Workspace preset name (role)

        Returns:
            Workspace data from Coder API
        """
        # Get template ID first
        templates_response = await self.client.get(
            f"{self.base_url}/api/v2/templates"
        )
        templates_response.raise_for_status()
        templates = templates_response.json()

        template_id = None
        for template in templates:
            if template.get("name") == template_name:
                template_id = template.get("id")
                break

        if not template_id:
            raise ValueError(f"Template '{template_name}' not found")

        # Create workspace
        response = await self.client.post(
            f"{self.base_url}/api/v2/organizations/{await self._get_org_id()}/members/me/workspaces",
            json={
                "name": name,
                "template_id": template_id,
                "rich_parameter_values": []
            }
        )
        response.raise_for_status()
        return response.json()

    async def list_workspaces(self) -> list[dict[str, Any]]:
        """
        List all workspaces for the authenticated user

        Returns:
            List of workspace data
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/workspaces"
        )
        response.raise_for_status()
        workspaces = response.json()
        return workspaces.get("workspaces", []) if isinstance(workspaces, dict) else workspaces

    async def get_workspace(self, workspace_id: str) -> dict[str, Any]:
        """
        Get workspace details by ID

        Args:
            workspace_id: Workspace UUID

        Returns:
            Workspace data
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/workspaces/{workspace_id}"
        )
        response.raise_for_status()
        return response.json()

    async def delete_workspace(self, workspace_id: str) -> dict[str, Any]:
        """
        Delete a workspace

        Args:
            workspace_id: Workspace UUID

        Returns:
            Deletion result
        """
        # Trigger workspace deletion by creating a delete build
        response = await self.client.post(
            f"{self.base_url}/api/v2/workspaces/{workspace_id}/builds",
            json={"transition": "delete"}
        )
        response.raise_for_status()
        return response.json()

    async def write_agent_metadata(
        self,
        workspace_id: str,
        agent_name: str,
        metadata: dict[str, str]
    ) -> None:
        """
        Write agent metadata by writing to files in the workspace

        Args:
            workspace_id: Workspace UUID
            agent_name: Agent name (usually "main")
            metadata: Metadata fields to write (e.g., {"agent_spec": "...", "current_task": "..."})
        """
        # This will be implemented later using coder_workspace_bash MCP tool
        # For now, this is a placeholder
        pass

    async def send_interrupt(self, workspace_id: str) -> dict[str, Any]:
        """
        Send interrupt signal to workspace (for task cancellation)

        Args:
            workspace_id: Workspace UUID

        Returns:
            Response from messages endpoint
        """
        # This is a placeholder - actual implementation depends on Coder MCP tool integration
        # The interrupt is sent via POST to messages endpoint with escape sequence
        response = await self.client.post(
            f"{self.base_url}/api/v2/workspaces/{workspace_id}/messages",
            json={"content": "\u001b", "type": "raw"}
        )
        response.raise_for_status()
        return response.json()

    async def get_agent_metadata(self, agent_id: str) -> dict[str, str]:
        """
        Get agent metadata by fetching from watch-metadata endpoint

        Args:
            agent_id: Agent UUID

        Returns:
            Dictionary mapping metadata keys to their values
        """
        import asyncio

        # Fetch one event from the SSE stream
        async with self.client.stream(
            "GET",
            f"{self.base_url}/api/v2/workspaceagents/{agent_id}/watch-metadata",
            headers={"Accept": "text/event-stream"},
            timeout=5.0
        ) as response:
            response.raise_for_status()

            # Read until we get the first data event
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    import json
                    data = json.loads(line[6:])  # Remove "data: " prefix

                    # Parse metadata into key-value dict
                    metadata = {}
                    for item in data:
                        key = item["description"]["key"]
                        value = item["result"]["value"].strip()
                        metadata[key] = value

                    return metadata

        return {}

    async def list_templates(self) -> list[dict[str, Any]]:
        """
        List all available templates

        Returns:
            List of template data
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/templates"
        )
        response.raise_for_status()
        return response.json()

    async def get_template(self, template_id: str) -> dict[str, Any]:
        """
        Get template details by ID

        Args:
            template_id: Template UUID

        Returns:
            Template data including workspace presets
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/templates/{template_id}"
        )
        response.raise_for_status()
        return response.json()

    async def _get_org_id(self) -> str:
        """
        Get the default organization ID for the authenticated user

        Returns:
            Organization UUID
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/users/me/organizations"
        )
        response.raise_for_status()
        orgs = response.json()
        if not orgs:
            raise ValueError("No organizations found for user")
        return orgs[0]["id"]
