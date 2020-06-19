#!/bin/bash

set -Eeoux pipefail

IMAGE_NAME="$1"
LOCAL_ELEMENTS_DIR="$2"
GLOBAL_ELEMENTS_DIR="${SETUP_ELEMENTS_DIR}"
ELEMENTS="$3"
FULL_IMAGE_NAME="${DOCKER_REGISTRY_URL}/${IMAGE_BUILDER_IMAGE}"

export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
# Force extlinux instead of grub2
export DIB_EXTLINUX=1
IMAGE_SHA_TAG=$(git rev-parse HEAD)

if [[ "${CI}" = true ]]; then
  docker login -u mvgijssel -p "${GITHUB_DOCKER_REGISTRY_TOKEN}" docker.pkg.github.com
fi

docker run \
  --rm \
  --privileged \
  -v "${SETUP_IMAGE_DIR}:/app/images" \
  -v "${LOCAL_ELEMENTS_DIR}:/app/local_elements" \
  -v "${GLOBAL_ELEMENTS_DIR}:/app/global_elements" \
  --env DIB_RELEASE \
  --env DIB_APT_MINIMAL_CREATE_INTERFACES \
  --env DIB_EXTLINUX \
  "${FULL_IMAGE_NAME}:${IMAGE_SHA_TAG}" \
  disk-image-create -x -o images/"${IMAGE_NAME}" "${ELEMENTS}"
