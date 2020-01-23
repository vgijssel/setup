#!/bin/bash

set -Eeoux pipefail

IMAGE_NAME="$1"

echo "Booting image: '$@'"

# Make sure we copy the harddisk, to not change the existing one
cp -v "$@" images/testing.qcow2

# Resize the image
qemu-img resize images/testing.qcow2 32G

# Generate cloud-init image
mkisofs \
  -output cloud-init.iso \
  -volid cidata \
  -joliet \
  -rock {cloud-init/user-data,cloud-init/meta-data,cloud-init/network-config}


# -serial stdio \
# -nographic \
# -nic user \
# -accel hax \

# Added -device virtio-rng-pci to prevent "random: crng init done" from taking long

qemu-system-x86_64 \
  -m 2048 \
  -smp 2 \
  -nographic \
  -accel hax \
  -netdev tap,id=mynet0,script=qemu-ifup.sh,downscript=qemu-ifdown.sh \
  -device virtio-net,mac=52:54:00:0e:e0:65,netdev=mynet0 \
  -device virtio-rng-pci \
  -drive file=images/testing.qcow2,if=virtio \
  -drive file=cloud-init.iso,if=virtio
