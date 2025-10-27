"""FastMCP server for Coder agent fleet management.

This module sets up the MCP server and registers all available tools.
"""

import asyncio
from typing import List, Optional
from fastmcp import FastMCP
from coder_mcp.tools.list_agents import list_agents
from coder_mcp.tools.get_fleet_status import get_fleet_status
from coder_mcp.models import Agent, FleetStatus


# Initialize FastMCP server
mcp = FastMCP("Coder Agent Fleet Management")


@mcp.tool()
async def list_all_agents(
    status: Optional[str] = None,
    user: Optional[str] = None,
) -> List[Agent]:
    """List all AI agents in the Coder fleet.

    Queries Coder's experimental tasks API to retrieve all agents and their
    current status. Supports filtering by status and user.

    Args:
        status: Optional status filter (idle, busy, running, offline, error, stopped)
        user: Optional username filter

    Returns:
        List of Agent objects with current status and metadata
    """
    return await list_agents(status=status, user=user)


@mcp.tool()
async def get_fleet_status_metrics() -> FleetStatus:
    """Get aggregate fleet status metrics.

    Computes fleet-wide metrics including:
    - Total agent count and breakdown by status
    - Fleet utilization (percentage of agents busy)
    - Health metrics (percentage of healthy agents)
    - Active task count

    Returns:
        FleetStatus object with computed metrics
    """
    return await get_fleet_status()


def main():
    """Run the MCP server."""
    # FastMCP will handle the server lifecycle
    mcp.run()


if __name__ == "__main__":
    main()
