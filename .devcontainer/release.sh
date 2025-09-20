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
SCRIPT_DIR="$SETUP_DIR/.devcontainer"

# Check if .docker-version exists
if [[ ! -f "${SCRIPT_DIR}/.docker-version" ]]; then
  echo "Error: ${SCRIPT_DIR}/.docker-version not found. Please run 'nx build devcontainer' first."
  exit 1
fi

# Read the source image from .docker-version
SOURCE_IMAGE=$(cat "${SCRIPT_DIR}/.docker-version")

if [[ -z "${SOURCE_IMAGE}" ]]; then
  echo "Error: .docker-version is empty"
  exit 1
fi

# Extract version from package.json
VERSION=$(node -p "require('${SCRIPT_DIR}/package.json').version")

if [[ -z "${VERSION}" ]] || [[ "${VERSION}" = "null" ]]; then
  echo "Error: Could not extract version from package.json"
  exit 1
fi

# Define production registry targets
VERSIONED_IMAGE="ghcr.io/vgijssel/setup/devcontainer:${VERSION}"
LATEST_IMAGE="ghcr.io/vgijssel/setup/devcontainer:latest"

echo "Releasing devcontainer image to production registry"
echo "Source image: ${SOURCE_IMAGE}"
echo "Versioned image: ${VERSIONED_IMAGE}"
echo "Latest image: ${LATEST_IMAGE}"
echo "Version: ${VERSION}"

if [[ "${DRY_RUN}" = true ]]; then
  echo "[DRY RUN] Would copy image from dev to production registry:"
  echo "[DRY RUN]   docker buildx imagetools create --tag ${VERSIONED_IMAGE} ${SOURCE_IMAGE}"
  echo "[DRY RUN]   docker buildx imagetools create --tag ${LATEST_IMAGE} ${SOURCE_IMAGE}"
else
  echo "Copying image to production registry with version tag (${VERSIONED_IMAGE})..."
  docker buildx imagetools create --tag "${VERSIONED_IMAGE}" "${SOURCE_IMAGE}"

  echo "Tagging as latest in production registry (${LATEST_IMAGE})..."
  docker buildx imagetools create --tag "${LATEST_IMAGE}" "${SOURCE_IMAGE}"

  echo "Successfully released devcontainer to production registry:"
  echo "  ${VERSIONED_IMAGE}"
  echo "  ${LATEST_IMAGE}"
  echo "From source: ${SOURCE_IMAGE}"
fi