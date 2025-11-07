"""Response models for MCP tools."""

from typing import Optional

from pydantic import BaseModel

from .agent import Agent
from .task import TaskHistory, ConversationLog
from .project import Project, Role


class ListAgentsResponse(BaseModel):
    """Response for list_agents tool."""

    agents: list[Agent]
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
