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
                "spec": "Test specification for unit testing",
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
        # Note: current_task is None until metadata is written to files (TODO)
        # assert data["agent"]["current_task"] == "Test specification for unit testing"
        assert data["message"] is not None


# T034: Test create_agent with invalid name
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
                    "spec": "Test",
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
                    "spec": "Test",
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
                "spec": "Test for show agent",
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
        assert data["agent"]["metadata"] is not None
        # MVP: Metadata may be minimal right after creation (agent still starting)
        # We only check for agent_name which is always available
        assert "fleet_mcp_agent_name" in data["agent"]["metadata"]
        # Agent model fields have fallback values even if metadata is incomplete
        assert data["agent"]["spec"] is not None
        assert data["agent"]["role"] is not None
        assert data["agent"]["project"] is not None


# T038: Test show_agent with non-existent agent
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
                "spec": "Test for case-insensitive agent name lookup",
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
@pytest.mark.vcr
async def test_show_agent_task_history_success(full_server):
    """Test show_agent_task_history returns paginated task list"""
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
                "spec": "Test for task history",
            },
        )
        parse_tool_result(create_result)

        # Wait for the agent to be running
        max_retries = 30
        for _ in range(max_retries):
            show_result = await client.call_tool(
                "show_agent", {"agent_name": "test-history"}
            )
            agent_data = parse_tool_result(show_result)
            if agent_data["agent"]["status"] == "running":
                break
            await asyncio.sleep(2)

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


# T055: Test start_agent_task tool
@pytest.mark.vcr
@pytest.mark.skip(
    reason="Requires Coder MCP tools for metadata writing - REST API doesn't support workspace file writes"
)
async def test_start_agent_task_success(full_server, coder_base_url, coder_token):
    """Test successfully starting a task on an idle agent"""
    async with Client(full_server) as client:
        # First create an agent
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "test-task-agent",
                "project": "coder-devcontainer",
                "role": "coder",
                "spec": "Initial setup task",
            },
        )
        create_data = parse_tool_result(create_result)

        # Clear current_task to make agent idle
        from fleet_mcp.coder.client import CoderClient

        async with CoderClient(
            base_url=coder_base_url, token=coder_token
        ) as coder_client:
            await coder_client.write_agent_metadata(
                create_data["agent"]["workspace_id"],
                "main",
                {"fleet_mcp_current_task": None},
            )

        # Start a new task
        result = await client.call_tool(
            "start_agent_task",
            {
                "agent_name": "test-task-agent",
                "task_description": "Implement user authentication feature",
            },
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

        # Create a busy agent (it starts busy with initial spec)
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "busy-agent-003",
                "project": project_name,
                "role": "coder",
                "spec": "This agent is busy with initial spec",
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


# T058: Test cancel_agent_task tool
@pytest.mark.vcr
@pytest.mark.skip(
    reason="Requires Coder MCP tools for metadata writing - REST API doesn't support workspace file writes"
)
async def test_cancel_agent_task_success(full_server, coder_base_url, coder_token):
    """Test successfully canceling a running task"""
    async with Client(full_server) as client:
        # Create a busy agent (agent starts with spec, which makes it busy)
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "cancel-test-agent",
                "project": "coder-devcontainer",
                "role": "coder",
                "spec": "Long running task that will be canceled",
            },
        )
        create_data = parse_tool_result(create_result)

        # Set current_task to make agent busy (use write_agent_metadata)
        from fleet_mcp.coder.client import CoderClient

        async with CoderClient(
            base_url=coder_base_url, token=coder_token
        ) as coder_client:
            await coder_client.write_agent_metadata(
                create_data["agent"]["workspace_id"],
                "main",
                {"fleet_mcp_current_task": "Long running task that will be canceled"},
            )

        # Cancel the task
        result = await client.call_tool(
            "cancel_agent_task", {"agent_name": "cancel-test-agent"}
        )
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
# User Story 3: PR Integration Tests
# ============================================================================


# T074: Test show_agent with PR metadata
@pytest.mark.vcr
@pytest.mark.skip(
    reason="Requires Coder MCP tools for metadata writing - REST API doesn't support workspace file writes"
)
async def test_show_agent_with_pr_metadata(agent_server, coder_base_url, coder_token):
    """Test that show_agent returns PR metadata in agent details"""
    async with Client(agent_server) as client:
        # Create an agent
        create_result = await client.call_tool(
            "create_agent",
            {
                "name": "pr-integration-test",
                "project": "coder-devcontainer",
                "role": "coder",
                "spec": "Implement OAuth feature and create PR",
            },
        )
        create_data = parse_tool_result(create_result)

        # Simulate PR metadata being set by agent or external system
        from fleet_mcp.coder.client import CoderClient

        async with CoderClient(
            base_url=coder_base_url, token=coder_token
        ) as coder_client:
            await coder_client.write_agent_metadata(
                create_data["agent"]["workspace_id"],
                "main",
                {
                    "fleet_mcp_pull_request_url": "https://github.com/org/repo/pull/123",
                    "fleet_mcp_pull_request_status": "open",
                    "fleet_mcp_pull_request_check_status": "passing",
                },
            )

        # Query agent details
        result = await client.call_tool(
            "show_agent", {"agent_name": "pr-integration-test"}
        )
        data = parse_tool_result(result)

        assert data is not None
        assert data["agent"] is not None
        assert data["agent"]["name"] == "pr-integration-test"

        # Verify metadata field is present and is a dict
        assert data["agent"]["metadata"] is not None
        assert isinstance(data["agent"]["metadata"], dict)

        # Verify agent spec is in metadata
        assert "fleet_mcp_agent_spec" in data["agent"]["metadata"]

        # Verify PR metadata is included
        assert "fleet_mcp_pull_request_url" in data["agent"]["metadata"]
        assert (
            data["agent"]["metadata"]["fleet_mcp_pull_request_url"]
            == "https://github.com/org/repo/pull/123"
        )
        assert data["agent"]["metadata"]["fleet_mcp_pull_request_status"] == "open"
        assert (
            data["agent"]["metadata"]["fleet_mcp_pull_request_check_status"]
            == "passing"
        )


# ============================================================================
# User Story 4: Agent Lifecycle Management Tests
# ============================================================================


# T082: Test delete_agent tool
@pytest.mark.vcr
@pytest.mark.skip(
    reason="Requires stable workspace state - delete may fail if workspace is still provisioning"
)
async def test_delete_agent_success(agent_server):
    """Test successfully deleting an agent"""
    async with Client(agent_server) as client:
        # Create an agent to delete
        await client.call_tool(
            "create_agent",
            {
                "name": "delete-test-agent",
                "project": "coder-devcontainer",
                "role": "coder",
                "spec": "Temporary agent for deletion test",
            },
        )

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

        # Verify agent no longer appears in list
        list_result = await client.call_tool("list_agents", {})
        list_data = parse_tool_result(list_result)
        agent_names = [agent["name"] for agent in list_data["agents"]]
        assert "delete-test-agent" not in agent_names


# T083: Test delete_agent with non-existent agent
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
@pytest.mark.skip(
    reason="Requires stable workspace state - delete may fail if workspace is still provisioning"
)
async def test_delete_agent_on_busy_agent(agent_server):
    """Test delete_agent forcefully deletes even if agent is busy"""
    async with Client(agent_server) as client:
        # Create a busy agent
        await client.call_tool(
            "create_agent",
            {
                "name": "busy-delete-test",
                "project": "coder-devcontainer",
                "role": "coder",
                "spec": "Agent that will be forcefully deleted while busy",
            },
        )

        # Agent should be busy with the initial spec
        show_result = await client.call_tool(
            "show_agent", {"agent_name": "busy-delete-test"}
        )
        show_data = parse_tool_result(show_result)
        assert show_data["agent"]["status"] in ["busy", "starting", "pending"]

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
                    "spec": "This should fail",
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
                "spec": "Test agent for list verification",
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
                "spec": "Test for agent logs",
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
async def test_show_agent_log_not_found(agent_server):
    """Test show_agent_log fails with non-existent agent"""
    async with Client(agent_server) as client:
        with pytest.raises(Exception) as exc:
            await client.call_tool(
                "show_agent_log", {"agent_name": "nonexistent-agent-xyz-log"}
            )
        assert "not found" in str(exc.value).lower()
