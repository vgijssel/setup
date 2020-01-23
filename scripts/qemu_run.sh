#!/bin/bash

set -Eeoux pipefail

IMAGE_NAME="$1"
IMAGE_FILE="$2"
IMAGE_FILE_COPY_DIR="$SETUP_TMP_DIR/$IMAGE_NAME"
IMAGE_FILE_COPY_FILE="$IMAGE_FILE_COPY_DIR/$IMAGE_NAME.qcow2"
CLOUD_INIT_FILE="$IMAGE_FILE_COPY_DIR/cloud-init.iso"
QEMU_IFUP="$SETUP_SCRIPT_DIR/qemu-ifup.sh"
QEMU_IFDOWN="$SETUP_SCRIPT_DIR/qemu-ifdown.sh"
QEMU_MAC=52:54:00:0e:e0:65

echo "Booting '$IMAGE_NAME' with disk '$IMAGE_FILE'"

# Make sure we copy the harddisk, to not change the existing one
mkdir -p $IMAGE_FILE_COPY_DIR
cp -v $IMAGE_FILE $IMAGE_FILE_COPY_FILE

# Resize the image
qemu-img resize $IMAGE_FILE_COPY_FILE 32G

# Create cloud-init user-data
cat <<EOF | tee $IMAGE_FILE_COPY_DIR/user-data
#cloud-config
# openssl passwd -1 -salt SaltSalt debian
# mkpasswd --method=sha-512 --rounds=4096 debian

manage_etc_hosts: true
users:
  - name: debian
    plain_text_passwd: debian
    # So we can login at the console
    lock_passwd: false
    shell: /bin/bash
    # Unrestricted sudo access
    sudo: ALL=(ALL) NOPASSWD:ALL
EOF

# Create cloud-init meta-data
cat <<EOF | tee $IMAGE_FILE_COPY_DIR/meta-data
instance-id: iid-abcdefg
local-hostname: $IMAGE_NAME
EOF

# Create cloud-init network-config
cat <<EOF | tee $IMAGE_FILE_COPY_DIR/network-config
version: 1
config:
- type: physical
  name: ens3
  subnets:
    - type: dhcp
EOF

# Generate cloud-init image
mkisofs \
  -output $CLOUD_INIT_FILE \
  -volid cidata \
  -joliet \
  -rock {$IMAGE_FILE_COPY_DIR/user-data,$IMAGE_FILE_COPY_DIR/meta-data,$IMAGE_FILE_COPY_DIR/network-config}

# -device virtio-rng-pci
#         Prevent "random: crng init done" from taking a long time
#
# -serial mon:stdio
#         In this mode, the virtual serial port and QEMU monitor are multiplexed onto stdio.
#         And Ctrl+c is handled, i.e. QEMU won’t be terminated, and the signal will be passed to the guest.

qemu-system-x86_64 \
  -m 2048 \
  -smp 2 \
  -serial mon:stdio \
  -display none \
  -accel hax \
  -netdev tap,id=mynet0,script="$QEMU_IFUP",downscript="$QEMU_IFDOWN" \
  -device virtio-net,mac="$QEMU_MAC",netdev=mynet0 \
  -device virtio-rng-pci \
  -drive file="$IMAGE_FILE_COPY_FILE",if=virtio \
  -drive file="$CLOUD_INIT_FILE",if=virtio
