#!/bin/bash

set -euo pipefail

# Parse command line arguments
DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
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

LOCAL_IMAGE="devcontainer"
VERSIONED_IMAGE="ghcr.io/vgijssel/setup/devcontainer:${VERSION}"
LATEST_IMAGE="ghcr.io/vgijssel/setup/devcontainer:latest"

echo "Local image: ${LOCAL_IMAGE}"
echo "Versioned image: ${VERSIONED_IMAGE}"
echo "Latest image: ${LATEST_IMAGE}"
echo "Version: ${VERSION}"

if [[ "${DRY_RUN}" = true ]]; then
  echo "[DRY RUN] Would tag and push:"
  echo "[DRY RUN]   docker tag ${LOCAL_IMAGE} ${VERSIONED_IMAGE}"
  echo "[DRY RUN]   docker tag ${LOCAL_IMAGE} ${LATEST_IMAGE}"
  echo "[DRY RUN]   docker push ${VERSIONED_IMAGE}"
  echo "[DRY RUN]   docker push ${LATEST_IMAGE}"
else
  echo "Tagging images..."
  docker tag "${LOCAL_IMAGE}" "${VERSIONED_IMAGE}"
  docker tag "${LOCAL_IMAGE}" "${LATEST_IMAGE}"

  echo "Pushing versioned image..."
  docker push "${VERSIONED_IMAGE}"

  echo "Pushing latest image..."
  docker push "${LATEST_IMAGE}"

  echo "Successfully pushed ${VERSIONED_IMAGE} and ${LATEST_IMAGE}"
fi