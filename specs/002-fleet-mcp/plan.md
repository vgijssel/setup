# Implementation Plan: Fleet MCP Server

**Branch**: `002-fleet-mcp` | **Date**: 2025-10-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-fleet-mcp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a stateless MCP server using Python FastMCP that manages a fleet of Claude Code agents running in Coder workspaces. The server exposes tools for creating agents with different roles and projects, managing task lifecycles, querying agent status and history, and integrating with pull request workflows via metadata. All state is stored in Coder workspace metadata, making the MCP server fully stateless and querying Coder API for all information.

## Technical Context

**Language/Version**: Python 3.12 (matching existing repo standard)
**Primary Dependencies**: FastMCP (MCP server framework), Pydantic (data validation), httpx (HTTP client for Coder API)
**Storage**: N/A (stateless - all state in Coder workspace metadata)
**Testing**: pytest with pytest-vcr (record/replay fixtures against live Coder instance)
**Target Platform**: Linux server (Nx monorepo library)
**Project Type**: Single library project (libs/fleet-mcp)
**Package Manager**: uv (as specified)
**Performance Goals**: <500ms for role/project discovery, <1s for agent list queries, <3min for agent provisioning
**Constraints**: Stateless design (no local database), flat Pydantic parameter structures (MCP requirement), all parameters must have metadata annotations
**Scale/Scope**: Manage 10+ concurrent agents, support paginated task history (100+ tasks per agent)

**API Integration**:
- Coder Formal API (https://coder.com/docs/reference/api): Workspace management, template queries, task history
  - GET /api/v2/workspaces - List all workspaces
  - GET /api/v2/users/{owner}/workspace/{workspace-name} - Get workspace details and task history
  - POST /api/v2/workspaces/{id}/builds {"transition": "delete"} - Delete workspace
  - GET /api/v2/templates - List templates
  - GET /api/v2/templates/{id} - Get template details and parameters
- Task Reporting: Tasks are reported by agents using the `coder_report_task` MCP tool provided by Coder

**Key Design Constraints**:
- MCP tools require flat parameter structures (no nested objects) per https://gofastmcp.com/servers/tools#type-annotations
- All Pydantic parameters must include Field(..., description="...") metadata per https://gofastmcp.com/servers/tools#parameter-metadata
- pytest-vcr cassettes record live Coder API interactions for deterministic testing
- No mocks - tests must replay actual API responses

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Minimal Code & Dependency Reuse
✅ **PASS** - Using FastMCP (existing MCP framework), Pydantic (standard validation), httpx (battle-tested HTTP client). No custom HTTP client, no custom validation logic, no custom MCP protocol implementation.

### II. Deterministic Dependencies
✅ **PASS** - Will pin exact versions: `fastmcp==X.Y.Z`, `pydantic==X.Y.Z`, `httpx==X.Y.Z`, `pytest==X.Y.Z`, `pytest-vcr==X.Y.Z`. Using uv for deterministic dependency resolution.

### III. Test-Driven Design (TDD)
✅ **PASS** - pytest with pytest-vcr for contract testing against live Coder API. Tests will record real API responses as cassettes. Test structure: unit tests for data models, integration tests for API client, contract tests for MCP tools.

### IV. Nx Monorepo Structure
✅ **PASS** - Project located at `libs/fleet-mcp` following library pattern. Reusable library for fleet management, not an application.

### V. Third-Party Dependency Management
✅ **PASS** - Python dependencies managed via `third_party/python/` pattern established in repo. Will use existing Hermit integration for tool provisioning.

### VI. Semantic Versioning & Independent Releases
✅ **PASS** - Will use `nx release` for versioning. Library can be versioned independently of other monorepo packages.

### VII. GitOps Deployment
✅ **PASS** - MCP server deployed as library, consumed by applications. Deployment managed via stacks/ pattern with declarative configuration.

### VIII. Tool Availability
✅ **PASS** - Python tools (uv, pytest) available via existing `bin/` and Hermit setup. No new tool requirements.

### IX. On-Demand Dependency Provisioning
✅ **PASS** - Uses existing direnv + Hermit setup. `direnv allow` provisions Python environment automatically.

### X. Modular Library Design
✅ **PASS** - Single focused library: fleet management via MCP. Clear responsibility boundary. Minimal dependencies on other repo libraries. Independent test suite enables fast affected command execution.

**Overall Status**: ✅ ALL GATES PASS - Proceed to Phase 0

---

### Post-Design Re-evaluation (After Phase 1)

**Re-check Date**: 2025-10-29

All constitutional principles still satisfied after design phase:

✅ **I. Minimal Code**: Design confirms using FastMCP, Pydantic, httpx, pytest-vcr - all third-party packages. Custom code limited to domain models and API client wrappers.

✅ **II. Deterministic Dependencies**: pyproject.toml specifies exact versions for all dependencies (see quickstart.md).

✅ **III. TDD**: Comprehensive test strategy documented in quickstart.md with unit/integration/contract test layers. pytest-vcr ensures deterministic testing.

✅ **IV-X. All Other Principles**: Design maintains compliance. No new complexity introduced.

**Final Status**: ✅ ALL GATES PASS - Ready for Phase 2 (task generation via /speckit.tasks)

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
├── src/
│   └── fleet_mcp/
│       ├── __init__.py
│       ├── server.py              # FastMCP server initialization
│       ├── models/                 # Pydantic models for data validation
│       │   ├── __init__.py
│       │   ├── agent.py           # Agent, Task, Role, Project models
│       │   ├── requests.py        # MCP tool request models (flat structures)
│       │   └── responses.py       # MCP tool response models
│       ├── coder/                  # Coder API client
│       │   ├── __init__.py
│       │   ├── client.py          # HTTP client wrapper
│       │   ├── workspaces.py      # Workspace API calls (formal API)
│       │   ├── tasks.py           # AI Tasks API calls (beta API)
│       │   └── metadata.py        # Metadata operations
│       └── tools/                  # MCP tool implementations
│           ├── __init__.py
│           ├── agent_management.py # create/delete/list/show agents
│           ├── task_management.py  # start/stop task, show history
│           └── discovery.py        # list roles/projects
├── tests/
│   ├── cassettes/                  # pytest-vcr fixtures (gitignored secrets)
│   ├── unit/
│   │   ├── test_models.py
│   │   └── test_metadata.py
│   ├── integration/
│   │   ├── test_coder_client.py
│   │   └── test_task_lifecycle.py
│   └── contract/
│       └── test_mcp_tools.py       # E2E MCP tool tests with vcr
├── pyproject.toml                  # uv project config, dependencies
├── package.json                    # Nx integration
├── project.json                    # Nx targets (build, test, lint)
└── README.md
```

**Structure Decision**: Single library project (Option 1 variant) at `libs/fleet-mcp`. This is a focused library providing MCP tools for fleet management. Structure follows Python package conventions with clear separation of concerns: models (data), coder (external API), tools (MCP interface). Tests organized by type (unit/integration/contract) with pytest-vcr cassettes for API replay.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - All constitution checks passed. No violations to justify.
