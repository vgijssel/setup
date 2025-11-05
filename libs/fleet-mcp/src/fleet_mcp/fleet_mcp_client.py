"""Fleet-MCP client for PR tracking and agent communication"""

from enum import Enum
from typing import Any

import httpx


class PRStatus(Enum):
    """Pull request status states"""

    OPEN = "open"
    CLOSED = "closed"
    CHECKS_RUNNING = "checks_running"
    CHECKS_FAILED = "checks_failed"
    NEEDS_REVIEW = "needs_review"
    READY = "ready"
    MERGED = "merged"


class FleetMCPClient:
    """HTTP client for Fleet-MCP server interactions"""

    def __init__(self, coder_token: str):
        """
        Initialize Fleet-MCP client

        Args:
            coder_token: Coder API authentication token for accessing fleet-mcp servers
        """
        self.coder_token = coder_token

    async def set_pr_url(
        self,
        fleetmcp_url: str,
        agent_name: str,
        pr_url: str,
    ) -> dict[str, Any]:
        """
        Set the pull request URL for an agent via fleet-mcp server

        This method sends the PR URL to the fleet-mcp server running in the agent's
        workspace. The server handles persistence to disk and sets status to 'open' by default.

        Args:
            fleetmcp_url: Fleet-MCP server URL
            agent_name: Name of the agent
            pr_url: Pull request URL

        Returns:
            Response from the fleet-mcp server

        Raises:
            httpx.HTTPStatusError: If the request fails
        """
        async with httpx.AsyncClient(
            headers={"Coder-Session-Token": self.coder_token}, timeout=30.0
        ) as client:
            response = await client.post(
                f"{fleetmcp_url}pr-url",
                json={
                    "agent_name": agent_name,
                    "pr_url": pr_url,
                },
            )
            response.raise_for_status()
            return response.json()

    async def set_pr_status(
        self,
        fleetmcp_url: str,
        agent_name: str,
        pr_status: str,
    ) -> dict[str, Any]:
        """
        Set the pull request status for an agent via fleet-mcp server

        This method sends the PR status to the fleet-mcp server running in the agent's
        workspace. The server handles persistence to disk. PR URL must be set first.

        Args:
            fleetmcp_url: Fleet-MCP server URL
            agent_name: Name of the agent
            pr_status: PR status (e.g., 'open', 'closed', 'checks_running', etc.)

        Returns:
            Response from the fleet-mcp server

        Raises:
            httpx.HTTPStatusError: If the request fails or pr_url not set
        """
        async with httpx.AsyncClient(
            headers={"Coder-Session-Token": self.coder_token}, timeout=30.0
        ) as client:
            response = await client.post(
                f"{fleetmcp_url}pr-status",
                json={
                    "agent_name": agent_name,
                    "pr_status": pr_status,
                },
            )
            response.raise_for_status()
            return response.json()

    async def get_pr_url_from_server(
        self, fleetmcp_url: str, agent_name: str
    ) -> dict[str, Any]:
        """
        Get the pull request URL and status for an agent from fleet-mcp server

        Args:
            fleetmcp_url: Fleet-MCP server URL
            agent_name: Name of the agent

        Returns:
            Dict with pr_url and pr_status, or None values if not found

        Raises:
            httpx.HTTPStatusError: If the request fails
        """
        async with httpx.AsyncClient(
            headers={"Coder-Session-Token": self.coder_token}, timeout=5.0
        ) as client:
            response = await client.get(
                f"{fleetmcp_url}pr-url", params={"agent_name": agent_name}
            )
            if response.status_code == 200:
                return response.json()
            return {"pr_url": None, "pr_status": None}
