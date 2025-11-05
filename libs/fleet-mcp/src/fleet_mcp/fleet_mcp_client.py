"""Fleet-MCP client for PR URL tracking and agent communication"""

from typing import Any

import httpx


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
        workspace. The server handles persistence to disk.

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

    async def get_pr_url_from_server(
        self, fleetmcp_url: str, agent_name: str
    ) -> dict[str, Any]:
        """
        Get the pull request URL for an agent from fleet-mcp server

        Args:
            fleetmcp_url: Fleet-MCP server URL
            agent_name: Name of the agent

        Returns:
            Dict with pr_url, or None if not found

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
            return {"pr_url": None}
