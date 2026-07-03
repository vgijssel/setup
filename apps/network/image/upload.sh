#!/usr/bin/env bash
# Upload the built Kairos RAW image to Hetzner Cloud as a bootable snapshot, and
# print the snapshot id to record into var.image_snapshot_id.
#
#   upload.sh [arm64|amd64]     (default: arm64 — the shipped prod arch; see SPEC §1)
#
# LIVE: hcloud-upload-image spins up a short-lived temporary Hetzner server (small
# one-off cost) to write the image, then deletes it. Requires HCLOUD_TOKEN in the
# environment — the `upload` Moon task sources secrets/.env first. All versions pinned.
set -euo pipefail

ARCH="${1:-arm64}"
case "${ARCH}" in
arm64) HC_ARCH="arm" ;; # Hetzner cax (Ampere) — the shipped prod arch.
amd64) HC_ARCH="x86" ;; # only for a future native-amd64 build host.
*)
	echo "usage: $(basename "$0") [arm64|amd64]" >&2
	exit 2
	;;
esac

# --- Pinned versions --------------------------------------------------------------
HCLOUD_UPLOAD_IMAGE_VERSION="v1.5.0"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build/${ARCH}"
LOCATION="${TF_VAR_location:-nbg1}" # must offer cax; nbg1/fsn1/hel1 do.

: "${HCLOUD_TOKEN:?HCLOUD_TOKEN must be set (run via 'moon run network:upload', which sources secrets/.env)}"

raws=("${BUILD_DIR}"/*.raw)
RAW="${raws[0]}"
[[ -e "${RAW}" ]] || {
	echo "!! no raw image in ${BUILD_DIR}; run 'moon run network:build-image -- ${ARCH}' first" >&2
	exit 1
}

# Compress with zstd: the raw is a large sparse disk (mostly zeros), which zstd
# collapses to a fraction of its size — far less to stage on the temp server + upload.
ZST="${RAW}.zst"
if [[ ! -f "${ZST}" || "${RAW}" -nt "${ZST}" ]]; then
	echo ">> compressing $(basename "${RAW}") -> $(basename "${ZST}") (zstd)"
	command -v zstd >/dev/null || {
		echo "!! zstd not found (brew install zstd)" >&2
		exit 1
	}
	zstd -f -q "${RAW}" -o "${ZST}"
fi

# Reuse the uploader vendored by network-controllers-prod; else this app's .tools;
# else install it pinned via Go. Never runs unpinned.
UPLOADER="${APP_DIR}/../network-controllers-prod/.tools/hcloud-upload-image"
if [[ ! -x "${UPLOADER}" ]]; then
	UPLOADER="${APP_DIR}/.tools/hcloud-upload-image"
	if [[ ! -x "${UPLOADER}" ]]; then
		echo ">> installing hcloud-upload-image ${HCLOUD_UPLOAD_IMAGE_VERSION} -> ${APP_DIR}/.tools"
		GOBIN="${APP_DIR}/.tools" go install \
			"github.com/apricote/hcloud-upload-image@${HCLOUD_UPLOAD_IMAGE_VERSION}"
	fi
fi

echo ">> uploading ${ARCH} (${HC_ARCH}) image to Hetzner (${LOCATION}); a temp server is created + deleted"
"${UPLOADER}" upload \
	--architecture "${HC_ARCH}" \
	--image-path "${ZST}" \
	--compression zstd \
	--location "${LOCATION}" \
	--description "network-kairos-${ARCH}" \
	--labels "os=kairos,role=network,arch=${ARCH}"

echo ""
echo ">> Done. Record the new snapshot id into var.image_snapshot_id:"
echo "     hcloud image list --type snapshot"
echo "   then set the default in variables.tf (or export TF_VAR_image_snapshot_id)."
