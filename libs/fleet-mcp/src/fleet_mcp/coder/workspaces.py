"""Workspace helper functions"""
from typing import Any


async def get_workspace_by_name(client, name: str) -> dict[str, Any] | None:
    """
    Get workspace by agent name from metadata

    Args:
        client: CoderClient instance
        name: Agent name (fleet_mcp_agent_name metadata value)

    Returns:
        Workspace data or None if not found
    """
    workspaces = await client.list_workspaces()

    for workspace in workspaces:
        metadata = workspace.get("metadata", {})
        if metadata.get("fleet_mcp_agent_name") == name:
            return workspace

    return None
