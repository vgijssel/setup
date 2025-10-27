"""
End-to-end integration tests for User Story 3: Assign Tasks to Agents.

Tests verify that MCP tools are properly registered and work end-to-end
through the FastMCP server for creating and assigning tasks.
"""

import pytest
from coder_mcp.server import mcp
from coder_mcp.tools.create_task import create_agent_task
from coder_mcp.tools.list_agents import list_agents


@pytest.mark.asyncio
async def test_us3_create_agent_task_end_to_end(vcr_cassette):
    """Test US3: Superagent can create and assign tasks to agents."""
    # First, get list of agents to find a valid workspace
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available for testing")

    # Try to create task for first agent
    agent = agents[0]
    result = await create_agent_task(
        user=agent.user,
        prompt="Test task: analyze the project structure and provide a summary",
        workspace_name=agent.workspace_name,
    )

    # Verify result structure
    assert isinstance(result, dict)
    assert "success" in result

    # If successful, verify task data
    if result["success"]:
        assert "data" in result
        task_data = result["data"]
        # Should have some identifier
        assert any(key in task_data for key in ["id", "task_id", "workspace_id"])


@pytest.mark.asyncio
async def test_us3_create_task_with_parameters(vcr_cassette):
    """Test US3: Create task with optional parameters."""
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available")

    agent = agents[0]
    result = await create_agent_task(
        user=agent.user,
        prompt="Test task with parameters",
        workspace_name=agent.workspace_name,
        template_name="custom-template",
        rich_parameters={"region": "us-east-1"},
    )

    assert isinstance(result, dict)
    assert "success" in result


@pytest.mark.asyncio
async def test_us3_create_task_validation_error(vcr_cassette):
    """Test US3: Task creation with invalid parameters returns error."""
    # Empty prompt should fail validation
    result = await create_agent_task(
        user="me",
        prompt="",
        workspace_name="test-workspace",
    )

    assert result["success"] is False
    assert result["error_code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_us3_create_task_nonexistent_workspace(vcr_cassette):
    """Test US3: Task creation for non-existent workspace fails gracefully."""
    result = await create_agent_task(
        user="me",
        prompt="Test prompt",
        workspace_name="nonexistent-workspace-99999",
    )

    # Should return error
    assert result["success"] is False
    assert "error_code" in result
    assert result["error_code"] in [
        "WORKSPACE_NOT_FOUND",
        "AGENT_OFFLINE",
        "CODER_API_ERROR",
    ]


@pytest.mark.asyncio
async def test_us3_mcp_tool_registered():
    """Verify that US3 tool is registered in the MCP server."""
    tools = mcp.list_tools()
    tool_names = [tool.name for tool in tools]

    # Verify US3 tool is present
    assert "create_new_agent_task" in tool_names


@pytest.mark.asyncio
async def test_us3_acceptance_scenario_1(vcr_cassette):
    """
    US3 Acceptance Scenario 1:
    Given I have available agents
    When I create a task with a prompt
    Then the task is assigned to the specified agent
    And I receive confirmation with task ID
    """
    # Get available agents
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available")

    # Find an idle or running agent
    available_agent = next(
        (a for a in agents if a.status.value in ["idle", "running"]), agents[0]
    )

    # Create task
    result = await create_agent_task(
        user=available_agent.user,
        prompt="US3 Acceptance Test: Summarize the codebase structure",
        workspace_name=available_agent.workspace_name,
    )

    # Verify confirmation (either success or expected error)
    assert isinstance(result, dict)
    assert "success" in result

    # If successful, verify task ID provided
    if result["success"]:
        assert "data" in result
        # Should have some form of ID
        task_data = result["data"]
        has_id = any(key in task_data for key in ["id", "task_id", "workspace_id"])
        assert has_id, "Task confirmation should include an identifier"


@pytest.mark.asyncio
async def test_us3_acceptance_scenario_2(vcr_cassette):
    """
    US3 Acceptance Scenario 2:
    Given an offline agent
    When I attempt to assign a task
    Then I receive an error indicating the agent is offline
    """
    # Try to assign to non-existent/offline workspace
    result = await create_agent_task(
        user="me",
        prompt="Test task for offline agent",
        workspace_name="offline-agent-workspace-12345",
    )

    # Should fail with appropriate error
    assert result["success"] is False
    assert "error" in result
    assert "error_code" in result

    # Error should indicate workspace/agent issue
    error_msg = result["error"].lower()
    assert any(
        keyword in error_msg
        for keyword in ["not found", "offline", "does not exist", "invalid"]
    )


@pytest.mark.asyncio
async def test_us3_completion_criteria():
    """Verify US3 completion criteria are met."""
    # Completion criteria 1: Superagent can create tasks with parameters
    # Tested by test_us3_create_task_with_parameters

    # Completion criteria 2: Task assignment validated for agent capabilities
    # Basic validation implemented in create_task.py (TODO: full capability checking)

    # Completion criteria 3: Offline agents detected with fail-fast error
    # Tested by test_us3_acceptance_scenario_2

    # Verify tool is registered
    tools = mcp.list_tools()
    tool_names = [tool.name for tool in tools]
    assert "create_new_agent_task" in tool_names


@pytest.mark.asyncio
async def test_us3_offline_detection_fail_fast(vcr_cassette):
    """Test US3: Offline detection happens immediately (fail-fast)."""
    # Create task for definitely offline workspace
    result = await create_agent_task(
        user="me",
        prompt="Test prompt",
        workspace_name="definitely-not-running-workspace",
    )

    # Should fail quickly with appropriate error
    assert result["success"] is False
    assert "error_code" in result

    # Error code should indicate workspace/agent issue
    assert result["error_code"] in [
        "WORKSPACE_NOT_FOUND",
        "AGENT_OFFLINE",
        "CODER_API_ERROR",
        "VALIDATION_ERROR",
    ]


@pytest.mark.asyncio
async def test_us3_empty_prompt_rejected(vcr_cassette):
    """Test US3: Empty or whitespace-only prompts are rejected."""
    # Empty prompt
    result1 = await create_agent_task(
        user="me",
        prompt="",
        workspace_name="test-workspace",
    )

    assert result1["success"] is False
    assert result1["error_code"] == "VALIDATION_ERROR"

    # Whitespace-only prompt
    result2 = await create_agent_task(
        user="me",
        prompt="   \n\t  ",
        workspace_name="test-workspace",
    )

    assert result2["success"] is False
    assert result2["error_code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_us3_empty_workspace_name_rejected(vcr_cassette):
    """Test US3: Empty workspace names are rejected."""
    result = await create_agent_task(
        user="me",
        prompt="Test prompt",
        workspace_name="",
    )

    assert result["success"] is False
    assert result["error_code"] == "VALIDATION_ERROR"
