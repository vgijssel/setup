"""Integration tests for Coder Beta Task API using respx mocking

All tests use respx mocking via pytest fixtures. No VCR is used directly in tests.
"""

import pytest


@pytest.mark.asyncio
async def test_get_task_exists(coder_client, mock_get_task_exists):
    """Test getting an existing task

    The mock_get_task_exists fixture:
    - Loads cassette data for this test
    - Configures respx to mock the Coder API endpoint
    - Returns the expected task data
    """
    # The fixture already set up the mock
    task = mock_get_task_exists

    # Run regular coder_client method using the task id from the mock
    task_result = await coder_client.get_task("maarten", task["id"])

    # Assertions only - no mock setup
    assert task_result["id"] == task["id"]
    assert "current_state" in task_result


@pytest.mark.asyncio
async def test_get_task_not_found(coder_client, mock_get_task_not_found):
    """Test getting a non-existent task

    The mock_get_task_not_found fixture:
    - Configures respx to return 404 for non-existent task
    - Returns the expected error response
    """
    workspace_name = "maarten"
    task_id = "non-existent-task-id"

    # This should raise an exception or return an error
    # The mock is configured to return 404
    result = await coder_client.get_task(workspace_name, task_id)

    # Assertions - should get error response
    assert result == mock_get_task_not_found


@pytest.mark.asyncio
async def test_send_task_input(coder_client, mock_send_task_input):
    """Test sending input to a task

    The mock_send_task_input fixture:
    - Mocks get_task to retrieve task details
    - Mocks send_task_input API call
    - Returns both task and input response data
    """
    task = mock_send_task_input["task"]
    workspace_name = "maarten"
    task_id = task["id"]

    # Send task input - mocked by fixture
    result = await coder_client.send_task_input(
        workspace_name, task_id, content="test input"
    )

    # Assertions
    assert result == mock_send_task_input["input_response"]


@pytest.mark.asyncio
async def test_send_task_input_empty(coder_client, mock_send_task_input_empty):
    """Test sending empty input to a task

    The mock_send_task_input_empty fixture:
    - Mocks get_task and send_task_input with empty content
    - Returns task and empty input response data
    """
    task = mock_send_task_input_empty["task"]
    workspace_name = "maarten"
    task_id = task["id"]

    # Send empty input - mocked by fixture
    result = await coder_client.send_task_input(workspace_name, task_id, content="")

    # Assertions
    assert result == mock_send_task_input_empty["input_response"]


@pytest.mark.asyncio
async def test_send_interrupt(coder_client, mock_send_interrupt):
    """Test sending interrupt signal to a task

    The mock_send_interrupt fixture:
    - Mocks get_task to retrieve task details
    - Mocks send_interrupt API call
    - Returns task and interrupt response data
    """
    task = mock_send_interrupt["task"]
    workspace_name = "maarten"
    task_id = task["id"]

    # Send interrupt - mocked by fixture
    result = await coder_client.send_interrupt(workspace_name, task_id)

    # Assertions
    assert result == mock_send_interrupt["interrupt_response"]


@pytest.mark.asyncio
async def test_get_task_logs(coder_client, mock_get_task_logs):
    """Test getting task logs

    The mock_get_task_logs fixture:
    - Mocks get_task to retrieve task details
    - Mocks get_task_logs API call
    - Returns task and logs data
    """
    task = mock_get_task_logs["task"]
    workspace_name = "maarten"
    task_id = task["id"]

    # Get task logs - mocked by fixture
    result = await coder_client.get_task_logs(workspace_name, task_id)

    # Assertions
    assert result == mock_get_task_logs["logs"]
    assert isinstance(result, list) or isinstance(result, dict)
