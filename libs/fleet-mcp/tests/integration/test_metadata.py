"""Integration tests for metadata extraction - User Story 1"""
import pytest
from fleet_mcp.models.agent import Agent
from datetime import datetime


# T041: Test metadata extraction from workspace
def test_metadata_extraction_from_workspace():
    """Test Agent.from_workspace correctly extracts fleet_mcp_* metadata"""
    # Mock workspace data from Coder API
    workspace = {
        "id": "workspace-123",
        "name": "agent-test",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {
            "status": "running"
        },
        "metadata": {
            "fleet_mcp_agent_name": "test-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_agent_spec": "Test specification",
            "fleet_mcp_current_task": "Working on feature",
            "fleet_mcp_pull_request_url": "https://github.com/org/repo/pull/123",
            "some_other_metadata": "should be filtered out"
        }
    }

    agent = Agent.from_workspace(workspace)

    # Verify core fields
    assert agent.name == "test-agent"
    assert agent.workspace_id == "workspace-123"
    assert agent.role == "coder"
    assert agent.project == "Setup"
    assert agent.spec == "Test specification"
    assert agent.current_task == "Working on feature"

    # Verify status derivation (running + current_task = busy)
    assert agent.status == "busy"

    # Verify metadata filtering (only fleet_mcp_* fields)
    assert "fleet_mcp_agent_name" in agent.metadata
    assert "fleet_mcp_role" in agent.metadata
    assert "fleet_mcp_pull_request_url" in agent.metadata
    assert "some_other_metadata" not in agent.metadata


def test_metadata_extraction_idle_agent():
    """Test status derivation for idle agent (no current_task)"""
    workspace = {
        "id": "workspace-456",
        "name": "agent-idle",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {
            "status": "running"
        },
        "metadata": {
            "fleet_mcp_agent_name": "idle-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_agent_spec": "Test specification",
            "fleet_mcp_current_task": None  # No current task
        }
    }

    agent = Agent.from_workspace(workspace)

    # Idle agent: running workspace + no current_task
    assert agent.status == "idle"
    assert agent.current_task is None


def test_metadata_extraction_offline_agent():
    """Test status derivation for offline agent (stopped workspace)"""
    workspace = {
        "id": "workspace-789",
        "name": "agent-offline",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "latest_build": {
            "status": "stopped"
        },
        "metadata": {
            "fleet_mcp_agent_name": "offline-agent",
            "fleet_mcp_role": "operator",
            "fleet_mcp_project": "DataOne",
            "fleet_mcp_agent_spec": "Test specification"
        }
    }

    agent = Agent.from_workspace(workspace)

    # Offline agent: workspace not running
    assert agent.status == "stopped"
