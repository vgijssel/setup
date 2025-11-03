terraform {
  required_version = ">= 1.0"

  required_providers {
    coder = {
      source  = "coder/coder"
      version = "2.11.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.6.2"
    }
    onepassword = {
      source  = "1Password/onepassword"
      version = "2.1.2"
    }
  }
}

locals {
  username      = data.coder_workspace_owner.me.name
  package_json  = jsondecode(file("${path.module}/package.json"))
  image_version = local.package_json.dependencies.devcontainer
  # Extract the Claude Code OAuth token from 1Password
  claude_code_token = try(data.onepassword_item.claude_code.credential, "")
  # Extract the GitHub token from 1Password
  github_token = try(data.onepassword_item.github_devcontainer_agent.credential, "")
  # Extract the Home Assistant API token from 1Password
  ha_token = try(data.onepassword_item.haos_api.credential, "")
  # Extract the NX_KEY from 1Password
  nx_key = try(data.onepassword_item.nx_key.credential, "")
  # Extract the OP_SERVICE_ACCOUNT_TOKEN from 1Password
  op_service_account_token = try(data.onepassword_item.op_service_account_token.credential, "")
  # Extract Coder token from 1Password
  coder_token = try(data.onepassword_item.coder_token.credential, "")
}

provider "docker" {
}

provider "onepassword" {
}

data "coder_provisioner" "me" {}
data "coder_workspace" "me" {}
data "coder_workspace_owner" "me" {}

# 1Password data sources for Claude Code configuration
# Ensure that a vault named "setup-devenv" exists in your 1Password account.
data "onepassword_vault" "setup_devenv" {
  name = "setup-devenv"

  lifecycle {
    postcondition {
      condition     = can(self.uuid)
      error_message = "The 'setup-devenv' vault must exist in 1Password."
    }
  }
}

# Ensure that an item titled "claude-code" exists in the 'setup-devenv' vault.
data "onepassword_item" "claude_code" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "claude-code"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The 'claude-code' item in 1Password must have a credential value with the OAuth token."
    }
  }
}

# Ensure that an item titled "github-devcontainer-agent" exists in the 'setup-devenv' vault.
data "onepassword_item" "github_devcontainer_agent" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "github-devcontainer-agent"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The 'github-devcontainer-agent' item in 1Password must have a credential value with the GitHub token."
    }
  }
}

# Ensure that an item titled "haos-api" exists in the 'setup-devenv' vault.
data "onepassword_item" "haos_api" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "haos-api"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The 'haos-api' item in 1Password must have a password field with the Home Assistant API token."
    }
  }
}

# Ensure that an item titled "NX_KEY" exists in the 'setup-devenv' vault.
data "onepassword_item" "nx_key" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "NX_KEY"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The 'NX_KEY' item in 1Password must have a credential value with the NX key."
    }
  }
}

# Ensure that the service account token exists in the 'setup-devenv' vault using item ID.
data "onepassword_item" "op_service_account_token" {
  vault = data.onepassword_vault.setup_devenv.uuid
  uuid  = "Service Account Auth Token: devenv"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The service account token item in 1Password must have a credential value."
    }
  }
}

# Ensure that an item titled "coder-speckit" exists in the 'setup-devenv' vault.
data "onepassword_item" "coder_token" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "coder-speckit"

  lifecycle {
    postcondition {
      condition     = try(self.credential, "") != ""
      error_message = "The 'coder-speckit' item in 1Password must have a credential value with the Coder token."
    }
  }
}


data "coder_parameter" "system_prompt" {
  name         = "system_prompt"
  display_name = "System Prompt"
  type         = "string"
  form_type    = "textarea"
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

resource "coder_env" "github_token" {
  agent_id = coder_agent.main.id
  name     = "GH_TOKEN"
  value    = local.github_token
}

resource "coder_env" "ha_token" {
  agent_id = coder_agent.main.id
  name     = "HA_TOKEN"
  value    = local.ha_token
}

resource "coder_env" "nx_key" {
  agent_id = coder_agent.main.id
  name     = "NX_KEY"
  value    = local.nx_key
}

resource "coder_env" "op_service_account_token" {
  agent_id = coder_agent.main.id
  name     = "OP_SERVICE_ACCOUNT_TOKEN"
  value    = local.op_service_account_token
}

resource "coder_env" "coder_url" {
  agent_id = coder_agent.main.id
  name     = "CODER_URL"
  value    = data.coder_provisioner.me.url
}

resource "coder_env" "coder_token" {
  agent_id = coder_agent.main.id
  name     = "CODER_TOKEN"
  value    = local.coder_token
}

resource "coder_agent" "main" {
  arch           = data.coder_provisioner.me.arch
  os             = "linux"
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

  # These environment variables allow you to make Git commits right away after creating a
  # workspace. Note that they take precedence over configuration defined in ~/.gitconfig!
  # You can remove this block if you'd prefer to configure Git manually or using
  # dotfiles. (see docs/dotfiles.md)
  #   env = {
  #     GIT_AUTHOR_NAME     = coalesce(data.coder_workspace_owner.me.full_name, data.coder_workspace_owner.me.name)
  #     GIT_AUTHOR_EMAIL    = "${data.coder_workspace_owner.me.email}"
  #     GIT_COMMITTER_NAME  = coalesce(data.coder_workspace_owner.me.full_name, data.coder_workspace_owner.me.name)
  #     GIT_COMMITTER_EMAIL = "${data.coder_workspace_owner.me.email}"
  #   }

  # The following metadata blocks are optional. They are used to display
  # information about your workspace in the dashboard. You can remove them
  # if you don't want to display any information.
  # For basic resources, you can use the `coder stat` command.
  # If you need more control, you can write your own script.
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
    display_name = "Home Disk"
    key          = "3_home_disk"
    script       = "coder stat disk --path $${HOME}"
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
    # get load avg scaled by number of cores
    script   = <<EOT
      echo "`cat /proc/loadavg | awk '{ print $1 }'` `nproc`" | awk '{ printf "%0.2f", $1/$2 }'
    EOT
    interval = 60
    timeout  = 1
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

  metadata {
    display_name = "Pull Request URL"
    key          = "8_pull_request_url"
    script       = "cat /workspaces/dataone/tmp/agent_metadata/pull_request_url 2>/dev/null || echo n/a"
    interval     = 5
    timeout      = 1
  }

  metadata {
    display_name = "Pull Request Status"
    key          = "9_pull_request_status"
    script       = "cat /workspaces/dataone/tmp/agent_metadata/pull_request_status 2>/dev/null || echo n/a"
    interval     = 5
    timeout      = 1
  }

  metadata {
    display_name = "Pull Request Check Status"
    key          = "10_pull_request_check_status"
    script       = "cat /workspaces/dataone/tmp/agent_metadata/pull_request_check_status 2>/dev/null || echo n/a"
    interval     = 5
    timeout      = 1
  }

  metadata {
    display_name = "Agent Spec"
    key          = "11_agent_spec"
    script       = "cat /workspaces/dataone/tmp/agent_metadata/agent_spec 2>/dev/null || echo n/a"
    interval     = 5
    timeout      = 1
  }
}

# # See https://registry.coder.com/modules/coder/code-server
# module "code-server" {
#   count  = data.coder_workspace.me.start_count
#   source = "registry.coder.com/coder/code-server/coder"

#   # This ensures that the latest non-breaking version of the module gets downloaded, you can also pin the module version to prevent breaking changes in production.
#   version = "~> 1.0"

#   agent_id = coder_agent.main.id
#   order    = 1
#   folder   = "/workspaces/setup"
# }

# module "vscode-web" {
#   count          = data.coder_workspace.me.start_count
#   source         = "registry.coder.com/coder/vscode-web/coder"
#   version        = "1.4.1"
#   agent_id       = coder_agent.main.id
#   install_prefix = "/workspaces/setup/.vscode-web"
#   folder         = "/workspaces/setup"
#   accept_license = true
# }

# The Claude Code module does the automatic task reporting
# Other agent modules: https://registry.coder.com/modules?search=agent
# Or use a custom agent:  

module "claude-code" {
  count                   = data.coder_workspace.me.start_count
  source                  = "registry.coder.com/coder/claude-code/coder"
  version                 = "3.0.0"
  agent_id                = coder_agent.main.id
  workdir                 = "/workspaces/setup"
  ai_prompt               = data.coder_parameter.ai_prompt.value
  system_prompt           = data.coder_parameter.system_prompt.value
  install_claude_code     = false
  order                   = 999
  claude_code_oauth_token = local.claude_code_token

  # Pre-hook script to wait for git repo and verify Claude is available
  pre_install_script = <<-EOT
    wait-for-git --dir /workspaces/setup
  EOT

  # This enables Coder Tasks
  report_tasks = true
}

module "coder-login" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/coder-login/coder"
  version  = "1.1.0"
  agent_id = coder_agent.main.id
}

module "vscode" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/vscode-desktop/coder"
  version  = "1.1.1"
  agent_id = coder_agent.main.id
  folder   = "/workspaces/setup"
  order    = 1
}

# Git clone module to clone the setup repository
module "git-clone" {
  source      = "registry.coder.com/coder/git-clone/coder"
  version     = "1.1.1"
  agent_id    = coder_agent.main.id
  url         = "git@github.com:vgijssel/setup.git"
  base_dir    = "/workspaces"
  folder_name = "setup"
}

# Git commit signing module to configure commit signing with SSH keys
module "git-commit-signing" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/git-commit-signing/coder"
  version  = "1.0.31"
  agent_id = coder_agent.main.id
}

resource "docker_volume" "home_volume" {
  name = "coder-${data.coder_workspace.me.id}-home"
  # Protect the volume from being deleted due to changes in attributes.
  lifecycle {
    ignore_changes = all
  }
  # Add labels in Docker to keep track of orphan resources.
  labels {
    label = "coder.owner"
    value = data.coder_workspace_owner.me.name
  }
  labels {
    label = "coder.owner_id"
    value = data.coder_workspace_owner.me.id
  }
  labels {
    label = "coder.workspace_id"
    value = data.coder_workspace.me.id
  }
  # This field becomes outdated if the workspace is renamed but can
  # be useful for debugging or cleaning out dangling volumes.
  labels {
    label = "coder.workspace_name_at_creation"
    value = data.coder_workspace.me.name
  }
}

resource "docker_volume" "workspaces_volume" {
  name = "coder-${data.coder_workspace.me.id}-workspaces"
  # Protect the volume from being deleted due to changes in attributes.
  lifecycle {
    ignore_changes = all
  }
  # Add labels in Docker to keep track of orphan resources.
  labels {
    label = "coder.owner"
    value = data.coder_workspace_owner.me.name
  }
  labels {
    label = "coder.owner_id"
    value = data.coder_workspace_owner.me.id
  }
  labels {
    label = "coder.workspace_id"
    value = data.coder_workspace.me.id
  }
  # This field becomes outdated if the workspace is renamed but can
  # be useful for debugging or cleaning out dangling volumes.
  labels {
    label = "coder.workspace_name_at_creation"
    value = data.coder_workspace.me.name
  }
}

resource "coder_app" "home-assistant" {
  agent_id     = coder_agent.main.id
  slug         = "home-assistant"
  display_name = "Home Assistant"
  url          = "http://192.168.1.32:8123/"
  external     = true
}

# Fleet MCP server script - starts uvicorn with hot reload
resource "coder_script" "fleet_mcp" {
  agent_id     = coder_agent.main.id
  display_name = "Fleet MCP Server"
  icon         = "/icon/cloud.svg"
  script = <<-EOT
    #!/bin/bash
    set -e

    # Wait for git repo to be available
    wait-for-git --dir /workspaces/setup

    # Navigate to the fleet-mcp project directory
    cd "${SETUP_DIR}/libs/fleet-mcp"

    # Start uvicorn with hot reload
    uv run --all-extras uvicorn fleet_mcp.__main__:app --host 0.0.0.0 --port 8000 --reload
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
  url          = "http://localhost:8000"
  subdomain    = false
  share        = "owner"

  healthcheck {
    url       = "http://localhost:8000/health"
    interval  = 5
    threshold = 6
  }
}

resource "docker_container" "workspace" {
  count = data.coder_workspace.me.start_count
  image = "ghcr.io/vgijssel/setup/devcontainer:${local.image_version}"
  # Uses lower() to avoid Docker restriction on container names.
  name = "coder-${data.coder_workspace_owner.me.name}-${lower(data.coder_workspace.me.name)}"
  # Hostname makes the shell more user friendly: coder@my-workspace:~$
  hostname   = data.coder_workspace.me.name
  privileged = true
  # First run docker-init.sh, then the coder agent
  # TODO: maybe run a coder script instead? the docker thing?
  entrypoint = ["sh", "-c", "/usr/local/share/docker-init.sh ${replace(coder_agent.main.init_script, "/localhost|127\\.0\\.0\\.1/", "host.docker.internal")}"]
  env        = ["CODER_AGENT_TOKEN=${coder_agent.main.token}"]
  host {
    host = "host.docker.internal"
    ip   = "host-gateway"
  }
  volumes {
    container_path = "/home/coder"
    volume_name    = docker_volume.home_volume.name
    read_only      = false
  }
  volumes {
    container_path = "/workspaces"
    volume_name    = docker_volume.workspaces_volume.name
    read_only      = false
  }

  # Add labels in Docker to keep track of orphan resources.
  labels {
    label = "coder.owner"
    value = data.coder_workspace_owner.me.name
  }
  labels {
    label = "coder.owner_id"
    value = data.coder_workspace_owner.me.id
  }
  labels {
    label = "coder.workspace_id"
    value = data.coder_workspace.me.id
  }
  labels {
    label = "coder.workspace_name"
    value = data.coder_workspace.me.name
  }
}
