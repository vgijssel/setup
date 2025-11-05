"""Factory functions for creating agent-specific test fixtures"""

from datetime import datetime, timezone


def create_agent_workspace(
    workspace_id: str = "agent-workspace-123",
    agent_name: str = "test-agent",
    project: str = "test-project",
    role: str = "coder",
    task: str = "Test task",
    status: str = "running",
    agent_status: str = "idle",
    **overrides,
):
    """Factory for creating fleet-mcp agent workspace fixtures

    Args:
        workspace_id: Unique workspace identifier
        agent_name: Name of the agent
        project: Project name (template name)
        role: Agent role (preset name)
        task: Current task description
        status: Workspace build status
        agent_status: Agent status (idle, busy, offline)
        **overrides: Additional fields to override

    Returns:
        dict representing a fleet-mcp agent workspace
    """
    from .workspace_factory import create_workspace

    metadata = {
        "fleet_mcp_agent_name": agent_name,
        "fleet_mcp_project": project,
        "fleet_mcp_role": role,
        "fleet_mcp_agent_status": agent_status,
        "fleet_mcp_current_task": task if agent_status == "busy" else "",
        "fleet_mcp_created_at": datetime.now(timezone.utc).isoformat(),
    }

    workspace = create_workspace(
        workspace_id=workspace_id,
        name=f"fleet-{agent_name}",
        template_name=project,
        status=status,
        metadata=metadata,
    )
    workspace.update(overrides)
    return workspace


def create_app(
    app_id: str = "app-123",
    agent_id: str = "agent-123",
    agent_name: str = "main",
    slug: str = "agentapi",
    display_name: str = "AgentAPI",
    url: str = "https://agent-test.coder.example.com/apps/agentapi",
    external: bool = True,
    sharing_level: str = "owner",
    health: str = "healthy",
    **overrides,
):
    """Factory for creating workspace app test fixtures

    Args:
        app_id: Unique app identifier
        agent_id: ID of agent running the app
        agent_name: Name of agent
        slug: App slug (used in URL)
        display_name: Human-readable app name
        url: Full URL to access the app
        external: Whether app is externally accessible
        sharing_level: Sharing level (owner, authenticated, public)
        health: Health status (healthy, initializing, unhealthy)
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder workspace app
    """
    app = {
        "id": app_id,
        "slug": slug,
        "display_name": display_name,
        "command": "",
        "icon": "",
        "subdomain": False,
        "subdomain_name": "",
        "sharing_level": sharing_level,
        "health": health,
        "external": external,
        "url": url,
        "agent": {
            "id": agent_id,
            "name": agent_name,
        },
    }
    app.update(overrides)
    return app


def create_build(
    build_id: str = "build-123",
    workspace_id: str = "workspace-123",
    workspace_name: str = "test-workspace",
    status: str = "running",
    transition: str = "start",
    **overrides,
):
    """Factory for creating workspace build test fixtures

    Args:
        build_id: Unique build identifier
        workspace_id: ID of workspace being built
        workspace_name: Name of workspace
        status: Build status (pending, starting, running, stopping, stopped, canceling, canceled, failed)
        transition: Build transition (start, stop, delete)
        **overrides: Additional fields to override

    Returns:
        dict representing a Coder workspace build
    """
    build = {
        "id": build_id,
        "workspace_id": workspace_id,
        "workspace_name": workspace_name,
        "workspace_owner_id": "owner-123",
        "workspace_owner_name": "test-owner",
        "template_version_id": "version-123",
        "template_version_name": "1.0.0",
        "build_number": 1,
        "transition": transition,
        "status": status,
        "reason": "initiator",
        "job": {
            "id": f"job-{build_id}",
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
    }
    build.update(overrides)
    return build
