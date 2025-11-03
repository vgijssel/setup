"""Integration tests for Coder API client"""

import pytest
from fleet_mcp.clients.coder_client import CoderClient


# T013: CoderClient initialization test
def test_coder_client_initialization(coder_base_url, coder_token):
    """Test CoderClient can be initialized"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    assert client.base_url == coder_base_url.rstrip("/")
    assert client.token == coder_token
    assert client.client is not None


# T014: Workspace creation test with pytest-vcr
@pytest.mark.vcr
async def test_create_workspace(coder_base_url, coder_token):
    """Test workspace creation via Coder API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspace = await client.create_workspace(
        name="test-ws-create-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    assert workspace is not None
    assert "id" in workspace
    assert workspace.get("name") == "test-ws-create-001"


# T015: Workspace listing test with pytest-vcr
@pytest.mark.vcr
async def test_list_workspaces(coder_base_url, coder_token):
    """Test listing workspaces via Coder API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    workspaces = await client.list_workspaces()

    assert isinstance(workspaces, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in workspaces if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) >= 0


# T016: Workspace deletion test with pytest-vcr
@pytest.mark.vcr
async def test_delete_workspace(coder_base_url, coder_token, vcr_cassette):
    """Test workspace deletion via Coder API"""
    is_recording = not vcr_cassette.rewound

    import asyncio

    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # First create a workspace to delete
    workspace = await client.create_workspace(
        name="test-ws-delete-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    workspace_id = workspace.get("id")
    assert workspace_id is not None

    # Wait for workspace to be fully running before deleting
    # This prevents 409 Conflict when trying to delete too early
    for _ in range(45):
        ws = await client.get_workspace(workspace_id)
        status = ws.get("latest_build", {}).get("status")
        if status == "running":
            break

        if is_recording:
            await asyncio.sleep(2)

    # Now delete it
    result = await client.delete_workspace(workspace_id)
    assert result is not None


# Test for get_template_version_rich_parameters
@pytest.mark.vcr
async def test_get_template_version_rich_parameters(coder_base_url, coder_token):
    """Test getting rich parameters from a template version"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Get coder-devcontainer template
    templates = await client.list_templates()
    coder_template = next(
        (t for t in templates if t.get("name") == "coder-devcontainer"), None
    )
    assert coder_template is not None, "coder-devcontainer template not found"

    template_id = coder_template.get("id")

    # Get template details to get active version
    template_details = await client.get_template(template_id)
    active_version_id = template_details.get("active_version_id")
    assert active_version_id is not None, "No active version found"

    # Get rich parameters for the active version
    rich_params = await client.get_template_version_rich_parameters(active_version_id)

    assert isinstance(rich_params, list)
    assert len(rich_params) > 0, "Template should have rich parameters"

    # Check for required parameters
    param_names = [p.get("name") for p in rich_params]
    assert any(
        "ai" in name.lower() and "prompt" in name.lower() for name in param_names
    ), "Should have ai_prompt or 'AI Prompt' parameter"
    assert any(
        "system" in name.lower() and "prompt" in name.lower() for name in param_names
    ), "Should have system_prompt or 'System Prompt' parameter"

    # Verify parameter structure
    for param in rich_params:
        assert "name" in param
        assert "type" in param
        assert "description" in param or "description_plaintext" in param
