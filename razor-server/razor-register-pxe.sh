#!/bin/bash

set -Eeou pipefail

# Unsetting the GEM_PATH, as this is set by Vagrant to the Vagrant internal gems
# which does not have the razor-client gem installed.
unset GEM_PATH

until razor nodes; do
    echo "Razor not yet ready"
    sleep 2
done

MAC="${1}"

NODE=$(razor register-node --hw-info net0="${MAC}" --installed false | head -n 1 | sed 's/.*\(node[0-9]*\):/\1/')

razor update-node-metadata --node "${NODE}" --key TARGET_DISK --value /dev/sda
razor update-node-metadata --node "${NODE}" --key DISK_URL --value http://razor-server:8150/svc/repo/deploy-image/libvirt/libvirt_buster.qcow2
