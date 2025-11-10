"""Domain models for fleet-mcp."""

from .agent import Agent, AgentStatus
from .errors import (
    AgentConflictError,
    AgentInvalidStateError,
    AgentNotFoundError,
    CoderAPIError,
    FleetMCPError,
)
from .errors import ValidationError as FleetValidationError
from .project import Project, Role
from .remote import (
    TemplateParameterRemote,
    TemplateRemote,
    WorkspaceBuildRemote,
    WorkspacePresetRemote,
    WorkspaceRemote,
)
from .responses import (
    AgentListView,
    CancelTaskResponse,
    CreateAgentResponse,
    DeleteAgentResponse,
    ListAgentsResponse,
    ListProjectsResponse,
    ListRolesResponse,
    RestartAgentResponse,
    ShowAgentResponse,
    ShowLogsResponse,
    ShowTaskHistoryResponse,
    StartTaskResponse,
)
from .task import ConversationLog, LogEntry, Task, TaskHistory

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
    "AgentListView",
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
