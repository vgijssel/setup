# Tasks: Fleet MCP Server

**Input**: Design documents from `/specs/002-fleet-mcp/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: Following TDD approach - tests MUST be written first and MUST FAIL before implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a single library project: `libs/fleet-mcp/`
- Source: `libs/fleet-mcp/src/fleet_mcp/`
- Tests: `libs/fleet-mcp/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure: libs/fleet-mcp/{src/fleet_mcp/{models,coder,tools},tests/{unit,integration,contract,cassettes}}
- [X] T002 Initialize Python project with uv in libs/fleet-mcp/pyproject.toml
- [X] T003 [P] Configure pytest and pytest-vcr in libs/fleet-mcp/tests/conftest.py
- [X] T004 [P] Create Nx configuration in libs/fleet-mcp/package.json with targets (test, lint, build, secrets)
- [X] T005 [P] Create secrets template in libs/fleet-mcp/.env.tpl with Coder URL and token
- [X] T006 [P] Add libs/fleet-mcp/.env and libs/fleet-mcp/tests/cassettes/*.yaml to .gitignore
- [X] T007 Generate initial .env file using nx run fleet-mcp:secrets

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests for Foundational Layer (TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T008 [P] Write unit test for AgentStatus enum in libs/fleet-mcp/tests/unit/test_models.py
- [X] T009 [P] Write unit test for Agent model validation in libs/fleet-mcp/tests/unit/test_models.py
- [X] T010 [P] Write unit test for Task model validation in libs/fleet-mcp/tests/unit/test_models.py
- [X] T011 [P] Write unit test for Role model validation in libs/fleet-mcp/tests/unit/test_models.py
- [X] T012 [P] Write unit test for Project model validation in libs/fleet-mcp/tests/unit/test_models.py
- [X] T013 [P] Write integration test for CoderClient initialization in libs/fleet-mcp/tests/integration/test_coder_client.py
- [X] T014 [P] Write integration test for workspace creation in libs/fleet-mcp/tests/integration/test_coder_client.py with pytest-vcr
- [X] T015 [P] Write integration test for workspace listing in libs/fleet-mcp/tests/integration/test_coder_client.py with pytest-vcr
- [X] T016 [P] Write integration test for workspace deletion in libs/fleet-mcp/tests/integration/test_coder_client.py with pytest-vcr

### Implementation for Foundational Layer

- [X] T017 [P] Implement AgentStatus enum in libs/fleet-mcp/src/fleet_mcp/models/agent.py
- [X] T018 [P] Implement Agent Pydantic model with metadata field in libs/fleet-mcp/src/fleet_mcp/models/agent.py
- [X] T019 [P] Implement Task Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/task.py
- [X] T020 [P] Implement Role Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/role.py
- [X] T021 [P] Implement Project Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/project.py
- [X] T022 Implement agent_from_workspace helper in libs/fleet-mcp/src/fleet_mcp/models/agent.py (depends on T017-T018)
- [X] T023 [P] Implement response models (CreateAgentResponse, AgentListResponse, AgentSummary) in libs/fleet-mcp/src/fleet_mcp/models/responses.py
- [X] T024 [P] Implement additional response models (AgentDetailsResponse, TaskHistoryResponse) in libs/fleet-mcp/src/fleet_mcp/models/responses.py
- [X] T025 [P] Implement StartTaskResponse and CancelTaskResponse in libs/fleet-mcp/src/fleet_mcp/models/responses.py
- [X] T026 [P] Implement DeleteAgentResponse, ListRolesResponse, ListProjectsResponse in libs/fleet-mcp/src/fleet_mcp/models/responses.py
- [X] T027 Implement CoderClient class with httpx in libs/fleet-mcp/src/fleet_mcp/coder/client.py (depends on T013-T016)
- [X] T028 Implement create_workspace method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [X] T029 [P] Implement list_workspaces method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [X] T030 [P] Implement get_workspace method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [X] T031 [P] Implement delete_workspace method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [X] T032 Verify all foundational tests pass with nx test fleet-mcp

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Monitor Agent Fleet (Priority: P1) 🎯 MVP

**Goal**: Enable operators to spin up multiple Claude Code agents, assign them specs, and monitor their status and progress through the MCP interface

**Independent Test**: Can be fully tested by creating agents through the MCP server, assigning them specs, and querying their status and task history. Delivers immediate value by enabling parallel work across multiple agents.

### Tests for User Story 1 (TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T033 [P] [US1] Write contract test for create_agent tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [X] T034 [P] [US1] Write contract test for create_agent with invalid name in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [X] T035 [P] [US1] Write contract test for create_agent with invalid project in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [X] T036 [P] [US1] Write contract test for list_agents tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [X] T037 [P] [US1] Write contract test for show_agent tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [X] T038 [P] [US1] Write contract test for show_agent with non-existent agent in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [X] T039 [P] [US1] Write contract test for show_agent_task_history tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [X] T040 [P] [US1] Write contract test for task history pagination in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [X] T041 [P] [US1] Write integration test for metadata extraction from workspace in libs/fleet-mcp/tests/integration/test_metadata.py

### Implementation for User Story 1

- [X] T042 [P] [US1] Implement get_workspace_by_name helper in libs/fleet-mcp/src/fleet_mcp/coder/workspaces.py
- [X] T043 [P] [US1] Implement list_templates method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [X] T044 [P] [US1] Implement get_template method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [X] T045 [US1] Implement workspace metadata helpers in libs/fleet-mcp/src/fleet_mcp/coder/metadata.py (depends on T042)
- [X] T046 [US1] Implement task history pagination in libs/fleet-mcp/src/fleet_mcp/coder/tasks.py
- [X] T047 [US1] Create FastMCP server initialization in libs/fleet-mcp/src/fleet_mcp/server.py (depends on T027)
- [X] T048 [US1] Implement create_agent tool with flat parameters in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py (depends on T028, T043, T045, T047)
- [X] T049 [US1] Implement list_agents tool in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py (depends on T029, T045, T047)
- [X] T050 [US1] Implement show_agent tool in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py (depends on T030, T045, T047)
- [X] T051 [US1] Implement show_agent_task_history tool with pagination in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py (depends on T030, T046, T047)
- [X] T052 [US1] Add error handling for agent not found in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py
- [X] T053 [US1] Add error handling for invalid pagination parameters in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py
- [X] T054 [US1] Verify all US1 tests pass with nx test fleet-mcp

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Operators can create agents, list them, view details, and check task history.

---

## Phase 4: User Story 2 - Task Lifecycle Management (Priority: P2)

**Goal**: Enable operators or controlling AI agents to manage the execution lifecycle of agent tasks, including starting new tasks, monitoring task progress through status changes, and stopping tasks when needed

**Independent Test**: Can be tested independently by creating an agent, assigning it a task via the start task command, observing status changes to "busy", then using stop task to interrupt work. Delivers value by enabling dynamic task control.

### Tests for User Story 2 (TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T055 [P] [US2] Write contract test for start_agent_task tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [ ] T056 [P] [US2] Write contract test for start_agent_task on offline agent in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [ ] T057 [P] [US2] Write contract test for start_agent_task on busy agent in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [ ] T058 [P] [US2] Write contract test for cancel_agent_task tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [ ] T059 [P] [US2] Write contract test for cancel_agent_task on idle agent in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [ ] T060 [P] [US2] Write integration test for task status transitions in libs/fleet-mcp/tests/integration/test_task_lifecycle.py
- [ ] T061 [P] [US2] Write integration test for agent status derivation (busy/idle) in libs/fleet-mcp/tests/integration/test_task_lifecycle.py

### Implementation for User Story 2

- [ ] T062 [P] [US2] Implement update_workspace_metadata method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [ ] T063 [P] [US2] Implement send_interrupt method for cancel task in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [ ] T064 [US2] Implement start_agent_task tool with flat parameters in libs/fleet-mcp/src/fleet_mcp/tools/task_management.py (depends on T062, T047)
- [ ] T065 [US2] Implement cancel_agent_task tool in libs/fleet-mcp/src/fleet_mcp/tools/task_management.py (depends on T063, T047)
- [ ] T066 [US2] Add validation for agent offline in start_agent_task in libs/fleet-mcp/src/fleet_mcp/tools/task_management.py
- [ ] T067 [US2] Add validation for agent already busy in start_agent_task in libs/fleet-mcp/src/fleet_mcp/tools/task_management.py
- [ ] T068 [US2] Add validation for agent not busy in cancel_agent_task in libs/fleet-mcp/src/fleet_mcp/tools/task_management.py
- [ ] T069 [US2] Update agent status derivation logic in libs/fleet-mcp/src/fleet_mcp/models/agent.py for busy/idle states
- [ ] T070 [US2] Register task management tools in server.py in libs/fleet-mcp/src/fleet_mcp/server.py
- [ ] T071 [US2] Verify all US2 tests pass with nx test fleet-mcp

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Operators can create agents, monitor them, and manage their task lifecycles.

---

## Phase 5: User Story 3 - Spec Convergence with PR Integration (Priority: P3)

**Goal**: Enable manager agents or human operators to monitor agents working toward specifications that are tracked via pull requests, surfacing PR metadata alongside agent progress for verification that agents' work aligns with intended outcomes

**Independent Test**: Can be tested by creating an agent with fleet_mcp_pull_request_url metadata, having it work on tasks, and verifying that PR status and check status are visible in agent details. Delivers value through enhanced visibility into work quality.

### Tests for User Story 3 (TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T072 [P] [US3] Write integration test for reading PR metadata from workspace in libs/fleet-mcp/tests/integration/test_metadata.py
- [ ] T073 [P] [US3] Write integration test for filtering metadata by fleet_mcp_ prefix in libs/fleet-mcp/tests/integration/test_metadata.py
- [ ] T074 [P] [US3] Write contract test for show_agent with PR metadata in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [ ] T075 [P] [US3] Write unit test for metadata field inclusion in Agent model in libs/fleet-mcp/tests/unit/test_models.py
- [ ] T076 [P] [US3] Write integration test for agent spec metadata visibility in libs/fleet-mcp/tests/integration/test_metadata.py

### Implementation for User Story 3

- [ ] T077 [P] [US3] Implement filter_fleet_metadata helper in libs/fleet-mcp/src/fleet_mcp/coder/metadata.py
- [ ] T078 [US3] Update agent_from_workspace to include nested metadata dict in libs/fleet-mcp/src/fleet_mcp/models/agent.py (depends on T077)
- [ ] T079 [US3] Update show_agent tool to surface metadata fields in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py (depends on T078)
- [ ] T080 [US3] Add metadata validation for optional PR fields in libs/fleet-mcp/src/fleet_mcp/models/agent.py
- [ ] T081 [US3] Verify all US3 tests pass with nx test fleet-mcp

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. PR integration enables enhanced observability for manager agents and human operators.

---

## Phase 6: User Story 4 - Agent Lifecycle Management (Priority: P3)

**Goal**: Enable operators to manage the full lifecycle of agents including provisioning, ongoing operation, and eventual decommissioning. When agents are no longer needed, operators can cleanly remove them from the fleet.

**Independent Test**: Can be tested by creating an agent, verifying it appears in the fleet list, then deleting it and confirming it no longer appears. Delivers value through resource management and cost control.

### Tests for User Story 4 (TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T082 [P] [US4] Write contract test for delete_agent tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [ ] T083 [P] [US4] Write contract test for delete_agent with non-existent agent in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [ ] T084 [P] [US4] Write contract test for delete_agent on busy agent in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [ ] T085 [P] [US4] Write integration test for workspace deletion in libs/fleet-mcp/tests/integration/test_coder_client.py

### Implementation for User Story 4

- [ ] T086 [US4] Implement delete_agent tool in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py (depends on T031, T047)
- [ ] T087 [US4] Add validation for agent existence in delete_agent in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py
- [ ] T088 [US4] Add forceful deletion support for busy agents in libs/fleet-mcp/src/fleet_mcp/tools/agent_management.py
- [ ] T089 [US4] Verify all US4 tests pass with nx test fleet-mcp

**Checkpoint**: All basic agent lifecycle operations (create, monitor, task management, delete) are now complete and independently testable.

---

## Phase 7: User Story 5 - Role and Project Discovery (Priority: P3)

**Goal**: Enable users or controlling systems to understand what types of agents can be created and which projects are available through discovery endpoints that list available agent roles and projects

**Independent Test**: Can be tested by calling list roles and list projects endpoints and verifying they return the expected sets. Delivers value through discoverability and reduced need for external documentation.

### Tests for User Story 5 (TDD) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T090 [P] [US5] Write contract test for list_agent_roles tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [ ] T091 [P] [US5] Write contract test for list_agent_roles with invalid project in libs/fleet-mcp/tests/contract/test_mcp_tools.py
- [ ] T092 [P] [US5] Write contract test for list_agent_projects tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py with pytest-vcr
- [ ] T093 [P] [US5] Write integration test for template workspace presets query in libs/fleet-mcp/tests/integration/test_coder_client.py
- [ ] T094 [P] [US5] Write integration test for template listing in libs/fleet-mcp/tests/integration/test_coder_client.py

### Implementation for User Story 5

- [ ] T095 [P] [US5] Implement get_template_presets method in libs/fleet-mcp/src/fleet_mcp/coder/client.py
- [ ] T096 [US5] Implement list_agent_roles tool with project parameter in libs/fleet-mcp/src/fleet_mcp/tools/discovery.py (depends on T095, T047)
- [ ] T097 [US5] Implement list_agent_projects tool in libs/fleet-mcp/src/fleet_mcp/tools/discovery.py (depends on T043, T047)
- [ ] T098 [US5] Add validation for project not found in list_agent_roles in libs/fleet-mcp/src/fleet_mcp/tools/discovery.py
- [ ] T099 [US5] Register discovery tools in server.py in libs/fleet-mcp/src/fleet_mcp/server.py
- [ ] T100 [US5] Verify all US5 tests pass with nx test fleet-mcp

**Checkpoint**: All user stories should now be independently functional. Discovery endpoints provide complete visibility into available roles and projects.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T101 [P] Add comprehensive logging throughout all modules in libs/fleet-mcp/src/fleet_mcp/
- [ ] T102 [P] Add docstrings to all public functions and classes across codebase
- [ ] T103 [P] Create example usage script in libs/fleet-mcp/scripts/test_local.py
- [ ] T104 Run linting with nx lint fleet-mcp and fix all issues
- [ ] T105 Run formatting with trunk fmt libs/fleet-mcp
- [ ] T106 Run trunk check libs/fleet-mcp and address all issues
- [ ] T107 Verify full test suite passes with nx test fleet-mcp
- [ ] T108 Build library with nx build fleet-mcp
- [ ] T109 Validate against quickstart.md scenarios in libs/fleet-mcp/
- [ ] T110 [P] Create README.md for library in libs/fleet-mcp/README.md
- [ ] T111 Verify all cassettes are gitignored and secrets are filtered

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 agent infrastructure but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1 agent details but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Uses US1 agent infrastructure but independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independent discovery functionality

### Within Each User Story

- Tests MUST be written and MUST FAIL before implementation (TDD)
- Models before services
- Services before tools
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tests marked [P] can run in parallel
- All Foundational model implementations marked [P] can run in parallel
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1 Tests (TDD)

```bash
# Launch all test writing tasks for User Story 1 together (BEFORE implementation):
Task: "Write contract test for create_agent tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py"
Task: "Write contract test for list_agents tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py"
Task: "Write contract test for show_agent tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py"
Task: "Write contract test for show_agent_task_history tool in libs/fleet-mcp/tests/contract/test_mcp_tools.py"

# Verify all tests FAIL (no implementation yet)
nx test fleet-mcp  # Should fail

# Launch parallel implementation tasks:
Task: "Implement get_workspace_by_name helper in libs/fleet-mcp/src/fleet_mcp/coder/workspaces.py"
Task: "Implement list_templates method in libs/fleet-mcp/src/fleet_mcp/coder/client.py"
Task: "Implement get_template method in libs/fleet-mcp/src/fleet_mcp/coder/client.py"
```

---

## Parallel Example: Foundational Models (TDD)

```bash
# Write all model tests first (in parallel):
Task: "Write unit test for AgentStatus enum in libs/fleet-mcp/tests/unit/test_models.py"
Task: "Write unit test for Agent model validation in libs/fleet-mcp/tests/unit/test_models.py"
Task: "Write unit test for Task model validation in libs/fleet-mcp/tests/unit/test_models.py"
Task: "Write unit test for Role model validation in libs/fleet-mcp/tests/unit/test_models.py"
Task: "Write unit test for Project model validation in libs/fleet-mcp/tests/unit/test_models.py"

# Verify tests FAIL
nx test fleet-mcp  # Should fail

# Implement all models in parallel (after tests written):
Task: "Implement AgentStatus enum in libs/fleet-mcp/src/fleet_mcp/models/agent.py"
Task: "Implement Agent Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/agent.py"
Task: "Implement Task Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/task.py"
Task: "Implement Role Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/role.py"
Task: "Implement Project Pydantic model in libs/fleet-mcp/src/fleet_mcp/models/project.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
   - Write all foundational tests FIRST (T008-T016)
   - Verify tests FAIL
   - Implement foundational code (T017-T032)
   - Verify tests PASS
3. Complete Phase 3: User Story 1 (following TDD)
   - Write all US1 tests FIRST (T033-T041)
   - Verify tests FAIL
   - Implement US1 code (T042-T054)
   - Verify tests PASS
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (TDD) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (TDD) → Test independently → Deploy/Demo
4. Add User Story 3 (TDD) → Test independently → Deploy/Demo
5. Add User Story 4 (TDD) → Test independently → Deploy/Demo
6. Add User Story 5 (TDD) → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### TDD Workflow (Critical!)

For each user story:
1. **RED**: Write all tests for the story - tests MUST FAIL
2. **Verify**: Run `nx test fleet-mcp` - confirm tests fail appropriately
3. **GREEN**: Implement code to make tests pass
4. **Verify**: Run `nx test fleet-mcp` - confirm tests now pass
5. **REFACTOR**: Clean up code while keeping tests green

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (following TDD)
2. Once Foundational is done:
   - Developer A: User Story 1 (TDD)
   - Developer B: User Story 2 (TDD)
   - Developer C: User Story 3 (TDD)
3. Stories complete and integrate independently
4. Each developer follows TDD cycle within their story

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD is MANDATORY**: Verify tests fail before implementing, then verify they pass
- pytest-vcr cassettes record live Coder API interactions for deterministic testing
- All metadata uses `fleet_mcp_*` prefix for namespacing
- Roles are dynamic and sourced from Coder workspace presets
- Agent status is derived from workspace state + current_task presence
- Commit after each passing test or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
