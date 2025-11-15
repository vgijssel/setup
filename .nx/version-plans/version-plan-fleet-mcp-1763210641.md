---
fleet-mcp: minor
---

Add workspace metadata to root endpoint

Updated the root endpoint (/) to return workspace metadata (git branch, PR number, etc.) collected from the workspace's Taskfile. This provides easy access to workspace context at the root URL for improved observability and monitoring.
