"""Tests for CoderClient (Layer 4 - HTTP Client).

These tests verify the HTTP client layer using respx mocks based on VCR cassettes.
Tests follow the Arrange-Act-Assert pattern for AI readability.

Test Coverage:
- T035: list_workspaces()
- T036: get_workspace()
- T037: list_templates()
- T038: get_template_parameters()
- T039: list_workspace_presets()
- T040: Error handling for 404 responses
"""

import pytest
import respx
from httpx import Response

from fleet_mcp_clean.clients.coder_client import CoderClient
from fleet_mcp_clean.clients.exceptions import NotFoundError


class TestCoderClientListWorkspaces:
    """Test suite for CoderClient.list_workspaces() - T035"""

    @pytest.mark.asyncio
    async def test_list_workspaces_success(
        self, mock_list_workspaces_success
    ):
        """Test successful workspace listing returns workspace data.

        Arrange: Create CoderClient with mocked HTTP response
        Act: Call list_workspaces()
        Assert: Returns list of workspaces with correct structure
        """
        # Arrange
        client = CoderClient(
            base_url="https://test.coder.com",
            token="test-token"
        )

        # Act
        result = await client.list_workspaces()

        # Assert
        assert isinstance(result, list)
        assert len(result) > 0

        # Verify workspace structure
        workspace = result[0]
        assert "id" in workspace
        assert "name" in workspace
        assert "template_id" in workspace
        assert "latest_build" in workspace


class TestCoderClientGetWorkspace:
    """Test suite for CoderClient.get_workspace() - T036"""

    @pytest.mark.asyncio
    async def test_get_workspace_success(
        self, mock_get_workspace_success
    ):
        """Test successful workspace retrieval returns detailed data.

        Arrange: Create CoderClient with mocked workspace response
        Act: Call get_workspace() with valid workspace ID
        Assert: Returns workspace details including build information
        """
        # Arrange
        client = CoderClient(
            base_url="https://test.coder.com",
            token="test-token"
        )
        workspace_id = "5d9aa1c3-c2a1-4205-875e-978ba2189bbf"

        # Act
        result = await client.get_workspace(workspace_id)

        # Assert
        assert isinstance(result, dict)
        assert result["id"] == workspace_id
        assert "name" in result
        assert "latest_build" in result
        assert "template_id" in result


class TestCoderClientListTemplates:
    """Test suite for CoderClient.list_templates() - T037"""

    @pytest.mark.asyncio
    async def test_list_templates_success(
        self, mock_list_templates_success
    ):
        """Test successful template listing returns template data.

        Arrange: Create CoderClient with mocked template response
        Act: Call list_templates()
        Assert: Returns list of templates with display_name field
        """
        # Arrange
        client = CoderClient(
            base_url="https://test.coder.com",
            token="test-token"
        )

        # Act
        result = await client.list_templates()

        # Assert
        assert isinstance(result, list)
        assert len(result) > 0

        # Verify template structure
        template = result[0]
        assert "id" in template
        assert "name" in template
        assert "display_name" in template
        assert "active_version_id" in template


class TestCoderClientGetTemplateParameters:
    """Test suite for CoderClient.get_template_parameters() - T038"""

    @pytest.mark.asyncio
    async def test_get_template_parameters_success(
        self, mock_get_template_parameters_success
    ):
        """Test successful template parameters retrieval.

        Arrange: Create CoderClient with mocked parameters response
        Act: Call get_template_parameters() with template ID
        Assert: Returns list of rich parameters
        """
        # Arrange
        client = CoderClient(
            base_url="https://test.coder.com",
            token="test-token"
        )
        template_id = "cc29db59-0483-4520-869e-777e9a05bf65"

        # Act
        result = await client.get_template_parameters(template_id)

        # Assert
        assert isinstance(result, list)
        assert len(result) > 0

        # Verify parameter structure
        param = result[0]
        assert "name" in param
        assert "type" in param


class TestCoderClientListWorkspacePresets:
    """Test suite for CoderClient.list_workspace_presets() - T039"""

    @pytest.mark.asyncio
    async def test_list_workspace_presets_success(
        self, mock_list_workspace_presets_success
    ):
        """Test successful workspace presets listing.

        Arrange: Create CoderClient with mocked presets response
        Act: Call list_workspace_presets() with template ID
        Assert: Returns list of workspace presets (roles)
        """
        # Arrange
        client = CoderClient(
            base_url="https://test.coder.com",
            token="test-token"
        )
        template_id = "cc29db59-0483-4520-869e-777e9a05bf65"

        # Act
        result = await client.list_workspace_presets(template_id)

        # Assert
        assert isinstance(result, list)
        assert len(result) > 0

        # Verify preset structure (API returns capitalized keys)
        preset = result[0]
        assert "ID" in preset
        assert "Name" in preset


class TestCoderClientErrorHandling:
    """Test suite for CoderClient error handling - T040"""

    @pytest.mark.asyncio
    async def test_get_workspace_404_raises_not_found_error(self, respx_mock):
        """Test that 404 responses raise NotFoundError.

        Arrange: Mock 404 response for workspace retrieval
        Act: Call get_workspace() with non-existent ID
        Assert: Raises NotFoundError with appropriate message
        """
        # Arrange
        import json
        respx_mock.get(
            url__regex=r".*/api/v2/workspaces/[a-f0-9-]+$"
        ).mock(
            return_value=Response(
                404,
                text=json.dumps({"message": "Workspace not found"})
            )
        )

        client = CoderClient(
            base_url="https://test.coder.com",
            token="test-token"
        )
        workspace_id = "00000000-0000-0000-0000-000000000000"

        # Act & Assert
        with pytest.raises(NotFoundError) as exc_info:
            await client.get_workspace(workspace_id)

        assert "not found" in str(exc_info.value).lower()
