#!/bin/bash
# DevPod Builder Entrypoint Script
# This script validates environment variables and orchestrates the DevPod workspace creation.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate required environment variables
validate_env() {
    local missing=""

    if [ -z "${CODER_AGENT_URL}" ]; then
        missing="${missing}CODER_AGENT_URL "
    fi

    if [ -z "${CODER_AGENT_TOKEN}" ]; then
        missing="${missing}CODER_AGENT_TOKEN "
    fi

    if [ -z "${DEVPOD_REPOSITORY}" ]; then
        missing="${missing}DEVPOD_REPOSITORY "
    fi

    if [ -n "${missing}" ]; then
        log_error "Missing required environment variables: ${missing}"
        echo ""
        echo "Required environment variables:"
        echo "  CODER_AGENT_URL    - Coder server URL (e.g., https://coder.example.com)"
        echo "  CODER_AGENT_TOKEN  - Coder workspace agent token"
        echo "  DEVPOD_REPOSITORY  - Git repository URL for DevPod workspace"
        echo ""
        echo "Optional environment variables:"
        echo "  DEVPOD_BRANCH      - Git branch to checkout (default: main)"
        echo "  DEVPOD_NAMESPACE   - Kubernetes namespace for workspace (default: coder-workspace)"
        echo "  DEVPOD_IDE         - IDE to configure (default: none)"
        echo "  DEVPOD_TIMEOUT     - Workspace creation timeout (default: 30m)"
        exit 1
    fi
}

# Configure DevPod Kubernetes provider
configure_provider() {
    log_info "Configuring DevPod Kubernetes provider..."

    # Set namespace (default: coder-workspace)
    local namespace="${DEVPOD_NAMESPACE:-coder-workspace}"

    # Set provider options
    devpod provider set-options kubernetes \
        --option KUBERNETES_NAMESPACE="${namespace}" \
        --option ARCHITECTURE=amd64

    log_info "Provider configured for namespace: ${namespace}"
}

# Create DevPod workspace
create_workspace() {
    local repo="${DEVPOD_REPOSITORY}"
    local branch="${DEVPOD_BRANCH:-}"
    local ide="${DEVPOD_IDE:-none}"
    local timeout="${DEVPOD_TIMEOUT:-30m}"

    log_info "Creating DevPod workspace..."
    log_info "  Repository: ${repo}"
    log_info "  Branch: ${branch:-default}"
    log_info "  IDE: ${ide}"
    log_info "  Timeout: ${timeout}"

    # Add branch to repository URL if specified (DevPod format: repo@branch)
    local repo_with_branch="${repo}"
    if [ -n "${branch}" ]; then
        repo_with_branch="${repo}@${branch}"
    fi

    # Build devpod up command with Coder environment variables
    local cmd="devpod up ${repo_with_branch} --ide ${ide} --provider kubernetes"

    # Inject Coder agent environment variables into the workspace
    # These allow the Coder agent to connect back to the Coder server
    if [ -n "${CODER_AGENT_TOKEN}" ]; then
        cmd="${cmd} --workspace-env CODER_AGENT_TOKEN=${CODER_AGENT_TOKEN}"
    fi
    if [ -n "${CODER_AGENT_URL}" ]; then
        cmd="${cmd} --workspace-env CODER_AGENT_URL=${CODER_AGENT_URL}"
    fi

    # Execute devpod command (log streaming disabled for now as it requires agent auth)
    log_info "Running DevPod..."
    eval "${cmd}"
}

# Start the Coder agent in the workspace
start_coder_agent() {
    if [ -z "${CODER_INIT_SCRIPT}" ]; then
        log_warn "CODER_INIT_SCRIPT not provided, skipping agent startup"
        return
    fi

    log_info "Starting Coder agent in workspace..."

    # Get the workspace name - DevPod uses the branch name if available, otherwise repo name
    # When building repo@branch, DevPod derives workspace name from the branch
    local workspace_name
    if [ -n "${DEVPOD_BRANCH}" ]; then
        # Use branch name, sanitized the same way DevPod does it
        workspace_name=$(echo "${DEVPOD_BRANCH}" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
    else
        # Fall back to repository name
        workspace_name=$(basename "${DEVPOD_REPOSITORY}" .git | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g')
    fi

    log_info "DevPod workspace name: ${workspace_name}"

    # Write the init script to a temp file
    local init_script_file="/tmp/coder-init-script.sh"
    echo "${CODER_INIT_SCRIPT}" > "${init_script_file}"
    chmod +x "${init_script_file}"

    # Copy the init script to the workspace and execute it in the background
    # Using devpod ssh to execute the script inside the workspace container
    log_info "Copying init script to workspace..."
    cat "${init_script_file}" | devpod ssh "${workspace_name}" -- bash -c 'cat > /tmp/coder-init.sh && chmod +x /tmp/coder-init.sh'

    log_info "Executing Coder agent init script (running in background)..."
    devpod ssh "${workspace_name}" -- bash -c 'nohup /tmp/coder-init.sh > /tmp/coder-agent.log 2>&1 &'

    log_info "Coder agent startup initiated"
}

# Main execution
main() {
    log_info "DevPod Builder starting..."
    log_info "DevPod version: $(devpod version)"

    # Validate environment
    validate_env

    # Configure provider
    configure_provider

    # Create workspace
    create_workspace

    # Start Coder agent in the workspace
    start_coder_agent

    log_info "DevPod workspace creation complete!"
}

# Run main or execute provided command
if [ "$#" -gt 0 ]; then
    # If arguments provided, execute them directly
    exec "$@"
else
    # Otherwise run the main workflow
    main
fi
