#!/bin/bash

set -Eeoux pipefail

# name of the qcow file
IMAGE_FILE="$1"

# name of the output .box file
VAGRANT_FILE="$2"

# directory of this script
QCOW_TO_VAGRANT_DIR="$(dirname "$0")"

OVF_FILE="$QCOW_TO_VAGRANT_DIR/box.ovf"
NEW_QCOW_FILE="image.qcow2"
BOX_VMDK_FILE="box-disk001.vmdk"
BOX_METADATA_FILE="metadata.json"
BOX_OVF_FILE="box.ovf"

# copy box.ovf to the current directory so the tar archive
# has all the files directly in the root.
cp -v "$OVF_FILE" "$BOX_OVF_FILE"

# NOTE: Don't need a copy if we are not resizing
# Copy qcow2 file to tmp directory
# cp -v $IMAGE_FILE $NEW_QCOW_FILE
# Resize the image to 32GB
# Seems the image is already 40gb?
# qemu-img resize $NEW_QCOW_FILE 32G

# Convert the qcow2 to vmdk
qemu-img convert -f qcow2 -O vmdk $IMAGE_FILE $BOX_VMDK_FILE

# Create Vagrantfile metadata
cat <<EOF | tee $BOX_METADATA_FILE
{"provider":"virtualbox"}
EOF

# TODO: we can add the "-z" flag here to compress
# but this takes a long time to do
tar cvf "$VAGRANT_FILE" "$BOX_METADATA_FILE" "$BOX_OVF_FILE" "$BOX_VMDK_FILE"