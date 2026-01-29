#!/bin/bash
# Devcontainer Builder Entrypoint Script
# This script validates environment variables and orchestrates the devcontainer workspace creation.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Start Docker daemon internally (for privileged container mode)
start_docker() {
    local max_attempts=30
    local attempt=1

    log_info "Starting Docker daemon..."

    # Start dockerd in the background
    dockerd --host=unix:///var/run/docker.sock --storage-driver=overlay2 > /var/log/dockerd.log 2>&1 &
    DOCKERD_PID=$!

    log_info "Waiting for Docker daemon to be ready (PID: ${DOCKERD_PID})..."

    while [ $attempt -le $max_attempts ]; do
        if docker info >/dev/null 2>&1; then
            log_info "Docker daemon is ready"
            return 0
        fi
        log_info "Attempt ${attempt}/${max_attempts}: Docker not ready, waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done

    log_error "Docker daemon did not become ready after ${max_attempts} attempts"
    log_error "Docker daemon logs:"
    cat /var/log/dockerd.log >&2 || true
    return 1
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

    if [ -z "${DEVCONTAINER_REPOSITORY}" ]; then
        missing="${missing}DEVCONTAINER_REPOSITORY "
    fi

    if [ -n "${missing}" ]; then
        log_error "Missing required environment variables: ${missing}"
        echo "" >&2
        echo "Required environment variables:" >&2
        echo "  CODER_AGENT_URL         - Coder server URL (e.g., https://coder.example.com)" >&2
        echo "  CODER_AGENT_TOKEN       - Coder workspace agent token" >&2
        echo "  DEVCONTAINER_REPOSITORY - Git repository URL for workspace" >&2
        echo "" >&2
        echo "Optional environment variables:" >&2
        echo "  DEVCONTAINER_BRANCH     - Git branch to checkout (default: main)" >&2
        echo "  DEVCONTAINER_CACHE_FROM - Cache source for devcontainer build" >&2
        echo "  DEVCONTAINER_CACHE_TO   - Cache destination for devcontainer build" >&2
        echo "  DEVCONTAINER_TIMEOUT    - Workspace creation timeout (default: 30m)" >&2
        echo "  CODER_INIT_SCRIPT       - Script to run Coder agent in container" >&2
        exit 1
    fi
}

# Clone repository to /workspaces/
clone_repository() {
    local repo_url="${DEVCONTAINER_REPOSITORY}"
    local branch="${DEVCONTAINER_BRANCH:-main}"
    local repo_name
    repo_name=$(basename "${repo_url}" .git)
    local workspace_folder="/workspaces/${repo_name}"

    if [ ! -d "${workspace_folder}" ]; then
        log_info "Cloning ${repo_url} (branch: ${branch}) to ${workspace_folder}"
        mkdir -p /workspaces
        git clone --branch "${branch}" --single-branch "${repo_url}" "${workspace_folder}" >&2
    else
        log_info "Workspace already exists at ${workspace_folder}, pulling latest..."
        (cd "${workspace_folder}" && git pull origin "${branch}") >&2
    fi

    # Only output the workspace folder path to stdout (for capture)
    echo "${workspace_folder}"
}

# Run devcontainer up
run_devcontainer() {
    local workspace_folder="$1"
    local cache_from="${DEVCONTAINER_CACHE_FROM:-}"
    local cache_to="${DEVCONTAINER_CACHE_TO:-}"

    log_info "Building and starting devcontainer..."
    log_info "  Workspace folder: ${workspace_folder}"

    # Build the devcontainer up command
    local cmd="devcontainer up --workspace-folder ${workspace_folder}"

    # Add cache options if provided
    if [ -n "${cache_from}" ]; then
        cmd="${cmd} --cache-from ${cache_from}"
        log_info "  Cache from: ${cache_from}"
    fi
    if [ -n "${cache_to}" ]; then
        cmd="${cmd} --cache-to ${cache_to}"
        log_info "  Cache to: ${cache_to}"
    fi

    # Add remote environment variables for Coder agent
    cmd="${cmd} --remote-env CODER_AGENT_URL=${CODER_AGENT_URL}"
    cmd="${cmd} --remote-env CODER_AGENT_TOKEN=${CODER_AGENT_TOKEN}"

    log_info "Running: ${cmd}"

    # Execute with log streaming
    if [ -n "${CODER_AGENT_URL}" ] && [ -n "${CODER_AGENT_TOKEN}" ]; then
        log_info "Streaming devcontainer logs to Coder..."
        eval "${cmd}" 2>&1 | /app/log-streamer.py --source-name "Devcontainer Build"
    else
        log_warn "CODER_AGENT_URL or CODER_AGENT_TOKEN not set, logs won't be streamed to Coder"
        eval "${cmd}"
    fi
}

# Start Coder agent in the devcontainer
start_coder_agent() {
    if [ -z "${CODER_INIT_SCRIPT}" ]; then
        log_warn "CODER_INIT_SCRIPT not provided, skipping agent startup"
        return
    fi

    local workspace_folder="$1"

    log_info "Starting Coder agent in devcontainer..."

    # Write the init script to a temp file
    local init_script_file="/tmp/coder-init-script.sh"
    echo "${CODER_INIT_SCRIPT}" > "${init_script_file}"
    chmod +x "${init_script_file}"

    # Base64 encode the script to avoid shell interpretation issues
    local encoded_script
    encoded_script=$(base64 -w0 "${init_script_file}")

    # Use devcontainer exec to run the init script inside the container
    log_info "Injecting Coder agent init script via devcontainer exec..."
    local copy_cmd="echo '${encoded_script}' | base64 -d > /tmp/coder-init.sh && chmod +x /tmp/coder-init.sh"

    for attempt in 1 2 3; do
        log_info "Attempt ${attempt}/3: Copying init script..."
        if devcontainer exec --workspace-folder "${workspace_folder}" /bin/bash -c "${copy_cmd}" 2>&1; then
            break
        fi
        if [ "${attempt}" -eq 3 ]; then
            log_error "Failed to copy init script after 3 attempts"
            return 1
        fi
        log_warn "Copy attempt ${attempt} failed, retrying in 5s..."
        sleep 5
    done

    # Verify init script was copied
    log_info "Verifying init script was copied..."
    if ! devcontainer exec --workspace-folder "${workspace_folder}" test -f /tmp/coder-init.sh; then
        log_error "Init script was not created in workspace"
        return 1
    fi
    log_info "Init script copied successfully"

    # Execute the init script in the background with required environment variables
    log_info "Executing Coder agent init script (running in background)..."
    devcontainer exec --workspace-folder "${workspace_folder}" /bin/bash -c "export CODER_AGENT_TOKEN='${CODER_AGENT_TOKEN}'; nohup /bin/bash /tmp/coder-init.sh > /tmp/coder-agent.log 2>&1 &" 2>&1

    # Give the agent a moment to start
    sleep 3

    # Verify Coder agent is running
    log_info "Verifying Coder agent is running..."
    if devcontainer exec --workspace-folder "${workspace_folder}" pgrep -f "coder agent" >/dev/null 2>&1; then
        log_info "Coder agent process is running"
    else
        log_warn "Could not verify agent process, checking logs..."
        devcontainer exec --workspace-folder "${workspace_folder}" head -20 /tmp/coder-agent.log 2>&1 || true
    fi

    log_info "Coder agent startup initiated"
}

# Main execution
main() {
    log_info "Devcontainer Builder starting..."
    log_info "Devcontainer CLI version: $(devcontainer --version)"

    # Validate environment
    validate_env

    # Start Docker daemon (running in privileged mode)
    start_docker

    # Clone repository
    local workspace_folder
    workspace_folder=$(clone_repository)

    # Run devcontainer
    run_devcontainer "${workspace_folder}"

    # Start Coder agent in the devcontainer
    start_coder_agent "${workspace_folder}"

    log_info "Devcontainer workspace creation complete!"
}

# Run main or execute provided command
if [ "$#" -gt 0 ]; then
    # If arguments provided, execute them directly
    exec "$@"
else
    # Otherwise run the main workflow
    main
fi
