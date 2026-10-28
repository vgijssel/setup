# Dev-cluster

Local development cluster orchestration tool for creating Kubernetes clusters with kind and Flux GitOps bootstrap.

## Features

- Create idempotent kind clusters with native snapshotter
- Flux GitOps bootstrap with suspended reconciliation
- Simple, familiar command-line tool interface (similar to kind)
- Progress feedback for each operation

## Prerequisites

The following tools must be installed:

- **kind**: Kubernetes in Docker ([installation](https://kind.sigs.k8s.io/))
- **kubectl**: Kubernetes command-line tool ([installation](https://kubernetes.io/docs/tasks/tools/))
- **flux**: Flux command-line tool ([installation](https://fluxcd.io/flux/installation/))

## Installation

Install the package using uv:

```bash
uv pip install -e libs/dev-cluster
```

Or using pip:

```bash
pip install -e libs/dev-cluster
```

## Usage

### Create a cluster

Create a new development cluster (idempotent):

```bash
dev-cluster create my-cluster
```

The create command performs these steps:
1. Create a kind cluster (if it doesn't exist)
2. Wait for the cluster to be ready
3. Bootstrap Flux GitOps
4. Suspend Flux reconciliation

### Create with custom config

Use a custom kind configuration file:

```bash
dev-cluster create my-cluster --config path/to/kind-config.yaml
```

### Create with custom Flux settings

Specify custom Flux repository and path:

```bash
dev-cluster create my-cluster \
  --repo-url https://github.com/myorg/myrepo \
  --flux-path clusters/dev/my-cluster
```

### Delete a cluster

Delete an existing cluster:

```bash
dev-cluster delete my-cluster
```

### Verbose output

Enable verbose output for debugging:

```bash
dev-cluster -v create my-cluster
dev-cluster --verbose create my-cluster
```

## Configuration

### Environment variables

The tool supports the following environment variables:

- `FLUX_REPO_URL`: Git repository URL (default: `https://github.com/vgijssel/setup`)
- `FLUX_PATH`: Path in repository for Flux manifests (default: `apps/dev-cluster-stack`)

Example:

```bash
export FLUX_REPO_URL="https://github.com/myorg/myrepo"
export FLUX_PATH="clusters/my-cluster"

dev-cluster create my-cluster
```

### Kind configuration

If no custom configuration is provided, the tool uses the following default configuration with native snapshotter:

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

The native snapshotter is used instead of overlayfs to avoid overlay filesystem mount errors.

## Command-line tool reference

### Global options

- `-v, --verbose`: Enable verbose output

### Commands

#### `create`

Create a development cluster.

```bash
dev-cluster create NAME [OPTIONS]
```

**Arguments:**
- `NAME`: Name of the cluster to create

**Options:**
- `--config PATH`: Path to kind cluster config file
- `--wait DURATION`: Wait duration for cluster to be ready (default: `5m`)
- `--repo-url URL`: Git repository URL for Flux bootstrap (default: `https://github.com/vgijssel/setup`)
- `--flux-path PATH`: Path in repository for Flux (default: `apps/dev-cluster-stack`)
- `--branch BRANCH`: Git branch to use (defaults to current branch)

#### `delete`

Delete a development cluster.

```bash
dev-cluster delete NAME
```

**Arguments:**
- `NAME`: Name of the cluster to delete

## Examples

### Basic usage

```bash
# Create a cluster
dev-cluster create dev

# Delete a cluster
dev-cluster delete dev
```

### Custom configuration

```bash
# Create with custom kind config
cat > kind-config.yaml <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
EOF

dev-cluster create multi-node --config kind-config.yaml
```

### Multiple clusters

```bash
# Create multiple clusters for different purposes
dev-cluster create dev-frontend
dev-cluster create dev-backend
dev-cluster create staging
```

### Custom wait time

```bash
# Wait up to 10 minutes for cluster to be ready
dev-cluster create slow-cluster --wait 10m
```

## Troubleshooting

### Missing prerequisites

If you see an error about missing tools, install them:

```bash
Error: Missing required tools:
  - kind: Install from https://kind.sigs.k8s.io/
```

### Cluster creation fails

Enable verbose mode to see detailed error messages:

```bash
dev-cluster -v create my-cluster
```

## Development

### Running tests

```bash
# Run unit tests
pytest

# Run integration tests
pytest tests/integration
```

### Code quality

```bash
# Format code
trunk fmt

# Run linters
trunk check
```

## License

See the root repository LICENSE file.
