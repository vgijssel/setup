#!/bin/bash

set -Eeoux pipefail

image_build.sh \
    deploy-image \
    "${SETUP_DEPLOY_IMAGE_DIR}/elements" \
    "ramdisk debian deploy-image"
