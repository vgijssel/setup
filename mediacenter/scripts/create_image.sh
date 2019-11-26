#!/bin/bash

set -e
set +x

export DIB_DEV_USER_USERNAME=vagrant
export DIB_DEV_USER_PASSWORD=vagrant
export DIB_DEV_USER_PWDLESS_SUDO=yes
export DIB_DEV_USER_SHELL=/bin/bash

# simple-init is for networking
# devuser is to be able to login into the machine for developing
disk-image-create -o /images/image -t qcow2 --image-cache /cache debian baremetal dhcp-all-interfaces devuser

# Convert .qcow2 to .vmdk to be able to load the disk in VMware
qemu-img convert -f qcow2 -O vmdk /images/image.qcow2 /images/image.vmdk

