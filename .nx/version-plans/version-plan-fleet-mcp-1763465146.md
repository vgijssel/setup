---
fleet-mcp: minor
coder-devcontainer: minor
---

Add coder_metadata resource for fleet-mcp MCP configuration

This change introduces a new Terraform `coder_metadata` resource in the coder-devcontainer workspace template that provides ready-to-use Claude desktop MCP server configuration. The metadata includes formatted JSON configuration for connecting to fleet-mcp via mcp-remote with the bearer token automatically populated, making it easier for users to set up their MCP connection by simply copying the configuration from the Coder workspace metadata panel.
