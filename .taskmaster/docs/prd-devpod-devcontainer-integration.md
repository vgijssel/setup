# DevPod Devcontainer Integration for Coder

## Overview

This PRD outlines the implementation of fully compliant devcontainer workspaces running inside Coder using DevPod. The goal is to achieve identical development experiences between Coder remote workspaces and local development, enabling complete support for VSCode extensions, devcontainer features, and lifecycle hooks.

### Problem Statement

Currently, Coder workspaces use Envbuilder (https://github.com/coder/envbuilder) to build devcontainer images. Envbuilder has several limitations:

1. **Incomplete devcontainer spec compliance** - Envbuilder supports approximately 80% of the devcontainer specification, missing critical features like extensions and lifecycle hooks (see: https://github.com/coder/envbuilder/blob/main/docs/devcontainer-spec-support.md)
2. **VSCode extensions not working** - Extensions defined in `devcontainer.json` are not installed in the resulting workspace
3. **Kaniko build limitations** - Envbuilder uses Kaniko for image building, which has issues with symlinks (requiring workarounds in the Dockerfile)
4. **No runtime devcontainer features** - Lifecycle hooks and dynamic features are not supported

### Solution Overview

Replace Envbuilder with DevPod (https://github.com/loft-sh/devpod), which provides:
- 95%+ devcontainer specification compliance
- Full VSCode extension support
- Lifecycle hook execution
- Buildkit/Podman-based builds (not Kaniko)
- Kubernetes provider for running workspaces as pods

### Why DevPod Over Alternatives

1. **Coder's native devcontainer integration** - Does not support `coder_apps` and `coder_scripts`, breaking Coder Tasks (Claude Code integration)
2. **Build-only approach (devcontainer CLI)** - Building the image and running as a regular pod disables runtime features like extensions and lifecycle hooks
3. **DevPod with Kubernetes provider** - Gets us closest to full devcontainer compliance while maintaining Coder integration

## Core Features

### 1. Full Devcontainer Specification Support
- **What it does**: Supports 95%+ of the devcontainer spec including extensions, features, and lifecycle hooks
- **Why important**: Enables identical development experience between local and remote environments
- **How it works**: DevPod handles the full devcontainer lifecycle, building and running containers according to spec

### 2. VSCode Extension Installation
- **What it does**: Automatically installs VSCode extensions defined in `devcontainer.json`
- **Why important**: Current envbuilder implementation ignores extension configuration
- **How it works**: DevPod processes the `customizations.vscode.extensions` array during workspace creation

### 3. Coder Integration
- **What it does**: Maintains full Coder functionality including `coder_apps`, `coder_scripts`, and Coder Tasks
- **Why important**: Enables Claude Code as a Coder Task and other Coder-specific features
- **How it works**: The DevPod-created pod receives `CODER_AGENT_TOKEN`, `CODER_AGENT_URL`, and `CODER_INIT_SCRIPT`

### 4. Build Logging to Coder
- **What it does**: Streams DevPod build logs to the Coder workspace UI
- **Why important**: Provides visibility into workspace creation progress
- **How it works**: Python script posts logs to Coder API endpoints (`POST /api/v2/workspaceagents/me/log-source` and `PATCH /api/v2/workspaceagents/me/logs`)

## User Experience

### User Personas

1. **Developer** - Uses Coder workspaces for daily development, expects VSCode with extensions and familiar devcontainer behavior
2. **Platform Engineer** - Maintains Coder templates, needs reliable workspace provisioning with good observability

### Key User Flows

1. **Workspace Creation**
   - User clicks "Create Workspace" in Coder UI
   - Selects repository and branch
   - DevPod builds the devcontainer (logs visible in Coder UI)
   - Workspace becomes available with all extensions installed
   - Claude Code task is accessible

2. **Workspace Restart**
   - User restarts workspace
   - Cached image is reused (if available)
   - Extensions and configuration persist
   - Lifecycle hooks execute

### UI/UX Considerations

- Build logs visible in Coder workspace startup UI
- Clear error messages if DevPod fails
- Workspace metadata shows build status and cache state

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Coder Server                              │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ Workspace API    │  │ Log Ingestion    │                     │
│  │ (agent tokens)   │  │ (build progress) │                     │
│  └────────┬─────────┘  └────────▲─────────┘                     │
└───────────┼─────────────────────┼───────────────────────────────┘
            │                     │
            ▼                     │
┌───────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                          │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  DevPod Builder Job                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   DevPod     │  │ Python Log   │  │  Build       │   │  │
│  │  │   CLI        │──│ Streamer     │──│  Output      │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────┬───────────────────────────────┘  │
│                            │                                   │
│                            ▼ creates                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              DevPod Workspace Pod                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Devcontainer│  │ Coder Agent  │  │  VSCode      │   │  │
│  │  │  Runtime     │  │ (with token) │  │  Extensions  │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Data Models

**DevPod Builder Image Configuration**
```yaml
image: ghcr.io/vgijssel/setup/devpod-builder:latest
env:
  - CODER_AGENT_TOKEN     # Token for Coder agent authentication
  - CODER_AGENT_URL       # Coder server URL for agent communication
  - CODER_INIT_SCRIPT     # Script to initialize Coder agent
  - DEVPOD_REPOSITORY     # Git repository URL
  - DEVPOD_BRANCH         # Git branch to checkout
```

**Kubernetes Job Spec**
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: devpod-builder-${workspace_id}
spec:
  template:
    spec:
      containers:
      - name: devpod
        image: ghcr.io/vgijssel/setup/devpod-builder:latest
        env:
          - name: CODER_AGENT_TOKEN
            value: <from coder_agent resource>
          - name: CODER_AGENT_URL
            value: <from configmap>
          - name: CODER_INIT_SCRIPT
            value: <from coder_agent resource>
```

### APIs and Integrations

1. **Coder Log API** - Used by DevPod builder to stream build logs
   - `POST /api/v2/workspaceagents/me/log-source` - Register log source
   - `PATCH /api/v2/workspaceagents/me/logs` - Stream log entries

2. **DevPod Kubernetes Provider API** - DevPod communicates with K8s API to create workspace pods

3. **GitHub External Auth** - Existing authentication flow for repository access

### Infrastructure Requirements

1. **Kubernetes RBAC** - DevPod builder job needs permissions to:
   - Create/manage pods in workspace namespace
   - Create/manage services (if needed for devcontainer features)
   - Read secrets (for git credentials)

2. **Container Registry** - For caching DevPod-built images (existing local registry)

3. **Persistent Storage** - For workspace data (existing PVC configuration)

## Development Roadmap

### Phase 1: POC Validation

**Goal**: Validate the DevPod approach works in the Kubernetes cluster before investing in full implementation.

**Scope**:
1. Create a Kubernetes Job manifest that:
   - Downloads and installs DevPod
   - Configures DevPod with Kubernetes provider
   - Runs `devpod up` to create a workspace
   - Exits with code 0 on success

2. Create necessary RBAC resources:
   - ServiceAccount for the job
   - Role with pod creation permissions
   - RoleBinding to connect them

3. Validate the created workspace:
   - Verify pod is running
   - Verify VSCode extensions are installed (via `kubectl exec`)
   - Verify devcontainer features work

**Exit Criteria**:
- DevPod successfully creates a workspace pod in the cluster
- VSCode extensions from `devcontainer.json` are installed
- If this cannot be achieved, stop and reassess approach

### Phase 2: Implementation

**Goal**: Wire DevPod into Coder workspace provisioning with full integration.

**Scope**:

1. **Create DevPod Builder Docker Image** (`setup/devpod-builder`)
   - Base image with DevPod pre-installed
   - Kubernetes provider pre-configured
   - Python script for Coder log streaming
   - Validates `CODER_AGENT_TOKEN` and `CODER_AGENT_URL` on startup

2. **Implement Log Streaming**
   - Python implementation that batches logs every second
   - Posts to Coder API endpoints for build visibility
   - Reference: https://github.com/coder/envbuilder for API patterns

3. **Update Terraform Template** (`libs/coder-devcontainer-kubernetes/main.tf`)
   - Replace `envbuilder_cached_image` resource with Kubernetes Job
   - Pass `CODER_AGENT_TOKEN`, `CODER_AGENT_URL`, `CODER_INIT_SCRIPT` to DevPod workspace
   - Update deployment to use DevPod-created pod (or integrate with DevPod's pod)
   - Remove envbuilder provider and related resources

4. **Publish Docker Image**
   - Push `setup/devpod-builder` to `ghcr.io/vgijssel/setup/devpod-builder`
   - Tag with version for reproducibility

5. **Deploy and Validate**
   - Push updated template to Coder with `coder templates push`
   - Run workspace test: `moon run coder-devcontainer-kubernetes:workspace_test`
   - Verify Claude Code task works
   - Verify VSCode extensions are installed

### Phase 3: Cleanup and Optimization

**Goal**: Production-ready implementation with caching and proper resource management.

**Scope**:

1. **Daemonless DevPod Deployment**
   - Investigate running DevPod without a persistent daemon
   - Implement if feasible to reduce resource usage

2. **Build Caching**
   - Configure DevPod to cache builds in local registry
   - Measure and optimize workspace creation time

3. **Codify Kubernetes RBAC**
   - Move ServiceAccount, Role, RoleBinding to `apps/coder-prod`
   - Ensure resources are managed declaratively
   - Document required permissions

## Logical Dependency Chain

### Foundation (Must Build First)

1. **POC Validation** - Proves the approach works before investing in implementation
   - No code changes to existing system
   - Manual kubectl operations
   - Go/no-go decision point

### Core Implementation (Sequential)

2. **RBAC Resources** - Required before DevPod can create pods
   - ServiceAccount, Role, RoleBinding
   - Must be deployed before builder job can run

3. **DevPod Builder Image** - Container that runs DevPod
   - Depends on: Understanding of DevPod CLI
   - Creates: Docker image with DevPod + log streaming

4. **Log Streaming Script** - Visibility into build process
   - Depends on: Coder API documentation
   - Creates: Python script in builder image

5. **Terraform Changes** - Integrates DevPod with Coder
   - Depends on: Builder image, RBAC resources
   - Creates: Updated template with DevPod job

### Validation

6. **End-to-End Testing** - Proves everything works together
   - Depends on: All above components
   - Validates: Workspace creation, extensions, Coder tasks

### Optimization (Can Happen After Core Works)

7. **Caching Implementation** - Faster workspace creation
   - Depends on: Working DevPod integration
   - Optional: Can ship without initially

8. **Daemonless Mode** - Resource optimization
   - Depends on: Working DevPod integration
   - Optional: Requires investigation

## Risks and Mitigations

### Technical Challenges

| Risk | Impact | Mitigation |
|------|--------|------------|
| DevPod Kubernetes provider doesn't work as expected | High | POC phase validates this before full implementation |
| Coder agent doesn't start in DevPod-created pod | High | Test CODER_INIT_SCRIPT injection in POC phase |
| Log streaming API not compatible | Medium | Reference envbuilder implementation; fallback to kubectl logs |
| DevPod caching not compatible with local registry | Medium | Accept slower builds initially; optimize later |
| RBAC permissions insufficient or overly broad | Medium | Start minimal, expand as needed; document requirements |

### MVP Definition

**Minimum Viable Product**:
- DevPod successfully creates workspace pods
- Coder agent connects and workspace is accessible
- VSCode extensions are installed
- Claude Code task works
- Build logs visible in Coder UI

**Not Required for MVP**:
- Build caching
- Daemonless mode
- Optimized startup time

### Resource Constraints

| Constraint | Impact | Approach |
|------------|--------|----------|
| Single developer implementation | Slower delivery | Phased approach; clear exit criteria at POC |
| Existing envbuilder must keep working during transition | Parallel systems | Keep envbuilder until DevPod fully validated |
| Limited DevPod documentation for Kubernetes | Learning curve | POC phase includes discovery; document findings |

## Appendix

### Research Findings

**DevPod Kubernetes Provider**
- Source: https://github.com/loft-sh/devpod
- Supports Kubernetes as a workspace provider
- Creates pods directly in the cluster
- Handles devcontainer spec interpretation

**Coder Log API**
- Reference implementation: https://github.com/coder/envbuilder
- Endpoints:
  - `POST /api/v2/workspaceagents/me/log-source` - Register a log source
  - `PATCH /api/v2/workspaceagents/me/logs` - Batch log entries

**Current Envbuilder Limitations**
- Spec support: https://github.com/coder/envbuilder/blob/main/docs/devcontainer-spec-support.md
- Missing: extensions, lifecycle hooks, many features
- Uses Kaniko: Symlink issues in Dockerfile

### Technical Specifications

**Current devcontainer.json Extensions**
```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "anthropic.claude-code",
        "ms-azuretools.vscode-docker",
        "mkhl.direnv",
        "ms-python.python",
        "bee.git-temporal-vscode",
        "github.copilot",
        "github.copilot-chat",
        "openai.chatgpt",
        "vspacecode.vspacecode",
        "alexanderbast.vscode-snazzy",
        "tilt-dev.tiltfile",
        "github.remotehub",
        "hashicorp.hcl",
        "hashicorp.terraform",
        "Hamster.task-master-hamster",
        "jetmartin.bats"
      ]
    }
  }
}
```

**Required Environment Variables for DevPod Workspace**
- `CODER_AGENT_TOKEN` - Authentication token for Coder agent
- `CODER_AGENT_URL` - Coder server URL (internal K8s DNS)
- `CODER_INIT_SCRIPT` - Agent initialization script

**Existing Terraform Resources to Modify/Remove**
- `envbuilder_cached_image.workspace` - Replace with DevPod job
- `kubernetes_deployment_v1.workspace` - May integrate with DevPod or replace
- Envbuilder provider block - Remove

### File Locations

- Current Terraform: `libs/coder-devcontainer-kubernetes/main.tf`
- Devcontainer config: `.devcontainer/devcontainer.json`
- Dockerfile: `.devcontainer/Dockerfile`
- RBAC resources (future): `apps/coder-prod/`
- DevPod builder image: `libs/devpod-builder/` (new)
