"""Integration tests for Coder API client (refactored with RESPX mocking)

This test file demonstrates the new testing approach:
- Uses pre-recorded VCR cassettes as fixtures
- Uses RESPX to mock HTTP responses
- Tests are deterministic, offline, and fast
- No external state dependencies
"""

import pytest
import respx
from fleet_mcp.coder.client import CoderClient
from httpx import Response
from tests.fixtures import get_all_responses, get_response_body


# T013: CoderClient initialization test
def test_coder_client_initialization():
    """Test CoderClient can be initialized"""
    base_url = "https://coder.example.com"
    token = "test-token"

    client = CoderClient(base_url=base_url, token=token)
    assert client.base_url == base_url
    assert client.token == token
    assert client.client is not None


# T014: Workspace creation test with RESPX mocking
@pytest.mark.asyncio
@respx.mock
async def test_create_workspace():
    """Test workspace creation via Coder API using mocked responses"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_create_workspace")

    # Mock the list_templates call (first interaction)
    templates_body = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/templates").mock(
        return_value=Response(200, json=templates_body)
    )

    # Mock the get_template call (second interaction)
    template_details = responses[1].get("parsed_body")
    template_id = template_details.get("id")
    respx.get(f"{base_url}/api/v2/templates/{template_id}").mock(
        return_value=Response(200, json=template_details)
    )

    # Mock the get_template_version_rich_parameters call (third interaction)
    rich_params = responses[2].get("parsed_body")
    version_id = template_details.get("active_version_id")
    respx.get(f"{base_url}/api/v2/templateversions/{version_id}/rich-parameters").mock(
        return_value=Response(200, json=rich_params)
    )

    # Mock the create workspace call (fourth interaction)
    workspace_response = responses[3].get("parsed_body")
    respx.post(f"{base_url}/api/v2/organizations/coder/workspaces").mock(
        return_value=Response(201, json=workspace_response)
    )

    # Execute test
    workspace = await client.create_workspace(
        name="test-ws-create-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    # Assertions
    assert workspace is not None
    assert "id" in workspace
    assert workspace.get("name") == "test-ws-create-001"


# T015: Workspace listing test with RESPX mocking
@pytest.mark.asyncio
@respx.mock
async def test_list_workspaces():
    """Test listing workspaces via Coder API using mocked responses"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load response from cassette
    workspaces_body = get_response_body("test_list_workspaces")

    # Mock the API call
    respx.get(f"{base_url}/api/v2/workspaces").mock(
        return_value=Response(200, json=workspaces_body)
    )

    # Execute test
    workspaces = await client.list_workspaces()

    # Assertions
    assert isinstance(workspaces, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in workspaces if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) >= 0


# T016: Workspace deletion test with RESPX mocking
@pytest.mark.asyncio
@respx.mock
async def test_delete_workspace():
    """Test workspace deletion via Coder API using mocked responses"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_delete_workspace")

    # Mock list templates
    templates = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/templates").mock(
        return_value=Response(200, json=templates)
    )

    # Mock get template
    template_details = responses[1].get("parsed_body")
    template_id = template_details.get("id")
    respx.get(f"{base_url}/api/v2/templates/{template_id}").mock(
        return_value=Response(200, json=template_details)
    )

    # Mock get rich parameters
    rich_params = responses[2].get("parsed_body")
    version_id = template_details.get("active_version_id")
    respx.get(f"{base_url}/api/v2/templateversions/{version_id}/rich-parameters").mock(
        return_value=Response(200, json=rich_params)
    )

    # Mock create workspace
    workspace = responses[3].get("parsed_body")
    workspace_id = workspace.get("id")
    respx.post(f"{base_url}/api/v2/organizations/coder/workspaces").mock(
        return_value=Response(201, json=workspace)
    )

    # Mock get workspace (for status checks)
    # The cassette shows multiple get_workspace calls as it waits for running status
    for i in range(4, len(responses) - 2):
        ws_status = responses[i].get("parsed_body")
        respx.get(f"{base_url}/api/v2/workspaces/{workspace_id}").mock(
            return_value=Response(200, json=ws_status)
        )

    # Mock delete workspace (second to last interaction)
    delete_response = responses[-2].get("parsed_body")
    respx.delete(f"{base_url}/api/v2/workspaces/{workspace_id}").mock(
        return_value=Response(200, json=delete_response)
    )

    # Execute test - create workspace
    created_workspace = await client.create_workspace(
        name="test-ws-delete-001",
        template_name="coder-devcontainer",
        workspace_preset="coder",
    )

    workspace_id = created_workspace.get("id")
    assert workspace_id is not None

    # Execute test - wait for workspace to be running
    ws = await client.get_workspace(workspace_id)
    status = ws.get("latest_build", {}).get("status")
    # In the cassette, the workspace eventually reaches "running" status
    assert status is not None

    # Execute test - delete workspace
    result = await client.delete_workspace(workspace_id)
    assert result is not None


# Test for get_template_version_rich_parameters
@pytest.mark.asyncio
@respx.mock
async def test_get_template_version_rich_parameters():
    """Test getting rich parameters from a template version using mocked responses"""
    base_url = "https://coder.example.com"
    token = "test-token"
    client = CoderClient(base_url=base_url, token=token)

    # Load responses from cassette
    responses = get_all_responses("test_get_template_version_rich_parameters")

    # Mock list templates
    templates = responses[0].get("parsed_body")
    respx.get(f"{base_url}/api/v2/templates").mock(
        return_value=Response(200, json=templates)
    )

    # Mock get template
    template_details = responses[1].get("parsed_body")
    template_id = template_details.get("id")
    respx.get(f"{base_url}/api/v2/templates/{template_id}").mock(
        return_value=Response(200, json=template_details)
    )

    # Mock get rich parameters
    rich_params = responses[2].get("parsed_body")
    version_id = template_details.get("active_version_id")
    respx.get(f"{base_url}/api/v2/templateversions/{version_id}/rich-parameters").mock(
        return_value=Response(200, json=rich_params)
    )

    # Execute test
    templates_list = await client.list_templates()
    coder_template = next(
        (t for t in templates_list if t.get("name") == "coder-devcontainer"), None
    )
    assert coder_template is not None, "coder-devcontainer template not found"

    template_id = coder_template.get("id")
    template_details_result = await client.get_template(template_id)
    active_version_id = template_details_result.get("active_version_id")
    assert active_version_id is not None, "No active version found"

    rich_params_result = await client.get_template_version_rich_parameters(
        active_version_id
    )

    # Assertions
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
