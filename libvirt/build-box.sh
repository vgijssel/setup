#!/bin/bash

set -Eeoux pipefail

qcow_to_vagrant.sh "${SETUP_LIBVIRT_DIR}/images/libvirt/libvirt_buster.qcow2" "${SETUP_LIBVIRT_DIR}/libvirt.box" true
