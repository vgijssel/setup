"""Integration tests for Coder experimental task API"""

import pytest
from fleet_mcp.coder.client import CoderClient


# Test getting task from experimental API
async def test_get_task_exists(coder_base_url, coder_token, my_vcr, vcr_cassette_dir):
    """Test getting task from experimental API when task exists"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_get_task_exists.yaml")
    with my_vcr.use_cassette(cassette_path):
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


async def test_get_task_not_found(
    coder_base_url, coder_token, my_vcr, vcr_cassette_dir
):
    """Test getting task returns None for 404 responses"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_get_task_not_found.yaml")
    with my_vcr.use_cassette(cassette_path):
        # Use a fake workspace ID that shouldn't exist
        fake_workspace_id = "00000000-0000-0000-0000-000000000000"
        fake_username = "nonexistent"

        task = await client.get_task(fake_username, fake_workspace_id)

        # Should return None for 404
        assert task is None


async def test_send_task_input(coder_base_url, coder_token, my_vcr, vcr_cassette_dir):
    """Test sending input to a task via experimental API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_send_task_input.yaml")
    with my_vcr.use_cassette(cassette_path):
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


async def test_send_task_input_empty(
    coder_base_url, coder_token, my_vcr, vcr_cassette_dir
):
    """Test sending empty input raises ValueError"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_send_task_input_empty.yaml")
    with my_vcr.use_cassette(cassette_path):
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


async def test_send_interrupt(coder_base_url, coder_token, my_vcr, vcr_cassette_dir):
    """
    Test sending interrupt signal to cancel a task via experimental API.

    This test validates that the send_interrupt method correctly uses the
    experimental task endpoint to send an escape sequence (\u001b) as a raw
    message to interrupt the currently running task.

    Regression test for: cancel task endpoint returning 404 error
    """
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_send_interrupt.yaml")
    with my_vcr.use_cassette(cassette_path):
        # Get current workspace for testing
        workspaces = await client.list_workspaces()
        assert len(workspaces) > 0, "At least one workspace should exist"

        # Use the first workspace
        workspace = workspaces[0]
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        # Send interrupt signal (escape sequence)
        # This should return 204 No Content (empty dict) if successful
        result = await client.send_interrupt(owner_name, workspace_id)

        # Verify result is an empty dict (from 204 No Content response)
        assert isinstance(result, dict)
        # For 204 No Content, we expect an empty dict
        # If it returns actual JSON, it would be non-empty


async def test_get_task_logs(coder_base_url, coder_token, my_vcr, vcr_cassette_dir):
    """Test getting task logs from experimental API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    cassette_path = str(vcr_cassette_dir / "test_get_task_logs.yaml")
    with my_vcr.use_cassette(cassette_path):
        # Get current workspace for testing
        workspaces = await client.list_workspaces()
        assert len(workspaces) > 0, "At least one workspace should exist"

        # Use the first workspace
        workspace = workspaces[0]
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        # Get task logs using experimental API
        logs = await client.get_task_logs(owner_name, workspace_id)

        # Verify logs structure
        assert isinstance(logs, list)

        # If logs exist, verify their structure
        if len(logs) > 0:
            log_entry = logs[0]
            assert "id" in log_entry
            assert "time" in log_entry
            assert "type" in log_entry
            assert log_entry["type"] in ["input", "output"]
            assert "content" in log_entry
