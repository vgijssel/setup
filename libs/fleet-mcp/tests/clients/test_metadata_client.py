"""Tests for MetadataClient.

Tests verify that the MetadataClient correctly uses bearer token authentication
when calling agent /metadata endpoints.
"""

import pytest
from fleet_mcp.clients.metadata_client import MetadataClient
from fleet_mcp.models.metadata import WorkspaceMetadata
from httpx import Response


class TestMetadataClientAuthentication:
    """Test suite for MetadataClient bearer token authentication"""

    @pytest.mark.asyncio
    async def test_get_metadata_without_bearer_token(self, respx_mock):
        """Test that get_metadata works without bearer token for backward compatibility.

        Arrange: Mock successful metadata endpoint response
        Act: Call get_metadata() without bearer_token parameter
        Assert: Makes request without Authorization header and succeeds
        """
        # Arrange
        metadata_url = (
            "https://test.coder.com/@user/workspace.123/apps/fleet-mcp/metadata"
        )

        respx_mock.get(metadata_url).mock(
            return_value=Response(
                200,
                json={
                    "data": {},
                    "meta": {"version": "1.0"},
                },
            )
        )

        client = MetadataClient()

        # Act
        result = await client.get_metadata(metadata_url)

        # Assert
        assert isinstance(result, WorkspaceMetadata)
        assert result.data == {}

        # Verify no Authorization header was sent
        request = respx_mock.calls.last.request
        assert "Authorization" not in request.headers

    @pytest.mark.asyncio
    async def test_get_metadata_with_bearer_token(self, respx_mock):
        """Test that get_metadata includes bearer token in Authorization header.

        Arrange: Mock successful metadata endpoint response
        Act: Call get_metadata() with bearer_token parameter
        Assert: Makes request with Authorization header and succeeds
        """
        # Arrange
        metadata_url = (
            "https://test.coder.com/@user/workspace.123/apps/fleet-mcp/metadata"
        )
        bearer_token = "test_bearer_token_1234567890abcdefghij"

        respx_mock.get(metadata_url).mock(
            return_value=Response(
                200,
                json={
                    "data": {},
                    "meta": {"version": "1.0"},
                },
            )
        )

        client = MetadataClient()

        # Act
        result = await client.get_metadata(metadata_url, bearer_token=bearer_token)

        # Assert
        assert isinstance(result, WorkspaceMetadata)
        assert result.data == {}

        # Verify Authorization header was sent with correct format
        request = respx_mock.calls.last.request
        assert "Authorization" in request.headers
        assert request.headers["Authorization"] == f"Bearer {bearer_token}"

    @pytest.mark.asyncio
    async def test_get_metadata_handles_401_gracefully(self, respx_mock):
        """Test that get_metadata returns empty metadata on 401 Unauthorized.

        Arrange: Mock 401 response from metadata endpoint
        Act: Call get_metadata() with invalid bearer token
        Assert: Returns empty WorkspaceMetadata (graceful degradation)
        """
        # Arrange
        metadata_url = (
            "https://test.coder.com/@user/workspace.123/apps/fleet-mcp/metadata"
        )
        invalid_token = "invalid_token_123"

        respx_mock.get(metadata_url).mock(
            return_value=Response(
                401,
                json={"error": "invalid_token", "error_description": "Invalid token"},
            )
        )

        client = MetadataClient()

        # Act
        result = await client.get_metadata(metadata_url, bearer_token=invalid_token)

        # Assert - graceful degradation returns empty metadata
        assert isinstance(result, WorkspaceMetadata)
        assert result.data == {}

    @pytest.mark.asyncio
    async def test_get_metadata_none_bearer_token_not_sent(self, respx_mock):
        """Test that passing None as bearer_token doesn't send Authorization header.

        Arrange: Mock successful metadata endpoint response
        Act: Call get_metadata() with bearer_token=None explicitly
        Assert: No Authorization header is sent
        """
        # Arrange
        metadata_url = (
            "https://test.coder.com/@user/workspace.123/apps/fleet-mcp/metadata"
        )

        respx_mock.get(metadata_url).mock(return_value=Response(200, json={"data": {}}))

        client = MetadataClient()

        # Act
        result = await client.get_metadata(metadata_url, bearer_token=None)

        # Assert
        assert isinstance(result, WorkspaceMetadata)

        # Verify no Authorization header was sent
        request = respx_mock.calls.last.request
        assert "Authorization" not in request.headers
