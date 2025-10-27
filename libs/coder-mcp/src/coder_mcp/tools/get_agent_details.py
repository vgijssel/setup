"""MCP tool for getting detailed information about a specific agent.

Provides the get_agent_details function that queries Coder's experimental tasks API
to retrieve detailed information about a single AI agent by its ID.
"""

from typing import Dict, Any, Optional
from datetime import datetime
import httpx
from coder_mcp.models import Agent, AgentStatus
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


async def get_agent_details_from_api(
    client: CoderAPIClient,
    user: str,
    agent_id: str,
) -> Agent:
    """Fetch detailed agent information from Coder API.

    Args:
        client: Authenticated Coder API client.
        user: Username of the agent owner.
        agent_id: Unique identifier of the agent/task.

    Returns:
        Agent object with detailed information.

    Raises:
        httpx.HTTPStatusError: If API request fails (e.g., 404 if agent not found).
    """
    # Query Coder API for specific task details
    response = await client.get(f"/api/experimental/tasks/{user}/{agent_id}")
    response.raise_for_status()

    task_data = response.json()

    # Map Coder task fields to Agent model
    agent = Agent(
        id=task_data.get("id", agent_id),
        user=task_data.get("owner_name", task_data.get("username", task_data.get("user", user))),
        workspace_id=task_data.get("workspace_id", task_data.get("id", "")),
        workspace_name=task_data.get("name", task_data.get("workspace_name", "")),
        status=_map_task_status(task_data.get("status", "unknown")),
        created_at=_parse_timestamp(task_data.get("created_at")),
        updated_at=_parse_timestamp(task_data.get("updated_at")),
        last_activity_at=_parse_timestamp(task_data.get("last_activity_at")),
        connected=task_data.get("connected", False),
        capabilities=task_data.get("capabilities", []),
        current_assignment=task_data.get("initial_prompt", task_data.get("prompt")),
        metadata=task_data.get("metadata", {}),
    )

    return agent


async def get_agent_details(
    user: str,
    agent_id: str,
) -> Dict[str, Any]:
    """Get detailed information about a specific agent.

    This is the main MCP tool function that creates a client and fetches agent details.

    Args:
        user: Username of the agent owner.
        agent_id: Unique identifier of the agent/task.

    Returns:
        Dict with success status and agent data or error information.
        Success format: {"success": True, "data": {...}}
        Error format: {"success": False, "error": "message", "error_code": "CODE"}
    """
    try:
        config = Config()
        async with CoderAPIClient(config) as client:
            agent = await get_agent_details_from_api(client, user, agent_id)
            return {
                "success": True,
                "data": agent.model_dump(mode="json"),
            }
    except httpx.HTTPStatusError as e:
        if e.response.status_code in [400, 404]:
            # Coder API returns 400 for non-existent agents
            return {
                "success": False,
                "error": f"Agent not found: {agent_id}",
                "error_code": "AGENT_NOT_FOUND",
                "details": {"user": user, "agent_id": agent_id},
            }
        elif e.response.status_code in [401, 403]:
            return {
                "success": False,
                "error": "Authentication failed. Check CODER_SESSION_TOKEN.",
                "error_code": "AUTHENTICATION_FAILED",
                "details": {"status_code": e.response.status_code},
            }
        else:
            return {
                "success": False,
                "error": f"Coder API error: {e.response.status_code} - {e.response.text}",
                "error_code": "CODER_API_ERROR",
                "details": {"status_code": e.response.status_code},
            }
    except httpx.RequestError as e:
        return {
            "success": False,
            "error": f"Network error: {str(e)}",
            "error_code": "NETWORK_ERROR",
            "details": {"exception": str(e)},
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "error_code": "INTERNAL_ERROR",
            "details": {"exception": str(e)},
        }


def _map_task_status(status_str: str) -> AgentStatus:
    """Map Coder task status to AgentStatus enum.

    Args:
        status_str: Status string from Coder API.

    Returns:
        AgentStatus enum value.
    """
    status_map = {
        "running": AgentStatus.RUNNING,
        "idle": AgentStatus.IDLE,
        "busy": AgentStatus.BUSY,
        "offline": AgentStatus.OFFLINE,
        "error": AgentStatus.ERROR,
        "stopped": AgentStatus.STOPPED,
        "pending": AgentStatus.IDLE,  # Map pending to idle
        "failed": AgentStatus.ERROR,  # Map failed to error
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
        return datetime.fromisoformat(ts_str.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        # Fallback to current time
        return datetime.now()
