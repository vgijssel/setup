#!/usr/bin/env bash
# Print the sha256 of the plugin binary INSIDE the published image, for one architecture.
#
# This is the value apps/secret/src/openbao-config/plugin-cloudflare.yaml pins as
# `plugin_sha256`. OpenBao hashes the binary it is handed on disk, so the pin must match the
# architecture the CLUSTER runs — a sha taken from the amd64 layer fails registration on an
# arm64 node with a bare "checksum mismatch". Both vind clusters are arm64 (`uname -m` =
# aarch64), hence the default.
#
# Note `--entrypoint sha256sum` is required: the image's ENTRYPOINT is the plugin binary itself,
# so `docker run <image> sha256sum ...` would execute the PLUGIN with those arguments and print
# nothing useful.
set -euo pipefail

REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
VERSION="${VERSION:-0.1.0}"
ARCH="${ARCH:-arm64}"
IMAGE_REF="${IMAGE_REF:-${REGISTRY}/openbao-plugin-secrets-cloudflare:${VERSION}}"
BINARY="/openbao-plugin-secrets-cloudflare"

echo "==> sha256 of ${BINARY} in ${IMAGE_REF} (linux/${ARCH})" >&2

docker run --rm --platform "linux/${ARCH}" --entrypoint sha256sum "${IMAGE_REF}" "${BINARY}" |
    awk '{print $1}'
