"""FastMCP server initialization"""

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

    # In-memory storage for PR URLs (agent_name -> pr_url)
    pr_url_storage: dict[str, str] = {}

    # Add health check endpoint
    @mcp.custom_route("/health", methods=["GET"])
    async def health_check(request):
        return JSONResponse({"status": "healthy", "service": "fleet-mcp"})

    # PR URL management endpoints
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

        pr_url_storage[agent_name] = pr_url
        return JSONResponse(
            {"status": "success", "agent_name": agent_name, "pr_url": pr_url}
        )

    @mcp.custom_route("/pr-url", methods=["GET"])
    async def get_pr_url(request):
        """Get the pull request URL for an agent"""
        agent_name = request.query_params.get("agent_name")

        if not agent_name:
            return JSONResponse({"error": "agent_name required"}, status_code=400)

        pr_url = pr_url_storage.get(agent_name)
        return JSONResponse({"agent_name": agent_name, "pr_url": pr_url})

    # Register tool groups
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools
    from fleet_mcp.tools.task_management import register_task_tools

    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)  # T070: Register task management tools
    register_discovery_tools(mcp, coder_client)  # T099: Register discovery tools

    return mcp
