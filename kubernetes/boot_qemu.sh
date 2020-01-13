#!/bin/bash

set -e
set +x

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
  -rock {cloud-init/user-data,cloud-init/meta-data}

# -serial stdio \
# -nographic \
# -nic user \
# -accel hax \

qemu-system-x86_64 \
  -m 2048 \
  -smp 2 \
  -nographic \
  -drive file=images/testing.qcow2,if=virtio \
  -drive file=cloud-init.iso,if=virtio
