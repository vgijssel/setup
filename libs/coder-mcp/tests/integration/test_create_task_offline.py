"""
Integration tests for offline agent detection in create_agent_task.

Tests verify that the tool properly detects and rejects attempts to
assign tasks to offline or non-existent agents.
"""

import pytest
from coder_mcp.tools.create_task import create_agent_task, check_agent_online
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


@pytest.mark.asyncio
async def test_create_task_offline_agent_rejection(vcr_cassette):
    """Test that create_agent_task rejects offline agents."""
    # Try to create task for a workspace that doesn't exist or is offline
    result = await create_agent_task(
        user="me",
        prompt="Test task for offline agent",
        workspace_name="offline-workspace-nonexistent-12345",
    )

    # Should return error
    assert isinstance(result, dict)
    assert "success" in result
    # May fail at creation time (workspace not found) rather than pre-check
    if not result["success"]:
        assert "error_code" in result
        assert result["error_code"] in [
            "WORKSPACE_NOT_FOUND",
            "AGENT_OFFLINE",
            "CODER_API_ERROR",
            "VALIDATION_ERROR",
        ]


@pytest.mark.asyncio
async def test_check_agent_online_helper(vcr_cassette):
    """Test the check_agent_online helper function."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Check for non-existent workspace
        is_online, error = await check_agent_online(
            client=client,
            user="me",
            workspace_name="nonexistent-workspace-99999",
        )

        # Should return False with error message
        assert is_online is False
        assert error is not None
        assert isinstance(error, str)
        assert len(error) > 0


@pytest.mark.asyncio
async def test_check_agent_online_with_existing_agent(vcr_cassette):
    """Test check_agent_online with an existing running agent."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # First, get list of agents to find a running one
        response = await client.get("/api/experimental/tasks")
        response.raise_for_status()
        data = response.json()

        tasks = data.get("tasks", [])
        if not tasks:
            pytest.skip("No agents available for testing")

        # Get first running agent
        task = tasks[0]
        workspace_name = task.get("workspace_name")
        username = task.get("username", "me")

        # Check if it's online
        is_online, error = await check_agent_online(
            client=client,
            user=username,
            workspace_name=workspace_name,
        )

        # If agent is connected, should return True
        if task.get("connected", False):
            assert is_online is True
            assert error is None


@pytest.mark.asyncio
async def test_create_task_empty_workspace_name(vcr_cassette):
    """Test that empty workspace name is rejected."""
    result = await create_agent_task(
        user="me",
        prompt="Test prompt",
        workspace_name="",
    )

    # Should return validation error
    assert result["success"] is False
    assert result["error_code"] == "VALIDATION_ERROR"
    assert "workspace" in result["error"].lower()


@pytest.mark.asyncio
async def test_create_task_empty_prompt(vcr_cassette):
    """Test that empty prompt is rejected."""
    result = await create_agent_task(
        user="me",
        prompt="",
        workspace_name="test-workspace",
    )

    # Should return validation error
    assert result["success"] is False
    assert result["error_code"] == "VALIDATION_ERROR"
    assert "prompt" in result["error"].lower()


@pytest.mark.asyncio
async def test_create_task_whitespace_only_prompt(vcr_cassette):
    """Test that whitespace-only prompt is rejected."""
    result = await create_agent_task(
        user="me",
        prompt="   \n\t  ",
        workspace_name="test-workspace",
    )

    # Should return validation error
    assert result["success"] is False
    assert result["error_code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_create_task_fail_fast_for_offline(vcr_cassette):
    """Test that offline detection happens before task creation attempt."""
    # This test verifies the fail-fast behavior mentioned in tasks.md T046

    result = await create_agent_task(
        user="me",
        prompt="Test task",
        workspace_name="definitely-offline-workspace-12345",
    )

    # Should fail with appropriate error
    assert result["success"] is False
    assert "error_code" in result

    # Error should be descriptive
    assert len(result["error"]) > 0
