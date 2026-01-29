#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"

cd "${PROJECT_DIR}"

VERSION=$(cat version.txt | tr -d '\n')
GIT_BRANCH="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)}"

echo "Running devcontainer-builder version: ${VERSION}"
echo "  Branch: ${GIT_BRANCH}"
echo "  Repository: https://github.com/vgijssel/setup.git"
echo "  Cache from: ghcr.io/vgijssel/setup/devcontainer"
echo "  Cache to: ghcr.io/vgijssel/setup/devcontainer"

docker run --rm --privileged \
    -e CODER_AGENT_URL=http://localhost:3000 \
    -e CODER_AGENT_TOKEN=dummy-token \
    -e DEVCONTAINER_REPOSITORY=https://github.com/vgijssel/setup.git \
    -e DEVCONTAINER_BRANCH="${GIT_BRANCH}" \
    -e DEVCONTAINER_CACHE_FROM=ghcr.io/vgijssel/setup/devcontainer \
    -e DEVCONTAINER_CACHE_TO=ghcr.io/vgijssel/setup/devcontainer \
    "ghcr.io/vgijssel/setup/devcontainer-builder:${VERSION}"
