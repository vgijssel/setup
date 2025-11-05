"""
Hand-written fixtures for edge cases, errors, and special states.

These fixtures complement the auto-generated fixtures from real API responses
by providing test cases for error conditions and edge cases that are difficult
or impractical to record from a live API.

Usage:
    from tests.fixtures import manual

    # Use in tests
    error = manual.make_workspace_error_404()
    empty_list = manual.make_workspaces_empty()
"""

from typing import Any

# Error Response Fixtures


def make_error_404() -> dict[str, Any]:
    """Generic 404 Not Found error response."""
    return {
        "message": "Not Found",
        "detail": "The requested resource could not be found",
    }


def make_workspace_error_404() -> dict[str, Any]:
    """Workspace not found error response."""
    return {
        "message": "Workspace not found",
        "detail": "Workspace with the specified ID does not exist",
    }


def make_template_error_404() -> dict[str, Any]:
    """Template not found error response."""
    return {
        "message": "Template not found",
        "detail": "Template with the specified ID does not exist",
    }


def make_error_401() -> dict[str, Any]:
    """Unauthorized error response."""
    return {
        "message": "Unauthorized",
        "detail": "Invalid or missing authentication credentials",
    }


def make_error_403() -> dict[str, Any]:
    """Forbidden error response."""
    return {
        "message": "Forbidden",
        "detail": "You do not have permission to access this resource",
    }


def make_error_500() -> dict[str, Any]:
    """Internal server error response."""
    return {
        "message": "Internal Server Error",
        "detail": "An unexpected error occurred on the server",
    }


def make_error_rate_limit() -> dict[str, Any]:
    """Rate limit error response."""
    return {
        "message": "Too Many Requests",
        "detail": "Rate limit exceeded. Please try again later.",
        "retry_after": 60,
    }


# Empty List Fixtures


def make_workspaces_empty() -> dict[str, Any]:
    """Empty workspace list response."""
    return {
        "workspaces": [],
        "count": 0,
    }


def make_templates_empty() -> list[Any]:
    """Empty template list response."""
    return []


def make_builds_empty() -> list[Any]:
    """Empty builds list response."""
    return []


# State Transition Fixtures


def make_workspace_pending() -> dict[str, Any]:
    """Workspace in pending state (build starting)."""
    return {
        "id": "test-workspace-pending",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-pending",
            "workspace_id": "test-workspace-pending",
            "workspace_name": "test-workspace",
            "status": "pending",
            "transition": "start",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z",
            "job": {
                "id": "test-job-pending",
                "status": "pending",
                "created_at": "2025-01-01T00:00:00Z",
            },
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
    }


def make_workspace_starting() -> dict[str, Any]:
    """Workspace in starting state (build in progress)."""
    return {
        "id": "test-workspace-starting",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-starting",
            "workspace_id": "test-workspace-starting",
            "workspace_name": "test-workspace",
            "status": "starting",
            "transition": "start",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:01Z",
            "job": {
                "id": "test-job-starting",
                "status": "running",
                "created_at": "2025-01-01T00:00:00Z",
                "started_at": "2025-01-01T00:00:01Z",
            },
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:01Z",
    }


def make_workspace_stopping() -> dict[str, Any]:
    """Workspace in stopping state (shutdown in progress)."""
    return {
        "id": "test-workspace-stopping",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-stopping",
            "workspace_id": "test-workspace-stopping",
            "workspace_name": "test-workspace",
            "status": "stopping",
            "transition": "stop",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:05:00Z",
            "job": {
                "id": "test-job-stopping",
                "status": "running",
                "created_at": "2025-01-01T00:05:00Z",
                "started_at": "2025-01-01T00:05:00Z",
            },
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:05:00Z",
    }


def make_workspace_stopped() -> dict[str, Any]:
    """Workspace in stopped state (completely shut down)."""
    return {
        "id": "test-workspace-stopped",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-stopped",
            "workspace_id": "test-workspace-stopped",
            "workspace_name": "test-workspace",
            "status": "stopped",
            "transition": "stop",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:05:30Z",
            "job": {
                "id": "test-job-stopped",
                "status": "succeeded",
                "created_at": "2025-01-01T00:05:00Z",
                "started_at": "2025-01-01T00:05:00Z",
                "completed_at": "2025-01-01T00:05:30Z",
            },
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:05:30Z",
    }


def make_workspace_failed() -> dict[str, Any]:
    """Workspace in failed state (build failed)."""
    return {
        "id": "test-workspace-failed",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-failed",
            "workspace_id": "test-workspace-failed",
            "workspace_name": "test-workspace",
            "status": "failed",
            "transition": "start",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:01:00Z",
            "job": {
                "id": "test-job-failed",
                "status": "failed",
                "error": "Failed to provision workspace: insufficient resources",
                "created_at": "2025-01-01T00:00:00Z",
                "started_at": "2025-01-01T00:00:01Z",
                "completed_at": "2025-01-01T00:01:00Z",
            },
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:01:00Z",
    }


def make_workspace_deleting() -> dict[str, Any]:
    """Workspace in deleting state (deletion in progress)."""
    return {
        "id": "test-workspace-deleting",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-deleting",
            "workspace_id": "test-workspace-deleting",
            "workspace_name": "test-workspace",
            "status": "deleting",
            "transition": "delete",
            "created_at": "2025-01-01T00:10:00Z",
            "updated_at": "2025-01-01T00:10:00Z",
            "job": {
                "id": "test-job-deleting",
                "status": "running",
                "created_at": "2025-01-01T00:10:00Z",
                "started_at": "2025-01-01T00:10:00Z",
            },
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:10:00Z",
        "deleting_at": "2025-01-01T00:10:00Z",
    }


# Agent Status Fixtures


def make_agent_workspace_idle() -> dict[str, Any]:
    """Fleet agent workspace in idle status."""
    return {
        "id": "test-agent-workspace-idle",
        "name": "fleet-test-agent",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-idle",
            "workspace_id": "test-agent-workspace-idle",
            "workspace_name": "fleet-test-agent",
            "status": "running",
            "transition": "start",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:02:00Z",
            "job": {
                "id": "test-job-idle",
                "status": "succeeded",
                "created_at": "2025-01-01T00:00:00Z",
                "started_at": "2025-01-01T00:00:01Z",
                "completed_at": "2025-01-01T00:02:00Z",
            },
        },
        "metadata": {
            "fleet_mcp_agent_name": "test-agent",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_role": "coder",
            "fleet_mcp_agent_status": "idle",
            "fleet_mcp_current_task": "",
            "fleet_mcp_created_at": "2025-01-01T00:00:00Z",
        },
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:02:00Z",
    }


def make_agent_workspace_busy() -> dict[str, Any]:
    """Fleet agent workspace in busy status."""
    return {
        "id": "test-agent-workspace-busy",
        "name": "fleet-test-agent",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-busy",
            "workspace_id": "test-agent-workspace-busy",
            "workspace_name": "fleet-test-agent",
            "status": "running",
            "transition": "start",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:02:00Z",
            "job": {
                "id": "test-job-busy",
                "status": "succeeded",
                "created_at": "2025-01-01T00:00:00Z",
                "started_at": "2025-01-01T00:00:01Z",
                "completed_at": "2025-01-01T00:02:00Z",
            },
        },
        "metadata": {
            "fleet_mcp_agent_name": "test-agent",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_role": "coder",
            "fleet_mcp_agent_status": "busy",
            "fleet_mcp_current_task": "Implementing feature X",
            "fleet_mcp_created_at": "2025-01-01T00:00:00Z",
        },
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:02:00Z",
    }


def make_agent_workspace_offline() -> dict[str, Any]:
    """Fleet agent workspace in offline status (stopped)."""
    return {
        "id": "test-agent-workspace-offline",
        "name": "fleet-test-agent",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-offline",
            "workspace_id": "test-agent-workspace-offline",
            "workspace_name": "fleet-test-agent",
            "status": "stopped",
            "transition": "stop",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:10:00Z",
            "job": {
                "id": "test-job-offline",
                "status": "succeeded",
                "created_at": "2025-01-01T00:10:00Z",
                "started_at": "2025-01-01T00:10:00Z",
                "completed_at": "2025-01-01T00:10:30Z",
            },
        },
        "metadata": {
            "fleet_mcp_agent_name": "test-agent",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_role": "coder",
            "fleet_mcp_agent_status": "offline",
            "fleet_mcp_current_task": "",
            "fleet_mcp_created_at": "2025-01-01T00:00:00Z",
        },
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:10:30Z",
    }


# Validation/Edge Case Fixtures


def make_workspace_with_long_name() -> dict[str, Any]:
    """Workspace with maximum length name (edge case)."""
    long_name = "a" * 63  # Maximum workspace name length
    return {
        "id": "test-workspace-long-name",
        "name": long_name,
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-long-name",
            "status": "running",
        },
        "metadata": {},
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
    }


def make_workspace_with_special_metadata() -> dict[str, Any]:
    """Workspace with various metadata types (edge case)."""
    return {
        "id": "test-workspace-metadata",
        "name": "test-workspace",
        "owner_id": "test-owner-001",
        "owner_name": "test-user",
        "template_id": "test-template-001",
        "template_name": "Setup",
        "template_display_name": "Setup",
        "latest_build": {
            "id": "test-build-metadata",
            "status": "running",
        },
        "metadata": {
            "string_value": "test",
            "number_value": "123",
            "boolean_value": "true",
            "empty_value": "",
            "special_chars": "test@#$%^&*()",
            "unicode": "テスト",
        },
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
    }
