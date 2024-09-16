#!/usr/bin/env bash

# For provisioning the flake against a target host
#
#    ./provision.sh <image_id>
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

# Run nixos-rebuild on the target host
docker run \
    --rm \
    -v .:/opt/bastion \
    -v $VOLUME_NAME:/nix \
    -e SSH_ASKPASS_REQUIRE="force" \
    -e SSH_ASKPASS="/opt/bastion/ssh_askpass.sh" \
    -e NIX_SSHOPTS="-p 63762 -o StrictHostKeyChecking=no" \
    $image_id \
    nixos-rebuild --target-host root@host.docker.internal switch --use-remote-sudo --flake .#bastion