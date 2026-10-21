#!/usr/bin/env bash
# Print the sha256 of the plugin binary INSIDE the published image, for one architecture.
#
# This is the value apps/secret/src/openbao-config/plugin-netbird.yaml pins as
# `plugin_sha256`, and OpenBao v2.5.5 REQUIRES it — a registration without it is rejected
# with `400 missing SHA-256 value`, so the pin cannot simply be dropped. OpenBao hashes the
# binary it is handed on disk, so the pin must match the architecture the CLUSTER runs: a sha
# taken from the amd64 layer fails registration on an arm64 node with a bare "checksum
# mismatch". Both vind clusters are arm64 (`uname -m` = aarch64), hence the default.
#
# Note `--entrypoint sha256sum` is required: the image's ENTRYPOINT is the plugin binary
# itself, so `docker run <image> sha256sum ...` would execute the PLUGIN with those arguments
# and print nothing useful.
#
# Normally invoked by bin/openbao-plugin-pin from CI rather than by hand; it reads version.txt
# so it describes the same version release.sh publishes. Mirrors
# libs/openbao-cloudflare-plugin/plugin-sha.sh, and replaces the copy of this logic that was
# inlined in release-local.sh.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
VERSION="${VERSION:-$(tr -d '[:space:]' <"${SCRIPT_DIR}/version.txt")}"
ARCH="${ARCH:-arm64}"
IMAGE_REF="${IMAGE_REF:-${REGISTRY}/openbao-plugin-secrets-netbird:${VERSION}}"
BINARY="/openbao-plugin-secrets-netbird"

echo "==> sha256 of ${BINARY} in ${IMAGE_REF} (linux/${ARCH})" >&2

docker run --rm --platform "linux/${ARCH}" --entrypoint sha256sum "${IMAGE_REF}" "${BINARY}" |
    awk '{print $1}'
