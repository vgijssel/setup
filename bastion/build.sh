#!/usr/bin/env bash

# For building a NixOS image
#
#    ./build.sh <image_id>
#

set -Eeou pipefail

image_id="$1"

VOLUME_NAME="bastion_nix"

if [ ! "$(docker volume ls -q -f name=$VOLUME_NAME)" ]; then
  docker volume create $VOLUME_NAME
  echo "Volume $VOLUME_NAME created."
else
  echo "Volume $VOLUME_NAME already exists."
fi

docker run \
    --rm \
    -v .:/opt/bastion \
    -v $VOLUME_NAME:/nix \
    $image_id \
    /bin/bash -c "nix build .#qcow && cp -v result/nixos.qcow2 bastion.qcow2"