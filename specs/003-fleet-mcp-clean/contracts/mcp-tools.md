# MCP Tool Contracts: Fleet MCP Clean Architecture

**Branch**: `003-fleet-mcp` | **Date**: 2025-11-07

## Overview

This document defines the contracts for all 11 MCP tools exposed by fleet-mcp. Each tool is a thin entry point that delegates to the Service layer and returns results in MCP format.

## Model Naming Conventions

- **No Input Models**: Tools use scalar parameters directly with `Annotated[type, Field(...)]` syntax - NO Pydantic input models like `CreateAgentInput`. FastMCP requires scalar inputs.
- **Response Models**: Follow pattern `{ToolName}Response` (e.g., `ListAgentsResponse`, `CreateAgentResponse`)
- **Domain Models**: No suffix (e.g., `Agent`, `Task`, `Project`)
- **Remote Models**: "Remote" suffix for HTTP responses (e.g., `WorkspaceRemote`)

**Critical**: All MCP tool parameters must be scalars (str, int, bool, etc.) with `Annotated` types. Never use complex Pydantic models as input parameters - this breaks FastMCP.

## Tool Contract Format

Each tool contract includes:
- **Tool Name**: MCP tool identifier
- **Purpose**: One-sentence description
- **Tool Parameters**: Method parameters with Annotated types (no Input model class)
- **Response Model**: Pydantic model returned to MCP client
- **Error Responses**: Failure scenarios with error codes
- **Example Usage**: Request/response examples

## Agent Discovery Tools

### 1. list_agents

**Purpose**: Retrieve a summary of all agents in the fleet.

**Tool Signature**:
```python
@mcp.tool()
async def list_agents(
    status_filter: Annotated[
        AgentStatus | None,
        Field(None, description="Optional filter by agent status")
    ] = None,
    project_filter: Annotated[
        str | None,
        Field(None, description="Optional filter by project name")
    ] = None,
) -> ListAgentsResponse:
    # implementation
```

**Response Model**:
```python
class ListAgentsResponse(BaseModel):
    agents: list[Agent]  # Domain model
    total_count: int
```

**Success Response**:
```json
{
  "agents": [
    {
      "name": "data-analyst",
      "status": "idle",
      "project": "Setup",
      "role": "coder",
      "last_task": "Analyze sales data",
      "created_at": "2025-11-07T10:00:00Z",
      "workspace_id": "workspace-uuid",
      "updated_at": "2025-11-07T10:30:00Z"
    }
  ],
  "total_count": 1
}
```

**Error Responses**:
- `500` - Internal error querying Coder API
- `503` - Coder API unavailable

---

### 2. show_agent

**Purpose**: Retrieve detailed information about a specific agent by name.

**Tool Signature**:
```python
@mcp.tool()
async def show_agent(
    agent_name: Annotated[
        str,
        Field(min_length=1, max_length=20, description="Name of the agent to retrieve")
    ],
) -> ShowAgentResponse:
    # implementation
```

**Response Model**:
```python
class ShowAgentResponse(BaseModel):
    agent: Agent  # Domain model (includes metadata)
```

**Success Response**:
```json
{
  "agent": {
    "name": "data-analyst",
    "workspace_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "idle",
    "role": "coder",
    "project": "Setup",
    "last_task": "Analyze sales data",
    "created_at": "2025-11-07T10:00:00Z",
    "updated_at": "2025-11-07T10:30:00Z",
    "metadata": {
      "ai_prompt": "You are a data analyst",
      "system_prompt": "Analyze data efficiently"
    }
  }
}
```

**Error Responses**:
- `404` - Agent not found (agent name doesn't exist)
- `500` - Internal error querying Coder API

---

### 3. list_agent_projects

**Purpose**: List all available projects (templates) that can be used to create agents.

**Tool Signature**:
```python
@mcp.tool()
async def list_agent_projects() -> ListAgentProjectsResponse:
    # implementation (no parameters)
```

**Response Model**:
```python
class ListAgentProjectsResponse(BaseModel):
    projects: list[Project]  # Domain model
    total_count: int
```

**Success Response**:
```json
{
  "projects": [
    {
      "id": "template-uuid-1",
      "name": "Setup",
      "description": "Development container for coding tasks"
    }
  ],
  "total_count": 1
}
```

**Notes**:
- Only returns Coder templates that have a display_name set
- Project name is mapped from the Coder template's display_name
- Filters out templates missing `ai_prompt` or `system_prompt` parameters

**Error Responses**:
- `500` - Internal error querying Coder API

---

### 4. list_agent_roles

**Purpose**: List all available roles (workspace presets) for a specific project.

**Tool Signature**:
```python
@mcp.tool()
async def list_agent_roles(
    project: Annotated[
        str,
        Field(description="Project name to query roles for")
    ],
) -> ListAgentRolesResponse:
    # implementation
```

**Response Model**:
```python
class ListAgentRolesResponse(BaseModel):
    project: str
    roles: list[Role]  # Domain model
    total_count: int
```

**Success Response**:
```json
{
  "project": "Setup",
  "roles": [
    {
      "id": "preset-uuid-1",
      "name": "coder",
      "project_id": "template-uuid-1"
    },
    {
      "id": "preset-uuid-2",
      "name": "operator",
      "project_id": "template-uuid-1"
    }
  ],
  "total_count": 2
}
```

**Error Responses**:
- `404` - Project not found (project name doesn't exist)
- `500` - Internal error querying Coder API

---

## Agent Lifecycle Management Tools

### 5. create_agent

**Purpose**: Create a new Claude Code agent in a Coder workspace.

**Tool Signature**:
```python
@mcp.tool()
async def create_agent(
    name: Annotated[
        str, Field(description="Unique short agent name (e.g., Sony, Papi)")
    ],
    project: Annotated[
        str, Field(description="Project name (e.g., Setup, DataOne)")
    ],
    task: Annotated[
        str,
        Field(description="Task description defining objectives and constraints"),
    ],
    role: Annotated[
        str,
        Field(
            description="Agent role matching Coder workspace preset (e.g., coder, operator, manager)"
        ),
    ] = "coder",
) -> CreateAgentResponse:
    """Create a new Claude Code agent in a Coder workspace"""
    # implementation
```

**IMPORTANT**: Inputs are scalar values (str) with `Annotated` types, NOT Pydantic input models. FastMCP requires scalar parameters directly - do not use `input: CreateAgentInput` pattern.

**Response Model**:
```python
class CreateAgentResponse(BaseModel):
    agent: Agent  # Domain model
    message: str
```

**Success Response**:
```json
{
  "agent": {
    "name": "new-agent",
    "workspace_id": "workspace-uuid",
    "status": "starting",
    "role": "coder",
    "project": "Setup",
    "last_task": "Setup development environment",
    "created_at": "2025-11-07T11:00:00Z",
    "updated_at": "2025-11-07T11:00:00Z",
    "metadata": {}
  },
  "message": "Agent 'new-agent' created successfully"
}
```

**Error Responses**:
- `400` - Invalid agent name format
- `404` - Project or role not found
- `409` - Agent name already exists (conflict)
- `500` - Internal error creating workspace

---

### 6. delete_agent

**Purpose**: Delete an agent and destroy its underlying workspace (forceful deletion, works even if agent is busy).

**Input Schema**:
```python
class DeleteAgentInput(BaseModel):
    agent_name: str = Field(
        ...,
        min_length=1,
        max_length=20,
        description="Name of the agent to delete"
    )
```

**Output Schema**:
```python
class DeleteAgentOutput(BaseModel):
    agent_name: str
    workspace_id: str
    message: str
```

**Success Response**:
```json
{
  "agent_name": "old-agent",
  "workspace_id": "workspace-uuid",
  "message": "Agent 'old-agent' deleted successfully"
}
```

**Error Responses**:
- `404` - Agent not found
- `503` - Workspace deletion failed (Coder API error)

---

### 7. restart_agent

**Purpose**: Restart an agent's workspace regardless of current state.

**Input Schema**:
```python
class RestartAgentInput(BaseModel):
    agent_name: str = Field(
        ...,
        min_length=1,
        max_length=20,
        description="Name of the agent to restart"
    )
```

**Output Schema**:
```python
class RestartAgentOutput(BaseModel):
    agent_name: str
    workspace_id: str
    status: AgentStatus
    message: str
```

**Success Response**:
```json
{
  "agent_name": "my-agent",
  "workspace_id": "workspace-uuid",
  "status": "starting",
  "message": "Agent 'my-agent' restart initiated"
}
```

**Error Responses**:
- `404` - Agent not found
- `500` - Restart failed (Coder API error)

---

## Task Management Tools

### 8. start_agent_task

**Purpose**: Send a task description to an idle agent (transitions agent to busy status).

**Input Schema**:
```python
class StartAgentTaskInput(BaseModel):
    agent_name: str = Field(
        ...,
        min_length=1,
        max_length=20,
        description="Name of the agent to assign the task to"
    )
    task_description: str = Field(
        ...,
        min_length=1,
        description="Description of the task to be performed"
    )
```

**Output Schema**:
```python
class StartAgentTaskOutput(BaseModel):
    agent_name: str
    task: TaskInfo
    message: str

class TaskInfo(BaseModel):
    message: str
    created_at: datetime
```

**Success Response**:
```json
{
  "agent_name": "my-agent",
  "task": {
    "message": "Implement feature X",
    "created_at": "2025-11-07T11:30:00Z"
  },
  "message": "Task assigned to agent 'my-agent'"
}
```

**Error Responses**:
- `400` - Empty task description OR agent is offline
- `404` - Agent not found
- `409` - Agent is already busy (conflict)

---

### 9. cancel_agent_task

**Purpose**: Cancel the currently running task on a busy agent (sends interrupt signal SIGINT).

**Input Schema**:
```python
class CancelAgentTaskInput(BaseModel):
    agent_name: str = Field(
        ...,
        min_length=1,
        max_length=20,
        description="Name of the agent whose task should be canceled"
    )
```

**Output Schema**:
```python
class CancelAgentTaskOutput(BaseModel):
    agent_name: str
    message: str
    interrupt_sent: bool
```

**Success Response**:
```json
{
  "agent_name": "my-agent",
  "message": "Interrupt signal sent to agent 'my-agent'",
  "interrupt_sent": true
}
```

**Error Responses**:
- `400` - Agent is not busy / has no running task
- `404` - Agent not found
- `503` - AgentAPI not available (fallback to experimental API)

**Implementation Notes**:
- Primary method: POST to `{agentapi_url}/message` with `{"type": "raw", "content": "\u0003"}`
- Fallback: Use experimental task cancellation API if AgentAPI unavailable
- Agent reports its own state transition via `coder_report_task`

---

## History and Logging Tools

### 10. show_agent_task_history

**Purpose**: Retrieve paginated task history for an agent, ordered by creation time (newest first).

**Input Schema**:
```python
class ShowAgentTaskHistoryInput(BaseModel):
    agent_name: str = Field(
        ...,
        description="Name of the agent to query"
    )
    page: int = Field(
        default=1,
        ge=1,
        description="Page number (1-indexed)"
    )
    page_size: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Items per page (max 100)"
    )
```

**Output Schema**:
```python
class ShowAgentTaskHistoryOutput(BaseModel):
    agent_name: str
    tasks: list[TaskDetail]
    total_count: int
    page: int
    page_size: int
    has_next_page: bool
    has_previous_page: bool

class TaskDetail(BaseModel):
    message: str
    uri: str | None
    needs_user_attention: bool
    created_at: datetime
```

**Success Response**:
```json
{
  "agent_name": "my-agent",
  "tasks": [
    {
      "message": "Implement feature Y",
      "uri": null,
      "needs_user_attention": false,
      "created_at": "2025-11-07T12:00:00Z"
    },
    {
      "message": "Fix bug Z",
      "uri": "https://github.com/org/repo/issues/123",
      "needs_user_attention": true,
      "created_at": "2025-11-07T11:00:00Z"
    }
  ],
  "total_count": 2,
  "page": 1,
  "page_size": 20,
  "has_next_page": false,
  "has_previous_page": false
}
```

**Error Responses**:
- `404` - Agent not found
- `500` - Error retrieving task history

**Pagination Behavior**:
- Requesting page beyond available data returns empty `tasks` array
- `has_next_page` and `has_previous_page` indicate navigation options

---

### 11. show_agent_log

**Purpose**: Retrieve paginated conversation logs for an agent, ordered by time (newest first).

**Input Schema**:
```python
class ShowAgentLogInput(BaseModel):
    agent_name: str = Field(
        ...,
        description="Name of the agent to query"
    )
    page: int = Field(
        default=1,
        ge=1,
        description="Page number (1-indexed)"
    )
    page_size: int = Field(
        default=1,
        ge=1,
        le=100,
        description="Items per page (max 100, default 1)"
    )
```

**Output Schema**:
```python
class ShowAgentLogOutput(BaseModel):
    agent_name: str
    logs: list[LogEntryDetail]
    total_count: int
    page: int
    page_size: int
    has_next_page: bool
    has_previous_page: bool

class LogEntryDetail(BaseModel):
    timestamp: datetime
    message: str
    level: str  # DEBUG, INFO, WARN, ERROR
```

**Success Response**:
```json
{
  "agent_name": "my-agent",
  "logs": [
    {
      "timestamp": "2025-11-07T12:30:00Z",
      "message": "Task completed successfully",
      "level": "INFO"
    }
  ],
  "total_count": 42,
  "page": 1,
  "page_size": 1,
  "has_next_page": true,
  "has_previous_page": false
}
```

**Error Responses**:
- `404` - Agent not found
- `500` - Error retrieving logs

**Default Behavior**:
- Default `page_size=1` returns only the latest log entry
- Callers must explicitly request larger page sizes for more logs

---

## Common Error Response Format

All error responses follow MCP error format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {
      "field": "Additional context if applicable"
    }
  }
}
```

### Error Code Mapping

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_INPUT` | Invalid request parameters |
| 404 | `NOT_FOUND` | Resource not found (agent, project, role) |
| 409 | `CONFLICT` | Resource conflict (duplicate name, agent busy) |
| 500 | `INTERNAL_ERROR` | Internal server error |
| 503 | `SERVICE_UNAVAILABLE` | Coder API unavailable |

## Tool Implementation Pattern

All tools follow this structure using scalar parameters (NOT input models):

```python
from typing import Annotated
from fastmcp import FastMCP, Field
from fleet_mcp_clean.services import AgentService
from fleet_mcp_clean.models import CreateAgentResponse

mcp = FastMCP("fleet-mcp")

@mcp.tool()
async def create_agent(
    name: Annotated[str, Field(description="Unique short agent name (e.g., Sony, Papi)")],
    project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
    task: Annotated[str, Field(description="Task description defining objectives and constraints")],
    role: Annotated[str, Field(description="Agent role matching Coder workspace preset")] = "coder",
) -> CreateAgentResponse:
    """Create a new Claude Code agent in a Coder workspace"""
    # Tool layer: thin entry point
    service = AgentService()

    try:
        agent = await service.create_agent(
            name=name,
            project=project,
            role=role,
            task=task
        )
        return CreateAgentResponse(
            agent=agent,
            message=f"Agent '{agent.name}' created successfully"
        )
    except AgentAlreadyExistsError as e:
        raise MCPError(code="CONFLICT", message=str(e))
    except ProjectNotFoundError as e:
        raise MCPError(code="NOT_FOUND", message=str(e))
```

**Key Points**:
- Use scalar parameters with `Annotated` types - NO input model classes
- FastMCP handles validation automatically via `Field()` descriptors
- Return Response model (e.g., `CreateAgentResponse`)

### Layer Responsibilities

- **Tool Layer**: Service instantiation, parameter passing, error mapping (validation automatic via Annotated/Field)
- **Service Layer**: Business logic, orchestration, business rule validation
- **Repository Layer**: Data access, entity transformation
- **Client Layer**: HTTP communication, API error handling

## Testing Contracts

Each tool has corresponding tests:

```
tests/tools/test_create_agent.py       → Mock AgentService
tests/services/test_agent_service.py   → Mock AgentRepository
tests/repositories/test_agent_repository.py → Mock CoderClient
tests/clients/test_coder_client.py     → Mock HTTP with respx
```

## Contract Versioning

- **Version 1.0.0**: Initial implementation (this document)
- All contracts use semantic versioning
- Breaking changes require MAJOR version bump
- Backward-compatible additions require MINOR version bump

## Conclusion

All 11 MCP tool contracts defined with:
- Clear input/output schemas (Pydantic models)
- Comprehensive error responses
- Pagination support where applicable
- AI-readable structure and naming
- Implementation pattern consistency

Ready to proceed to quickstart.md generation.
