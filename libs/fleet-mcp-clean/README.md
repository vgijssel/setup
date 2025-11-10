# Fleet MCP Clean

Clean architecture implementation of fleet management for Claude Code agents in Coder workspaces.

## Overview

Fleet MCP Clean provides MCP (Model Context Protocol) tools for managing Claude Code agent fleets running in Coder workspaces. It follows clean architecture principles with strict layer separation for maintainability and testability.

## Architecture

The project uses a 5-layer clean architecture with unidirectional dependencies:

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: MCP Tools (FastMCP Entry Points)                 │
│  Files: tools/list_agents.py, create_agent.py, etc.        │
│  Responsibility: MCP protocol, input validation            │
└──────────────────┬──────────────────────────────────────────┘
                   │ depends on
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Services (Business Logic)                        │
│  Files: services/agent_service.py, task_service.py         │
│  Responsibility: Business rules, orchestration              │
└──────────────────┬──────────────────────────────────────────┘
                   │ depends on
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Repositories (Data Access)                       │
│  Files: repositories/agent_repository.py, etc.             │
│  Responsibility: Entity transformation, data access         │
└──────────────────┬──────────────────────────────────────────┘
                   │ depends on
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Clients (HTTP Communication)                     │
│  Files: clients/coder_client.py                            │
│  Responsibility: HTTP requests, error handling              │
└──────────────────┬──────────────────────────────────────────┘
                   │ uses
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  External: Coder API                                        │
│  Endpoints: workspaces, templates, presets, tasks           │
└─────────────────────────────────────────────────────────────┘

         ┌──────────────────────────────┐
         │  Shared: Models (Pydantic)   │
         │  Files: models/*.py          │
         │  Used by: All layers         │
         └──────────────────────────────┘
```

### Layer Responsibilities

1. **Tools Layer** (`tools/`): MCP tool entry points with FastMCP, parameter validation
2. **Services Layer** (`services/`): Business logic, orchestration, rule enforcement
3. **Repositories Layer** (`repositories/`): Data access patterns, entity transformation
4. **Clients Layer** (`clients/`): HTTP communication with Coder API, error handling
5. **Models Layer** (`models/`): Shared Pydantic domain entities, validation

## Installation

This project uses `uv` for dependency management. Ensure you have uv installed:

```bash
# Install dependencies
cd libs/fleet-mcp-clean
uv sync

# Install with dev dependencies
uv sync --all-extras
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your Coder instance URL and session token
```

## Running the Server

```bash
# Using Nx
nx server fleet-mcp-clean

# Or directly with uv
cd libs/fleet-mcp-clean
uv run fastmcp run src/fleet_mcp_clean/__main__.py
```

## Testing

```bash
# Run tests with Nx
nx test fleet-mcp-clean

# Or directly with uv
cd libs/fleet-mcp-clean
uv run pytest

# With coverage
uv run pytest --cov=fleet_mcp_clean --cov-report=term-missing

# Verify layer boundaries with import-linter
nx lint-imports fleet-mcp-clean

# Run all validation together
nx run-many -t test lint-imports -p fleet-mcp-clean
```

## Available MCP Tools

### Agent Discovery & Inspection
- `list_agents`: List all agents with optional filtering by status and project
- `show_agent`: Show detailed information about a specific agent
- `list_agent_projects`: List available projects (templates)
- `list_agent_roles`: List available roles for a project

### Agent Lifecycle
- `create_agent`: Create a new agent with specified name, project, role, and task
- `delete_agent`: Delete an agent and destroy its workspace
- `restart_agent`: Restart an agent workspace to refresh environment

### Task Management
- `start_agent_task`: Assign a task to an idle agent
- `cancel_agent_task`: Cancel a running task by sending Ctrl+C interrupt

### History & Logs
- `show_agent_task_history`: View paginated task history (ordered newest first)
- `show_agent_log`: View paginated conversation logs (default: latest entry only)

## Usage Examples

### Example 1: List All Agents

```python
# Using MCP client
result = await client.call_tool("list_agents", {})
print(result["agents"])
# [{"name": "agent-1", "status": "idle", "project": "Setup", ...}, ...]
```

### Example 2: Create a New Agent

```python
result = await client.call_tool("create_agent", {
    "name": "data-scientist",
    "project": "Setup",
    "role": "coder",
    "task": "Analyze sales data from Q4"
})

print(result["agent"]["workspace_id"])
# "workspace-uuid-here"
```

### Example 3: Send Task to Agent

```python
# First, verify agent is idle
agent = await client.call_tool("show_agent", {
    "agent_name": "data-scientist"
})

if agent["agent"]["status"] == "idle":
    result = await client.call_tool("start_agent_task", {
        "agent_name": "data-scientist",
        "task_description": "Generate sales report for Q4"
    })
    print(result["message"])
    # "Task assigned to agent 'data-scientist'"
```

### Example 4: View Task History

```python
result = await client.call_tool("show_agent_task_history", {
    "agent_name": "data-scientist",
    "page": 1,
    "page_size": 10
})

for task in result["tasks"]:
    print(f"{task['created_at']}: {task['message']}")
```

## Development

### Project Structure

```
libs/fleet-mcp-clean/
├── src/fleet_mcp_clean/
│   ├── __init__.py
│   ├── __main__.py          # FastMCP server entry point
│   ├── models/              # Pydantic domain models
│   ├── clients/             # Coder API HTTP client
│   ├── repositories/        # Data access layer
│   ├── services/            # Business logic layer
│   └── tools/               # MCP tool definitions
└── tests/
    ├── fixtures/            # Test data and mocks
    ├── cassettes/           # VCR cassettes (if used)
    ├── clients/             # Client layer tests
    ├── repositories/        # Repository layer tests
    ├── services/            # Service layer tests
    └── tools/               # Tool layer tests
```

### Layer Responsibilities

- **Tools**: Parameter validation, MCP protocol handling, response formatting
- **Services**: Business rules, cross-cutting concerns, orchestration
- **Repositories**: Entity mapping, data access patterns
- **Clients**: HTTP requests, error handling, retries
- **Models**: Data validation, serialization, type safety

## License

See repository root for license information.
