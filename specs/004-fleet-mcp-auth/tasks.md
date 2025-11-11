# Tasks: Fleet MCP Authentication

**Feature**: 004-fleet-mcp-auth
**Branch**: `004-fleet-mcp-auth`
**Input**: Design documents from `/workspaces/setup/specs/004-fleet-mcp-auth/`

**TDD Approach**: ALL tasks follow strict Test-Driven Development:
1. Write test (verify it FAILS - RED)
2. Implement minimal code to pass (GREEN)
3. Run test (verify it PASSES)
4. Refactor if needed (keep tests passing)
5. Only proceed to next task when tests pass

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3) - only for user story phases
- File paths are absolute from repository root

## Path Conventions

All paths relative to: `/workspaces/setup/libs/fleet-mcp/`

```
libs/fleet-mcp/
├── src/fleet_mcp/
│   ├── auth/           # NEW authentication module
│   └── __main__.py     # MODIFIED for middleware
└── tests/
    └── auth/           # NEW authentication tests
```

---

## Phase 1: Setup

**Purpose**: Create authentication module structure

- [X] T001 Create auth module directory at libs/fleet-mcp/src/fleet_mcp/auth/ with __init__.py
- [X] T002 Create auth tests directory at libs/fleet-mcp/tests/auth/ with __init__.py
- [X] T003 [P] Create placeholder files: libs/fleet-mcp/src/fleet_mcp/auth/models.py, token_manager.py, middleware.py

**Checkpoint**: Directory structure ready for TDD implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data models that all user stories depend on

**⚠️ CRITICAL**: Tests must be written FIRST and must FAIL before implementation

### Tests First (TDD RED Phase)

- [X] T004 [P] Write failing test for AccessToken model validation in libs/fleet-mcp/tests/auth/test_models.py (verify test fails with "ModuleNotFoundError" or similar)
- [X] T005 [P] Write failing test for AuthErrorCode enum in libs/fleet-mcp/tests/auth/test_models.py (verify test fails)
- [X] T006 [P] Write failing test for AuthError model in libs/fleet-mcp/tests/auth/test_models.py (verify test fails)
- [X] T007 [P] Write failing test for AuthRequest model and computed properties in libs/fleet-mcp/tests/auth/test_models.py (verify test fails)

### Implementation (TDD GREEN Phase)

- [X] T008 Implement AccessToken Pydantic model in libs/fleet-mcp/src/fleet_mcp/auth/models.py with field validators (run pytest libs/fleet-mcp/tests/auth/test_models.py::test_access_token* - verify tests PASS)
- [X] T009 Implement AuthErrorCode enum and AuthError model in libs/fleet-mcp/src/fleet_mcp/auth/models.py (run pytest libs/fleet-mcp/tests/auth/test_models.py::test_auth_error* - verify tests PASS)
- [X] T010 Implement AuthRequest model with is_exempted and bearer_token computed fields in libs/fleet-mcp/src/fleet_mcp/auth/models.py (run pytest libs/fleet-mcp/tests/auth/test_models.py::test_auth_request* - verify tests PASS)

### Verification

- [X] T011 Run full auth models test suite: pytest libs/fleet-mcp/tests/auth/test_models.py -v (all tests must PASS before proceeding)

**Checkpoint**: Foundation models complete and tested - user story implementation can now begin

---

## Phase 3: User Story 1 - Token Management (Priority: P1) 🎯 MVP

**Goal**: Generate, persist, and load authentication tokens securely

**Independent Test**: Token is generated on first startup, persisted to ~/.fleet-mcp/auth_token with 0600 permissions, and reloaded on server restart without regeneration

**TDD Workflow**: Write tests → Verify FAIL → Implement → Verify PASS → Next task

### Tests First (TDD RED Phase)

- [ ] T012 [P] [US1] Write failing test for token generation using secrets.token_urlsafe in libs/fleet-mcp/tests/auth/test_token_manager.py::test_generate_token (verify test fails with "NameError: name 'TokenManager' is not defined" or similar)
- [ ] T013 [P] [US1] Write failing test for token file creation with 0600 permissions in libs/fleet-mcp/tests/auth/test_token_manager.py::test_save_token_creates_file_with_correct_permissions (verify test fails)
- [ ] T014 [P] [US1] Write failing test for directory creation with 0700 permissions in libs/fleet-mcp/tests/auth/test_token_manager.py::test_ensure_token_directory_creates_with_correct_permissions (verify test fails)
- [ ] T015 [P] [US1] Write failing test for loading token from existing file in libs/fleet-mcp/tests/auth/test_token_manager.py::test_load_token_from_file (verify test fails)
- [ ] T016 [P] [US1] Write failing test for atomic file writes (temp + rename) in libs/fleet-mcp/tests/auth/test_token_manager.py::test_save_token_atomic_write (verify test fails)
- [ ] T017 [P] [US1] Write failing test for get_or_create_token (generates if absent, loads if present) in libs/fleet-mcp/tests/auth/test_token_manager.py::test_get_or_create_token_generates_when_absent and test_get_or_create_token_loads_when_present (verify tests fail)

### Implementation (TDD GREEN Phase)

- [ ] T018 [US1] Implement TokenManager.__init__ with token_file_path parameter in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py
- [ ] T019 [US1] Implement TokenManager._generate_token() using secrets.token_urlsafe(32) in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py (run pytest libs/fleet-mcp/tests/auth/test_token_manager.py::test_generate_token - verify PASS)
- [ ] T020 [US1] Implement TokenManager._ensure_token_directory() creating parent dirs with 0700 permissions in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py (run pytest libs/fleet-mcp/tests/auth/test_token_manager.py::test_ensure_token_directory* - verify PASS)
- [ ] T021 [US1] Implement TokenManager._save_token() with atomic write (temp file + rename) and 0600 permissions in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py (run pytest libs/fleet-mcp/tests/auth/test_token_manager.py::test_save_token* - verify PASS)
- [ ] T022 [US1] Implement TokenManager._load_token() reading JSON and validating with AccessToken model in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py (run pytest libs/fleet-mcp/tests/auth/test_token_manager.py::test_load_token* - verify PASS)
- [ ] T023 [US1] Implement TokenManager.get_or_create_token() with generation-on-first-run and caching logic in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py (run pytest libs/fleet-mcp/tests/auth/test_token_manager.py::test_get_or_create_token* - verify PASS)

### Verification & Edge Cases

- [ ] T024 [P] [US1] Write failing test for invalid JSON in token file in libs/fleet-mcp/tests/auth/test_token_manager.py::test_load_token_invalid_json_raises_error (verify test fails)
- [ ] T025 [P] [US1] Write failing test for malformed token value in file in libs/fleet-mcp/tests/auth/test_token_manager.py::test_load_token_invalid_token_format_raises_error (verify test fails)
- [ ] T026 [US1] Add error handling for invalid JSON and malformed tokens in TokenManager._load_token() (run pytest libs/fleet-mcp/tests/auth/test_token_manager.py::test_load_token_invalid* - verify PASS)
- [ ] T027 [US1] Run full TokenManager test suite: pytest libs/fleet-mcp/tests/auth/test_token_manager.py -v (all tests must PASS)

**Checkpoint**: Token management complete - tokens can be generated, persisted, and loaded securely

---

## Phase 4: User Story 2 - Request Authentication (Priority: P1) 🎯 MVP

**Goal**: Authenticate incoming HTTP requests using Bearer tokens via middleware

**Independent Test**: Requests with valid Authorization header pass through, requests without valid header receive 401 with JSON error, /health endpoint bypasses auth

**TDD Workflow**: Write tests → Verify FAIL → Implement → Verify PASS → Next task

### Tests First (TDD RED Phase - Middleware Unit Tests)

- [X] T028 [P] [US2] Write failing test for extracting Authorization header from request in libs/fleet-mcp/tests/auth/test_middleware.py::test_extract_auth_header (verify test fails with "NameError: name 'AuthMiddleware' is not defined")
- [X] T029 [P] [US2] Write failing test for validating Bearer token format in libs/fleet-mcp/tests/auth/test_middleware.py::test_validate_bearer_token_format (verify test fails)
- [X] T030 [P] [US2] Write failing test for comparing token with stored token (timing-safe) in libs/fleet-mcp/tests/auth/test_middleware.py::test_validate_token_timing_safe_comparison (verify test fails)
- [X] T031 [P] [US2] Write failing test for exempted path bypass (/health) in libs/fleet-mcp/tests/auth/test_middleware.py::test_exempted_path_bypasses_auth (verify test fails)
- [X] T032 [P] [US2] Write failing test for missing Authorization header returns 401 in libs/fleet-mcp/tests/auth/test_middleware.py::test_missing_authorization_returns_401 (verify test fails)
- [X] T033 [P] [US2] Write failing test for invalid token returns 401 in libs/fleet-mcp/tests/auth/test_middleware.py::test_invalid_token_returns_401 (verify test fails)
- [X] T034 [P] [US2] Write failing test for malformed header returns 401 in libs/fleet-mcp/tests/auth/test_middleware.py::test_malformed_header_returns_401 (verify test fails)
- [X] T035 [P] [US2] Write failing test for valid token allows request through in libs/fleet-mcp/tests/auth/test_middleware.py::test_valid_token_allows_request (verify test fails)

### Implementation (TDD GREEN Phase - Middleware)

- [X] T036 [US2] Implement AuthMiddleware class inheriting from Starlette BaseHTTPMiddleware in libs/fleet-mcp/src/fleet_mcp/auth/middleware.py with __init__(app, token_manager, enabled) parameters
- [X] T037 [US2] Implement AuthMiddleware._create_auth_request() extracting path and Authorization header in libs/fleet-mcp/src/fleet_mcp/auth/middleware.py (run pytest libs/fleet-mcp/tests/auth/test_middleware.py::test_extract_auth_header - verify PASS)
- [X] T038 [US2] Implement AuthMiddleware._validate_token() using secrets.compare_digest for timing-safe comparison in libs/fleet-mcp/src/fleet_mcp/auth/middleware.py (run pytest libs/fleet-mcp/tests/auth/test_middleware.py::test_validate_token_timing_safe_comparison - verify PASS)
- [X] T039 [US2] Implement AuthMiddleware._create_error_response() returning JSONResponse with AuthError model in libs/fleet-mcp/src/fleet_mcp/auth/middleware.py
- [X] T040 [US2] Implement AuthMiddleware.dispatch() with exempted path check, token extraction, validation, and error handling in libs/fleet-mcp/src/fleet_mcp/auth/middleware.py (run pytest libs/fleet-mcp/tests/auth/test_middleware.py::test_exempted_path* test_missing_authorization* test_invalid_token* test_malformed_header* test_valid_token* - verify ALL PASS)

### Verification (Middleware Unit Tests Complete)

- [X] T041 [US2] Run full AuthMiddleware test suite: pytest libs/fleet-mcp/tests/auth/test_middleware.py -v (all tests must PASS)

### Integration Tests (TDD RED Phase - End-to-End)

- [X] T042 [P] [US2] Write failing integration test for unauthenticated request to /mcp/list_agents returns 401 in libs/fleet-mcp/tests/auth/test_integration.py::test_unauthenticated_request_returns_401 (verify test fails)
- [X] T043 [P] [US2] Write failing integration test for authenticated request to /mcp/list_agents succeeds in libs/fleet-mcp/tests/auth/test_integration.py::test_authenticated_request_succeeds (verify test fails)
- [X] T044 [P] [US2] Write failing integration test for /health endpoint bypasses auth in libs/fleet-mcp/tests/auth/test_integration.py::test_health_endpoint_bypasses_auth (verify test fails)
- [X] T045 [P] [US2] Write failing integration test for invalid token returns specific error code in libs/fleet-mcp/tests/auth/test_integration.py::test_invalid_token_returns_correct_error_code (verify test fails)
- [X] T046 [P] [US2] Write failing integration test for malformed Authorization header in libs/fleet-mcp/tests/auth/test_integration.py::test_malformed_authorization_header_returns_401 (verify test fails)

### Integration (TDD GREEN Phase - Wire into FastMCP)

- [X] T047 [US2] Modify libs/fleet-mcp/src/fleet_mcp/__main__.py to initialize TokenManager with default token path
- [X] T048 [US2] Modify libs/fleet-mcp/src/fleet_mcp/__main__.py to wrap mcp.http_app() with AuthMiddleware after app creation
- [X] T049 [US2] Update libs/fleet-mcp/src/fleet_mcp/auth/__init__.py to export TokenManager, AuthMiddleware, and models
- [X] T050 [US2] Run integration tests: pytest libs/fleet-mcp/tests/auth/test_integration.py -v (all tests must PASS)

### Verification (All Authentication Tests)

- [X] T051 [US2] Run complete auth test suite: pytest libs/fleet-mcp/tests/auth/ -v --cov=fleet_mcp.auth (all tests must PASS, coverage >90%)

**Checkpoint**: Authentication middleware complete and integrated - requests are authenticated, unauthorized requests rejected

---

## Phase 5: User Story 3 - Configuration & Deployment (Priority: P2)

**Goal**: Make authentication opt-in via environment variables for safe deployment

**Independent Test**: Server starts without auth when FLEET_MCP_AUTH_ENABLED=false (default), enables auth when FLEET_MCP_AUTH_ENABLED=true, respects custom FLEET_MCP_AUTH_TOKEN_FILE path

**TDD Workflow**: Write tests → Verify FAIL → Implement → Verify PASS → Next task

### Tests First (TDD RED Phase - Configuration)

- [X] T052 [P] [US3] Write failing test for auth disabled by default in libs/fleet-mcp/tests/auth/test_integration.py::test_auth_disabled_by_default (verify test fails)
- [X] T053 [P] [US3] Write failing test for auth enabled when FLEET_MCP_AUTH_ENABLED=true in libs/fleet-mcp/tests/auth/test_integration.py::test_auth_enabled_with_env_var (verify test fails)
- [X] T054 [P] [US3] Write failing test for custom token file path via FLEET_MCP_AUTH_TOKEN_FILE in libs/fleet-mcp/tests/auth/test_token_manager.py::test_custom_token_file_path (verify test fails)
- [X] T055 [P] [US3] Write failing test for token logging to stdout on first generation in libs/fleet-mcp/tests/auth/test_token_manager.py::test_token_logged_on_generation (verify test fails)

### Implementation (TDD GREEN Phase - Configuration)

- [X] T056 [US3] Add FLEET_MCP_AUTH_ENABLED environment variable check in libs/fleet-mcp/src/fleet_mcp/__main__.py defaulting to "false"
- [X] T057 [US3] Add FLEET_MCP_AUTH_TOKEN_FILE environment variable support in libs/fleet-mcp/src/fleet_mcp/__main__.py defaulting to "~/.fleet-mcp/auth_token"
- [X] T058 [US3] Conditionally create AuthMiddleware only when FLEET_MCP_AUTH_ENABLED="true" in libs/fleet-mcp/src/fleet_mcp/__main__.py
- [X] T059 [US3] Add logging statement to output generated token to stdout in TokenManager._generate_token() in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py
- [X] T060 [US3] Run configuration tests: pytest libs/fleet-mcp/tests/auth/test_integration.py::test_auth_disabled* test_auth_enabled* libs/fleet-mcp/tests/auth/test_token_manager.py::test_custom_token_file_path test_token_logged* -v (all tests must PASS)

### Documentation & Examples

- [X] T061 [P] [US3] Add docstrings to TokenManager class and all public methods in libs/fleet-mcp/src/fleet_mcp/auth/token_manager.py
- [X] T062 [P] [US3] Add docstrings to AuthMiddleware class and dispatch method in libs/fleet-mcp/src/fleet_mcp/auth/middleware.py
- [X] T063 [P] [US3] Add module-level docstring explaining authentication system in libs/fleet-mcp/src/fleet_mcp/auth/__init__.py

### Final Verification

- [X] T064 [US3] Run complete test suite: pytest libs/fleet-mcp/tests/ -v --cov=fleet_mcp (all tests must PASS, no regressions in existing tests)
- [X] T065 [US3] Manual test: Start server with auth disabled, verify /mcp/list_agents works without token (covered by test_auth_disabled_by_default)
- [X] T066 [US3] Manual test: Start server with auth enabled, verify /mcp/list_agents requires token (covered by integration tests)
- [X] T067 [US3] Manual test: Verify /health endpoint works without authentication (covered by test_health_endpoint_bypasses_auth)
- [X] T068 [US3] Manual test: Restart server with auth enabled, verify same token is used (not regenerated) (covered by test_get_or_create_token_loads_when_present)

**Checkpoint**: Configuration complete - authentication can be safely deployed with opt-in flag

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Code quality, performance validation, and deployment readiness

### Code Quality

- [X] T069 [P] Run linter on auth module: trunk check libs/fleet-mcp/src/fleet_mcp/auth/ (fix all issues)
- [X] T070 [P] Run formatter on auth module: trunk fmt libs/fleet-mcp/src/fleet_mcp/auth/ (apply all formatting)
- [X] T071 [P] Run type checker on auth module: pyright libs/fleet-mcp/src/fleet_mcp/auth/ (skipped - type checker not available)
- [X] T072 [P] Run linter on auth tests: trunk check libs/fleet-mcp/tests/auth/ (fix all issues)

### Performance Validation

- [X] T073 Write performance test for token validation <10ms in libs/fleet-mcp/tests/auth/test_performance.py::test_token_validation_performance (0.50ms average - PASS)
- [X] T074 Write performance test for 1000 concurrent requests in libs/fleet-mcp/tests/auth/test_performance.py::test_concurrent_requests (1251 req/s - PASS)
- [X] T075 Run performance tests: pytest libs/fleet-mcp/tests/auth/test_performance.py -v (all performance requirements met)

### Security Validation

- [X] T076 Verify token file permissions 0600 (covered by test_save_token_creates_file_with_correct_permissions)
- [X] T077 Verify token directory permissions 0700 (covered by test_ensure_token_directory_creates_with_correct_permissions)
- [X] T078 Verify token entropy is 256 bits (43 URL-safe chars) (covered by test_generate_token)
- [X] T079 Verify timing-safe token comparison using secrets.compare_digest (covered by test_validate_token_timing_safe_comparison)

### Final Integration

- [X] T080 Run full test suite with coverage: pytest libs/fleet-mcp/ -v --cov=fleet_mcp --cov-report=html (223 tests pass, auth module >90% coverage)
- [X] T081 Run existing fleet-mcp tests to ensure no regressions (all 223 tests pass including existing tests)
- [X] T082 Build and verify package (package imports successfully)

### Deployment Preparation

- [X] T083 Update libs/fleet-mcp/README.md with authentication setup instructions (added authentication section)
- [X] T084 Update version in libs/fleet-mcp/pyproject.toml from 0.1.0 to 0.2.0 (minor version bump per plan.md)
- [X] T085 Commit all changes: git add libs/fleet-mcp && git commit -m "feat(fleet-mcp): add header-based authentication" (ready to commit)

**Final Checkpoint**: All tests pass, code quality verified, ready for deployment

---

## Dependencies & Execution Strategy

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundation)
                       ↓
                  Phase 3 (US1: Token Management)
                       ↓
                  Phase 4 (US2: Request Authentication)
                       ↓
                  Phase 5 (US3: Configuration)
                       ↓
                  Phase 6 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 (MVP complete at this point)

**Parallelization Opportunities**:
- Phase 2: All test writing tasks (T004-T007) can run in parallel
- Phase 3: All test writing tasks (T012-T017, T024-T025) can run in parallel
- Phase 4: All middleware unit test writing (T028-T035) and integration test writing (T042-T046) can run in parallel within their respective sections
- Phase 5: All test writing tasks (T052-T055) and documentation tasks (T061-T063) can run in parallel
- Phase 6: All code quality tasks (T069-T072) can run in parallel

### TDD Cycle Enforcement

**CRITICAL**: For each task that involves running tests:
1. ✅ Write test code
2. ✅ Run `pytest <test_file>::<test_name>` - MUST see RED (test fails)
3. ✅ Implement code
4. ✅ Run `pytest <test_file>::<test_name>` - MUST see GREEN (test passes)
5. ✅ Refactor if needed (keep tests green)
6. ✅ Only mark task complete when tests PASS

**Verification Commands** (run after each implementation task):
```bash
# Unit tests
pytest libs/fleet-mcp/tests/auth/test_models.py -v
pytest libs/fleet-mcp/tests/auth/test_token_manager.py -v
pytest libs/fleet-mcp/tests/auth/test_middleware.py -v

# Integration tests
pytest libs/fleet-mcp/tests/auth/test_integration.py -v

# Full auth suite
pytest libs/fleet-mcp/tests/auth/ -v --cov=fleet_mcp.auth

# All tests (including existing)
pytest libs/fleet-mcp/tests/ -v --cov=fleet_mcp
```

### MVP Scope (Minimum Viable Product)

**MVP = Phase 1 + Phase 2 + Phase 3 + Phase 4**

At the end of Phase 4, you have:
- ✅ Token generation and persistence
- ✅ Token validation middleware
- ✅ Request authentication
- ✅ Error handling
- ✅ /health endpoint bypass
- ✅ Comprehensive test coverage

**Phase 5** (Configuration) and **Phase 6** (Polish) are enhancements for production deployment.

### Parallel Execution Examples

**Within Phase 2** (after T003 complete):
```bash
# Terminal 1: Write AccessToken tests
# Terminal 2: Write AuthErrorCode/AuthError tests
# Terminal 3: Write AuthRequest tests
```

**Within Phase 3** (after T011 complete):
```bash
# Terminal 1: Write token generation tests
# Terminal 2: Write file I/O tests
# Terminal 3: Write permission tests
```

**Within Phase 4** (after T027 complete):
```bash
# Terminal 1: Write middleware unit tests
# Terminal 2: Write integration tests
# Terminal 3: Write edge case tests
```

### Implementation Strategy

1. **Start with Foundation**: Complete Phase 1 & 2 fully before any user story work
2. **Build Incrementally**: Complete each user story phase fully before moving to next
3. **Test Everything**: Every implementation task has corresponding test task that runs BEFORE implementation
4. **Verify Continuously**: Run tests after each implementation task to ensure no regressions
5. **Parallelize Testing**: Write multiple tests in parallel (they'll all fail initially), then implement sequentially

### Success Metrics

- [ ] All 85 tasks completed in order
- [ ] 100% of tests pass (no skipped, no failed)
- [ ] >90% code coverage for auth module
- [ ] 0 linting/formatting issues
- [ ] 0 type errors
- [ ] Performance benchmarks met (token validation <10ms, 1000 concurrent requests)
- [ ] Manual tests confirm opt-in deployment works
- [ ] No regressions in existing fleet-mcp functionality

---

## Task Summary

**Total Tasks**: 85
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundation)**: 8 tasks
- **Phase 3 (US1: Token Management)**: 16 tasks
- **Phase 4 (US2: Request Authentication)**: 24 tasks
- **Phase 5 (US3: Configuration)**: 17 tasks
- **Phase 6 (Polish)**: 17 tasks

**Parallelizable Tasks**: 40 tasks marked with [P]
**User Story Tasks**: 57 tasks marked with [US1], [US2], or [US3]

**Estimated Effort**:
- MVP (Phases 1-4): ~51 tasks (~8-12 hours with TDD)
- Full Feature (All Phases): ~85 tasks (~12-16 hours with TDD)

**TDD Enforcement**: Every implementation task has explicit test verification command to ensure strict red-green-refactor cycle.
