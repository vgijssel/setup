#!/bin/bash
set -e

IMAGE_HASH="$1"

echo "Building devcontainer-builder version: ${IMAGE_HASH}"

docker build -t "ghcr.io/vgijssel/setup/devcontainer-builder:${IMAGE_HASH}" -f $SETUP_DIR/libs/devcontainer-builder/Dockerfile $SETUP_DIR

echo "Successfully built devcontainer-builder:${IMAGE_HASH}"
