"""Tests for list_agent_roles MCP tool (Layer 1 - Tool Layer).

These tests verify the MCP tool layer using mocked ProjectService.
Tests follow the Arrange-Act-Assert pattern for AI readability.

Test Coverage:
- T056: list_agent_roles() returns correct response format
- T057: list_agent_roles() delegates to service correctly
- T058: list_agent_roles() handles validation errors
"""

import pytest
from unittest.mock import AsyncMock

from fleet_mcp_clean.tools.list_roles import list_agent_roles
from fleet_mcp_clean.models.project import Role
from fleet_mcp_clean.models.responses import ListRolesResponse
from fleet_mcp_clean.models.errors import ValidationError


@pytest.fixture
def mock_project_service():
    """Mock ProjectService for testing."""
    return AsyncMock()


class TestListAgentRoles:
    """Test suite for list_agent_roles MCP tool - T056, T057, T058"""

    @pytest.mark.asyncio
    async def test_list_agent_roles_returns_correct_response_format(
        self, mock_project_service
    ):
        """Test list_agent_roles() returns ListRolesResponse - T056.

        Arrange: Mock service to return roles
        Act: Call list_agent_roles() with project name
        Assert: Returns ListRolesResponse with correct structure
        """
        # Arrange
        project_name = "Setup"
        mock_roles = [
            Role(id="role-1", name="Coder", project_id="proj-1", project_name="Setup", default=True),
            Role(id="role-2", name="Operator", project_id="proj-1", project_name="Setup", default=False)
        ]
        mock_project_service.list_roles.return_value = mock_roles

        # Act
        result = await list_agent_roles(mock_project_service, project=project_name)

        # Assert
        assert isinstance(result, ListRolesResponse)
        assert result.roles == mock_roles
        assert result.project_name == project_name
        assert result.total_count == 2

    @pytest.mark.asyncio
    async def test_list_agent_roles_delegates_to_service(
        self, mock_project_service
    ):
        """Test list_agent_roles() calls service.list_roles() - T057.

        Arrange: Mock service to return roles
        Act: Call list_agent_roles() with project name
        Assert: Service method was called with correct parameters
        """
        # Arrange
        project_name = "DataOne"
        mock_roles = [
            Role(id="role-1", name="Analyst", project_id="proj-2", project_name="DataOne", default=True)
        ]
        mock_project_service.list_roles.return_value = mock_roles

        # Act
        result = await list_agent_roles(mock_project_service, project=project_name)

        # Assert
        mock_project_service.list_roles.assert_called_once_with(project_name)
        assert result.roles == mock_roles
        assert result.project_name == project_name

    @pytest.mark.asyncio
    async def test_list_agent_roles_propagates_validation_error(
        self, mock_project_service
    ):
        """Test list_agent_roles() propagates ValidationError from service - T058.

        Arrange: Mock service to raise ValidationError
        Act: Call list_agent_roles() with invalid project name
        Assert: ValidationError is raised
        """
        # Arrange
        mock_project_service.list_roles.side_effect = ValidationError(
            "project_name", "cannot be empty"
        )

        # Act & Assert
        with pytest.raises(ValidationError) as exc_info:
            await list_agent_roles(mock_project_service, project="")

        assert "cannot be empty" in str(exc_info.value)
        mock_project_service.list_roles.assert_called_once_with("")

    @pytest.mark.asyncio
    async def test_list_agent_roles_calculates_total_count(
        self, mock_project_service
    ):
        """Test list_agent_roles() correctly counts roles.

        Arrange: Mock service to return varying numbers of roles
        Act: Call list_agent_roles()
        Assert: total_count matches number of roles
        """
        # Arrange - empty list
        mock_project_service.list_roles.return_value = []

        # Act
        result = await list_agent_roles(mock_project_service, project="Empty")

        # Assert
        assert result.total_count == 0

        # Arrange - 4 roles
        mock_roles = [
            Role(id=f"r{i}", name=f"Role{i}", project_id="proj-1", project_name="Test", default=(i==0))
            for i in range(4)
        ]
        mock_project_service.list_roles.return_value = mock_roles

        # Act
        result = await list_agent_roles(mock_project_service, project="Test")

        # Assert
        assert result.total_count == 4
        assert len(result.roles) == 4
