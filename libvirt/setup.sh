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

cp -v $GOPATH/bin/terraform-provider-libvirt ~/.terraform.d/plugins/darwin_amd64/terraform-provider-libvirt

terraform init
