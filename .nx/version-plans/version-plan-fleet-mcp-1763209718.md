---
fleet-mcp: minor
---

Add support for environment-based bearer token configuration. TokenManager now prioritizes FLEET_MCP_AUTH_TOKEN environment variable over file-based tokens, enabling secure token injection from workspace provisioners while maintaining backward compatibility.
