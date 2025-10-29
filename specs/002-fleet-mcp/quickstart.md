# Quickstart: Fleet MCP Server

**Date**: 2025-10-29
**Feature**: Fleet MCP Server

## Overview

This quickstart guide walks through the implementation steps for the Fleet MCP Server library. Follow these steps in order using Test-Driven Development (TDD).

---

## Prerequisites

- Python 3.12 installed via Hermit
- uv package manager
- Access to a Coder instance with API credentials
- Nx CLI for monorepo operations

---

## Step 1: Project Setup

### 1.1 Create Library Structure

```bash
# From repo root
mkdir -p libs/fleet-mcp/src/fleet_mcp/{models,coder,tools}
mkdir -p libs/fleet-mcp/tests/{unit,integration,contract,cassettes}
touch libs/fleet-mcp/src/fleet_mcp/__init__.py
touch libs/fleet-mcp/src/fleet_mcp/models/__init__.py
touch libs/fleet-mcp/src/fleet_mcp/coder/__init__.py
touch libs/fleet-mcp/src/fleet_mcp/tools/__init__.py
```

### 1.2 Initialize Python Project with uv

```bash
cd libs/fleet-mcp
uv init
```

Edit `pyproject.toml`:

```toml
[project]
name = "fleet-mcp"
version = "0.1.0"
description = "MCP server for managing Claude Code agent fleet in Coder"
requires-python = ">=3.12"
dependencies = [
    "fastmcp==0.1.0",      # Pin exact version
    "pydantic==2.5.0",     # Pin exact version
    "httpx==0.25.2",       # Pin exact version
]

[project.optional-dependencies]
dev = [
    "pytest==7.4.3",       # Pin exact version
    "pytest-vcr==1.0.2",   # Pin exact version
    "pytest-asyncio==0.21.1",
    "ruff==0.1.8",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

Install dependencies:

```bash
uv sync
```

### 1.3 Configure Secrets Management

Create `.env.tpl` template file:

```bash
cat > .env.tpl << 'EOF'
CODER_URL=https://macbook-pro-van-maarten.tail2c33e2.ts.net
CODER_TOKEN={{ op://setup-devenv/coder-speckit/credential }}
EOF
```

Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

Update `package.json` to include the secrets target in the nx configuration:

```json
{
  "name": "@setup/fleet-mcp",
  "version": "0.1.0",
  "description": "Fleet MCP Server for Claude Code agents",
  "nx": {
    "projectType": "library",
    "sourceRoot": "libs/fleet-mcp/src",
    "targets": {
      "secrets": {
        "executor": "nx:run-commands",
        "options": {
          "command": "op inject --force -i .env.tpl -o .env",
          "cwd": "libs/fleet-mcp"
        },
        "cache": true,
        "outputs": [
          "{projectRoot}/.env"
        ],
        "inputs": [
          "{projectRoot}/.env.tpl"
        ],
        "metadata": {
          "description": "Generate .env file from 1Password secrets"
        }
      },
      "test": {
        "executor": "nx:run-commands",
        "dependsOn": ["secrets"],
        "options": {
          "command": "uv run --all-extras pytest -v",
          "cwd": "libs/fleet-mcp"
        },
        "cache": true,
        "inputs": [
          "{projectRoot}/**/*.*",
          "!{projectRoot}/.pytest_cache/**",
          "!{projectRoot}/.venv/**",
          "!{projectRoot}/.env"
        ],
        "metadata": {
          "description": "Run pytest tests"
        }
      }
    }
  },
  "scripts": {
    "test": "nx test fleet-mcp",
    "lint": "nx lint fleet-mcp",
    "build": "nx build fleet-mcp"
  }
}
```

Generate the `.env` file:

```bash
nx run fleet-mcp:secrets
```

This will use 1Password CLI (`op inject`) to replace the `{{ op://... }}` references with actual secret values.

**Note**: Ensure you have 1Password CLI installed and authenticated (`op signin`) before running the secrets target.

### 1.4 Create Nx Integration

Create `package.json`:

```json
{
  "name": "@setup/fleet-mcp",
  "version": "0.1.0",
  "description": "Fleet MCP Server for Claude Code agents",
  "scripts": {
    "test": "nx test fleet-mcp",
    "lint": "nx lint fleet-mcp",
    "build": "nx build fleet-mcp"
  }
}
```

Create `project.json`:

```json
{
  "name": "fleet-mcp",
  "sourceRoot": "libs/fleet-mcp/src",
  "projectType": "library",
  "targets": {
    "test": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "cd libs/fleet-mcp && uv run pytest"
      }
    },
    "lint": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "cd libs/fleet-mcp && uv run ruff check ."
      }
    },
    "build": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "cd libs/fleet-mcp && uv build"
      }
    }
  }
}
```

**Note**: The section 1.3 above shows the complete package.json with both secrets and test targets. The separate package.json in section 1.4 below is the minimal version without the nx configuration block.

### 1.5 Configure pytest-vcr

Create `tests/conftest.py`:

```python
import pytest
import vcr

@pytest.fixture(scope="module")
def vcr_config():
    """Configure VCR for all tests"""
    return {
        "filter_headers": ["authorization", "cookie", "x-coder-session-token"],
        "record_mode": "once",
        "match_on": ["method", "scheme", "host", "port", "path", "query"],
        "cassette_library_dir": "tests/cassettes",
    }

@pytest.fixture
def coder_base_url():
    """Coder API base URL"""
    return "https://coder.example.com"

@pytest.fixture
def coder_token():
    """Coder API token (mocked in tests)"""
    return "test-token-placeholder"
```

Add to `.gitignore`:

```
libs/fleet-mcp/tests/cassettes/*.yaml
```

---

## Step 2: TDD Cycle - Data Models

### 2.1 Write Model Tests (RED)

Create `tests/unit/test_models.py`:

```python
import pytest
from datetime import datetime
from fleet_mcp.models.agent import Agent, AgentStatus

def test_agent_model_valid():
    """Test valid agent model creation"""
    agent = Agent(
        name="papi",
        workspace_id="workspace-123",
        status=AgentStatus.IDLE,
        role="coder",
        project="Setup",
        spec="Test spec",
        current_task=None,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    assert agent.name == "papi"
    assert agent.status == AgentStatus.IDLE

def test_agent_name_validation():
    """Test agent name validation rules"""
    with pytest.raises(ValueError):
        Agent(
            name="",  # Empty name invalid
            workspace_id="ws-123",
            status=AgentStatus.IDLE,
            role="coder",
            project="Setup",
            spec="Test",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
```

Run tests (should FAIL):

```bash
nx test fleet-mcp
```

### 2.2 Implement Models (GREEN)

Create `src/fleet_mcp/models/agent.py`:

```python
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field, field_validator

class AgentStatus(str, Enum):
    # Workspace lifecycle states
    PENDING = "pending"
    STARTING = "starting"

    # Active states (workspace running)
    BUSY = "busy"
    IDLE = "idle"

    # Shutdown states
    STOPPING = "stopping"
    STOPPED = "stopped"

    # Error states
    FAILED = "failed"

    # Cancellation states
    CANCELING = "canceling"
    CANCELED = "canceled"

    # Deletion states
    DELETING = "deleting"
    DELETED = "deleted"

class Agent(BaseModel):
    name: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9-]+$")
    workspace_id: str
    status: AgentStatus
    role: str  # Dynamic - validated against Coder workspace presets
    project: str
    spec: str = Field(min_length=1)
    current_task: str | None = None
    created_at: datetime
    updated_at: datetime
    metadata: dict[str, str]  # Nested metadata with all fleet_mcp_* fields
```

Run tests (should PASS):

```bash
nx test fleet-mcp
```

### 2.3 Repeat for Other Models

Follow same TDD cycle for:
- `models/task.py` (Task)
- `models/role.py` (Role - sourced from Coder workspace presets)
- `models/project.py` (Project - maps to Coder templates)
- `models/responses.py` (Response models: CreateAgentResponse, AgentListResponse, TaskHistoryResponse, etc.)

**Note**: Request models are NOT separate classes. MCP tool parameters use `Annotated[type, Field(description="...")]` directly in function signatures for MCP introspection.

---

## Step 3: TDD Cycle - Coder API Client

### 3.1 Write Client Tests (RED)

Create `tests/integration/test_coder_client.py`:

```python
import pytest
from fleet_mcp.coder.client import CoderClient

@pytest.mark.vcr
async def test_create_workspace(coder_base_url, coder_token):
    """Test workspace creation"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)

    workspace = await client.create_workspace(
        name="test-agent",
        template_name="setup-devcontainer",
        metadata={
            "fleet_mcp_agent_name": "test-agent",
            "fleet_mcp_role": "coder",
            "fleet_mcp_project": "Setup",
            "fleet_mcp_agent_spec": "Test spec"
        }
    )

    assert workspace["name"] == "test-agent"
    assert workspace["metadata"]["fleet_mcp_agent_name"] == "test-agent"

@pytest.mark.vcr
async def test_list_workspaces(coder_base_url, coder_token):
    """Test listing workspaces"""
    client = CoderClient(base_url=coder_base_url, token=coder_token)
    workspaces = await client.list_workspaces()

    assert isinstance(workspaces, list)
    # Filter for fleet workspaces
    fleet_workspaces = [
        ws for ws in workspaces
        if "fleet_mcp_agent_name" in ws.get("metadata", {})
    ]
    assert len(fleet_workspaces) >= 0
```

Run tests (should FAIL):

```bash
nx test fleet-mcp
```

### 3.2 Implement Coder Client (GREEN)

Create `src/fleet_mcp/coder/client.py`:

```python
import httpx
from typing import Any

class CoderClient:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url.rstrip("/")
        self.token = token
        self.client = httpx.AsyncClient(
            headers={"Coder-Session-Token": token}
        )

    async def create_workspace(
        self, name: str, template_name: str, metadata: dict[str, str]
    ) -> dict[str, Any]:
        """Create workspace with metadata"""
        # Implementation using formal Coder API
        response = await self.client.post(
            f"{self.base_url}/api/v2/workspaces",
            json={
                "name": name,
                "template_name": template_name,
                "metadata": metadata
            }
        )
        response.raise_for_status()
        return response.json()

    async def list_workspaces(self) -> list[dict[str, Any]]:
        """List all workspaces"""
        response = await self.client.get(
            f"{self.base_url}/api/v2/workspaces"
        )
        response.raise_for_status()
        return response.json()
```

Run tests with VCR recording:

```bash
# First run records cassettes
CODER_URL=https://your-coder.com CODER_TOKEN=your-token nx test fleet-mcp

# Subsequent runs replay cassettes
nx test fleet-mcp
```

### 3.3 Repeat for Other API Modules

Follow same TDD cycle for:
- `coder/workspaces.py` (workspace CRUD operations)
- `coder/tasks.py` (AI tasks beta API operations)
- `coder/metadata.py` (metadata read/write helpers)

---

## Step 4: TDD Cycle - MCP Tools

### 4.1 Write Tool Tests (RED)

Create `tests/contract/test_mcp_tools.py`:

```python
import pytest
from fleet_mcp.server import create_mcp_server

@pytest.mark.vcr
async def test_create_agent_tool(coder_base_url, coder_token):
    """Test create_agent MCP tool"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    result = await mcp.call_tool("create_agent", {
        "name": "test-papi",
        "project": "Setup",
        "role": "coder",
        "spec": "Test specification for unit testing"
    })

    assert result["agent"]["name"] == "test-papi"
    assert result["agent"]["status"] == "busy"  # Agent starts working immediately
    assert result["agent"]["role"] == "coder"
    assert result["agent"]["current_task"] == "Test specification for unit testing"

@pytest.mark.vcr
async def test_list_agents_tool(coder_base_url, coder_token):
    """Test list_agents MCP tool"""
    mcp = create_mcp_server(base_url=coder_base_url, token=coder_token)

    result = await mcp.call_tool("list_agents", {})

    assert "agents" in result
    assert "total_count" in result
    assert isinstance(result["agents"], list)
```

Run tests (should FAIL):

```bash
nx test fleet-mcp
```

### 4.2 Implement MCP Tools (GREEN)

Create `src/fleet_mcp/server.py`:

```python
from fastmcp import FastMCP
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.tools.agent_management import register_agent_tools
from fleet_mcp.tools.task_management import register_task_tools
from fleet_mcp.tools.discovery import register_discovery_tools

def create_mcp_server(base_url: str, token: str) -> FastMCP:
    """Create and configure MCP server"""
    mcp = FastMCP("Fleet MCP")
    coder_client = CoderClient(base_url, token)

    # Register all tool groups
    register_agent_tools(mcp, coder_client)
    register_task_tools(mcp, coder_client)
    register_discovery_tools(mcp, coder_client)

    return mcp
```

Create `src/fleet_mcp/tools/agent_management.py`:

```python
from typing import Annotated, Literal
from fastmcp import FastMCP
from pydantic import Field
from fleet_mcp.coder.client import CoderClient
from fleet_mcp.models.agent import Agent
from fleet_mcp.models.responses import CreateAgentResponse, AgentListResponse, AgentSummary

def register_agent_tools(mcp: FastMCP, coder_client: CoderClient):
    """Register agent management tools"""

    @mcp.tool()
    async def create_agent(
        name: Annotated[str, Field(description="Unique short agent name (e.g., Sony, Papi)")],
        project: Annotated[str, Field(description="Project name (e.g., Setup, DataOne)")],
        spec: Annotated[str, Field(description="Agent specification defining objectives and constraints")],
        role: Annotated[str, Field(description="Agent role matching Coder workspace preset (e.g., coder, operator, manager)")] = "coder",
    ) -> CreateAgentResponse:
        """Create a new Claude Code agent in a Coder workspace"""
        # Create workspace via Coder API
        workspace = await coder_client.create_workspace(
            name=f"agent-{name}",
            template_name=f"{project.lower()}-devcontainer",
            workspace_preset=role,  # Use workspace preset for role
            metadata={
                "fleet_mcp_agent_name": name,
                "fleet_mcp_role": role,
                "fleet_mcp_project": project,
                "fleet_mcp_agent_spec": spec,
                "fleet_mcp_current_task": spec  # Agent starts working immediately
            }
        )

        # Convert to Agent model
        agent = Agent.from_workspace(workspace)

        return CreateAgentResponse(
            agent=agent,
            message=f"Agent '{name}' created successfully"
        )

    @mcp.tool()
    async def list_agents() -> AgentListResponse:
        """List all agents in the fleet with their current status"""
        workspaces = await coder_client.list_workspaces()

        # Filter for fleet workspaces and convert to AgentSummary
        agents = []
        for ws in workspaces:
            if "fleet_mcp_agent_name" in ws.get("metadata", {}):
                agent = Agent.from_workspace(ws)
                agents.append(AgentSummary(
                    name=agent.name,
                    status=agent.status,
                    current_task=agent.current_task
                ))

        return AgentListResponse(
            agents=agents,
            total_count=len(agents)
        )
```

Run tests (should PASS):

```bash
nx test fleet-mcp
```

### 4.3 Repeat for Other Tool Modules

Follow same TDD cycle for:
- `tools/task_management.py` (start_task, cancel_task, show_task_history)
- `tools/discovery.py` (list_roles, list_projects)

---

## Step 5: Integration & Validation

### 5.1 Run Full Test Suite

```bash
nx test fleet-mcp
```

All tests should pass with green output.

### 5.2 Lint & Format

```bash
nx lint fleet-mcp
trunk fmt libs/fleet-mcp
trunk check libs/fleet-mcp
```

### 5.3 Build Library

```bash
nx build fleet-mcp
```

---

## Step 6: Local Testing

### 6.1 Create Test Script

Create `libs/fleet-mcp/scripts/test_local.py`:

```python
import asyncio
from fleet_mcp.server import create_mcp_server
import os

async def main():
    base_url = os.environ["CODER_URL"]
    token = os.environ["CODER_TOKEN"]

    mcp = create_mcp_server(base_url, token)

    # Test create agent
    result = await mcp.call_tool("create_agent", {
        "name": "test-local",
        "project": "Setup",
        "role": "coder",
        "spec": "Local testing agent"
    })
    print("Created agent:", result)

    # Test list agents
    result = await mcp.call_tool("list_agents", {})
    print("Agent list:", result)

if __name__ == "__main__":
    asyncio.run(main())
```

### 6.2 Run Local Test

```bash
cd libs/fleet-mcp
export CODER_URL=https://your-coder.com
export CODER_TOKEN=your-api-token
uv run python scripts/test_local.py
```

---

## Next Steps

After completing this quickstart:

1. Run `/speckit.tasks` to generate implementation tasks
2. Follow TDD for each task
3. Commit after each passing test suite
4. Create PR when feature is complete

---

## Common Issues

### VCR Cassette Recording

If tests fail with "Connection refused":
- Ensure `CODER_URL` and `CODER_TOKEN` are set
- Delete cassette files to force re-recording
- Check Coder API is accessible

### Dependency Issues

If `uv sync` fails:
- Check Python version: `python --version` (must be 3.12+)
- Clear uv cache: `uv cache clean`
- Verify pyproject.toml syntax

### Nx Integration

If `nx test` doesn't find project:
- Run `nx reset` to clear cache
- Verify `project.json` exists in libs/fleet-mcp
- Check workspace is properly registered in nx.json

---

## Resources

- [FastMCP Documentation](https://gofastmcp.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/latest/)
- [pytest-vcr Documentation](https://pytest-vcr.readthedocs.io/)
- [Coder API Reference](https://coder.com/docs/reference/api)
