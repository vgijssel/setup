# Tasks: Internal DNS Service for Kubernetes Ingresses

**Input**: Design documents from `/workspaces/setup/specs/001-build-a-dns/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: Python 3.11+, Crossplane >= 2.0.2, cdk8s, external-dns, PowerDNS
   → Libraries: libs/cdk8s-function-xp, libs/internal-dns-xp
   → Structure: Two independent Nx libraries
2. Load optional design documents ✓
   → data-model.md: InternalDNS XRD, Deployment, Service, PVC, ConfigMap, Secret entities
   → contracts/: xrd-schema.yaml, function-api.md
   → research.md: Crossplane function design, external-dns integration, testing strategy
3. Generate tasks by category ✓
   → Setup: Nx projects, Python environments, third_party deps, tools
   → Tests: XRD validation, function API tests, render tests, kuttl tests
   → Core: cdk8s function, DNS resources, Crossplane composition
   → Integration: kuttl test suite, DNS resolution validation
   → Polish: unit tests, documentation
4. Apply task rules ✓
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
8. Validate task completeness ✓
   → All contracts have tests ✓
   → All entities have models ✓
   → All endpoints implemented ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
This feature uses Nx monorepo structure:
- **cdk8s-function-xp**: `libs/cdk8s-function-xp/`
- **internal-dns-xp**: `libs/internal-dns-xp/`
- **third_party**: `third_party/python/`, `third_party/helm/`

## Phase 3.1: Infrastructure Setup
- [x] T001 Create Nx project for cdk8s-function-xp at `libs/cdk8s-function-xp/project.json`
- [x] T002 Create Nx project for internal-dns-xp at `libs/internal-dns-xp/project.json`
- [x] T003 [P] Set up Python environment with uv for cdk8s-function-xp at `libs/cdk8s-function-xp/pyproject.toml`
- [x] T004 [P] Set up Python environment with uv for internal-dns-xp at `libs/internal-dns-xp/pyproject.toml`
- [x] T005 [P] Add crossplane CLI to bin/ or Hermit configuration
- [x] T006 [P] Add kind CLI to bin/ or Hermit configuration
- [x] T007 [P] Add kuttl CLI to bin/ or Hermit configuration
- [x] T008 Update bin/help with new tools documentation

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests
- [x] T009 [P] XRD schema validation test in `libs/internal-dns-xp/tests/unit/test_xrd_schema.py`
- [x] T010 [P] Function API request contract test in `libs/cdk8s-function-xp/tests/unit/test_function_request.py`
- [x] T011 [P] Function API response contract test in `libs/cdk8s-function-xp/tests/unit/test_function_response.py`

### cdk8s Function Tests
- [x] T012 [P] Test cdk8s renderer with valid code in `libs/cdk8s-function-xp/tests/unit/test_renderer_valid.py`
- [x] T013 [P] Test cdk8s renderer error handling in `libs/cdk8s-function-xp/tests/unit/test_renderer_errors.py`
- [x] T014 [P] Test props mapping from composite spec in `libs/cdk8s-function-xp/tests/unit/test_props_mapping.py`

### DNS Resources Tests
- [x] T015 [P] Test Deployment resource generation in `libs/internal-dns-xp/tests/unit/test_deployment.py`
- [x] T016 [P] Test Service resource generation in `libs/internal-dns-xp/tests/unit/test_service.py`
- [x] T017 [P] Test PVC resource generation in `libs/internal-dns-xp/tests/unit/test_pvc.py`
- [x] T018 [P] Test ConfigMap resource generation in `libs/internal-dns-xp/tests/unit/test_configmap.py`
- [x] T019 [P] Test Secret resource generation in `libs/internal-dns-xp/tests/unit/test_secret.py`
- [x] T020 [P] cdk8s snapshot test for all DNS resources in `libs/internal-dns-xp/tests/unit/test_dns_resources_snapshot.py`

### Crossplane Render Tests
- [x] T021 Create Crossplane render test input in `libs/internal-dns-xp/tests/render/test-input.yaml`
- [x] T022 Create Crossplane render test assertion script in `libs/internal-dns-xp/tests/render/validate-render.sh`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### cdk8s Function Implementation
- [x] T023 Create function entry point in `libs/cdk8s-function-xp/src/function.py`
- [x] T024 Implement cdk8s renderer in `libs/cdk8s-function-xp/src/cdk8s_renderer.py`
- [x] T025 Create function requirements.txt with pinned versions in `libs/cdk8s-function-xp/src/requirements.txt`
- [x] T026 Create Dockerfile for function container in `libs/cdk8s-function-xp/Dockerfile`
- [x] T027 Create Crossplane function package metadata in `libs/cdk8s-function-xp/crossplane.yaml`

### DNS Resources Implementation
- [x] T028 Implement DNS resources with cdk8s in `libs/internal-dns-xp/src/dns_resources.py` (creates Deployment, Service, PVC, ConfigMap, Secret)

### Crossplane Configuration
- [x] T029 Create XRD definition from contract in `libs/internal-dns-xp/definition.yaml`
- [x] T030 Create Crossplane composition using cdk8s function in `libs/internal-dns-xp/compositions/internal-dns.yaml`
- [x] T031 Create Crossplane configuration package metadata in `libs/internal-dns-xp/crossplane.yaml`

### Build Configuration
- [x] T032 Configure Docker build target in `libs/cdk8s-function-xp/project.json` for function image
- [x] T033 Configure pytest target in `libs/cdk8s-function-xp/project.json`
- [x] T034 Configure pytest target in `libs/internal-dns-xp/project.json`
- [x] T035 Configure Crossplane render target in `libs/internal-dns-xp/project.json`

## Phase 3.4: Integration Testing
- [x] T036 Create kuttl test directory structure at `libs/internal-dns-xp/tests/integration/kuttl/`
- [x] T037 Create kind cluster config in `libs/internal-dns-xp/tests/integration/kuttl/kind-config.yaml`
- [x] T038 Create kuttl test 00-install.yaml for Crossplane installation
- [x] T039 Create kuttl test 01-function.yaml to install cdk8s function
- [x] T040 Create kuttl test 02-config.yaml to install internal-dns configuration
- [x] T041 Create kuttl test 03-create-dns.yaml to create InternalDNS resource
- [x] T042 Create kuttl test 03-assert.yaml to validate DNS deployment is running
- [x] T043 Create kuttl test 04-create-ingress.yaml to create test Ingress
- [x] T044 Create kuttl test 04-assert.yaml to validate DNS record creation
- [x] T045 Create kuttl test 05-dns-query.yaml to test DNS resolution
- [x] T046 Create kuttl test 05-assert.yaml to validate query response
- [x] T047 Create kuttl test 06-delete-ingress.yaml to delete test Ingress
- [x] T048 Create kuttl test 06-assert.yaml to validate DNS record deletion
- [x] T049 Configure kuttl integration test target in `libs/internal-dns-xp/project.json`

## Phase 3.5: Third-Party Dependencies
- [x] T050 [P] Add external-dns reference to `third_party/helm/external-dns/`
- [x] T051 [P] Add PowerDNS reference to `third_party/helm/powerdns/`
- [x] T052 [P] Add cdk8s reference to `third_party/python/cdk8s/`
- [x] T053 [P] Add Crossplane reference to `third_party/helm/crossplane/`

## Phase 3.6: Documentation
- [x] T054 [P] Create README for cdk8s-function-xp at `libs/cdk8s-function-xp/README.md`
- [x] T055 [P] Create README for internal-dns-xp at `libs/internal-dns-xp/README.md`
- [x] T056 [P] Document deployment process in `libs/internal-dns-xp/docs/deployment.md`
- [x] T057 Update main project documentation with DNS service information

## Phase 3.7: Validation & Polish
- [x] T058 Run all unit tests: `nx test cdk8s-function-xp` ✅ 35 tests passed
- [x] T059 Run all unit tests: `nx test internal-dns-xp` ✅ 29 tests passed
- [x] T060 Run Crossplane render test: `nx crossplane-render internal-dns-xp` ✅ All manifests validated
- [ ] T061 Run kuttl integration tests: `nx integration-test internal-dns-xp` ⚠️ Kind cluster fails to start in current environment
- [x] T062 Build function Docker image: `nx docker-build cdk8s-function-xp` ✅ Image built successfully
- [x] T063 Run affected tests: `nx affected:test` ✅ All tests passed
- [ ] T064 Execute quickstart guide validation at `specs/001-build-a-dns/quickstart.md` ⚠️ Requires full deployment
- [x] T065 [P] Format all code: `trunk fmt` ✅ All files formatted
- [x] T066 [P] Lint all code: `trunk check` ✅ Only auto-generated k8s imports have lint issues
- [ ] T067 Performance test: Validate DNS query response time < 500ms ⚠️ Requires deployment
- [ ] T068 Scale test: Create 10+ test ingresses and validate all resolve correctly ⚠️ Requires deployment

## Dependencies

### Critical Path
1. Setup (T001-T008) → Blocks everything
2. Tests (T009-T022) → Must complete before implementation
3. cdk8s Function (T023-T027) → Blocks DNS resources and composition
4. DNS Resources (T028) → Blocks composition
5. Composition (T029-T031) → Blocks integration tests
6. Build Config (T032-T035) → Blocks integration tests
7. Integration Tests (T036-T049) → Validation
8. Validation (T058-T068) → Final gate

### Parallel Opportunities
- T003, T004: Python environments (different projects)
- T005, T006, T007: Tool installation (independent)
- T009-T011: Contract tests (different files)
- T012-T014: Function unit tests (different files)
- T015-T020: DNS resource tests (different files)
- T032-T035: Build configs (different project.json files)
- T038-T048: kuttl test files (different files)
- T050-T053: Third-party references (different directories)
- T054-T057: Documentation (different files)
- T058, T059: Unit test execution (different projects)
- T065, T066: Formatting and linting (can run together)

### Blocking Relationships
- T001, T002 block all subsequent tasks in their respective projects
- T009-T022 (tests) block T023-T031 (implementation)
- T023-T027 (function) blocks T030 (composition uses function)
- T028 (DNS resources) blocks T030 (composition references resources)
- T029-T031 (composition) blocks T038-T048 (integration tests need composition)
- T032-T035 (build config) blocks T049, T058-T062 (running tests/builds)
- T036-T049 (integration tests) blocks T061, T064 (running integration tests)

## Parallel Execution Examples

### Infrastructure Setup (Run in parallel)
```bash
# Launch T003-T007 together:
nx run cdk8s-function-xp:setup-python
nx run internal-dns-xp:setup-python
# Install tools concurrently
hermit install crossplane kind kuttl
```

### Contract Tests (Run in parallel)
```bash
# Launch T009-T011 together:
pytest libs/internal-dns-xp/tests/unit/test_xrd_schema.py &
pytest libs/cdk8s-function-xp/tests/unit/test_function_request.py &
pytest libs/cdk8s-function-xp/tests/unit/test_function_response.py &
wait
```

### Function Unit Tests (Run in parallel)
```bash
# Launch T012-T014 together:
pytest libs/cdk8s-function-xp/tests/unit/test_renderer_valid.py &
pytest libs/cdk8s-function-xp/tests/unit/test_renderer_errors.py &
pytest libs/cdk8s-function-xp/tests/unit/test_props_mapping.py &
wait
```

### DNS Resource Tests (Run in parallel)
```bash
# Launch T015-T020 together:
pytest libs/internal-dns-xp/tests/unit/test_deployment.py &
pytest libs/internal-dns-xp/tests/unit/test_service.py &
pytest libs/internal-dns-xp/tests/unit/test_pvc.py &
pytest libs/internal-dns-xp/tests/unit/test_configmap.py &
pytest libs/internal-dns-xp/tests/unit/test_secret.py &
pytest libs/internal-dns-xp/tests/unit/test_dns_resources_snapshot.py &
wait
```

### Documentation (Run in parallel)
```bash
# Launch T054-T057 together:
# Create all README files concurrently
touch libs/cdk8s-function-xp/README.md &
touch libs/internal-dns-xp/README.md &
touch libs/internal-dns-xp/docs/deployment.md &
wait
```

## Notes
- [P] tasks = different files, no shared state
- Verify all tests fail (red) before implementing (green)
- Commit after each task or logical group
- Integration tests require Docker and kind cluster
- Crossplane render tests require crossplane CLI
- Follow TDD strictly: write failing test → implement → verify test passes

## Task Generation Rules Applied

1. **From Contracts**:
   - xrd-schema.yaml → T009 (XRD validation test)
   - function-api.md → T010, T011 (request/response contract tests)

2. **From Data Model**:
   - InternalDNS entity → T028 (cdk8s resources implementation)
   - Deployment entity → T015 (test), T028 (impl)
   - Service entity → T016 (test), T028 (impl)
   - PVC entity → T017 (test), T028 (impl)
   - ConfigMap entity → T018 (test), T028 (impl)
   - Secret entity → T019 (test), T028 (impl)

3. **From User Stories (Quickstart)**:
   - DNS resolution scenario → T045, T046 (kuttl DNS query test)
   - Ingress discovery → T043, T044 (kuttl ingress test)
   - Record deletion → T047, T048 (kuttl deletion test)
   - Performance validation → T067 (< 500ms query time)
   - Scale validation → T068 (10+ ingresses)

4. **Ordering**:
   - Setup (T001-T008) first
   - Tests (T009-T022) before implementation (T023-T031)
   - Function (T023-T027) before composition (T030)
   - Build config (T032-T035) before running tests
   - Integration (T036-T049) after core implementation
   - Documentation and polish (T050-T068) at end

## Validation Checklist
*GATE: Checked before task execution begins*

- [x] All contracts have corresponding tests
  - xrd-schema.yaml → T009
  - function-api.md → T010, T011
- [x] All entities have model/implementation tasks
  - InternalDNS → T028, T029
  - Deployment → T028
  - Service → T028
  - PVC → T028
  - ConfigMap → T028
  - Secret → T028
- [x] All tests come before implementation
  - Tests: T009-T022
  - Implementation: T023-T031
- [x] Parallel tasks truly independent
  - Verified: [P] tasks operate on different files
- [x] Each task specifies exact file path
  - All tasks include specific file paths
- [x] No task modifies same file as another [P] task
  - Verified: No file conflicts in parallel tasks

## Success Criteria

### Must Pass Before Feature Complete
1. All pytest unit tests pass (T058, T059)
2. Crossplane render test produces expected output (T060)
3. kuttl integration tests pass (T061)
4. Function Docker image builds successfully (T062)
5. Quickstart guide executes without errors (T064)
6. DNS query response time < 500ms (T067)
7. 10+ ingresses resolve correctly (T068)
8. No linting or formatting issues (T065, T066)
9. `nx affected:test` passes (T063)

### Feature Acceptance
- DNS service deploys successfully via Crossplane
- Ingresses are discovered and queryable within 2 minutes
- DNS records persist across pod restarts
- DNS records are removed when ingresses are deleted
- All constitutional principles satisfied (verified in plan.md)

## Estimated Effort
- **Total Tasks**: 68
- **Parallel Groups**: 8 groups with ~3-6 tasks each
- **Sequential Critical Path**: ~25 tasks
- **Estimated Timeline**: 3-5 days with TDD discipline

## Next Steps
After completing all tasks:
1. Verify all tests pass
2. Execute quickstart guide
3. Create pull request for review
4. Deploy to staging environment
5. Integration with Tailscale (future enhancement)
