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
            project_filter: Filter by project name (optional, case-insensitive)

        Returns:
            List of Agent domain models matching filters

        Raises:
            ValidationError: If filters are invalid

        Note:
            Project name filtering is case insensitive because the Coder API
            backend is case insensitive. For example, filtering by "Setup",
            "SETUP", or "setup" will all return the same agents.
        """
        agents = await self.agent_repo.list_all()

        # Apply filters
        if status_filter:
            agents = [a for a in agents if a.status == status_filter]

        if project_filter:
            # Case-insensitive project filter comparison
            project_filter_lower = project_filter.lower()
            agents = [a for a in agents if a.project.lower() == project_filter_lower]

        return agents

    async def get_agent(self, name: str) -> Agent:
        """Get agent details by name (case-insensitive).

        Args:
            name: Agent name (case-insensitive)

        Returns:
            Agent domain model

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("name", "Agent name cannot be empty")

        # Normalize to lowercase for case-insensitive lookup
        normalized_name = name.lower()
        return await self.agent_repo.get_by_name(normalized_name)

    async def create_agent(
        self, name: str, project: str, task: str, role: str | None = None
    ) -> Agent:
        """Create a new agent with validation.

        Args:
            name: Unique agent name (1-20 alphanumeric + hyphens)
            project: Project name (must exist)
            task: Initial task description (non-empty)
            role: Agent role name (optional, if None uses first available role for project)

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

        # Validate project exists (case-insensitive)
        projects = await self.project_repo.list_all()
        project_map = {p.name.lower(): p for p in projects}  # Case-insensitive lookup
        normalized_project = project.lower()

        if normalized_project not in project_map:
            available_names = [p.name for p in projects]
            raise ValidationError(
                "project",
                f"Project '{project}' not found. Available projects: {', '.join(available_names)}"
            )

        # Get project details to find template_id
        matched_project = project_map[normalized_project]
        template_id = matched_project.id

        # Query available roles for the project (use matched_project.name for consistency)
        roles = await self.project_repo.list_roles(matched_project.name)

        if not roles:
            raise ValidationError(
                "role",
                f"No roles available for project '{project}'"
            )

        role_map = {r.name.lower(): r for r in roles}  # Case-insensitive lookup

        # If role is not specified, use the default role from backend
        if role is None:
            # Find the role marked as default
            default_role = None
            for r in roles:
                if r.default:
                    default_role = r
                    break

            # If no default found, fall back to first role
            matched_role = default_role if default_role else roles[0]
        else:
            # Validate role exists in project (case-insensitive)
            normalized_role = role.lower()
            if normalized_role not in role_map:
                available_roles = [r.name for r in roles]
                raise ValidationError(
                    "role",
                    f"Role '{role}' not found in project '{project}'. Available roles: {', '.join(available_roles)}"
                )
            matched_role = role_map[normalized_role]

        preset_id = matched_role.id

        # Normalize name to lowercase for case-insensitive handling
        normalized_name = name.lower()

        # Check name uniqueness (case-insensitive)
        try:
            existing = await self.agent_repo.get_by_name(normalized_name)
            if existing:
                from ..models.errors import AgentConflictError

                raise AgentConflictError(f"Agent with name '{name}' already exists")
        except AgentNotFoundError:
            # Good - name is available
            pass

        # Create the agent with normalized name
        return await self.agent_repo.create(
            name=normalized_name, template_id=template_id, preset_id=preset_id, task=task
        )

    async def delete_agent(self, name: str) -> None:
        """Delete an agent (case-insensitive).

        Args:
            name: Agent name (case-insensitive)

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("name", "Agent name cannot be empty")

        # Normalize to lowercase for case-insensitive lookup
        normalized_name = name.lower()
        await self.agent_repo.delete(normalized_name)

    async def restart_agent(self, name: str) -> Agent:
        """Restart an agent's workspace (case-insensitive).

        Args:
            name: Agent name (case-insensitive)

        Returns:
            Updated Agent domain model

        Raises:
            AgentNotFoundError: If agent doesn't exist
            ValidationError: If name is invalid
        """
        if not name or not name.strip():
            raise ValidationError("name", "Agent name cannot be empty")

        # Normalize to lowercase for case-insensitive lookup
        normalized_name = name.lower()
        return await self.agent_repo.restart(normalized_name)

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
