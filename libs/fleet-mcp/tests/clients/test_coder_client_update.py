"""Tests for CoderClient update_workspace method."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fleet_mcp.clients import CoderClient
from fleet_mcp.clients.exceptions import HTTPError, NotFoundError


@pytest.fixture
def mock_httpx_client():
    """Create a mock httpx.AsyncClient."""
    client = MagicMock()
    client.aclose = AsyncMock()
    return client


@pytest.fixture
def coder_client(mock_httpx_client):
    """Create a CoderClient with mocked httpx client."""
    with patch("fleet_mcp.clients.coder_client.httpx.AsyncClient") as mock_client_class:
        mock_client_class.return_value = mock_httpx_client
        client = CoderClient(base_url="https://coder.example.com", token="test-token")
        yield client


@pytest.mark.asyncio
async def test_update_workspace_success(coder_client, mock_httpx_client):
    """Test successful workspace update to new template version."""
    workspace_id = "ws-123"
    template_version_id = "ver-456"

    # Mock stop response
    stop_response = MagicMock()
    stop_response.raise_for_status = MagicMock()
    stop_response.json.return_value = {"id": "build-stop-123", "status": "stopping"}

    # Mock stop build status (completed)
    stop_status_response = MagicMock()
    stop_status_response.raise_for_status = MagicMock()
    stop_status_response.json.return_value = {
        "id": "build-stop-123",
        "status": "stopped",
    }

    # Mock start response
    start_response = MagicMock()
    start_response.raise_for_status = MagicMock()
    start_response.json.return_value = {"id": "build-start-456", "status": "starting"}

    # Mock start build status (completed)
    start_status_response = MagicMock()
    start_status_response.raise_for_status = MagicMock()
    start_status_response.json.return_value = {
        "id": "build-start-456",
        "status": "running",
    }

    # Mock final workspace data
    final_workspace_response = MagicMock()
    final_workspace_response.raise_for_status = MagicMock()
    final_workspace_response.json.return_value = {
        "id": workspace_id,
        "name": "test-workspace",
        "template_id": "tpl-123",
        "latest_build": {
            "id": "build-start-456",
            "status": "running",
            "template_version_id": template_version_id,
        },
    }

    # Set up mock responses in order
    mock_httpx_client.post = AsyncMock(side_effect=[stop_response, start_response])
    mock_httpx_client.get = AsyncMock(
        side_effect=[
            stop_status_response,  # Check stop build status
            start_status_response,  # Check start build status (running = completed)
            final_workspace_response,  # Get final workspace data
        ]
    )

    # Execute update
    result = await coder_client.update_workspace(workspace_id, template_version_id)

    # Verify the result
    assert result["id"] == workspace_id
    assert result["name"] == "test-workspace"
    assert result["latest_build"]["template_version_id"] == template_version_id

    # Verify API calls
    assert mock_httpx_client.post.call_count == 2
    assert mock_httpx_client.get.call_count == 3

    # Verify stop build call
    stop_call = mock_httpx_client.post.call_args_list[0]
    assert f"/workspaces/{workspace_id}/builds" in stop_call[0][0]
    assert stop_call[1]["json"] == {"transition": "stop"}

    # Verify start build call with template version
    start_call = mock_httpx_client.post.call_args_list[1]
    assert f"/workspaces/{workspace_id}/builds" in start_call[0][0]
    assert start_call[1]["json"] == {
        "transition": "start",
        "template_version_id": template_version_id,
    }


@pytest.mark.asyncio
async def test_update_workspace_not_found(coder_client, mock_httpx_client):
    """Test update_workspace with non-existent workspace."""
    import httpx

    workspace_id = "ws-nonexistent"
    template_version_id = "ver-456"

    # Mock 404 response
    error_response = MagicMock()
    error_response.status_code = 404
    error_response.json.return_value = {"message": "Workspace not found"}

    stop_response = MagicMock()
    stop_response.raise_for_status.side_effect = httpx.HTTPStatusError(
        "404", request=MagicMock(), response=error_response
    )
    stop_response.status_code = 404

    mock_httpx_client.post = AsyncMock(return_value=stop_response)

    # Execute and expect NotFoundError
    with pytest.raises(NotFoundError, match="not found"):
        await coder_client.update_workspace(workspace_id, template_version_id)


@pytest.mark.asyncio
async def test_update_workspace_stop_timeout(coder_client, mock_httpx_client):
    """Test update_workspace with stop build timeout."""
    workspace_id = "ws-123"
    template_version_id = "ver-456"

    # Mock stop response
    stop_response = MagicMock()
    stop_response.raise_for_status = MagicMock()
    stop_response.json.return_value = {"id": "build-stop-123", "status": "stopping"}

    # Mock stop build status (never completes)
    stop_status_response = MagicMock()
    stop_status_response.raise_for_status = MagicMock()
    stop_status_response.json.return_value = {
        "id": "build-stop-123",
        "status": "stopping",
    }

    mock_httpx_client.post = AsyncMock(return_value=stop_response)
    mock_httpx_client.get = AsyncMock(return_value=stop_status_response)

    # Execute with very short timeout and expect HTTPError
    with pytest.raises(HTTPError, match="did not complete"):
        await coder_client.update_workspace(
            workspace_id, template_version_id, max_stop_attempts=2
        )


@pytest.mark.asyncio
async def test_get_template_version(coder_client, mock_httpx_client):
    """Test get_template_version method."""
    version_id = "ver-123"

    # Mock response
    response = MagicMock()
    response.raise_for_status = MagicMock()
    response.json.return_value = {
        "id": version_id,
        "name": "v1.2.3",
        "template_id": "tpl-456",
        "created_at": "2025-01-01T00:00:00Z",
    }

    mock_httpx_client.get = AsyncMock(return_value=response)

    # Execute
    result = await coder_client.get_template_version(version_id)

    # Verify
    assert result["id"] == version_id
    assert result["name"] == "v1.2.3"
    assert result["template_id"] == "tpl-456"

    # Verify API call
    mock_httpx_client.get.assert_called_once()
    call_args = mock_httpx_client.get.call_args
    assert f"/templateversions/{version_id}" in call_args[0][0]


@pytest.mark.asyncio
async def test_get_template_version_not_found(coder_client, mock_httpx_client):
    """Test get_template_version with non-existent version."""
    import httpx

    version_id = "ver-nonexistent"

    # Mock 404 response
    error_response = MagicMock()
    error_response.status_code = 404

    response = MagicMock()
    response.raise_for_status.side_effect = httpx.HTTPStatusError(
        "404", request=MagicMock(), response=error_response
    )
    response.status_code = 404

    mock_httpx_client.get = AsyncMock(return_value=response)

    # Execute and expect NotFoundError
    with pytest.raises(NotFoundError, match="not found"):
        await coder_client.get_template_version(version_id)
