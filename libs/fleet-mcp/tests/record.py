#!/usr/bin/env python3
"""VCR Cassette Recording Script

This script records HTTP interactions with the Coder API for use in tests.
It is separate from the test suite to decouple recording from test execution.

Usage:
    # Set environment variables first
    export CODER_URL=https://your-coder.com
    export CODER_SESSION_TOKEN=your-token

    # Run the recording script
    python tests/record.py

The script will:
1. Clean up any existing test workspaces
2. Record all necessary HTTP interactions
3. Save cassettes to tests/cassettes/
4. Filter sensitive data (tokens, hostnames, etc.)
5. Clean up created resources
"""

import asyncio
import os
import re
from pathlib import Path
from urllib.parse import urlparse

import vcr
from dotenv import load_dotenv
from fleet_mcp.coder.client import CoderClient

# Load environment variables
env_file = Path(__file__).parent.parent / ".env"
load_dotenv(env_file)

# Configuration
CODER_URL = os.getenv("CODER_URL")
CODER_SESSION_TOKEN = os.getenv("CODER_SESSION_TOKEN")
CASSETTE_DIR = Path(__file__).parent / "cassettes"


def get_secrets_to_redact():
    """Get all secrets that should be redacted from recordings"""
    secrets = {
        "GH_TOKEN": os.getenv("GH_TOKEN", ""),
        "HA_TOKEN": os.getenv("HA_TOKEN", ""),
        "NX_KEY": os.getenv("NX_KEY", ""),
        "OP_SERVICE_ACCOUNT_TOKEN": os.getenv("OP_SERVICE_ACCOUNT_TOKEN", ""),
        "CLAUDE_CODE_OAUTH_TOKEN": os.getenv("CLAUDE_CODE_OAUTH_TOKEN", ""),
        "CODER_SESSION_TOKEN": os.getenv("CODER_SESSION_TOKEN", ""),
        "CODER_AGENT_TOKEN": os.getenv("CODER_AGENT_TOKEN", ""),
    }

    # Extract hostname from CODER_URL
    if CODER_URL:
        parsed = urlparse(CODER_URL)
        if parsed.hostname:
            secrets["CODER_HOSTNAME"] = parsed.hostname

    return secrets


def redact_response(response):
    """Redact sensitive data from VCR response"""
    secrets = get_secrets_to_redact()

    if "body" in response and "string" in response["body"]:
        body = response["body"]["string"]

        # Convert bytes to string if needed
        if isinstance(body, bytes):
            body = body.decode("utf-8")

        # Redact each secret by value
        for secret_name, secret_value in secrets.items():
            if secret_value and secret_value in body:
                body = body.replace(secret_value, f"***{secret_name}_REDACTED***")

        # Redact CODER_SESSION_TOKEN patterns
        body = re.sub(
            r'"CODER_SESSION_TOKEN":"[^"]*"',
            '"CODER_SESSION_TOKEN":"***CODER_SESSION_TOKEN_REDACTED***"',
            body,
        )

        # Redact CODER_AGENT_TOKEN patterns
        body = re.sub(
            r'"CODER_AGENT_TOKEN":"[^"]*"',
            '"CODER_AGENT_TOKEN":"***CODER_AGENT_TOKEN_REDACTED***"',
            body,
        )

        # Convert back to original format
        if isinstance(response["body"]["string"], bytes):
            response["body"]["string"] = body.encode("utf-8")
        else:
            response["body"]["string"] = body

    return response


def redact_request(request):
    """Redact sensitive data from VCR request"""
    secrets = get_secrets_to_redact()
    hostname = secrets.get("CODER_HOSTNAME")

    # Redact from request body
    if hasattr(request, "body") and request.body:
        body = request.body
        if isinstance(body, bytes):
            body = body.decode("utf-8")

        for secret_name, secret_value in secrets.items():
            if secret_value and secret_value in body:
                body = body.replace(secret_value, f"***{secret_name}_REDACTED***")

        if isinstance(request.body, bytes):
            request.body = body.encode("utf-8")
        else:
            request.body = body

    # Redact hostname from URI
    if hostname and request.uri:
        request.uri = request.uri.replace(hostname, "coder.example.com")

    # Redact hostname from headers
    if hostname and hasattr(request, "headers"):
        if "host" in request.headers:
            request.headers["host"] = request.headers["host"].replace(
                hostname, "coder.example.com"
            )

    return request


def get_vcr_instance():
    """Create and configure VCR instance"""
    return vcr.VCR(
        cassette_library_dir=str(CASSETTE_DIR),
        record_mode="new_episodes",
        match_on=["method", "scheme", "host", "port", "path"],
        filter_headers=[
            "authorization",
            "cookie",
            "x-coder-session-token",
            "coder-session-token",
        ],
        filter_query_parameters=["api_key"],
        before_record_response=redact_response,
        before_record_request=redact_request,
        decode_compressed_response=True,
        serializer="yaml",
    )


async def cleanup_test_workspaces(client: CoderClient):
    """Clean up any existing test workspaces before recording"""
    print("🧹 Cleaning up existing test workspaces...")
    workspaces = await client.list_workspaces()

    # Test workspace name patterns
    test_patterns = [
        "test-",
        "delete-test",
        "busy-agent",
        "offline-agent",
        "idle-agent",
    ]

    for workspace in workspaces:
        name = workspace.get("name", "")
        if any(pattern in name for pattern in test_patterns):
            print(f"  Deleting workspace: {name}")
            try:
                await client.delete_workspace(workspace["id"])
            except Exception as e:
                print(f"    Warning: Could not delete {name}: {e}")

    print("✅ Cleanup complete")


async def wait_for_workspace_ready(client: CoderClient, workspace_id: str, timeout=300):
    """Wait for workspace to be running"""
    print(f"  Waiting for workspace {workspace_id} to be ready...")
    for _ in range(timeout // 2):
        ws = await client.get_workspace(workspace_id)
        status = ws.get("latest_build", {}).get("status")
        if status == "running":
            print("  ✅ Workspace is running")
            return True
        elif status in ["failed", "canceled"]:
            print(f"  ❌ Workspace failed with status: {status}")
            return False
        await asyncio.sleep(2)
    print("  ⚠️  Timeout waiting for workspace")
    return False


async def record_workspace_operations(vcr_instance):
    """Record basic workspace operations"""
    print("\n📼 Recording workspace operations...")

    client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)

    # Record: list_workspaces
    print("  Recording: list_workspaces")
    with vcr_instance.use_cassette("test_list_workspaces.yaml"):
        await client.list_workspaces()

    # Record: create_workspace
    print("  Recording: create_workspace")
    with vcr_instance.use_cassette("test_create_workspace.yaml"):
        workspace = await client.create_workspace(
            name="test-ws-create-001",
            template_name="coder-devcontainer",
            workspace_preset="coder",
        )
        workspace_id = workspace.get("id")

    # Record: delete_workspace
    print("  Recording: delete_workspace")
    with vcr_instance.use_cassette("test_delete_workspace.yaml"):
        # Wait for workspace to be ready before deleting
        await wait_for_workspace_ready(client, workspace_id)
        await client.delete_workspace(workspace_id)


async def record_template_operations(vcr_instance):
    """Record template and rich parameter operations"""
    print("\n📼 Recording template operations...")

    client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)

    print("  Recording: get_template_version_rich_parameters")
    with vcr_instance.use_cassette("test_get_template_version_rich_parameters.yaml"):
        templates = await client.list_templates()
        coder_template = next(
            (t for t in templates if t.get("name") == "coder-devcontainer"), None
        )
        if coder_template:
            template_id = coder_template.get("id")
            template_details = await client.get_template(template_id)
            active_version_id = template_details.get("active_version_id")
            await client.get_template_version_rich_parameters(active_version_id)


async def record_agent_management_operations(vcr_instance):
    """Record agent management tool operations"""
    print("\n📼 Recording agent management operations...")

    # Create MCP server with tools
    from fastmcp import Client, FastMCP
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools

    mcp = FastMCP("Test Server")
    coder_client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)
    register_agent_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)

    async with Client(mcp) as client:
        # Record: list_agent_projects
        print("  Recording: list_agent_projects_success")
        with vcr_instance.use_cassette("test_list_agent_projects_success.yaml"):
            result = await client.call_tool("list_agent_projects", {})
            projects_data = result.content[0]
            import json

            projects = json.loads(projects_data.text)
            project_name = projects["projects"][0]["name"]

        # Record: list_agent_roles
        print("  Recording: list_agent_roles_success")
        with vcr_instance.use_cassette("test_list_agent_roles_success.yaml"):
            await client.call_tool("list_agent_roles", {"project": project_name})

        # Record: list_agent_roles with invalid project
        print("  Recording: list_agent_roles_invalid_project")
        with vcr_instance.use_cassette("test_list_agent_roles_invalid_project.yaml"):
            try:
                await client.call_tool(
                    "list_agent_roles", {"project": "NonExistentProject"}
                )
            except Exception:
                pass  # Expected to fail

        # Record: create_agent success
        print("  Recording: create_agent_success")
        with vcr_instance.use_cassette("test_create_agent_success.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-papi",
                    "project": project_name,
                    "role": "coder",
                    "task": "Test specification for unit testing",
                },
            )

        # Record: create_agent with invalid name
        print("  Recording: create_agent_invalid_name")
        with vcr_instance.use_cassette("test_create_agent_invalid_name.yaml"):
            try:
                await client.call_tool(
                    "create_agent",
                    {
                        "name": "invalid@name",
                        "project": project_name,
                        "role": "coder",
                        "task": "Test",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: create_agent with invalid project
        print("  Recording: create_agent_invalid_project")
        with vcr_instance.use_cassette("test_create_agent_invalid_project.yaml"):
            try:
                await client.call_tool(
                    "create_agent",
                    {
                        "name": "test-agent",
                        "project": "NonExistentProject",
                        "role": "coder",
                        "task": "Test",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: create_agent validates fleet-mcp project
        print("  Recording: create_agent_validates_fleet_mcp_project")
        with vcr_instance.use_cassette(
            "test_create_agent_validates_fleet_mcp_project.yaml"
        ):
            try:
                await client.call_tool(
                    "create_agent",
                    {
                        "name": "test-invalid-project",
                        "project": "InvalidProject",
                        "role": "coder",
                        "task": "This should fail",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: create_agent with invalid preset
        print("  Recording: create_agent_with_invalid_preset_error_message")
        with vcr_instance.use_cassette(
            "test_create_agent_with_invalid_preset_error_message.yaml"
        ):
            try:
                await client.call_tool(
                    "create_agent",
                    {
                        "name": "test-invalid-preset",
                        "project": project_name,
                        "role": "researcher",
                        "task": "Test with non-existent preset",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: list_agents
        print("  Recording: list_agents_success")
        with vcr_instance.use_cassette("test_list_agents_success.yaml"):
            await client.call_tool("list_agents", {})

        # Record: list_agents returns agents
        print("  Recording: list_agents_returns_agents")
        with vcr_instance.use_cassette("test_list_agents_returns_agents.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-list-verify",
                    "project": project_name,
                    "role": "coder",
                    "task": "Test agent for list verification",
                },
            )
            await client.call_tool("list_agents", {})

        # Record: list_agents includes PR URL field
        print("  Recording: list_agents_includes_pull_request_url_field")
        with vcr_instance.use_cassette(
            "test_list_agents_includes_pull_request_url_field.yaml"
        ):
            await client.call_tool("list_agents", {})

        # Record: show_agent success
        print("  Recording: show_agent_success")
        with vcr_instance.use_cassette("test_show_agent_success.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-show",
                    "project": project_name,
                    "role": "coder",
                    "task": "Test for show agent",
                },
            )
            await client.call_tool("show_agent", {"agent_name": "test-show"})

        # Record: show_agent not found
        print("  Recording: show_agent_not_found")
        with vcr_instance.use_cassette("test_show_agent_not_found.yaml"):
            try:
                await client.call_tool(
                    "show_agent", {"agent_name": "nonexistent-agent-xyz"}
                )
            except Exception:
                pass  # Expected to fail

        # Record: show_agent case insensitive
        print("  Recording: show_agent_case_insensitive")
        with vcr_instance.use_cassette("test_show_agent_case_insensitive.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-case",
                    "project": project_name,
                    "role": "coder",
                    "task": "Test for case-insensitive agent name lookup",
                },
            )
            await client.call_tool("show_agent", {"agent_name": "test-case"})
            await client.call_tool("show_agent", {"agent_name": "TEST-CASE"})
            await client.call_tool("show_agent", {"agent_name": "Test-Case"})

        # Record: show_agent includes PR URL field
        print("  Recording: show_agent_includes_pull_request_url_field")
        with vcr_instance.use_cassette(
            "test_show_agent_includes_pull_request_url_field.yaml"
        ):
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-pr-url",
                    "project": project_name,
                    "role": "coder",
                    "task": "Test PR URL field",
                },
            )
            await client.call_tool("show_agent", {"agent_name": "test-pr-url"})

        # Record: set_agent_pr_url validates agent exists
        print("  Recording: set_agent_pr_url_validates_agent_exists")
        with vcr_instance.use_cassette(
            "test_set_agent_pr_url_validates_agent_exists.yaml"
        ):
            try:
                await client.call_tool(
                    "set_agent_pr_url",
                    {
                        "agent_name": "nonexistent-agent-pr",
                        "pr_url": "https://github.com/org/repo/pull/123",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: delete_agent success
        print("  Recording: delete_agent_success")
        with vcr_instance.use_cassette("test_delete_agent_success.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "delete-test-agent",
                    "project": project_name,
                    "role": "coder",
                    "task": "Temporary agent for deletion test",
                },
            )
            # Wait for stable state
            for _ in range(150):
                result = await client.call_tool(
                    "show_agent", {"agent_name": "delete-test-agent"}
                )
                data = json.loads(result.content[0].text)
                if data["agent"]["status"] not in ["pending", "starting"]:
                    break
                await asyncio.sleep(2)
            await client.call_tool("delete_agent", {"agent_name": "delete-test-agent"})
            await client.call_tool("show_agent", {"agent_name": "delete-test-agent"})

        # Record: delete_agent not found
        print("  Recording: delete_agent_not_found")
        with vcr_instance.use_cassette("test_delete_agent_not_found.yaml"):
            try:
                await client.call_tool(
                    "delete_agent", {"agent_name": "nonexistent-agent-xyz-delete"}
                )
            except Exception:
                pass  # Expected to fail

        # Record: delete_agent on busy agent
        print("  Recording: delete_agent_on_busy_agent")
        with vcr_instance.use_cassette("test_delete_agent_on_busy_agent.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "busy-delete-test",
                    "project": project_name,
                    "role": "coder",
                    "task": "Agent that will be forcefully deleted while busy",
                },
            )
            # Wait for stable state
            for _ in range(150):
                result = await client.call_tool(
                    "show_agent", {"agent_name": "busy-delete-test"}
                )
                data = json.loads(result.content[0].text)
                if data["agent"]["status"] not in ["pending", "starting"]:
                    break
                await asyncio.sleep(2)
            await client.call_tool("show_agent", {"agent_name": "busy-delete-test"})
            await client.call_tool("delete_agent", {"agent_name": "busy-delete-test"})


async def record_task_management_operations(vcr_instance):
    """Record task management operations"""
    print("\n📼 Recording task management operations...")

    from fastmcp import Client, FastMCP
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools
    from fleet_mcp.tools.task_management import register_task_tools

    mcp = FastMCP("Task Test Server")
    coder_client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)
    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)

    async with Client(mcp) as client:
        import json

        # Get project name
        result = await client.call_tool("list_agent_projects", {})
        projects = json.loads(result.content[0].text)
        project_name = projects["projects"][0]["name"]

        # Record: start_agent_task on offline agent
        print("  Recording: start_agent_task_on_offline_agent")
        with vcr_instance.use_cassette("test_start_agent_task_on_offline_agent.yaml"):
            try:
                await client.call_tool(
                    "start_agent_task",
                    {
                        "agent_name": "offline-agent-name",
                        "task_description": "This should fail",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: start_agent_task on busy agent
        print("  Recording: start_agent_task_on_busy_agent")
        with vcr_instance.use_cassette("test_start_agent_task_on_busy_agent.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "busy-agent-003",
                    "project": project_name,
                    "role": "coder",
                    "task": "This agent is busy with initial task",
                },
            )
            try:
                await client.call_tool(
                    "start_agent_task",
                    {
                        "agent_name": "busy-agent-003",
                        "task_description": "This should fail - agent is busy",
                    },
                )
            except Exception:
                pass  # Expected to fail

        # Record: cancel_agent_task on idle agent
        print("  Recording: cancel_agent_task_on_idle_agent")
        with vcr_instance.use_cassette("test_cancel_agent_task_on_idle_agent.yaml"):
            try:
                await client.call_tool(
                    "cancel_agent_task", {"agent_name": "idle-agent-name"}
                )
            except Exception:
                pass  # Expected to fail

        # Record: show_agent_task_history
        print("  Recording: show_agent_task_history_success")
        with vcr_instance.use_cassette("test_show_agent_task_history_success.yaml"):
            # Reuse existing agent
            await client.call_tool(
                "show_agent_task_history",
                {"agent_name": "test-papi", "page": 1, "page_size": 20},
            )

        # Record: task_history_pagination
        print("  Recording: task_history_pagination")
        with vcr_instance.use_cassette("test_task_history_pagination.yaml"):
            await client.call_tool(
                "show_agent_task_history",
                {"agent_name": "test-papi", "page": 1, "page_size": 10},
            )
            await client.call_tool(
                "show_agent_task_history",
                {"agent_name": "test-papi", "page": 2, "page_size": 10},
            )


async def record_log_operations(vcr_instance):
    """Record agent log operations"""
    print("\n📼 Recording agent log operations...")

    from fastmcp import Client, FastMCP
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools

    mcp = FastMCP("Log Test Server")
    coder_client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)
    register_agent_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)

    async with Client(mcp) as client:
        import json

        # Get project name
        result = await client.call_tool("list_agent_projects", {})
        projects = json.loads(result.content[0].text)
        project_name = projects["projects"][0]["name"]

        # Record: show_agent_log success
        print("  Recording: show_agent_log_success")
        with vcr_instance.use_cassette("test_show_agent_log_success.yaml"):
            await client.call_tool(
                "create_agent",
                {
                    "name": "test-log",
                    "project": project_name,
                    "role": "coder",
                    "task": "Test for agent logs",
                },
            )
            await client.call_tool(
                "show_agent_log",
                {"agent_name": "test-log", "page": 1, "page_size": 1},
            )

        # Record: show_agent_log pagination
        print("  Recording: show_agent_log_pagination")
        with vcr_instance.use_cassette("test_show_agent_log_pagination.yaml"):
            await client.call_tool(
                "show_agent_log",
                {"agent_name": "test-log", "page": 1, "page_size": 5},
            )
            await client.call_tool(
                "show_agent_log",
                {"agent_name": "test-log", "page": 2, "page_size": 5},
            )

        # Record: show_agent_log not found
        print("  Recording: show_agent_log_not_found")
        with vcr_instance.use_cassette("test_show_agent_log_not_found.yaml"):
            try:
                await client.call_tool(
                    "show_agent_log", {"agent_name": "nonexistent-agent-xyz-log"}
                )
            except Exception:
                pass  # Expected to fail


async def record_beta_task_api_operations(vcr_instance):
    """Record beta task API operations"""
    print("\n📼 Recording beta task API operations...")

    client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)

    # Create a test workspace with task API
    print("  Setting up test workspace for task API...")
    with vcr_instance.use_cassette("test_get_task_exists.yaml"):
        # Get existing agent workspace
        workspaces = await client.list_workspaces()
        test_ws = next(
            (
                ws
                for ws in workspaces
                if ws.get("metadata", {}).get("fleet_mcp_agent_name") == "test-papi"
            ),
            None,
        )
        if test_ws:
            workspace_id = test_ws["id"]
            # Try to get task
            try:
                await client.get_task(workspace_id)
            except Exception:
                pass  # Task might not exist yet

    print("  Recording: get_task_not_found")
    with vcr_instance.use_cassette("test_get_task_not_found.yaml"):
        try:
            await client.get_task("nonexistent-workspace-id")
        except Exception:
            pass  # Expected to fail

    print("  Recording: get_task_logs")
    with vcr_instance.use_cassette("test_get_task_logs.yaml"):
        if test_ws:
            try:
                await client.get_task_logs(workspace_id)
            except Exception:
                pass  # Task might not have logs

    print("  Recording: send_task_input")
    with vcr_instance.use_cassette("test_send_task_input.yaml"):
        if test_ws:
            try:
                await client.send_task_input(workspace_id, "test input")
            except Exception:
                pass  # Task might not be accepting input

    print("  Recording: send_task_input_empty")
    with vcr_instance.use_cassette("test_send_task_input_empty.yaml"):
        if test_ws:
            try:
                await client.send_task_input(workspace_id, "")
            except Exception:
                pass  # Empty input should fail

    print("  Recording: send_interrupt")
    with vcr_instance.use_cassette("test_send_interrupt.yaml"):
        if test_ws:
            try:
                await client.send_interrupt(workspace_id)
            except Exception:
                pass  # Interrupt might fail if no task running


async def main():
    """Main recording workflow"""
    print("🎬 VCR Cassette Recording Script")
    print("=" * 50)

    # Validate environment
    if not CODER_URL or not CODER_SESSION_TOKEN:
        print("❌ Error: CODER_URL and CODER_SESSION_TOKEN must be set")
        print("   Please set these environment variables and try again.")
        return 1

    print(f"📍 Coder URL: {CODER_URL}")
    print(f"📁 Cassette directory: {CASSETTE_DIR}")

    # Create cassette directory
    CASSETTE_DIR.mkdir(exist_ok=True)

    # Create VCR instance
    vcr_instance = get_vcr_instance()

    # Cleanup existing test workspaces
    client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)
    await cleanup_test_workspaces(client)

    # Record all operations
    try:
        await record_workspace_operations(vcr_instance)
        await record_template_operations(vcr_instance)
        await record_agent_management_operations(vcr_instance)
        await record_task_management_operations(vcr_instance)
        await record_log_operations(vcr_instance)
        await record_beta_task_api_operations(vcr_instance)

        print("\n✅ All cassettes recorded successfully!")
        print(f"📁 Cassettes saved to: {CASSETTE_DIR}")
        print("\n🧹 Cleaning up test workspaces...")
        await cleanup_test_workspaces(client)
        print("✅ Cleanup complete")

        return 0
    except Exception as e:
        print(f"\n❌ Error during recording: {e}")
        import traceback

        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit(asyncio.run(main()))
