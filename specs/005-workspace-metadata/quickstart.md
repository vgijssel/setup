# Quickstart: Workspace Metadata Feature

**Feature**: Workspace Metadata for Fleet-MCP
**Version**: 1.0
**Last Updated**: 2025-11-12

## Overview

This feature extends fleet-mcp to expose workspace metadata (git branch, PR number, etc.) through MCP tools and HTTP endpoints. Metadata is defined in a `Taskfile.yml` in each agent's workspace and collected on-demand.

## Quick Start (5 Minutes)

### 1. Create a Taskfile in Your Workspace

Create `/workspaces/<your-workspace>/Taskfile.yml`:

```yaml
version: "3"

vars:
  gh_info:
    sh: gh pr view --json number,url,state 2>/dev/null || echo '{}'

tasks:
  pull_request_number:
    desc: "The number of the current pull request on GitHub"
    meta:
      include_in_list: true
    cmds:
      - echo '{{.gh_info}}' | jq -r '.number // empty'

  pull_request_state:
    desc: "The state of the current pull request (OPEN, CLOSED, MERGED)"
    meta:
      include_in_list: false
    cmds:
      - echo '{{.gh_info}}' | jq -r '.state // empty'

  git_branch:
    desc: "The name of the current git branch"
    meta:
      include_in_list: false
    cmds:
      - git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
```

### 2. Query Metadata via MCP Tool

```python
# From Claude Code or any MCP client
result = mcp.call_tool("show_agent", {"agent_name": "your-workspace"})

print(result["agent"]["metadata"])
# Output:
# {
#   "pull_request_number": {"value": 819, "schema": {...}},
#   "git_branch": {"value": "main", "schema": {...}}
# }
```

### 3. Query Metadata via HTTP

**Note**: The `/metadata` endpoint does NOT require a `?workspace=` parameter. It automatically knows the workspace context from the request.

```bash
curl "http://fleet-mcp-server:8000/metadata"
```

```json
{
  "data": {
    "pull_request_number": {
      "value": 819,
      "error": null,
      "schema": {
        "description": "The number of the current pull request on GitHub",
        "include_in_list": false
      }
    },
    "git_branch": {
      "value": "main",
      "error": null,
      "schema": {
        "description": "The name of the current git branch",
        "include_in_list": false
      }
    }
  },
  "meta": {"version": "1.0"}
}
```

---

## Taskfile Configuration

### Basic Structure (Using Meta Key - MVP Requirement)

**IMPORTANT**: Metadata fields are defined as individual tasks with a `meta` key containing ONLY `include_in_list`.

```yaml
version: "3"

tasks:
  <field_name>:
    desc: "<Human-readable description>"
    meta:
      include_in_list: true  # or false
    cmds:
      - echo "<value>"
```

### Advanced Features

#### 1. Include in List View

Use the `include_in_list` flag in the `meta` key for each task:

```yaml
tasks:
  pr_number:
    desc: "The pull request number"
    meta:
      include_in_list: true  # Show in list_agents response
    cmds:
      - gh pr view --json number -q .number

  git_sha:
    desc: "Current commit SHA"
    meta:
      include_in_list: false  # Only show in show_agent response
    cmds:
      - git rev-parse HEAD
```

#### 2. Error Handling

**Graceful Degradation**:
```yaml
tasks:
  pr_number:
    desc: "PR number if available"
    meta:
      include_in_list: true
    cmds:
      - gh pr view --json number -q .number 2>/dev/null || echo ""

  environment:
    desc: "Deployment environment with default"
    meta:
      include_in_list: false
    cmds:
      - echo "${DEPLOY_ENV:-development}"
```

**Note**: If a task command fails, the `error` field will be populated in the response.

#### 3. Complex Queries

```yaml
vars:
  k8s_status:
    sh: kubectl get pods -l app=myapp -o json 2>/dev/null || echo '{}'

tasks:
  pod_count:
    desc: "Number of running pods"
    meta:
      include_in_list: true
    cmds:
      - echo '{{.k8s_status}}' | jq '.items | length'

  pod_ready:
    desc: "Number of ready pods"
    meta:
      include_in_list: false
    cmds:
      - echo '{{.k8s_status}}' | jq '[.items[].status.conditions[] | select(.type=="Ready" and .status=="True")] | length'
```

---

## Use Cases

### 1. PR Tracking Workflow

**Scenario**: Track which agents are working on which PRs

**Taskfile**:
```yaml
vars:
  gh_pr:
    sh: gh pr view --json number,state 2>/dev/null || echo '{}'

tasks:
  pr_number:
    desc: "PR number"
    meta:
      include_in_list: true
    cmds:
      - echo '{{.gh_pr}}' | jq -r '.number // empty'

  pr_status:
    desc: "PR status"
    meta:
      include_in_list: false
    cmds:
      - echo '{{.gh_pr}}' | jq -r '.state // "unknown"'

  pr_checks:
    desc: "PR CI status"
    meta:
      include_in_list: false
    cmds:
      - gh pr checks --json state -q 'map(.state) | join(",")' 2>/dev/null || echo ""
```

**Query**:
```python
agents = mcp.call_tool("list_agents", {})
for agent in agents["agents"]:
    if agent["metadata"].get("pr_number"):
        print(f"{agent['name']}: PR #{agent['metadata']['pr_number']}")
```

### 2. Environment Tracking

**Taskfile**:
```yaml
tasks:
  kubernetes_namespace:
    desc: "Current k8s namespace"
    meta:
      include_in_list: true
    cmds:
      - kubectl config view --minify -o jsonpath='{..namespace}' || echo "default"

  deployed_version:
    desc: "Currently deployed version"
    meta:
      include_in_list: false
    cmds:
      - kubectl get deployment myapp -o jsonpath='{.spec.template.spec.containers[0].image}' | cut -d: -f2
```

### 3. Development Status

**Taskfile**:
```yaml
tasks:
  git_status:
    desc: "Number of changed files"
    meta:
      include_in_list: true
    cmds:
      - git status --porcelain | wc -l

  last_commit:
    desc: "Last commit message"
    meta:
      include_in_list: false
    cmds:
      - git log -1 --pretty=%B

  branch_ahead:
    desc: "Commits ahead of main"
    meta:
      include_in_list: false
    cmds:
      - git rev-list --count main..HEAD
```

---

## API Reference

### MCP Tools

#### show_agent
**Returns**: Full metadata with schemas
```python
mcp.call_tool("show_agent", {"agent_name": "my-agent"})
```

#### list_agents
**Returns**: Filtered metadata (only `include_in_list=true` fields, values only)
```python
mcp.call_tool("list_agents", {})
```

### HTTP Endpoint

#### GET /metadata
**Returns**: Full metadata with schemas

**Note**: No `?workspace=` parameter needed - context is automatic.

```bash
curl "http://fleet-mcp:8000/metadata"
```

---

## Troubleshooting

### No Metadata Returned

**Problem**: `metadata_count=0`, `metadata={}`

**Causes**:
1. No `Taskfile.yml` in workspace
2. Taskfile has syntax errors
3. Taskfile is in wrong location

**Solution**:
```bash
# Check if Taskfile exists
ls -la /workspaces/<workspace>/Taskfile.yml

# Validate Taskfile syntax
cd /workspaces/<workspace>
task --list --json

# Check Taskfile location (must be in workspace root or specify path)
task --taskfile /path/to/Taskfile.yml --list
```

### Metadata Values are Null

**Problem**: `metadata.field.value = null`

**Causes**:
1. Task command failed (non-zero exit code)
2. Task command timed out (>5 seconds)
3. Required tools missing (git, gh, kubectl, etc.)

**Solution**:
```bash
# Test task manually
cd /workspaces/<workspace>
task <task_name>

# Check for errors
task <task_name> 2>&1

# Add error handling to task
tasks:
  my_task:
    cmds:
      - my-command 2>/dev/null || echo "fallback-value"
```

### Metadata Collection is Slow

**Problem**: Queries take >5 seconds

**Causes**:
1. Tasks are running sequentially (should be parallel)
2. Individual tasks are slow (network calls, heavy computation)
3. Too many metadata fields (>10)

**Solution**:
```yaml
# Optimize slow tasks
vars:
  # Cache expensive operations in variables
  cached_data:
    sh: expensive-command

tasks:
  field1:
    cmds:
      - echo '{{.cached_data}}' | jq -r '.field1'
  field2:
    cmds:
      - echo '{{.cached_data}}' | jq -r '.field2'

# Add timeouts
tasks:
  slow_task:
    cmds:
      - timeout 2s slow-command || echo "timeout"
```

---

## Best Practices

### 1. Keep Tasks Fast
- Target: <1 second per task
- Use caching (variables) for expensive operations
- Add timeouts to prevent hanging

### 2. Handle Errors Gracefully
- Always provide fallback values
- Use `|| echo "default"` pattern
- Check command availability: `command -v git >/dev/null || echo "N/A"`

### 3. Use Meaningful Descriptions
- Descriptions appear in UI/API responses
- Be concise but clear
- Include units if applicable: "CPU usage (%)"

### 4. Mark Important Fields for Lists
- Use `[LIST]` prefix for high-value fields
- Limit list fields to 2-3 most important items
- Full details available in show_agent

### 5. Test Your Taskfile
```bash
# Test schema generation
task --list --json

# Test parallel execution
task --silent --parallel --output prefixed task1 task2 task3

# Test error handling
task failing_task  # Should not crash
```

---

## Examples

### Minimal Taskfile
```yaml
version: "3"

tasks:
  git_branch:
    desc: "Current branch"
    meta:
      include_in_list: true
    cmds:
      - git branch --show-current
```

### Production Taskfile
```yaml
version: "3"

vars:
  gh_pr:
    sh: gh pr view --json number,state,title 2>/dev/null || echo '{}'

tasks:
  pr_number:
    desc: "GitHub PR number"
    meta:
      include_in_list: true
    cmds:
      - echo '{{.gh_pr}}' | jq -r '.number // empty'

  pr_status:
    desc: "PR status (OPEN, CLOSED, MERGED)"
    meta:
      include_in_list: false
    cmds:
      - echo '{{.gh_pr}}' | jq -r '.state // empty'

  pr_title:
    desc: "PR title"
    meta:
      include_in_list: false
    cmds:
      - echo '{{.gh_pr}}' | jq -r '.title // empty'

  git_branch:
    desc: "Git branch"
    meta:
      include_in_list: true
    cmds:
      - git branch --show-current 2>/dev/null || echo "detached"

  git_sha:
    desc: "Commit SHA (short)"
    meta:
      include_in_list: false
    cmds:
      - git rev-parse --short HEAD 2>/dev/null || echo "unknown"

  git_commit_message:
    desc: "Last commit message"
    meta:
      include_in_list: false
    cmds:
      - git log -1 --pretty=%s 2>/dev/null || echo ""

  workspace_age:
    desc: "Time since workspace creation"
    meta:
      include_in_list: false
    cmds:
      - echo $(($(date +%s) - $(stat -c %Y /workspaces 2>/dev/null || echo $(date +%s)))) | awk '{print int($1/3600)"h"}'
```

---

## Next Steps

1. **Create your Taskfile**: Start with minimal example, add fields incrementally
2. **Test locally**: Run `task --list --json` and `task --silent --parallel --output prefixed <tasks>`
3. **Query via MCP**: Use `show_agent` to see full metadata
4. **Integrate into workflows**: Build PR tracking, environment monitoring, etc.

For implementation details, see:
- [Data Model](./data-model.md) - Entity definitions
- [HTTP API Contract](./contracts/http-api.md) - REST endpoint spec
- [MCP Tools Contract](./contracts/mcp-tools.md) - MCP tool changes
