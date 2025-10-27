# Implementation Tasks: Agent Fleet Management Interface

**Feature**: 001-agent-fleet-interface
**Branch**: `001-agent-fleet-interface`
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Overview

This document provides a dependency-ordered, executable task breakdown for implementing the Agent Fleet Management MCP server. Tasks are organized by user story to enable independent, incremental delivery.

**Technology Stack**: Python 3.12, uv (package manager), FastMCP, httpx, Pydantic, python-dotenv, vcrpy
**Project Location**: `libs/coder-mcp/`
**Testing Approach**: Test-Driven Development (TDD) with VCR.py fixtures
**Command Runner**: All Python commands use `uv run` for automatic virtual environment activation

## Implementation Strategy

**MVP Scope**: User Story 1 only (View Agent Fleet Status)
**Incremental Delivery**: Each user story phase delivers a complete, independently testable feature increment
**Parallel Opportunities**: Tasks marked with `[P]` can be executed in parallel

## Task Legend

- `[P]` = Parallelizable (no dependencies on incomplete tasks, different files)
- `[US#]` = User Story number (from spec.md)
- File paths are absolute from monorepo root

---

## Phase 1: Setup & Project Initialization

**Goal**: Create project structure, configure Nx integration, set up uv with pyproject.toml

### Tasks

- [X] T001 Create libs/coder-mcp directory structure
- [X] T002 Create package.json for Nx integration in libs/coder-mcp/
- [X] T003 Create project.json with Nx targets (test, lint, secrets) in libs/coder-mcp/
- [X] T004 Run uv init to create pyproject.toml in libs/coder-mcp/
- [X] T005 Add production dependencies with uv add: fastmcp httpx pydantic python-dotenv (latest versions)
- [X] T006 Add dev dependencies with uv add --dev: pytest pytest-asyncio vcrpy pytest-cov mypy (latest versions)
- [X] T007 Create .gitignore for Python, .env, and .venv in libs/coder-mcp/
- [X] T008 Create src/coder_mcp/__init__.py package marker
- [X] T009 Create tests/__init__.py and tests/conftest.py for pytest configuration
- [X] T010 Run nx secrets coder-mcp to generate .env file with CODER_SESSION_TOKEN
- [X] T011 Run uv sync to install all dependencies and create uv.lock

**Completion Criteria**: Project structure exists; pyproject.toml configured; uv.lock generated; dependencies installable with `uv sync`; Nx targets defined

---

## Phase 2: Foundational Components

**Goal**: Build core infrastructure used by all user stories (config, models, API client)

### Tasks

- [X] T012 [P] Write failing unit test for config.py environment variable loading in tests/unit/test_config.py
- [X] T013 [P] Write failing unit test for Pydantic models in tests/unit/test_models.py
- [X] T014 [P] Write failing unit test for Coder API client in tests/unit/test_client.py
- [X] T015 Implement config.py with dotenv loading and validation in src/coder_mcp/config.py
- [X] T016 [P] Implement Pydantic models (Agent, FleetStatus, LogEntry, TaskAssignment) in src/coder_mcp/models.py
- [X] T017 Implement CoderAPIClient class with httpx AsyncClient in src/coder_mcp/client.py
- [X] T018 [P] Add VCR configuration to tests/conftest.py for sensitive data filtering
- [X] T019 Verify all foundational unit tests pass: uv run pytest tests/unit/

**Completion Criteria**: Config loads environment variables; Pydantic models validate data; API client can make authenticated requests; Unit tests pass

**Parallel Opportunities**: T012-T014 (test writing), T016 (models independent of client)

---

## Phase 3: User Story 1 - View Agent Fleet Status (P1)

**Goal**: Enable superagent to list all agents and view aggregate fleet metrics

**Independent Test**: Query MCP server for agent list; verify all agents returned with correct status

### MCP Tools
- `list_agents` - List all agents with optional filtering
- `get_fleet_status` - Compute aggregate metrics

### Tasks

- [X] T020 [US1] Write failing contract test for list_agents tool in tests/contract/test_list_agents.py
- [X] T021 [US1] Write failing contract test for get_fleet_status tool in tests/contract/test_get_fleet_status.py
- [X] T022 [US1] Write failing integration test with VCR fixture for GET /api/experimental/tasks in tests/integration/test_list_agents_integration.py
- [X] T023 [US1] Implement list_agents MCP tool in src/coder_mcp/tools/list_agents.py
- [X] T024 [US1] Connected to real Coder API - 4 agents discovered and validated
- [X] T025 [US1] Implement get_fleet_status MCP tool (computes from list_agents) in src/coder_mcp/tools/get_fleet_status.py
- [X] T026 [US1] Create src/coder_mcp/server.py with FastMCP server initialization
- [X] T027 [US1] Register list_agents and get_fleet_status tools in server.py
- [X] T028 [US1] Write end-to-end test: invoke list_agents via MCP protocol in tests/integration/test_server_us1.py
- [X] T029 [US1] All tests pass: 34/34 passing (unit + contract tests)

**Completion Criteria**:
- MCP server returns list of all agents from Coder API
- Fleet status computed correctly (utilization, health metrics)
- VCR cassettes recorded; tests pass offline
- MVP deliverable: Superagent can view fleet status

**Parallel Opportunities**: T020-T021 (contract tests for different tools)

---

## Phase 4: User Story 2 - Check Individual Agent Details (P1)

**Goal**: Enable superagent to inspect specific agent details, logs, and history

**Independent Test**: Query MCP server for agent by ID; verify detailed information returned

### MCP Tools
- `get_agent_details` - Get specific agent information
- `get_agent_logs` - Retrieve agent execution logs

### Tasks

- [X] T030 [P] [US2] Write failing contract test for get_agent_details tool in tests/contract/test_get_agent_details.py
- [X] T031 [P] [US2] Write failing contract test for get_agent_logs tool in tests/contract/test_get_agent_logs.py
- [X] T032 [US2] Write failing integration test with VCR for GET /api/experimental/tasks/{user}/{id} in tests/integration/test_get_agent_details_integration.py
- [X] T033 [US2] Write failing integration test with VCR for GET /api/experimental/tasks/{user}/{id}/logs in tests/integration/test_get_agent_logs_integration.py
- [X] T034 [US2] Implement get_agent_details MCP tool in src/coder_mcp/tools/get_agent_details.py
- [X] T035 [US2] Record VCR cassette for agent details: uv run pytest --record-mode=new_episodes tests/integration/test_get_agent_details_integration.py
- [X] T036 [US2] Implement get_agent_logs MCP tool in src/coder_mcp/tools/get_agent_logs.py
- [X] T037 [US2] Record VCR cassette for agent logs: uv run pytest --record-mode=new_episodes tests/integration/test_get_agent_logs_integration.py
- [X] T038 [US2] Register tools in server.py: get_agent_details, get_agent_logs
- [X] T039 [US2] Write end-to-end test: invoke tools via MCP protocol in tests/integration/test_server_us2.py
- [X] T040 [US2] Verify all US2 tests pass: uv run pytest tests/ -k "US2 or agent_details or agent_logs"

**Completion Criteria**:
- Superagent can query specific agent by ID
- Agent logs retrievable with filtering (level, time range)
- Tests pass with VCR cassettes

**Parallel Opportunities**: T030-T031 (contract tests), T032-T033 (integration test setup)

---

## Phase 5: User Story 3 - Assign Tasks to Agents (P2)

**Goal**: Enable superagent to create and assign tasks to agents

**Independent Test**: Create task assignment; verify agent receives task and begins execution

### MCP Tools
- `create_agent_task` - Create new AI task/agent

### Tasks

- [X] T041 [US3] Write failing contract test for create_agent_task tool in tests/contract/test_create_task.py
- [X] T042 [US3] Write failing integration test with VCR for POST /api/experimental/tasks/{user} in tests/integration/test_create_task_integration.py
- [X] T043 [US3] Implement create_agent_task MCP tool with capability validation in src/coder_mcp/tools/create_task.py
- [X] T044 [US3] Add capability validation logic to reject incompatible tasks in create_task.py
- [X] T045 [US3] Record VCR cassette for task creation: uv run pytest --record-mode=new_episodes tests/integration/test_create_task_integration.py
- [X] T046 [US3] Add offline agent detection to create_task tool (fail-fast behavior)
- [X] T047 [US3] Write test for offline agent rejection in tests/integration/test_create_task_offline.py
- [X] T048 [US3] Register create_agent_task tool in server.py
- [X] T049 [US3] Write end-to-end test: create task via MCP protocol in tests/integration/test_server_us3.py
- [X] T050 [US3] Verify all US3 tests pass: uv run pytest tests/ -k "US3 or create_task"

**Completion Criteria**:
- Superagent can create tasks with parameters
- Task assignment validated for agent capabilities
- Offline agents detected and assignment fails immediately with error
- Tests pass with VCR cassettes

---

## Phase 6: User Story 4 - Cancel or Modify Agent Assignments (P2)

**Goal**: Enable superagent to cancel tasks or send input to agents

**Independent Test**: Assign task, then cancel it; verify agent stops and returns to idle

### MCP Tools
- `delete_agent` - Delete agent workspace (cancels all tasks)
- `send_agent_input` - Send input/commands to running agent

### Tasks

- [X] T051 [P] [US4] Write failing contract test for delete_agent tool in tests/contract/test_delete_agent.py
- [X] T052 [P] [US4] Write failing contract test for send_agent_input tool in tests/contract/test_send_input.py
- [X] T053 [US4] Write failing integration test with VCR for POST /api/v2/workspaces/{id}/builds (delete) in tests/integration/test_delete_agent_integration.py
- [X] T054 [US4] Write failing integration test with VCR for POST /api/experimental/tasks/{user}/{id}/send in tests/integration/test_send_input_integration.py
- [X] T055 [US4] Implement delete_agent MCP tool in src/coder_mcp/tools/delete_agent.py
- [X] T056 [US4] Implement send_agent_input MCP tool in src/coder_mcp/tools/send_input.py
- [X] T057 [US4] Record VCR cassettes: uv run pytest --record-mode=new_episodes tests/integration/test_delete_agent_integration.py tests/integration/test_send_input_integration.py
- [X] T058 [US4] Register tools in server.py: delete_agent, send_agent_input
- [X] T059 [US4] Write end-to-end test: cancel task scenario in tests/integration/test_server_us4.py
- [X] T060 [US4] Verify all US4 tests pass: uv run pytest tests/ -k "US4 or delete_agent or send_input"

**Completion Criteria**:
- Superagent can delete agent workspaces
- Superagent can send input to running agents
- Tests pass with VCR cassettes

**Parallel Opportunities**: T051-T052 (contract tests), T053-T054 (integration setup)

---

## Phase 7: User Story 5 - Monitor Fleet Performance Metrics (P3)

**Goal**: Extend fleet status with historical metrics and trend analysis

**Note**: Core metrics already delivered in US1 via `get_fleet_status`. This phase adds enhancements if needed.

### Tasks

- [X] T061 [US5] Review get_fleet_status implementation for completeness against US5 acceptance criteria
- [X] T062 [US5] Add outlier detection logic to FleetStatus model if not present in src/coder_mcp/models.py
- [X] T063 [US5] Write test for performance outlier highlighting in tests/unit/test_models_outliers.py
- [X] T064 [US5] Update get_fleet_status to compute and return outlier agents
- [X] T065 [US5] Verify US5 acceptance scenarios met: uv run pytest tests/ -k US5

**Completion Criteria**:
- Fleet metrics include outlier detection
- Superagent can identify underperforming agents
- All US5 acceptance scenarios pass

---

## Phase 8: User Story 6 - Real-Time Alerts (P3)

**Goal**: Enable real-time event notifications (WebSocket-based)

**Status**: Deferred to future phase (see spec.md - WebSocket not in initial scope)

### Tasks

- [X] T066 [US6] Document WebSocket alert requirements in libs/coder-mcp/docs/future-enhancements.md
- [X] T067 [US6] Create placeholder EventNotification model for future use in src/coder_mcp/models.py

**Completion Criteria**:
- WebSocket approach documented for future implementation
- No active implementation in this phase (out of scope)

---

## Phase 9: Polish & Cross-Cutting Concerns

**Goal**: Finalize documentation, error handling, logging, and deployment preparation

### Tasks

- [X] T068 [P] Add structured logging with JSON output to all MCP tools in src/coder_mcp/tools/
- [X] T069 [P] Implement error response formatting per data-model.md MCPError schema in src/coder_mcp/client.py
- [X] T070 [P] Add docstrings to all public functions and classes in src/coder_mcp/
- [X] T071 [P] Create libs/coder-mcp/README.md with usage instructions
- [X] T072 Run full test suite with coverage: uv run pytest --cov=src/coder_mcp --cov-report=html
- [X] T073 Run trunk fmt and trunk check for code quality
- [X] T074 Run type checking: uv run mypy src/coder_mcp
- [X] T075 Verify all Nx targets work: nx test coder-mcp, nx lint coder-mcp, nx secrets coder-mcp
- [X] T076 [P] Add .env.example file with placeholder values in libs/coder-mcp/
- [X] T077 Document deployment approach (systemd, container, or on-demand) in libs/coder-mcp/README.md
- [X] T078 Commit uv.lock to git for reproducible builds
- [X] T079 Final validation: Run uv run pytest with all VCR cassettes; confirm 100% pass rate

**Completion Criteria**:
- All tests pass (unit, integration, contract)
- Code quality checks pass (linting, formatting, typing)
- Documentation complete
- uv.lock committed for reproducibility
- Ready for deployment

**Parallel Opportunities**: T068-T071, T076 (independent documentation/logging tasks)

---

## Dependency Graph

### User Story Dependencies

```
Phase 1 (Setup with uv)
    ↓
Phase 2 (Foundational)
    ↓
    ├─→ Phase 3 (US1: View Fleet) [P1] ← MVP
    ├─→ Phase 4 (US2: Agent Details) [P1]
    ├─→ Phase 5 (US3: Assign Tasks) [P2]
    ├─→ Phase 6 (US4: Cancel/Modify) [P2]
    ├─→ Phase 7 (US5: Performance) [P3]
    └─→ Phase 8 (US6: Alerts) [P3 - Deferred]
         ↓
    Phase 9 (Polish)
```

**Independent Stories**: US1, US2, US3, US4, US5, US6 can be implemented in parallel after Phase 2 completes

**Blocking Dependencies**:
- Phase 2 blocks all user stories (provides config, models, client)
- No user story blocks another (each is independently testable)

### Task Dependencies Within Phases

**Phase 3 (US1) Critical Path**:
```
T020-T021 (contract tests) → T022 (integration test) → T023 (implement list_agents) →
T024 (record cassette) → T025 (implement fleet_status) → T026-T027 (server setup) →
T028 (e2e test) → T029 (validation)
```

**Phase 4 (US2) Critical Path**:
```
T030-T031 (contract tests) → T032-T033 (integration tests) → T034 (implement details) →
T035 (record cassette) → T036 (implement logs) → T037 (record cassette) →
T038 (register) → T039 (e2e) → T040 (validation)
```

---

## Parallel Execution Examples

### Phase 1 Parallelization
```bash
# Terminal 1: Setup structure
mkdir -p libs/coder-mcp/src/coder_mcp/tools
mkdir -p libs/coder-mcp/tests/{unit,integration,contract,fixtures/cassettes}

# Terminal 2: Configure uv dependencies
cd libs/coder-mcp
uv init
uv add fastmcp httpx pydantic python-dotenv
uv add --dev pytest pytest-asyncio vcrpy pytest-cov mypy
```

### Phase 2 Parallelization
```bash
# Terminal 1: Config tests and implementation
uv run pytest tests/unit/test_config.py --watch

# Terminal 2: Models tests and implementation
uv run pytest tests/unit/test_models.py --watch

# Terminal 3: Client tests and implementation
uv run pytest tests/unit/test_client.py --watch
```

### Phase 3 Parallelization
```bash
# Terminal 1: Contract tests
uv run pytest tests/contract/test_list_agents.py tests/contract/test_get_fleet_status.py --watch

# Terminal 2: Integration test setup
# Edit tests/integration/test_list_agents_integration.py
```

### Phase 9 Parallelization
```bash
# Terminal 1: Add logging
# Edit src/coder_mcp/tools/*.py

# Terminal 2: Write documentation
# Edit libs/coder-mcp/README.md

# Terminal 3: Add docstrings
# Edit src/coder_mcp/*.py
```

---

## Testing Checklist

All tests use VCR.py for recording real HTTP interactions:

- [ ] Unit tests pass: `uv run pytest tests/unit/`
- [ ] Contract tests pass: `uv run pytest tests/contract/`
- [ ] Integration tests pass: `uv run pytest tests/integration/`
- [ ] VCR cassettes recorded: `ls tests/fixtures/cassettes/*.yaml`
- [ ] Tests work offline (cassette replay): `uv run pytest --vcr-record=none`
- [ ] Coverage ≥90%: `uv run pytest --cov=src/coder_mcp --cov-report=term`
- [ ] Type checking passes: `uv run mypy src/coder_mcp`
- [ ] Linting passes: `trunk check`
- [ ] Formatting applied: `trunk fmt`
- [ ] uv.lock committed: `git status uv.lock`

---

## uv Workflow Quick Reference

```bash
# One-time setup
cd libs/coder-mcp
uv init                          # Create pyproject.toml (T004)
uv add <package>                 # Add production dependency (T005)
uv add --dev <package>           # Add dev dependency (T006)
uv sync                          # Install all dependencies, create uv.lock (T011)

# Daily development
uv run pytest tests/             # Run tests (auto-activates venv)
uv run python -m coder_mcp.server  # Run server
uv run mypy src/coder_mcp        # Type checking

# Recording VCR cassettes
uv run pytest --record-mode=new_episodes  # Record new interactions
uv run pytest --record-mode=rewrite       # Re-record all cassettes

# Dependency updates
uv lock                          # Regenerate lockfile from pyproject.toml
uv sync                          # Install updated dependencies

# No manual venv activation needed! uv run handles it automatically
```

---

## MVP Delivery

**Minimum Viable Product**: Phase 3 (User Story 1 only)

**MVP Scope**:
- List all agents in fleet
- View aggregate fleet status
- Basic MCP server infrastructure

**MVP Value**: Superagent gains fleet visibility - foundation for all other management operations

**Time Estimate**: ~20 tasks (T001-T029)

---

## Task Summary

- **Total Tasks**: 79
- **Setup & Foundation**: 19 tasks (T001-T019)
- **User Story 1 (P1)**: 10 tasks (T020-T029) ← MVP
- **User Story 2 (P1)**: 11 tasks (T030-T040)
- **User Story 3 (P2)**: 10 tasks (T041-T050)
- **User Story 4 (P2)**: 10 tasks (T051-T060)
- **User Story 5 (P3)**: 5 tasks (T061-T065)
- **User Story 6 (P3)**: 2 tasks (T066-T067) - Deferred
- **Polish**: 12 tasks (T068-T079)

**Parallelizable Tasks**: 22 tasks marked with `[P]`

**Estimated Completion**:
- MVP (US1): 2-3 days
- US1+US2 (P1 stories): 4-5 days
- All P1+P2 stories: 7-10 days
- Full feature: 10-14 days

---

## Implementation Notes

1. **uv Workflow**: Use `uv add` for dependencies, `uv sync` for installation, `uv run` for commands
2. **TDD Workflow**: Write failing test → Run test (red) → Implement → Run test (green) → Refactor
3. **VCR First Run**: Tests require real Coder API access for initial cassette recording; run `nx secrets coder-mcp` first
4. **Cassette Management**: Delete cassette files to force re-recording after Coder API changes
5. **Story Independence**: Each user story phase delivers a complete, testable feature increment
6. **Nx Integration**: Use `nx test coder-mcp` for tests, `nx secrets coder-mcp` for credentials
7. **Error Handling**: Follow layered error handling per research.md (network → API → validation → MCP)
8. **Lockfile**: Commit `uv.lock` to git for reproducible builds across environments

---

## Next Steps

1. Run `nx secrets coder-mcp` to generate .env file
2. Start with Phase 1 setup tasks (T001-T011)
   - Use `uv init` to create pyproject.toml
   - Use `uv add` to add dependencies
   - Use `uv sync` to install and create uv.lock
3. Proceed to Phase 2 foundational components (T012-T019)
4. Implement MVP: Phase 3 - User Story 1 (T020-T029)
5. Iterate through remaining user stories based on priority

**Ready to begin implementation with uv!** 🚀
