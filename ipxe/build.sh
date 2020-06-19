#!/bin/bash

set -Eeoux pipefail

IMAGE_SHA_TAG=$(git rev-parse HEAD)
FULL_IMAGE_NAME="${DOCKER_REGISTRY_URL}/${IPXE_IMAGE}"

docker_build.sh "${IPXE_IMAGE}" "${SETUP_IPXE_DIR}"

id=$(docker create "${FULL_IMAGE_NAME}:${IMAGE_SHA_TAG}")

docker cp $id:/app/ipxe/src/bin/undionly.kpxe "${SETUP_IPXE_DIR}"/output/undionly.kpxe
docker cp $id:/app/ipxe/src/bin/ipxe.dsk "${SETUP_IPXE_DIR}"/output/ipxe.dsk

docker rm -v $id
