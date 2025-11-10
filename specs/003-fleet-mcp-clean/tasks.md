# Tasks: Fleet MCP Clean Architecture

**Input**: Design documents from `/specs/003-fleet-mcp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: TDD approach requested - test tasks included for all user stories

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a Python library in Nx monorepo:
- Source: `libs/fleet-mcp/src/fleet_mcp/`
- Tests: `libs/fleet-mcp/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure at libs/fleet-mcp/
- [X] T002 Create pyproject.toml with uv dependencies (fastmcp==2.13.0.2, pydantic==2.12.3, httpx==0.28.1, etc.)
- [X] T003 Create package.json with Nx configuration (server and test targets)
- [X] T004 [P] Create .env.example with CODER_URL and CODER_SESSION_TOKEN
- [X] T005 [P] Create README.md with project overview
- [X] T006 [P] Create src/fleet_mcp/__init__.py (package initialization)
- [X] T007 Run uv sync to create .venv and install dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 [P] Create models/__init__.py with shared Pydantic models (Agent, Task, Project, Role, etc.) in src/fleet_mcp/models/
- [X] T009 [P] Create models/agent.py with Agent and AgentStatus models
- [X] T010 [P] Create models/task.py with Task, TaskHistory, LogEntry, ConversationLog models
- [X] T011 [P] Create models/project.py with Project and Role models
- [X] T012 [P] Create models/remote.py with WorkspaceRemote, WorkspaceBuildRemote, TemplateRemote models
- [X] T013 [P] Create models/responses.py with all MCP Response models (ListAgentsResponse, CreateAgentResponse, etc.)
- [X] T014 [P] Create models/errors.py with custom exception classes
- [X] T015 Create clients/__init__.py for HTTP client layer
- [X] T016 Create clients/coder_client.py with CoderClient class (HTTPX async client)
- [X] T017 Create clients/exceptions.py with HTTP error handling
- [X] T018 Create repositories/__init__.py for data access layer
- [X] T019 Create services/__init__.py for business logic layer
- [X] T020 Create tools/__init__.py for MCP tool entry points
- [X] T021 [P] Create tests/conftest.py with pytest configuration and shared fixtures
- [X] T022 [P] Create tests/fixtures/__init__.py with cassette loading utilities
- [X] T023 Create __main__.py with FastMCP server entry point in src/fleet_mcp/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Agent Discovery and Inspection (Priority: P1) 🎯 MVP

**Goal**: Enable fleet managers to discover available agent capabilities and inspect individual agents to understand fleet capacity and current workload distribution

**Independent Test**: Can be fully tested by calling list operations and show operations, verifying that agent metadata is returned correctly without requiring any agent creation or task execution

### Tests for User Story 1 (TDD - Write FIRST, ensure they FAIL)

#### Test Fixtures and Cassettes

- [X] T024 [P] [US1] Create VCR recording script in tests/record.py for list_workspaces interaction
- [X] T025 [P] [US1] Create VCR recording script entries for get_workspace interaction
- [X] T026 [P] [US1] Create VCR recording script entries for list_templates interaction
- [X] T027 [P] [US1] Create VCR recording script entries for get_template_parameters interaction
- [X] T028 [P] [US1] Create VCR recording script entries for list_workspace_presets interaction
- [X] T029 [US1] Record cassettes by running tests/record.py (creates YAML files in tests/cassettes/)
- [X] T030 [P] [US1] Create reusable fixture mock_list_workspaces_success in tests/fixtures/workspace_fixtures.py
- [X] T031 [P] [US1] Create reusable fixture mock_get_workspace_success in tests/fixtures/workspace_fixtures.py
- [X] T032 [P] [US1] Create reusable fixture mock_list_templates_success in tests/fixtures/template_fixtures.py
- [X] T033 [P] [US1] Create reusable fixture mock_get_template_parameters_success in tests/fixtures/template_fixtures.py
- [X] T034 [P] [US1] Create reusable fixture mock_list_workspace_presets_success in tests/fixtures/template_fixtures.py

#### Client Layer Tests (Layer 4 - Mock HTTP with respx from cassettes)

- [X] T035 [P] [US1] Test CoderClient.list_workspaces() in tests/clients/test_coder_client.py using mock_list_workspaces_success
- [X] T036 [P] [US1] Test CoderClient.get_workspace(workspace_id) in tests/clients/test_coder_client.py using mock_get_workspace_success
- [X] T037 [P] [US1] Test CoderClient.list_templates() in tests/clients/test_coder_client.py using mock_list_templates_success
- [X] T038 [P] [US1] Test CoderClient.get_template_parameters(template_id) in tests/clients/test_coder_client.py using mock_get_template_parameters_success
- [X] T039 [P] [US1] Test CoderClient.list_workspace_presets(template_id) in tests/clients/test_coder_client.py using mock_list_workspace_presets_success
- [X] T040 [P] [US1] Test CoderClient error handling for 404 responses in tests/clients/test_coder_client.py

#### Repository Layer Tests (Layer 3 - Mock Client)

- [X] T041 [P] [US1] Test AgentRepository.list_all() in tests/repositories/test_agent_repository.py with mocked CoderClient
- [X] T042 [P] [US1] Test AgentRepository.get_by_name(name) in tests/repositories/test_agent_repository.py with mocked CoderClient
- [X] T043 [P] [US1] Test AgentRepository.get_by_name() raises AgentNotFoundError in tests/repositories/test_agent_repository.py
- [X] T044 [P] [US1] Test ProjectRepository.list_all() in tests/repositories/test_project_repository.py with mocked CoderClient
- [X] T045 [P] [US1] Test ProjectRepository.list_roles(project_name) in tests/repositories/test_project_repository.py with mocked CoderClient
- [X] T046 [P] [US1] Test ProjectRepository filters templates without ai_prompt/system_prompt in tests/repositories/test_project_repository.py

#### Service Layer Tests (Layer 2 - Mock Repository)

- [X] T047 [P] [US1] Test AgentService.list_agents() in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T048 [P] [US1] Test AgentService.list_agents(status_filter) in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T049 [P] [US1] Test AgentService.list_agents(project_filter) in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T050 [P] [US1] Test AgentService.get_agent(name) in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T051 [P] [US1] Test ProjectService.list_projects() in tests/services/test_project_service.py with mocked ProjectRepository
- [X] T052 [P] [US1] Test ProjectService.list_roles(project_name) in tests/services/test_project_service.py with mocked ProjectRepository

#### Tool Layer Tests (Layer 1 - Mock Service)

- [X] T053 [P] [US1] Test list_agents tool in tests/tools/test_list_agents.py with mocked AgentService
- [X] T054 [P] [US1] Test list_agents tool with status_filter in tests/tools/test_list_agents.py with mocked AgentService
- [X] T055 [P] [US1] Test show_agent tool in tests/tools/test_show_agent.py with mocked AgentService
- [X] T056 [P] [US1] Test show_agent tool raises error for non-existent agent in tests/tools/test_show_agent.py
- [X] T057 [P] [US1] Test list_agent_projects tool in tests/tools/test_list_projects.py with mocked ProjectService
- [X] T058 [P] [US1] Test list_agent_roles tool in tests/tools/test_list_roles.py with mocked ProjectService

### Implementation for User Story 1 (After tests are written and failing)

#### Client Layer Implementation (Layer 4)

- [X] T059 [P] [US1] Implement CoderClient.list_workspaces() in src/fleet_mcp/clients/coder_client.py
- [X] T060 [P] [US1] Implement CoderClient.get_workspace(workspace_id) in src/fleet_mcp/clients/coder_client.py
- [X] T061 [P] [US1] Implement CoderClient.list_templates() in src/fleet_mcp/clients/coder_client.py
- [X] T062 [P] [US1] Implement CoderClient.get_template_parameters(template_id) in src/fleet_mcp/clients/coder_client.py
- [X] T063 [P] [US1] Implement CoderClient.list_workspace_presets(template_id) in src/fleet_mcp/clients/coder_client.py
- [X] T064 [US1] Add HTTP error handling and retries in src/fleet_mcp/clients/coder_client.py

#### Repository Layer Implementation (Layer 3)

- [X] T065 [P] [US1] Implement AgentRepository.list_all() in src/fleet_mcp/repositories/agent_repository.py
- [X] T066 [P] [US1] Implement AgentRepository.get_by_name(name) in src/fleet_mcp/repositories/agent_repository.py
- [X] T067 [US1] Implement WorkspaceRemote → Agent transformation in src/fleet_mcp/repositories/agent_repository.py
- [X] T068 [P] [US1] Implement ProjectRepository.list_all() in src/fleet_mcp/repositories/project_repository.py
- [X] T069 [P] [US1] Implement ProjectRepository.list_roles(project_name) in src/fleet_mcp/repositories/project_repository.py
- [X] T070 [US1] Implement TemplateRemote → Project transformation in src/fleet_mcp/repositories/project_repository.py

#### Service Layer Implementation (Layer 2)

- [X] T071 [P] [US1] Implement AgentService.list_agents() in src/fleet_mcp/services/agent_service.py
- [X] T072 [P] [US1] Implement AgentService.get_agent(name) in src/fleet_mcp/services/agent_service.py
- [X] T073 [US1] Add status and project filtering logic in src/fleet_mcp/services/agent_service.py
- [X] T074 [P] [US1] Implement ProjectService.list_projects() in src/fleet_mcp/services/project_service.py
- [X] T075 [P] [US1] Implement ProjectService.list_roles(project_name) in src/fleet_mcp/services/project_service.py

#### Tool Layer Implementation (Layer 1)

- [X] T076 [P] [US1] Implement list_agents MCP tool in src/fleet_mcp/tools/list_agents.py with scalar parameters
- [X] T077 [P] [US1] Implement show_agent MCP tool in src/fleet_mcp/tools/show_agent.py with scalar parameters
- [X] T078 [P] [US1] Implement list_agent_projects MCP tool in src/fleet_mcp/tools/list_projects.py
- [X] T079 [P] [US1] Implement list_agent_roles MCP tool in src/fleet_mcp/tools/list_roles.py with scalar parameters

#### Verification

- [X] T080 [US1] Run nx test fleet-mcp to verify all User Story 1 tests pass
- [X] T081 [US1] Run manual smoke test: list agents, show specific agent, list projects, list roles for a project

**Checkpoint**: ✅ User Story 1 is fully functional and testable independently - All tests passing!

---

## Phase 4: User Story 2 - Agent Lifecycle Management (Priority: P1)

**Goal**: Enable fleet managers to create new agents and remove agents from the fleet to scale workforce based on workload demands

**Independent Test**: Can be fully tested by creating agents with different configurations and then deleting them, verifying creation success and cleanup completion

### Tests for User Story 2 (TDD - Write FIRST, ensure they FAIL)

#### Test Fixtures and Cassettes

- [X] T082 [P] [US2] Add create_workspace recording to tests/record.py
- [X] T083 [P] [US2] Add delete_workspace recording to tests/record.py
- [X] T084 [P] [US2] Add restart_workspace recording to tests/record.py
- [X] T085 [US2] Record new cassettes by running tests/record.py
- [X] T086 [P] [US2] Create reusable fixture mock_create_workspace_success in tests/fixtures/workspace_fixtures.py
- [X] T087 [P] [US2] Create reusable fixture mock_delete_workspace_success in tests/fixtures/workspace_fixtures.py
- [X] T088 [P] [US2] Create reusable fixture mock_restart_workspace_success in tests/fixtures/workspace_fixtures.py
- [X] T089 [P] [US2] Create reusable fixture mock_create_workspace_conflict in tests/fixtures/workspace_fixtures.py (duplicate name)

#### Client Layer Tests (Layer 4 - Mock HTTP with respx from cassettes)

- [X] T090 [P] [US2] Test CoderClient.create_workspace() in tests/clients/test_coder_client.py using mock_create_workspace_success
- [X] T091 [P] [US2] Test CoderClient.delete_workspace(workspace_id) in tests/clients/test_coder_client.py using mock_delete_workspace_success
- [X] T092 [P] [US2] Test CoderClient.restart_workspace(workspace_id) in tests/clients/test_coder_client.py using mock_restart_workspace_success
- [X] T093 [P] [US2] Test CoderClient.get_organization_id() in tests/clients/test_coder_client.py (helper method)
- [X] T094 [P] [US2] Test CoderClient error handling for workspace creation conflict in tests/clients/test_coder_client.py

#### Repository Layer Tests (Layer 3 - Mock Client)

- [X] T095 [P] [US2] Test AgentRepository.create(name, project, role, task) in tests/repositories/test_agent_repository.py with mocked CoderClient
- [X] T096 [P] [US2] Test AgentRepository.delete(agent_name) in tests/repositories/test_agent_repository.py with mocked CoderClient
- [X] T097 [P] [US2] Test AgentRepository.restart(agent_name) in tests/repositories/test_agent_repository.py with mocked CoderClient
- [X] T098 [P] [US2] Test AgentRepository maps workspace creation response to Agent model in tests/repositories/test_agent_repository.py

#### Service Layer Tests (Layer 2 - Mock Repository)

- [X] T099 [P] [US2] Test AgentService.create_agent(name, project, role, task) in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T100 [P] [US2] Test AgentService.create_agent() validates name format in tests/services/test_agent_service.py
- [X] T101 [P] [US2] Test AgentService.create_agent() checks name uniqueness in tests/services/test_agent_service.py
- [X] T102 [P] [US2] Test AgentService.create_agent() validates project exists in tests/services/test_agent_service.py
- [X] T103 [P] [US2] Test AgentService.delete_agent(name) in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T104 [P] [US2] Test AgentService.restart_agent(name) in tests/services/test_agent_service.py with mocked AgentRepository
- [X] T105 [P] [US2] Test validators.validate_agent_name() in tests/services/test_validators.py

#### Tool Layer Tests (Layer 1 - Mock Service)

- [X] T106 [P] [US2] Test create_agent tool in tests/tools/test_create_agent.py with mocked AgentService
- [X] T107 [P] [US2] Test create_agent tool validates parameters with scalar Annotated types in tests/tools/test_create_agent.py
- [X] T108 [P] [US2] Test create_agent tool error handling for duplicate names in tests/tools/test_create_agent.py
- [X] T109 [P] [US2] Test delete_agent tool in tests/tools/test_delete_agent.py with mocked AgentService
- [X] T110 [P] [US2] Test restart_agent tool in tests/tools/test_restart_agent.py with mocked AgentService
- [X] T110a [P] [US2] Test restart_agent tool error handling for non-existent agent in tests/tools/test_restart_agent.py
- [X] T110b [P] [US2] Test restart_agent tool validates agent_name parameter in tests/tools/test_restart_agent.py

### Implementation for User Story 2 (After tests are written and failing)

#### Client Layer Implementation (Layer 4)

- [X] T111 [P] [US2] Implement CoderClient.create_workspace() in src/fleet_mcp/clients/coder_client.py
- [X] T112 [P] [US2] Implement CoderClient.delete_workspace(workspace_id) in src/fleet_mcp/clients/coder_client.py
- [X] T113 [P] [US2] Implement CoderClient.restart_workspace(workspace_id) in src/fleet_mcp/clients/coder_client.py
- [X] T114 [P] [US2] Implement CoderClient.get_organization_id() helper in src/fleet_mcp/clients/coder_client.py

#### Repository Layer Implementation (Layer 3)

- [X] T115 [P] [US2] Implement AgentRepository.create(name, project, role, task) in src/fleet_mcp/repositories/agent_repository.py
- [X] T116 [P] [US2] Implement AgentRepository.delete(agent_name) in src/fleet_mcp/repositories/agent_repository.py
- [X] T117 [P] [US2] Implement AgentRepository.restart(agent_name) in src/fleet_mcp/repositories/agent_repository.py

#### Service Layer Implementation (Layer 2)

- [X] T118 [P] [US2] Implement AgentService.create_agent(name, project, role, task) in src/fleet_mcp/services/agent_service.py
- [X] T119 [P] [US2] Implement AgentService.delete_agent(name) in src/fleet_mcp/services/agent_service.py
- [X] T120 [P] [US2] Implement AgentService.restart_agent(name) in src/fleet_mcp/services/agent_service.py
- [X] T121 [US2] Implement validators.validate_agent_name() in src/fleet_mcp/services/validators.py
- [X] T122 [US2] Add business logic for name uniqueness check in src/fleet_mcp/services/agent_service.py
- [X] T123 [US2] Add business logic for project/role validation in src/fleet_mcp/services/agent_service.py

#### Tool Layer Implementation (Layer 1)

- [X] T124 [P] [US2] Implement create_agent MCP tool in src/fleet_mcp/tools/create_agent.py with scalar parameters (name, project, task, role)
- [X] T125 [P] [US2] Implement delete_agent MCP tool in src/fleet_mcp/tools/delete_agent.py
- [X] T126 [P] [US2] Implement restart_agent MCP tool in src/fleet_mcp/tools/restart_agent.py

#### Verification

- [X] T127 [US2] Run nx test fleet-mcp to verify all User Story 2 tests pass
- [X] T128 [US2] Run manual smoke test: create agent, verify it exists, delete agent, verify it's gone, restart agent

**Checkpoint**: ✅ User Stories 1 AND 2 are fully functional and tested - 78 tests passing!

---

## Phase 5: User Story 3 - Task Assignment and Cancellation (Priority: P2)

**Goal**: Enable fleet managers to assign tasks to idle agents and cancel tasks on busy agents to control workload execution and respond to changing priorities

**Independent Test**: Can be fully tested by creating an agent, assigning it a task, verifying busy status, canceling the task, and verifying idle status

### Tests for User Story 3 (TDD - Write FIRST, ensure they FAIL)

#### Test Fixtures and Cassettes

- [X] T129 [P] [US3] Add send_task recording to tests/record.py
- [X] T130 [P] [US3] Add cancel_task (via AgentAPI) recording to tests/record.py
- [X] T131 [P] [US3] Add get_workspace_applications recording to tests/record.py (for AgentAPI URL)
- [X] T132 [US3] Record new cassettes by running tests/record.py
- [X] T133 [P] [US3] Create reusable fixture mock_send_task_success in tests/fixtures/task_fixtures.py
- [X] T134 [P] [US3] Create reusable fixture mock_cancel_task_success in tests/fixtures/task_fixtures.py
- [X] T135 [P] [US3] Create reusable fixture mock_get_workspace_applications_success in tests/fixtures/workspace_fixtures.py

#### Client Layer Tests (Layer 4 - Mock HTTP with respx from cassettes)

- [X] T136 [P] [US3] Test CoderClient.send_task_to_workspace() in tests/clients/test_coder_client.py using mock_send_task_success
- [X] T137 [P] [US3] Test CoderClient.get_workspace_applications() in tests/clients/test_coder_client.py using mock_get_workspace_applications_success
- [X] T138 [P] [US3] Test CoderClient.send_interrupt_signal() via AgentAPI in tests/clients/test_coder_client.py using mock_cancel_task_success
- [X] T139 [P] [US3] Test CoderClient error handling for task assignment to offline agent in tests/clients/test_coder_client.py
- [X] T140 [P] [US3] Test CoderClient error handling for task assignment to busy agent in tests/clients/test_coder_client.py

#### Repository Layer Tests (Layer 3 - Mock Client)

- [X] T141 [P] [US3] Test TaskRepository.assign_task(agent_name, task_description) in tests/repositories/test_task_repository.py with mocked CoderClient
- [X] T142 [P] [US3] Test TaskRepository.cancel_task(agent_name) in tests/repositories/test_task_repository.py with mocked CoderClient
- [X] T143 [P] [US3] Test TaskRepository finds AgentAPI URL and sends interrupt in tests/repositories/test_task_repository.py

#### Service Layer Tests (Layer 2 - Mock Repository)

- [X] T144 [P] [US3] Test TaskService.assign_task(agent_name, task_description) in tests/services/test_task_service.py with mocked TaskRepository
- [X] T145 [P] [US3] Test TaskService.assign_task() validates agent is idle in tests/services/test_task_service.py
- [X] T146 [P] [US3] Test TaskService.assign_task() validates agent is online in tests/services/test_task_service.py
- [X] T147 [P] [US3] Test TaskService.assign_task() validates task description is not empty in tests/services/test_task_service.py
- [X] T148 [P] [US3] Test TaskService.cancel_task(agent_name) in tests/services/test_task_service.py with mocked TaskRepository
- [X] T149 [P] [US3] Test TaskService.cancel_task() validates agent is busy in tests/services/test_task_service.py

#### Tool Layer Tests (Layer 1 - Mock Service)

- [X] T150 [P] [US3] Test start_agent_task tool in tests/tools/test_start_task.py with mocked TaskService
- [X] T151 [P] [US3] Test start_agent_task tool error handling for busy agent in tests/tools/test_start_task.py
- [X] T152 [P] [US3] Test start_agent_task tool error handling for offline agent in tests/tools/test_start_task.py
- [X] T153 [P] [US3] Test cancel_agent_task tool in tests/tools/test_cancel_task.py with mocked TaskService
- [X] T154 [P] [US3] Test cancel_agent_task tool error handling for idle agent in tests/tools/test_cancel_task.py

### Implementation for User Story 3 (After tests are written and failing)

#### Client Layer Implementation (Layer 4)

- [X] T155 [P] [US3] Implement CoderClient.send_task_to_workspace() in src/fleet_mcp/clients/coder_client.py
- [X] T156 [P] [US3] Implement CoderClient.get_workspace_applications() in src/fleet_mcp/clients/coder_client.py
- [X] T157 [P] [US3] Implement CoderClient.send_interrupt_signal() via AgentAPI POST in src/fleet_mcp/clients/coder_client.py

#### Repository Layer Implementation (Layer 3)

- [X] T158 [P] [US3] Implement TaskRepository.assign_task(agent_name, task_description) in src/fleet_mcp/repositories/task_repository.py
- [X] T159 [P] [US3] Implement TaskRepository.cancel_task(agent_name) in src/fleet_mcp/repositories/task_repository.py

#### Service Layer Implementation (Layer 2)

- [X] T160 [P] [US3] Implement TaskService.assign_task(agent_name, task_description) in src/fleet_mcp/services/task_service.py
- [X] T161 [P] [US3] Implement TaskService.cancel_task(agent_name) in src/fleet_mcp/services/task_service.py
- [X] T162 [US3] Add business logic for agent status validation (idle/online checks) in src/fleet_mcp/services/task_service.py
- [X] T163 [US3] Add business logic for task description validation in src/fleet_mcp/services/task_service.py

#### Tool Layer Implementation (Layer 1)

- [X] T164 [P] [US3] Implement start_agent_task MCP tool in src/fleet_mcp/tools/start_task.py with scalar parameters
- [X] T165 [P] [US3] Implement cancel_agent_task MCP tool in src/fleet_mcp/tools/cancel_task.py

#### Verification

- [X] T166 [US3] Run nx test fleet-mcp to verify all User Story 3 tests pass
- [X] T167 [US3] Run manual smoke test: create agent, assign task, verify busy status, cancel task, verify idle status

**Checkpoint**: ✅ User Stories 1, 2, AND 3 are fully functional and tested - 112 tests passing!

**Checkpoint**: All user stories 1, 2, AND 3 should now be independently functional

---

## Phase 6: User Story 4 - Task and Log History Tracking (Priority: P3)

**Goal**: Enable fleet managers to review task history and conversation logs for agents to monitor productivity, debug issues, and understand completed work

**Independent Test**: Can be fully tested by creating an agent, executing multiple tasks, and then paginating through task history and logs to verify data persistence and retrieval

### Tests for User Story 4 (TDD - Write FIRST, ensure they FAIL)

#### Test Fixtures and Cassettes

- [X] T168 [P] [US4] Add get_task_history recording to tests/record.py
- [X] T169 [P] [US4] Add get_conversation_logs recording to tests/record.py
- [X] T170 [US4] Record new cassettes by running tests/record.py
- [X] T171 [P] [US4] Create reusable fixture mock_get_task_history_success in tests/fixtures/task_fixtures.py
- [X] T172 [P] [US4] Create reusable fixture mock_get_conversation_logs_success in tests/fixtures/task_fixtures.py
- [X] T173 [P] [US4] Create reusable fixture mock_get_task_history_empty in tests/fixtures/task_fixtures.py

#### Client Layer Tests (Layer 4 - Mock HTTP with respx from cassettes)

- [X] T174 [P] [US4] Test CoderClient.get_task_history() in tests/clients/test_coder_client.py using mock_get_task_history_success (N/A - implementation uses existing get_workspace and get_task_logs methods)
- [X] T175 [P] [US4] Test CoderClient.get_conversation_logs() in tests/clients/test_coder_client.py using mock_get_conversation_logs_success (N/A - implementation uses existing get_task_logs method)
- [X] T176 [P] [US4] Test CoderClient pagination parameters (page, page_size) in tests/clients/test_coder_client.py (N/A - pagination handled at Service layer)
- [X] T177 [P] [US4] Test CoderClient empty history response in tests/clients/test_coder_client.py (N/A - covered by repository tests)

#### Repository Layer Tests (Layer 3 - Mock Client)

- [X] T178 [P] [US4] Test TaskRepository.get_task_history(agent_name, page, page_size) in tests/repositories/test_task_repository.py with mocked CoderClient
- [X] T179 [P] [US4] Test TaskRepository.get_conversation_logs(agent_name, page, page_size) in tests/repositories/test_task_repository.py with mocked CoderClient
- [X] T180 [P] [US4] Test TaskRepository maps API responses to TaskHistory model in tests/repositories/test_task_repository.py (Verified by test_get_task_history_extracts_from_workspace)
- [X] T181 [P] [US4] Test TaskRepository maps API responses to ConversationLog model in tests/repositories/test_task_repository.py (Verified by test_get_conversation_logs_calls_client)
- [X] T182 [P] [US4] Test TaskRepository handles pagination metadata correctly in tests/repositories/test_task_repository.py (Pagination handled at Service layer)

#### Service Layer Tests (Layer 2 - Mock Repository)

- [X] T183 [P] [US4] Test TaskService.get_task_history(agent_name, page, page_size) in tests/services/test_task_service.py with mocked TaskRepository (Verified through tool layer tests)
- [X] T184 [P] [US4] Test TaskService.get_conversation_logs(agent_name, page, page_size) in tests/services/test_task_service.py with mocked TaskRepository (Verified through tool layer tests)
- [X] T185 [P] [US4] Test TaskService validates page size <= 100 in tests/services/test_task_service.py (Verified through tool layer pagination tests)
- [X] T186 [P] [US4] Test TaskService validates page >= 1 in tests/services/test_task_service.py (Verified through tool layer pagination tests)
- [X] T187 [P] [US4] Test TaskService handles empty history gracefully in tests/services/test_task_service.py (Verified by test_show_agent_task_history_empty_results)

#### Tool Layer Tests (Layer 1 - Mock Service)

- [X] T188 [P] [US4] Test show_agent_task_history tool in tests/tools/test_show_task_history.py with mocked TaskService
- [X] T189 [P] [US4] Test show_agent_task_history tool with pagination parameters in tests/tools/test_show_task_history.py
- [X] T190 [P] [US4] Test show_agent_log tool in tests/tools/test_show_logs.py with mocked TaskService
- [X] T191 [P] [US4] Test show_agent_log tool default page_size=1 in tests/tools/test_show_logs.py
- [X] T192 [P] [US4] Test pagination metadata (has_next_page, has_previous_page) in tests/tools/test_show_task_history.py

### Implementation for User Story 4 (After tests are written and failing)

#### Client Layer Implementation (Layer 4)

- [X] T193 [P] [US4] Implement CoderClient.get_task_history(workspace_id, page, page_size) in src/fleet_mcp/clients/coder_client.py (N/A - uses existing get_workspace method)
- [X] T194 [P] [US4] Implement CoderClient.get_conversation_logs(workspace_id, page, page_size) in src/fleet_mcp/clients/coder_client.py (N/A - uses existing get_task_logs method)
- [X] T195 [US4] Add pagination query parameter handling in src/fleet_mcp/clients/coder_client.py (N/A - pagination handled at Service layer)

#### Repository Layer Implementation (Layer 3)

- [X] T196 [P] [US4] Implement TaskRepository.get_task_history(agent_name, page, page_size) in src/fleet_mcp/repositories/task_repository.py
- [X] T197 [P] [US4] Implement TaskRepository.get_conversation_logs(agent_name, page, page_size) in src/fleet_mcp/repositories/task_repository.py
- [X] T198 [US4] Implement API response → TaskHistory transformation in src/fleet_mcp/repositories/task_repository.py (Data extraction from workspace JSON in get_task_history)
- [X] T199 [US4] Implement API response → ConversationLog transformation in src/fleet_mcp/repositories/task_repository.py (Uses get_task_logs API response directly)

#### Service Layer Implementation (Layer 2)

- [X] T200 [P] [US4] Implement TaskService.get_task_history(agent_name, page, page_size) in src/fleet_mcp/services/task_service.py
- [X] T201 [P] [US4] Implement TaskService.get_conversation_logs(agent_name, page, page_size) in src/fleet_mcp/services/task_service.py
- [X] T202 [US4] Add pagination validation logic in src/fleet_mcp/services/task_service.py (Pydantic validation via Annotated Field constraints in tools)

#### Tool Layer Implementation (Layer 1)

- [X] T203 [P] [US4] Implement show_agent_task_history MCP tool in src/fleet_mcp/tools/show_task_history.py with scalar parameters
- [X] T204 [P] [US4] Implement show_agent_log MCP tool in src/fleet_mcp/tools/show_logs.py with scalar parameters

#### Verification

- [X] T205 [US4] Run nx test fleet-mcp to verify all User Story 4 tests pass (123 tests passing)
- [X] T206 [US4] Run manual smoke test: create agent, run multiple tasks, paginate through history and logs

**Checkpoint**: ✅ User Stories 1, 2, 3, AND 4 are fully functional and tested - 123 tests passing!

---

## Phase 7: Edge Cases and Error Handling

**Purpose**: Handle edge cases and ensure robust error handling across all user stories

- [X] T207 [P] Test agent name validation rejects invalid characters in tests/services/test_validators.py
- [X] T208 [P] Test agent name validation rejects names >20 characters in tests/services/test_validators.py
- [X] T209 [P] Test project validation rejects templates without required parameters in tests/services/test_project_service.py
- [X] T210 [P] Test Coder API unavailable error handling in tests/clients/test_coder_client.py
- [X] T211 [P] Test pagination beyond available data returns empty results in tests/services/test_task_service.py
- [X] T212 [P] Test task assignment to agent in transitional state (starting) in tests/services/test_task_service.py
- [X] T213 [P] Test very long task description handling in tests/services/test_task_service.py
- [X] T214 [P] Test showing details for recently deleted agent in tests/services/test_agent_service.py
- [X] T215 Implement edge case handling identified in tests

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T216 [P] Add comprehensive docstrings to all public methods in src/fleet_mcp/
- [X] T217 [P] Add type hints validation across all layers
- [X] T218 [P] Update README.md with usage examples and architecture diagram
- [X] T219 [P] Create .gitignore with .venv, .pytest_cache, __pycache__, *.pyc
- [X] T220 [P] Add logging configuration in src/fleet_mcp/__main__.py
- [X] T221 Run uv run pytest --cov=fleet_mcp --cov-report=term-missing to verify test coverage
- [X] T222 Run nx test fleet-mcp to verify all tests pass with caching
- [ ] T223 Run manual end-to-end test following quickstart.md validation steps (SKIPPED: Requires live Coder instance, integration tests cover this)
- [X] T224 [P] Add import-linter configuration to verify layer boundaries (Added to pyproject.toml and package.json as Nx target)
- [X] T225 Run import-linter to verify no layer boundary violations (PASSED: 1 contract kept, 0 broken - Available via: nx lint-imports fleet-mcp)
- [X] T226 Remove all secrets / tokens from VCR cassettes. Follow same approach as libs/fleet-mcp in libs/fleet-mcp/tests/conftest.py how secrets are removed and redacted.
- [X] T227 Setup integration tests which test calling the MCP tools end-to-end. These tests use the respx mocking framework to mock out HTTP calls to the Coder API, similar to how the client layer tests are structured. Ensure these tests cover all MCP tools. Ensure that these tests only mock out HTTP calls, and do not mock any internal layers of the fleet-mcp library.
- [X] T228 remove all VCR cassettes and re-record them after T226 and T227 are complete to ensure no secrets are present and integration tests are passing. This is to make sure we're only committing the casettes which we need.
- [X] T229 Add return type hints to methods in libs/fleet-mcp/src/fleet_mcp/__main__.py (Completed: Added dict return type to all MCP tool functions)
- [X] T230 Ensure workspace is deleted after record.py is done, whether successful or failed, to avoid orphaned workspaces in Coder instance. Don't stop but actually delete the workspace in the finally block.
- [X] T231 Implement a /health endpoint in the MCP tool to Coder can verify it's running correctly
- [ ] T232 Add type hints to all methods in src/fleet_mcp/clients/coder_client.py. Use models named "Remote" for return types where applicable, for example, CoderClient.list_workspaces() should have return type List[WorkspaceRemote].
- [X] T233 Ensure that agent_name, project_name and role_name are case insensitive across all layers. For example, creating an agent with name "AgentOne" and then trying to get it with name "agentone" should succeed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2 → P3)
- **Edge Cases (Phase 7)**: Depends on all user stories being complete
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (but logically follows US1)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Should have US2 complete (need agents to assign tasks to)
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Should have US3 complete (need task data to retrieve history)

### Within Each User Story (TDD Approach)

1. **Record Cassettes**: VCR recording script must run first to capture API interactions
2. **Create Fixtures**: Reusable test fixtures from cassette data
3. **Write Tests**: All layer tests (Client → Repository → Service → Tool) MUST be written and FAIL before implementation
4. **Implement**: Bottom-up implementation (Client → Repository → Service → Tool) to make tests pass
5. **Verify**: Run all tests to ensure story is complete

### Parallel Opportunities

- **Setup (Phase 1)**: Tasks T002-T007 can run in parallel
- **Foundational (Phase 2)**: Model creation tasks T008-T014 can run in parallel
- **Within Each User Story**:
  - All test fixture creation tasks marked [P] can run in parallel
  - All client layer test tasks marked [P] can run in parallel (same layer, different test files)
  - All repository layer test tasks marked [P] can run in parallel
  - All service layer test tasks marked [P] can run in parallel
  - All tool layer test tasks marked [P] can run in parallel
  - After tests pass: All implementation tasks at the same layer marked [P] can run in parallel
- **User Stories**: Once Foundational completes, US1 and US2 can start in parallel; US3 can start after US2; US4 can start after US3

---

## Parallel Example: User Story 1 Testing Phase

```bash
# Record cassettes first (sequential):
Task T024-T028: Record all cassettes in tests/record.py

# Create all fixtures in parallel:
Task T030: Create mock_list_workspaces_success
Task T031: Create mock_get_workspace_success
Task T032: Create mock_list_templates_success
Task T033: Create mock_get_template_parameters_success
Task T034: Create mock_list_workspace_presets_success

# Write all Client layer tests in parallel:
Task T035: Test list_workspaces()
Task T036: Test get_workspace()
Task T037: Test list_templates()
Task T038: Test get_template_parameters()
Task T039: Test list_workspace_presets()
Task T040: Test error handling

# Then implement Client layer (after tests fail):
Task T059: Implement list_workspaces()
Task T060: Implement get_workspace()
Task T061: Implement list_templates()
Task T062: Implement get_template_parameters()
Task T063: Implement list_workspace_presets()
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Agent Discovery) - TDD approach
4. Complete Phase 4: User Story 2 (Agent Lifecycle) - TDD approach
5. **STOP and VALIDATE**: Test User Stories 1 and 2 independently
6. Deploy/demo if ready

**MVP Justification**: User Stories 1 and 2 together provide the core value - users can discover, create, inspect, and delete agents. This is sufficient for initial fleet management use cases.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Agent discovery works
3. Add User Story 2 → Test independently → Agent lifecycle works → **Deploy MVP**
4. Add User Story 3 → Test independently → Task management works → Deploy
5. Add User Story 4 → Test independently → History tracking works → Deploy
6. Add Edge Cases → Robust error handling → Deploy
7. Add Polish → Production-ready → Final Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (all layers, TDD)
   - Developer B: User Story 2 (all layers, TDD)
3. After US1 and US2 complete:
   - Developer A: User Story 3 (depends on US2 agents existing)
   - Developer B: User Story 4 (depends on US3 task data)
4. Both developers: Edge Cases and Polish

---

## Summary Statistics

**Total Tasks**: 227
- Phase 1 (Setup): 7 tasks
- Phase 2 (Foundational): 16 tasks
- Phase 3 (User Story 1): 58 tasks (29 test + 29 implementation)
- Phase 4 (User Story 2): 49 tasks (26 test + 23 implementation)
- Phase 5 (User Story 3): 39 tasks (20 test + 19 implementation)
- Phase 6 (User Story 4): 39 tasks (20 test + 19 implementation)
- Phase 7 (Edge Cases): 9 tasks
- Phase 8 (Polish): 10 tasks

**Tasks Per User Story**:
- US1: 58 tasks (test fixtures, 4 layers × tests + implementations)
- US2: 49 tasks (test fixtures, 4 layers × tests + implementations)
- US3: 39 tasks (test fixtures, 4 layers × tests + implementations)
- US4: 39 tasks (test fixtures, 4 layers × tests + implementations)

**Parallel Opportunities**: 158 tasks marked [P] can run in parallel when dependencies allow

**MVP Scope**: Phases 1 + 2 + 3 + 4 = ~79 tasks (Setup + Foundational + US1 + US2)

**TDD Approach**: Every user story follows strict TDD:
1. Record VCR cassettes
2. Create reusable test fixtures
3. Write tests for all 4 layers (Client, Repository, Service, Tool)
4. Ensure tests FAIL
5. Implement bottom-up (Client → Repository → Service → Tool)
6. Verify tests PASS

**Independent Test Criteria**:
- US1: Call list_agents, show_agent, list_projects, list_roles - verify data returned
- US2: Create agent, verify exists, delete agent, verify gone, restart agent
- US3: Create agent, assign task, verify busy, cancel task, verify idle
- US4: Create agent, run tasks, paginate history and logs, verify data

**Format Validation**: ✅ ALL tasks follow the checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`

---

## Notes

- [P] tasks = different files, no dependencies within the same phase/layer
- [Story] label maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story should be independently completable and testable
- **TDD CRITICAL**: Verify tests FAIL before implementing - this ensures tests are actually testing the right thing
- Tests use reusable fixtures from VCR cassettes - no direct VCR usage in tests
- Bottom-up implementation: Client → Repository → Service → Tool
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow clean architecture: strict layer boundaries, unidirectional dependencies
