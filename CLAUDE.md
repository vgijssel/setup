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

### kind (Kubernetes in Docker) Configuration
When creating kind clusters in Coder workspaces (docker-in-docker environment), **ALWAYS** use the native snapshotter instead of overlayfs to avoid overlay filesystem mount errors:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".containerd]
    snapshotter = "native"
nodes:
- role: control-plane
```
**Why**: The default overlayfs snapshotter fails in docker-in-docker with error:
```
failed to mount rootfs component: ... fstype: overlay, ... data: "...,index=off", err: invalid argument
```
The native snapshotter avoids this by using simple directory copies instead of overlay mounts.
**DO NOT** use `extraMounts` or `type: DirectoryOrCreate` - these don't solve the overlay issue and the `type` field is invalid in kind v1alpha4.

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

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
