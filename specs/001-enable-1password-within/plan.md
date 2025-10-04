
# Implementation Plan: 1Password Kubernetes Integration

**Branch**: `001-enable-1password-within` | **Date**: 2025-10-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/workspaces/setup/specs/001-enable-1password-within/spec.md`

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
Enable 1Password integration within Kubernetes clusters to allow workloads to securely retrieve secrets from 1Password vaults. Secrets will be exposed as both environment variables and mounted files, with automatic workload restart on secret rotation. The solution will use namespace-based authorization and gracefully handle 1Password outages by caching secrets.

## Technical Context
**Language/Version**: YAML/Helm charts, Crossplane >= 2.0.2
**Primary Dependencies**: Upbound Crossplane, 1Password Connect Operator (Helm chart from https://1password.github.io/connect-helm-charts), kuttl for testing, kind for local Kubernetes
**Storage**: N/A (secrets managed by 1Password)
**Testing**: kuttl (Kubernetes e2e testing), kind (local Kubernetes cluster with native storage driver for docker-in-docker)
**Target Platform**: Kubernetes clusters (starting with stacks/enigma-cluster)
**Project Type**: Single library (Crossplane AddOn package at libs/onepassword-addon-xp)
**Performance Goals**: Secret retrieval latency < 5s, workload restart on rotation within 1 minute
**Constraints**: Must support docker-in-docker (kind with native storage driver), namespace-based permissions, secret caching for offline resilience
**Scale/Scope**: Multiple Kubernetes clusters, unlimited secrets per namespace, supports all secret types (plain text, binary, structured data)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Minimal Code & Dependency Reuse
- [x] Third-party packages evaluated before custom implementation
- [x] Custom code justified (no suitable package, or critical issues with alternatives)
- [x] Documentation includes rationale for custom implementations

**Assessment**: Using 1Password Connect Operator (official Helm chart) + Crossplane AddOn packaging. Zero custom operator code - only packaging and configuration.

### Principle II: Deterministic Dependencies
- [x] All dependencies pinned to exact versions (no ^ or ~ in package.json, requirements.txt, etc.)
- [x] Docker images use specific tags (not :latest)
- [x] Renovatebot or equivalent configured for automated updates

**Assessment**: Will pin exact Helm chart version (connect-2.0.5), Crossplane version (>= 2.0.2), and OCI image tags. Renovatebot already configured for monorepo.

### Principle III: Test-Driven Design (TDD)
- [x] Tests written before implementation (TDD workflow documented)
- [x] Unit tests for all components
- [x] Integration tests for component interactions
- [x] Contract tests for API boundaries

**Assessment**: kuttl tests will verify: 1) AddOn package installs correctly, 2) Operator deploys, 3) OnePasswordItem CRDs work, 4) Secrets sync to Kubernetes, 5) Workload restart on rotation. Tests written before package creation.

### Principle IV: Nx Monorepo Structure
- [x] Code organized in correct directory (libs/, apps/, stacks/, third_party/)
- [x] Clear project boundaries defined
- [x] Libraries independently testable
- [x] Stacks reference apps with environment-specific configuration

**Assessment**: Library at libs/onepassword-addon-xp (reusable package), deployed to stacks/enigma-cluster via Flux. Clear boundary: library builds package, stack consumes it.

### Principle V: Third-Party Dependency Management
- [x] Third-party dependencies located in third_party/ directory
- [x] Dependencies organized by ecosystem (hermit, python, javascript, shell, helm)
- [x] Each dependency includes version pinning, documentation, and update mechanism

**Assessment**: 1Password Helm chart will be pulled and embedded in package (not in third_party/ - it's packaged within the AddOn). External tools (kuttl, kind, up CLI) already managed via Hermit/direnv.

### Principle VI: Semantic Versioning & Independent Releases
- [x] Package versioning follows semver (MAJOR.MINOR.PATCH)
- [x] Release strategy uses nx release
- [x] Independent versioning for each package documented

**Assessment**: Will use nx release to version and publish OCI package to GitHub Container Registry (ghcr.io), following same pattern as libs/coder-devcontainer.

### Principle VII: GitOps Deployment
- [x] Deployment configuration declarative and in Git
- [x] No manual deployment steps
- [x] Deployment state reconciliation documented

**Assessment**: Flux will deploy the AddOn to stacks/enigma-cluster. Crossplane CRD manifest + Flux HelmRelease/Kustomization for declarative deployment.

### Principle VIII: Tool Availability
- [x] Required tools available in bin/ directory
- [x] No manual tool installation required
- [x] bin/help updated with new tools

**Assessment**: kuttl and kind CLIs already available. up CLI (Upbound) needs verification - will add to Hermit if missing.

### Principle IX: On-Demand Dependency Provisioning
- [x] Dependencies provisioned automatically (direnv, Hermit, or equivalent)
- [x] No manual dependency installation steps

**Assessment**: direnv already configured. All tools (kuttl, kind, up, helm) will be Hermit-managed or already available.

### Principle X: Modular Library Design
- [x] Libraries are small and focused
- [x] Each library has isolated test suite
- [x] Libraries are independently buildable
- [x] Minimal inter-library dependencies

**Assessment**: Single-purpose library: package 1Password operator as Crossplane AddOn. Isolated kuttl test suite. No dependencies on other libs. Independent nx build/test/release.

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
libs/onepassword-addon-xp/
├── package.json              # Nx project config, versioning, build targets
├── crossplane.yaml           # AddOn metadata (packagingType: Helm)
├── crds/                     # CRDs extracted from 1Password Helm chart
│   ├── onepassworditems.onepassword.com.yaml
│   └── ...
├── helm/                     # Embedded Helm chart
│   └── connect-2.0.5.tgz     # 1Password Connect operator chart
├── tests/                    # kuttl e2e tests
│   ├── kuttl-test.yaml       # Test suite configuration
│   └── e2e/
│       ├── 00-install-addon.yaml
│       ├── 01-assert-operator-ready.yaml
│       ├── 02-create-onepassworditem.yaml
│       ├── 03-assert-secret-synced.yaml
│       └── 04-rotation-triggers-restart.yaml
├── CLAUDE.md                 # AI assistant development guidelines
└── AGENTS.md                 # General agent documentation

stacks/enigma-cluster/        # Deployment target
├── flux/
│   └── onepassword/
│       ├── addon.yaml        # Crossplane AddOn CR
│       ├── namespace.yaml
│       └── kustomization.yaml
```

**Structure Decision**: Single library following Crossplane AddOn packaging conventions. Tests use kuttl for Kubernetes-native e2e validation. Deployment manifests in stacks/enigma-cluster managed by Flux.

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
1. **Setup Tasks** (Infrastructure):
   - Create library directory structure
   - Download and extract 1Password Helm chart
   - Extract CRDs from Helm chart
   - Create package.json with Nx configuration

2. **Contract Test Tasks** (TDD - Tests First):
   - Create kuttl test configuration file
   - Implement 00-addon-installation test [P]
   - Implement 01-secret-sync test [P]
   - Implement 02-secret-consumption test [P]
   - Implement 03-workload-restart-on-rotation test [P]
   - Implement 04-offline-resilience test [P]
   - Implement 05-namespace-authorization test [P]

3. **Package Implementation Tasks**:
   - Create crossplane.yaml metadata file
   - Package Helm chart as tarball
   - Validate package structure with `up xpkg build --dry-run`
   - Build AddOn package (.xpkg file)

4. **Deployment Configuration Tasks**:
   - Create stacks/enigma-cluster/flux/onepassword directory
   - Create AddOn CR manifest
   - Create namespace manifest
   - Create Flux Kustomization

5. **Validation Tasks**:
   - Run kuttl tests in kind cluster
   - Validate package builds successfully
   - Test local installation in kind
   - Verify all contract tests pass

**Ordering Strategy**:
- Sequential: Setup → Tests → Implementation → Deployment → Validation
- [P] marks parallel execution (contract tests are independent)
- TDD order: All test tasks before implementation tasks

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

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
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none - all principles satisfied)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
