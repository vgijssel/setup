#!/bin/bash

set -e
set +x

docker build -t debian_image_builder .
docker run --rm \
       -v $PWD/images:/images \
       -v disk_image_create_cache:/cache \
       --privileged \
       debian_image_builder \
       scripts/create_image.sh
