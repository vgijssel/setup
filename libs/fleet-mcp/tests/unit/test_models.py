"""Unit tests for Pydantic data models"""

from datetime import datetime

import pytest
from fleet_mcp.models.agent import Agent, AgentStatus
from fleet_mcp.models.project import Project
from fleet_mcp.models.role import Role
from fleet_mcp.models.task import Task


# T008: AgentStatus enum tests
def test_agent_status_enum():
    """Test AgentStatus enum has all required states"""
    assert AgentStatus.PENDING == "pending"
    assert AgentStatus.STARTING == "starting"
    assert AgentStatus.BUSY == "busy"
    assert AgentStatus.IDLE == "idle"
    assert AgentStatus.STOPPING == "stopping"
    assert AgentStatus.STOPPED == "stopped"
    assert AgentStatus.FAILED == "failed"
    assert AgentStatus.CANCELING == "canceling"
    assert AgentStatus.CANCELED == "canceled"
    assert AgentStatus.DELETING == "deleting"
    assert AgentStatus.DELETED == "deleted"


# T009: Agent model validation tests
def test_agent_model_valid():
    """Test valid agent model creation"""
    now = datetime.now()
    agent = Agent(
        name="papi",
        workspace_id="workspace-123",
        status=AgentStatus.IDLE,
        role="coder",
        project="Setup",
        last_task=None,
        created_at=now,
        updated_at=now,
    )
    assert agent.name == "papi"
    assert agent.status == AgentStatus.IDLE
    assert agent.role == "coder"


def test_agent_name_validation_empty():
    """Test agent name validation - empty name"""
    now = datetime.now()
    with pytest.raises(ValueError):
        Agent(
            name="",  # Empty name invalid
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="coder",
            project="Setup",
            created_at=now,
            updated_at=now,
        )


def test_agent_name_validation_too_long():
    """Test agent name validation - name too long"""
    now = datetime.now()
    with pytest.raises(ValueError):
        Agent(
            name="a" * 21,  # Too long (max 20)
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="coder",
            project="Setup",
            created_at=now,
            updated_at=now,
        )


def test_agent_name_validation_invalid_chars():
    """Test agent name validation - invalid characters"""
    now = datetime.now()
    with pytest.raises(ValueError):
        Agent(
            name="invalid@name",  # Invalid characters
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="coder",
            project="Setup",
            created_at=now,
            updated_at=now,
        )


def test_agent_from_workspace_prefix_removal():
    """Test that agent- prefix is only removed from the beginning, not everywhere"""
    workspace = {
        "id": "workspace-123",
        "name": "agent-busy-agent-003",
        "template_name": "test-template",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {"status": "running"},
    }
    agent = Agent.from_workspace(workspace)
    # Should be "busy-agent-003", not "busy-003"
    assert agent.name == "busy-agent-003"


# T010: Task model validation tests
def test_task_model_valid():
    """Test valid task model creation"""
    task = Task(
        message="Implementing OAuth2 authentication",
        uri="https://github.com/org/repo/tree/feature/oauth",
        needs_user_attention=False,
        created_at=datetime.now(),
    )
    assert task.message == "Implementing OAuth2 authentication"
    assert task.needs_user_attention is False


def test_task_message_empty_allowed():
    """Test task message can be empty (regression test for agent startup)

    When agents first start, they may report an empty message status.
    This should not cause validation errors.
    """
    task = Task(
        message="",  # Empty message should be allowed
        uri="",
        needs_user_attention=False,
        created_at=datetime.now(),
    )
    assert task.message == ""


def test_task_uri_format():
    """Test task URI validation"""
    task = Task(
        message="Test task",
        uri="https://github.com/org/repo/pull/123",
        needs_user_attention=True,
        created_at=datetime.now(),
    )
    assert task.uri.startswith("https://")


# T011: Role model validation tests
def test_role_model_valid():
    """Test valid role model creation"""
    role = Role(
        name="coder",
        display_name="Software Engineer",
        description="Writes code, implements features, fixes bugs",
        template_id="template-uuid-1",
    )
    assert role.name == "coder"
    assert role.display_name == "Software Engineer"


def test_role_name_required():
    """Test role name is required"""
    with pytest.raises(ValueError):
        Role(
            name="",  # Empty name
            display_name="Test",
            description="Test",
            template_id="uuid",
        )


# T012: Project model validation tests
def test_project_model_valid():
    """Test valid project model creation"""
    project = Project(
        name="Setup",
        display_name="Setup Monorepo",
        description="Infrastructure and tooling monorepo",
        template_id="template-uuid-1",
        template_name="coder-devcontainer",
    )
    assert project.name == "Setup"
    assert project.template_name == "coder-devcontainer"


def test_project_name_required():
    """Test project name is required"""
    with pytest.raises(ValueError):
        Project(
            name="",  # Empty name
            display_name="Test",
            description="Test",
            template_id="uuid",
            template_name="test",
        )


# T013: Agent health checking tests (regression tests)
def test_agent_from_workspace_unhealthy_agents():
    """Test that workspace with unhealthy agents is marked as STARTING

    Regression test: Workspace status is "running" but workspace agents
    are still starting up. Agent should be in STARTING status, not IDLE.
    """
    workspace = {
        "id": "workspace-123",
        "name": "agent-TestAgent",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-123",
            "status": "running",
            "resources": [
                {
                    "id": "resource-1",
                    "name": "workspace",
                    "agents": [
                        {
                            "id": "agent-1",
                            "name": "main",
                            "status": "connecting",  # Not connected yet
                            "lifecycle_state": "starting",  # Not ready yet
                        }
                    ],
                }
            ],
        },
    }

    agent = Agent.from_workspace(workspace)
    assert agent.status == AgentStatus.STARTING


def test_agent_from_workspace_healthy_agents():
    """Test that workspace with all healthy agents is marked as IDLE

    Regression test: Workspace status is "running" and all workspace agents
    are connected and ready. Agent should be IDLE and ready for work.
    """
    workspace = {
        "id": "workspace-456",
        "name": "agent-TestAgent",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-456",
            "status": "running",
            "resources": [
                {
                    "id": "resource-2",
                    "name": "workspace",
                    "agents": [
                        {
                            "id": "agent-2",
                            "name": "main",
                            "status": "connected",  # Connected
                            "lifecycle_state": "ready",  # Ready
                        }
                    ],
                }
            ],
        },
    }

    agent = Agent.from_workspace(workspace)
    assert agent.status == AgentStatus.IDLE


def test_agent_from_workspace_multiple_agents_some_unhealthy():
    """Test workspace with multiple agents where some are unhealthy

    Regression test: If ANY agent in the workspace is not healthy,
    the entire agent should be in STARTING status.
    """
    workspace = {
        "id": "workspace-789",
        "name": "agent-MultiAgent",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-789",
            "status": "running",
            "resources": [
                {
                    "id": "resource-3",
                    "name": "workspace",
                    "agents": [
                        {
                            "id": "agent-3a",
                            "name": "main",
                            "status": "connected",
                            "lifecycle_state": "ready",
                        },
                        {
                            "id": "agent-3b",
                            "name": "secondary",
                            "status": "connecting",  # Not healthy
                            "lifecycle_state": "starting",
                        },
                    ],
                }
            ],
        },
    }

    agent = Agent.from_workspace(workspace)
    assert agent.status == AgentStatus.STARTING


def test_agent_from_workspace_multiple_agents_all_healthy():
    """Test workspace with multiple agents where all are healthy

    Regression test: All agents must be healthy for the workspace
    to be ready for work.
    """
    workspace = {
        "id": "workspace-101",
        "name": "agent-MultiAgent",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-101",
            "status": "running",
            "resources": [
                {
                    "id": "resource-4",
                    "name": "workspace",
                    "agents": [
                        {
                            "id": "agent-4a",
                            "name": "main",
                            "status": "connected",
                            "lifecycle_state": "ready",
                        },
                        {
                            "id": "agent-4b",
                            "name": "secondary",
                            "status": "connected",
                            "lifecycle_state": "ready",
                        },
                    ],
                }
            ],
        },
    }

    agent = Agent.from_workspace(workspace)
    assert agent.status == AgentStatus.IDLE


def test_agent_from_workspace_no_resources():
    """Test workspace with no resources is marked as STARTING

    Regression test: Workspace without resources should be considered
    unhealthy and marked as STARTING.
    """
    workspace = {
        "id": "workspace-202",
        "name": "agent-NoResources",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-202",
            "status": "running",
            "resources": [],  # No resources
        },
    }

    agent = Agent.from_workspace(workspace)
    assert agent.status == AgentStatus.STARTING


def test_agent_from_workspace_agent_timeout_state():
    """Test workspace with agent in timeout state is marked as STARTING

    Regression test: Agent with lifecycle_state "timeout" should be
    considered unhealthy.
    """
    workspace = {
        "id": "workspace-303",
        "name": "agent-TimeoutAgent",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-303",
            "status": "running",
            "resources": [
                {
                    "id": "resource-5",
                    "name": "workspace",
                    "agents": [
                        {
                            "id": "agent-5",
                            "name": "main",
                            "status": "timeout",  # Timeout
                            "lifecycle_state": "start_timeout",
                        }
                    ],
                }
            ],
        },
    }

    agent = Agent.from_workspace(workspace)
    assert agent.status == AgentStatus.STARTING


def test_agent_from_workspace_healthy_with_task_data_busy():
    """Test healthy workspace with task data showing busy state

    Regression test: Even with healthy agents, if task data shows
    working state, agent should be BUSY.
    """
    workspace = {
        "id": "workspace-404",
        "name": "agent-BusyAgent",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-404",
            "status": "running",
            "resources": [
                {
                    "id": "resource-6",
                    "name": "workspace",
                    "agents": [
                        {
                            "id": "agent-6",
                            "name": "main",
                            "status": "connected",
                            "lifecycle_state": "ready",
                        }
                    ],
                }
            ],
        },
    }

    task_data = {
        "current_state": {"state": "working", "message": "Implementing feature"}
    }

    agent = Agent.from_workspace(workspace, task_data=task_data)
    assert agent.status == AgentStatus.BUSY
    assert agent.last_task == "Implementing feature"


def test_agent_from_workspace_resources_without_agents():
    """Test workspace with resources but no agents is marked as STARTING

    Regression test: Workspace with resources but no agents array
    should be considered unhealthy and marked as STARTING, not IDLE.

    Bug: _are_all_workspace_agents_healthy returns True when resources
    exist but have no agents, causing workspace to be marked as IDLE
    even when it's still starting up.
    """
    workspace = {
        "id": "workspace-505",
        "name": "agent-NoAgents",
        "template_name": "coder-devcontainer",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "latest_build": {
            "id": "build-505",
            "status": "running",
            "resources": [
                {
                    "id": "resource-7",
                    "name": "workspace",
                    "agents": [],  # Empty agents array - no agents yet
                }
            ],
        },
    }

    agent = Agent.from_workspace(workspace)
    # Should be STARTING because no agents are present
    assert agent.status == AgentStatus.STARTING
