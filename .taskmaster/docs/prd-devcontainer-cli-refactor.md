<context>
# Overview

This PRD describes the refactoring of `libs/coder-devcontainer-kubernetes` to replace DevPod with the devcontainer CLI for building and running development containers in Coder workspaces.

## Problem Statement

The current implementation uses DevPod (loft-sh/devpod) as the devcontainer builder, which has several critical issues:

1. **Maintenance concerns**: DevPod is no longer actively maintained
2. **Build technology limitations**: Uses Kaniko for image building (same as Envbuilder) with known issues around caching, layer handling, and build reliability
3. **VS Code extension compatibility**: DevPod doesn't properly install VS Code extensions (OpenVSCode works, regular VS Code does not)
4. **Configuration complexity**: DevPod adds significant complexity through its provider system, workspace naming conventions, and pod discovery mechanisms
5. **Coder integration gaps**: While Coder is building native devcontainer support (https://coder.com/docs/user-guides/devcontainers), it currently lacks the ability to run tasks (https://github.com/coder/coder/issues/21134)

## Solution

Create a new `devcontainer-builder` library that uses the official devcontainer CLI (`@devcontainers/cli`) to build and run devcontainers. This provides:

- Official Microsoft tooling with active maintenance and community support
- Docker/BuildKit-native image building instead of Kaniko
- Proper VS Code extension installation support
- Simplified architecture without DevPod's provider abstraction
- Full control over the build and run lifecycle

## Target Users

- Developers using Coder workspaces for the `vgijssel/setup` repository
- Agentic coding workflows using Claude Code in Coder workspaces
</context>

<PRD>
# Technical Architecture

## System Components

### 1. devcontainer-builder Library (`libs/devcontainer-builder`)

A Docker image containing:
- **devcontainer CLI** (`@devcontainers/cli`): Official Microsoft CLI for building and running devcontainers
- **Git**: For repository checkout
- **Docker CLI**: For interacting with the Docker daemon (either DinD or mounted socket)
- **Log streamer**: Python script to stream build logs to Coder's log API (reuse from current implementation)
- **Entrypoint script**: Orchestrates git clone, devcontainer build, and devcontainer up

The image will be published to: `ghcr.io/vgijssel/setup/devcontainer-builder`

### 2. Coder Template (`libs/coder-devcontainer-kubernetes`)

Updated Terraform template that:
- Creates a Kubernetes Deployment (not Job) with the devcontainer-builder as an init container
- Mounts Docker socket or runs Docker-in-Docker for building
- Passes Coder agent environment variables to the devcontainer
- Uses a persistent volume for `/workspaces` to preserve workspace state

### 3. Devcontainer Cache Registry

Cache images stored at: `ghcr.io/vgijssel/setup/devcontainer-cache`

Used by devcontainer CLI's `--cache-from` and `--cache-to` options for faster rebuilds.

## Data Flow

```
1. Coder provisions workspace
   └── Creates Kubernetes Deployment with devcontainer-builder init container

2. devcontainer-builder init container starts
   ├── Clones repository to /workspaces/<repo-name>
   ├── Runs `devcontainer up` with Docker socket access
   │   ├── Builds devcontainer image (caches to ghcr.io)
   │   └── Starts devcontainer container
   ├── Streams build logs to Coder API
   └── Passes CODER_AGENT_TOKEN and CODER_INIT_SCRIPT to devcontainer

3. Devcontainer starts
   ├── Runs postCreateCommand/postStartCommand from devcontainer.json
   ├── Executes CODER_INIT_SCRIPT to start Coder agent
   └── Coder agent connects back to Coder server

4. Workspace becomes ready
   └── User can connect via SSH, VS Code, or web terminal
```

## Environment Variables

### Required (set by Coder template):
- `CODER_AGENT_URL`: Coder server URL for agent connection
- `CODER_AGENT_TOKEN`: Authentication token for Coder agent
- `CODER_INIT_SCRIPT`: Script to start the Coder agent

### Required (set by Coder template for devcontainer-builder):
- `DEVCONTAINER_REPOSITORY`: Git repository URL (e.g., `https://github.com/vgijssel/setup.git`)
- `DEVCONTAINER_BRANCH`: Git branch to checkout (e.g., `main`)

### Optional:
- `DEVCONTAINER_CACHE_FROM`: Cache source image (default: `ghcr.io/vgijssel/setup/devcontainer-cache`)
- `DEVCONTAINER_CACHE_TO`: Cache destination image
- `DEVCONTAINER_WORKSPACE_FOLDER`: Override workspace folder path
- `GH_TOKEN`: GitHub token for private repository access (passed from Coder external auth)

## API Integration

### Coder Log API
The devcontainer-builder will use the same log streaming mechanism as the current devpod-builder:
- `POST /api/v2/workspaceagents/me/log-source` - Register log source
- `PATCH /api/v2/workspaceagents/me/logs` - Stream log entries

### Docker Registry API
For caching devcontainer images:
- Push built images to `ghcr.io/vgijssel/setup/devcontainer-cache`
- Pull cached layers during builds

## Infrastructure Requirements

### Kubernetes Resources
- **Deployment**: Long-running pod for workspace (replaces Job)
- **PersistentVolumeClaim**: For `/workspaces` directory
- **ServiceAccount**: `devcontainer-builder` with permissions to create pods/deployments
- **ConfigMap**: Workspace configuration (registry URLs, etc.)

### Docker Socket Access
Two options for building images inside Kubernetes:
1. **Docker-in-Docker (DinD)**: Run dockerd as a sidecar container
2. **Mounted Docker socket**: Mount host's Docker socket (security implications)

Recommendation: Use DinD for isolation and security.

# Development Roadmap

## Phase 1: devcontainer-builder Image (MVP)

Create the core `devcontainer-builder` Docker image:

1. **Dockerfile**: Ubuntu-based image with devcontainer CLI, git, Docker CLI
2. **entrypoint.sh**: Main orchestration script
   - Validate required environment variables
   - Clone repository with specified branch
   - Run `devcontainer up` with appropriate options
   - Stream logs to Coder API
   - Inject Coder agent environment and start agent
3. **log-streamer.py**: Reuse and adapt from current devpod-builder
4. **moon.yml**: Build configuration for the image
5. **version.txt**: Version tracking

Deliverables:
- Working `devcontainer up` execution
- Log streaming to Coder
- Coder agent startup in devcontainer

## Phase 2: Kubernetes Template Integration

Update the Coder template to use devcontainer-builder:

1. **Remove DevPod references**: Delete kubernetes_job_v1.devpod_builder
2. **Add Deployment resource**: Create kubernetes_deployment_v1 with:
   - Init container running devcontainer-builder
   - Main container being the built devcontainer
   - Proper volume mounts for /workspaces and Docker socket
3. **Update parameters**: Rename `devcontainer_builder` parameter
4. **Update metadata**: Track new builder type

Deliverables:
- Working Coder template with devcontainer-builder
- Successful workspace creation and agent connection

## Phase 3: Docker-in-Docker Integration

Enable image building inside Kubernetes:

1. **DinD sidecar**: Add Docker daemon sidecar container
2. **Shared volume**: Docker socket volume between containers
3. **Build caching**: Configure cache-from/cache-to options
4. **Security**: Non-root execution where possible

Deliverables:
- Full image building inside Kubernetes
- Layer caching for faster rebuilds

## Phase 4: Testing and Validation

Comprehensive testing:

1. **Update workspace-test.bats**: New test parameters
2. **Update goss.yaml**: New validation checks
3. **Add devcontainer-builder tests**: Unit tests for entrypoint
4. **Integration tests**: End-to-end workspace creation

Deliverables:
- All existing tests passing
- New tests for devcontainer-builder functionality

## Phase 5: Cleanup and Documentation

1. **Remove devpod-builder**: Delete `libs/devpod-builder` directory
2. **Update CLAUDE.md**: New debugging instructions
3. **Update comments**: Remove DevPod references from Terraform

Deliverables:
- Clean codebase without DevPod remnants
- Updated documentation

# Logical Dependency Chain

## Foundation (Must be built first)

1. **devcontainer-builder Dockerfile** - The core image is required before anything else
2. **entrypoint.sh** - Basic script structure to run devcontainer CLI
3. **log-streamer.py** - Can be copied/adapted from devpod-builder

## Building Blocks (Depend on foundation)

4. **Basic devcontainer execution** - `devcontainer up` working locally
5. **Coder agent injection** - Pass environment variables to devcontainer
6. **Coder log streaming** - Build logs visible in Coder UI

## Integration Layer (Depend on building blocks)

7. **Kubernetes Deployment resource** - Replace Job with Deployment
8. **Docker-in-Docker sidecar** - Enable image building in K8s
9. **Volume mounts** - PVC for /workspaces, Docker socket

## Validation Layer (Depend on integration)

10. **Template push and test** - Manual validation via `coder templates push`
11. **Automated tests** - Update bats tests and goss validation
12. **End-to-end validation** - Full workspace lifecycle test

## Cleanup (After validation passes)

13. **Remove devpod-builder** - Delete old library
14. **Update documentation** - Remove DevPod references

# Risks and Mitigations

## Technical Challenges

### Risk: Docker-in-Docker complexity in Kubernetes
**Impact**: High - Could block image building
**Mitigation**:
- Start with privileged DinD sidecar (known working pattern)
- Consider Sysbox for rootless DinD as future optimization
- Document security implications clearly

### Risk: devcontainer CLI compatibility issues
**Impact**: Medium - May need workarounds for specific features
**Mitigation**:
- Pin devcontainer CLI version in Dockerfile
- Test with the specific devcontainer.json in this repo
- Have fallback to manual Docker build if needed

### Risk: Coder agent startup timing
**Impact**: Medium - Agent may not start correctly
**Mitigation**:
- Use devcontainer lifecycle hooks (postStartCommand)
- Add health checks and retry logic
- Ensure environment variables are properly inherited

## MVP Definition

The MVP must include:
1. Working devcontainer-builder image
2. Successful `devcontainer up` execution
3. Coder agent connecting and reporting healthy
4. Log streaming to Coder UI
5. Existing tests passing

Non-MVP items (can be deferred):
- Layer caching optimization
- Non-root execution
- Multiple repository support
- Custom devcontainer.json paths

## Resource Constraints

### Build Time
Building devcontainer images can take 5-10 minutes. Mitigate with:
- Aggressive layer caching
- Pre-pulled base images
- Parallel builds where possible

### Registry Storage
Cached images consume storage. Mitigate with:
- Retention policies on ghcr.io
- Tag-based cache invalidation
- Regular cleanup of old cache images

# Appendix

## Technical Specifications

### devcontainer CLI Commands

Build and run devcontainer:
```bash
devcontainer up \
  --workspace-folder /workspaces/setup \
  --cache-from ghcr.io/vgijssel/setup/devcontainer-cache \
  --cache-to ghcr.io/vgijssel/setup/devcontainer-cache \
  --docker-path /usr/local/bin/docker
```

### Dockerfile Base Structure

```dockerfile
FROM ubuntu:24.04

# Install Node.js for devcontainer CLI
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Install devcontainer CLI
RUN npm install -g @devcontainers/cli@<pinned-version>

# Install Docker CLI
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | tee /etc/apt/sources.list.d/docker.list \
    && apt-get update && apt-get install -y docker-ce-cli

# Install git, python for log streaming
RUN apt-get install -y git python3 python3-requests

COPY entrypoint.sh /app/entrypoint.sh
COPY log-streamer.py /app/log-streamer.py

ENTRYPOINT ["/app/entrypoint.sh"]
```

### Kubernetes Deployment Structure

```yaml
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      initContainers:
        - name: devcontainer-builder
          image: ghcr.io/vgijssel/setup/devcontainer-builder
          env:
            - name: CODER_AGENT_URL
            - name: CODER_AGENT_TOKEN
            - name: DEVCONTAINER_REPOSITORY
            - name: DEVCONTAINER_BRANCH
          volumeMounts:
            - name: workspaces
              mountPath: /workspaces
            - name: docker-socket
              mountPath: /var/run/docker.sock
      containers:
        - name: devcontainer
          # Image determined by devcontainer build
          # Started by devcontainer up
      volumes:
        - name: workspaces
          persistentVolumeClaim:
            claimName: coder-<workspace-id>-workspaces
        - name: docker-socket
          # DinD sidecar or host mount
```

## References

- [devcontainer CLI documentation](https://github.com/devcontainers/cli)
- [Coder devcontainer support](https://coder.com/docs/user-guides/devcontainers)
- [Coder issue #21134 - devcontainer tasks](https://github.com/coder/coder/issues/21134)
- [Current devpod-builder implementation](../../../libs/devpod-builder/)
- [Current coder-devcontainer-kubernetes template](../../../libs/coder-devcontainer-kubernetes/)

## Testing Commands

```bash
# Push template to Coder
coder templates push coder-devcontainer-kubernetes

# Run workspace tests
moon run coder-devcontainer-kubernetes:workspace_test

# Manual workspace creation for testing
coder create test-devcontainer \
  --template coder-devcontainer-kubernetes \
  --parameter cpu=2 \
  --parameter memory=4 \
  --parameter git_branch=main
```
</PRD>
