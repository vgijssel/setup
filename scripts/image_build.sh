#!/bin/bash

set -Eeoux pipefail

IMAGE_CONFIG_FILE="$1"
source "${IMAGE_CONFIG_FILE}"

DISK_IMAGE_DIR=$(digest.sh "${IMAGE_CONFIG_FILE}")
DISK_IMAGE_HOST_DIR="${SETUP_ROOT_DIR}/${DISK_IMAGE_DIR}"
DISK_IMAGE_DOCKER_PATH="${DISK_IMAGE_DIR}/${IMAGE_NAME}"

# Try to restore the directory from cache
if [[ "${CI_SEMAPHORE}" = true ]]; then
  cache restore "${DISK_IMAGE_DIR}"
fi

if [[ -d "${DISK_IMAGE_HOST_DIR}" ]]; then
  echo "Already exists, exiting: ${DISK_IMAGE_HOST_DIR}"
  exit 0
fi

if [[ "$CI" = false ]]; then
  EXTRA_DOCKER_ARGS="-it --env break=after-error"
fi

GLOBAL_ELEMENTS_DIR="${SETUP_ELEMENTS_DIR}"
IMAGE_BUILDER_NAME="${DOCKER_REGISTRY_URL}/${IMAGE_BUILDER_IMAGE}"

export DIB_APT_MINIMAL_CREATE_INTERFACES=0
# Force extlinux instead of grub2
IMAGE_SHA_TAG=$(git rev-parse HEAD)

if [[ "${CI}" = true ]]; then
  docker login -u mvgijssel -p "${GITHUB_DOCKER_REGISTRY_TOKEN}" docker.pkg.github.com
fi

export DIB_DEV_USER_USERNAME=devuser
export DIB_DEV_USER_PWDLESS_SUDO=true
export DIB_DEV_USER_PASSWORD=devuser

CONTAINER=$(
  docker run \
    --rm \
    --privileged \
    $EXTRA_DOCKER_ARGS \
    -d \
    -v /sys/fs/cgroup:/sys/fs/cgroup:ro \
    -v "${SETUP_IMAGE_DIR}:/app/image" \
    -v "${LOCAL_ELEMENTS_DIR}:/app/local_elements" \
    -v "${GLOBAL_ELEMENTS_DIR}:/app/global_elements" \
    --env DIB_RELEASE \
    --env DIB_APT_MINIMAL_CREATE_INTERFACES \
    --env DIB_DEV_USER_USERNAME \
    --env DIB_DEV_USER_PWDLESS_SUDO \
    --env DIB_DEV_USER_PASSWORD \
    "${IMAGE_BUILDER_NAME}:${IMAGE_SHA_TAG}"
)

function cleanup {
  docker rm -f "$CONTAINER"
}

trap cleanup EXIT HUP INT QUIT PIPE TERM

docker exec \
  $EXTRA_DOCKER_ARGS \
  $CONTAINER \
  disk-image-create -t qcow2,tgz -x --image-size "${IMAGE_SIZE}" -o "${DISK_IMAGE_DOCKER_PATH}" "${ELEMENTS}"

# Store the directory in the cache
if [[ "${CI_SEMAPHORE}" = true ]]; then
  cache store "${DISK_IMAGE_DIR}" "${DISK_IMAGE_DIR}"
fi
