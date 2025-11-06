"""Integration tests for Coder API client using respx mocking

All tests use respx mocking via pytest fixtures. No VCR is used directly in tests.
"""

import pytest


# T013: CoderClient initialization test
def test_coder_client_initialization(coder_base_url, coder_token):
    """Test CoderClient can be initialized

    This test doesn't need mocking as it only tests initialization.
    """
    from fleet_mcp.coder.client import CoderClient

    client = CoderClient(base_url=coder_base_url, token=coder_token)
    assert client.base_url == coder_base_url.rstrip("/")
    assert client.token == coder_token
    assert client.client is not None


# T014: Workspace creation test with respx mocking
@pytest.mark.asyncio
async def test_create_workspace(coder_client, mock_create_workspace):
    """Test workspace creation via Coder API

    The mock_create_workspace fixture:
    - Loads cassette data for workspace creation flow
    - Configures respx to mock all necessary API endpoints
    - Returns the expected workspace data
    """
    # Execute test - respx mocks are already configured by fixture
    workspace = await coder_client.create_workspace(
        name="test-ws-create-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    # Assertions only - no mock setup
    assert workspace is not None
    assert "id" in workspace
    assert workspace.get("name") == "test-ws-create-001"
    assert workspace == mock_create_workspace


# T015: Workspace listing test with respx mocking
@pytest.mark.asyncio
async def test_list_workspaces(coder_client, mock_list_workspaces):
    """Test listing workspaces via Coder API

    The mock_list_workspaces fixture:
    - Loads workspace data from cassette
    - Configures respx to mock GET /api/v2/workspaces
    - Returns the expected workspace list
    """
    # Execute test - respx mock is already configured by fixture
    workspaces = await coder_client.list_workspaces()

    # Assertions
    assert isinstance(workspaces, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in workspaces if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) >= 0
    assert workspaces == mock_list_workspaces


# T016: Workspace deletion test with respx mocking
@pytest.mark.asyncio
async def test_delete_workspace(coder_client, mock_delete_workspace):
    """Test workspace deletion via Coder API

    The mock_delete_workspace fixture:
    - Loads cassette data for the full deletion flow
    - Mocks workspace creation, polling, and deletion
    - Returns workspace and deletion response data
    """
    # Get workspace data from fixture
    workspace = mock_delete_workspace["workspace"]
    workspace_id = workspace["id"]

    # The fixture already mocked the creation, so we can directly test deletion
    # In a real scenario, the client would have created it first (already mocked)

    # Delete the workspace - respx mock is configured by fixture
    result = await coder_client.delete_workspace(workspace_id)

    # Assertions
    assert result is not None
    assert result == mock_delete_workspace["delete_response"]


# Test for get_template_version_rich_parameters
@pytest.mark.asyncio
async def test_get_template_version_rich_parameters(
    coder_client, mock_get_template_version_rich_parameters
):
    """Test getting rich parameters from a template version

    The mock_get_template_version_rich_parameters fixture:
    - Mocks template listing
    - Mocks template details retrieval
    - Mocks rich parameters retrieval
    - Returns the expected rich parameters
    """
    # Get coder-devcontainer template - mocked by fixture
    templates = await coder_client.list_templates()
    coder_template = next(
        (t for t in templates if t.get("name") == "coder-devcontainer"), None
    )
    assert coder_template is not None, "coder-devcontainer template not found"

    template_id = coder_template.get("id")

    # Get template details to get active version - mocked by fixture
    template_details = await coder_client.get_template(template_id)
    active_version_id = template_details.get("active_version_id")
    assert active_version_id is not None, "No active version found"

    # Get rich parameters for the active version - mocked by fixture
    rich_params = await coder_client.get_template_version_rich_parameters(
        active_version_id
    )

    # Assertions
    assert isinstance(rich_params, list)
    assert len(rich_params) > 0, "Template should have rich parameters"
    assert rich_params == mock_get_template_version_rich_parameters

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
