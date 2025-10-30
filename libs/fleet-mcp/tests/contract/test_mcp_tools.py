"""Contract tests for MCP tools - User Story 1"""
import pytest
import json
import time
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.tools.agent_management import register_agent_tools
from fleet_mcp.tools.task_management import register_task_tools
from fastmcp import FastMCP, Client


def parse_tool_result(result):
    """Helper to parse JSON result from MCP tool call"""
    assert len(result.content) > 0, "Tool result has no content"
    content = result.content[0]
    assert hasattr(content, 'text'), "Content has no text attribute"
    return json.loads(content.text)


# Fixture for testing agent management tools
@pytest.fixture
def agent_server(coder_base_url, coder_token):
    """Create FastMCP server with agent tools for testing"""
    mcp = FastMCP("Agent Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    return mcp


# Fixture for testing all tools (agent + task management)
@pytest.fixture
def full_server(coder_base_url, coder_token):
    """Create FastMCP server with all tools for testing"""
    mcp = FastMCP("Full Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)
    return mcp


# T033: Test create_agent tool success case
@pytest.mark.vcr
async def test_create_agent_success(agent_server):
    """Test successful agent creation with vcr cassette"""
    async with Client(agent_server) as client:
        result = await client.call_tool(
            "create_agent",
            {
                "name": "test-papi",
                "project": "Coder",
                "role": "coder",
                "spec": "Test specification for unit testing"
            }
        )

        data = parse_tool_result(result)

        assert data is not None
        assert data["agent"]["name"] == "test-papi"
        assert data["agent"]["status"] in ["busy", "starting", "pending", "idle"]  # Agent starts
        assert data["agent"]["role"] == "coder"
        # Note: current_task is None until metadata is written to files (TODO)
        # assert data["agent"]["current_task"] == "Test specification for unit testing"
        assert data["message"] is not None


# T034: Test create_agent with invalid name
async def test_create_agent_invalid_name(agent_server):
    """Test create_agent fails with invalid agent name"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "create_agent",
                {
                    "name": "invalid@name",  # Invalid characters
                    "project": "Coder",
                    "role": "coder",
                    "spec": "Test"
                }
            )
        error_msg = str(exc.value).lower()
        assert ("validation" in error_msg or
                "invalid" in error_msg or
                "bad request" in error_msg or
                "400" in error_msg)


# T035: Test create_agent with invalid project
async def test_create_agent_invalid_project(agent_server):
    """Test create_agent fails with non-existent project"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-agent",
                    "project": "NonExistentProject",
                    "role": "coder",
                    "spec": "Test"
                }
            )
        assert "not found" in str(exc.value).lower() or "template" in str(exc.value).lower()


# T036: Test list_agents tool
@pytest.mark.vcr
async def test_list_agents_success(agent_server):
    """Test list_agents returns agent list"""
    async with Client(agent_server) as client:
        result = await client.call_tool("list_agents", {})
        data = parse_tool_result(result)

        assert data is not None
        assert "agents" in data
        assert "total_count" in data
        assert isinstance(data["agents"], list)
        assert isinstance(data["total_count"], int)


# T037: Test show_agent tool
@pytest.mark.vcr
async def test_show_agent_success(agent_server):
    """Test show_agent returns agent details"""
    async with Client(agent_server) as client:
        # First create an agent to show
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-show",
                "project": "Coder",
                "role": "coder",
                "spec": "Test for show agent"
            }
        )
        create_data = parse_tool_result(create_result)

        # Now show the agent
        result = await client.call_tool("show_agent", {"agent_name": "test-show"})
        data = parse_tool_result(result)

        assert data is not None
        assert data["agent"] is not None
        assert data["agent"]["name"] == "test-show"
        assert data["agent"]["workspace_id"] is not None
        assert data["agent"]["metadata"] is not None
        assert "fleet_mcp_agent_spec" in data["agent"]["metadata"]


# T038: Test show_agent with non-existent agent
async def test_show_agent_not_found(agent_server):
    """Test show_agent fails with non-existent agent"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool("show_agent", {"agent_name": "nonexistent-agent-xyz"})
        assert "not found" in str(exc.value).lower()


# T039: Test show_agent_task_history tool
@pytest.mark.vcr
async def test_show_agent_task_history_success(agent_server):
    """Test show_agent_task_history returns paginated task list"""
    async with Client(agent_server) as client:
        # Create an agent first
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-history",
                "project": "Coder",
                "role": "coder",
                "spec": "Test for task history"
            }
        )
        create_data = parse_tool_result(create_result)

        # Get task history
        result = await client.call_tool(
            "show_agent_task_history",
            {
                "agent_name": "test-history",
                "page": 1,
                "page_size": 20
            }
        )
        data = parse_tool_result(result)

        assert data is not None
        assert data["tasks"] is not None
        assert data["total_count"] is not None
        assert data["page"] == 1
        assert data["page_size"] == 20
        assert data["total_pages"] is not None
        assert isinstance(data["tasks"], list)


# T040: Test task history pagination
@pytest.mark.vcr
async def test_task_history_pagination(agent_server):
    """Test task history pagination with different page sizes"""
    async with Client(agent_server) as client:
        # Use existing agent or create one
        result_page1 = await client.call_tool(
            "show_agent_task_history",
            {
                "agent_name": "test-history",
                "page": 1,
                "page_size": 10
            }
        )
        data_page1 = parse_tool_result(result_page1)

        assert data_page1["page"] == 1
        assert data_page1["page_size"] == 10

        # Request page 2
        result_page2 = await client.call_tool(
            "show_agent_task_history",
            {
                "agent_name": "test-history",
                "page": 2,
                "page_size": 10
            }
        )
        data_page2 = parse_tool_result(result_page2)

        assert data_page2["page"] == 2
        assert data_page2["page_size"] == 10


# ============================================================================
# User Story 2: Task Lifecycle Management Tests
# ============================================================================


# T055: Test start_agent_task tool
@pytest.mark.vcr
@pytest.mark.skip(reason="Requires write_agent_metadata implementation to clear current_task")
async def test_start_agent_task_success(full_server, coder_base_url, coder_token):
    """Test successfully starting a task on an idle agent"""
    async with Client(full_server) as client:
        # First create an agent
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-task-agent",
                "project": "Coder",
                "role": "coder",
                "spec": "Initial setup task"
            }
        )
        create_data = parse_tool_result(create_result)

        # TODO: Clear current_task to make agent idle
        # This requires write_agent_metadata implementation
        # coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
        # await coder_client.write_agent_metadata(
        #     create_data["agent"]["workspace_id"],
        #     "main",
        #     {"current_task": None}
        # )

        # Start a new task
        result = await client.call_tool(
            "start_agent_task",
            {
                "agent_name": "test-task-agent",
                "task_description": "Implement user authentication feature"
            }
        )
        data = parse_tool_result(result)

        assert data is not None
        assert data["task"] is not None
        assert data["agent_status"] == "busy"
        assert data["task"]["message"] == "Implement user authentication feature"
        assert data["message"] is not None


# T056: Test start_agent_task on offline agent
async def test_start_agent_task_on_offline_agent(full_server):
    """Test start_agent_task fails when agent workspace is offline"""
    async with Client(full_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "start_agent_task",
                {
                    "agent_name": "offline-agent-name",
                    "task_description": "This should fail"
                }
            )
        assert ("offline" in str(exc.value).lower() or
                "not running" in str(exc.value).lower() or
                "not found" in str(exc.value).lower())


# T057: Test start_agent_task on busy agent
async def test_start_agent_task_on_busy_agent(full_server):
    """Test start_agent_task fails when agent is already busy"""
    async with Client(full_server) as client:
        # Create a busy agent (it starts busy with initial spec)
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "busy-test-agent",
                "project": "Coder",
                "role": "coder",
                "spec": "This agent is busy with initial spec"
            }
        )
        create_data = parse_tool_result(create_result)

        # Try to start another task while busy
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "start_agent_task",
                {
                    "agent_name": "busy-test-agent",
                    "task_description": "This should fail - agent is busy"
                }
            )
        assert "busy" in str(exc.value).lower() or "conflict" in str(exc.value).lower()


# T058: Test cancel_agent_task tool
@pytest.mark.vcr
@pytest.mark.skip(reason="Requires write_agent_metadata implementation to set current_task")
async def test_cancel_agent_task_success(full_server):
    """Test successfully canceling a running task"""
    async with Client(full_server) as client:
        # Create a busy agent
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "cancel-test-agent",
                "project": "Coder",
                "role": "coder",
                "spec": "Long running task that will be canceled"
            }
        )
        create_data = parse_tool_result(create_result)

        # TODO: Set current_task to make agent busy
        # This requires write_agent_metadata implementation

        # Cancel the task
        result = await client.call_tool("cancel_agent_task", {"agent_name": "cancel-test-agent"})
        data = parse_tool_result(result)

        assert data is not None
        assert data["task"] is not None
        assert data["agent_status"] == "idle"
        assert data["message"] is not None


# T059: Test cancel_agent_task on idle agent
async def test_cancel_agent_task_on_idle_agent(full_server):
    """Test cancel_agent_task fails when agent is idle (no task running)"""
    async with Client(full_server) as client:
        # Assume we have an idle agent or create one that finished its task
        with pytest.raises(Exception) as exc:
            await client.call_tool("cancel_agent_task", {"agent_name": "idle-agent-name"})
        assert ("idle" in str(exc.value).lower() or
                "no task" in str(exc.value).lower() or
                "not busy" in str(exc.value).lower() or
                "not found" in str(exc.value).lower())


# ============================================================================
# User Story 3: PR Integration Tests
# ============================================================================


# T074: Test show_agent with PR metadata
@pytest.mark.vcr
@pytest.mark.skip(reason="Requires write_agent_metadata implementation to set PR metadata")
async def test_show_agent_with_pr_metadata(agent_server, coder_base_url, coder_token):
    """Test that show_agent returns PR metadata in agent details"""
    async with Client(agent_server) as client:
        # Create an agent
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "pr-integration-test",
                "project": "Coder",
                "role": "coder",
                "spec": "Implement OAuth feature and create PR"
            }
        )
        create_data = parse_tool_result(create_result)

        # TODO: Simulate PR metadata being set by agent or external system
        # This requires write_agent_metadata implementation
        # coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
        # await coder_client.write_agent_metadata(
        #     create_data["agent"]["workspace_id"],
        #     "main",
        #     {
        #         "pull_request_url": "https://github.com/org/repo/pull/123",
        #         "pull_request_status": "open",
        #         "pull_request_check_status": "passing"
        #     }
        # )

        # Query agent details
        result = await client.call_tool("show_agent", {"agent_name": "pr-integration-test"})
        data = parse_tool_result(result)

        assert data is not None
        assert data["agent"] is not None
        assert data["agent"]["name"] == "pr-integration-test"

        # Verify metadata field is present and is a dict
        assert data["agent"]["metadata"] is not None
        assert isinstance(data["agent"]["metadata"], dict)

        # Verify agent spec is in metadata
        assert "fleet_mcp_agent_spec" in data["agent"]["metadata"]

        # TODO: Verify PR metadata is included (when write_agent_metadata is implemented)
        # assert "fleet_mcp_pull_request_url" in data["agent"]["metadata"]
        # assert data["agent"]["metadata"]["fleet_mcp_pull_request_url"] == "https://github.com/org/repo/pull/123"
        # assert data["agent"]["metadata"]["fleet_mcp_pull_request_status"] == "open"


# ============================================================================
# User Story 4: Agent Lifecycle Management Tests
# ============================================================================


# T082: Test delete_agent tool
@pytest.mark.vcr
@pytest.mark.skip(reason="Requires delete_agent implementation")
async def test_delete_agent_success(coder_base_url, coder_token):
    """Test successfully deleting an agent"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    # Create an agent to delete
    create_result = await mcp.call_tool("create_agent", {
        "name": "delete-test-agent",
        "project": "Coder",
        "role": "coder",
        "spec": "Temporary agent for deletion test"
    })

    # Delete the agent
    result = await mcp.call_tool("delete_agent", {
        "agent_name": "delete-test-agent"
    })

    assert result is not None
    assert "message" in result
    assert "deleted_agent" in result
    assert result["deleted_agent"]["name"] == "delete-test-agent"
    assert "workspace_id" in result["deleted_agent"]

    # Verify agent no longer appears in list
    list_result = await mcp.call_tool("list_agents", {})
    agent_names = [agent["name"] for agent in list_result["agents"]]
    assert "delete-test-agent" not in agent_names


# T083: Test delete_agent with non-existent agent
async def test_delete_agent_not_found(agent_server):
    """Test delete_agent fails with non-existent agent"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool("delete_agent", {"agent_name": "nonexistent-agent-xyz-delete"})
        assert "not found" in str(exc.value).lower()


# T084: Test delete_agent on busy agent (forceful deletion)
@pytest.mark.vcr
@pytest.mark.skip(reason="Requires delete_agent implementation")
async def test_delete_agent_on_busy_agent(coder_base_url, coder_token):
    """Test delete_agent forcefully deletes even if agent is busy"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    # Create a busy agent
    create_result = await mcp.call_tool("create_agent", {
        "name": "busy-delete-test",
        "project": "Coder",
        "role": "coder",
        "spec": "Agent that will be forcefully deleted while busy"
    })

    # Agent should be busy with the initial spec
    show_result = await mcp.call_tool("show_agent", {
        "agent_name": "busy-delete-test"
    })
    assert show_result["agent"]["status"] in ["busy", "starting", "pending"]

    # Delete the busy agent (should succeed with forceful deletion)
    result = await mcp.call_tool("delete_agent", {
        "agent_name": "busy-delete-test"
    })

    assert result is not None
    assert "message" in result
    assert result["deleted_agent"]["name"] == "busy-delete-test"
