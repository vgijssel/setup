"""FastMCP server initialization"""

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

    def _get_pr_url_file(agent_name: str) -> Path:
        """Get the file path for an agent's PR URL"""
        return storage_path / f"{agent_name}_pr_url.txt"

    def _load_pr_url(agent_name: str) -> str | None:
        """Load PR URL from disk for an agent"""
        pr_file = _get_pr_url_file(agent_name)
        if pr_file.exists():
            try:
                with open(pr_file, "r") as f:
                    return f.read().strip()
            except IOError:
                return None
        return None

    def _save_pr_url(agent_name: str, pr_url: str) -> None:
        """Save PR URL to disk for an agent"""
        pr_file = _get_pr_url_file(agent_name)
        try:
            with open(pr_file, "w") as f:
                f.write(pr_url)
        except IOError as e:
            # Log error but don't fail - PR tracking is optional
            print(f"Warning: Failed to save PR URL for {agent_name}: {e}")

    # Add health check endpoint
    @mcp.custom_route("/health", methods=["GET"])
    async def health_check(request):
        return JSONResponse({"status": "healthy", "service": "fleet-mcp"})

    # PR URL management endpoint
    @mcp.custom_route("/pr-url", methods=["POST"])
    async def set_pr_url(request):
        """Set the pull request URL for an agent"""
        data = await request.json()
        agent_name = data.get("agent_name")
        pr_url = data.get("pr_url")

        # Validate inputs
        if not agent_name or not pr_url:
            return JSONResponse(
                {"error": "agent_name and pr_url required"}, status_code=400
            )

        # Save to disk
        _save_pr_url(agent_name, pr_url)
        return JSONResponse(
            {
                "status": "success",
                "agent_name": agent_name,
                "pr_url": pr_url,
            }
        )

    @mcp.custom_route("/pr-url", methods=["GET"])
    async def get_pr_url(request):
        """Get the pull request URL for an agent"""
        agent_name = request.query_params.get("agent_name")

        if not agent_name:
            return JSONResponse({"error": "agent_name required"}, status_code=400)

        # Load from disk
        pr_url = _load_pr_url(agent_name)
        return JSONResponse(
            {
                "agent_name": agent_name,
                "pr_url": pr_url,
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
