"""Coder API HTTP client for workspace and template management."""

import os
from typing import Any

import httpx

from .exceptions import ConflictError, HTTPError, NotFoundError


class CoderClient:
    """Async HTTP client for Coder API interactions.

    This client handles all direct HTTP communication with the Coder API,
    including workspace management, template queries, and workspace applications.

    Architecture: Layer 4 (Client Layer)
    Dependencies: httpx (external HTTP client)
    Used by: Repository Layer (AgentRepository, TaskRepository, ProjectRepository)
    """

    def __init__(self, base_url: str | None = None, token: str | None = None):
        """Initialize Coder API client with configuration from environment.

        Args:
            base_url: Coder API base URL (defaults to CODER_URL env var)
            token: Coder API authentication token (defaults to CODER_SESSION_TOKEN env var)

        Raises:
            ValueError: If base_url or token are not provided and not in environment
        """
        self.base_url = (base_url or os.getenv("CODER_URL", "")).rstrip("/")
        self.token = token or os.getenv("CODER_SESSION_TOKEN", "")

        if not self.base_url:
            raise ValueError(
                "Coder URL not provided. Set CODER_URL environment variable or pass base_url parameter."
            )
        if not self.token:
            raise ValueError(
                "Coder session token not provided. Set CODER_SESSION_TOKEN environment variable or pass token parameter."
            )

        self.client = httpx.AsyncClient(
            headers={"Coder-Session-Token": self.token},
            timeout=30.0,
            follow_redirects=True,
        )
        self._org_id_cache: str | None = None

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit - close HTTP client."""
        await self.client.aclose()

    async def close(self):
        """Explicitly close the HTTP client connection pool."""
        await self.client.aclose()

    # ========================================================================
    # Workspace Operations
    # ========================================================================

    async def list_workspaces(self, owner: str = "me") -> list[dict[str, Any]]:
        """List all workspaces for a specific owner.

        Args:
            owner: Owner filter (defaults to "me" for authenticated user)

        Returns:
            List of workspace dictionaries from Coder API

        Raises:
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/v2/workspaces",
                params={"owner": owner} if owner != "me" else {},
            )
            response.raise_for_status()
            data = response.json()
            # API returns {"workspaces": [...]} or [] depending on version
            return data.get("workspaces", []) if isinstance(data, dict) else data
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def get_workspace(self, workspace_id: str) -> dict[str, Any]:
        """Get detailed workspace information by ID.

        Args:
            workspace_id: Workspace UUID

        Returns:
            Workspace dictionary from Coder API

        Raises:
            NotFoundError: If workspace doesn't exist
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(f"Workspace {workspace_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def create_workspace(
        self,
        name: str,
        template_id: str,
        preset_id: str,
        rich_parameter_values: list[dict[str, str]],
    ) -> dict[str, Any]:
        """Create a new workspace from a template with specific parameters.

        Args:
            name: Unique workspace name
            template_id: Coder template UUID
            preset_id: Workspace preset UUID (defines role/resources)
            rich_parameter_values: List of {"name": "param_name", "value": "param_value"}

        Returns:
            Created workspace dictionary from Coder API

        Raises:
            ConflictError: If workspace name already exists
            HTTPError: If API request fails
        """
        try:
            org_id = await self.get_organization_id()
            response = await self.client.post(
                f"{self.base_url}/api/v2/organizations/{org_id}/members/me/workspaces",
                json={
                    "name": name,
                    "template_id": template_id,
                    "template_version_preset_id": preset_id,
                    "rich_parameter_values": rich_parameter_values,
                },
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 409:
                raise ConflictError(
                    f"Workspace with name '{name}' already exists"
                ) from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def delete_workspace(self, workspace_id: str) -> dict[str, Any]:
        """Delete a workspace by ID (forceful deletion).

        Args:
            workspace_id: Workspace UUID

        Returns:
            Deletion result dictionary from Coder API

        Raises:
            NotFoundError: If workspace doesn't exist
            HTTPError: If API request fails
        """
        try:
            response = await self.client.delete(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}"
            )
            response.raise_for_status()
            return response.json() if response.content else {"status": "deleted"}
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(f"Workspace {workspace_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def restart_workspace(self, workspace_id: str) -> dict[str, Any]:
        """Restart a workspace by stopping and starting it.

        Args:
            workspace_id: Workspace UUID

        Returns:
            Workspace build dictionary from Coder API

        Raises:
            NotFoundError: If workspace doesn't exist
            HTTPError: If API request fails
        """
        try:
            # Stop the workspace
            stop_response = await self.client.post(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}/builds",
                json={"transition": "stop"},
            )
            stop_response.raise_for_status()

            # Start the workspace
            start_response = await self.client.post(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}/builds",
                json={"transition": "start"},
            )
            start_response.raise_for_status()
            return start_response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(f"Workspace {workspace_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def get_workspace_applications(
        self, workspace_id: str
    ) -> list[dict[str, Any]]:
        """Get list of applications exposed by a workspace (e.g., AgentAPI).

        Args:
            workspace_id: Workspace UUID

        Returns:
            List of application dictionaries with URLs

        Raises:
            NotFoundError: If workspace doesn't exist
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}"
            )
            response.raise_for_status()
            workspace_data = response.json()

            # Extract applications from the latest build's resources
            latest_build = workspace_data.get("latest_build", {})
            resources = latest_build.get("resources", [])

            applications = []
            for resource in resources:
                agents = resource.get("agents", [])
                for agent in agents:
                    apps = agent.get("apps", [])
                    applications.extend(apps)

            return applications
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(f"Workspace {workspace_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    # ========================================================================
    # Template Operations
    # ========================================================================

    async def list_templates(self) -> list[dict[str, Any]]:
        """List all available Coder templates.

        Returns:
            List of template dictionaries from Coder API

        Raises:
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(f"{self.base_url}/api/v2/templates")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def get_template(self, template_id: str) -> dict[str, Any]:
        """Get template details by ID.

        Args:
            template_id: Template UUID

        Returns:
            Template dictionary from Coder API

        Raises:
            NotFoundError: If template doesn't exist
            HTTPError: If API request fails
        """
        try:
            # Get organization first to construct proper URL
            org_id = await self.get_organization_id()
            response = await self.client.get(
                f"{self.base_url}/api/v2/organizations/{org_id}/templates/{template_id}"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(f"Template {template_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def get_template_parameters(
        self, template_id: str
    ) -> list[dict[str, Any]]:
        """Get rich parameters for a template's active version.

        Args:
            template_id: Template UUID

        Returns:
            List of parameter dictionaries from Coder API

        Raises:
            NotFoundError: If template doesn't exist or has no active version
            HTTPError: If API request fails
        """
        try:
            template = await self.get_template(template_id)
            active_version_id = template.get("active_version_id")

            if not active_version_id:
                raise NotFoundError(
                    f"Template {template_id} has no active version"
                )

            response = await self.client.get(
                f"{self.base_url}/api/v2/templateversions/{active_version_id}/rich-parameters"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(
                    f"Template parameters not found for template {template_id}"
                ) from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def list_workspace_presets(self, template_id: str) -> list[dict[str, Any]]:
        """Get workspace presets (roles) for a template's active version.

        Args:
            template_id: Template UUID

        Returns:
            List of preset dictionaries from Coder API

        Raises:
            NotFoundError: If template doesn't exist or has no active version
            HTTPError: If API request fails
        """
        try:
            template = await self.get_template(template_id)
            active_version_id = template.get("active_version_id")

            if not active_version_id:
                raise NotFoundError(
                    f"Template {template_id} has no active version"
                )

            response = await self.client.get(
                f"{self.base_url}/api/v2/templateversions/{active_version_id}/presets"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(
                    f"Workspace presets not found for template {template_id}"
                ) from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    # ========================================================================
    # Task Operations (via AgentAPI and Experimental Task API)
    # ========================================================================

    async def send_task_to_workspace(
        self, workspace_id: str, task_description: str
    ) -> dict[str, Any]:
        """Send a task to a workspace via experimental task API.

        Args:
            workspace_id: Workspace UUID
            task_description: Task description/instructions

        Returns:
            Task assignment result dictionary

        Raises:
            HTTPError: If API request fails
        """
        try:
            response = await self.client.post(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}/tasks",
                json={"description": task_description},
            )
            response.raise_for_status()
            return response.json() if response.content else {"status": "sent"}
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def send_interrupt_signal(self, agent_api_url: str) -> dict[str, Any]:
        """Send Ctrl+C interrupt signal to workspace via AgentAPI.

        Args:
            agent_api_url: Full URL to AgentAPI /message endpoint

        Returns:
            Interrupt signal result dictionary

        Raises:
            HTTPError: If API request fails
        """
        try:
            # Send Ctrl+C signal as raw message (\u0003 is ASCII ETX / Ctrl+C)
            response = await self.client.post(
                agent_api_url, json={"type": "raw", "content": "\u0003"}
            )
            response.raise_for_status()
            return response.json() if response.content else {"status": "interrupted"}
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to AgentAPI: {e}") from e

    async def get_task_history(
        self, workspace_id: str, page: int = 1, page_size: int = 20
    ) -> dict[str, Any]:
        """Get paginated task history for a workspace.

        Args:
            workspace_id: Workspace UUID
            page: Page number (1-indexed)
            page_size: Items per page (max 100)

        Returns:
            Task history with pagination metadata

        Raises:
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}/tasks/history",
                params={"page": page, "page_size": min(page_size, 100)},
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def get_conversation_logs(
        self, workspace_id: str, page: int = 1, page_size: int = 1
    ) -> dict[str, Any]:
        """Get paginated conversation logs for a workspace.

        Args:
            workspace_id: Workspace UUID
            page: Page number (1-indexed)
            page_size: Items per page (max 100, default 1)

        Returns:
            Conversation logs with pagination metadata

        Raises:
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}/logs",
                params={"page": page, "page_size": min(page_size, 100)},
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    # ========================================================================
    # Helper Methods
    # ========================================================================

    async def get_organization_id(self) -> str:
        """Get the default organization ID for the authenticated user.

        This method caches the result to avoid repeated API calls.

        Returns:
            Organization UUID

        Raises:
            HTTPError: If API request fails or no organizations found
        """
        if self._org_id_cache:
            return self._org_id_cache

        try:
            response = await self.client.get(f"{self.base_url}/api/v2/organizations")
            response.raise_for_status()
            orgs = response.json()

            if not orgs:
                raise HTTPError("No organizations found for authenticated user")

            # Use the first organization (most users have only one)
            self._org_id_cache = orgs[0]["id"]
            return self._org_id_cache
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    def _handle_http_error(self, error: httpx.HTTPStatusError) -> None:
        """Convert httpx errors to custom exceptions.

        Args:
            error: The HTTPStatusError from httpx

        Raises:
            NotFoundError: For 404 responses
            ConflictError: For 409 responses
            HTTPError: For all other HTTP errors
        """
        status_code = error.response.status_code
        message = f"Coder API request failed with status {status_code}"

        try:
            error_data = error.response.json()
            if "message" in error_data:
                message = error_data["message"]
        except Exception:
            # If we can't parse JSON, use default message
            pass

        if status_code == 404:
            raise NotFoundError(message) from error
        elif status_code == 409:
            raise ConflictError(message) from error
        else:
            raise HTTPError(f"{message}: {error}") from error
