#!/usr/bin/env bash
# Build the Kairos OS image for `network` and turn it into bootable artifacts.
#
#   build.sh [arm64|amd64]     (default: arm64 — the local fast loop; amd64 is the
#                               authoritative promotion gate, see tasks/plan.md)
#
# Produces, under image/build/<arch>/:
#   - a RAW disk image  (booted locally in QEMU; uploaded to Hetzner for promotion)
#   - an ISO            (alternative local boot / rescue)
#
# All tool versions are pinned per repo CLAUDE.md (no :latest).
set -euo pipefail

ARCH="${1:-arm64}"
case "${ARCH}" in
arm64 | amd64) ;;
*)
	echo "usage: $(basename "$0") [arm64|amd64]" >&2
	exit 2
	;;
esac

# --- Pinned versions --------------------------------------------------------------
AURORABOOT_IMAGE="quay.io/kairos/auroraboot:v0.25.0"
VERSION="${VERSION:-0.1.0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_TAG="network-kairos:local-${ARCH}"
OUT_DIR="${SCRIPT_DIR}/build/${ARCH}"
mkdir -p "${OUT_DIR}"

# The UniFi OS Server install (T6) runs at build time and needs rootless Podman + user
# namespaces, which the default buildx sandbox blocks. Use a docker-container BuildKit
# builder granted the security.insecure entitlement and build with `RUN --security=insecure`.
BUILDER="netbuilder"
if ! docker buildx inspect "${BUILDER}" >/dev/null 2>&1; then
	echo ">> creating BuildKit builder '${BUILDER}' (security.insecure entitlement)"
	docker buildx create --name "${BUILDER}" --driver docker-container \
		--buildkitd-flags '--allow-insecure-entitlement security.insecure' >/dev/null
fi

echo ">> [1/3] Building Kairos OCI image ${IMAGE_TAG} (linux/${ARCH})"
docker buildx --builder "${BUILDER}" build \
	--allow security.insecure \
	--platform "linux/${ARCH}" \
	--build-arg "VERSION=${VERSION}" \
	--load \
	-t "${IMAGE_TAG}" \
	"${SCRIPT_DIR}"

# AuroraBoot reads the OCI image from the local docker daemon (oci: prefix, needs the
# socket). Both steps below reference the just-built image `oci:${IMAGE_TAG}`.
#
# RAW: a pre-installed, pre-partitioned Kairos disk (active/passive/recovery + a
# COS_PERSISTENT partition) — the artifact we boot in QEMU (T1) and upload to Hetzner
# (T11). Produced by the MAIN auroraboot command via --set flags (there is no
# `build-raw` subcommand in v0.25.0). disk.efi=true = EFI image (Hetzner/QEMU-OVMF).
# --privileged is required because it creates loop devices for partitioning.
echo ">> [2/3] AuroraBoot RAW disk -> ${OUT_DIR}"
docker run --rm --privileged \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-v "${OUT_DIR}:/output" \
	"${AURORABOOT_IMAGE}" \
	--set "disable_http_server=true" \
	--set "disable_netboot=true" \
	--set "disk.efi=true" \
	--set "container_image=oci:${IMAGE_TAG}" \
	--set "state_dir=/output"

# ISO: live/installer image (alternative local boot / rescue).
echo ">> [3/3] AuroraBoot build-iso -> ${OUT_DIR}"
docker run --rm \
	-v /var/run/docker.sock:/var/run/docker.sock \
	-v "${OUT_DIR}:/output" \
	"${AURORABOOT_IMAGE}" build-iso --arch "${ARCH}" -o /output "oci:${IMAGE_TAG}"

echo ">> Artifacts:"
ls -lh "${OUT_DIR}"
