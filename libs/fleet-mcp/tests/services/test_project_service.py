"""Tests for ProjectService (Layer 2 - Service Layer).

These tests verify the ProjectService layer using mocked ProjectRepository.
Tests follow the Arrange-Act-Assert pattern for AI readability.

Test Coverage:
- T047: list_projects()
- T048: list_roles()
- T049: list_roles() validation error on empty project name
- T050: get_project_by_name()
- T051: get_project_by_name() validation error
- T052: get_project_by_name() returns None when not found
"""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.models.errors import ValidationError
from fleet_mcp_clean.models.project import Project, Role
from fleet_mcp_clean.services.project_service import ProjectService


@pytest.fixture
def mock_project_repo():
    """Mock ProjectRepository for testing."""
    return AsyncMock()


@pytest.fixture
def project_service(mock_project_repo):
    """ProjectService instance with mocked repository."""
    return ProjectService(mock_project_repo)


class TestProjectServiceListProjects:
    """Test suite for ProjectService.list_projects() - T047"""

    @pytest.mark.asyncio
    async def test_list_projects_returns_all_projects(
        self, project_service, mock_project_repo
    ):
        """Test list_projects() delegates to repository.

        Arrange: Mock repository to return projects
        Act: Call list_projects()
        Assert: Returns all projects from repository
        """
        # Arrange
        mock_projects = [
            Project(id="proj-1", name="Setup", description="Dev setup"),
            Project(id="proj-2", name="DataOne", description="Data project"),
        ]
        mock_project_repo.list_all.return_value = mock_projects

        # Act
        result = await project_service.list_projects()

        # Assert
        assert result == mock_projects
        mock_project_repo.list_all.assert_called_once()


class TestProjectServiceListRoles:
    """Test suite for ProjectService.list_roles() - T048, T049"""

    @pytest.mark.asyncio
    async def test_list_roles_returns_roles_for_project(
        self, project_service, mock_project_repo
    ):
        """Test list_roles() delegates to repository.

        Arrange: Mock repository to return roles
        Act: Call list_roles() with valid project name
        Assert: Returns roles from repository
        """
        # Arrange
        project_name = "Setup"
        mock_roles = [
            Role(
                id="role-1",
                name="Coder",
                project_id="proj-1",
                project_name="Setup",
                default=True,
            ),
            Role(
                id="role-2",
                name="Operator",
                project_id="proj-1",
                project_name="Setup",
                default=False,
            ),
        ]
        mock_project_repo.list_roles.return_value = mock_roles

        # Act
        result = await project_service.list_roles(project_name)

        # Assert
        assert result == mock_roles
        mock_project_repo.list_roles.assert_called_once_with(project_name)

    @pytest.mark.asyncio
    async def test_list_roles_raises_validation_error_on_empty_name(
        self, project_service, mock_project_repo
    ):
        """Test list_roles() validates project name - T049.

        Arrange: Prepare service with mocked repository
        Act: Call list_roles() with empty project name
        Assert: Raises ValidationError without calling repository
        """
        # Act & Assert - empty string
        with pytest.raises(ValidationError) as exc_info:
            await project_service.list_roles("")

        assert "cannot be empty" in str(exc_info.value).lower()
        mock_project_repo.list_roles.assert_not_called()

        # Act & Assert - whitespace only
        with pytest.raises(ValidationError) as exc_info:
            await project_service.list_roles("   ")

        assert "cannot be empty" in str(exc_info.value).lower()
        mock_project_repo.list_roles.assert_not_called()


class TestProjectServiceGetProjectByName:
    """Test suite for ProjectService.get_project_by_name() - T050, T051, T052"""

    @pytest.mark.asyncio
    async def test_get_project_by_name_returns_matching_project(
        self, project_service, mock_project_repo
    ):
        """Test get_project_by_name() finds and returns project - T050.

        Arrange: Mock repository to return list of projects
        Act: Call get_project_by_name() with existing project name
        Assert: Returns matching project
        """
        # Arrange
        mock_projects = [
            Project(id="proj-1", name="Setup", description="Dev setup"),
            Project(id="proj-2", name="DataOne", description="Data project"),
        ]
        mock_project_repo.list_all.return_value = mock_projects

        # Act
        result = await project_service.get_project_by_name("DataOne")

        # Assert
        assert result is not None
        assert result.name == "DataOne"
        assert result.id == "proj-2"
        mock_project_repo.list_all.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_project_by_name_returns_none_when_not_found(
        self, project_service, mock_project_repo
    ):
        """Test get_project_by_name() returns None if not found - T052.

        Arrange: Mock repository to return list without target project
        Act: Call get_project_by_name() with non-existent project name
        Assert: Returns None
        """
        # Arrange
        mock_projects = [
            Project(id="proj-1", name="Setup", description="Dev setup"),
        ]
        mock_project_repo.list_all.return_value = mock_projects

        # Act
        result = await project_service.get_project_by_name("NonExistent")

        # Assert
        assert result is None
        mock_project_repo.list_all.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_project_by_name_raises_validation_error_on_empty_name(
        self, project_service, mock_project_repo
    ):
        """Test get_project_by_name() validates project name - T051.

        Arrange: Prepare service with mocked repository
        Act: Call get_project_by_name() with empty project name
        Assert: Raises ValidationError without calling repository
        """
        # Act & Assert - empty string
        with pytest.raises(ValidationError) as exc_info:
            await project_service.get_project_by_name("")

        assert "cannot be empty" in str(exc_info.value).lower()
        mock_project_repo.list_all.assert_not_called()

        # Act & Assert - whitespace only
        with pytest.raises(ValidationError) as exc_info:
            await project_service.get_project_by_name("   ")

        assert "cannot be empty" in str(exc_info.value).lower()
        mock_project_repo.list_all.assert_not_called()
