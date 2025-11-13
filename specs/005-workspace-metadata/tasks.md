# Tasks: Workspace Metadata for Fleet-MCP

**Input**: Design documents from `/specs/005-workspace-metadata/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: TDD approach - tests are written FIRST, verified to FAIL, then implementation follows, then verify tests PASS

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Repository structure: `libs/fleet-mcp/` (single library project)
- Source: `libs/fleet-mcp/src/fleet_mcp/`
- Tests: `libs/fleet-mcp/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create data model files structure: libs/fleet-mcp/src/fleet_mcp/models/metadata.py
- [ ] T002 Create client structure: libs/fleet-mcp/src/fleet_mcp/clients/metadata_client.py
- [ ] T003 [P] Create repository structure: libs/fleet-mcp/src/fleet_mcp/repositories/metadata_repository.py
- [ ] T004 [P] Create test directory structure: libs/fleet-mcp/tests/unit/models/, tests/unit/services/, tests/integration/, tests/contract/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### TDD: Write Tests for Core Models

- [ ] T005 [P] Write unit tests for MetadataSchema model in libs/fleet-mcp/tests/unit/models/test_metadata.py (verify they FAIL)
- [ ] T006 [P] Write unit tests for MetadataField model in libs/fleet-mcp/tests/unit/models/test_metadata.py (verify they FAIL)
- [ ] T007 [P] Write unit tests for WorkspaceMetadata model in libs/fleet-mcp/tests/unit/models/test_metadata.py (verify they FAIL)
- [ ] T008 Run tests to verify they FAIL (expected since models not implemented yet)

### Implement Core Models

- [ ] T009 [P] Implement MetadataSchema model in libs/fleet-mcp/src/fleet_mcp/models/metadata.py
- [ ] T010 [P] Implement MetadataField model in libs/fleet-mcp/src/fleet_mcp/models/metadata.py
- [ ] T011 [P] Implement WorkspaceMetadata model in libs/fleet-mcp/src/fleet_mcp/models/metadata.py
- [ ] T012 Run tests to verify they PASS

### TDD: Write Tests for Taskfile Parsing

- [ ] T013 Write unit tests for Taskfile parsing logic in libs/fleet-mcp/tests/unit/test_taskfile_parser.py (verify they FAIL)
- [ ] T014 Run tests to verify they FAIL

### Implement Taskfile Parsing

- [ ] T015 Implement Taskfile.yml parser (read, parse YAML, extract tasks with meta key) in libs/fleet-mcp/src/fleet_mcp/services/taskfile_parser.py
- [ ] T016 Run tests to verify they PASS

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Agent Workspace Context (Priority: P1) 🎯 MVP

**Goal**: Fleet operators can query a single agent to see workspace metadata (git branch, commit SHA, PR number)

**Independent Test**: Query show_agent tool and verify metadata fields are returned with correct values and schemas

### TDD: Write Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T017 [P] [US1] Write contract test for /metadata endpoint schema in libs/fleet-mcp/tests/contract/test_metadata_schema.py (verify FAILS)
- [ ] T018 [P] [US1] Write integration test for end-to-end metadata collection in libs/fleet-mcp/tests/integration/test_metadata_collection.py (verify FAILS)
- [ ] T019 [P] [US1] Write unit test for MetadataClient HTTP calls in libs/fleet-mcp/tests/unit/clients/test_metadata_client.py (verify FAILS)
- [ ] T020 [US1] Run all User Story 1 tests to verify they FAIL

### Implement User Story 1: /metadata Endpoint

- [ ] T021 [US1] Implement MetadataClient for HTTP GET to agent's /metadata endpoint in libs/fleet-mcp/src/fleet_mcp/clients/metadata_client.py
- [ ] T022 [US1] Run MetadataClient tests to verify they PASS
- [ ] T023 [US1] Implement /metadata endpoint handler in libs/fleet-mcp/src/fleet_mcp/__main__.py using @mcp.custom_route decorator
- [ ] T024 [US1] Add Taskfile.yml reading and task execution to /metadata endpoint handler
- [ ] T025 [US1] Add error handling for missing Taskfile, failed tasks, timeouts in /metadata endpoint
- [ ] T026 [US1] Run contract tests to verify they PASS
- [ ] T027 [US1] Run integration tests to verify they PASS

### Implement User Story 1: show_agent Integration

- [ ] T028 [US1] Write unit tests for MetadataRepository in libs/fleet-mcp/tests/unit/repositories/test_metadata_repository.py (verify FAILS)
- [ ] T029 [US1] Run tests to verify they FAIL
- [ ] T030 [US1] Implement MetadataRepository.collect_metadata() in libs/fleet-mcp/src/fleet_mcp/repositories/metadata_repository.py
- [ ] T031 [US1] Extend Agent model to add metadata field in libs/fleet-mcp/src/fleet_mcp/models/agent.py
- [ ] T032 [US1] Extend AgentService to call MetadataRepository in libs/fleet-mcp/src/fleet_mcp/services/agent_service.py
- [ ] T033 [US1] Update show_agent response to include metadata and metadata_count in libs/fleet-mcp/src/fleet_mcp/tools/show_agent.py
- [ ] T034 [US1] Run all User Story 1 tests to verify they PASS
- [ ] T035 [US1] Manual test: Create Taskfile.yml in test workspace, call show_agent, verify metadata returned

**Checkpoint**: At this point, User Story 1 should be fully functional - show_agent returns workspace metadata

---

## Phase 4: User Story 2 - Track Multiple Agents at Once (Priority: P2)

**Goal**: Fleet operators can list all agents and see summary metadata (only include_in_list=true fields, values only)

**Independent Test**: Query list_agents tool and verify each agent has filtered metadata (only include_in_list fields, values only without schemas)

### TDD: Write Tests for User Story 2

- [ ] T036 [P] [US2] Write contract test for list_agents metadata filtering in libs/fleet-mcp/tests/contract/test_list_agents_metadata.py (verify FAILS)
- [ ] T037 [P] [US2] Write integration test for list_agents with mixed metadata in libs/fleet-mcp/tests/integration/test_list_agents_metadata.py (verify FAILS)
- [ ] T038 [US2] Run all User Story 2 tests to verify they FAIL

### Implement User Story 2: list_agents Integration

- [ ] T039 [US2] Extend AgentService to collect metadata for all agents in list operation in libs/fleet-mcp/src/fleet_mcp/services/agent_service.py
- [ ] T040 [US2] Implement metadata filtering logic (include_in_list=true, values only) in libs/fleet-mcp/src/fleet_mcp/services/agent_service.py
- [ ] T041 [US2] Update list_agents response to include metadata and metadata_count per agent in libs/fleet-mcp/src/fleet_mcp/tools/list_agents.py
- [ ] T042 [US2] Run all User Story 2 tests to verify they PASS
- [ ] T043 [US2] Manual test: Create multiple agents with different Taskfiles, call list_agents, verify filtered metadata

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - show_agent returns full metadata, list_agents returns filtered metadata

---

## Phase 5: User Story 3 - PR Workflow Integration (Priority: P3)

**Goal**: Fleet operators can correlate agents with GitHub PRs through metadata (PR number extraction and tracking)

**Independent Test**: Create agent in workspace with PR, query agent, verify PR number is correctly extracted and returned

### TDD: Write Tests for User Story 3

- [ ] T044 [P] [US3] Write integration test for PR number extraction in libs/fleet-mcp/tests/integration/test_pr_metadata.py (verify FAILS)
- [ ] T045 [P] [US3] Write unit test for gh CLI command execution and parsing in libs/fleet-mcp/tests/unit/test_gh_integration.py (verify FAILS)
- [ ] T046 [US3] Run all User Story 3 tests to verify they FAIL

### Implement User Story 3: PR Metadata

- [ ] T047 [US3] Create example Taskfile.yml with PR metadata tasks (pull_request_number, pull_request_state) in libs/fleet-mcp/examples/Taskfile.yml
- [ ] T048 [US3] Document PR tracking workflow in quickstart.md
- [ ] T049 [US3] Run all User Story 3 tests to verify they PASS (tests validate example Taskfile works)
- [ ] T050 [US3] Manual test: Create workspace with PR, add Taskfile with gh commands, verify PR metadata returned

**Checkpoint**: All user stories should now be independently functional - PR tracking enabled through Taskfile configuration

---

## Phase 6: Edge Cases & Error Handling

**Purpose**: Comprehensive error handling for production readiness

### TDD: Write Tests for Edge Cases

- [ ] T051 [P] Write test for non-git workspace in libs/fleet-mcp/tests/integration/test_edge_cases.py (verify FAILS)
- [ ] T052 [P] Write test for detached HEAD state in libs/fleet-mcp/tests/integration/test_edge_cases.py (verify FAILS)
- [ ] T053 [P] Write test for missing Taskfile in libs/fleet-mcp/tests/integration/test_edge_cases.py (verify FAILS)
- [ ] T054 [P] Write test for malformed Taskfile in libs/fleet-mcp/tests/integration/test_edge_cases.py (verify FAILS)
- [ ] T055 [P] Write test for task timeout in libs/fleet-mcp/tests/integration/test_edge_cases.py (verify FAILS)
- [ ] T056 [P] Write test for HTTP 404 (agent app not running) in libs/fleet-mcp/tests/unit/clients/test_metadata_client.py (verify FAILS)
- [ ] T057 Run all edge case tests to verify they FAIL

### Implement Edge Case Handling

- [ ] T058 Add graceful degradation for non-git workspaces (return empty metadata) in libs/fleet-mcp/src/fleet_mcp/repositories/metadata_repository.py
- [ ] T059 Add error handling for detached HEAD state in Taskfile examples
- [ ] T060 Add error handling for missing Taskfile (return empty metadata) in libs/fleet-mcp/src/fleet_mcp/__main__.py
- [ ] T061 Add error handling for malformed Taskfile YAML in libs/fleet-mcp/src/fleet_mcp/services/taskfile_parser.py
- [ ] T062 Add timeout handling (5 seconds per task) in /metadata endpoint in libs/fleet-mcp/src/fleet_mcp/__main__.py
- [ ] T063 Add HTTP error handling (404, timeout, connection errors) in libs/fleet-mcp/src/fleet_mcp/clients/metadata_client.py
- [ ] T064 Run all edge case tests to verify they PASS

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Documentation & Examples

- [ ] T065 [P] Create comprehensive Taskfile.yml example with all metadata patterns in libs/fleet-mcp/examples/Taskfile-complete.yml
- [ ] T066 [P] Update quickstart.md with end-to-end examples and troubleshooting
- [ ] T067 [P] Add inline documentation to all new models and services

### Code Quality

- [ ] T068 Run pytest for all tests and verify 100% pass rate
- [ ] T069 Run trunk check and fix any linting issues across all modified files
- [ ] T070 Run trunk fmt to format all modified files
- [ ] T071 Review all error messages for clarity and actionability

### Performance & Validation

- [ ] T072 Measure metadata collection time and verify <2 seconds overhead per agent
- [ ] T073 Test with 10+ agents and verify list_agents performance is acceptable
- [ ] T074 Validate all quickstart.md examples work end-to-end

### Final Verification

- [ ] T075 Run all tests (unit, integration, contract) and verify 100% pass rate
- [ ] T076 Manual end-to-end test: Setup → Create agents → Add Taskfiles → Query metadata → Verify results
- [ ] T077 Review all TODO/FIXME comments and address or document them

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Edge Cases (Phase 6)**: Depends on all user stories being implemented
- **Polish (Phase 7)**: Depends on all user stories and edge cases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (reuses MetadataRepository and models)
- **User Story 3 (P3)**: Depends on User Story 1 (builds on metadata collection infrastructure)

### Within Each User Story (TDD Workflow)

1. **Write tests FIRST** - All tests for a story before any implementation
2. **Run tests** - Verify they FAIL (proves tests are valid)
3. **Implement** - Write minimal code to make tests pass
4. **Run tests** - Verify they PASS
5. **Move to next task** - Only proceed when tests are green

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tests (T005-T007) can run in parallel
- All Foundational models (T009-T011) can run in parallel
- All User Story 1 tests (T017-T019) can run in parallel
- All edge case tests (T051-T056) can run in parallel
- All documentation tasks (T065-T067) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write contract test for /metadata endpoint schema" (T017)
Task: "Write integration test for end-to-end metadata collection" (T018)
Task: "Write unit test for MetadataClient HTTP calls" (T019)

# Run all tests to verify they FAIL
pytest libs/fleet-mcp/tests/ -k "US1" --verbose

# After implementation, run all tests to verify they PASS
pytest libs/fleet-mcp/tests/ -k "US1" --verbose
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
   - TDD: Write model tests → Verify FAIL → Implement models → Verify PASS
   - TDD: Write parser tests → Verify FAIL → Implement parser → Verify PASS
3. Complete Phase 3: User Story 1
   - TDD: Write all US1 tests → Verify FAIL → Implement → Verify PASS
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
   - Each foundational component: Test → Fail → Implement → Pass
2. Add User Story 1 → TDD workflow → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → TDD workflow → Test independently → Deploy/Demo
4. Add User Story 3 → TDD workflow → Test independently → Deploy/Demo
5. Add Edge Cases → TDD workflow → Validate robustness
6. Polish → Final validation
7. Each story adds value without breaking previous stories

### TDD Workflow (Critical)

For EVERY task that involves code:

1. **Red**: Write test first, run it, verify it FAILS
2. **Green**: Write minimal code to make test pass, run test, verify it PASSES
3. **Refactor**: Clean up code while keeping tests green
4. **Move on**: Only proceed to next task when tests are passing

**Do NOT skip the "verify FAIL" step** - it proves your test is valid!

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **CRITICAL**: Verify tests FAIL before implementing, then verify tests PASS after implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `pytest libs/fleet-mcp/tests/` frequently throughout development
- Use `trunk check` and `trunk fmt` before committing
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
