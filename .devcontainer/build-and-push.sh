#!/bin/bash

set -euo pipefail

# Parse command line arguments
DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --dryRun=*)
      VALUE="${1#*=}"
      if [[ "${VALUE}" == "true" ]]; then
        DRY_RUN=true
      elif [[ "${VALUE}" == "false" ]]; then
        DRY_RUN=false
      else
        echo "Invalid value for --dryRun: ${VALUE} (expected true or false)"
        exit 1
      fi
      shift
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Extract version from package.json
VERSION=$(node -p "require('${SCRIPT_DIR}/package.json').version")

if [[ -z "${VERSION}" ]] || [[ "${VERSION}" = "null" ]]; then
  echo "Error: Could not extract version from package.json"
  exit 1
fi

VERSIONED_IMAGE="ghcr.io/vgijssel/setup/devcontainer:${VERSION}"
LATEST_IMAGE="ghcr.io/vgijssel/setup/devcontainer:latest"

echo "Building and pushing multi-architecture images:"
echo "Versioned image: ${VERSIONED_IMAGE}"
echo "Latest image: ${LATEST_IMAGE}"
echo "Version: ${VERSION}"
echo "Platforms: linux/amd64,linux/arm64"

if [[ "${DRY_RUN}" = true ]]; then
  echo "[DRY RUN] Would build and push multi-architecture images:"
  echo "[DRY RUN]   devcontainer build --workspace-folder . --platform linux/amd64,linux/arm64 --push --image-name ${VERSIONED_IMAGE} --cache-from ${LATEST_IMAGE}"
  echo "[DRY RUN]   devcontainer build --workspace-folder . --platform linux/amd64,linux/arm64 --push --image-name ${LATEST_IMAGE} --cache-from ${LATEST_IMAGE}"
else
  echo "Building and pushing versioned image (${VERSIONED_IMAGE})..."
  devcontainer build --workspace-folder . --platform linux/amd64,linux/arm64 --push --image-name "${VERSIONED_IMAGE}" --cache-from "${LATEST_IMAGE}"

  echo "Building and pushing latest image (${LATEST_IMAGE})..."
  devcontainer build --workspace-folder . --platform linux/amd64,linux/arm64 --push --image-name "${LATEST_IMAGE}" --cache-from "${LATEST_IMAGE}"

  echo "Successfully built and pushed multi-architecture images:"
  echo "  ${VERSIONED_IMAGE}"
  echo "  ${LATEST_IMAGE}"
  echo "Architectures: linux/amd64, linux/arm64"
fi