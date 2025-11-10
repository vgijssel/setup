# Research: Fleet MCP Clean Architecture

**Branch**: `003-fleet-mcp` | **Date**: 2025-11-07

## Overview

This document captures research findings and technology decisions for implementing fleet-mcp with clean architecture, AI-compatible testing, **uv package management (no pip)**, and **Nx monorepo integration**.

## Technology Decisions

### 0. Package Manager: uv (NOT pip)

**Decision**: Use uv 0.7.20+ exclusively for all Python package management

**Rationale**:
- **Speed**: 10-100x faster than pip for dependency resolution and installation
- **Determinism**: uv.lock provides fully reproducible builds (like poetry.lock or Pipfile.lock)
- **Monorepo-friendly**: Handles multiple Python projects efficiently
- **Modern**: Built in Rust, actively maintained, follows Python packaging standards (PEP 517/518)
- **Nx Integration**: Works seamlessly with Nx run-commands executor
- **Existing Pattern**: libs/fleet-mcp already uses uv successfully (see libs/fleet-mcp/package.json)
- **Virtual Environment Management**: Automatic .venv creation and management
- **Constitution Compliance**: Pinned dependencies + uv.lock ensures deterministic builds (Principle II)

**How uv Replaces pip**:
| pip Command | uv Equivalent |
|-------------|---------------|
| `pip install` | `uv pip install` or `uv sync` |
| `pip install -e .` | `uv pip install -e .` |
| `pip freeze` | `uv pip freeze` (or use uv.lock) |
| `python -m pip install` | `uv pip install` |
| `pip-compile` | `uv pip compile` |
| Run scripts | `uv run <command>` |

**Best Practices**:
- **Never use pip directly** - always use uv commands
- Use `uv sync` to ensure venv matches uv.lock exactly
- Use `uv run` to execute commands in managed virtual environment
- Use `uv pip install --all-extras` for dev dependencies
- Commit uv.lock to version control
- Pin all dependencies to exact versions in pyproject.toml (see Principle II)

**Nx Target Integration**:
```json
{
  "test": {
    "executor": "nx:run-commands",
    "options": {
      "command": "uv run --all-extras pytest -v",
      "cwd": "libs/fleet-mcp"
    }
  }
}
```

**Alternatives Considered**:
- **pip**: Traditional but slow (1-10 minutes), lacks lock file, non-deterministic
- **poetry**: Good but heavier, has own venv management that conflicts with Nx patterns
- **pipenv**: Similar to poetry but less maintained, slower than uv
- **conda**: Too heavy, not suitable for monorepo

### 1. Build System: Nx Monorepo Integration

**Decision**: Configure fleet-mcp as Nx library with package.json configuration

**Rationale**:
- **Existing Pattern**: libs/fleet-mcp uses this exact pattern (see libs/fleet-mcp/package.json)
- **Build Orchestration**: Nx caches test results and runs only affected tests
- **Monorepo Consistency**: All projects (Python, JS, Go) use Nx for task execution
- **Target Definition**: Use `nx:run-commands` executor to wrap uv commands
- **Smart Caching**: Nx invalidates cache when source or test files change
- **Affected Command**: `nx affected:test` runs tests only for changed code
- **Independent Versioning**: Uses `nx release` for semantic versioning
- **Constitution Compliance**: Follows Principle IV (Nx Monorepo Structure)

**Configuration Pattern** (from libs/fleet-mcp):
```json
{
  "name": "fleet-mcp",
  "version": "0.1.0",
  "description": "Fleet MCP Clean Architecture Server",
  "private": true,
  "nx": {
    "projectType": "library",
    "sourceRoot": "libs/fleet-mcp/src",
    "targets": {
      "server": {
        "executor": "nx:run-commands",
        "options": {
          "command": "uv run --all-extras uvicorn fleet_mcp.__main__:app --host 127.0.0.1 --port 8001 --reload --timeout-graceful-shutdown 3",
          "cwd": "libs/fleet-mcp"
        },
        "metadata": {
          "description": "Run the fleet-mcp server with hot reload"
        }
      },
      "test": {
        "executor": "nx:run-commands",
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
  }
}
```

**Nx Commands**:
- `nx server fleet-mcp` - Run development server
- `nx test fleet-mcp` - Run tests (with caching)
- `nx affected:test` - Run tests for changed projects only
- `nx show project fleet-mcp` - Show project configuration

**Key Configuration Details**:
- Use port 8001 (not 8000) to avoid conflict with original fleet-mcp
- `cache: true` enables Nx caching for test target
- `inputs` array defines which files invalidate cache
- Exclude `.venv` and `.pytest_cache` from inputs
- Use `{projectRoot}` placeholder for portability

**Alternatives Considered**:
- **Bazel**: Too heavy, requires BUILD files, Python support not as mature
- **Just Makefile**: No caching, no affected command, not monorepo-aware
- **project.json**: Possible but package.json is monorepo convention
- **No Build System**: Manual test execution, no caching, no affected detection

**Best Practices**:
- Always use `uv run` prefix in Nx commands
- Set `cache: true` for deterministic tasks (tests, builds)
- Properly define `inputs` to invalidate cache correctly
- Use different ports for different MCP servers (8000, 8001, 8002...)
- Follow naming convention: `fleet-mcp` (not `fleet_mcp`)

### 2. MCP Server Framework: FastMCP

**Decision**: Use FastMCP (https://github.com/jlowin/fastmcp) as the MCP server framework

**Rationale**:
- Existing dependency in the monorepo (libs/fast-mcp already uses it)
- Provides Pydantic-based tool definitions with automatic validation
- Simplifies MCP protocol implementation
- Active development and community support
- Pythonic API that aligns with clean architecture principles

**Alternatives Considered**:
- Raw MCP protocol implementation: Rejected due to unnecessary complexity and maintenance burden
- Other MCP frameworks: FastMCP is already established in the codebase

### 2. Data Validation: Pydantic

**Decision**: Use Pydantic v2 (https://docs.pydantic.dev/latest/) for all data validation and modeling

**Rationale**:
- Required by FastMCP for tool definitions
- Provides automatic validation with clear error messages
- Strong typing support improves AI code generation compatibility
- Excellent performance with Rust-based core
- Clear separation between input/output models aids clean architecture
- JSON schema generation useful for API documentation

**Alternatives Considered**:
- Dataclasses: Rejected due to lack of validation capabilities
- Marshmallow: Rejected due to less Pythonic API and redundancy with Pydantic

### 3. HTTP Client: HTTPX 0.28.1

**Decision**: Use HTTPX for all HTTP communication with Coder API

**Rationale**:
- Modern async/await support (future-proofing)
- Better testability than requests (native support for mocking)
- Connection pooling and timeout handling
- HTTP/2 support
- Clean API similar to requests library
- Excellent integration with respx for testing

**Alternatives Considered**:
- requests: Rejected due to lack of async support and less modern testing approaches
- aiohttp: Rejected due to more complex API and less intuitive for synchronous use cases

### 4. Testing Framework: pytest

**Decision**: Use pytest as the primary testing framework

**Rationale**:
- De facto standard for Python testing
- Powerful fixture system supports layer-based testing
- Clear assertion syntax improves AI test comprehension
- Extensive plugin ecosystem
- Already used in monorepo

**Alternatives Considered**:
- unittest: Rejected due to more verbose syntax and less flexible fixtures
- nose: Deprecated

### 5. HTTP Mocking: respx 0.22.0

**Decision**: Use respx for mocking HTTPX requests in tests

**Rationale**:
- Purpose-built for HTTPX (not requests)
- Pattern-based request matching (regex support)
- Clear API for defining mock responses
- Assertion capabilities for verifying HTTP calls
- No actual HTTP traffic in tests
- Better AI comprehension due to explicit mock definitions

**Alternatives Considered**:
- responses: Rejected as it only works with requests library, not HTTPX
- pytest-httpx: Considered but respx provides more powerful pattern matching
- VCR directly in tests: Rejected per testing strategy - VCR only for recording

### 6. VCR Recording: pytest-vcr

**Decision**: Use pytest-vcr for one-time cassette recording only

**Rationale**:
- Records actual Coder API interactions as YAML cassettes
- Provides realistic test data based on actual API responses
- Used separately from main test suite (tests/record.py)
- Cassettes used as source of truth for generating fixtures
- Tests use respx mocks derived from cassettes, not VCR directly

**Alternatives Considered**:
- Using VCR directly in tests: Rejected per requirement - reduces AI comprehension
- Manual fixture creation: Rejected as error-prone and doesn't reflect actual API

### 7. Clean Architecture Implementation

**Decision**: Implement 5-layer architecture: Tool → Service → Repository → Client → Coder API

**Rationale**:
- Clear separation of concerns improves maintainability
- Each layer has single responsibility
- Independent testing of each layer
- Unidirectional dependency flow prevents circular dependencies
- Service layer encapsulates business logic
- Repository layer abstracts data access patterns
- Client layer isolates external API details
- Easy to understand for AI agents and developers

**Alternatives Considered**:
- 3-layer (Tool → Service → Client): Rejected as Repository layer provides valuable abstraction
- Hexagonal architecture with ports/adapters: Rejected as overly complex for this use case
- Direct API calls from tools: Rejected due to poor testability and coupling

### 8. State Management Approach

**Decision**: Stateless MCP server - all state stored in Coder workspace metadata

**Rationale**:
- No local database required (simpler deployment)
- Coder API is source of truth
- Horizontal scaling without state synchronization
- Follows existing fleet-mcp pattern
- Reduces operational complexity

**Alternatives Considered**:
- Local database (SQLite/PostgreSQL): Rejected due to added complexity, sync issues
- In-memory state: Rejected due to loss on restart

## Testing Strategy Research

### AI-Compatible Test Design Principles

**Research Finding**: AI agents comprehend tests better when:
1. Test names clearly state what is being tested (not cryptic abbreviations)
2. Arrange-Act-Assert pattern is explicit and well-separated
3. Mocks are explicitly defined (not hidden behind complex fixtures)
4. Error messages clearly indicate expected vs actual values
5. Test data is realistic (based on actual API responses)

**Implementation Approach**:
- VCR cassettes provide realistic test data
- respx mocks explicitly define HTTP responses
- Fixture factories provide clear test data creation
- Test names follow pattern: `test_<operation>_<scenario>_<expected_result>`
- Each layer tested independently with mocked dependencies

### Test Organization by Layer

**Research Finding**: Layer-based test organization:
- Mirrors source code structure (improved navigation)
- Enforces testing only the layer under test
- Prevents integration tests disguised as unit tests
- Makes dependencies explicit

**Implementation**:
```
tests/tools/         → Mock Service layer
tests/services/      → Mock Repository layer
tests/repositories/  → Mock Client layer
tests/clients/       → Mock HTTP with respx (based on VCR cassettes)
```

### Mock Generation from VCR Cassettes

**Research Finding**: Two-step process improves test quality:
1. Record phase: Capture real API interactions with pytest-vcr
2. Test phase: Use cassette data to generate explicit respx mocks

**Benefits**:
- Realistic test data without live API dependency
- Tests remain fast and deterministic
- Clear visibility into what data is being mocked
- Easy to understand for AI agents
- No network flakiness in test suite

## Best Practices Research

### Pydantic Model Design

**Best Practice**: Separate models by layer responsibility
- API models: Match Coder API response structure
- Domain models: Business entity representation
- Tool models: MCP tool input/output

**Rationale**: Decoupling prevents API changes from cascading through all layers

### Error Handling Strategy

**Best Practice**: Layer-specific exception types
- Client layer: HTTP errors (4xx, 5xx)
- Repository layer: Data access errors (not found, conflict)
- Service layer: Business logic errors (invalid state, validation)
- Tool layer: MCP errors (invalid input, operation failure)

**Rationale**: Clear error semantics improve debugging and AI comprehension

### Dependency Injection Pattern

**Best Practice**: Constructor injection without DI container
```python
# Service instantiates Repository
class AgentService:
    def __init__(self, repository: AgentRepository):
        self.repository = repository

# Repository instantiates Client
class AgentRepository:
    def __init__(self, client: CoderClient):
        self.client = client
```

**Rationale**: Simple, explicit, no magic - easy for AI to understand and test

### Async vs Sync Design

**Decision**: Synchronous implementation initially

**Rationale**:
- FastMCP supports both sync and async
- Coder API operations are not parallelizable (stateful workspace operations)
- Simpler to implement and test
- Can migrate to async if performance profiling indicates benefit
- HTTPX supports both sync and async with same API

## Integration Points

### Coder API Endpoints Required

Based on feature requirements, the following Coder API endpoints are needed:

1. **Workspace Management**
   - `POST /api/v2/organizations/{id}/members/me/workspaces` - Create workspace (agent)
   - `GET /api/v2/workspaces/{id}` - Get workspace details
   - `GET /api/v2/workspaces` - List workspaces (agents)
   - `DELETE /api/v2/workspaces/{id}` - Delete workspace (agent)
   - `POST /api/v2/workspaces/{id}/builds` - Restart workspace

2. **Template Management**
   - `GET /api/v2/templates` - List templates (projects)
   - `GET /api/v2/templates/{id}` - Get template details
   - `GET /api/v2/templates/{id}/versions/{version}/rich-parameters` - Get template parameters
   - `GET /api/v2/templates/{id}/versions/{version}/presets` - Get workspace presets (roles)

3. **Task Management** (Experimental API)
   - `POST /api/v2/workspaces/{id}/task-input` - Send task to agent
   - `GET /api/v2/workspaces/{id}/task-logs` - Get task logs
   - `GET /api/v2/workspaces/{id}/task` - Get task status

4. **AgentAPI** (Workspace-internal)
   - `POST {agentapi_url}/message` - Send interrupt signal (Ctrl+C)

### Authentication

Coder API requires session token in header:
```
Coder-Session-Token: {token}
```

## Dependencies Summary

**Production Dependencies** (pinned versions):
- `fastmcp==0.5.0` (or latest stable)
- `pydantic==2.9.0` (or latest v2)
- `httpx==0.28.1`
- `pyyaml==6.0.2` (for loading cassettes)

**Development Dependencies**:
- `pytest==8.3.0`
- `pytest-asyncio==0.24.0`
- `respx==0.22.0`
- `pytest-vcr==1.0.2`
- `vcrpy==6.0.0`

## Risk Analysis

### Technical Risks

1. **Risk**: Coder API experimental task API changes
   - **Mitigation**: Isolate task API calls in Client layer, VCR cassettes detect breaking changes

2. **Risk**: FastMCP breaking changes
   - **Mitigation**: Pin exact version, monitor releases, comprehensive tool tests detect issues

3. **Risk**: Clean architecture adds complexity
   - **Mitigation**: Clear documentation, AI-readable code structure, comprehensive examples

4. **Risk**: Cassette drift from actual API
   - **Mitigation**: Regular cassette re-recording process, CI validation

### Operational Risks

1. **Risk**: Stateless design requires Coder API availability
   - **Mitigation**: Implement retry logic in Client layer, circuit breaker pattern

2. **Risk**: Agent workspace quota limits
   - **Mitigation**: Document quota requirements, implement quota checks in Service layer

## Implementation Phases

Based on research, implementation should proceed:

1. **Phase 0** (Complete): Research & planning ✅
2. **Phase 1** (Next): Data models, contracts, quickstart
3. **Phase 2**: VCR cassette recording
4. **Phase 3**: Client layer implementation + tests
5. **Phase 4**: Repository layer implementation + tests
6. **Phase 5**: Service layer implementation + tests
7. **Phase 6**: Tool layer implementation + tests
8. **Phase 7**: Integration validation & documentation

## Conclusion

All technology choices prioritize:
- Existing monorepo patterns (FastMCP, pytest)
- Clean architecture principles
- AI comprehension (explicit over implicit)
- Testing independence (mocks from cassettes)
- Constitutional compliance (deterministic dependencies, minimal custom code)

No unresolved questions remain. Ready to proceed to Phase 1 (Data Models & Contracts).
