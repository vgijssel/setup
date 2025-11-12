# Implementation Plan: Workspace Metadata for Fleet-MCP

**Branch**: `005-workspace-metadata` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-workspace-metadata/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extend the fleet-mcp MCP server to expose workspace metadata (git branch, commit SHA, GitHub PR number) through the show_agent and list_agents tools. The metadata will be collected from agent workspaces using Taskfile commands and exposed via a new HTTP GET /metadata endpoint in the fleet-mcp server. This enables fleet operators to track which branches and PRs each agent is working on without manual inspection.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**:
- FastMCP 2.13.0.2 (MCP server framework)
- Pydantic 2.12.3 (data validation)
- httpx 0.28.1 (HTTP client for metadata endpoint calls)
- uvicorn 0.34.0 (ASGI server)
- task (Taskfile CLI - external binary for metadata collection)

**Storage**: N/A (metadata fetched on-demand from workspaces, not persisted)
**Testing**:
- pytest 7.4.3 (unit tests)
- pytest-asyncio 0.21.1 (async test support)
- respx 0.22.0 (HTTP mocking for metadata endpoint tests)
- pytest-cov 4.1.0 (coverage reporting)

**Target Platform**: Linux server (Coder workspace environment)
**Project Type**: Single library project (libs/fleet-mcp)
**Performance Goals**:
- Metadata retrieval adds <2 seconds overhead to agent queries (SC-005)
- Agent query with metadata completes in <3 seconds (SC-001)
- Taskfile command execution timeout: 5 seconds per task

**Constraints**:
- Must not modify workspace state (read-only operations - FR-009)
- Must handle non-git workspaces gracefully (FR-011)
- Metadata collection timeout must prevent blocking agent queries (FR-012)
- Must execute metadata commands within agent workspace context (FR-008)

**Scale/Scope**:
- Fleet size: ~20 concurrent agents
- Metadata fields: 3-10 per agent (extensible via Taskfile)
- Query frequency: ~1-5 queries/minute per operator

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Minimal Code & Dependency Reuse
✅ **PASS** - Using existing third-party solutions:
- Taskfile (go-task/task) for metadata collection - battle-tested task runner
- FastMCP for HTTP endpoint - already in use
- httpx for HTTP client - already in use
- No custom git command parsing - delegated to Taskfile/shell commands

### II. Deterministic Dependencies
✅ **PASS** - All dependencies use exact versions:
- fastmcp==2.13.0.2
- pydantic==2.12.3
- httpx==0.28.1
- pytest==7.4.3, pytest-asyncio==0.21.1, respx==0.22.0
- Taskfile binary version will be pinned in third_party/

### III. Test-Driven Design (TDD)
✅ **PASS** - TDD workflow planned:
- Phase 0: Write failing tests for metadata models
- Phase 1: Write failing tests for HTTP endpoint
- Phase 2: Write failing tests for MetadataRepository
- Phase 3: Implement to make tests pass
- All components will have unit + integration tests

### IV. Nx Monorepo Structure
✅ **PASS** - Extends existing libs/fleet-mcp library:
- No new projects created
- Follows existing structure: models/, repositories/, services/, clients/
- Changes contained within single library boundary

### V. Third-Party Dependency Management
✅ **PASS** - Taskfile binary will be managed in third_party/:
- third_party/hermit/taskfile.hcl (Hermit package definition)
- Version pinned and documented
- No scattered dependencies

### VI. Semantic Versioning & Independent Releases
✅ **PASS** - Library versioning:
- Current version: 0.2.0
- This feature adds new capability (metadata) → MINOR bump to 0.3.0
- Backward compatible (extends existing tools without breaking changes)

### VII. GitOps Deployment
✅ **PASS** - No deployment changes required:
- fleet-mcp already deployed via GitOps
- Configuration changes (Taskfile.yml) version-controlled
- No manual deployment steps

### VIII. Tool Availability
✅ **PASS** - Taskfile binary available via:
- third_party/hermit/taskfile.hcl
- Hermit auto-downloads on direnv allow
- No manual installation required

### IX. On-Demand Dependency Provisioning
✅ **PASS** - Dependencies auto-provisioned:
- Hermit handles Taskfile binary
- Python deps handled by uv
- direnv allow is sufficient

### X. Modular Library Design
✅ **PASS** - Single focused library:
- fleet-mcp library has clear responsibility (fleet management)
- Metadata feature fits within existing scope
- Minimal dependencies on other libraries
- Independent test suite preserved

**GATE STATUS: ✅ ALL CHECKS PASSED - Ready for Phase 0**

---

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 (Design & Contracts)*

### Design Review Against Constitution

✅ **ALL PRINCIPLES STILL SATISFIED**

**Phase 1 Deliverables**:
1. **research.md** - All unknowns resolved, decisions documented
2. **data-model.md** - Pydantic models for metadata entities
3. **contracts/** - HTTP API and MCP tool contracts
4. **quickstart.md** - User-facing documentation

**Architecture Validation**:
- No new dependencies added (using existing: FastMCP, Pydantic, httpx, Taskfile)
- Clean architecture layers maintained (models → repositories → services → tools)
- TDD-ready: All components designed with testability in mind
- Modular: Changes contained within libs/fleet-mcp boundary
- Deterministic: Taskfile binary will be pinned in third_party/hermit/

**Complexity Assessment**:
- No new projects created
- No custom parsers (using Taskfile CLI's JSON output)
- Reusing existing patterns (FastMCP custom routes, Pydantic models, async repositories)
- Error handling follows existing fleet-mcp patterns

**Post-Design Gate**: ✅ **PASSED** - Ready for Phase 2 (Implementation)

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
libs/fleet-mcp/
├── src/fleet_mcp/
│   ├── models/
│   │   ├── agent.py              # [MODIFIED] Add metadata field
│   │   ├── metadata.py           # [NEW] Metadata domain models
│   │   └── responses.py          # [MODIFIED] Add metadata to AgentResponse/ListAgentsResponse
│   │
│   ├── repositories/
│   │   ├── metadata_repository.py # [NEW] Metadata collection from workspaces
│   │   └── agent_repository.py    # [MODIFIED] Use MetadataRepository
│   │
│   ├── clients/
│   │   └── metadata_client.py    # [NEW] HTTP client for /metadata endpoint
│   │
│   ├── services/
│   │   └── agent_service.py      # [MODIFIED] Aggregate metadata in responses
│   │
│   ├── server/
│   │   ├── __init__.py           # [NEW] FastAPI/FastMCP HTTP server
│   │   └── metadata_endpoint.py  # [NEW] GET /metadata endpoint
│   │
│   └── tools/
│       ├── show_agent.py         # [MODIFIED] Include metadata in response
│       └── list_agents.py        # [MODIFIED] Include metadata in response
│
├── tests/
│   ├── models/
│   │   └── test_metadata.py      # [NEW] Metadata model tests
│   │
│   ├── repositories/
│   │   └── test_metadata_repository.py # [NEW] Repository tests
│   │
│   ├── clients/
│   │   └── test_metadata_client.py # [NEW] Client tests
│   │
│   ├── server/
│   │   └── test_metadata_endpoint.py # [NEW] Endpoint tests
│   │
│   └── integration/
│       └── test_metadata_e2e.py  # [NEW] End-to-end metadata flow
│
└── Taskfile.yml                  # [NEW] Metadata collection task definitions

third_party/hermit/
└── taskfile.hcl                  # [NEW] Taskfile binary definition
```

**Structure Decision**: Extends existing single-project structure (libs/fleet-mcp). New components follow clean architecture layers:
- **Domain Layer**: models/metadata.py (entities, value objects)
- **Data Access Layer**: repositories/metadata_repository.py, clients/metadata_client.py
- **Service Layer**: services/agent_service.py (orchestration)
- **Tool Layer**: tools/show_agent.py, tools/list_agents.py (MCP tools)
- **Server Layer**: server/metadata_endpoint.py (HTTP endpoint)

No new projects required - all changes within libs/fleet-mcp boundary.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitutional principles satisfied.
