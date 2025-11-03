"""Workspace helper functions"""

from typing import Any


async def get_workspace_by_name(client, name: str) -> dict[str, Any] | None:
    """
    Get workspace by agent name from workspace name

    Args:
        client: CoderClient instance
        name: Agent name (derived from workspace name format: agent-{name})

    Returns:
        Workspace data or None if not found

    Note:
        Agent name comparison is case-insensitive. "Papi", "papi", and "PAPI"
        will all match an agent named "papi".
    """
    workspaces = await client.list_workspaces()

    # Normalize the search name to lowercase for case-insensitive comparison
    name_lower = name.lower()

    # Search by workspace name format "agent-{name}"
    expected_workspace_name = f"agent-{name_lower}"
    for workspace in workspaces:
        workspace_name = workspace.get("name", "")
        if workspace_name.lower() == expected_workspace_name:
            return workspace

    return None
