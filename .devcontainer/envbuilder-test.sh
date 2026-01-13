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
ENVBUILDER_IMAGE="${ENVBUILDER_IMAGE:-ghcr.io/coder/envbuilder:latest}"
GIT_BRANCH="${GIT_BRANCH:-$(git -C .. rev-parse --abbrev-ref HEAD)}"
REPO_URL="${REPO_URL:-https://github.com/vgijssel/setup.git}"

# Container names
CONTAINER_NAME="envbuilder-test-$$"
REGISTRY_NAME="envbuilder-registry"
REGISTRY_PORT="${REGISTRY_PORT:-5050}"
CACHE_REPO="localhost:${REGISTRY_PORT}/envbuilder-cache"

# Create a temporary Docker config directory without broken credential helpers
# This avoids issues with VS Code devcontainer credential helpers
DOCKER_CONFIG_DIR=$(mktemp -d)
echo '{"auths":{}}' > "${DOCKER_CONFIG_DIR}/config.json"
export DOCKER_CONFIG="${DOCKER_CONFIG_DIR}"

echo "=== Envbuilder Test Configuration ==="
echo "ENVBUILDER_IMAGE: ${ENVBUILDER_IMAGE}"
echo "GIT_BRANCH: ${GIT_BRANCH}"
echo "REPO_URL: ${REPO_URL}#${GIT_BRANCH}"
echo "CONTAINER_NAME: ${CONTAINER_NAME}"
echo "REGISTRY_NAME: ${REGISTRY_NAME}"
echo "CACHE_REPO: ${CACHE_REPO}"
echo "======================================"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "=== Cleanup ==="
    docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
    rm -rf "${DOCKER_CONFIG_DIR}" 2>/dev/null || true
    # Note: Registry is kept running for cache persistence between runs
    # To stop: docker rm -f envbuilder-registry
}
trap cleanup EXIT

# Start local Docker registry if not already running
# The registry persists between runs to maintain the cache
echo "=== Setting up Local Registry ==="
if docker ps --format '{{.Names}}' | grep -q "^${REGISTRY_NAME}$"; then
    echo "Registry already running at localhost:${REGISTRY_PORT}"
else
    echo "Starting local registry at localhost:${REGISTRY_PORT}..."
    # Remove any stopped registry container with the same name
    docker rm -f "${REGISTRY_NAME}" 2>/dev/null || true
    docker run -d \
        --name "${REGISTRY_NAME}" \
        --restart always \
        -p "${REGISTRY_PORT}:5000" \
        -v envbuilder-registry-data:/var/lib/registry \
        registry:2
    # Wait for registry to be ready
    echo "Waiting for registry to be ready..."
    for i in {1..10}; do
        if curl -s "http://localhost:${REGISTRY_PORT}/v2/" > /dev/null 2>&1; then
            echo "Registry is ready"
            break
        fi
        sleep 1
    done
fi
echo ""

# Run envbuilder with configuration matching main.tf
# Key environment variables from main.tf envbuilder_cached_image resource:
#   - git_url: includes branch via #branch suffix
#   - devcontainer_dir: .devcontainer
#   - workspace_folder: /workspaces/setup
#   - remote_repo_build_mode: false
#   - cache_repo: local registry for caching (mirrors main.tf setup)
#   - insecure: true (local registry doesn't use TLS)
echo "=== Running Envbuilder ==="
docker run \
    --name "${CONTAINER_NAME}" \
    --privileged \
    --add-host=host.docker.internal:host-gateway \
    -e ENVBUILDER_GIT_URL="${REPO_URL}#${GIT_BRANCH}" \
    -e ENVBUILDER_DEVCONTAINER_DIR=".devcontainer" \
    -e ENVBUILDER_WORKSPACE_FOLDER="/workspaces/setup" \
    -e ENVBUILDER_REMOTE_REPO_BUILD_MODE="false" \
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
echo "Cache stored at: ${CACHE_REPO}"
echo "To clear cache: docker volume rm envbuilder-registry-data"
echo "To stop registry: docker rm -f ${REGISTRY_NAME}"
