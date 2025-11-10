"""Response models for MCP tools."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from .agent import Agent, AgentStatus
from .project import Project, Role
from .task import ConversationLog, TaskHistory


class AgentListView(BaseModel):
    """View model for agent list - excludes workspace_id and updated_at.

    This model is used in list operations where workspace_id and updated_at are
    internal details that should not be exposed to clients in list views.
    """

    name: str = Field(..., description="Unique agent name")
    status: AgentStatus = Field(..., description="Current agent status")
    role: str = Field(..., description="Workspace preset name")
    project: str = Field(..., description="Template name")
    last_task: Optional[str] = Field(None, description="Most recent task description")
    created_at: datetime = Field(..., description="Agent creation timestamp")

    @classmethod
    def from_agent(cls, agent: Agent) -> "AgentListView":
        """Create an AgentListView from an Agent domain model.

        Args:
            agent: Agent domain model

        Returns:
            AgentListView with workspace_id and updated_at excluded
        """
        return cls(
            name=agent.name,
            status=agent.status,
            role=agent.role,
            project=agent.project,
            last_task=agent.last_task,
            created_at=agent.created_at,
        )


class ListAgentsResponse(BaseModel):
    """Response for list_agents tool."""

    agents: list[AgentListView]
    total_count: int


class ShowAgentResponse(BaseModel):
    """Response for show_agent tool."""

    agent: Agent


class CreateAgentResponse(BaseModel):
    """Response for create_agent tool."""

    agent: Agent
    message: str


class DeleteAgentResponse(BaseModel):
    """Response for delete_agent tool."""

    agent_name: str
    message: str


class RestartAgentResponse(BaseModel):
    """Response for restart_agent tool."""

    agent: Agent
    message: str


class StartTaskResponse(BaseModel):
    """Response for start_agent_task tool."""

    agent_name: str
    task_description: str
    message: str


class CancelTaskResponse(BaseModel):
    """Response for cancel_agent_task tool."""

    agent_name: str
    message: str


class ShowTaskHistoryResponse(BaseModel):
    """Response for show_agent_task_history tool."""

    history: TaskHistory


class ShowLogsResponse(BaseModel):
    """Response for show_agent_log tool."""

    logs: ConversationLog


class ListProjectsResponse(BaseModel):
    """Response for list_agent_projects tool."""

    projects: list[Project]
    total_count: int


class ListRolesResponse(BaseModel):
    """Response for list_agent_roles tool."""

    roles: list[Role]
    project_name: str
    total_count: int
