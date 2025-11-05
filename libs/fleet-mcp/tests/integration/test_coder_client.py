"""Integration tests for Coder API client"""

import sys
from pathlib import Path

import httpx
import pytest
import respx
from fleet_mcp.coder.client import CoderClient

# Add the tests directory to sys.path to enable fixture imports
tests_dir = Path(__file__).parent.parent
if str(tests_dir) not in sys.path:
    sys.path.insert(0, str(tests_dir))

from fixtures import (  # noqa: E402
    create_rich_parameter,
    create_template,
    create_workspace,
    generated,
    manual,
)


# T013: CoderClient initialization test
def test_coder_client_initialization(coder_base_url, coder_token):
    """Test CoderClient can be initialized"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    assert client.base_url == coder_base_url.rstrip("/")
    assert client.token == coder_token
    assert client.client is not None


# T014: Workspace creation test with RESPX
@pytest.mark.asyncio
@respx.mock
async def test_create_workspace(coder_base_url, coder_token):
    """Test workspace creation via Coder API"""
    # Setup mocks using respx.route()
    templates = [
        create_template(
            template_id="template-123",
            name="coder-devcontainer",
            display_name="Setup",
        )
    ]
    respx.route(url=f"{coder_base_url}/api/v2/templates").mock(
        return_value=httpx.Response(200, json=templates)
    )

    respx.route(url=f"{coder_base_url}/api/v2/templates/template-123").mock(
        return_value=httpx.Response(200, json=templates[0])
    )

    presets = [
        {
            "ID": "preset-coder",
            "Name": "Coder",
            "Parameters": [],
            "Default": True,
            "DesiredPrebuildInstances": 0,
            "Description": "",
            "Icon": "",
        }
    ]
    respx.route(
        url=f"{coder_base_url}/api/v2/templateversions/version-123/presets"
    ).mock(return_value=httpx.Response(200, json=presets))

    respx.route(
        url=f"{coder_base_url}/api/v2/templateversions/version-123/rich-parameters"
    ).mock(return_value=httpx.Response(200, json=[]))

    user_data = {
        "id": "user-123",
        "username": "test-user",
        "email": "test@example.com",
    }
    respx.route(url=f"{coder_base_url}/api/v2/users/me").mock(
        return_value=httpx.Response(200, json=user_data)
    )

    # Mock get organizations endpoint
    orgs_data = [
        {
            "id": "org-123",
            "name": "test-org",
            "display_name": "Test Organization",
        }
    ]
    respx.route(url=f"{coder_base_url}/api/v2/users/me/organizations").mock(
        return_value=httpx.Response(200, json=orgs_data)
    )

    workspace_response = create_workspace(
        workspace_id="ws-create-123",
        name="test-ws-create-001",
        template_name="coder-devcontainer",
    )
    # Use regex for dynamic URL parts
    respx.route(
        url__regex=rf"{coder_base_url}/api/v2/organizations/.*/members/.*/workspaces$"
    ).mock(return_value=httpx.Response(201, json=workspace_response))

    # Now create client and make request
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspace = await client.create_workspace(
        name="test-ws-create-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    assert workspace is not None
    assert "id" in workspace
    assert workspace.get("name") == "test-ws-create-001"


# T015: Workspace listing test with RESPX
@pytest.mark.asyncio
@respx.mock
async def test_list_workspaces(coder_base_url, coder_token):
    """Test listing workspaces via Coder API"""
    # Setup mocks using respx.route()
    workspaces = [
        create_workspace(
            workspace_id="ws-1",
            name="fleet-agent-1",
            metadata={"fleet_mcp_agent_name": "agent-1"},
        ),
        create_workspace(
            workspace_id="ws-2",
            name="regular-workspace",
            metadata={},
        ),
        create_workspace(
            workspace_id="ws-3",
            name="fleet-agent-2",
            metadata={"fleet_mcp_agent_name": "agent-2"},
        ),
    ]

    respx.route(url=f"{coder_base_url}/api/v2/workspaces").mock(
        return_value=httpx.Response(200, json={"workspaces": workspaces, "count": 3})
    )

    # Now create client and make request
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    result = await client.list_workspaces()

    assert isinstance(result, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in result if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) == 2


# T016: Workspace deletion test with RESPX
@pytest.mark.skip(reason="RESPX POST mock has empty body issue - needs investigation")
@pytest.mark.asyncio
@respx.mock(assert_all_mocked=False)
async def test_delete_workspace(coder_base_url, coder_token):
    """Test workspace deletion via Coder API"""
    import json

    workspace_id = "ws-delete-123"

    # Setup mocks using respx.route()
    build_response = {
        "id": "build-delete-123",
        "workspace_id": workspace_id,
        "transition": "delete",
        "status": "pending",
    }
    # Coder API uses POST to /workspaces/{id}/builds with transition=delete
    # Use content parameter instead of json parameter for POST requests with respx
    respx.route(
        url=f"{coder_base_url}/api/v2/workspaces/{workspace_id}/builds", method="POST"
    ).mock(
        return_value=httpx.Response(
            201,
            content=json.dumps(build_response).encode(),
            headers={"content-type": "application/json"},
        )
    )

    # Now create client and make request
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    result = await client.delete_workspace(workspace_id)

    assert result is not None
    assert result.get("transition") == "delete"


# Test for get_template_version_rich_parameters - USING GENERATED FIXTURES!
@pytest.mark.asyncio
@respx.mock
async def test_get_template_version_rich_parameters(coder_base_url, coder_token):
    """Test getting rich parameters from a template version

    This test demonstrates the hybrid fixture approach:
    - Uses generated.make_list_templates_real() for real API data
    - Uses generated.make_get_template_version_rich_parameters_real() for real rich params
    """
    # Use GENERATED fixtures from real Coder API!
    templates = generated.make_list_templates_real()
    template = templates[0]  # Get first template
    template_id = template["id"]
    version_id = template["active_version_id"]

    # Setup mocks using REAL data
    respx.route(url=f"{coder_base_url}/api/v2/templates").mock(
        return_value=httpx.Response(200, json=templates)
    )

    respx.route(url=f"{coder_base_url}/api/v2/templates/{template_id}").mock(
        return_value=httpx.Response(200, json=template)
    )

    # Use GENERATED rich parameters from real API!
    rich_params = generated.make_get_template_version_rich_parameters_real()
    respx.route(
        url=f"{coder_base_url}/api/v2/templateversions/{version_id}/rich-parameters"
    ).mock(return_value=httpx.Response(200, json=rich_params))

    # Now create client and make requests
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # Get coder-devcontainer template
    templates_result = await client.list_templates()
    coder_template = next(
        (t for t in templates_result if t.get("name") == "coder-devcontainer"), None
    )
    assert coder_template is not None, "coder-devcontainer template not found"

    template_id_result = coder_template.get("id")

    # Get template details to get active version
    template_details = await client.get_template(template_id_result)
    active_version_id = template_details.get("active_version_id")
    assert active_version_id is not None, "No active version found"

    # Get rich parameters for the active version
    rich_params_result = await client.get_template_version_rich_parameters(
        active_version_id
    )

    assert isinstance(rich_params_result, list)
    assert len(rich_params_result) > 0, "Template should have rich parameters"

    # Check for required parameters
    param_names = [p.get("name") for p in rich_params_result]
    assert any(
        "ai" in name.lower() and "prompt" in name.lower() for name in param_names
    ), "Should have ai_prompt or 'AI Prompt' parameter"
    assert any(
        "system" in name.lower() and "prompt" in name.lower() for name in param_names
    ), "Should have system_prompt or 'System Prompt' parameter"

    # Verify parameter structure
    for param in rich_params_result:
        assert "name" in param
        assert "type" in param
        assert "description" in param or "description_plaintext" in param
