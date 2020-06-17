#!/bin/bash

# See https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/ for what this `set` means
set -Eeoux pipefail

IMAGE_NAME="$1"
IMAGE_DIRECTORY="$2"

GIT_SHA=$(git rev-parse HEAD)

IMAGE_BRANCH_TAG=$(echo "${GIT_REF}" | tr "/" _)
IMAGE_SHA_TAG="${GIT_SHA}"

docker login -u mvgijssel -p "${GITHUB_DOCKER_REGISTRY_TOKEN}" docker.pkg.github.com

if [[ "$CI" = true ]]; then
  docker pull "${IMAGE_NAME}:latest" || true
  docker pull "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}" || true
fi

docker build \
       --cache-from "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}" \
       --cache-from "${IMAGE_NAME}:latest" \
       --build-arg IMAGE_SHA_TAG="${IMAGE_SHA_TAG}" \
       --tag "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}" \
       --tag "${IMAGE_NAME}:${IMAGE_SHA_TAG}" \
       --file "${IMAGE_DIRECTORY}/Dockerfile" \
       "${IMAGE_DIRECTORY}"

if [[ "$CI" = true ]]; then
  docker push "${IMAGE_NAME}:${IMAGE_SHA_TAG}"
  docker push "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}"
fi
