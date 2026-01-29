#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"

cd "${PROJECT_DIR}"

# Read image reference from dist/image.json
IMAGE_JSON="${PROJECT_DIR}/dist/image.json"
if [ ! -f "${IMAGE_JSON}" ]; then
    echo "Error: ${IMAGE_JSON} not found. Run 'moon run devcontainer-builder:build' first." >&2
    exit 1
fi

IMAGE_NAME=$(jq -r '.image' "${IMAGE_JSON}")
if [ -z "${IMAGE_NAME}" ]; then
    echo "Error: Could not extract image name from ${IMAGE_JSON}" >&2
    exit 1
fi

GIT_BRANCH="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"

echo "Running devcontainer-builder image: ${IMAGE_NAME}"
echo "  Branch: ${GIT_BRANCH}"
echo "  Repository: https://github.com/vgijssel/setup.git"
echo "  Cache from: ghcr.io/vgijssel/setup/devcontainer"

docker run --rm --privileged \
    -e CODER_AGENT_URL=http://localhost:3000 \
    -e CODER_AGENT_TOKEN=dummy-token \
    -e DEVCONTAINER_REPOSITORY=https://github.com/vgijssel/setup.git \
    -e DEVCONTAINER_BRANCH="${GIT_BRANCH}" \
    -e DEVCONTAINER_CACHE_FROM="ghcr.io/vgijssel/setup/devcontainer" \
    "${IMAGE_NAME}"
