# Development Guidelines for AI Assistants

## Project Structure

This Nx monorepo follows a clear hierarchy:
- `libs/`: Reusable libraries (ansible, cloudflare-tunnel, devenv, internal-dns)
- `apps/`: Focused applications (haos, escaperoom)
- `stacks/`: Environment-specific deployments (enigma, devenv, provisioner)
- `third_party/`: External dependencies (hermit, python, javascript, shell, helm)

## Core Commands

All commands use `nx`:
```bash
nx show projects          # List all projects
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

### Platform Detection
Use consistent environment variables:
- Chezmoi templates: `{{ if eq (env "IS_MACOS") "true" }}`
- Goss tests: `skip: {{.Env.IS_MACOS}}`
- Shell scripts: `if [ "$IS_MACOS" = "true" ]; then`

### Kubernetes Naming
Format: `<kind>-<name>.yaml` (e.g., `deployment-app.yaml`, `service-app.yaml`)

### Terraform Best Practices
Use `check` statements to validate `data` resources:
```hcl
data "aws_instance" "example" {
  instance_id = "i-1234567890abcdef0"
}

check "instance_running" {
  assert {
    condition     = data.aws_instance.example.state == "running"
    error_message = "Instance must be running"
  }
}
```

### Releases
Releases are managed by `nx release`. Artifacts are automatically published to GitHub as part of the release process.