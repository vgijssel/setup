"""Coder API client for workspace management"""

from typing import Any

import httpx


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
            headers={"Coder-Session-Token": token}, timeout=30.0
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
        workspace_preset: str = "coder",
        ai_prompt: str | None = None,
        system_prompt: str | None = None,
    ) -> dict[str, Any]:
        """
        Create a new workspace

        Args:
            name: Workspace name
            template_name: Coder template name
            workspace_preset: Workspace preset name (role)
            ai_prompt: AI prompt for the workspace (spec)
            system_prompt: System prompt override (optional)

        Returns:
            Workspace data from Coder API
        """
        # Get template ID first
        templates_response = await self.client.get(f"{self.base_url}/api/v2/templates")
        templates_response.raise_for_status()
        templates = templates_response.json()

        template_id = None
        for template in templates:
            if template.get("name") == template_name:
                template_id = template.get("id")
                break

        if not template_id:
            raise ValueError(f"Template '{template_name}' not found")

        # Get template details to get active version ID
        template_details = await self.get_template(template_id)
        active_version_id = template_details.get("active_version_id")

        if not active_version_id:
            raise ValueError(f"Template '{template_name}' has no active version")

        # Get rich parameters from the active template version
        rich_parameters = await self.get_template_version_rich_parameters(
            active_version_id
        )
        param_names = {param.get("name") for param in rich_parameters}

        # Find the actual parameter names (may have different casing/spaces)
        ai_prompt_param_name = next(
            (
                name
                for name in param_names
                if name.lower().replace(" ", "_") == "ai_prompt"
            ),
            None,
        )
        system_prompt_param_name = next(
            (
                name
                for name in param_names
                if name.lower().replace(" ", "_") == "system_prompt"
            ),
            None,
        )

        # Validate if ai_prompt or system_prompt are provided but template doesn't support them
        if ai_prompt is not None and not ai_prompt_param_name:
            raise ValueError(
                f"Template '{template_name}' does not have 'ai_prompt' or 'AI Prompt' parameter. "
                f"Please update the template to include this parameter or set ai_prompt=None."
            )
        if system_prompt is not None and not system_prompt_param_name:
            raise ValueError(
                f"Template '{template_name}' does not have 'system_prompt' or 'System Prompt' parameter. "
                f"Please update the template to include this parameter or set system_prompt=None."
            )

        # Build rich parameter values using the actual parameter names
        rich_parameter_values = []

        if ai_prompt is not None and ai_prompt_param_name:
            rich_parameter_values.append(
                {"name": ai_prompt_param_name, "value": ai_prompt}
            )

        if system_prompt is not None and system_prompt_param_name:
            rich_parameter_values.append(
                {"name": system_prompt_param_name, "value": system_prompt}
            )

        # Create workspace
        response = await self.client.post(
            f"{self.base_url}/api/v2/organizations/{await self._get_org_id()}/members/me/workspaces",
            json={
                "name": name,
                "template_id": template_id,
                "rich_parameter_values": rich_parameter_values,
            },
        )
        response.raise_for_status()
        return response.json()

    async def list_workspaces(self) -> list[dict[str, Any]]:
        """
        List all workspaces for the authenticated user

        Returns:
            List of workspace data
        """
        response = await self.client.get(f"{self.base_url}/api/v2/workspaces")
        response.raise_for_status()
        workspaces = response.json()
        return (
            workspaces.get("workspaces", [])
            if isinstance(workspaces, dict)
            else workspaces
        )

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
            json={"transition": "delete"},
        )
        response.raise_for_status()
        return response.json()

    async def write_agent_metadata(
        self, workspace_id: str, agent_name: str, metadata: dict[str, str | None]
    ) -> None:
        """
        Write agent metadata by writing to files in the workspace.

        **LIMITATION**: This method requires the Coder MCP tools (mcp__coder__coder_workspace_bash)
        to be available, as the Coder REST API does not support direct file writes to workspaces.

        For production use, agents should write their own metadata using the coder_report_task tool
        and metadata scripts in /home/coder/.config/coder/metadata/.

        Args:
            workspace_id: Workspace UUID
            agent_name: Agent name (usually "main")
            metadata: Metadata fields to write (e.g., {"fleet_mcp_agent_name": "..."})

        Raises:
            NotImplementedError: This method cannot be implemented using REST API alone
        """
        # NOTE: Writing metadata requires executing bash commands in the workspace,
        # which is not available through the Coder REST API. It requires the Coder MCP tools.
        #
        # In production, agents write their own metadata through:
        # 1. coder_report_task MCP tool (for task history)
        # 2. Metadata scripts in /home/coder/.config/coder/metadata/ (for custom fields)
        #
        # This is a placeholder for future implementation using Coder MCP tools.
        pass

    async def update_workspace_metadata(
        self, workspace_id: str, metadata_updates: dict[str, str | None]
    ) -> dict[str, Any]:
        """
        Update workspace metadata fields (implementation note: Coder API doesn't support PATCH,
        so we need to use the write_agent_metadata approach via workspace files)

        Args:
            workspace_id: Workspace UUID
            metadata_updates: Metadata fields to update (None values clear the field)

        Returns:
            Updated workspace data
        """
        # Get agent name from workspace metadata
        # For fleet-mcp agents, agent_name is typically "main"
        agent_name = "main"

        # Use write_agent_metadata to update the files
        await self.write_agent_metadata(workspace_id, agent_name, metadata_updates)

        # Return updated workspace
        return await self.get_workspace(workspace_id)

    async def send_interrupt(self, username: str, workspace_id: str) -> dict[str, Any]:
        """
        Send interrupt signal to workspace (for task cancellation)

        Uses the experimental task endpoint to send a raw escape sequence (\u001b)
        to interrupt the currently running task. This is sent as a "raw" message
        type which writes directly to the terminal without being logged.

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID

        Returns:
            Response from experimental task send endpoint (204 No Content)
        """
        # Send escape sequence as raw input via experimental task API
        # The escape character (\u001b) interrupts the current task
        response = await self.client.post(
            f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}/send",
            json={"input": "\u001b"},
        )
        response.raise_for_status()
        # 204 No Content returns empty response
        return {} if response.status_code == 204 else response.json()

    async def get_agent_metadata(self, agent_id: str) -> dict[str, str]:
        """
        Get agent metadata by fetching from watch-metadata endpoint

        Args:
            agent_id: Agent UUID

        Returns:
            Dictionary mapping metadata keys to their values
        """

        # Fetch one event from the SSE stream
        async with self.client.stream(
            "GET",
            f"{self.base_url}/api/v2/workspaceagents/{agent_id}/watch-metadata",
            headers={"Accept": "text/event-stream"},
            timeout=5.0,
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
        response = await self.client.get(f"{self.base_url}/api/v2/templates")
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

    async def get_template_version_rich_parameters(
        self, template_version_id: str
    ) -> list[dict[str, Any]]:
        """
        Get rich parameters for a template version

        Args:
            template_version_id: Template version UUID

        Returns:
            List of rich parameter definitions with name, type, description, etc.
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/templateversions/{template_version_id}/rich-parameters"
        )
        response.raise_for_status()
        return response.json()

    async def get_task(self, username: str, workspace_id: str) -> dict[str, Any] | None:
        """
        Get AI task status from experimental task API

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID

        Returns:
            Task data from experimental API or None if no task exists
        """
        response = await self.client.get(
            f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}"
        )

        # 404 or 400 means no task exists for this workspace (or invalid request)
        if response.status_code in (400, 404):
            return None

        response.raise_for_status()
        return response.json()

    async def send_task_input(
        self, username: str, workspace_id: str, task_input: str
    ) -> None:
        """
        Send input/message to an AI task via experimental task API

        Submits new input to the task's sidebar app. This sends a message to
        the AgentAPI running in the workspace.

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID
            task_input: Message/input to send to the task (must be non-empty)

        Raises:
            httpx.HTTPStatusError: If the request fails (e.g., task not in stable state)
        """
        if not task_input or not task_input.strip():
            raise ValueError("Task input cannot be empty")

        response = await self.client.post(
            f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}/send",
            json={"input": task_input},
        )
        response.raise_for_status()

    async def get_task_logs(
        self, username: str, workspace_id: str
    ) -> list[dict[str, Any]]:
        """
        Get AI task conversation logs from experimental task API

        Retrieves conversation logs for a specific AI task. Logs include both
        user inputs and assistant outputs.

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID

        Returns:
            List of log entries, each containing id, timestamp, type, and content.
            Returns empty list if no task exists or logs are not available.
        """
        response = await self.client.get(
            f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}/logs"
        )

        # 400 or 404 means no task exists or logs are not available
        if response.status_code in (400, 404):
            return []

        response.raise_for_status()
        data = response.json()
        return data.get("logs", [])

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
