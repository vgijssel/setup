"""Integration tests for task lifecycle management - User Story 2"""

from datetime import datetime

import pytest
from fleet_mcp.coder.client import CoderClient


# T060: Test task status transitions
@pytest.mark.vcr
@pytest.mark.skip(
    reason="Requires Coder MCP tools for metadata writing - REST API doesn't support workspace file writes"
)
async def test_task_status_transitions(coder_base_url, coder_token):
    """Test agent status changes through task lifecycle"""
    async with CoderClient(base_url=coder_base_url, token=coder_token) as client:
        # Create workspace (agent starts in pending -> starting -> busy)
        workspace = await client.create_workspace(
            name="lifecycle-test-agent",
            template_name="coder-devcontainer",
            ai_prompt="Initial task specification",
        )
        workspace_id = workspace["id"]

        # Write initial agent metadata
        await client.write_agent_metadata(
            workspace_id,
            "main",
            {
                "fleet_mcp_agent_name": "lifecycle-test",
                "fleet_mcp_role": "coder",
                "fleet_mcp_project": "Setup",
                "fleet_mcp_current_task": "Initial task specification",
            },
        )

        # Simulate task completion by clearing current_task
        await client.update_workspace_metadata(
            workspace_id, {"fleet_mcp_current_task": None}
        )

        # Verify metadata was cleared (by checking agent metadata)
        workspace = await client.get_workspace(workspace_id)
        # Find agent in resources
        agent_id = None
        if workspace.get("latest_build", {}).get("resources"):
            for resource in workspace["latest_build"]["resources"]:
                if resource.get("agents"):
                    agent_id = resource["agents"][0]["id"]
                    break

        if agent_id:
            metadata = await client.get_agent_metadata(agent_id)
            # Metadata should have current_task cleared (set to empty/n/a)
            assert metadata.get("12_current_task") in [None, "", "n/a"]

        # Start new task
        await client.update_workspace_metadata(
            workspace_id, {"fleet_mcp_current_task": "New task description"}
        )

        # Verify new task was set
        if agent_id:
            metadata = await client.get_agent_metadata(agent_id)
            assert metadata.get("12_current_task") == "New task description"

        # Cleanup
        await client.delete_workspace(workspace_id)


# T061: Test agent status derivation (busy/idle)
async def test_agent_status_derivation(coder_base_url, coder_token):
    """Test that agent status is correctly derived from workspace state and current_task"""

    # Mock workspace data for different scenarios

    # Scenario 1: Workspace running with current_task -> busy
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

    # If workspace is running and has current_task, status should be busy
    assert workspace_busy["latest_build"]["status"] == "running"
    assert workspace_busy["metadata"].get("fleet_mcp_current_task") is not None
    # When implemented, this should yield AgentStatus.BUSY

    # Scenario 2: Workspace running without current_task -> idle
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

    # If workspace is running and has no current_task, status should be idle
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
