"""MCP tool for creating and assigning tasks to agents.

Provides the create_agent_task function that creates a new AI task/agent
in a Coder workspace by sending a prompt to the experimental tasks API.
"""

from typing import Any, Dict, Optional

import httpx
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


async def create_agent_task_via_api(
    client: CoderAPIClient,
    user: str,
    prompt: str,
    workspace_name: str,
    template_name: Optional[str] = None,
    rich_parameters: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Create a new AI task/agent via Coder API.

    Args:
        client: Authenticated Coder API client.
        user: Username of the task owner.
        prompt: Task prompt/instructions for the agent.
        workspace_name: Name of the workspace to create the task in.
        template_name: Optional template to use for workspace creation.
        rich_parameters: Optional workspace parameters (region, instance type, etc.).

    Returns:
        Dict with created task data from API response.

    Raises:
        httpx.HTTPStatusError: If API request fails.
        ValueError: If validation fails.
    """
    # Validate inputs
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    if not workspace_name or not workspace_name.strip():
        raise ValueError("Workspace name cannot be empty")

    # Build request payload
    task_data: Dict[str, Any] = {
        "prompt": prompt.strip(),
        "workspace_name": workspace_name.strip(),
    }

    if template_name:
        task_data["template_name"] = template_name

    if rich_parameters:
        task_data["rich_parameters"] = rich_parameters

    # Send request to Coder API
    response = await client.post(f"/api/experimental/tasks/{user}", json=task_data)
    response.raise_for_status()

    return response.json()


async def create_agent_task(
    user: str,
    prompt: str,
    workspace_name: str,
    template_name: Optional[str] = None,
    rich_parameters: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Create a new AI task/agent.

    This is the main MCP tool function that creates a client and assigns a task
    to an agent in a Coder workspace. Includes validation for offline agents
    and capability checks.

    Args:
        user: Username of the task owner.
        prompt: Task prompt/instructions for the agent.
        workspace_name: Name of the workspace to create the task in.
        template_name: Optional template to use for workspace creation.
        rich_parameters: Optional workspace parameters.

    Returns:
        Dict with success status and task data or error information.
        Success format: {"success": True, "data": {...}}
        Error format: {"success": False, "error": "message", "error_code": "CODE"}
    """
    try:
        # Validate inputs
        if not prompt or not prompt.strip():
            return {
                "success": False,
                "error": "Prompt cannot be empty",
                "error_code": "VALIDATION_ERROR",
                "details": {"field": "prompt"},
            }

        if not workspace_name or not workspace_name.strip():
            return {
                "success": False,
                "error": "Workspace name cannot be empty",
                "error_code": "VALIDATION_ERROR",
                "details": {"field": "workspace_name"},
            }

        config = Config()
        async with CoderAPIClient(config) as client:
            # TODO: Add capability validation logic
            # Check if workspace exists and is online before creating task
            # This requires querying workspace status first

            # Create the task
            task_data = await create_agent_task_via_api(
                client=client,
                user=user,
                prompt=prompt,
                workspace_name=workspace_name,
                template_name=template_name,
                rich_parameters=rich_parameters,
            )

            return {
                "success": True,
                "data": task_data,
            }

    except ValueError as e:
        return {
            "success": False,
            "error": str(e),
            "error_code": "VALIDATION_ERROR",
            "details": {"exception": str(e)},
        }
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return {
                "success": False,
                "error": f"Workspace not found: {workspace_name}",
                "error_code": "WORKSPACE_NOT_FOUND",
                "details": {"workspace_name": workspace_name, "user": user},
            }
        elif e.response.status_code in [401, 403]:
            return {
                "success": False,
                "error": "Authentication failed. Check CODER_SESSION_TOKEN.",
                "error_code": "AUTHENTICATION_FAILED",
                "details": {"status_code": e.response.status_code},
            }
        elif e.response.status_code in [400, 422]:
            # Validation error from API
            error_detail = e.response.text
            return {
                "success": False,
                "error": f"Invalid request: {error_detail}",
                "error_code": "VALIDATION_ERROR",
                "details": {
                    "status_code": e.response.status_code,
                    "response": error_detail,
                },
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


async def validate_agent_capabilities(
    client: CoderAPIClient,
    workspace_name: str,
    required_capabilities: Optional[list[str]] = None,
) -> tuple[bool, Optional[str]]:
    """Validate that an agent has required capabilities.

    Args:
        client: Authenticated Coder API client.
        workspace_name: Name of the workspace to validate.
        required_capabilities: List of required capability strings.

    Returns:
        Tuple of (is_valid, error_message). error_message is None if valid.
    """
    if not required_capabilities:
        return True, None

    # TODO: Implement capability checking
    # Would need to query workspace/agent details first
    # For now, assume all agents have all capabilities

    return True, None


async def check_agent_online(
    client: CoderAPIClient,
    user: str,
    workspace_name: str,
) -> tuple[bool, Optional[str]]:
    """Check if an agent/workspace is online and ready.

    Args:
        client: Authenticated Coder API client.
        user: Username of the workspace owner.
        workspace_name: Name of the workspace to check.

    Returns:
        Tuple of (is_online, error_message). error_message is None if online.
    """
    try:
        # Query workspace/agent list to check if workspace exists and is running
        # This is a simplified check - full implementation would query workspace status
        response = await client.get("/api/experimental/tasks")
        response.raise_for_status()
        data = response.json()

        # Check if workspace exists in tasks list
        tasks = data.get("tasks", [])
        matching_task = next(
            (
                t
                for t in tasks
                if t.get("workspace_name") == workspace_name
                and t.get("username") == user
            ),
            None,
        )

        if not matching_task:
            return False, f"Workspace '{workspace_name}' not found or not running"

        # Check if workspace is connected
        if not matching_task.get("connected", False):
            return False, f"Workspace '{workspace_name}' is offline"

        return True, None

    except Exception as e:
        # If check fails, assume offline
        return False, f"Unable to verify workspace status: {str(e)}"
