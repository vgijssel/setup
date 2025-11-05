#!/usr/bin/env python3
"""
VCR Cassette Recording Script

This script records HTTP interactions with the Coder API and saves them as VCR cassettes.
Run this script OUTSIDE of pytest to record cassettes in an idempotent manner.

Usage:
    python tests/record.py

Requirements:
    - CODER_URL and CODER_SESSION_TOKEN environment variables must be set
    - Coder instance must be accessible
    - Script will clean up ALL fleet-mcp workspaces before and after recording
"""

import asyncio
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse

import vcr
from dotenv import load_dotenv

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from fastmcp import Client, FastMCP
from fleet_mcp.coder.client import CoderClient

# Load environment variables
env_file = Path(__file__).parent.parent / ".env"
load_dotenv(env_file)


def get_redaction_config() -> Dict[str, Any]:
    """Get VCR configuration with secret redaction"""
    secrets_to_redact = {
        "GH_TOKEN": os.getenv("GH_TOKEN", ""),
        "HA_TOKEN": os.getenv("HA_TOKEN", ""),
        "NX_KEY": os.getenv("NX_KEY", ""),
        "OP_SERVICE_ACCOUNT_TOKEN": os.getenv("OP_SERVICE_ACCOUNT_TOKEN", ""),
        "CLAUDE_CODE_OAUTH_TOKEN": os.getenv("CLAUDE_CODE_OAUTH_TOKEN", ""),
        "CODER_SESSION_TOKEN": os.getenv("CODER_SESSION_TOKEN", ""),
        "CODER_AGENT_TOKEN": os.getenv("CODER_AGENT_TOKEN", ""),
    }

    # Get hostname from CODER_URL
    coder_url = os.getenv("CODER_URL", "")
    hostname_to_redact = None
    if coder_url:
        parsed = urlparse(coder_url)
        if parsed.hostname:
            hostname_to_redact = parsed.hostname
            secrets_to_redact["CODER_HOSTNAME"] = hostname_to_redact

    def redact_response(response):
        """Redact sensitive data from response"""
        if "body" in response and "string" in response["body"]:
            body = response["body"]["string"]
            if isinstance(body, bytes):
                body = body.decode("utf-8")

            # Redact each secret
            for secret_name, secret_value in secrets_to_redact.items():
                if secret_value and secret_value in body:
                    body = body.replace(secret_value, f"***{secret_name}_REDACTED***")

            # Redact tokens with regex
            body = re.sub(
                r'"CODER_SESSION_TOKEN":"[^"]*"',
                '"CODER_SESSION_TOKEN":"***CODER_SESSION_TOKEN_REDACTED***"',
                body,
            )
            body = re.sub(
                r'"CODER_AGENT_TOKEN":"[^"]*"',
                '"CODER_AGENT_TOKEN":"***CODER_AGENT_TOKEN_REDACTED***"',
                body,
            )

            if isinstance(response["body"]["string"], bytes):
                response["body"]["string"] = body.encode("utf-8")
            else:
                response["body"]["string"] = body

        return response

    def redact_request(request):
        """Redact sensitive data from request"""
        # Redact from request body
        if hasattr(request, "body") and request.body:
            body = request.body
            if isinstance(body, bytes):
                body = body.decode("utf-8")

            for secret_name, secret_value in secrets_to_redact.items():
                if secret_value and secret_value in body:
                    body = body.replace(secret_value, f"***{secret_name}_REDACTED***")

            if isinstance(request.body, bytes):
                request.body = body.encode("utf-8")
            else:
                request.body = body

        # Redact hostname from URI
        if hostname_to_redact and request.uri:
            request.uri = request.uri.replace(hostname_to_redact, "coder.example.com")

        # Redact hostname from headers
        if hostname_to_redact and hasattr(request, "headers"):
            if "host" in request.headers:
                request.headers["host"] = request.headers["host"].replace(
                    hostname_to_redact, "coder.example.com"
                )

        return request

    return {
        "filter_headers": [
            "authorization",
            "cookie",
            "x-coder-session-token",
            "coder-session-token",
        ],
        "before_record_response": redact_response,
        "before_record_request": redact_request,
        "record_mode": "all",  # Always re-record
        "match_on": ["method", "scheme", "host", "port", "path"],
    }


async def cleanup_fleet_workspaces(client: CoderClient) -> None:
    """Delete all fleet-mcp workspaces for idempotent recording"""
    print("🧹 Cleaning up all fleet-mcp workspaces...")
    workspaces = await client.list_workspaces()
    fleet_workspaces = [
        ws for ws in workspaces if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]

    if not fleet_workspaces:
        print("✓ No fleet-mcp workspaces to clean up")
        return

    print(f"Found {len(fleet_workspaces)} fleet-mcp workspaces to delete")

    for ws in fleet_workspaces:
        ws_id = ws.get("id")
        ws_name = ws.get("name")
        print(f"  Deleting workspace: {ws_name} ({ws_id})")
        try:
            await client.delete_workspace(ws_id)
            # Wait a bit for deletion to start
            await asyncio.sleep(1)
        except Exception as e:
            print(f"  Warning: Failed to delete {ws_name}: {e}")

    # Wait for all deletions to complete
    print("⏳ Waiting for workspace deletions to complete...")
    max_wait = 180  # 3 minutes
    for i in range(max_wait):
        await asyncio.sleep(2)
        remaining_workspaces = await client.list_workspaces()
        remaining_fleet = [
            ws
            for ws in remaining_workspaces
            if "fleet_mcp_agent_name" in ws.get("metadata", {})
        ]
        if not remaining_fleet:
            print("✓ All fleet-mcp workspaces deleted")
            return
        if i % 10 == 0:
            print(f"  Still waiting... {len(remaining_fleet)} workspaces remaining")

    print("⚠️  Warning: Some workspaces may still be deleting")


async def wait_for_workspace_state(
    client: CoderClient, workspace_id: str, target_state: str, max_retries: int = 60
) -> bool:
    """Wait for workspace to reach target state"""
    for i in range(max_retries):
        ws = await client.get_workspace(workspace_id)
        status = ws.get("latest_build", {}).get("status")
        if status == target_state:
            return True
        if i % 10 == 0 and i > 0:
            print(
                f"    Waiting for {target_state} state... (attempt {i}/{max_retries})"
            )
        await asyncio.sleep(2)
    return False


def record_cassette(cassette_name: str):
    """Decorator to record a cassette for a test function"""

    def decorator(func):
        async def wrapper():
            cassettes_dir = Path(__file__).parent / "cassettes"
            cassettes_dir.mkdir(exist_ok=True)
            cassette_path = cassettes_dir / f"{cassette_name}.yaml"

            config = get_redaction_config()
            my_vcr = vcr.VCR(**config)

            print(f"\n📼 Recording: {cassette_name}")
            with my_vcr.use_cassette(str(cassette_path)):
                await func()
            print(f"✓ Recorded: {cassette_path}")

        return wrapper

    return decorator


# ============================================================================
# Integration Tests - Coder Client
# ============================================================================


@record_cassette("test_create_workspace")
async def record_test_create_workspace():
    """Record cassette for test_create_workspace"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspace = await client.create_workspace(
        name="test-ws-create-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )
    assert workspace is not None
    assert "id" in workspace


@record_cassette("test_list_workspaces")
async def record_test_list_workspaces():
    """Record cassette for test_list_workspaces"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspaces = await client.list_workspaces()
    assert isinstance(workspaces, list)


@record_cassette("test_delete_workspace")
async def record_test_delete_workspace():
    """Record cassette for test_delete_workspace"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Create workspace
    workspace = await client.create_workspace(
        name="test-ws-delete-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )
    workspace_id = workspace.get("id")

    # Wait for workspace to be running
    print("    Waiting for workspace to be running...")
    await wait_for_workspace_state(client, workspace_id, "running", max_retries=60)

    # Delete it
    result = await client.delete_workspace(workspace_id)
    assert result is not None


@record_cassette("test_get_template_version_rich_parameters")
async def record_test_get_template_version_rich_parameters():
    """Record cassette for test_get_template_version_rich_parameters"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    templates = await client.list_templates()
    coder_template = next(
        (t for t in templates if t.get("name") == "coder-devcontainer"), None
    )
    assert coder_template is not None

    template_id = coder_template.get("id")
    template_details = await client.get_template(template_id)
    active_version_id = template_details.get("active_version_id")

    rich_params = await client.get_template_version_rich_parameters(active_version_id)
    assert isinstance(rich_params, list)


# ============================================================================
# Integration Tests - Beta Task API
# ============================================================================


@record_cassette("test_get_task_exists")
async def record_test_get_task_exists():
    """Record cassette for test_get_task_exists"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspaces = await client.list_workspaces()
    assert len(workspaces) > 0

    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    task = await client.get_task(owner_name, workspace_id)
    assert task is not None


@record_cassette("test_get_task_not_found")
async def record_test_get_task_not_found():
    """Record cassette for test_get_task_not_found"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    fake_workspace_id = "00000000-0000-0000-0000-000000000000"
    fake_username = "nonexistent"

    task = await client.get_task(fake_username, fake_workspace_id)
    assert task is None


@record_cassette("test_send_task_input")
async def record_test_send_task_input():
    """Record cassette for test_send_task_input"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspaces = await client.list_workspaces()
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    task_input = "Test task input for VCR recording"
    await client.send_task_input(owner_name, workspace_id, task_input)


@record_cassette("test_send_task_input_empty")
async def record_test_send_task_input_empty():
    """Record cassette for test_send_task_input_empty"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspaces = await client.list_workspaces()
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    # These will raise ValueError (not recorded in cassette, but structure is)
    try:
        await client.send_task_input(owner_name, workspace_id, "")
    except ValueError:
        pass


@record_cassette("test_send_interrupt")
async def record_test_send_interrupt():
    """Record cassette for test_send_interrupt"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspaces = await client.list_workspaces()
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    result = await client.send_interrupt(owner_name, workspace_id)
    assert isinstance(result, dict)


@record_cassette("test_get_task_logs")
async def record_test_get_task_logs():
    """Record cassette for test_get_task_logs"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspaces = await client.list_workspaces()
    workspace = workspaces[0]
    workspace_id = workspace.get("id")
    owner_name = workspace.get("owner_name")

    logs = await client.get_task_logs(owner_name, workspace_id)
    assert isinstance(logs, list)


# ============================================================================
# Contract Tests - MCP Tools (Helper)
# ============================================================================


def create_mcp_server(coder_base_url: str, coder_token: str) -> FastMCP:
    """Create MCP server for contract tests"""
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools
    from fleet_mcp.tools.task_management import register_task_tools

    mcp = FastMCP("Fleet Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)
    return mcp


def parse_tool_result(result):
    """Parse JSON result from MCP tool call"""
    import json

    content = result.content[0]
    return json.loads(content.text)


# ============================================================================
# Contract Tests - MCP Tools
# ============================================================================


@record_cassette("test_list_agent_projects_success")
async def record_test_list_agent_projects_success():
    """Record cassette for test_list_agent_projects_success"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        result = await client.call_tool("list_agent_projects", {})
        data = parse_tool_result(result)
        assert "projects" in data


@record_cassette("test_list_agent_roles_success")
async def record_test_list_agent_roles_success():
    """Record cassette for test_list_agent_roles_success"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        result = await client.call_tool("list_agent_roles", {"project": project_name})
        data = parse_tool_result(result)
        assert "roles" in data


@record_cassette("test_list_agent_roles_invalid_project")
async def record_test_list_agent_roles_invalid_project():
    """Record cassette for test_list_agent_roles_invalid_project"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        try:
            await client.call_tool(
                "list_agent_roles", {"project": "NonExistentProject"}
            )
        except Exception:
            pass  # Expected to fail


@record_cassette("test_create_agent_success")
async def record_test_create_agent_success():
    """Record cassette for test_create_agent_success"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
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
        assert data["agent"]["name"] == "test-papi"


@record_cassette("test_create_agent_invalid_name")
async def record_test_create_agent_invalid_name():
    """Record cassette for test_create_agent_invalid_name"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

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


@record_cassette("test_create_agent_invalid_project")
async def record_test_create_agent_invalid_project():
    """Record cassette for test_create_agent_invalid_project"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
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


@record_cassette("test_list_agents_success")
async def record_test_list_agents_success():
    """Record cassette for test_list_agents_success"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        result = await client.call_tool("list_agents", {})
        data = parse_tool_result(result)
        assert "agents" in data


@record_cassette("test_show_agent_success")
async def record_test_show_agent_success():
    """Record cassette for test_show_agent_success"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create agent
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

        # Show agent
        result = await client.call_tool("show_agent", {"agent_name": "test-show"})
        data = parse_tool_result(result)
        assert data["agent"]["name"] == "test-show"


@record_cassette("test_show_agent_not_found")
async def record_test_show_agent_not_found():
    """Record cassette for test_show_agent_not_found"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        try:
            await client.call_tool(
                "show_agent", {"agent_name": "nonexistent-agent-xyz"}
            )
        except Exception:
            pass  # Expected to fail


@record_cassette("test_show_agent_case_insensitive")
async def record_test_show_agent_case_insensitive():
    """Record cassette for test_show_agent_case_insensitive"""
    coder_base_url = os.getenv("CODER_URL", "https://coder.example.com")
    coder_token = os.getenv("CODER_SESSION_TOKEN", "test-token")
    server = create_mcp_server(coder_base_url, coder_token)

    async with Client(server) as client:
        projects_result = await client.call_tool("list_agent_projects", {})
        projects_data = parse_tool_result(projects_result)
        project_name = projects_data["projects"][0]["name"]

        # Create agent
        await client.call_tool(
            "create_agent",
            {
                "name": "test-case",
                "project": project_name,
                "role": "coder",
                "task": "Test for case-insensitive agent name lookup",
            },
        )

        # Test with different cases
        await client.call_tool("show_agent", {"agent_name": "test-case"})
        await client.call_tool("show_agent", {"agent_name": "TEST-CASE"})
        await client.call_tool("show_agent", {"agent_name": "Test-Case"})


# Additional contract tests continue...
# (Note: The remaining tests follow similar patterns)


async def main():
    """Main recording function"""
    print("=" * 70)
    print("VCR Cassette Recording Script")
    print("=" * 70)

    # Verify environment
    coder_url = os.getenv("CODER_URL")
    coder_token = os.getenv("CODER_SESSION_TOKEN")

    if not coder_url or not coder_token:
        print("❌ Error: CODER_URL and CODER_SESSION_TOKEN must be set")
        sys.exit(1)

    print(f"\n🔗 Coder URL: {coder_url}")
    print(f"🔑 Token: {coder_token[:10]}...")

    # Initialize client
    client = CoderClient(base_url=coder_url, token=coder_token)

    # Clean up before recording
    await cleanup_fleet_workspaces(client)

    # Record all cassettes
    print("\n" + "=" * 70)
    print("Recording Cassettes")
    print("=" * 70)

    # Integration tests
    await record_test_create_workspace()
    await record_test_list_workspaces()
    await record_test_delete_workspace()
    await record_test_get_template_version_rich_parameters()

    # Beta task API tests
    await record_test_get_task_exists()
    await record_test_get_task_not_found()
    await record_test_send_task_input()
    await record_test_send_task_input_empty()
    await record_test_send_interrupt()
    await record_test_get_task_logs()

    # Contract tests
    await record_test_list_agent_projects_success()
    await record_test_list_agent_roles_success()
    await record_test_list_agent_roles_invalid_project()
    await record_test_create_agent_success()
    await record_test_create_agent_invalid_name()
    await record_test_create_agent_invalid_project()
    await record_test_list_agents_success()
    await record_test_show_agent_success()
    await record_test_show_agent_not_found()
    await record_test_show_agent_case_insensitive()

    # Clean up after recording
    print("\n" + "=" * 70)
    print("Cleaning Up")
    print("=" * 70)
    await cleanup_fleet_workspaces(client)

    print("\n" + "=" * 70)
    print("✅ Recording Complete!")
    print("=" * 70)
    print("\nNext steps:")
    print("1. Run pytest to use the recorded cassettes")
    print("2. Commit the cassettes to version control")


if __name__ == "__main__":
    asyncio.run(main())
