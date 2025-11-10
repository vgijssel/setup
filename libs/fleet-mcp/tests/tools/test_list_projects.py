"""Tests for list_agent_projects MCP tool (Layer 1 - Tool Layer).

These tests verify the MCP tool layer using mocked ProjectService.
Tests follow the Arrange-Act-Assert pattern for AI readability.

Test Coverage:
- T053: list_agent_projects() returns correct response format
- T054: list_agent_projects() delegates to service correctly
- T055: list_agent_projects() calculates total_count
"""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp.models.project import Project
from fleet_mcp.models.responses import ListProjectsResponse
from fleet_mcp.tools.list_projects import list_agent_projects


@pytest.fixture
def mock_project_service():
    """Mock ProjectService for testing."""
    return AsyncMock()


class TestListAgentProjects:
    """Test suite for list_agent_projects MCP tool - T053, T054, T055"""

    @pytest.mark.asyncio
    async def test_list_agent_projects_returns_correct_response_format(
        self, mock_project_service
    ):
        """Test list_agent_projects() returns ListProjectsResponse - T053.

        Arrange: Mock service to return projects
        Act: Call list_agent_projects()
        Assert: Returns ListProjectsResponse with correct structure
        """
        # Arrange
        mock_projects = [
            Project(id="proj-1", name="Setup", description="Dev setup"),
            Project(id="proj-2", name="DataOne", description="Data project"),
        ]
        mock_project_service.list_projects.return_value = mock_projects

        # Act
        result = await list_agent_projects(mock_project_service)

        # Assert
        assert isinstance(result, ListProjectsResponse)
        assert result.projects == mock_projects
        assert result.total_count == 2

    @pytest.mark.asyncio
    async def test_list_agent_projects_delegates_to_service(self, mock_project_service):
        """Test list_agent_projects() calls service.list_projects() - T054.

        Arrange: Mock service to return projects
        Act: Call list_agent_projects()
        Assert: Service method was called once
        """
        # Arrange
        mock_projects = [Project(id="proj-1", name="Setup", description="Dev setup")]
        mock_project_service.list_projects.return_value = mock_projects

        # Act
        result = await list_agent_projects(mock_project_service)

        # Assert
        mock_project_service.list_projects.assert_called_once()
        assert result.projects == mock_projects

    @pytest.mark.asyncio
    async def test_list_agent_projects_calculates_total_count(
        self, mock_project_service
    ):
        """Test list_agent_projects() correctly counts projects - T055.

        Arrange: Mock service to return varying numbers of projects
        Act: Call list_agent_projects()
        Assert: total_count matches number of projects
        """
        # Arrange - empty list
        mock_project_service.list_projects.return_value = []

        # Act
        result = await list_agent_projects(mock_project_service)

        # Assert
        assert result.total_count == 0

        # Arrange - 3 projects
        mock_projects = [
            Project(id="p1", name="P1", description="Project 1"),
            Project(id="p2", name="P2", description="Project 2"),
            Project(id="p3", name="P3", description="Project 3"),
        ]
        mock_project_service.list_projects.return_value = mock_projects

        # Act
        result = await list_agent_projects(mock_project_service)

        # Assert
        assert result.total_count == 3
        assert len(result.projects) == 3
