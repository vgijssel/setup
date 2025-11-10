"""Tests for show_agent_task_history MCP tool.

User Story: US4 (Task and Log History Tracking)
Architecture: Layer 1 (Tool Layer)
Testing Strategy: Mock Service layer

This test file validates that the show_agent_task_history tool correctly:
- Calls TaskService.get_task_history() with correct parameters
- Returns properly formatted paginated response
- Includes pagination metadata (has_next_page, has_previous_page)
- Handles default and custom pagination parameters
"""

from unittest.mock import AsyncMock

import pytest
from fleet_mcp_clean.tools.show_task_history import show_agent_task_history


@pytest.fixture
def mock_task_service():
    """Mock TaskService for testing."""
    return AsyncMock()


class TestShowAgentTaskHistory:
    """Test show_agent_task_history tool with mocked TaskService."""

    @pytest.mark.asyncio
    async def test_show_agent_task_history_returns_paginated_data(
        self, mock_task_service
    ):
        """Test that show_agent_task_history returns paginated task history.

        Arrange:
            - Mock TaskService.get_task_history() to return sample task data
            - Prepare test agent name and pagination parameters
        Act:
            - Call show_agent_task_history with default pagination
        Assert:
            - Response contains tasks array
            - Response includes total_count, page, page_size
            - Pagination metadata is correct
        """
        # Arrange
        agent_name = "test-agent"
        mock_tasks = [
            {
                "message": "Task 1",
                "uri": None,
                "needs_user_attention": False,
                "created_at": "2025-11-09T10:00:00Z",
            },
            {
                "message": "Task 2",
                "uri": "https://example.com",
                "needs_user_attention": True,
                "created_at": "2025-11-09T09:00:00Z",
            },
        ]
        total_count = 2

        # Configure mock to return task data
        mock_task_service.get_task_history.return_value = (mock_tasks, total_count)

        # Act
        result = await show_agent_task_history(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=1,
            page_size=20,
        )

        # Assert
        assert result["agent_name"] == agent_name
        assert result["tasks"] == mock_tasks
        assert result["total_count"] == total_count
        assert result["page"] == 1
        assert result["page_size"] == 20
        assert result["has_next_page"] is False  # 2 items, page size 20, no next page
        assert result["has_previous_page"] is False  # Page 1, no previous page

        # Verify service was called correctly
        mock_task_service.get_task_history.assert_called_once_with(agent_name, 1, 20)

    @pytest.mark.asyncio
    async def test_show_agent_task_history_with_custom_pagination(
        self, mock_task_service
    ):
        """Test show_agent_task_history with custom page and page_size parameters.

        Arrange:
            - Mock TaskService with 50 total tasks
            - Request page 2 with page_size 10
        Act:
            - Call show_agent_task_history with custom pagination
        Assert:
            - Pagination metadata reflects custom parameters
            - has_next_page is True (50 total, on page 2 of 5)
            - has_previous_page is True (not on page 1)
        """
        # Arrange
        agent_name = "test-agent"
        mock_tasks = [{"message": f"Task {i}"} for i in range(10)]  # Page 2 data
        total_count = 50  # Total across all pages

        mock_task_service.get_task_history.return_value = (mock_tasks, total_count)

        # Act
        result = await show_agent_task_history(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=2,
            page_size=10,
        )

        # Assert
        assert result["page"] == 2
        assert result["page_size"] == 10
        assert result["total_count"] == 50
        assert result["has_next_page"] is True  # Page 2 of 5 (50/10)
        assert result["has_previous_page"] is True  # Not on page 1

        mock_task_service.get_task_history.assert_called_once_with(agent_name, 2, 10)

    @pytest.mark.asyncio
    async def test_show_agent_task_history_empty_results(self, mock_task_service):
        """Test show_agent_task_history with no task history.

        Arrange:
            - Mock TaskService to return empty task list
        Act:
            - Call show_agent_task_history for agent with no history
        Assert:
            - Returns empty tasks array
            - total_count is 0
            - No pagination (has_next_page and has_previous_page both False)
        """
        # Arrange
        agent_name = "new-agent"
        mock_task_service.get_task_history.return_value = ([], 0)

        # Act
        result = await show_agent_task_history(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=1,
            page_size=20,
        )

        # Assert
        assert result["tasks"] == []
        assert result["total_count"] == 0
        assert result["has_next_page"] is False
        assert result["has_previous_page"] is False

    @pytest.mark.asyncio
    async def test_show_agent_task_history_last_page(self, mock_task_service):
        """Test pagination metadata on the last page.

        Arrange:
            - Mock 25 total tasks
            - Request page 3 with page_size 10 (last page with 5 items)
        Act:
            - Call show_agent_task_history for last page
        Assert:
            - has_next_page is False (last page)
            - has_previous_page is True (not first page)
        """
        # Arrange
        agent_name = "test-agent"
        mock_tasks = [{"message": f"Task {i}"} for i in range(5)]  # Last page (5 items)
        total_count = 25

        mock_task_service.get_task_history.return_value = (mock_tasks, total_count)

        # Act
        result = await show_agent_task_history(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=3,
            page_size=10,
        )

        # Assert
        assert result["page"] == 3
        assert result["page_size"] == 10
        assert result["total_count"] == 25
        assert result["has_next_page"] is False  # 3*10 = 30 >= 25, no next page
        assert result["has_previous_page"] is True  # Page 3, has previous
