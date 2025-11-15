---
fleet-mcp: minor
---

Add workspace metadata collection via Taskfile integration

Fleet-mcp now collects and returns workspace metadata (git branch, commit SHA, PR number, etc.) through both `show_agent` and `list_agents` tools. Metadata fields are dynamically defined in workspace Taskfile.yml files, enabling flexible tracking of agent workspace context for PR workflows and fleet coordination.
