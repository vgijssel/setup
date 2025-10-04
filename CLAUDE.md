# Development Guidelines for AI Assistants

## Project Structure

This Nx monorepo follows a clear hierarchy:
- `libs/`: Reusable libraries (ansible, cloudflare-tunnel, devenv, internal-dns, esphome_nimble)
- `apps/`: Focused applications (haos, escaperoom)
- `stacks/`: Environment-specific deployments (enigma, devenv, provisioner)
- `third_party/`: External dependencies (hermit, python, javascript, shell, helm)

## Core Commands

### Project Discovery
```bash
bin/help                  # Interactive help with real targets and descriptions
nx show projects          # List all projects
nx show project <name>    # Show project details and available targets
```

### Common Operations
```bash
nx build <project>        # Build a project
nx test <project>         # Test a project
nx affected:test          # Test only affected projects
nx release               # Create releases with GitHub artifacts
```

## Code Quality Standards

- **Formatting & Linting**: Use `trunk fmt` and `trunk check` before committing
- **Testing**: All projects include tests for TDD and AI performance
- **Environment Setup**: Use `direnv allow` to setup binary dependencies
- **Platform Detection**: Use `IS_MACOS` and `IS_LINUX` environment variables

## File Creation Policy

- **ALWAYS** prefer editing existing files over creating new ones
- **NEVER** create files unless absolutely necessary for the goal
- **NEVER** proactively create documentation files (*.md) or README files
- Only create documentation when explicitly requested

## Technology Stack

- **Build**: Nx monorepo orchestration
- **Infrastructure**: Talos Linux, Kubernetes
- **Automation**: Home Assistant, ESPHome, Ansible
- **Quality**: Trunk CLI with ansible-lint, black, ruff, shellcheck, yamllint

## Best Practices

### Dependency Management
All external dependencies MUST be pinned to specific versions:
- **npm/yarn**: Use exact versions (e.g., `"nx": "21.5.2"` not `"nx": "^21.5.2"`)
- **Python**: Pin to exact versions in requirements.txt (e.g., `mkdocs==1.6.1`)
- **Docker**: Use specific tags (e.g., `python:3.12.8-slim` not `python:3.12-slim` or `python:latest`)
- **Terraform**: Pin provider versions (e.g., `version = "2.11.0"` not `version = "~> 2.11"`)
- **GitHub Actions**: Use commit SHAs or exact tags (e.g., `actions/checkout@v4` or `actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`)
- **Go modules**: Use specific versions in go.mod
- **Helm charts**: Pin chart versions in Chart.yaml

This ensures reproducible builds and prevents unexpected breaking changes. Use Renovatebot for automated dependency updates.

### Platform Detection
Use consistent environment variables:
- Chezmoi templates: `{{ if eq (env "IS_MACOS") "true" }}`
- Goss tests: `skip: {{.Env.IS_MACOS}}`
- Shell scripts: `if [ "$IS_MACOS" = "true" ]; then`

### Kubernetes Naming
Format: `<kind>-<name>.yaml` (e.g., `deployment-app.yaml`, `service-app.yaml`)

### Terraform Best Practices
Use `postconditions` in `data` resources to validate their state:
```hcl
data "aws_instance" "example" {
  instance_id = "i-1234567890abcdef0"

  lifecycle {
    postcondition {
      condition     = self.state == "running"
      error_message = "Instance must be running"
    }
  }
}
```

### Releases
Releases are managed by `nx release`. Artifacts are automatically published to GitHub as part of the release process.
