#!/bin/bash
set -e

IMAGE_HASH="$1"
IMAGE_NAME="ghcr.io/vgijssel/setup/devcontainer-builder"
IMAGE_TAG="${IMAGE_NAME}:${IMAGE_HASH}"

echo "Building devcontainer-builder version: ${IMAGE_HASH}"

docker build -t "${IMAGE_TAG}" -f "$SETUP_DIR/libs/devcontainer-builder/Dockerfile" "$SETUP_DIR"

# Get the image digest (sha256)
IMAGE_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' "${IMAGE_TAG}" 2>/dev/null || echo "")

# If no digest yet (not pushed), use the image ID
if [ -z "$IMAGE_DIGEST" ]; then
    IMAGE_ID=$(docker inspect --format='{{.Id}}' "${IMAGE_TAG}")
    IMAGE_SHA="${IMAGE_ID#sha256:}"
else
    IMAGE_SHA="${IMAGE_DIGEST#*@sha256:}"
fi

# Ensure dist directory exists
mkdir -p "$SETUP_DIR/libs/devcontainer-builder/dist"

# Write image.json with the image reference
cat > "$SETUP_DIR/libs/devcontainer-builder/dist/image.json" << EOF
{
  "image": "${IMAGE_TAG}",
  "name": "${IMAGE_NAME}",
  "tag": "${IMAGE_HASH}",
  "sha": "${IMAGE_SHA}"
}
EOF

echo "Successfully built ${IMAGE_TAG}"
echo "Image info written to dist/image.json"
