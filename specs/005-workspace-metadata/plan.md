# Implementation Plan: Workspace Metadata in fleet-mcp

**Branch**: `005-workspace-metadata` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-workspace-metadata/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extend the fleet-mcp MCP server to return workspace metadata (git branch, commit SHA, custom fields) when showing or listing agents. Metadata is defined in a YAML configuration file and collected by executing commands within agent workspaces. This enables PR tracking workflows and visibility into agent workspace state.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: FastMCP 2.13.0.2, Pydantic 2.12.3, httpx 0.28.1, PyYAML (to be added), Jinja2 (to be added)
**Storage**: YAML configuration file for metadata schema, Coder workspace API for runtime data
**Testing**: pytest 7.4.3, pytest-asyncio 0.21.1, respx 0.22.0 for HTTP mocking
**Target Platform**: Linux server (Coder workspace environment)
**Project Type**: Single library project (libs/fleet-mcp)
**Performance Goals**: Metadata collection adds <500ms latency with caching, <10s timeout per field
**Constraints**: Must handle git command failures gracefully, no blocking on metadata collection failures
**Scale/Scope**: Expected 10-50 agents per fleet, 5-15 metadata fields per agent, caching for 30-60 seconds

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Minimal Code & Dependency Reuse
✅ **PASS** - Will use third-party packages:
- PyYAML for YAML parsing (industry standard)
- Jinja2 for variable templating (battle-tested)
- Existing httpx, pytest, respx infrastructure

No custom YAML parser or templating engine needed.

### II. Deterministic Dependencies
✅ **PASS** - All dependencies will be pinned:
- PyYAML==6.0.2 (exact version)
- Jinja2==3.1.5 (exact version)
- Existing dependencies already pinned in pyproject.toml

### III. Test-Driven Design (TDD)
✅ **PASS** - Will follow strict TDD:
- Write failing tests first for metadata collection
- Write failing tests for YAML schema validation
- Write failing tests for command execution safety
- Existing test infrastructure (pytest, respx) in place

### IV. Nx Monorepo Structure
✅ **PASS** - Extending existing libs/fleet-mcp library:
- No new apps or stacks needed
- Fits within existing library boundaries
- Uses established src/fleet_mcp structure

### V. Third-Party Dependency Management
✅ **PASS** - Dependencies added to pyproject.toml:
- PyYAML and Jinja2 added to [project.dependencies]
- Version pinning follows Principle II

### VI. Semantic Versioning & Independent Releases
✅ **PASS** - Version bump from 0.2.0 → 0.3.0 (MINOR):
- Backward-compatible functionality addition
- Metadata fields are optional additions to Agent model
- Existing API contracts unchanged

### VII. GitOps Deployment
✅ **PASS** - No infrastructure changes:
- Fleet-mcp runs in existing Coder workspaces
- YAML config deployed via Git
- No manual deployment steps

### VIII. Tool Availability
✅ **PASS** - No new tools required:
- Uses existing bin/ infrastructure
- Python/uv already available via direnv

### IX. On-Demand Dependency Provisioning
✅ **PASS** - Existing direnv setup handles:
- Python environment activation
- uv package installation
- No user intervention needed

### X. Modular Library Design
✅ **PASS** - Follows existing clean architecture:
- New MetadataRepository (Layer 3 - Data Access)
- New MetadataClient for HTTP endpoint (Layer 4)
- Integration with existing AgentService (Layer 2)
- Isolated test suite with mocked dependencies

**GATE STATUS**: ✅ ALL CHECKS PASSED - Proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/005-workspace-metadata/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── metadata-schema.yaml    # YAML schema definition
│   └── http-api.yaml           # HTTP /metadata endpoint spec
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
libs/fleet-mcp/
├── src/fleet_mcp/
│   ├── models/
│   │   ├── agent.py            # MODIFIED: Add metadata fields
│   │   ├── metadata.py         # NEW: Metadata domain models
│   │   └── responses.py        # MODIFIED: Add metadata to responses
│   ├── services/
│   │   ├── agent_service.py    # MODIFIED: Integrate metadata collection
│   │   └── metadata_service.py # NEW: Metadata business logic (Layer 2)
│   ├── repositories/
│   │   └── metadata_repository.py  # NEW: Metadata data access (Layer 3)
│   ├── clients/
│   │   ├── coder_client.py     # MODIFIED: Add workspace command execution
│   │   └── metadata_client.py  # NEW: HTTP client for /metadata endpoint (Layer 4)
│   ├── config/
│   │   ├── metadata_config.py  # NEW: YAML config loader
│   │   └── default_metadata.yaml  # NEW: Default git metadata config
│   └── http/
│       └── metadata_endpoint.py  # NEW: FastAPI/FastMCP HTTP endpoint
│
└── tests/
    ├── unit/
    │   ├── models/test_metadata.py
    │   ├── config/test_metadata_config.py
    │   └── services/test_metadata_service.py
    ├── integration/
    │   ├── repositories/test_metadata_repository.py
    │   └── test_metadata_http_endpoint.py
    └── fixtures/
        └── metadata_fixtures.py
```

**Structure Decision**: Single library project extending libs/fleet-mcp. Follows existing clean architecture with 4 layers (Tools → Services → Repositories → Clients). New components integrate seamlessly with existing Agent entity and MCP tools.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitutional principles followed.

---

## Post-Phase 1 Constitution Re-Check

**Date**: 2025-11-12

After completing Phase 0 (Research) and Phase 1 (Design), re-evaluating constitutional compliance:

### I. Minimal Code & Dependency Reuse
✅ **STILL PASSING**
- PyYAML 6.0.2 and Jinja2 3.1.5 confirmed as industry-standard choices
- No custom parsers or templating engines implemented
- Reusing existing httpx, pytest, respx infrastructure

### II. Deterministic Dependencies
✅ **STILL PASSING**
- PyYAML==6.0.2 pinned (exact version)
- Jinja2==3.1.5 pinned (exact version)
- All contract files specify versions

### III. Test-Driven Design (TDD)
✅ **STILL PASSING**
- Data model designed with Pydantic validators (testable)
- Contract specifications define test scenarios
- Quickstart includes error cases (null values)
- Ready for TDD implementation in Phase 2

### IV. Nx Monorepo Structure
✅ **STILL PASSING**
- Confirmed extension of libs/fleet-mcp
- No new projects created
- Source structure follows existing conventions

### V. Third-Party Dependency Management
✅ **STILL PASSING**
- Dependencies will be added to pyproject.toml
- No scattered dependency declarations

### VI. Semantic Versioning & Independent Releases
✅ **STILL PASSING**
- Version bump 0.2.0 → 0.3.0 confirmed (MINOR)
- Backward-compatible Agent model changes (optional fields)
- No breaking API changes

### VII. GitOps Deployment
✅ **STILL PASSING**
- YAML config deployed via Git
- HTTP endpoint uses existing FastMCP server
- No manual deployment steps

### VIII. Tool Availability
✅ **STILL PASSING**
- No new tools required
- Uses existing bin/ infrastructure

### IX. On-Demand Dependency Provisioning
✅ **STILL PASSING**
- direnv handles Python environment
- uv installs dependencies automatically

### X. Modular Library Design
✅ **STILL PASSING**
- Clean architecture maintained:
  - MetadataClient (Layer 4 - HTTP)
  - MetadataRepository (Layer 3 - Data Access)
  - MetadataService (Layer 2 - Business Logic)
  - Integration with existing AgentService
- Isolated test suites designed

**FINAL GATE STATUS**: ✅ ALL CHECKS PASSED - Ready for Phase 2 Implementation

### Design Validation Summary

1. **Architecture**: Clean 4-layer architecture preserved
2. **Contracts**: OpenAPI spec and YAML schema defined
3. **Data Model**: 9 entities/models designed with Pydantic
4. **Security**: Command injection prevention via Jinja2 sandboxing
5. **Performance**: Two-tier caching strategy (variable + metadata)
6. **Error Handling**: Graceful degradation (null values, non-blocking)
7. **Backward Compatibility**: Optional fields in Agent model

**No design issues found. Proceeding to `/speckit.tasks` for implementation planning.**
