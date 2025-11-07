# Data Model: Fleet MCP Clean Architecture

**Branch**: `003-fleet-mcp-clean` | **Date**: 2025-11-07

## Overview

This document defines the domain entities and their relationships for the fleet-mcp-clean system. All entities are implemented as Pydantic models to provide validation, serialization, and type safety.

## Model Naming Conventions

Fleet-mcp-clean follows a consistent naming pattern for Pydantic models:

1. **Domain Models** (no suffix): Core business entities like `Agent`, `Task`, `Project`, `Role`
2. **Remote Models** ("Remote" suffix): Models representing HTTP responses from external APIs like `WorkspaceRemote`, `TemplateRemote`
3. **Response Models** ("{ToolName}Response" suffix): Models returned from MCP tools to clients like `CreateAgentResponse`, `ListAgentsResponse`
4. **No Input Models**: MCP tools use scalar parameters directly with `Annotated` types instead of input models - **this is critical for FastMCP to work**

**IMPORTANT**: FastMCP requires scalar inputs (str, int, bool, etc.), NOT complex Pydantic models. Never use patterns like `input: CreateAgentInput`.

Example MCP tool signature with scalar inputs:
```python
@mcp.tool()
async def create_agent(
    name: Annotated[str, Field(description="Unique short agent name (e.g., Sony, Papi)")],
    project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
    task: Annotated[str, Field(description="Task description defining objectives and constraints")],
    role: Annotated[str, Field(description="Agent role matching Coder workspace preset")] = "coder",
) -> CreateAgentResponse:
    """Create a new Claude Code agent in a Coder workspace"""
    # implementation
```

## Core Entities

### Agent

Represents a Claude Code instance running in a Coder workspace.

**Purpose**: Primary domain entity representing an autonomous agent in the fleet.

**Attributes**:
- `name` (str, required): Unique identifier for the agent (1-20 alphanumeric + hyphens)
- `workspace_id` (str, required): Coder workspace UUID
- `status` (AgentStatus enum, required): Current lifecycle state
- `role` (str, required): Capability type (workspace preset name)
- `project` (str, required): Template reference (template name)
- `last_task` (str, optional): Most recent task description
- `created_at` (datetime, required): Agent creation timestamp
- `updated_at` (datetime, required): Last modification timestamp

**Business Rules**:
1. Agent names MUST be unique across the fleet
2. Agent names MUST match pattern: `^[a-zA-Z0-9-]{1,20}$`
3. Agents can only accept tasks when status is `idle`
4. Agents can be deleted in any status (forceful deletion)
5. Status transitions: `starting` → `idle` → `busy` → `idle` (or `offline`, `failed`)

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from enum import Enum

class AgentStatus(str, Enum):
    STARTING = "starting"
    IDLE = "idle"
    BUSY = "busy"
    OFFLINE = "offline"
    FAILED = "failed"

class Agent(BaseModel):
    name: str = Field(..., min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9-]+$")
    workspace_id: str = Field(..., description="Coder workspace UUID")
    status: AgentStatus
    role: str = Field(..., description="Workspace preset name")
    project: str = Field(..., description="Template name")
    last_task: str | None = None
    created_at: datetime
    updated_at: datetime

    @field_validator("name")
    @classmethod
    def validate_name_format(cls, v: str) -> str:
        if not v.replace("-", "").isalnum():
            raise ValueError("Agent name must contain only alphanumeric characters and hyphens")
        return v
```

### Task

Represents a work assignment given to an agent.

**Purpose**: Encapsulates a unit of work with metadata about user attention requirements.

**Attributes**:
- `message` (str, required): Work description/instructions (non-empty)
- `uri` (str, optional): Optional resource reference (URL, file path, etc.)
- `needs_user_attention` (bool, required): Flag for human intervention requirement
- `created_at` (datetime, required): Task creation timestamp

**Business Rules**:
1. Task message MUST NOT be empty or whitespace-only
2. Only one task can run on an agent at a time
3. Tasks can be canceled via interrupt signal (SIGINT)
4. Task history persists after task completion

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class Task(BaseModel):
    message: str = Field(..., min_length=1, description="Task description")
    uri: str | None = Field(None, description="Optional resource reference")
    needs_user_attention: bool = Field(False, description="Requires human intervention")
    created_at: datetime

    @field_validator("message")
    @classmethod
    def validate_message_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Task message cannot be empty or whitespace-only")
        return v
```

### Project

Represents a template configuration for creating agents.

**Purpose**: Defines available agent types based on Coder templates.

**Attributes**:
- `id` (str, required): Coder template UUID
- `name` (str, required): Project name mapped from Coder template's display_name
- `description` (str, optional): Project description

**Business Rules**:
1. A Coder template is only considered a valid project if it has a display_name set
2. The project `name` field maps directly to the Coder template's `display_name`
3. Projects MUST have `ai_prompt` and `system_prompt` rich parameters to be valid fleet-mcp projects

**Pydantic Model**:
```python
from pydantic import BaseModel, Field

class Project(BaseModel):
    id: str = Field(..., description="Coder template UUID")
    name: str = Field(..., description="Project name from Coder template display_name")
    description: str | None = Field(None, description="Project description")
```

### Role

Represents a workspace preset that defines agent capabilities.

**Purpose**: Defines capability/permission profiles for agents within a project.

**Attributes**:
- `id` (str, required): Coder workspace preset UUID
- `name` (str, required): Role name mapped directly from coder_workspace_preset name
- `project_id` (str, required): Associated project (template) UUID
- `project_name` (str, required): Associated project name

**Business Rules**:
1. Roles are defined per-project as coder_workspace_preset resources
2. The role `name` field maps directly to the coder_workspace_preset name
3. Role names MUST exist in the project's template definition
4. Each role may have different resource allocations or permissions

**Pydantic Model**:
```python
from pydantic import BaseModel, Field

class Role(BaseModel):
    id: str = Field(..., description="Coder workspace preset UUID")
    name: str = Field(..., description="Role name from coder_workspace_preset name")
    project_id: str = Field(..., description="Associated project (template) UUID")
    project_name: str = Field(..., description="Associated project name")
```

### TaskHistory

Collection of task records for an agent with pagination metadata.

**Purpose**: Provides paginated access to an agent's historical tasks.

**Attributes**:
- `agent_name` (str, required): Agent identifier
- `tasks` (list[Task], required): Ordered list of tasks (newest first)
- `total_count` (int, required): Total number of tasks across all pages
- `page` (int, required): Current page number (1-indexed)
- `page_size` (int, required): Items per page (max 100)

**Business Rules**:
1. Tasks MUST be ordered by `created_at` descending (newest first)
2. Page size MUST NOT exceed 100
3. Page numbers are 1-indexed
4. Empty histories return empty tasks list with `total_count=0`

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, field_validator

class TaskHistory(BaseModel):
    agent_name: str
    tasks: list[Task] = Field(default_factory=list)
    total_count: int = Field(..., ge=0)
    page: int = Field(..., ge=1)
    page_size: int = Field(..., ge=1, le=100)

    @field_validator("page_size")
    @classmethod
    def validate_page_size(cls, v: int) -> int:
        if v > 100:
            raise ValueError("Page size cannot exceed 100")
        return v

    @property
    def has_next_page(self) -> bool:
        """Check if more pages are available"""
        return (self.page * self.page_size) < self.total_count

    @property
    def has_previous_page(self) -> bool:
        """Check if previous pages exist"""
        return self.page > 1
```

### ConversationLog

Collection of log entries for an agent with pagination metadata.

**Purpose**: Provides paginated access to an agent's conversation logs.

**Attributes**:
- `agent_name` (str, required): Agent identifier
- `logs` (list[LogEntry], required): Ordered list of log entries (newest first)
- `total_count` (int, required): Total number of log entries across all pages
- `page` (int, required): Current page number (1-indexed)
- `page_size` (int, required): Items per page (max 100, default 1)

**Business Rules**:
1. Logs MUST be ordered by timestamp descending (newest first)
2. Page size MUST NOT exceed 100
3. Default page size is 1 (show only latest entry)
4. Page numbers are 1-indexed

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, field_validator

class LogEntry(BaseModel):
    timestamp: datetime
    message: str
    level: str = Field(..., pattern="^(DEBUG|INFO|WARN|ERROR)$")

class ConversationLog(BaseModel):
    agent_name: str
    logs: list[LogEntry] = Field(default_factory=list)
    total_count: int = Field(..., ge=0)
    page: int = Field(..., ge=1)
    page_size: int = Field(default=1, ge=1, le=100)

    @field_validator("page_size")
    @classmethod
    def validate_page_size(cls, v: int) -> int:
        if v > 100:
            raise ValueError("Page size cannot exceed 100")
        return v

    @property
    def has_next_page(self) -> bool:
        """Check if more pages are available"""
        return (self.page * self.page_size) < self.total_count

    @property
    def has_previous_page(self) -> bool:
        """Check if previous pages exist"""
        return self.page > 1
```

## Supporting Entities

### WorkspaceRemote

Represents a Coder workspace HTTP response (maps to Agent infrastructure).

**Purpose**: Remote model for Coder API workspace data (Client layer).

**Attributes**:
- `id` (str, required): Workspace UUID
- `name` (str, required): Workspace name (matches agent name)
- `template_id` (str, required): Template UUID
- `template_name` (str, required): Template name
- `owner_id` (str, required): User UUID
- `latest_build` (WorkspaceBuildRemote, required): Most recent build information
- `created_at` (datetime, required): Creation timestamp
- `updated_at` (datetime, required): Last update timestamp

**Pydantic Model**:
```python
from pydantic import BaseModel
from datetime import datetime

class WorkspaceBuildRemote(BaseModel):
    """Remote model for Coder API workspace build responses"""
    id: str
    status: str
    template_version_id: str
    template_version_preset_id: str | None = None
    created_at: datetime

class WorkspaceRemote(BaseModel):
    """Remote model for Coder API workspace responses"""
    id: str
    name: str
    template_id: str
    template_name: str
    owner_id: str
    latest_build: WorkspaceBuildRemote
    created_at: datetime
    updated_at: datetime
```

## Entity Relationships

```
Project (1) ←→ (N) Role
   ↓
   Creates
   ↓
Agent (1) ←→ (N) Task (via TaskHistory)
Agent (1) ←→ (N) LogEntry (via ConversationLog)
Agent (1) ←→ (1) WorkspaceRemote (infrastructure mapping)
```

### Relationship Rules

1. **Project → Role**: One-to-many
   - A project can have multiple roles (workspace presets)
   - A role belongs to exactly one project

2. **Project → Agent**: One-to-many
   - A project template can create multiple agents
   - An agent is created from exactly one project

3. **Agent → Task**: One-to-many (historical)
   - An agent can have multiple tasks in history
   - Only one task can be active at a time (business rule)

4. **Agent → LogEntry**: One-to-many
   - An agent generates multiple log entries over time
   - Log entries are immutable records

5. **Agent ↔ WorkspaceRemote**: One-to-one
   - Each agent has exactly one Coder workspace
   - Each workspace represents exactly one agent
   - WorkspaceRemote is the HTTP response representation from Coder API

## Data Flow Examples

### Example 1: Create Agent

**MCP Tool Call** (no Input model):
```python
# Tool parameters (using Annotated types)
name="data-scientist"
project="Setup"
role="coder"
task="Analyze dataset X"
```

**Internal Transformations**:
1. Service layer validates name uniqueness
2. Repository layer looks up Project by name
3. Repository layer looks up Role by project + preset name
4. Client layer calls Coder API to create workspace
5. Client returns WorkspaceRemote
6. Repository maps WorkspaceRemote → Agent (domain entity)
7. Service returns Agent to Tool layer
8. Tool layer wraps Agent in CreateAgentResponse

**MCP Tool Response**:
```python
CreateAgentResponse(
    agent=Agent(
        name="data-scientist",
        workspace_id="uuid-here",
        status=AgentStatus.STARTING,
        role="coder",
        project="Setup",
        last_task="Analyze dataset X",
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    message="Agent 'data-scientist' created successfully"
)
```

### Example 2: List Agents with Filtering

**MCP Tool Call** (no Input model):
```python
# Optional filter parameters
status_filter=AgentStatus.IDLE
project_filter="Setup"
```

**Internal Transformations**:
1. Service layer calls Repository to list all agents
2. Repository calls Client to list workspaces
3. Client returns list[WorkspaceRemote] from Coder API
4. Client filters by template (if project_filter specified)
5. Repository maps list[WorkspaceRemote] → list[Agent]
6. Service filters by status (if status_filter specified)
7. Service returns filtered list[Agent] to Tool layer
8. Tool layer wraps in ListAgentsResponse

**MCP Tool Response**:
```python
ListAgentsResponse(
    agents=[
        Agent(name="agent-1", status=AgentStatus.IDLE, ...),
        Agent(name="agent-2", status=AgentStatus.IDLE, ...),
    ],
    total_count=2
)
```

## Validation Rules Summary

### Name Validation
- **Agent.name**: `^[a-zA-Z0-9-]{1,20}$` (alphanumeric + hyphens, 1-20 chars)
- Must be unique (enforced at Service layer)

### Content Validation
- **Task.message**: Non-empty, non-whitespace
- **LogEntry.level**: Must be one of `DEBUG`, `INFO`, `WARN`, `ERROR`

### Pagination Validation
- **page**: >= 1 (1-indexed)
- **page_size**: 1-100 (inclusive)
- **TaskHistory.page_size**: No default (caller specifies)
- **ConversationLog.page_size**: Default 1 (show latest only)

### Status Transitions
```
Agent Status FSM:
  STARTING → IDLE
  IDLE ↔ BUSY
  * → OFFLINE (network issues)
  * → FAILED (errors)
```

## Error Scenarios

### Agent Name Conflicts
- **Trigger**: Creating agent with name that already exists
- **Detection**: Service layer queries Repository.get_by_name()
- **Error**: `AgentAlreadyExistsError` (business logic error)

### Invalid Status Transitions
- **Trigger**: Sending task to busy agent
- **Detection**: Service layer checks agent.status
- **Error**: `AgentBusyError` (business logic error)

### WorkspaceRemote Not Found
- **Trigger**: Querying agent that was deleted
- **Detection**: Client layer receives 404 from Coder API
- **Error**: `WorkspaceNotFoundError` → mapped to `AgentNotFoundError`

### Pagination Out of Range
- **Trigger**: Requesting page 100 when only 3 pages exist
- **Detection**: Repository layer checks total_count vs requested page
- **Behavior**: Return empty results (not an error per HTTP standard practice)

## Model Organization

Models are organized by usage layer:

```
fleet_mcp_clean/models/
├── __init__.py           # Export all models
├── agent.py              # Agent, AgentStatus (domain)
├── task.py               # Task, TaskHistory, LogEntry, ConversationLog (domain)
├── project.py            # Project, Role (domain)
├── remote.py             # WorkspaceRemote, WorkspaceBuildRemote, TemplateRemote (HTTP responses)
├── responses.py          # CreateAgentResponse, ListAgentsResponse, etc. (MCP responses)
└── errors.py             # Domain exception classes
```

### Model Import Strategy

- **Domain models** (Agent, Task, Project, Role): Shared across all layers
- **Remote models** (WorkspaceRemote, TemplateRemote): Used only by Repository/Client layers for HTTP responses
- **Response models** (CreateAgentResponse, ListAgentsResponse): Used by Tool layer for MCP responses
- **No Input models**: Tools use method parameters with `Annotated` types
- **Pydantic validation**: Automatic at model instantiation
- **Custom validators**: For complex business rules (name format, pagination)

## Future Considerations

### Extensibility Points

1. **Agent Metadata**: Add custom metadata field (JSON) for user-defined tags
2. **Task Dependencies**: Add task_parent_id for task chains
3. **Role Permissions**: Add permissions field for fine-grained access control
4. **Audit Logging**: Add audit trail for all entity mutations

### Migration Path

Since this is a new implementation (no backwards compatibility), entity schemas can evolve freely. Use Pydantic's `model_config` with `populate_by_name=True` for future field renames.

## Conclusion

All entities are designed with:
- Clear validation rules (Pydantic)
- Business rule enforcement (custom validators)
- Pagination support (TaskHistory, ConversationLog)
- AI-readable structure (explicit fields, type hints)
- Clean architecture compatibility (no layer-specific logic in models)

Ready to proceed to API contracts definition.
