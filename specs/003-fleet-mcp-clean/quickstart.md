# Quickstart Guide: Fleet MCP Clean Architecture

**Branch**: `003-fleet-mcp` | **Date**: 2025-11-07

## Overview

This guide provides a step-by-step walkthrough for developers to understand, build, test, and use fleet-mcp. It covers the clean architecture implementation, testing strategy, and common workflows.

## Prerequisites

- Python 3.12+
- **uv 0.7.20+** (package manager - NOT pip)
- Access to a Coder instance with API token
- Coder templates configured with `ai_prompt` and `system_prompt` rich parameters
- Nx 21.4.1+ monorepo environment (already configured in this repository)

## Installation

### 1. Navigate to the Project

```bash
cd libs/fleet-mcp
```

### 2. Install Dependencies with uv

**IMPORTANT**: Use `uv`, NOT `pip`. This project uses uv for all package management.

```bash
# Install dependencies from pyproject.toml (creates .venv automatically)
uv sync

# Or install with dev dependencies
uv sync --all-extras
```

**What uv does**:
- Creates `.venv/` directory automatically
- Installs all dependencies from `pyproject.toml`
- Generates/updates `uv.lock` for reproducible builds
- 10-100x faster than pip

### 3. Verify Installation

```bash
# Check that uv created the virtual environment
ls .venv/

# Run a simple check using uv
uv run python -c "import fleet_mcp_clean; print('Installation successful!')"
```

### 4. Environment Configuration

**No configuration needed!** When running inside a Coder workspace agent, the following environment variables are automatically available:

- `CODER_URL` - Already set to your Coder instance URL
- `CODER_SESSION_TOKEN` - Already set with a valid session token

Live Coder API access is available out of the box.

## Architecture Overview

fleet-mcp uses a 5-layer clean architecture:

```
Tool (MCP Entry) → Service (Business Logic) → Repository (Data Access) → Client (HTTP) → Coder API
```

### Layer Responsibilities

- **Tool Layer** (`fleet_mcp_clean/tools/`): FastMCP tool definitions, input validation
- **Service Layer** (`fleet_mcp_clean/services/`): Business logic, orchestration, rule enforcement
- **Repository Layer** (`fleet_mcp_clean/repositories/`): Data access patterns, entity transformation
- **Client Layer** (`fleet_mcp_clean/clients/`): HTTP communication with Coder API
- **Models** (`fleet_mcp_clean/models/`): Pydantic models shared across layers

### Dependency Flow

Each layer only depends on the layer directly below it:
- Tools instantiate Services
- Services instantiate Repositories
- Repositories instantiate Clients
- No circular dependencies

## Development Workflow

### 1. Understanding the Code Structure

```
libs/fleet-mcp/
├── fleet_mcp_clean/
│   ├── tools/              # 11 MCP tools (list, show, create, delete, etc.)
│   ├── services/           # Business logic (AgentService, TaskService, ProjectService)
│   ├── repositories/       # Data access (AgentRepository, TaskRepository, TemplateRepository)
│   ├── clients/            # API client (CoderClient)
│   ├── models/             # Pydantic models (Agent, Task, Project, Role, etc.)
│   └── server.py           # FastMCP server entry point
└── tests/
    ├── cassettes/          # VCR recordings (one-time)
    ├── fixtures/           # Mock factories from cassettes
    ├── tools/              # Tool layer tests
    ├── services/           # Service layer tests
    ├── repositories/       # Repository layer tests
    ├── clients/            # Client layer tests
    └── record.py           # Cassette recording script
```

### 2. Test-Driven Development (TDD)

fleet-mcp follows strict TDD:

#### Step 1: Record VCR Cassettes (One-Time)

```bash
# Environment variables are already set in agent workspace
# CODER_URL and CODER_SESSION_TOKEN are automatically available

# Run the recording script (uses live Coder API)
uv run python tests/record.py
```

**Note**: Always use `uv run` to execute Python scripts in this project.

This creates cassettes in `tests/cassettes/`:
- `create_workspace_success.yaml`
- `get_workspace_success.yaml`
- `list_workspaces_success.yaml`
- ... (one cassette per API interaction)

#### Step 2: Write Tests (Using Mocks from Cassettes)

Tests use reusable pytest fixtures with `respx` to mock HTTPX, with data from VCR cassettes.

**First, create reusable fixtures** (tests/fixtures.py):

```python
# tests/fixtures.py
import pytest
from httpx import Response
import respx

@pytest.fixture
def mock_create_workspace_success(respx_mock, coder_base_url, cassette_dir):
    """Mock for create_workspace call

    Loads cassette data and configures respx to mock the Coder API
    workspace creation endpoint.
    """
    with respx.mock(base_url=coder_base_url, assert_all_called=True) as respx_mock:
        # Load the response body of the VCR cassette
        response = load_cassette("create_workspace_success")

        # Mock create workspace endpoint
        # POST /api/v2/organizations/{id}/members/me/workspaces
        route = respx_mock.post(
            path__regex=r"^/api/v2/organizations/[a-f0-9-]+/members/me/workspaces$"
        )
        route.mock(return_value=Response(201, json=response))

        yield response
```

**Then, use the fixture in tests** (tests/clients/test_coder_client.py):

```python
# tests/clients/test_coder_client.py
import pytest
from fleet_mcp_clean.clients import CoderClient

async def test_create_workspace(coder_client, mock_create_workspace_success):
    """Test workspace creation via Coder API

    The mock_create_workspace_success fixture:
    - Loads cassette data for workspace creation flow
    - Configures respx to mock the necessary API endpoints
    - Returns the expected workspace data
    """

    workspace = await coder_client.create_workspace(
        name="agent-fleet-mcp-test-create-workspace-success",
        template_id="...",
        template_version_preset_id="9ce86483-72f5-4647-9a92-2c53fb940fa9",
        ai_prompt="test prompt",
    )

    assert workspace is not None
    assert "id" in workspace
    assert workspace.get("name") == "agent-fleet-mcp-test-create-workspace-success"

    # Assert correct template_name is set
    assert workspace.get("template_name") == "coder-devcontainer"

    # Assert correct template_version_preset_id is set in latest_build
    latest_build = workspace.get("latest_build")
    assert latest_build is not None, "latest_build should be present in workspace"
    assert (
        latest_build.get("template_version_preset_id")
        == "9ce86483-72f5-4647-9a92-2c53fb940fa9"
    )
```

**Benefits of this approach**:
- Fixtures are reusable across multiple tests
- Tests are more concise and focused on behavior
- DRY principle: mock setup is defined once
- Clear separation between test setup (fixture) and test logic

#### Step 3: Implement Code

Implement the layer being tested, ensuring tests pass:

```python
# fleet_mcp_clean/clients/coder_client.py
import httpx
from typing import Any

class CoderClient:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.token = token
        self.client = httpx.AsyncClient(
            headers={"Coder-Session-Token": token}
        )

    async def create_workspace(
        self,
        name: str,
        template_id: str,
        template_version_preset_id: str,
        ai_prompt: str
    ) -> dict[str, Any]:
        """Create a workspace via Coder API"""
        org_id = await self._get_org_id()

        response = await self.client.post(
            f"{self.base_url}/api/v2/organizations/{org_id}/members/me/workspaces",
            json={
                "name": name,
                "template_id": template_id,
                "rich_parameter_values": {
                    "ai_prompt": ai_prompt
                },
                "template_version_preset_id": template_version_preset_id
            }
        )
        response.raise_for_status()
        return response.json()
```

#### Step 4: Run Tests

**Using uv** (preferred):
```bash
# Run all tests
uv run pytest -v

# Run specific layer tests
uv run pytest tests/clients/ -v
uv run pytest tests/repositories/ -v
uv run pytest tests/services/ -v
uv run pytest tests/tools/ -v

# Run with coverage
uv run pytest --cov=fleet_mcp_clean --cov-report=term-missing
```

**Using Nx** (monorepo integration):
```bash
# Run tests via Nx (with caching)
nx test fleet-mcp

# Run affected tests only
nx affected:test

# View test configuration
nx show project fleet-mcp
```

**Benefits of Nx**:
- Caches test results (faster subsequent runs)
- Only runs tests for affected projects
- Parallel execution across monorepo
- Integrated with CI/CD

### 3. Adding a New Feature

Follow this TDD workflow:

1. **Update VCR recording script** (`tests/record.py`) with new API interactions
2. **Re-record cassettes** if new API endpoints are needed
3. **Write failing tests** for the new feature (Client → Repository → Service → Tool)
4. **Implement Client layer** with HTTPX calls
5. **Implement Repository layer** with entity transformation
6. **Implement Service layer** with business logic
7. **Implement Tool layer** with FastMCP decorator
8. **Verify all tests pass**

## Running the MCP Server

### Local Development

**Using uv**:
```bash
# Start the server with hot reload
uv run --all-extras uvicorn fleet_mcp_clean.__main__:app --host 127.0.0.1 --port 8001 --reload
```

**Using Nx** (preferred):
```bash
# Start the server via Nx target
nx server fleet-mcp

# This runs: uv run --all-extras uvicorn fleet_mcp_clean.__main__:app --host 127.0.0.1 --port 8001 --reload --timeout-graceful-shutdown 3
```

**Note**: Port 8001 is used to avoid conflict with the original fleet-mcp (port 8000).

### Production Deployment

The server is deployed via Coder workspace configuration (declarative):

```yaml
# In Coder template
resource "coder_script" "fleet_mcp" {
  agent_id = coder_agent.main.id
  display_name = "Fleet MCP Server"
  script = <<-EOT
    cd /workspace/libs/fleet-mcp
    python -m fleet_mcp_clean.server
  EOT
  run_on_start = true
}
```

## Common Workflows

### Workflow 1: List All Agents

```python
# Using MCP client (from another Claude Code instance)
from mcp import Client

client = Client("fleet-mcp")
result = await client.call_tool("list_agents", {})

print(result["agents"])
# [{"name": "agent-1", "status": "idle", ...}, ...]
```

### Workflow 2: Create a New Agent

```python
result = await client.call_tool("create_agent", {
    "name": "data-scientist",
    "project": "Setup",
    "role": "coder",
    "task": "Analyze sales data from Q4"
})

print(result["agent"]["workspace_id"])
# "workspace-uuid-here"
```

### Workflow 3: Send Task to Agent

```python
# First, verify agent is idle
agent = await client.call_tool("show_agent", {
    "agent_name": "data-scientist"
})

if agent["agent"]["status"] == "idle":
    result = await client.call_tool("start_agent_task", {
        "agent_name": "data-scientist",
        "task_description": "Generate sales report for Q4"
    })
    print(result["message"])
    # "Task assigned to agent 'data-scientist'"
```

### Workflow 4: Cancel Running Task

```python
result = await client.call_tool("cancel_agent_task", {
    "agent_name": "data-scientist"
})

print(result["interrupt_sent"])
# True
```

### Workflow 5: View Task History

```python
result = await client.call_tool("show_agent_task_history", {
    "agent_name": "data-scientist",
    "page": 1,
    "page_size": 10
})

for task in result["tasks"]:
    print(f"{task['created_at']}: {task['message']}")
```

### Workflow 6: Delete Agent

```python
result = await client.call_tool("delete_agent", {
    "agent_name": "data-scientist"
})

print(result["message"])
# "Agent 'data-scientist' deleted successfully"
```

## Testing Strategy Deep Dive

### Why Not VCR Directly in Tests?

Traditional VCR usage:
```python
# ❌ Traditional approach (NOT used in fleet-mcp)
@pytest.mark.vcr
def test_create_workspace():
    client = CoderClient(...)
    workspace = client.create_workspace(...)  # Uses VCR cassette
```

fleet-mcp approach:
```python
# ✅ fleet-mcp approach
def test_create_workspace(respx_mock):
    # Explicit mock setup from cassette data
    cassette_data = load_cassette("create_workspace_success")
    respx_mock.post(...).mock(return_value=Response(201, json=cassette_data))

    # Test with explicit mock
    client = CoderClient(...)
    workspace = client.create_workspace(...)
```

**Benefits**:
- **AI Comprehension**: Mocks are explicit and visible in test code
- **Test Independence**: No hidden VCR magic
- **Fast Tests**: No VCR overhead
- **Clear Assertions**: Easy to see what data is expected

### Fixture Organization

```python
# tests/fixtures/__init__.py
def load_cassette(name: str) -> dict:
    """Load VCR cassette data as dict"""
    import yaml
    with open(f"tests/cassettes/{name}.yaml") as f:
        cassette = yaml.safe_load(f)
        # Extract response body from VCR format
        return cassette["interactions"][0]["response"]["body"]["string"]

# tests/fixtures/agent_fixtures.py
@pytest.fixture
def mock_agent_data():
    """Provide realistic agent data based on cassettes"""
    return {
        "name": "test-agent",
        "workspace_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "status": "idle",
        "role": "coder",
        "project": "Setup"
    }
```

## Debugging Tips

### 1. Enable Debug Logging

```python
import logging

logging.basicConfig(level=logging.DEBUG)
```

### 2. Inspect HTTP Requests

```python
# In client layer
async def create_workspace(self, ...):
    print(f"POST {self.base_url}/api/v2/workspaces")
    print(f"Body: {json.dumps(body, indent=2)}")
    response = await self.client.post(...)
    print(f"Response: {response.status_code} {response.json()}")
```

### 3. Test Individual Layers

```bash
# Test only the client layer
pytest tests/clients/test_coder_client.py -v

# Test only the service layer
pytest tests/services/test_agent_service.py -v
```

### 4. Update Cassettes

If Coder API changes, re-record cassettes:

```bash
# Delete old cassettes
rm -rf tests/cassettes/*

# Re-record
python tests/record.py
```

## Common Issues and Solutions

### Issue 1: Import Errors

**Problem**: `ModuleNotFoundError: No module named 'fleet_mcp_clean'`

**Solution**: Install package in editable mode:
```bash
pip install -e .
```

### Issue 2: Test Failures After API Changes

**Problem**: Tests fail with "unexpected response format"

**Solution**: Re-record VCR cassettes:
```bash
python tests/record.py
```

### Issue 3: Agent Creation Timeout

**Problem**: Agent creation takes longer than expected

**Solution**: Check Coder workspace capacity and template configuration

### Issue 4: Mock Not Matching Request

**Problem**: respx mock not intercepting HTTP request

**Solution**: Check URL pattern in mock:
```python
# Use regex for dynamic parts (like UUIDs)
respx_mock.post(
    url__regex=f"^{base_url}/api/v2/organizations/[^/]+/members/me/workspaces$"
)
```

## Performance Considerations

### Client Layer Optimizations

- **Connection Pooling**: HTTPX automatically pools connections
- **Timeout Configuration**: Set appropriate timeouts for long-running operations
- **Retry Logic**: Implement exponential backoff for transient failures

```python
class CoderClient:
    def __init__(self, base_url: str, token: str):
        self.client = httpx.AsyncClient(
            headers={"Coder-Session-Token": token},
            timeout=30.0,  # 30 second timeout
            limits=httpx.Limits(max_connections=10)
        )
```

### Repository Layer Caching

Consider caching template/preset data (changes infrequently):

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_template_by_name(self, name: str) -> Template:
    """Cache template lookups"""
    return self.client.get_template(name)
```

## Next Steps

1. **Read the Data Model**: Review `data-model.md` for entity definitions
2. **Explore API Contracts**: See `contracts/mcp-tools.md` for tool specifications
3. **Review Research**: Check `research.md` for technology decisions
4. **Start Implementing**: Follow TDD workflow to build features
5. **Run Tests**: Ensure all layers pass independently

## Additional Resources

- **FastMCP Documentation**: https://github.com/jlowin/fastmcp
- **Pydantic Documentation**: https://docs.pydantic.dev/latest/
- **HTTPX Documentation**: https://www.python-httpx.org/
- **pytest Documentation**: https://docs.pytest.org/
- **respx Documentation**: https://lundberg.github.io/respx/

## Getting Help

- **Check Tests**: Look at existing tests for examples
- **Review Cassettes**: Inspect `tests/cassettes/` for actual API responses
- **Consult Data Model**: See `data-model.md` for entity validation rules
- **Read Contracts**: Check `contracts/mcp-tools.md` for tool specifications

## Summary

fleet-mcp provides a clean, testable architecture for managing Claude Code agent fleets:

- **5-layer architecture**: Clear separation of concerns
- **TDD approach**: VCR cassettes → respx mocks → layer-specific tests
- **AI-compatible**: Explicit, readable code with clear contracts
- **Stateless design**: All state in Coder, no local database
- **Fast tests**: No live API calls, all tests use mocks

Happy coding! 🚀
