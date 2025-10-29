# Data Model: Fleet MCP Server

**Date**: 2025-10-29
**Feature**: Fleet MCP Server

## Overview

This document defines the data models for the Fleet MCP server. All models are implemented as Pydantic classes for validation and serialization. The MCP server is stateless - all data is stored in Coder workspace metadata and queried on-demand.

---

## Core Domain Models

### Agent

Represents a Claude Code instance running in a Coder workspace.

**Source**: Coder workspace + metadata (read from `fleet_mcp_*` fields)

**Attributes**:
- `name` (str): Unique short memorable name (e.g., "Sony", "Papi")
- `workspace_id` (str): Coder workspace UUID
- `status` (AgentStatus): Current state - "busy", "idle", or "offline"
- `role` (str): Agent role - "coder", "operator", or "manager"
- `project` (str): Project name (e.g., "Setup", "DataOne")
- `spec` (str): Agent specification defining objectives and constraints
- `current_task` (str | None): Summary of current task (null if idle)
- `pull_request_url` (str | None): Optional PR URL for spec tracking
- `pull_request_status` (str | None): PR state - "open", "closed", "merged"
- `pull_request_check_status` (str | None): CI checks - "pending", "passing", "failing"
- `created_at` (datetime): Workspace creation timestamp
- `updated_at` (datetime): Last metadata update timestamp

**Derived Fields**:
- `status`: Computed from workspace build status + `current_task` presence
  - offline: workspace.latest_build.status != "running"
  - busy: workspace running AND current_task is not None
  - idle: workspace running AND current_task is None

**Validation Rules**:
- `name`: 1-20 characters, alphanumeric + hyphens only, must be unique
- `role`: Must be one of ["coder", "operator", "manager"]
- `project`: Must match existing Coder template name
- `spec`: Required, non-empty string

**State Transitions**:
```
               create_agent
    [none] ──────────────────> [idle]
                                  │
                    start_task    │    complete_task
                    ───────────>  │  <─────────────
                   │              │               │
                   v              v               │
                [busy] ────────> [idle]          │
                   │        stop_task            │
                   │                             │
                   └─────────────────────────────┘
                                │
                    delete_agent │
                                v
                            [deleted]
                                │
            workspace_stopped   │
                   ┌────────────┘
                   v
              [offline]
```

**Relationships**:
- One Agent → Many Tasks (task history)
- One Agent → One Role (current role assignment)
- One Agent → One Project (workspace template)

---

### Task

Represents work assigned to an agent. Tasks are stored in Coder's AI task system.

**Source**: Coder AI Tasks API (`/api/experimental/tasks`)

**Attributes**:
- `id` (str): Task UUID from Coder
- `agent_name` (str): Associated agent name
- `workspace_id` (str): Coder workspace UUID
- `summary` (str): Task description/summary
- `status` (TaskStatus): "pending", "running", "completed", "failed", "stopped"
- `source` (TaskSource): "agent", "human", or "ai_controller"
- `created_at` (datetime): Task creation timestamp
- `started_at` (datetime | None): When task execution began
- `completed_at` (datetime | None): When task finished
- `input` (str | None): Input provided to task
- `output` (str | None): Task output/result

**Validation Rules**:
- `summary`: Non-empty string, max 500 characters
- `status`: Must be valid TaskStatus enum value
- `source`: Must be valid TaskSource enum value
- Timestamps: `started_at` >= `created_at`, `completed_at` >= `started_at`

**State Transitions**:
```
    [pending] ──start_task──> [running] ──complete──> [completed]
                                  │
                                  │ stop_task
                                  v
                              [stopped]
                                  │
                                  │ error
                                  v
                              [failed]
```

**Relationships**:
- Many Tasks → One Agent (via agent_name)
- Tasks are immutable once completed/failed/stopped

---

### Role

Represents an agent role configuration. Roles are defined as Coder workspace template parameters with options.

**Source**: Coder template parameters (queried via Templates API)

**Attributes**:
- `name` (str): Role identifier matching Coder parameter option value (e.g., "coder", "operator", "manager")
- `display_name` (str): Human-readable name from Coder parameter option
- `description` (str): Role purpose from Coder parameter option description
- `template_id` (str): Coder template UUID that defines this role

**Validation Rules**:
- `name`: Must match a valid option value in the template's "role" parameter
- `display_name`: Non-empty string from parameter option

**How Roles Work**:

Roles are implemented as Coder workspace presets using template parameters. Each project's Coder template defines a "role" parameter with options:

```hcl
resource "coder_parameter" "role" {
  name         = "role"
  display_name = "Agent Role"
  type         = "string"
  default      = "coder"
  mutable      = false  # Role cannot change after workspace creation

  option {
    name  = "coder"
    value = "coder"
    description = "Software Engineer - Writes code, implements features, fixes bugs"
  }

  option {
    name  = "operator"
    value = "operator"
    description = "Operations Engineer - Manages deployments, monitors systems"
  }

  option {
    name  = "manager"
    value = "manager"
    description = "Engineering Manager - Coordinates work, reviews specs"
  }
}
```

When an agent is created, the role parameter is passed to Coder and used to configure the workspace environment (system prompts, resources, etc.).

**Typical Roles** (project-dependent):

1. **coder** (default) - Software Engineer role for writing code
2. **operator** - Operations Engineer role for infrastructure/deployments
3. **manager** - Engineering Manager role for coordination and review

Note: Actual roles depend on what each project's Coder template defines.

**Relationships**:
- One Role → Many Agents (agents assigned to roles)
- One Role → One Template (role options defined per template)
- Roles are immutable per agent (cannot change after workspace creation)

---

### Project

Represents a project that agents can work on. Projects map to Coder templates.

**Source**: Coder Templates API (`/api/v2/templates`)

**Attributes**:
- `name` (str): Project identifier (e.g., "Setup", "DataOne")
- `display_name` (str): Human-readable name
- `description` (str): Project purpose and scope
- `template_id` (str): Coder template UUID
- `template_name` (str): Coder template name

**Validation Rules**:
- `name`: Must match existing Coder template
- `template_id`: Must be valid UUID

**Relationships**:
- One Project → Many Agents (agents working on project)
- One Project → One Coder Template (1:1 mapping)

---

## MCP Request/Response Models

### CreateAgentRequest

**Purpose**: MCP tool input for creating a new agent

**Attributes** (all flat, with Field metadata):
- `name` (str): Agent name
- `project` (str): Project name
- `role` (str): Agent role (default: "coder")
- `spec` (str): Agent specification
- `pull_request_url` (str | None): Optional PR URL

**Validation**:
- Inherits Agent validation rules
- Additional: name must not already exist

---

### AgentListResponse

**Purpose**: MCP tool output for listing agents

**Attributes**:
- `agents` (list[AgentSummary]): Agent summaries
- `total_count` (int): Total number of agents

**AgentSummary** (nested in response):
- `name` (str): Agent name
- `status` (str): Current status
- `current_task` (str | None): Task summary

---

### AgentDetailsResponse

**Purpose**: MCP tool output for agent details

**Attributes**:
- `agent` (Agent): Full agent details
- `metadata` (dict[str, str]): All fleet_mcp_* metadata fields

---

### TaskHistoryRequest

**Purpose**: MCP tool input for querying task history

**Attributes** (flat):
- `agent_name` (str): Agent to query
- `page` (int): Page number (default: 1)
- `page_size` (int): Items per page (default: 20, max: 100)

---

### TaskHistoryResponse

**Purpose**: MCP tool output for task history

**Attributes**:
- `tasks` (list[Task]): Tasks for current page
- `total_count` (int): Total tasks across all pages
- `page` (int): Current page number
- `page_size` (int): Items per page
- `total_pages` (int): Total number of pages

---

### StartTaskRequest

**Purpose**: MCP tool input for starting a task

**Attributes** (flat):
- `agent_name` (str): Target agent
- `task_summary` (str): Task description
- `task_input` (str | None): Optional task input
- `source` (str): "agent", "human", or "ai_controller"

---

### StopTaskRequest

**Purpose**: MCP tool input for stopping a task

**Attributes** (flat):
- `agent_name` (str): Target agent

---

### DeleteAgentRequest

**Purpose**: MCP tool input for deleting an agent

**Attributes** (flat):
- `agent_name` (str): Agent to delete

---

### ListRolesResponse

**Purpose**: MCP tool output for listing available roles

**Attributes**:
- `roles` (list[Role]): Available roles

---

### ListProjectsResponse

**Purpose**: MCP tool output for listing available projects

**Attributes**:
- `projects` (list[Project]): Available projects

---

## Enums

### AgentStatus

```python
class AgentStatus(str, Enum):
    BUSY = "busy"
    IDLE = "idle"
    OFFLINE = "offline"
```

### TaskStatus

```python
class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    STOPPED = "stopped"
```

### TaskSource

```python
class TaskSource(str, Enum):
    AGENT = "agent"
    HUMAN = "human"
    AI_CONTROLLER = "ai_controller"
```

---

## Metadata Mapping

### Coder Workspace → Agent

```python
def agent_from_workspace(workspace: CoderWorkspace) -> Agent:
    """Convert Coder workspace to Agent model"""
    metadata = workspace.metadata

    # Derive status from workspace state
    if workspace.latest_build.status != "running":
        status = AgentStatus.OFFLINE
    elif metadata.get("fleet_mcp_current_task"):
        status = AgentStatus.BUSY
    else:
        status = AgentStatus.IDLE

    return Agent(
        name=metadata["fleet_mcp_agent_name"],
        workspace_id=workspace.id,
        status=status,
        role=metadata["fleet_mcp_role"],
        project=metadata["fleet_mcp_project"],
        spec=metadata["fleet_mcp_agent_spec"],
        current_task=metadata.get("fleet_mcp_current_task"),
        pull_request_url=metadata.get("fleet_mcp_pull_request_url"),
        pull_request_status=metadata.get("fleet_mcp_pull_request_status"),
        pull_request_check_status=metadata.get("fleet_mcp_pull_request_check_status"),
        created_at=workspace.created_at,
        updated_at=workspace.updated_at,
    )
```

### Agent → Coder Workspace Metadata

```python
def agent_to_metadata(agent: Agent) -> dict[str, str]:
    """Convert Agent to Coder workspace metadata"""
    metadata = {
        "fleet_mcp_agent_name": agent.name,
        "fleet_mcp_role": agent.role,
        "fleet_mcp_project": agent.project,
        "fleet_mcp_agent_spec": agent.spec,
        "fleet_mcp_current_task": agent.current_task or "",
    }

    # Add optional PR metadata
    if agent.pull_request_url:
        metadata["fleet_mcp_pull_request_url"] = agent.pull_request_url
    if agent.pull_request_status:
        metadata["fleet_mcp_pull_request_status"] = agent.pull_request_status
    if agent.pull_request_check_status:
        metadata["fleet_mcp_pull_request_check_status"] = agent.pull_request_check_status

    return metadata
```

---

## Validation Summary

| Model | Key Validations |
|-------|-----------------|
| Agent | Unique name, valid role, valid project, non-empty spec |
| Task | Valid status, valid source, timestamp ordering |
| Role | Predefined name, non-empty prompt |
| Project | Matches Coder template |
| CreateAgentRequest | Name uniqueness, valid role/project |
| TaskHistoryRequest | Page >= 1, page_size in [1, 100] |

---

## Storage Strategy

**Stateless Design**: MCP server stores NO data locally. All queries fetch from Coder API.

**Data Sources**:
- **Agents**: Coder workspaces with `fleet_mcp_*` metadata
- **Tasks**: Coder AI Tasks API
- **Roles**: Static configuration file
- **Projects**: Coder Templates API

**Query Pattern**:
1. MCP tool receives request
2. Query Coder API for current state
3. Transform Coder data → Pydantic models
4. Validate and return response

**Write Pattern**:
1. MCP tool receives request
2. Validate request model
3. Transform request → Coder API call
4. Update Coder workspace metadata
5. Query back and return updated state
