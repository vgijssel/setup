#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
OUT_DIR="${PROJECT_DIR}/dist"

# Version configuration from environment (DEPENDENCIES is JSON from moon.yml @meta)
DEPENDENCIES="${DEPENDENCIES:?DEPENDENCIES must be set}"
TALOS_VERSION=$(echo "${DEPENDENCIES}" | jq -r '.["siderolabs/talos"].version')
ARCH="${ARCH:-amd64}"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"

INPUT_PATH="${OUT_DIR}/installer-${ARCH}.tar"
IMAGE_REF="${REGISTRY}/talos:${TALOS_VERSION}"

# OCI annotations for GitHub Container Registry
SOURCE_REPO="https://github.com/vgijssel/setup"

if [[ ! -f "${INPUT_PATH}" ]]; then
    echo "Error: Installer archive not found at ${INPUT_PATH}"
    echo "Run the build task first."
    exit 1
fi

echo "Releasing Talos installer image..."
echo "  Source: ${INPUT_PATH}"
echo "  Target: ${IMAGE_REF}"
echo "  Repository: ${SOURCE_REPO}"
echo ""

# The build script extracts the gzipped output from the imager,
# producing the docker archive directly at installer-amd64.tar
# Import the image directly to the registry using regctl
regctl image import -v debug "${IMAGE_REF}" "${INPUT_PATH}"

# Add OCI annotation to link to the source repository
# This enables GitHub Container Registry to show the package linked to the repo
regctl image mod "${IMAGE_REF}" \
    --annotation "org.opencontainers.image.source=${SOURCE_REPO}"

echo ""
echo "Release complete!"
echo "Image available at: ${IMAGE_REF}"
