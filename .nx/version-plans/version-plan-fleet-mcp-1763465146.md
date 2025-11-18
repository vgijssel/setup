---
fleet-mcp: minor
---

Add coder_metadata MCP resource for Claude desktop configuration

This change introduces a new MCP resource at `config://coder_metadata` that provides ready-to-use Claude desktop MCP server configuration. The resource returns formatted JSON configuration for connecting to fleet-mcp via mcp-remote, making it easier for users to set up their MCP connection without manually constructing the configuration.
