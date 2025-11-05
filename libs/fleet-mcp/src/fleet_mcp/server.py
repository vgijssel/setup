"""FastMCP server initialization"""

import json
import os
from pathlib import Path

from fastmcp import FastMCP
from fleet_mcp.coder.client import CoderClient
from starlette.responses import JSONResponse


def create_mcp_server(base_url: str, token: str) -> FastMCP:
    """
    Create and configure MCP server

    Args:
        base_url: Coder API base URL
        token: Coder API token

    Returns:
        Configured FastMCP server instance
    """
    mcp = FastMCP("Fleet MCP Server")
    coder_client = CoderClient(base_url, token)

    # Initialize storage path for PR data persistence
    storage_path = Path(os.getenv("FLEET_MCP_STORAGE_PATH", "/tmp/fleet-mcp-data"))
    storage_path.mkdir(parents=True, exist_ok=True)

    def _get_pr_data_file(agent_name: str) -> Path:
        """Get the file path for an agent's PR data"""
        return storage_path / f"{agent_name}.json"

    def _load_pr_data(agent_name: str) -> dict[str, str]:
        """Load PR data from disk for an agent"""
        pr_file = _get_pr_data_file(agent_name)
        if pr_file.exists():
            try:
                with open(pr_file, "r") as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError):
                return {}
        return {}

    def _save_pr_data(agent_name: str, pr_url: str, pr_status: str) -> None:
        """Save PR data to disk for an agent"""
        pr_file = _get_pr_data_file(agent_name)
        data = {"pr_url": pr_url, "pr_status": pr_status, "agent_name": agent_name}
        try:
            with open(pr_file, "w") as f:
                json.dump(data, f, indent=2)
        except IOError as e:
            # Log error but don't fail - PR tracking is optional
            print(f"Warning: Failed to save PR data for {agent_name}: {e}")

    # Add health check endpoint
    @mcp.custom_route("/health", methods=["GET"])
    async def health_check(request):
        return JSONResponse({"status": "healthy", "service": "fleet-mcp"})

    # PR URL management endpoints
    @mcp.custom_route("/pr-url", methods=["POST"])
    async def set_pr_url(request):
        """Set the pull request URL and status for an agent"""
        data = await request.json()
        agent_name = data.get("agent_name")
        pr_url = data.get("pr_url")
        pr_status = data.get("pr_status", "open")  # Default to 'open'

        # Validate inputs
        if not agent_name or not pr_url:
            return JSONResponse(
                {"error": "agent_name and pr_url required"}, status_code=400
            )

        # Save to disk
        _save_pr_data(agent_name, pr_url, pr_status)
        return JSONResponse(
            {
                "status": "success",
                "agent_name": agent_name,
                "pr_url": pr_url,
                "pr_status": pr_status,
            }
        )

    @mcp.custom_route("/pr-url", methods=["GET"])
    async def get_pr_url(request):
        """Get the pull request URL and status for an agent"""
        agent_name = request.query_params.get("agent_name")

        if not agent_name:
            return JSONResponse({"error": "agent_name required"}, status_code=400)

        # Load from disk
        pr_data = _load_pr_data(agent_name)
        return JSONResponse(
            {
                "agent_name": agent_name,
                "pr_url": pr_data.get("pr_url"),
                "pr_status": pr_data.get("pr_status"),
            }
        )

    # Register tool groups
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools
    from fleet_mcp.tools.task_management import register_task_tools

    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)  # T070: Register task management tools
    register_discovery_tools(mcp, coder_client)  # T099: Register discovery tools

    return mcp
