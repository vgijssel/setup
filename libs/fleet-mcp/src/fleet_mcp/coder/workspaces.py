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

    Note:
        Agent name comparison is case-insensitive. "Papi", "papi", and "PAPI"
        will all match an agent named "papi".
    """
    workspaces = await client.list_workspaces()

    # Normalize the search name to lowercase for case-insensitive comparison
    name_lower = name.lower()

    # First try to find by metadata (preferred method)
    for workspace in workspaces:
        metadata = workspace.get("metadata", {})
        metadata_name = metadata.get("fleet_mcp_agent_name", "")
        if metadata_name.lower() == name_lower:
            return workspace

    # Fallback: search by workspace name format "agent-{name}"
    # This is needed until metadata writing is implemented
    expected_workspace_name = f"agent-{name_lower}"
    for workspace in workspaces:
        workspace_name = workspace.get("name", "")
        if workspace_name.lower() == expected_workspace_name:
            return workspace

    return None
