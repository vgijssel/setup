# AGENTS.md

This monorepo follows an atomic design architecture for infrastructure and application code. Everything is orchestrated through the `task` CLI, with a clear directory layout for navigation and a strong set of conventions to keep things sharp and scalable.

---

## 🗂 Project Structure

Navigate the repo through the following top-level directories:

### `stacks/`
Defines full deployment environments (real or virtualized). For example:

- `enigma/`: Talos-based Kubernetes cluster
- `devenv/`: Local MacOS-based dev environment

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

Each app includes:
- Build configuration (Dockerfile, Taskfile, etc.)
- Source code
- Tests

### `libs/`
Reusable libraries and build tools. For example:

- `rules_task/`: Bazel rule set or CLI helper scripts to simplify task execution, builds, or image packaging

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