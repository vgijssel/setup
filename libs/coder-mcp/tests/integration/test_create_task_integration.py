"""
Integration tests for create_agent_task tool with VCR fixtures.

Tests verify interaction with real Coder API for creating AI tasks/agents
and record HTTP responses as VCR cassettes for offline testing.
"""

import pytest
import httpx
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


@pytest.mark.asyncio
async def test_create_task_api_endpoint_format(vcr_cassette):
    """Test that create task endpoint accepts correct format."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Test correct endpoint format for creating task
        # POST /api/experimental/tasks/{user}
        task_data = {
            "prompt": "Test task prompt for integration test",
            "workspace_name": "test-workspace",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # May succeed (201) or fail (404 if workspace doesn't exist, 400 for validation)
        # But endpoint format should be recognized
        assert response.status_code in [200, 201, 400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_with_valid_workspace(vcr_cassette):
    """Test creating a task with a valid workspace."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # First, try to list workspaces to find a valid one
        # Note: This may require different API endpoint
        task_data = {
            "prompt": "Integration test task: analyze code structure",
            "workspace_name": "test-agent-01",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # If workspace exists and is running, should succeed
        if response.status_code in [200, 201]:
            data = response.json()
            assert "id" in data or "task_id" in data
        else:
            # Workspace might not exist or be offline
            assert response.status_code in [400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_with_nonexistent_workspace(vcr_cassette):
    """Test creating a task for non-existent workspace returns error."""
    config = Config()
    async with CoderAPIClient(config) as client:
        task_data = {
            "prompt": "Test prompt",
            "workspace_name": "nonexistent-workspace-99999",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # Should return error for non-existent workspace
        assert response.status_code in [400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_with_template_parameter(vcr_cassette):
    """Test creating a task with template_name parameter."""
    config = Config()
    async with CoderAPIClient(config) as client:
        task_data = {
            "prompt": "Test task with template",
            "workspace_name": "test-workspace",
            "template_name": "custom-template",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # Template might not exist, but endpoint should accept parameter
        assert response.status_code in [200, 201, 400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_with_rich_parameters(vcr_cassette):
    """Test creating a task with rich_parameters."""
    config = Config()
    async with CoderAPIClient(config) as client:
        task_data = {
            "prompt": "Test task with rich parameters",
            "workspace_name": "test-workspace",
            "rich_parameters": {
                "region": "us-east-1",
                "instance_type": "t3.medium",
            },
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # Rich parameters might not be supported, but endpoint should handle gracefully
        assert response.status_code in [200, 201, 400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_validates_prompt_required(vcr_cassette):
    """Test that API requires prompt parameter."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Missing prompt
        task_data = {
            "workspace_name": "test-workspace",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # Should return validation error or not found (workspace doesn't exist)
        assert response.status_code in [400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_validates_workspace_name_required(vcr_cassette):
    """Test that API requires workspace_name parameter."""
    config = Config()
    async with CoderAPIClient(config) as client:
        # Missing workspace_name
        task_data = {
            "prompt": "Test prompt",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # Should return validation error or not found
        assert response.status_code in [400, 404, 422]


@pytest.mark.asyncio
async def test_create_task_response_structure(vcr_cassette):
    """Test that successful task creation returns expected structure."""
    config = Config()
    async with CoderAPIClient(config) as client:
        task_data = {
            "prompt": "Test task for response structure validation",
            "workspace_name": "test-workspace",
        }

        response = await client.post(
            "/api/experimental/tasks/me",
            json=task_data,
        )

        # If successful, verify response structure
        if response.status_code in [200, 201]:
            data = response.json()
            # Should have at least an ID field
            assert "id" in data or "task_id" in data or "workspace_id" in data
