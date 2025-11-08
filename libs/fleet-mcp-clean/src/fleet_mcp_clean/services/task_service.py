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
        """Assign a task to an agent.

        Business Rules:
        1. Agent must exist
        2. Agent must be idle (not busy)
        3. Agent must be online (not offline/failed)
        4. Task description must not be empty

        Args:
            agent_name: Name of the agent to assign task to
            task_description: Description of the task to assign

        Raises:
            ValidationError: If task description is empty
            AgentNotFoundError: If agent doesn't exist
            ValueError: If agent is not idle or not online
        """
        # Validate task description
        if not task_description or not task_description.strip():
            raise ValueError("Task description cannot be empty")

        # Get agent to validate status
        agent = await self.agent_repository.get_by_name(agent_name)

        # Validate agent is online (not offline or failed)
        if agent.status in (AgentStatus.OFFLINE, AgentStatus.FAILED):
            raise ValueError(
                f"Cannot assign task to offline agent '{agent_name}' "
                f"(status: {agent.status.value})"
            )

        # Validate agent is idle (not busy or starting)
        if agent.status != AgentStatus.IDLE:
            raise ValueError(
                f"Cannot assign task to non-idle agent '{agent_name}' "
                f"(status: {agent.status.value}). Agent must be idle."
            )

        # Assign the task
        await self.task_repository.assign_task(agent_name, task_description)

    async def cancel_task(self, agent_name: str) -> None:
        """Cancel the current task on an agent.

        Business Rules:
        1. Agent must exist
        2. Agent must be busy (has a running task)

        Args:
            agent_name: Name of the agent to cancel task for

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValueError: If agent is not busy
        """
        # Get agent to validate status
        agent = await self.agent_repository.get_by_name(agent_name)

        # Validate agent is busy
        if agent.status != AgentStatus.BUSY:
            raise ValueError(
                f"Cannot cancel task on non-busy agent '{agent_name}' "
                f"(status: {agent.status.value}). Agent must be busy."
            )

        # Cancel the task
        await self.task_repository.cancel_task(agent_name)
