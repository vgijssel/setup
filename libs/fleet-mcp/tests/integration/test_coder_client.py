"""Integration tests for Coder API client"""
import pytest
from fleet_mcp.coder.client import CoderClient


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
        name="test-agent-create",
        template_name="setup-devcontainer",
        workspace_preset="coder",
        metadata={
            "fleet_mcp_agent_name": "test-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_agent_spec": "Test specification"
        }
    )

    assert workspace is not None
    assert "id" in workspace or "name" in workspace
    assert workspace.get("metadata", {}).get("fleet_mcp_agent_name") == "test-agent"


# T015: Workspace listing test with pytest-vcr
@pytest.mark.vcr
async def test_list_workspaces(coder_base_url, coder_token):
    """Test listing workspaces via Coder API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    workspaces = await client.list_workspaces()

    assert isinstance(workspaces, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in workspaces
        if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) >= 0


# T016: Workspace deletion test with pytest-vcr
@pytest.mark.vcr
async def test_delete_workspace(coder_base_url, coder_token):
    """Test workspace deletion via Coder API"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    # First create a workspace to delete
    workspace = await client.create_workspace(
        name="test-agent-delete",
        template_name="setup-devcontainer",
        workspace_preset="coder",
        metadata={
            "fleet_mcp_agent_name": "test-delete",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_agent_spec": "Delete test"
        }
    )

    workspace_id = workspace.get("id")
    assert workspace_id is not None

    # Now delete it
    result = await client.delete_workspace(workspace_id)
    assert result is not None
