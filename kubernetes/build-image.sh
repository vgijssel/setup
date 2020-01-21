#!/bin/bash

set -Eeoux pipefail

export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
export KUBERNETES_DIR=$(readlink -f $(dirname "$0"))
IMAGE_SHA_TAG=$(git rev-parse HEAD)

docker run \
       --rm \
       -it \
       --privileged \
       -v "${KUBERNETES_DIR}/images:/app/images" \
       -v "${KUBERNETES_DIR}/elements:/app/elements" \
       --env DIB_RELEASE \
       --env DIB_APT_MINIMAL_CREATE_INTERFACES \
       "${IMAGE_BUILDER_IMAGE}:${IMAGE_SHA_TAG}" \
       disk-image-create -o -x images/kubernetes_buster debian vm debian-networking-fix cloud-init-fix kubernetes growroot qemu-guest nfs resolvconf goss
