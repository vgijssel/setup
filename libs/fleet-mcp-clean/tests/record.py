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
from fleet_mcp_clean.clients.coder_client import CoderClient

# Configuration
CODER_URL = os.getenv("CODER_URL")
CODER_SESSION_TOKEN = os.getenv("CODER_SESSION_TOKEN")
CASSETTE_DIR = Path(__file__).parent / "cassettes"
TEST_WORKSPACE_NAME = "test-recording-agent"

if not CODER_URL or not CODER_SESSION_TOKEN:
    print("❌ Error: CODER_URL and CODER_SESSION_TOKEN environment variables are required")
    sys.exit(1)

# Ensure cassette directory exists
CASSETTE_DIR.mkdir(exist_ok=True)

# Configure VCR
vcr_instance = vcr.VCR(
    serializer="yaml",
    cassette_library_dir=str(CASSETTE_DIR),
    record_mode="new_episodes",
    match_on=["uri", "method"],
    filter_headers=["authorization", "Coder-Session-Token"],
    filter_post_data_parameters=["password", "token"],
)


async def wait_for_workspace_ready(
    client: CoderClient, workspace_id: str, timeout: int = 180
) -> None:
    """Wait for workspace to reach running/idle state (not recorded)."""
    print(f"⏳ Waiting for workspace {workspace_id} to be ready...")
    start_time = asyncio.get_event_loop().time()

    while True:
        if asyncio.get_event_loop().time() - start_time > timeout:
            raise TimeoutError(f"Workspace {workspace_id} did not become ready within {timeout}s")

        try:
            workspace = await client.get_workspace(workspace_id)
            status = workspace.get("latest_build", {}).get("status", "unknown")
            print(f"  Status: {status}")

            if status == "running":
                print("✓ Workspace is ready")
                break
            elif status in ["failed", "canceled"]:
                raise RuntimeError(f"Workspace build failed with status: {status}")

            await asyncio.sleep(5)
        except Exception as e:
            print(f"  Error checking status: {e}")
            await asyncio.sleep(5)


async def wait_for_workspace_deleted(
    client: CoderClient, workspace_id: str, timeout: int = 120
) -> None:
    """Wait for workspace to be deleted (not recorded)."""
    print(f"⏳ Waiting for workspace {workspace_id} to be deleted...")
    start_time = asyncio.get_event_loop().time()

    while True:
        if asyncio.get_event_loop().time() - start_time > timeout:
            raise TimeoutError(f"Workspace {workspace_id} was not deleted within {timeout}s")

        try:
            await client.get_workspace(workspace_id)
            print("  Still exists, waiting...")
            await asyncio.sleep(5)
        except Exception:
            # Workspace not found = successfully deleted
            print("✓ Workspace deleted")
            break


async def record_user_story_1_cassettes(vcr_inst, client: CoderClient) -> tuple[str, str, str]:
    """Record cassettes for User Story 1: Agent Discovery.

    Returns:
        Tuple of (template_id, preset_id, workspace_id) for use in subsequent recordings
    """
    print("\n=== Recording User Story 1: Agent Discovery ===\n")

    # 1. Get organization (needed for workspace creation)
    print("📼 Recording: get_organization_success.yaml")
    with vcr_inst.use_cassette("get_organization_success.yaml"):
        org_id = await client.get_organization_id()
    print(f"✓ Organization ID: {org_id}")

    # 2. List templates
    print("\n📼 Recording: list_templates_success.yaml")
    with vcr_inst.use_cassette("list_templates_success.yaml"):
        templates = await client.list_templates()

    # Find a template with display_name
    template = None
    for t in templates:
        if t.get("display_name"):
            template = t
            break

    if not template:
        raise RuntimeError("No template with display_name found. Please create one first.")

    template_id = template["id"]
    template_name = template["display_name"]
    print(f"✓ Using template: {template_name} ({template_id})")

    # 3. Get template details
    print(f"\n📼 Recording: get_template_success.yaml")
    with vcr_inst.use_cassette("get_template_success.yaml"):
        template_details = await client.get_template(template_id)
    print(f"✓ Template has active version: {template_details.get('active_version_id')}")

    # 4. Get template parameters
    print("\n📼 Recording: get_template_parameters_success.yaml")
    with vcr_inst.use_cassette("get_template_parameters_success.yaml"):
        parameters = await client.get_template_parameters(template_id)

    param_names = [p.get("name") for p in parameters]
    print(f"✓ Template parameters: {', '.join(param_names)}")

    # Check for required parameters
    has_ai_prompt = any("ai" in p.lower() and "prompt" in p.lower() for p in param_names)
    has_system_prompt = any("system" in p.lower() and "prompt" in p.lower() for p in param_names)

    if not (has_ai_prompt and has_system_prompt):
        print("⚠️  Warning: Template missing ai_prompt or system_prompt parameters")

    # 5. List workspace presets
    print("\n📼 Recording: list_workspace_presets_success.yaml")
    with vcr_inst.use_cassette("list_workspace_presets_success.yaml"):
        presets = await client.list_workspace_presets(template_id)

    if not presets:
        raise RuntimeError(f"No workspace presets found for template {template_name}")

    # Use first preset (usually "coder")
    preset = presets[0]
    preset_id = preset.get("ID") or preset.get("id")
    preset_name = preset.get("Name") or preset.get("name")
    print(f"✓ Using preset: {preset_name} ({preset_id})")

    # 6. Create workspace
    print(f"\n📼 Recording: create_workspace_success.yaml")
    with vcr_inst.use_cassette("create_workspace_success.yaml"):
        workspace = await client.create_workspace(
            name=TEST_WORKSPACE_NAME,
            template_id=template_id,
            preset_id=preset_id,
            rich_parameter_values=[
                {"name": "ai_prompt", "value": "Test recording task"},
            ],
        )

    workspace_id = workspace["id"]
    print(f"✓ Created workspace: {TEST_WORKSPACE_NAME} ({workspace_id})")

    # Wait for workspace to be ready (not recorded)
    await wait_for_workspace_ready(client, workspace_id)

    # 7. Get workspace details
    print("\n📼 Recording: get_workspace_success.yaml")
    with vcr_inst.use_cassette("get_workspace_success.yaml"):
        workspace_details = await client.get_workspace(workspace_id)
    print(f"✓ Workspace status: {workspace_details.get('latest_build', {}).get('status')}")

    # 8. List workspaces
    print("\n📼 Recording: list_workspaces_success.yaml")
    with vcr_inst.use_cassette("list_workspaces_success.yaml"):
        workspaces = await client.list_workspaces(owner="me")
    print(f"✓ Total workspaces: {len(workspaces)}")

    # 9. Get workspace applications (for AgentAPI URL)
    print("\n📼 Recording: get_workspace_applications_success.yaml")
    with vcr_inst.use_cassette("get_workspace_applications_success.yaml"):
        applications = await client.get_workspace_applications(workspace_id)
    print(f"✓ Workspace applications: {len(applications)}")

    return template_id, preset_id, workspace_id


async def record_user_story_2_cassettes(
    vcr_inst, client: CoderClient, workspace_id: str
) -> None:
    """Record cassettes for User Story 2: Agent Lifecycle."""
    print("\n=== Recording User Story 2: Agent Lifecycle ===\n")

    # Wait a bit to ensure workspace is fully settled (no active builds)
    print("⏳ Waiting 10 seconds for workspace to settle...")
    await asyncio.sleep(10)

    # 1. Restart workspace (stop then start)
    print("📼 Recording: restart_workspace_success.yaml")
    with vcr_inst.use_cassette("restart_workspace_success.yaml"):
        restart_result = await client.restart_workspace(workspace_id)
    print(f"✓ Restart initiated: {restart_result.get('id')}")

    # Wait for restart to complete (not recorded)
    await wait_for_workspace_ready(client, workspace_id)

    # 2. Delete workspace
    print("\n📼 Recording: delete_workspace_success.yaml")
    with vcr_inst.use_cassette("delete_workspace_success.yaml"):
        delete_result = await client.delete_workspace(workspace_id)
    print(f"✓ Deletion initiated")

    # Wait for deletion to complete (not recorded)
    await wait_for_workspace_deleted(client, workspace_id)


async def record_error_cases(vcr_inst, client: CoderClient) -> None:
    """Record error case cassettes."""
    print("\n=== Recording Error Cases ===\n")

    # 1. Get non-existent workspace (404)
    print("📼 Recording: get_workspace_not_found.yaml")
    try:
        with vcr_inst.use_cassette("get_workspace_not_found.yaml"):
            await client.get_workspace("non-existent-id")
    except Exception as e:
        print(f"✓ Recorded 404 error: {type(e).__name__}")

    # 2. Create workspace with duplicate name (409) - only if test workspace still exists
    print("\n📼 Recording: create_workspace_conflict.yaml")
    # First check if test workspace exists
    try:
        workspaces = await client.list_workspaces(owner="me")
        existing = any(w.get("name") == TEST_WORKSPACE_NAME for w in workspaces)

        if existing:
            print("⚠️  Test workspace still exists, skipping conflict recording")
        else:
            # Create a workspace, then try to create duplicate
            templates = await client.list_templates()
            template = next((t for t in templates if t.get("display_name")), None)

            if template:
                template_id = template["id"]
                presets = await client.list_workspace_presets(template_id)
                preset_id = (presets[0].get("ID") or presets[0].get("id")) if presets else None

                if preset_id:
                    # Create first workspace
                    ws = await client.create_workspace(
                        name=f"{TEST_WORKSPACE_NAME}-dup",
                        template_id=template_id,
                        preset_id=preset_id,
                        rich_parameter_values=[{"name": "ai_prompt", "value": "Test"}],
                    )

                    # Try to create duplicate
                    try:
                        with vcr_inst.use_cassette("create_workspace_conflict.yaml"):
                            await client.create_workspace(
                                name=f"{TEST_WORKSPACE_NAME}-dup",
                                template_id=template_id,
                                preset_id=preset_id,
                                rich_parameter_values=[{"name": "ai_prompt", "value": "Test"}],
                            )
                    except Exception as e:
                        print(f"✓ Recorded conflict error: {type(e).__name__}")

                    # Cleanup
                    await client.delete_workspace(ws["id"])
    except Exception as e:
        print(f"⚠️  Could not record conflict case: {e}")


async def record_all() -> None:
    """Main recording function that orchestrates all cassette recordings."""
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

    try:
        # Record User Story 1 cassettes
        template_id, preset_id, workspace_id = await record_user_story_1_cassettes(
            vcr_instance, client
        )

        # Record User Story 2 cassettes
        await record_user_story_2_cassettes(vcr_instance, client, workspace_id)

        # Record error cases
        await record_error_cases(vcr_instance, client)

        print("""
╔══════════════════════════════════════════════════════════════╗
║  ✓ Recording Complete!                                       ║
╚══════════════════════════════════════════════════════════════╝

Cassettes have been recorded to: {CASSETTE_DIR}

Next steps:
1. Review the cassette files to ensure they contain expected data
2. Update test fixtures if needed
3. Run the test suite: uv run pytest
""")

    except Exception as e:
        print(f"\n❌ Error during recording: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        await client.close()


if __name__ == "__main__":
    print("Starting VCR cassette recording...")
    asyncio.run(record_all())
