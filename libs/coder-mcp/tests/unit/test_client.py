"""Unit tests for Coder API client."""

import pytest
import httpx
from unittest.mock import AsyncMock, Mock, patch
from coder_mcp.client import CoderAPIClient
from coder_mcp.config import Config


@pytest.fixture
def mock_config(monkeypatch):
    """Mock configuration for testing."""
    monkeypatch.setenv("CODER_SESSION_TOKEN", "test-token")
    monkeypatch.setenv("CODER_URL", "https://test.coder.com")
    return Config()


@pytest.mark.asyncio
async def test_client_initialization(mock_config):
    """Test CoderAPIClient initialization."""
    client = CoderAPIClient(mock_config)

    assert client.base_url == "https://test.coder.com"
    assert client.session_token == "test-token"


@pytest.mark.asyncio
async def test_client_sets_auth_header(mock_config):
    """Test that client sets proper authentication header."""
    client = CoderAPIClient(mock_config)

    # Should have auth header in default headers
    assert "Coder-Session-Token" in client._client.headers or "authorization" in client._client.headers


@pytest.mark.asyncio
async def test_client_request_retry_on_failure(mock_config):
    """Test that client retries on transient failures."""
    client = CoderAPIClient(mock_config)

    with patch.object(client._client, "get") as mock_get:
        mock_get.side_effect = [
            httpx.ConnectError("Connection failed"),
            httpx.Response(200, json={"data": "success"}),
        ]

        # Should retry and eventually succeed
        # This test validates retry logic exists
        response = await client.get("/test")
        assert response is not None


@pytest.mark.asyncio
async def test_client_timeout_configuration(mock_config):
    """Test that client respects timeout configuration."""
    client = CoderAPIClient(mock_config)

    # Should have timeout configured
    assert client._client.timeout is not None


@pytest.mark.asyncio
async def test_client_get_method(mock_config):
    """Test client GET request method."""
    client = CoderAPIClient(mock_config)

    with patch.object(client._client, "get") as mock_get:
        mock_response = Mock(spec=httpx.Response)
        mock_response.status_code = 200
        mock_response.json.return_value = {"data": "test"}
        mock_get.return_value = mock_response

        response = await client.get("/api/test")

        mock_get.assert_called_once()
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_client_post_method(mock_config):
    """Test client POST request method."""
    client = CoderAPIClient(mock_config)

    with patch.object(client._client, "post") as mock_post:
        mock_response = Mock(spec=httpx.Response)
        mock_response.status_code = 201
        mock_response.json.return_value = {"created": True}
        mock_post.return_value = mock_response

        response = await client.post("/api/test", json={"data": "value"})

        mock_post.assert_called_once()
        assert response.status_code == 201


@pytest.mark.asyncio
async def test_client_handles_404_error(mock_config):
    """Test client handles 404 Not Found errors."""
    client = CoderAPIClient(mock_config)

    with patch.object(client._client, "get") as mock_get:
        mock_response = Mock(spec=httpx.Response)
        mock_response.status_code = 404
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Not found", request=Mock(), response=mock_response
        )
        mock_get.return_value = mock_response

        with pytest.raises(httpx.HTTPStatusError):
            response = await client.get("/api/nonexistent")
            response.raise_for_status()


@pytest.mark.asyncio
async def test_client_handles_auth_error(mock_config):
    """Test client handles 401 Unauthorized errors."""
    client = CoderAPIClient(mock_config)

    with patch.object(client._client, "get") as mock_get:
        mock_response = Mock(spec=httpx.Response)
        mock_response.status_code = 401
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Unauthorized", request=Mock(), response=mock_response
        )
        mock_get.return_value = mock_response

        with pytest.raises(httpx.HTTPStatusError):
            response = await client.get("/api/test")
            response.raise_for_status()


@pytest.mark.asyncio
async def test_client_context_manager(mock_config):
    """Test client works as async context manager."""
    async with CoderAPIClient(mock_config) as client:
        assert client is not None
        assert isinstance(client._client, httpx.AsyncClient)
