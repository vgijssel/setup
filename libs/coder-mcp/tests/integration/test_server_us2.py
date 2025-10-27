"""
End-to-end integration tests for User Story 2: Check Individual Agent Details.

Tests verify that MCP tools are properly registered and work end-to-end
through the FastMCP server for viewing agent details and logs.
"""

import pytest
from coder_mcp.server import mcp
from coder_mcp.tools.get_agent_details import get_agent_details
from coder_mcp.tools.get_agent_logs import get_agent_logs
from coder_mcp.tools.list_agents import list_agents


@pytest.mark.asyncio
async def test_us2_get_agent_details_end_to_end(vcr_cassette):
    """Test US2: Superagent can query specific agent by ID."""
    # First, get list of agents to find a valid ID
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available for testing")

    # Get first agent's details
    agent = agents[0]
    result = await get_agent_details(user=agent.user, agent_id=agent.id)

    # Verify success
    assert result["success"] is True
    assert "data" in result

    # Verify agent data matches expected structure
    agent_data = result["data"]
    assert agent_data["id"] == agent.id
    assert "workspace_id" in agent_data
    assert "status" in agent_data
    assert "created_at" in agent_data


@pytest.mark.asyncio
async def test_us2_get_agent_logs_end_to_end(vcr_cassette):
    """Test US2: Agent logs retrievable for specific agent."""
    # First, get list of agents to find a valid ID
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available for testing")

    # Get logs for first agent
    agent = agents[0]
    result = await get_agent_logs(user=agent.user, agent_id=agent.id)

    # Verify success (logs may be empty, but call should succeed)
    assert result["success"] is True
    assert "data" in result
    assert isinstance(result["data"], list)


@pytest.mark.asyncio
async def test_us2_get_agent_logs_with_filters_end_to_end(vcr_cassette):
    """Test US2: Agent logs retrievable with filtering (level, limit)."""
    # Get list of agents
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available for testing")

    agent = agents[0]

    # Test with level filter
    result = await get_agent_logs(
        user=agent.user,
        agent_id=agent.id,
        level="error",
    )

    assert result["success"] is True
    assert isinstance(result["data"], list)

    # If there are logs, verify they match the filter
    if result["data"]:
        for log in result["data"]:
            assert log["level"] == "error"

    # Test with limit
    result = await get_agent_logs(
        user=agent.user,
        agent_id=agent.id,
        limit=5,
    )

    assert result["success"] is True
    assert isinstance(result["data"], list)
    assert len(result["data"]) <= 5


@pytest.mark.asyncio
async def test_us2_get_nonexistent_agent_details(vcr_cassette):
    """Test US2: Error handling for non-existent agent details."""
    result = await get_agent_details(
        user="me",
        agent_id="nonexistent-agent-id-99999",
    )

    # Verify error response
    assert result["success"] is False
    assert "error" in result
    assert result["error_code"] == "AGENT_NOT_FOUND"


@pytest.mark.asyncio
async def test_us2_get_nonexistent_agent_logs(vcr_cassette):
    """Test US2: Error handling for non-existent agent logs."""
    result = await get_agent_logs(
        user="me",
        agent_id="nonexistent-agent-id-99999",
    )

    # Verify error response
    assert result["success"] is False
    assert "error" in result
    assert result["error_code"] == "AGENT_NOT_FOUND"


@pytest.mark.asyncio
async def test_us2_mcp_tools_registered():
    """Verify that US2 tools are registered in the MCP server."""
    # Get list of registered tools
    tools = mcp.list_tools()
    tool_names = [tool.name for tool in tools]

    # Verify US2 tools are present
    assert "get_agent_details_by_id" in tool_names
    assert "get_agent_execution_logs" in tool_names


@pytest.mark.asyncio
async def test_us2_acceptance_scenario_1(vcr_cassette):
    """
    US2 Acceptance Scenario 1:
    Given a superagent managing multiple AI agents
    When I query agent details by ID
    Then I receive complete agent information including status, workspace, and capabilities
    """
    # Get list of agents
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available")

    agent = agents[0]

    # Query agent details
    result = await get_agent_details(user=agent.user, agent_id=agent.id)

    # Verify complete information returned
    assert result["success"] is True
    agent_data = result["data"]

    # Required fields from acceptance criteria
    assert "id" in agent_data
    assert "status" in agent_data
    assert "workspace_id" in agent_data
    assert "workspace_name" in agent_data
    assert "capabilities" in agent_data
    assert isinstance(agent_data["capabilities"], list)


@pytest.mark.asyncio
async def test_us2_acceptance_scenario_2(vcr_cassette):
    """
    US2 Acceptance Scenario 2:
    Given an agent is executing a task
    When I request its logs
    Then I receive log entries with timestamps and levels
    """
    # Get list of agents
    agents = await list_agents()

    if not agents:
        pytest.skip("No agents available")

    # Find a busy agent if possible, otherwise use first agent
    busy_agent = next((a for a in agents if a.status.value == "busy"), agents[0])

    # Request logs
    result = await get_agent_logs(
        user=busy_agent.user,
        agent_id=busy_agent.id,
    )

    # Verify logs structure
    assert result["success"] is True
    assert isinstance(result["data"], list)

    # If logs exist, verify structure
    if result["data"]:
        log_entry = result["data"][0]
        assert "timestamp" in log_entry
        assert "level" in log_entry
        assert "message" in log_entry


@pytest.mark.asyncio
async def test_us2_completion_criteria():
    """Verify US2 completion criteria are met."""
    # Completion criteria 1: Superagent can query specific agent by ID
    # This is tested by test_us2_get_agent_details_end_to_end

    # Completion criteria 2: Agent logs retrievable with filtering
    # This is tested by test_us2_get_agent_logs_with_filters_end_to_end

    # Completion criteria 3: Tests pass with VCR cassettes
    # This entire test suite uses VCR cassettes

    # Verify tools are registered
    tools = mcp.list_tools()
    tool_names = [tool.name for tool in tools]

    assert "get_agent_details_by_id" in tool_names
    assert "get_agent_execution_logs" in tool_names
