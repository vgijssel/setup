#!/usr/bin/env python3
"""Record VCR cassettes from live Coder API interactions.

This script connects to a real Coder instance and records API interactions
to YAML cassette files. These cassettes are then used in tests as mock responses.

Usage:
    # Ensure environment variables are set
    export CODER_URL="https://your-coder-instance.com"
    export CODER_SESSION_TOKEN="your-session-token"

    # Run the recording script
    uv run python tests/record.py

Requirements:
    - Live Coder instance with valid credentials
    - At least one template with ai_prompt and system_prompt parameters
    - Permissions to create and delete workspaces
"""

import asyncio
import os
import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

import vcr
from fleet_mcp.clients.coder_client import CoderClient
from fleet_mcp.models import AgentStatus
from fleet_mcp.repositories.agent_repository import AgentRepository

# Configuration
CODER_URL = os.getenv("CODER_URL")
CODER_SESSION_TOKEN = os.getenv("CODER_SESSION_TOKEN")
CASSETTE_DIR = Path(__file__).parent / "cassettes"
# Use fixed name for easier cleanup
TEST_WORKSPACE_NAME = "test-recording-agent"

if not CODER_URL or not CODER_SESSION_TOKEN:
    print(
        "❌ Error: CODER_URL and CODER_SESSION_TOKEN environment variables are required"
    )
    sys.exit(1)

# Ensure cassette directory exists
CASSETTE_DIR.mkdir(exist_ok=True)

# Delete all existing cassettes to ensure fresh recording
print("🗑️  Deleting old cassettes...")
for cassette_file in CASSETTE_DIR.glob("*.yaml"):
    cassette_file.unlink()
    print(f"  Deleted: {cassette_file.name}")


def _redact_secrets(response):
    """Redact sensitive environment variables from VCR response."""
    import re

    # Define all secrets to redact
    secrets_to_redact = {
        "GH_TOKEN": os.getenv("GH_TOKEN", ""),
        "HA_TOKEN": os.getenv("HA_TOKEN", ""),
        "OP_SERVICE_ACCOUNT_TOKEN": os.getenv("OP_SERVICE_ACCOUNT_TOKEN", ""),
        "CLAUDE_CODE_OAUTH_TOKEN": os.getenv("CLAUDE_CODE_OAUTH_TOKEN", ""),
        "CODER_SESSION_TOKEN": os.getenv("CODER_SESSION_TOKEN", ""),
        "CODER_AGENT_TOKEN": os.getenv("CODER_AGENT_TOKEN", ""),
    }

    # Also redact hostname from CODER_URL
    coder_url = os.getenv("CODER_URL", "")
    if coder_url:
        # Extract hostname from URL
        from urllib.parse import urlparse

        parsed = urlparse(coder_url)
        if parsed.hostname:
            secrets_to_redact["CODER_HOSTNAME"] = parsed.hostname

    # Redact from response body
    if "body" in response and "string" in response["body"]:
        body = response["body"]["string"]

        # Convert bytes to string if needed
        if isinstance(body, bytes):
            body = body.decode("utf-8")

        # Redact each secret by value
        for secret_name, secret_value in secrets_to_redact.items():
            if secret_value and secret_value in body:
                body = body.replace(secret_value, f"***{secret_name}_REDACTED***")

        # Use regex to redact any CODER_SESSION_TOKEN values (agent tokens in responses)
        body = re.sub(
            r'"CODER_SESSION_TOKEN":"[^"]*"',
            '"CODER_SESSION_TOKEN":"***CODER_SESSION_TOKEN_REDACTED***"',
            body,
        )

        # Use regex to redact any CODER_AGENT_TOKEN values
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


def _redact_secrets_from_request(request):
    """Redact sensitive environment variables from VCR request."""
    secrets_to_redact = {
        "GH_TOKEN": os.getenv("GH_TOKEN", ""),
        "HA_TOKEN": os.getenv("HA_TOKEN", ""),
        "OP_SERVICE_ACCOUNT_TOKEN": os.getenv("OP_SERVICE_ACCOUNT_TOKEN", ""),
        "CLAUDE_CODE_OAUTH_TOKEN": os.getenv("CLAUDE_CODE_OAUTH_TOKEN", ""),
        "CODER_SESSION_TOKEN": os.getenv("CODER_SESSION_TOKEN", ""),
        "CODER_AGENT_TOKEN": os.getenv("CODER_AGENT_TOKEN", ""),
    }

    # Redact hostname
    coder_url = os.getenv("CODER_URL", "")
    hostname_to_redact = None
    if coder_url:
        from urllib.parse import urlparse

        parsed = urlparse(coder_url)
        if parsed.hostname:
            hostname_to_redact = parsed.hostname
            secrets_to_redact["CODER_HOSTNAME"] = hostname_to_redact

    # Redact from request body if present
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


# Configure VCR with "all" mode to always re-record everything
# Use redaction functions to ensure secrets are filtered
vcr_instance = vcr.VCR(
    serializer="yaml",
    cassette_library_dir=str(CASSETTE_DIR),
    record_mode="all",  # ALWAYS re-record, never reuse existing cassettes
    match_on=["uri", "method"],
    filter_headers=["Coder-Session-Token", "Authorization", "Cookie"],
    before_record_response=_redact_secrets,
    before_record_request=_redact_secrets_from_request,
)


async def wait_for_workspace_ready(
    client: CoderClient, workspace_id: str, timeout: int = 180
) -> None:
    """Wait for workspace to reach running status."""
    print(f"⏳ Waiting for workspace {workspace_id} to be ready...")
    for _ in range(timeout // 5):
        workspace = await client.get_workspace(workspace_id)
        status = workspace.get("latest_build", {}).get("status", "")
        print(f"  Status: {status}")

        if status == "running":
            print("✓ Workspace is running")
            return

        await asyncio.sleep(5)

    raise TimeoutError(
        f"Workspace {workspace_id} did not become ready within {timeout}s"
    )


async def wait_for_apps_healthy(
    client: CoderClient, workspace_id: str, timeout: int = 180
) -> None:
    """Wait for all enabled workspace apps to be healthy.

    This is required before using experimental task API.
    """
    print("⏳ Waiting for all enabled apps to be healthy...")
    for attempt in range(timeout // 5):
        try:
            workspace = await client.get_workspace(workspace_id)

            # Get all agents and their apps
            resources = workspace.get("latest_build", {}).get("resources", [])
            all_healthy = True
            enabled_app_count = 0
            healthy_count = 0

            for resource in resources:
                agents = resource.get("agents", [])
                for agent in agents:
                    apps = agent.get("apps", [])
                    for app in apps:
                        health = app.get("health", "")
                        app_name = app.get("display_name", app.get("slug", "unknown"))

                        # Skip disabled apps - they will never be healthy
                        if health == "disabled":
                            continue

                        enabled_app_count += 1

                        if health == "healthy":
                            healthy_count += 1
                        else:
                            all_healthy = False
                            if attempt % 3 == 0:  # Only print every 15 seconds
                                print(f"  {app_name}: {health}")

            if all_healthy and enabled_app_count > 0:
                print(f"✓ All {enabled_app_count} enabled apps are healthy!")
                return

            if attempt % 3 == 0:  # Only print status every 15 seconds
                print(f"  Enabled apps: {healthy_count}/{enabled_app_count} healthy")

        except Exception as e:
            print(f"  Error checking apps: {e}")

        await asyncio.sleep(5)

    raise TimeoutError(f"Apps did not become healthy within {timeout}s")


async def wait_for_workspace_deleted(
    client: CoderClient, workspace_id: str, timeout: int = 60
) -> None:
    """Wait for workspace to be deleted."""
    print(f"⏳ Waiting for workspace {workspace_id} to be deleted...")
    for _ in range(timeout // 5):
        try:
            await client.get_workspace(workspace_id)
            print("  Still exists...")
            await asyncio.sleep(5)
        except Exception:
            print("✓ Workspace deleted")
            return

    raise TimeoutError(f"Workspace {workspace_id} was not deleted within {timeout}s")


async def wait_for_agent_idle(
    agent_repo: AgentRepository, agent_name: str, timeout: int = 300
) -> None:
    """Wait for agent to reach idle status using AgentRepository.

    This waits for the workspace to be fully initialized and Claude Code to be idle,
    which means task history and other metadata will be populated in the workspace response.
    """
    print(f"⏳ Waiting for agent {agent_name} to be idle...")
    for attempt in range(timeout // 5):
        try:
            agent = await agent_repo.get_by_name(agent_name)
            print(f"  Status: {agent.status.value}")

            if agent.status == AgentStatus.IDLE:
                print(f"✓ Agent is idle (last_task: {agent.last_task})")
                return

            if agent.status == AgentStatus.FAILED:
                raise RuntimeError(f"Agent {agent_name} failed to start")

        except Exception as e:
            if attempt % 3 == 0:  # Only print every 15 seconds
                print(f"  Error checking agent: {e}")

        await asyncio.sleep(5)

    raise TimeoutError(f"Agent {agent_name} did not become idle within {timeout}s")


async def record(vcr_inst) -> None:
    """Record all cassettes in a single linear flow."""
    print(f"""
╔══════════════════════════════════════════════════════════════╗
║  Fleet MCP Clean - VCR Cassette Recorder                   ║
╚══════════════════════════════════════════════════════════════╝

Coder URL: {CODER_URL}
Cassette Directory: {CASSETTE_DIR}
Test Workspace Name: {TEST_WORKSPACE_NAME}

⚠️  WARNING: This will create and delete a test workspace on your Coder instance.

""")

    client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)
    agent_repo = AgentRepository(client)
    workspace_id = None

    # Cleanup any existing test workspace first
    try:
        print("🧹 Checking for existing test workspace...")
        workspaces = await client.list_workspaces(owner="me")
        existing = next(
            (w for w in workspaces if w.get("name") == TEST_WORKSPACE_NAME), None
        )
        if existing:
            existing_id = existing["id"]
            print(f"  Found existing workspace {existing_id}, deleting...")
            try:
                await client.delete_workspace(existing_id)
                await wait_for_workspace_deleted(client, existing_id)
                print("  ✓ Deleted existing workspace")
            except Exception as e:
                print(f"  ⚠️  Could not delete: {e}")
        else:
            print("  ✓ No existing workspace found")
    except Exception as e:
        print(f"  ⚠️  Cleanup check failed: {e}")

    try:
        # Get organization ID (needed for workspace creation)
        print("📼 Recording: get_organization_success.yaml")
        with vcr_inst.use_cassette("get_organization_success.yaml"):
            org_id = await client.get_organization_id()
        print(f"✓ Organization ID: {org_id}")

        # List templates
        print("\n📼 Recording: list_templates_success.yaml")
        with vcr_inst.use_cassette("list_templates_success.yaml"):
            templates = await client.list_templates()

        # Find a template with display_name
        template = next((t for t in templates if t.get("display_name")), None)
        template_id = template["id"]
        template_name = template["display_name"]
        print(f"✓ Using template: {template_name} ({template_id})")

        # Get template details
        print("\n📼 Recording: get_template_success.yaml")
        with vcr_inst.use_cassette("get_template_success.yaml"):
            template_details = await client.get_template(template_id)
        print(f"✓ Template active version: {template_details.get('active_version_id')}")

        # Get template parameters
        print("\n📼 Recording: get_template_parameters_success.yaml")
        with vcr_inst.use_cassette("get_template_parameters_success.yaml"):
            parameters = await client.get_template_parameters(template_id)
        param_names = [p.get("name") for p in parameters]
        print(f"✓ Template parameters: {', '.join(param_names)}")

        # List workspace presets
        print("\n📼 Recording: list_workspace_presets_success.yaml")
        with vcr_inst.use_cassette("list_workspace_presets_success.yaml"):
            presets = await client.list_workspace_presets(template_id)

        preset = presets[0]
        preset_id = preset.get("ID") or preset.get("id")
        preset_name = preset.get("Name") or preset.get("name")
        print(f"✓ Using preset: {preset_name} ({preset_id})")

        # Create workspace
        print("\n📼 Recording: create_workspace_success.yaml")
        with vcr_inst.use_cassette("create_workspace_success.yaml"):
            workspace = await client.create_workspace(
                name=TEST_WORKSPACE_NAME,
                template_id=template_id,
                preset_id=preset_id,
                rich_parameter_values=[
                    # Per Coder AI docs, the parameter name is "AI Prompt" (with space and capitals)
                    # See: https://coder.com/docs/ai-coder/tasks#option-2-create-or-duplicate-your-own-template
                    {"name": "AI Prompt", "value": "Test recording task"},
                ],
            )

        workspace_id = workspace["id"]
        print(f"✓ Created workspace: {TEST_WORKSPACE_NAME} ({workspace_id})")

        # Wait for workspace to be ready (not recorded)
        await wait_for_workspace_ready(client, workspace_id)

        # Wait for all apps to be healthy (required for experimental API)
        await wait_for_apps_healthy(client, workspace_id)

        # Wait for agent to become idle (this ensures task history is populated)
        await wait_for_agent_idle(agent_repo, TEST_WORKSPACE_NAME)

        # Get workspace details
        print("\n📼 Recording: get_workspace_success.yaml")
        with vcr_inst.use_cassette("get_workspace_success.yaml"):
            workspace_details = await client.get_workspace(workspace_id)
        owner_name = workspace_details.get("owner_name", "me")
        print(
            f"✓ Workspace status: {workspace_details.get('latest_build', {}).get('status')}"
        )

        # List workspaces
        print("\n📼 Recording: list_workspaces_success.yaml")
        with vcr_inst.use_cassette("list_workspaces_success.yaml"):
            workspaces = await client.list_workspaces(owner="me")
        print(f"✓ Total workspaces: {len(workspaces)}")

        # Get workspace applications (for AgentAPI URL)
        print("\n📼 Recording: get_workspace_applications_success.yaml")
        with vcr_inst.use_cassette("get_workspace_applications_success.yaml"):
            applications = await client.get_workspace_applications(workspace_id)
        print(f"✓ Workspace applications: {len(applications)}")

        # Get task logs (empty state - no task running yet)
        print("\n📼 Recording: get_task_logs_empty.yaml")
        with vcr_inst.use_cassette("get_task_logs_empty.yaml"):
            logs_empty = await client.get_task_logs(owner_name, workspace_id)
        print(f"✓ Logs (empty state): {len(logs_empty)} entries")

        # Send task input
        print("\n📼 Recording: send_task_input_success.yaml")
        with vcr_inst.use_cassette("send_task_input_success.yaml"):
            await client.send_task_input(
                owner_name, workspace_id, "Write hello world to a file"
            )
        print("✓ Task input sent")

        # Get task status
        print("\n📼 Recording: get_task_success.yaml")
        with vcr_inst.use_cassette("get_task_success.yaml"):
            task = await client.get_task(owner_name, workspace_id)
        print(f"✓ Task retrieved: {task is not None}")

        # Send interrupt signal via AgentAPI
        # Skip for now - this requires additional implementation
        print(
            "\n⚠️  Skipping send_agentapi_interrupt_success.yaml (not implemented yet)"
        )

        # Get task logs (with data after task execution)
        print("\n📼 Recording: get_task_logs_success.yaml")
        with vcr_inst.use_cassette("get_task_logs_success.yaml"):
            logs = await client.get_task_logs(owner_name, workspace_id)
        print(f"✓ Logs: {len(logs)} entries")

        # Skip restart and delete for now - we have the core cassettes we need
        # The task execution triggers builds that conflict with restart
        print("\n⚠️  Skipping restart_workspace_success.yaml (build conflicts)")
        print("⚠️  Skipping delete_workspace_success.yaml (will clean up in finally)")

        # Record error case: get non-existent workspace (404)
        print("\n📼 Recording: get_workspace_not_found.yaml")
        try:
            with vcr_inst.use_cassette("get_workspace_not_found.yaml"):
                await client.get_workspace("non-existent-id")
        except Exception as e:
            print(f"✓ Recorded 404 error: {type(e).__name__}")

        print(f"""
╔══════════════════════════════════════════════════════════════╗
║  ✓ Recording Complete!                                       ║
╚══════════════════════════════════════════════════════════════╝

Cassettes have been recorded to: {CASSETTE_DIR}

Next steps:
1. Review the cassette files to ensure they contain expected data
2. Update test fixtures if needed
3. Run the test suite: nx test fleet-mcp
""")

    finally:
        # Ensure workspace is always cleaned up, even if recording fails
        if workspace_id:
            try:
                print(
                    f"\n🧹 Cleaning up test workspace: {TEST_WORKSPACE_NAME} ({workspace_id})"
                )
                # Check if workspace still exists
                try:
                    await client.get_workspace(workspace_id)
                    # If we get here, workspace exists - delete it
                    await client.delete_workspace(workspace_id)
                    print("✓ Cleanup: Workspace deleted")
                    # Wait for deletion to complete
                    await wait_for_workspace_deleted(client, workspace_id)
                except Exception:
                    # Workspace doesn't exist or already deleted - that's fine
                    print("✓ Cleanup: Workspace already deleted")
            except Exception as e:
                print(f"⚠️  Cleanup warning: Could not delete workspace: {e}")

        await client.close()


if __name__ == "__main__":
    print("Starting VCR cassette recording...")
    try:
        asyncio.run(record(vcr_instance))
    except Exception as e:
        print(f"\n❌ Error during recording: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
