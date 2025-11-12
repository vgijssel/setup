# Research: Workspace Metadata Implementation

**Date**: 2025-11-12
**Branch**: 005-workspace-metadata
**Status**: Complete

## Overview

This document consolidates research findings for implementing workspace metadata collection in fleet-mcp. Key research areas: YAML schema design, Jinja2 templating security, command execution safety, HTTP endpoint patterns in FastMCP, and caching strategies.

## 1. YAML Schema Design

### Decision: Two-Phase Command Execution with Variables

**What was chosen**: Separate `variables` section for expensive operations, reusable in multiple `data` fields via Jinja2 templating.

**Rationale**:
- Git commands like `gh pr view --json` can fetch multiple fields in one API call
- Caching variables across a single request avoids redundant API calls
- Clear separation between data collection (variables) and field extraction (data)
- Supports both simple commands and complex multi-field queries

**Schema Structure**:
```yaml
variables:
  pr_info:
    cmd: "gh pr view --json number,state,title,author"

data:
  pull_request_number:
    cmd: "echo {{ pr_info }} | jq '.number'"
    type: number
    description: "The number of the pull request."
    includeInList: true
```

**Alternatives considered**:
1. **Flat structure with redundant commands** - Rejected because running `gh pr view` for each field wastes API rate limits and time
2. **Computed fields from single variable** - Rejected because doesn't support mixed data sources (git + other commands)
3. **GraphQL-style field selection** - Rejected as over-engineered for simple shell command execution

### Decision: Pydantic Models for Schema Validation

**What was chosen**: Strict Pydantic models for YAML validation on server startup.

**Rationale**:
- Type safety catches configuration errors before runtime
- Clear error messages for invalid YAML
- Matches existing fleet-mcp architecture (all models use Pydantic)
- Validates enum values, required fields, and type constraints

**Model Structure**:
```python
class MetadataType(str, Enum):
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    ENUM = "enum"

class VariableConfig(BaseModel):
    cmd: str

class DataFieldConfig(BaseModel):
    cmd: str
    type: MetadataType
    description: str
    includeInList: bool = False
    values: list[str] | None = None  # Required if type=enum

class MetadataConfig(BaseModel):
    variables: dict[str, VariableConfig] = {}
    data: dict[str, DataFieldConfig]
```

**Alternatives considered**:
1. **Runtime validation only** - Rejected because errors surface during production use
2. **JSON Schema** - Rejected because Pydantic provides better Python integration
3. **TOML format** - Rejected because YAML is more familiar for DevOps configurations

## 2. Jinja2 Templating Security

### Decision: Sandboxed Jinja2 Environment with Auto-Escaping

**What was chosen**: Jinja2 `SandboxedEnvironment` with shell escaping for all variable substitutions.

**Rationale**:
- Prevents code execution attacks via template injection
- Auto-escaping prevents command injection in shell commands
- Restricts template capabilities to variable substitution only
- Industry standard approach for untrusted template rendering

**Implementation Pattern**:
```python
from jinja2.sandbox import SandboxedEnvironment
import shlex

env = SandboxedEnvironment()
env.filters['shell_escape'] = shlex.quote

# Usage:
template = env.from_string("echo {{ pr_info | shell_escape }} | jq '.number'")
rendered = template.render(pr_info=variable_value)
```

**Alternatives considered**:
1. **Plain string formatting** - Rejected due to trivial command injection (e.g., `$(rm -rf /)`)
2. **Manual escaping** - Rejected because error-prone and easy to forget
3. **No templating (duplicate commands)** - Rejected because defeats caching purpose

### Decision: Command Allowlist (Future Enhancement)

**What was chosen**: Initially trust YAML config, document allowlist for future.

**Rationale**:
- YAML config is deployed via Git (trusted source)
- Allowlist adds complexity without immediate security benefit
- Can be added later if config source becomes untrusted
- Focus on command injection prevention first

**Future Enhancement**:
```python
ALLOWED_COMMANDS = {"git", "gh", "jq", "echo", "cat"}

def validate_command(cmd: str):
    base_cmd = shlex.split(cmd)[0]
    if base_cmd not in ALLOWED_COMMANDS:
        raise ValueError(f"Command '{base_cmd}' not allowed")
```

## 3. Command Execution Safety

### Decision: Use Coder Workspace Bash MCP Tool

**What was chosen**: Execute commands via existing `coder_workspace_bash` MCP tool with timeout.

**Rationale**:
- Already integrated with Coder API authentication
- Automatic workspace activation and agent connection
- Built-in timeout mechanism (configurable up to 300s)
- Sandboxed to specific workspace (no cross-workspace access)
- Existing error handling for workspace connectivity issues

**Implementation**:
```python
async def execute_command(workspace_name: str, command: str) -> str:
    result = await coder_client.workspace_bash(
        workspace=workspace_name,
        command=command,
        timeout_ms=10000  # 10 second default
    )
    return result.strip()
```

**Alternatives considered**:
1. **Direct SSH execution** - Rejected because requires credential management
2. **Custom Coder API integration** - Rejected because duplicates existing MCP tool
3. **Local command execution** - Rejected because not in agent workspace context

### Decision: Per-Field Timeout with Global Limit

**What was chosen**: 10s default timeout per field, 30s total collection timeout.

**Rationale**:
- Git commands typically complete in <1s in normal repos
- 10s handles slow operations (large repos, network delays)
- 30s total prevents one slow field blocking entire metadata fetch
- Configurable per deployment environment

**Error Handling**:
- Timeout → return `null` value, log warning
- Non-zero exit code → return `null` value, log error with stderr
- Command not found → return `null` value, log error
- Never block show/list agent operations

## 4. HTTP Endpoint Pattern with FastMCP

### Decision: Add HTTP Endpoint alongside MCP Tools

**What was chosen**: FastMCP server exposes both MCP tools AND HTTP endpoints via FastAPI integration.

**Rationale**:
- FastMCP 2.13+ supports HTTP routes via underlying FastAPI app
- Single server process handles both protocols
- Metadata endpoint can be called directly by MCP server without round-trip
- Follows existing fleet-mcp architecture (FastMCP-based)

**Endpoint Design**:
```python
from fastmcp import FastMCP

mcp = FastMCP("Fleet MCP")

@mcp.app.get("/metadata")
async def get_metadata(workspace_name: str):
    """HTTP endpoint for workspace metadata."""
    metadata = await metadata_service.collect_metadata(workspace_name)
    return {
        "data": metadata.data,
        "meta": {"version": "1.0"}
    }
```

**Alternatives considered**:
1. **Separate HTTP server** - Rejected because adds deployment complexity
2. **MCP-only (no HTTP)** - Rejected because user requirements specify HTTP endpoint
3. **WebSocket for streaming** - Rejected as over-engineered for infrequent polling

### Decision: Response Format with Schema Embedding

**What was chosen**: Embed schema definition alongside values in response.

**Rationale**:
- Clients discover field types and descriptions dynamically
- Supports runtime YAML config changes without client updates
- Enables UI to render appropriate input controls (enum → dropdown)
- Matches user-provided example format

**Response Structure**:
```json
{
  "data": {
    "field_name": {
      "value": <actual_value>,
      "schema": {
        "type": "string|number|boolean|enum",
        "description": "...",
        "includeInList": true|false,
        "values": [...] // if type=enum
      }
    }
  },
  "meta": {
    "version": "1.0",
    "collected_at": "2025-11-12T10:30:00Z"
  }
}
```

## 5. Caching Strategy

### Decision: Two-Tier Cache (Variable + Metadata)

**What was chosen**:
1. **Request-scoped variable cache**: Variables cached during single metadata collection
2. **Time-based metadata cache**: Full metadata cached for 60s with LRU eviction

**Rationale**:
- Request-scoped cache prevents redundant `gh pr view` in same collection cycle
- Time-based cache prevents repeated collections for rapid show/list calls
- 60s TTL balances freshness with performance (git branch changes are infrequent)
- LRU eviction handles large fleets (50+ agents)

**Implementation**:
```python
from functools import lru_cache
from datetime import datetime, timedelta

class MetadataCache:
    def __init__(self, ttl_seconds: int = 60):
        self._cache: dict[str, tuple[datetime, dict]] = {}
        self._ttl = timedelta(seconds=ttl_seconds)

    def get(self, workspace_name: str) -> dict | None:
        if workspace_name in self._cache:
            timestamp, data = self._cache[workspace_name]
            if datetime.now() - timestamp < self._ttl:
                return data
        return None

    def set(self, workspace_name: str, data: dict):
        self._cache[workspace_name] = (datetime.now(), data)
```

**Alternatives considered**:
1. **No caching** - Rejected because adds 500ms+ per agent for list operations
2. **Persistent cache (Redis)** - Rejected as over-engineered for in-memory data
3. **Event-driven invalidation** - Rejected because no git webhook integration

### Decision: Cache Bypass Parameter

**What was chosen**: Optional `?force_refresh=true` query parameter to skip cache.

**Rationale**:
- Enables debugging and verification of live data
- Supports workflows that need immediate updates (e.g., after git push)
- Minimal implementation complexity

## 6. Integration with Existing Architecture

### Decision: Extend Agent Model with Optional Metadata

**What was chosen**: Add `metadata` and `metadata_count` fields to Agent Pydantic model.

**Rationale**:
- Backward compatible (fields are optional, default to None/0)
- Fits existing response models (ListAgentsResponse, ShowAgentResponse)
- No breaking changes to existing MCP tool contracts

**Model Extension**:
```python
class Agent(BaseModel):
    # ... existing fields ...
    metadata_count: int = 0
    metadata: dict[str, Any] | None = None  # Full schema+value for show, subset for list
```

### Decision: MetadataRepository Calls CoderClient

**What was chosen**: MetadataRepository (Layer 3) uses CoderClient to execute workspace commands.

**Rationale**:
- Maintains clean architecture (Repository → Client dependency)
- Reuses existing workspace command execution logic
- Separates business logic (MetadataService) from data access (MetadataRepository)

**Flow**:
```
ShowAgentTool → AgentService → MetadataService → MetadataRepository → CoderClient
                                                                    ↘ MetadataConfig
```

## 7. Default Configuration

### Decision: Ship with Git Metadata as Default

**What was chosen**: Include default `metadata.yaml` with git branch, SHA, and dirty state.

**Rationale**:
- Satisfies primary use case (PR tracking) out of the box
- Demonstrates YAML schema structure for users
- Git is ubiquitous in development workspaces
- Gracefully handles non-git workspaces (returns null)

**Default Configuration**:
```yaml
variables:
  git_status:
    cmd: "git status --porcelain --branch"

data:
  git_branch:
    cmd: "git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown'"
    type: string
    description: "Current git branch name"
    includeInList: true

  git_sha:
    cmd: "git rev-parse --short HEAD 2>/dev/null || echo 'unknown'"
    type: string
    description: "Short commit SHA (7 chars)"
    includeInList: true

  git_dirty:
    cmd: "git status --porcelain | wc -l | xargs test 0 -ne && echo 'true' || echo 'false'"
    type: boolean
    description: "Whether workspace has uncommitted changes"
    includeInList: false
```

## Summary of Key Decisions

| Area | Decision | Primary Driver |
|------|----------|----------------|
| YAML Schema | Two-phase (variables + data) | Avoid redundant API calls |
| Templating | Sandboxed Jinja2 with escaping | Security (command injection prevention) |
| Command Execution | Coder workspace bash MCP tool | Reuse existing infrastructure |
| HTTP Endpoint | FastMCP integrated endpoint | Single-server simplicity |
| Caching | Two-tier (request + time-based) | Performance (500ms → <50ms for cached) |
| Agent Model | Optional metadata fields | Backward compatibility |
| Default Config | Git metadata (branch/SHA/dirty) | Primary use case (PR tracking) |

## Open Questions for Implementation

1. **YAML Config Location**: Should config be per-workspace or global fleet setting?
   - **Recommendation**: Global at `~/.config/fleet-mcp/metadata.yaml` with workspace override

2. **Metadata Version Migration**: How to handle config schema changes?
   - **Recommendation**: Version field in YAML, fail-fast on unsupported versions

3. **Error Visibility**: Should metadata errors be exposed to MCP tool callers?
   - **Recommendation**: Log warnings, return null values, never block show/list operations

## References

- [Jinja2 Security Best Practices](https://jinja.palletsprojects.com/en/3.1.x/sandbox/)
- [Python shlex for Command Escaping](https://docs.python.org/3/library/shlex.html)
- [FastMCP HTTP Integration](https://github.com/jlowin/fastmcp)
- [Pydantic Validation](https://docs.pydantic.dev/latest/concepts/validators/)
- [YAML 1.2 Specification](https://yaml.org/spec/1.2/spec.html)
