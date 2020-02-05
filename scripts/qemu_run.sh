#!/bin/bash

set -Eeoux pipefail

IMAGE_NAME="$1"
MACHINE_NUMBER="$2"
SOCKET_MODE="$3"
IMAGE_FILE="$4"
IMAGE_FILE_COPY_DIR="$SETUP_TMP_DIR/$IMAGE_NAME"
IMAGE_FILE_COPY_FILE="$IMAGE_FILE_COPY_DIR/$IMAGE_NAME.qcow2"
CLOUD_INIT_FILE="$IMAGE_FILE_COPY_DIR/cloud-init.iso"
QEMU_MAC="52:54:00:0e:e0:6${MACHINE_NUMBER}"

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

    ssh_authorized_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCn4TA0w3azvSkj0N8fDVeXKdXybpWK8QyWQOsSV69lBjN9weF2oq1/r55AC+zVbLeHdhUYcMFOhKnzCCT/QqaA53LJ8WQ5n3a8vY0z3r1URiBj8hXsUZ4tonRGPl9TtmHA2cFvU1yqD/OVN8zQQUSgmwib7BS9nQANbZNv/cTG1Jq44A+NSA8wY6dkfdOhRd1XISZGSuYAEdScv2OKqehWDquxksJ8xmQJw7OBpkk7idm6sDKj+aSAkjNZCcE9WaLQghDzvrUC2dhaPXbTC/m1L/PfBe0ohqV1BAPMAF+gRHGTGRIZEDEJHeaSOt23f01kn2froYiAfYgaTZUzbucB test-keys@localhost
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
  name: ens2
  subnets:
    - type: dhcp
- type: physical
  name: ens3
  subnets:
     - type: static
       address: 192.168.100.1${MACHINE_NUMBER}/24
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
#
# -nodefaults disables the default devices like floppy drive
#
# -accel hax
#        enables hardware acceleration on macos local and github

qemu-system-x86_64 \
  -m 2048 \
  -smp 2 \
  -serial mon:stdio \
  -display none \
  -vga none \
  -nodefaults \
  -accel hax \
  -netdev user,id=mynet0,hostfwd=tcp:0.0.0.0:220"${MACHINE_NUMBER}"-:22 \
  -device virtio-net-pci,netdev=mynet0 \
  -netdev socket,id=vlan,"${SOCKET_MODE}"=127.0.0.1:1234 \
  -device virtio-net-pci,netdev=vlan,mac="${QEMU_MAC}" \
  -device virtio-rng-pci \
  -drive file="$IMAGE_FILE_COPY_FILE",if=virtio \
  -drive file="$CLOUD_INIT_FILE",format=raw,if=virtio
