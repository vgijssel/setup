# Implementation Plan: Fleet MCP Clean Architecture

**Branch**: `003-fleet-mcp-clean` | **Date**: 2025-11-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-fleet-mcp-clean/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of fleet-mcp-clean: a Python-based MCP server for managing Claude Code agent fleets using clean architecture (5 layers: Tool → Service → Repository → Client → Coder API). Uses FastMCP framework, Pydantic for validation, and HTTPX for API communication. Includes AI-compatible testing strategy with VCR cassette-based mocks and pytest. Stateless design with all agent state stored in Coder workspace metadata.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastMCP (MCP server framework), Pydantic (data validation), HTTPX 0.28.1 (HTTP client)
**Storage**: None (stateless - all state in Coder workspace metadata)
**Testing**: pytest with respx 0.22.0 (HTTPX mocking), pytest-vcr (cassette recording only)
**Target Platform**: Linux server (Coder workspace environment)
**Project Type**: Single project (library)
**Performance Goals**: <2s to list 100+ agents, <60s agent creation, <5s task cancellation
**Constraints**: Stateless design (no local database), clean architecture enforcement, all tests use mocks (no live API in tests)
**Scale/Scope**: Support 100+ concurrent agents, 1000+ task history entries per agent with pagination

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Minimal Code & Dependency Reuse** | ✅ PASS | Using FastMCP (existing framework), Pydantic (standard validation), HTTPX (battle-tested HTTP client), pytest+respx (standard testing). Custom code limited to business logic in Service layer. |
| **II. Deterministic Dependencies** | ✅ PASS | All dependencies pinned: httpx==0.28.1, respx==0.22.0. Will use exact versions for FastMCP, Pydantic, pytest, pytest-vcr. |
| **III. Test-Driven Design (TDD)** | ✅ PASS | Feature spec includes comprehensive test scenarios. VCR cassettes provide test data. Each layer tested independently. Tests will be written before implementation. |
| **IV. Nx Monorepo Structure** | ✅ PASS | Project located in libs/fleet-mcp-clean following libs/ convention for reusable libraries. Follows existing pattern (libs/fleet-mcp). |
| **V. Third-Party Dependency Management** | ✅ PASS | Dependencies in project requirements.txt, managed via third_party/ Python ecosystem tooling. |
| **VI. Semantic Versioning & Independent Releases** | ✅ PASS | Will use semantic versioning. Independent release via nx release. Initial version 0.1.0. |
| **VII. GitOps Deployment** | ✅ PASS | MCP server deployed via Coder workspace configuration (declarative). No manual deployment steps. |
| **VIII. Tool Availability** | ✅ PASS | Project uses standard monorepo tooling available in bin/. No new tools required. |
| **IX. On-Demand Dependency Provisioning** | ✅ PASS | Python dependencies provisioned via standard requirements.txt and pip/poetry. Follows existing pattern. |
| **X. Modular Library Design** | ✅ PASS | Single focused library with clear responsibility: agent fleet management. Clean architecture ensures modularity within the library (5 independent layers). Small, isolated test suites per layer enable Nx affected testing. |

**Gate Result**: ✅ **PASS** - All constitutional principles satisfied. No violations requiring justification.

### Post-Design Re-Evaluation (Phase 1 Complete)

After completing Phase 1 design (data models, contracts, quickstart):

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| **I. Minimal Code & Dependency Reuse** | ✅ PASS | Design confirms use of standard libraries only. No custom framework development. |
| **II. Deterministic Dependencies** | ✅ PASS | All dependencies specified with exact versions in research.md (httpx==0.28.1, respx==0.22.0). |
| **III. Test-Driven Design (TDD)** | ✅ PASS | Testing strategy defined with VCR cassette → respx mock workflow. Layer-specific test organization confirmed. |
| **IV. Nx Monorepo Structure** | ✅ PASS | Project structure follows libs/ convention. Clear boundaries with existing fleet-mcp. |
| **V. Third-Party Dependency Management** | ✅ PASS | Dependencies will be in requirements.txt, following monorepo patterns. |
| **VI. Semantic Versioning & Independent Releases** | ✅ PASS | Initial version 0.1.0 planned. Release via nx release workflow. |
| **VII. GitOps Deployment** | ✅ PASS | Deployment via Coder workspace resource definitions (declarative). |
| **VIII. Tool Availability** | ✅ PASS | No new tools required. Uses existing bin/ tooling. |
| **IX. On-Demand Dependency Provisioning** | ✅ PASS | Standard Python dependency provisioning via requirements.txt. |
| **X. Modular Library Design** | ✅ PASS | 5-layer architecture provides internal modularity. Each layer independently testable. |

**Post-Design Gate Result**: ✅ **PASS** - Design artifacts maintain constitutional compliance. No new violations introduced.

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
├── fleet_mcp_clean/
│   ├── __init__.py
│   ├── tools/              # Layer 1: MCP tool entry points
│   │   ├── __init__.py
│   │   ├── list_agents.py
│   │   ├── show_agent.py
│   │   ├── create_agent.py
│   │   ├── delete_agent.py
│   │   ├── restart_agent.py
│   │   ├── start_agent_task.py
│   │   ├── cancel_agent_task.py
│   │   ├── show_agent_task_history.py
│   │   ├── show_agent_log.py
│   │   ├── list_agent_projects.py
│   │   └── list_agent_roles.py
│   ├── services/           # Layer 2: Business logic
│   │   ├── __init__.py
│   │   ├── agent_service.py
│   │   ├── task_service.py
│   │   └── project_service.py
│   ├── repositories/       # Layer 3: Data access
│   │   ├── __init__.py
│   │   ├── agent_repository.py
│   │   ├── task_repository.py
│   │   └── template_repository.py
│   ├── clients/            # Layer 4: API communication
│   │   ├── __init__.py
│   │   └── coder_client.py
│   ├── models/             # Pydantic models (used across layers)
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── task.py
│   │   ├── project.py
│   │   └── workspace.py
│   └── server.py           # FastMCP server entry point
├── tests/
│   ├── cassettes/          # VCR cassettes (recorded once)
│   │   ├── create_workspace_success.yaml
│   │   ├── get_workspace_success.yaml
│   │   ├── list_workspaces_success.yaml
│   │   └── ...
│   ├── fixtures/           # Mock factories based on cassettes
│   │   ├── __init__.py
│   │   ├── agent_fixtures.py
│   │   ├── workspace_fixtures.py
│   │   └── cassette_loader.py
│   ├── tools/              # Layer 1 tests (mock Service)
│   │   ├── test_list_agents.py
│   │   ├── test_create_agent.py
│   │   └── ...
│   ├── services/           # Layer 2 tests (mock Repository)
│   │   ├── test_agent_service.py
│   │   ├── test_task_service.py
│   │   └── ...
│   ├── repositories/       # Layer 3 tests (mock Client)
│   │   ├── test_agent_repository.py
│   │   ├── test_task_repository.py
│   │   └── ...
│   ├── clients/            # Layer 4 tests (mock HTTP with respx)
│   │   └── test_coder_client.py
│   ├── record.py           # VCR cassette recording script
│   └── conftest.py         # Shared pytest fixtures
├── pyproject.toml          # Project metadata & dependencies
├── requirements.txt        # Pinned dependencies
└── README.md
```

**Structure Decision**: Single project library using clean architecture. 5-layer separation (Tools, Services, Repositories, Clients, Models) enforces unidirectional dependency flow. Test structure mirrors source structure with independent test suites per layer. VCR cassettes recorded separately and used to generate test fixtures/mocks.

### VCR Recording Script (tests/record.py)

The record.py script is used to record all Coder API interactions as VCR cassettes. This is a one-time operation that captures real API responses for use in tests.

**Prerequisites**:
- Live Coder instance accessible
- Environment variables set:
  - `CODER_URL`: Base URL of Coder instance (e.g., `https://coder.example.com`)
  - `CODER_SESSION_TOKEN`: Valid authentication token from `coder tokens create`
- Test workspace template available with required parameters (ai_prompt, system_prompt)

**Example Implementation**:

```python
import asyncio
import os
from fleet_mcp_clean.clients.coder_client import CoderClient

# Configuration from environment
CODER_URL = os.environ["CODER_URL"]
CODER_SESSION_TOKEN = os.environ["CODER_SESSION_TOKEN"]

async def record(vcr_instance):
    """Record all Coder API interactions to VCR cassettes

    This function executes a complete workflow against a live Coder instance,
    recording each API interaction as a separate cassette file.

    Raises:
        ValueError: If required environment variables are missing
        httpx.HTTPError: If Coder API requests fail
        TimeoutError: If workspace provisioning exceeds timeout
    """
    if not CODER_URL or not CODER_SESSION_TOKEN:
        raise ValueError("Missing required environment variables: CODER_URL, CODER_SESSION_TOKEN")

    client = CoderClient(base_url=CODER_URL, token=CODER_SESSION_TOKEN)

    try:

        # Create workspace
        with vcr_instance.use_cassette("create_workspace_success.yaml"):
            workspace = await client.create_workspace(
                name="test-agent",
                template_id="<template-id>",
                rich_parameters={"ai_prompt": "Test task", "system_prompt": "Test system"}
            )

        # Waiting for client readiness doesn't need to be recorded
        # Poll workspace status until build completes
        await wait_for_workspace_until_is_idle(client, workspace.id, timeout=120)

        # Get workspace details
        with vcr_instance.use_cassette("get_workspace_success.yaml"):
            client.get_workspace()

        # List all workspaces
        with vcr_instance.use_cassette("list_workspaces_success.yaml"):
            client.list_workspaces()

        # List templates (projects)
        with vcr_instance.use_cassette("list_templates_success.yaml"):
            client.list_templates()

        # Get specific template
        with vcr_instance.use_cassette("get_template_success.yaml"):
            client.get_template()

        # Get template rich parameters
        with vcr_instance.use_cassette("get_template_version_rich_parameters_success.yaml"):
            client.get_template_version_rich_parameters()

        # Get template version presets (roles)
        with vcr_instance.use_cassette("get_template_version_presets_success.yaml"):
            client.get_template_version_presets()

        # Get organization ID
        with vcr_instance.use_cassette("get_organization_success.yaml"):
            client._get_org_id()

        # Send super simple task input
        with vcr_instance.use_cassette("send_task_input_success.yaml"):
            client.send_task_input()

        # Wait until task is complete
        await wait_for_workspace_until_is_idle(client)

        # Get task logs
        with vcr_instance.use_cassette("get_task_logs_success.yaml"):
            client.get_task_logs()

        # Get task status
        with vcr_instance.use_cassette("get_task_success.yaml"):
            client.get_task()

        # Send AgentAPI interrupt (Ctrl+C)
        with vcr_instance.use_cassette("send_agentapi_interrupt_success.yaml"):
            client.send_interrupt()

        # Delete workspace
        with vcr_instance.use_cassette("delete_workspace_success.yaml"):
            await client.delete_workspace(workspace.id)

        # Wait until deletion is complete
        await wait_until_workspace_is_deleted(client, workspace.id, timeout=60)

    except Exception as e:
        print(f"Error during VCR recording: {e}")
        # Cleanup: attempt to delete test workspace if it exists
        try:
            await client.delete_workspace(workspace.id)
        except:
            pass
        raise

# Entry point for recording script
if __name__ == "__main__":
    import vcr

    vcr_instance = vcr.VCR(
        cassette_library_dir="tests/cassettes",
        record_mode="new_episodes",
        match_on=["method", "scheme", "host", "port", "path", "query"],
        filter_headers=["authorization"],  # Remove sensitive tokens from cassettes
    )

    asyncio.run(record(vcr_instance))
    print("✓ All VCR cassettes recorded successfully")
```

**Usage**:
```bash
# Set environment variables
export CODER_URL="https://coder.example.com"
export CODER_SESSION_TOKEN="$(coder tokens create --lifetime 24h)"

# Run recording script
cd libs/fleet-mcp-clean
python tests/record.py
```

**Key Characteristics**:
- Records complete agent lifecycle: create → task execution → interruption → deletion
- Each API call wrapped in `use_cassette()` context manager
- Wait operations (polling) excluded from recording to keep cassettes clean
- Cassette files stored in `tests/cassettes/` directory
- Once recorded, cassettes used to generate respx mocks for tests

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
