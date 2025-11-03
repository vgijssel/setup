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
- `status` (AgentStatus): Current state - see AgentStatus enum for all possible values
- `role` (str): Agent role - "coder", "operator", or "manager"
- `project` (str): Project name (e.g., "Setup", "DataOne")
- `spec` (str): Agent spec defining objectives and constraints
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
  - When workspace status is "running":
    - busy: current_task is not None (agent is working on a task)
    - idle: current_task is None (agent is ready for work)
  - Otherwise: Agent inherits workspace state directly
    - pending: workspace is being provisioned
    - starting: workspace is starting up
    - stopping: workspace is shutting down
    - stopped: workspace is stopped
    - failed: workspace provisioning or operation failed
    - canceling: workspace operation is being canceled
    - canceled: workspace operation was canceled
    - deleting: workspace is being deleted
    - deleted: workspace has been deleted

**Validation Rules**:
- `name`: 1-20 characters, alphanumeric + hyphens only, must be unique
- `role`: Must match a Coder workspace preset name defined in the project's template (dynamic, not hardcoded)
- `project`: Must match existing Coder template name
- `spec`: Required, non-empty string

**State Transitions**:
```
                          create_agent (with spec)
    [none] ──────────────────────────────────────> [pending]
                                                        │
                                                        v
                                                   [starting]
                                                        │
                                                        v
                                                     [busy]  ◄─┐
                                                        │      │
                                  complete_task         │      │ start_task
                                  cancel_task           │      │
                                                        v      │
                                                     [idle] ───┘
                                                        │
                       ┌────────────────────────────────┼────────────────┐
                       │                                │                │
            delete_agent                    stop_workspace    workspace_failed
                       │                                │                │
                       v                                v                v
                  [deleting]                        [stopping]       [failed]
                       │                                │
                       v                                v
                   [deleted]                         [stopped]

    [canceling] ──> [canceled]   (operation interrupted)
```

**Note**:
- Agents are created with a spec and immediately start working on it once the workspace reaches "running" state
- The agent begins in "pending" → "starting" → "busy" progression
- Only "busy" and "idle" states indicate a running workspace; all other states reflect workspace lifecycle

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
- `created_at` (datetime): Timestamp when the task was created

**Validation Rules**:
- `message`: Non-empty string
- `uri`: Valid URL string
- `needs_user_attention`: Boolean value
- `created_at`: Valid ISO 8601 timestamp

**Relationships**:
- Many Tasks → One Agent (via workspace association)

---

### Role

Represents an agent role configuration. Roles are defined as Coder workspace presets.

**Source**: Coder workspace presets (queried via Templates API)

**Attributes**:
- `name` (str): Role identifier matching Coder workspace preset name (e.g., "coder", "operator", "manager")
- `display_name` (str): Human-readable name from Coder workspace preset
- `description` (str): Role purpose from Coder workspace preset description
- `template_id` (str): Coder template UUID that defines this role

**Validation Rules**:
- `name`: Must match a valid workspace preset name in the template
- `display_name`: Non-empty string from workspace preset

**How Roles Work**:

Roles are implemented as Coder workspace presets. Each project's Coder template defines workspace presets for different agent roles:

**Workspace Presets Configuration** (in template metadata):

```json
{
  "presets": [
    {
      "name": "coder",
      "display_name": "Software Engineer",
      "description": "Writes code, implements features, fixes bugs",
      "parameters": {
        "agent_role": "coder"
      }
    },
    {
      "name": "operator",
      "display_name": "Operations Engineer",
      "description": "Manages deployments, monitors systems, handles incidents",
      "parameters": {
        "agent_role": "operator"
      }
    },
    {
      "name": "manager",
      "display_name": "Engineering Manager",
      "description": "Coordinates work, reviews specs, verifies agent alignment",
      "parameters": {
        "agent_role": "manager"
      }
    }
  ]
}
```

When an agent is created, the workspace preset name is passed to Coder to configure the workspace environment (system prompts, resources, etc.).

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

## MCP Tool Parameters and Response Models

MCP tool inputs use `Annotated` with `Field()` metadata directly in function signatures. Response models are Pydantic classes for type safety and validation.

### create_agent Parameters

**Purpose**: MCP tool input for creating a new agent

**Parameters** (flat, using Annotated with Field):
- `name: Annotated[str, Field(description="...")]`: Agent name
- `project: Annotated[str, Field(description="...")]`: Project name
- `spec: Annotated[str, Field(description="...")]`: Agent spec
- `role: Annotated[str, Field(description="...")] = "coder"`: Agent role (default: "coder"). Must match a Coder workspace preset name.

**Validation**:
- Inherits Agent validation rules
- Additional: name must not already exist

**Note**: When an agent is created, it immediately starts working on the provided spec. The agent begins in "pending" → "starting" → "busy" progression with `fleet_mcp_current_task` set to the spec content. Core metadata fields (`fleet_mcp_agent_name`, `fleet_mcp_role`, `fleet_mcp_project`, `fleet_mcp_agent_spec`, `fleet_mcp_current_task`) are set during creation. Optional metadata fields (like PR URLs: `fleet_mcp_pull_request_url`, `fleet_mcp_pull_request_status`, `fleet_mcp_pull_request_check_status`) are not set during creation but can be updated later by modifying the Coder workspace metadata directly.

### CreateAgentResponse

**Purpose**: MCP tool output for creating a new agent

**Attributes**:
- `agent` (Agent): Full agent details
- `message` (str): Success message

---

### list_agents Parameters

**Purpose**: MCP tool input for listing agents

**Parameters**: None

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

### show_agent Parameters

**Purpose**: MCP tool input for showing agent details

**Parameters** (flat, using Annotated with Field):
- `agent_name: Annotated[str, Field(description="...")]`: Agent name to query

### AgentDetailsResponse

**Purpose**: MCP tool output for agent details

**Attributes**:
- `agent` (Agent): Full agent details including nested `metadata` field with all fleet_mcp_* fields

---

### show_agent_task_history Parameters

**Purpose**: MCP tool input for querying task history

**Parameters** (flat, using Annotated with Field):
- `agent_name: Annotated[str, Field(description="...")]`: Agent to query
- `page: Annotated[int, Field(description="...", ge=1)] = 1`: Page number (default: 1)
- `page_size: Annotated[int, Field(description="...", ge=1, le=100)] = 20`: Items per page (default: 20, max: 100)

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

### start_agent_task Parameters

**Purpose**: MCP tool input for starting a task

**Parameters** (flat, using Annotated with Field):
- `agent_name: Annotated[str, Field(description="...")]`: Target agent
- `task_description: Annotated[str, Field(description="...")]`: Task description

### StartTaskResponse

**Purpose**: MCP tool output for starting a task

**Attributes**:
- `task` (Task): Created task details
- `agent_status` (str): Updated agent status ("busy")
- `message` (str): Success message

---

### cancel_agent_task Parameters

**Purpose**: MCP tool input for canceling a task

**Parameters** (flat, using Annotated with Field):
- `agent_name: Annotated[str, Field(description="...")]`: Target agent

### CancelTaskResponse

**Purpose**: MCP tool output for canceling a task

**Attributes**:
- `task` (Task): Canceled task details
- `agent_status` (str): Updated agent status ("idle")
- `message` (str): Success message

---

### delete_agent Parameters

**Purpose**: MCP tool input for deleting an agent

**Parameters** (flat, using Annotated with Field):
- `agent_name: Annotated[str, Field(description="...")]`: Agent to delete

### DeleteAgentResponse

**Purpose**: MCP tool output for deleting an agent

**Attributes**:
- `message` (str): Success message
- `deleted_agent` (dict): Contains `name` and `workspace_id`

---

### list_agent_roles Parameters

**Purpose**: MCP tool input for listing available roles

**Parameters** (flat, using Annotated with Field):
- `project: Annotated[str, Field(description="...")]`: Project name to query roles for

### ListRolesResponse

**Purpose**: MCP tool output for listing available roles

**Attributes**:
- `roles` (list[Role]): Available roles

---

### list_agent_projects Parameters

**Purpose**: MCP tool input for listing available projects

**Parameters**: None

### ListProjectsResponse

**Purpose**: MCP tool output for listing available projects

**Attributes**:
- `projects` (list[Project]): Available projects

---

## Enums

### AgentStatus

```python
class AgentStatus(str, Enum):
    # Workspace lifecycle states
    PENDING = "pending"      # Workspace being provisioned
    STARTING = "starting"    # Workspace starting up

    # Active states (workspace running)
    BUSY = "busy"           # Agent working on a task
    IDLE = "idle"           # Agent ready for work

    # Shutdown states
    STOPPING = "stopping"   # Workspace shutting down
    STOPPED = "stopped"     # Workspace stopped

    # Error states
    FAILED = "failed"       # Workspace operation failed

    # Cancellation states
    CANCELING = "canceling" # Operation being canceled
    CANCELED = "canceled"   # Operation was canceled

    # Deletion states
    DELETING = "deleting"   # Workspace being deleted
    DELETED = "deleted"     # Workspace deleted
```

---

## Metadata Mapping

### Coder Workspace → Agent

```python
def agent_from_workspace(workspace: CoderWorkspace) -> Agent:
    """Convert Coder workspace to Agent model"""
    metadata = workspace.metadata

    # Derive status from workspace state
    if workspace.latest_build.status == "running":
        # Workspace is running - check if agent is busy or idle
        if metadata.get("fleet_mcp_current_task"):
            status = AgentStatus.BUSY
        else:
            status = AgentStatus.IDLE
    else:
        # Workspace not running - map workspace state to agent status
        # (e.g., "stopped" -> STOPPED, "failed" -> FAILED, "starting" -> STARTING)
        status = AgentStatus(workspace.latest_build.status)

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

| Model/Parameters | Key Validations |
|------------------|-----------------|
| Agent | Unique name, role string (validated against Coder workspace presets), valid project, non-empty spec |
| Task | Non-empty message, valid URI, boolean needs_user_attention, valid created_at timestamp |
| Role | Predefined name in Coder workspace preset, non-empty display_name |
| Project | Matches Coder template |
| create_agent parameters | Name uniqueness, role exists in Coder workspace presets, project matches template, non-empty spec |
| show_agent_task_history parameters | Page >= 1, page_size in [1, 100] |

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
