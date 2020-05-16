#!/bin/bash

set -Eeoux pipefail

IMAGE_SHA_TAG=$(git rev-parse HEAD)

docker_build.sh $IPXE_IMAGE .

id=$(docker create "${IPXE_IMAGE}:${IMAGE_SHA_TAG}")

docker cp $id:/app/ipxe/src/bin/undionly.kpxe undionly.kpxe
docker cp $id:/app/ipxe/src/bin/ipxe.dsk ipxe.ds

docker rm -v $id
