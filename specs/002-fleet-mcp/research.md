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
Use `Annotated` with `Field()` metadata directly in function parameters for all tool parameters, ensuring flat structure (scalars only, no nested objects). Each parameter must have a description for MCP introspection. Return Pydantic models from tools instead of dicts for type safety and validation.

### Rationale
FastMCP documentation explicitly requires flat parameter structures for MCP protocol compatibility. Nested objects break MCP tool discovery and parameter validation. Using `Annotated[type, Field(description="...")]` directly in function signatures makes parameters immediately visible to MCP introspection without requiring separate request classes. Returning Pydantic models ensures type-safe responses and enables validation at the output boundary.

### Implementation Pattern

```python
from typing import Annotated, Literal
from pydantic import BaseModel, Field

# ❌ WRONG - Nested objects not supported
@mcp.tool()
def create_agent_wrong(
    metadata: dict  # Nested structure breaks MCP
) -> dict:
    """Don't do this"""
    pass

# ❌ WRONG - Request class adds unnecessary indirection
class CreateAgentRequest(BaseModel):
    name: str = Field(description="Agent name")

@mcp.tool()
def create_agent_old(request: CreateAgentRequest) -> dict:
    """Parameters hidden from MCP introspection"""
    pass

# ✅ CORRECT - Flat parameters with Annotated + Field, Pydantic response
class CreateAgentResponse(BaseModel):
    name: str
    workspace_id: str
    status: str
    role: str
    project: str
    message: str

@mcp.tool()
def create_agent(
    name: Annotated[str, Field(description="Unique short agent name (e.g., Sony, Papi)")],
    project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
    spec: Annotated[str, Field(description="Agent specification defining objectives and constraints")],
    role: Annotated[
        Literal["coder", "operator", "manager"],
        Field(description="Agent role: coder, operator, or manager")
    ] = "coder",
) -> CreateAgentResponse:
    """Create a new Claude Code agent in a Coder workspace"""
    # Implementation
    agent = coder_client.create_agent(name, project, role, spec)
    return CreateAgentResponse(
        name=agent.name,
        workspace_id=agent.workspace_id,
        status=agent.status,
        role=agent.role,
        project=agent.project,
        message=f"Agent '{name}' created successfully"
    )
```

### Alternatives Considered
- **Nested Pydantic models**: Rejected - breaks MCP protocol compatibility
- **JSON string parameters**: Rejected - loses type safety and validation
- **Request/Response BaseModel classes**: Rejected for requests - adds indirection and hides parameters from MCP. Response models still used for type-safe returns.
- **Dict returns**: Rejected - loses type safety and validation at output boundary

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

**Workspace Presets in Coder Template (Terraform)**:

```hcl
provider "coder" {}

# Define workspace presets for different agent roles
# Each preset configures the agent with a specific role

data "coder_workspace_preset" "coder" {
  name        = "coder"
  description = "Software Engineer - Writes code, implements features, fixes bugs"
  icon        = "/icon/code.svg"
  default     = true  # Default role for new agents
  parameters = {
    (data.coder_parameter.agent_role.name) = "coder"
  }
}

data "coder_workspace_preset" "operator" {
  name        = "operator"
  description = "Operations Engineer - Manages deployments, monitors systems"
  icon        = "/icon/ops.svg"
  parameters = {
    (data.coder_parameter.agent_role.name) = "operator"
  }
}

data "coder_workspace_preset" "manager" {
  name        = "manager"
  description = "Engineering Manager - Coordinates work, reviews specs"
  icon        = "/icon/manager.svg"
  parameters = {
    (data.coder_parameter.agent_role.name) = "manager"
  }
}

# Define the parameter that presets will configure
data "coder_parameter" "agent_role" {
  name         = "agent_role"
  display_name = "Agent Role"
  description  = "The role this agent will assume"
  type         = "string"
  default      = "coder"
  mutable      = false  # Role cannot change after workspace creation
}

# Use the parameter value in agent configuration
resource "coder_agent" "main" {
  env = {
    AGENT_ROLE = data.coder_parameter.agent_role.value
    # Role-specific configuration can be set based on the value
  }
}
```

### Fleet MCP Integration

When creating an agent via MCP:

```python
@mcp.tool()
async def create_agent(
    name: str,
    project: str,
    role: str = "coder",  # Maps to Coder workspace preset name
    spec: str,
) -> dict:
    """Create agent with specified role"""

    # Create workspace with workspace preset
    workspace = await coder_client.create_workspace(
        name=f"agent-{name}",
        template_name=f"{project.lower()}-devcontainer",
        workspace_preset=role,  # Workspace preset name (e.g., "coder", "operator", "manager")
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

Roles are discovered by querying the Coder template workspace presets:

```python
async def list_roles(project: str) -> list[Role]:
    """List available roles for a project"""

    # Get template for project
    template = await coder_client.get_template(f"{project.lower()}-devcontainer")

    # Get workspace presets from template
    presets = template.get("workspace_presets", [])

    if not presets:
        # Return default role if no presets defined
        return [Role(name="coder", display_name="Software Engineer", description="...")]

    # Convert workspace presets to Role objects
    return [
        Role(
            name=preset["name"],
            display_name=preset.get("display_name", preset["name"]),
            description=preset.get("description", ""),
            template_id=template["id"]
        )
        for preset in presets
    ]
```

### Advantages

1. **Native Integration**: Uses Coder's built-in workspace preset system
2. **Template Flexibility**: Each project template can define its own role presets
3. **UI Support**: Workspace presets appear in Coder UI workspace creation form with icons and descriptions
4. **Immutable**: Role parameters configured by presets can be marked `mutable = false` to prevent changes
5. **Type Safety**: Coder validates workspace preset names against defined presets
6. **Environment Control**: Workspace presets can set parameters, environment variables, resources, and configuration

### Alternatives Considered

- **Static configuration file**: Rejected - requires external file management, not template-specific
- **Metadata-only roles**: Rejected - doesn't leverage Coder's workspace preset system or UI
- **Separate templates per role**: Rejected - creates template sprawl, difficult to maintain
- **Template parameters only**: Rejected - workspace presets provide better UX with icons, descriptions, and preset management

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
