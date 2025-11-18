---
fleet-mcp: minor
---

Improve performance with parallel task execution and metadata collection

This release introduces significant performance optimizations:

- **Parallel agent metadata fetching**: Agent list operations now fetch metadata concurrently using asyncio.gather(), reducing time from ~500ms to ~100ms for 5 agents
- **Parallel task execution**: Added --parallel flag to Taskfile task invocations for concurrent task execution when dependencies allow
- Maintains full backward compatibility with unchanged API signatures
- Preserves graceful error handling with empty metadata fallback on failures
