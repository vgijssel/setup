# Fleet MCP

Fleet management using MCP for AI agents in [Coder](https://coder.com) workspaces.

## Overview

Fleet MCP provides MCP (Model Context Protocol) tools for managing Claude Code agent fleets running in Coder workspaces. It follows clean architecture principles with strict layer separation for maintainability and testability.

## Architecture

The project uses a clean architecture with layer separation:

1. **Tools Layer** (`tools/`): MCP tool entry points with FastMCP, parameter validation
2. **Services Layer** (`services/`): Business logic, orchestration, rule enforcement
3. **Repositories Layer** (`repositories/`): Data access patterns, entity transformation
4. **Clients Layer** (`clients/`): HTTP communication with Coder API, error handling
5. **Models Layer** (`models/`): Shared Pydantic domain entities, validation

## Installation

This project uses `uv` for dependency management. Ensure you have uv installed:

```bash
# Install dependencies
cd libs/fleet-mcp
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

### Authentication (Optional)

Fleet MCP supports header-based Bearer token authentication for secure deployment. Authentication is disabled by default and can be enabled via environment variables.

#### Enable Authentication

```bash
# In your .env file
FLEET_MCP_AUTH_ENABLED=true

# Optional: Custom token file location (default: ~/.fleet-mcp/auth_token)
FLEET_MCP_AUTH_TOKEN_FILE=/custom/path/auth_token
```

#### Token Generation

On first startup with authentication enabled, the server will:
1. Generate a cryptographically secure access token (256-bit entropy)
2. Store it in `~/.fleet-mcp/auth_token` (file permissions: 0600)
3. Log the token to stdout for distribution

The token persists across server restarts - it won't be regenerated unless the file is deleted.

#### Using the Token

Configure your MCP client with the Authorization header:

```json
{
  "mcpServers": {
    "fleet-mcp": {
      "url": "https://fleet-mcp.example.com",
      "headers": {
        "Authorization": "Bearer <your-token-here>"
      }
    }
  }
}
```

#### Retrieve the Token

```bash
# From the token file
cat ~/.fleet-mcp/auth_token | jq -r '.value'

# Or from server logs (shown on first startup)
```

#### Rotate the Token

To generate a new token:

```bash
# Stop the server
# Delete the token file
rm ~/.fleet-mcp/auth_token
# Restart the server (generates new token)
```

For more details, see the [authentication documentation](../../specs/004-fleet-mcp-auth/quickstart.md).

## Running the Server

```bash
# Using Nx
nx server fleet-mcp

# Or directly with uv
cd libs/fleet-mcp
uv run fastmcp run src/fleet_mcp/__main__.py
```

## Testing

```bash
# Run tests with Nx
nx test fleet-mcp

# Or directly with uv
cd libs/fleet-mcp
uv run pytest

# With coverage
uv run pytest --cov=fleet_mcp --cov-report=term-missing

# Verify layer boundaries with import-linter
nx lint-imports fleet-mcp

# Run all validation together
nx run-many -t test lint-imports -p fleet-mcp
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

## Workspace Metadata Collection

Fleet MCP supports collecting workspace metadata (git branch, PR number, etc.) through a `Taskfile.yml` configuration file. This enables tracking which agents are working on which features, PRs, and branches.

### Quick Start

1. **Create a Taskfile.yml** in your workspace root:

```yaml
version: "3"

vars:
  gh_pr_info:
    sh: gh pr view --json number,url,state,title 2>/dev/null || echo '{}'

tasks:
  # Tasks with 'meta' key are collected as workspace metadata
  # include_in_list: true  → shown in list_agents (summary view)
  # include_in_list: false → only shown in show_agent (detail view)

  pull_request_number:
    desc: The number of the current pull request on GitHub
    meta:
      include_in_list: true
    cmds:
      - echo '{{.gh_pr_info}}' | jq -r '.number // empty'

  git_branch:
    desc: The name of the current git branch
    meta:
      include_in_list: false
    cmds:
      - git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
```

2. **Configure the Taskfile location** (optional):

```bash
# Set FLEET_MCP_TASKFILE to specify a custom Taskfile location
export FLEET_MCP_TASKFILE=/workspaces/setup/Taskfile.yml
```

3. **Query metadata** via MCP tools:

```python
# Full metadata in show_agent
agent = await client.call_tool("show_agent", {"agent_name": "my-agent"})
print(agent["agent"]["metadata"])
# {"pull_request_number": {"value": 819, "schema": {...}}, ...}

# Summary metadata in list_agents (only include_in_list=true fields)
agents = await client.call_tool("list_agents", {})
for agent in agents["agents"]:
    print(f"{agent['name']}: PR #{agent['metadata'].get('pull_request_number')}")
```

### Taskfile Configuration

Each metadata field is defined as a task with a `meta` key:

```yaml
tasks:
  <field_name>:
    desc: "<Human-readable description>"
    meta:
      include_in_list: true  # Show in list_agents? (true/false)
    cmds:
      - echo "<command to get value>"
```

**Best Practices**:
- Keep tasks fast (<1 second each) - use caching with `vars` for expensive operations
- Handle errors gracefully with fallbacks: `command 2>/dev/null || echo "default"`
- Use `include_in_list: true` for 2-3 most important fields
- Test your Taskfile: `task --list --json` and `task <task_name>`

**Example Use Cases**:
- PR tracking: `pull_request_number`, `pull_request_state`, `pull_request_url`
- Git context: `git_branch`, `git_commit_sha`, `git_commit_message`
- Environment tracking: `kubernetes_namespace`, `deployed_version`
- Development status: `git_status`, `branch_ahead`, `last_commit`

For complete documentation, examples, and troubleshooting, see:
- [Workspace Metadata Quickstart](../../specs/005-workspace-metadata/quickstart.md)
- [Example Taskfile](examples/Taskfile.yml)

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
libs/fleet-mcp/
├── src/fleet_mcp/
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
