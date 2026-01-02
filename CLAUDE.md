# Development Guidelines for AI Assistants

## Project Structure

This Moon monorepo uses a **two-directory structure**. All code MUST go into one of these directories:

- **`apps/`**: Deployable applications, services, and environment-specific configurations (clusters, stacks)
- **`libs/`**: Reusable libraries, shared utilities, build tools, and external dependency wrappers

### Code Placement Rules

**DO NOT** place new code in `stacks/`, `services/`, `tools/`, `third_party/`, or any other top-level directory. These directories are deprecated and being migrated. The `specs/` directory is managed by speckit and should be left as-is.

| If your code... | Place it in |
|-----------------|-------------|
| Is deployable independently | `apps/` |
| Has its own CI/CD pipeline | `apps/` |
| Is environment-specific (cluster config) | `apps/` |
| Is reusable across projects | `libs/` |
| Is a build tool or utility | `libs/` |
| Wraps an external dependency | `third_party/` |

See `.taskmaster/docs/prd-monorepo-consolidation.md` for the full migration plan.

## Core Commands

### Project Discovery
```bash
bin/help                      # Interactive help with real targets and descriptions
moon query projects           # List all projects
moon project <name>           # Show project details
moon query tasks              # List all tasks
```

### Common Operations
```bash
moon run <project>:build      # Build a project
moon run <project>:test       # Test a project
moon run :test --affected     # Test only affected projects
moon check --all              # Run build/test/lint on all projects
moon ci <base> <head>         # Run affected tasks in CI mode
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

- **Build**: Moon monorepo orchestration (https://moonrepo.dev)
- **Infrastructure**: Talos Linux, Kubernetes
- **Automation**: Home Assistant, ESPHome, Ansible
- **Quality**: Trunk CLI with ansible-lint, black, ruff, shellcheck, yamllint

## Moon Concepts

- **Tasks**: Defined in `moon.yml` files in each project, or globally in `.moon/tasks/`
- **Caching**: Automatic content-based caching - repeated runs are instant
- **Dependencies**: Use `deps: ['^:build']` to depend on upstream project builds
- **CI Mode**: `moon ci <base> <head>` detects and runs only affected tasks
- **Sharding**: Use `--shard current/total` for parallel CI execution

## Best Practices

### Dependency Management
All external dependencies MUST be pinned to specific versions to prevent security vulnerabilities and unexpected behavior changes:
- **npm/yarn**: Use exact versions (e.g., `"lodash": "4.17.21"` not `"lodash": "^4.17.21"`)
- **Python**: Pin to exact versions in requirements.txt (e.g., `mkdocs==1.6.1`)
- **Docker**: Use specific tags (e.g., `python:3.12.8-slim` not `python:3.12-slim` or `python:latest`)
- **Terraform**: Pin provider versions (e.g., `version = "2.11.0"` not `version = "~> 2.11"`)
- **GitHub Actions**: Use commit SHAs or exact tags (e.g., `actions/checkout@v4` or `actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11`)
- **Go modules**: Use specific versions in go.mod
- **Helm charts**: Pin chart versions in Chart.yaml

**NEVER** use tools that run unpinned packages:
- **`npx`**: Fetches and runs the latest version of packages without version control
- **`uvx`**: Same issue - runs packages without pinning versions

Instead, install dependencies explicitly with pinned versions, then run them directly.

This ensures reproducible builds, prevents security vulnerabilities from compromised package updates, and avoids unexpected breaking changes. Use Renovatebot for automated dependency updates.

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
Releases are managed via project-specific release tasks. Artifacts are automatically published to GitHub as part of the release process.

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md
