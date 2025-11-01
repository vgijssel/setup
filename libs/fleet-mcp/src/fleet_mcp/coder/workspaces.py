"""Workspace helper functions"""

from typing import Any


async def get_workspace_by_name(client, name: str) -> dict[str, Any] | None:
    """
    Get workspace by agent name from metadata or workspace name

    Args:
        client: CoderClient instance
        name: Agent name (fleet_mcp_agent_name metadata value or raw agent name)

    Returns:
        Workspace data or None if not found
    """
    workspaces = await client.list_workspaces()

    # First try to find by metadata (preferred method)
    for workspace in workspaces:
        metadata = workspace.get("metadata", {})
        if metadata.get("fleet_mcp_agent_name") == name:
            return workspace

    # Fallback: search by workspace name format "agent-{name}"
    # This is needed until metadata writing is implemented
    expected_workspace_name = f"agent-{name}"
    for workspace in workspaces:
        if workspace.get("name") == expected_workspace_name:
            return workspace

    return None
