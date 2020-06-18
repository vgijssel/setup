#!/bin/bash

set -Eeoux pipefail

export IMAGE_NAME="$1"
# NOTE: using realpath here to convert an absolute to a relative path
export LOCAL_ELEMENTS_DIR=$(realpath --relative-to="${SETUP_ROOT_DIR}" "$2")
export GLOBAL_ELEMENTS_DIR=$(realpath --relative-to="${SETUP_ROOT_DIR}" "${SETUP_ELEMENTS_DIR}")
export CONTEXT_DIR="${SETUP_ROOT_DIR}"

export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
# Force extlinux instead of grub2
export DIB_EXTLINUX=1

# NOTE: exporting elements here as it contains spaces and spaces
# break the extra arguments passed into docker_build.sh.
# There doing --build-arg ELEMENTS so the build argument is plucked
# from the environment!
export ELEMENTS="$3"

# Run local registry
# docker run -p 127.0.0.1:5000:5000 --name registry registry:2

# building privileged
# create buildkit builder with special daemon flag for privileged building
# docker buildx create \
#   --use \
#   --buildkitd-flags "--allow-insecure-entitlement security.insecure" \
#   --driver-opt network=host \
#   --name "test"

DOCKER_IMAGE_NAME=$(
  docker_build.sh \
    "${IMAGE_NAME}" \
    "${CONTEXT_DIR}" \
    --allow security.insecure \
    --file "${SETUP_IMAGE_BUILDER_DIR}/Dockerfile.container" \
    --build-arg LOCAL_ELEMENTS_DIR \
    --build-arg GLOBAL_ELEMENTS_DIR \
    --build-arg ELEMENTS \
    --build-arg IMAGE_NAME \
    --build-arg DIB_RELEASE \
    --build-arg DIB_APT_MINIMAL_CREATE_INTERFACES \
    --build-arg DIB_EXTLINUX
)

# Instantiate a container
id=$(docker create "${DOCKER_IMAGE_NAME}")

# Copy the image from the container into the image folder
docker cp $id:"/app/images/${IMAGE_NAME}.qcow2" "${SETUP_IMAGE_DIR}"

# Remove the container
docker rm -v $id
