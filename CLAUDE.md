@AGENTS.md

# Development Guidelines for AI Assistants

## Project Conventions

### Code Quality Standards
- All code must pass `trunk check` before committing
- Use `trunk fmt` for automatic formatting
- Follow existing patterns and conventions in each project
- Never introduce security vulnerabilities or expose secrets

### Testing Requirements
- All libs, apps, stacks, and third_party projects include tests
- Tests enable TDD and improve AI performance by providing clear iteration targets
- Run tests with `nx test <project>` or `nx affected:test`

### File Creation Policy
- ALWAYS prefer editing existing files over creating new ones
- NEVER create files unless absolutely necessary for the goal
- NEVER proactively create documentation files (*.md) or README files
- Only create documentation when explicitly requested

### Nx Workspace Management
- Use `nx show projects` to see all available projects
- Understand project dependencies with `nx graph`
- Use `nx affected` commands to work efficiently with changed code
- Follow the libs > apps > stacks hierarchy for dependencies

### Platform Detection Convention
- Use `IS_MACOS` and `IS_LINUX` environment variables for consistent platform detection
- These variables are set to "true" or "false" in `.envrc`
- Apply consistently across all tools: chezmoi templates, goss tests, scripts
- Access in chezmoi templates: `{{ if eq (env "IS_MACOS") "true" }}`
- Access in goss tests: `skip: {{.Env.IS_MACOS}}`