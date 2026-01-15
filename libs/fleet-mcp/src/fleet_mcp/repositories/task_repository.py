"""Task repository for task assignment operations (Layer 3 - Data Access)."""

from ..clients import CoderClient


class TaskRepository:
    """Repository for task assignment operations.

    Architecture: Layer 3 (Data Access)
    Dependencies: CoderClient (Layer 4)

    Responsibilities:
    - Communicate with Coder API for task operations
    - Transform API responses to domain models
    - Handle workspace application discovery for AgentAPI
    """

    def __init__(self, client: CoderClient):
        """Initialize TaskRepository.

        Args:
            client: CoderClient instance for API communication
        """
        self.client = client

    async def assign_task(self, agent_name: str, task_description: str) -> None:
        """Assign a task to an agent workspace.

        Args:
            agent_name: Name of the agent to assign task to (case insensitive)
            task_description: Description of the task to assign

        Raises:
            NotFoundError: If agent doesn't exist
            ValidationError: If task description is empty
            CoderAPIError: If task assignment fails

        Note:
            Agent name comparison is case insensitive because the Coder API
            backend is case insensitive.
        """
        # Get agent workspace (case insensitive lookup)
        agents = await self.client.list_workspaces()
        agent_name_lower = agent_name.lower()
        workspace = next(
            (w for w in agents if w["name"].lower() == agent_name_lower), None
        )

        if not workspace:
            from ..clients.exceptions import NotFoundError

            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        owner_name = workspace.get("owner_name", "")

        # Send task to workspace
        await self.client.send_task_input(owner_name, workspace_id, task_description)

    async def cancel_task(self, agent_name: str) -> None:
        """Cancel the current task on an agent by sending interrupt signal.

        Sends interrupt signal to the Claude Code (ccw) app via AgentAPI.

        Args:
            agent_name: Name of the agent to cancel task for (case insensitive)

        Raises:
            NotFoundError: If agent doesn't exist or ccw app not found
            CoderAPIError: If cancellation fails

        Note:
            Agent name comparison is case insensitive because the Coder API
            backend is case insensitive.
        """
        # Get agent workspace (case insensitive lookup)
        agents = await self.client.list_workspaces()
        agent_name_lower = agent_name.lower()
        workspace = next(
            (w for w in agents if w["name"].lower() == agent_name_lower), None
        )

        if not workspace:
            from ..clients.exceptions import NotFoundError

            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # Get full workspace details for app URL construction
        workspace_details = await self.client.get_workspace(workspace_id)

        # Get workspace applications to find Claude Code app
        applications = await self.client.get_workspace_applications(workspace_id)

        # Find Claude Code app (slug: "ccw")
        ccw_app = next((app for app in applications if app.get("slug") == "ccw"), None)

        if not ccw_app:
            from ..clients.exceptions import NotFoundError

            raise NotFoundError(
                f"Claude Code app not found for agent '{agent_name}'. "
                "The workspace must have a 'ccw' app to cancel tasks."
            )

        # Construct the AgentAPI URL based on subdomain configuration
        agent_api_url = self._construct_app_url(
            workspace_details, ccw_app, workspace_id
        )
        await self.client.send_interrupt(agent_api_url)

    async def get_task_history(self, agent_name: str) -> list[dict]:
        """Get task history for an agent by extracting from workspace JSON.

        Task history is stored in workspace.latest_build.resources[].agents[].apps[]
        where app.slug == "ccw" or app.display_name == "Claude Code".
        The app.statuses[] array contains the task history items.

        Args:
            agent_name: Name of the agent to get history for (case insensitive)

        Returns:
            List of task status dictionaries

        Raises:
            NotFoundError: If agent doesn't exist

        Note:
            Agent name comparison is case insensitive because the Coder API
            backend is case insensitive.
        """
        # Get agent workspace (case insensitive lookup)
        agents = await self.client.list_workspaces()
        agent_name_lower = agent_name.lower()
        workspace = next(
            (w for w in agents if w["name"].lower() == agent_name_lower), None
        )

        if not workspace:
            from ..clients.exceptions import NotFoundError

            raise NotFoundError(f"Agent '{agent_name}' not found")

        # Get full workspace details
        workspace_details = await self.client.get_workspace(workspace["id"])

        # Extract task history from Claude Code app statuses
        tasks = []
        latest_build = workspace_details.get("latest_build", {})
        resources = latest_build.get("resources", [])

        for resource in resources:
            agents_list = resource.get("agents", [])
            for agent in agents_list:
                apps = agent.get("apps", [])
                for app in apps:
                    # Find Claude Code app by slug or display name
                    if (
                        app.get("slug") == "ccw"
                        or app.get("display_name") == "Claude Code"
                    ):
                        statuses = app.get("statuses", [])
                        tasks.extend(statuses)
                        break  # Found Claude Code app, stop searching

        return tasks

    async def get_conversation_logs(self, agent_name: str) -> list[dict]:
        """Get conversation logs for an agent from experimental task API.

        Args:
            agent_name: Name of the agent to get logs for (case insensitive)

        Returns:
            List of log entry dictionaries

        Raises:
            NotFoundError: If agent doesn't exist

        Note:
            Agent name comparison is case insensitive because the Coder API
            backend is case insensitive.
        """
        # Get agent workspace (case insensitive lookup)
        agents = await self.client.list_workspaces()
        agent_name_lower = agent_name.lower()
        workspace = next(
            (w for w in agents if w["name"].lower() == agent_name_lower), None
        )

        if not workspace:
            from ..clients.exceptions import NotFoundError

            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        owner_name = workspace.get("owner_name", "me")

        # Get logs from experimental API
        logs = await self.client.get_task_logs(owner_name, workspace_id)

        return logs

    def _construct_app_url(self, workspace: dict, app: dict, workspace_id: str) -> str:
        """Construct app URL based on subdomain configuration.

        Args:
            workspace: Workspace data from Coder API
            app: App configuration with subdomain field
            workspace_id: Workspace UUID

        Returns:
            App base URL (with trailing slash)
        """
        from urllib.parse import urlparse

        owner_name = workspace.get("owner_name", "me")
        workspace_name = workspace.get("name", "unknown")
        app_slug = app.get("slug", "")
        uses_subdomain = app.get("subdomain", False)

        if uses_subdomain:
            # Subdomain format: {port}--{agent}--{workspace}--{owner}.{wildcard_domain}/
            # Extract port from app URL (e.g., "http://localhost:3284" -> "3284")
            app_url = app.get("url", "")
            parsed = urlparse(app_url)
            port = parsed.port or 80

            # Extract agent name from workspace resources (typically "main")
            agent_name = "main"
            latest_build = workspace.get("latest_build", {})
            resources = latest_build.get("resources", [])
            for resource in resources:
                agents = resource.get("agents", [])
                if agents:
                    agent_name = agents[0].get("name", "main")
                    break

            # Extract wildcard domain from base URL
            # e.g., "https://coder.enigma.vgijssel.nl" -> "coder.enigma.vgijssel.nl"
            base_parsed = urlparse(self.client.base_url)
            wildcard_domain = base_parsed.netloc

            # Construct subdomain URL
            subdomain_url = f"{base_parsed.scheme}://{port}--{agent_name}--{workspace_name}--{owner_name}.{wildcard_domain}/"
            return subdomain_url
        else:
            # Path-based format: {base_url}/@{owner}/{workspace}.{workspace_id}/apps/{slug}/
            return (
                f"{self.client.base_url}/@{owner_name}/"
                f"{workspace_name}.{workspace_id}/apps/{app_slug}/"
            )
