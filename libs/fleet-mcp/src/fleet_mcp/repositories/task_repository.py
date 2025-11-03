"""Task repository for data access and transformation"""

from typing import Any

from fleet_mcp import config
from fleet_mcp.clients.coder_client import CoderClient


class TaskRepository:
    """Repository for task-related data access"""

    def __init__(self):
        """Initialize repository with Coder client"""
        self._client = CoderClient(
            base_url=config.CODER_BASE_URL,
            token=config.CODER_TOKEN,
        )

    async def get_task(self, username: str, workspace_id: str) -> dict[str, Any] | None:
        """
        Get task data from experimental API

        Args:
            username: Workspace owner username
            workspace_id: Workspace UUID

        Returns:
            Task data or None if no task exists
        """
        return await self._client.get_task(username, workspace_id)

    async def get_task_logs(
        self, username: str, workspace_id: str
    ) -> list[dict[str, Any]]:
        """
        Get task conversation logs

        Args:
            username: Workspace owner username
            workspace_id: Workspace UUID

        Returns:
            List of log entries
        """
        return await self._client.get_task_logs(username, workspace_id)

    async def send_task_input(
        self, username: str, workspace_id: str, task_input: str
    ) -> None:
        """
        Send input to a task

        Args:
            username: Workspace owner username
            workspace_id: Workspace UUID
            task_input: Message to send to the task
        """
        await self._client.send_task_input(username, workspace_id, task_input)

    async def send_interrupt(self, username: str, workspace_id: str) -> dict[str, Any]:
        """
        Send interrupt signal to workspace

        Args:
            username: Workspace owner username
            workspace_id: Workspace UUID

        Returns:
            Response from interrupt operation
        """
        return await self._client.send_interrupt(username, workspace_id)

    async def get_agentapi_url(self, workspace: dict[str, Any]) -> str | None:
        """
        Get AgentAPI URL for a workspace

        Args:
            workspace: Workspace data dict

        Returns:
            AgentAPI URL or None if not found
        """
        return await self._client.get_agentapi_url(workspace)

    async def send_agentapi_interrupt(self, agentapi_url: str) -> dict[str, Any]:
        """
        Send interrupt via AgentAPI

        Args:
            agentapi_url: AgentAPI base URL

        Returns:
            Response from AgentAPI
        """
        return await self._client.send_agentapi_interrupt(agentapi_url)
