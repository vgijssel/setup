# AGENTS.md

This monorepo follows an atomic design architecture for infrastructure and application code. Everything is orchestrated through the `task` CLI, with a clear directory layout for navigation and a strong set of conventions to keep things sharp and scalable.

---

## 🗂 Project Structure

Navigate the repo through the following top-level directories:

### `stacks/`
Defines full deployment environments (real or virtualized). For example:

- `enigma/`: Talos-based Kubernetes cluster
- `devenv/`: Local MacOS-based dev environment
- `provisioner/`: PiKVM machine provisioned using Ansible

### `services/`
Reusable Kubernetes service modules. For example:

- `argocd/`: GitOps engine
- `kubeovn/`: CNI plugin for overlay & VLAN networks
- `rook-ceph/`: Distributed storage platform

Each service includes manifests (Kustomize or Helm), optionally environment-agnostic by default.

### `apps/`
In-house applications built and deployed via services. For example:

- `home-assistant/`: Smart home automation platform
- `blog/`: Blog deployed with mkdocs to GitHub Pages
- `escaperoom/`: Streamlit-based puzzle application

Each app includes:
- Build configuration (Dockerfile, Taskfile, etc.)
- Source code
- Tests

### `libs/`
Reusable libraries and build tools. For example:

- `rules_task/`: Bazel rule set or CLI helper scripts to simplify task execution, builds, or image packaging
- `ansible/`: Shared Ansible roles and filters.

### `third_party/`
All external, vendored dependencies.

- `hermit/`: Binaries manager
- `python/`: `requirements.txt` and any vendored wheels
- `javascript/`: JS/NPM dependencies
- `manifests/`: Vendored upstream Kubernetes manifests using Kustomize

---

## 🚀 Task-Based Entrypoint

All repo commands are executed via [`task`](https://taskfile.dev). It’s the single interface for:

- Building apps
- Testing libs
- Deploying services or full stacks
- Managing infra provisioning

### Example Usage

```bash
task stacks:devenv:apply    # Apply the devenv stack locally
task stacks:enigma:apply    # Apply the enigma Talos-based cluster stack
```

Run `task --list` for a full list of available commands.

## Technology Stack
- **Build Systems**: Bazel (deprecated), Task orchestration, Pants (Python)
- **Infrastructure**: NixOS (deprecated), Talos Linux, Kubernetes
- **Networking**: Kube-OVN CNI, bridge networking
- **Automation**: Home Assistant, ESPHome, Ansible
- **Code Quality**: Trunk CLI with ansible-lint, black, ruff, shellcheck, yamllint

## Development Workflow

1. Use `direnv allow` to setup environment
2. Run `task --list` to see available commands
3. Use `trunk check` before committing
4. Test with `bazel test //...` or `pants test ::`
5. Build documentation with `task docs:serve` for development

### How It Works

- **Automatic Environment Setup**: When you `cd` into the repository, direnv automatically loads the environment configuration
- **JIT Binary Downloads**: Required tools (like `task`, `kubectl`, `helm`, etc.) are downloaded on-demand when first used
- **Isolated Environment**: All tools and dependencies are contained within the repository, avoiding conflicts with system-wide installations
- **Cross-Platform Support**: Works consistently across macOS, Linux, and other supported platforms

### Troubleshooting

- **If commands are not found**: Ensure direnv is properly hooked into your shell and run `direnv reload`
- **If environment seems stale**: Run `direnv reload` to refresh the environment
- **To see what direnv is doing**: Use `direnv status` to check the current state

## Best Practices

### Kubernetes File Naming Convention

Format: `<kind>-<name>.yaml`

Examples:
- deployment-app.yaml
- deployment-worker.yaml
- service-app.yaml
- configmap-env.yaml
- secret-db.yaml
- cronjob-cleanup.yaml

### Code Formatting & Checking

This repo uses the [Trunk CLI](https://docs.trunk.io/code-quality/code-quality)
for consistent formatting and linting. Run `trunk fmt` to automatically format
your changes and `trunk check` to run the configured linters.

### Maintaining AGENTS.md

Whenever you create a new package or move an existing one within the repository, update `AGENTS.md` to reflect the current structure. Keeping this file in sync ensures contributors understand the latest layout.

