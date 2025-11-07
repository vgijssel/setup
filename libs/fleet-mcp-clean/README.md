# Fleet MCP Clean

Clean architecture implementation of fleet management for Claude Code agents in Coder workspaces.

## Overview

Fleet MCP Clean provides MCP (Model Context Protocol) tools for managing Claude Code agent fleets running in Coder workspaces. It follows clean architecture principles with strict layer separation for maintainability and testability.

## Architecture

The project uses a 5-layer clean architecture:

1. **Tools Layer** (`tools/`): MCP tool entry points with FastMCP
2. **Services Layer** (`services/`): Business logic and validation
3. **Repositories Layer** (`repositories/`): Data access and transformation
4. **Clients Layer** (`clients/`): HTTP communication with Coder API
5. **Models Layer** (`models/`): Shared Pydantic domain entities

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
```

## Available MCP Tools

### Agent Discovery & Inspection
- `list_agents`: List all agents with optional filtering
- `show_agent`: Show detailed information about a specific agent
- `list_agent_projects`: List available projects (templates)
- `list_agent_roles`: List available roles for a project

### Agent Lifecycle
- `create_agent`: Create a new agent
- `delete_agent`: Delete an agent
- `restart_agent`: Restart an agent workspace

### Task Management
- `start_agent_task`: Assign a task to an idle agent
- `cancel_agent_task`: Cancel a running task

### History & Logs
- `show_agent_task_history`: View paginated task history
- `show_agent_log`: View paginated conversation logs

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
