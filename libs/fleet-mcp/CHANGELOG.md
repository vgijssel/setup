## 0.2.0 (2025-11-03)

### 🚀 Features

- Add Fleet MCP server for managing Claude Code agents in Coder workspaces ([#790](https://github.com/vgijssel/setup/pull/790))

  This adds a new MCP server that provides tools for:
  - Creating and managing Claude Code agents in Coder workspaces
  - Starting and canceling tasks on agents
  - Viewing agent logs and task history
  - Discovering available projects and roles from Coder templates
  - Complete test coverage with VCR cassettes for reproducible integration tests