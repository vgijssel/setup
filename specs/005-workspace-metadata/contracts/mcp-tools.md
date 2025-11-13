# MCP Tools Contract: Metadata Integration

**Version**: 1.0
**Protocol**: Model Context Protocol (MCP)

## Overview

This document specifies how workspace metadata is integrated into existing MCP tools: `show_agent` and `list_agents`. The tool signatures remain unchanged; metadata is added as additional response fields.

---

## Tool: show_agent

### Description
Show detailed information about a specific agent, now including workspace metadata.

### Input Parameters

**No changes** - existing parameters unchanged:

```json
{
  "agent_name": "string (required, 1-32 chars, alphanumeric + hyphens)"
}
```

### Output Schema (Modified)

**Added fields**:
- `agent.metadata_count`: Number of metadata fields available
- `agent.metadata`: Full metadata with values and schemas

```json
{
  "agent": {
    "name": "string",
    "workspace_id": "string (UUID)",
    "status": "string (AgentStatus enum)",
    "role": "string",
    "project": "string",
    "last_task": "string | null",
    "created_at": "string (ISO 8601)",
    "updated_at": "string (ISO 8601)",
    "metadata_count": "integer",
    "metadata": {
      "<field_name>": {
        "value": "any | null",
        "error": "string | null",
        "schema": {
          "description": "string",
          "include_in_list": "boolean"
        }
      }
    }
  }
}
```

### Example Response

```json
{
  "agent": {
    "name": "yaml-researcher",
    "workspace_id": "e4f24826-22c4-4492-b6a7-f4ee0c6e1efd",
    "status": "idle",
    "role": "Researcher",
    "project": "Setup",
    "last_task": "Research complete - comprehensive YAML schema design delivered",
    "created_at": "2025-11-12T08:41:59.920011+01:00",
    "updated_at": "2025-11-12T08:41:59.920011+01:00",
    "metadata_count": 3,
    "metadata": {
      "pull_request_number": {
        "value": 810,
        "error": null,
        "schema": {
          "description": "The number of the pull request.",
          "include_in_list": true
        }
      },
      "pull_request_status": {
        "value": "open",
        "error": null,
        "schema": {
          "description": "The status of the pull request.",
          "include_in_list": false
        }
      },
      "git_branch": {
        "value": "005-workspace-metadata",
        "error": null,
        "schema": {
          "description": "The name of the current git branch",
          "include_in_list": false
        }
      }
    }
  }
}
```

### Special Cases

#### No Metadata Available
**Condition**: Taskfile.yml missing or failed to load

```json
{
  "agent": {
    "...": "...",
    "metadata_count": 0,
    "metadata": {}
  }
}
```

#### Partial Metadata
**Condition**: Some tasks succeeded, some failed

```json
{
  "agent": {
    "...": "...",
    "metadata_count": 2,
    "metadata": {
      "git_branch": {
        "value": "main",
        "error": null,
        "schema": {
          "description": "Current git branch",
          "include_in_list": false
        }
      },
      "pr_number": {
        "value": null,
        "error": "Command 'gh pr view' failed: not found",
        "schema": {
          "description": "PR number (if available)",
          "include_in_list": true
        }
      }
    }
  }
}
```

### Error Handling

**No changes** - existing error behavior unchanged:
- `AgentNotFoundError` if agent doesn't exist
- `ValidationError` if `agent_name` is invalid

Metadata collection errors do NOT cause tool failure - they result in empty or partial metadata.

---

## Tool: list_agents

### Description
List all agents with optional filtering, now including summary metadata for each agent.

### Input Parameters

**No changes** - existing parameters unchanged:

```json
{
  "status_filter": "string | null (optional, AgentStatus enum)",
  "project_filter": "string | null (optional, project name)"
}
```

### Output Schema (Modified)

**Added fields to each agent**:
- `metadata_count`: Number of metadata fields available
- `metadata`: **Values only** (no schemas), **only fields with `include_in_list=true`**

```json
{
  "agents": [
    {
      "name": "string",
      "status": "string (AgentStatus enum)",
      "role": "string",
      "project": "string",
      "last_task": "string | null",
      "created_at": "string (ISO 8601)",
      "metadata_count": "integer",
      "metadata": {
        "<field_name>": "any | null"
      }
    }
  ],
  "total_count": "integer"
}
```

**Key Difference from show_agent**:
- `metadata` contains **values only** (not `{value, schema}` objects)
- Only includes fields where `schema.include_in_list = true`
- Reduces response size for list views

### Example Response

```json
{
  "agents": [
    {
      "name": "fleet-mcp-public",
      "status": "idle",
      "role": "Coder",
      "project": "Setup",
      "last_task": "Implementation complete - all CI checks passed",
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

### Metadata Filtering Logic

```python
# For each agent:
full_metadata = collect_metadata(agent.workspace_id)

# Filter to only include_in_list=True fields (values only, no error field)
list_metadata = {
    field_name: field.value
    for field_name, field in full_metadata.data.items()
    if field.schema.include_in_list
}
# Note: error field is NOT included in list view to keep response compact

agent_dict["metadata"] = list_metadata
agent_dict["metadata_count"] = len(full_metadata.data)  # Total, not filtered
```

**Note**: `metadata_count` reflects the TOTAL number of metadata fields, not just those included in the list. This allows users to know if more metadata is available via `show_agent`.

### Special Cases

#### No Metadata Available
```json
{
  "agents": [
    {
      "...": "...",
      "metadata_count": 0,
      "metadata": {}
    }
  ],
  "total_count": 1
}
```

#### All Metadata Excluded from List
**Condition**: Metadata exists but all fields have `include_in_list=false`

```json
{
  "agents": [
    {
      "...": "...",
      "metadata_count": 3,
      "metadata": {}
    }
  ],
  "total_count": 1
}
```

### Error Handling

**No changes** - existing error behavior unchanged:
- Returns empty list if no agents match filters
- `ValidationError` if filter values are invalid

Metadata collection errors do NOT cause tool failure or filter agents out - they result in empty metadata for affected agents.

---

## Backward Compatibility

### For Existing Clients

**Guarantee**: Existing MCP clients that don't expect metadata fields will continue to work.

**How**:
- New fields (`metadata`, `metadata_count`) are **added**, not replacing existing fields
- MCP protocol allows ignoring unknown fields
- Tool signatures (names, required parameters) unchanged

### Migration Path

1. **Phase 1** (current): Add metadata fields to responses
2. **Phase 2** (future, if needed): Add optional `include_metadata` parameter to tools
3. **Phase 3** (future, if needed): Deprecate old response format

---

## Performance Impact

### show_agent
- **Overhead**: +1-2 seconds for metadata collection
- **Total Time**: <3 seconds (per SC-001)
- **Mitigation**: Parallel task execution in Taskfile

### list_agents
- **Overhead**: +1-2 seconds per agent
- **Optimization**: Could add caching in future (not in initial implementation)
- **Serial Execution**: Metadata collected sequentially for each agent
- **For 10 agents**: ~10-20 seconds additional overhead

**Note**: Performance can be improved in future iterations with:
- Parallel metadata collection across agents
- Optional caching layer
- Optional `include_metadata=false` parameter to skip collection

---

## Testing Contract

### Test Scenarios

1. **show_agent with full metadata**
   - Input: `{"agent_name": "test-agent"}`
   - Expected: All metadata fields with values and schemas

2. **show_agent with no metadata**
   - Input: `{"agent_name": "agent-without-taskfile"}`
   - Expected: `metadata_count=0`, `metadata={}`

3. **show_agent with partial metadata**
   - Input: `{"agent_name": "agent-with-failed-tasks"}`
   - Expected: Some fields with `value=null`

4. **list_agents with mixed metadata**
   - Input: `{}`
   - Expected: Each agent has filtered metadata (only `include_in_list=true`)

5. **list_agents with no metadata**
   - Input: `{}`
   - Expected: All agents have `metadata_count=0`, `metadata={}`

### Contract Validation

Use JSON Schema validation in tests:

```python
# show_agent response schema
SHOW_AGENT_SCHEMA = {
    "type": "object",
    "properties": {
        "agent": {
            "type": "object",
            "properties": {
                "metadata_count": {"type": "integer", "minimum": 0},
                "metadata": {"type": "object"}
            },
            "required": ["metadata_count", "metadata"]
        }
    },
    "required": ["agent"]
}

# Validate response
jsonschema.validate(response, SHOW_AGENT_SCHEMA)
```
