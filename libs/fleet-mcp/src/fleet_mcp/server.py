"""FastMCP server initialization"""
from fastmcp import FastMCP
from fleet_mcp.coder.client import CoderClient


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

    # Register tool groups
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.task_management import register_task_tools

    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)  # T070: Register task management tools

    return mcp
