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

PLUGIN_LIBVIRT_DIR="${HOME}/.terraform.d/plugins/local/setup/libvirt/0.0.1/darwin_amd64"
PLUGIN_LIBVIRT_NAME="terraform-provider-libvirt_v0.0.1"
mkdir -p $PLUGIN_LIBVIRT_DIR

cp -v $GOPATH/bin/terraform-provider-libvirt $PLUGIN_LIBVIRT_DIR/$PLUGIN_LIBVIRT_NAME

terraform init
