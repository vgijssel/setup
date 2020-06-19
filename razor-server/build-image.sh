#!/bin/bash

set -Eeoux pipefail

image_build.sh \
    razor-server_buster \
    "${SETUP_RAZOR_SERVER_DIR}/elements" \
    "debian vm debian-networking-fix cloud-init-fix razor-server growroot resolvconf goss"
