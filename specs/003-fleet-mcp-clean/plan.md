# Implementation Plan: Fleet MCP Clean Architecture with uv and Nx

**Branch**: `003-fleet-mcp-clean` | **Date**: 2025-11-07 | **Spec**: [spec.md](./spec.md)
**Input**: Update to use uv as the package manager, no pip. Also make it an Nx project.

**Note**: This plan implements the fleet-mcp-clean architecture with clean architecture patterns, using uv for Python package management and integrating as an Nx monorepo project.

## Summary

Implement a clean architecture version of fleet-mcp (fleet-mcp-clean) that manages Claude Code agent fleets in Coder workspaces. The implementation uses a 5-layer architecture (Tool → Service → Repository → Client → Coder API) with AI-compatible testing patterns. Package management is handled by uv (not pip), and the project is fully integrated into the Nx monorepo structure for build orchestration and caching.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**:
- fastmcp==2.13.0.2 (MCP server framework)
- pydantic==2.12.3 (data validation)
- httpx==0.28.1 (async HTTP client for Coder API)
- python-dotenv==1.2.1 (environment configuration)
- uvicorn==0.34.0 (ASGI server)

**Package Manager**: uv 0.7.20+ (NOT pip - all dependency management via uv)

**Storage**: Stateless - all state managed by Coder API (workspaces, task metadata, logs)

**Testing**:
- pytest==7.4.3 (test framework)
- pytest-vcr==1.0.2 (cassette recording only)
- pytest-asyncio==0.21.1 (async test support)
- Mock factories generated from VCR cassettes (tests use mocks, not VCR directly)

**Build System**:
- Nx 21.4.1+ monorepo orchestration
- uv for Python dependency resolution and virtual environment management
- hatchling for package building (pyproject.toml build-backend)

**Target Platform**: Linux server (Coder workspace environment)

**Project Type**: Single Python library in Nx monorepo (libs/fleet-mcp-clean)

**Performance Goals**:
- List 100+ agents in <2 seconds
- Agent creation to online status in <60 seconds
- Task assignment response in <500ms
- Task cancellation response in <5 seconds

**Constraints**:
- Must use clean architecture with strict layer boundaries
- No direct VCR usage in tests (only in cassette recording phase)
- All tests must be AI-readable with explicit arrange-act-assert
- Zero backwards compatibility with original fleet-mcp

**Scale/Scope**:
- Support 100+ concurrent agents per fleet
- Handle 1000+ task history entries with pagination
- Maintain clear architectural boundaries across ~15-20 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Minimal Code & Dependency Reuse
**Status**: PASS
**Rationale**: Uses well-maintained third-party packages (fastmcp, pydantic, httpx, pytest) for all core functionality. No custom HTTP client, validation, or MCP protocol implementation. All dependencies are battle-tested and actively maintained.

### ✅ II. Deterministic Dependencies
**Status**: PASS
**Rationale**: All dependencies pinned to exact versions in pyproject.toml:
- fastmcp==2.13.0.2 (exact)
- pydantic==2.12.3 (exact)
- httpx==0.28.1 (exact)
- pytest==7.4.3 (exact)
- Only python-dotenv uses >= operator (>=1.2.1) for security patches - acceptable per constitution

uv.lock ensures fully deterministic builds. Renovatebot configured for automated updates.

### ✅ III. Test-Driven Design (TDD)
**Status**: PASS
**Rationale**: TDD workflow mandated in implementation. Tests organized by layer (tools/, services/, repositories/, clients/). Unit, integration, and contract tests required. All tests written before implementation with explicit arrange-act-assert structure. Mock factories based on VCR cassettes ensure reproducible tests.

### ✅ IV. Nx Monorepo Structure
**Status**: PASS
**Rationale**: Project located in libs/fleet-mcp-clean following Nx convention. Uses Nx run-commands executor for server and test targets. Configured in package.json with proper nx metadata. Independent versioning via nx release. Follows existing fleet-mcp pattern.

### ✅ V. Third-Party Dependency Management
**Status**: PASS
**Rationale**: Dependencies declared in pyproject.toml with exact versions. uv manages virtual environment and resolution. No scattered dependencies. Renovatebot integration for updates. Build backend (hatchling) pinned.

### ✅ VI. Semantic Versioning & Independent Releases
**Status**: PASS
**Rationale**: Initial version 0.1.0 in pyproject.toml. Will use nx release for version bumps. Independent versioning from original fleet-mcp. Releases publish artifacts to GitHub per monorepo configuration.

### ✅ VII. GitOps Deployment
**Status**: PASS
**Rationale**: Deployment managed via Coder workspace templates (declarative Terraform). MCP server configuration in version control. No manual deployment steps. All infrastructure as code.

### ✅ VIII. Tool Availability
**Status**: PASS
**Rationale**: uv available in bin/ directory. Nx available via npm. Platform-aware via IS_MACOS/IS_LINUX. Interactive help via bin/help. No manual tool installation required.

### ✅ IX. On-Demand Dependency Provisioning
**Status**: PASS
**Rationale**: uv automatically provisions Python environment and dependencies. direnv loads environment variables. Nx caches build artifacts. Users run `direnv allow` for fully functional environment.

### ✅ X. Modular Library Design
**Status**: PASS
**Rationale**: Single focused library (libs/fleet-mcp-clean) with clear responsibility (fleet management). Clean architecture with 5 distinct layers ensures modularity. Isolated test suite. Independent build/test. Minimal dependencies (only Coder API client).

**GATE VERDICT**: ✅ ALL CHECKS PASS - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
libs/fleet-mcp-clean/
├── pyproject.toml           # Python project config with uv dependencies
├── uv.lock                  # Locked dependency versions
├── package.json             # Nx project config with targets
├── README.md                # Project documentation
├── .env.example             # Environment variable template
│
├── src/
│   └── fleet_mcp_clean/
│       ├── __init__.py
│       ├── __main__.py      # FastMCP server entry point
│       │
│       ├── tools/           # Layer 1: MCP tool entry points
│       │   ├── __init__.py
│       │   ├── list_agents.py
│       │   ├── show_agent.py
│       │   ├── create_agent.py
│       │   ├── delete_agent.py
│       │   ├── restart_agent.py
│       │   ├── start_task.py
│       │   ├── cancel_task.py
│       │   ├── show_task_history.py
│       │   ├── show_logs.py
│       │   ├── list_projects.py
│       │   └── list_roles.py
│       │
│       ├── services/        # Layer 2: Business logic
│       │   ├── __init__.py
│       │   ├── agent_service.py
│       │   ├── task_service.py
│       │   ├── project_service.py
│       │   └── validators.py
│       │
│       ├── repositories/    # Layer 3: Data access
│       │   ├── __init__.py
│       │   ├── agent_repository.py
│       │   ├── task_repository.py
│       │   └── project_repository.py
│       │
│       ├── clients/         # Layer 4: External API communication
│       │   ├── __init__.py
│       │   ├── coder_client.py
│       │   └── exceptions.py
│       │
│       └── models/          # Shared domain entities (Pydantic)
│           ├── __init__.py
│           ├── agent.py
│           ├── task.py
│           ├── project.py
│           ├── role.py
│           └── pagination.py
│
└── tests/
    ├── conftest.py          # pytest configuration and fixtures
    ├── fixtures/            # Mock factories from VCR cassettes
    │   ├── __init__.py
    │   ├── agent_fixtures.py
    │   ├── task_fixtures.py
    │   ├── workspace_fixtures.py
    │   └── template_fixtures.py
    │
    ├── cassettes/           # VCR cassettes (recorded once, not in tests)
    │   ├── create_agent.yaml
    │   ├── list_agents.yaml
    │   └── [other operations].yaml
    │
    ├── tools/               # Test Layer 1 with mocked services
    │   ├── test_list_agents.py
    │   ├── test_create_agent.py
    │   └── [other tool tests].py
    │
    ├── services/            # Test Layer 2 with mocked repositories
    │   ├── test_agent_service.py
    │   ├── test_task_service.py
    │   └── test_validators.py
    │
    ├── repositories/        # Test Layer 3 with mocked clients
    │   ├── test_agent_repository.py
    │   └── test_task_repository.py
    │
    └── clients/             # Test Layer 4 with mocked HTTP (from cassettes)
        ├── test_coder_client.py
        └── test_error_handling.py
```

**Structure Decision**: Single project structure using clean architecture layers. This is a Python library (not web/mobile), so we use the standard single project layout. The key distinction from typical single-project structure is the explicit 5-layer separation (tools, services, repositories, clients, models) to enforce clean architecture boundaries. Tests mirror the source structure to test each layer independently with mocks for the layer below.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All design decisions comply with constitution principles.

## Post-Design Constitution Re-evaluation

After completing Phase 0 (Research) and Phase 1 (Design), re-checking all constitution principles:

### ✅ I. Minimal Code & Dependency Reuse
**Status**: PASS (unchanged from initial check)
- Using fastmcp, pydantic, httpx, pytest - all well-maintained
- Zero custom implementations where third-party exists

### ✅ II. Deterministic Dependencies
**Status**: PASS (unchanged from initial check)
- All dependencies pinned exactly in pyproject.toml
- uv.lock committed for full determinism
- Renovatebot configured for updates

### ✅ III. Test-Driven Design (TDD)
**Status**: PASS (validated by design artifacts)
- Testing strategy documented in research.md
- Mock factories from VCR cassettes
- Layer-based test organization matches source structure
- Explicit arrange-act-assert patterns defined

### ✅ IV. Nx Monorepo Structure
**Status**: PASS (validated by package.json design)
- Project configuration in package.json with nx metadata
- Two targets defined: `server` and `test`
- Caching enabled for test target
- Proper input exclusions (.venv, .pytest_cache)

### ✅ V. Third-Party Dependency Management
**Status**: PASS (unchanged from initial check)
- pyproject.toml with exact versions
- uv manages installation
- No scattered dependencies

### ✅ VI. Semantic Versioning & Independent Releases
**Status**: PASS (unchanged from initial check)
- Initial version 0.1.0
- Independent from fleet-mcp
- nx release workflow

### ✅ VII. GitOps Deployment
**Status**: PASS (unchanged from initial check)
- Coder workspace templates (Terraform)
- All config in version control

### ✅ VIII. Tool Availability
**Status**: PASS (unchanged from initial check)
- uv in bin/
- Nx available via npm

### ✅ IX. On-Demand Dependency Provisioning
**Status**: PASS (unchanged from initial check)
- uv auto-provisions .venv
- direnv loads environment

### ✅ X. Modular Library Design
**Status**: PASS (validated by architecture design)
- Single focused library (libs/fleet-mcp-clean)
- 5-layer clean architecture ensures internal modularity
- Clear layer boundaries enforced
- Isolated test suite per layer

**FINAL GATE VERDICT**: ✅ ALL CHECKS PASS - Design maintains constitution compliance

**Key Design Validations**:
1. **uv usage confirmed**: All commands use `uv run`, `uv sync` - zero pip usage
2. **Nx integration confirmed**: package.json with proper targets and caching
3. **Clean architecture confirmed**: 5 layers with unidirectional dependencies
4. **Testing strategy confirmed**: VCR → mocks → layer-based tests
5. **AI-compatible patterns confirmed**: Scalar MCP parameters, explicit test structure
