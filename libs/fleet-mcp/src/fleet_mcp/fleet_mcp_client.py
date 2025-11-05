"""Fleet-MCP client for PR tracking and agent communication"""

import json
import os
from enum import Enum
from pathlib import Path
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
    """HTTP client for Fleet-MCP server interactions and PR tracking"""

    def __init__(self, coder_token: str, storage_path: str | None = None):
        """
        Initialize Fleet-MCP client

        Args:
            coder_token: Coder API authentication token for accessing fleet-mcp servers
            storage_path: Path to store PR data (defaults to env var FLEET_MCP_STORAGE_PATH or /tmp/fleet-mcp-data)
        """
        self.coder_token = coder_token
        self.storage_path = Path(
            storage_path or os.getenv("FLEET_MCP_STORAGE_PATH", "/tmp/fleet-mcp-data")
        )
        self.storage_path.mkdir(parents=True, exist_ok=True)

    def _get_pr_data_file(self, agent_name: str) -> Path:
        """Get the file path for an agent's PR data"""
        return self.storage_path / f"{agent_name}.json"

    def _load_pr_data(self, agent_name: str) -> dict[str, Any]:
        """Load PR data from disk for an agent"""
        pr_file = self._get_pr_data_file(agent_name)
        if pr_file.exists():
            try:
                with open(pr_file, "r") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                return {}
        return {}

    def _save_pr_data(self, agent_name: str, pr_url: str, pr_status: str) -> None:
        """Save PR data to disk for an agent"""
        pr_file = self._get_pr_data_file(agent_name)
        data = {"pr_url": pr_url, "pr_status": pr_status, "agent_name": agent_name}
        try:
            with open(pr_file, "w") as f:
                json.dump(data, f, indent=2)
        except IOError as e:
            # Log error but don't fail - PR tracking is optional
            print(f"Warning: Failed to save PR data for {agent_name}: {e}")

    def get_pr_data(self, agent_name: str) -> dict[str, Any]:
        """
        Get PR data for an agent from disk

        Args:
            agent_name: Name of the agent

        Returns:
            Dict with pr_url and pr_status, or empty dict if not found
        """
        return self._load_pr_data(agent_name)

    async def set_pr_url(
        self,
        fleetmcp_url: str,
        agent_name: str,
        pr_url: str,
        pr_status: str = PRStatus.OPEN.value,
    ) -> dict[str, Any]:
        """
        Set the pull request URL for an agent via fleet-mcp server

        This method sends the PR URL to the fleet-mcp server running in the agent's
        workspace and also persists it to disk locally.

        Args:
            fleetmcp_url: Fleet-MCP server URL
            agent_name: Name of the agent
            pr_url: Pull request URL
            pr_status: PR status (defaults to 'open')

        Returns:
            Response from the fleet-mcp server

        Raises:
            httpx.HTTPStatusError: If the request fails
        """
        # Save to disk first
        self._save_pr_data(agent_name, pr_url, pr_status)

        # Send to fleet-mcp server
        async with httpx.AsyncClient(
            headers={"Coder-Session-Token": self.coder_token}, timeout=30.0
        ) as client:
            response = await client.post(
                f"{fleetmcp_url}pr-url",
                json={
                    "agent_name": agent_name,
                    "pr_url": pr_url,
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

    def update_pr_status(self, agent_name: str, pr_status: str) -> None:
        """
        Update the PR status for an agent (disk only)

        Args:
            agent_name: Name of the agent
            pr_status: New PR status
        """
        data = self._load_pr_data(agent_name)
        if data and "pr_url" in data:
            self._save_pr_data(agent_name, data["pr_url"], pr_status)
