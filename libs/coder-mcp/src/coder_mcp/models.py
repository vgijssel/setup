"""Pydantic models for Coder MCP server.

Data models representing agents, tasks, logs, and related entities.
All models map to Coder API responses with validation and type safety.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class AgentStatus(str, Enum):
    """Agent operational states."""

    RUNNING = "running"
    IDLE = "idle"
    BUSY = "busy"
    OFFLINE = "offline"
    ERROR = "error"
    STOPPED = "stopped"


class Agent(BaseModel):
    """Agent entity representing a Coder AI task instance."""

    id: str = Field(..., description="Unique agent/task identifier (UUID)")
    user: str = Field(..., description="Owner username of the agent")
    workspace_id: str = Field(..., description="Coder workspace ID hosting this agent")
    workspace_name: str = Field(..., description="Human-readable workspace name")

    status: AgentStatus = Field(..., description="Current operational status")

    created_at: datetime = Field(
        ..., description="Agent creation timestamp (ISO 8601 UTC)"
    )
    updated_at: datetime = Field(
        ..., description="Last status update timestamp (ISO 8601 UTC)"
    )
    last_activity_at: Optional[datetime] = Field(
        None, description="Last agent activity timestamp"
    )

    # Capabilities (derived from workspace template or task metadata)
    capabilities: list[str] = Field(
        default_factory=list, description="List of agent capabilities"
    )

    # Current assignment
    current_assignment: Optional[str] = Field(
        None, description="Current task description or None if idle"
    )

    # Connection state
    connected: bool = Field(..., description="WebSocket connection status")

    # Metadata
    metadata: dict[str, Any] = Field(
        default_factory=dict, description="Additional agent metadata"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "user": "alice",
                "workspace_id": "ws-abc123",
                "workspace_name": "agent-01",
                "status": "idle",
                "created_at": "2025-10-27T10:00:00Z",
                "updated_at": "2025-10-27T10:05:00Z",
                "last_activity_at": "2025-10-27T10:04:30Z",
                "capabilities": ["code-analysis", "debugging"],
                "current_assignment": None,
                "connected": True,
                "metadata": {},
            }
        }
    )


class TaskPriority(str, Enum):
    """Task priority levels."""

    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


class TaskStatus(str, Enum):
    """Task execution states."""

    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskAssignment(BaseModel):
    """Task assignment metadata (ephemeral, tracked by agent)."""

    task_id: str = Field(..., description="Unique task identifier")
    agent_id: str = Field(..., description="Target agent ID")

    task_type: str = Field(
        ..., description="Type of task (e.g., 'code-review', 'debug')"
    )
    task_parameters: dict[str, Any] = Field(..., description="Task-specific parameters")

    priority: TaskPriority = Field(TaskPriority.NORMAL, description="Task priority")
    status: TaskStatus = Field(
        TaskStatus.PENDING, description="Current execution status"
    )

    created_at: datetime = Field(..., description="Task creation timestamp")
    started_at: Optional[datetime] = Field(
        None, description="Execution start timestamp"
    )
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")

    result_data: Optional[dict[str, Any]] = Field(
        None, description="Task output/results"
    )
    error_message: Optional[str] = Field(None, description="Error details if failed")


class FleetStatus(BaseModel):
    """Aggregate fleet metrics computed from individual agent states."""

    total_agents: int = Field(..., description="Total registered agents")

    # Breakdown by status
    agents_running: int = Field(0, description="Agents in RUNNING state")
    agents_idle: int = Field(0, description="Agents in IDLE state")
    agents_busy: int = Field(0, description="Agents in BUSY state")
    agents_offline: int = Field(0, description="Agents in OFFLINE state")
    agents_error: int = Field(0, description="Agents in ERROR state")
    agents_stopped: int = Field(0, description="Agents in STOPPED state")

    # Aggregate metrics
    total_active_tasks: int = Field(
        0, description="Sum of tasks executing across all agents"
    )
    fleet_utilization: float = Field(
        0.0, description="Percentage of agents busy (0.0-1.0)"
    )

    # Timestamps
    computed_at: datetime = Field(..., description="When this snapshot was computed")

    # Health indicators
    unhealthy_agents: int = Field(0, description="Agents in ERROR or OFFLINE state")
    healthy_percentage: float = Field(
        1.0, description="Percentage of healthy agents (0.0-1.0)"
    )


class LogLevel(str, Enum):
    """Log severity levels."""

    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class LogEntry(BaseModel):
    """Agent execution log entry."""

    timestamp: datetime = Field(..., description="Log entry timestamp")
    level: LogLevel = Field(LogLevel.INFO, description="Log severity")
    message: str = Field(..., description="Log message content")

    # Optional structured fields
    agent_id: Optional[str] = Field(None, description="Source agent ID")
    task_id: Optional[str] = Field(None, description="Related task ID")
    metadata: dict[str, Any] = Field(
        default_factory=dict, description="Additional log context"
    )


class EventType(str, Enum):
    """Event categories."""

    AGENT_FAILURE = "agent_failure"
    TASK_COMPLETION = "task_completion"
    CAPACITY_WARNING = "capacity_warning"
    AGENT_CONNECTED = "agent_connected"
    AGENT_DISCONNECTED = "agent_disconnected"


class EventSeverity(str, Enum):
    """Event importance levels."""

    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class EventNotification(BaseModel):
    """Event notification for real-time alerts (future enhancement)."""

    event_type: EventType
    severity: EventSeverity
    timestamp: datetime

    agent_id: Optional[str] = None
    task_id: Optional[str] = None

    message: str
    metadata: dict[str, Any] = Field(default_factory=dict)


class MCPError(BaseModel):
    """Error response from MCP tools."""

    success: bool = False
    error: str = Field(..., description="Human-readable error message")
    error_code: str = Field(..., description="Machine-readable error code")
    details: Optional[dict[str, Any]] = Field(
        None, description="Additional error context"
    )
