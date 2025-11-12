# Data Model: Workspace Metadata

**Date**: 2025-11-12
**Branch**: 005-workspace-metadata
**Status**: Complete

## Overview

This document defines the domain entities, value objects, and data structures for workspace metadata collection in fleet-mcp. All models use Pydantic for validation and serialization.

## Entity Diagram

```
┌─────────────────────┐
│      Agent          │  (existing, modified)
│─────────────────────│
│ name: str           │
│ workspace_id: str   │
│ status: AgentStatus │
│ metadata_count: int │◄──┐
│ metadata: dict|None │   │
└─────────────────────┘   │
                          │
                          │
┌─────────────────────────┼──────────────────────────┐
│   WorkspaceMetadata     │  (new)                   │
│─────────────────────────┼──────────────────────────│
│ data: dict[str, Field]  │                          │
│ collected_at: datetime  │◄─────────────────────────┤
└─────────────────────────┼──────────────────────────┘
                          │
                          │
                   ┌──────┴───────┐
                   │ MetadataField │  (new)
                   │───────────────│
                   │ value: Any    │
                   │ schema: Schema│
                   └───────────────┘
                          │
                          │
                   ┌──────┴────────┐
                   │ FieldSchema   │  (new)
                   │───────────────│
                   │ type: str     │
                   │ description   │
                   │ includeInList │
                   │ values: list? │
                   └───────────────┘

┌──────────────────────┐
│  MetadataConfig      │  (new, configuration)
│──────────────────────│
│ variables: dict      │
│ data: dict           │
└──────────────────────┘
         │
         │
    ┌────┴──────┐
    │           │
┌───▼────┐ ┌───▼────┐
│Variable│ │DataField│
│Config  │ │Config   │
└────────┘ └─────────┘
```

## Core Entities

### 1. Agent (Modified)

**Type**: Domain Entity (existing, extended)

**Purpose**: Represents a Claude Code instance with workspace metadata.

**Fields**:
```python
class Agent(BaseModel):
    # --- Existing fields ---
    name: str
    workspace_id: str
    status: AgentStatus
    role: str
    project: str
    last_task: str | None
    created_at: datetime
    updated_at: datetime

    # --- New fields ---
    metadata_count: int = 0
    metadata: dict[str, Any] | None = None
```

**Validation Rules**:
- `metadata_count`: Non-negative integer, count of total metadata fields (not just includeInList)
- `metadata`: When present in show_agent response, contains full field definitions with schema
- `metadata`: When present in list_agents response, contains only fields where `includeInList=true`
- `metadata`: Can be `None` if metadata collection fails or is disabled

**State Transitions**: No new state transitions (metadata is passive data).

**Business Rules**:
1. Metadata collection MUST NOT block agent creation or status queries
2. Metadata errors MUST result in `null` values, not exceptions
3. Metadata is eventually consistent (cached, may be stale up to TTL)

### 2. WorkspaceMetadata

**Type**: Value Object (new)

**Purpose**: Encapsulates all metadata fields and collection timestamp for a workspace.

**Definition**:
```python
class WorkspaceMetadata(BaseModel):
    """Complete metadata snapshot for a workspace."""

    data: dict[str, MetadataField] = Field(
        default_factory=dict,
        description="Map of field name to field value+schema"
    )
    collected_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When this metadata was collected"
    )

    def to_list_view(self) -> dict[str, Any]:
        """Filter to fields with includeInList=true, return values only."""
        return {
            name: field.value
            for name, field in self.data.items()
            if field.schema.include_in_list
        }

    def to_show_view(self) -> dict[str, Any]:
        """Return full field definitions with schema."""
        return {
            name: {
                "value": field.value,
                "schema": field.schema.model_dump()
            }
            for name, field in self.data.items()
        }

    def count(self) -> int:
        """Total number of metadata fields."""
        return len(self.data)
```

**Immutability**: Value object - fields are immutable after construction.

### 3. MetadataField

**Type**: Value Object (new)

**Purpose**: Single metadata field with value and schema definition.

**Definition**:
```python
class MetadataField(BaseModel):
    """Single metadata field with value and schema."""

    value: str | int | float | bool | None = Field(
        description="Actual field value (null if collection failed)"
    )
    schema: FieldSchema = Field(
        description="Field schema definition from YAML config"
    )

    @field_validator("value")
    @classmethod
    def validate_value_matches_type(cls, v: Any, info: ValidationInfo) -> Any:
        """Ensure value matches schema type."""
        if v is None:
            return v  # Null values always allowed (collection failures)

        schema = info.data.get("schema")
        if not schema:
            return v

        expected_type = schema.type
        if expected_type == MetadataType.STRING and not isinstance(v, str):
            raise ValueError(f"Expected string, got {type(v).__name__}")
        elif expected_type == MetadataType.NUMBER and not isinstance(v, (int, float)):
            raise ValueError(f"Expected number, got {type(v).__name__}")
        elif expected_type == MetadataType.BOOLEAN and not isinstance(v, bool):
            raise ValueError(f"Expected boolean, got {type(v).__name__}")
        elif expected_type == MetadataType.ENUM:
            if v not in schema.values:
                raise ValueError(f"Value '{v}' not in allowed values: {schema.values}")

        return v
```

### 4. FieldSchema

**Type**: Value Object (new)

**Purpose**: Defines the schema/metadata about a metadata field (yes, meta-metadata).

**Definition**:
```python
class MetadataType(str, Enum):
    """Supported metadata field types."""
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"
    ENUM = "enum"


class FieldSchema(BaseModel):
    """Schema definition for a metadata field."""

    type: MetadataType = Field(
        description="Field data type"
    )
    description: str = Field(
        min_length=1,
        max_length=500,
        description="Human-readable field description"
    )
    include_in_list: bool = Field(
        default=False,
        description="Whether to include in list_agents response"
    )
    values: list[str] = Field(
        default_factory=list,
        description="Allowed values (required if type=enum)"
    )

    @model_validator(mode="after")
    def validate_enum_values(self) -> "FieldSchema":
        """Ensure enum type has values defined."""
        if self.type == MetadataType.ENUM and not self.values:
            raise ValueError("Enum type requires 'values' field")
        return self
```

## Configuration Entities

### 5. MetadataConfig

**Type**: Configuration Model (new)

**Purpose**: Represents the YAML configuration file structure.

**Definition**:
```python
class VariableConfig(BaseModel):
    """Configuration for a reusable variable."""

    cmd: str = Field(
        min_length=1,
        description="Shell command to execute (output cached per request)"
    )


class DataFieldConfig(BaseModel):
    """Configuration for a metadata data field."""

    cmd: str = Field(
        min_length=1,
        description="Shell command to execute (can use Jinja2 variables)"
    )
    type: MetadataType = Field(
        description="Field data type"
    )
    description: str = Field(
        min_length=1,
        max_length=500,
        description="Human-readable field description"
    )
    include_in_list: bool = Field(
        default=False,
        alias="includeInList",  # Support both camelCase and snake_case
        description="Whether to include in list_agents response"
    )
    values: list[str] | None = Field(
        default=None,
        description="Allowed values (required if type=enum)"
    )

    @model_validator(mode="after")
    def validate_enum_values(self) -> "DataFieldConfig":
        """Ensure enum type has values defined."""
        if self.type == MetadataType.ENUM and not self.values:
            raise ValueError("Enum type requires 'values' field")
        return self


class MetadataConfig(BaseModel):
    """Complete metadata configuration from YAML file."""

    variables: dict[str, VariableConfig] = Field(
        default_factory=dict,
        description="Reusable variables (executed once per request)"
    )
    data: dict[str, DataFieldConfig] = Field(
        description="Metadata fields to collect"
    )

    @field_validator("data")
    @classmethod
    def validate_non_empty_data(cls, v: dict) -> dict:
        """Ensure at least one data field is defined."""
        if not v:
            raise ValueError("Config must define at least one data field")
        return v
```

**File Location**:
- Default: `libs/fleet-mcp/src/fleet_mcp/config/default_metadata.yaml`
- Override: `~/.config/fleet-mcp/metadata.yaml` (if exists)
- Workspace-specific: `/workspace/.fleet-mcp/metadata.yaml` (highest priority)

## Response Models

### 6. ShowAgentResponse (Modified)

**Purpose**: Response for show_agent MCP tool, includes full metadata.

**Definition**:
```python
class ShowAgentResponse(BaseModel):
    """Response for show_agent tool."""

    agent: Agent  # Agent model now includes metadata fields

    def model_dump(self, **kwargs) -> dict[str, Any]:
        """Serialize with full metadata schema."""
        data = super().model_dump(**kwargs)

        # If metadata exists, format as {field: {value, schema}}
        if data["agent"]["metadata"]:
            metadata = data["agent"]["metadata"]
            # Assume metadata was set via WorkspaceMetadata.to_show_view()
            data["agent"]["metadata"] = metadata

        return data
```

**Example Response**:
```json
{
  "agent": {
    "name": "yaml-researcher",
    "workspace_id": "e4f24826-22c4-4492-b6a7-f4ee0c6e1efd",
    "status": "idle",
    "role": "Researcher",
    "project": "Setup",
    "last_task": "Research complete",
    "created_at": "2025-11-12T08:41:59.920011+01:00",
    "updated_at": "2025-11-12T08:41:59.920011+01:00",
    "metadata_count": 2,
    "metadata": {
      "pull_request_number": {
        "value": 810,
        "schema": {
          "type": "number",
          "description": "The number of the pull request.",
          "includeInList": true
        }
      },
      "pull_request_status": {
        "value": "open",
        "schema": {
          "type": "enum",
          "values": ["open", "closed", "merged"],
          "description": "The status of the pull request.",
          "includeInList": false
        }
      }
    }
  }
}
```

### 7. ListAgentsResponse (Modified)

**Purpose**: Response for list_agents MCP tool, includes subset of metadata.

**Definition**:
```python
class ListAgentsResponse(BaseModel):
    """Response for list_agents tool."""

    agents: list[Agent]
    total_count: int

    def model_dump(self, **kwargs) -> dict[str, Any]:
        """Serialize with filtered metadata (includeInList only)."""
        data = super().model_dump(**kwargs)

        # Filter metadata to includeInList fields (values only)
        for agent_data in data["agents"]:
            if agent_data["metadata"]:
                # Assume metadata was set via WorkspaceMetadata.to_list_view()
                # Already contains only includeInList fields as {field: value}
                pass

        return data
```

**Example Response**:
```json
{
  "agents": [
    {
      "name": "fleet-mcp-public",
      "status": "idle",
      "role": "Coder",
      "project": "Setup",
      "last_task": "Implementation complete",
      "created_at": "2025-11-12T06:51:29.291315+01:00",
      "metadata_count": 2,
      "metadata": {
        "pull_request_number": 42
      }
    },
    {
      "name": "fleet-metadata",
      "status": "busy",
      "role": "Coder",
      "project": "Setup",
      "last_task": "Listing all fleet agents",
      "created_at": "2025-11-12T08:27:01.397801+01:00",
      "metadata_count": 2,
      "metadata": {
        "pull_request_number": null
      }
    }
  ],
  "total_count": 2
}
```

## HTTP Endpoint Response

### 8. MetadataHttpResponse

**Purpose**: Response for GET /metadata HTTP endpoint.

**Definition**:
```python
class MetadataHttpResponse(BaseModel):
    """Response for GET /metadata HTTP endpoint."""

    data: dict[str, dict[str, Any]] = Field(
        description="Metadata fields with value and schema"
    )
    meta: dict[str, Any] = Field(
        description="Response metadata"
    )

    @staticmethod
    def from_workspace_metadata(metadata: WorkspaceMetadata) -> "MetadataHttpResponse":
        """Convert WorkspaceMetadata to HTTP response format."""
        return MetadataHttpResponse(
            data=metadata.to_show_view(),
            meta={
                "version": "1.0",
                "collected_at": metadata.collected_at.isoformat()
            }
        )
```

**Example Response**:
```json
{
  "data": {
    "pull_request_number": {
      "value": 810,
      "schema": {
        "type": "number",
        "description": "The number of the pull request.",
        "includeInList": true
      }
    },
    "pull_request_status": {
      "value": "open",
      "schema": {
        "type": "enum",
        "values": ["open", "closed", "merged"],
        "description": "The status of the pull request.",
        "includeInList": false
      }
    }
  },
  "meta": {
    "version": "1.0",
    "collected_at": "2025-11-12T10:30:45.123456+00:00"
  }
}
```

## Repository Layer Models

### 9. ExecutionResult (Internal)

**Purpose**: Internal model for command execution results.

**Definition**:
```python
class ExecutionResult(BaseModel):
    """Result of executing a shell command in workspace."""

    stdout: str
    stderr: str
    exit_code: int
    timed_out: bool = False

    def is_success(self) -> bool:
        """Check if command executed successfully."""
        return self.exit_code == 0 and not self.timed_out

    def get_value(self) -> str | None:
        """Get stdout value if successful, None otherwise."""
        return self.stdout.strip() if self.is_success() else None
```

## Validation Rules Summary

| Entity | Validation Rule | Enforcement |
|--------|----------------|-------------|
| Agent.metadata_count | >= 0 | Pydantic validator |
| Agent.metadata | Dict or None | Pydantic type check |
| MetadataField.value | Matches schema.type | Custom validator |
| FieldSchema.values | Non-empty if type=enum | Model validator |
| DataFieldConfig.cmd | Non-empty string | Pydantic min_length |
| MetadataConfig.data | At least one field | Field validator |
| ExecutionResult.exit_code | Integer (any value) | Pydantic type check |

## State Transitions

Metadata collection has these states (not persisted, runtime only):

```
┌─────────────┐
│   Initial   │
│  (No Cache) │
└──────┬──────┘
       │
       │ collect_metadata()
       ▼
┌─────────────┐     TTL Expired
│  Collecting ├────────────────┐
│ (Variables) │                │
└──────┬──────┘                │
       │                       │
       │ execute_data_fields() │
       ▼                       │
┌─────────────┐                │
│   Cached    │                │
│ (Valid TTL) │◄───────────────┘
└──────┬──────┘
       │
       │ to_list_view() / to_show_view()
       ▼
┌─────────────┐
│  Returned   │
│  to Caller  │
└─────────────┘
```

## Error Handling

All metadata operations follow these error rules:

1. **Configuration Errors** (startup): Fail-fast with clear error message
2. **Collection Errors** (runtime): Return `null` value, log warning
3. **Timeout Errors**: Return `null` value, log timeout details
4. **Validation Errors**: Return `null` value if conversion fails (e.g., string→number)

**Never throw exceptions during metadata collection** - always gracefully degrade to `null` values.

## Model Files to Create/Modify

| File | Status | Purpose |
|------|--------|---------|
| `src/fleet_mcp/models/metadata.py` | NEW | MetadataField, FieldSchema, WorkspaceMetadata |
| `src/fleet_mcp/models/agent.py` | MODIFY | Add metadata_count, metadata fields |
| `src/fleet_mcp/models/responses.py` | MODIFY | Update ShowAgentResponse, ListAgentsResponse |
| `src/fleet_mcp/config/metadata_config.py` | NEW | MetadataConfig, VariableConfig, DataFieldConfig |
| `src/fleet_mcp/repositories/metadata_repository.py` | NEW | ExecutionResult (internal model) |

## Summary

This data model design:
- ✅ Extends existing Agent entity without breaking changes
- ✅ Uses Pydantic for validation and serialization
- ✅ Separates configuration (YAML) from runtime data (WorkspaceMetadata)
- ✅ Supports partial failures (null values)
- ✅ Enables filtering (includeInList) for list vs show views
- ✅ Embeds schema in responses for dynamic client rendering
