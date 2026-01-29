#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"

cd "${PROJECT_DIR}"

VERSION=$(cat version.txt | tr -d '\n')
echo "Building devcontainer-builder version: ${VERSION}"

docker build \
    -t "ghcr.io/vgijssel/setup/devcontainer-builder:${VERSION}" \
    -t "ghcr.io/vgijssel/setup/devcontainer-builder:latest" \
    -t "coder-registry.coder.svc.cluster.local:5000/devcontainer-builder:${VERSION}" \
    -t "coder-registry.coder.svc.cluster.local:5000/devcontainer-builder:latest" \
    .

echo "Successfully built devcontainer-builder:${VERSION}"
