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
            ai_prompt: AI prompt for the workspace (task description)
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

    async def get_workspace_build_resources(
        self, workspace_build_id: str
    ) -> list[dict[str, Any]]:
        """
        Get resources from a workspace build

        Retrieves all resources provisioned by a workspace build, including
        agents and their associated applications.

        Args:
            workspace_build_id: Workspace build UUID

        Returns:
            List of resource data including agents and apps
        """
        response = await self.client.get(
            f"{self.base_url}/api/v2/workspacebuilds/{workspace_build_id}/resources"
        )
        response.raise_for_status()
        return response.json()

    async def get_agentapi_url(self, workspace: dict[str, Any]) -> str | None:
        """
        Get the AgentAPI application URL for a workspace

        Constructs the URL to access the AgentAPI (Claude Code) application
        running inside a workspace. This URL can be used to send commands
        like Ctrl+C for task cancellation.

        Args:
            workspace: Workspace data dict containing id, name, owner info

        Returns:
            AgentAPI URL (e.g., https://coder.com/@owner/workspace.id/apps/ccw/)
            or None if AgentAPI app is not found

        Raises:
            ValueError: If workspace data is invalid
        """
        workspace_id = workspace.get("id")
        workspace_name = workspace.get("name")
        owner_name = workspace.get("owner_name")
        latest_build = workspace.get("latest_build")

        if not all([workspace_id, workspace_name, owner_name]):
            raise ValueError("Invalid workspace data: missing id, name, or owner_name")

        if not latest_build or not isinstance(latest_build, dict):
            raise ValueError("Invalid workspace: latest_build is missing or invalid")

        build_id = latest_build.get("id")
        if not build_id:
            raise ValueError("Invalid workspace: latest_build missing id")

        # Get workspace build resources to find agents and apps
        resources = await self.get_workspace_build_resources(build_id)

        # Find the AgentAPI app
        # Look for apps with slug containing "ccw" (Claude Code Web) or "agentapi"
        for resource in resources:
            agents = resource.get("agents", [])
            for agent in agents:
                apps = agent.get("apps", [])
                for app in apps:
                    app_slug = app.get("slug", "").lower()
                    # Claude Code Web app or any app with agentapi in the name
                    if (
                        "ccw" in app_slug
                        or "agentapi" in app_slug
                        or "claude" in app_slug
                    ):
                        # Construct the application URL
                        # Format: {base_url}/@{owner}/{workspace}.{workspace_id}/apps/{app_slug}/
                        app_url = f"{self.base_url}/@{owner_name}/{workspace_name}.{workspace_id}/apps/{app.get('slug')}/"
                        return app_url

        return None

    async def send_agentapi_interrupt(self, agentapi_url: str) -> dict[str, Any]:
        """
        Send interrupt signal (Ctrl+C) to AgentAPI

        Sends a SIGINT signal via the AgentAPI's /message endpoint to cancel
        the currently running task. This bypasses gateway timeouts by using
        the application proxy.

        Based on research from agent Papi: AgentAPI accepts raw terminal
        control characters via POST to /message endpoint.

        Args:
            agentapi_url: Base URL of the AgentAPI app (from get_agentapi_url)

        Returns:
            Response from AgentAPI (typically empty dict for success)

        Raises:
            httpx.HTTPStatusError: If the request fails
        """
        # Send ESC (\\u001b) as a raw message
        # This is equivalent to sending SIGINT to the running Claude Code process
        response = await self.client.post(
            f"{agentapi_url}message",  # agentapi_url already ends with /
            json={"type": "raw", "content": "\u001b"},
            headers={"Content-Type": "application/json"},
        )
        response.raise_for_status()

        # AgentAPI might return empty response or JSON
        if response.status_code == 204:
            return {}
        return response.json() if response.text else {}

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
