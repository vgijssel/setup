#!/bin/bash

set -Eeoux pipefail

IMAGE_SHA_TAG=$(git rev-parse HEAD)

# TODO: copy the current env into the docker container
docker run \
       --rm \
       --privileged \
       -v "$SETUP_ROOT_DIR:/app" \
       "${IMAGE_BUILDER_IMAGE}:${IMAGE_SHA_TAG}" \
       ls -la
