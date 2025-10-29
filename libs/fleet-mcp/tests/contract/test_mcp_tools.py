"""Contract tests for MCP tools - User Story 1"""
import pytest
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.tools.agent_management import register_agent_tools
from fastmcp import FastMCP


# Fixture for testing tools
@pytest.fixture
async def agent_tools(coder_base_url, coder_token):
    """Create agent tools for testing"""
    mcp = FastMCP("Test Server")
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, client)

    # Get the registered tools
    tools = {}
    for tool in mcp._mcp_server._server._tools:
        tools[tool.name] = tool.fn

    return tools, client


# T033: Test create_agent tool success case
@pytest.mark.vcr
@pytest.mark.skip(reason="Requires live Coder API - VCR cassettes needed")
async def test_create_agent_success(agent_tools):
    """Test successful agent creation with vcr cassette"""
    tools, client = agent_tools

    result = await tools["create_agent"](
        name="test-papi",
        project="Setup",
        role="coder",
        spec="Test specification for unit testing"
    )

    assert result is not None
    assert result.agent.name == "test-papi"
    assert result.agent.status.value == "busy"  # Agent starts working immediately
    assert result.agent.role == "coder"
    assert result.agent.current_task == "Test specification for unit testing"
    assert result.message is not None

    # Cleanup
    await client.aclose()


# T034: Test create_agent with invalid name
async def test_create_agent_invalid_name(coder_base_url, coder_token):
    """Test create_agent fails with invalid agent name"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    with pytest.raises(Exception) as exc:
        await mcp.call_tool("create_agent", {
            "name": "invalid@name",  # Invalid characters
            "project": "Setup",
            "role": "coder",
            "spec": "Test"
        })
    assert "validation" in str(exc.value).lower() or "invalid" in str(exc.value).lower()


# T035: Test create_agent with invalid project
async def test_create_agent_invalid_project(coder_base_url, coder_token):
    """Test create_agent fails with non-existent project"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    with pytest.raises(Exception) as exc:
        await mcp.call_tool("create_agent", {
            "name": "test-agent",
            "project": "NonExistentProject",
            "role": "coder",
            "spec": "Test"
        })
    assert "not found" in str(exc.value).lower() or "template" in str(exc.value).lower()


# T036: Test list_agents tool
@pytest.mark.vcr
async def test_list_agents_success(coder_base_url, coder_token):
    """Test list_agents returns agent list"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    result = await mcp.call_tool("list_agents", {})

    assert result is not None
    assert "agents" in result
    assert "total_count" in result
    assert isinstance(result["agents"], list)
    assert isinstance(result["total_count"], int)


# T037: Test show_agent tool
@pytest.mark.vcr
async def test_show_agent_success(coder_base_url, coder_token):
    """Test show_agent returns agent details"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    # First create an agent to show
    create_result = await mcp.call_tool("create_agent", {
        "name": "test-show",
        "project": "Setup",
        "role": "coder",
        "spec": "Test for show agent"
    })

    # Now show the agent
    result = await mcp.call_tool("show_agent", {
        "agent_name": "test-show"
    })

    assert result is not None
    assert "agent" in result
    assert result["agent"]["name"] == "test-show"
    assert "workspace_id" in result["agent"]
    assert "metadata" in result["agent"]
    assert "fleet_mcp_agent_spec" in result["agent"]["metadata"]


# T038: Test show_agent with non-existent agent
async def test_show_agent_not_found(coder_base_url, coder_token):
    """Test show_agent fails with non-existent agent"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    with pytest.raises(Exception) as exc:
        await mcp.call_tool("show_agent", {
            "agent_name": "nonexistent-agent-xyz"
        })
    assert "not found" in str(exc.value).lower()


# T039: Test show_agent_task_history tool
@pytest.mark.vcr
async def test_show_agent_task_history_success(coder_base_url, coder_token):
    """Test show_agent_task_history returns paginated task list"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    # Create an agent first
    create_result = await mcp.call_tool("create_agent", {
        "name": "test-history",
        "project": "Setup",
        "role": "coder",
        "spec": "Test for task history"
    })

    # Get task history
    result = await mcp.call_tool("show_agent_task_history", {
        "agent_name": "test-history",
        "page": 1,
        "page_size": 20
    })

    assert result is not None
    assert "tasks" in result
    assert "total_count" in result
    assert "page" in result
    assert "page_size" in result
    assert "total_pages" in result
    assert isinstance(result["tasks"], list)
    assert result["page"] == 1
    assert result["page_size"] == 20


# T040: Test task history pagination
@pytest.mark.vcr
async def test_task_history_pagination(coder_base_url, coder_token):
    """Test task history pagination with different page sizes"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    # Use existing agent or create one
    result_page1 = await mcp.call_tool("show_agent_task_history", {
        "agent_name": "test-history",
        "page": 1,
        "page_size": 10
    })

    assert result_page1["page"] == 1
    assert result_page1["page_size"] == 10

    # Request page 2
    result_page2 = await mcp.call_tool("show_agent_task_history", {
        "agent_name": "test-history",
        "page": 2,
        "page_size": 10
    })

    assert result_page2["page"] == 2
    assert result_page2["page_size"] == 10
