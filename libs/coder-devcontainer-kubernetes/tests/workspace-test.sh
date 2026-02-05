#!/bin/bash
# Workspace test script - validates Coder workspace health without bats
# This script replaces the bats test runner to avoid hermit symlink issues

set -euo pipefail

# Configuration
TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${TEST_DIR}")"
TEMPLATE_NAME="${TEMPLATE_NAME:-coder-devcontainer-kubernetes}"
WORKSPACE_NAME="test-$(date +%s)"
GOSS_FILE="${TEST_DIR}/goss.yaml"
RETRY_TIMEOUT="${RETRY_TIMEOUT:-10m}"
RETRY_SLEEP="${RETRY_SLEEP:-15s}"
GIT_BRANCH="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"
CLEANUP_NEEDED=false

# Cleanup function
cleanup() {
  if [[ "${CLEANUP_NEEDED}" = true ]]; then
    echo "==> Cleaning up workspace: ${WORKSPACE_NAME}"
    coder delete --yes "${WORKSPACE_NAME}" 2>/dev/null || true
  fi
}

# Set up cleanup trap
trap cleanup EXIT

# Test 1: Check goss file exists
echo "==> Test 1: Checking goss file exists..."
if [[ ! -f "${GOSS_FILE}" ]]; then
  echo "ERROR: Goss file not found at ${GOSS_FILE}"
  exit 1
fi
echo "✓ Goss file exists"

# Test 2: Check coder CLI is authenticated
echo "==> Test 2: Checking coder CLI authentication..."
if ! coder list >/dev/null 2>&1; then
  echo "ERROR: Coder CLI is not authenticated or not available"
  exit 1
fi
echo "✓ Coder CLI is authenticated"

# Test 3: Create workspace and validate
if [[ "${CI:-false}" = "true" ]]; then
  echo "==> Test 3: Skipped (CI environment, runInCI: false)"
  echo "All tests passed (CI mode)"
  exit 0
fi

echo "==> Test 3: Creating workspace and validating with goss..."
echo "    Template: ${TEMPLATE_NAME}"
echo "    Workspace: ${WORKSPACE_NAME}"
echo "    Git branch: ${GIT_BRANCH}"
echo "    Goss file: ${GOSS_FILE}"

# Create the workspace
echo "==> Creating workspace..."
CLEANUP_NEEDED=true
if ! coder create "${WORKSPACE_NAME}" \
  --template "${TEMPLATE_NAME}" \
  --yes \
  --parameter cpu=2 \
  --parameter memory=4 \
  --parameter workspaces_volume_size=10 \
  --parameter "git_branch=${GIT_BRANCH}" \
  --parameter "AI Prompt=Workspace test - no action needed"; then
  echo "ERROR: Failed to create workspace"
  exit 1
fi

echo "==> Workspace created, waiting for health checks..."

# Export workspace name for goss
export WORKSPACE_NAME

# Run goss validation
echo "==> Running goss validation (timeout: ${RETRY_TIMEOUT}, sleep: ${RETRY_SLEEP})"
cd "${PROJECT_DIR}"

if ! goss -g "${GOSS_FILE}" validate --retry-timeout "${RETRY_TIMEOUT}" --sleep "${RETRY_SLEEP}"; then
  echo "ERROR: Goss validation failed"
  exit 1
fi

echo "==> All health checks passed!"
echo "✓ All tests passed"
