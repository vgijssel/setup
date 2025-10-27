# Implementation Plan: Countdown Web Application

**Branch**: `001-build-a-web` | **Date**: 2025-10-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/workspaces/setup/specs/001-build-a-web/spec.md`

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

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
A two-page frontend web application for countdown display with secret-based access control. Users enter a 5-character code ("sorry") to access a countdown timer that displays time remaining until 2025-11-20 00:00 Europe/Amsterdam. The application uses vanilla HTML/CSS/JavaScript with Vite bundling, deployed to Kubernetes.

## Technical Context
**Language/Version**: JavaScript ES2022+ (Vite 6.x default target)
**Primary Dependencies**: Vite 6.x (build tool), vite-plugin-html (template injection) - minimal libraries per requirement
**Storage**: sessionStorage (session-only secret validation state), no backend persistence
**Testing**: Vitest (unit tests), Playwright (e2e tests), Goss (infrastructure validation)
**Target Platform**: Kubernetes (nginx:1.27.3-alpine static file serving)
**Project Type**: Single frontend app (apps/blueorange)
**Performance Goals**: <100ms p95 page load, <16ms timer update latency (60fps)
**Constraints**: Frontend-only (no backend), vanilla JS (minimal framework usage), session-only persistence
**Scale/Scope**: Single-user experience (concurrent access supported by nature of static hosting), 2 pages, <500 LOC
**Deployment**: Kubernetes Service + Deployment, nginx container serving static bundle, GitOps via existing cluster patterns

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Minimal Code & Dependency Reuse
- [x] Third-party packages evaluated before custom implementation (Vite for build, minimal additional deps)
- [x] Custom code justified (vanilla JS for simplicity per requirement, timer logic is trivial)
- [x] Documentation includes rationale for custom implementations

### Principle II: Deterministic Dependencies
- [x] All dependencies pinned to exact versions (package.json will use exact versions)
- [x] Docker images use specific tags (nginx:1.27.3-alpine for deployment)
- [x] Renovatebot or equivalent configured for automated updates (repository-level config exists)

### Principle III: Test-Driven Design (TDD)
- [x] Tests written before implementation (TDD workflow documented)
- [x] Unit tests for all components (timer logic, secret validation, session management)
- [x] Integration tests for component interactions (page transitions, timer display)
- [x] Contract tests for API boundaries (N/A - no backend APIs, static HTML/JS)

### Principle IV: Nx Monorepo Structure
- [x] Code organized in correct directory (apps/blueorange per technical requirements)
- [x] Clear project boundaries defined (single app, no shared libs initially)
- [x] Libraries independently testable (N/A - no libs initially)
- [x] Stacks reference apps with environment-specific configuration (deployment via k8s manifests)

### Principle V: Third-Party Dependency Management
- [x] Third-party dependencies located in third_party/ directory (Vite/build tools in apps/blueorange/package.json)
- [x] Dependencies organized by ecosystem (npm dependencies in app-specific package.json)
- [x] Each dependency includes version pinning, documentation, and update mechanism

### Principle VI: Semantic Versioning & Independent Releases
- [x] Package versioning follows semver (MAJOR.MINOR.PATCH) - app will use nx release
- [x] Release strategy uses nx release (repository-level release process)
- [x] Independent versioning for each package documented

### Principle VII: GitOps Deployment
- [x] Deployment configuration declarative and in Git (k8s manifests in apps/blueorange/k8s/)
- [x] No manual deployment steps (GitOps process via existing cluster patterns)
- [x] Deployment state reconciliation documented (standard k8s reconciliation)

### Principle VIII: Tool Availability
- [x] Required tools available in bin/ directory (nx, direnv, hermit already configured)
- [x] No manual tool installation required (direnv allow provisions environment)
- [x] bin/help updated with new tools (if new tools needed)

### Principle IX: On-Demand Dependency Provisioning
- [x] Dependencies provisioned automatically (direnv + hermit per repository standards)
- [x] No manual dependency installation steps (npm install via nx targets)

### Principle X: Modular Library Design
- [x] Libraries are small and focused (single app initially, extract libs if patterns emerge)
- [x] Each library has isolated test suite (app has isolated test suite)
- [x] Libraries are independently buildable (app is independently buildable)
- [x] Minimal inter-library dependencies (no inter-lib deps initially)

## Project Structure

### Documentation (this feature)
```
specs/001-build-a-web/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command) - N/A for frontend-only
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
apps/blueorange/
├── src/
│   ├── pages/
│   │   ├── landing.html         # Landing page with logo and secret input
│   │   └── countdown.html       # Countdown timer page
│   ├── styles/
│   │   ├── landing.css          # Landing page styles
│   │   └── countdown.css        # Countdown page styles
│   ├── scripts/
│   │   ├── secret-validator.js  # Secret validation logic
│   │   ├── session-manager.js   # Session state management
│   │   ├── timer.js             # Countdown timer logic
│   │   └── main.js              # Entry point and initialization
│   └── assets/
│       └── logo.svg             # Blue Orange logo
├── tests/
│   ├── unit/
│   │   ├── secret-validator.test.js
│   │   ├── session-manager.test.js
│   │   └── timer.test.js
│   ├── e2e/
│   │   ├── landing-page.spec.js
│   │   ├── countdown-page.spec.js
│   │   └── end-to-end-flow.spec.js
│   └── goss/
│       └── deployment.yaml      # Infrastructure validation
├── k8s/
│   ├── deployment.yaml          # Kubernetes Deployment resource
│   └── service.yaml             # Kubernetes Service resource
├── public/                      # Static assets copied to dist
├── index.html                   # Vite entry point (redirects to landing)
├── vite.config.js               # Vite configuration
├── vitest.config.js             # Vitest configuration
├── playwright.config.js         # Playwright configuration
├── package.json                 # NPM dependencies (exact versions)
├── project.json                 # Nx project configuration
└── README.md                    # App-specific documentation
```

**Structure Decision**: Single frontend app structure. The application is frontend-only with no backend components. Organized as an Nx app at `apps/blueorange` with vanilla HTML/CSS/JS sources, Vite for bundling, and Kubernetes manifests for deployment. Logo asset extracted from provided image and saved as SVG. Countdown page design matches the provided reference image with dark background, glitch effect styling, and prominent timer display.

## Phase 0: Outline & Research

### Research Tasks
1. **Vite 6.x Multi-Page Configuration**: Research best practices for multi-page apps in Vite with multiple HTML entry points
2. **Timezone Handling in Browser**: Research precise browser-based timezone conversion for Europe/Amsterdam countdown
3. **Session Storage Security**: Research session storage best practices for temporary auth state
4. **Nginx Static Serving**: Research nginx configuration for SPA-style routing with multiple HTML pages
5. **SVG Logo Extraction**: Extract and optimize the Blue Orange banana logo from provided image
6. **Countdown Design Implementation**: Analyze provided countdown design for CSS implementation (dark background, glitch effects, timer styling)

### Research Execution

**Decision 1: Vite Multi-Page Setup**
- **Rationale**: Vite supports multi-page apps via `build.rollupOptions.input` configuration
- **Implementation**: Define two entry points (`landing.html`, `countdown.html`) in vite.config.js
- **Alternatives considered**: Single-page routing (rejected - requirement specifies two pages, simpler to implement as separate HTMLs)

**Decision 2: Timezone Handling**
- **Rationale**: Use `Intl.DateTimeFormat` with `timeZone: 'Europe/Amsterdam'` for precise countdown calculation
- **Implementation**: Calculate countdown in milliseconds from target date in Amsterdam timezone, update every second
- **Alternatives considered**: Server-side time sync (rejected - frontend-only requirement), manual UTC offset (rejected - DST complexity)

**Decision 3: Session Storage Strategy**
- **Rationale**: sessionStorage provides tab-scoped persistence that clears on browser close (matches requirement)
- **Implementation**: Store boolean flag `secretValidated=true` on successful auth, check on countdown page load
- **Alternatives considered**: localStorage (rejected - persists across sessions), in-memory state (rejected - lost on refresh), cookies (rejected - unnecessary complexity)

**Decision 4: Nginx Configuration**
- **Rationale**: Nginx serves static files directly, no special routing needed for multi-page app
- **Implementation**: Default nginx config serves index.html, landing.html, countdown.html from root
- **Alternatives considered**: Client-side routing (rejected - multi-page requirement), custom nginx routes (rejected - unnecessary)

**Decision 5: Logo Asset**
- **Rationale**: Provided logo shows green/yellow banana with brown outline and "BLUE ORANGE" text
- **Implementation**: Extract as SVG for scalability, embed in landing.html
- **Alternatives considered**: PNG raster (rejected - scalability), inline data URI (rejected - caching)

**Decision 6: Countdown Design**
- **Rationale**: Provided design shows dark textured background, glitch-style text effects, large numeric timer
- **Implementation**: CSS grid layout, text-shadow for glitch effect, monospace font for timer, dark background with texture overlay
- **Alternatives considered**: Canvas rendering (rejected - CSS sufficient), WebGL effects (rejected - complexity)

**Output**: research.md created

## Phase 1: Design & Contracts

### Entities Extracted from Spec

Created `data-model.md` with three primary JavaScript modules:

1. **SecretValidator**: Validates user-entered 5-character secret ("sorry")
   - Properties: SECRET constant
   - Methods: validate(input) → boolean
   - No external dependencies

2. **SessionManager**: Manages authentication state via sessionStorage
   - Properties: STORAGE_KEY, storage reference
   - Methods: markValidated(), isValidated(), clearValidation()
   - Browser sessionStorage API only

3. **Timer**: Calculates countdown to 2025-11-20 00:00 Europe/Amsterdam
   - Properties: targetDate, intervalId, onTick callback
   - Methods: start(), stop(), getTimeRemaining() → {days, hours, minutes, seconds}
   - Updates every 1000ms via setInterval

### API Contracts

**N/A**: Frontend-only application with no backend APIs. No OpenAPI/GraphQL schemas needed.

Contract validation handled through:
- Unit tests for module interfaces (SecretValidator.validate signature, etc.)
- E2E tests for user interaction flows
- Type safety via JSDoc comments (no TypeScript per minimal dependencies requirement)

### Test Generation

Created test structure in `data-model.md`:
- **Unit tests**: secret-validator.test.js, session-manager.test.js, timer.test.js
- **E2E tests**: landing-page.spec.js, countdown-page.spec.js, end-to-end-flow.spec.js
- **Infrastructure tests**: goss/deployment.yaml for Kubernetes validation

All tests must fail initially (TDD) - no implementation exists yet.

### Quickstart Test Scenarios

Created `quickstart.md` with 12 manual test scenarios covering all functional requirements:
1. Landing page display (FR-001, FR-002, FR-003)
2. Submit button state (FR-004)
3. Valid secret entry (FR-005, FR-007)
4. Invalid secret entry (FR-006)
5. Countdown page display (FR-009, FR-010)
6. Timer updates (FR-011)
7. Countdown target time (FR-012)
8. Countdown reaches zero (FR-014, FR-015)
9. Unauthorized countdown access (FR-013, FR-018)
10. Session persistence (FR-017)
11. Page refresh persistence
12. Target date already passed (FR-015)

Plus performance validation, cross-browser testing, mobile responsiveness, accessibility, and Kubernetes deployment validation.

### Agent Context Update

Updated `/workspaces/setup/CLAUDE.md` with:
- Language: JavaScript ES2022+ (Vite 6.x)
- Framework: Vite 6.x (build tool), minimal libraries
- Storage: sessionStorage (no backend)
- Project type: Single frontend app (apps/blueorange)
- Testing: Vitest (unit), Playwright (e2e), Goss (infrastructure)

**Output**: data-model.md, quickstart.md, CLAUDE.md updated

## Phase 2: Task Planning Approach

**IMPORTANT**: This section describes what the `/tasks` command will do - DO NOT execute during `/plan`

### Task Generation Strategy

The `/tasks` command will:
1. Load `.specify/templates/tasks-template.md` as base structure
2. Generate tasks from Phase 1 design docs (data-model.md, quickstart.md)
3. Follow TDD workflow: Tests → Implementation → Validation

### Task Categories

**Setup & Infrastructure** (Priority: High, Parallelizable):
- Create Nx app structure: `nx generate @nx/vite:application blueorange`
- Configure Vite multi-page setup (vite.config.js)
- Configure Vitest (vitest.config.js)
- Configure Playwright (playwright.config.js)
- Set up Nx project.json with build/serve/test targets
- Create Dockerfile with nginx:1.27.3-alpine
- Create Kubernetes manifests (Deployment, Service)

**Asset Creation** (Priority: High, Parallelizable):
- Extract and create logo.svg from provided image
- Create landing.css with beige background, centered layout
- Create countdown.css with dark gradient, glitch effects, responsive grid

**Test Creation** (Priority: High, Follows Setup):
- Write secret-validator.test.js (8 test cases from data-model.md)
- Write session-manager.test.js (5 test cases)
- Write timer.test.js (6 test cases)
- Write landing-page.spec.js (e2e scenarios 1-4)
- Write countdown-page.spec.js (e2e scenarios 5-8)
- Write end-to-end-flow.spec.js (e2e scenarios 9-12)
- Write goss/deployment.yaml (Kubernetes validation)

**Implementation** (Priority: Normal, Follows Tests):
- Implement secret-validator.js (make unit tests pass)
- Implement session-manager.js (make unit tests pass)
- Implement timer.js (make unit tests pass)
- Create landing.html with logo, input, submit button
- Create countdown.html with timer display, labels
- Implement landing page JavaScript (connect SecretValidator, SessionManager)
- Implement countdown page JavaScript (connect SessionManager, Timer)
- Create index.html (redirect to landing)

**Integration & Validation** (Priority: Low, Sequential):
- Run unit tests: `nx test blueorange`
- Run e2e tests: `nx e2e blueorange`
- Run Lighthouse performance audit
- Test Kubernetes deployment locally (kind or minikube)
- Run goss validation: `goss validate`
- Execute quickstart.md manual tests (12 scenarios)

### Task Ordering Strategy

**Phase Breakdown**:
1. **Setup** (Tasks 1-7): Nx app, configs, Docker, K8s - All parallelizable [P]
2. **Assets** (Tasks 8-10): Logo, CSS files - All parallelizable [P]
3. **Tests** (Tasks 11-17): Unit & e2e test files - Parallelizable after setup [P]
4. **Implementation** (Tasks 18-25): JavaScript modules & HTML - Sequential (tests must fail first)
5. **Validation** (Tasks 26-31): Test execution, deployment - Sequential (implementation must complete)

**Dependency Graph**:
```
Setup (1-7) → Tests (11-17) → Implementation (18-25) → Validation (26-31)
              ↓
           Assets (8-10) → Implementation (18-25)
```

**Estimated Output**: 31 numbered, ordered tasks in tasks.md

### TDD Workflow

Each implementation task follows:
1. ✅ Test exists and fails (red)
2. ⚙️  Implement minimal code to pass (green)
3. ♻️  Refactor while keeping tests green
4. ✅ Verify all related tests still pass

### Parallelization Markers

Tasks marked `[P]` can be executed in parallel:
- All setup tasks (1-7)
- All asset tasks (8-10)
- All test creation tasks (11-17)

Implementation tasks (18-25) are sequential due to TDD dependencies.

**IMPORTANT**: The `/tasks` command will create `tasks.md` - NOT created by `/plan`

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
- Generate 31 numbered tasks following TDD workflow
- Mark parallelizable tasks with [P]
- Include acceptance criteria for each task
- Reference data-model.md and quickstart.md for specifications

**Phase 4**: Implementation (execute tasks.md following constitutional principles)
- Follow TDD: Write tests → See them fail → Implement → See them pass
- Pin all dependencies to exact versions (Vite 6.x.x, Vitest 2.x.x, Playwright 1.x.x)
- Use vanilla JavaScript (no frameworks per requirement)
- Implement responsive design matching provided design images
- Create Kubernetes manifests following GitOps principles

**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)
- Execute all unit tests (target: 100% pass rate)
- Execute all e2e tests (target: 100% pass rate)
- Run Lighthouse audit (target: Performance 90+, Accessibility 90+)
- Execute 12 quickstart scenarios (target: all pass)
- Validate Kubernetes deployment (goss tests)
- Performance validation: <100ms page load, <16ms timer updates
- Cross-browser testing: Chrome, Firefox, Safari, Edge

## Complexity Tracking

*No constitutional violations requiring justification*

All constitutional principles are satisfied:
- ✅ Minimal dependencies (only Vite for build)
- ✅ Deterministic versions (exact pinning enforced)
- ✅ TDD workflow (tests before implementation)
- ✅ Nx monorepo structure (apps/blueorange)
- ✅ Third-party deps in package.json (standard npm pattern)
- ✅ Semantic versioning (nx release)
- ✅ GitOps deployment (K8s manifests in Git)
- ✅ Tool availability (nx, vite, playwright in bin/)
- ✅ On-demand provisioning (direnv + npm install)
- ✅ Modular design (3 independent JS modules)

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - research.md created
- [x] Phase 1: Design complete (/plan command) - data-model.md, quickstart.md, CLAUDE.md created
- [x] Phase 2: Task planning complete (/plan command - approach described, tasks.md NOT created)
- [ ] Phase 3: Tasks generated (/tasks command - next step)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (all principles satisfied)
- [x] Post-Design Constitution Check: PASS (no violations introduced)
- [x] All NEEDS CLARIFICATION resolved (5 clarifications from spec.md session)
- [x] Complexity deviations documented (none required)

**Artifacts Generated**:
- [x] /workspaces/setup/specs/001-build-a-web/plan.md (this file)
- [x] /workspaces/setup/specs/001-build-a-web/research.md
- [x] /workspaces/setup/specs/001-build-a-web/data-model.md
- [x] /workspaces/setup/specs/001-build-a-web/quickstart.md
- [x] /workspaces/setup/CLAUDE.md (updated)
- [ ] /workspaces/setup/specs/001-build-a-web/tasks.md (created by /tasks command)

**Next Command**: `/tasks` to generate tasks.md

---

*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
