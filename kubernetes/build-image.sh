#!/bin/bash

set -Eeoux pipefail

# generate digest:
# build-image.sh
# image_build.sh
# image builder digest
# content of local element directory

image_build.sh \
  kubernetes_buster \
  "${SETUP_KUBERNETES_DIR}/elements" \
  "debian baremetal vm debian-networking-fix cloud-init-fix kubernetes growroot qemu-guest nfs resolvconf goss"
