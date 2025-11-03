"""Unit tests for workspace helper functions"""

import pytest


class MockAgentRepository:
    """Mock AgentRepository for testing"""

    def __init__(self, workspaces):
        self._workspaces = workspaces

    async def list_agents(self):
        return self._workspaces


async def get_workspace_by_name(repo, name):
    """Helper function to test workspace lookup logic"""
    workspaces = await repo.list_agents()
    name_lower = name.lower()
    expected_workspace_name = f"agent-{name_lower}"

    for workspace in workspaces:
        workspace_name = workspace.get("name", "")
        if workspace_name.lower() == expected_workspace_name:
            return workspace

    return None


@pytest.mark.asyncio
async def test_get_workspace_by_name_exact_match():
    """Test get_workspace_by_name with exact case match"""
    workspaces = [
        {"id": "ws-1", "name": "agent-papi", "metadata": {}},
        {"id": "ws-2", "name": "agent-sony", "metadata": {}},
    ]
    repo = MockAgentRepository(workspaces)

    result = await get_workspace_by_name(repo, "papi")

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
    repo = MockAgentRepository(workspaces)

    result = await get_workspace_by_name(repo, "PAPI")

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
    repo = MockAgentRepository(workspaces)

    result = await get_workspace_by_name(repo, "Papi")

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
    repo = MockAgentRepository(workspaces)

    result = await get_workspace_by_name(repo, "nonexistent")

    assert result is None


@pytest.mark.asyncio
async def test_get_workspace_by_name_workspace_name_uppercase():
    """Test get_workspace_by_name with uppercase workspace names"""
    workspaces = [
        {"id": "ws-1", "name": "agent-PAPI", "metadata": {}},
        {"id": "ws-2", "name": "agent-Sony", "metadata": {}},
    ]
    repo = MockAgentRepository(workspaces)

    # Test lowercase query with uppercase workspace name
    result = await get_workspace_by_name(repo, "papi")
    assert result is not None
    assert result["id"] == "ws-1"

    # Test exact case
    result = await get_workspace_by_name(repo, "PAPI")
    assert result is not None
    assert result["id"] == "ws-1"

    # Test mixed case for second agent
    result = await get_workspace_by_name(repo, "sony")
    assert result is not None
    assert result["id"] == "ws-2"


@pytest.mark.asyncio
async def test_get_workspace_by_name_empty_workspaces():
    """Test get_workspace_by_name with no workspaces"""
    workspaces = []
    repo = MockAgentRepository(workspaces)

    result = await get_workspace_by_name(repo, "papi")

    assert result is None
