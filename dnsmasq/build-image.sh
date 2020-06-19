#!/bin/bash

set -Eeoux pipefail

image_build.sh \
    dnsmasq_buster \
    "${SETUP_DNSMASQ_DIR}/elements" \
    "debian baremetal vm debian-networking-fix cloud-init-fix growroot qemu-guest resolvconf dnsmasq"
