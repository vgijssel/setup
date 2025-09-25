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

# Ensure buildx builder exists for multi-platform builds
# Check for any existing docker-container builder
EXISTING_BUILDER=$(docker buildx ls | grep "docker-container" | head -n1 | awk '{print $1}' | sed 's/\*$//' || true)

if [[ -n "${EXISTING_BUILDER}" ]]; then
  echo "Using existing docker-container buildx builder: ${EXISTING_BUILDER}"
  # Ensure the builder is selected and bootstrapped
  docker buildx use "${EXISTING_BUILDER}"
  docker buildx inspect --bootstrap "${EXISTING_BUILDER}" >/dev/null 2>&1 || true
else
  echo "Creating buildx builder for multi-platform builds..."
  BUILDER_NAME="container-builder"
  docker buildx create \
    --name "${BUILDER_NAME}" \
    --driver docker-container \
    --bootstrap --use
fi

DEV_IMAGE="ghcr.io/vgijssel/setup/devcontainer-dev:${TAG}"

echo "Building and pushing devcontainer to development registry..."
echo "Image: ${DEV_IMAGE}"
echo "Platforms: linux/amd64,linux/arm64"

# Check if we should skip pushing (for testing or when auth is not available)
CAN_PUSH=true
if [ "${SKIP_DOCKER_PUSH:-}" = "true" ]; then
  echo "SKIP_DOCKER_PUSH is set, building without push"
  CAN_PUSH=false
elif [ -z "${GITHUB_TOKEN:-}" ] && [ -z "${DOCKER_PASSWORD:-}" ]; then
  echo "Warning: No authentication tokens found, building without push"
  CAN_PUSH=false
fi

# Build the image with or without push depending on authentication
if [ "$CAN_PUSH" = "true" ]; then
  echo "Building and pushing to registry..."
  devcontainer build \
    --workspace-folder "${SETUP_DIR}" \
    --platform linux/amd64,linux/arm64 \
    --push \
    --image-name "${DEV_IMAGE}" \
    --cache-from "type=registry,ref=ghcr.io/vgijssel/setup/devcontainer-dev:cache" \
    --cache-to "type=registry,ref=ghcr.io/vgijssel/setup/devcontainer-dev:cache,mode=max"
else
  echo "Building locally only (no push, single platform)..."
  # When building locally, use single platform to avoid manifest list issues
  CURRENT_ARCH=$(uname -m)
  if [ "$CURRENT_ARCH" = "x86_64" ]; then
    PLATFORM="linux/amd64"
  elif [ "$CURRENT_ARCH" = "arm64" ] || [ "$CURRENT_ARCH" = "aarch64" ]; then
    PLATFORM="linux/arm64"
  else
    PLATFORM="linux/amd64"  # Default fallback
  fi
  echo "Building for platform: $PLATFORM"
  devcontainer build \
    --workspace-folder "${SETUP_DIR}" \
    --platform "$PLATFORM" \
    --image-name "${DEV_IMAGE}"
fi

# Save the image reference to .docker-version
echo "${DEV_IMAGE}" > "${SCRIPT_DIR}/.docker-version"

echo "Successfully built and pushed devcontainer:"
echo "  Image: ${DEV_IMAGE}"
echo "  Image reference saved to: ${SCRIPT_DIR}/.docker-version"