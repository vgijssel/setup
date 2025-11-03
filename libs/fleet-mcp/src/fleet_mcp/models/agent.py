"""Agent data model and related types"""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    """Agent status enum representing workspace and task states"""

    # Workspace lifecycle states
    PENDING = "pending"  # Workspace being provisioned
    STARTING = "starting"  # Workspace starting up

    # Active states (workspace running)
    BUSY = "busy"  # Agent working on a task
    IDLE = "idle"  # Agent ready for work

    # Shutdown states
    STOPPING = "stopping"  # Workspace shutting down
    STOPPED = "stopped"  # Workspace stopped

    # Error states
    FAILED = "failed"  # Workspace operation failed

    # Cancellation states
    CANCELING = "canceling"  # Operation being canceled
    CANCELED = "canceled"  # Operation was canceled

    # Deletion states
    DELETING = "deleting"  # Workspace being deleted
    DELETED = "deleted"  # Workspace deleted


class Agent(BaseModel):
    """Agent model representing a Claude Code instance in a Coder workspace"""

    name: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9-]+$")
    workspace_id: str
    status: AgentStatus
    role: str  # Dynamic - validated against Coder workspace presets
    project: str
    last_task: str | None = None
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def from_workspace(
        workspace: dict[str, Any],
        agent_metadata: dict[str, str] | None = None,
        task_data: dict[str, Any] | None = None,
        template_display_name: str | None = None,
    ) -> "Agent":
        """
        Convert Coder workspace to Agent model

        Args:
            workspace: Workspace data from Coder API
            agent_metadata: Agent metadata from watch-metadata endpoint (optional, unused)
            task_data: Task data from experimental task API (optional)
            template_display_name: Template display name for the project (optional)
        """
        # Extract agent name from workspace name (workspace name format: agent-{name})
        workspace_name = workspace.get("name", "")
        agent_name = workspace_name.removeprefix("agent-")

        # Derive status from workspace state and task API
        workspace_status = workspace.get("latest_build", {}).get("status", "unknown")

        # Get last task from task API if available
        last_task = None
        if task_data:
            current_state = task_data.get("current_state") or {}
            task_message = current_state.get("message", "")

            # Always set last_task if there's a message
            if task_message:
                last_task = task_message

        if workspace_status != "running":
            # Map workspace status to agent status
            status_map = {
                "pending": AgentStatus.PENDING,
                "starting": AgentStatus.STARTING,
                "stopping": AgentStatus.STOPPING,
                "stopped": AgentStatus.STOPPED,
                "failed": AgentStatus.FAILED,
                "canceling": AgentStatus.CANCELING,
                "canceled": AgentStatus.CANCELED,
                "deleting": AgentStatus.DELETING,
                "deleted": AgentStatus.DELETED,
            }
            status = status_map.get(workspace_status, AgentStatus.FAILED)
        elif task_data:
            # Use task API state to determine status
            current_state = task_data.get("current_state") or {}
            task_state = current_state.get("state", "idle")

            if task_state == "working":
                status = AgentStatus.BUSY
            elif task_state == "failure":
                status = AgentStatus.FAILED
            else:  # idle or any other state
                status = AgentStatus.IDLE
        else:
            # Fallback to idle if no task data
            status = AgentStatus.IDLE

        # Get project display name from parameter or fall back to template name
        project = template_display_name
        if not project or project == "unknown":
            # Fall back to template name from workspace
            template_name = workspace.get("template_name", "unknown")
            project = template_name if template_name != "unknown" else "unknown"

        return Agent(
            name=agent_name or "unknown",
            workspace_id=workspace.get("id", "unknown"),
            status=status,
            role="coder",  # Default role
            project=project,
            last_task=last_task,
            created_at=datetime.fromisoformat(
                workspace.get("created_at", datetime.now().isoformat())
            ),
            updated_at=datetime.fromisoformat(
                workspace.get("updated_at", datetime.now().isoformat())
            ),
        )
