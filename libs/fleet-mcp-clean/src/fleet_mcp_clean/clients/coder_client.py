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
        """Delete a workspace by triggering a delete build.

        Args:
            workspace_id: Workspace UUID

        Returns:
            Deletion build result dictionary from Coder API

        Raises:
            NotFoundError: If workspace doesn't exist
            HTTPError: If API request fails
        """
        try:
            # Trigger workspace deletion by creating a delete build
            response = await self.client.post(
                f"{self.base_url}/api/v2/workspaces/{workspace_id}/builds",
                json={"transition": "delete"},
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise NotFoundError(f"Workspace {workspace_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def restart_workspace(self, workspace_id: str) -> dict[str, Any]:
        """Restart a workspace by stopping and starting it.

        This method ensures the workspace is fully stopped before starting it again
        to avoid race conditions and build conflicts.

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
            stop_build_data = stop_response.json()
            stop_build_id = stop_build_data.get("id")

            # Wait for the stop build to complete
            if stop_build_id:
                await self._wait_for_build_completion(stop_build_id)

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

    async def _wait_for_build_completion(
        self, build_id: str, max_attempts: int = 60, delay_seconds: float = 1.0
    ) -> None:
        """Wait for a workspace build to complete.

        Polls the build status until it reaches a terminal state (stopped, failed, canceled)
        or the maximum number of attempts is reached.

        Args:
            build_id: Workspace build UUID
            max_attempts: Maximum number of polling attempts (default: 60)
            delay_seconds: Delay between polling attempts in seconds (default: 1.0)

        Raises:
            HTTPError: If polling fails or max attempts exceeded
        """
        import asyncio

        terminal_states = {"stopped", "failed", "canceled"}

        for _attempt in range(max_attempts):
            try:
                response = await self.client.get(
                    f"{self.base_url}/api/v2/workspacebuilds/{build_id}"
                )
                response.raise_for_status()
                build_data = response.json()
                status = build_data.get("status", "").lower()

                if status in terminal_states:
                    return  # Build completed

                # Wait before next poll
                await asyncio.sleep(delay_seconds)

            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    # Build not found, it may have completed and been cleaned up
                    return
                raise HTTPError(f"Failed to check build status: {e}") from e
            except httpx.RequestError as e:
                raise HTTPError(f"Failed to connect to Coder API: {e}") from e

        raise HTTPError(
            f"Build {build_id} did not complete after {max_attempts} attempts"
        )

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
            # First try the simpler endpoint without organization
            response = await self.client.get(
                f"{self.base_url}/api/v2/templates/{template_id}"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                # Try with organization prefix as fallback
                try:
                    org_id = await self.get_organization_id()
                    response = await self.client.get(
                        f"{self.base_url}/api/v2/organizations/{org_id}/templates/{template_id}"
                    )
                    response.raise_for_status()
                    return response.json()
                except httpx.HTTPStatusError:
                    raise NotFoundError(f"Template {template_id} not found") from e
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def get_template_parameters(self, template_id: str) -> list[dict[str, Any]]:
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
                raise NotFoundError(f"Template {template_id} has no active version")

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
                raise NotFoundError(f"Template {template_id} has no active version")

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

    async def get_task(self, username: str, workspace_id: str) -> dict[str, Any] | None:
        """Get AI task status from experimental task API.

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID

        Returns:
            Task data from experimental API or None if no task exists

        Raises:
            HTTPError: If API request fails
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}"
            )

            # 404 or 400 means no task exists for this workspace
            if response.status_code in (400, 404):
                return None

            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code in (400, 404):
                return None
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def send_task_input(
        self, username: str, workspace_id: str, task_input: str
    ) -> None:
        """Send input/message to an AI task via experimental task API.

        Submits new input to the task's sidebar app. This sends a message to
        the AgentAPI running in the workspace.

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID
            task_input: Message/input to send to the task (must be non-empty)

        Raises:
            ValueError: If task_input is empty
            HTTPError: If the request fails (e.g., task not in stable state)
        """
        if not task_input or not task_input.strip():
            raise ValueError("Task input cannot be empty")

        try:
            response = await self.client.post(
                f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}/send",
                json={"input": task_input},
            )
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to connect to Coder API: {e}") from e

    async def send_interrupt(self, agent_api_url: str) -> dict[str, Any]:
        """Send interrupt signal to workspace via AgentAPI.

        Sends an escape sequence (\u001b) to the AgentAPI /message endpoint
        to interrupt the currently running task.

        Args:
            agent_api_url: Base URL to AgentAPI app (e.g., https://coder.com/@owner/workspace.id/apps/ccw/)

        Returns:
            Response dictionary (usually empty for success)

        Raises:
            HTTPError: If API request fails
        """
        try:
            # Send escape sequence as raw message (\u001b interrupts the current task)
            # agent_api_url already ends with /, so we append "message"
            response = await self.client.post(
                f"{agent_api_url}message",
                json={"type": "raw", "content": "\u001b"},
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            return response.json() if response.content else {}
        except httpx.HTTPStatusError as e:
            self._handle_http_error(e)
        except httpx.RequestError as e:
            raise HTTPError(f"Failed to send interrupt to AgentAPI: {e}") from e

    # NOTE: Task history is NOT a separate API endpoint
    # Task history is extracted from workspace.latest_build.resources[].agents[].apps[]
    # where app.slug == "ccw" or app.display_name == "Claude Code"
    # The app.statuses[] array contains the task history items
    # This extraction should be done in the repository/service layer

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

    async def get_task_logs(self, username: str, workspace_id: str) -> list[dict]:
        """Get conversation logs from experimental task API.

        Retrieves conversation logs for a workspace's AI task. Logs include both
        user inputs and assistant outputs.

        Args:
            username: Username of the workspace owner
            workspace_id: Workspace UUID

        Returns:
            List of log entries. Each entry contains: id, time, type, content.
            Returns empty list if no task exists or logs are not available.

        Raises:
            HTTPError: If the API request fails (except 404/400 which return empty list)
        """
        try:
            response = await self.client.get(
                f"{self.base_url}/api/experimental/tasks/{username}/{workspace_id}/logs"
            )

            # 400 or 404 means no task exists or logs are not available
            if response.status_code in (400, 404):
                return []

            response.raise_for_status()
            data = response.json()
            return data.get("logs", [])
        except httpx.HTTPStatusError as e:
            # Don't raise for 404/400, just return empty
            if e.response.status_code in (400, 404):
                return []
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
