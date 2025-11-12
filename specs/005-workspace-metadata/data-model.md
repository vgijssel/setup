# Data Model: Workspace Metadata

**Date**: 2025-11-12
**Status**: Complete

## Overview

This document defines the domain entities and value objects for the workspace metadata feature. All models use Pydantic 2.x for validation and serialization.

## Core Entities

### MetadataSchema
**Type**: Value Object
**Purpose**: Defines the schema/structure for a single metadata field

```python
class MetadataSchema(BaseModel):
    """Schema definition for a metadata field.

    Describes the metadata field's purpose and display rules without
    containing the actual value.
    """
    description: str = Field(
        ...,
        min_length=1,
        description="Human-readable description of what this field represents"
    )
    include_in_list: bool = Field(
        default=False,
        description="Whether to include this field in list_agents response"
    )
```

**Business Rules**:
- Description MUST NOT be empty
- `include_in_list=True` means field appears in list_agents tool
- `include_in_list=False` means field only appears in show_agent tool

**Example**:
```python
MetadataSchema(
    description="The number of the current pull request on GitHub",
    include_in_list=True
)
```

---

### MetadataField
**Type**: Value Object
**Purpose**: Combines a metadata value with its schema

```python
from typing import Optional, Any

class MetadataField(BaseModel):
    """A single metadata field with its value and schema.

    Represents one piece of workspace metadata (e.g., git branch, PR number).
    The value may be null if the metadata could not be collected.
    """
    value: Optional[Any] = Field(
        default=None,
        description="The actual metadata value, or null if unavailable"
    )
    schema: MetadataSchema = Field(
        ...,
        description="Schema describing this field"
    )
```

**Business Rules**:
- `value=None` indicates metadata collection failed for this field
- `value` can be any JSON-serializable type (str, int, bool, list, dict)
- Schema MUST always be present (even if value is null)

**Examples**:
```python
# Successful collection
MetadataField(
    value=819,
    schema=MetadataSchema(
        description="Pull request number",
        include_in_list=True
    )
)

# Failed collection
MetadataField(
    value=None,
    schema=MetadataSchema(
        description="Pull request status",
        include_in_list=False
    )
)
```

---

### WorkspaceMetadata
**Type**: Aggregate Root
**Purpose**: Complete metadata collection for a workspace

```python
class WorkspaceMetadata(BaseModel):
    """Complete metadata for a workspace.

    Contains all metadata fields collected from the workspace's Taskfile.
    Fields are dynamically defined by the Taskfile, not hardcoded.
    """
    data: dict[str, MetadataField] = Field(
        default_factory=dict,
        description="Map of field names to metadata fields"
    )
    meta: dict[str, str] = Field(
        default_factory=lambda: {"version": "1.0"},
        description="Metadata about the metadata (version, etc.)"
    )
```

**Business Rules**:
- Field names (dict keys) MUST match Taskfile task names
- Empty `data` dict indicates no metadata available (Taskfile missing/failed)
- `meta.version` tracks metadata schema version for future compatibility

**Example**:
```python
WorkspaceMetadata(
    data={
        "pull_request_number": MetadataField(
            value=819,
            schema=MetadataSchema(
                description="The number of the current pull request on GitHub",
                include_in_list=True
            )
        ),
        "git_branch": MetadataField(
            value="005-workspace-metadata",
            schema=MetadataSchema(
                description="The name of the current git branch",
                include_in_list=False
            )
        )
    },
    meta={"version": "1.0"}
)
```

---

## Extended Entities (Modifications to Existing Models)

### Agent (Modified)
**File**: `models/agent.py`
**Change**: Add optional `metadata` field

```python
from typing import Optional

class Agent(BaseModel):
    """Agent domain entity representing a Claude Code instance in a Coder workspace."""

    # ... existing fields ...
    name: str
    workspace_id: str
    status: AgentStatus
    role: str
    project: str
    last_task: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # NEW FIELD
    metadata: Optional[dict[str, Any]] = Field(
        default=None,
        description="Workspace metadata collected from Taskfile"
    )
```

**Business Rules**:
- `metadata=None` when metadata collection is disabled or failed
- `metadata={}` when metadata collection succeeded but no fields defined
- For list_agents: Only include fields where `schema.include_in_list=True`
- For show_agent: Include all fields with both value and schema

---

### AgentResponse (Modified)
**File**: `models/responses.py`
**Change**: Add `metadata` and `metadata_count` fields

```python
class AgentResponse(BaseModel):
    """Response model for show_agent tool."""

    agent: dict = Field(..., description="Agent details")

    # Agent dict structure (modified):
    # {
    #     "name": str,
    #     "workspace_id": str,
    #     "status": str,
    #     "role": str,
    #     "project": str,
    #     "last_task": Optional[str],
    #     "created_at": str,
    #     "updated_at": str,
    #     "metadata_count": int,         # NEW
    #     "metadata": dict[str, dict]    # NEW
    # }
```

**Metadata Structure for show_agent**:
```python
"metadata": {
    "pull_request_number": {
        "value": 819,
        "schema": {
            "description": "The number of the current pull request on GitHub",
            "include_in_list": true
        }
    },
    "git_branch": {
        "value": "005-workspace-metadata",
        "schema": {
            "description": "The name of the current git branch",
            "include_in_list": false
        }
    }
}
```

---

### ListAgentsResponse (Modified)
**File**: `models/responses.py`
**Change**: Add `metadata` and `metadata_count` to each agent

```python
class ListAgentsResponse(BaseModel):
    """Response model for list_agents tool."""

    agents: list[dict] = Field(..., description="List of agents")
    total_count: int = Field(..., description="Total number of agents")

    # Each agent dict structure (modified):
    # {
    #     "name": str,
    #     "status": str,
    #     "role": str,
    #     "project": str,
    #     "last_task": Optional[str],
    #     "created_at": str,
    #     "metadata_count": int,            # NEW
    #     "metadata": dict[str, Any]        # NEW (values only, no schema)
    # }
```

**Metadata Structure for list_agents**:
```python
"metadata": {
    "pull_request_number": 819  # Only value, no schema
    # Only fields with include_in_list=True
}
```

---

## State Transitions

### Metadata Collection Lifecycle

```
[Agent Created]
    ↓
[Metadata Requested] (via show_agent or list_agents)
    ↓
[Fetch Taskfile Schema] → Success: Parse tasks → [Execute Tasks]
    ↓                           ↓
   Failure:               Individual task results
 Return empty              collected (some may fail)
 metadata={}                        ↓
                           [Combine Schema + Results]
                                    ↓
                           [Return WorkspaceMetadata]
```

**Key Points**:
- Metadata is collected on-demand (not cached)
- Partial failures return partial metadata (not errors)
- Missing Taskfile returns empty metadata

---

## Validation Rules

### MetadataSchema
1. `description` MUST NOT be empty string
2. `include_in_list` defaults to `False` if not specified

### MetadataField
1. `schema` MUST always be present
2. `value` MAY be null (indicates collection failure)
3. `value` MUST be JSON-serializable if not null

### WorkspaceMetadata
1. `data` keys MUST match Taskfile task names (alphanumeric + underscore)
2. `meta.version` MUST be "1.0" for this schema version
3. Empty `data` dict is valid (no metadata available)

---

## Serialization Examples

### show_agent Response
```json
{
  "agent": {
    "name": "test-agent",
    "workspace_id": "ws-123",
    "status": "idle",
    "role": "Coder",
    "project": "Setup",
    "last_task": "Testing metadata feature",
    "created_at": "2025-11-12T10:00:00Z",
    "updated_at": "2025-11-12T10:05:00Z",
    "metadata_count": 2,
    "metadata": {
      "pull_request_number": {
        "value": 819,
        "schema": {
          "description": "The number of the current pull request on GitHub",
          "include_in_list": true
        }
      },
      "git_branch": {
        "value": "005-workspace-metadata",
        "schema": {
          "description": "The name of the current git branch",
          "include_in_list": false
        }
      }
    }
  }
}
```

### list_agents Response
```json
{
  "agents": [
    {
      "name": "test-agent",
      "status": "idle",
      "role": "Coder",
      "project": "Setup",
      "last_task": "Testing metadata feature",
      "created_at": "2025-11-12T10:00:00Z",
      "metadata_count": 2,
      "metadata": {
        "pull_request_number": 819
      }
    }
  ],
  "total_count": 1
}
```

### HTTP GET /metadata Response
```json
{
  "data": {
    "pull_request_number": {
      "value": 819,
      "schema": {
        "description": "The number of the current pull request on GitHub",
        "include_in_list": true
      }
    },
    "git_branch": {
      "value": "005-workspace-metadata",
      "schema": {
        "description": "The name of the current git branch",
        "include_in_list": false
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

---

## Database Schema

**Note**: No database persistence required. Metadata is collected on-demand and not stored.

---

## Migration Plan

**No migrations required** - adding optional fields to existing Pydantic models.

**Backward Compatibility**:
- Old clients (pre-metadata) will ignore new fields
- New clients will gracefully handle missing metadata (defaults to null)
- MCP tool signatures unchanged (metadata is additional response field)
