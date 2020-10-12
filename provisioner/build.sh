#!/bin/bash

set -Eeoux pipefail

# function cleanup {
#     docker rm -f "$CONTAINER"
# }

# trap cleanup EXIT HUP INT QUIT PIPE TERM

if [[ "$CI" = false ]]; then
    EXTRA_PACKER_ARGS="-on-error=ask"
fi

if [[ "$CI" = false ]]; then
    EXTRA_DOCKER_ARGS="-it"
fi

docker run "$EXTRA_DOCKER_ARGS" --rm --privileged -v /dev:/dev -v "$SETUP_PROVISIONER_DIR":/build mkaczanowski/packer-builder-arm build "$EXTRA_PACKER_ARGS" packer.json
