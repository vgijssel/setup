#!/usr/bin/env bash

# Get the docker image info from pants
docker_info="$1"

# Extract the image id from the info using jq
image_id=$(cat $docker_info | jq -r ".image_id")

# Run nixos-rebuild on the target host
docker run \
    --rm \
    -it \
    -v .:/opt/bastion \
    -e SSH_ASKPASS_REQUIRE="force" \
    -e SSH_ASKPASS="/opt/bastion/ssh_askpass.sh" \
    -e NIX_SSHOPTS="-p 63762 -o StrictHostKeyChecking=no" \
    $image_id \
    nixos-rebuild --target-host root@host.docker.internal switch --use-remote-sudo --flake .#bastion