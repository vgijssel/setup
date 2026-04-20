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

    For metadata, only includes fields with include_in_list=true and shows values only
    (no schema objects).
    """

    name: str = Field(..., description="Unique agent name")
    status: AgentStatus = Field(..., description="Current agent status")
    role: str = Field(..., description="Workspace preset name")
    project: str = Field(..., description="Template name")
    last_task: Optional[str] = Field(None, description="Most recent task description")
    created_at: datetime = Field(..., description="Agent creation timestamp")
    metadata: Optional[dict] = Field(
        None,
        description="Filtered workspace metadata (only include_in_list=true fields, values only)",
    )
    metadata_count: int = Field(
        0, description="Total count of all metadata fields (not just filtered fields)"
    )

    @classmethod
    def from_agent(cls, agent: Agent) -> "AgentListView":
        """Create an AgentListView from an Agent domain model.

        Args:
            agent: Agent domain model

        Returns:
            AgentListView with workspace_id and updated_at excluded,
            and metadata filtered to include_in_list=true fields only
        """
        # Filter metadata for list view
        filtered_metadata = None
        metadata_count = 0

        if agent.metadata and isinstance(agent.metadata, dict):
            data = agent.metadata.get("data", {})
            if data:
                # Extract only fields with include_in_list=true, values only
                filtered_metadata = {
                    name: field_data.get("value")
                    for name, field_data in data.items()
                    if isinstance(field_data, dict)
                    and field_data.get("schema", {}).get("include_in_list", False)
                }
                metadata_count = len(data)
                # If no fields to include, set to None
                if not filtered_metadata:
                    filtered_metadata = None

        return cls(
            name=agent.name,
            status=agent.status,
            role=agent.role,
            project=agent.project,
            last_task=agent.last_task,
            created_at=agent.created_at,
            metadata=filtered_metadata,
            metadata_count=metadata_count,
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


class UpdateAgentResponse(BaseModel):
    """Response for update_agent tool."""

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
