"""Task service for business logic and orchestration"""

from datetime import datetime

from fleet_mcp.repositories.agent_repository import AgentRepository
from fleet_mcp.repositories.task_repository import TaskRepository
from fleet_mcp.schemas.responses import CancelTaskResponse, StartTaskResponse
from fleet_mcp.schemas.task import Task


class TaskService:
    """Service for task-related business logic"""

    def __init__(self):
        """Initialize service with repositories"""
        self._agent_repo = AgentRepository()
        self._task_repo = TaskRepository()

    async def start_agent_task(
        self, agent_name: str, task_description: str
    ) -> StartTaskResponse:
        """
        Start a new task on an agent

        Args:
            agent_name: Agent name
            task_description: Task description

        Returns:
            StartTaskResponse

        Raises:
            ValueError: If validation fails
        """
        # Validate task description
        if not task_description or not task_description.strip():
            raise ValueError("Task description cannot be empty")

        # Get workspace
        workspace = await self._agent_repo.get_agent_by_name(agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # Validate agent is running
        build_status = workspace.get("latest_build", {}).get("status", "")
        if build_status != "running":
            raise ValueError(
                f"Agent '{agent_name}' is not running (status: {build_status}). "
                "Cannot start task on offline agent."
            )

        # Validate agent is not busy
        owner_name = workspace.get("owner_name")
        task_data = await self._task_repo.get_task(owner_name, workspace_id)
        if task_data:
            current_state = task_data.get("current_state", {})
            if current_state.get("state") == "working":
                current_message = current_state.get("message", "unknown task")
                raise ValueError(
                    f"Agent '{agent_name}' is already busy with task: '{current_message}'. "
                    "Cannot start a new task while agent is working."
                )

        # Send task input
        await self._task_repo.send_task_input(owner_name, workspace_id, task_description)

        # Create task record
        task = Task(
            message=task_description,
            uri="",
            needs_user_attention=False,
            created_at=datetime.now(),
        )

        return StartTaskResponse(
            task=task,
            agent_status="busy",
            message=f"Task started successfully on agent '{agent_name}'",
        )

    async def cancel_agent_task(self, agent_name: str) -> CancelTaskResponse:
        """
        Cancel agent's current task

        Args:
            agent_name: Agent name

        Returns:
            CancelTaskResponse

        Raises:
            ValueError: If validation fails
        """
        # Get workspace
        workspace = await self._agent_repo.get_agent_by_name(agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]

        # Validate agent is busy
        owner_name = workspace.get("owner_name")
        task_data = await self._task_repo.get_task(owner_name, workspace_id)
        current_task = None
        if task_data:
            current_state = task_data.get("current_state", {})
            if current_state.get("state") == "working":
                current_task = current_state.get("message", "unknown task")

        if not current_task:
            raise ValueError(f"Agent '{agent_name}' is not busy. No task to cancel.")

        # Get AgentAPI URL
        agentapi_url = await self._task_repo.get_agentapi_url(workspace)
        if not agentapi_url:
            raise ValueError(
                f"Agent '{agent_name}' does not have AgentAPI exposed. "
                "Cannot cancel task. The workspace template must include a "
                "coder_app resource with slug 'ccw', 'agentapi', or 'claude'."
            )

        # Send interrupt
        await self._task_repo.send_agentapi_interrupt(agentapi_url)

        # Create task record
        task = Task(
            message=f"{current_task} (cancellation requested via agentapi)",
            uri=agentapi_url,
            needs_user_attention=False,
            created_at=datetime.now(),
        )

        return CancelTaskResponse(
            task=task,
            agent_status="canceling",
            message=f"Interrupt signal sent to agent '{agent_name}' via AgentAPI. "
            f"The agent will report idle status when cancellation completes.",
        )
