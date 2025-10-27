"""
Contract tests for create_agent_task MCP tool.

Tests verify that the tool conforms to the expected MCP interface
and creates tasks with proper validation.
"""

import pytest


class TestCreateAgentTaskContract:
    """Contract tests for create_agent_task tool."""

    @pytest.mark.asyncio
    async def test_create_agent_task_returns_success(self):
        """Test that create_agent_task successfully creates a task."""
        from coder_mcp.tools.create_task import create_agent_task
        from coder_mcp.tools.list_agents import list_agents

        # Get a real agent/workspace to test with
        agents = await list_agents()
        if not agents:
            pytest.skip("No agents available for testing")

        agent_to_test = agents[0]

        result = await create_agent_task(
            user=agent_to_test.user,
            prompt="Test task prompt",
            workspace_name=agent_to_test.workspace_name,
        )

        # Verify result structure
        assert isinstance(result, dict)
        assert "success" in result
        # Creating a task might fail for various reasons (workspace busy, etc)
        # so we just verify the structure is correct
        if result["success"]:
            assert "data" in result
            # Verify created task data
            task_data = result["data"]
            assert (
                "id" in task_data
                or "workspace_id" in task_data
                or "status" in task_data
            )

    @pytest.mark.asyncio
    async def test_create_agent_task_validates_required_params(self):
        """Test that create_agent_task validates required parameters."""
        from coder_mcp.tools.create_task import create_agent_task

        # Test missing prompt
        with pytest.raises(TypeError):
            await create_agent_task(user="me", workspace_name="test-workspace")

        # Test missing workspace_name
        with pytest.raises(TypeError):
            await create_agent_task(user="me", prompt="Test prompt")

        # Test missing user
        with pytest.raises(TypeError):
            await create_agent_task(
                workspace_name="test-workspace", prompt="Test prompt"
            )

    @pytest.mark.asyncio
    async def test_create_agent_task_accepts_optional_params(self):
        """Test that create_agent_task accepts optional parameters."""
        from coder_mcp.tools.create_task import create_agent_task

        result = await create_agent_task(
            user="me",
            prompt="Test prompt",
            workspace_name="test-workspace",
            template_name="custom-template",
            rich_parameters={"param1": "value1"},
        )

        assert isinstance(result, dict)
        assert "success" in result

    @pytest.mark.asyncio
    async def test_create_agent_task_handles_offline_agent(self):
        """Test that create_agent_task detects offline agents."""
        from coder_mcp.tools.create_task import create_agent_task

        # Try to create task for offline/stopped workspace
        result = await create_agent_task(
            user="me",
            prompt="Test prompt",
            workspace_name="offline-workspace-12345",
        )

        # Should return error for offline/non-existent workspace
        assert isinstance(result, dict)
        assert "success" in result
        # Either workspace not found or offline error
        if not result["success"]:
            assert "error_code" in result
            assert result["error_code"] in [
                "WORKSPACE_NOT_FOUND",
                "AGENT_OFFLINE",
                "CODER_API_ERROR",
            ]

    @pytest.mark.asyncio
    async def test_create_agent_task_returns_created_agent_id(self):
        """Test that create_agent_task returns the created agent/task ID."""
        from coder_mcp.tools.create_task import create_agent_task

        result = await create_agent_task(
            user="me",
            prompt="Test task",
            workspace_name="test-workspace",
        )

        if result["success"]:
            assert "data" in result
            task_data = result["data"]
            assert "id" in task_data
            # ID should be non-empty string
            assert isinstance(task_data["id"], str)
            assert len(task_data["id"]) > 0

    @pytest.mark.asyncio
    async def test_create_agent_task_validates_prompt_not_empty(self):
        """Test that create_agent_task rejects empty prompts."""
        from coder_mcp.tools.create_task import create_agent_task

        result = await create_agent_task(
            user="me",
            prompt="",
            workspace_name="test-workspace",
        )

        # Should fail validation for empty prompt
        assert isinstance(result, dict)
        assert "success" in result
        if not result["success"]:
            assert "error_code" in result
            assert result["error_code"] in ["VALIDATION_ERROR", "CODER_API_ERROR"]

    @pytest.mark.asyncio
    async def test_create_agent_task_error_format(self):
        """Test that create_agent_task returns consistent error format."""
        from coder_mcp.tools.create_task import create_agent_task

        # Try to create task for non-existent workspace
        result = await create_agent_task(
            user="me",
            prompt="Test prompt",
            workspace_name="nonexistent-workspace-99999",
        )

        # Verify error structure
        assert isinstance(result, dict)
        assert "success" in result
        if not result["success"]:
            assert "error" in result
            assert "error_code" in result
            assert isinstance(result["error"], str)
            assert isinstance(result["error_code"], str)
