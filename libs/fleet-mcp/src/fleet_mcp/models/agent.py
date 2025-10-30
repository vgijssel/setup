"""Agent data model and related types"""
from datetime import datetime
from enum import Enum
from typing import Any
from pydantic import BaseModel, Field


class AgentStatus(str, Enum):
    """Agent status enum representing workspace and task states"""
    # Workspace lifecycle states
    PENDING = "pending"      # Workspace being provisioned
    STARTING = "starting"    # Workspace starting up

    # Active states (workspace running)
    BUSY = "busy"           # Agent working on a task
    IDLE = "idle"           # Agent ready for work

    # Shutdown states
    STOPPING = "stopping"   # Workspace shutting down
    STOPPED = "stopped"     # Workspace stopped

    # Error states
    FAILED = "failed"       # Workspace operation failed

    # Cancellation states
    CANCELING = "canceling" # Operation being canceled
    CANCELED = "canceled"   # Operation was canceled

    # Deletion states
    DELETING = "deleting"   # Workspace being deleted
    DELETED = "deleted"     # Workspace deleted


class Agent(BaseModel):
    """Agent model representing a Claude Code instance in a Coder workspace"""
    name: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9-]+$")
    workspace_id: str
    status: AgentStatus
    role: str  # Dynamic - validated against Coder workspace presets
    project: str
    spec: str = Field(min_length=1)
    current_task: str | None = None
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, str] = Field(default_factory=dict)  # Nested metadata with all fleet_mcp_* fields

    @staticmethod
    def from_workspace(workspace: dict[str, Any], agent_metadata: dict[str, str] | None = None) -> "Agent":
        """
        Convert Coder workspace to Agent model

        Args:
            workspace: Workspace data from Coder API
            agent_metadata: Agent metadata from watch-metadata endpoint (optional)
        """
        # Parse agent metadata from watch-metadata endpoint
        # Metadata keys are like "11_agent_spec", "8_pull_request_url", etc.
        metadata = {}
        if agent_metadata:
            # Map agent metadata keys to fleet_mcp fields
            key_mapping = {
                "11_agent_spec": "fleet_mcp_agent_spec",
                "12_current_task": "fleet_mcp_current_task",
                "13_agent_role": "fleet_mcp_role",
                "14_agent_project": "fleet_mcp_project",
                "15_agent_name": "fleet_mcp_agent_name",
                "8_pull_request_url": "fleet_mcp_pull_request_url",
                "9_pull_request_status": "fleet_mcp_pull_request_status",
                "10_pull_request_check_status": "fleet_mcp_pull_request_check_status",
            }
            for key, value in agent_metadata.items():
                if key in key_mapping and value not in ("n/a", ""):
                    metadata[key_mapping[key]] = value

        # Extract from workspace name if no metadata (workspace name format: agent-{name})
        workspace_name = workspace.get("name", "")
        agent_name = workspace_name.replace("agent-", "") if workspace_name.startswith("agent-") else workspace_name

        # Derive status from workspace state
        workspace_status = workspace.get("latest_build", {}).get("status", "unknown")
        current_task = metadata.get("fleet_mcp_current_task")

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
        elif current_task:
            status = AgentStatus.BUSY
        else:
            status = AgentStatus.IDLE

        # Filter metadata to only fleet_mcp_* fields (excluding None values)
        fleet_metadata = {
            key: value
            for key, value in metadata.items()
            if key.startswith("fleet_mcp_") and value is not None
        }

        return Agent(
            name=metadata.get("fleet_mcp_agent_name", agent_name or "unknown"),
            workspace_id=workspace.get("id", "unknown"),
            status=status,
            role=metadata.get("fleet_mcp_role", "coder"),
            project=metadata.get("fleet_mcp_project", "unknown"),
            spec=metadata.get("fleet_mcp_agent_spec", "default spec"),
            current_task=current_task,
            created_at=datetime.fromisoformat(workspace.get("created_at", datetime.now().isoformat())),
            updated_at=datetime.fromisoformat(workspace.get("updated_at", datetime.now().isoformat())),
            metadata=fleet_metadata,
        )
