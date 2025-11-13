"""Agent domain model."""

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator


class AgentStatus(str, Enum):
    """Agent lifecycle status.

    Maps 1:1 to Coder workspace states, except:
    - Coder "running" state is split into "idle" (no active task) and "busy" (task running)
    - An agent can only transition from "starting" to "idle" or "busy" when all apps are healthy
    """

    PENDING = "pending"  # Workspace build queued and waiting to start
    STARTING = "starting"  # Workspace being started (provisioning resources)
    IDLE = "idle"  # Workspace running and no active task
    BUSY = "busy"  # Workspace running with active task
    STOPPING = "stopping"  # Workspace being stopped (destroying ephemeral resources)
    STOPPED = "stopped"  # Workspace stopped; ephemeral resources destroyed
    FAILED = "failed"  # Build failed during provisioning
    CANCELING = "canceling"  # Build cancellation in progress
    CANCELED = "canceled"  # Build was successfully canceled
    DELETING = "deleting"  # Workspace being permanently deleted
    DELETED = "deleted"  # Workspace completely destroyed


class Agent(BaseModel):
    """Agent domain entity representing a Claude Code instance in a Coder workspace.

    Business Rules:
    1. Agent names MUST be unique across the fleet
    2. Agent names MUST match pattern: ^[a-zA-Z0-9-]{1,64}$
    3. Agents can only accept tasks when status is idle
    4. Agents can be deleted in any status (forceful deletion)
    5. Status transitions: starting → idle → busy → idle (or offline, failed)
    """

    name: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-zA-Z0-9-]+$")
    workspace_id: str = Field(..., description="Coder workspace UUID")
    status: AgentStatus
    role: str = Field(..., description="Workspace preset name")
    project: str = Field(..., description="Template name")
    last_task: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    metadata: Optional[dict[str, Any]] = Field(
        default=None, description="Workspace metadata collected from Taskfile"
    )

    @field_validator("name")
    @classmethod
    def validate_name_format(cls, v: str) -> str:
        """Validate agent name contains only alphanumeric characters and hyphens."""
        if not v.replace("-", "").isalnum():
            raise ValueError(
                "Agent name must contain only alphanumeric characters and hyphens"
            )
        return v

    def is_idle(self) -> bool:
        """Check if agent is idle and can accept tasks."""
        return self.status == AgentStatus.IDLE

    def is_busy(self) -> bool:
        """Check if agent is busy executing a task."""
        return self.status == AgentStatus.BUSY

    def is_online(self) -> bool:
        """Check if agent is online (idle or busy)."""
        return self.status in (AgentStatus.IDLE, AgentStatus.BUSY)

    def can_accept_tasks(self) -> bool:
        """Check if agent can accept new tasks (must be idle and fully started)."""
        return self.status == AgentStatus.IDLE
