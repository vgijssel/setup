# Quickstart: Workspace Metadata

**Date**: 2025-11-12
**Branch**: 005-workspace-metadata
**Status**: Complete

## Overview

This guide shows how to use workspace metadata in fleet-mcp for tracking PR status, git branches, and custom workspace information.

## Prerequisites

- fleet-mcp 0.3.0+ installed
- At least one agent created and running
- Git repository in agent workspace (for git metadata)
- `gh` CLI tool (for PR metadata examples)

## Basic Usage

### 1. View Metadata for a Single Agent

Use the `show_agent` MCP tool to see all metadata fields with their schemas:

```python
from mcp import ClientSession

async with ClientSession() as session:
    result = await session.call_tool("show_agent", {
        "agent_name": "my-agent"
    })

    print(result.agent.metadata_count)  # Total fields: 4
    print(result.agent.metadata)
    # {
    #   "git_branch": {
    #     "value": "main",
    #     "schema": {"type": "string", "description": "...", "includeInList": true}
    #   },
    #   "git_sha": {
    #     "value": "a1b2c3d",
    #     "schema": {"type": "string", "description": "...", "includeInList": true}
    #   },
    #   ...
    # }
```

### 2. List Agents with Metadata Summary

Use the `list_agents` MCP tool to see metadata for all agents (only `includeInList` fields):

```python
result = await session.call_tool("list_agents", {})

for agent in result.agents:
    print(f"{agent.name}: {agent.metadata}")
    # fleet-agent-1: {"git_branch": "main", "git_sha": "a1b2c3d"}
    # fleet-agent-2: {"git_branch": "feature-x", "git_sha": "e4f5g6h"}
```

### 3. Query Metadata via HTTP Endpoint

Direct HTTP access for non-MCP clients:

```bash
# Get metadata for workspace
curl "http://localhost:8000/metadata?workspace_name=my-agent"

# Force refresh (bypass cache)
curl "http://localhost:8000/metadata?workspace_name=my-agent&force_refresh=true"
```

Response:
```json
{
  "data": {
    "git_branch": {
      "value": "main",
      "schema": {
        "type": "string",
        "description": "Current git branch name",
        "includeInList": true
      }
    }
  },
  "meta": {
    "version": "1.0",
    "collected_at": "2025-11-12T10:30:45Z"
  }
}
```

## Configuration

### Default Configuration

Fleet-mcp ships with default git metadata. No configuration required for basic git tracking.

Default fields:
- `git_branch`: Current branch name
- `git_sha`: Short commit SHA
- `git_dirty`: Has uncommitted changes
- `git_remote_url`: Remote repository URL

### Custom Configuration

Create `~/.config/fleet-mcp/metadata.yaml` to add custom fields:

```yaml
# Reusable variables (expensive commands executed once)
variables:
  pr_info:
    cmd: "gh pr view --json number,state,title,author"

# Custom metadata fields
data:
  pull_request_number:
    cmd: "echo {{ pr_info }} | jq '.number'"
    type: number
    description: "The number of the pull request."
    includeInList: true

  pull_request_status:
    cmd: "echo {{ pr_info }} | jq -r '.state'"
    type: enum
    values: [open, closed, merged]
    description: "The status of the pull request."
    includeInList: false

  # Standalone field (no variable)
  deployment_env:
    cmd: "cat /workspace/.env | grep ENV | cut -d= -f2"
    type: enum
    values: [dev, staging, production]
    description: "Deployment environment"
    includeInList: true
```

### Workspace-Specific Configuration

Override config for specific workspace by creating `/workspace/.fleet-mcp/metadata.yaml`:

```yaml
# Workspace-specific metadata
data:
  feature_flag_enabled:
    cmd: "cat feature-flags.json | jq -r '.newFeature'"
    type: boolean
    description: "Whether new feature is enabled"
    includeInList: true
```

**Configuration Priority** (highest to lowest):
1. `/workspace/.fleet-mcp/metadata.yaml` (workspace-specific)
2. `~/.config/fleet-mcp/metadata.yaml` (user override)
3. Default configuration (shipped with fleet-mcp)

## Common Use Cases

### Track PR Status Across Fleet

Configure PR metadata, then filter agents by PR status:

```python
# List all agents working on open PRs
agents = await session.call_tool("list_agents", {})

open_pr_agents = [
    agent for agent in agents.agents
    if agent.metadata and agent.metadata.get("pull_request_status") == "open"
]

print(f"Agents with open PRs: {[a.name for a in open_pr_agents]}")
```

### Monitor Dirty Workspaces

Find agents with uncommitted changes:

```python
agents = await session.call_tool("list_agents", {})

for agent in agents.agents:
    # Get full metadata
    full_agent = await session.call_tool("show_agent", {"agent_name": agent.name})

    git_dirty = full_agent.agent.metadata.get("git_dirty", {}).get("value")
    if git_dirty is True:
        print(f"⚠️  {agent.name} has uncommitted changes")
```

### Custom Deployment Tracking

Track which environment each agent is configured for:

```yaml
# Add to metadata.yaml
data:
  deployment_env:
    cmd: "cat /workspace/.env | grep DEPLOY_ENV | cut -d= -f2 || echo 'unknown'"
    type: enum
    values: [dev, staging, production, unknown]
    description: "Target deployment environment"
    includeInList: true
```

Then filter:
```python
prod_agents = [
    a for a in agents.agents
    if a.metadata and a.metadata.get("deployment_env") == "production"
]
```

## Field Types

### String
```yaml
data:
  git_branch:
    cmd: "git rev-parse --abbrev-ref HEAD"
    type: string
    description: "Current git branch"
    includeInList: true
```

### Number
```yaml
data:
  pull_request_number:
    cmd: "gh pr view --json number | jq '.number'"
    type: number
    description: "PR number"
    includeInList: true
```

### Boolean
```yaml
data:
  has_dockerfile:
    cmd: "test -f Dockerfile && echo 'true' || echo 'false'"
    type: boolean
    description: "Whether workspace has Dockerfile"
    includeInList: false
```

### Enum
```yaml
data:
  ci_status:
    cmd: "gh pr view --json statusCheckRollup | jq -r '.statusCheckRollup[0].conclusion'"
    type: enum
    values: [success, failure, pending, skipped]
    description: "CI check status"
    includeInList: true
```

## Variables for Performance

Use variables to avoid running expensive commands multiple times:

```yaml
variables:
  # Run once per request
  pr_data:
    cmd: "gh pr view --json number,state,title,author,checks"

data:
  # Reuse pr_data variable
  pr_number:
    cmd: "echo {{ pr_data }} | jq '.number'"
    type: number
    description: "PR number"
    includeInList: true

  pr_title:
    cmd: "echo {{ pr_data }} | jq -r '.title'"
    type: string
    description: "PR title"
    includeInList: false

  pr_checks_passing:
    cmd: "echo {{ pr_data }} | jq '[.checks[].conclusion == \"success\"] | all'"
    type: boolean
    description: "Whether all PR checks are passing"
    includeInList: true
```

**Performance Impact**:
- Without variables: `gh pr view` runs 3 times (3× API rate limit cost)
- With variables: `gh pr view` runs 1 time (1× API rate limit cost)

## Error Handling

Metadata collection errors are non-blocking. Failed fields return `null` values:

```json
{
  "git_branch": {
    "value": null,  // Command failed or timed out
    "schema": { ... }
  }
}
```

**Common Failure Cases**:
- Command not found (e.g., `gh` not installed) → `null`
- Timeout (>10s default) → `null`
- Non-zero exit code → `null`
- Not a git repository → `null` (for git commands)

**All failures are logged** but never block `show_agent` or `list_agents` operations.

## Caching Behavior

Metadata is cached for 60 seconds (configurable):

```python
# First call: collects metadata (500ms)
agent1 = await session.call_tool("show_agent", {"agent_name": "my-agent"})

# Second call within 60s: uses cache (<50ms)
agent2 = await session.call_tool("show_agent", {"agent_name": "my-agent"})

# Force refresh
import httpx
response = httpx.get(
    "http://localhost:8000/metadata",
    params={"workspace_name": "my-agent", "force_refresh": True}
)
```

**Cache Scope**:
- Per workspace (each agent has separate cache)
- TTL: 60 seconds default
- Eviction: LRU (Least Recently Used)
- Variable cache: Request-scoped only

## Security

### Command Injection Prevention

Variables are automatically escaped before substitution:

```yaml
variables:
  user_input:
    cmd: "echo 'safe value'"  # Result: "safe value"

data:
  derived:
    cmd: "echo {{ user_input }}"  # Rendered: echo 'safe value' (quoted)
```

Jinja2 sandboxing prevents code execution in templates.

### Workspace Isolation

Commands execute in workspace context via Coder API:
- No cross-workspace access
- No host system access
- Sandboxed to workspace filesystem

### Timeout Protection

Each field has timeout (default 10s):
- Prevents hanging on slow/infinite commands
- Timeout → `null` value, non-blocking

## Troubleshooting

### Metadata Not Appearing

1. Check configuration is valid YAML:
   ```bash
   python -c "import yaml; yaml.safe_load(open('~/.config/fleet-mcp/metadata.yaml'))"
   ```

2. Check fleet-mcp logs for errors:
   ```bash
   journalctl -u fleet-mcp -f
   ```

3. Verify workspace has required tools (git, gh, jq):
   ```bash
   # Via MCP
   await session.call_tool("coder_workspace_bash", {
       "workspace": "my-agent",
       "command": "which git gh jq"
   })
   ```

### Null Values

Check command execution manually:
```bash
# Test command in workspace
await session.call_tool("coder_workspace_bash", {
    "workspace": "my-agent",
    "command": "git rev-parse --abbrev-ref HEAD"
})
```

Common causes:
- Command not found
- Not a git repository
- Timeout (>10s)
- Permission denied

### Slow Metadata Collection

Use variables to avoid redundant commands:
```yaml
# Bad: Runs gh 5 times
data:
  field1:
    cmd: "gh pr view --json number | jq '.number'"
  field2:
    cmd: "gh pr view --json state | jq '.state'"

# Good: Runs gh 1 time
variables:
  pr_info:
    cmd: "gh pr view --json number,state"
data:
  field1:
    cmd: "echo {{ pr_info }} | jq '.number'"
  field2:
    cmd: "echo {{ pr_info }} | jq '.state'"
```

## Next Steps

- Read [data-model.md](./data-model.md) for detailed entity structure
- Read [contracts/http-api.yaml](./contracts/http-api.yaml) for API reference
- See [research.md](./research.md) for architecture decisions
- Run [tasks.md](./tasks.md) for implementation checklist (generated by `/speckit.tasks`)
