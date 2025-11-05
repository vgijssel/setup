"""Integration tests for Coder experimental task API (refactored with RESPX mocking)

This test file demonstrates the new testing approach:
- Uses pre-recorded VCR cassettes as fixtures
- Uses RESPX to mock HTTP responses
- Tests are deterministic, offline, and fast
- No external state dependencies
"""

import pytest
import respx
from fleet_mcp.coder.client import CoderClient
from httpx import Response
from tests.fixtures import get_all_responses


@pytest.mark.asyncio
@respx.mock
async def test_get_task_exists():
    """Test getting task from experimental API when task exists"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_get_task_exists")

    # Mock list workspaces
    workspaces = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces)
    )

    # Get workspace details from cassette
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Mock get task
    task = responses[1].get("parsed_body")
    respx.get(
        f"{base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai"
    ).mock(return_value=Response(200, json=task))

    # Execute test
    workspaces_result = await client.list_workspaces()
    assert len(workspaces_result) > 0, "At least one workspace should exist"

    workspace_result = workspaces_result[0]
    workspace_id_result = workspace_result.get("id")
    owner_name_result = workspace_result.get("owner_name")

    task_result = await client.get_task(owner_name_result, workspace_id_result)

    # Assertions
    assert task_result is not None, "Task should exist for active workspace"
    assert isinstance(task_result, dict)
    assert "id" in task_result
    assert "workspace_id" in task_result
    assert "current_state" in task_result
    assert "state" in task_result["current_state"]
    assert task_result["current_state"]["state"] in ["idle", "working", "failure"]


@pytest.mark.asyncio
@respx.mock
async def test_get_task_not_found():
    """Test getting task returns None for 404 responses"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Mock 404 response
    fake_workspace_id = "00000000-0000-0000-0000-000000000000"
    fake_username = "nonexistent"

    respx.get(
        f"{base_url}/api/v2/users/{fake_username}/workspace/{fake_workspace_id}/tasks/ai"
    ).mock(return_value=Response(404, json={"message": "Not found"}))

    # Execute test
    task = await client.get_task(fake_username, fake_workspace_id)

    # Assertions
    assert task is None


@pytest.mark.asyncio
@respx.mock
async def test_send_task_input():
    """Test sending input to a task via experimental API"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_send_task_input")

    # Mock list workspaces
    workspaces = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces)
    )

    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Mock send task input (204 No Content)
    respx.post(
        f"{base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai/messages"
    ).mock(return_value=Response(204))

    # Execute test
    workspaces_result = await client.list_workspaces()
    workspace_result = workspaces_result[0]
    workspace_id_result = workspace_result.get("id")
    owner_name_result = workspace_result.get("owner_name")

    task_input = "Test task input for VCR recording"
    await client.send_task_input(owner_name_result, workspace_id_result, task_input)

    # If we get here without exception, the send was successful


@pytest.mark.asyncio
async def test_send_task_input_empty():
    """Test sending empty input raises ValueError"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    workspace_id = "test-workspace-id"
    owner_name = "test-owner"

    # Test empty string
    with pytest.raises(ValueError, match="Task input cannot be empty"):
        await client.send_task_input(owner_name, workspace_id, "")

    # Test whitespace only
    with pytest.raises(ValueError, match="Task input cannot be empty"):
        await client.send_task_input(owner_name, workspace_id, "   ")


@pytest.mark.asyncio
@respx.mock
async def test_send_interrupt():
    """Test sending interrupt signal to cancel a task via experimental API"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_send_interrupt")

    # Mock list workspaces
    workspaces = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces)
    )

    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Mock send interrupt (204 No Content)
    respx.post(
        f"{base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai/messages"
    ).mock(return_value=Response(204))

    # Execute test
    workspaces_result = await client.list_workspaces()
    workspace_result = workspaces_result[0]
    workspace_id_result = workspace_result.get("id")
    owner_name_result = workspace_result.get("owner_name")

    result = await client.send_interrupt(owner_name_result, workspace_id_result)

    # Assertions
    assert isinstance(result, dict)
    # For 204 No Content, we expect an empty dict


@pytest.mark.asyncio
@respx.mock
async def test_get_task_logs():
    """Test getting task logs from experimental API"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_get_task_logs")

    # Mock list workspaces
    workspaces = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces)
    )

    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # Mock get task logs
    logs = responses[1].get("parsed_body")
    respx.get(
        f"{base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai/logs"
    ).mock(return_value=Response(200, json=logs))

    # Execute test
    workspaces_result = await client.list_workspaces()
    workspace_result = workspaces_result[0]
    workspace_id_result = workspace_result.get("id")
    owner_name_result = workspace_result.get("owner_name")

    logs_result = await client.get_task_logs(owner_name_result, workspace_id_result)

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
