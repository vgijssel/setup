#!/bin/bash

# See https://vaneyckt.io/posts/safer_bash_scripts_with_set_euxo_pipefail/ for what this `set` means
set -Eeoux pipefail

IMAGE_NAME="$1"
IMAGE_DIRECTORY="$2"
shift 2
EXTRA_ARGS="$@"
LOCAL_IMAGE_NAME="${LOCAL_DOCKER_REGISTRY}/${IMAGE_NAME}"
GITHUB_IMAGE_NAME="${GITHUB_DOCKER_REGISTRY}/${IMAGE_NAME}"

GIT_SHA=$(git rev-parse HEAD)
IMAGE_BRANCH_TAG=$(echo "${GIT_REF}" | tr "/" _)
IMAGE_SHA_TAG="${GIT_SHA}"

if [[ "${CI}" = true ]]; then
  docker login -u mvgijssel -p "${GITHUB_DOCKER_REGISTRY_TOKEN}" docker.pkg.github.com

  # TODO: https://github.com/containerd/containerd/issues/3291#issuecomment-645974051
  # Download the docker image from GitHub
  # tag the image as a local registry image
  # and push it into the local registry
  # This because we cannot use the github registry directly with buildkit builds
  docker pull "${GITHUB_IMAGE_NAME}:latest" || true
  docker tag "${GITHUB_IMAGE_NAME}:latest" "${LOCAL_IMAGE_NAME}:latest" || true
  docker push "${LOCAL_IMAGE_NAME}:latest" || true
  docker pull "${GITHUB_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" || true
  docker tag "${GITHUB_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" "${LOCAL_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" || true
  docker push "${LOCAL_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" || true
fi

docker buildx build \
  --push \
  --cache-from "${LOCAL_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" \
  --cache-from "${LOCAL_IMAGE_NAME}:latest" \
  --build-arg IMAGE_SHA_TAG="${IMAGE_SHA_TAG}" \
  --build-arg DOCKER_REGISTRY="${LOCAL_DOCKER_REGISTRY}" \
  --tag "${LOCAL_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" \
  --tag "${LOCAL_IMAGE_NAME}:${IMAGE_SHA_TAG}" \
  $EXTRA_ARGS \
  "${IMAGE_DIRECTORY}"

if [[ "${CI}" = true ]]; then
  # Now tag the local created image for the GitHub docker registry and push it there
  # For some reason we also cannot do this in one go as with the local registry
  docker tag "${LOCAL_IMAGE_NAME}:${IMAGE_BRANCH_TAG}" "${GITHUB_IMAGE_NAME}:${IMAGE_BRANCH_TAG}"
  docker push "${GITHUB_IMAGE_NAME}:${IMAGE_BRANCH_TAG}"

  docker tag "${LOCAL_IMAGE_NAME}:${IMAGE_SHA_TAG}" "${GITHUB_IMAGE_NAME}:${IMAGE_SHA_TAG}"
  docker push "${GITHUB_IMAGE_NAME}:${IMAGE_SHA_TAG}"
fi

echo "${LOCAL_IMAGE_NAME}:${IMAGE_SHA_TAG}"
