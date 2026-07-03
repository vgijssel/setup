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

# Resolve the pinned hcloud-upload-image binary. Prefer an existing RUNNABLE copy (the
# one vendored by network-controllers-prod, or this app's .tools); otherwise download
# the pinned release tarball for THIS platform and verify its sha256. No `go` toolchain
# required, so it behaves the same locally (Darwin/arm64) and in CI (Linux/x86_64 GitHub
# Actions runner). Never runs an unpinned or unverified binary (repo CLAUDE.md).
UPLOADER=""
for cand in \
	"${APP_DIR}/../network-controllers-prod/.tools/hcloud-upload-image" \
	"${APP_DIR}/.tools/hcloud-upload-image"; do
	# -x + a real exec (--help) so a wrong-platform vendored binary is rejected, not run.
	if [[ -x "${cand}" ]] && "${cand}" --help >/dev/null 2>&1; then
		UPLOADER="${cand}"
		break
	fi
done

if [[ -z "${UPLOADER}" ]]; then
	os_uname="$(uname -s)"
	case "${os_uname}" in
	Linux) rel_os="Linux" ;;
	Darwin) rel_os="Darwin" ;;
	*)
		echo "!! unsupported OS ${os_uname}" >&2
		exit 1
		;;
	esac
	arch_uname="$(uname -m)"
	case "${arch_uname}" in
	x86_64 | amd64) rel_arch="x86_64" ;;
	aarch64 | arm64) rel_arch="arm64" ;;
	*)
		echo "!! unsupported arch ${arch_uname}" >&2
		exit 1
		;;
	esac
	asset="hcloud-upload-image_${rel_os}_${rel_arch}.tar.gz"
	base="https://github.com/apricote/hcloud-upload-image/releases/download/${HCLOUD_UPLOAD_IMAGE_VERSION}"
	tmp="$(mktemp -d)"
	echo ">> downloading hcloud-upload-image ${HCLOUD_UPLOAD_IMAGE_VERSION} (${asset})"
	curl -fsSL "${base}/${asset}" -o "${tmp}/${asset}"
	curl -fsSL "${base}/hcloud-upload-image_${HCLOUD_UPLOAD_IMAGE_VERSION#v}_checksums.txt" -o "${tmp}/checksums.txt"
	# checksums.txt lines are "<sha256>  <filename>" — match the asset with a single awk
	# (no grep|awk pipe, so no masked exit status).
	want="$(awk -v a="${asset}" '$2 == a {print $1}' "${tmp}/checksums.txt")"
	[[ -n "${want}" ]] || {
		echo "!! ${asset} not found in checksums.txt" >&2
		exit 1
	}
	if command -v sha256sum >/dev/null 2>&1; then
		sumline="$(sha256sum "${tmp}/${asset}")"
	else
		sumline="$(shasum -a 256 "${tmp}/${asset}")"
	fi
	got="${sumline%% *}"
	[[ "${want}" == "${got}" ]] || {
		echo "!! sha256 mismatch for ${asset} (want ${want}, got ${got})" >&2
		exit 1
	}
	mkdir -p "${APP_DIR}/.tools"
	tar -xzf "${tmp}/${asset}" -C "${APP_DIR}/.tools" hcloud-upload-image
	rm -rf "${tmp}"
	UPLOADER="${APP_DIR}/.tools/hcloud-upload-image"
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
