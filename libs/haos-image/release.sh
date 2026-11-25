#!/usr/bin/env bash
# Republish the Home Assistant OS disk image UNCOMPRESSED as an asset on this package's release.
#
# WHY THIS EXISTS. Home Assistant ships every artifact compressed (.xz, .ova, .zip) and nothing in
# the Harvester storage path can read a compressed source:
#
#   - Longhorn's backing-image downloader has no decompression at all. longhorn/longhorn#3988
#     ("Support backing image with common compression formats") was closed 2024-08-26 as WON'T DO:
#     "we won't support uploading compressed backing image". harvester/harvester#681 is closed as
#     if it were done, but it was closed in Feb 2024 with that dependency still open, so the
#     Harvester tracker advertises support that does not exist. harvester/harvester#2070, which is
#     exactly the XZ-via-URL symptom, was closed by a stale bot.
#   - Measured on this cluster: a `.qcow2.xz` URL downloads, lands as a backing image with
#     virtualSize=0 because `qemu-img info` cannot parse it, and the volume built on it binds and
#     then fails to attach. It does not error loudly; it produces a useless disk.
#
# So the image has to be decompressed once and served from somewhere. This publishes it to a
# GitHub release, which gives an immutable URL, needs no new infrastructure, and makes a cold
# `fleet apply` of apps/smarthome converge without a human.
#
# TWO VERSION FILES, AND WHY NEITHER IS REDUNDANT:
#
#   moon.yml  project.metadata.dependencies — the UPSTREAM version (e.g. 18.2). Renovate owns it.
#   version.txt                             — the RELEASE version (e.g. 18.2.0). release-please
#                                              owns it, and it is what the git tag carries.
#
# They differ only in shape. Home Assistant's stable tags are always two-part (18.5, 18.4, 17.3 —
# prereleases are 18.5.rc1, which the renovate.json versioning regex excludes), while
# release-please requires semver. The renovate packageRule writes `Release-As: <major>.<minor>.0`
# so release-please cuts exactly the upstream version with a .0 patch rather than inventing its
# own bump. This script asserts the two agree before publishing anything, because they are
# written by two different robots and silent drift would upload an asset named for one version
# onto a release tagged with another.
#
# IDEMPOTENT, three-state, same discipline as bin/registry-tag-exists: asset present -> skip;
# asset absent -> publish; anything else -> fail. Never treat an unexplained failure as
# permission to upload, because an asset cannot be replaced in place and a half-written one is
# indistinguishable from a good one to the cluster that consumes it.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "${HERE}"

UPSTREAM_DEP='home-assistant/operating-system'

die() {
    printf 'ERROR: %s\n' "$1" >&2
    exit 1
}

require() { command -v "$1" >/dev/null 2>&1 || die "'$1' is required but not found"; }

require yq

[[ -f version.txt ]] || die 'version.txt is missing; release-please owns this file'
RELEASE_VERSION="$(tr -d '[:space:]' < version.txt)"
[[ -n "${RELEASE_VERSION}" ]] || die 'version.txt is empty'

UPSTREAM_VERSION="$(yq -r ".project.metadata.dependencies.\"${UPSTREAM_DEP}\".version" moon.yml)"
[[ -n "${UPSTREAM_VERSION}" && "${UPSTREAM_VERSION}" != "null" ]] ||
    die "moon.yml declares no version for ${UPSTREAM_DEP}"

# The contract between the two robots. Renovate bumps the upstream version and asks release-please
# for `<major>.<minor>.0`; if these disagree, one of them did something unexpected and publishing
# would mislabel the asset.
if [[ "${RELEASE_VERSION}" != "${UPSTREAM_VERSION}.0" ]]; then
    die "version.txt (${RELEASE_VERSION}) does not describe upstream ${UPSTREAM_VERSION}.
  version.txt is written by release-please from the 'Release-As: <major>.<minor>.0' footer that
  renovate puts on the upstream bump. A mismatch means either the footer was missing (so
  release-please chose its own semver bump) or version.txt was hand-edited. Fix version.txt and
  .release-please-manifest.json together, or re-run the bump with the footer."
fi

TAG="haos-image@${RELEASE_VERSION}"
ASSET="haos_ova-${UPSTREAM_VERSION}.qcow2"
SOURCE_URL="https://github.com/home-assistant/operating-system/releases/download/${UPSTREAM_VERSION}/haos_ova-${UPSTREAM_VERSION}.qcow2.xz"

if [[ "${1:-}" == '--check' ]]; then
    printf 'ok  upstream=%s release=%s tag=%s asset=%s\n' \
        "${UPSTREAM_VERSION}" "${RELEASE_VERSION}" "${TAG}" "${ASSET}"
    exit 0
fi

require gh
require xz
require curl
require sha256sum

printf '==> release %s should carry asset %s\n' "${TAG}" "${ASSET}"

# Does the release exist? release-please creates it when it cuts the tag. Absence is NOT
# "publish anyway" — without the release there is nothing to attach to, and inventing one here
# would create a release release-please does not know about.
set +e
assets="$(gh release view "${TAG}" --json assets --jq '.assets[].name' 2>&1)"
rc=$?
set -e

if [[ "${rc}" -ne 0 ]]; then
    if printf '%s' "${assets}" | grep -qiE 'release not found|not found'; then
        die "no release tagged ${TAG}.
  version.txt declares ${RELEASE_VERSION}, so release-please should have cut this tag when its
  release PR merged. If the PR is still open, merge it. If it merged and no tag appeared, check
  the Release Please workflow — a stuck 'autorelease: pending' label blocks tagging."
    fi
    die "could not read release ${TAG}, and not because it is absent. Refusing to publish on an
  unexplained failure. GitHub said: ${assets}"
fi

if printf '%s\n' "${assets}" | grep -qxF "${ASSET}"; then
    printf '==> %s is already attached to %s, skipping\n' "${ASSET}" "${TAG}"
    exit 0
fi

printf '==> %s is absent from %s, publishing\n' "${ASSET}" "${TAG}"

work="$(mktemp -d)"
trap 'rm -rf "${work}"' EXIT

printf '==> downloading %s\n' "${SOURCE_URL}"
curl --fail --location --silent --show-error --retry 3 --retry-delay 5 \
    -o "${work}/image.qcow2.xz" "${SOURCE_URL}" ||
    die "download failed for ${SOURCE_URL}. Home Assistant publishes stable tags as two-part
  versions; if ${UPSTREAM_VERSION} is a prerelease or was yanked, the renovate versioning regex
  should have excluded it."

printf '==> decompressing\n'
xz --decompress --stdout "${work}/image.qcow2.xz" > "${work}/${ASSET}"

# Verify we actually produced a qcow2, by magic bytes rather than by trusting the file name.
# This is the exact property the cluster depends on and the one a compressed artifact fails:
# Longhorn runs `qemu-img info` on whatever it fetched and records virtualSize=0 when it cannot
# parse it, which is silent. Catch it here instead.
magic="$(head -c 4 "${work}/${ASSET}" | od -An -tx1 | tr -d ' \n')"
[[ "${magic}" == '514649fb' ]] ||
    die "decompressed output is not a qcow2 (magic ${magic}, expected 514649fb / 'QFI\\xfb')"

if command -v qemu-img >/dev/null 2>&1; then
    printf '==> qemu-img info\n'
    qemu-img info --output=json "${work}/${ASSET}" |
        sed -n 's/.*"virtual-size": \([0-9]*\).*/    virtual-size: \1/p;s/.*"format": "\([a-z0-9]*\)".*/    format: \1/p'
fi

sum="$(sha256sum "${work}/${ASSET}" | cut -d' ' -f1)"
bytes="$(wc -c < "${work}/${ASSET}" | tr -d ' ')"
printf '==> %s  %s bytes  sha256=%s\n' "${ASSET}" "${bytes}" "${sum}"

printf '==> uploading to %s\n' "${TAG}"
gh release upload "${TAG}" "${work}/${ASSET}" --clobber

printf '==> published %s\n' "${ASSET}"
printf '    url:    https://github.com/vgijssel/setup/releases/download/%s/%s\n' "${TAG}" "${ASSET}"
printf '    sha256: %s\n' "${sum}"
printf '    Pin these in apps/smarthome/src/haos-image/virtualmachineimage-haos.yaml.\n'
