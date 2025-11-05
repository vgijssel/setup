"""Factory functions for creating workspace test fixtures"""

from datetime import datetime, timezone


def create_workspace(
    workspace_id: str = "test-workspace-123",
    name: str = "agent-test",
    owner_name: str = "test-owner",
    template_name: str = "test-template",
    status: str = "running",
    metadata: dict | None = None,
    **overrides,
):
    """Factory for creating workspace test fixtures

    Args:
        workspace_id: Unique workspace identifier
        name: Workspace name
        owner_name: Name of workspace owner
        template_name: Name of template used
        status: Build status (running, starting, stopping, stopped, canceled, failed)
        metadata: Workspace metadata dict
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder workspace
    """
    if metadata is None:
        metadata = {}

    workspace = {
        "id": workspace_id,
        "name": name,
        "owner_id": "owner-123",
        "owner_name": owner_name,
        "template_id": "template-123",
        "template_name": template_name,
        "template_display_name": template_name.title(),
        "template_icon": "",
        "template_version_id": "version-123",
        "template_version_name": "1.0.0",
        "outdated": False,
        "latest_build": {
            "id": f"build-{workspace_id}",
            "workspace_id": workspace_id,
            "workspace_name": name,
            "workspace_owner_id": "owner-123",
            "workspace_owner_name": owner_name,
            "template_version_id": "version-123",
            "template_version_name": "1.0.0",
            "build_number": 1,
            "transition": "start",
            "status": status,
            "reason": "initiator",
            "job": {
                "id": f"job-{workspace_id}",
                "created_at": datetime.now(timezone.utc).isoformat(),
                "started_at": datetime.now(timezone.utc).isoformat(),
                "completed_at": (
                    datetime.now(timezone.utc).isoformat()
                    if status in ("running", "stopped", "canceled", "failed")
                    else None
                ),
                "status": "succeeded" if status == "running" else "running",
                "error": None if status == "running" else "Build failed",
                "worker_id": "worker-123",
            },
            "deadline": None,
            "max_deadline": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "daily_cost": 0,
        },
        "last_used_at": datetime.now(timezone.utc).isoformat(),
        "autostart_schedule": None,
        "ttl_ms": None,
        "health": {
            "healthy": status == "running",
            "failing_agents": [],
        },
        "metadata": metadata,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "deleting_at": None,
        "dormant_at": None,
        "automatic_updates": "never",
        "allow_renames": True,
    }
    workspace.update(overrides)
    return workspace
