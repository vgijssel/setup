terraform {
  required_version = ">= 1.0"

  required_providers {
    coder = {
      source  = "coder/coder"
      version = "2.11.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.35.1"
    }
    onepassword = {
      source  = "1Password/onepassword"
      version = "2.1.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.3"
    }
    # Removed envbuilder provider - using DevPod instead for devcontainer builds
  }
}

# Providers - Kubernetes uses in-cluster authentication, 1Password uses OP_CONNECT env vars
provider "kubernetes" {
  # Uses in-cluster authentication - no explicit config needed
}

provider "onepassword" {
  # Provider connects to Connect server via environment variables:
  # - OP_CONNECT_HOST: http://onepassword-connect.1password.svc.cluster.local:8080
  # - OP_CONNECT_TOKEN: Set by Coder deployment
}

# ====================
# Data Sources
# ====================

data "coder_provisioner" "me" {}
data "coder_workspace" "me" {}
data "coder_workspace_owner" "me" {}

# 1Password vault validation
data "onepassword_vault" "setup_devenv" {
  name = var.onepassword_vault

  lifecycle {
    postcondition {
      condition     = can(self.uuid)
      error_message = "The '${var.onepassword_vault}' vault must exist in 1Password."
    }
  }
}

# Kubernetes ConfigMap for workspace configuration (registry URL, etc.)
data "kubernetes_config_map_v1" "coder_workspace_config" {
  metadata {
    name      = "coder-workspace-config"
    namespace = "coder"
  }
}

# ====================
# 1Password Items
# ====================

# Claude Code OAuth token (dual purpose: auth + task naming)
data "onepassword_item" "claude_code" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "claude-code"
}

# Perplexity API key for AI research capabilities
data "onepassword_item" "perplexity" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "perplexity"
}

# Home Assistant API token
data "onepassword_item" "haos_api" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "haos-api"
}

# ====================
# GitHub External Authentication
# ====================

# GitHub external auth (configured in Coder deployment as primary-github)
# Required: Users must connect GitHub before creating workspace
data "coder_external_auth" "github" {
  id       = "primary-github"
  optional = false
}

# ====================
# Variables
# ====================

variable "namespace" {
  description = "Kubernetes namespace for workspace resources"
  type        = string
  default     = "coder-workspace"
}

variable "onepassword_vault" {
  description = "1Password vault name for secrets (set via TF_VAR_onepassword_vault or Coder template variable)"
  type        = string
  default     = "setup-devenv"
}

# ====================
# Coder Parameters
# ====================

data "coder_parameter" "cpu" {
  name         = "cpu"
  display_name = "CPU Cores"
  type         = "number"
  default      = "2"
  description  = "Number of CPU cores for the workspace"
  mutable      = false
  validation {
    min = 1
    max = 99999
  }
}

data "coder_parameter" "memory" {
  name         = "memory"
  display_name = "Memory (GiB)"
  type         = "number"
  default      = "4"
  description  = "Amount of memory in GiB for the workspace"
  mutable      = false
  validation {
    min = 1
    max = 99999
  }
}

data "coder_parameter" "workspaces_volume_size" {
  name         = "workspaces_volume_size"
  display_name = "Workspaces Volume Size (GiB)"
  type         = "number"
  default      = "10"
  description  = "Size of the persistent volume for /workspaces in GiB"
  mutable      = false
  validation {
    min = 1
    max = 99999
  }
}

data "coder_parameter" "git_branch" {
  name         = "git_branch"
  display_name = "Git Branch"
  type         = "string"
  default      = "main"
  description  = "Git branch to checkout for the workspace"
  mutable      = true
}

data "coder_parameter" "devcontainer_builder" {
  name         = "devcontainer_builder"
  display_name = "DevPod Builder Image"
  type         = "string"
  default      = "ghcr.io/vgijssel/setup/devpod-builder:0.1.6"
  description  = "DevPod builder image for creating devcontainer workspaces"
  mutable      = false
}

data "coder_parameter" "system_prompt" {
  name         = "system_prompt"
  display_name = "System Prompt"
  type         = "string"
  form_type    = "textarea"
  default      = ""
  description  = "System prompt for the agent with generalized instructions (required - select a preset)"
  mutable      = false
}

data "coder_parameter" "ai_prompt" {
  type         = "string"
  name         = "ai_prompt"
  display_name = "AI Prompt"
  default      = ""
  description  = "Write a prompt for Claude Code"
  mutable      = true
}

# ====================
# Workspace Presets
# ====================

# Workspace preset for coding agent
data "coder_workspace_preset" "coder" {
  name    = "Coder"
  default = true
  parameters = {
    system_prompt = <<-EOT
      You are an expert software development assistant specialized in implementing features and fixing bugs.

      Your primary focus is on:
      - Writing clean, maintainable, and well-tested code
      - Following established patterns and conventions in the codebase
      - Implementing comprehensive tests (unit, integration, and e2e)
      - Ensuring code quality through linting, formatting, and type checking
      - Documenting complex logic and design decisions
      - Optimizing for performance and scalability when appropriate

      When approaching tasks:
      1. Analyze the existing codebase structure and patterns
      2. Plan the implementation with clear steps
      3. Write the code following best practices
      4. Add appropriate tests to verify functionality
      5. Validate with linting and formatting tools
      6. Review and refine the implementation

      You are running inside a Coder Workspace and provide status updates to the user via Coder MCP.
      Stay on track, feel free to debug, but when the original plan fails, do not choose a different
      route/architecture without checking with the user first.
    EOT
  }
}

# Workspace preset for operator investigating incidents
data "coder_workspace_preset" "operator" {
  name = "Operator"
  parameters = {
    system_prompt = <<-EOT
      You are an expert site reliability engineer and incident response specialist.

      Your primary focus is on:
      - Rapid diagnostics and troubleshooting of production issues
      - Analyzing logs, metrics, and system behavior to identify root causes
      - Understanding system architecture and dependencies
      - Investigating performance degradations and service disruptions
      - Providing clear, actionable insights for incident resolution
      - Documenting findings and creating postmortem reports when requested

      When investigating incidents:
      1. Gather relevant context (logs, metrics, recent changes)
      2. Form hypotheses about potential root causes
      3. Test hypotheses systematically using available observability tools
      4. Identify the root cause and contributing factors
      5. Suggest immediate mitigations and long-term preventions
      6. Clearly communicate findings and recommendations

      You are running inside a Coder Workspace and provide status updates to the user via Coder MCP.
      Focus on quick information gathering and analysis. Ask clarifying questions when the scope of
      investigation is unclear. Prioritize understanding what happened over implementing fixes unless
      explicitly asked to implement solutions.
    EOT
  }
}

# Workspace preset for researcher conducting deep analysis
data "coder_workspace_preset" "researcher" {
  name = "Researcher"
  parameters = {
    system_prompt = <<-EOT
      You are an expert research analyst specialized in comprehensive investigation and deep analysis.

      Your primary focus is on:
      - Conducting thorough, multi-layered research on complex topics
      - Synthesizing information from multiple sources and perspectives
      - Identifying patterns, connections, and underlying principles
      - Exploring edge cases, alternative approaches, and related concepts
      - Building comprehensive mental models of systems and domains
      - Evaluating claims with critical thinking and evidence-based reasoning
      - Documenting findings with detailed analysis and supporting evidence

      When conducting research:
      1. Define clear research questions and objectives
      2. Systematically explore the codebase, documentation, and related resources
      3. Follow tangential connections that may reveal deeper insights
      4. Cross-reference findings across multiple sources for validation
      5. Analyze not just what exists, but why it exists and what alternatives were considered
      6. Document your research process and reasoning chain
      7. Synthesize findings into coherent, comprehensive reports
      8. Identify gaps in understanding and areas requiring further investigation

      Research principles:
      - Prioritize depth and accuracy over speed
      - Be thorough but focused - avoid rabbit holes that don't serve the research goal
      - Question assumptions and look for counter-evidence
      - Trace the evolution of code, decisions, and architecture over time
      - Consider multiple perspectives and interpretations
      - Make connections between seemingly unrelated concepts

      You are running inside a Coder Workspace and provide status updates to the user via Coder MCP.
      Take your time to explore thoroughly. When you discover something interesting, follow the thread
      to its logical conclusion. Ask clarifying questions to ensure your research aligns with user needs.
      Focus on understanding over implementation - only suggest or implement solutions when explicitly
      requested.
    EOT
  }
}

# ====================
# Locals
# ====================

locals {
  username     = data.coder_workspace_owner.me.name
  workspace_id = data.coder_workspace.me.id

  # Git and repository configuration
  git_branch = data.coder_parameter.git_branch.value
  repo_url   = "https://github.com/vgijssel/setup.git"

  # Local registry cache URL from ConfigMap (for envbuilder push - uses cluster DNS)
  cache_repo = data.kubernetes_config_map_v1.coder_workspace_config.data["registry_url"]

  # Registry pull URL from ConfigMap (for kubelet pull - uses localhost NodePort)
  # Kubelet uses host DNS which cannot resolve .svc.cluster.local addresses
  # See: https://discuss.kubernetes.io/t/how-does-kubelet-dns-resolution-before-pod-creation-work/9489
  registry_pull_url = data.kubernetes_config_map_v1.coder_workspace_config.data["registry_pull_url"]

  # Coder URL from ConfigMap (for agent-to-server communication - uses cluster DNS)
  # Agents inside the cluster use this to avoid DNS mismatch with external URL
  coder_url = data.kubernetes_config_map_v1.coder_workspace_config.data["coder_url"]

  # DevPod builder image
  devpod_builder_image = data.coder_parameter.devcontainer_builder.value

  # DevPod workspace name (must be unique per workspace)
  devpod_workspace_name = "coder-${local.workspace_id}"

  # Extract credentials from 1Password
  claude_code_token = try(data.onepassword_item.claude_code.credential, "")
  perplexity_key    = try(data.onepassword_item.perplexity.credential, "")
  ha_token          = try(data.onepassword_item.haos_api.credential, "")

  # GitHub token from external auth (required - users must connect GitHub before workspace creation)
  github_token = data.coder_external_auth.github.access_token

  # Kubernetes labels for all resources
  labels = {
    "app.kubernetes.io/name"     = "coder-workspace"
    "app.kubernetes.io/instance" = "coder-${local.workspace_id}"
    "app.kubernetes.io/part-of"  = "coder"
    "com.coder.resource"         = "true"
    "com.coder.workspace.id"     = local.workspace_id
    "com.coder.workspace.name"   = data.coder_workspace.me.name
    "com.coder.user.id"          = data.coder_workspace_owner.me.id
    "com.coder.user.username"    = local.username
  }
}

# ====================
# DevPod Builder Job
# ====================

# DevPod builder job - creates workspace using DevPod with Kubernetes provider
# This job runs the DevPod CLI to build and deploy the devcontainer workspace
resource "kubernetes_job_v1" "devpod_builder" {
  count = data.coder_workspace.me.start_count

  metadata {
    name      = "devpod-${local.workspace_id}"
    namespace = var.namespace
    labels    = local.labels
  }

  spec {
    # Don't retry - if it fails, let Coder handle the error
    backoff_limit = 0

    # Clean up completed jobs after 1 hour
    ttl_seconds_after_finished = 3600

    template {
      metadata {
        labels = local.labels
      }
      spec {
        service_account_name = "devpod-builder"
        restart_policy       = "Never"

        container {
          name  = "devpod"
          image = local.devpod_builder_image

          # Environment variables for DevPod builder
          env {
            name  = "CODER_AGENT_URL"
            value = local.coder_url
          }
          env {
            name  = "CODER_AGENT_TOKEN"
            value = coder_agent.main.token
          }
          env {
            name  = "DEVPOD_REPOSITORY"
            value = local.repo_url
          }
          env {
            name  = "DEVPOD_BRANCH"
            value = local.git_branch
          }
          env {
            name  = "DEVPOD_NAMESPACE"
            value = var.namespace
          }
          env {
            name  = "DEVPOD_IDE"
            value = "none"
          }
          env {
            name  = "DEVPOD_TIMEOUT"
            value = "30m"
          }
          # Coder agent init script - runs inside the workspace to start the agent
          env {
            name  = "CODER_INIT_SCRIPT"
            value = coder_agent.main.init_script
          }

          resources {
            requests = {
              cpu    = "250m"
              memory = "256Mi"
            }
            limits = {
              cpu    = "1"
              memory = "1Gi"
            }
          }
        }
      }
    }
  }

  wait_for_completion = true

  timeouts {
    create = "30m"
    update = "30m"
  }
}

# ====================
# Kubernetes Resources
# ====================

resource "kubernetes_persistent_volume_claim_v1" "workspaces" {
  metadata {
    name      = "coder-${local.workspace_id}-workspaces"
    namespace = var.namespace
    labels    = local.labels
  }
  spec {
    access_modes       = ["ReadWriteOnce"]
    storage_class_name = "kubevirt"
    resources {
      requests = {
        storage = "${data.coder_parameter.workspaces_volume_size.value}Gi"
      }
    }
  }
  # Protect the PVC from being deleted due to changes in attributes
  lifecycle {
    ignore_changes = all
  }
  wait_until_bound = false
}

# NOTE: Deployment removed - DevPod creates and manages the workspace pod
# The kubernetes_job_v1.devpod_builder resource handles workspace creation
# DevPod's pod will be named: devpod-<workspace-name>-<hash> in the same namespace
# The Coder agent runs inside the DevPod-created container via the devcontainer's entrypoint

# ====================
# Coder Agent
# ====================

resource "coder_agent" "main" {
  arch = data.coder_provisioner.me.arch
  os   = "linux"
  dir  = "/workspaces/setup"

  display_apps {
    vscode          = false
    vscode_insiders = false
    web_terminal    = true
    ssh_helper      = false
  }

  # Resource monitoring metadata
  metadata {
    display_name = "CPU Usage"
    key          = "0_cpu_usage"
    script       = "coder stat cpu"
    interval     = 10
    timeout      = 1
  }

  metadata {
    display_name = "RAM Usage"
    key          = "1_ram_usage"
    script       = "coder stat mem"
    interval     = 10
    timeout      = 1
  }

  metadata {
    display_name = "Workspaces Disk"
    key          = "2_workspaces_disk"
    script       = "coder stat disk --path /workspaces"
    interval     = 60
    timeout      = 1
  }

  metadata {
    display_name = "CPU Usage (Host)"
    key          = "4_cpu_usage_host"
    script       = "coder stat cpu --host"
    interval     = 10
    timeout      = 1
  }

  metadata {
    display_name = "Memory Usage (Host)"
    key          = "5_mem_usage_host"
    script       = "coder stat mem --host"
    interval     = 10
    timeout      = 1
  }

  metadata {
    display_name = "Load Average (Host)"
    key          = "6_load_host"
    script       = <<EOT
      echo "`cat /proc/loadavg | awk '{ print $1 }'` `nproc`" | awk '{ printf "%0.2f", $1/$2 }'
    EOT
    interval     = 60
    timeout      = 1
  }

  metadata {
    display_name = "Swap Usage (Host)"
    key          = "7_swap_host"
    script       = <<EOT
      free -b | awk '/^Swap/ { printf("%.1f/%.1f", $3/1024.0/1024.0/1024.0, $2/1024.0/1024.0/1024.0) }'
    EOT
    interval     = 10
    timeout      = 1
  }
}

# ====================
# Environment Variables (Secrets from 1Password and GitHub OAuth)
# ====================

# GitHub token from external authentication (enables gh CLI and git push)
resource "coder_env" "gh_token" {
  agent_id = coder_agent.main.id
  name     = "GH_TOKEN"
  value    = local.github_token
}

# Claude Code OAuth token (dual purpose: auth + task naming)
resource "coder_env" "claude_code_oauth_token" {
  agent_id = coder_agent.main.id
  name     = "CLAUDE_CODE_OAUTH_TOKEN"
  value    = local.claude_code_token
}

# Perplexity API key for AI research
resource "coder_env" "perplexity_api_key" {
  agent_id = coder_agent.main.id
  name     = "PERPLEXITY_API_KEY"
  value    = local.perplexity_key
}

# Home Assistant API token
resource "coder_env" "ha_token" {
  agent_id = coder_agent.main.id
  name     = "HA_TOKEN"
  value    = local.ha_token
}

# ====================
# Fleet MCP Server
# ====================

# Generate a random bearer token for fleet-mcp authentication
resource "random_id" "fleet_mcp_bearer_token" {
  byte_length = 32
  keepers = {
    # Regenerate token when workspace is recreated
    workspace_id = data.coder_workspace.me.id
  }
}

# Fleet MCP auth token for the agent
resource "coder_env" "fleet_mcp_auth_token" {
  agent_id = coder_agent.main.id
  name     = "FLEET_MCP_AUTH_TOKEN"
  value    = random_id.fleet_mcp_bearer_token.b64_url
}

# Fleet MCP server script - starts fleet-mcp via supervisord
resource "coder_script" "fleet_mcp" {
  agent_id     = coder_agent.main.id
  display_name = "Fleet MCP Server"
  icon         = "/icon/cloud.svg"
  script       = <<-EOT
    #!/bin/bash
    set -e

    echo "Starting fleet-mcp"

    supervisord -c /workspaces/setup/libs/coder-devcontainer-kubernetes/supervisord.conf

    # Wait for supervisord to be available on port 9001
    wait-for-it --service 127.0.0.1:9001 --timeout 60

    # Verify fleet-mcp service is running
    supervisorctl status fleet-mcp
  EOT
  run_on_start = true
  run_on_stop  = false
}

# Fleet MCP server app - exposes the HTTP server with healthcheck
resource "coder_app" "fleet_mcp" {
  agent_id     = coder_agent.main.id
  slug         = "fleet-mcp"
  display_name = "Fleet MCP"
  icon         = "/icon/cloud.svg"
  url          = "http://127.0.0.1:8000"
  subdomain    = true
  share        = "owner"

  healthcheck {
    url       = "http://127.0.0.1:8000/health"
    interval  = 10
    threshold = 24
  }
}

# ====================
# Claude Code Integration
# ====================

module "claude_code" {
  count                        = data.coder_workspace.me.start_count
  source                       = "registry.coder.com/coder/claude-code/coder"
  version                      = "3.4.4"
  agent_id                     = coder_agent.main.id
  workdir                      = "/workspaces/setup"
  ai_prompt                    = data.coder_parameter.ai_prompt.value
  system_prompt                = data.coder_parameter.system_prompt.value
  install_claude_code          = false
  order                        = 999
  claude_code_oauth_token      = local.claude_code_token
  cli_app                      = true
  subdomain                    = true
  continue                     = true
  dangerously_skip_permissions = true

  post_install_script = <<-EOT
    cd /workspaces/setup
    # Wait for the Fleet MCP server to be available
    wait-for-it --service 127.0.0.1:8000 --timeout 120

    # Extract the bearer token from the token file with error handling
    TOKEN_FILE="$HOME/.fleet-mcp/auth_token"
    if [ ! -f "$TOKEN_FILE" ]; then
      echo "Error: Token file $TOKEN_FILE does not exist." >&2
      exit 1
    fi
    TOKEN=$(jq -r '.value' "$TOKEN_FILE" 2>/dev/null)
    if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
      echo "Error: Failed to extract token from $TOKEN_FILE." >&2
      exit 1
    fi

    # Idempotent MCP server configuration - remove then add for consistency
    echo "Configuring MCP servers idempotently..."

    # Remove existing fleet-mcp server if it exists (ignore errors)
    claude mcp remove "fleet-mcp" 2>/dev/null || true
    claude mcp add --transport http "fleet-mcp" http://127.0.0.1:8000/mcp --header "Authorization: Bearer $TOKEN"

    echo "MCP configuration completed. MCP servers configured idempotently."
  EOT

  # This enables Coder Tasks
  report_tasks = true
}

# ====================
# Additional Modules
# ====================

# The coder-login module sets CODER_SESSION_TOKEN and CODER_URL inside the env
# These automatically log the user into the Coder CLI and API
module "coder_login" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/coder-login/coder"
  version  = "1.1.0"
  agent_id = coder_agent.main.id
}

module "git-commit-signing" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/git-commit-signing/coder"
  version  = "1.0.32"
  agent_id = coder_agent.main.id
}

# VS Code Desktop integration
module "vscode" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/vscode-desktop/coder"
  version  = "1.1.1"
  agent_id = coder_agent.main.id
  folder   = "/workspaces/setup"
  order    = 1
}

# ====================
# External Apps
# ====================

# Home Assistant external link
resource "coder_app" "home_assistant" {
  agent_id     = coder_agent.main.id
  slug         = "home-assistant"
  display_name = "Home Assistant"
  url          = "http://192.168.1.32:8123/"
  external     = true
}

# ====================
# Version file for tracking
# ====================

resource "coder_metadata" "workspace_info" {
  count       = data.coder_workspace.me.start_count
  resource_id = kubernetes_job_v1.devpod_builder[0].id
  item {
    key   = "builder"
    value = "devpod"
  }
  item {
    key   = "builder_image"
    value = local.devpod_builder_image
  }
  item {
    key   = "git_branch"
    value = local.git_branch
  }
  item {
    key   = "namespace"
    value = var.namespace
  }
  item {
    key   = "volume_size"
    value = "${data.coder_parameter.workspaces_volume_size.value}Gi"
  }
}

# Store the bearer token as workspace metadata for fleet-mcp
resource "coder_metadata" "fleet_mcp_bearer_token" {
  resource_id = coder_agent.main.id
  item {
    key   = "fleet_mcp_bearer_token"
    value = random_id.fleet_mcp_bearer_token.b64_url
  }
}
