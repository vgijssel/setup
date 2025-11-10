"""Tests for ProjectRepository (Layer 3 - Repository Layer).

These tests verify the ProjectRepository layer using mocked CoderClient.
Tests follow the Arrange-Act-Assert pattern for AI readability.

Test Coverage:
- T044: list_all()
- T045: list_roles(project_name)
- T046: Filters templates without ai_prompt/system_prompt
"""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp.models.project import Project, Role
from fleet_mcp.repositories.project_repository import ProjectRepository


@pytest.fixture
def mock_coder_client():
    """Mock CoderClient for testing."""
    return AsyncMock()


@pytest.fixture
def project_repo(mock_coder_client):
    """ProjectRepository instance with mocked client."""
    return ProjectRepository(mock_coder_client)


class TestProjectRepositoryListAll:
    """Test suite for ProjectRepository.list_all() - T044"""

    @pytest.mark.asyncio
    async def test_list_all_returns_projects_with_required_parameters(
        self, project_repo, mock_coder_client
    ):
        """Test list_all() returns only templates with ai_prompt and system_prompt.

        Arrange: Mock templates list with valid and invalid projects
        Act: Call list_all()
        Assert: Returns only projects with both required parameters
        """
        # Arrange - Mock templates
        mock_templates = [
            {
                "id": "tpl-1",
                "name": "coder-devcontainer",
                "display_name": "Setup",
                "active_version_id": "ver-1",
            },
            {
                "id": "tpl-2",
                "name": "coder-dataone",
                "display_name": "DataOne",
                "active_version_id": "ver-2",
            },
            {
                "id": "tpl-3",
                "name": "invalid-template",
                "display_name": "",  # No display_name - should be filtered
                "active_version_id": "ver-3",
            },
        ]

        # Mock template parameters
        mock_coder_client.list_templates.return_value = mock_templates

        async def get_params_side_effect(template_id):
            """Return parameters based on template ID."""
            if template_id == "tpl-1":
                # Valid - has both ai_prompt and system_prompt
                return [
                    {"name": "ai_prompt", "type": "string"},
                    {"name": "system_prompt", "type": "string"},
                ]
            elif template_id == "tpl-2":
                # Valid - has both required parameters
                return [
                    {"name": "ai_prompt", "type": "string"},
                    {"name": "system_prompt", "type": "string"},
                    {"name": "other_param", "type": "string"},
                ]
            else:
                # Invalid - missing required parameters
                return [{"name": "other_param", "type": "string"}]

        mock_coder_client.get_template_parameters.side_effect = get_params_side_effect

        # Act
        projects = await project_repo.list_all()

        # Assert
        assert len(projects) == 2  # Only tpl-1 and tpl-2, not tpl-3
        assert all(isinstance(proj, Project) for proj in projects)
        assert projects[0].id == "tpl-1"
        assert projects[0].name == "Setup"
        assert projects[1].id == "tpl-2"
        assert projects[1].name == "DataOne"

    @pytest.mark.asyncio
    async def test_list_all_filters_templates_without_display_name(
        self, project_repo, mock_coder_client
    ):
        """Test that templates without display_name are filtered out - T046.

        Arrange: Mock templates with missing display_name
        Act: Call list_all()
        Assert: Templates without display_name are excluded
        """
        # Arrange
        mock_templates = [
            {
                "id": "tpl-1",
                "name": "with-display",
                "display_name": "Valid Project",
                "active_version_id": "ver-1",
            },
            {
                "id": "tpl-2",
                "name": "without-display",
                "display_name": "",  # Empty display_name
                "active_version_id": "ver-2",
            },
        ]

        mock_coder_client.list_templates.return_value = mock_templates
        mock_coder_client.get_template_parameters.return_value = [
            {"name": "ai_prompt", "type": "string"},
            {"name": "system_prompt", "type": "string"},
        ]

        # Act
        projects = await project_repo.list_all()

        # Assert
        assert len(projects) == 1
        assert projects[0].name == "Valid Project"

    @pytest.mark.asyncio
    async def test_list_all_filters_templates_without_required_parameters(
        self, project_repo, mock_coder_client
    ):
        """Test templates without ai_prompt/system_prompt are filtered - T046.

        Arrange: Mock templates with missing required parameters
        Act: Call list_all()
        Assert: Templates without both required parameters are excluded
        """
        # Arrange
        mock_templates = [
            {
                "id": "tpl-1",
                "name": "template-1",
                "display_name": "Has Both",
                "active_version_id": "ver-1",
            },
            {
                "id": "tpl-2",
                "name": "template-2",
                "display_name": "Missing System Prompt",
                "active_version_id": "ver-2",
            },
            {
                "id": "tpl-3",
                "name": "template-3",
                "display_name": "Missing AI Prompt",
                "active_version_id": "ver-3",
            },
        ]

        async def get_params_side_effect(template_id):
            if template_id == "tpl-1":
                return [
                    {"name": "ai_prompt", "type": "string"},
                    {"name": "system_prompt", "type": "string"},
                ]
            elif template_id == "tpl-2":
                return [
                    {"name": "ai_prompt", "type": "string"}
                ]  # Missing system_prompt
            else:
                return [
                    {"name": "system_prompt", "type": "string"}
                ]  # Missing ai_prompt

        mock_coder_client.list_templates.return_value = mock_templates
        mock_coder_client.get_template_parameters.side_effect = get_params_side_effect

        # Act
        projects = await project_repo.list_all()

        # Assert
        assert len(projects) == 1
        assert projects[0].name == "Has Both"


class TestProjectRepositoryListRoles:
    """Test suite for ProjectRepository.list_roles() - T045"""

    @pytest.mark.asyncio
    async def test_list_roles_returns_workspace_presets(
        self, project_repo, mock_coder_client
    ):
        """Test list_roles() returns workspace presets for a project.

        Arrange: Mock template and workspace presets
        Act: Call list_roles() with project name
        Assert: Returns list of Role objects
        """
        # Arrange
        project_name = "Setup"

        # Mock templates to find project by name
        mock_templates = [
            {
                "id": "tpl-1",
                "name": "coder-devcontainer",
                "display_name": "Setup",
                "active_version_id": "ver-1",
            }
        ]

        # Mock workspace presets (roles)
        mock_presets = [
            {"id": "preset-1", "name": "Coder", "template_version_id": "ver-1"},
            {"id": "preset-2", "name": "Operator", "template_version_id": "ver-1"},
        ]

        mock_coder_client.list_templates.return_value = mock_templates
        mock_coder_client.get_template_parameters.return_value = [
            {"name": "ai_prompt", "type": "string"},
            {"name": "system_prompt", "type": "string"},
        ]
        mock_coder_client.list_workspace_presets.return_value = mock_presets

        # Act
        roles = await project_repo.list_roles(project_name)

        # Assert
        assert len(roles) == 2
        assert all(isinstance(role, Role) for role in roles)
        assert roles[0].name == "Coder"
        assert roles[0].project_name == "Setup"
        assert roles[0].project_id == "tpl-1"
        assert roles[1].name == "Operator"

    @pytest.mark.asyncio
    async def test_list_roles_case_insensitive_uppercase(
        self, project_repo, mock_coder_client
    ):
        """Test list_roles() with case insensitive project name - uppercase.

        When a project is created with name "Setup", it should be
        retrievable with "SETUP" (all uppercase).
        This is because the Coder API backend is case insensitive.

        Arrange: Mock template with project name "Setup"
        Act: Call list_roles() with "SETUP"
        Assert: Returns roles for the project
        """
        # Arrange
        mock_templates = [
            {
                "id": "tpl-1",
                "name": "coder-devcontainer",
                "display_name": "Setup",
                "active_version_id": "ver-1",
            }
        ]
        mock_presets = [
            {"id": "preset-1", "name": "Coder", "template_version_id": "ver-1"}
        ]
        mock_coder_client.list_templates.return_value = mock_templates
        mock_coder_client.list_workspace_presets.return_value = mock_presets

        # Act - try with uppercase
        roles = await project_repo.list_roles("SETUP")

        # Assert
        assert len(roles) == 1
        assert roles[0].name == "Coder"
        assert roles[0].project_name == "SETUP"  # Should preserve the input case

    @pytest.mark.asyncio
    async def test_list_roles_case_insensitive_lowercase(
        self, project_repo, mock_coder_client
    ):
        """Test list_roles() with case insensitive project name - lowercase.

        When a project is created with name "Setup", it should be
        retrievable with "setup" (all lowercase).
        This is because the Coder API backend is case insensitive.

        Arrange: Mock template with project name "Setup"
        Act: Call list_roles() with "setup"
        Assert: Returns roles for the project
        """
        # Arrange
        mock_templates = [
            {
                "id": "tpl-1",
                "name": "coder-devcontainer",
                "display_name": "Setup",
                "active_version_id": "ver-1",
            }
        ]
        mock_presets = [
            {"id": "preset-1", "name": "Coder", "template_version_id": "ver-1"}
        ]
        mock_coder_client.list_templates.return_value = mock_templates
        mock_coder_client.list_workspace_presets.return_value = mock_presets

        # Act - try with lowercase
        roles = await project_repo.list_roles("setup")

        # Assert
        assert len(roles) == 1
        assert roles[0].name == "Coder"
        assert roles[0].project_name == "setup"  # Should preserve the input case

    @pytest.mark.asyncio
    async def test_list_roles_for_nonexistent_project_raises_error(
        self, project_repo, mock_coder_client
    ):
        """Test list_roles() for non-existent project raises CoderAPIError.

        Arrange: Mock templates without the requested project
        Act: Call list_roles() with non-existent project name
        Assert: Raises CoderAPIError
        """
        # Arrange
        from fleet_mcp.models.errors import CoderAPIError

        mock_templates = [
            {
                "id": "tpl-1",
                "name": "other-template",
                "display_name": "Other Project",
                "active_version_id": "ver-1",
            }
        ]

        mock_coder_client.list_templates.return_value = mock_templates
        mock_coder_client.get_template_parameters.return_value = [
            {"name": "ai_prompt", "type": "string"},
            {"name": "system_prompt", "type": "string"},
        ]

        # Act & Assert
        with pytest.raises(CoderAPIError) as exc_info:
            await project_repo.list_roles("Nonexistent Project")

        assert "not found" in str(exc_info.value).lower()
