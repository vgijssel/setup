"""MCP tool for retrieving agent execution logs.

Provides the get_agent_logs function that queries Coder's experimental tasks API
to retrieve execution logs for a specific AI agent.
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
import httpx
from coder_mcp.models import LogEntry, LogLevel
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


async def get_agent_logs_from_api(
    client: CoderAPIClient,
    user: str,
    agent_id: str,
    level: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[LogEntry]:
    """Fetch agent logs from Coder API.

    Args:
        client: Authenticated Coder API client.
        user: Username of the agent owner.
        agent_id: Unique identifier of the agent/task.
        level: Optional log level filter (debug, info, warning, error, critical).
        limit: Optional maximum number of log entries to return.

    Returns:
        List of LogEntry objects.

    Raises:
        httpx.HTTPStatusError: If API request fails (e.g., 404 if agent not found).
    """
    # Build query parameters
    params: Dict[str, Any] = {}
    if limit is not None:
        params["limit"] = limit

    # Query Coder API for task logs
    response = await client.get(
        f"/api/experimental/tasks/{user}/{agent_id}/logs",
        params=params if params else None,
    )
    response.raise_for_status()

    logs_data = response.json()

    # Parse response into LogEntry objects
    log_entries: List[LogEntry] = []

    # Handle different possible response formats
    if isinstance(logs_data, list):
        # Logs returned directly as list
        raw_logs = logs_data
    elif isinstance(logs_data, dict):
        # Logs in a 'logs' or 'entries' key
        raw_logs = logs_data.get("logs", logs_data.get("entries", []))
    else:
        raw_logs = []

    for log_data in raw_logs:
        # Handle both dict and string log formats
        if isinstance(log_data, dict):
            log_entry = LogEntry(
                timestamp=_parse_timestamp(log_data.get("timestamp")),
                level=_parse_log_level(log_data.get("level", "info")),
                message=log_data.get("message", log_data.get("msg", "")),
                agent_id=log_data.get("agent_id", agent_id),
                task_id=log_data.get("task_id"),
                metadata=log_data.get("metadata", {}),
            )
        elif isinstance(log_data, str):
            # Plain string log entry
            log_entry = LogEntry(
                timestamp=datetime.now(),
                level=LogLevel.INFO,
                message=log_data,
                agent_id=agent_id,
            )
        else:
            continue

        log_entries.append(log_entry)

    # Apply client-side filtering for log level
    if level:
        target_level = _parse_log_level(level)
        log_entries = [entry for entry in log_entries if entry.level == target_level]

    return log_entries


async def get_agent_logs(
    user: str,
    agent_id: str,
    level: Optional[str] = None,
    limit: Optional[int] = None,
) -> Dict[str, Any]:
    """Get execution logs for a specific agent.

    This is the main MCP tool function that creates a client and fetches agent logs.

    Args:
        user: Username of the agent owner.
        agent_id: Unique identifier of the agent/task.
        level: Optional log level filter (debug, info, warning, error, critical).
        limit: Optional maximum number of log entries to return.

    Returns:
        Dict with success status and logs data or error information.
        Success format: {"success": True, "data": [...]"}
        Error format: {"success": False, "error": "message", "error_code": "CODE"}
    """
    try:
        config = Config()
        async with CoderAPIClient(config) as client:
            logs = await get_agent_logs_from_api(client, user, agent_id, level, limit)
            return {
                "success": True,
                "data": [log.model_dump(mode="json") for log in logs],
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


def _parse_log_level(level_str: str) -> LogLevel:
    """Parse log level string to LogLevel enum.

    Args:
        level_str: Log level string (case-insensitive).

    Returns:
        LogLevel enum value.
    """
    level_map = {
        "debug": LogLevel.DEBUG,
        "info": LogLevel.INFO,
        "information": LogLevel.INFO,
        "warning": LogLevel.WARNING,
        "warn": LogLevel.WARNING,
        "error": LogLevel.ERROR,
        "critical": LogLevel.CRITICAL,
        "fatal": LogLevel.CRITICAL,
    }
    return level_map.get(level_str.lower(), LogLevel.INFO)


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
