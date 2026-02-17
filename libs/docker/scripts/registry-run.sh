#!/usr/bin/env bash
set -euo pipefail

# Use default values if environment variables are not set
SETUP_REGISTRY_NAME="${SETUP_REGISTRY_NAME:-setup-local-registry}"
SETUP_REGISTRY_PORT="${SETUP_REGISTRY_PORT:-5050}"

echo "=== Setting up Local Registry ==="
if docker ps --format '{{.Names}}' | grep -q "^${SETUP_REGISTRY_NAME}$"; then
    echo "Registry already running at localhost:${SETUP_REGISTRY_PORT}"
else
    echo "Starting registry at localhost:${SETUP_REGISTRY_PORT}..."
    docker rm -f "${SETUP_REGISTRY_NAME}" 2>/dev/null || true
    docker run -d --name "${SETUP_REGISTRY_NAME}" --restart always \
        -p "${SETUP_REGISTRY_PORT}:5000" \
        -v "${SETUP_REGISTRY_NAME}-data:/var/lib/registry" \
        registry:2
    
    echo "Waiting for registry to be ready..."
    wait-for-it -t 30 -s "localhost:${SETUP_REGISTRY_PORT}"
fi

echo "Registry ready at localhost:${SETUP_REGISTRY_PORT}"
