# Research: Workspace Metadata for Fleet-MCP

**Date**: 2025-11-12
**Status**: In Progress

## Research Questions

Based on the technical context, the following areas require research to resolve unknowns:

### 1. Taskfile Integration Pattern
**Question**: How should the fleet-mcp server retrieve metadata from agent workspaces?

**Options Considered**:
1. Use Coder MCP workspace_bash tool to execute commands remotely
2. SSH into workspace and execute
3. HTTP call to agent's fleet-mcp app instance

**Decision**: ✅ **HTTP call to agent's fleet-mcp app `/metadata` endpoint**

**Rationale**:
- Each agent workspace runs its own fleet-mcp app instance (similar to ccw app for tasks)
- The coder_workspace_bash MCP tool does NOT work for this use case
- HTTP calls leverage existing application URL pattern (same as TaskRepository uses for ccw app)
- Agent's fleet-mcp app reads its local Taskfile.yml and executes tasks internally
- Clean separation: main server orchestrates, agent apps execute

**Implementation**:
```python
# MetadataRepository orchestrates the collection
from .clients.metadata_client import MetadataClient

class MetadataRepository:
    def __init__(self, coder_client: CoderClient):
        self.coder_client = coder_client
        self.metadata_client = MetadataClient()

    async def collect_metadata(self, workspace_id: str) -> WorkspaceMetadata:
        """Collect metadata from agent's fleet-mcp app."""
        # Construct agent-specific URL (similar to TaskRepository pattern)
        workspace = await self.coder_client.get_workspace(workspace_id)
        agent_api_url = (
            f"{self.coder_client.base_url}/@{workspace.owner_name}/"
            f"{workspace.name}.{workspace_id}/apps/fleet-mcp/"
        )

        # MetadataClient makes HTTP GET to agent's /metadata endpoint
        metadata = await self.metadata_client.get_metadata(agent_api_url)
        return metadata
```

**Architecture Flow**:
```
Main Fleet-MCP Server → HTTP GET → Agent's Fleet-MCP App
                                       ↓
                                   Read Taskfile.yml
                                       ↓
                                   Execute tasks
                                       ↓
                                   Return JSON
```

---

### 2. FastMCP HTTP Endpoint Implementation
**Question**: How to add a standard HTTP GET endpoint to a FastMCP server alongside MCP tools?

**Options Considered**:
1. Use FastMCP's built-in HTTP server capabilities
2. Add a separate FastAPI/uvicorn server
3. Use FastMCP middleware/custom handlers

**Decision**: ✅ **Use FastMCP's `@mcp.custom_route()` decorator**

**Rationale**:
- FastMCP 2.13.0.2 has built-in support for custom HTTP routes via `@mcp.custom_route()`
- Fleet-mcp already uses this pattern for the `/health` endpoint (see `__main__.py:331-345`)
- Routes coexist with MCP tools without conflicts
- No need for separate FastAPI server - FastMCP uses Starlette internally
- Performance impact is minimal (single ASGI application)

**Implementation Pattern**:
```python
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

@mcp.custom_route("/metadata", methods=["GET"])
async def get_metadata(request: Request) -> Response:
    """HTTP GET endpoint for workspace metadata."""
    # Extract workspace info from request (query params or headers)
    workspace_name = request.query_params.get("workspace")

    # Collect metadata using MetadataRepository
    repo = get_metadata_repository()
    metadata = await repo.collect_metadata(workspace_name)

    return JSONResponse({
        "data": metadata,
        "meta": {"version": "1.0"}
    })
```

**Key Requirements**:
- Handler MUST be `async def`
- Handler MUST accept `Request` parameter
- Handler MUST return `Response` subclass
- Use `JSONResponse` for JSON responses
- Routes are registered before `mcp.http_app()` call

**Existing Example** (`__main__.py:331-345`):
```python
@mcp.custom_route("/health", methods=["GET"])
async def health_check(request):
    return JSONResponse({
        "status": "healthy",
        "service": "fleet-mcp",
        "version": "0.2.0",
    })
```

---

### 3. Taskfile Output Parsing Strategy
**Question**: What's the most robust way to parse prefixed parallel task output?

**Example Output**:
```
[git_branch] 005-workspace-metadata
[pull_request_state] OPEN
[pull_request_url] https://github.com/vgijssel/setup/pull/819
[pull_request_number] 819
```

**Options Considered**:
1. Regex parsing with `^\[(\w+)\]\s+(.+)$`
2. Line-by-line split on `] ` delimiter
3. Use Taskfile JSON output mode for task metadata, then execute tasks for values

**Decision**: ✅ **Two-phase approach: JSON list + prefixed execution**

**Rationale**:
- Task CLI supports `--list --json` which returns task metadata with descriptions
- Task CLI supports `--output prefixed` for parallel execution with labeled output
- Combining both gives us schema (from JSON) and values (from execution)

**Implementation**:

**Phase 1: Get task metadata (schema from tasks with meta key)**

**IMPORTANT**: Metadata fields are individual Taskfile tasks with a `meta` key:

```yaml
version: "3"

vars:
  gh_info:
    sh: gh pr view --json number,url,state 2>/dev/null || echo '{}'

tasks:
  pull_request_number:
    desc: "The number of the current pull request on GitHub"
    meta:
      include_in_list: true
    cmds:
      - echo '{{.gh_info}}' | jq -r '.number // empty'

  git_branch:
    desc: "The name of the current git branch"
    meta:
      include_in_list: false
    cmds:
      - git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
```

The implementation will:
1. Read Taskfile.yml from workspace
2. Parse `--list --json` output to find all tasks
3. Identify tasks that have a `meta` key
4. For each metadata task: read `desc` (description) and `meta.include_in_list` (boolean flag)

**Phase 2: Execute metadata tasks**

Use Task CLI to execute the identified tasks:

```bash
# Get list of metadata tasks first
task --list --json | jq -r '.tasks[] | select(.meta != null) | .name'

# Execute each metadata task
task pull_request_number --silent
task git_branch --silent
```

Or execute in parallel:
```bash
task --silent --parallel --output prefixed pull_request_number git_branch
```

**Note**: Task CLI executes the full task workflow (vars, cmds, etc.), providing better compatibility with Taskfile features.

**Parsing Logic**:
```python
import re

def parse_prefixed_output(output: str) -> dict[str, str]:
    """Parse task output with [task_name] prefix."""
    pattern = r'^\[([^\]]+)\]\s+(.*)$'
    results = {}
    for line in output.strip().split('\n'):
        match = re.match(pattern, line)
        if match:
            task_name, value = match.groups()
            results[task_name] = value.strip()
    return results
```

**Edge Cases Handled**:
- Empty values: Matched as empty string
- Multi-line values: Only first line captured (tasks should output single lines)
- Task failures: Stderr captured separately, failed tasks omitted from results
- Non-prefixed output: Ignored (only lines matching pattern are parsed)

---

### 4. Metadata Schema Design
**Question**: How should metadata schemas be represented in Pydantic models?

**Requirements**:
- Each metadata field has: value, description, include_in_list flag
- Schema should be extensible (new fields added via Taskfile only)
- Need to differentiate between "field exists with null value" vs "field doesn't exist"

**Options Considered**:
1. Dynamic dict with nested structure
2. Pydantic model with `Dict[str, MetadataField]`
3. Generic `Metadata` model with field registry

**Decision**: ✅ **Pydantic model with `Dict[str, MetadataField]`**

**Rationale**:
- Pydantic 2.x has excellent support for dict-based dynamic schemas
- Type safety for the structure while allowing dynamic keys
- JSON serialization handles Optional fields correctly (omit vs null)
- Aligns with existing fleet-mcp patterns

**Implementation**:
```python
from pydantic import BaseModel, Field
from typing import Optional, Any

class MetadataSchema(BaseModel):
    """Schema definition for a metadata field."""
    description: str
    include_in_list: bool = False

class MetadataField(BaseModel):
    """A single metadata field with value, error, and schema."""
    value: Optional[Any] = None  # null when task fails or returns empty
    error: Optional[str] = None  # populated on failure, null on success
    schema: MetadataSchema

class WorkspaceMetadata(BaseModel):
    """Complete metadata for a workspace."""
    data: dict[str, MetadataField] = Field(default_factory=dict)
    meta: dict[str, str] = Field(default_factory=lambda: {"version": "1.0"})
```

**Error Field Design**:
- `error=None` indicates successful collection
- `error="<message>"` indicates collection failure with error message
- `value=None` AND `error!=None` indicates partial failure (some fields failed)

**Serialization Behavior**:
- `value: None` → JSON: `"value": null`
- Missing field → Field omitted from JSON
- Use `model_dump(exclude_none=False)` to include null values
- Use `model_dump(exclude_none=True)` to omit null values

---

### 5. Workspace Application URL Construction
**Question**: How to construct the metadata endpoint URL for an agent's workspace?

**Context**: User requirement: "similar to how TaskRepository creates agent_api_url for ccw app"

**Current Pattern** (from task_repository.py:108):
```python
agent_api_url = f"{self.client.base_url}/@{owner_name}/{workspace_name}.{workspace_id}/apps/ccw/"
```

**Decision**: ✅ **Use same URL pattern for fleet-mcp app's /metadata endpoint**

**Rationale**:
- Each agent workspace runs its own fleet-mcp app instance (same as ccw app)
- Fleet-mcp app exposes a `/metadata` endpoint that reads local Taskfile.yml
- Main fleet-mcp server constructs agent-specific URL and makes HTTP GET request
- Follows existing proven pattern from TaskRepository

**Implementation**:
```python
# MetadataRepository constructs URL (similar to TaskRepository)
workspace = await self.coder_client.get_workspace(workspace_id)
agent_api_url = (
    f"{self.coder_client.base_url}/@{workspace.owner_name}/"
    f"{workspace.name}.{workspace_id}/apps/fleet-mcp/"
)
metadata_url = f"{agent_api_url}metadata"

# MetadataClient makes HTTP GET
async with httpx.AsyncClient(timeout=10.0) as client:
    response = await client.get(metadata_url)
    return WorkspaceMetadata.model_validate(response.json())
```

**Architecture**:
```
Main Fleet-MCP Server (MCP Tools)
  ↓
MetadataRepository.collect_metadata(workspace_id)
  ↓
Construct: https://coder.example.com/@owner/workspace.id/apps/fleet-mcp/metadata
  ↓
MetadataClient.get_metadata(url)
  ↓
HTTP GET to agent's /metadata endpoint
  ↓
Agent's Fleet-MCP App
  ↓
Read Taskfile.yml → Execute tasks → Return JSON
```

**Endpoint Locations**:
- **Agent's /metadata**: `{coder_base}/@{owner}/{workspace}.{id}/apps/fleet-mcp/metadata`
- **No main server endpoint**: Main server only calls agent endpoints, doesn't expose its own /metadata

---

### 6. Error Handling Strategy
**Question**: How should metadata collection failures be handled?

**Scenarios**:
- Taskfile.yml missing in workspace
- Task command times out
- Task command returns non-zero exit code
- Workspace is not a git repository
- GitHub CLI (gh) not available or not authenticated

**Options Considered**:
1. Return partial metadata with error indicators
2. Return empty metadata with error flag
3. Raise exception and fail entire agent query
4. Return cached metadata with stale flag

**Decision**: ✅ **Return partial metadata with null values for failed fields**

**Rationale**:
- Aligns with FR-007: "handle cases where metadata cannot be retrieved without failing the entire request"
- Consistent with existing fleet-mcp patterns (get_task_logs returns [] on 404)
- Provides best user experience - users see what metadata IS available
- Failed fields show as `null`, indicating "attempted but unavailable"

**Implementation**:
```python
async def collect_metadata(self, workspace_id: str) -> WorkspaceMetadata:
    """Collect metadata from agent via HTTP, returning partial results on errors."""
    try:
        # Construct agent URL
        workspace = await self.coder_client.get_workspace(workspace_id)
        agent_api_url = (
            f"{self.coder_client.base_url}/@{workspace.owner_name}/"
            f"{workspace.name}.{workspace_id}/apps/fleet-mcp/"
        )

        # Make HTTP GET to agent's /metadata endpoint
        metadata = await self.metadata_client.get_metadata(f"{agent_api_url}metadata")
        return metadata

    except httpx.TimeoutException:
        logger.warning(f"Metadata request timeout for workspace {workspace_id}")
        return WorkspaceMetadata(data={})
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            logger.warning(f"Metadata endpoint not found for workspace {workspace_id}")
        else:
            logger.error(f"HTTP error collecting metadata for {workspace_id}: {e}")
        return WorkspaceMetadata(data={})
    except Exception as e:
        logger.error(f"Unexpected error collecting metadata for {workspace_id}: {e}")
        return WorkspaceMetadata(data={})
```

**Error Handling**:
- HTTP 404: Agent app not running or /metadata endpoint not available → return empty metadata
- Timeout: Agent not responding within timeout → return empty metadata
- Connection error: Network issue → return empty metadata
- Agent returns partial data with error fields → preserve partial results
- Log warnings for retriable errors, errors for unexpected failures

---

### 7. Testing Strategy for HTTP Client
**Question**: How to test HTTP calls to agent /metadata endpoints without real agents?

**Options Considered**:
1. Mock httpx calls with pytest fixtures
2. Use VCR.py to record/replay HTTP responses
3. Create test server with known responses
4. Dependency injection for HTTP client

**Decision**: ✅ **Mock httpx client with pytest fixtures and respx**

**Rationale**:
- Fleet-mcp already uses httpx for HTTP calls (CoderClient)
- respx library provides clean httpx mocking for pytest
- Can test both success and failure scenarios deterministically
- No need for real agent instances or Coder infrastructure

**Implementation Pattern**:
```python
import respx
from httpx import Response

@pytest.mark.asyncio
@respx.mock
async def test_collect_metadata_success(metadata_repository):
    """Test successful metadata collection via HTTP."""
    # Arrange: Mock agent's /metadata endpoint
    agent_url = "https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/metadata"
    respx.get(agent_url).mock(return_value=Response(
        status_code=200,
        json={
            "data": {
                "git_branch": {
                    "value": "main",
                    "error": None,
                    "schema": {
                        "description": "Current git branch",
                        "include_in_list": True
                    }
                },
                "pr_number": {
                    "value": 123,
                    "error": None,
                    "schema": {
                        "description": "PR number",
                        "include_in_list": True
                    }
                }
            },
            "meta": {"version": "1.0"}
        }
    ))

    # Act
    metadata = await metadata_repository.collect_metadata("workspace-id")

    # Assert
    assert metadata.data["git_branch"].value == "main"
    assert metadata.data["pr_number"].value == 123
```

**Test Categories**:
1. **Unit Tests**: Test MetadataClient HTTP parsing with known responses
2. **Integration Tests**: Test MetadataRepository with mocked httpx responses
3. **Contract Tests**: Validate response JSON matches WorkspaceMetadata schema
4. **Error Tests**: Test 404, timeout, invalid JSON, partial failures

**Use respx**: respx is the recommended library for mocking httpx in pytest tests.

---

## Technology Best Practices

### FastMCP 2.13.0.2
✅ **COMPLETE**

**Best Practices**:
- Use `@mcp.custom_route(path, methods=[...])` decorator for HTTP endpoints
- Register routes BEFORE calling `mcp.http_app()`
- All handlers MUST be `async def` accepting `Request` → returning `Response`
- Use `JSONResponse` for JSON APIs
- Middleware applies to both MCP tools and custom routes
- Example: `/health` endpoint in `__main__.py:331-345`

---

### Pydantic 2.12.3
✅ **COMPLETE**

**Best Practices**:
- Use `Dict[str, CustomModel]` for dynamic keys with typed values
- Use `Optional[T]` for fields that may be null
- Use `Field(default_factory=dict)` for mutable defaults
- Use `model_dump(exclude_none=True)` to omit null values
- Use `BaseModel` for all domain entities
- Existing pattern: `models/agent.py`, `models/task.py`

---

### httpx 0.28.1
✅ **COMPLETE** (Not needed - using Coder MCP instead)

**Note**: Originally planned for HTTP client to call metadata endpoint, but architecture clarified:
- MetadataRepository uses Coder MCP `workspace_bash` tool (not HTTP)
- No HTTP client needed for metadata collection
- httpx already used by CoderClient for Coder API calls

---

### go-task/task (Taskfile)
✅ **COMPLETE**

**Best Practices**:
- Use `--list --json` to get task metadata (names, descriptions)
- Use `--silent --parallel --output prefixed` for execution
- Parse prefixed output with regex: `^\[([^\]]+)\]\s+(.*)$`
- Set timeout via Coder MCP `workspace_bash` timeout_ms parameter
- Handle task failures gracefully (missing from output = failed task)
- Use `--taskfile path/to/Taskfile.yml` to specify custom location

**CLI Flags**:
```bash
task --list --json              # Get schema
task --silent \                 # Suppress command echo
     --parallel \               # Run in parallel
     --output prefixed \        # Prefix with [task_name]
     task1 task2 task3          # Tasks to run
```

---

## Research Summary

All research questions have been answered. Key decisions:

1. **Taskfile Integration**: Use Coder MCP `workspace_bash` tool
2. **HTTP Endpoint**: Use FastMCP `@mcp.custom_route()` decorator
3. **Output Parsing**: Two-phase (JSON schema + prefixed execution)
4. **Schema Design**: Pydantic `Dict[str, MetadataField]`
5. **URL Construction**: Not applicable - endpoint on fleet-mcp server
6. **Error Handling**: Return partial metadata with null for failed fields
7. **Testing**: Mock Coder MCP client calls with pytest

Ready to proceed to Phase 1: Design & Contracts.
