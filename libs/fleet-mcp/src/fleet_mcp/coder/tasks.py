"""Task history and pagination helpers"""

from fleet_mcp.models.log import Log
from fleet_mcp.models.responses import LogHistoryResponse, TaskHistoryResponse
from fleet_mcp.models.task import Task


def paginate_task_history(
    tasks: list[Task], page: int, page_size: int
) -> TaskHistoryResponse:
    """
    Paginate task list with newest tasks first

    Args:
        tasks: Full list of tasks (will be reversed to show newest first)
        page: Page number (1-indexed)
        page_size: Items per page (max 100)

    Returns:
        TaskHistoryResponse with paginated data, ordered by created_at descending (newest first)
    """
    # Validate and clamp parameters
    page = max(1, page)
    page_size = min(max(1, page_size), 100)

    # Reverse tasks to show newest first (descending by created_at)
    reversed_tasks = list(reversed(tasks))

    # Calculate pagination
    total_count = len(reversed_tasks)
    total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1

    # Slice tasks for current page
    start = (page - 1) * page_size
    end = start + page_size
    page_tasks = reversed_tasks[start:end]

    return TaskHistoryResponse(
        tasks=page_tasks,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


def paginate_log_history(
    logs: list[Log], page: int, page_size: int
) -> LogHistoryResponse:
    """
    Paginate log list with newest logs first

    Args:
        logs: Full list of logs (will be reversed to show newest first)
        page: Page number (1-indexed)
        page_size: Items per page (max 100, default 1)

    Returns:
        LogHistoryResponse with paginated data, ordered by time descending (newest first)
    """
    # Validate and clamp parameters
    page = max(1, page)
    page_size = min(max(1, page_size), 100)

    # Reverse logs to show newest first (descending by time)
    reversed_logs = list(reversed(logs))

    # Calculate pagination
    total_count = len(reversed_logs)
    total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1

    # Slice logs for current page
    start = (page - 1) * page_size
    end = start + page_size
    page_logs = reversed_logs[start:end]

    return LogHistoryResponse(
        logs=page_logs,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )
