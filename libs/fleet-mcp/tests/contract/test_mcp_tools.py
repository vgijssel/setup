"""Contract tests for MCP tools - User Story 1"""

import json

import pytest
from fastmcp import Client, FastMCP
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.tools.agent_management import register_agent_tools
from fleet_mcp.tools.task_management import register_task_tools


def parse_tool_result(result):
    """Helper to parse JSON result from MCP tool call"""
    assert len(result.content) > 0, "Tool result has no content"
    content = result.content[0]
    assert hasattr(content, "text"), "Content has no text attribute"
    return json.loads(content.text)


# Fixture for testing agent management tools
@pytest.fixture
def agent_server(coder_base_url, coder_token):
    """Create FastMCP server with agent and discovery tools for testing"""
    from fleet_mcp.tools.discovery import register_discovery_tools

    mcp = FastMCP("Agent Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)
    return mcp


# Fixture for testing all tools (agent + task management)
@pytest.fixture
def full_server(coder_base_url, coder_token):
    """Create FastMCP server with all tools for testing"""
    from fleet_mcp.tools.discovery import register_discovery_tools

    mcp = FastMCP("Full Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)
    return mcp


# T033: Test create_agent tool success case
@pytest.mark.vcr
async def test_create_agent_success(agent_server):
    """Test successful agent creation with vcr cassette"""
    async with Client(agent_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        result = await client.call_tool(
            "create_agent",
            {
                "name": "test-papi",
                "project": project_name,
                "role": "coder",
                "task": "Test specification for unit testing",
            },
        )

        data = parse_tool_result(result)

        assert data is not None
        assert data["agent"]["name"] == "test-papi"
        assert data["agent"]["status"] in [
            "busy",
            "starting",
            "pending",
            "idle",
        ]  # Agent starts
        assert data["agent"]["role"] == "coder"
        # Note: last_task shows the most recent task message from task API
        # assert data["agent"]["last_task"] == "Test specification for unit testing"
        assert data["message"] is not None


# T034: Test create_agent with invalid name
@pytest.mark.vcr
async def test_create_agent_invalid_name(agent_server):
    """Test create_agent fails with invalid agent name"""
    async with Client(agent_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "create_agent",
                {
                    "name": "invalid@name",  # Invalid characters
                    "project": project_name,
                    "role": "coder",
                    "task": "Test",
                },
            )
        error_msg = str(exc.value).lower()
        assert (
            "validation" in error_msg
            or "invalid" in error_msg
            or "bad request" in error_msg
            or "400" in error_msg
        )


# T035: Test create_agent with invalid project
@pytest.mark.vcr
async def test_create_agent_invalid_project(agent_server):
    """Test create_agent fails with non-existent or invalid fleet-mcp project"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-agent",
                    "project": "NonExistentProject",
                    "role": "coder",
                    "task": "Test",
                },
            )
        error_msg = str(exc.value).lower()
        assert (
            "not found" in error_msg
            or "template" in error_msg
            or "not a valid fleet-mcp project" in error_msg
            or "invalid" in error_msg
        )


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
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # First create an agent to show
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-show",
                "project": project_name,
                "role": "coder",
                "task": "Test for show agent",
            },
        )
        parse_tool_result(create_result)

        # Now show the agent
        result = await client.call_tool("show_agent", {"agent_name": "test-show"})
        data = parse_tool_result(result)

        assert data is not None
        assert data["agent"] is not None
        assert data["agent"]["name"] == "test-show"
        assert data["agent"]["workspace_id"] is not None
        # Agent model fields have fallback values
        assert data["agent"]["role"] is not None
        assert data["agent"]["project"] is not None


# T038: Test show_agent with non-existent agent
@pytest.mark.vcr
async def test_show_agent_not_found(agent_server):
    """Test show_agent fails with non-existent agent"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "show_agent", {"agent_name": "nonexistent-agent-xyz"}
            )
        assert "not found" in str(exc.value).lower()


# Test case-insensitive agent name lookup
@pytest.mark.vcr
async def test_show_agent_case_insensitive(agent_server):
    """Test show_agent works with different case variations of agent name"""
    async with Client(agent_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create an agent with lowercase name
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-case",
                "project": project_name,
                "role": "coder",
                "task": "Test for case-insensitive agent name lookup",
            },
        )
        parse_tool_result(create_result)

        # Test with exact case
        result = await client.call_tool("show_agent", {"agent_name": "test-case"})
        data = parse_tool_result(result)
        assert data["agent"]["name"] == "test-case"

        # Test with uppercase
        result = await client.call_tool("show_agent", {"agent_name": "TEST-CASE"})
        data = parse_tool_result(result)
        assert data["agent"]["name"] == "test-case"

        # Test with mixed case
        result = await client.call_tool("show_agent", {"agent_name": "Test-Case"})
        data = parse_tool_result(result)
        assert data["agent"]["name"] == "test-case"


# T039: Test show_agent_task_history tool
@pytest.mark.skip(reason="requires VCR strategy refactor")
@pytest.mark.vcr
async def test_show_agent_task_history_success(full_server, vcr_cassette):
    """Test show_agent_task_history returns paginated task list"""
    is_recording = not vcr_cassette.rewound

    import asyncio

    async with Client(full_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create an agent first
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-history",
                "project": project_name,
                "role": "coder",
                "task": "",
            },
        )
        parse_tool_result(create_result)

        # Wait for the agent to be idle (workspace running + agents healthy + no task)
        max_retries = 60
        for _ in range(max_retries):
            show_result = await client.call_tool(
                "show_agent", {"agent_name": "test-history"}
            )
            agent_data = parse_tool_result(show_result)
            if agent_data["agent"]["status"] == "idle":
                break

            if is_recording:
                await asyncio.sleep(2)

        # Wait additional time for task API to become healthy
        # The agent can be idle (connected+ready) but the task sidebar app may still be initializing
        if is_recording:
            await asyncio.sleep(10)

        # Start a task on the agent to generate task history
        start_task_result = await client.call_tool(
            "start_agent_task",
            {
                "agent_name": "test-history",
                "task_description": "Generate some task history for testing",
            },
        )
        parse_tool_result(start_task_result)

        # Wait a bit for the task to be recorded
        if is_recording:
            await asyncio.sleep(5)

        # Get task history
        result = await client.call_tool(
            "show_agent_task_history",
            {"agent_name": "test-history", "page": 1, "page_size": 20},
        )
        data = parse_tool_result(result)

        assert data is not None
        assert data["tasks"] is not None
        assert data["total_count"] is not None
        assert data["page"] == 1
        assert data["page_size"] == 20
        assert data["total_pages"] is not None
        assert isinstance(data["tasks"], list)
        # After starting a task, we should have at least one status entry
        assert data["total_count"] > 0, "Expected at least one task history entry"


# T040: Test task history pagination
@pytest.mark.vcr
async def test_task_history_pagination(agent_server):
    """Test task history pagination with different page sizes"""
    async with Client(agent_server) as client:
        # Use existing agent or create one
        result_page1 = await client.call_tool(
            "show_agent_task_history",
            {"agent_name": "test-history", "page": 1, "page_size": 10},
        )
        data_page1 = parse_tool_result(result_page1)

        assert data_page1["page"] == 1
        assert data_page1["page_size"] == 10

        # Request page 2
        result_page2 = await client.call_tool(
            "show_agent_task_history",
            {"agent_name": "test-history", "page": 2, "page_size": 10},
        )
        data_page2 = parse_tool_result(result_page2)

        assert data_page2["page"] == 2
        assert data_page2["page_size"] == 10


# ============================================================================
# User Story 2: Task Lifecycle Management Tests
# ============================================================================


# T056: Test start_agent_task on offline agent
@pytest.mark.vcr
async def test_start_agent_task_on_offline_agent(full_server):
    """Test start_agent_task fails when agent workspace is offline"""
    async with Client(full_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "start_agent_task",
                {
                    "agent_name": "offline-agent-name",
                    "task_description": "This should fail",
                },
            )
        assert (
            "offline" in str(exc.value).lower()
            or "not running" in str(exc.value).lower()
            or "not found" in str(exc.value).lower()
        )


# T057: Test start_agent_task on busy agent
@pytest.mark.vcr
async def test_start_agent_task_on_busy_agent(full_server):
    """Test start_agent_task fails when agent is already busy"""
    async with Client(full_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create a busy agent (it starts busy with initial task)
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "busy-agent-003",
                "project": project_name,
                "role": "coder",
                "task": "This agent is busy with initial task",
            },
        )
        parse_tool_result(create_result)

        # Try to start another task while busy
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "start_agent_task",
                {
                    "agent_name": "busy-agent-003",
                    "task_description": "This should fail - agent is busy",
                },
            )
        assert "busy" in str(exc.value).lower() or "conflict" in str(exc.value).lower()


# T059: Test cancel_agent_task on idle agent
@pytest.mark.vcr
async def test_cancel_agent_task_on_idle_agent(full_server):
    """Test cancel_agent_task fails when agent is idle (no task running)"""
    async with Client(full_server) as client:
        # Assume we have an idle agent or create one that finished its task
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "cancel_agent_task", {"agent_name": "idle-agent-name"}
            )
        assert (
            "idle" in str(exc.value).lower()
            or "no task" in str(exc.value).lower()
            or "not busy" in str(exc.value).lower()
            or "not found" in str(exc.value).lower()
        )


# ============================================================================
# User Story 4: Agent Lifecycle Management Tests
# ============================================================================


# T082: Test delete_agent tool
@pytest.mark.vcr
async def test_delete_agent_success(agent_server, vcr_cassette):
    """Test successfully deleting an agent"""
    is_recording = not vcr_cassette.rewound

    import asyncio

    async with Client(agent_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create an agent to delete
        await client.call_tool(
            "create_agent",
            {
                "name": "delete-test-agent",
                "project": project_name,
                "role": "coder",
                "task": "Temporary agent for deletion test",
            },
        )

        # Wait for workspace to reach a stable state (running, stopped, or failed)
        # This is necessary because delete will fail if workspace is still provisioning
        max_retries = 150
        for _ in range(max_retries):
            show_result = await client.call_tool(
                "show_agent", {"agent_name": "delete-test-agent"}
            )
            agent_data = parse_tool_result(show_result)
            status = agent_data["agent"]["status"]

            # Wait for a stable state (not pending/starting)
            if status not in ["pending", "starting"]:
                break

            if is_recording:
                await asyncio.sleep(2)

        # Delete the agent
        result = await client.call_tool(
            "delete_agent", {"agent_name": "delete-test-agent"}
        )
        data = parse_tool_result(result)

        assert data is not None
        assert "message" in data
        assert "deleted_agent" in data
        assert data["deleted_agent"]["name"] == "delete-test-agent"
        assert "workspace_id" in data["deleted_agent"]

        # Verify agent is in deleting or deleted state
        # Deletion is asynchronous, so agent may still appear in list but with deleting status
        show_result = await client.call_tool(
            "show_agent", {"agent_name": "delete-test-agent"}
        )
        show_data = parse_tool_result(show_result)
        assert show_data["agent"]["status"] in ["deleting", "deleted"]


# T083: Test delete_agent with non-existent agent
@pytest.mark.vcr
async def test_delete_agent_not_found(agent_server):
    """Test delete_agent fails with non-existent agent"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "delete_agent", {"agent_name": "nonexistent-agent-xyz-delete"}
            )
        assert "not found" in str(exc.value).lower()


# T084: Test delete_agent on busy agent (forceful deletion)
@pytest.mark.vcr
async def test_delete_agent_on_busy_agent(agent_server, vcr_cassette):
    """Test delete_agent forcefully deletes even if agent is busy"""
    is_recording = not vcr_cassette.rewound

    import asyncio

    async with Client(agent_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create a busy agent
        await client.call_tool(
            "create_agent",
            {
                "name": "busy-delete-test",
                "project": project_name,
                "role": "coder",
                "task": "Agent that will be forcefully deleted while busy",
            },
        )

        # Wait for workspace to reach running state (so it's actually busy, not just starting)
        max_retries = 150
        for _ in range(max_retries):
            show_result = await client.call_tool(
                "show_agent", {"agent_name": "busy-delete-test"}
            )
            show_data = parse_tool_result(show_result)
            status = show_data["agent"]["status"]

            # Wait until it's actually running/busy (not pending/starting)
            if status not in ["pending", "starting"]:
                break

            if is_recording:
                await asyncio.sleep(2)

        # Agent should be busy with the initial task
        show_result = await client.call_tool(
            "show_agent", {"agent_name": "busy-delete-test"}
        )
        show_data = parse_tool_result(show_result)
        assert show_data["agent"]["status"] in ["busy", "idle", "failed"]

        # Delete the busy agent (should succeed with forceful deletion)
        result = await client.call_tool(
            "delete_agent", {"agent_name": "busy-delete-test"}
        )
        data = parse_tool_result(result)

        assert data is not None
        assert "message" in data
        assert data["deleted_agent"]["name"] == "busy-delete-test"


# ============================================================================
# User Story 5: Role and Project Discovery Tests
# ============================================================================


# T092: Test list_agent_projects tool
@pytest.mark.vcr
async def test_list_agent_projects_success(agent_server):
    """Test list_agent_projects returns valid fleet-mcp projects"""
    async with Client(agent_server) as client:
        result = await client.call_tool("list_agent_projects", {})
        data = parse_tool_result(result)

        assert data is not None
        assert "projects" in data
        assert isinstance(data["projects"], list)

        # All projects should be valid fleet-mcp projects
        for project in data["projects"]:
            assert "name" in project
            assert "display_name" in project
            assert "description" in project
            assert "template_id" in project
            assert "template_name" in project
            # Verify all required fields are non-empty
            assert project["name"]
            assert project["display_name"]


# T090: Test list_agent_roles tool
@pytest.mark.vcr
async def test_list_agent_roles_success(agent_server):
    """Test list_agent_roles returns roles for a valid project"""
    async with Client(agent_server) as client:
        # First get a valid project
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)

        assert len(projects_data["projects"]) > 0, "No valid fleet-mcp projects found"
        project_name = projects_data["projects"][0]["name"]

        # Now list roles for that project
        result = await client.call_tool("list_agent_roles", {"project": project_name})
        data = parse_tool_result(result)

        assert data is not None
        assert "roles" in data
        assert isinstance(data["roles"], list)
        assert len(data["roles"]) > 0, "Project should have at least one role"

        # Verify role structure
        for role in data["roles"]:
            assert "name" in role
            assert "display_name" in role
            assert "description" in role
            assert role["name"]
            assert role["display_name"]


# T091: Test list_agent_roles with invalid project
@pytest.mark.vcr
async def test_list_agent_roles_invalid_project(agent_server):
    """Test list_agent_roles fails with non-existent or invalid project"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "list_agent_roles", {"project": "NonExistentProject"}
            )
        assert (
            "not found" in str(exc.value).lower() or "invalid" in str(exc.value).lower()
        )


# Additional test: Verify create_agent validates project against valid fleet-mcp projects
@pytest.mark.vcr
async def test_create_agent_validates_fleet_mcp_project(agent_server):
    """Test create_agent validates that project is a valid fleet-mcp project"""
    async with Client(agent_server) as client:
        # Try to create agent with a template that exists but is NOT a fleet-mcp project
        # (doesn't have ai_prompt and system_prompt parameters)
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-invalid-project",
                    "project": "InvalidProject",
                    "role": "coder",
                    "task": "This should fail",
                },
            )
        error_msg = str(exc.value).lower()
        assert (
            "not found" in error_msg
            or "invalid" in error_msg
            or "not a valid fleet-mcp project" in error_msg
        )


# Additional test: Verify list_agents returns at least one agent
@pytest.mark.vcr
async def test_list_agents_returns_agents(agent_server):
    """Test list_agents returns at least one agent for valid fleet-mcp projects"""
    async with Client(agent_server) as client:
        # First get a valid project name
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        assert len(projects_data["projects"]) > 0, "No valid fleet-mcp projects found"
        project_name = projects_data["projects"][0]["name"]

        # Create an agent using the valid project name
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-list-verify",
                "project": project_name,
                "role": "coder",
                "task": "Test agent for list verification",
            },
        )
        create_data = parse_tool_result(create_result)
        assert create_data["agent"]["name"] == "test-list-verify"

        # Now list agents - should return at least the one we just created
        result = await client.call_tool("list_agents", {})
        data = parse_tool_result(result)

        assert data is not None
        assert "agents" in data
        assert "total_count" in data
        assert isinstance(data["agents"], list)
        assert len(data["agents"]) > 0, "list_agents should return at least one agent"
        assert data["total_count"] > 0

        # Verify the agent we created is in the list
        agent_names = [agent["name"] for agent in data["agents"]]
        assert "test-list-verify" in agent_names


# T052: Test show_agent_log tool
@pytest.mark.vcr
async def test_show_agent_log_success(agent_server):
    """Test show_agent_log returns paginated conversation logs"""
    async with Client(agent_server) as client:
        # Use an existing agent with log history (test-history was created earlier)
        # Or create a new one if needed
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create an agent first
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-log",
                "project": project_name,
                "role": "coder",
                "task": "Test for agent logs",
            },
        )
        parse_tool_result(create_result)

        # Get agent logs (default page=1, page_size=1 should return latest log)
        result = await client.call_tool(
            "show_agent_log",
            {"agent_name": "test-log", "page": 1, "page_size": 1},
        )
        data = parse_tool_result(result)

        assert data is not None
        assert data["logs"] is not None
        assert data["total_count"] is not None
        assert data["page"] == 1
        assert data["page_size"] == 1
        assert data["total_pages"] is not None
        assert isinstance(data["logs"], list)

        # If logs exist, verify their structure
        if len(data["logs"]) > 0:
            log_entry = data["logs"][0]
            assert "id" in log_entry
            assert "time" in log_entry
            assert "type" in log_entry
            assert log_entry["type"] in ["input", "output"]
            assert "content" in log_entry


# T053: Test show_agent_log pagination
@pytest.mark.vcr
async def test_show_agent_log_pagination(agent_server):
    """Test agent log pagination with different page sizes"""
    async with Client(agent_server) as client:
        # Use existing agent with logs
        result_page1 = await client.call_tool(
            "show_agent_log",
            {"agent_name": "test-log", "page": 1, "page_size": 5},
        )
        data_page1 = parse_tool_result(result_page1)

        assert data_page1["page"] == 1
        assert data_page1["page_size"] == 5

        # Request page 2
        result_page2 = await client.call_tool(
            "show_agent_log",
            {"agent_name": "test-log", "page": 2, "page_size": 5},
        )
        data_page2 = parse_tool_result(result_page2)

        assert data_page2["page"] == 2
        assert data_page2["page_size"] == 5


# T054: Test show_agent_log with non-existent agent
@pytest.mark.vcr
async def test_show_agent_log_not_found(agent_server):
    """Test show_agent_log fails with non-existent agent"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "show_agent_log", {"agent_name": "nonexistent-agent-xyz-log"}
            )
        assert "not found" in str(exc.value).lower()


# ============================================================================
# Regression Tests
# ============================================================================


# Regression test for workspace preset None bug
@pytest.mark.vcr
async def test_create_agent_with_invalid_preset_error_message(agent_server):
    """Regression test: verify error message when preset doesn't exist doesn't crash

    This test validates that when a workspace preset is not found, the error
    message properly filters out None values from preset names when listing
    available presets. Previously, this would crash with:
    "sequence item 0: expected str instance, NoneType found"
    """
    async with Client(agent_server) as client:
        # Get a valid project name first
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Try to create agent with a preset that doesn't exist
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-invalid-preset",
                    "project": project_name,
                    "role": "researcher",  # Assuming this preset doesn't exist
                    "task": "Test with non-existent preset",
                },
            )
        error_msg = str(exc.value)

        # Verify the error message mentions preset not found
        assert "preset" in error_msg.lower() or "not found" in error_msg.lower()

        # Verify the error message lists available presets
        # (This would crash before the fix if any preset name was None)
        assert "available" in error_msg.lower() or "coder" in error_msg.lower()
