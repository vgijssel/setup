#!/bin/bash

# See https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/ for what this `set` means
set -Eeoux pipefail

IMAGE_NAME="$1"
IMAGE_DIRECTORY="$2"

GIT_BRANCH="${GITHUB_REF}"
GIT_SHA=$(git rev-parse HEAD)

IMAGE_BRANCH_TAG=$(echo "${GIT_BRANCH}" | tr "/" _)
IMAGE_SHA_TAG="${GIT_SHA}"

docker login -u mvgijssel -p "${GITHUB_TOKEN}" docker.pkg.github.com

docker pull "${IMAGE_NAME}:latest" || true
docker pull "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}" || true

docker build \
       --cache-from "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}" \
       --cache-from "${IMAGE_NAME}:latest" \
       --tag "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}" \
       --tag "${IMAGE_NAME}:${IMAGE_SHA_TAG}" \
       --file "${IMAGE_DIRECTORY}/Dockerfile" \
       "${IMAGE_DIRECTORY}"

docker push "${IMAGE_NAME}:${IMAGE_SHA_TAG}"
docker push "${IMAGE_NAME}:${IMAGE_BRANCH_TAG}"
