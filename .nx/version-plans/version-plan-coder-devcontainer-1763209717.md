---
coder-devcontainer: minor
---

Add bearer token authentication for fleet-mcp server integration. Generates a unique cryptographically secure 43-character bearer token per workspace using hashicorp/random provider and passes it to fleet-mcp via FLEET_MCP_AUTH_TOKEN environment variable. Token is also stored as sensitive workspace metadata.
