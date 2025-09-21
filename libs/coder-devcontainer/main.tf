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
}

variable "docker_socket" {
  default     = ""
  description = "(Optional) Docker socket URI"
  type        = string
}

variable "op_service_account_token" {
  description = "1Password Service Account Token"
  type        = string
  sensitive   = true
  default     = ""
}

provider "docker" {
  # Defaulting to null if the variable is an empty string lets us have an optional variable without having to set our own default
  host = var.docker_socket != "" ? var.docker_socket : null
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
}

# Ensure that an item titled "claude-code" exists in the 'setup-devenv' vault.
data "onepassword_item" "claude_code" {
  vault = data.onepassword_vault.setup_devenv.uuid
  title = "claude-code"
}

check "onepassword_vault" {
  assert {
    condition     = can(data.onepassword_vault.setup_devenv.uuid)
    error_message = "The 'setup-devenv' vault must exist in 1Password."
  }
}

check "claude_code_credential" {
  assert {
    condition     = local.claude_code_token != ""
    error_message = "The 'claude-code' item in 1Password must have a credential value with the OAuth token."
  }
}

data "coder_parameter" "system_prompt" {
  name         = "system_prompt"
  display_name = "System Prompt"
  type         = "string"
  form_type    = "textarea"
  description  = "System prompt for the agent with generalized instructions"
  mutable      = false
  default      = "You are a helpful assistant that can help with code. You are running inside a Coder Workspace and provide status updates to the user via Coder MCP. Stay on track, feel free to debug, but when the original plan fails, do not choose a different route/architecture without checking the user first."
}

data "coder_parameter" "ai_prompt" {
  type        = "string"
  name        = "AI Prompt"
  default     = ""
  description = "Write a prompt for Claude Code"
  mutable     = true
}

resource "coder_agent" "main" {
  arch           = data.coder_provisioner.me.arch
  os             = "linux"
  startup_script = <<-EOT
    set -e
    set +x
  EOT

  # These environment variables allow you to make Git commits right away after creating a
  # workspace. Note that they take precedence over configuration defined in ~/.gitconfig!
  # You can remove this block if you'd prefer to configure Git manually or using
  # dotfiles. (see docs/dotfiles.md)
  # env = {
  #   GIT_AUTHOR_NAME     = coalesce(data.coder_workspace_owner.me.full_name, data.coder_workspace_owner.me.name)
  #   GIT_AUTHOR_EMAIL    = "${data.coder_workspace_owner.me.email}"
  #   GIT_COMMITTER_NAME  = coalesce(data.coder_workspace_owner.me.full_name, data.coder_workspace_owner.me.name)
  #   GIT_COMMITTER_EMAIL = "${data.coder_workspace_owner.me.email}"
  # }

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
  count               = data.coder_workspace.me.start_count
  source              = "registry.coder.com/coder/claude-code/coder"
  version             = "3.0.0"
  agent_id            = coder_agent.main.id
  workdir             = "/workspaces/setup"
  ai_prompt           = data.coder_parameter.ai_prompt.value
  system_prompt       = data.coder_parameter.system_prompt.value
  install_claude_code = false
  order                   = 999
  claude_code_oauth_token = local.claude_code_token

  # Pre-hook script to wait for git repo and verify Claude is available
  pre_install_script = <<-EOT
    #!/bin/bash

    set -e
    set +x

    echo "⏳ Waiting for git repository at /workspaces/setup to be available..."

    # Wait up to 60 seconds for the git repo to be available
    WAIT_TIME=0
    MAX_WAIT=60

    while [ $WAIT_TIME -lt $MAX_WAIT ]; do
      if [ -d "/workspaces/setup/.git" ]; then
        # Check if git clone is complete by verifying:
        # 1. Git operations work (git status doesn't fail)
        # 2. The index file exists (created at the end of clone)
        # 3. At least one ref exists (shows clone is complete)
        if cd /workspaces/setup 2>/dev/null && \
           git status >/dev/null 2>&1 && \
           [ -f "/workspaces/setup/.git/index" ] && \
           [ -d "/workspaces/setup/.git/refs" ] && \
           [ "$(find /workspaces/setup/.git/refs -type f 2>/dev/null | head -n 1)" != "" ]; then
          echo "✅ Git repository clone completed successfully"
          echo "📋 Current branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
          echo "📋 Repository status:"
          git status --short
          break
        else
          echo "⏳ Git clone in progress... (.git exists but clone not complete)"
        fi
      fi

      if [ $WAIT_TIME -eq 0 ]; then
        echo "⏳ Git repository not found yet, waiting up to $MAX_WAIT seconds..."
      elif [ $(($WAIT_TIME % 10)) -eq 0 ]; then
        echo "⏳ Still waiting... ($WAIT_TIME/$MAX_WAIT seconds)"
      fi

      sleep 1
      WAIT_TIME=$((WAIT_TIME + 1))
    done

    # Check if we timed out
    if [ $WAIT_TIME -ge $MAX_WAIT ]; then
      echo "❌ Timeout: Git repository at /workspaces/setup not available after $MAX_WAIT seconds"
      echo "Directory contents of /workspaces:"
      ls -la /workspaces/ 2>/dev/null || echo "Cannot list /workspaces"
      exit 1
    fi

    echo "🔍 Verifying Claude Code is available..."

    echo command -v claude

    if command -v claude >/dev/null 2>&1; then
      echo "✅ Claude command found at: $(which claude)"

      # Test if claude actually works
      if claude --version >/dev/null 2>&1; then
        echo "📋 Claude version: $(claude --version)"
        echo "✅ Claude Code is working properly"
      else
        echo "❌ Claude command exists but failed to execute properly"
        echo "Error output:"
        claude --version 2>&1
        exit 1
      fi
    else
      echo "❌ Claude command not found in PATH"
      echo "PATH: $PATH"
      ls -la /home/coder/.local/setup/bin
      ls -la /home/coder/.local/setup/bin/
      exit 1
    fi

    echo "✅ Pre-hook validation completed successfully"
  EOT

  # TODO: install MCP servers etc?
  # post_install_script = data.coder_parameter.setup_script.value

  # This enables Coder Tasks
  report_tasks = true
}

# TODO: do we need this one?
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
