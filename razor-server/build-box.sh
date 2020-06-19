#!/bin/bash

set -Eeoux pipefail

qcow_to_vagrant.sh "${SETUP_IMAGE_DIR}/razor-server_buster.qcow2" "${SETUP_RAZOR_SERVER_DIR}/razor-server.box" true
