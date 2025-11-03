"""FastMCP server initialization"""

from fastmcp import FastMCP


def create_mcp_server() -> FastMCP:
    """
    Create and configure MCP server

    Returns:
        Configured FastMCP server instance
    """
    mcp = FastMCP("Fleet MCP Server")

    # Register tool groups
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools
    from fleet_mcp.tools.task_management import register_task_tools

    register_agent_tools(mcp)
    register_task_tools(mcp)
    register_discovery_tools(mcp)

    return mcp
