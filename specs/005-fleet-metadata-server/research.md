# Research: Fleet Metadata Server

**Date**: 2025-11-12
**Branch**: 005-fleet-metadata-server

## Research Overview

This document consolidates research findings for all technical unknowns identified during plan creation. All decisions are based on existing monorepo patterns and proven third-party solutions.

---

## Decision 1: Project Placement (libs/ vs apps/)

### Decision
**Place fleet-metadata in `libs/fleet-metadata`**

### Rationale
1. **Pattern Consistency**: Fleet-mcp (the consuming system) is in `libs/` as a reusable infrastructure service. Fleet-metadata follows the same pattern.
2. **Not User-Facing**: Unlike apps/ projects (haos, blueorange, docs), fleet-metadata is a backend service that supports fleet management infrastructure, not an end-user application.
3. **Infrastructure Tool**: Like other infrastructure components (cloudflare-tunnel, internal-dns, dev-cluster), fleet-metadata provides infrastructure capabilities consumed by multiple systems.
4. **Python Convention**: All existing Python services (fleet-mcp, external-dns-cleanup) are in libs/, establishing clear precedent.
5. **Integration Point**: Fleet-metadata integrates with fleet-mcp as a sibling infrastructure component.

### Alternatives Considered
- **apps/fleet-metadata**: Rejected because fleet-metadata is not a user-facing application with a specific deployment target. Apps/ is for end-user systems like haos (Home Assistant deployment) or docs (documentation site).
- **stacks/**: Rejected because stacks/ is for environment-specific deployments of apps, not infrastructure libraries.

---

## Decision 2: FastMCP Framework Version

### Decision
**Use `fastmcp==2.13.0.2`** (exact version pinning)

### Rationale
1. **Monorepo Standard**: Fleet-mcp already uses fastmcp==2.13.0.2, ensuring compatibility and consistent dependency graph.
2. **Production-Ready**: Currently running in production within fleet-mcp with 13 MCP tools successfully implemented.
3. **Recent Release**: Version 2.13.0.2 released October 28, 2025 - actively maintained.
4. **Python 3.10+ Required**: Compatible with monorepo's Python 3.12+ standard.
5. **Constitution Compliance**: Exact version pinning satisfies Principle II (Deterministic Dependencies).

### FastMCP Project Structure Pattern
Based on `/workspaces/setup/libs/fleet-mcp` reference implementation:

```
libs/fleet-metadata/
├── src/fleet_metadata/
│   ├── __init__.py
│   ├── __main__.py              # FastMCP server entry point
│   ├── models.py                # Pydantic response models
│   ├── collectors/              # Metadata collection modules
│   │   ├── __init__.py
│   │   ├── git.py               # Git metadata collector
│   │   ├── github.py            # GitHub PR metadata collector
│   │   └── workspace.py         # Workspace task metadata collector
│   └── metadata.py              # /metadata endpoint logic
├── tests/
│   ├── unit/                    # Unit tests for collectors
│   ├── integration/             # Integration tests (git, GitHub API)
│   └── contract/                # API contract tests
├── pyproject.toml               # uv config with exact dependency pins
├── uv.lock                      # Deterministic lock file
├── package.json                 # Nx integration
└── .env.example                 # Configuration template
```

### Endpoint Definition Pattern
```python
from fastmcp import FastMCP
from pydantic import Field
from typing_extensions import Annotated

mcp = FastMCP("Fleet Metadata Server", version="0.1.0")

@mcp.custom_route("/metadata", methods=["GET"])
async def get_metadata(request):
    """Return all workspace metadata."""
    metadata = await metadata_service.collect_all()
    return metadata.model_dump()

# For MCP tools (if needed)
@mcp.tool()
async def collect_metadata(
    key: Annotated[Optional[str], Field(None, description="Specific metadata key")] = None
) -> dict:
    """Collect workspace metadata on-demand."""
    result = await metadata_service.collect(key)
    return result.model_dump()
```

### Running the Server
```bash
# Development (HTTP with auto-reload)
nx server fleet-metadata

# Production (STDIO for MCP protocol)
fastmcp run src/fleet_metadata/__main__.py
```

### Alternatives Considered
- **FastAPI**: Rejected in favor of FastMCP because:
  - Fleet-mcp already uses FastMCP (consistency)
  - FastMCP provides MCP protocol support (future-proof for direct MCP integration)
  - FastMCP is built on Starlette/FastAPI under the hood (no loss of capability)
- **Starlette directly**: Rejected because FastMCP provides higher-level abstractions and automatic schema generation from Pydantic types.

---

## Decision 3: Integration Testing Strategy

### Decision
**Use pytest + respx for HTTP mocking, unittest.mock for git subprocess calls**

### Rationale
1. **Monorepo Standard**: Fleet-mcp uses pytest==7.4.3, pytest-asyncio==0.21.1, respx==0.22.0 - proven in production.
2. **GitHub API Mocking**: respx provides excellent HTTPX mocking with URL regex matching, sequential responses, and VCR integration.
3. **Git Command Mocking**: unittest.mock.patch for subprocess.run is the standard pattern in monorepo (see dev-cluster tests).
4. **No New Dependencies**: All required testing tools already in third_party/python/.
5. **Fast Tests**: Mocking external calls enables fast, deterministic test suite without network/git dependencies.

### Testing Patterns

#### Git Subprocess Mocking
```python
from unittest.mock import MagicMock, patch

@patch("fleet_metadata.collectors.git.subprocess.run")
def test_collect_git_branch(mock_subprocess):
    # Mock success case
    mock_subprocess.return_value = MagicMock(
        returncode=0,
        stdout="feature-branch\n",
        stderr=""
    )

    result = git_collector.get_current_branch()
    assert result == "feature-branch"

    # Mock failure case
    mock_subprocess.return_value = MagicMock(
        returncode=128,
        stderr="fatal: not a git repository"
    )

    with pytest.raises(RuntimeError, match="not a git repository"):
        git_collector.get_current_branch()
```

#### GitHub API Mocking with respx
```python
import respx
from httpx import Response

@pytest.fixture
def respx_mock():
    with respx.mock(assert_all_mocked=False, assert_all_called=False) as mock_router:
        yield mock_router

@pytest.mark.asyncio
async def test_collect_github_pr(respx_mock):
    # Mock GitHub API response
    respx_mock.get("https://api.github.com/repos/owner/repo/pulls").mock(
        return_value=Response(200, json=[
            {"number": 123, "state": "open", "title": "Feature PR"}
        ])
    )

    result = await github_collector.get_pull_requests("owner/repo")
    assert result[0]["number"] == 123
```

#### Rate Limiting Test Pattern
```python
@pytest.mark.asyncio
async def test_github_rate_limit_handling(respx_mock):
    # Sequential responses: rate limit → success
    respx_mock.get(url).mock(
        side_effect=[
            Response(429, headers={"Retry-After": "1"}),
            Response(200, json={"success": True})
        ]
    )

    result = await github_collector.get_data_with_retry()
    assert result["success"] is True
```

#### VCR for Recording Real API Interactions (Optional)
```python
import vcr

vcr_instance = vcr.VCR(
    cassette_library_dir="tests/cassettes",
    record_mode="none",  # Only replay
    match_on=["uri", "method"],
    filter_headers=["authorization"],
)

@vcr_instance.use_cassette("github_pr_success.yaml")
@pytest.mark.asyncio
async def test_real_github_api():
    # Real API call recorded/replayed from cassette
    result = await github_collector.get_pull_requests("owner/repo")
```

### Test Organization
```
tests/
├── unit/
│   ├── test_git_collector.py         # Unit tests with all deps mocked
│   ├── test_github_collector.py
│   └── test_workspace_collector.py
├── integration/
│   └── test_metadata_collection.py   # Full stack, only HTTP/subprocess mocked
└── contract/
    └── test_metadata_api.py          # API response schema validation
```

### Testing Dependencies
```toml
[project.optional-dependencies]
dev = [
    "pytest==7.4.3",
    "pytest-asyncio==0.21.1",
    "pytest-cov==4.1.0",
    "respx==0.22.0",
    "vcrpy==7.0.0",  # Optional: for recording real API calls
]
```

### Alternatives Considered
- **HTTPretty**: Rejected in favor of respx because respx is designed specifically for HTTPX (which we're using) and already proven in fleet-mcp.
- **responses**: Rejected because it's for requests library, not HTTPX.
- **Real git repository fixtures**: Rejected because they're slow, fragile, and violate TDD principle of fast test suites. Mock subprocess calls instead.
- **Docker containers for integration tests**: Rejected for initial implementation due to complexity. May revisit for E2E tests if needed.

---

## Decision 4: Metadata Collection Architecture

### Decision
**Collector pattern with independent, composable collector modules**

### Rationale
1. **Single Responsibility**: Each collector handles one metadata source (git, GitHub, workspace tasks).
2. **Testability**: Collectors can be unit tested independently with mocked dependencies.
3. **Extensibility**: New metadata sources (GitLab MRs, Jira tasks) can be added without modifying existing collectors.
4. **Error Isolation**: Failure in one collector doesn't prevent others from succeeding.
5. **Monorepo Pattern**: Follows fleet-mcp's service/repository layer separation pattern.

### Collector Interface Pattern
```python
from abc import ABC, abstractmethod
from pydantic import BaseModel

class MetadataEntry(BaseModel):
    """Single metadata key-value pair with schema."""
    value: Any
    schema: dict

class MetadataCollector(ABC):
    """Base interface for metadata collectors."""

    @abstractmethod
    async def collect(self) -> dict[str, MetadataEntry]:
        """Collect metadata entries. Returns dict of key → MetadataEntry."""
        pass

    @abstractmethod
    def get_prefix(self) -> str:
        """Get key prefix for this collector (e.g., 'git_', 'github_')."""
        pass
```

### Collector Implementation Example
```python
class GitCollector(MetadataCollector):
    """Collects git repository metadata via subprocess."""

    def get_prefix(self) -> str:
        return "git_"

    async def collect(self) -> dict[str, MetadataEntry]:
        entries = {}

        # Collect branch
        try:
            branch = await self._run_git_command(["rev-parse", "--abbrev-ref", "HEAD"])
            entries["git_branch"] = MetadataEntry(
                value=branch,
                schema={
                    "type": "string",
                    "description": "Current git branch name",
                    "includeInList": True
                }
            )
        except Exception as e:
            # Log error but don't fail - return partial metadata
            logger.warning(f"Failed to collect git branch: {e}")

        return entries

    async def _run_git_command(self, args: list[str]) -> str:
        """Run git command and return stdout."""
        result = subprocess.run(
            ["git"] + args,
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode != 0:
            raise RuntimeError(f"Git command failed: {result.stderr}")
        return result.stdout.strip()
```

### Orchestration via MetadataService
```python
class MetadataService:
    """Orchestrates metadata collection from all collectors."""

    def __init__(self, collectors: list[MetadataCollector]):
        self.collectors = collectors

    async def collect_all(self) -> dict[str, MetadataEntry]:
        """Collect metadata from all collectors."""
        all_metadata = {}

        # Run collectors in parallel
        results = await asyncio.gather(
            *[collector.collect() for collector in self.collectors],
            return_exceptions=True
        )

        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Collector failed: {result}")
                continue
            all_metadata.update(result)

        # Enforce size limits (FR-015)
        self._validate_size_limits(all_metadata)

        return all_metadata
```

### Alternatives Considered
- **Single monolithic collector**: Rejected because it violates SRP and makes testing harder.
- **Synchronous collection**: Rejected because async enables parallel collection from multiple sources (git + GitHub + workspace tasks).
- **Event-driven/reactive**: Rejected as over-engineered for stateless on-demand collection. May revisit if caching is added.

---

## Decision 5: GitHub API Rate Limiting Strategy

### Decision
**Implement exponential backoff retry with respx-tested error handling**

### Rationale
1. **GitHub API Limits**: 5000 requests/hour for authenticated requests, 60/hour for unauthenticated. Must handle 429 responses.
2. **Monorepo Pattern**: No existing retry logic found in fleet-mcp, but respx enables testing retry behavior.
3. **Simple First**: Implement basic retry without external dependencies. Can add `tenacity` or `backoff` library later if needed.
4. **Testability**: respx's `side_effect` enables testing retry sequences without real API calls.

### Implementation Pattern
```python
async def _github_api_request_with_retry(
    url: str,
    max_retries: int = 3,
    initial_backoff: float = 1.0
) -> dict:
    """Make GitHub API request with exponential backoff retry."""
    import httpx
    import asyncio

    backoff = initial_backoff

    for attempt in range(max_retries):
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers={"Authorization": f"token {token}"})

            if response.status_code == 200:
                return response.json()

            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", backoff))
                logger.warning(f"Rate limited, retrying after {retry_after}s")
                await asyncio.sleep(retry_after)
                backoff *= 2
                continue

            if response.status_code == 404:
                raise NotFoundError(f"GitHub resource not found: {url}")

            response.raise_for_status()

    raise RuntimeError(f"Max retries exceeded for {url}")
```

### Testing Rate Limiting
```python
@pytest.mark.asyncio
async def test_github_rate_limit_retry_success(respx_mock):
    """Test successful retry after rate limit."""
    url = "https://api.github.com/repos/owner/repo/pulls"

    respx_mock.get(url).mock(
        side_effect=[
            Response(429, headers={"Retry-After": "1"}),
            Response(200, json=[{"number": 123}])
        ]
    )

    result = await github_collector._github_api_request_with_retry(url)
    assert result[0]["number"] == 123

@pytest.mark.asyncio
async def test_github_rate_limit_max_retries(respx_mock):
    """Test max retries exceeded."""
    url = "https://api.github.com/repos/owner/repo/pulls"

    respx_mock.get(url).mock(
        return_value=Response(429, headers={"Retry-After": "1"})
    )

    with pytest.raises(RuntimeError, match="Max retries exceeded"):
        await github_collector._github_api_request_with_retry(url, max_retries=2)
```

### Alternatives Considered
- **tenacity library**: Rejected for initial implementation to minimize dependencies. May add if retry logic becomes complex.
- **No retry**: Rejected because GitHub API rate limiting is expected and recoverable.
- **Cache API responses**: Deferred to future iteration. Current requirement is real-time metadata (FR-012).

---

## Implementation Notes

### Dependencies (pinned versions)
```toml
[project]
dependencies = [
    "fastmcp==2.13.0.2",
    "pydantic==2.9.2",
    "httpx==0.27.2",
]

[project.optional-dependencies]
dev = [
    "pytest==7.4.3",
    "pytest-asyncio==0.21.1",
    "pytest-cov==4.1.0",
    "respx==0.22.0",
]
```

### Nx Integration
```json
{
  "name": "fleet-metadata",
  "projectType": "library",
  "tags": ["type:lib", "scope:fleet"],
  "targets": {
    "server": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "uv run uvicorn fleet_metadata.__main__:app --reload"
      }
    },
    "test": {
      "executor": "@nrwl/workspace:run-commands",
      "options": {
        "command": "cd libs/fleet-metadata && uv run pytest -v"
      }
    }
  }
}
```

### Environment Variables
```bash
# .env.example
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx  # Optional: for authenticated GitHub API requests
LOG_LEVEL=INFO
METADATA_SIZE_LIMIT_MB=1
```

---

## Open Questions for Phase 1

1. **Workspace Task Detection**: How to detect running tasks in Coder workspace? Via ps command, coder CLI, or file-based state?
2. **GitHub Repository Detection**: Should we auto-detect git remote origin or require GITHUB_REPO env var?
3. **Metadata Schema Versioning**: Should schema.type support evolution (e.g., "string|null" for optional values)?
4. **Caching Strategy**: Should we cache metadata for a few seconds to reduce git/API calls under load?

These will be addressed during Phase 1 design (data-model.md and contracts/).
