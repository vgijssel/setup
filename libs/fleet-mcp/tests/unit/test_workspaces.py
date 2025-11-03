"""Unit tests for workspace helper functions"""

import pytest

from fleet_mcp.coder.workspaces import get_workspace_by_name


class MockCoderClient:
    """Mock CoderClient for testing"""

    def __init__(self, workspaces):
        self._workspaces = workspaces

    async def list_workspaces(self):
        return self._workspaces


@pytest.mark.asyncio
async def test_get_workspace_by_name_exact_match():
    """Test get_workspace_by_name with exact case match"""
    workspaces = [
        {"id": "ws-1", "name": "agent-papi", "metadata": {}},
        {"id": "ws-2", "name": "agent-sony", "metadata": {}},
    ]
    client = MockCoderClient(workspaces)

    result = await get_workspace_by_name(client, "papi")

    assert result is not None
    assert result["id"] == "ws-1"
    assert result["name"] == "agent-papi"


@pytest.mark.asyncio
async def test_get_workspace_by_name_uppercase():
    """Test get_workspace_by_name with uppercase query for lowercase agent"""
    workspaces = [
        {"id": "ws-1", "name": "agent-papi", "metadata": {}},
        {"id": "ws-2", "name": "agent-sony", "metadata": {}},
    ]
    client = MockCoderClient(workspaces)

    result = await get_workspace_by_name(client, "PAPI")

    assert result is not None
    assert result["id"] == "ws-1"
    assert result["name"] == "agent-papi"


@pytest.mark.asyncio
async def test_get_workspace_by_name_mixedcase():
    """Test get_workspace_by_name with mixed case query"""
    workspaces = [
        {"id": "ws-1", "name": "agent-papi", "metadata": {}},
        {"id": "ws-2", "name": "agent-sony", "metadata": {}},
    ]
    client = MockCoderClient(workspaces)

    result = await get_workspace_by_name(client, "Papi")

    assert result is not None
    assert result["id"] == "ws-1"
    assert result["name"] == "agent-papi"


@pytest.mark.asyncio
async def test_get_workspace_by_name_not_found():
    """Test get_workspace_by_name returns None when agent not found"""
    workspaces = [
        {"id": "ws-1", "name": "agent-papi", "metadata": {}},
        {"id": "ws-2", "name": "agent-sony", "metadata": {}},
    ]
    client = MockCoderClient(workspaces)

    result = await get_workspace_by_name(client, "nonexistent")

    assert result is None


@pytest.mark.asyncio
async def test_get_workspace_by_name_workspace_name_uppercase():
    """Test get_workspace_by_name with uppercase workspace names"""
    workspaces = [
        {"id": "ws-1", "name": "agent-PAPI", "metadata": {}},
        {"id": "ws-2", "name": "agent-Sony", "metadata": {}},
    ]
    client = MockCoderClient(workspaces)

    # Test lowercase query with uppercase workspace name
    result = await get_workspace_by_name(client, "papi")
    assert result is not None
    assert result["id"] == "ws-1"

    # Test exact case
    result = await get_workspace_by_name(client, "PAPI")
    assert result is not None
    assert result["id"] == "ws-1"

    # Test mixed case for second agent
    result = await get_workspace_by_name(client, "sony")
    assert result is not None
    assert result["id"] == "ws-2"


@pytest.mark.asyncio
async def test_get_workspace_by_name_empty_workspaces():
    """Test get_workspace_by_name with no workspaces"""
    workspaces = []
    client = MockCoderClient(workspaces)

    result = await get_workspace_by_name(client, "papi")

    assert result is None
