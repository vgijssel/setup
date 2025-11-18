"""Tests for AgentRepository update method."""

from unittest.mock import AsyncMock, MagicMock

import pytest
from fleet_mcp.models import Agent, AgentStatus
from fleet_mcp.models.errors import AgentNotFoundError, CoderAPIError
from fleet_mcp.repositories import AgentRepository


@pytest.fixture
def mock_coder_client():
    """Create a mock CoderClient."""
    client = MagicMock()
    client.list_workspaces = AsyncMock()
    client.get_workspace = AsyncMock()
    client.get_template = AsyncMock()
    client.update_workspace = AsyncMock()
    client.list_workspace_presets = AsyncMock()
    return client


@pytest.fixture
def agent_repository(mock_coder_client):
    """Create an AgentRepository with mocked client."""
    return AgentRepository(mock_coder_client)


@pytest.mark.asyncio
async def test_update_agent_with_version_id(agent_repository, mock_coder_client):
    """Test updating agent with explicit template version ID."""
    agent_name = "test-agent"
    workspace_id = "ws-123"
    template_version_id = "ver-456"

    # Mock workspace lookup
    mock_coder_client.list_workspaces.return_value = [
        {
            "id": workspace_id,
            "name": agent_name,
            "template_id": "tpl-789",
            "template_display_name": "Setup",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z",
        }
    ]

    # Mock full workspace details
    mock_coder_client.get_workspace.return_value = {
        "id": workspace_id,
        "name": agent_name,
        "template_id": "tpl-789",
        "template_display_name": "Setup",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
        "latest_build": {
            "id": "build-123",
            "status": "running",
            "template_version_id": template_version_id,
            "template_version_preset_id": "preset-111",
            "resources": [
                {
                    "agents": [
                        {
                            "status": "connected",
                            "lifecycle_state": "ready",
                            "apps": [],
                        }
                    ]
                }
            ],
        },
    }

    # Mock workspace update
    mock_coder_client.update_workspace.return_value = {
        "id": workspace_id,
        "name": agent_name,
        "template_id": "tpl-789",
        "template_display_name": "Setup",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T01:00:00Z",
        "latest_build": {
            "id": "build-456",
            "status": "running",
            "template_version_id": template_version_id,
            "template_version_preset_id": "preset-111",
            "resources": [
                {
                    "agents": [
                        {
                            "status": "connected",
                            "lifecycle_state": "ready",
                            "apps": [],
                        }
                    ]
                }
            ],
        },
    }

    # Mock presets
    mock_coder_client.list_workspace_presets.return_value = [
        {"ID": "preset-111", "Name": "coder"}
    ]

    # Execute update
    result = await agent_repository.update(agent_name, template_version_id)

    # Verify result
    assert isinstance(result, Agent)
    assert result.name == agent_name
    assert result.workspace_id == workspace_id
    assert result.status == AgentStatus.IDLE

    # Verify API calls
    mock_coder_client.list_workspaces.assert_called_once()
    mock_coder_client.update_workspace.assert_called_once_with(
        workspace_id, template_version_id
    )


@pytest.mark.asyncio
async def test_update_agent_without_version_id(agent_repository, mock_coder_client):
    """Test updating agent to active template version."""
    agent_name = "test-agent"
    workspace_id = "ws-123"
    template_id = "tpl-789"
    active_version_id = "ver-active-999"

    # Mock workspace lookup
    mock_coder_client.list_workspaces.return_value = [
        {
            "id": workspace_id,
            "name": agent_name,
            "template_id": template_id,
            "template_display_name": "Setup",
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z",
        }
    ]

    # Mock workspace details (for getting template_id)
    mock_coder_client.get_workspace.return_value = {
        "id": workspace_id,
        "name": agent_name,
        "template_id": template_id,
        "template_display_name": "Setup",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z",
        "latest_build": {
            "id": "build-123",
            "status": "running",
            "template_version_id": "ver-old-888",
            "template_version_preset_id": "preset-111",
            "resources": [
                {
                    "agents": [
                        {
                            "status": "connected",
                            "lifecycle_state": "ready",
                            "apps": [],
                        }
                    ]
                }
            ],
        },
    }

    # Mock template with active version
    mock_coder_client.get_template.return_value = {
        "id": template_id,
        "name": "Setup",
        "active_version_id": active_version_id,
    }

    # Mock workspace update result
    mock_coder_client.update_workspace.return_value = {
        "id": workspace_id,
        "name": agent_name,
        "template_id": template_id,
        "template_display_name": "Setup",
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T02:00:00Z",
        "latest_build": {
            "id": "build-789",
            "status": "running",
            "template_version_id": active_version_id,
            "template_version_preset_id": "preset-111",
            "resources": [
                {
                    "agents": [
                        {
                            "status": "connected",
                            "lifecycle_state": "ready",
                            "apps": [],
                        }
                    ]
                }
            ],
        },
    }

    # Mock presets
    mock_coder_client.list_workspace_presets.return_value = [
        {"ID": "preset-111", "Name": "coder"}
    ]

    # Execute update without version ID
    result = await agent_repository.update(agent_name, None)

    # Verify result
    assert isinstance(result, Agent)
    assert result.name == agent_name
    assert result.workspace_id == workspace_id

    # Verify API calls
    mock_coder_client.get_workspace.assert_called()
    mock_coder_client.get_template.assert_called_once_with(template_id)
    mock_coder_client.update_workspace.assert_called_once_with(
        workspace_id, active_version_id
    )


@pytest.mark.asyncio
async def test_update_agent_not_found(agent_repository, mock_coder_client):
    """Test updating non-existent agent."""
    agent_name = "nonexistent-agent"

    # Mock empty workspace list
    mock_coder_client.list_workspaces.return_value = []

    # Execute and expect AgentNotFoundError
    with pytest.raises(AgentNotFoundError, match="not found"):
        await agent_repository.update(agent_name, "ver-123")


@pytest.mark.asyncio
async def test_update_agent_no_active_version(agent_repository, mock_coder_client):
    """Test updating agent when template has no active version."""
    agent_name = "test-agent"
    workspace_id = "ws-123"
    template_id = "tpl-789"

    # Mock workspace lookup
    mock_coder_client.list_workspaces.return_value = [
        {
            "id": workspace_id,
            "name": agent_name,
            "template_id": template_id,
            "template_display_name": "Setup",
        }
    ]

    # Mock workspace details
    mock_coder_client.get_workspace.return_value = {
        "id": workspace_id,
        "name": agent_name,
        "template_id": template_id,
        "latest_build": {"status": "running"},
    }

    # Mock template with no active version
    mock_coder_client.get_template.return_value = {
        "id": template_id,
        "name": "Setup",
        "active_version_id": None,  # No active version
    }

    # Execute and expect CoderAPIError
    with pytest.raises(CoderAPIError, match="no active version"):
        await agent_repository.update(agent_name, None)
