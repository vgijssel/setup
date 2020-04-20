#!/bin/bash

set -Eeoux pipefail

IMAGE_FILE="$1"
VAGRANT_FILE="$2"

OVF_FILE="$SETUP_SCRIPTS_DIR/virtualbox.ovf"

# Create a temp dir within /tmp
TMP_DIR=$(TMPDIR=/tmp mktemp -d -t qcow_to_vagrant-XXXXXXXXXXXXX)

TMP_QCOW_FILE="$TMP_DIR/image.qcow2"

CLOUD_INIT_FILE="box-disk001.iso"
TMP_CLOUD_INIT="$TMP_DIR/$CLOUD_INIT_FILE"

VMDK_FILE="box-disk002.vmdk"
TMP_VMDK_FILE="$TMP_DIR/$VMDK_FILE"

TMP_BOX_FILE="$TMP_DIR/image.box"

METADATA_FILE="metadata.json"
TMP_METADATA="$TMP_DIR/$METADATA_FILE"

NEW_OVF_FILE="box.ovf"
TMP_OVF="$TMP_DIR/$NEW_OVF_FILE"

# Copy qcow2 file to tmp directory
cp -v $IMAGE_FILE $TMP_QCOW_FILE

# Resize the image to 32GB
qemu-img resize $TMP_QCOW_FILE 32G

# Convert the qcow2 to vmdk
qemu-img convert -f qcow2 -O vmdk $TMP_QCOW_FILE $TMP_VMDK_FILE

# Copy virtualbox export config file
cp -v $OVF_FILE $TMP_OVF

# Create Vagrant metadata
cat <<EOF | tee $TMP_METADATA
{
  "provider": "virtualbox"
}
EOF

# Create cloud-init user-data
cat <<EOF | tee $TMP_DIR/user-data
#cloud-config
users:
  - name: debian
    plain_text_passwd: debian

    # So we can login at the console
    lock_passwd: false

    shell: /bin/bash

    # Unrestricted sudo access
    sudo: ALL=(ALL) NOPASSWD:ALL

    ssh_authorized_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCzfw0T40U3c6+7M7yZ9M0cEJNUXcxgGN+pyVYNdaTFdSl6981EhkFRGWmXzPRs628dnz5agH66ZI6dFY/tnzl3/XBiDgCfNekk9C2fszKfXEaIWotroZhQUFdjSupW8wot/a5STHaNlkiJ9+n9T8wK+tWBmDQrW2o9AdcevRamYAy14bSNC0QKQCuN54wrd3slcBOMYMQVCc7gQWSBKXfgN7IpumhT7zjvxA7hzU8/yr9Voz2g7vh8KWcEohXmnojXXTS9xQ5GC+Fp6jWyF9DCEmJTHN1Qx+no91M0p6O9SBSxfKyK6f4jlY0Zop9B0cDKxHLc2iKxTpErEkl0mnWr test@localhost

  - name: vagrant
    plain_text_passwd: vagrant
    lock_passwd: false
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL

    ssh_authorized_keys:
    - ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEA6NF8iallvQVp22WDkTkyrtvp9eWW6A8YVr+kz4TjGYe7gHzIw+niNltGEFHzD8+v1I2YJ6oXevct1YeS0o9HZyN1Q9qgCgzUFtdOKLv6IedplqoPkcmF0aYet2PkEDo3MlTBckFXPITAMzF8dJSIFo9D8HfdOV0IAdx4O7PtixWKn5y2hMNG0zQPyUecp4pzC6kivAIhyfHilFR61RGL+GPXQ2MWZWFYbAGjyiYJnAmCP3NOTd0jMZEnDkbUvxhMmBYSdETk1rRgm+R4LOzFUGaHqHDLKLX+FIPKcF96hrucXzcWyLbIbEgE98OHlnVYCzRdK8jlqm8tehUc9c9WhQ== vagrant insecure public key

EOF

# Create cloud-init meta-data
cat <<EOF | tee $TMP_DIR/meta-data
# Auto-Generated - DO NOT CHANGE THIS
EOF

# Generate cloud-init image
mkisofs \
    -output $TMP_CLOUD_INIT \
    -volid cidata \
    -joliet \
    -rock {$TMP_DIR/user-data,$TMP_DIR/meta-data}

tar -C $TMP_DIR -cvzf $TMP_BOX_FILE $VMDK_FILE $CLOUD_INIT_FILE $METADATA_FILE $NEW_OVF_FILE

mv -v $TMP_BOX_FILE $VAGRANT_FILE

rm -rf $TMP_DIR
