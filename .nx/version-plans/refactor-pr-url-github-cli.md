---
coder-devcontainer: minor
fleet-mcp: minor
---

# Refactor fleet-mcp PR URL handling to use GitHub CLI

Replaces HTTP endpoint-based PR URL tracking with direct GitHub CLI integration.

## Changes

### coder-devcontainer
- Added FLEET_MCP_WORKSPACE_DIR environment variable to enable workspace directory detection

### fleet-mcp
- Created GitHub client that calls `gh pr view` CLI
- Integrated GitHub client into Agent.from_workspace()
- Updated show_agent and list_agents to use PR URL from Agent model
- Removed set_agent_pr_url MCP tool and HTTP endpoints
- Deleted FleetMCPClient class
- Updated tests and removed obsolete test cases
