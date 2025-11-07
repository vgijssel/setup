"""Domain models for fleet-mcp-clean."""

from .agent import Agent, AgentStatus
from .task import Task, TaskHistory, ConversationLog, LogEntry
from .project import Project, Role
from .remote import WorkspaceRemote, WorkspaceBuildRemote, TemplateRemote, TemplateParameterRemote, WorkspacePresetRemote
from .responses import (
    ListAgentsResponse,
    ShowAgentResponse,
    CreateAgentResponse,
    DeleteAgentResponse,
    RestartAgentResponse,
    StartTaskResponse,
    CancelTaskResponse,
    ShowTaskHistoryResponse,
    ShowLogsResponse,
    ListProjectsResponse,
    ListRolesResponse,
)
from .errors import (
    FleetMCPError,
    AgentNotFoundError,
    AgentConflictError,
    AgentInvalidStateError,
    CoderAPIError,
    ValidationError as FleetValidationError,
)

__all__ = [
    # Core entities
    "Agent",
    "AgentStatus",
    "Task",
    "TaskHistory",
    "ConversationLog",
    "LogEntry",
    "Project",
    "Role",
    # Remote models
    "WorkspaceRemote",
    "WorkspaceBuildRemote",
    "TemplateRemote",
    "TemplateParameterRemote",
    "WorkspacePresetRemote",
    # Response models
    "ListAgentsResponse",
    "ShowAgentResponse",
    "CreateAgentResponse",
    "DeleteAgentResponse",
    "RestartAgentResponse",
    "StartTaskResponse",
    "CancelTaskResponse",
    "ShowTaskHistoryResponse",
    "ShowLogsResponse",
    "ListProjectsResponse",
    "ListRolesResponse",
    # Errors
    "FleetMCPError",
    "AgentNotFoundError",
    "AgentConflictError",
    "AgentInvalidStateError",
    "CoderAPIError",
    "FleetValidationError",
]
