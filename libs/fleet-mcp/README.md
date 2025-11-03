# Fleet MCP Server

A stateless MCP (Model Context Protocol) server for managing a fleet of Claude Code agents running in Coder workspaces.

## Overview

Fleet MCP enables operators to create, monitor, and manage multiple Claude Code agents working in parallel across different projects. All agent state is stored in Coder workspace metadata, making the MCP server completely stateless.

## Features

### ✅ Phase 1 & 2: Foundation (Complete)
- **Pydantic Data Models**: Agent, Task, Role, Project with full validation
- **Coder API Client**: HTTP client for workspace management
- **AgentStatus Enum**: 11 distinct states (pending, starting, busy, idle, etc.)
- **Response Models**: Type-safe MCP tool responses

### ✅ Phase 3: User Story 1 - MVP (Complete)
- **create_agent**: Provision new Claude Code agents with roles and specs
- **list_agents**: View all agents with current status
- **show_agent**: Get detailed agent information including metadata
- **show_agent_task_history**: Paginated task history per agent

### ✅ Phase 4: User Story 2 - Task Management (Complete)
- **start_agent_task**: Assign tasks to idle agents via experimental task API
- **cancel_agent_task**: Cancel running tasks via AgentAPI application proxy (NEW!)
  - Uses Coder's application URLs to access AgentAPI running in workspaces
  - Bypasses 502 gateway timeout issues
  - Sends Ctrl+C signal for graceful cancellation
  - Based on research from agent Papi

### ✅ Phase 5+: Discovery & Management (Complete)
- **delete_agent**: Remove agents and destroy workspaces
- **list_agent_projects**: Discover available projects (templates)
- **list_agent_roles**: Discover roles for a project (workspace presets)
- **show_agent_log**: View paginated agent conversation history

### 🚀 Latest Features

#### AgentAPI-Based Task Cancellation
Fleet MCP now uses Coder's application URLs to access the AgentAPI running inside workspaces. This provides a reliable cancellation mechanism that bypasses gateway timeout issues (502 errors).

**How it works:**
1. Discovers AgentAPI application URL from workspace resources
2. Sends Ctrl+C signal via POST to `{agentapi_url}/message`
3. Agent gracefully handles cancellation and reports status

**Requirements:**
- Workspace template must include a `coder_app` resource with slug containing "ccw", "agentapi", or "claude"
- Agent must be running Claude Code with AgentAPI enabled

## Installation

```bash
# Install dependencies
cd libs/fleet-mcp
uv sync --all-extras

# Generate secrets
nx run fleet-mcp:secrets
```

## Configuration

Create `.env` from template:
```bash
CODER_URL=https://your-coder-instance.com
CODER_TOKEN=your-api-token
```

## Usage

### As a Library

```python
from fleet_mcp.server import create_mcp_server
import os

# Initialize MCP server
mcp = create_mcp_server(
    base_url=os.getenv("CODER_URL"),
    token=os.getenv("CODER_TOKEN")
)

# Server is ready to handle MCP tool requests
```

### Available Tools

#### create_agent
Create a new agent in a Coder workspace.

**Parameters:**
- `name` (str): Unique short agent name (e.g., "Sony", "Papi")
- `project` (str): Project name matching Coder template (e.g., "Setup")
- `spec` (str): Agent specification defining objectives
- `role` (str, optional): Agent role preset (default: "coder")

**Returns:** Agent details and success message

#### list_agents
List all agents in the fleet.

**Returns:** Array of agent summaries with name, status, current task

#### show_agent
Get detailed information about a specific agent.

**Parameters:**
- `agent_name` (str): Name of agent to query

**Returns:** Full agent details including metadata

#### show_agent_task_history
Get paginated task history for an agent.

**Parameters:**
- `agent_name` (str): Name of agent to query
- `page` (int, optional): Page number (default: 1)
- `page_size` (int, optional): Items per page (default: 20, max: 100)

**Returns:** Paginated task list

#### start_agent_task
Assign a new task to an idle agent.

**Parameters:**
- `agent_name` (str): Name of agent to assign task to
- `task_description` (str): Description of the task to perform (max 160 chars, no control characters)

**Returns:** Task confirmation with agent status change to "busy"

**Errors:**
- Agent not found (404)
- Agent is offline (400)
- Agent is already busy (409)
- Invalid task description (validation error)

#### cancel_agent_task
Cancel the currently running task on an agent using AgentAPI.

**Parameters:**
- `agent_name` (str): Name of agent whose task should be canceled

**Returns:** Cancellation confirmation with agent status "canceling"

**Implementation:**
- Discovers AgentAPI URL from workspace applications
- Sends Ctrl+C signal (SIGINT) via AgentAPI's `/message` endpoint
- Agent gracefully handles cancellation and reports "idle" status when complete

**Errors:**
- Agent not found (404)
- Agent is not busy / has no running task (400)
- AgentAPI not available - workspace template must include coder_app with slug "ccw", "agentapi", or "claude"

**Note:** This method bypasses the 502 gateway timeout issues by using Coder's application proxy to access AgentAPI directly.

#### delete_agent
Delete an agent and destroy its Coder workspace.

**Parameters:**
- `agent_name` (str): Name of agent to delete

**Returns:** Deletion confirmation

**Warning:** This operation is irreversible and forceful (deletes even if agent is busy).

#### list_agent_projects
List all available projects mapped to Coder templates.

**Returns:** Array of valid fleet-mcp projects (templates with ai_prompt and system_prompt parameters)

#### list_agent_roles
List all available agent roles for a specific project.

**Parameters:**
- `project` (str): Project name to query roles for

**Returns:** Array of roles (workspace presets) available for the project

#### show_agent_log
Get paginated conversation log for an agent.

**Parameters:**
- `agent_name` (str): Name of agent to query
- `page` (int, optional): Page number (default: 1)
- `page_size` (int, optional): Items per page (default: 1, max: 100)

**Returns:** Paginated conversation logs (newest first)

## Development

### Running Tests

```bash
# Run all tests
nx test fleet-mcp

# Run specific test suites
uv run pytest tests/unit -v          # Unit tests (data models)
uv run pytest tests/integration -v    # Integration tests (metadata)
uv run pytest tests/contract -v       # Contract tests (MCP tools - requires VCR cassettes)
```

### Project Structure

```
libs/fleet-mcp/
├── src/fleet_mcp/
│   ├── models/          # Pydantic data models
│   ├── coder/           # Coder API client and helpers
│   ├── tools/           # MCP tool implementations
│   └── server.py        # FastMCP server initialization
├── tests/
│   ├── unit/            # Model validation tests
│   ├── integration/     # API integration tests
│   └── contract/        # MCP tool contract tests
├── pyproject.toml       # Dependencies and configuration
└── package.json         # Nx targets
```

## Architecture

### Stateless Design
All agent state is stored in Coder workspace metadata with `fleet_mcp_*` prefix:
- `fleet_mcp_agent_name`: Unique agent identifier
- `fleet_mcp_role`: Agent role (coder, operator, manager)
- `fleet_mcp_project`: Project assignment
- `fleet_mcp_agent_spec`: Full agent specification
- Current task is determined via Coder's experimental task API (not metadata)

### Agent Status Derivation
Agent status is computed from workspace state + metadata:
- **Workspace Running + Task**: `busy`
- **Workspace Running + No Task**: `idle`
- **Workspace Stopped**: `stopped`
- **Workspace Failed**: `failed`
- etc.

### Dependencies
- **fastmcp** 2.13.0.2: MCP server framework
- **pydantic** 2.12.3: Data validation
- **httpx** 0.28.1: Async HTTP client for Coder API
- **pytest** + **pytest-vcr**: Testing framework

## Testing Approach

Following **Test-Driven Development (TDD)**:
1. **RED**: Write tests first (they fail)
2. **GREEN**: Implement code to pass tests
3. **REFACTOR**: Clean up while keeping tests green

All tests follow this pattern:
- Unit tests for models and validation
- Integration tests for Coder API interactions
- Contract tests for MCP tool behavior

## License

Part of the Setup monorepo.

## Contributing

1. Follow TDD workflow
2. Run `trunk fmt` and `trunk check` before committing
3. Ensure all tests pass: `nx test fleet-mcp`
4. Pin all dependency versions
