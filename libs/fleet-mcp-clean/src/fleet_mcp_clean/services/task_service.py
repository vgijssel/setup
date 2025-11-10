"""Task service for task assignment business logic (Layer 2 - Business Logic)."""

from ..repositories.task_repository import TaskRepository
from ..repositories.agent_repository import AgentRepository
from ..models import AgentStatus


class TaskService:
    """Service for task assignment operations.

    Architecture: Layer 2 (Business Logic)
    Dependencies: TaskRepository (Layer 3), AgentRepository (Layer 3)

    Responsibilities:
    - Validate business rules for task assignment
    - Validate business rules for task cancellation
    - Coordinate between repositories
    """

    def __init__(self, task_repository: TaskRepository, agent_repository: AgentRepository):
        """Initialize TaskService.

        Args:
            task_repository: TaskRepository instance for task operations
            agent_repository: AgentRepository instance for agent lookups
        """
        self.task_repository = task_repository
        self.agent_repository = agent_repository

    async def assign_task(self, agent_name: str, task_description: str) -> None:
        """Assign a task to an agent (case-insensitive agent name).

        Business Rules:
        1. Agent must exist
        2. Agent must be idle (not busy)
        3. Agent must be online (not offline/failed)
        4. Task description must not be empty

        Args:
            agent_name: Name of the agent to assign task to (case-insensitive)
            task_description: Description of the task to assign

        Raises:
            ValidationError: If task description is empty
            AgentNotFoundError: If agent doesn't exist
            ValueError: If agent is not idle or not online
        """
        # Validate task description
        if not task_description or not task_description.strip():
            raise ValueError("Task description cannot be empty")

        # Normalize agent name to lowercase for case-insensitive lookup
        normalized_name = agent_name.lower()

        # Get agent to validate status
        agent = await self.agent_repository.get_by_name(normalized_name)

        # Validate agent is online (workspace must be running, not stopped/failed/etc)
        if not agent.is_online():
            raise ValueError(
                f"Cannot assign task to offline agent '{agent_name}' "
                f"(status: {agent.status.value}). Agent must be running (idle or busy)."
            )

        # Validate agent is idle (not busy or starting)
        if agent.status != AgentStatus.IDLE:
            raise ValueError(
                f"Cannot assign task to non-idle agent '{agent_name}' "
                f"(status: {agent.status.value}). Agent must be idle."
            )

        # Assign the task
        await self.task_repository.assign_task(normalized_name, task_description)

    async def cancel_task(self, agent_name: str) -> None:
        """Cancel the current task on an agent (case-insensitive agent name).

        Business Rules:
        1. Agent must exist
        2. Agent must be busy (has a running task)

        Args:
            agent_name: Name of the agent to cancel task for (case-insensitive)

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValueError: If agent is not busy
        """
        # Normalize agent name to lowercase for case-insensitive lookup
        normalized_name = agent_name.lower()

        # Get agent to validate status
        agent = await self.agent_repository.get_by_name(normalized_name)

        # Validate agent is busy
        if agent.status != AgentStatus.BUSY:
            raise ValueError(
                f"Cannot cancel task on non-busy agent '{agent_name}' "
                f"(status: {agent.status.value}). Agent must be busy."
            )

        # Cancel the task
        await self.task_repository.cancel_task(normalized_name)

    async def get_task_history(
        self, agent_name: str, page: int = 1, page_size: int = 20
    ) -> tuple[list[dict], int]:
        """Get paginated task history for an agent (case-insensitive agent name).

        Args:
            agent_name: Name of the agent (case-insensitive)
            page: Page number (1-indexed)
            page_size: Items per page (max 100)

        Returns:
            Tuple of (task list, total count)

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValueError: If page or page_size is invalid
        """
        # Validate pagination parameters
        if page < 1:
            raise ValueError("Page must be >= 1")
        if page_size < 1 or page_size > 100:
            raise ValueError("Page size must be between 1 and 100")

        # Normalize agent name to lowercase for case-insensitive lookup
        normalized_name = agent_name.lower()

        # Get all tasks from repository
        all_tasks = await self.task_repository.get_task_history(normalized_name)

        # Sort by created_at descending (newest first)
        sorted_tasks = sorted(
            all_tasks,
            key=lambda t: t.get("created_at", ""),
            reverse=True
        )

        # Calculate pagination
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_tasks = sorted_tasks[start_idx:end_idx]

        return paginated_tasks, len(sorted_tasks)

    async def get_conversation_logs(
        self, agent_name: str, page: int = 1, page_size: int = 1
    ) -> tuple[list[dict], int]:
        """Get paginated conversation logs for an agent (case-insensitive agent name).

        Args:
            agent_name: Name of the agent (case-insensitive)
            page: Page number (1-indexed)
            page_size: Items per page (max 100, default 1)

        Returns:
            Tuple of (log list, total count)

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValueError: If page or page_size is invalid
        """
        # Validate pagination parameters
        if page < 1:
            raise ValueError("Page must be >= 1")
        if page_size < 1 or page_size > 100:
            raise ValueError("Page size must be between 1 and 100")

        # Normalize agent name to lowercase for case-insensitive lookup
        normalized_name = agent_name.lower()

        # Get all logs from repository
        all_logs = await self.task_repository.get_conversation_logs(normalized_name)

        # Sort by time descending (newest first)
        sorted_logs = sorted(
            all_logs,
            key=lambda l: l.get("time", ""),
            reverse=True
        )

        # Calculate pagination
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_logs = sorted_logs[start_idx:end_idx]

        return paginated_logs, len(sorted_logs)
