#!/bin/bash

set -Eeoux pipefail

if [ -d "./terraform-provider-libvirt" ]; then
  pushd ./terraform-provider-libvirt
  git pull
  popd
else
  git clone https://github.com/dmacvicar/terraform-provider-libvirt.git
fi

export GO111MODULE=on
export GOFLAGS=-mod=vendor

pushd terraform-provider-libvirt
LDFLAGS="-w" make install
popd

mkdir -p ~/.terraform.d/plugins/darwin_amd64

cp -v $GOPATH/bin/terraform-provider-libvirt ~/.terraform.d/plugins/darwin_amd64/terraform-provider-libvirt


PLUGIN_DIR="${HOME}/.terraform.d/plugins"
mkdir -p "${PLUGIN_DIR}"

# Download and extract the latest terraform-provider-ansible
# https://github.com/nbering/terraform-provider-ansible/releases
wget -O terraform-provider-ansible.zip https://github.com/nbering/terraform-provider-ansible/releases/download/v1.0.3/terraform-provider-ansible-darwin_amd64.zip
unzip -o terraform-provider-ansible.zip -d "${PLUGIN_DIR}"

terraform init
