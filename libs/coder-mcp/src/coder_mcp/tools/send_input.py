"""MCP tool for sending input/commands to running agents.

Provides the send_agent_input function that sends input to an agent
via the Coder experimental tasks API.
"""

from typing import Dict, Any
import httpx
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


async def send_input_via_api(
    client: CoderAPIClient,
    user: str,
    agent_id: str,
    input_text: str,
) -> Dict[str, Any]:
    """Send input to a running agent via Coder API.

    Args:
        client: Authenticated Coder API client.
        user: Username of the agent owner.
        agent_id: ID of the agent/task.
        input_text: Input text to send to the agent.

    Returns:
        Dict with API response.

    Raises:
        httpx.HTTPStatusError: If API request fails.
    """
    # POST /api/experimental/tasks/{user}/{id}/send
    input_data = {
        "input": input_text,
    }

    response = await client.post(
        f"/api/experimental/tasks/{user}/{agent_id}/send",
        json=input_data,
    )
    response.raise_for_status()

    # API may return empty response or confirmation
    try:
        return response.json()
    except Exception:
        return {"status": "sent"}


async def send_agent_input(
    user: str,
    agent_id: str,
    input_text: str,
) -> Dict[str, Any]:
    """Send input/commands to a running agent.

    This is the main MCP tool function that sends input to an agent,
    allowing the superagent to interact with or modify running tasks.

    Args:
        user: Username of the agent owner.
        agent_id: ID of the agent/task.
        input_text: Input text to send to the agent.

    Returns:
        Dict with success status and result data or error information.
    """
    try:
        if not input_text or not input_text.strip():
            return {
                "success": False,
                "error": "Input text cannot be empty",
                "error_code": "VALIDATION_ERROR",
                "details": {"field": "input_text"},
            }

        config = Config()
        async with CoderAPIClient(config) as client:
            result = await send_input_via_api(
                client, user, agent_id, input_text.strip()
            )
            return {
                "success": True,
                "data": result,
                "message": f"Input sent to agent {agent_id}",
            }

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
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
