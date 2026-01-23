#!/usr/bin/env bats

# Setup function runs before each test
setup() {
  # Get the directory where this test file is located
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  PROJECT_DIR="$(dirname "${TEST_DIR}")"

  # Configuration
  TEMPLATE_NAME="${TEMPLATE_NAME:-coder-devcontainer-kubernetes}"
  WORKSPACE_NAME="test-$(date +%s)"
  GOSS_FILE="${TEST_DIR}/goss.yaml"
  RETRY_TIMEOUT="${RETRY_TIMEOUT:-10m}"
  RETRY_SLEEP="${RETRY_SLEEP:-15s}"

  # Get current git branch (fallback to main if not in a git repo)
  GIT_BRANCH="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"

  # Track whether cleanup is needed
  CLEANUP_NEEDED=false
}

# Teardown function runs after each test
teardown() {
  if [[ "${CLEANUP_NEEDED}" = true ]]; then
    echo "==> Cleaning up workspace: ${WORKSPACE_NAME}"
    coder delete --yes "${WORKSPACE_NAME}" 2>/dev/null || true
  fi
}

@test "goss file exists" {
  [ -f "${GOSS_FILE}" ]
}

@test "coder CLI is authenticated and available" {
  run coder list
  [ "$status" -eq 0 ]
}

@test "create workspace and validate with goss" {
  # Skip in CI if runInCI is false
  if [ "${CI:-false}" = "true" ]; then
    skip "Skipping workspace creation in CI (configured with runInCI: false)"
  fi

  echo "==> Starting workspace test"
  echo "    Template: ${TEMPLATE_NAME}"
  echo "    Workspace: ${WORKSPACE_NAME}"
  echo "    Git branch: ${GIT_BRANCH}"
  echo "    Goss file: ${GOSS_FILE}"

  # Create the workspace with minimal resources
  echo "==> Creating workspace..."
  CLEANUP_NEEDED=true
  run coder create "${WORKSPACE_NAME}" \
    --template "${TEMPLATE_NAME}" \
    --yes \
    --parameter cpu=2 \
    --parameter memory=4 \
    --parameter workspaces_volume_size=10 \
    --parameter "git_branch=${GIT_BRANCH}" \
    --parameter "AI Prompt=Workspace test - no action needed"

  [ "$status" -eq 0 ]

  echo "==> Workspace created, waiting for health checks..."

  # Export workspace name for goss to use
  export WORKSPACE_NAME

  # Run goss validation with retry logic
  echo "==> Running goss validation (timeout: ${RETRY_TIMEOUT}, sleep: ${RETRY_SLEEP})"
  cd "${PROJECT_DIR}"

  run goss -g "${GOSS_FILE}" validate --retry-timeout "${RETRY_TIMEOUT}" --sleep "${RETRY_SLEEP}"
  [ "$status" -eq 0 ]

  echo "==> All health checks passed!"
}
