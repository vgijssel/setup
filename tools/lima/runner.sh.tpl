#!/usr/bin/env bash

set -e

VM_NAME={vm_name}
LIMACTL_WRAPPER={limactl_binary}
TEMPLATE={image_template}

# If there already exists a VM with the same name force stop it.
$LIMACTL_WRAPPER delete -f $VM_NAME

# Start the vm without asking for confirmation
$LIMACTL_WRAPPER start --tty=false --name $VM_NAME $TEMPLATE