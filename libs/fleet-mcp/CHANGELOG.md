## 0.4.0 (2025-11-05)

### 🚀 Features

- Add PR URL tracking for fleet-mcp agents ([#797](https://github.com/vgijssel/setup/pull/797))

## 0.3.0 (2025-11-04)

### 🚀 Features

- feat: Add HTTP server support with uvicorn for fleet-mcp and integrate with Coder devcontainer ([#792](https://github.com/vgijssel/setup/pull/792))

## 0.2.0 (2025-11-03)

### 🚀 Features

- Add Fleet MCP server for managing Claude Code agents in Coder workspaces ([#790](https://github.com/vgijssel/setup/pull/790))

  This adds a new MCP server that provides tools for:
  - Creating and managing Claude Code agents in Coder workspaces
  - Starting and canceling tasks on agents
  - Viewing agent logs and task history
  - Discovering available projects and roles from Coder templates
  - Complete test coverage with VCR cassettes for reproducible integration tests