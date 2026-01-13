#!/bin/bash
# envbuilder-test.sh - Fast validation loop for testing envbuilder compatibility
#
# This script runs envbuilder locally with similar configuration to
# libs/coder-devcontainer-kubernetes/main.tf to validate devcontainer builds.
#
# Features:
# - Spins up a local Docker registry for layer caching
# - Configures envbuilder to push/pull cached layers
# - Speeds up iteration when testing Dockerfile changes
#
# Usage:
#   ./envbuilder-test.sh                    # Run from .devcontainer directory
#   moon run devcontainer:envbuilder-test   # Run via moon

set -euo pipefail

# Configuration - mirrors main.tf envbuilder_cached_image settings
# Pin to specific version for reproducibility (avoid :latest)
ENVBUILDER_IMAGE="${ENVBUILDER_IMAGE:-ghcr.io/coder/envbuilder:1.2.0}"

# Local repo path - mount local directory instead of git clone
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_REPO_PATH="${LOCAL_REPO_PATH:-$(dirname "${SCRIPT_DIR}")}"

# Container name
CONTAINER_NAME="envbuilder-test-$$"

# Create a temporary Docker config directory without broken credential helpers
# This avoids issues with VS Code devcontainer credential helpers
DOCKER_CONFIG_DIR=$(mktemp -d)
echo '{"auths":{}}' > "${DOCKER_CONFIG_DIR}/config.json"
export DOCKER_CONFIG="${DOCKER_CONFIG_DIR}"

echo "=== Envbuilder Test Configuration ==="
echo "ENVBUILDER_IMAGE: ${ENVBUILDER_IMAGE}"
echo "LOCAL_REPO_PATH: ${LOCAL_REPO_PATH}"
echo "MODE: Local files (no git clone)"
echo "CONTAINER_NAME: ${CONTAINER_NAME}"
echo "======================================"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "=== Cleanup ==="
    docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
    rm -rf "${DOCKER_CONFIG_DIR}" 2>/dev/null || true
    # Note: Registry persists between runs for cache
    # To clear: docker volume rm envbuilder-registry-data
    # To stop:  docker rm -f envbuilder-registry
}
trap cleanup EXIT

# Start local Docker registry for layer caching (persists between runs)
REGISTRY_NAME="envbuilder-registry"
REGISTRY_PORT="${REGISTRY_PORT:-5050}"
echo "=== Setting up Registry Cache ==="
if docker ps --format '{{.Names}}' | grep -q "^${REGISTRY_NAME}$"; then
    echo "Registry already running at localhost:${REGISTRY_PORT}"
else
    echo "Starting registry at localhost:${REGISTRY_PORT}..."
    docker rm -f "${REGISTRY_NAME}" 2>/dev/null || true
    docker run -d --name "${REGISTRY_NAME}" --restart always \
        -p "${REGISTRY_PORT}:5000" \
        -v envbuilder-registry-data:/var/lib/registry \
        registry:2
    sleep 2
fi
CACHED_TAGS=$(curl -s "http://localhost:${REGISTRY_PORT}/v2/envbuilder-cache/tags/list" 2>/dev/null | jq -r '.tags | length' 2>/dev/null || echo "0")
echo "Cached layers: ${CACHED_TAGS}"
echo ""

# Run envbuilder with local files mode
# See: https://github.com/coder/envbuilder/blob/main/docs/using-local-files.md
#
# Key difference from main.tf:
#   - No ENVBUILDER_GIT_URL: Uses mounted local files instead
#   - Mount LOCAL_REPO_PATH to /workspaces/setup
#   - Much faster iteration since no network git clone
echo "=== Running Envbuilder ==="
docker run \
    --name "${CONTAINER_NAME}" \
    --privileged \
    --add-host=host.docker.internal:host-gateway \
    -v "${LOCAL_REPO_PATH}:/workspaces/setup" \
    -e ENVBUILDER_DEVCONTAINER_DIR=".devcontainer" \
    -e ENVBUILDER_WORKSPACE_FOLDER="/workspaces/setup" \
    -e ENVBUILDER_CACHE_REPO="host.docker.internal:${REGISTRY_PORT}/envbuilder-cache" \
    -e ENVBUILDER_INSECURE="true" \
    -e ENVBUILDER_PUSH_IMAGE="true" \
    -e ENVBUILDER_INIT_SCRIPT="echo 'Envbuilder test complete'" \
    -e ENVBUILDER_VERBOSE="true" \
    "${ENVBUILDER_IMAGE}"

echo ""
echo "=== Envbuilder Test Complete ==="
echo "The devcontainer was built successfully by envbuilder."
echo ""
echo "Registry cache at: localhost:${REGISTRY_PORT}/envbuilder-cache"
echo "To clear cache: docker volume rm envbuilder-registry-data"
echo "To stop registry: docker rm -f envbuilder-registry"
