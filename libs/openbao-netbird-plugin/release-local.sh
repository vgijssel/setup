#!/usr/bin/env bash
# Build the plugin for the CLUSTER's architecture and load it straight into the vind node's
# containerd, bypassing a registry entirely.
#
# WHY THIS EXISTS: no credential here carries `write:packages`, so `release.sh` fails against
# ghcr with "denied: permission_denied". The init container in apps/secret/src/openbao/values.yaml
# pins a tag and so defaults to imagePullPolicy IfNotPresent, which means a locally-present image
# is used and no pull is attempted. Same approach as the cloudflare plugin.
#
# LIMITATION, and it matters: an image that exists only in the node's containerd does NOT survive
# `moon run secret:stop` (vcluster delete takes the node with it). A cold start will fail to pull
# until the image is pushed to ghcr properly. This is a development shortcut, not a release.
#
# `docker cp` into the node does NOT work (loft-sh vm-container: `docker exec` lands in a
# different mount namespace, so ctr reports "no such file") — the tar goes in over stdin.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
VERSION="${VERSION:?set VERSION, e.g. VERSION=0.1.4}"
ARCH="${ARCH:-arm64}"
NODE="${NODE:-vcluster.cp.secret}"
IMAGE_REF="${REGISTRY}/openbao-plugin-secrets-netbird:${VERSION}"

echo "==> Building ${IMAGE_REF} for linux/${ARCH}"
docker buildx build --platform "linux/${ARCH}" --load -t "${IMAGE_REF}" "${SCRIPT_DIR}" >/dev/null

echo "==> Loading into ${NODE}'s containerd (k8s.io namespace)"
docker save "${IMAGE_REF}" | docker exec -i "${NODE}" ctr -n k8s.io images import - >/dev/null

# Delegated to plugin-sha.sh rather than inlined, so the local shortcut and the CI pin
# (bin/openbao-plugin-pin) compute the checksum exactly one way. IMAGE_REF is passed through
# because the image here is the locally-built one, not whatever version.txt declares.
echo "==> pin this in apps/secret/src/openbao-config/plugin-netbird.yaml"
IMAGE_REF="${IMAGE_REF}" ARCH="${ARCH}" "${SCRIPT_DIR}/plugin-sha.sh"
