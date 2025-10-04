
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Internal DNS service for Kubernetes ingresses that automatically discovers and resolves ingress hostnames for Tailscale-connected clients. Uses external-dns to gather DNS records from Kubernetes resources and PowerDNS for internal-only DNS storage. Implemented as a Crossplane configuration package using cdk8s for resource generation.

## Technical Context
**Language/Version**: Python 3.11+ (for cdk8s and Crossplane function)
**Primary Dependencies**:
- Crossplane >= 2.0.2 (infrastructure orchestration)
- cdk8s (Kubernetes resource generation)
- external-dns (Kubernetes ingress discovery)
- PowerDNS docker image powerdns/pdns-auth-50 (DNS server)
- pytest (testing framework)
- uv (Python package manager)

**Storage**: SQLite database (via PowerDNS) stored on replicated persistent volume claim
**Testing**:
- pytest with cdk8s testing functions and snapshot tests
- Crossplane render tests with snapshots for compositions
- kuttl integration tests with kind

**Target Platform**: Kubernetes cluster with Crossplane installed
**Project Type**: single (library-based Nx project)
**Performance Goals**: DNS query response < 500ms, ingress discovery within 2 minutes
**Constraints**: Single instance deployment (no redundancy), support up to 100 ingresses
**Scale/Scope**: Small cluster deployment with internal-only DNS resolution

**Architecture**:
- Library: `libs/internal-dns-xp` - Crossplane configuration package containing composition
- Library: `libs/cdk8s-function-xp` - Custom Crossplane function to render cdk8s resources
- Single deployment with external-dns and PowerDNS pods
- PowerDNS schema at `/usr/local/share/doc/pdns/schema.sqlite3.sql` in container
- Integration: external-dns → PowerDNS (native integration support)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Minimal Code & Dependency Reuse
- [x] Third-party packages evaluated before custom implementation
  - Using external-dns (established Kubernetes DNS integration)
  - Using PowerDNS (proven DNS server solution)
  - Using cdk8s (official Kubernetes CDK)
  - Using Crossplane (standard Kubernetes orchestration)
- [x] Custom code justified (no suitable package, or critical issues with alternatives)
  - Custom Crossplane function needed: no existing function renders cdk8s Python code
  - Custom composition needed: integrates external-dns + PowerDNS specifically
- [x] Documentation includes rationale for custom implementations

### Principle II: Deterministic Dependencies
- [x] All dependencies pinned to exact versions (no ^ or ~ in package.json, requirements.txt, etc.)
  - Crossplane: >= 2.0.2 (will pin exact version in implementation)
  - PowerDNS: powerdns/pdns-auth-50 (specific version tag)
  - Python packages: will use exact versions in requirements.txt
- [x] Docker images use specific tags (not :latest)
  - PowerDNS: powerdns/pdns-auth-50 (tagged version)
  - external-dns: will use specific version tag
- [x] Renovatebot or equivalent configured for automated updates

### Principle III: Test-Driven Design (TDD)
- [x] Tests written before implementation (TDD workflow documented)
  - pytest with cdk8s testing functions (snapshot tests)
  - Crossplane render tests with snapshots
  - kuttl integration tests with kind
- [x] Unit tests for all components
  - cdk8s resource generation tests
- [x] Integration tests for component interactions
  - kuttl validates full deployment and DNS resolution
- [x] Contract tests for API boundaries
  - Crossplane composition input/output validation

### Principle IV: Nx Monorepo Structure
- [x] Code organized in correct directory (libs/, apps/, stacks/, third_party/)
  - libs/internal-dns-xp: Crossplane configuration library
  - libs/cdk8s-function-xp: Custom Crossplane function library
- [x] Clear project boundaries defined
  - Separate libraries for composition and function
- [x] Libraries independently testable
  - Each library has its own test suite
- [x] Stacks reference apps with environment-specific configuration
  - N/A (library-only feature, no stacks needed)

### Principle V: Third-Party Dependency Management
- [x] Third-party dependencies located in third_party/ directory
  - Will add external-dns and PowerDNS references
- [x] Dependencies organized by ecosystem (hermit, python, javascript, shell, helm)
  - Python dependencies for cdk8s and Crossplane function
- [x] Each dependency includes version pinning, documentation, and update mechanism

### Principle VI: Semantic Versioning & Independent Releases
- [x] Package versioning follows semver (MAJOR.MINOR.PATCH)
  - Both libraries will follow semver
- [x] Release strategy uses nx release
- [x] Independent versioning for each package documented

### Principle VII: GitOps Deployment
- [x] Deployment configuration declarative and in Git
  - Crossplane compositions are declarative
  - kuttl test scenarios define deployment
- [x] No manual deployment steps
  - All deployed via Crossplane
- [x] Deployment state reconciliation documented
  - Crossplane handles reconciliation

### Principle VIII: Tool Availability
- [x] Required tools available in bin/ directory
  - Will ensure crossplane, kubectl, kind, kuttl available
- [x] No manual tool installation required
- [x] bin/help updated with new tools

### Principle IX: On-Demand Dependency Provisioning
- [x] Dependencies provisioned automatically (direnv, Hermit, or equivalent)
  - Python dependencies via uv
  - Kubernetes tools via bin/ or Hermit
- [x] No manual dependency installation steps

### Principle X: Modular Library Design
- [x] Libraries are small and focused
  - internal-dns-xp: focused on DNS composition
  - cdk8s-function-xp: focused on cdk8s rendering
- [x] Each library has isolated test suite
- [x] Libraries are independently buildable
- [x] Minimal inter-library dependencies
  - internal-dns-xp depends on cdk8s-function-xp (one-way dependency)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
libs/
├── cdk8s-function-xp/              # Custom Crossplane function for cdk8s rendering
│   ├── src/
│   │   ├── function.py             # Main function entry point
│   │   ├── cdk8s_renderer.py       # cdk8s rendering logic
│   │   └── requirements.txt        # Python dependencies (cdk8s, uv)
│   ├── tests/
│   │   ├── unit/
│   │   │   └── test_renderer.py    # Unit tests for renderer
│   │   └── integration/
│   │       └── test_function.py    # Integration tests
│   ├── Dockerfile                  # Function container image
│   ├── crossplane.yaml             # Function package metadata
│   └── project.json                # Nx configuration
│
└── internal-dns-xp/                # Crossplane configuration package
    ├── compositions/
    │   └── internal-dns.yaml       # Main composition using cdk8s function
    ├── definition.yaml             # XRD (Composite Resource Definition)
    ├── src/
    │   └── dns_resources.py        # cdk8s Python code for DNS resources
    ├── tests/
    │   ├── unit/
    │   │   └── test_dns_resources.py  # pytest with cdk8s testing
    │   ├── render/
    │   │   ├── test_composition.yaml  # Crossplane render test
    │   │   └── snapshots/             # Render test snapshots
    │   └── integration/
    │       └── kuttl/                 # kuttl integration tests
    │           ├── kind-config.yaml   # kind cluster config
    │           ├── 00-install.yaml    # Install Crossplane
    │           ├── 01-function.yaml   # Install cdk8s function
    │           ├── 02-config.yaml     # Install configuration package
    │           ├── 03-assert.yaml     # Validate DNS deployment
    │           └── 04-dns-test.yaml   # Test DNS resolution
    ├── crossplane.yaml             # Configuration package metadata
    └── project.json                # Nx configuration

third_party/
├── helm/
│   └── crossplane/                 # Crossplane Helm chart reference
└── python/
    ├── cdk8s/                      # cdk8s package reference
    └── pytest/                     # pytest package reference
```

**Structure Decision**: Two-library structure with clear separation of concerns:
- `libs/cdk8s-function-xp`: Reusable Crossplane function for rendering cdk8s Python code
- `libs/internal-dns-xp`: DNS-specific Crossplane configuration using the function
- Each library independently testable with isolated test suites
- Third-party dependencies centralized in `third_party/` organized by ecosystem

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)

**Task Categories**:

1. **Infrastructure Setup Tasks** (Foundation):
   - Create Nx project configurations for both libraries
   - Set up Python environments with uv
   - Configure third_party dependencies (Hermit, package references)
   - Update bin/help with new tools

2. **Contract Test Tasks** (TDD - Write First):
   - XRD schema validation tests [P]
   - Function API request/response contract tests [P]
   - Crossplane render tests with snapshots [P]

3. **cdk8s Function Implementation Tasks**:
   - Create function.py entry point (handles Crossplane requests)
   - Implement cdk8s_renderer.py (executes cdk8s code)
   - Create Dockerfile for function container
   - Create crossplane.yaml function package metadata
   - Write unit tests for renderer [P]
   - Write integration tests for function [P]

4. **Internal DNS cdk8s Resources Tasks**:
   - Write dns_resources.py with cdk8s code for:
     - Deployment (external-dns + PowerDNS containers)
     - Service (ClusterIP for DNS)
     - PersistentVolumeClaim (SQLite storage)
     - ConfigMap (PowerDNS config)
     - Secret (PowerDNS API key)
   - Write pytest tests with cdk8s Testing library [P]
   - Create snapshot tests for all resources [P]

5. **Crossplane Configuration Tasks**:
   - Create definition.yaml (XRD from contract)
   - Create compositions/internal-dns.yaml (uses cdk8s function)
   - Write Crossplane render tests
   - Create render test snapshots

6. **Integration Testing Tasks**:
   - Create kuttl test suite structure
   - Write kind-config.yaml for test cluster
   - Write kuttl test steps:
     - 00-install.yaml (Crossplane installation)
     - 01-function.yaml (cdk8s function)
     - 02-config.yaml (internal-dns package)
     - 03-assert.yaml (validate deployment)
     - 04-dns-test.yaml (test DNS resolution)
   - Configure kuttl in Nx project.json

7. **Documentation Tasks**:
   - Add README for cdk8s-function-xp
   - Add README for internal-dns-xp
   - Document deployment process
   - Update main project docs with DNS service info

**Ordering Strategy**:
- TDD order: All tests before corresponding implementation
- Dependency order:
  1. Infrastructure/setup (enables everything else)
  2. cdk8s function (required by composition)
  3. DNS resources and composition (uses function)
  4. Integration tests (validates complete system)
  5. Documentation (after implementation complete)
- Mark [P] for tasks that can run in parallel (independent files/tests)
- Group related tasks in numbered sequences

**Estimated Task Breakdown**:
- Infrastructure: 4 tasks
- Contract tests: 3 tasks
- cdk8s function: 6 tasks
- DNS resources: 6 tasks
- Crossplane config: 4 tasks
- Integration tests: 6 tasks
- Documentation: 4 tasks
- **Total: ~33 tasks**

**Success Criteria for Task Execution**:
- All unit tests pass (pytest)
- All Crossplane render tests pass (snapshots match)
- All kuttl integration tests pass (DNS resolution works)
- Both libraries build successfully (nx build)
- All affected tests pass (nx affected:test)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (Technical Context complete)
- [x] Complexity deviations documented (none - all principles satisfied)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
