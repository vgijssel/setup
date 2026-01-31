<!--
SYNC IMPACT REPORT
==================
Version Change: 0.0.0 → 1.0.0
Bump Type: MAJOR (Initial constitution ratification)

Added Sections:
- I. Minimal Code & Dependency Reuse
- II. Deterministic Dependencies
- III. Test-Driven Design (TDD)
- IV. Nx Monorepo Structure
- V. Third-Party Dependency Management
- VI. Semantic Versioning & Independent Releases
- VII. GitOps Deployment
- VIII. Tool Availability
- IX. On-Demand Dependency Provisioning
- X. Modular Library Design

Modified Principles: N/A (initial creation)
Removed Sections: N/A

Templates Requiring Updates:
✅ .specify/templates/plan-template.md (Constitution Check section aligned)
✅ .specify/templates/spec-template.md (No changes required - scope/requirements alignment maintained)
✅ .specify/templates/tasks-template.md (Task categorization reflects TDD, modular library design)
✅ .claude/commands/constitution.md (No agent-specific references, generic guidance maintained)

Follow-up TODOs: None
-->

# Setup Monorepo Constitution

## Core Principles

### I. Minimal Code & Dependency Reuse

Write as little custom code as possible. MUST prefer well-maintained third-party packages over
implementing functionality yourself. Before writing code, search for existing solutions in the
ecosystem. Custom implementations are only justified when:
- No suitable third-party package exists
- Third-party options have critical security/performance/licensing issues
- Integration cost exceeds custom implementation cost

**Rationale**: Third-party packages are battle-tested, maintained by communities, and reduce
maintenance burden. Custom code is a liability that must be justified.

### II. Deterministic Dependencies

All external dependencies MUST be pinned to exact versions using strict equality:
- **npm/yarn**: Exact versions (e.g., `"nx": "21.5.2"` not `"nx": "^21.5.2"`)
- **Python**: Pin exact versions in requirements.txt (e.g., `mkdocs==1.6.1`)
- **Docker**: Specific tags (e.g., `python:3.12.8-slim` not `python:3.12-slim` or `python:latest`)
- **Terraform**: Exact provider versions (e.g., `version = "2.11.0"` not `version = "~> 2.11"`)
- **GitHub Actions**: Commit SHAs or exact tags (e.g., `actions/checkout@v4`)
- **Go modules**: Specific versions in go.mod
- **Helm charts**: Exact chart versions in Chart.yaml

Automated dependency updates MUST use Renovatebot or equivalent tooling.

**Rationale**: Reproducible builds prevent unexpected breaking changes. Non-deterministic
dependencies cause environment-specific bugs and deployment failures.

### III. Test-Driven Design (TDD)

Testing is NON-NEGOTIABLE. MUST follow strict TDD workflow:
1. Write tests that define expected behavior
2. Verify tests fail (red)
3. Implement minimal code to pass tests (green)
4. Refactor while keeping tests green

All code MUST have:
- Unit tests for individual components
- Integration tests for component interactions
- Contract tests for API boundaries

Tests MUST be written BEFORE implementation. No implementation without failing tests first.

**Rationale**: TDD ensures testable design, catches regressions, validates requirements, and
provides living documentation. Fast test suites enable rapid iteration and CI efficiency.

### IV. Nx Monorepo Structure

Project organization MUST follow Nx monorepo patterns:
- **libs/**: Reusable libraries (e.g., ansible, devenv, internal-dns)
- **apps/**: Focused applications (e.g., haos, escaperoom)
- **stacks/**: Environment-specific deployments using apps with configuration
- **third_party/**: External dependencies organized by type (hermit, python, javascript, shell, helm)

Each project MUST define clear boundaries. Libraries MUST be independently testable and
documented. Applications MUST compose libraries. Stacks MUST reference apps with
environment-specific configuration.

**Rationale**: Clear separation enables independent development, testing, and deployment.
Nx's affected command optimization reduces CI time by testing only changed code.

### V. Third-Party Dependency Management

Third-party dependencies MUST be located in the `third_party/` directory, organized by
ecosystem (hermit, python, javascript, shell, helm). Dependencies MUST NOT be scattered
across project directories.

Each third-party integration MUST include:
- Version pinning (see Principle II)
- Documentation of purpose and usage
- Update mechanism (Renovatebot configuration)

**Rationale**: Centralized dependency management enables consistent updates, auditing, and
vulnerability scanning. Organized structure prevents dependency sprawl.

### VI. Semantic Versioning & Independent Releases

Packages MUST be versioned using semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward-incompatible API changes
- **MINOR**: Backward-compatible functionality additions
- **PATCH**: Backward-compatible bug fixes

Packages MUST be versioned independently. Use `nx release` for release management. The main
branch MUST always represent all packages at their latest released versions. Releases MUST
publish artifacts to GitHub as part of the release process.

**Rationale**: Semantic versioning communicates compatibility. Independent versioning enables
focused releases without coordinating unrelated changes. Automated releases reduce human error.

### VII. GitOps Deployment

Everything MUST be deployed using GitOps principles:
- Declarative infrastructure and application configuration in Git
- Automated deployment pipelines triggered by Git commits
- No manual deployment steps or configuration drift
- Deployment state reconciliation via automated tooling (e.g., ArgoCD, Flux)

All deployment configuration MUST be version-controlled and peer-reviewed.

**Rationale**: GitOps provides audit trails, rollback capability, and prevents configuration
drift. Declarative deployments are reproducible and self-documenting.

### VIII. Tool Availability

All necessary tools MUST be available in the `bin/` directory. Users MUST NOT need to manually
install tools to work with the repository. The `bin/` directory MUST contain:
- Wrapper scripts for common operations
- Tool binaries or download/installation scripts
- Interactive help via `bin/help`

Tools MUST be version-pinned and platform-aware (using `IS_MACOS` and `IS_LINUX` environment
variables).

**Rationale**: Self-contained tooling eliminates "works on my machine" issues and reduces
onboarding friction.

### IX. On-Demand Dependency Provisioning

Dependencies MUST be provisioned on-demand without manual user intervention. Use tools like
direnv, Hermit, or equivalent to automatically setup required binaries and environment
variables.

Users MUST only need to run `direnv allow` (or equivalent) to have a fully functional
development environment.

**Rationale**: Automatic provisioning eliminates setup documentation, reduces errors, and
ensures consistent environments across all developers.

### X. Modular Library Design

MUST prefer many small, focused libraries over monolithic codebases. Each library MUST:
- Have a single, clear responsibility
- Include its own isolated test suite
- Be independently buildable and testable
- Have minimal dependencies on other libraries

Small test suites enable Nx's affected command to run only changed packages, keeping CI fast.

**Rationale**: Small libraries reduce coupling, enable parallel development, and minimize CI
time by testing only affected code. Modular design improves code reuse and maintainability.

## Development Workflow

### Code Quality Gates

All code submissions MUST pass:
1. **Linting & Formatting**: `trunk fmt` and `trunk check` before committing
2. **Test Execution**: All tests pass (`nx affected:test` for changed code)
3. **Peer Review**: At least one approved review
4. **Constitution Compliance**: Adherence to all principles validated

### Testing Requirements

- Unit tests for all logic
- Integration tests for cross-component interactions
- Contract tests for API boundaries
- Performance tests for critical paths
- Tests MUST be written before implementation (TDD)

### Platform Compatibility

Code MUST use platform detection environment variables:
- Chezmoi templates: `{{ if eq (env "IS_MACOS") "true" }}`
- Goss tests: `skip: {{.Env.IS_MACOS}}`
- Shell scripts: `if [ "$IS_MACOS" = "true" ]; then`

## Governance

### Amendment Procedure

Constitution amendments require:
1. Proposed change with rationale documented
2. Impact analysis on existing projects
3. Migration plan for non-compliant code
4. Approval from project maintainers
5. Version increment following semantic versioning rules

### Compliance Review

All pull requests MUST verify compliance with constitutional principles. Reviewers MUST reject
PRs that violate principles without documented justification. Complexity that violates
principles MUST be justified in the PR description with simpler alternatives considered.

### Version History

This constitution supersedes all other practices. When conflicts arise between this document
and other guidance, this constitution takes precedence. Use `CLAUDE.md` (or equivalent
agent-specific files) for runtime development guidance that complements but does not
contradict this constitution.

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
