#!/bin/bash

set -Eeou pipefail

vagrant ssh razor-server -c bash <<EOF
until razor nodes; do
    echo "Razor not yet ready"
    sleep 2
done

# delete existing nodes
EXISTING_NODES=\$(curl "http://localhost:8150/api/collections/nodes" | jq -r ".items[].name")

while IFS= read -r line; do
  razor delete-node \$line
done <<< \$EXISTING_NODES

MAC="${1}"

NODE=\$(razor register-node --hw-info net0="\${MAC}" --installed false | head -n 1 | sed 's/.*\(node[0-9]*\):/\1/')

razor update-node-metadata --node "\${NODE}" --key TARGET_DISK --value /dev/sda
razor update-node-metadata --node "\${NODE}" --key DISK_URL --value http://razor-server:8150/svc/repo/deploy-image/libvirt/libvirt_buster.qcow2
razor update-node-metadata --node "\${NODE}" --key DISK_VMLINUZ_URL --value http://razor-server:8150/svc/repo/deploy-image/libvirt/libvirt_buster.vmlinuz
razor update-node-metadata --node "\${NODE}" --key DISK_INITRD_URL --value http://razor-server:8150/svc/repo/deploy-image/libvirt/libvirt_buster.initrd
razor update-node-metadata --node "\${NODE}" --key CLOUD_CONFIG_URL --value http://razor-server:8150/svc/repo/deploy-image/cloud-init/libvirt-user-data.yml
EOF
