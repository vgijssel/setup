"""Pytest fixtures for fleet-mcp tests with version-aware caching and respx mocking

This module provides pytest fixtures that:
- Load responses from VCR cassettes
- Configure respx to mock HTTP requests
- Are version-aware (re-record when Coder version changes)
- Fail tests if unmocked requests are made
"""

import json
import re
import subprocess
from pathlib import Path
from typing import Any, Dict

import pytest
import respx
import yaml
from httpx import Response

# ============================================================================
# Version-Aware Caching
# ============================================================================


def get_coder_version() -> str:
    """Get Coder version for cache key

    Returns:
        Version string (e.g., "v2.27.1")
    """
    try:
        result = subprocess.run(
            ["coder", "--version"], capture_output=True, text=True, timeout=5
        )
        # Parse version from output like "Coder v2.27.1+230b55b ..."
        match = re.search(r"Coder (v[\d.]+)", result.stdout)
        if match:
            return match.group(1)
    except Exception:
        pass
    return "unknown"


@pytest.fixture(scope="session")
def coder_version():
    """Fixture providing Coder version for version-aware caching"""
    return get_coder_version()


@pytest.fixture(scope="session")
def cassette_dir():
    """Fixture providing cassette directory path"""
    return Path(__file__).parent / "cassettes"


def get_cassette_path(cassette_dir: Path, cassette_name: str, version: str) -> Path:
    """Get version-aware cassette path

    Args:
        cassette_dir: Directory containing cassettes
        cassette_name: Name of cassette (without .yaml)
        version: Coder version for cache key

    Returns:
        Path to cassette file (version-aware if it exists, otherwise base)
    """
    # Try version-specific cassette first
    version_cassette = cassette_dir / f"{cassette_name}_{version}.yaml"
    if version_cassette.exists():
        return version_cassette

    # Fall back to base cassette
    base_cassette = cassette_dir / f"{cassette_name}.yaml"
    return base_cassette


# ============================================================================
# Cassette Loading Utilities
# ============================================================================


def load_cassette_response(
    cassette_path: Path, interaction_index: int = 0
) -> Dict[str, Any]:
    """Load a response from a VCR cassette file

    Args:
        cassette_path: Path to cassette file
        interaction_index: Index of the interaction to load (default: 0)

    Returns:
        Dictionary containing the response data
    """
    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path, "r") as f:
        cassette_data = yaml.safe_load(f)

    interactions = cassette_data.get("interactions", [])
    if interaction_index >= len(interactions):
        raise IndexError(
            f"Interaction index {interaction_index} out of range "
            f"(cassette has {len(interactions)} interactions)"
        )

    interaction = interactions[interaction_index]
    response = interaction.get("response", {})

    # Parse body if it's JSON
    body = response.get("body", {}).get("string", "")
    if body:
        try:
            response["parsed_body"] = json.loads(body)
        except json.JSONDecodeError:
            response["parsed_body"] = body

    return response


def load_all_cassette_responses(cassette_path: Path) -> list[Dict[str, Any]]:
    """Load all responses from a cassette

    Args:
        cassette_path: Path to cassette file

    Returns:
        List of all response dictionaries
    """
    if not cassette_path.exists():
        raise FileNotFoundError(f"Cassette not found: {cassette_path}")

    with open(cassette_path, "r") as f:
        cassette_data = yaml.safe_load(f)

    interactions = cassette_data.get("interactions", [])
    responses = []

    for interaction in interactions:
        response = interaction.get("response", {})
        body = response.get("body", {}).get("string", "")
        if body:
            try:
                response["parsed_body"] = json.loads(body)
            except json.JSONDecodeError:
                response["parsed_body"] = body
        responses.append(response)

    return responses


# ============================================================================
# Respx Configuration
# ============================================================================


@pytest.fixture
def respx_mock():
    """Configure respx to fail on unmocked requests

    This fixture ensures tests fail if they try to make HTTP requests
    that haven't been mocked.
    """
    with respx.mock(assert_all_called=False, assert_all_mocked=True) as mock:
        yield mock


# ============================================================================
# Base Configuration Fixtures
# ============================================================================


@pytest.fixture
def coder_base_url():
    """Base URL for Coder API (mocked)"""
    return "https://coder.example.com"


@pytest.fixture
def coder_token():
    """Coder API token (placeholder for mocked requests)"""
    return "test-token"


# ============================================================================
# Coder Client Fixtures
# ============================================================================


@pytest.fixture
def coder_client(coder_base_url, coder_token):
    """Configured CoderClient for testing"""
    from fleet_mcp.coder.client import CoderClient

    return CoderClient(base_url=coder_base_url, token=coder_token)


# ============================================================================
# Workspace Operation Fixtures
# ============================================================================


@pytest.fixture
def mock_list_workspaces(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock list_workspaces API call"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_list_workspaces", coder_version
    )
    response = load_cassette_response(cassette_path)
    workspaces_response = response.get("parsed_body", [])

    # Mock the HTTP GET request
    respx_mock.get(f"{coder_base_url}/api/v2/workspaces").respond(
        status_code=200, json=workspaces_response
    )

    return workspaces_response


@pytest.fixture
def mock_list_templates(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock list_templates API call"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_create_workspace", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)
    templates = responses[0].get("parsed_body", [])

    respx_mock.get(f"{coder_base_url}/api/v2/templates").respond(
        status_code=200, json=templates
    )

    return templates


@pytest.fixture
def mock_get_template(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock get_template API call"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_create_workspace", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)
    template_details = responses[1].get("parsed_body", {})
    template_id = template_details.get("id")

    respx_mock.get(f"{coder_base_url}/api/v2/templates/{template_id}").respond(
        status_code=200, json=template_details
    )

    return template_details


@pytest.fixture
def mock_get_template_rich_parameters(
    respx_mock, coder_base_url, cassette_dir, coder_version, mock_get_template
):
    """Mock get_template_version_rich_parameters API call"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_create_workspace", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)
    rich_params = responses[2].get("parsed_body", [])
    version_id = mock_get_template.get("active_version_id")

    respx_mock.get(
        f"{coder_base_url}/api/v2/templateversions/{version_id}/rich-parameters"
    ).respond(status_code=200, json=rich_params)

    return rich_params


@pytest.fixture
def mock_create_workspace(
    respx_mock,
    coder_base_url,
    cassette_dir,
    coder_version,
    mock_list_templates,
    mock_get_template,
    mock_get_template_rich_parameters,
):
    """Mock create_workspace API call with all dependencies"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_create_workspace", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)
    workspace = responses[3].get("parsed_body", {})

    respx_mock.post(f"{coder_base_url}/api/v2/organizations/coder/workspaces").respond(
        status_code=201, json=workspace
    )

    return workspace


@pytest.fixture
def mock_get_workspace(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock get_workspace API call"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_delete_workspace", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)

    # Get a workspace response (usually after create)
    for response in responses:
        body = response.get("parsed_body", {})
        if isinstance(body, dict) and "latest_build" in body:
            workspace_id = body.get("id")
            respx_mock.get(
                f"{coder_base_url}/api/v2/workspaces/{workspace_id}"
            ).respond(status_code=200, json=body)
            return body

    return {}


@pytest.fixture
def mock_delete_workspace(respx_mock, coder_base_url, mock_get_workspace):
    """Mock delete_workspace API call"""
    workspace_id = mock_get_workspace.get("id")
    delete_response = {"message": "Workspace deleted"}

    respx_mock.delete(f"{coder_base_url}/api/v2/workspaces/{workspace_id}").respond(
        status_code=200, json=delete_response
    )

    return delete_response


# ============================================================================
# Task API Fixtures
# ============================================================================


@pytest.fixture
def mock_get_task_exists(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock get_task API call when task exists"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_get_task_exists", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)

    # Get workspace info
    workspaces = responses[0].get("parsed_body", [])
    if workspaces:
        workspace = workspaces[0]
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        # Mock list workspaces
        respx_mock.get(f"{coder_base_url}/api/v2/workspaces").respond(
            status_code=200, json=workspaces
        )

        # Mock get task
        task = responses[1].get("parsed_body", {})
        respx_mock.get(
            f"{coder_base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai"
        ).respond(status_code=200, json=task)

        return {"workspace": workspace, "task": task}

    return {}


@pytest.fixture
def mock_get_task_not_found(respx_mock, coder_base_url):
    """Mock get_task API call when task not found (404)"""
    fake_workspace_id = "00000000-0000-0000-0000-000000000000"
    fake_username = "nonexistent"

    respx_mock.get(
        f"{coder_base_url}/api/v2/users/{fake_username}/workspace/{fake_workspace_id}/tasks/ai"
    ).respond(status_code=404, json={"message": "Not found"})

    return {"workspace_id": fake_workspace_id, "username": fake_username}


@pytest.fixture
def mock_send_task_input(
    respx_mock, coder_base_url, cassette_dir, coder_version, mock_list_workspaces
):
    """Mock send_task_input API call"""
    if mock_list_workspaces:
        workspace = mock_list_workspaces[0]
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        respx_mock.post(
            f"{coder_base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai/messages"
        ).respond(status_code=204)

        return {"workspace": workspace}

    return {}


@pytest.fixture
def mock_send_interrupt(
    respx_mock, coder_base_url, cassette_dir, coder_version, mock_list_workspaces
):
    """Mock send_interrupt API call"""
    if mock_list_workspaces:
        workspace = mock_list_workspaces[0]
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        respx_mock.post(
            f"{coder_base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai/messages"
        ).respond(status_code=204)

        return {"workspace": workspace}

    return {}


@pytest.fixture
def mock_get_task_logs(
    respx_mock, coder_base_url, cassette_dir, coder_version, mock_list_workspaces
):
    """Mock get_task_logs API call"""
    cassette_path = get_cassette_path(cassette_dir, "test_get_task_logs", coder_version)
    responses = load_all_cassette_responses(cassette_path)

    if mock_list_workspaces:
        workspace = mock_list_workspaces[0]
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")

        logs = responses[1].get("parsed_body", [])
        respx_mock.get(
            f"{coder_base_url}/api/v2/users/{owner_name}/workspace/{workspace_id}/tasks/ai/logs"
        ).respond(status_code=200, json=logs)

        return {"workspace": workspace, "logs": logs}

    return {}


# ============================================================================
# MCP Tool Fixtures (for contract tests)
# ============================================================================


@pytest.fixture
def agent_server(coder_base_url, coder_token):
    """FastMCP server with agent management and discovery tools"""
    from fastmcp import FastMCP
    from fleet_mcp.coder.client import CoderClient
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools

    mcp = FastMCP("Agent Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)
    return mcp


@pytest.fixture
def full_server(coder_base_url, coder_token):
    """FastMCP server with all tools (agent, task, discovery)"""
    from fastmcp import FastMCP
    from fleet_mcp.coder.client import CoderClient
    from fleet_mcp.tools.agent_management import register_agent_tools
    from fleet_mcp.tools.discovery import register_discovery_tools
    from fleet_mcp.tools.task_management import register_task_tools

    mcp = FastMCP("Full Test Server")
    coder_client = CoderClient(base_url=coder_base_url, token=coder_token)
    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)
    return mcp


# ============================================================================
# MCP Tool Response Mocking Fixtures
# ============================================================================


@pytest.fixture
def mock_list_agent_projects(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock list_agent_projects tool dependencies"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_list_agent_projects_success", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)

    # Mock templates list
    templates = responses[0].get("parsed_body", [])
    respx_mock.get(f"{coder_base_url}/api/v2/templates").respond(
        status_code=200, json=templates
    )

    # Mock rich parameters for each template
    for i in range(1, len(responses)):
        template_version_data = responses[i].get("parsed_body")
        if template_version_data:
            # Extract version ID from request URI if available
            # For now, just mock with pattern matching
            respx_mock.get(
                url__regex=r".*/api/v2/templateversions/.*/rich-parameters"
            ).respond(status_code=200, json=template_version_data)

    return templates


@pytest.fixture
def mock_list_agent_roles(respx_mock, coder_base_url, cassette_dir, coder_version):
    """Mock list_agent_roles tool dependencies"""
    cassette_path = get_cassette_path(
        cassette_dir, "test_list_agent_roles_success", coder_version
    )
    responses = load_all_cassette_responses(cassette_path)

    # Get templates and rich parameters
    if len(responses) >= 2:
        templates = responses[0].get("parsed_body", [])
        respx_mock.get(f"{coder_base_url}/api/v2/templates").respond(
            status_code=200, json=templates
        )

        # Get first template details
        if templates:
            template = templates[0]
            template_id = template.get("id")
            respx_mock.get(f"{coder_base_url}/api/v2/templates/{template_id}").respond(
                status_code=200, json=template
            )

        # Mock rich parameters
        rich_params = responses[-1].get("parsed_body", [])
        respx_mock.get(url__regex=r".*/rich-parameters").respond(
            status_code=200, json=rich_params
        )

    return responses


# ============================================================================
# Helper Functions for Tests
# ============================================================================


def parse_tool_result(result):
    """Helper to parse JSON result from MCP tool call"""
    assert len(result.content) > 0, "Tool result has no content"
    content = result.content[0]
    assert hasattr(content, "text"), "Content has no text attribute"
    return json.loads(content.text)
