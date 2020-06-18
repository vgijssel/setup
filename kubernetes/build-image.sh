#!/bin/bash

set -Eeoux pipefail

# docker_build.sh $IMAGE_BUILDER_NAME ./image-builder

image_build.sh \
  kubernetes_buster \
  "${SETUP_KUBERNETES_DIR}/elements" \
  "debian baremetal vm debian-networking-fix cloud-init-fix kubernetes growroot qemu-guest nfs resolvconf goss"
