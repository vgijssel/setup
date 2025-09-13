#!/bin/bash
set -e

# Generate unique container name to avoid conflicts
CONTAINER_NAME="devcontainer-test-$(date +%s)-$$"
IMAGE_NAME="setup-devcontainer-test:latest"

echo "🔨 Building devcontainer image..."
devcontainer build --workspace-folder . --image-name "$IMAGE_NAME"

echo "🧪 Starting validation container: $CONTAINER_NAME"
echo "📂 Mounting repo at /opt/setup"

# Run validation in one-shot container with --rm for cleanup
docker run --rm \
  --name "$CONTAINER_NAME" \
  --workdir /opt/setup \
  --mount type=bind,source="$(pwd)",target=/opt/setup \
  --privileged \
  "$IMAGE_NAME" \
  bash -c "export PATH=/opt/setup/bin:\$PATH && direnv allow /opt/setup && direnv exec /opt/setup goss --gossfile .devcontainer/goss.yaml validate"

echo "✅ Devcontainer validation completed successfully!"