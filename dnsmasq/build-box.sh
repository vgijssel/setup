#!/bin/bash

set -Eeoux pipefail

qcow_to_vagrant.sh "${SETUP_DNSMASQ_DIR}/images/dnsmasq/dnsmasq_buster.qcow2" "${SETUP_DNSMASQ_DIR}/dnsmasq.box" false
