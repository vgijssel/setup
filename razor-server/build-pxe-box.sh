#!/bin/bash

set -Eeoux pipefail

PXE_IMAGE_DIR="${SETUP_RAZOR_SERVER_DIR}/images/pxe"
PXE_QCOW="${PXE_IMAGE_DIR}/pxe.qcow2"

mkdir -p "${PXE_IMAGE_DIR}"

qemu-img create -f qcow2 "${PXE_QCOW}" 32G

qcow_to_vagrant.sh "${PXE_QCOW}" "${SETUP_RAZOR_SERVER_DIR}/pxe.box" false
