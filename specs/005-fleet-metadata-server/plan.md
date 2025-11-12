# Implementation Plan: Fleet Metadata Server

**Branch**: `005-fleet-metadata-server` | **Date**: 2025-11-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-fleet-metadata-server/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

A stateless metadata server built with FastMCP that automatically collects workspace metadata (git status, PRs, tasks) and exposes it via a read-only HTTP API. Each fleet agent runs its own instance, enabling fleet-mcp to implement custom workflows like PR tracking without manual configuration.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: fastmcp==2.13.0.2, pydantic==2.9.2, httpx==0.27.2, pytest==7.4.3, respx==0.22.0
**Storage**: N/A (stateless server - all data collected on-demand from workspace)
**Testing**: pytest with respx for HTTP mocking, unittest.mock for git subprocess calls, VCR for optional real API recording
**Target Platform**: Linux server (Coder workspace environment)
**Project Type**: single (backend service)
**Performance Goals**: <100ms response time (p95) including workspace data collection, 100+ concurrent requests
**Constraints**: <200ms p95 latency, metadata size limits (256 char keys, 4KB values, 1MB total), must handle git/GitHub API failures gracefully
**Scale/Scope**: Fleet of up to 100 agents, single /metadata endpoint per server instance, automatic workspace discovery

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Minimal Code & Dependency Reuse
✅ **PASS** - Using FastMCP (third-party MCP server framework), Pydantic (validation), HTTPX (HTTP client), pytest/respx (testing). Custom code limited to workspace metadata collection logic only.

### II. Deterministic Dependencies
✅ **PASS** - All dependencies will be pinned with exact versions using uv package manager. Project will include exact version specifications in pyproject.toml or requirements.txt.

### III. Test-Driven Design (TDD)
✅ **PASS** - Spec includes comprehensive acceptance scenarios. Implementation will follow TDD: write failing tests for metadata collection, API endpoints, and error handling before implementation. Will use pytest with respx for HTTP mocking.

### IV. Nx Monorepo Structure
✅ **PASS** - Project will be placed in `libs/fleet-metadata/` following fleet-mcp precedent. Rationale: fleet-metadata is an infrastructure service (not user-facing app), integrates with fleet-mcp, and follows Python service convention established in monorepo.

### V. Third-Party Dependency Management
✅ **PASS** - Python dependencies managed through third_party/python/. Will use uv for deterministic dependency resolution.

### VI. Semantic Versioning & Independent Releases
✅ **PASS** - Will use nx release for version management. Initial version 0.1.0. Will follow semver for API changes.

### VII. GitOps Deployment
✅ **PASS** - Server will be deployed to Coder workspaces via fleet-mcp orchestration. Configuration declarative and version-controlled.

### VIII. Tool Availability
✅ **PASS** - All required tools (uv, pytest, Python) available through bin/ or Hermit. No manual installation required.

### IX. On-Demand Dependency Provisioning
✅ **PASS** - Using uv for automatic Python environment setup. direnv will provision required tools.

### X. Modular Library Design
✅ **PASS** - Single focused responsibility: expose workspace metadata. Minimal dependencies. Independent test suite. Clear API boundary via /metadata endpoint.

**Gate Status**: ✅ PASS - All constitutional principles satisfied. Project placement resolved (libs/), dependencies pinned, TDD approach planned.

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
libs/fleet-metadata/
├── src/fleet_metadata/
│   ├── __init__.py
│   ├── __main__.py          # FastMCP server entry point
│   ├── models.py            # Pydantic response models
│   ├── collectors/          # Metadata collection modules
│   │   ├── __init__.py
│   │   ├── base.py          # MetadataCollector interface
│   │   ├── git.py           # Git metadata collector
│   │   ├── github.py        # GitHub PR metadata collector
│   │   └── workspace.py     # Workspace task metadata collector
│   ├── services/            # Business logic layer
│   │   ├── __init__.py
│   │   └── metadata_service.py  # Orchestrates collectors
│   └── api/                 # FastMCP endpoints
│       ├── __init__.py
│       └── metadata.py      # /metadata endpoint
├── tests/
│   ├── unit/                # Unit tests for collectors
│   ├── integration/         # Full stack tests (HTTP/subprocess mocked)
│   └── contract/            # API response schema validation
├── pyproject.toml           # uv project config with pinned deps
├── uv.lock                  # Deterministic lock file
├── package.json             # Nx integration
└── .env.example             # Configuration template
```

**Structure Decision**: Single backend service project in `libs/fleet-metadata/`. Follows fleet-mcp precedent for infrastructure services. Clean architecture with collectors → services → api layers.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitutional principles satisfied.

---

## Post-Design Constitution Re-evaluation

*Re-checked after Phase 1 design completion (data-model.md, contracts/, quickstart.md)*

### Design Artifacts Generated
- ✅ **research.md**: All technical unknowns resolved (FastMCP version, testing strategy, project placement, collector architecture, rate limiting)
- ✅ **data-model.md**: Complete entity definitions, validation rules, collector interface, service orchestration
- ✅ **contracts/**: OpenAPI 3.1 spec, JSON Schema, contract test examples
- ✅ **quickstart.md**: Setup guide, TDD workflow, architecture overview, testing patterns

### Constitutional Compliance Review

#### I. Minimal Code & Dependency Reuse
✅ **CONFIRMED** - Design uses proven third-party packages:
- fastmcp==2.13.0.2 (MCP server framework, already in monorepo)
- pydantic==2.9.2 (validation, already in monorepo)
- httpx==0.27.2 (HTTP client, already in monorepo)
- No custom reinvention of existing solutions

#### II. Deterministic Dependencies
✅ **CONFIRMED** - All dependencies pinned with exact versions in design docs. Will be enforced in pyproject.toml.

#### III. Test-Driven Design (TDD)
✅ **CONFIRMED** - Design includes:
- Comprehensive test patterns in quickstart.md
- Clear TDD workflow (red → green → refactor)
- Unit, integration, and contract test structure
- Mocking strategies for git/GitHub API calls
- pytest fixtures and respx patterns from fleet-mcp

#### IV. Nx Monorepo Structure
✅ **CONFIRMED** - Project placement in `libs/fleet-metadata/` follows monorepo patterns:
- Infrastructure service (not user-facing app)
- Integrates with fleet-mcp sibling project
- Clean architecture: collectors → services → api
- Nx targets defined: server, test, lint

#### V. Third-Party Dependency Management
✅ **CONFIRMED** - Dependencies follow monorepo standards:
- All deps already in third_party/python/ (fastmcp, pydantic, httpx, pytest, respx)
- No new dependency additions required
- uv for package management

#### VI. Semantic Versioning & Independent Releases
✅ **CONFIRMED** - Initial version 0.1.0, will use nx release. API versioned in meta.version field.

#### VII. GitOps Deployment
✅ **CONFIRMED** - Server deploys to Coder workspaces via fleet-mcp orchestration. Configuration declarative.

#### VIII. Tool Availability
✅ **CONFIRMED** - All tools available through bin/ or Hermit (uv, pytest, Python). No manual installation.

#### IX. On-Demand Dependency Provisioning
✅ **CONFIRMED** - Using uv for automatic Python environment setup. direnv provisions tools.

#### X. Modular Library Design
✅ **CONFIRMED** - Design demonstrates modularity:
- Single responsibility: expose workspace metadata
- Independent collectors (git, github, workspace)
- MetadataCollector interface enables extension
- Clear service layer orchestration
- Minimal coupling to other libraries

### Design Quality Assessment

**Strengths**:
1. Follows fleet-mcp established patterns (proven in production)
2. Clear separation of concerns (collectors → service → api)
3. Comprehensive error handling (partial metadata on failure)
4. Testable design (all external calls mockable)
5. Extensible architecture (add new collectors without modifying existing code)

**Risks Identified**:
1. **Workspace task detection** (OPEN QUESTION) - Multiple approaches possible, needs user decision:
   - File-based state (`/tmp/fleet-metadata-task.json`)
   - Process detection (`ps aux`)
   - Coder API query
   - **Mitigation**: Document in Phase 2 tasks, implement simplest first (file-based)

2. **GitHub API rate limiting** - Could impact metadata freshness under heavy load
   - **Mitigation**: Exponential backoff implemented, degrades gracefully, logs warnings

**Opportunities**:
1. Future enhancement: Optional caching layer for high-frequency queries
2. Future enhancement: WebSocket endpoint for real-time metadata updates
3. Future enhancement: Metrics/observability (Prometheus endpoint)

**Gate Status**: ✅ **PASS** - Design maintains constitutional compliance. No violations introduced. Ready for Phase 2 (task generation).
