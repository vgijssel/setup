"""Agent repository for workspace data access."""

from datetime import datetime
from typing import Any

from ..clients import CoderClient
from ..models import Agent, AgentStatus
from ..models.errors import AgentNotFoundError, CoderAPIError


class AgentRepository:
    """Repository for agent data access using Coder workspace API.

    Architecture: Layer 3 (Repository Layer)
    Dependencies: CoderClient (Layer 4)
    Used by: AgentService (Layer 2)

    Responsibilities:
    - Transform WorkspaceRemote ↔ Agent domain models
    - Query Coder API for workspace data via CoderClient
    - Handle workspace-to-agent mapping logic
    """

    def __init__(self, coder_client: CoderClient):
        """Initialize repository with Coder API client.

        Args:
            coder_client: Async HTTP client for Coder API
        """
        self.client = coder_client
        self._preset_cache: dict[str, dict[str, str]] = (
            {}
        )  # template_id -> {preset_id: role_name}

    async def list_all(self) -> list[Agent]:
        """List all agents by fetching all workspaces for authenticated user.

        Returns:
            List of Agent domain models

        Raises:
            CoderAPIError: If Coder API request fails
        """
        try:
            workspaces = await self.client.list_workspaces(owner="me")
            # Filter out None workspaces (can happen during race conditions or after creation)
            valid_workspaces = [ws for ws in workspaces if ws is not None]
            agents = [await self._workspace_to_agent(ws) for ws in valid_workspaces]
            return agents
        except Exception as e:
            raise CoderAPIError(f"Failed to list agents: {e}") from e

    async def get_by_name(self, name: str) -> Agent:
        """Get agent by name by finding matching workspace.

        Args:
            name: Agent name (workspace name) - case insensitive

        Returns:
            Agent domain model

        Raises:
            AgentNotFoundError: If no workspace with that name exists
            CoderAPIError: If Coder API request fails

        Note:
            Agent name comparison is case insensitive because the Coder API
            backend is case insensitive. For example, "WorkspaceStates",
            "WORKSPACESTATES", and "workspacestates" all refer to the same agent.
        """
        try:
            workspaces = await self.client.list_workspaces(owner="me")
            # Filter out None workspaces (can happen during race conditions or after creation)
            valid_workspaces = [ws for ws in workspaces if ws is not None]

            # Normalize the search name to lowercase for case-insensitive comparison
            name_lower = name.lower()

            for workspace in valid_workspaces:
                workspace_name = workspace.get("name", "")
                if workspace_name.lower() == name_lower:
                    # Get full workspace details with metadata
                    workspace_id = workspace.get("id")
                    full_workspace = await self.client.get_workspace(workspace_id)
                    return await self._workspace_to_agent(full_workspace)

            raise AgentNotFoundError(f"Agent '{name}' not found")
        except AgentNotFoundError:
            raise
        except Exception as e:
            raise CoderAPIError(f"Failed to get agent '{name}': {e}") from e

    async def create(
        self, name: str, template_id: str, preset_id: str, task: str
    ) -> Agent:
        """Create a new agent by creating a Coder workspace.

        Args:
            name: Unique agent name
            template_id: Coder template UUID
            preset_id: Workspace preset UUID (role)
            task: Initial task description (ai_prompt)

        Returns:
            Created Agent domain model

        Raises:
            CoderAPIError: If workspace creation fails
        """
        try:
            # Build rich parameter values for AI Prompt
            # Per Coder AI docs, the parameter name is always "AI Prompt" (with space and capitals)
            # See: https://coder.com/docs/ai-coder/tasks#option-2-create-or-duplicate-your-own-template
            rich_parameters = [
                {"name": "AI Prompt", "value": task},
            ]

            workspace = await self.client.create_workspace(
                name=name,
                template_id=template_id,
                preset_id=preset_id,
                rich_parameter_values=rich_parameters,
            )

            return await self._workspace_to_agent(workspace)
        except Exception as e:
            raise CoderAPIError(f"Failed to create agent '{name}': {e}") from e

    async def delete(self, agent_name: str) -> None:
        """Delete an agent by deleting its workspace.

        Args:
            agent_name: Agent name (workspace name)

        Raises:
            AgentNotFoundError: If agent doesn't exist
            CoderAPIError: If workspace deletion fails
        """
        try:
            # Find workspace ID by name
            agent = await self.get_by_name(agent_name)
            await self.client.delete_workspace(agent.workspace_id)
        except AgentNotFoundError:
            raise
        except Exception as e:
            raise CoderAPIError(f"Failed to delete agent '{agent_name}': {e}") from e

    async def restart(self, agent_name: str) -> Agent:
        """Restart an agent by restarting its workspace.

        Args:
            agent_name: Agent name (workspace name)

        Returns:
            Updated Agent domain model after restart

        Raises:
            AgentNotFoundError: If agent doesn't exist
            CoderAPIError: If workspace restart fails
        """
        try:
            # Find workspace ID by name
            agent = await self.get_by_name(agent_name)
            workspace = await self.client.restart_workspace(agent.workspace_id)
            return await self._workspace_to_agent(workspace)
        except AgentNotFoundError:
            raise
        except Exception as e:
            raise CoderAPIError(f"Failed to restart agent '{agent_name}': {e}") from e

    async def update(
        self, agent_name: str, template_version_id: str | None = None
    ) -> Agent:
        """Update an agent to a new template version and restart.

        This method implements the two-step workflow required by Coder API:
        1. Stop the workspace and wait for completion
        2. Start with the new template version

        Args:
            agent_name: Agent name (workspace name)
            template_version_id: Template version UUID to update to.
                                If None, uses the active version of the agent's template.

        Returns:
            Updated Agent domain model after update and restart

        Raises:
            AgentNotFoundError: If agent doesn't exist
            CoderAPIError: If workspace update fails
        """
        try:
            # Find workspace by name
            agent = await self.get_by_name(agent_name)

            # If no template_version_id provided, get the active version
            if template_version_id is None:
                # Get the workspace to find its template_id
                workspace = await self.client.get_workspace(agent.workspace_id)
                template_id = workspace.get("template_id")

                if not template_id:
                    raise CoderAPIError(
                        f"Agent '{agent_name}' has no template_id in workspace data"
                    )

                # Get the template's active version
                template = await self.client.get_template(template_id)
                template_version_id = template.get("active_version_id")

                if not template_version_id:
                    raise CoderAPIError(
                        f"Template {template_id} has no active version available"
                    )

            # Update the workspace with the new template version
            workspace = await self.client.update_workspace(
                agent.workspace_id, template_version_id
            )

            return await self._workspace_to_agent(workspace)
        except AgentNotFoundError:
            raise
        except Exception as e:
            raise CoderAPIError(f"Failed to update agent '{agent_name}': {e}") from e

    def _are_all_workspace_agents_healthy(self, workspace: dict[str, Any]) -> bool:
        """Check if all agents within the workspace are healthy and ready.

        A workspace agent is considered healthy when:
        - status is "connected"
        - lifecycle_state is "ready"

        Args:
            workspace: Workspace data from Coder API

        Returns:
            True if all agents are healthy, False otherwise
        """
        latest_build = workspace.get("latest_build", {})
        resources = latest_build.get("resources", [])

        # If no resources, consider unhealthy
        if not resources:
            return False

        # Track if we found at least one agent
        found_any_agent = False

        # Check all agents in all resources
        for resource in resources:
            agents = resource.get("agents", [])
            # If resource has no agents, skip it
            if not agents:
                continue

            # We found at least one agent
            found_any_agent = True

            for agent in agents:
                agent_status = agent.get("status", "")
                lifecycle_state = agent.get("lifecycle_state", "")

                # Agent must be connected and ready to be considered healthy
                if agent_status != "connected" or lifecycle_state != "ready":
                    return False

        # Healthy only if we found at least one agent and all were healthy
        return found_any_agent

    async def _workspace_to_agent(self, workspace: dict[str, Any]) -> Agent:
        """Transform Coder workspace API response to Agent domain model.

        Args:
            workspace: Workspace dictionary from Coder API

        Returns:
            Agent domain model

        Business Logic:
        - Maps workspace.name → agent.name
        - Maps workspace.id → agent.workspace_id
        - Maps workspace.template_display_name → agent.project (user-facing name)
        - Derives agent.status from latest_build.status
        - Checks workspace agent health before marking as IDLE/BUSY
        - Extracts agent.role from workspace metadata
        - Extracts agent.last_task from rich parameters if present
        """
        latest_build = workspace.get("latest_build") or {}
        build_status = latest_build.get("status", "unknown")

        # Map Coder workspace build status to Agent status
        # Maps 1:1 except "running" which is split into "idle" (no active task) and "busy" (task running)
        if build_status != "running":
            # Non-running states map directly
            status_map = {
                "pending": AgentStatus.PENDING,
                "starting": AgentStatus.STARTING,
                "stopping": AgentStatus.STOPPING,
                "stopped": AgentStatus.STOPPED,
                "failed": AgentStatus.FAILED,
                "canceling": AgentStatus.CANCELING,
                "canceled": AgentStatus.CANCELED,
                "deleting": AgentStatus.DELETING,
                "deleted": AgentStatus.DELETED,
            }
            agent_status = status_map.get(build_status, AgentStatus.FAILED)
        elif not self._are_all_workspace_agents_healthy(workspace):
            # Workspace is running but agents are not healthy yet
            agent_status = AgentStatus.STARTING
        else:
            # Workspace is running and agents are healthy
            # Check if agent is busy (has an active AI task)
            # This is indicated by has_ai_task=true and latest_app_status.state="working"
            if (workspace.get("latest_build") or {}).get("has_ai_task"):
                latest_app_status = workspace.get("latest_app_status") or {}
                if latest_app_status.get("state") == "working":
                    agent_status = AgentStatus.BUSY
                else:
                    agent_status = AgentStatus.IDLE
            else:
                # No task data, default to idle
                agent_status = AgentStatus.IDLE

        # Extract role from preset ID in latest_build
        # The preset_id is stored in latest_build.template_version_preset_id
        template_id = workspace.get("template_id")
        preset_id = latest_build.get("template_version_preset_id")

        # Resolve preset_id to role name (with caching to avoid extra API calls)
        role = await self._get_role_name_from_preset_id(template_id, preset_id)

        # Extract last_task from task history in workspace build
        # Task history is stored in latest_build.resources[].agents[].apps[]
        # where app.slug == "ccw" (Claude Code)
        last_task = self._extract_last_task_from_workspace(workspace)

        return Agent(
            name=workspace.get("name", "unknown"),
            workspace_id=workspace.get("id", ""),
            status=agent_status,
            role=role,
            project=workspace.get("template_display_name", "unknown"),
            last_task=last_task,
            created_at=self._parse_datetime(workspace.get("created_at")),
            updated_at=self._parse_datetime(workspace.get("updated_at")),
        )

    async def _get_role_name_from_preset_id(
        self, template_id: str, preset_id: str | None
    ) -> str:
        """Get role name from preset ID by querying template presets.

        Args:
            template_id: Template UUID
            preset_id: Preset UUID

        Returns:
            Role name (preset name) or "Unknown" as fallback

        Note:
            Uses caching to avoid repeated API calls for the same template
        """
        if not preset_id:
            return "Unknown"  # Default fallback

        # Check cache first
        if template_id in self._preset_cache:
            role_name = self._preset_cache[template_id].get(preset_id)
            if role_name:
                return role_name

        # Fetch presets from API
        try:
            presets = await self.client.list_workspace_presets(template_id)

            # Build cache for this template
            if template_id not in self._preset_cache:
                self._preset_cache[template_id] = {}

            for preset in presets:
                # Preset structure from Coder API: {"ID": "...", "Name": "...", ...}
                preset_uuid = preset.get("ID")
                preset_name = preset.get("Name", "unknown")
                if preset_uuid:
                    self._preset_cache[template_id][preset_uuid] = preset_name

            # Return the role name for this preset_id
            return self._preset_cache[template_id].get(preset_id, "Unknown")

        except Exception:
            # If we can't fetch presets, return default
            return "Unknown"

    @staticmethod
    def _extract_last_task_from_workspace(workspace: dict[str, Any]) -> str | None:
        """Extract the last task from workspace task history.

        Task history is stored in workspace.latest_build.resources[].agents[].apps[]
        where app.slug == "ccw" or app.display_name == "Claude Code".
        The app.statuses[] array contains the task history items.

        Args:
            workspace: Workspace dictionary from Coder API

        Returns:
            Last task summary string or None if no history exists
        """
        latest_build = workspace.get("latest_build") or {}
        resources = latest_build.get("resources", [])

        # Collect all task statuses from Claude Code app
        all_tasks = []
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
                        all_tasks.extend(statuses)
                        break  # Found Claude Code app, stop searching this agent

        # If no tasks found, return None
        if not all_tasks:
            return None

        # Sort tasks by created_at (newest first) and return the most recent message
        sorted_tasks = sorted(
            all_tasks, key=lambda t: t.get("created_at", ""), reverse=True
        )

        return sorted_tasks[0].get("message") if sorted_tasks else None

    @staticmethod
    def _parse_datetime(dt_str: str | datetime | None) -> datetime:
        """Parse datetime string or return current time if invalid.

        Args:
            dt_str: Datetime string, datetime object, or None

        Returns:
            Parsed datetime object
        """
        if isinstance(dt_str, datetime):
            return dt_str
        if isinstance(dt_str, str):
            try:
                # Handle ISO format with 'Z' timezone
                if dt_str.endswith("Z"):
                    dt_str = dt_str[:-1] + "+00:00"
                return datetime.fromisoformat(dt_str)
            except ValueError:
                pass
        return datetime.now()
