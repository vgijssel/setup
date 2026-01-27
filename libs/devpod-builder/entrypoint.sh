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

    # Add init script if provided (for Coder agent startup)
    if [ -n "${CODER_INIT_SCRIPT}" ]; then
        # Write init script to a file to pass it properly
        echo "${CODER_INIT_SCRIPT}" > /tmp/coder-init.sh
        chmod +x /tmp/coder-init.sh
        cmd="${cmd} --workspace-env CODER_INIT_SCRIPT_PATH=/tmp/coder-init.sh"
    fi

    # Execute devpod command (log streaming disabled for now as it requires agent auth)
    log_info "Running DevPod..."
    eval "${cmd}"
}

# Inject Coder agent into the workspace pod
inject_coder_agent() {
    log_info "Coder agent injection will be handled by Terraform..."
    # Note: The actual Coder agent injection happens via Terraform
    # by setting environment variables in the DevPod-created pod.
    # This function is a placeholder for any additional post-creation steps.
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

    # Post-creation steps
    inject_coder_agent

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
