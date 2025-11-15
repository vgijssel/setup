"""Integration tests for HTTP endpoints.

Tests the custom HTTP routes: /, /health, /metadata
"""

import os
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

# Mark all tests in this module as asyncio
pytestmark = pytest.mark.asyncio


class TestRootEndpoint:
    """Tests for the root (/) endpoint."""

    async def test_root_endpoint_success(self):
        """Test root endpoint returns health and metadata successfully."""
        from fleet_mcp.__main__ import app
        from fleet_mcp.models.metadata import MetadataField, MetadataSchema, WorkspaceMetadata

        # Mock the MetadataService to return test metadata
        test_metadata = WorkspaceMetadata(
            data={
                "git_branch": MetadataField(
                    value="main",
                    error=None,
                    schema=MetadataSchema(
                        description="Current git branch",
                        include_in_list=True,
                    ),
                ),
                "pull_request_number": MetadataField(
                    value=123,
                    error=None,
                    schema=MetadataSchema(
                        description="PR number",
                        include_in_list=True,
                    ),
                ),
            },
            meta={"version": "1.0"},
        )

        with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
            mock_service = AsyncMock()
            mock_service.collect_metadata.return_value = test_metadata
            mock_service_class.return_value = mock_service

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.get("/")

        assert response.status_code == 200

        data = response.json()

        # Verify health check fields
        assert data["status"] == "healthy"
        assert data["service"] == "fleet-mcp"
        assert data["version"] == "0.2.0"
        assert "coder_url" in data

        # Verify metadata is included
        assert "metadata" in data
        assert data["metadata"]["data"]["git_branch"]["value"] == "main"
        assert data["metadata"]["data"]["pull_request_number"]["value"] == 123
        assert data["metadata"]["meta"]["version"] == "1.0"

    async def test_root_endpoint_with_empty_metadata(self):
        """Test root endpoint when metadata collection returns empty data."""
        from fleet_mcp.__main__ import app
        from fleet_mcp.models.metadata import WorkspaceMetadata

        # Mock the MetadataService to return empty metadata
        empty_metadata = WorkspaceMetadata(data={}, meta={"version": "1.0"})

        with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
            mock_service = AsyncMock()
            mock_service.collect_metadata.return_value = empty_metadata
            mock_service_class.return_value = mock_service

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.get("/")

        assert response.status_code == 200

        data = response.json()

        # Verify health check fields are still present
        assert data["status"] == "healthy"
        assert data["service"] == "fleet-mcp"
        assert data["version"] == "0.2.0"

        # Verify metadata is empty but present
        assert "metadata" in data
        assert data["metadata"]["data"] == {}
        assert data["metadata"]["meta"]["version"] == "1.0"

    async def test_root_endpoint_metadata_collection_failure(self):
        """Test root endpoint handles metadata collection failures gracefully."""
        from fleet_mcp.__main__ import app

        # Mock the MetadataService to raise an exception
        with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
            mock_service = AsyncMock()
            mock_service.collect_metadata.side_effect = Exception("Taskfile not found")
            mock_service_class.return_value = mock_service

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.get("/")

        assert response.status_code == 200

        data = response.json()

        # Verify health check fields are still present
        assert data["status"] == "healthy"
        assert data["service"] == "fleet-mcp"

        # Verify metadata is empty (graceful degradation)
        assert "metadata" in data
        assert data["metadata"]["data"] == {}

    async def test_root_endpoint_uses_taskfile_env_var(self):
        """Test root endpoint respects FLEET_MCP_TASKFILE environment variable."""
        from fleet_mcp.__main__ import app
        from fleet_mcp.models.metadata import WorkspaceMetadata

        custom_taskfile = "/custom/path/Taskfile.yml"

        # Mock the MetadataService
        empty_metadata = WorkspaceMetadata(data={}, meta={"version": "1.0"})

        with patch.dict(os.environ, {"FLEET_MCP_TASKFILE": custom_taskfile}):
            with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
                mock_service = AsyncMock()
                mock_service.collect_metadata.return_value = empty_metadata
                mock_service_class.return_value = mock_service

                async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                    response = await client.get("/")

                # Verify MetadataService was called with custom taskfile path
                mock_service_class.assert_called_once_with(taskfile_path=custom_taskfile)

        assert response.status_code == 200

    async def test_root_endpoint_with_partial_metadata_failures(self):
        """Test root endpoint with some metadata fields failing."""
        from fleet_mcp.__main__ import app
        from fleet_mcp.models.metadata import MetadataField, MetadataSchema, WorkspaceMetadata

        # Mock metadata with partial failures
        partial_metadata = WorkspaceMetadata(
            data={
                "git_branch": MetadataField(
                    value="feature/test",
                    error=None,
                    schema=MetadataSchema(
                        description="Git branch",
                        include_in_list=True,
                    ),
                ),
                "pr_number": MetadataField(
                    value=None,
                    error="Command 'gh pr view' failed",
                    schema=MetadataSchema(
                        description="PR number",
                        include_in_list=True,
                    ),
                ),
            },
            meta={"version": "1.0"},
        )

        with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
            mock_service = AsyncMock()
            mock_service.collect_metadata.return_value = partial_metadata
            mock_service_class.return_value = mock_service

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.get("/")

        assert response.status_code == 200

        data = response.json()

        # Verify successful field
        assert data["metadata"]["data"]["git_branch"]["value"] == "feature/test"
        assert data["metadata"]["data"]["git_branch"]["error"] is None

        # Verify failed field
        assert data["metadata"]["data"]["pr_number"]["value"] is None
        assert data["metadata"]["data"]["pr_number"]["error"] == "Command 'gh pr view' failed"


class TestHealthEndpoint:
    """Tests for the /health endpoint."""

    async def test_health_endpoint(self):
        """Test /health endpoint returns healthy status."""
        from fleet_mcp.__main__ import app

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/health")

        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "fleet-mcp"
        assert data["version"] == "0.2.0"
        assert "coder_url" in data

        # /health should NOT include metadata
        assert "metadata" not in data


class TestMetadataEndpoint:
    """Tests for the /metadata endpoint."""

    async def test_metadata_endpoint_success(self):
        """Test /metadata endpoint returns metadata successfully."""
        from fleet_mcp.__main__ import app
        from fleet_mcp.models.metadata import MetadataField, MetadataSchema, WorkspaceMetadata

        test_metadata = WorkspaceMetadata(
            data={
                "git_branch": MetadataField(
                    value="main",
                    error=None,
                    schema=MetadataSchema(
                        description="Git branch",
                        include_in_list=True,
                    ),
                ),
            },
            meta={"version": "1.0"},
        )

        with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
            mock_service = AsyncMock()
            mock_service.collect_metadata.return_value = test_metadata
            mock_service_class.return_value = mock_service

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.get("/metadata")

        assert response.status_code == 200

        data = response.json()

        # /metadata should ONLY return metadata (no health fields)
        assert "status" not in data
        assert "service" not in data
        assert "version" not in data

        # Verify metadata structure
        assert data["data"]["git_branch"]["value"] == "main"
        assert data["meta"]["version"] == "1.0"

    async def test_metadata_endpoint_failure(self):
        """Test /metadata endpoint handles failures gracefully."""
        from fleet_mcp.__main__ import app

        with patch("fleet_mcp.services.metadata_service.MetadataService") as mock_service_class:
            mock_service = AsyncMock()
            mock_service.collect_metadata.side_effect = Exception("Taskfile error")
            mock_service_class.return_value = mock_service

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
                response = await client.get("/metadata")

        assert response.status_code == 200

        data = response.json()

        # Should return empty metadata
        assert data["data"] == {}
        assert "meta" in data
