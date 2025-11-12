# Quickstart Guide: Fleet Metadata Server

**Date**: 2025-11-12
**Branch**: 005-fleet-metadata-server

## Overview

This guide walks you through setting up, running, and testing the Fleet Metadata Server from scratch.

**Prerequisites**:
- Python 3.12+
- uv package manager (installed via `direnv allow` or Hermit)
- Git repository (for testing git metadata collection)
- GitHub token (optional, for PR metadata)

**Time to first query**: ~5 minutes

---

## Quick Start

### 1. Project Setup

```bash
# Navigate to project directory
cd libs/fleet-metadata

# Install dependencies with uv (creates venv automatically)
uv sync

# Verify installation
uv run python -c "import fastmcp; print(f'FastMCP {fastmcp.__version__}')"
# Expected: FastMCP 2.13.0.2
```

### 2. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit configuration (optional)
# GITHUB_TOKEN=ghp_xxxxxxxxxxxxx  # For GitHub API (optional)
# LOG_LEVEL=INFO                  # Logging verbosity
```

**Environment Variables**:
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GITHUB_TOKEN` | No | None | GitHub personal access token for PR metadata |
| `LOG_LEVEL` | No | `INFO` | Logging level: DEBUG, INFO, WARNING, ERROR |
| `CODER_WORKSPACE_ID` | Auto | Auto-detected | Coder workspace ID (set by Coder) |
| `CODER_WORKSPACE_NAME` | Auto | Auto-detected | Coder workspace name (set by Coder) |

### 3. Run Development Server

```bash
# Using Nx (recommended)
nx server fleet-metadata

# Or directly with uv
cd libs/fleet-metadata
uv run uvicorn fleet_metadata.__main__:app --reload --host 127.0.0.1 --port 8000
```

**Expected output**:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 4. Query Metadata

```bash
# Get all metadata
curl http://localhost:8000/metadata | jq

# Health check
curl http://localhost:8000/health | jq
```

**Example response** (in a git repository with open PR):
```json
{
  "data": {
    "git_branch": {
      "value": "005-fleet-metadata-server",
      "schema": {
        "type": "string",
        "description": "Current git branch name",
        "includeInList": true
      }
    },
    "git_commit_hash": {
      "value": "32ca8fd",
      "schema": {
        "type": "string",
        "description": "Short commit hash (7 chars)",
        "includeInList": true
      }
    },
    "github_pr_number": {
      "value": 810,
      "schema": {
        "type": "number",
        "description": "Pull request number",
        "includeInList": true
      }
    },
    "workspace_id": {
      "value": "fcb6fc42-ba88-4175-9508-88e6a554a61a",
      "schema": {
        "type": "string",
        "description": "Coder workspace ID",
        "includeInList": true
      }
    }
  },
  "meta": {
    "version": "1.0"
  }
}
```

---

## Development Workflow

### Run Tests

```bash
# All tests
nx test fleet-metadata

# Unit tests only
cd libs/fleet-metadata
uv run pytest tests/unit -v

# Integration tests
uv run pytest tests/integration -v

# Contract tests
uv run pytest tests/contract -v

# With coverage
uv run pytest --cov=fleet_metadata --cov-report=term-missing
```

### Lint and Format

```bash
# Lint with Trunk
trunk check libs/fleet-metadata

# Format code
trunk fmt libs/fleet-metadata

# Type checking (if using mypy)
cd libs/fleet-metadata
uv run mypy src/fleet_metadata
```

### Test-Driven Development (TDD)

**Follow TDD workflow** (Constitutional Principle III):

```bash
# 1. Write failing test
cat > tests/unit/test_git_collector.py <<EOF
import pytest
from fleet_metadata.collectors.git import GitCollector

@pytest.mark.asyncio
async def test_collect_branch_name():
    collector = GitCollector()
    metadata = await collector.collect()
    assert "git_branch" in metadata
    assert metadata["git_branch"].schema.type == "string"
EOF

# 2. Verify test fails (red)
uv run pytest tests/unit/test_git_collector.py::test_collect_branch_name
# Expected: FAILED (module not implemented yet)

# 3. Implement minimal code to pass (green)
# ... implement GitCollector.collect() ...

# 4. Verify test passes
uv run pytest tests/unit/test_git_collector.py::test_collect_branch_name
# Expected: PASSED

# 5. Refactor while keeping tests green
# ... improve implementation ...
```

---

## Architecture Overview

### Project Structure

```
libs/fleet-metadata/
├── src/fleet_metadata/
│   ├── __init__.py
│   ├── __main__.py              # Server entry point
│   ├── models.py                # Pydantic models
│   ├── collectors/              # Metadata collectors
│   │   ├── base.py              # MetadataCollector interface
│   │   ├── git.py               # Git metadata
│   │   ├── github.py            # GitHub PR metadata
│   │   └── workspace.py         # Workspace metadata
│   ├── services/
│   │   └── metadata_service.py  # Orchestrates collectors
│   └── api/
│       └── metadata.py          # FastMCP endpoints
└── tests/
    ├── unit/                    # Mocked dependencies
    ├── integration/             # Full stack, HTTP/subprocess mocked
    └── contract/                # API schema validation
```

### Data Flow

```
HTTP Request → FastMCP Endpoint → MetadataService → [Collectors] → Response
                                        ↓
                              ┌─────────┴─────────┐
                              ↓                   ↓
                        GitCollector      GitHubCollector
                              ↓                   ↓
                     subprocess.run()      httpx.get()
                          (git)           (GitHub API)
```

### Key Components

**MetadataCollector** (Interface):
```python
from abc import ABC, abstractmethod

class MetadataCollector(ABC):
    async def collect(self) -> dict[str, MetadataEntry]:
        """Collect metadata from source."""
        pass

    def get_prefix(self) -> str:
        """Get key prefix (e.g., 'git_', 'github_')."""
        pass
```

**MetadataService** (Orchestrator):
```python
class MetadataService:
    def __init__(self, collectors: list[MetadataCollector]):
        self.collectors = collectors

    async def collect_all(self) -> MetadataResponse:
        """Collect metadata from all collectors in parallel."""
        results = await asyncio.gather(
            *[c.collect() for c in self.collectors],
            return_exceptions=True
        )
        return MetadataResponse(data=merge(results))
```

**FastMCP Endpoint**:
```python
from fastmcp import FastMCP

mcp = FastMCP("Fleet Metadata Server", version="0.1.0")

@mcp.custom_route("/metadata", methods=["GET"])
async def get_metadata(request):
    """Return all workspace metadata."""
    service = get_metadata_service()
    metadata = await service.collect_all()
    return metadata.model_dump()
```

---

## Testing Guide

### Unit Tests

Test individual collectors with all dependencies mocked:

```python
# tests/unit/test_git_collector.py
from unittest.mock import MagicMock, patch
import pytest

@patch("fleet_metadata.collectors.git.subprocess.run")
@pytest.mark.asyncio
async def test_collect_git_branch(mock_subprocess):
    # Mock subprocess.run
    mock_subprocess.return_value = MagicMock(
        returncode=0,
        stdout="feature-branch\n"
    )

    # Test collector
    collector = GitCollector()
    metadata = await collector.collect()

    # Assertions
    assert "git_branch" in metadata
    assert metadata["git_branch"].value == "feature-branch"
    mock_subprocess.assert_called_once_with(
        ["git", "rev-parse", "--abbrev-ref", "HEAD"],
        capture_output=True,
        text=True,
        timeout=5
    )
```

### Integration Tests

Test full stack with only HTTP/subprocess mocked:

```python
# tests/integration/test_metadata_collection.py
import respx
from httpx import Response

@pytest.mark.asyncio
async def test_full_metadata_collection(respx_mock):
    # Mock GitHub API
    respx_mock.get("https://api.github.com/repos/owner/repo/pulls").mock(
        return_value=Response(200, json=[{"number": 123, "state": "open"}])
    )

    # Mock git commands
    with patch("subprocess.run") as mock_run:
        mock_run.return_value = MagicMock(returncode=0, stdout="main\n")

        # Call service
        service = MetadataService([GitCollector(), GitHubCollector()])
        response = await service.collect_all()

        # Assertions
        assert "git_branch" in response.data
        assert "github_pr_number" in response.data
```

### Contract Tests

Validate API responses against JSON schema:

```python
# tests/contract/test_metadata_api.py
import json
import jsonschema

def test_metadata_response_schema():
    """Validate /metadata response against contract."""
    with open("specs/005-fleet-metadata-server/contracts/metadata-response.schema.json") as f:
        schema = json.load(f)

    # Get real response
    response = client.get("/metadata")
    data = response.json()

    # Should not raise ValidationError
    jsonschema.validate(data, schema)
```

---

## Common Tasks

### Add New Metadata Collector

**Example**: Add Jira task collector

```python
# 1. Write failing test
# tests/unit/test_jira_collector.py
@pytest.mark.asyncio
async def test_collect_jira_task():
    collector = JiraCollector()
    metadata = await collector.collect()
    assert "jira_task_key" in metadata

# 2. Implement collector
# src/fleet_metadata/collectors/jira.py
class JiraCollector(MetadataCollector):
    def get_prefix(self) -> str:
        return "jira_"

    async def collect(self) -> dict[str, MetadataEntry]:
        # Query Jira API
        task_key = await self._get_current_task()
        return {
            "jira_task_key": MetadataEntry(
                value=task_key,
                schema=MetadataSchema(
                    type="string",
                    description="Current Jira task key",
                    includeInList=True
                )
            )
        }

# 3. Register in service
# src/fleet_metadata/__main__.py
def get_metadata_service() -> MetadataService:
    return MetadataService([
        GitCollector(),
        GitHubCollector(),
        WorkspaceCollector(),
        JiraCollector(),  # Add new collector
    ])
```

### Debug Metadata Collection

```python
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run server with verbose output
uv run uvicorn fleet_metadata.__main__:app --reload --log-level debug

# Tail logs
tail -f logs/fleet-metadata.log
```

### Simulate Production Environment

```bash
# Set Coder environment variables
export CODER_WORKSPACE_ID=fcb6fc42-ba88-4175-9508-88e6a554a61a
export CODER_WORKSPACE_NAME=fleet-agent-001
export CODER_AGENT_NAME=main

# Run server
nx server fleet-metadata

# Query from another terminal
curl http://localhost:8000/metadata | jq '.data | keys'
```

---

## Deployment

### Local Development

```bash
# Run with auto-reload
nx server fleet-metadata
```

### Coder Workspace Deployment

```bash
# Start server in background
uv run uvicorn fleet_metadata.__main__:app --host 0.0.0.0 --port 8000 &

# Or use systemd service
sudo systemctl enable fleet-metadata
sudo systemctl start fleet-metadata
```

### Health Monitoring

```bash
# Health check
curl http://localhost:8000/health

# Expected response
# {
#   "status": "healthy",
#   "version": "0.1.0",
#   "uptime_seconds": 3600
# }
```

---

## Troubleshooting

### "Module not found" error

```bash
# Ensure dependencies installed
cd libs/fleet-metadata
uv sync

# Verify Python path
uv run python -c "import sys; print('\n'.join(sys.path))"
```

### Git metadata not collected

```bash
# Verify git repository
git status

# Check git commands work
git rev-parse --abbrev-ref HEAD

# Enable debug logging
export LOG_LEVEL=DEBUG
nx server fleet-metadata
```

### GitHub API rate limit

```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit | jq

# Use authenticated requests (increases limit from 60 to 5000/hour)
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### Tests failing

```bash
# Clear pytest cache
rm -rf .pytest_cache

# Reinstall dependencies
uv sync --reinstall

# Run with verbose output
uv run pytest -vv --tb=short
```

---

## Next Steps

1. **Implement collectors**: Start with `GitCollector` (simplest)
2. **Write tests first**: Follow TDD workflow (red → green → refactor)
3. **Add integration tests**: Test full stack with mocked HTTP/subprocess
4. **Validate contracts**: Ensure responses match OpenAPI schema
5. **Deploy to Coder**: Test in real workspace environment

**See also**:
- [data-model.md](data-model.md) - Complete data model specification
- [contracts/](contracts/) - API contracts and schemas
- [plan.md](plan.md) - Implementation plan and architecture
- [research.md](research.md) - Technical decisions and alternatives
