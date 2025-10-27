"""FastMCP server for Coder agent fleet management.

This module sets up the MCP server and registers all available tools.
"""

import asyncio
from typing import List, Optional, Dict, Any
from fastmcp import FastMCP
from coder_mcp.tools.list_agents import list_agents
from coder_mcp.tools.get_fleet_status import get_fleet_status
from coder_mcp.tools.get_agent_details import get_agent_details
from coder_mcp.tools.get_agent_logs import get_agent_logs
from coder_mcp.tools.create_task import create_agent_task
from coder_mcp.tools.delete_agent import delete_agent
from coder_mcp.tools.send_input import send_agent_input
from coder_mcp.models import Agent, FleetStatus, LogEntry


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


@mcp.tool()
async def get_agent_details_by_id(
    user: str,
    agent_id: str,
) -> Dict[str, Any]:
    """Get detailed information about a specific agent.

    Retrieves comprehensive details for a single agent including status,
    workspace information, capabilities, current assignment, and metadata.

    Args:
        user: Username of the agent owner
        agent_id: Unique identifier of the agent/task

    Returns:
        Dict with success status and agent data or error information
    """
    return await get_agent_details(user=user, agent_id=agent_id)


@mcp.tool()
async def get_agent_execution_logs(
    user: str,
    agent_id: str,
    level: Optional[str] = None,
    limit: Optional[int] = None,
) -> Dict[str, Any]:
    """Get execution logs for a specific agent.

    Retrieves log entries from an agent's execution history. Supports
    filtering by log level and limiting the number of entries returned.

    Args:
        user: Username of the agent owner
        agent_id: Unique identifier of the agent/task
        level: Optional log level filter (debug, info, warning, error, critical)
        limit: Optional maximum number of log entries to return

    Returns:
        Dict with success status and list of log entries or error information
    """
    return await get_agent_logs(user=user, agent_id=agent_id, level=level, limit=limit)


@mcp.tool()
async def create_new_agent_task(
    user: str,
    prompt: str,
    workspace_name: str,
    template_name: Optional[str] = None,
    rich_parameters: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Create and assign a new task to an agent.

    Creates a new AI task/agent in a Coder workspace. The task will be
    assigned to the agent running in the specified workspace. Includes
    validation for workspace existence and online status.

    Args:
        user: Username of the task owner
        prompt: Task prompt/instructions for the agent
        workspace_name: Name of the workspace to create the task in
        template_name: Optional template to use for workspace creation
        rich_parameters: Optional workspace parameters (region, instance type, etc.)

    Returns:
        Dict with success status and created task data or error information
    """
    return await create_agent_task(
        user=user,
        prompt=prompt,
        workspace_name=workspace_name,
        template_name=template_name,
        rich_parameters=rich_parameters,
    )


@mcp.tool()
async def delete_agent_workspace(
    workspace_id: str,
) -> Dict[str, Any]:
    """Delete an agent workspace (cancels all tasks).

    Deletes a Coder workspace, which cancels all running tasks on that agent.
    This is a destructive operation and cannot be undone.

    Args:
        workspace_id: ID of the workspace to delete

    Returns:
        Dict with success status and deletion result or error information
    """
    return await delete_agent(workspace_id=workspace_id)


@mcp.tool()
async def send_input_to_agent(
    user: str,
    agent_id: str,
    input_text: str,
) -> Dict[str, Any]:
    """Send input/commands to a running agent.

    Sends input text to an agent, allowing interaction with or modification
    of running tasks. The agent must be running and connected to receive input.

    Args:
        user: Username of the agent owner
        agent_id: ID of the agent/task
        input_text: Input text to send to the agent

    Returns:
        Dict with success status and result or error information
    """
    return await send_agent_input(user=user, agent_id=agent_id, input_text=input_text)


def main():
    """Run the MCP server."""
    # FastMCP will handle the server lifecycle
    mcp.run()


if __name__ == "__main__":
    main()
