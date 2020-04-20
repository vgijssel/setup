#!/bin/bash

set -Eeoux pipefail

export DIB_RELEASE=buster
export DIB_APT_MINIMAL_CREATE_INTERFACES=0
# Force extlinux instead of grub2
export DIB_EXTLINUX=1

IMAGE_SHA_TAG=$(git rev-parse HEAD)

docker login -u mvgijssel -p "${REGISTRY_GITHUB_TOKEN}" docker.pkg.github.com

docker run \
       --rm \
       -it \
       --privileged \
       -v "${SETUP_RAZOR_SERVER_DIR}/images:/app/images" \
       -v "${SETUP_RAZOR_SERVER_DIR}/elements:/app/local_elements" \
       -v "${SETUP_ELEMENTS_DIR}:/app/global_elements" \
       --env DIB_RELEASE \
       --env DIB_APT_MINIMAL_CREATE_INTERFACES \
       --env DIB_EXTLINUX \
       --env break \
       "${IMAGE_BUILDER_IMAGE}:${IMAGE_SHA_TAG}" \
       disk-image-create -x -o images/razor-server/razor-server_buster debian baremetal vm debian-networking-fix cloud-init-fix razor-server growroot resolvconf goss
