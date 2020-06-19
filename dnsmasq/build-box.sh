#!/bin/bash

set -Eeoux pipefail

qcow_to_vagrant.sh "${SETUP_IMAGE_DIR}/dnsmasq_buster.qcow2" "${SETUP_DNSMASQ_DIR}/dnsmasq.box" false
