#!/bin/bash

set -Eeoux pipefail

export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0

IMAGE_SHA_TAG=$(git rev-parse HEAD)

docker login -u mvgijssel -p "${REGISTRY_GITHUB_TOKEN}" docker.pkg.github.com

docker run \
       --rm \
       --privileged \
       -v "${SETUP_DEPLOY_IMAGE_DIR}/images:/app/images" \
       -v "${SETUP_DEPLOY_IMAGE_DIR}/elements:/app/local_elements" \
       -v "${SETUP_ELEMENTS_DIR}:/app/global_elements" \
       --env DIB_RELEASE \
       --env DIB_APT_MINIMAL_CREATE_INTERFACES \
       "${IMAGE_BUILDER_IMAGE}:${IMAGE_SHA_TAG}" \
       ramdisk-image-create -x -o images/deploy-image/deploy-image ramdisk debian hwburnin-new
