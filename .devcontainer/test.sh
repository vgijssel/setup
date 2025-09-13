#!/bin/bash
set -e

IMAGE_NAME="setup-devcontainer-test:latest"

devcontainer build --workspace-folder . --image-name "$IMAGE_NAME"

# Run validation in one-shot container with --rm for cleanup
exec docker run --rm \
  --workdir /opt/setup \
  --mount type=bind,source="$(pwd)",target=/opt/setup \
  "$IMAGE_NAME" \
  bash -c "direnv exec /opt/setup goss --gossfile .devcontainer/goss.yaml validate"