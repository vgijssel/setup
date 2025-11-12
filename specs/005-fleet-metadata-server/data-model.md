# Data Model: Fleet Metadata Server

**Date**: 2025-11-12
**Branch**: 005-fleet-metadata-server

## Overview

The fleet metadata server uses a simple but extensible data model to represent workspace metadata. All data is collected on-demand (stateless) and returned as structured key-value pairs with embedded schema information.

---

## Core Entities

### MetadataEntry

**Purpose**: Represents a single metadata key-value pair with its schema definition.

**Source**: API response format defined in user requirements.

**Pydantic Model**:
```python
from typing import Any, Literal
from pydantic import BaseModel, Field

class MetadataSchema(BaseModel):
    """Schema definition for a metadata value."""
    type: Literal["string", "number", "boolean", "enum"]
    description: str = Field(..., max_length=256)
    includeInList: bool = Field(default=True, description="Whether to show in summary lists")
    values: list[str] | None = Field(default=None, description="Valid values for enum type")

class MetadataEntry(BaseModel):
    """A single metadata key-value pair with schema."""
    value: Any = Field(..., description="The current metadata value")
    schema: MetadataSchema = Field(..., description="Schema definition for this metadata")
```

**Validation Rules**:
- `type` must be one of: "string", "number", "boolean", "enum"
- If `type == "enum"`, `values` must be a non-empty list
- `description` max length: 256 characters (FR-015)
- `value` must match the declared `type`

**Example**:
```python
MetadataEntry(
    value="005-fleet-metadata-server",
    schema=MetadataSchema(
        type="string",
        description="Current git branch name",
        includeInList=True
    )
)
```

---

### MetadataResponse

**Purpose**: Root response object for the `/metadata` endpoint.

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, field_validator

class MetadataResponse(BaseModel):
    """Response from /metadata endpoint."""
    data: dict[str, MetadataEntry] = Field(..., description="Metadata entries keyed by name")
    meta: dict[str, str] = Field(default_factory=lambda: {"version": "1.0"})

    @field_validator("data")
    @classmethod
    def validate_size_limits(cls, v: dict[str, MetadataEntry]) -> dict[str, MetadataEntry]:
        """Enforce FR-015 size limits."""
        import json

        # Check key length: max 256 chars
        for key in v.keys():
            if len(key) > 256:
                raise ValueError(f"Metadata key exceeds 256 characters: {key}")

        # Check value size: max 4KB per value
        for key, entry in v.items():
            value_json = json.dumps(entry.value)
            if len(value_json.encode("utf-8")) > 4096:
                raise ValueError(f"Metadata value exceeds 4KB: {key}")

        # Check total size: max 1MB
        total_json = json.dumps(v, default=str)
        total_bytes = len(total_json.encode("utf-8"))
        if total_bytes > 1_048_576:  # 1MB
            raise ValueError(f"Total metadata exceeds 1MB: {total_bytes} bytes")

        return v
```

**Example Response**:
```json
{
  "data": {
    "git_branch": {
      "value": "005-fleet-metadata-server",
      "schema": {
        "type": "string",
        "description": "Current git branch name",
        "includeInList": true
      }
    },
    "git_commit_hash": {
      "value": "32ca8fd",
      "schema": {
        "type": "string",
        "description": "Short commit hash (7 chars)",
        "includeInList": true
      }
    },
    "github_pr_number": {
      "value": 810,
      "schema": {
        "type": "number",
        "description": "Pull request number for current branch",
        "includeInList": true
      }
    },
    "github_pr_status": {
      "value": "open",
      "schema": {
        "type": "enum",
        "values": ["open", "closed", "merged"],
        "description": "Status of the pull request",
        "includeInList": false
      }
    },
    "workspace_task_status": {
      "value": "running",
      "schema": {
        "type": "enum",
        "values": ["idle", "running", "completed", "failed"],
        "description": "Current task execution status",
        "includeInList": true
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

---

## Domain Models

### Git Metadata

**Collected By**: `GitCollector`

**Metadata Keys** (prefix: `git_`):
| Key | Type | Description | Source |
|-----|------|-------------|--------|
| `git_branch` | string | Current branch name | `git rev-parse --abbrev-ref HEAD` |
| `git_commit_hash` | string | Short commit hash (7 chars) | `git rev-parse --short HEAD` |
| `git_commit_message` | string | Latest commit message | `git log -1 --pretty=%B` |
| `git_status` | enum | Working tree status: clean, modified, staged | `git status --porcelain` |
| `git_remote_url` | string | Remote origin URL | `git config --get remote.origin.url` |

**Error Handling**:
- If not a git repository: return empty dict, log warning
- If git command fails: return partial metadata, log error

**Example**:
```python
{
    "git_branch": MetadataEntry(
        value="main",
        schema=MetadataSchema(type="string", description="Current git branch name", includeInList=True)
    ),
    "git_status": MetadataEntry(
        value="clean",
        schema=MetadataSchema(
            type="enum",
            values=["clean", "modified", "staged"],
            description="Working tree status",
            includeInList=True
        )
    )
}
```

---

### GitHub Metadata

**Collected By**: `GitHubCollector`

**Metadata Keys** (prefix: `github_`):
| Key | Type | Description | Source |
|-----|------|-------------|--------|
| `github_pr_number` | number | PR number for current branch | GitHub API: `/repos/{owner}/{repo}/pulls?head={branch}` |
| `github_pr_status` | enum | PR status: open, closed, merged | GitHub API: pull request state |
| `github_pr_title` | string | PR title | GitHub API: pull request title |
| `github_pr_url` | string | PR HTML URL | GitHub API: pull request html_url |
| `github_repo_name` | string | Repository name (owner/repo) | Extracted from git remote URL |

**Authentication**:
- Uses `GITHUB_TOKEN` environment variable if available
- Falls back to unauthenticated requests (60 req/hour limit)

**Rate Limiting**:
- Implements exponential backoff retry on 429 responses
- Respects `Retry-After` header
- Max 3 retries before failure

**Error Handling**:
- If no GitHub token: log warning, attempt unauthenticated
- If rate limited after retries: return empty dict, log error
- If no remote URL: return empty dict
- If no PR for branch: return empty dict (not an error)

**Example**:
```python
{
    "github_pr_number": MetadataEntry(
        value=810,
        schema=MetadataSchema(type="number", description="Pull request number", includeInList=True)
    ),
    "github_pr_status": MetadataEntry(
        value="open",
        schema=MetadataSchema(
            type="enum",
            values=["open", "closed", "merged"],
            description="Pull request status",
            includeInList=False
        )
    )
}
```

---

### Workspace Metadata

**Collected By**: `WorkspaceCollector`

**Metadata Keys** (prefix: `workspace_`):
| Key | Type | Description | Source |
|-----|------|-------------|--------|
| `workspace_id` | string | Coder workspace ID | `CODER_WORKSPACE_ID` env var |
| `workspace_name` | string | Coder workspace name | `CODER_WORKSPACE_NAME` env var |
| `workspace_agent_name` | string | Coder agent name | `CODER_AGENT_NAME` env var |
| `workspace_task_status` | enum | Task status: idle, running, completed, failed | Detect from running processes or state file |
| `workspace_task_description` | string | Current task description | Read from state file if available |

**Task Detection Strategy** (OPEN QUESTION - to be resolved in Phase 2):
- Option 1: Read from `/tmp/fleet-metadata-task.json` state file written by fleet-mcp
- Option 2: Detect from `ps aux` for Claude Code or coder CLI processes
- Option 3: Query Coder API for workspace build logs

**Example**:
```python
{
    "workspace_id": MetadataEntry(
        value="fcb6fc42-ba88-4175-9508-88e6a554a61a",
        schema=MetadataSchema(type="string", description="Coder workspace ID", includeInList=True)
    ),
    "workspace_task_status": MetadataEntry(
        value="running",
        schema=MetadataSchema(
            type="enum",
            values=["idle", "running", "completed", "failed"],
            description="Current task execution status",
            includeInList=True
        )
    )
}
```

---

## Collector Interface

**Purpose**: Abstract base class for all metadata collectors.

**Implementation**:
```python
from abc import ABC, abstractmethod

class MetadataCollector(ABC):
    """Base interface for metadata collectors."""

    @abstractmethod
    async def collect(self) -> dict[str, MetadataEntry]:
        """
        Collect metadata entries from source.

        Returns:
            Dict of metadata key → MetadataEntry.
            Returns empty dict on error (don't fail entire collection).
        """
        pass

    @abstractmethod
    def get_prefix(self) -> str:
        """
        Get key prefix for this collector.

        Returns:
            Prefix string (e.g., 'git_', 'github_', 'workspace_').
        """
        pass
```

**Usage**:
```python
class GitCollector(MetadataCollector):
    def get_prefix(self) -> str:
        return "git_"

    async def collect(self) -> dict[str, MetadataEntry]:
        entries = {}
        try:
            branch = await self._get_branch()
            entries["git_branch"] = MetadataEntry(
                value=branch,
                schema=MetadataSchema(
                    type="string",
                    description="Current git branch name",
                    includeInList=True
                )
            )
        except Exception as e:
            logger.warning(f"Failed to collect git branch: {e}")
        return entries
```

---

## Service Layer

### MetadataService

**Purpose**: Orchestrates metadata collection from all collectors.

**Implementation**:
```python
import asyncio
from typing import List
import logging

logger = logging.getLogger(__name__)

class MetadataService:
    """Orchestrates metadata collection from all collectors."""

    def __init__(self, collectors: List[MetadataCollector]):
        self.collectors = collectors

    async def collect_all(self) -> MetadataResponse:
        """
        Collect metadata from all collectors in parallel.

        Returns:
            MetadataResponse with all collected metadata.
            Individual collector failures are logged but don't fail the entire collection.
        """
        all_metadata: dict[str, MetadataEntry] = {}

        # Collect in parallel
        results = await asyncio.gather(
            *[collector.collect() for collector in self.collectors],
            return_exceptions=True
        )

        # Merge results
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                collector_name = self.collectors[i].__class__.__name__
                logger.error(f"{collector_name} failed: {result}")
                continue
            all_metadata.update(result)

        # Return validated response (triggers size limit checks)
        return MetadataResponse(data=all_metadata, meta={"version": "1.0"})

    async def collect_by_key(self, key: str) -> MetadataEntry | None:
        """
        Collect metadata for a specific key.

        Args:
            key: Metadata key to collect.

        Returns:
            MetadataEntry if found, None otherwise.
        """
        all_metadata = await self.collect_all()
        return all_metadata.data.get(key)
```

---

## State Transitions

### Git Status

```
┌──────┐    Modify files    ┌──────────┐    git add    ┌────────┐
│ clean│───────────────────→│ modified │──────────────→│ staged │
└──────┘                    └──────────┘               └────────┘
   ↑                             │                          │
   └─────────────────────────────┴──────────────────────────┘
              git commit (transitions back to clean)
```

### GitHub PR Status

```
┌──────┐    Create PR    ┌──────┐    Merge    ┌────────┐
│ (no  │────────────────→│ open │────────────→│ merged │
│  PR) │                 └──────┘             └────────┘
└──────┘                     │
                             │ Close without merge
                             ↓
                         ┌────────┐
                         │ closed │
                         └────────┘
```

### Workspace Task Status

```
┌──────┐    Start task    ┌─────────┐    Complete    ┌───────────┐
│ idle │─────────────────→│ running │───────────────→│ completed │
└──────┘                  └─────────┘                └───────────┘
   ↑                           │
   │                           │ Error/failure
   │                           ↓
   │                      ┌────────┐
   └──────────────────────│ failed │
         Reset/new task   └────────┘
```

---

## Validation Rules

### Size Limits (FR-015)

Enforced in `MetadataResponse` validator:
- **Keys**: max 256 characters
- **Values**: max 4KB per value (JSON serialized)
- **Total**: max 1MB for entire response (JSON serialized)

**Implementation**:
```python
@field_validator("data")
@classmethod
def validate_size_limits(cls, v: dict[str, MetadataEntry]) -> dict[str, MetadataEntry]:
    import json

    # Key length validation
    for key in v.keys():
        if len(key) > 256:
            raise ValueError(f"Metadata key exceeds 256 characters: {key}")

    # Per-value size validation
    for key, entry in v.items():
        value_json = json.dumps(entry.value)
        if len(value_json.encode("utf-8")) > 4096:
            raise ValueError(f"Metadata value exceeds 4KB: {key}")

    # Total size validation
    total_json = json.dumps([e.model_dump() for e in v.values()], default=str)
    total_bytes = len(total_json.encode("utf-8"))
    if total_bytes > 1_048_576:
        raise ValueError(f"Total metadata exceeds 1MB: {total_bytes} bytes")

    return v
```

### Type Validation

Enforced in `MetadataEntry` and `MetadataSchema`:
- `type == "enum"` → `values` must be non-empty list
- `value` type must match `schema.type`:
  - "string" → str
  - "number" → int | float
  - "boolean" → bool
  - "enum" → value must be in `schema.values`

**Implementation**:
```python
from pydantic import field_validator

class MetadataEntry(BaseModel):
    value: Any
    schema: MetadataSchema

    @field_validator("value")
    @classmethod
    def validate_value_type(cls, v: Any, info) -> Any:
        schema = info.data.get("schema")
        if not schema:
            return v

        match schema.type:
            case "string":
                if not isinstance(v, str):
                    raise ValueError(f"Value must be string, got {type(v)}")
            case "number":
                if not isinstance(v, (int, float)):
                    raise ValueError(f"Value must be number, got {type(v)}")
            case "boolean":
                if not isinstance(v, bool):
                    raise ValueError(f"Value must be boolean, got {type(v)}")
            case "enum":
                if not schema.values or v not in schema.values:
                    raise ValueError(f"Value must be one of {schema.values}, got {v}")

        return v
```

---

## Security Considerations

### Input Sanitization (FR-016)

**Threat**: Malicious workspace data could contain injection attacks (command injection, XSS).

**Mitigation**:
1. **No command execution from metadata values**: Metadata is read-only, never executed.
2. **Pydantic validation**: All values validated against declared schema types.
3. **Size limits**: Prevent DoS via oversized metadata.
4. **JSON encoding**: All values JSON-encoded for transport, preventing script injection.

**Example**:
```python
# Malicious branch name with command injection attempt
malicious_branch = "feature`rm -rf /`"

# Safe: stored as string value, never executed
metadata["git_branch"] = MetadataEntry(
    value=malicious_branch,  # Stored as literal string
    schema=MetadataSchema(type="string", description="Branch name", includeInList=True)
)

# Returned as JSON string, no execution context
# {"data": {"git_branch": {"value": "feature`rm -rf /`", ...}}}
```

### GitHub Token Security

- Token read from environment variable (`GITHUB_TOKEN`)
- Never included in metadata responses
- Used only for GitHub API authentication
- Filtered from VCR cassettes in tests

---

## Open Questions

1. **Workspace Task Detection**: How should we detect running tasks?
   - File-based state (`/tmp/fleet-metadata-task.json`)?
   - Process detection (`ps aux | grep claude`)?
   - Coder API query?
   - **Decision needed before implementation phase.**

2. **GitHub Repository Auto-Detection**: Auto-detect from `git remote` or require `GITHUB_REPO` env var?
   - **Current approach**: Auto-detect from `git config --get remote.origin.url`
   - **Alternative**: Require explicit configuration for security

3. **Metadata Caching**: Should we cache metadata for a few seconds to reduce git/API calls?
   - **Current approach**: No caching (FR-012 requires current state)
   - **Future enhancement**: Optional TTL-based cache for high-load scenarios

4. **Schema Evolution**: How to handle schema changes without breaking fleet-mcp?
   - **Current approach**: Version in `meta.version` field
   - **Future**: Consider schema versioning per-key if needed
