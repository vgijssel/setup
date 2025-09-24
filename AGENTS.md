# AGENTS.md

This monorepo follows the [Nx](https://nx.dev) monorepo pattern for infrastructure and application code. The structure emphasizes reusable libraries with focused applications, clear directory layout for navigation, and strong conventions to keep things sharp and scalable.

---

## 🗂 Project Structure

Navigate the repo through the following top-level directories:

### `libs/`
The majority of code lives here as reusable libraries. Examples:

- `libs/ansible/`: Shared Ansible roles and filters
- `libs/cloudflare-tunnel/`: Cloudflare tunnel configuration
- `libs/devenv/`: Development environment setup
- `libs/internal-dns/`: Internal DNS management

### `apps/`
Focused applications built using the libraries. Examples:

- `apps/haos/`: Smart home automation platform
- `apps/escaperoom/`: Streamlit-based puzzle application

### `stacks/`
Environment-specific deployments of apps and libs. Examples:

- `stacks/enigma/`: Talos-based Kubernetes cluster deployment
- `stacks/devenv/`: Local macOS-based dev environment
- `stacks/provisioner/`: PiKVM machine provisioned using Ansible

### `third_party/`
All external, vendored dependencies organized by type:

- `third_party/hermit/`: Binary package manager manifests
- `third_party/python/`: Python dependencies and vendored wheels
- `third_party/javascript/`: JavaScript/NPM dependencies
- `third_party/shell/`: Shell scripts (managed via vendir)
- `third_party/helm/`: Helm charts (managed via vendir)

---

## 🚀 Nx-Based Build System

All repo commands are executed via [`nx`](https://nx.dev). It provides:

- Smart rebuilds and caching
- Dependency graph awareness
- Parallel execution
- Code generation and scaffolding

### Example Usage

```bash
nx build haos              # Build the haos app
nx test ansible            # Test the ansible lib
nx run enigma:deploy       # Deploy the enigma stack
nx affected:test           # Test only affected projects
```

Run `nx show projects` to see all available projects.

## Technology Stack
- **Build Systems**: Nx monorepo orchestration
- **Infrastructure**: Talos Linux, Kubernetes
- **Networking**: Kube-OVN CNI, bridge networking
- **Automation**: Home Assistant, ESPHome, Ansible
- **Code Quality**: Trunk CLI with ansible-lint, black, ruff, shellcheck, yamllint

## Development Workflow

1. Use `direnv allow` to setup environment
2. Run `nx show projects` to see available projects
3. Use `trunk check` before committing
4. Test with `nx test` or `nx affected:test`
5. All projects include tests to enable TDD and improve AI performance

## Binary Management

All binaries are available on-demand through the `bin/` directory:

- **Just-In-Time Installation**: When you use a file inside `bin/`, it's automatically installed and executed
- **Hermit Integration**: Most executables are installed through [Hermit](https://cashapp.github.io/hermit/), either directly or using custom manifests
- **Fallback Scripts**: If a Hermit manifest isn't possible, custom shell scripts handle installation
- **Isolated Environment**: All tools are contained within the repository, avoiding system conflicts

### How It Works

- **Automatic Environment Setup**: When you `cd` into the repository, direnv automatically loads the environment configuration
- **On-Demand Binaries**: Required tools (like `nx`, `kubectl`, `helm`, etc.) are downloaded when first used
- **Cross-Platform Support**: Works consistently across macOS, Linux, and other supported platforms

### Troubleshooting

- **If commands are not found**: Ensure direnv is properly hooked into your shell and run `direnv reload`
- **If environment seems stale**: Run `direnv reload` to refresh the environment
- **To see what direnv is doing**: Use `direnv status` to check the current state

## Best Practices

### Platform Detection
- **Environment Variables**: Use `IS_MACOS` and `IS_LINUX` for consistent platform detection
- **Values**: Set to "true" or "false" in `.envrc` based on detected OS
- **Usage**:
  - Chezmoi templates: `{{ if eq (env "IS_MACOS") "true" }}`
  - Goss tests: `skip: {{.Env.IS_MACOS}}`
  - Shell scripts: `if [ "$IS_MACOS" = "true" ]; then`
- **Consistency**: Apply across all tools for unified platform handling

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

