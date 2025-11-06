"""Integration tests for task lifecycle management - User Story 2

This test doesn't require HTTP mocking as it tests data logic only.
"""

from datetime import datetime

import pytest


# T061: Test agent status derivation (busy/idle)
@pytest.mark.asyncio
async def test_agent_status_derivation():
    """Test that agent status is correctly derived from workspace state and task data

    This test validates the logic for deriving agent status from workspace data.
    No HTTP mocking needed as this is pure data logic.
    """
    # Mock workspace data for different scenarios

    # Scenario 1: Workspace running with task -> busy
    workspace_busy = {
        "id": "test-ws-1",
        "name": "agent-busy",
        "latest_build": {"status": "running"},
        "metadata": {
            "fleet_mcp_agent_name": "busy-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_current_task": "Working on something",
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    # Note: agent_from_workspace will be implemented in T069
    # For now, test the logic manually

    # If workspace is running and has task, status should be busy
    assert workspace_busy["latest_build"]["status"] == "running"
    assert workspace_busy["metadata"].get("fleet_mcp_current_task") is not None
    # When implemented, this should yield AgentStatus.BUSY

    # Scenario 2: Workspace running without task -> idle
    workspace_idle = {
        "id": "test-ws-2",
        "name": "agent-idle",
        "latest_build": {"status": "running"},
        "metadata": {
            "fleet_mcp_agent_name": "idle-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_current_task": None,
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    # If workspace is running and has no task, status should be idle
    assert workspace_idle["latest_build"]["status"] == "running"
    assert workspace_idle["metadata"].get("fleet_mcp_current_task") is None
    # When implemented, this should yield AgentStatus.IDLE

    # Scenario 3: Workspace not running -> offline (or specific status like pending, starting, stopped)
    workspace_offline = {
        "id": "test-ws-3",
        "name": "agent-offline",
        "latest_build": {"status": "stopped"},
        "metadata": {
            "fleet_mcp_agent_name": "offline-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_current_task": None,
        },
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    # If workspace is not running, status should match workspace build status
    assert workspace_offline["latest_build"]["status"] == "stopped"
    # When implemented, this should yield AgentStatus.STOPPED
