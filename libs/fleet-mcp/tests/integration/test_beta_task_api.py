"""Integration tests for Coder experimental task API"""

import pytest
from fleet_mcp.coder.client import CoderClient


# Test getting task from experimental API
@pytest.mark.vcr
async def test_get_task_exists(coder_base_url, coder_token):
    """Test getting task from experimental API when task exists"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Get current workspace for testing
    workspaces = await client.list_workspaces()
    assert len(workspaces) > 0, "At least one workspace should exist"

    # Use the first workspace
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Get task using experimental API
    task = await client.get_task(owner_name, workspace_id)

    # Verify task structure
    assert task is not None, "Task should exist for active workspace"
    assert isinstance(task, dict)
    assert "id" in task
    assert "workspace_id" in task
    assert "current_state" in task
    assert "state" in task["current_state"]
    assert task["current_state"]["state"] in ["idle", "working", "failure"]


@pytest.mark.vcr
async def test_get_task_not_found(coder_base_url, coder_token):
    """Test getting task returns None for 404 responses"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Use a fake workspace ID that shouldn't exist
    fake_workspace_id = "00000000-0000-0000-0000-000000000000"
    fake_username = "nonexistent"

    task = await client.get_task(fake_username, fake_workspace_id)

    # Should return None for 404
    assert task is None


@pytest.mark.vcr
async def test_send_task_input(coder_base_url, coder_token):
    """Test sending input to a task via experimental API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Get current workspace for testing
    workspaces = await client.list_workspaces()
    assert len(workspaces) > 0, "At least one workspace should exist"

    # Use the first workspace
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Send task input
    task_input = "Test task input for VCR recording"
    await client.send_task_input(owner_name, workspace_id, task_input)

    # If we get here without exception, the send was successful (204 No Content)
    # No assertion needed as httpx will raise on error


@pytest.mark.vcr
async def test_send_task_input_empty(coder_base_url, coder_token):
    """Test sending empty input raises ValueError"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Get current workspace for testing
    workspaces = await client.list_workspaces()
    assert len(workspaces) > 0, "At least one workspace should exist"

    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Test empty string
    with pytest.raises(ValueError, match="Task input cannot be empty"):
        await client.send_task_input(owner_name, workspace_id, "")

    # Test whitespace only
    with pytest.raises(ValueError, match="Task input cannot be empty"):
        await client.send_task_input(owner_name, workspace_id, "   ")
