"""MCP tool for deleting agent workspaces.

Provides the delete_agent function that deletes a Coder workspace,
which cancels all running tasks for that agent.
"""

from typing import Dict, Any
import httpx
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


async def delete_agent_via_api(
    client: CoderAPIClient,
    workspace_id: str,
) -> Dict[str, Any]:
    """Delete an agent workspace via Coder API.

    Args:
        client: Authenticated Coder API client.
        workspace_id: ID of the workspace to delete.

    Returns:
        Dict with deletion result from API response.

    Raises:
        httpx.HTTPStatusError: If API request fails.
    """
    # POST /api/v2/workspaces/{id}/builds with transition=delete
    build_data = {
        "transition": "delete",
    }

    response = await client.post(
        f"/api/v2/workspaces/{workspace_id}/builds",
        json=build_data,
    )
    response.raise_for_status()

    return response.json()


async def delete_agent(
    workspace_id: str,
) -> Dict[str, Any]:
    """Delete an agent workspace (cancels all tasks).

    This is the main MCP tool function that deletes a workspace,
    effectively canceling all tasks running on that agent.

    Args:
        workspace_id: ID of the workspace to delete.

    Returns:
        Dict with success status and result data or error information.
    """
    try:
        if not workspace_id or not workspace_id.strip():
            return {
                "success": False,
                "error": "Workspace ID cannot be empty",
                "error_code": "VALIDATION_ERROR",
                "details": {"field": "workspace_id"},
            }

        config = Config()
        async with CoderAPIClient(config) as client:
            result = await delete_agent_via_api(client, workspace_id.strip())
            return {
                "success": True,
                "data": result,
                "message": f"Workspace {workspace_id} deletion initiated",
            }

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return {
                "success": False,
                "error": f"Workspace not found: {workspace_id}",
                "error_code": "WORKSPACE_NOT_FOUND",
                "details": {"workspace_id": workspace_id},
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
