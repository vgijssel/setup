#!/bin/bash

set -Eeoux pipefail

IMAGE_SHA_TAG=$(git rev-parse HEAD)

docker_build.sh "${IPXE_IMAGE}" "${SETUP_IPXE_DIR}"

id=$(docker create "${IPXE_IMAGE}:${IMAGE_SHA_TAG}")

docker cp $id:/app/ipxe/src/bin/undionly.kpxe "${SETUP_IPXE_DIR}"/output/undionly.kpxe
docker cp $id:/app/ipxe/src/bin/ipxe.dsk "${SETUP_IPXE_DIR}"/output/ipxe.dsk

docker rm -v $id
