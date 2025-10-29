"""Unit tests for Pydantic data models"""
import pytest
from datetime import datetime
from fleet_mcp.models.agent import Agent, AgentStatus
from fleet_mcp.models.task import Task
from fleet_mcp.models.role import Role
from fleet_mcp.models.project import Project


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
        spec="Test spec",
        current_task=None,
        created_at=now,
        updated_at=now,
        metadata={"fleet_mcp_agent_spec": "Test spec"}
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
            spec="Test",
            created_at=now,
            updated_at=now,
            metadata={}
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
            spec="Test",
            created_at=now,
            updated_at=now,
            metadata={}
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
            spec="Test",
            created_at=now,
            updated_at=now,
            metadata={}
        )


# T010: Task model validation tests
def test_task_model_valid():
    """Test valid task model creation"""
    task = Task(
        message="Implementing OAuth2 authentication",
        uri="https://github.com/org/repo/tree/feature/oauth",
        needs_user_attention=False,
        created_at=datetime.now()
    )
    assert task.message == "Implementing OAuth2 authentication"
    assert task.needs_user_attention is False


def test_task_message_required():
    """Test task message is required"""
    with pytest.raises(ValueError):
        Task(
            message="",  # Empty message
            uri="https://github.com/org/repo",
            needs_user_attention=False,
            created_at=datetime.now()
        )


def test_task_uri_format():
    """Test task URI validation"""
    task = Task(
        message="Test task",
        uri="https://github.com/org/repo/pull/123",
        needs_user_attention=True,
        created_at=datetime.now()
    )
    assert task.uri.startswith("https://")


# T011: Role model validation tests
def test_role_model_valid():
    """Test valid role model creation"""
    role = Role(
        name="coder",
        display_name="Software Engineer",
        description="Writes code, implements features, fixes bugs",
        template_id="template-uuid-1"
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
            template_id="uuid"
        )


# T012: Project model validation tests
def test_project_model_valid():
    """Test valid project model creation"""
    project = Project(
        name="Setup",
        display_name="Setup Monorepo",
        description="Infrastructure and tooling monorepo",
        template_id="template-uuid-1",
        template_name="setup-devcontainer"
    )
    assert project.name == "Setup"
    assert project.template_name == "setup-devcontainer"


def test_project_name_required():
    """Test project name is required"""
    with pytest.raises(ValueError):
        Project(
            name="",  # Empty name
            display_name="Test",
            description="Test",
            template_id="uuid",
            template_name="test"
        )
