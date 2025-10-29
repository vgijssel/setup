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
- `created_at` (datetime): Workspace creation timestamp
- `updated_at` (datetime): Last metadata update timestamp
- `metadata` (dict[str, str]): All Coder workspace metadata with fleet_mcp_* prefix
  - `fleet_mcp_agent_spec`: Agent specification
  - `fleet_mcp_pull_request_url`: Optional PR URL (if set)
  - `fleet_mcp_pull_request_status`: Optional PR status (if set)
  - `fleet_mcp_pull_request_check_status`: Optional CI check status (if set)

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

Represents work assigned to an agent. Tasks are stored in Coder's workspace AI task tracking system.

**Source**: Coder Workspace API (`GET /api/v2/users/{owner}/workspace/{workspace-name}`)

**Note**: Tasks are reported by agents using the `coder_report_task` MCP tool and stored in the workspace's task history.

**Attributes**:
- `message` (str): Task description/status message (e.g., "Implementing OAuth2 authentication")
- `uri` (str): Link to related work (e.g., GitHub branch URL, PR URL)
- `needs_user_attention` (bool): Whether the task requires user action

**Validation Rules**:
- `message`: Non-empty string
- `uri`: Valid URL string
- `needs_user_attention`: Boolean value

**Relationships**:
- Many Tasks → One Agent (via workspace association)

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

**Validation**:
- Inherits Agent validation rules
- Additional: name must not already exist

**Note**: Metadata fields (like PR URLs) are not set during creation. They can be updated later by modifying the Coder workspace metadata directly.

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
- `agent` (Agent): Full agent details including nested `metadata` field with all fleet_mcp_* fields

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
- `task_description` (str): Task description

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

    # Filter metadata to only fleet_mcp_* fields
    fleet_metadata = {
        key: value
        for key, value in metadata.items()
        if key.startswith("fleet_mcp_")
    }

    return Agent(
        name=metadata["fleet_mcp_agent_name"],
        workspace_id=workspace.id,
        status=status,
        role=metadata["fleet_mcp_role"],
        project=metadata["fleet_mcp_project"],
        spec=metadata["fleet_mcp_agent_spec"],
        current_task=metadata.get("fleet_mcp_current_task"),
        created_at=workspace.created_at,
        updated_at=workspace.updated_at,
        metadata=fleet_metadata,  # Nested metadata dict
    )
```

### Agent → Coder Workspace Metadata

```python
def agent_to_metadata(agent: Agent) -> dict[str, str]:
    """Convert Agent to Coder workspace metadata"""
    # Return the agent's metadata dict directly - it already has fleet_mcp_* keys
    return agent.metadata
```

**Note**: The agent's nested `metadata` field contains all fleet_mcp_* prefixed keys ready for Coder API. Core agent fields (name, role, project, spec, current_task) are mirrored in the metadata dict with their fleet_mcp_* keys.

---

## Validation Summary

| Model | Key Validations |
|-------|-----------------|
| Agent | Unique name, valid role, valid project, non-empty spec |
| Task | Non-empty message, valid URI, boolean needs_user_attention |
| Role | Predefined name, non-empty prompt |
| Project | Matches Coder template |
| CreateAgentRequest | Name uniqueness, valid role/project |
| TaskHistoryRequest | Page >= 1, page_size in [1, 100] |

---

## Storage Strategy

**Stateless Design**: MCP server stores NO data locally. All queries fetch from Coder API.

**Data Sources**:
- **Agents**: Coder workspaces with `fleet_mcp_*` metadata (`GET /api/v2/workspaces`)
- **Tasks**: Coder workspace task history (`GET /api/v2/users/{owner}/workspace/{workspace-name}`)
- **Roles**: Coder template parameters (`GET /api/v2/templates/{id}`)
- **Projects**: Coder Templates API (`GET /api/v2/templates`)

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
