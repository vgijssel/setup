"""Integration tests for Coder experimental task API (Refactored)

These tests demonstrate the new fixture-based testing approach:
- All mocking is handled by fixtures
- Tests are clean and focus only on assertions
- Respx fails on unmocked requests
- Version-aware cassette caching
"""

import pytest


@pytest.mark.asyncio
async def test_get_task_exists(coder_client, mock_get_task_exists):
    """Test getting task when it exists"""
    workspace = mock_get_task_exists["workspace"]
    task = mock_get_task_exists["task"]

    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Get the task
    task_result = await coder_client.get_task(owner_name, workspace_id)

    # Assertions
    assert task_result is not None, "Task should exist for active workspace"
    assert isinstance(task_result, dict)
    assert "id" in task_result
    assert "workspace_id" in task_result
    assert "current_state" in task_result
    assert "state" in task_result["current_state"]
    assert task_result["current_state"]["state"] in ["idle", "working", "failure"]


@pytest.mark.asyncio
async def test_get_task_not_found(coder_client, mock_get_task_not_found):
    """Test getting task returns None for 404 responses"""
    fake_workspace_id = mock_get_task_not_found["workspace_id"]
    fake_username = mock_get_task_not_found["username"]

    # Get the task (should return None)
    task = await coder_client.get_task(fake_username, fake_workspace_id)

    # Assertions
    assert task is None


@pytest.mark.asyncio
async def test_send_task_input(coder_client, mock_send_task_input):
    """Test sending input to a task"""
    workspace = mock_send_task_input["workspace"]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Send task input
    task_input = "Test task input for VCR recording"
    await coder_client.send_task_input(owner_name, workspace_id, task_input)

    # If we get here without exception, the send was successful


@pytest.mark.asyncio
async def test_send_task_input_empty(coder_client):
    """Test sending empty input raises ValueError"""
    workspace_id = "test-workspace-id"
    owner_name = "test-owner"

    # Test empty string
    with pytest.raises(ValueError, match="Task input cannot be empty"):
        await coder_client.send_task_input(owner_name, workspace_id, "")

    # Test whitespace only
    with pytest.raises(ValueError, match="Task input cannot be empty"):
        await coder_client.send_task_input(owner_name, workspace_id, "   ")


@pytest.mark.asyncio
async def test_send_interrupt(coder_client, mock_send_interrupt):
    """Test sending interrupt signal to cancel a task"""
    workspace = mock_send_interrupt["workspace"]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Send interrupt signal
    result = await coder_client.send_interrupt(owner_name, workspace_id)

    # Assertions
    assert isinstance(result, dict)
    # For 204 No Content, we expect an empty dict


@pytest.mark.asyncio
async def test_get_task_logs(coder_client, mock_get_task_logs):
    """Test getting task logs"""
    workspace = mock_get_task_logs["workspace"]
    logs = mock_get_task_logs["logs"]

    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Get task logs
    logs_result = await coder_client.get_task_logs(owner_name, workspace_id)

    # Assertions
    assert isinstance(logs_result, list)

    # If logs exist, verify their structure
    if len(logs_result) > 0:
        log_entry = logs_result[0]
        assert "id" in log_entry
        assert "time" in log_entry
        assert "type" in log_entry
        assert log_entry["type"] in ["input", "output"]
        assert "content" in log_entry
