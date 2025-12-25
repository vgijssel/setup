#!/bin/bash

set -euo pipefail

# Get the directory where this script is located
SCRIPT_DIR="${SETUP_DIR}/.devcontainer"

# Check if .docker-version exists
if [[ ! -f "${SCRIPT_DIR}/.docker-version" ]]; then
  echo "Error: ${SCRIPT_DIR}/.docker-version not found. Please run 'nx build devcontainer' first."
  exit 1
fi

# Read the image reference from .docker-version
IMAGE=$(cat "${SCRIPT_DIR}/.docker-version")

if [[ -z "${IMAGE}" ]]; then
  echo "Error: .docker-version is empty"
  exit 1
fi

echo "Running tests with devcontainer image: ${IMAGE}"

docker run --privileged --rm \
  -v "${SETUP_DIR}:/workspaces/setup" \
  "${IMAGE}" \
  bin/exec goss --gossfile ./libs/devenv/goss.yaml validate

echo "Tests completed successfully!"