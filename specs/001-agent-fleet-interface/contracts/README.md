# API Contracts: Agent Fleet Management MCP Tools

This directory contains the API contract definitions for the Coder MCP server.

## Files

- **mcp-tools-schema.json**: JSON Schema defining all MCP tools exposed by the server
  - Tool input/output schemas
  - Data model definitions (Agent, LogEntry, FleetStatus)
  - Validation rules and constraints

## MCP Tool Summary

| Tool | Purpose | Maps to Coder API |
|------|---------|------------------|
| `list_agents` | List all agents with filtering | GET /api/experimental/tasks |
| `get_agent_details` | Get specific agent details | GET /api/experimental/tasks/{user}/{id} |
| `create_agent_task` | Create new task/agent | POST /api/experimental/tasks/{user} |
| `delete_agent` | Terminate agent workspace | POST /api/v2/workspaces/{id}/builds (transition=delete) |
| `send_agent_input` | Send input to running agent | POST /api/experimental/tasks/{user}/{id}/send |
| `get_agent_logs` | Retrieve agent logs | GET /api/experimental/tasks/{user}/{id}/logs |
| `get_fleet_status` | Get aggregate fleet metrics | Computed from list_agents |

## Usage

These schemas are used for:

1. **Contract Testing**: Validate MCP tool implementations match expected schemas
2. **Documentation**: Auto-generate API docs for superagent developers
3. **Client Generation**: Generate type-safe MCP clients
4. **Validation**: Runtime validation of tool inputs/outputs

## Validation

Run contract tests to verify implementation:

```bash
nx test coder-mcp --grep contract
```

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [JSON Schema Draft 07](https://json-schema.org/draft-07/schema)
- [Coder AI Tasks API](https://github.com/coder/coder/blob/main/coderd/aitasks.go)
