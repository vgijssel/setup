# Research: Fleet MCP Server

**Date**: 2025-10-29
**Feature**: Fleet MCP Server for Claude Code agent management

## Research Questions

1. How to structure FastMCP tools with flat Pydantic parameters?
2. What are the best practices for pytest-vcr with authentication?
3. How to map Coder workspace metadata to fleet_mcp fields?
4. What is the optimal stateless query pattern for agent status?
5. How to handle pagination in task history?
6. How to implement agent roles using Coder workspace presets?

---

## 1. FastMCP Tool Design with Flat Parameters

### Decision
Use Pydantic models with `Field()` metadata for all tool parameters, ensuring flat structure (scalars only, no nested objects). Each parameter must have a description for MCP introspection.

### Rationale
FastMCP documentation explicitly requires flat parameter structures for MCP protocol compatibility. Nested objects break MCP tool discovery and parameter validation. The `Field()` description metadata is exposed to AI agents via MCP introspection.

### Implementation Pattern

```python
from pydantic import BaseModel, Field

# ❌ WRONG - Nested objects not supported
class CreateAgentWrong(BaseModel):
    metadata: dict  # Nested structure

# ✅ CORRECT - Flat structure with Field metadata
class CreateAgentRequest(BaseModel):
    name: str = Field(description="Unique short agent name (e.g., Sony, Papi)")
    project: str = Field(description="Project name (e.g., Setup, DataOne)")
    role: str = Field(default="coder", description="Agent role: coder, operator, or manager")
    spec: str = Field(description="Agent specification defining objectives and constraints")
    pull_request_url: str | None = Field(default=None, description="Optional PR URL for spec tracking")

@mcp.tool()
def create_agent(request: CreateAgentRequest) -> dict:
    """Create a new Claude Code agent in a Coder workspace"""
    # Implementation
```

### Alternatives Considered
- **Nested Pydantic models**: Rejected - breaks MCP protocol compatibility
- **JSON string parameters**: Rejected - loses type safety and validation
- **Separate parameters (no BaseModel)**: Considered but BaseModel provides validation and documentation structure

### References
- https://gofastmcp.com/servers/tools#type-annotations
- https://gofastmcp.com/servers/tools#parameter-metadata

---

## 2. pytest-vcr Best Practices for API Testing

### Decision
Use pytest-vcr with cassette recording for live Coder API interactions. Store cassettes in `tests/cassettes/` with `.gitignore` for sensitive data. Use `record_mode='once'` to record first run, then replay.

### Rationale
pytest-vcr records actual HTTP interactions with Coder API, creating deterministic test fixtures without mocking. This approach validates real API contracts and response structures. Recording live interactions ensures tests reflect actual API behavior.

### Implementation Pattern

```python
import pytest
import vcr

# Configure VCR to filter sensitive headers
@pytest.fixture
def vcr_config():
    return {
        "filter_headers": ["authorization", "cookie"],
        "record_mode": "once",
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
    }

@pytest.mark.vcr
def test_create_agent(coder_client):
    """Test agent creation with recorded API interaction"""
    response = coder_client.create_agent(
        name="test-agent",
        project="Setup",
        role="coder",
        spec="Test specification"
    )
    assert response["name"] == "test-agent"
    assert response["status"] == "idle"
```

### Test Organization
- **Unit tests**: Test data models and utility functions (no VCR needed)
- **Integration tests**: Test Coder API client methods with VCR cassettes
- **Contract tests**: Test full MCP tool flows with VCR cassettes

### Sensitive Data Handling
1. Filter auth headers in VCR config
2. Scrub workspace IDs and user names from cassettes
3. Store cassettes in `tests/cassettes/` with `.gitignore` entry
4. Provide cassette generation script for local development

### Alternatives Considered
- **Full mocks**: Rejected - doesn't validate real API contracts
- **pytest-mock**: Rejected - user requirement explicitly states "no mocks"
- **Live tests only**: Rejected - slow CI, requires Coder instance

### References
- https://vcrpy.readthedocs.io/en/latest/
- pytest-vcr documentation

---

## 3. Coder Workspace Metadata Mapping

### Decision
Store all agent state in Coder workspace metadata using `fleet_mcp_*` prefix. Map metadata fields to agent properties on every query (stateless MCP server).

### Rationale
Coder workspaces support arbitrary metadata key-value pairs. By prefixing with `fleet_mcp_`, we namespace our fields and avoid conflicts with other metadata. Stateless design means MCP server queries Coder API for every request, ensuring fresh data.

### Metadata Schema

```python
# Required metadata fields (set on workspace creation)
fleet_mcp_agent_name: str           # Unique agent name
fleet_mcp_role: str                 # coder, operator, manager
fleet_mcp_project: str              # Project name
fleet_mcp_agent_spec: str           # Agent specification (can be large)
fleet_mcp_current_task: str | None  # Current task summary (or null if idle)

# Optional metadata fields (PR integration)
fleet_mcp_pull_request_url: str | None
fleet_mcp_pull_request_status: str | None      # open, closed, merged
fleet_mcp_pull_request_check_status: str | None # pending, passing, failing

# Derived from Coder workspace state (not stored in metadata)
status: str  # busy (if current_task set), idle (if null), offline (workspace stopped)
```

### Status Derivation Logic

```python
def derive_agent_status(workspace: CoderWorkspace) -> str:
    """Derive agent status from workspace state and metadata"""
    if workspace.latest_build.status != "running":
        return "offline"

    current_task = workspace.metadata.get("fleet_mcp_current_task")
    return "busy" if current_task else "idle"
```

### Alternatives Considered
- **Separate database**: Rejected - violates stateless requirement
- **Coder workspace tags**: Rejected - tags are for categorization, not structured data
- **Workspace name encoding**: Rejected - limited by name length, difficult to update

### API Calls Required
- **Create agent**: POST to workspaces API with metadata
- **Query agent**: GET workspace by ID, read metadata
- **Update status**: PATCH workspace metadata
- **List agents**: GET all workspaces, filter by `fleet_mcp_agent_name` presence

---

## 4. Stateless Query Pattern for Agent Status

### Decision
Query Coder API on every MCP tool invocation. Cache nothing in MCP server. Use efficient API calls (list workspaces with metadata projection when possible).

### Rationale
Stateless design eliminates synchronization issues and stale data. Coder API is the single source of truth. Performance is acceptable given typical fleet sizes (10-20 agents) and API response times (<500ms).

### Query Patterns

**List all agents:**
```python
# GET /api/v2/workspaces?include=metadata
workspaces = await coder_client.list_workspaces()
agents = [
    Agent.from_workspace(ws)
    for ws in workspaces
    if "fleet_mcp_agent_name" in ws.metadata
]
```

**Get agent details:**
```python
# GET /api/v2/workspaces/{id}
workspace = await coder_client.get_workspace(workspace_id)
agent = Agent.from_workspace(workspace)
```

**Query task history:**
```python
# GET /api/v2/users/{owner}/workspace/{workspace-name}
workspace = await coder_client.get_workspace(owner, workspace_name)
tasks = workspace.get("tasks", [])  # Tasks reported via coder_report_task MCP tool
return paginate(tasks, page, page_size=20)
```

### Performance Optimization
- Use workspace metadata projection to reduce payload size
- Implement client-side pagination (Coder API returns all tasks, we slice)
- Consider caching workspace list with short TTL (5-10s) if performance issues arise

### Alternatives Considered
- **In-memory cache**: Rejected - adds statefulness, sync complexity
- **Redis cache**: Rejected - violates stateless principle, adds dependency
- **Event-driven updates**: Rejected - requires webhook infrastructure

---

## 5. Task History Pagination

### Decision
Use client-side pagination with standard page/page_size parameters. Fetch all tasks from Coder API, slice in memory, return paginated response.

### Rationale
Coder tasks API returns all tasks for a workspace. Client-side pagination is simpler than server-side cursor management. For 100 tasks per agent, memory overhead is minimal (<1MB per agent).

### Pagination Model

```python
class TaskHistoryRequest(BaseModel):
    agent_name: str = Field(description="Agent name")
    page: int = Field(default=1, description="Page number (1-indexed)")
    page_size: int = Field(default=20, description="Items per page (max 100)")

class TaskHistoryResponse(BaseModel):
    tasks: list[Task]
    total_count: int
    page: int
    page_size: int
    total_pages: int
```

### Implementation

```python
def paginate_tasks(tasks: list[Task], page: int, page_size: int) -> TaskHistoryResponse:
    """Paginate task list"""
    page_size = min(page_size, 100)  # Cap at 100
    start = (page - 1) * page_size
    end = start + page_size

    return TaskHistoryResponse(
        tasks=tasks[start:end],
        total_count=len(tasks),
        page=page,
        page_size=page_size,
        total_pages=(len(tasks) + page_size - 1) // page_size
    )
```

### Edge Cases
- **Page beyond total**: Return empty tasks list, valid pagination metadata
- **Invalid page (< 1)**: Clamp to page 1
- **Invalid page_size**: Clamp to [1, 100]

### Alternatives Considered
- **Server-side cursor pagination**: Rejected - requires state management
- **Limit/offset only**: Rejected - less intuitive than page/page_size
- **GraphQL connection pattern**: Rejected - not applicable to REST API

---

## 6. Agent Roles via Coder Workspace Presets

### Decision
Use Coder workspace presets to define agent roles. Each preset configures environment variables and parameters that control the Claude Code system prompt and agent behavior.

### Rationale
Coder workspace presets are a built-in template feature that allows defining multiple configuration variants within a single template. Presets can set parameter values and environment variables that control workspace initialization. This eliminates the need for external role configuration files and leverages Coder's native capabilities.

### Implementation Pattern

**In Coder Template (Terraform)**:

```hcl
# Define role parameter with presets
resource "coder_parameter" "role" {
  name         = "role"
  display_name = "Agent Role"
  description  = "The role this agent will assume"
  type         = "string"
  default      = "coder"
  mutable      = false

  option {
    name  = "coder"
    value = "coder"
    icon  = "/icon/code.svg"
    description = "Software Engineer - Writes code, implements features, fixes bugs"
  }

  option {
    name  = "operator"
    value = "operator"
    icon  = "/icon/ops.svg"
    description = "Operations Engineer - Manages deployments, monitors systems"
  }

  option {
    name  = "manager"
    value = "manager"
    icon  = "/icon/manager.svg"
    description = "Engineering Manager - Coordinates work, reviews specs"
  }
}

# Use preset values to configure agent environment
resource "coder_agent" "main" {
  env = {
    CLAUDE_ROLE = data.coder_parameter.role.value
    CLAUDE_SYSTEM_PROMPT_OVERRIDE = lookup({
      "coder"    = "You are a software engineer..."
      "operator" = "You are an operations engineer..."
      "manager"  = "You are an engineering manager..."
    }, data.coder_parameter.role.value)
  }
}
```

**Workspace Presets** (optional, in template settings):

```json
{
  "presets": [
    {
      "name": "Coder Role",
      "description": "Standard software engineering agent",
      "parameters": {
        "role": "coder"
      }
    },
    {
      "name": "Operator Role",
      "description": "Operations and infrastructure agent",
      "parameters": {
        "role": "operator"
      }
    },
    {
      "name": "Manager Role",
      "description": "Coordination and review agent",
      "parameters": {
        "role": "manager"
      }
    }
  ]
}
```

### Fleet MCP Integration

When creating an agent via MCP:

```python
@mcp.tool()
async def create_agent(
    name: str,
    project: str,
    role: str = "coder",  # Maps to Coder parameter
    spec: str,
) -> dict:
    """Create agent with specified role"""

    # Create workspace with role parameter
    workspace = await coder_client.create_workspace(
        name=f"agent-{name}",
        template_name=f"{project.lower()}-devcontainer",
        parameters={
            "role": role  # Passed to Coder template parameter
        },
        metadata={
            "fleet_mcp_agent_name": name,
            "fleet_mcp_role": role,
            "fleet_mcp_project": project,
            "fleet_mcp_agent_spec": spec,
            "fleet_mcp_current_task": spec,  # Agent starts working immediately
        }
    )
```

### Querying Available Roles

Roles are discovered by querying the Coder template parameters:

```python
async def list_roles(project: str) -> list[Role]:
    """List available roles for a project"""

    # Get template for project
    template = await coder_client.get_template(f"{project.lower()}-devcontainer")

    # Find role parameter
    role_param = next(
        (p for p in template["parameters"] if p["name"] == "role"),
        None
    )

    if not role_param:
        # Return default role if parameter not defined
        return [Role(name="coder", display_name="Software Engineer", description="...")]

    # Convert parameter options to Role objects
    return [
        Role(
            name=option["value"],
            display_name=option["name"],
            description=option.get("description", "")
        )
        for option in role_param.get("options", [])
    ]
```

### Advantages

1. **Native Integration**: Uses Coder's built-in parameter system
2. **Template Flexibility**: Each project template can define its own roles
3. **UI Support**: Roles appear in Coder UI workspace creation form
4. **Immutable**: Role parameter can be marked `mutable = false` to prevent changes
5. **Type Safety**: Coder validates role values against defined options
6. **Environment Control**: Roles can set environment variables, resources, and configuration

### Alternatives Considered

- **Static configuration file**: Rejected - requires external file management, not template-specific
- **Metadata-only roles**: Rejected - doesn't leverage Coder's parameter system or UI
- **Separate templates per role**: Rejected - creates template sprawl, difficult to maintain

### References

- https://coder.com/docs/admin/templates/extending-templates/parameters
- https://coder.com/docs/admin/templates/extending-templates/parameters#workspace-presets

---

## Technology Stack Summary

| Component | Choice | Version | Justification |
|-----------|--------|---------|---------------|
| MCP Framework | FastMCP | Latest | Standard Python MCP implementation, active maintenance |
| Data Validation | Pydantic | 2.x | Type-safe validation, FastMCP integration, Field metadata |
| HTTP Client | httpx | Latest | Async support, modern API, widely used |
| Testing | pytest | Latest | Standard Python testing, excellent ecosystem |
| API Recording | pytest-vcr | Latest | Deterministic testing without mocks |
| Package Manager | uv | Latest | Fast, deterministic, modern Python tooling |

---

## Implementation Order

1. **Phase 1a**: Data models (Pydantic schemas for Agent, Task, Role, Project)
2. **Phase 1b**: Coder API client (httpx wrapper with workspace/tasks/metadata methods)
3. **Phase 1c**: MCP tools skeleton (empty implementations with type signatures)
4. **Phase 2a**: Unit tests for data models (validation, serialization)
5. **Phase 2b**: Integration tests for Coder client (with pytest-vcr cassettes)
6. **Phase 2c**: Contract tests for MCP tools (E2E with vcr)
7. **Phase 3**: Implementation (fill in tool logic)

TDD approach: Write tests before implementation for each phase.

---

## Open Questions

None - all research questions resolved through documentation review and technical decision-making.
