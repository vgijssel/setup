# MCP Tools Contract: Fleet MCP Server

**Date**: 2025-10-29
**Protocol**: Model Context Protocol (MCP)
**Framework**: FastMCP

## Overview

This document defines the MCP tool interface contracts for the Fleet MCP Server. Each tool represents a capability exposed to AI agents via the MCP protocol.

---

## Tool: create_agent

Create a new Claude Code agent in a Coder workspace.

### Input Parameters (Flat Structure)

```python
{
    "name": str,     # Required. Unique agent name (1-20 chars, alphanumeric + hyphens)
    "project": str,  # Required. Project name (must match Coder template)
    "role": str,     # Optional. Default: "coder". One of: coder, operator, manager
    "spec": str      # Required. Agent specification defining objectives
}
```

### Field Descriptions

- **name**: Unique short memorable name for the agent (e.g., "Sony", "Papi")
- **project**: Project name matching a Coder template (e.g., "Setup", "DataOne")
- **role**: Agent role defining system prompt behavior
- **spec**: Structured specification with agent objective, context, and deliverables

### Output

```python
{
    "agent": {
        "name": str,
        "workspace_id": str,
        "status": "idle",           # Always "idle" on creation
        "role": str,
        "project": str,
        "spec": str,
        "current_task": None,       # Always null on creation
        "created_at": str,          # ISO 8601 timestamp
        "updated_at": str,          # ISO 8601 timestamp
        "metadata": {               # Nested Coder workspace metadata
            "fleet_mcp_agent_spec": str,
            "fleet_mcp_pull_request_url": str,   # Optional, may not be present
            "fleet_mcp_pull_request_status": str, # Optional, may not be present
            "fleet_mcp_pull_request_check_status": str # Optional, may not be present
        }
    },
    "message": str                   # Success message
}
```

### Errors

- **400 Bad Request**: Invalid parameters (name already exists, invalid role/project, empty spec)
- **503 Service Unavailable**: Coder API unavailable or workspace provisioning failed

### Example Input

```json
{
    "name": "papi",
    "project": "Setup",
    "role": "coder",
    "spec": "Implement user authentication with OAuth2. Include tests and documentation."
}
```

---

## Tool: list_agents

List all agents in the fleet with their current status.

### Input Parameters (Flat Structure)

No parameters required.

### Output

```python
{
    "agents": [
        {
            "name": str,
            "status": str,          # "busy", "idle", or "offline"
            "current_task": str | None  # Task summary or null
        },
        ...
    ],
    "total_count": int
}
```

### Errors

- **503 Service Unavailable**: Coder API unavailable

### Example Output

```json
{
    "agents": [
        {
            "name": "papi",
            "status": "busy",
            "current_task": "Implementing OAuth2 authentication"
        },
        {
            "name": "sony",
            "status": "idle",
            "current_task": null
        }
    ],
    "total_count": 2
}
```

---

## Tool: show_agent

Show detailed information about a specific agent.

### Input Parameters (Flat Structure)

```python
{
    "agent_name": str  # Required. Agent name to query
}
```

### Field Descriptions

- **agent_name**: Name of the agent to retrieve details for

### Output

```python
{
    "agent": {
        "name": str,
        "workspace_id": str,
        "status": str,
        "role": str,
        "project": str,
        "spec": str,
        "current_task": str | None,
        "created_at": str,
        "updated_at": str,
        "metadata": {                            # Nested metadata with all fleet_mcp_* fields
            "fleet_mcp_agent_spec": str,
            "fleet_mcp_pull_request_url": str,   # Optional, may not be present
            "fleet_mcp_pull_request_status": str, # Optional, may not be present
            "fleet_mcp_pull_request_check_status": str # Optional, may not be present
        }
    }
}
```

### Errors

- **404 Not Found**: Agent with given name does not exist
- **503 Service Unavailable**: Coder API unavailable

### Example Output

```json
{
    "agent": {
        "name": "papi",
        "workspace_id": "uuid-here",
        "status": "busy",
        "role": "coder",
        "project": "Setup",
        "spec": "Implement OAuth2 authentication...",
        "current_task": "Writing integration tests",
        "created_at": "2025-10-29T10:00:00Z",
        "updated_at": "2025-10-29T11:30:00Z",
        "metadata": {
            "fleet_mcp_agent_spec": "Implement OAuth2 authentication...",
            "fleet_mcp_pull_request_url": "https://github.com/org/repo/pull/123",
            "fleet_mcp_pull_request_status": "open",
            "fleet_mcp_pull_request_check_status": "passing"
        }
    }
}
```

---

## Tool: show_agent_task_history

Show paginated task history for an agent.

### Input Parameters (Flat Structure)

```python
{
    "agent_name": str,  # Required. Agent name to query
    "page": int,        # Optional. Default: 1. Page number (1-indexed)
    "page_size": int    # Optional. Default: 20. Items per page (max: 100)
}
```

### Field Descriptions

- **agent_name**: Name of the agent to retrieve task history for
- **page**: Page number to retrieve (starts at 1)
- **page_size**: Number of tasks per page (clamped to [1, 100])

### Output

```python
{
    "tasks": [
        {
            "id": str,
            "agent_name": str,
            "summary": str,
            "status": str,          # "pending", "running", "completed", "failed", "stopped"
            "source": str,          # "agent", "human", "ai_controller"
            "created_at": str,
            "started_at": str | None,
            "completed_at": str | None
        },
        ...
    ],
    "total_count": int,
    "page": int,
    "page_size": int,
    "total_pages": int
}
```

### Errors

- **404 Not Found**: Agent with given name does not exist
- **400 Bad Request**: Invalid page or page_size parameters
- **503 Service Unavailable**: Coder API unavailable

### Example Output

```json
{
    "tasks": [
        {
            "id": "task-uuid-1",
            "agent_name": "papi",
            "summary": "Implement OAuth2 authentication",
            "status": "completed",
            "source": "human",
            "created_at": "2025-10-29T10:00:00Z",
            "started_at": "2025-10-29T10:01:00Z",
            "completed_at": "2025-10-29T11:30:00Z"
        }
    ],
    "total_count": 42,
    "page": 1,
    "page_size": 20,
    "total_pages": 3
}
```

---

## Tool: delete_agent

Delete an agent and destroy its Coder workspace.

### Input Parameters (Flat Structure)

```python
{
    "agent_name": str  # Required. Agent name to delete
}
```

### Field Descriptions

- **agent_name**: Name of the agent to delete (forceful deletion even if busy)

### Output

```python
{
    "message": str,     # Success message
    "deleted_agent": {
        "name": str,
        "workspace_id": str
    }
}
```

### Errors

- **404 Not Found**: Agent with given name does not exist
- **503 Service Unavailable**: Coder API unavailable or workspace deletion failed

### Example Output

```json
{
    "message": "Agent 'papi' deleted successfully",
    "deleted_agent": {
        "name": "papi",
        "workspace_id": "uuid-here"
    }
}
```

---

## Tool: start_agent_task

Start a new task on an agent.

### Input Parameters (Flat Structure)

```python
{
    "agent_name": str,         # Required. Target agent name
    "task_description": str    # Required. Task description
}
```

### Field Descriptions

- **agent_name**: Name of the agent to assign the task to
- **task_description**: Description of the task to be performed

### Output

```python
{
    "task": {
        "id": str,
        "agent_name": str,
        "summary": str,
        "status": "running",        # Always "running" after start
        "created_at": str,
        "started_at": str
    },
    "agent_status": "busy",         # Agent status updated to busy
    "message": str
}
```

### Errors

- **404 Not Found**: Agent with given name does not exist
- **400 Bad Request**: Agent is offline or task description is empty
- **409 Conflict**: Agent already has a running task
- **503 Service Unavailable**: Coder API unavailable

### Example Input

```json
{
    "agent_name": "papi",
    "task_description": "Fix authentication bug in login endpoint"
}
```

---

## Tool: stop_agent_task

Stop the currently running task on an agent.

### Input Parameters (Flat Structure)

```python
{
    "agent_name": str  # Required. Target agent name
}
```

### Field Descriptions

- **agent_name**: Name of the agent whose task should be stopped

### Output

```python
{
    "task": {
        "id": str,
        "agent_name": str,
        "summary": str,
        "status": "stopped",        # Always "stopped" after stop
        "source": str,
        "created_at": str,
        "started_at": str,
        "completed_at": str         # Timestamp when stopped
    },
    "agent_status": "idle",         # Agent status updated to idle
    "message": str
}
```

### Errors

- **404 Not Found**: Agent with given name does not exist or has no running task
- **400 Bad Request**: Agent is not currently busy
- **503 Service Unavailable**: Coder API unavailable

### Example Output

```json
{
    "task": {
        "id": "task-uuid",
        "agent_name": "papi",
        "summary": "Fix authentication bug",
        "status": "stopped",
        "source": "human",
        "created_at": "2025-10-29T10:00:00Z",
        "started_at": "2025-10-29T10:01:00Z",
        "completed_at": "2025-10-29T10:15:00Z"
    },
    "agent_status": "idle",
    "message": "Task stopped successfully"
}
```

---

## Tool: list_agent_roles

List all available agent roles for a specific project. Roles are defined as Coder template parameter options.

### Input Parameters (Flat Structure)

```python
{
    "project": str  # Required. Project name to query roles for
}
```

### Field Descriptions

- **project**: Project name (e.g., "Setup", "DataOne"). Roles are queried from the project's Coder template parameters.

### Output

```python
{
    "roles": [
        {
            "name": str,
            "display_name": str,
            "description": str
        },
        ...
    ]
}
```

### Errors

- **404 Not Found**: Project template does not exist
- **503 Service Unavailable**: Coder API unavailable

### Example Output

```json
{
    "roles": [
        {
            "name": "coder",
            "display_name": "Software Engineer",
            "description": "Writes code, implements features, fixes bugs"
        },
        {
            "name": "operator",
            "display_name": "Operations Engineer",
            "description": "Manages deployments, monitors systems, handles incidents"
        },
        {
            "name": "manager",
            "display_name": "Engineering Manager",
            "description": "Coordinates work, reviews specs, verifies agent alignment"
        }
    ]
}
```

---

## Tool: list_agent_projects

List all available projects mapped to Coder templates.

### Input Parameters (Flat Structure)

No parameters required.

### Output

```python
{
    "projects": [
        {
            "name": str,
            "display_name": str,
            "description": str,
            "template_id": str,
            "template_name": str
        },
        ...
    ]
}
```

### Errors

- **503 Service Unavailable**: Coder API unavailable

### Example Output

```json
{
    "projects": [
        {
            "name": "Setup",
            "display_name": "Setup Monorepo",
            "description": "Infrastructure and tooling monorepo",
            "template_id": "template-uuid-1",
            "template_name": "setup-devcontainer"
        },
        {
            "name": "DataOne",
            "display_name": "DataOne Platform",
            "description": "Data processing and analytics platform",
            "template_id": "template-uuid-2",
            "template_name": "dataone-devcontainer"
        }
    ]
}
```

---

## Common Patterns

### Error Response Format

All tools return errors in consistent format:

```python
{
    "error": str,           # Error type/code
    "message": str,         # Human-readable error message
    "details": dict | None  # Optional additional context
}
```

### Timestamp Format

All timestamps use ISO 8601 format with UTC timezone:

```
YYYY-MM-DDTHH:MM:SSZ
Example: 2025-10-29T10:30:45Z
```

### Status Enums

**Agent Status**:
- `busy`: Agent is working on a task
- `idle`: Agent is ready for work
- `offline`: Agent's workspace is not running

**Task Status**:
- `pending`: Task created but not started
- `running`: Task currently executing
- `completed`: Task finished successfully
- `failed`: Task encountered an error
- `stopped`: Task manually interrupted

**Task Source**:
- `agent`: Task assigned by the agent itself
- `human`: Task assigned by human operator
- `ai_controller`: Task assigned by controlling AI agent

---

## Testing Strategy

Each tool contract is tested with pytest-vcr:

1. **Unit tests**: Validate Pydantic models and parameter flattening
2. **Integration tests**: Test Coder API client interactions with recorded cassettes
3. **Contract tests**: End-to-end MCP tool invocations with vcr fixtures

Example test structure:

```python
@pytest.mark.vcr
def test_create_agent_success():
    """Test successful agent creation with vcr cassette"""
    response = mcp_client.call_tool("create_agent", {
        "name": "test-agent",
        "project": "Setup",
        "role": "coder",
        "spec": "Test specification"
    })
    assert response["agent"]["name"] == "test-agent"
    assert response["agent"]["status"] == "idle"

@pytest.mark.vcr
def test_create_agent_duplicate_name():
    """Test error on duplicate agent name"""
    with pytest.raises(Exception) as exc:
        mcp_client.call_tool("create_agent", {
            "name": "existing-agent",
            "project": "Setup",
            "role": "coder",
            "spec": "Test"
        })
    assert "already exists" in str(exc.value)
```
