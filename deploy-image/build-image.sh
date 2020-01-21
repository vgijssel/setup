#!/bin/bash

set -Eeoux pipefail

export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
export DEPLOY_IMAGE_DIR=$(readlink -f $(dirname "$0"))
IMAGE_SHA_TAG=$(git rev-parse HEAD)

docker run \
       --rm \
       --privileged \
       -v "${DEPLOY_IMAGE_DIR}/images:/app/images" \
       -v "${DEPLOY_IMAGE_DIR}/elements:/app/elements" \
       --env DIB_RELEASE \
       --env DIB_APT_MINIMAL_CREATE_INTERFACES \
       "${IMAGE_BUILDER_IMAGE}:${IMAGE_SHA_TAG}" \
       ramdisk-image-create -x -o images/deploy-image ramdisk debian hwdiscovery
