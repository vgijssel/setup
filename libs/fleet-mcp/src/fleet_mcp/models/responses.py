"""Response models for MCP tools"""
from pydantic import BaseModel
from fleet_mcp.models.agent import Agent
from fleet_mcp.models.task import Task
from fleet_mcp.models.role import Role
from fleet_mcp.models.project import Project


# T023: Basic response models
class AgentSummary(BaseModel):
    """Summary of an agent for list responses"""
    name: str
    status: str
    current_task: str | None


class CreateAgentResponse(BaseModel):
    """Response for create_agent tool"""
    agent: Agent
    message: str


class AgentListResponse(BaseModel):
    """Response for list_agents tool"""
    agents: list[AgentSummary]
    total_count: int


# T024: Additional response models
class AgentDetailsResponse(BaseModel):
    """Response for show_agent tool"""
    agent: Agent


class TaskHistoryResponse(BaseModel):
    """Response for show_agent_task_history tool"""
    tasks: list[Task]
    total_count: int
    page: int
    page_size: int
    total_pages: int


# T025: Task management response models
class StartTaskResponse(BaseModel):
    """Response for start_agent_task tool"""
    task: Task
    agent_status: str
    message: str


class CancelTaskResponse(BaseModel):
    """Response for cancel_agent_task tool"""
    task: Task
    agent_status: str
    message: str


# T026: Agent and discovery response models
class DeleteAgentResponse(BaseModel):
    """Response for delete_agent tool"""
    message: str
    deleted_agent: dict  # Contains name and workspace_id


class ListRolesResponse(BaseModel):
    """Response for list_agent_roles tool"""
    roles: list[Role]


class ListProjectsResponse(BaseModel):
    """Response for list_agent_projects tool"""
    projects: list[Project]
