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

        # Send task to workspace
        await self.client.send_task_to_workspace(workspace_id, task_description)

    async def cancel_task(self, agent_name: str) -> None:
        """Cancel the current task on an agent by sending interrupt signal.

        Args:
            agent_name: Name of the agent to cancel task for

        Raises:
            NotFoundError: If agent doesn't exist or AgentAPI URL not found
            CoderAPIError: If cancellation fails
        """
        # Get agent workspace
        agents = await self.client.list_workspaces()
        workspace = next((w for w in agents if w["name"] == agent_name), None)

        if not workspace:
            from ..clients.exceptions import NotFoundError
            raise NotFoundError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # Get workspace applications to find AgentAPI URL
        applications = await self.client.get_workspace_applications(workspace_id)

        # Find AgentAPI application
        agent_api = next(
            (app for app in applications if app.get("slug") == "agentapi"),
            None
        )

        if not agent_api or not agent_api.get("health"):
            from ..clients.exceptions import NotFoundError
            raise NotFoundError(f"AgentAPI not available for agent '{agent_name}'")

        agent_api_url = agent_api["health"]

        # Send interrupt signal via AgentAPI
        await self.client.send_interrupt_signal(agent_api_url)

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
