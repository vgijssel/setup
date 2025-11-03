"""Agent service for business logic and orchestration"""

from datetime import datetime

from fleet_mcp.repositories.agent_repository import AgentRepository
from fleet_mcp.repositories.discovery_repository import DiscoveryRepository
from fleet_mcp.repositories.task_repository import TaskRepository
from fleet_mcp.schemas.agent import Agent
from fleet_mcp.schemas.log import Log
from fleet_mcp.schemas.responses import (
    AgentDetailsResponse,
    AgentListResponse,
    AgentSummary,
    CreateAgentResponse,
    DeleteAgentResponse,
    LogHistoryResponse,
    TaskHistoryResponse,
)
from fleet_mcp.schemas.task import Task


class AgentService:
    """Service for agent-related business logic"""

    def __init__(self):
        """Initialize service with repositories"""
        self._agent_repo = AgentRepository()
        self._task_repo = TaskRepository()
        self._discovery_repo = DiscoveryRepository()

    async def create_agent(
        self, name: str, project: str, task: str, role: str = "coder"
    ) -> CreateAgentResponse:
        """
        Create a new agent

        Args:
            name: Agent name
            project: Project/template name
            task: Task description
            role: Agent role (workspace preset)

        Returns:
            CreateAgentResponse with agent details

        Raises:
            ValueError: If agent exists or project is invalid
        """
        # Validate agent doesn't exist
        existing = await self._agent_repo.get_agent_by_name(name)
        if existing:
            raise ValueError(f"Agent with name '{name}' already exists")

        # Validate project
        valid_projects = await self._get_valid_project_names()
        if project not in valid_projects:
            raise ValueError(
                f"Project '{project}' is not a valid fleet-mcp project. "
                f"Valid projects must have ai_prompt and system_prompt parameters. "
                f"Available projects: {', '.join(sorted(valid_projects))}"
            )

        # Create workspace
        workspace = await self._agent_repo.create_agent(name, project, role, task)

        # Fetch additional data
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")
        task_data = None
        if workspace_id and owner_name:
            task_data = await self._task_repo.get_task(owner_name, workspace_id)

        # Fetch template display name
        template_display_name = None
        template_id = workspace.get("template_id")
        if template_id:
            try:
                template_details = await self._agent_repo.get_template(template_id)
                template_display_name = template_details.get("display_name")
            except Exception:
                pass

        # Build agent model
        agent = Agent.from_workspace(
            workspace,
            agent_metadata={
                "15_agent_name": name,
                "13_agent_role": role,
                "14_agent_project": project,
            },
            task_data=task_data,
            template_display_name=template_display_name,
        )

        return CreateAgentResponse(
            agent=agent, message=f"Agent '{name}' created successfully"
        )

    async def list_agents(self) -> AgentListResponse:
        """
        List all agents

        Returns:
            AgentListResponse with agent summaries
        """
        workspaces = await self._agent_repo.list_agents()
        valid_project_names = await self._get_valid_project_names()
        template_cache: dict[str, str] = {}

        agents = []
        for ws in workspaces:
            # Filter for agent workspaces
            workspace_name = ws.get("name", "")
            if not workspace_name.startswith("agent-"):
                continue

            # Filter for valid fleet-mcp projects
            template_name = ws.get("template_name", "")
            if template_name not in valid_project_names:
                continue

            try:
                # Fetch task data
                workspace_id = ws.get("id")
                owner_name = ws.get("owner_name")
                task_data = None
                if workspace_id and owner_name:
                    task_data = await self._task_repo.get_task(owner_name, workspace_id)

                # Fetch template display name (with caching)
                template_display_name = None
                template_id = ws.get("template_id")
                if template_id:
                    if template_id in template_cache:
                        template_display_name = template_cache[template_id]
                    else:
                        try:
                            template_details = await self._agent_repo.get_template(
                                template_id
                            )
                            template_display_name = template_details.get("display_name")
                            if template_display_name:
                                template_cache[template_id] = template_display_name
                        except Exception:
                            pass

                agent = Agent.from_workspace(
                    ws, task_data=task_data, template_display_name=template_display_name
                )
                agents.append(
                    AgentSummary(
                        name=agent.name,
                        status=agent.status.value,
                        project=agent.project,
                        last_task=agent.last_task,
                    )
                )
            except Exception:
                continue

        return AgentListResponse(agents=agents, total_count=len(agents))

    async def show_agent(self, agent_name: str) -> AgentDetailsResponse:
        """
        Show agent details

        Args:
            agent_name: Agent name

        Returns:
            AgentDetailsResponse with full agent details

        Raises:
            ValueError: If agent not found
        """
        workspace = await self._agent_repo.get_agent_by_name(agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_details = await self._agent_repo.get_agent_details(workspace["id"])

        # Get agent metadata
        agent_metadata = {}
        if workspace_details.get("latest_build", {}).get("resources"):
            for resource in workspace_details["latest_build"]["resources"]:
                if resource.get("agents"):
                    # Note: agent metadata extraction would go here
                    # For MVP, using synthetic metadata
                    break

        # Create synthetic metadata if needed
        if not agent_metadata and workspace.get("name", "").startswith("agent-"):
            name = workspace["name"].replace("agent-", "")
            agent_metadata = {"15_agent_name": name}

        # Fetch task data
        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")
        task_data = None
        if workspace_id and owner_name:
            task_data = await self._task_repo.get_task(owner_name, workspace_id)

        # Fetch template display name
        template_display_name = None
        template_id = workspace.get("template_id")
        if template_id:
            try:
                template_details = await self._agent_repo.get_template(template_id)
                template_display_name = template_details.get("display_name")
            except Exception:
                pass

        agent = Agent.from_workspace(
            workspace, agent_metadata, task_data, template_display_name
        )

        return AgentDetailsResponse(agent=agent)

    async def show_agent_task_history(
        self, agent_name: str, page: int = 1, page_size: int = 20
    ) -> TaskHistoryResponse:
        """
        Show agent task history (paginated)

        Args:
            agent_name: Agent name
            page: Page number (1-indexed)
            page_size: Items per page

        Returns:
            TaskHistoryResponse with paginated task history

        Raises:
            ValueError: If agent not found
        """
        workspace = await self._agent_repo.get_agent_by_name(agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_details = await self._agent_repo.get_agent_details(workspace["id"])

        # Extract task history from workspace structure
        tasks = []
        if workspace_details.get("latest_build", {}).get("resources"):
            for resource in workspace_details["latest_build"]["resources"]:
                if resource.get("agents"):
                    for agent in resource["agents"]:
                        if agent.get("apps"):
                            for app in agent["apps"]:
                                if app.get("slug") == "ccw" or "Claude Code" in app.get(
                                    "display_name", ""
                                ):
                                    statuses = app.get("statuses", [])
                                    for status in statuses:
                                        tasks.append(
                                            Task(
                                                message=status.get("message", ""),
                                                uri=status.get("uri", ""),
                                                needs_user_attention=status.get(
                                                    "needs_user_attention", False
                                                ),
                                                created_at=datetime.fromisoformat(
                                                    status.get(
                                                        "created_at",
                                                        datetime.now().isoformat(),
                                                    )
                                                ),
                                            )
                                        )
                                    break

        # Paginate
        return self._paginate_task_history(tasks, page, page_size)

    async def show_agent_log(
        self, agent_name: str, page: int = 1, page_size: int = 1
    ) -> LogHistoryResponse:
        """
        Show agent conversation log (paginated)

        Args:
            agent_name: Agent name
            page: Page number (1-indexed)
            page_size: Items per page (default 1)

        Returns:
            LogHistoryResponse with paginated logs

        Raises:
            ValueError: If agent not found
        """
        workspace = await self._agent_repo.get_agent_by_name(agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace.get("id")
        owner_name = workspace.get("owner_name")
        if not workspace_id or not owner_name:
            raise ValueError(f"Agent '{agent_name}' has invalid workspace data")

        # Fetch logs
        log_data = await self._task_repo.get_task_logs(owner_name, workspace_id)
        logs = [Log(**log_entry) for log_entry in log_data]

        # Paginate
        return self._paginate_log_history(logs, page, page_size)

    async def delete_agent(self, agent_name: str) -> DeleteAgentResponse:
        """
        Delete an agent

        Args:
            agent_name: Agent name

        Returns:
            DeleteAgentResponse

        Raises:
            ValueError: If agent not found
        """
        workspace = await self._agent_repo.get_agent_by_name(agent_name)
        if not workspace:
            raise ValueError(f"Agent '{agent_name}' not found")

        workspace_id = workspace["id"]
        await self._agent_repo.delete_agent(workspace_id)

        return DeleteAgentResponse(
            message=f"Agent '{agent_name}' deleted successfully",
            deleted_agent={"name": agent_name, "workspace_id": workspace_id},
        )

    async def _get_valid_project_names(self) -> set[str]:
        """Get set of valid fleet-mcp project names"""
        templates = await self._discovery_repo.list_templates()
        valid_projects = []

        for template in templates:
            display_name = template.get("display_name", "").strip()
            if not display_name:
                continue

            template_id = template.get("id")
            if not template_id:
                continue

            try:
                template_details = await self._discovery_repo.get_template(template_id)
                active_version_id = template_details.get("active_version_id")
                if not active_version_id:
                    continue

                rich_params = await self._discovery_repo.get_template_version_rich_parameters(
                    active_version_id
                )
                param_names = {
                    param.get("name", "").lower().replace(" ", "_")
                    for param in rich_params
                }

                if "ai_prompt" in param_names and "system_prompt" in param_names:
                    valid_projects.append(template)
            except Exception:
                continue

        return {project.get("name") for project in valid_projects if project.get("name")}

    def _paginate_task_history(
        self, tasks: list[Task], page: int, page_size: int
    ) -> TaskHistoryResponse:
        """Paginate task history"""
        page = max(1, page)
        page_size = min(max(1, page_size), 100)

        reversed_tasks = list(reversed(tasks))
        total_count = len(reversed_tasks)
        total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1

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

    def _paginate_log_history(
        self, logs: list[Log], page: int, page_size: int
    ) -> LogHistoryResponse:
        """Paginate log history"""
        page = max(1, page)
        page_size = min(max(1, page_size), 100)

        reversed_logs = list(reversed(logs))
        total_count = len(reversed_logs)
        total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1

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
