#!/bin/bash
set -e

IMAGE_NAME="setup-devcontainer-test:latest"

devcontainer build --workspace-folder . --image-name "$IMAGE_NAME"

# Run validation in one-shot container with --rm for cleanup
exec docker run --rm \
  --workdir /workspaces/setup \
  --mount type=bind,source="$(pwd)",target=/workspaces/setup \
  "$IMAGE_NAME" \
  bash -c "direnv exec /workspaces/setup goss --gossfile .devcontainer/goss.yaml validate"