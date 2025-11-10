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
            agent_name: Name of the agent to assign task to
            task_description: Description of the task to assign

        Raises:
            NotFoundError: If agent doesn't exist
            ValidationError: If task description is empty
            CoderAPIError: If task assignment fails
        """
        # Get agent workspace
        agents = await self.client.list_workspaces()
        workspace = next((w for w in agents if w["name"] == agent_name), None)

        if not workspace:
            from ..clients.exceptions import NotFoundError
            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        owner_name = workspace.get("owner_name", "")

        # Send task to workspace
        await self.client.send_task_input(owner_name, workspace_id, task_description)

    async def cancel_task(self, agent_name: str) -> None:
        """Cancel the current task on an agent by sending interrupt signal.

        Tries to use AgentAPI first, falls back to experimental API if unavailable.

        Args:
            agent_name: Name of the agent to cancel task for

        Raises:
            NotFoundError: If agent doesn't exist
            CoderAPIError: If cancellation fails
        """
        # Get agent workspace
        agents = await self.client.list_workspaces()
        workspace = next((w for w in agents if w["name"] == agent_name), None)

        if not workspace:
            from ..clients.exceptions import NotFoundError
            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        workspace_name = workspace.get("name", agent_name)
        owner_name = workspace.get("owner_name", "")

        # Get workspace applications to find AgentAPI (Claude Code app)
        applications = await self.client.get_workspace_applications(workspace_id)

        # Find Claude Code / AgentAPI application
        # Look for apps with specific slugs, prioritizing exact matches
        agent_api_app = None
        for app in applications:
            app_slug = app.get("slug", "").lower()
            # Prioritize exact matches first
            if app_slug in ("ccw", "agentapi", "claude"):
                agent_api_app = app
                break

        # If no exact match, look for slugs containing these strings
        if not agent_api_app:
            for app in applications:
                app_slug = app.get("slug", "").lower()
                if "agentapi" in app_slug or "claude" in app_slug:
                    agent_api_app = app
                    break

        # Try AgentAPI first, fall back to experimental API
        if agent_api_app:
            # Primary method: Use AgentAPI via application proxy
            # Construct the application URL
            # Format: {base_url}/@{owner}/{workspace}.{workspace_id}/apps/{app_slug}/
            agent_api_url = f"{self.client.base_url}/@{owner_name}/{workspace_name}.{workspace_id}/apps/{agent_api_app.get('slug')}/"
            await self.client.send_interrupt_signal(agent_api_url)
        else:
            # Fallback method: Use experimental task API
            await self.client.send_interrupt_via_experimental_api(
                owner_name, workspace_id
            )

    async def get_task_history(self, agent_name: str) -> list[dict]:
        """Get task history for an agent by extracting from workspace JSON.

        Task history is stored in workspace.latest_build.resources[].agents[].apps[]
        where app.slug == "ccw" or app.display_name == "Claude Code".
        The app.statuses[] array contains the task history items.

        Args:
            agent_name: Name of the agent to get history for

        Returns:
            List of task status dictionaries

        Raises:
            NotFoundError: If agent doesn't exist
        """
        # Get agent workspace
        agents = await self.client.list_workspaces()
        workspace = next((w for w in agents if w["name"] == agent_name), None)

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
                    if app.get("slug") == "ccw" or app.get("display_name") == "Claude Code":
                        statuses = app.get("statuses", [])
                        tasks.extend(statuses)
                        break  # Found Claude Code app, stop searching

        return tasks

    async def get_conversation_logs(self, agent_name: str) -> list[dict]:
        """Get conversation logs for an agent from experimental task API.

        Args:
            agent_name: Name of the agent to get logs for

        Returns:
            List of log entry dictionaries

        Raises:
            NotFoundError: If agent doesn't exist
        """
        # Get agent workspace
        agents = await self.client.list_workspaces()
        workspace = next((w for w in agents if w["name"] == agent_name), None)

        if not workspace:
            from ..clients.exceptions import NotFoundError
            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        owner_name = workspace.get("owner_name", "me")

        # Get logs from experimental API
        logs = await self.client.get_task_logs(owner_name, workspace_id)

        return logs
