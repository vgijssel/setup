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

    async def list_all(self) -> list[Agent]:
        """List all agents by fetching all workspaces for authenticated user.

        Returns:
            List of Agent domain models

        Raises:
            CoderAPIError: If Coder API request fails
        """
        try:
            workspaces = await self.client.list_workspaces(owner="me")
            agents = [self._workspace_to_agent(ws) for ws in workspaces]
            return agents
        except Exception as e:
            raise CoderAPIError(f"Failed to list agents: {e}") from e

    async def get_by_name(self, name: str) -> Agent:
        """Get agent by name by finding matching workspace.

        Args:
            name: Agent name (workspace name)

        Returns:
            Agent domain model

        Raises:
            AgentNotFoundError: If no workspace with that name exists
            CoderAPIError: If Coder API request fails
        """
        try:
            workspaces = await self.client.list_workspaces(owner="me")

            for workspace in workspaces:
                if workspace.get("name") == name:
                    # Get full workspace details with metadata
                    workspace_id = workspace.get("id")
                    full_workspace = await self.client.get_workspace(workspace_id)
                    return self._workspace_to_agent(full_workspace)

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
            # Build rich parameter values for ai_prompt
            rich_parameters = [
                {"name": "ai_prompt", "value": task},
            ]

            workspace = await self.client.create_workspace(
                name=name,
                template_id=template_id,
                preset_id=preset_id,
                rich_parameter_values=rich_parameters,
            )

            return self._workspace_to_agent(workspace)
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
            return self._workspace_to_agent(workspace)
        except AgentNotFoundError:
            raise
        except Exception as e:
            raise CoderAPIError(f"Failed to restart agent '{agent_name}': {e}") from e

    def _workspace_to_agent(self, workspace: dict[str, Any]) -> Agent:
        """Transform Coder workspace API response to Agent domain model.

        Args:
            workspace: Workspace dictionary from Coder API

        Returns:
            Agent domain model

        Business Logic:
        - Maps workspace.name → agent.name
        - Maps workspace.id → agent.workspace_id
        - Maps workspace.template_name → agent.project
        - Derives agent.status from latest_build.status
        - Extracts agent.role from workspace metadata
        - Extracts agent.last_task from rich parameters if present
        """
        latest_build = workspace.get("latest_build", {})
        build_status = latest_build.get("status", "unknown")

        # Map Coder workspace build status to Agent status
        status_map = {
            "starting": AgentStatus.STARTING,
            "running": AgentStatus.IDLE,  # Running workspace = idle agent
            "stopped": AgentStatus.OFFLINE,
            "failed": AgentStatus.FAILED,
            "canceling": AgentStatus.OFFLINE,
            "canceled": AgentStatus.OFFLINE,
            "deleting": AgentStatus.OFFLINE,
        }

        agent_status = status_map.get(build_status, AgentStatus.OFFLINE)

        # Check if agent is busy (has an active AI task)
        # This is indicated by has_ai_task=true and latest_app_status.state="working"
        if workspace.get("latest_build", {}).get("has_ai_task"):
            latest_app_status = workspace.get("latest_app_status", {})
            if latest_app_status.get("state") == "working":
                agent_status = AgentStatus.BUSY

        # Extract role from preset (if available in workspace metadata)
        # For now, default to "coder" - will be enhanced when metadata is available
        role = "coder"

        # Extract last_task from rich parameters if present
        last_task = None
        # Note: This would need to query workspace build parameters
        # For now, we'll leave it as None and populate when task service updates it

        return Agent(
            name=workspace.get("name", "unknown"),
            workspace_id=workspace.get("id", ""),
            status=agent_status,
            role=role,
            project=workspace.get("template_name", "unknown"),
            last_task=last_task,
            created_at=self._parse_datetime(workspace.get("created_at")),
            updated_at=self._parse_datetime(workspace.get("updated_at")),
        )

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
