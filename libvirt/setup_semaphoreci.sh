#!/bin/bash

set -Eeoux pipefail

wget -O terraform.zip https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip

# unzip terraform binary as scripts/terraform which is in PATH
unzip terraform.zip -d scripts

# download the terraform-libvirt extension
# https://github.com/dmacvicar/terraform-provider-libvirt/releases
wget -O terraform-provider-libvirt.tar.gz https://github.com/dmacvicar/terraform-provider-libvirt/releases/download/v0.6.2/terraform-provider-libvirt-0.6.2+git.1585292411.8cbe9ad0.Ubuntu_18.04.amd64.tar.gz

# Copy the plugin to the right dir
PLUGIN_DIR="${HOME}/.terraform.d/plugins"
mkdir -p "${PLUGIN_DIR}"
tar -C "${PLUGIN_DIR}" -xf terraform-provider-libvirt.tar.gz

pushd "${SETUP_LIBVIRT_DIR}"
terraform init
popd
