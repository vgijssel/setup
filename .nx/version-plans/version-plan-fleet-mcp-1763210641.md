---
fleet-mcp: minor
---

Add workspace metadata to root endpoint

Updated the root endpoint (/) to include both health status and workspace metadata in a single API call. This provides comprehensive status information combining service health and workspace context (git branch, PR number, etc.) for improved observability and monitoring.
