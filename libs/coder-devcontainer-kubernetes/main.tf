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
    envbuilder = {
      source  = "coder/envbuilder"
      version = "1.0.0"
    }
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
  default      = "mg/feat/refactor-coder-workspace"
  description  = "Git branch to checkout for the workspace"
  mutable      = true
}

data "coder_parameter" "devcontainer_builder" {
  name         = "devcontainer_builder"
  display_name = "Devcontainer Builder Image"
  type         = "string"
  default      = "ghcr.io/coder/envbuilder:1.2.0"
  description  = "Envbuilder image to use for building devcontainers"
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
  type        = "string"
  name        = "AI Prompt"
  default     = ""
  description = "Write a prompt for Claude Code"
  mutable     = true
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

  # Local registry cache URL from ConfigMap
  cache_repo = data.kubernetes_config_map_v1.coder_workspace_config.data["registry_url"]

  # Envbuilder image
  devcontainer_builder_image = data.coder_parameter.devcontainer_builder.value

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
# Envbuilder Cache
# ====================

# Envbuilder cached image - detects and reuses cached devcontainer images from local registry
resource "envbuilder_cached_image" "workspace" {
  builder_image = local.devcontainer_builder_image
  # Include branch in git_url - ENVBUILDER_GIT_URL cannot be overridden via extra_env
  git_url                = "${local.repo_url}#${local.git_branch}"
  cache_repo             = "${local.cache_repo}/coder-cache"
  insecure               = true # Local registry doesn't use TLS
  devcontainer_dir       = ".devcontainer"
  workspace_folder       = "/workspaces/setup"
  remote_repo_build_mode = false

  # GitHub credentials for private repository access (required via external auth)
  git_username = "oauth2"
  git_password = local.github_token

  # Extra environment variables passed to envbuilder
  extra_env = {
    # Coder agent configuration
    "CODER_AGENT_TOKEN" = coder_agent.main.token
    "CODER_AGENT_URL"   = data.coder_workspace.me.access_url
    # Envbuilder configuration
    "ENVBUILDER_INIT_SCRIPT" = coder_agent.main.init_script
    "ENVBUILDER_PUSH_IMAGE"  = "true"
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

resource "kubernetes_deployment_v1" "workspace" {
  count            = data.coder_workspace.me.start_count
  wait_for_rollout = true

  metadata {
    name      = "coder-${local.workspace_id}"
    namespace = var.namespace
    labels    = local.labels
    annotations = {
      "com.coder.user.email" = data.coder_workspace_owner.me.email
    }
  }
  spec {
    replicas = 1
    strategy {
      type = "Recreate"
    }
    selector {
      match_labels = {
        "com.coder.workspace.id" = local.workspace_id
      }
    }
    template {
      metadata {
        labels = local.labels
        annotations = {
          "com.coder.user.email" = data.coder_workspace_owner.me.email
        }
      }
      spec {
        # Pod-level security context - envbuilder needs root to build images
        # The devcontainer.json will set the correct user for the workspace
        security_context {}
        #        security_context {
        #          run_as_user  = 0
        #          run_as_group = 0
        #          fs_group     = 0
        #        }

        container {
          name  = "dev"
          image = envbuilder_cached_image.workspace.image
          # When using a cached image, run init_script; otherwise envbuilder handles startup
          #           command = envbuilder_cached_image.workspace.exists ? [
          #             "sh", "-c",
          #             coder_agent.main.init_script
          #           ] : null

          # Dynamic environment variables from envbuilder
          dynamic "env" {
            for_each = envbuilder_cached_image.workspace.env_map
            content {
              name  = env.key
              value = env.value
            }
          }

          # Disable devcontainer features at container level (must be set before agent starts)
          # See: https://coder.com/docs/admin/integrations/devcontainers/integration
          env {
            name  = "CODER_AGENT_DEVCONTAINERS_ENABLE"
            value = "false"
          }
          env {
            name  = "CODER_AGENT_DEVCONTAINERS_PROJECT_DISCOVERY_ENABLE"
            value = "false"
          }
          env {
            name  = "CODER_AGENT_DEVCONTAINERS_DISCOVERY_AUTOSTART_ENABLE"
            value = "false"
          }

          resources {
            requests = {
              cpu    = "250m"
              memory = "512Mi"
            }
            limits = {
              cpu    = "${data.coder_parameter.cpu.value}"
              memory = "${data.coder_parameter.memory.value}Gi"
            }
          }
          volume_mount {
            name       = "workspaces"
            mount_path = "/workspaces"
          }
          #           # Envbuilder needs root to build images - user is set by devcontainer.json
          #           security_context {
          #             run_as_user = 0
          #           }
        }
        volume {
          name = "workspaces"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim_v1.workspaces.metadata[0].name
          }
        }
        # Pod anti-affinity to spread workspaces across nodes
        #        affinity {
        #          pod_anti_affinity {
        #            preferred_during_scheduling_ignored_during_execution {
        #              weight = 1
        #              pod_affinity_term {
        #                topology_key = "kubernetes.io/hostname"
        #                label_selector {
        #                  match_labels = {
        #                    "app.kubernetes.io/name" = "coder-workspace"
        #                  }
        #                }
        #              }
        #            }
        #          }
        #        }
      }
    }
  }
}

# ====================
# Coder Agent
# ====================

resource "coder_agent" "main" {
  arch           = data.coder_provisioner.me.arch
  os             = "linux"
  dir            = "/workspaces/setup"
  startup_script = <<-EOT
    set -e
    set +x
  EOT

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

    # Wait for git repo to be available
    wait-for-git --dir /workspaces/setup

    supervisord -c /workspaces/setup/libs/coder-devcontainer/supervisord.conf

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
  subdomain    = false
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
  continue                     = true
  dangerously_skip_permissions = true

  # Pre-hook script to wait for git repo and verify Claude is available
  pre_install_script = <<-EOT
    wait-for-git --dir /workspaces/setup
  EOT

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

# VS Code Desktop integration
module "vscode" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/vscode-desktop/coder"
  version  = "1.1.1"
  agent_id = coder_agent.main.id
  folder   = "/workspaces/setup"
  order    = 1
}

# Git commit signing module to configure commit signing with SSH keys
module "git_commit_signing" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/git-commit-signing/coder"
  version  = "1.0.31"
  agent_id = coder_agent.main.id
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
  resource_id = kubernetes_deployment_v1.workspace[0].id
  item {
    key   = "image"
    value = envbuilder_cached_image.workspace.image
  }
  item {
    key   = "cached"
    value = envbuilder_cached_image.workspace.exists ? "yes" : "no (building)"
  }
  item {
    key   = "cache_repo"
    value = "${local.cache_repo}/coder-cache"
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
