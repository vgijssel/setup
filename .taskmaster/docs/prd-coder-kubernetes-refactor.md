# PRD: Refactor Coder Devcontainer for Kubernetes Deployment

<context>
# Overview
This project refactors the existing Docker-based Coder devcontainer (`libs/coder-devcontainer`) to work with the Kubernetes-based Coder deployment (`apps/coder-prod`). The new Kubernetes-compatible template will be created as a new library `libs/coder-devcontainer-kubernetes`, enabling developers to run Coder workspaces on the Kubernetes cluster with proper resource management, persistent storage, and devcontainer support via Envbuilder.

## Problem Statement
Currently, `libs/coder-devcontainer` uses Docker as the provisioner, which works well for local development but doesn't integrate with the production Kubernetes Coder deployment at `apps/coder-prod`. The Kubernetes deployment (CozyStack running on local LAN) offers:
- Better resource management and scheduling
- Persistent volume claims for workspace data
- Integration with cluster-level secrets and authentication
- Local image registry caching for faster workspace builds
- Production-grade monitoring and observability

## Value Proposition
This refactor enables:
1. **Unified Deployment Model**: Use the same Coder instance for both local development and production workspaces
2. **Infrastructure Efficiency**: Leverage Kubernetes resource management and scheduling
3. **Faster Builds**: Local image registry caching reduces workspace startup time
4. **Better Security**: Cluster-level secrets management via 1Password
5. **Scalability**: Run multiple workspaces with proper resource isolation
6. **AI Task Automation**: Full Coder Tasks support for autonomous AI agent workflows

## Target Users
- Developers using Coder workspaces for the setup repository
- DevOps engineers managing Coder infrastructure
- AI agents executing tasks in Coder workspaces

# Core Features

## 1. Kubernetes-Native Workspace Provisioning
**What it does**: Creates Coder workspaces as Kubernetes Deployments with proper labels, annotations, and resource management.

**Why it's important**: Kubernetes provides better resource scheduling, isolation, and monitoring compared to standalone Docker containers.

**How it works**:
- Uses the Kubernetes Terraform provider instead of Docker provider
- Creates Deployment with single replica (Recreate strategy)
- Attaches PersistentVolumeClaim for `/workspaces` directory
- Uses KubeVirt CSI driver for persistent storage from parent cluster

## 2. Envbuilder Integration
**What it does**: Uses Envbuilder to build and cache devcontainer images in a local image registry.

**Why it's important**: Enables devcontainer support in Kubernetes without requiring privileged Docker-in-Docker, with automatic caching for faster subsequent builds.

**How it works**:
- Uses `coder/envbuilder` provider to detect cached images
- Configures Envbuilder environment variables for Git auth, workspace folder, devcontainer directory
- Pushes built images to local image registry with automatic cleanup
- Reuses cached images when available to speed up workspace creation

## 3. Local Image Registry Integration
**What it does**: Caches built devcontainer images in a local container registry deployed in the cluster for faster workspace startup.

**Why it's important**: Reduces workspace creation time from minutes to seconds by reusing previously built images without external dependencies.

**How it works**:
- Deploys a container registry (e.g., Harbor, Docker Registry, or similar) in `coder` namespace
- Configures automatic periodic cleanup of old/unused images
- Reads registry URL from Kubernetes ConfigMap (`coder-workspace-config`)
- Envbuilder automatically pushes/pulls from local registry
- No authentication required for cluster-internal access (or basic auth if needed)

## 4. Secret Management via 1Password
**What it does**: Injects secrets from 1Password into workspace environment variables.

**Why it's important**: Provides secure access to required credentials without hardcoding or manual configuration.

**How it works**:
- Pulls secrets using 1Password CLI or Kubernetes secrets created by 1Password operator
- Secrets include:
  - `CLAUDE_CODE_OAUTH_TOKEN`: For Claude Code authentication
  - `PERPLEXITY_API_KEY`: For AI research capabilities
  - `HA_TOKEN`: For Home Assistant API access
  - `GH_TOKEN`: Set via Coder external authentication (GitHub OAuth)
- Creates `coder_env` resources to inject into workspace

## 5. GitHub OAuth Integration
**What it does**: Authenticates users with GitHub and provides Git credentials automatically.

**Why it's important**: Enables seamless Git operations without manual token management.

**How it works**:
- Uses Coder external authentication already configured with `primary-github` ID
- Provides access token via `data.coder_external_auth.github`
- Sets `GH_TOKEN` environment variable for CLI tools
- Configures Envbuilder with GitHub credentials for private repository cloning
- GitHub OAuth app already configured in Coder deployment

## 6. Fleet MCP Server Integration
**What it does**: Runs the Fleet MCP server via supervisord to provide task management capabilities to Claude Code.

**Why it's important**: Enables Claude Code to interact with Taskmaster and execute workflows.

**How it works**:
- Starts supervisord in agent startup script
- Supervisord manages `fleet-mcp` process
- Exposes MCP server on `http://127.0.0.1:8000`
- Claude Code module configures MCP client with bearer token authentication
- Healthcheck monitors MCP server availability via `/health` endpoint

## 7. Workspace Presets
**What it does**: Provides predefined system prompts for different AI agent roles (Coder, Operator, Researcher).

**Why it's important**: Tailors AI behavior to specific use cases and workflows.

**How it works**:
- Defines `coder_workspace_preset` resources with role-specific system prompts
- Users select preset when creating workspace
- System prompt configures Claude Code's behavior and focus area

## 8. Resource Management
**What it does**: Allows users to configure CPU, memory, and storage resources for workspaces.

**Why it's important**: Balances resource usage across cluster while providing flexibility for different workload types.

**How it works**:
- `coder_parameter` for CPU (cores), memory (GiB), and workspaces volume size
- Sets Kubernetes resource requests and limits
- Creates PVC with specified storage size
- Default values: 2 CPU, 4 GiB memory, 10 GiB storage

## 9. Coder Tasks Integration
**What it does**: Enables AI agents to execute autonomous tasks within workspaces with proper isolation and reporting.

**Why it's important**: Allows Claude Code and other AI agents to work on tasks asynchronously with full Coder integration.

**How it works**:
- Defines `coder_ai_task` resource linking to Claude Code module
- Claude Code module automatically reports task progress
- Each task runs in isolated workspace environment
- Task sidebar shows workspace apps for monitoring
- Proper task naming via `CLAUDE_CODE_OAUTH_TOKEN` (serves dual purpose for auth and task naming)
- Follows Coder Tasks best practices for template design

## 10. Monitoring and Metadata
**What it does**: Provides workspace metrics and metadata visible in Coder dashboard.

**Why it's important**: Enables users and operators to monitor resource usage and troubleshoot issues.

**How it works**:
- Agent metadata scripts for CPU, RAM, disk, load average, swap usage
- Both container and host metrics available
- Updates at regular intervals (10-60 seconds)
- Metadata block shows workspace image, git URL, cache repo

## 11. Development Inner Loop
**What it does**: Enables rapid iteration on template changes with validation and testing.

**Why it's important**: Reduces development friction and catches errors early.

**How it works**:
1. Make changes to Terraform template
2. Run `terraform validate` to check syntax
3. Push template to Coder with `coder templates push`
4. Create test workspace with `coder create`
5. Monitor workspace startup and app health with `coder list` and `coder apps`
6. Validate logs with `kubectl logs` if needed
7. Delete workspace with `coder delete` if issues found
8. Repeat until working correctly

# User Experience

## User Personas

### 1. Developer
**Goals**:
- Quick workspace creation
- Reliable devcontainer environment
- Access to necessary secrets and tools
- AI assistant integration

**Pain Points**:
- Slow workspace startup times
- Manual credential configuration
- Inconsistent environments

**How This Helps**:
- Local registry caching reduces startup from 5+ minutes to <1 minute
- Automatic secret injection eliminates manual setup
- Kubernetes ensures consistent resource allocation

### 2. DevOps Engineer
**Goals**:
- Efficient cluster resource usage
- Secure credential management
- Monitoring and observability
- Easy template maintenance

**Pain Points**:
- Resource contention and wastage
- Secret sprawl and manual rotation
- Difficult to debug workspace issues

**How This Helps**:
- Kubernetes resource limits prevent overuse
- 1Password integration centralizes secrets
- Coder metadata and Kubernetes logs provide visibility
- Terraform validation catches errors before deployment

### 3. AI Agent (Claude Code)
**Goals**:
- Access to codebase via Fleet MCP
- Execute commands in workspace
- Report task progress via Coder MCP

**Pain Points**:
- Workspace not ready when task starts
- Missing credentials block execution
- Unclear workspace state

**How This Helps**:
- Healthcheck ensures MCP server ready before use
- All required secrets injected automatically
- Coder metadata shows workspace state clearly

## Key User Flows

### Flow 1: Create New Workspace
1. User navigates to Coder web UI at `https://coder.enigma.vgijssel.nl`
2. Clicks "Create Workspace"
3. Selects `coder-devcontainer-kubernetes` template
4. Chooses workspace preset (Coder/Operator/Researcher)
5. Configures resources (CPU, memory, storage) or uses defaults
6. Enters AI prompt (optional)
7. Clicks "Create"
8. Waits for workspace to provision (1-5 minutes first time, <1 minute with cache)
9. Opens VS Code Desktop or Web Terminal
10. Starts working with full environment ready

### Flow 2: Developer Iterates on Template
1. Developer modifies `libs/coder-devcontainer-kubernetes/main.tf`
2. Runs `terraform validate` to check syntax
3. Runs `trunk fmt` to format code
4. Runs `trunk check` to lint
5. Commits changes to feature branch
6. Runs `coder templates push coder-devcontainer-kubernetes --directory libs/coder-devcontainer-kubernetes` to deploy to test instance
7. Creates test workspace with `coder create test-workspace --template coder-devcontainer-kubernetes`
8. Monitors startup with `coder list` and checks app health
9. If issues: checks logs with `coder ssh test-workspace -- supervisorctl status` or `kubectl logs -n coder <pod-name>`
10. Deletes workspace with `coder delete test-workspace`
11. Repeats steps 1-10 until working
12. Creates PR for review

### Flow 3: AI Agent Executes Tasks
1. AI agent receives task from Task Master
2. Agent validates Coder workspace is running and healthy
3. Agent checks Fleet MCP server health via `/health` endpoint
4. Agent executes task using MCP tools and workspace shell
5. Agent reports progress via Coder MCP task reporting
6. Agent validates results and marks task complete
7. If errors: agent logs diagnostics and reports failure

## UI/UX Considerations

### Coder Web UI
- Template selection shows clear description
- Workspace presets have descriptive names and explanations
- Resource parameters have sensible defaults
- AI prompt field is optional but visible
- Workspace creation progress shows clear stages
- App healthchecks display status (healthy/unhealthy/starting)

### VS Code Integration
- Workspace opens directly in VS Code Desktop
- All extensions from devcontainer.json pre-installed
- Claude Code accessible via `/` command
- Terminal has all required environment variables set

### Error Messages
- Clear indication when workspace fails to start
- Links to logs for troubleshooting
- Suggestions for common issues (e.g., resource constraints)

</context>

<PRD>
# Technical Architecture

## System Components

### 1. Terraform Providers
```hcl
terraform {
  required_providers {
    coder = {
      source  = "coder/coder"
      version = "~> 2.0"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
    envbuilder = {
      source = "coder/envbuilder"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    onepassword = {
      source  = "1Password/onepassword"
      version = "~> 2.1"
    }
  }
}

provider "coder" {}
provider "kubernetes" {
  # Authenticate via Coder-specific ServiceAccount - Coder host is running inside Kubernetes
}
provider "envbuilder" {}
provider "random" {}
provider "onepassword" {
  # Connect to 1Password Connect server running in apps/coder-prod cluster
  # Configured via environment variables (set by Coder deployment):
  #   OP_CONNECT_HOST - URL of Connect server (e.g., http://onepassword-connect.1password.svc.cluster.local:8080)
  #   OP_CONNECT_TOKEN - Connect token from op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential
}
```

**Coder Provider**: Authenticates via Coder-specific ServiceAccount running in Kubernetes
**Kubernetes Provider**: Uses in-cluster authentication (no explicit config needed)
**Envbuilder Provider**: Detects cached images and manages devcontainer builds
**Random Provider**: Generates bearer tokens for Fleet MCP authentication
**1Password Provider**: Connects to 1Password Connect server running in `apps/coder-prod` cluster to retrieve secrets from vault

### 2. Data Sources

#### Coder Data Sources
- `coder_provisioner`: Provides provisioner architecture and OS info
- `coder_workspace`: Workspace metadata (id, name, start_count, access_url)
- `coder_workspace_owner`: User info (name, email, full_name)
- `coder_external_auth.github`: GitHub OAuth token (already configured with ID `primary-github`)

#### Kubernetes Data Sources
- `kubernetes_config_map_v1.coder_workspace_config`: Workspace configuration (in `coder` namespace)
  - `registry_url`: Local image registry URL for caching

#### Coder Parameters
- `cpu`: CPU cores (1-99999, default 2)
- `memory`: Memory in GiB (1-99999, default 4)
- `workspaces_volume_size`: Storage in GiB (1-99999, default 10)
- `devcontainer_builder`: Envbuilder image (default: `ghcr.io/coder/envbuilder:latest`)
- `git_branch`: Git branch to checkout (default: "main")
- `system_prompt`: AI system prompt (from preset)
- `ai_prompt`: User-provided AI task prompt

### 3. Infrastructure Resources

#### Kubernetes Resources
```
Namespace: coder-workspace (workspaces run here)
Namespace: coder (Coder server and shared resources)

PersistentVolumeClaim (coder-{workspace_id}-workspaces)
├── Namespace: coder-workspace
├── Storage: {workspaces_volume_size}Gi (default 10Gi)
├── AccessModes: ReadWriteOnce
└── StorageClass: kubevirt (default, uses csi.kubevirt.io)

Deployment (coder-{workspace_id})
├── Namespace: coder-workspace
├── Replicas: 1 (when workspace started)
├── Strategy: Recreate
├── Container: dev
│   ├── Image: {cached_image or envbuilder_image}
│   ├── Resources:
│   │   ├── Requests: 250m CPU, 512Mi memory
│   │   └── Limits: {cpu} cores (default 2), {memory}Gi memory (default 4)
│   └── Volume Mounts:
│       └── /workspaces -> workspaces PVC
└── Affinity: Anti-affinity to spread workspaces across nodes
```

#### Coder Resources
```
coder_agent.main
├── arch: {provisioner.arch}
├── os: linux
├── startup_script: Start supervisord, wait for port 9001
├── dir: /workspaces/setup
├── env: GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL, GIT_COMMITTER_NAME, GIT_COMMITTER_EMAIL
└── metadata: CPU, RAM, disk, load, swap metrics

coder_env resources
├── GH_TOKEN (from GitHub external auth: primary-github)
├── FLEET_MCP_AUTH_TOKEN
├── FLEET_MCP_AUTH_ENABLED
├── FLEET_MCP_TASKFILE
├── CLAUDE_CODE_OAUTH_TOKEN (dual purpose: auth + task naming)
├── PERPLEXITY_API_KEY
└── HA_TOKEN

coder_ai_task resource
└── app_id: Links to Claude Code module for task reporting

coder_app.fleet_mcp
├── url: http://127.0.0.1:8000
├── healthcheck: /health endpoint
└── share: owner

Modules
├── claude-code: AI assistant integration
├── vscode: VS Code Desktop integration
├── git-commit-signing: SSH commit signing
└── coder-login: CLI authentication
```

### 4. Data Models

#### Envbuilder Environment Variables
```bash
CODER_AGENT_TOKEN={agent.token}
CODER_AGENT_URL={workspace.access_url} # with docker gateway substitution
ENVBUILDER_INIT_SCRIPT={agent.init_script}
ENVBUILDER_PUSH_IMAGE=true
ENVBUILDER_GIT_USERNAME=oauth2 (if GitHub connected)
ENVBUILDER_GIT_PASSWORD={github.access_token}
ENVBUILDER_WORKSPACE_FOLDER=/workspaces/setup
ENVBUILDER_DEVCONTAINER_DIR=.devcontainer/beta # or configurable
ENVBUILDER_CACHE_REPO={local_registry_url}/coder-cache
```

#### Workspace Configuration (from ConfigMap)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coder-workspace-config
  namespace: coder
data:
  registry_url: "registry.coder.svc.cluster.local:5000"
```

#### Supervisord Configuration
```ini
[supervisord]
nodaemon=false
logfile=/workspaces/setup/logs/supervisor/supervisord.log
pidfile=/workspaces/setup/logs/supervisor/supervisord.pid
user=coder

[program:fleet-mcp]
directory=/workspaces/setup
command=/workspaces/setup/bin/direnv exec . nx run --tui=false fleet-mcp:server
autostart=true
autorestart=true
stdout_logfile=/workspaces/setup/logs/fleet-mcp/server.log

[inet_http_server]
port=127.0.0.1:9001
```

## APIs and Integrations

### External APIs
1. **GitHub API**: OAuth authentication for Git operations (already configured)
2. **Local Image Registry API**: Pull/push devcontainer images (cluster-internal)
3. **1Password Connect API**: Retrieve secrets via Connect server (cluster-internal)
4. **Coder API**: Workspace management, template deployment, task reporting
5. **Kubernetes API**: Pod/PVC management, logs retrieval

### Internal Integrations
1. **Fleet MCP Server**: HTTP server on port 8000, MCP protocol
2. **Supervisord**: Process manager on port 9001, XML-RPC protocol
3. **Coder Agent**: Communicates with Coder control plane via WebSocket
4. **Envbuilder**: Builds devcontainer during workspace startup
5. **1Password Connect Server**: REST API on port 8080 for secret retrieval (deployed in apps/coder-prod)

## Infrastructure Requirements

### Kubernetes Cluster Requirements (CozyStack)
- **Namespaces**:
  - `coder`: Coder server and shared resources (registry, ConfigMap)
  - `coder-workspace`: Workspace deployments and PVCs
- **Storage Class**: `kubevirt` (default) - Uses CSI driver `csi.kubevirt.io` from CozyStack
  - Supports ReadWriteOnce PVCs
  - Reclaim policy: Delete
  - Volume expansion: Enabled
  - Gets persistent storage from parent `enigma-cluster` via KubeVirt CSI driver
- **ConfigMap**: `coder-workspace-config` in `coder` namespace with registry URL (deployed via FluxCD)
- **1Password Connect Server**: Already running in `apps/coder-prod` cluster (deployed via FluxCD)
- **Connect Token**: Retrieved from 1Password vault `setup-coder-prod`
  - Path: `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential`
  - Must be set as `OP_CONNECT_TOKEN` environment variable for Coder deployment
- **Secrets**: Retrieved via 1Password Terraform provider connecting to Connect server
  - Vault: `setup-devenv`
  - Items: `claude-code`, `perplexity`, `haos-api`
  - Provider uses environment variables: `OP_CONNECT_HOST`, `OP_CONNECT_TOKEN`

### Local Image Registry Requirements
- **Deployment**: Container registry (Harbor, Docker Registry, or similar) in `coder` namespace
- **Service**: ClusterIP service exposing registry on port 5000
- **Storage**: PVC for registry data persistence
- **Cleanup**: Automatic periodic cleanup of old/unused images (via CronJob or registry feature)
- **Access**: No authentication required for cluster-internal access (or basic auth if needed)

### Coder Requirements
- **External Auth**: GitHub OAuth already configured with ID `primary-github`
- **Version**: Coder v2.x deployed via Helm chart in `apps/coder-prod`
- **Database**: PostgreSQL (configured in Coder Helm release)
- **Tasks Feature**: Enabled for AI agent automation

### Network Requirements
- **Ingress**: NGINX ingress controller for Coder UI
- **DNS**: `coder.enigma.vgijssel.nl` and `*.coder.enigma.vgijssel.nl`
- **Internal**: Pods can reach Kubernetes API and local registry service

# Development Roadmap

## Phase 0: Infrastructure Setup - Local Registry and Namespaces
**Goal**: Deploy local image registry and prepare cluster infrastructure via FluxCD.

**Scope**:
1. Create FluxCD Kustomization for `coder-workspace` namespace in `apps/coder-prod/`:
   - Create `namespace-coder-workspace.yaml` manifest
   - Add to `kustomization.yaml` resources list
   - Commit and push to trigger FluxCD reconciliation
2. Research and select image registry solution (Harbor, Docker Registry v2, or other)
3. Create FluxCD manifests for image registry in `apps/coder-prod/`:
   - `pvc-registry.yaml`: PVC for registry storage (kubevirt storage class)
   - `deployment-registry.yaml`: Deployment with registry container
   - `service-registry.yaml`: ClusterIP Service on port 5000
   - Configure registry for insecure access (cluster-internal) or basic auth
4. Create FluxCD manifest for automatic image cleanup:
   - Option A: `cronjob-registry-gc.yaml` for Docker Registry garbage collection
   - Option B: Use registry-specific cleanup features (e.g., Harbor retention policies)
5. Create ConfigMap manifest `configmap-workspace-config.yaml` in `apps/coder-prod/`:
   - Key: `registry_url`
   - Value: `registry.coder.svc.cluster.local:5000` (or appropriate service DNS)
6. Update `apps/coder-prod/kustomization.yaml` to include all new manifests
7. Commit, push, and wait for FluxCD to reconcile
8. Test registry accessibility from `coder-workspace` namespace
9. Validate 1Password Connect server is running and accessible
10. Add 1Password Connect environment variables to Coder deployment via FluxCD:
    - Check if `apps/coder-prod/helmrelease-coder.yaml` already has `OP_CONNECT_HOST` and `OP_CONNECT_TOKEN`
    - If not present, create 1Password secret reference in `apps/coder-prod/`:
      - Create or update `helmrelease-1password-secrets.yaml` or similar file
      - Add `OnePasswordItem` for Connect token: `vaults/setup-coder-prod/items/kzsqg7xbgiz7jbvxksugadymne`
      - This creates Kubernetes Secret `onepassword-connect-token` in `coder` namespace
    - Edit `apps/coder-prod/helmrelease-coder.yaml` to add to `spec.values.coder.env`:
      ```yaml
      - name: OP_CONNECT_HOST
        value: "http://onepassword-connect.1password.svc.cluster.local:8080"
      - name: OP_CONNECT_TOKEN
        valueFrom:
          secretKeyRef:
            name: onepassword-connect-token
            key: token
      ```
    - Commit, push, and wait for FluxCD to reconcile and Coder pod to restart
11. Validate GitHub OAuth is configured (check `coder external-auth list` shows `primary-github`)

**Acceptance Criteria**:
- ✅ `coder-workspace` namespace created via FluxCD
- ✅ Registry deployed via FluxCD and accessible via service DNS
- ✅ Registry PVC created with `kubevirt` storage class
- ✅ ConfigMap created via FluxCD with registry URL
- ✅ Registry can be pushed to and pulled from
- ✅ Cleanup mechanism deployed via FluxCD
- ✅ 1Password Connect server validated (already running from apps/coder-prod)
- ✅ Coder deployment updated via FluxCD with 1Password Connect environment variables:
  - 1Password secret `onepassword-connect-token` created in `coder` namespace
  - Secret references `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential`
  - `OP_CONNECT_HOST` added to Coder Helm values
  - `OP_CONNECT_TOKEN` added to Coder Helm values via secretKeyRef
  - Coder pod restarted and healthy with new env vars
  - Test: `kubectl exec -n coder <coder-pod> -- env | grep OP_CONNECT` shows variables
- ✅ GitHub external auth confirmed working
- ✅ All changes committed to Git and reconciled by FluxCD

## Phase 1: Foundation - Basic Kubernetes Template
**Goal**: Create minimal working Kubernetes-based Coder template without advanced features.

**Scope**:
1. Create `libs/coder-devcontainer-kubernetes` directory structure
2. Create `moon.yml` for Moon build system integration
3. Create `main.tf` with Terraform providers (coder, kubernetes, random, onepassword)
4. Define Coder data sources (provisioner, workspace, workspace_owner)
5. Verify Coder deployment has 1Password Connect environment variables set:
   - `OP_CONNECT_HOST`: URL of Connect server (e.g., `http://onepassword-connect.1password.svc.cluster.local:8080`)
   - `OP_CONNECT_TOKEN`: From `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential`
6. Define 1Password data sources for secrets (vault: setup-devenv)
7. Define basic Coder parameters with defaults:
   - `cpu`: 2 cores
   - `memory`: 4 GiB
   - `workspaces_volume_size`: 10 GiB
   - `git_branch`: "main"
8. Set `variable.namespace` default to `"coder-workspace"`
9. Create PersistentVolumeClaim for `/workspaces` directory in `coder-workspace` namespace:
   - Use storage class `kubevirt` (default)
   - Access mode: ReadWriteOnce
   - Storage size from parameter (default 10Gi)
10. Create Deployment with single container using hardcoded image (e.g., `codercom/enterprise-base:ubuntu`)
11. Create coder_agent resource with minimal startup script
12. Add basic metadata blocks (CPU, RAM, disk)
13. Test: Validate template creates workspace successfully in `coder-workspace` namespace
14. Verify 1Password provider can connect to Connect server and retrieve test secret

**Acceptance Criteria**:
- ✅ Template validates with `terraform validate`
- ✅ Template pushes to Coder with `coder templates push`
- ✅ 1Password provider successfully connects to Connect server
- ✅ 1Password provider can retrieve test secret from vault
- ✅ Workspace starts successfully
- ✅ Coder agent connects and reports healthy
- ✅ PVC is created with `kubevirt` storage class and bound successfully
- ✅ PVC is mounted to `/workspaces` in workspace container
- ✅ Workspace can be stopped and restarted (data persists on kubevirt PVC)

## Phase 2: Envbuilder Integration - Devcontainer Support
**Goal**: Replace hardcoded image with Envbuilder for devcontainer support.

**Scope**:
1. Add `envbuilder` provider to Terraform configuration
2. Add `git_branch` parameter (default: "main") to allow testing with feature branches
3. Define `local.git_branch` from parameter value
4. Define `local.repo_url` variable: `https://github.com/vgijssel/setup.git#refs/heads/${local.git_branch}`
5. Define `local.devcontainer_builder_image` with default `ghcr.io/coder/envbuilder:latest`
6. Add `devcontainer_builder` parameter to allow user overrides
7. Create `local.envbuilder_env` map with required environment variables:
   - `CODER_AGENT_TOKEN`
   - `CODER_AGENT_URL`
   - `ENVBUILDER_INIT_SCRIPT`
   - `ENVBUILDER_WORKSPACE_FOLDER=/workspaces/setup`
   - `ENVBUILDER_DEVCONTAINER_DIR=.devcontainer/beta` (or TBD)
   - `ENVBUILDER_GIT_URL=${local.repo_url}` (includes branch from parameter)
8. Create `envbuilder_cached_image` resource WITHOUT registry initially (use `insecure = false`, `cache_repo = ""`)
9. Update Deployment to use `envbuilder_cached_image` as container image
10. Add dynamic `env` blocks in Deployment using `envbuilder_cached_image.env_map`
11. Test: Validate workspace builds devcontainer from repository using specified branch

**Acceptance Criteria**:
- ✅ Envbuilder builds devcontainer on first workspace start
- ✅ Workspace uses branch specified in `git_branch` parameter
- ✅ Workspace has correct devcontainer environment
- ✅ Build logs visible in Coder startup logs
- ✅ Subsequent starts reuse built image (via Envbuilder cache)
- ✅ Testing with feature branch works correctly (change git_branch parameter)

## Phase 3: Local Registry Cache Integration - Fast Startup
**Goal**: Enable local registry caching for significantly faster workspace creation.

**Scope**:
1. Add `kubernetes_config_map_v1.coder_workspace_config` data source:
   - Namespace: `coder`
   - Name: `coder-workspace-config`
2. Create local to extract ConfigMap value:
   - `local.cache_repo = data.kubernetes_config_map_v1.coder_workspace_config.data["registry_url"]`
3. Update `envbuilder_cached_image` resource to use local registry cache:
   - Set `cache_repo = local.cache_repo`
   - Set `insecure = true` (for local registry) OR configure TLS if registry uses certs
4. Add `ENVBUILDER_PUSH_IMAGE=true` to `local.envbuilder_env`
5. Add `ENVBUILDER_CACHE_REPO` to environment variables
6. Add metadata block showing cache repo information
7. Test: Validate first workspace pushes to local registry, second workspace pulls from cache

**Acceptance Criteria**:
- ✅ First workspace build pushes image to local registry
- ✅ Second workspace start pulls cached image from registry (much faster)
- ✅ No authentication errors (cluster-internal access works)
- ✅ Metadata shows local registry URL

**Validation Steps**:
1. Delete any existing workspaces
2. Create new workspace, monitor startup time and logs
3. Verify local registry contains pushed image (check registry UI or API)
4. Delete workspace, create new one
5. Monitor startup time (should be <1 minute vs 5+ minutes)
6. Verify logs show cache hit

## Phase 4: Secret Management - 1Password Integration
**Goal**: Inject required secrets from 1Password into workspace environment.

**Scope**:
1. Verify 1Password Connect server is accessible from Coder host:
   - Check Connect server endpoint: `http://onepassword-connect.1password.svc.cluster.local:8080`
   - Verify Connect token from `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential` is set in Coder environment as `OP_CONNECT_TOKEN`
   - Verify `OP_CONNECT_HOST` is set in Coder environment
2. Confirm 1Password provider automatically uses environment variables (no explicit configuration needed)
3. Define `data.onepassword_vault` for `setup-devenv` vault with postcondition validation
4. Define `data.onepassword_item` resources for each secret:
   - `claude-code`: For `CLAUDE_CODE_OAUTH_TOKEN` (dual purpose: auth + task naming)
   - `perplexity`: For `PERPLEXITY_API_KEY`
   - `haos-api`: For `HA_TOKEN`
5. Extract credentials into locals with proper error handling
6. Create `coder_env` resources for each secret
7. Test: Validate environment variables are set correctly in workspace

**Acceptance Criteria**:
- ✅ 1Password Connect server accessible from Coder host
- ✅ Provider configured with Connect server URL and token
- ✅ 1Password vault `setup-devenv` validated with postcondition
- ✅ All required secrets retrieved from 1Password via Terraform provider
- ✅ Secrets injected into workspace environment as `coder_env` resources
- ✅ `CLAUDE_CODE_OAUTH_TOKEN` used for both Claude Code auth and Coder task naming
- ✅ Secrets not visible in Terraform state output or logs
- ✅ Workspace can use secrets for API calls

## Phase 5: GitHub OAuth - Git Authentication
**Goal**: Enable GitHub authentication for Git operations using already-configured external auth.

**Scope**:
1. Validate Coder external auth is configured:
   - Verify `coder external-auth list` shows `primary-github`
   - Confirm users can connect GitHub accounts in Coder UI
2. Add `data.coder_external_auth.github` with `id = "primary-github"` and `optional = false` (assume always available)
3. Create `coder_env.gh_token` resource to set `GH_TOKEN` environment variable
4. Add GitHub credentials to Envbuilder environment:
   - `ENVBUILDER_GIT_USERNAME=oauth2`
   - `ENVBUILDER_GIT_PASSWORD={github.access_token}`
5. Add Git configuration to agent environment:
   - `GIT_AUTHOR_NAME`
   - `GIT_AUTHOR_EMAIL`
   - `GIT_COMMITTER_NAME`
   - `GIT_COMMITTER_EMAIL`
6. Test: Validate workspace can clone private repositories and push commits

**Acceptance Criteria**:
- ✅ Users can connect GitHub account in Coder UI
- ✅ Workspace clones private repositories without manual authentication
- ✅ Git commits have correct author information
- ✅ `gh` CLI works without manual login

## Phase 6: Fleet MCP Integration - AI Task Management
**Goal**: Enable Claude Code to interact with Task Master via Fleet MCP server.

**Scope**:
1. Copy `supervisord.conf` from `libs/coder-devcontainer` to `libs/coder-devcontainer-kubernetes`
2. Research: Validate supervisord is available in devcontainer image
   - If not, document devcontainer.json requirement in appendix
3. Update `coder_agent.main.startup_script` to:
   - Start supervisord with configuration file
   - Wait for supervisord to be available on port 9001
   - Optionally verify fleet-mcp service is running
4. Create `random_id.fleet_mcp_bearer_token` resource
5. Create `coder_env` resources for Fleet MCP configuration:
   - `FLEET_MCP_AUTH_TOKEN`
   - `FLEET_MCP_AUTH_ENABLED=true`
   - `FLEET_MCP_TASKFILE=/workspaces/setup/libs/coder-devcontainer-kubernetes/Taskfile.yml` (or appropriate path)
6. Copy `Taskfile.yml` from `libs/coder-devcontainer` if needed
7. Create `coder_app.fleet_mcp` resource:
   - URL: `http://127.0.0.1:8000`
   - Healthcheck: `/health` endpoint
   - Share: owner only
8. Test: Validate Fleet MCP server starts and is accessible

**Acceptance Criteria**:
- ✅ Supervisord starts on workspace creation
- ✅ Fleet MCP server runs and passes healthcheck
- ✅ Bearer token authentication works
- ✅ Coder app shows Fleet MCP as healthy
- ✅ Claude Code can connect to MCP server

## Phase 7: Claude Code Module - AI Assistant Integration
**Goal**: Integrate Claude Code module with Fleet MCP and task reporting following Coder Tasks best practices.

**Scope**:
1. Add `module.claude-code` with pinned version (e.g., `4.2.8`)
2. Configure module parameters:
   - `agent_id = coder_agent.main.id`
   - `workdir = "/workspaces/setup"`
   - `ai_prompt = coder_parameter.ai_prompt.value`
   - `system_prompt = coder_parameter.system_prompt.value`
   - `install_claude_code = false` (assume pre-installed in devcontainer)
   - `order = 999`
   - `cli_app = true`
   - `continue = true`
   - `report_tasks = true` (enables automatic task reporting)
3. Configure `post_install_script` to:
   - Wait for Fleet MCP server to be available
   - Remove existing fleet-mcp MCP server configuration (idempotent)
   - Add fleet-mcp MCP server with bearer token authentication
4. Add `resource "coder_ai_task" "task"` with `app_id = module.claude-code.task_app_id` to enable Coder Tasks
5. Verify `CLAUDE_CODE_OAUTH_TOKEN` is set (serves dual purpose for auth and task naming)
6. Test: Validate Claude Code can use Fleet MCP for task management
7. Test: Validate Coder Tasks tab shows workspace and task reporting works

**Acceptance Criteria**:
- ✅ Claude Code installed and accessible via `claude` command
- ✅ MCP server configuration is idempotent
- ✅ Claude Code can execute MCP tools
- ✅ Task reporting works correctly (appears in Tasks tab)
- ✅ AI prompt and system prompt are applied
- ✅ `coder_ai_task` resource properly configured
- ✅ Tasks have meaningful names (not random UUIDs) thanks to CLAUDE_CODE_OAUTH_TOKEN

## Phase 8: Workspace Presets - Role-Specific Prompts
**Goal**: Provide predefined workspace configurations for different use cases.

**Scope**:
1. Copy workspace preset definitions from reference template
2. Create `data.coder_workspace_preset.coder` (default):
   - Name: "Coder"
   - System prompt: Developer-focused instructions
3. Create `data.coder_workspace_preset.operator`:
   - Name: "Operator"
   - System prompt: SRE/incident response instructions
4. Create `data.coder_workspace_preset.researcher`:
   - Name: "Researcher"
   - System prompt: Research and analysis instructions
5. Ensure `system_prompt` parameter uses preset values
6. Test: Validate presets appear in Coder UI and apply correct prompts

**Acceptance Criteria**:
- ✅ Three presets available in workspace creation UI
- ✅ Each preset has descriptive name and correct system prompt
- ✅ "Coder" preset is default
- ✅ Selecting preset applies correct behavior in Claude Code

## Phase 9: Additional Coder Modules - Enhanced Functionality
**Goal**: Add supporting Coder modules for improved developer experience.

**Scope**:
1. Add `module.vscode` for VS Code Desktop integration:
   - Version: `1.1.1`
   - Folder: `/workspaces/setup`
   - Order: 1
2. Add `module.git-commit-signing` for SSH commit signing:
   - Version: `1.0.31`
3. Add `module.coder-login` for CLI authentication:
   - Version: `1.1.0`
   - Sets `CODER_SESSION_TOKEN` and `CODER_URL` automatically
4. Optional: Add `module.code-server` if web-based IDE needed
5. Test: Validate each module functions correctly

**Acceptance Criteria**:
- ✅ VS Code Desktop opens workspace correctly
- ✅ Commits are signed with SSH key
- ✅ `coder` CLI works without manual login
- ✅ All modules report healthy in Coder UI

## Phase 10: Metadata and Monitoring - Observability
**Goal**: Provide comprehensive workspace metrics and debugging information.

**Scope**:
1. Add agent metadata blocks for:
   - CPU usage (container)
   - RAM usage (container)
   - Workspaces disk usage (path: `/workspaces`)
   - CPU usage (host)
   - Memory usage (host)
   - Load average (host, scaled by number of cores)
   - Swap usage (host)
2. Create `coder_metadata.container_info` showing:
   - Workspace image (from envbuilder_cached_image)
   - Git URL
   - Cache repo (local registry)
3. Test: Validate metrics appear correctly in Coder dashboard

**Acceptance Criteria**:
- ✅ All metrics update at appropriate intervals
- ✅ Host metrics show cluster node information
- ✅ Container metadata shows correct image and URLs
- ✅ Metrics help debug resource issues

## Phase 11: Resource Management - Pod Configuration
**Goal**: Optimize pod configuration for stability and efficiency.

**Scope**:
1. Configure resource requests and limits:
   - Requests: 250m CPU, 512Mi memory (ensures scheduling)
   - Limits: User-configured CPU and memory (prevents overuse)
   - Default limits: 2 CPU, 4Gi memory
2. Add pod anti-affinity to spread workspaces across nodes:
   - Preferred (weight 1), not required
   - Topology key: `kubernetes.io/hostname`
   - Label selector: `app.kubernetes.io/name=coder-workspace`
3. Ensure all resources deployed to `coder-workspace` namespace
4. Verify security context is appropriate (may need adjustments)
5. Test: Validate resource limits are enforced and pods spread correctly

**Acceptance Criteria**:
- ✅ Pods scheduled based on resource availability
- ✅ Resource limits prevent runaway processes
- ✅ Multiple workspaces spread across cluster nodes
- ✅ Security context allows required operations

## Phase 12: Testing and Validation - Inner Loop
**Goal**: Establish testing workflow and validate all functionality.

**Scope**:
1. Document testing procedure:
   - Pre-flight: `terraform validate`, `trunk fmt`, `trunk check`
   - Deploy: `coder templates push`
   - Create: `coder create test-ws --template coder-devcontainer-kubernetes`
   - Monitor: `coder list`, `coder apps --workspace test-ws`
   - Debug: `coder ssh test-ws -- <command>`, `kubectl logs -n coder <pod>`
   - Cleanup: `coder delete test-ws`
2. Create test checklist covering:
   - ✅ Workspace creation and deletion
   - ✅ Devcontainer build (first time)
   - ✅ Local registry cache usage (second time)
   - ✅ All secrets accessible
   - ✅ GitHub authentication works
   - ✅ Fleet MCP server healthy
   - ✅ Claude Code functional
   - ✅ All apps show healthy status
   - ✅ PVC data persists across restarts
   - ✅ Resource limits enforced
3. Execute full test suite and document results
4. Fix any issues found during testing

**Acceptance Criteria**:
- ✅ All test cases pass
- ✅ Testing procedure documented in README or CLAUDE.md
- ✅ Known issues documented with workarounds
- ✅ Template ready for production use

## Phase 13: Documentation and Migration - Handoff
**Goal**: Document the new template and provide migration guide.

**Scope**:
1. Create or update `libs/coder-devcontainer-kubernetes/README.md`:
   - Overview and purpose
   - Prerequisites (Kubernetes cluster with KubeVirt CSI, 1Password, local registry, etc.)
   - Usage instructions
   - Parameter descriptions
   - Troubleshooting guide
2. Create or update `libs/coder-devcontainer-kubernetes/CLAUDE.md`:
   - AI-specific instructions
   - Development workflow
   - Testing procedures
   - Common commands
3. Create or update `libs/coder-devcontainer-kubernetes/AGENTS.md`:
   - Architecture overview
   - Component descriptions
   - Integration points
4. Create migration guide from `libs/coder-devcontainer` to `libs/coder-devcontainer-kubernetes`
5. Update Moon build configuration (`moon.yml`) if needed
6. Add to main CLAUDE.md or project documentation

**Acceptance Criteria**:
- ✅ Documentation is clear and comprehensive
- ✅ Users can create workspaces without assistance
- ✅ Developers can modify template confidently
- ✅ Migration path is clear for existing users

# Logical Dependency Chain

The development phases must be executed in order due to these dependencies:

## Foundation Dependencies
1. **Phase 1 (Foundation)** → All other phases
   - Establishes basic Terraform structure and Kubernetes integration
   - Validates cluster access and PVC functionality
   - Provides baseline for all subsequent features

## Build System Dependencies
2. **Phase 1** → **Phase 2 (Envbuilder)** → **Phase 3 (Local Registry Cache)**
   - Phase 2 requires working Kubernetes deployment from Phase 1
   - Phase 3 requires Envbuilder integration from Phase 2
   - Local registry caching only makes sense once devcontainer builds are working

## Authentication Dependencies
3. **Phase 4 (Secrets)** + **Phase 5 (GitHub OAuth)** → **Phase 6 (Fleet MCP)**
   - Fleet MCP requires secrets for authentication
   - Git operations in workspace require GitHub OAuth
   - Can be developed in parallel but both needed for Phase 6

## AI Integration Dependencies
4. **Phase 6 (Fleet MCP)** → **Phase 7 (Claude Code)** → **Phase 8 (Presets)**
   - Claude Code module requires Fleet MCP server running
   - Workspace presets require Claude Code module configured
   - Must be sequential

## Enhancement Dependencies
5. **Phase 7** → **Phase 9 (Additional Modules)** + **Phase 10 (Metadata)** + **Phase 11 (Resources)**
   - These can be developed in parallel
   - All require basic workspace functionality from Phase 7
   - Can be reordered based on priority

## Validation Dependencies
6. **All Previous Phases** → **Phase 12 (Testing)** → **Phase 13 (Documentation)**
   - Testing validates all integrated features
   - Documentation captures final implementation
   - Must be last phases

## Recommended Development Order
For fastest path to usable workspace:

### Sprint 1: Infrastructure and Basic Functionality (Phases 0-3)
- Deploy local image registry with cleanup
- Get workspace running in Kubernetes in `coder-workspace` namespace
- Enable devcontainer builds
- Optimize with local registry caching
- **Goal**: Functional workspace with fast startup

### Sprint 2: Authentication (Phases 4-5)
- Add secrets management
- Enable GitHub OAuth
- **Goal**: Workspace can access required services

### Sprint 3: AI Integration (Phases 6-8)
- Fleet MCP server
- Claude Code module with Coder Tasks support
- Workspace presets
- **Goal**: AI-powered development environment with task automation

### Sprint 4: Polish (Phases 9-11)
- Additional modules
- Monitoring and metadata
- Resource optimization
- **Goal**: Production-ready template

### Sprint 5: Delivery (Phases 12-13)
- Comprehensive testing
- Complete documentation
- **Goal**: Documented, validated, ready for users

# Risks and Mitigations

## Risk 1: PVC Storage Class Incompatibility
**Risk**: ~~The Kubernetes cluster may not support the required storage class or PVC access modes.~~ **RESOLVED**

**Status**: ✅ **Mitigated** - Storage class validated and compatible.

**Findings**:
- Storage class `kubevirt` (default) available with provisioner `csi.kubevirt.io`
- Supports ReadWriteOnce access mode (required for workspaces)
- Uses KubeVirt CSI driver to get persistent storage from parent `enigma-cluster`
- Volume expansion enabled for future resizing needs

**Remaining Validation**:
1. **Namespace Existence**: Verify `coder` and `coder-workspace` namespaces exist
   ```bash
   kubectl get namespace coder coder-workspace
   ```
2. **PVC Test**: Test actual PVC creation in `coder-workspace` namespace during Phase 1
3. **Performance**: Monitor PVC creation time and I/O performance during testing

**Detection**: Phase 1 testing will validate PVC creation and binding work correctly.

## Risk 2: Local Registry Access Failure
**Risk**: Local image registry may not be accessible from `coder-workspace` namespace or authentication may fail.

**Impact**: High - Workspaces cannot cache images, resulting in 5+ minute startup times.

**Likelihood**: Low - Cluster-internal access is straightforward.

**Mitigation**:
1. **Network Testing**: Verify registry service DNS resolution from `coder-workspace` namespace
   ```bash
   kubectl run -n coder-workspace test-dns --rm -it --image=busybox -- nslookup registry.coder.svc.cluster.local
   ```
2. **Registry Testing**: Test push/pull operations from test pod
3. **TLS Configuration**: If using TLS, ensure certificates are trusted or use insecure flag
4. **Fallback**: Disable registry caching temporarily (set `cache_repo = ""` in Phase 2)
5. **Documentation**: Document registry setup and troubleshooting

**Detection**: Phase 3 testing will show registry push/pull failures in Envbuilder logs.

## Risk 3: 1Password Connect Server Access Issues
**Risk**: 1Password Terraform provider may not reach Connect server or authentication may fail.

**Impact**: High - Workspaces cannot start without required secrets.

**Likelihood**: Low - Connect server already deployed via FluxCD in apps/coder-prod.

**Mitigation**:
1. **Validation**: Verify Connect server is running and accessible before Phase 4
   ```bash
   # Check Connect server pod status
   kubectl get pods -n 1password -l app=onepassword-connect

   # Verify Connect server service
   kubectl get svc -n 1password onepassword-connect

   # Test connectivity from Coder namespace
   kubectl run -n coder test-connect --rm -it --image=curlimages/curl -- \
     curl -v http://onepassword-connect.1password.svc.cluster.local:8080/health
   ```
2. **Environment Variables**: Ensure Coder deployment has environment variables set (check `apps/coder-prod/helmrelease-coder.yaml`):
   - `OP_CONNECT_HOST`: `http://onepassword-connect.1password.svc.cluster.local:8080`
   - `OP_CONNECT_TOKEN`: From `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential`
   - If missing, add to Coder Helm values via FluxCD with 1Password secret reference
3. **Network Policy**: Verify no NetworkPolicies block Coder → Connect server traffic
4. **Postconditions**: Use lifecycle postconditions to validate vault and items exist
5. **Error Handling**: Use try() function to provide clear error messages
6. **Fallback**: Document manual secret creation for emergency testing

**Detection**: Phase 4 will fail with clear error message if Connect server is unreachable.

## Risk 4: Devcontainer Build Failures
**Risk**: Envbuilder may fail to build devcontainer due to missing dependencies, network issues, or Dockerfile errors.

**Impact**: High - Workspaces cannot start without successful devcontainer build.

**Likelihood**: Medium - Devcontainer builds are complex and depend on external resources.

**Mitigation**:
1. **Pre-validation**: Test devcontainer build locally with `devcontainer up`
2. **Envbuilder Logs**: Configure verbose logging for debugging
3. **Fallback Image**: Provide known-good base image as fallback
4. **Network Access**: Ensure cluster has egress for package repositories
5. **Build Timeout**: Configure appropriate timeout values (default may be too short)
6. **Ignore Paths**: Configure `ENVBUILDER_IGNORE_PATHS` for problematic files

**Detection**: Phase 2 testing will show build failures in workspace startup logs.

## Risk 5: Fleet MCP Server Startup Race Condition
**Risk**: Claude Code module may try to configure MCP server before it's ready, causing initialization failures.

**Impact**: Medium - AI assistant doesn't work until workspace restarted.

**Likelihood**: Medium - Depends on relative timing of supervisord and module scripts.

**Mitigation**:
1. **Wait Script**: Use `wait-for-it` to ensure port 8000 is listening before MCP config
2. **Health Check**: Verify `/health` endpoint returns 200 before proceeding
3. **Retry Logic**: Add retries to MCP configuration commands
4. **Startup Ordering**: Use Coder agent startup script to control initialization sequence
5. **Timeout Configuration**: Set appropriate timeout values (120 seconds)

**Detection**: Phase 6 testing will show MCP connection failures or missing server errors.

## Risk 6: Terraform State Drift
**Risk**: Manual changes to Kubernetes resources or Coder configuration may cause Terraform state drift.

**Impact**: Low - Template updates may fail or cause unexpected resource changes.

**Likelihood**: Low - Most changes should go through Terraform.

**Mitigation**:
1. **Documentation**: Clearly document that all changes must go through Terraform
2. **State Validation**: Regularly run `terraform plan` to detect drift
3. **Lifecycle Rules**: Use lifecycle blocks to ignore expected drift (e.g., volume labels)
4. **Coder CLI**: Use `coder state pull` to inspect actual state
5. **Recovery**: Document how to recover from state drift

**Detection**: `terraform plan` will show unexpected changes.

## Risk 7: Resource Exhaustion
**Risk**: Users may create workspaces with excessive CPU/memory, exhausting cluster resources.

**Impact**: Medium - Cluster instability, failed workspace scheduling.

**Likelihood**: Medium - Users may not understand resource implications.

**Mitigation**:
1. **Sensible Defaults**: Set defaults to 2 CPU, 2 GiB memory
2. **Validation Rules**: Add max values to parameters (e.g., 8 CPU, 16 GiB memory)
3. **Resource Quotas**: Implement Kubernetes ResourceQuota per namespace/user
4. **LimitRanges**: Configure LimitRange to enforce min/max values
5. **Monitoring**: Alert on high cluster resource usage
6. **Documentation**: Educate users on appropriate resource allocation

**Detection**: Phase 11 testing will reveal resource limit enforcement.

## Risk 8: GitHub OAuth Misconfigured
**Risk**: Coder external authentication for GitHub may not work properly or users may not have connected accounts.

**Impact**: Low - GitHub OAuth already configured, but individual users need to connect.

**Likelihood**: Low - Already validated as configured.

**Mitigation**:
1. **Validation**: Check `coder external-auth list` shows `primary-github` before Phase 5
2. **User Guide**: Document how users connect GitHub accounts in Coder UI
3. **Error Handling**: Make template gracefully handle missing GitHub connection
4. **Manual Auth**: Document how to use SSH keys as alternative
5. **Testing**: Test both with and without GitHub connection

**Detection**: Phase 5 testing will show if external auth works correctly.

## Risk 9: Supervisord Not in Devcontainer Image
**Risk**: Devcontainer image may not include supervisord package, breaking Fleet MCP startup.

**Impact**: High - AI assistant cannot access Task Master tools.

**Likelihood**: Low - Likely included in current devcontainer.

**Mitigation**:
1. **Image Inspection**: Check devcontainer image for supervisord binary
2. **Devcontainer Feature**: Add supervisord via devcontainer features
3. **Dockerfile**: Add supervisord installation to devcontainer Dockerfile
4. **Alternative**: Use systemd or custom process manager
5. **Testing**: Verify supervisord starts correctly in Phase 6

**Detection**: Phase 6 testing will show command not found errors.

## Risk 10: Module Version Incompatibility
**Risk**: Coder modules may have breaking changes or incompatibilities with Coder version.

**Impact**: Medium - Specific features may not work as expected.

**Likelihood**: Low - Modules are versioned and tested.

**Mitigation**:
1. **Version Pinning**: Use exact version numbers for all modules (e.g., `4.2.8` not `~> 4.0`)
2. **Changelog Review**: Review module changelogs before updating versions
3. **Testing Matrix**: Test with current Coder version in cluster
4. **Gradual Rollout**: Test new module versions in dev before prod
5. **Rollback Plan**: Keep previous working versions documented

**Detection**: Phase 7-9 testing will show module errors or unexpected behavior.

# Appendix

## Research Findings

### 1. Kubernetes Cluster Configuration (CozyStack)
**Status**: ✅ **Validated**

**Context**: `apps/coder-prod` runs on CozyStack (local LAN Kubernetes), not AWS.

**Findings**:
1. **Storage Class**: `kubevirt` (default)
   - Provisioner: `csi.kubevirt.io`
   - Reclaim Policy: Delete
   - Volume Binding Mode: Immediate
   - Allow Volume Expansion: true
   - Age: 26 days
2. **How it works**:
   - The coder-prod cluster uses KubeVirt CSI driver to get persistent storage from the parent `enigma-cluster` running on CozyStack
   - See: https://cozystack.io/blog/2024/04/diy-create-your-own-cloud-with-kubernetes-part-3/#csi-driver
3. **Compatibility**: ✅ Supports ReadWriteOnce PVCs required for workspace storage
4. **Volume Expansion**: ✅ Enabled - users can resize workspace volumes if needed

**Actual Output**:
```bash
$ kubectl get storageclass
NAME                 PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
kubevirt (default)   csi.kubevirt.io   Delete          Immediate           true                   26d
```

**PVC Configuration for Templates**:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: coder-{workspace_id}-workspaces
  namespace: coder-workspace
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi  # or from parameter
  storageClassName: kubevirt  # Use default, can be omitted
```

**Remaining Validation**:
```bash
# Verify namespaces exist
kubectl get namespace coder coder-workspace

# Test PVC creation in coder-workspace namespace
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: test-workspace-pvc
  namespace: coder-workspace
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: kubevirt
EOF

# Verify PVC bound
kubectl get pvc -n coder-workspace test-workspace-pvc

# Cleanup
kubectl delete pvc -n coder-workspace test-workspace-pvc
```

### 2. Local Image Registry Configuration
**Status**: Needs Implementation and Validation

**Questions**:
1. Does a local image registry exist in the cluster?
   - Check: `kubectl get deployment -n coder | grep registry`
2. If not, which registry solution should be deployed?
   - Options: Docker Registry v2 (simple), Harbor (feature-rich), other
3. Does the ConfigMap `coder-workspace-config` exist?
   - Check: `kubectl get configmap -n coder coder-workspace-config`
4. What should the registry service DNS be?
   - Suggested: `registry.coder.svc.cluster.local:5000`

**Investigation Commands**:
```bash
# Check for existing registry
kubectl get all -n coder | grep registry

# Check ConfigMap (will likely not exist yet)
kubectl get configmap -n coder coder-workspace-config -o yaml

# Test DNS resolution from coder-workspace namespace
kubectl run -n coder-workspace test-dns --rm -it --image=busybox -- nslookup registry.coder.svc.cluster.local

# After registry deployed, test push/pull
kubectl run -n coder-workspace test-registry --rm -it --image=docker:latest \
  --command -- sh -c "echo 'test' && docker pull registry.coder.svc.cluster.local:5000/test || echo 'Registry not accessible'"
```

### 3. 1Password Connect Server and Terraform Provider
**Status**: Connect server already deployed in `apps/coder-prod`, provider will connect to it

**Connect Server**:
- Deployed via FluxCD in `apps/coder-prod` (helmrelease-1password-operator.yaml)
- Namespace: `1password`
- Service: `onepassword-connect.1password.svc.cluster.local:8080`
- Provides REST API for secret access without direct cloud connection

**Terraform Provider Configuration**:
- Connects to Connect server (not 1Password cloud)
- Requires environment variables (must be set in Coder deployment):
  - `OP_CONNECT_HOST`: URL of Connect server (e.g., `http://onepassword-connect.1password.svc.cluster.local:8080`)
  - `OP_CONNECT_TOKEN`: Connect token retrieved from `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential` in `setup-coder-prod` vault
- Retrieves secrets from `setup-devenv` vault
- Items: `claude-code`, `perplexity`, `haos-api`

**Validation Commands**:
```bash
# Check Connect server deployment
kubectl get pods -n 1password -l app=onepassword-connect
kubectl get svc -n 1password onepassword-connect

# Verify service is healthy
kubectl run -n coder test-connect --rm -it --image=curlimages/curl -- \
  curl http://onepassword-connect.1password.svc.cluster.local:8080/health

# Retrieve Connect token from 1Password (requires 1Password CLI with access to setup-coder-prod vault)
op read "op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential"

# Test from Coder pod (if OP_CONNECT_TOKEN is available)
# The token should be set in Coder deployment environment
curl -H "Authorization: Bearer $OP_CONNECT_TOKEN" \
  http://onepassword-connect.1password.svc.cluster.local:8080/v1/vaults

# Expected: JSON response with vaults including setup-devenv
```

### 4. Coder External Authentication
**Status**: Already Configured (Assumed)

**Investigation Commands**:
```bash
# Validate external auth is configured
coder external-auth list

# Expected output should show:
# primary-github | configured | optional: false

# Test that a user can connect
# (User navigates to Coder UI and connects GitHub account)
```

**Note**: GitHub OAuth is already configured in the Coder deployment. Users just need to connect their individual GitHub accounts via the Coder UI.

### 5. Devcontainer Configuration
**Status**: Needs Confirmation

**Questions**:
1. What is the devcontainer directory path?
   - Check: `.devcontainer/beta` (from reference) or `.devcontainer`?
2. Does the devcontainer include supervisord?
   - Check: `grep -r supervisord .devcontainer/`
3. What base image is used?
   - Check: `.devcontainer/*/Dockerfile` or `devcontainer.json`

**Investigation Steps**:
```bash
# Check devcontainer structure
ls -la .devcontainer/

# Check if beta directory exists
ls -la .devcontainer/beta/

# Check devcontainer.json
cat .devcontainer/beta/devcontainer.json

# Check for supervisord
docker run --rm <devcontainer-image> which supervisord
```

## Technical Specifications

### Kubernetes Labels and Annotations
All resources MUST include these labels for proper tracking:

```yaml
labels:
  app.kubernetes.io/name: coder-workspace
  app.kubernetes.io/instance: coder-{workspace_id}
  app.kubernetes.io/part-of: coder
  com.coder.resource: "true"
  com.coder.workspace.id: {workspace_id}
  com.coder.workspace.name: {workspace_name}
  com.coder.user.id: {user_id}
  com.coder.user.username: {username}

annotations:
  com.coder.user.email: {user_email}
```

### Coder Deployment Environment Variables (Add to helmrelease-coder.yaml)
```yaml
# In apps/coder-prod/helmrelease-coder.yaml, add to spec.values.coder.env:
- name: OP_CONNECT_HOST
  value: "http://onepassword-connect.1password.svc.cluster.local:8080"
- name: OP_CONNECT_TOKEN
  valueFrom:
    secretKeyRef:
      name: onepassword-connect-token
      key: token
```

### 1Password Secret for Connect Token (Create via helmrelease-1password-secrets.yaml pattern)
```yaml
# Add to apps/coder-prod/helmrelease-1password-secrets.yaml or create new file
apiVersion: onepassword.com/v1
kind: OnePasswordItem
metadata:
  name: onepassword-connect-token
  namespace: coder
spec:
  itemPath: "vaults/setup-coder-prod/items/kzsqg7xbgiz7jbvxksugadymne"
---
apiVersion: v1
kind: Secret
metadata:
  name: onepassword-connect-token
  namespace: coder
type: Opaque
stringData:
  token: ""  # Populated by 1Password operator from itemPath
```

### Local Image Registry Deployment (Example: Docker Registry v2)
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: registry-data
  namespace: coder
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi  # Adjust based on expected cache size
  storageClassName: kubevirt  # Uses CozyStack KubeVirt CSI driver
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registry
  namespace: coder
spec:
  replicas: 1
  selector:
    matchLabels:
      app: registry
  template:
    metadata:
      labels:
        app: registry
    spec:
      containers:
      - name: registry
        image: registry:2.8.3  # Pinned version
        ports:
        - containerPort: 5000
        env:
        - name: REGISTRY_STORAGE_DELETE_ENABLED
          value: "true"  # Enable image deletion for cleanup
        volumeMounts:
        - name: registry-data
          mountPath: /var/lib/registry
      volumes:
      - name: registry-data
        persistentVolumeClaim:
          claimName: registry-data
---
apiVersion: v1
kind: Service
metadata:
  name: registry
  namespace: coder
spec:
  type: ClusterIP
  ports:
  - port: 5000
    targetPort: 5000
  selector:
    app: registry
```

### Registry Cleanup CronJob (Example)
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: registry-gc
  namespace: coder
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: gc
            image: registry:2.8.3
            command:
            - /bin/registry
            - garbage-collect
            - /etc/docker/registry/config.yml
            volumeMounts:
            - name: registry-data
              mountPath: /var/lib/registry
          restartPolicy: OnFailure
          volumes:
          - name: registry-data
            persistentVolumeClaim:
              claimName: registry-data
```

### ConfigMap Structure
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coder-workspace-config
  namespace: coder
data:
  registry_url: "registry.coder.svc.cluster.local:5000"
```

### 1Password Data Sources (Terraform Provider)
```hcl
# Provider connects to Connect server via environment variables:
# - OP_CONNECT_HOST: http://onepassword-connect.1password.svc.cluster.local:8080 (set by Coder deployment)
# - OP_CONNECT_TOKEN: From op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential (set by Coder deployment)

# Vault validation
data "onepassword_vault" "setup_devenv" {
  name = "setup-devenv"

  lifecycle {
    postcondition {
      condition     = can(self.uuid)
      error_message = "The 'setup-devenv' vault must exist in 1Password."
    }
  }
}

# Secret items
data "onepassword_item" "claude_code" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "claude-code"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The 'claude-code' item must have a credential value."
    }
  }
}

data "onepassword_item" "perplexity" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "perplexity"
}

data "onepassword_item" "haos_api" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "haos-api"
}

# Locals to extract credentials
locals {
  claude_code_token = try(data.onepassword_item.claude_code.credential, "")
  perplexity_key    = try(data.onepassword_item.perplexity.credential, "")
  ha_token          = try(data.onepassword_item.haos_api.credential, "")
}

# Coder environment variables
resource "coder_env" "claude_code_token" {
  agent_id = coder_agent.main.id
  name     = "CLAUDE_CODE_OAUTH_TOKEN"
  value    = local.claude_code_token
}

resource "coder_env" "perplexity_key" {
  agent_id = coder_agent.main.id
  name     = "PERPLEXITY_API_KEY"
  value    = local.perplexity_key
}

resource "coder_env" "ha_token" {
  agent_id = coder_agent.main.id
  name     = "HA_TOKEN"
  value    = local.ha_token
}
```

## Testing Checklist

### Pre-deployment Validation
- [ ] `terraform fmt -check` passes
- [ ] `terraform validate` passes
- [ ] `trunk fmt` completes without errors
- [ ] `trunk check` passes all linters
- [ ] 1Password Connect server accessible:
  - [ ] Connect server running in `1password` namespace
  - [ ] Connect server service accessible from `coder` namespace
  - [ ] Coder deployment has environment variables:
    - [ ] `OP_CONNECT_HOST`: `http://onepassword-connect.1password.svc.cluster.local:8080`
    - [ ] `OP_CONNECT_TOKEN`: From `op://setup-coder-prod/kzsqg7xbgiz7jbvxksugadymne/credential`
- [ ] All secrets accessible in 1Password:
  - [ ] Vault `setup-coder-prod` contains Connect token at `kzsqg7xbgiz7jbvxksugadymne`
  - [ ] Vault `setup-devenv` contains:
    - [ ] `claude-code` item with credential
    - [ ] `perplexity` item with credential
    - [ ] `haos-api` item with password
- [ ] GitHub OAuth configured in Coder (`coder external-auth list` shows `primary-github`)
- [ ] FluxCD infrastructure changes reconciled:
  - [ ] `coder-workspace` namespace exists (created via FluxCD)
  - [ ] Local registry deployed in `coder` namespace (via FluxCD)
  - [ ] Registry service accessible via DNS from `coder-workspace` namespace
  - [ ] ConfigMap `coder-workspace-config` exists with `registry_url` (via FluxCD)

### Deployment Testing
- [ ] Template pushes successfully: `coder templates push`
- [ ] Template appears in Coder UI
- [ ] All parameters visible and editable
- [ ] All presets available for selection

### Workspace Creation (First Time)
- [ ] Workspace creation starts successfully
- [ ] PVC is created with correct size in `coder-workspace` namespace
- [ ] Deployment is created with correct image in `coder-workspace` namespace
- [ ] Pod starts and reaches Running state
- [ ] Envbuilder builds devcontainer from correct branch (check logs)
- [ ] Envbuilder pushes image to local registry
- [ ] Coder agent connects successfully
- [ ] All environment variables are set:
  - [ ] `CLAUDE_CODE_OAUTH_TOKEN` (from 1Password)
  - [ ] `PERPLEXITY_API_KEY` (from 1Password)
  - [ ] `HA_TOKEN` (from 1Password)
  - [ ] `GH_TOKEN` (from GitHub external auth)
- [ ] Supervisord starts
- [ ] Fleet MCP server starts and passes healthcheck
- [ ] All Coder apps show healthy status
- [ ] Workspace becomes accessible
- [ ] Tasks tab appears in Coder UI (Coder Tasks enabled)

### Workspace Functionality
- [ ] VS Code Desktop opens workspace
- [ ] Terminal has correct working directory (`/workspaces/setup`)
- [ ] Git commands work (clone, commit, push)
- [ ] GitHub CLI (`gh`) works without manual auth
- [ ] Claude Code command (`claude`) available
- [ ] Fleet MCP tools accessible in Claude Code
- [ ] Task reporting works correctly
- [ ] Home Assistant accessible at configured URL
- [ ] File modifications persist in `/workspaces`

### Workspace Restart
- [ ] Workspace stops cleanly
- [ ] Workspace restarts successfully
- [ ] Envbuilder uses cached image from local registry (check logs for cache hit)
- [ ] Startup time < 1 minute (with cache)
- [ ] PVC data persists (files still present)
- [ ] All apps return to healthy state
- [ ] Task history preserved in Coder UI

### Resource Management
- [ ] CPU limits enforced (try to exceed limit)
- [ ] Memory limits enforced (try to exceed limit)
- [ ] Disk usage reported correctly
- [ ] Multiple workspaces spread across nodes (check `kubectl get pods -o wide`)

### Error Scenarios
- [ ] Workspace creation with invalid parameters fails gracefully
- [ ] Workspace handles Git auth failure (user without GitHub connection)
- [ ] Workspace handles registry auth failure (test with inaccessible registry)
- [ ] Workspace handles missing secret (remove one from 1Password)
- [ ] Workspace deletion cleans up all resources in `coder-workspace` namespace (PVC, Deployment)

### Monitoring and Debugging
- [ ] Coder agent metrics update correctly
- [ ] Metadata shows correct image and local registry URL
- [ ] Logs accessible via `coder ssh <workspace> -- <command>`
- [ ] Kubernetes logs accessible via `kubectl logs -n coder-workspace <pod>`
- [ ] Supervisord status shows fleet-mcp running
- [ ] Coder Tasks tab shows task execution and logs
- [ ] Task names are meaningful (not UUIDs) thanks to CLAUDE_CODE_OAUTH_TOKEN
- [ ] Can create workspace with different `git_branch` parameter for testing

## Success Criteria

The template is considered complete and ready for production when:

1. ✅ **Functional Completeness**: All features from phases 1-11 implemented and working
2. ✅ **Testing**: All items in testing checklist pass consistently
3. ✅ **Documentation**: Complete README, CLAUDE.md, and AGENTS.md files
4. ✅ **Performance**: Workspace startup time < 1 minute with local registry cache
5. ✅ **Reliability**: Workspace restarts work 100% of the time
6. ✅ **Security**: No secrets exposed in logs or Terraform state, all secrets from 1Password
7. ✅ **Coder Tasks**: Full task automation with proper naming via CLAUDE_CODE_OAUTH_TOKEN
8. ✅ **Branch Flexibility**: Can test changes by specifying git_branch parameter
9. ✅ **Infrastructure as Code**: All cluster changes via FluxCD (GitOps)
10. ✅ **Usability**: Non-technical users can create workspaces without assistance
11. ✅ **Maintainability**: Developers can modify template with clear guidance

## References

- [Coder Templates Documentation](https://coder.com/docs/v2/latest/templates)
- [Coder AI Tasks Documentation](https://coder.com/docs/ai-coder/tasks)
- [Envbuilder Documentation](https://github.com/coder/envbuilder)
- [Kubernetes Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Docker Registry v2](https://docs.docker.com/registry/)
- [1Password Kubernetes Operator](https://developer.1password.com/docs/k8s/k8s-operator/)
- [Coder Modules Registry](https://registry.coder.com/)
- [Supervisord Documentation](http://supervisord.org/)
- [CozyStack Documentation](https://cozystack.io/docs/)
</PRD>
