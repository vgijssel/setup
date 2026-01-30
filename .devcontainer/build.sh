#!/bin/bash

set -euo pipefail

# Get the directory where this script is located
SCRIPT_DIR="${SETUP_DIR}/.devcontainer"

# Parse command line arguments
TAG=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --tag)
      TAG="$2"
      shift 2
      ;;
    --tag=*)
      TAG="${1#*=}"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --tag <tag>"
      exit 1
      ;;
  esac
done

# Validate required arguments
if [[ -z "${TAG}" ]]; then
  echo "Error: --tag argument is required"
  echo "Usage: $0 --tag <tag>"
  exit 1
fi

DEV_IMAGE="ghcr.io/vgijssel/setup/devcontainer-dev:${TAG}"

echo "Building and pushing devcontainer to development registry..."
echo "Image: ${DEV_IMAGE}"
echo "Platforms: linux/amd64,linux/arm64"

# Build and push the image with the MOON_TASK_HASH tag
devcontainer build \
  --workspace-folder "${SETUP_DIR}" \
  --platform linux/amd64,linux/arm64 \
  --push \
  --image-name "${DEV_IMAGE}" \
  --cache-from "type=registry,ref=ghcr.io/vgijssel/setup/devcontainer-dev:cache" \
  --cache-to "type=registry,ref=ghcr.io/vgijssel/setup/devcontainer-dev:cache,mode=max"

# Save the image reference to .docker-version
echo "${DEV_IMAGE}" > "${SCRIPT_DIR}/.docker-version"

echo "Successfully built and pushed devcontainer:"
echo "  Image: ${DEV_IMAGE}"
echo "  Image reference saved to: ${SCRIPT_DIR}/.docker-version"