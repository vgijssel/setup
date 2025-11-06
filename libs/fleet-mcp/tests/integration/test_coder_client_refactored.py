"""Integration tests for Coder API client (Refactored)

These tests demonstrate the new fixture-based testing approach:
- All mocking is handled by fixtures
- Tests are clean and focus only on assertions
- Respx fails on unmocked requests
- Version-aware cassette caching
"""

import pytest


# T013: CoderClient initialization test
def test_coder_client_initialization(coder_client):
    """Test CoderClient can be initialized"""
    assert coder_client.base_url == "https://coder.example.com"
    assert coder_client.token == "test-token"
    assert coder_client.client is not None


# T014: Workspace creation test
@pytest.mark.asyncio
async def test_create_workspace(coder_client, mock_create_workspace):
    """Test workspace creation"""
    workspace = await coder_client.create_workspace(
        name="test-ws-create-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    assert workspace is not None
    assert "id" in workspace
    assert workspace.get("name") == "test-ws-create-001"


# T015: Workspace listing test
@pytest.mark.asyncio
async def test_list_workspaces(coder_client, mock_list_workspaces):
    """Test listing workspaces"""
    workspaces = await coder_client.list_workspaces()

    assert isinstance(workspaces, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in workspaces if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) >= 0


# T016: Workspace deletion test
@pytest.mark.asyncio
async def test_delete_workspace(
    coder_client, mock_get_workspace, mock_delete_workspace
):
    """Test workspace deletion"""
    workspace_id = mock_get_workspace.get("id")
    assert workspace_id is not None

    result = await coder_client.delete_workspace(workspace_id)
    assert result is not None


# Test for get_template_version_rich_parameters
@pytest.mark.asyncio
async def test_get_template_version_rich_parameters(
    coder_client,
    mock_list_templates,
    mock_get_template,
    mock_get_template_rich_parameters,
):
    """Test getting rich parameters from a template version"""
    # Get templates
    templates_list = await coder_client.list_templates()
    coder_template = next(
        (t for t in templates_list if t.get("name") == "coder-devcontainer"), None
    )
    assert coder_template is not None, "coder-devcontainer template not found"

    # Get template details
    template_id = coder_template.get("id")
    template_details = await coder_client.get_template(template_id)
    active_version_id = template_details.get("active_version_id")
    assert active_version_id is not None, "No active version found"

    # Get rich parameters
    rich_params = await coder_client.get_template_version_rich_parameters(
        active_version_id
    )

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
