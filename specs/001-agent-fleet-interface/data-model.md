# Data Model: Agent Fleet Management Interface

**Feature**: 001-agent-fleet-interface
**Date**: 2025-10-27
**Phase**: 1 - Data Model Design

## Overview

This document defines the data models used by the MCP server to represent agents, tasks, and related entities. All models are Pydantic classes that map to Coder API responses and provide validation, serialization, and type safety.

**Key Principles**:
- Models mirror Coder API schema with minimal transformation
- All timestamps in ISO 8601 format (UTC)
- Enums for status fields to ensure type safety
- Optional fields use `Optional[T]` to handle API variations
- Stateless design - no model represents persisted MCP state

## Core Entities

### Agent

Represents an AI agent running in a Coder workspace, corresponding to a Coder AI task.

**Source**: Coder API `/api/experimental/tasks` and `/api/experimental/tasks/{user}/{id}`

```python
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class AgentStatus(str, Enum):
    """Agent operational states"""
    RUNNING = "running"       # Agent actively executing
    IDLE = "idle"            # Agent ready for work
    BUSY = "busy"            # Agent processing task
    OFFLINE = "offline"      # Agent not responding
    ERROR = "error"          # Agent in error state
    STOPPED = "stopped"      # Agent intentionally stopped

class Agent(BaseModel):
    """
    Agent entity representing a Coder AI task instance.

    Maps to Coder's Task struct with additional derived fields.
    """
    id: str = Field(..., description="Unique agent/task identifier (UUID)")
    user: str = Field(..., description="Owner username of the agent")
    workspace_id: str = Field(..., description="Coder workspace ID hosting this agent")
    workspace_name: str = Field(..., description="Human-readable workspace name")

    status: AgentStatus = Field(..., description="Current operational status")

    created_at: datetime = Field(..., description="Agent creation timestamp (ISO 8601 UTC)")
    updated_at: datetime = Field(..., description="Last status update timestamp (ISO 8601 UTC)")
    last_activity_at: Optional[datetime] = Field(None, description="Last agent activity timestamp")

    # Capabilities (derived from workspace template or task metadata)
    capabilities: list[str] = Field(default_factory=list, description="List of agent capabilities")

    # Current assignment
    current_assignment: Optional[str] = Field(None, description="Current task description or None if idle")

    # Connection state
    connected: bool = Field(..., description="WebSocket connection status")

    # Metadata
    metadata: dict[str, str] = Field(default_factory=dict, description="Additional agent metadata")

    class Config:
        json_schema_extra = {
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
                "metadata": {}
            }
        }
```

**Validation Rules**:
- `id` must be valid UUID format
- `status` must be one of `AgentStatus` enum values
- `created_at <= updated_at <= last_activity_at` (if all present)
- `capabilities` list items must be non-empty strings

**State Transitions**:
```
OFFLINE -> RUNNING     (agent starts/connects)
RUNNING -> IDLE        (no active task)
IDLE -> BUSY           (task assigned)
BUSY -> IDLE           (task completed successfully)
BUSY -> ERROR          (task failed)
ERROR -> IDLE          (error recovered)
* -> OFFLINE           (connection lost)
* -> STOPPED           (agent intentionally stopped)
```

### TaskAssignment

Represents a work assignment sent to an agent via Coder's task input mechanism.

**Source**: Derived from MCP tool calls (not directly from Coder API)

```python
class TaskPriority(str, Enum):
    """Task priority levels"""
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(str, Enum):
    """Task execution states"""
    PENDING = "pending"           # Queued, not yet started
    EXECUTING = "executing"       # Currently running
    COMPLETED = "completed"       # Successfully finished
    FAILED = "failed"            # Execution failed
    CANCELLED = "cancelled"      # Cancelled before completion

class TaskAssignment(BaseModel):
    """
    Task assignment metadata (ephemeral, tracked by agent).

    Note: MCP server does NOT persist this; it's reconstructed
    from agent queries or provided in create_task calls.
    """
    task_id: str = Field(..., description="Unique task identifier")
    agent_id: str = Field(..., description="Target agent ID")

    task_type: str = Field(..., description="Type of task (e.g., 'code-review', 'debug')")
    task_parameters: dict[str, any] = Field(..., description="Task-specific parameters")

    priority: TaskPriority = Field(TaskPriority.NORMAL, description="Task priority")
    status: TaskStatus = Field(TaskStatus.PENDING, description="Current execution status")

    created_at: datetime = Field(..., description="Task creation timestamp")
    started_at: Optional[datetime] = Field(None, description="Execution start timestamp")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")

    result_data: Optional[dict[str, any]] = Field(None, description="Task output/results")
    error_message: Optional[str] = Field(None, description="Error details if failed")

    class Config:
        json_schema_extra = {
            "example": {
                "task_id": "task-12345",
                "agent_id": "550e8400-e29b-41d4-a716-446655440000",
                "task_type": "code-review",
                "task_parameters": {
                    "repo_url": "https://github.com/user/repo",
                    "pr_number": 42
                },
                "priority": "high",
                "status": "executing",
                "created_at": "2025-10-27T11:00:00Z",
                "started_at": "2025-10-27T11:00:05Z",
                "completed_at": None,
                "result_data": None,
                "error_message": None
            }
        }
```

**Validation Rules**:
- `task_id` must be unique (validated by agent, not MCP server)
- `created_at <= started_at <= completed_at` (if present)
- `status == FAILED` implies `error_message` is not None
- `status == COMPLETED` implies `completed_at` is not None

### FleetStatus

Represents aggregate metrics across the entire agent fleet.

**Source**: Computed by MCP server from Coder API `/api/experimental/tasks` list

```python
class FleetStatus(BaseModel):
    """
    Aggregate fleet metrics computed from individual agent states.

    This is NOT persisted; computed on-demand for each query.
    """
    total_agents: int = Field(..., description="Total registered agents")

    # Breakdown by status
    agents_running: int = Field(0, description="Agents in RUNNING state")
    agents_idle: int = Field(0, description="Agents in IDLE state")
    agents_busy: int = Field(0, description="Agents in BUSY state")
    agents_offline: int = Field(0, description="Agents in OFFLINE state")
    agents_error: int = Field(0, description="Agents in ERROR state")
    agents_stopped: int = Field(0, description="Agents in STOPPED state")

    # Aggregate metrics
    total_active_tasks: int = Field(0, description="Sum of tasks executing across all agents")
    fleet_utilization: float = Field(0.0, description="Percentage of agents busy (0.0-1.0)")

    # Timestamps
    computed_at: datetime = Field(..., description="When this snapshot was computed")

    # Health indicators
    unhealthy_agents: int = Field(0, description="Agents in ERROR or OFFLINE state")
    healthy_percentage: float = Field(1.0, description="Percentage of healthy agents (0.0-1.0)")

    class Config:
        json_schema_extra = {
            "example": {
                "total_agents": 10,
                "agents_running": 1,
                "agents_idle": 5,
                "agents_busy": 3,
                "agents_offline": 1,
                "agents_error": 0,
                "agents_stopped": 0,
                "total_active_tasks": 3,
                "fleet_utilization": 0.3,
                "computed_at": "2025-10-27T12:00:00Z",
                "unhealthy_agents": 1,
                "healthy_percentage": 0.9
            }
        }
```

**Computation Rules**:
- `fleet_utilization = agents_busy / total_agents` (0 if total_agents == 0)
- `unhealthy_agents = agents_error + agents_offline`
- `healthy_percentage = (total_agents - unhealthy_agents) / total_agents`
- `total_agents = sum of all status counts`

### LogEntry

Represents a single log line from agent execution.

**Source**: Coder API `/api/experimental/tasks/{user}/{id}/logs`

```python
class LogLevel(str, Enum):
    """Log severity levels"""
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class LogEntry(BaseModel):
    """
    Agent execution log entry.
    """
    timestamp: datetime = Field(..., description="Log entry timestamp")
    level: LogLevel = Field(LogLevel.INFO, description="Log severity")
    message: str = Field(..., description="Log message content")

    # Optional structured fields
    agent_id: Optional[str] = Field(None, description="Source agent ID")
    task_id: Optional[str] = Field(None, description="Related task ID")
    metadata: dict[str, any] = Field(default_factory=dict, description="Additional log context")

    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2025-10-27T12:30:45.123Z",
                "level": "info",
                "message": "Task execution started",
                "agent_id": "550e8400-e29b-41d4-a716-446655440000",
                "task_id": "task-12345",
                "metadata": {"duration_ms": 1523}
            }
        }
```

### EventNotification

Represents alerts and events pushed to superagent via WebSocket (future enhancement).

**Source**: N/A for stateless MCP server (documented for spec completeness)

```python
class EventType(str, Enum):
    """Event categories"""
    AGENT_FAILURE = "agent_failure"
    TASK_COMPLETION = "task_completion"
    CAPACITY_WARNING = "capacity_warning"
    AGENT_CONNECTED = "agent_connected"
    AGENT_DISCONNECTED = "agent_disconnected"

class EventSeverity(str, Enum):
    """Event importance levels"""
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class EventNotification(BaseModel):
    """
    Event notification for real-time alerts.

    Note: Current stateless MCP server does NOT implement
    event subscriptions. Documented for future WebSocket enhancement.
    """
    event_type: EventType
    severity: EventSeverity
    timestamp: datetime

    agent_id: Optional[str] = None
    task_id: Optional[str] = None

    message: str
    metadata: dict[str, any] = Field(default_factory=dict)
```

## Relationships

```
FleetStatus
    ├── aggregates multiple Agent instances

Agent
    ├── has one current_assignment (TaskAssignment or None)
    ├── generates multiple LogEntry records
    └── may trigger multiple EventNotification (future)

TaskAssignment
    ├── belongs to one Agent (via agent_id)
    └── generates LogEntry records during execution
```

## Validation Summary

| Model | Required Fields | Constraints |
|-------|----------------|-------------|
| Agent | id, user, workspace_id, workspace_name, status, created_at, updated_at, connected | UUID format for id; timestamps ordered; status enum |
| TaskAssignment | task_id, agent_id, task_type, task_parameters, created_at | Timestamps ordered; status-dependent fields |
| FleetStatus | total_agents, computed_at | Computed fields internally consistent; percentages in [0,1] |
| LogEntry | timestamp, message | Valid LogLevel enum |
| EventNotification | event_type, severity, timestamp, message | Valid enum values |

## Storage & Persistence

**Critical**: This MCP server is **stateless**. All models represent **ephemeral views** of data owned by Coder:

- **Agent**: Queried from Coder API on every MCP tool call
- **TaskAssignment**: Tracked by agents themselves, not MCP server
- **FleetStatus**: Computed on-demand from live agent list
- **LogEntry**: Streamed from Coder logs API
- **EventNotification**: Future enhancement; would be pushed by Coder

**No database, no persistent state in MCP server.** This aligns with constitutional principle of minimal code and reduces operational complexity.

## API Response Mapping

| Coder API Endpoint | Response Model(s) |
|-------------------|------------------|
| GET /api/experimental/tasks | `list[Agent]` |
| GET /api/experimental/tasks/{user}/{id} | `Agent` |
| POST /api/experimental/tasks/{user} | `Agent` (created) |
| GET /api/experimental/tasks/{user}/{id}/logs | `list[LogEntry]` |
| (computed) | `FleetStatus` |

## Error Responses

All MCP tools return a consistent error format:

```python
class MCPError(BaseModel):
    """Error response from MCP tools"""
    success: bool = False
    error: str = Field(..., description="Human-readable error message")
    error_code: str = Field(..., description="Machine-readable error code")
    details: Optional[dict[str, any]] = Field(None, description="Additional error context")
```

Common error codes:
- `AGENT_NOT_FOUND`: Agent ID does not exist
- `AUTHENTICATION_FAILED`: Coder API token invalid
- `NETWORK_ERROR`: HTTP communication failure
- `VALIDATION_ERROR`: Invalid input parameters
- `CODER_API_ERROR`: Coder returned error response

## Future Enhancements

1. **Agent Capabilities Discovery**: Auto-populate `capabilities` from workspace template metadata
2. **Task History**: Add `TaskHistory` model if Coder API exposes historical data
3. **Performance Metrics**: Extend `Agent` with `PerformanceMetrics` (task completion rate, avg duration)
4. **Event Subscriptions**: Implement `EventNotification` when Coder adds WebSocket support
