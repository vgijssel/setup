#!/bin/bash

set -Eeoux pipefail

image_build.sh \
  kubernetes_buster \
  "${SETUP_KUBERNETES_DIR}/elements" \
  "debian baremetal vm debian-networking-fix cloud-init-fix kubernetes growroot qemu-guest nfs resolvconf goss"
