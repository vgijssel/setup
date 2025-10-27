"""MCP tool for listing all agents in the fleet.

Provides the list_agents function that queries Coder's experimental tasks API
to retrieve all AI agents and their current status.
"""

from typing import List, Optional
from datetime import datetime
import httpx
from coder_mcp.models import Agent, AgentStatus
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


async def list_agents_from_api(
    client: CoderAPIClient,
    status: Optional[str] = None,
    user: Optional[str] = None,
) -> List[Agent]:
    """Fetch list of agents from Coder API.

    Args:
        client: Authenticated Coder API client.
        status: Optional status filter (e.g., "idle", "busy", "offline").
        user: Optional username filter.

    Returns:
        List of Agent objects.

    Raises:
        httpx.HTTPStatusError: If API request fails.
    """
    # Query Coder API for experimental tasks
    # Note: Coder API may not support query parameters, so we filter client-side
    response = await client.get("/api/experimental/tasks")
    response.raise_for_status()

    data = response.json()

    # Parse response into Agent objects
    agents = []
    for task_data in data.get('tasks', []):
        # Map Coder task fields to Agent model
        agent = Agent(
            id=task_data.get('id'),
            user=task_data.get('owner_name', task_data.get('username', task_data.get('user', 'unknown'))),
            workspace_id=task_data.get('workspace_id', task_data.get('id', '')),
            workspace_name=task_data.get('name', task_data.get('workspace_name', '')),
            status=_map_task_status(task_data.get('status', 'unknown')),
            created_at=_parse_timestamp(task_data.get('created_at')),
            updated_at=_parse_timestamp(task_data.get('updated_at')),
            last_activity_at=_parse_timestamp(task_data.get('last_activity_at')),
            connected=task_data.get('connected', False),
            capabilities=task_data.get('capabilities', []),
            current_assignment=task_data.get('initial_prompt', task_data.get('prompt')),
            metadata=task_data.get('metadata', {}),
        )
        agents.append(agent)

    # Apply client-side filtering
    if status:
        agents = [a for a in agents if a.status.value == status.lower()]
    if user:
        agents = [a for a in agents if a.user == user]

    return agents


async def list_agents(
    status: Optional[str] = None,
    user: Optional[str] = None,
) -> List[Agent]:
    """List all agents in the fleet.

    This is the main MCP tool function that creates a client and fetches agents.

    Args:
        status: Optional status filter.
        user: Optional username filter.

    Returns:
        List of Agent objects.
    """
    config = Config()
    async with CoderAPIClient(config) as client:
        return await list_agents_from_api(client, status=status, user=user)


def _map_task_status(status_str: str) -> AgentStatus:
    """Map Coder task status to AgentStatus enum.

    Args:
        status_str: Status string from Coder API.

    Returns:
        AgentStatus enum value.
    """
    status_map = {
        'running': AgentStatus.RUNNING,
        'idle': AgentStatus.IDLE,
        'busy': AgentStatus.BUSY,
        'offline': AgentStatus.OFFLINE,
        'error': AgentStatus.ERROR,
        'stopped': AgentStatus.STOPPED,
        'pending': AgentStatus.IDLE,  # Map pending to idle
        'failed': AgentStatus.ERROR,  # Map failed to error
    }
    return status_map.get(status_str.lower(), AgentStatus.OFFLINE)


def _parse_timestamp(ts_str: Optional[str]) -> datetime:
    """Parse ISO 8601 timestamp string.

    Args:
        ts_str: Timestamp string or None.

    Returns:
        datetime object or current time if None.
    """
    if not ts_str:
        return datetime.now()

    try:
        # Try parsing with timezone
        return datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        # Fallback to current time
        return datetime.now()
