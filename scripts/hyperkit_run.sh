#!/bin/bash

set -Eeoux pipefail

IMAGE_NAME="$1"
MACHINE_NUMBER="$2"
IMAGE_TARGET="$3"

IMAGE_FILE="$IMAGE_TARGET.qcow2"
KERNEL_FILE="$IMAGE_TARGET.vmlinuz"
INITRD_FILE="$IMAGE_TARGET.initrd"

IMAGE_FILE_COPY_DIR="$SETUP_TMP_DIR/$IMAGE_NAME"
IMAGE_FILE_COPY_FILE="$IMAGE_FILE_COPY_DIR/$IMAGE_NAME.qcow2"
IMAGE_FILE_COPY_FILE_RAW="$IMAGE_FILE_COPY_DIR/$IMAGE_NAME.raw"
CLOUD_INIT_FILE="$IMAGE_FILE_COPY_DIR/cloud-init.iso"

echo "Booting '$IMAGE_NAME' with disk '$IMAGE_FILE'"

# Make sure we copy the harddisk, to not change the existing one
mkdir -p $IMAGE_FILE_COPY_DIR
cp -v $IMAGE_FILE $IMAGE_FILE_COPY_FILE

qemu-img resize $IMAGE_FILE_COPY_FILE 32G

# Conver to raw
qemu-img convert -f qcow2 -O raw $IMAGE_FILE_COPY_FILE $IMAGE_FILE_COPY_FILE_RAW

# Create cloud-init user-data
cat <<EOF | tee $IMAGE_FILE_COPY_DIR/user-data
#cloud-config
# openssl passwd -1 -salt SaltSalt debian
# mkpasswd --method=sha-512 --rounds=4096 debian

manage_etc_hosts: true
users:
  - name: kube
    plain_text_passwd: kube
    groups:
      - docker

    # So we can login at the console
    lock_passwd: false

    shell: /bin/bash

    # Unrestricted sudo access
    sudo: ALL=(ALL) NOPASSWD:ALL

    ssh_authorized_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCzfw0T40U3c6+7M7yZ9M0cEJNUXcxgGN+pyVYNdaTFdSl6981EhkFRGWmXzPRs628dnz5agH66ZI6dFY/tnzl3/XBiDgCfNekk9C2fszKfXEaIWotroZhQUFdjSupW8wot/a5STHaNlkiJ9+n9T8wK+tWBmDQrW2o9AdcevRamYAy14bSNC0QKQCuN54wrd3slcBOMYMQVCc7gQWSBKXfgN7IpumhT7zjvxA7hzU8/yr9Voz2g7vh8KWcEohXmnojXXTS9xQ5GC+Fp6jWyF9DCEmJTHN1Qx+no91M0p6O9SBSxfKyK6f4jlY0Zop9B0cDKxHLc2iKxTpErEkl0mnWr test@localhost
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
  name: enp0s1
  subnets:
     - type: static
       address: 192.168.64.10$MACHINE_NUMBER/24
       gateway: 192.168.64.1
EOF

# Generate cloud-init image
mkisofs \
  -output $CLOUD_INIT_FILE \
  -volid cidata \
  -joliet \
  -rock {$IMAGE_FILE_COPY_DIR/user-data,$IMAGE_FILE_COPY_DIR/meta-data,$IMAGE_FILE_COPY_DIR/network-config}

ACPI="-A"
MEM="-m 1G"
SMP="-c 2"
PCI_DEV="-s 0:0,hostbridge -s 31,lpc"
NET="-s 1:0,virtio-net"

IMG_HDD="-s 2:0,virtio-blk,$IMAGE_FILE_COPY_FILE_RAW"
IMG_CD="-s 2:1,ahci-cd,$CLOUD_INIT_FILE"

RND_DEV="-s 4,virtio-rnd"
LPC_DEV="-l com1,stdio"

# Copied from cat /boot/syslinux/syslinux.cfg from inside the image
# these are the kernel parameters the image normally uses
CMDLINE="ro root=LABEL=cloudimg-rootfs console=tty0 console=ttyS0,115200 nofb nomodeset vga=normal hw_rng_model=virtio"

sudo hyperkit $ACPI $MEM $SMP $PCI_DEV $NET $IMG_HDD $IMG_CD $RND_DEV $LPC_DEV -f kexec,$KERNEL_FILE,$INITRD_FILE,"$CMDLINE"
