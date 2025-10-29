"""Task history and pagination helpers"""
from fleet_mcp.models.task import Task
from fleet_mcp.models.responses import TaskHistoryResponse


def paginate_task_history(
    tasks: list[Task],
    page: int,
    page_size: int
) -> TaskHistoryResponse:
    """
    Paginate task list

    Args:
        tasks: Full list of tasks
        page: Page number (1-indexed)
        page_size: Items per page (max 100)

    Returns:
        TaskHistoryResponse with paginated data
    """
    # Validate and clamp parameters
    page = max(1, page)
    page_size = min(max(1, page_size), 100)

    # Calculate pagination
    total_count = len(tasks)
    total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1

    # Slice tasks for current page
    start = (page - 1) * page_size
    end = start + page_size
    page_tasks = tasks[start:end]

    return TaskHistoryResponse(
        tasks=page_tasks,
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )
