#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUT_DIR="${PROJECT_DIR}/dist"

# Version configuration from environment (DEPENDENCIES is JSON from moon.yml @meta)
DEPENDENCIES="${DEPENDENCIES:?DEPENDENCIES must be set}"
TALOS_VERSION=$(echo "$DEPENDENCIES" | jq -r '.["siderolabs/talos"].version')
ARCH="${ARCH:-amd64}"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"

INPUT_PATH="${OUT_DIR}/installer-${ARCH}.tar"
IMAGE_REF="${REGISTRY}/talos:${TALOS_VERSION}"

if [[ ! -f "$INPUT_PATH" ]]; then
    echo "Error: Installer archive not found at ${INPUT_PATH}"
    echo "Run the build task first."
    exit 1
fi

echo "Releasing Talos installer image..."
echo "  Source: ${INPUT_PATH}"
echo "  Target: ${IMAGE_REF}"
echo ""

# Use skopeo to copy the docker-archive to the registry
skopeo copy \
    "docker-archive:${INPUT_PATH}" \
    "docker://${IMAGE_REF}"

echo ""
echo "Release complete!"
echo "Image available at: ${IMAGE_REF}"
