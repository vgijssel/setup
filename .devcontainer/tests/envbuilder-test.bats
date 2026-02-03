#!/usr/bin/env bats

# envbuilder-test.bats - BATS tests for envbuilder compatibility
#
# These tests validate that the devcontainer can be built with envbuilder,
# mirroring the configuration from libs/coder-devcontainer-kubernetes/main.tf.
#
# Features:
# - Uses local Docker registry for layer caching
# - Validates envbuilder can build the devcontainer image
# - Speeds up iteration when testing Dockerfile changes
#
# Usage:
#   moon run devcontainer:envbuilder-test   # Run via moon (recommended)
#   bats tests/envbuilder-test.bats         # Run directly from .devcontainer/

# Setup function runs before each test
setup() {
  TEST_DIR="$(cd "$(dirname "${BATS_TEST_FILENAME}")" && pwd)"
  DEVCONTAINER_DIR="$(dirname "${TEST_DIR}")"

  # Configuration - mirrors main.tf envbuilder_cached_image settings
  ENVBUILDER_IMAGE="${ENVBUILDER_IMAGE:-ghcr.io/coder/envbuilder:1.2.0}"
  CONTAINER_NAME="envbuilder-test-$$"

  # Registry configuration from environment
  REGISTRY_PORT="${SETUP_REGISTRY_PORT:-5050}"
  REGISTRY_NAME="${SETUP_REGISTRY_NAME:-setup-local-registry}"

  # Unset DOCKER_CONFIG to avoid issues with VS Code devcontainer credential helpers
  unset DOCKER_CONFIG
}

# Teardown function runs after each test
teardown() {
  # Clean up container if it exists
  docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

  # Clean up temp repo if it was created
  if [ -n "${TEMP_REPO_DIR:-}" ] && [ -d "${TEMP_REPO_DIR}" ]; then
    rm -rf "${TEMP_REPO_DIR}"
  fi
}

@test "registry is running" {
  run docker ps --format '{{.Names}}' --filter "name=^${REGISTRY_NAME}$"
  [ "$status" -eq 0 ]
  [[ "$output" =~ "${REGISTRY_NAME}" ]]
}

@test "registry is accessible" {
  run curl -sf "http://localhost:${REGISTRY_PORT}/v2/"
  [ "$status" -eq 0 ]
}

@test "envbuilder image can be pulled" {
  run docker pull "${ENVBUILDER_IMAGE}"
  [ "$status" -eq 0 ]
}

@test "envbuilder builds devcontainer successfully" {
  # Clone local repo to a temporary directory for clean testing
  # This ensures envbuilder sees a clean git state without uncommitted changes
  TEMP_REPO_DIR=$(mktemp -d)
  echo "Cloning local repo to: ${TEMP_REPO_DIR}"
  git clone "${SETUP_DIR}" "${TEMP_REPO_DIR}"

  echo "=== Envbuilder Test Configuration ==="
  echo "ENVBUILDER_IMAGE: ${ENVBUILDER_IMAGE}"
  echo "TEMP_REPO_DIR: ${TEMP_REPO_DIR}"
  echo "CONTAINER_NAME: ${CONTAINER_NAME}"
  echo "REGISTRY: host.docker.internal:${REGISTRY_PORT}"
  echo "======================================"

  # Run envbuilder with cloned local repo
  #
  # Key difference from main.tf:
  #   - No ENVBUILDER_GIT_URL: Uses mounted local clone instead of remote git
  #   - Mount cloned repo to /workspaces/setup
  #   - Much faster iteration since no network git clone
  run docker run \
    --name "${CONTAINER_NAME}" \
    --privileged \
    --add-host=host.docker.internal:host-gateway \
    -v "${TEMP_REPO_DIR}:/workspaces/setup" \
    -e ENVBUILDER_DEVCONTAINER_DIR=".devcontainer" \
    -e ENVBUILDER_WORKSPACE_FOLDER="/workspaces/setup" \
    -e ENVBUILDER_CACHE_REPO="host.docker.internal:${REGISTRY_PORT}/envbuilder-cache" \
    -e ENVBUILDER_INSECURE="true" \
    -e ENVBUILDER_PUSH_IMAGE="true" \
    -e ENVBUILDER_VERBOSE="false" \
    -e ENVBUILDER_INIT_SCRIPT="exit 0" \
    "${ENVBUILDER_IMAGE}"

  echo "Output: ${output}"
  [ "$status" -eq 0 ]
}

@test "envbuilder cache layers exist in registry" {
  # This test verifies that the previous test pushed cache layers
  run curl -sf "http://localhost:${REGISTRY_PORT}/v2/envbuilder-cache/tags/list"
  [ "$status" -eq 0 ]

  # Parse the response to check for tags
  TAGS_COUNT=$(echo "$output" | jq -r '.tags | length' 2>/dev/null || echo "0")
  echo "Cached layers: ${TAGS_COUNT}"
  [ "${TAGS_COUNT}" -gt 0 ]
}
