---
fleet-mcp: minor
---

Add authentication support to metadata client

Add Coder session token authentication to MetadataClient to fix issue where metadata fetches from Coder proxy URLs resulted in 303 redirects and empty metadata. The CODER_SESSION_TOKEN is now passed through the application stack and included as a Coder-Session-Token header in HTTP requests when available.
