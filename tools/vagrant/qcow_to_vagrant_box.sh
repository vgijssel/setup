#!/usr/bin/env bash

set -Eeou pipefail

# name of the virtualbox ovf file
OVF_FILE="$1"

# name of the qcow file
IMAGE_FILE="$2"

# name of the output .box file
VAGRANT_FILE="$3"

# sha of the image
IMAGE_SHA="$4"

BOX_VMDK_FILE="box-disk001.vmdk"
BOX_METADATA_FILE="metadata.json"
BOX_INFO_FILE="info.json"
BOX_OVF_FILE="box.ovf"

# copy box.ovf to the current directory so the tar archive
# has all the files directly in the root.
cp -v "${OVF_FILE}" "${BOX_OVF_FILE}"

# Convert the qcow2 to vmdk
qemu-img convert -f qcow2 -O vmdk "${IMAGE_FILE}" "${BOX_VMDK_FILE}"

# Create Vagrantfile metadata
cat << EOF | tee "${BOX_METADATA_FILE}"
{
  "provider": "virtualbox"
}
EOF

# Add additional info to the vagrant box
# https://www.vagrantup.com/docs/boxes/format
cat << EOF | tee "${BOX_INFO_FILE}"
{
  "image_sha": "${IMAGE_SHA}"
}
EOF

# Create a tar with the specified files
tar cvf "${VAGRANT_FILE}" "${BOX_METADATA_FILE}" "${BOX_INFO_FILE}" "${BOX_OVF_FILE}" "${BOX_VMDK_FILE}"
