#!/bin/bash

set -Eeoux pipefail

qcow_to_vagrant.sh "${SETUP_IMAGE_DIR}/libvirt_buster.qcow2" "${SETUP_LIBVIRT_DIR}/libvirt.box" true
