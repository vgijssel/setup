#!/usr/bin/env bash
# End-to-end test for Coder workspace template
# Creates a workspace, validates health with goss, and cleans up

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Configuration
TEMPLATE_NAME="${TEMPLATE_NAME:-coder-devcontainer-kubernetes}"
WORKSPACE_NAME="test-$(date +%s)"
GOSS_FILE="${PROJECT_DIR}/goss-workspace.yaml"
RETRY_TIMEOUT="${RETRY_TIMEOUT:-10m}"
RETRY_SLEEP="${RETRY_SLEEP:-15s}"

# Get current git branch (fallback to main if not in a git repo)
GIT_BRANCH="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"

# Track whether cleanup is needed
CLEANUP_NEEDED=false

cleanup() {
    if [ "$CLEANUP_NEEDED" = true ]; then
        echo "==> Cleaning up workspace: ${WORKSPACE_NAME}"
        coder delete --yes "${WORKSPACE_NAME}" 2>/dev/null || true
    fi
}

# Ensure cleanup runs on exit, error, or interrupt
trap cleanup EXIT

main() {
    echo "==> Starting workspace test"
    echo "    Template: ${TEMPLATE_NAME}"
    echo "    Workspace: ${WORKSPACE_NAME}"
    echo "    Git branch: ${GIT_BRANCH}"
    echo "    Goss file: ${GOSS_FILE}"

    # Verify goss file exists
    if [ ! -f "$GOSS_FILE" ]; then
        echo "ERROR: Goss file not found: ${GOSS_FILE}"
        exit 1
    fi

    # Verify coder CLI is available and authenticated
    if ! coder list >/dev/null 2>&1; then
        echo "ERROR: coder CLI not authenticated or not available"
        exit 1
    fi

    # Create the workspace with minimal resources
    # Pass all immutable parameters to avoid prompts (--yes only bypasses confirmation prompts)
    # Parameter names come from the "name" field in coder_parameter resources
    echo "==> Creating workspace..."
    CLEANUP_NEEDED=true
    coder create "${WORKSPACE_NAME}" \
        --template "${TEMPLATE_NAME}" \
        --yes \
        --parameter cpu=2 \
        --parameter memory=4 \
        --parameter workspaces_volume_size=10 \
        --parameter "git_branch=${GIT_BRANCH}" \
        --parameter "devcontainer_builder=ghcr.io/coder/envbuilder:1.2.0" \
        --parameter "AI Prompt=Workspace test - no action needed"

    echo "==> Workspace created, waiting for health checks..."

    # Export workspace name for goss to use
    export WORKSPACE_NAME

    # Run goss validation with retry logic
    echo "==> Running goss validation (timeout: ${RETRY_TIMEOUT}, sleep: ${RETRY_SLEEP})"
    cd "$PROJECT_DIR"

    if goss -g "$GOSS_FILE" validate --retry-timeout "$RETRY_TIMEOUT" --sleep "$RETRY_SLEEP"; then
        echo "==> All health checks passed!"
        exit 0
    else
        echo "==> Health checks failed!"
        exit 1
    fi
}

main "$@"
