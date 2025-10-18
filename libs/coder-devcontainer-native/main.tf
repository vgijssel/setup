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
  image_version = local.package_json.dependencies.workspace
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
}

variable "docker_socket" {
  default     = ""
  description = "(Optional) Docker socket URI"
  type        = string
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

data "coder_parameter" "repo_url" {
  type         = "string"
  name         = "repo_url"
  display_name = "Git Repository"
  description  = "Enter the URL of the Git repository to clone into your workspace. This repository should contain a devcontainer.json file to configure your development environment."
  default      = "git@github.com:vgijssel/setup.git"
  mutable      = true
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

resource "coder_agent" "main" {
  arch            = data.coder_provisioner.me.arch
  os              = "linux"
  startup_script  = <<-EOT
    set -e

    # Prepare user home with default files on first start.
    if [ ! -f ~/.init_done ]; then
      cp -rT /etc/skel ~
      touch ~/.init_done
    fi

    # Add any commands that should be executed at workspace startup
    # (e.g. install requirements, start a program, etc) here.
  EOT
  shutdown_script = <<-EOT
    set -e

    # Clean up the docker volume from unused resources to keep storage
    # usage low.
    #
    # WARNING! This will remove:
    #   - all stopped containers
    #   - all networks not used by at least one container
    #   - all images without at least one container associated to them
    #   - all build cache
    docker system prune -a -f

    # Stop the Docker service.
    sudo service docker stop
  EOT

  env = {
    GIT_AUTHOR_NAME     = coalesce(data.coder_workspace_owner.me.full_name, data.coder_workspace_owner.me.name)
    GIT_AUTHOR_EMAIL    = "${data.coder_workspace_owner.me.email}"
    GIT_COMMITTER_NAME  = coalesce(data.coder_workspace_owner.me.full_name, data.coder_workspace_owner.me.name)
    GIT_COMMITTER_EMAIL = "${data.coder_workspace_owner.me.email}"
  }

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

resource "coder_script" "init_docker_in_docker" {
  count        = data.coder_workspace.me.start_count
  agent_id     = coder_agent.main.id
  display_name = "Initialize Docker-in-Docker"
  run_on_start = true
  icon         = "/icon/docker.svg"
  script       = file("${path.module}/scripts/init-docker-in-docker.sh")
}

# See https://registry.coder.com/modules/coder/devcontainers-cli
module "devcontainers-cli" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/devcontainers-cli/coder"
  version  = "1.0.0"
  agent_id = coder_agent.main.id
}

# See https://registry.coder.com/modules/coder/git-clone
module "git-clone" {
  count    = data.coder_workspace.me.start_count
  source   = "registry.coder.com/coder/git-clone/coder"
  version  = "1.1.1"
  agent_id = coder_agent.main.id
  url      = data.coder_parameter.repo_url.value
  base_dir = "/workspaces"
}

# Automatically start the devcontainer for the workspace.
resource "coder_devcontainer" "repo" {
  count            = data.coder_workspace.me.start_count
  agent_id         = coder_agent.main.id
  workspace_folder = "/workspaces/${module.git-clone[0].folder_name}"
}

# The Claude Code module does the automatic task reporting
# Other agent modules: https://registry.coder.com/modules?search=agent
# Or use a custom agent:

module "claude-code" {
  count                   = data.coder_workspace.me.start_count
  source                  = "registry.coder.com/coder/claude-code/coder"
  version                 = "3.0.0"
  agent_id                = coder_agent.main.id
  workdir                 = "/workspaces/${module.git-clone[0].folder_name}"
  ai_prompt               = data.coder_parameter.ai_prompt.value
  system_prompt           = data.coder_parameter.system_prompt.value
  install_claude_code     = false
  order                   = 999
  claude_code_oauth_token = local.claude_code_token

  # Pre-hook script to wait for git repo and verify Claude is available
  pre_install_script = <<-EOT
    wait-for-git --dir /workspaces/${module.git-clone[0].folder_name}
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
  folder   = "/workspaces/${module.git-clone[0].folder_name}"
  order    = 1
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

resource "docker_volume" "docker_volume" {
  name = "coder-${data.coder_workspace.me.id}-docker"
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

resource "docker_container" "workspace" {
  count = data.coder_workspace.me.start_count
  image = "ghcr.io/vgijssel/setup/devcontainer:${local.image_version}"

  # NOTE: The `privileged` mode is one way to run Docker-in-Docker,
  # which is required for the devcontainer to work. If this is not
  # desired, you can remove this line. However, you will need to ensure
  # that the devcontainer can run Docker commands in some other way.
  # Mounting the host Docker socket is strongly discouraged because
  # workspaces will then compete for control of the devcontainers.
  # For more information, see:
  # https://coder.com/docs/admin/templates/extending-templates/docker-in-workspaces
  privileged = true

  # Uses lower() to avoid Docker restriction on container names.
  name = "coder-${data.coder_workspace_owner.me.name}-${lower(data.coder_workspace.me.name)}"
  # Hostname makes the shell more user friendly: coder@my-workspace:~$
  hostname = data.coder_workspace.me.name
  # Use the docker gateway if the access URL is 127.0.0.1
  command = ["sh", "-c", replace(coder_agent.main.init_script, "/localhost|127\\.0\\.0\\.1/", "host.docker.internal")]
  env = [
    "CODER_AGENT_TOKEN=${coder_agent.main.token}"
  ]
  host {
    host = "host.docker.internal"
    ip   = "host-gateway"
  }

  # Workspace home volume persists user data across workspace restarts.
  volumes {
    container_path = "/home/coder"
    volume_name    = docker_volume.home_volume.name
    read_only      = false
  }

  # Workspace docker volume persists Docker data across workspace
  # restarts, allowing the devcontainer cache to be reused.
  volumes {
    container_path = "/var/lib/docker"
    volume_name    = docker_volume.docker_volume.name
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
