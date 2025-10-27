# Implementation Plan: Agent Fleet Management Interface

**Branch**: `001-agent-fleet-interface` | **Date**: 2025-10-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-agent-fleet-interface/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Model Context Protocol (MCP) server using Python FastMCP that provides a stateless interface for superagents to manage a fleet of AI agents running on Coder.com workspaces. The MCP server exposes tools for viewing agent status, assigning tasks, monitoring progress, and controlling agent lifecycle by communicating with Coder's experimental AI tasks REST API. All agent state is maintained by Coder workspaces; the MCP server acts as a pure interface layer with no persistent state.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: FastMCP (MCP server framework), httpx (HTTP client for Coder API), python-dotenv (environment variable loading)
**Storage**: N/A (stateless - all state queried from Coder API)
**Testing**: pytest with pytest-asyncio for async tests, vcrpy (python-vcr) for capturing real HTTP fixtures
**Target Platform**: Linux server (Nx monorepo library)
**Project Type**: Single library (MCP server)
**Performance Goals**: <500ms response time for MCP tool calls; support up to 1000 agents
**Constraints**: Must be stateless; all data fetched from Coder API on demand; <2 seconds for fleet-wide queries
**Scale/Scope**: Single MCP server library with 10-15 MCP tools mapping to Coder AI tasks API endpoints; Nx integration with package.json

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Minimal Code & Dependency Reuse ✅
- **Status**: PASS
- **Analysis**: Using FastMCP (third-party MCP framework) instead of implementing MCP protocol from scratch; using httpx for HTTP client instead of custom implementation; using python-dotenv for environment variable loading instead of custom config handling
- **Justification**: All core functionality delegated to well-maintained packages

### II. Deterministic Dependencies ✅
- **Status**: PASS
- **Analysis**: Will pin exact versions in requirements.txt (e.g., `fastmcp==0.5.0`, `httpx==0.27.0`) and package.json
- **Action Required**: Ensure all dependencies pinned during implementation

### III. Test-Driven Design (TDD) ✅
- **Status**: PASS
- **Analysis**: pytest configured; contract tests for MCP tools, unit tests for Coder API client, integration tests for end-to-end flows
- **Action Required**: Write tests BEFORE implementation for each MCP tool

### IV. Nx Monorepo Structure ✅
- **Status**: PASS
- **Analysis**: Located in `libs/coder-mcp` following Nx library pattern; clear boundary as reusable MCP server library
- **Structure**: `libs/coder-mcp/` with standard Python library layout

### V. Third-Party Dependency Management ✅
- **Status**: PASS
- **Analysis**: Dependencies (FastMCP, httpx, 1password-sdk) will be declared in requirements.txt within libs/coder-mcp
- **Note**: Python dependencies managed per-project, not in centralized third_party/ (follows Python ecosystem conventions)

### VI. Semantic Versioning & Independent Releases ✅
- **Status**: PASS
- **Analysis**: Library will use independent semantic versioning; `nx release` for release management
- **Initial Version**: 0.1.0 (pre-release)

### VII. GitOps Deployment ⚠️
- **Status**: DEFERRED
- **Analysis**: MCP server deployment strategy not specified in this phase
- **Action Required**: Deployment mechanism to be defined during tasks phase (e.g., systemd service, container, or on-demand execution)

### VIII. Tool Availability ✅
- **Status**: PASS
- **Analysis**: Python dependencies provisioned via direnv/Hermit in existing repo setup
- **Note**: No new tools required beyond existing Python toolchain

### IX. On-Demand Dependency Provisioning ✅
- **Status**: PASS
- **Analysis**: Existing direnv setup handles Python environment; users run `direnv allow` as normal
- **Dependencies**: Python 3.12, pip managed via existing mechanisms

### X. Modular Library Design ✅
- **Status**: PASS
- **Analysis**: Single focused library with clear responsibility: MCP interface to Coder API; minimal dependencies; independently testable
- **Scope**: ~500-1000 LOC for MCP tools + Coder API client wrapper

**Overall Assessment**: ✅ PASS (1 deferred item for later phase)

---

### Post-Design Re-Evaluation

**Date**: 2025-10-27 (after Phase 1 design completion)

All constitutional principles remain satisfied after completing research, data model, and API contract design:

- ✅ **Minimal Code**: Design confirms use of FastMCP, httpx, Pydantic, python-dotenv, vcrpy - no custom protocol/HTTP/validation implementations
- ✅ **Deterministic Dependencies**: research.md specifies exact versions for all production and dev dependencies
- ✅ **TDD**: quickstart.md documents TDD workflow; contracts/ provides schemas for contract testing
- ✅ **Nx Structure**: Project structure finalized in `libs/coder-mcp/` with proper package.json/project.json integration
- ✅ **Third-Party Management**: Dependencies centralized in requirements.txt within library
- ✅ **Semantic Versioning**: Initial version 0.1.0 planned; nx release configured
- ⚠️ **GitOps Deployment**: Still deferred to tasks phase (no change from initial assessment)
- ✅ **Tool Availability**: No new tools needed beyond existing Python toolchain
- ✅ **On-Demand Provisioning**: direnv integration confirmed in quickstart
- ✅ **Modular Design**: Single-responsibility library with clear API boundary; ~7 MCP tools, each in separate file

**Design Additions That Preserve Constitutional Compliance**:
- Data model uses Pydantic (third-party) instead of custom validation
- Error handling uses standard Python exceptions with custom hierarchy (minimal custom code)
- Stateless design eliminates need for database/ORM dependencies
- Tool-per-file organization keeps test suites small and focused

**Final Assessment**: ✅ ALL CHECKS PASS - Ready to proceed to tasks phase

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
libs/coder-mcp/
├── package.json              # Nx integration manifest
├── project.json              # Nx project configuration
├── pyproject.toml            # Python project metadata
├── requirements.txt          # Pinned dependencies
├── .env                      # Generated by Nx secrets target (gitignored)
├── src/
│   └── coder_mcp/
│       ├── __init__.py
│       ├── server.py         # FastMCP server setup & tool registration
│       ├── client.py         # Coder API HTTP client wrapper
│       ├── config.py         # Environment variable loading & validation
│       ├── tools/            # MCP tool implementations
│       │   ├── __init__.py
│       │   ├── list_agents.py
│       │   ├── get_agent.py
│       │   ├── create_task.py
│       │   ├── delete_task.py
│       │   ├── send_input.py
│       │   └── get_logs.py
│       └── models.py         # Pydantic models for API responses
└── tests/
    ├── fixtures/             # VCR cassettes (recorded HTTP responses)
    ├── contract/             # MCP tool contract tests
    ├── integration/          # End-to-end tests with VCR fixtures
    └── unit/                 # Unit tests for client/config modules
```

**Structure Decision**: Single library layout following Python package conventions. The `libs/coder-mcp/` directory integrates into Nx via `package.json` and `project.json`. Source code in `src/coder_mcp/` for proper Python packaging. MCP tools organized in `tools/` subpackage with one file per tool for clarity and testability.

## Complexity Tracking

No constitutional violations requiring justification. All checks pass.
