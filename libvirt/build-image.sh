#!/bin/bash

set -Eeoux pipefail

image_build.sh \
    libvirt_buster \
    "${SETUP_LIBVIRT_DIR}/elements" \
    "debian baremetal vm debian-networking-fix cloud-init-fix growroot nfs resolvconf goss libvirt"
