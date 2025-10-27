"""Unit tests for Pydantic data models."""

from datetime import datetime

import pytest
from coder_mcp.models import (
    Agent,
    AgentStatus,
    FleetStatus,
    LogEntry,
    LogLevel,
    TaskAssignment,
    TaskPriority,
    TaskStatus,
)
from pydantic import ValidationError


def test_agent_model_valid_data():
    """Test Agent model with valid data."""
    agent = Agent(
        id="550e8400-e29b-41d4-a716-446655440000",
        user="alice",
        workspace_id="ws-abc123",
        workspace_name="agent-01",
        status=AgentStatus.IDLE,
        created_at=datetime.fromisoformat("2025-10-27T10:00:00+00:00"),
        updated_at=datetime.fromisoformat("2025-10-27T10:05:00+00:00"),
        connected=True,
    )

    assert agent.id == "550e8400-e29b-41d4-a716-446655440000"
    assert agent.status == AgentStatus.IDLE
    assert agent.connected is True


def test_agent_model_missing_required_fields():
    """Test Agent model validation with missing required fields."""
    with pytest.raises(ValidationError) as exc_info:
        Agent(
            id="test-id",
            # Missing required fields
        )

    errors = exc_info.value.errors()
    assert len(errors) > 0


def test_agent_status_enum_values():
    """Test AgentStatus enum has expected values."""
    assert AgentStatus.RUNNING.value == "running"
    assert AgentStatus.IDLE.value == "idle"
    assert AgentStatus.BUSY.value == "busy"
    assert AgentStatus.OFFLINE.value == "offline"
    assert AgentStatus.ERROR.value == "error"
    assert AgentStatus.STOPPED.value == "stopped"


def test_fleet_status_model():
    """Test FleetStatus model computation fields."""
    fleet = FleetStatus(
        total_agents=10,
        agents_idle=5,
        agents_busy=3,
        agents_offline=1,
        agents_error=1,
        computed_at=datetime.now(),
        fleet_utilization=0.3,
        unhealthy_agents=2,
        healthy_percentage=0.8,
    )

    assert fleet.total_agents == 10
    assert fleet.fleet_utilization == pytest.approx(0.3)
    assert fleet.unhealthy_agents == 2


def test_log_entry_model():
    """Test LogEntry model with valid data."""
    log = LogEntry(
        timestamp=datetime.now(),
        level=LogLevel.INFO,
        message="Test log message",
        agent_id="agent-123",
    )

    assert log.level == LogLevel.INFO
    assert log.message == "Test log message"
    assert log.agent_id == "agent-123"


def test_log_level_enum():
    """Test LogLevel enum values."""
    assert LogLevel.DEBUG.value == "debug"
    assert LogLevel.INFO.value == "info"
    assert LogLevel.WARNING.value == "warning"
    assert LogLevel.ERROR.value == "error"
    assert LogLevel.CRITICAL.value == "critical"


def test_task_assignment_model():
    """Test TaskAssignment model."""
    task = TaskAssignment(
        task_id="task-123",
        agent_id="agent-456",
        task_type="code-review",
        task_parameters={"repo": "test/repo"},
        priority=TaskPriority.HIGH,
        status=TaskStatus.PENDING,
        created_at=datetime.now(),
    )

    assert task.task_id == "task-123"
    assert task.priority == TaskPriority.HIGH
    assert task.status == TaskStatus.PENDING


def test_task_status_enum():
    """Test TaskStatus enum values."""
    assert TaskStatus.PENDING.value == "pending"
    assert TaskStatus.EXECUTING.value == "executing"
    assert TaskStatus.COMPLETED.value == "completed"
    assert TaskStatus.FAILED.value == "failed"
    assert TaskStatus.CANCELLED.value == "cancelled"


def test_agent_model_optional_fields():
    """Test Agent model with optional fields."""
    agent = Agent(
        id="test-id",
        user="bob",
        workspace_id="ws-123",
        workspace_name="test-workspace",
        status=AgentStatus.RUNNING,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        connected=True,
        capabilities=["coding", "debugging"],
        current_assignment="Fix bug #123",
        metadata={"region": "us-west"},
    )

    assert agent.capabilities == ["coding", "debugging"]
    assert agent.current_assignment == "Fix bug #123"
    assert agent.metadata["region"] == "us-west"


def test_fleet_status_defaults():
    """Test FleetStatus model default values."""
    fleet = FleetStatus(
        total_agents=5,
        computed_at=datetime.now(),
    )

    assert fleet.agents_idle == 0
    assert fleet.agents_busy == 0
    assert fleet.fleet_utilization == 0.0
    assert fleet.healthy_percentage == 1.0
