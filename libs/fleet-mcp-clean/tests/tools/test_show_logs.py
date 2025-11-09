"""Tests for show_agent_log MCP tool.

User Story: US4 (Task and Log History Tracking)
Architecture: Layer 1 (Tool Layer)
Testing Strategy: Mock Service layer

This test file validates that the show_agent_log tool correctly:
- Calls TaskService.get_conversation_logs() with correct parameters
- Returns properly formatted paginated response
- Uses default page_size of 1 (shows only latest log)
- Includes pagination metadata
"""

import pytest
from unittest.mock import AsyncMock

from fleet_mcp_clean.tools.show_logs import show_agent_log


@pytest.fixture
def mock_task_service():
    """Mock TaskService for testing."""
    return AsyncMock()


class TestShowAgentLog:
    """Test show_agent_log tool with mocked TaskService."""

    @pytest.mark.asyncio
    async def test_show_agent_log_with_default_page_size(self, mock_task_service):
        """Test that show_agent_log defaults to page_size=1.

        Arrange:
            - Mock TaskService.get_conversation_logs() to return log data
            - Use default page_size parameter
        Act:
            - Call show_agent_log without specifying page_size
        Assert:
            - page_size defaults to 1
            - Returns only the latest log entry
            - Service is called with page_size=1
        """
        # Arrange
        agent_name = "test-agent"
        mock_logs = [
            {
                "timestamp": "2025-11-09T12:00:00Z",
                "message": "Latest log entry",
                "level": "INFO",
            }
        ]
        total_count = 100  # Agent has many logs

        mock_task_service.get_conversation_logs.return_value = (mock_logs, total_count)

        # Act
        result = await show_agent_log(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=1,
            # page_size not specified, should default to 1
        )

        # Assert
        assert result["agent_name"] == agent_name
        assert result["logs"] == mock_logs
        assert result["total_count"] == total_count
        assert result["page"] == 1
        assert result["page_size"] == 1  # Default value
        assert result["has_next_page"] is True  # 100 total, page size 1
        assert result["has_previous_page"] is False  # Page 1

        # Verify service was called with default page_size=1
        mock_task_service.get_conversation_logs.assert_called_once_with(
            agent_name, 1, 1
        )

    @pytest.mark.asyncio
    async def test_show_agent_log_with_custom_page_size(self, mock_task_service):
        """Test show_agent_log with custom page_size parameter.

        Arrange:
            - Mock TaskService with multiple log entries
            - Request page_size=10 to get more logs at once
        Act:
            - Call show_agent_log with custom page_size
        Assert:
            - page_size reflects custom value
            - Pagination metadata is correct
        """
        # Arrange
        agent_name = "test-agent"
        mock_logs = [
            {"timestamp": f"2025-11-09T12:0{i}:00Z", "message": f"Log {i}", "level": "INFO"}
            for i in range(10)
        ]
        total_count = 50

        mock_task_service.get_conversation_logs.return_value = (mock_logs, total_count)

        # Act
        result = await show_agent_log(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=1,
            page_size=10,
        )

        # Assert
        assert result["page"] == 1
        assert result["page_size"] == 10
        assert result["total_count"] == 50
        assert result["has_next_page"] is True  # 50 total, 10 per page = 5 pages
        assert result["has_previous_page"] is False  # Page 1

        mock_task_service.get_conversation_logs.assert_called_once_with(
            agent_name, 1, 10
        )

    @pytest.mark.asyncio
    async def test_show_agent_log_pagination_metadata(self, mock_task_service):
        """Test pagination metadata calculation.

        Arrange:
            - Mock 100 total logs
            - Request page 5 with page_size 20
        Act:
            - Call show_agent_log with pagination parameters
        Assert:
            - has_next_page is False (page 5 is last page: 100/20 = 5 pages)
            - has_previous_page is True (not on page 1)
        """
        # Arrange
        agent_name = "test-agent"
        mock_logs = [{"message": f"Log {i}"} for i in range(20)]
        total_count = 100  # Exactly 5 pages

        mock_task_service.get_conversation_logs.return_value = (mock_logs, total_count)

        # Act
        result = await show_agent_log(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=5,
            page_size=20,
        )

        # Assert
        assert result["page"] == 5
        assert result["page_size"] == 20
        assert result["total_count"] == 100
        assert result["has_next_page"] is False  # 5*20 = 100, no next page
        assert result["has_previous_page"] is True  # Page 5, has previous

    @pytest.mark.asyncio
    async def test_show_agent_log_empty_results(self, mock_task_service):
        """Test show_agent_log with no conversation logs.

        Arrange:
            - Mock TaskService to return empty log list
        Act:
            - Call show_agent_log for agent with no logs
        Assert:
            - Returns empty logs array
            - total_count is 0
            - No pagination
        """
        # Arrange
        agent_name = "new-agent"
        mock_task_service.get_conversation_logs.return_value = ([], 0)

        # Act
        result = await show_agent_log(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=1,
            page_size=1,
        )

        # Assert
        assert result["logs"] == []
        assert result["total_count"] == 0
        assert result["has_next_page"] is False
        assert result["has_previous_page"] is False

    @pytest.mark.asyncio
    async def test_show_agent_log_middle_page(self, mock_task_service):
        """Test pagination metadata for a middle page.

        Arrange:
            - Mock 50 total logs
            - Request page 3 with page_size 10 (middle of 5 pages)
        Act:
            - Call show_agent_log for middle page
        Assert:
            - has_next_page is True (not last page)
            - has_previous_page is True (not first page)
        """
        # Arrange
        agent_name = "test-agent"
        mock_logs = [{"message": f"Log {i}"} for i in range(10)]
        total_count = 50

        mock_task_service.get_conversation_logs.return_value = (mock_logs, total_count)

        # Act
        result = await show_agent_log(
            task_service=mock_task_service,
            agent_name=agent_name,
            page=3,
            page_size=10,
        )

        # Assert
        assert result["has_next_page"] is True  # Page 3 of 5
        assert result["has_previous_page"] is True  # Not first page
