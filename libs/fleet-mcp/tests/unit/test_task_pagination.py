"""Unit tests for task pagination and ordering"""

from datetime import datetime, timedelta

from fleet_mcp.coder.tasks import paginate_task_history
from fleet_mcp.models.task import Task


def test_paginate_task_history_newest_first():
    """Test that task history is returned with newest tasks first

    This is a regression test to ensure tasks are ordered by created_at
    descending (newest first), which is the expected behavior for task history.
    """
    # Create tasks with incrementing timestamps
    now = datetime.now()
    tasks = [
        Task(
            message="Task 1 (oldest)",
            uri="",
            needs_user_attention=False,
            created_at=now,
        ),
        Task(
            message="Task 2",
            uri="",
            needs_user_attention=False,
            created_at=now + timedelta(seconds=1),
        ),
        Task(
            message="Task 3 (newest)",
            uri="",
            needs_user_attention=False,
            created_at=now + timedelta(seconds=2),
        ),
    ]

    # Paginate with page_size that includes all tasks
    result = paginate_task_history(tasks, page=1, page_size=10)

    # Verify newest task is first
    assert len(result.tasks) == 3
    assert result.tasks[0].message == "Task 3 (newest)"
    assert result.tasks[1].message == "Task 2"
    assert result.tasks[2].message == "Task 1 (oldest)"


def test_paginate_task_history_empty_message():
    """Test that tasks with empty messages are included in pagination

    Regression test for agent startup states where message may be empty.
    """
    now = datetime.now()
    tasks = [
        Task(
            message="",  # Empty message (agent startup)
            uri="",
            needs_user_attention=False,
            created_at=now,
        ),
        Task(
            message="Working on task",
            uri="file:///workspace",
            needs_user_attention=False,
            created_at=now + timedelta(seconds=1),
        ),
    ]

    result = paginate_task_history(tasks, page=1, page_size=10)

    # Verify both tasks are included, newest first
    assert len(result.tasks) == 2
    assert result.tasks[0].message == "Working on task"
    assert result.tasks[1].message == ""


def test_paginate_task_history_pagination():
    """Test pagination splits tasks correctly with newest first"""
    now = datetime.now()
    tasks = [
        Task(
            message=f"Task {i}",
            uri="",
            needs_user_attention=False,
            created_at=now + timedelta(seconds=i),
        )
        for i in range(10)
    ]

    # Get page 1 (newest 5 tasks)
    page1 = paginate_task_history(tasks, page=1, page_size=5)
    assert len(page1.tasks) == 5
    assert page1.tasks[0].message == "Task 9"  # Newest
    assert page1.tasks[4].message == "Task 5"
    assert page1.total_count == 10
    assert page1.total_pages == 2

    # Get page 2 (oldest 5 tasks)
    page2 = paginate_task_history(tasks, page=2, page_size=5)
    assert len(page2.tasks) == 5
    assert page2.tasks[0].message == "Task 4"
    assert page2.tasks[4].message == "Task 0"  # Oldest
