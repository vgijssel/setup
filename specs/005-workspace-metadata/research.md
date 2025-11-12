# Research: Workspace Metadata for Fleet-MCP

**Date**: 2025-11-12
**Status**: In Progress

## Research Questions

Based on the technical context, the following areas require research to resolve unknowns:

### 1. Taskfile Integration Pattern
**Question**: How should the fleet-mcp server invoke Taskfile commands in remote agent workspaces?

**Options Considered**:
1. Use Coder workspace bash execution (coder_workspace_bash MCP tool)
2. SSH into workspace and execute
3. Execute via workspace agent API

**Decision**: ✅ **Use Coder MCP workspace_bash tool**

**Rationale**:
- Fleet-mcp runs INSIDE a Coder workspace itself, so it has access to Coder MCP tools
- The `coder_workspace_bash` MCP tool allows executing commands in other workspaces
- This aligns with the user's requirement to execute Taskfile commands in agent workspaces
- Current architecture uses HTTP task API for Claude Code communication, but for shell commands we need direct execution

**Implementation**:
```python
# MetadataRepository will use Coder MCP client
from mcp import ClientSession

async def collect_metadata(self, workspace_name: str) -> dict:
    """Execute Taskfile commands in workspace to collect metadata."""
    # Use coder_workspace_bash MCP tool
    result = await mcp_client.call_tool(
        "coder_workspace_bash",
        arguments={
            "workspace": workspace_name,
            "command": "task --list --json",
            "timeout_ms": 5000
        }
    )
    # Parse result and extract metadata
```

**Note**: Fleet-mcp server has access to Coder MCP tools because it runs as a Coder workspace application itself. This is different from the task assignment flow which uses Coder's experimental task API.

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

**Phase 1: Get task metadata (schema)**
```bash
task --list --json --taskfile Taskfile.yml
```

Output:
```json
{
  "tasks": [
    {
      "name": "pull_request_number",
      "desc": "The number of the current pull request on GitHub",
      "up_to_date": false
    }
  ]
}
```

**Phase 2: Execute tasks to get values**
```bash
task --silent --parallel --output prefixed task1 task2 task3 --taskfile Taskfile.yml
```

Output:
```
[task1] value1
[task2] value2
[task3] value3
```

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
    """A single metadata field with value and schema."""
    value: Optional[Any] = None  # null when task fails or returns empty
    schema: MetadataSchema

class WorkspaceMetadata(BaseModel):
    """Complete metadata for a workspace."""
    data: dict[str, MetadataField] = Field(default_factory=dict)
    meta: dict[str, str] = Field(default_factory=lambda: {"version": "1.0"})
```

**Serialization Behavior**:
- `value: None` → JSON: `"value": null`
- Missing field → Field omitted from JSON
- Use `model_dump(exclude_none=False)` to include null values
- Use `model_dump(exclude_none=True)` to omit null values

---

### 5. Workspace Application URL Construction
**Question**: How to construct the metadata endpoint URL for an agent's workspace?

**Context**: User input mentions "similar to how TaskRepository creates agent_api_url for ccw app"

**Current Pattern** (from task_repository.py:108):
```python
agent_api_url = f"{self.client.base_url}/@{owner_name}/{workspace_name}.{workspace_id}/apps/ccw/"
```

**Decision**: ✅ **NOT APPLICABLE - Use Coder MCP tools instead**

**Rationale**:
- Re-reading the user requirements: The /metadata endpoint is on the fleet-mcp server itself, NOT in each agent workspace
- The flow is: `fleet-mcp /metadata endpoint → Coder MCP workspace_bash → Execute Taskfile in agent workspace`
- The metadata HTTP endpoint doesn't need to be deployed to each workspace
- Fleet-mcp calls Coder MCP tools to execute commands remotely

**Clarified Architecture**:
```
Claude Code (user)
  → MCP Tool: show_agent
  → AgentService
  → MetadataRepository
  → Coder MCP: workspace_bash (execute "task ..." in agent workspace)
  → Parse results
  → Return in Agent response
```

For the HTTP endpoint mentioned in requirements:
```
External HTTP client
  → GET fleet-mcp-server/metadata?workspace=agent-name
  → MetadataRepository (same as above)
  → Return JSON
```

The HTTP endpoint is on the fleet-mcp server, not in agent workspaces.

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
async def collect_metadata(self, workspace_name: str) -> WorkspaceMetadata:
    """Collect metadata from workspace, returning partial results on errors."""
    # Phase 1: Get schema from Taskfile
    try:
        schema = await self._get_task_schema(workspace_name)
    except Exception as e:
        # Taskfile missing or invalid - return empty metadata
        logger.warning(f"Failed to get metadata schema for {workspace_name}: {e}")
        return WorkspaceMetadata(data={})

    # Phase 2: Execute tasks (with timeout per task)
    results = await self._execute_tasks(workspace_name, list(schema.keys()))

    # Phase 3: Combine schema + results
    metadata_fields = {}
    for task_name, task_desc in schema.items():
        value = results.get(task_name)  # None if task failed
        metadata_fields[task_name] = MetadataField(
            value=value,
            schema=MetadataSchema(
                description=task_desc,
                include_in_list=False  # Parsed from Taskfile meta
            )
        )

    return WorkspaceMetadata(data=metadata_fields)
```

**Error Logging**:
- Log warnings for individual task failures (don't raise)
- Log error if entire Taskfile is missing/invalid
- Include workspace_name in all log messages for debugging

---

### 7. Testing Strategy for External Commands
**Question**: How to test Taskfile execution and output parsing without real Taskfile binary?

**Options Considered**:
1. Mock subprocess calls with pytest fixtures
2. Use VCR.py to record/replay command outputs
3. Create test Taskfile fixtures with known outputs
4. Dependency injection for command executor

**Decision**: ✅ **Mock Coder MCP client calls with pytest fixtures**

**Rationale**:
- Fleet-mcp already uses mocking patterns extensively (see test_task_repository.py)
- No subprocess calls - we use Coder MCP `workspace_bash` tool
- Mock the MCP client's `call_tool` method to return test data
- Fast, deterministic, no external dependencies

**Implementation Pattern** (from existing tests):
```python
@pytest.fixture
def mock_mcp_client(mocker):
    """Mock Coder MCP client for metadata tests."""
    client = mocker.AsyncMock()
    client.call_tool = mocker.AsyncMock()
    return client

@pytest.mark.asyncio
async def test_collect_metadata_success(metadata_repository, mock_mcp_client):
    """Test successful metadata collection."""
    # Arrange: Mock Taskfile --list --json response
    mock_mcp_client.call_tool.side_effect = [
        # First call: task --list --json
        {"content": [{"type": "text", "text": json.dumps({
            "tasks": [
                {"name": "git_branch", "desc": "Current git branch"},
                {"name": "pr_number", "desc": "PR number"}
            ]
        })}]},
        # Second call: task --silent --parallel --output prefixed ...
        {"content": [{"type": "text", "text": "[git_branch] main\n[pr_number] 123"}]}
    ]

    # Act
    metadata = await metadata_repository.collect_metadata("test-agent")

    # Assert
    assert metadata.data["git_branch"].value == "main"
    assert metadata.data["pr_number"].value == "123"
    assert mock_mcp_client.call_tool.call_count == 2
```

**Test Categories**:
1. **Unit Tests**: Test parsing functions with known inputs
2. **Integration Tests**: Test MetadataRepository with mocked MCP client
3. **Contract Tests**: Validate HTTP endpoint responses match schema
4. **Error Tests**: Test timeout, missing Taskfile, task failures

**No VCR.py needed**: VCR.py is for HTTP recordings; we're mocking MCP tool calls directly.

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
