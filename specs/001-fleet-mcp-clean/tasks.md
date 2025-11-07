# Tasks: Fleet MCP Clean Architecture Implementation

**Input**: Design documents from `/specs/001-fleet-mcp-clean/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Context**: TDD approach - tests written and verified to FAIL before implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure following libs/fleet-mcp-clean layout from plan.md
- [ ] T002 Initialize Python project with pyproject.toml and requirements.txt (httpx==0.28.1, respx==0.22.0, pytest==8.3.0, fastmcp, pydantic>=2.9.0)
- [ ] T003 [P] Configure pytest in pyproject.toml with test organization by layer
- [ ] T004 [P] Create libs/fleet-mcp-clean/fleet_mcp_clean/__init__.py with package exports
- [ ] T005 [P] Create libs/fleet-mcp-clean/tests/conftest.py with shared pytest fixtures

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core models, client, and VCR cassette infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Pydantic Models (Foundation)

- [ ] T006 [P] Create Agent model with AgentStatus enum in fleet_mcp_clean/models/agent.py
- [ ] T007 [P] Create Task and TaskHistory models in fleet_mcp_clean/models/task.py
- [ ] T008 [P] Create Project and Role models in fleet_mcp_clean/models/project.py
- [ ] T009 [P] Create WorkspaceRemote and TemplateRemote models in fleet_mcp_clean/models/remote.py
- [ ] T010 [P] Create error classes in fleet_mcp_clean/models/errors.py
- [ ] T011 Create LogEntry and ConversationLog models in fleet_mcp_clean/models/task.py

### VCR Cassette Recording (One-Time Operation)

- [ ] T012 Create VCR recording script in tests/record.py following plan.md:L149-280 with error handling, environment validation, and async setup
- [ ] T013 Create tests/cassettes/ directory for storing cassettes
- [ ] T014 Run tests/record.py to record all Coder API interactions as VCR cassettes (requires CODER_URL and CODER_SESSION_TOKEN env vars)
- [ ] T015 Create cassette loader utility in tests/fixtures/cassette_loader.py

### Client Layer (HTTP Communication)

- [ ] T016 Create CoderClient class skeleton in fleet_mcp_clean/clients/coder_client.py with httpx.AsyncClient
- [ ] T017 [P] Implement _get_org_id() method in CoderClient
- [ ] T018 [P] Implement create_workspace() method in CoderClient
- [ ] T019 [P] Implement get_workspace() method in CoderClient
- [ ] T020 [P] Implement list_workspaces() method in CoderClient
- [ ] T021 [P] Implement delete_workspace() method in CoderClient
- [ ] T022 [P] Implement list_templates() method in CoderClient
- [ ] T023 [P] Implement get_template_rich_parameters() method in CoderClient
- [ ] T024 [P] Implement get_template_version_presets() method in CoderClient
- [ ] T025 [P] Implement send_task_input() method in CoderClient
- [ ] T026 [P] Implement get_task() method in CoderClient
- [ ] T027 [P] Implement send_agentapi_interrupt() method in CoderClient

### FastMCP Server Setup

- [ ] T028 Create FastMCP server entry point in fleet_mcp_clean/server.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Agent Discovery and Inspection (Priority: P1) 🎯 MVP

**Goal**: Enable fleet managers to discover available agent capabilities and inspect individual agents

**Independent Test**: Can be fully tested by calling list operations and show operations, verifying that agent metadata is returned correctly without requiring any agent creation or task execution

### Tests for User Story 1 (TDD - Write First, Verify FAIL) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

#### Client Layer Tests

- [ ] T029 [P] [US1] Create test fixture mock_list_workspaces_success in tests/fixtures/workspace_fixtures.py
- [ ] T030 [P] [US1] Write test_list_workspaces_success in tests/clients/test_coder_client.py using respx
- [ ] T031 [P] [US1] Create test fixture mock_get_workspace_success in tests/fixtures/workspace_fixtures.py
- [ ] T032 [P] [US1] Write test_list_templates_success in tests/clients/test_coder_client.py using respx
- [ ] T033 [P] [US1] Write test_get_template_rich_parameters_success in tests/clients/test_coder_client.py using respx
- [ ] T034 [P] [US1] Write test_get_template_version_presets_success in tests/clients/test_coder_client.py using respx

#### Repository Layer Tests

- [ ] T035 [P] [US1] Write test_list_agents_success in tests/repositories/test_agent_repository.py with mocked CoderClient
- [ ] T036 [P] [US1] Write test_get_agent_by_name_success in tests/repositories/test_agent_repository.py with mocked CoderClient
- [ ] T037 [P] [US1] Write test_list_projects_success in tests/repositories/test_template_repository.py with mocked CoderClient
- [ ] T038 [P] [US1] Write test_list_roles_by_project_success in tests/repositories/test_template_repository.py with mocked CoderClient

#### Service Layer Tests

- [ ] T039 [P] [US1] Write test_list_agents_with_filters in tests/services/test_agent_service.py with mocked AgentRepository
- [ ] T040 [P] [US1] Write test_show_agent_success in tests/services/test_agent_service.py with mocked AgentRepository
- [ ] T041 [P] [US1] Write test_show_agent_not_found in tests/services/test_agent_service.py
- [ ] T042 [P] [US1] Write test_list_projects_success in tests/services/test_project_service.py with mocked TemplateRepository
- [ ] T043 [P] [US1] Write test_list_roles_success in tests/services/test_project_service.py with mocked TemplateRepository

#### Tool Layer Tests

- [ ] T044 [P] [US1] Write test_list_agents_tool in tests/tools/test_list_agents.py with mocked AgentService
- [ ] T045 [P] [US1] Write test_show_agent_tool in tests/tools/test_show_agent.py with mocked AgentService
- [ ] T046 [P] [US1] Write test_list_agent_projects_tool in tests/tools/test_list_agent_projects.py with mocked ProjectService
- [ ] T047 [P] [US1] Write test_list_agent_roles_tool in tests/tools/test_list_agent_roles.py with mocked ProjectService

### Implementation for User Story 1

#### Response Models

- [ ] T048 [P] [US1] Create ListAgentsResponse model in fleet_mcp_clean/models/responses.py
- [ ] T049 [P] [US1] Create ShowAgentResponse model in fleet_mcp_clean/models/responses.py
- [ ] T050 [P] [US1] Create ListAgentProjectsResponse model in fleet_mcp_clean/models/responses.py
- [ ] T051 [P] [US1] Create ListAgentRolesResponse model in fleet_mcp_clean/models/responses.py

#### Repository Layer Implementation

- [ ] T052 [US1] Create AgentRepository class in fleet_mcp_clean/repositories/agent_repository.py
- [ ] T053 [US1] Implement list() method in AgentRepository (maps WorkspaceRemote → Agent)
- [ ] T054 [US1] Implement get_by_name() method in AgentRepository
- [ ] T055 [US1] Create TemplateRepository class in fleet_mcp_clean/repositories/template_repository.py
- [ ] T056 [US1] Implement list_projects() method in TemplateRepository (filters valid fleet-mcp projects)
- [ ] T057 [US1] Implement list_roles_by_project() method in TemplateRepository

#### Service Layer Implementation

- [ ] T058 [US1] Create AgentService class in fleet_mcp_clean/services/agent_service.py
- [ ] T059 [US1] Implement list_agents() method in AgentService with status/project filtering
- [ ] T060 [US1] Implement show_agent() method in AgentService with error handling
- [ ] T061 [US1] Create ProjectService class in fleet_mcp_clean/services/project_service.py
- [ ] T062 [US1] Implement list_projects() method in ProjectService
- [ ] T063 [US1] Implement list_roles() method in ProjectService

#### Tool Layer Implementation

- [ ] T064 [US1] Implement list_agents tool in fleet_mcp_clean/tools/list_agents.py using scalar parameters
- [ ] T065 [US1] Implement show_agent tool in fleet_mcp_clean/tools/show_agent.py using scalar parameters
- [ ] T066 [US1] Implement list_agent_projects tool in fleet_mcp_clean/tools/list_agent_projects.py
- [ ] T067 [US1] Implement list_agent_roles tool in fleet_mcp_clean/tools/list_agent_roles.py using scalar parameters
- [ ] T068 [US1] Register all User Story 1 tools in fleet_mcp_clean/server.py

#### Verification

- [ ] T069 [US1] Run pytest tests/tools/test_list_agents.py tests/tools/test_show_agent.py tests/tools/test_list_agent_projects.py tests/tools/test_list_agent_roles.py -v
- [ ] T070 [US1] Manually test User Story 1 scenarios from quickstart.md Workflow 1

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Agent Lifecycle Management (Priority: P1) 🎯 MVP

**Goal**: Enable fleet managers to create new agents and remove agents from the fleet

**Independent Test**: Can be fully tested by creating agents with different configurations and then deleting them, verifying creation success and cleanup completion

### Tests for User Story 2 (TDD - Write First, Verify FAIL) ⚠️

#### Client Layer Tests

- [ ] T071 [P] [US2] Create test fixture mock_create_workspace_success in tests/fixtures/workspace_fixtures.py
- [ ] T072 [P] [US2] Write test_create_workspace_success in tests/clients/test_coder_client.py using respx
- [ ] T073 [P] [US2] Write test_delete_workspace_success in tests/clients/test_coder_client.py using respx
- [ ] T074 [P] [US2] Write test_restart_workspace_success in tests/clients/test_coder_client.py using respx

#### Repository Layer Tests

- [ ] T075 [P] [US2] Write test_create_agent_success in tests/repositories/test_agent_repository.py with mocked CoderClient
- [ ] T076 [P] [US2] Write test_delete_agent_success in tests/repositories/test_agent_repository.py with mocked CoderClient
- [ ] T077 [P] [US2] Write test_restart_agent_success in tests/repositories/test_agent_repository.py with mocked CoderClient

#### Service Layer Tests

- [ ] T078 [P] [US2] Write test_create_agent_success in tests/services/test_agent_service.py with mocked AgentRepository
- [ ] T079 [P] [US2] Write test_create_agent_duplicate_name in tests/services/test_agent_service.py (409 conflict)
- [ ] T080 [P] [US2] Write test_create_agent_invalid_name in tests/services/test_agent_service.py (400 validation)
- [ ] T081 [P] [US2] Write test_delete_agent_success in tests/services/test_agent_service.py
- [ ] T082 [P] [US2] Write test_delete_agent_not_found in tests/services/test_agent_service.py (404)
- [ ] T083 [P] [US2] Write test_restart_agent_success in tests/services/test_agent_service.py

#### Tool Layer Tests

- [ ] T084 [P] [US2] Write test_create_agent_tool in tests/tools/test_create_agent.py with mocked AgentService
- [ ] T085 [P] [US2] Write test_delete_agent_tool in tests/tools/test_delete_agent.py with mocked AgentService
- [ ] T086 [P] [US2] Write test_restart_agent_tool in tests/tools/test_restart_agent.py with mocked AgentService

### Implementation for User Story 2

#### Response Models

- [ ] T087 [P] [US2] Create CreateAgentResponse model in fleet_mcp_clean/models/responses.py
- [ ] T088 [P] [US2] Create DeleteAgentResponse model in fleet_mcp_clean/models/responses.py
- [ ] T089 [P] [US2] Create RestartAgentResponse model in fleet_mcp_clean/models/responses.py

#### Repository Layer Implementation

- [ ] T090 [US2] Implement create() method in AgentRepository
- [ ] T091 [US2] Implement delete() method in AgentRepository
- [ ] T092 [US2] Implement restart() method in AgentRepository

#### Service Layer Implementation

- [ ] T093 [US2] Implement create_agent() method in AgentService with name validation
- [ ] T094 [US2] Implement name uniqueness check in create_agent() method
- [ ] T095 [US2] Implement delete_agent() method in AgentService
- [ ] T096 [US2] Implement restart_agent() method in AgentService

#### Tool Layer Implementation

- [ ] T097 [US2] Implement create_agent tool in fleet_mcp_clean/tools/create_agent.py using scalar parameters
- [ ] T098 [US2] Implement delete_agent tool in fleet_mcp_clean/tools/delete_agent.py using scalar parameters
- [ ] T099 [US2] Implement restart_agent tool in fleet_mcp_clean/tools/restart_agent.py using scalar parameters
- [ ] T100 [US2] Register all User Story 2 tools in fleet_mcp_clean/server.py

#### Verification

- [ ] T101 [US2] Run pytest tests/tools/test_create_agent.py tests/tools/test_delete_agent.py tests/tools/test_restart_agent.py -v
- [ ] T102 [US2] Manually test User Story 2 scenarios from quickstart.md Workflows 2 and 6

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Task Assignment and Cancellation (Priority: P2)

**Goal**: Enable fleet managers to assign tasks to idle agents and cancel tasks on busy agents

**Independent Test**: Can be fully tested by creating an agent, assigning it a task, verifying busy status, canceling the task, and verifying idle status

### Tests for User Story 3 (TDD - Write First, Verify FAIL) ⚠️

#### Client Layer Tests

- [ ] T103 [P] [US3] Write test_send_task_input_success in tests/clients/test_coder_client.py using respx
- [ ] T104 [P] [US3] Write test_get_task_success in tests/clients/test_coder_client.py using respx
- [ ] T105 [P] [US3] Write test_send_agentapi_interrupt_success in tests/clients/test_coder_client.py using respx

#### Repository Layer Tests

- [ ] T106 [P] [US3] Write test_send_task_success in tests/repositories/test_task_repository.py with mocked CoderClient
- [ ] T107 [P] [US3] Write test_cancel_task_success in tests/repositories/test_task_repository.py with mocked CoderClient

#### Service Layer Tests

- [ ] T108 [P] [US3] Write test_start_agent_task_idle_agent in tests/services/test_task_service.py with mocked TaskRepository
- [ ] T109 [P] [US3] Write test_start_agent_task_busy_agent in tests/services/test_task_service.py (409 conflict)
- [ ] T110 [P] [US3] Write test_start_agent_task_offline_agent in tests/services/test_task_service.py (400 error)
- [ ] T111 [P] [US3] Write test_cancel_agent_task_busy_agent in tests/services/test_task_service.py
- [ ] T112 [P] [US3] Write test_cancel_agent_task_idle_agent in tests/services/test_task_service.py (400 error)

#### Tool Layer Tests

- [ ] T113 [P] [US3] Write test_start_agent_task_tool in tests/tools/test_start_agent_task.py with mocked TaskService
- [ ] T114 [P] [US3] Write test_cancel_agent_task_tool in tests/tools/test_cancel_agent_task.py with mocked TaskService

### Implementation for User Story 3

#### Response Models

- [ ] T115 [P] [US3] Create StartAgentTaskResponse model in fleet_mcp_clean/models/responses.py
- [ ] T116 [P] [US3] Create CancelAgentTaskResponse model in fleet_mcp_clean/models/responses.py

#### Repository Layer Implementation

- [ ] T117 [US3] Create TaskRepository class in fleet_mcp_clean/repositories/task_repository.py
- [ ] T118 [US3] Implement send_task() method in TaskRepository
- [ ] T119 [US3] Implement cancel_task() method in TaskRepository with AgentAPI interrupt logic

#### Service Layer Implementation

- [ ] T120 [US3] Create TaskService class in fleet_mcp_clean/services/task_service.py
- [ ] T121 [US3] Implement start_agent_task() method in TaskService with status validation
- [ ] T122 [US3] Implement cancel_agent_task() method in TaskService with status checks

#### Tool Layer Implementation

- [ ] T123 [US3] Implement start_agent_task tool in fleet_mcp_clean/tools/start_agent_task.py using scalar parameters
- [ ] T124 [US3] Implement cancel_agent_task tool in fleet_mcp_clean/tools/cancel_agent_task.py using scalar parameters
- [ ] T125 [US3] Register all User Story 3 tools in fleet_mcp_clean/server.py

#### Verification

- [ ] T126 [US3] Run pytest tests/tools/test_start_agent_task.py tests/tools/test_cancel_agent_task.py -v
- [ ] T127 [US3] Manually test User Story 3 scenarios from quickstart.md Workflows 3 and 4

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional

---

## Phase 6: User Story 4 - Task and Log History Tracking (Priority: P3)

**Goal**: Enable fleet managers to review task history and conversation logs for agents

**Independent Test**: Can be fully tested by creating an agent, executing multiple tasks, and then paginating through task history and logs to verify data persistence and retrieval

### Tests for User Story 4 (TDD - Write First, Verify FAIL) ⚠️

#### Client Layer Tests

- [ ] T128 [P] [US4] Write test_get_task_logs_success in tests/clients/test_coder_client.py using respx
- [ ] T129 [P] [US4] Write test_get_task_history_with_pagination in tests/clients/test_coder_client.py using respx

#### Repository Layer Tests

- [ ] T130 [P] [US4] Write test_get_task_history_success in tests/repositories/test_task_repository.py with mocked CoderClient
- [ ] T131 [P] [US4] Write test_get_logs_with_pagination in tests/repositories/test_task_repository.py with mocked CoderClient
- [ ] T132 [P] [US4] Write test_pagination_beyond_available_pages in tests/repositories/test_task_repository.py

#### Service Layer Tests

- [ ] T133 [P] [US4] Write test_show_agent_task_history_success in tests/services/test_task_service.py with mocked TaskRepository
- [ ] T134 [P] [US4] Write test_show_agent_log_default_page_size in tests/services/test_task_service.py
- [ ] T135 [P] [US4] Write test_show_agent_task_history_empty in tests/services/test_task_service.py

#### Tool Layer Tests

- [ ] T136 [P] [US4] Write test_show_agent_task_history_tool in tests/tools/test_show_agent_task_history.py with mocked TaskService
- [ ] T137 [P] [US4] Write test_show_agent_log_tool in tests/tools/test_show_agent_log.py with mocked TaskService

### Implementation for User Story 4

#### Response Models

- [ ] T138 [P] [US4] Create ShowAgentTaskHistoryResponse model in fleet_mcp_clean/models/responses.py
- [ ] T139 [P] [US4] Create ShowAgentLogResponse model in fleet_mcp_clean/models/responses.py

#### Client Layer Implementation

- [ ] T140 [US4] Implement get_task_logs() method in CoderClient
- [ ] T141 [US4] Implement get_task_history() method in CoderClient with pagination

#### Repository Layer Implementation

- [ ] T142 [US4] Implement get_task_history() method in TaskRepository with pagination
- [ ] T143 [US4] Implement get_logs() method in TaskRepository with pagination (default page_size=1)

#### Service Layer Implementation

- [ ] T144 [US4] Implement show_agent_task_history() method in TaskService
- [ ] T145 [US4] Implement show_agent_log() method in TaskService with default page_size=1

#### Tool Layer Implementation

- [ ] T146 [US4] Implement show_agent_task_history tool in fleet_mcp_clean/tools/show_agent_task_history.py using scalar parameters
- [ ] T147 [US4] Implement show_agent_log tool in fleet_mcp_clean/tools/show_agent_log.py using scalar parameters
- [ ] T148 [US4] Register all User Story 4 tools in fleet_mcp_clean/server.py

#### Verification

- [ ] T149 [US4] Run pytest tests/tools/test_show_agent_task_history.py tests/tools/test_show_agent_log.py -v
- [ ] T150 [US4] Manually test User Story 4 scenarios from quickstart.md Workflow 5

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T151 [P] Add comprehensive error handling and logging across all layers
- [ ] T152 [P] Add docstrings to all public methods following Google style guide
- [ ] T153 [P] Create libs/fleet-mcp-clean/README.md with usage instructions
- [ ] T154 Run full test suite with coverage: pytest --cov=fleet_mcp_clean --cov-report=term-missing
- [ ] T155 Verify all test coverage is >80% for each layer
- [ ] T156 Run linting and formatting: trunk fmt && trunk check
- [ ] T157 Validate all quickstart.md workflows work end-to-end
- [ ] T158 Performance test: verify list_agents with 100+ agents completes <2s
- [ ] T159 Stress test: verify agent creation completes within 60s
- [ ] T160 Stress test: verify task cancellation completes within 5s

### Edge Case Testing (spec.md L80-89)

- [ ] T161 [P] Write test for agent name validation: test valid names (alphanumeric, hyphens, 1-20 chars) and invalid names (special chars, empty, too long) in tests/services/test_agent_service.py
- [ ] T162 [P] Write test for empty task description rejection in tests/services/test_task_service.py
- [ ] T163 [P] Write test for pagination page_size limit enforcement (max 100) in tests/repositories/test_task_repository.py
- [ ] T164 [P] Write test for pagination beyond available data (page 100 when only 3 pages exist) in tests/repositories/test_task_repository.py
- [ ] T165 [P] Write test for Coder API unavailability handling in tests/clients/test_coder_client.py using respx to mock network errors
- [ ] T166 [P] Write test for agent task assignment when workspace in transitional state (starting/stopping) in tests/services/test_task_service.py
- [ ] T167 [P] Write test for very long task descriptions (>10KB) in tests/services/test_task_service.py

### Architecture Validation (SC-007)

- [ ] T168 Create import-linter configuration in libs/fleet-mcp-clean/.importlinter to enforce layer boundaries: tools→services, services→repositories, repositories→clients
- [ ] T169 Add import-linter check to CI pipeline and verify no cross-layer imports exist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (MVP includes both)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Requires agents from US2 for testing but independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Requires agents and tasks from US2/US3 for testing but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Client layer tests before Client implementation
- Repository layer tests before Repository implementation (mocks Client)
- Service layer tests before Service implementation (mocks Repository)
- Tool layer tests before Tool implementation (mocks Service)
- All tests for a layer must pass before proceeding to next layer

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (Phase 1)
- All Model creation tasks marked [P] can run in parallel (Phase 2)
- All Client method implementations marked [P] can run in parallel within Phase 2
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each user story, all tests marked [P] can run in parallel
- Within each user story, all Response models marked [P] can run in parallel

---

## Parallel Example: User Story 1 Client Tests

```bash
# Launch all Client layer tests for User Story 1 together:
Task: "Write test_list_workspaces_success in tests/clients/test_coder_client.py"
Task: "Write test_list_templates_success in tests/clients/test_coder_client.py"
Task: "Write test_get_template_rich_parameters_success in tests/clients/test_coder_client.py"
Task: "Write test_get_template_version_presets_success in tests/clients/test_coder_client.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Agent Discovery)
4. Complete Phase 4: User Story 2 (Agent Lifecycle)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 together
6. Deploy/demo if ready

**Rationale**: User Story 1 (discovery) and User Story 2 (lifecycle) together provide a complete MVP - you can list agents, create agents, inspect agents, and delete agents. This is a fully functional fleet management system.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Partial system (read-only)
3. Add User Story 2 → Test independently → **MVP complete!** (full CRUD for agents)
4. Add User Story 3 → Test independently → Task management added
5. Add User Story 4 → Test independently → Historical tracking added
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Agent Discovery)
   - Developer B: User Story 2 (Agent Lifecycle)
   - Developer C: User Story 3 (Task Management)
   - Developer D: User Story 4 (History Tracking)
3. Stories complete and integrate independently

---

## Summary

- **Total Tasks**: 160
- **User Story 1 (P1)**: 42 tasks (T029-T070) - Agent Discovery and Inspection
- **User Story 2 (P1)**: 32 tasks (T071-T102) - Agent Lifecycle Management
- **User Story 3 (P2)**: 25 tasks (T103-T127) - Task Assignment and Cancellation
- **User Story 4 (P3)**: 23 tasks (T128-T150) - Task and Log History Tracking
- **Setup + Foundation**: 28 tasks (T001-T028)
- **Polish**: 10 tasks (T151-T160)

**Parallel Opportunities**: 95+ tasks can run in parallel within their phases

**Suggested MVP Scope**: Setup + Foundational + User Story 1 + User Story 2 (74 tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD Approach**: Write tests FIRST, verify they FAIL, then implement
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All tests use mocks (respx for HTTP, manual mocks for layers) - no live Coder API in tests
- VCR cassettes recorded once in Phase 2, then used to generate test mocks
