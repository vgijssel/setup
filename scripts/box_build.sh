#!/bin/bash

set -Eeoux pipefail

IMAGE_CONFIG_FILE="$1"
source "${IMAGE_CONFIG_FILE}"

DISK_IMAGE_DIR=$(digest.sh "${IMAGE_CONFIG_FILE}")
DISK_FILE="${SETUP_ROOT_DIR}/${DISK_IMAGE_DIR}/${IMAGE_NAME}.qcow2"

qcow_to_vagrant.sh "${DISK_FILE}" "${SETUP_BOX_DIR}/${IMAGE_NAME}.box" "${VAGRANT_BOX_USE_PACKER}"
