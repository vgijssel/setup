"""Agent service for business logic and orchestration."""

from typing import Optional

from ..models import Agent, AgentStatus
from ..models.errors import AgentNotFoundError, ValidationError
from ..repositories import AgentRepository, ProjectRepository


class AgentService:
    """Service for agent business logic and validation.

    Architecture: Layer 2 (Service Layer)
    Dependencies: AgentRepository, ProjectRepository (Layer 3)
    Used by: MCP Tools (Layer 1)

    Responsibilities:
    - Business logic for agent operations
    - Input validation and business rule enforcement
    - Orchestration across multiple repositories
    - Status filtering and projection
    """

    def __init__(
        self, agent_repo: AgentRepository, project_repo: ProjectRepository
    ):
        """Initialize service with repositories.

        Args:
            agent_repo: Repository for agent data access
            project_repo: Repository for project data access
        """
        self.agent_repo = agent_repo
        self.project_repo = project_repo

    async def list_agents(
        self,
        status_filter: Optional[AgentStatus] = None,
        project_filter: Optional[str] = None,
    ) -> list[Agent]:
        """List all agents with optional filtering.

        Args:
            status_filter: Filter by agent status (optional)
            project_filter: Filter by project name (optional)

        Returns:
            List of Agent domain models matching filters

        Raises:
            ValidationError: If filters are invalid
        """
        agents = await self.agent_repo.list_all()

        # Apply filters
        if status_filter:
            agents = [a for a in agents if a.status == status_filter]

        if project_filter:
            agents = [a for a in agents if a.project == project_filter]

        return agents

    async def get_agent(self, name: str) -> Agent:
        """Get agent details by name.

        Args:
            name: Agent name

        Returns:
            Agent domain model

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("Agent name cannot be empty")

        return await self.agent_repo.get_by_name(name)

    async def create_agent(
        self, name: str, project: str, task: str, role: str = "coder"
    ) -> Agent:
        """Create a new agent with validation.

        Args:
            name: Unique agent name (1-20 alphanumeric + hyphens)
            project: Project name (must exist)
            task: Initial task description (non-empty)
            role: Agent role name (must exist in project, default: "coder")

        Returns:
            Created Agent domain model

        Raises:
            ValidationError: If inputs are invalid
            AgentConflictError: If agent name already exists
            CoderAPIError: If Coder API fails
        """
        # Validate agent name format
        self._validate_agent_name(name)

        # Validate task description
        if not task or not task.strip():
            raise ValidationError("task", "Task description cannot be empty")

        # Validate project exists
        projects = await self.project_repo.list_all()
        project_names = [p.name for p in projects]

        if project not in project_names:
            raise ValidationError(
                "project",
                f"Project '{project}' not found. Available projects: {', '.join(project_names)}"
            )

        # Get project details to find template_id
        template_id = None
        for p in projects:
            if p.name == project:
                template_id = p.id
                break

        if not template_id:
            raise ValidationError(f"Template ID not found for project '{project}'")

        # Validate role exists in project
        roles = await self.project_repo.list_roles(project)
        role_names = [r.name for r in roles]

        if role not in role_names:
            raise ValidationError(
                f"Role '{role}' not found in project '{project}'. Available roles: {', '.join(role_names)}"
            )

        # Get preset ID for the role
        preset_id = None
        for r in roles:
            if r.name == role:
                preset_id = r.id
                break

        if not preset_id:
            raise ValidationError(
                f"Preset ID not found for role '{role}' in project '{project}'"
            )

        # Check name uniqueness
        try:
            existing = await self.agent_repo.get_by_name(name)
            if existing:
                from ..models.errors import AgentConflictError

                raise AgentConflictError(f"Agent with name '{name}' already exists")
        except AgentNotFoundError:
            # Good - name is available
            pass

        # Create the agent
        return await self.agent_repo.create(
            name=name, template_id=template_id, preset_id=preset_id, task=task
        )

    async def delete_agent(self, name: str) -> None:
        """Delete an agent.

        Args:
            name: Agent name

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("name", "Agent name cannot be empty")

        await self.agent_repo.delete(name)

    async def restart_agent(self, name: str) -> Agent:
        """Restart an agent's workspace.

        Args:
            name: Agent name

        Returns:
            Updated Agent domain model

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("name", "Agent name cannot be empty")

        return await self.agent_repo.restart(name)

    def _validate_agent_name(self, name: str) -> None:
        """Validate agent name format.

        Business Rules:
        - Must be 1-20 characters
        - Must contain only alphanumeric characters and hyphens
        - Cannot be empty or whitespace-only

        Args:
            name: Agent name to validate

        Raises:
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("name", "Agent name cannot be empty")

        if len(name) > 20:
            raise ValidationError(
                "name",
                f"Agent name must be 20 characters or less (got {len(name)})"
            )

        if not all(c.isalnum() or c == "-" for c in name):
            raise ValidationError(
                "name",
                "Agent name must contain only alphanumeric characters and hyphens"
            )
