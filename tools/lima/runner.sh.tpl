#!/usr/bin/env bash

set -e

# TODO: hacky way to get access to jq binary
# export PATH="$PATH:/usr/local/bin"

VM_NAME={vm_name}
LIMACTL_WRAPPER={limactl_binary}
TEMPLATE={image_template}

pwd
echo $LIMACTL_WRAPPER
echo $TEMPLATE
echo $VM_NAME

# TODO: is there a docker-like way that we can re-create the machine if it changed?
# is there metadata we can store on the machine in lima which we can query?

# If there already exists a VM with the same name force stop it.
$LIMACTL_WRAPPER delete -f $VM_NAME

# Check if machine already exists
# the -e in the jq command ensure we fail if the machine doesn't exist
# $LIMACTL_WRAPPER list --json | jq -e --arg VM_NAME "$VM_NAMe" 'select(.name==$VM_NAME)'
$LIMACTL_WRAPPER start --tty=false --name $VM_NAME $TEMPLATE