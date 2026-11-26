#!/usr/bin/env bash
# Build the plugin image THE WAY PRODUCTION BUILDS IT, and emit both things publishing needs:
# the multi-arch OCI image and the per-architecture plugin checksum.
#
# WHY THIS REPLACED `go build`. The old build task compiled with the host toolchain and no flags
# — go1.26.3 darwin/arm64 locally — while the Dockerfile compiles with
# `CGO_ENABLED=0 GOOS=linux GOARCH=$TARGETARCH` under a pinned golang:1.25.11-alpine3.22. It
# therefore proved nothing about the artifact that ships, and its output could not be used for the
# checksum: pinning a locally-built binary's sha256 makes OpenBao reject the plugin with a bare
# "checksum mismatch". Building through buildx makes the thing tested and the thing shipped the
# same thing, which is what lets the digest come from here at all.
#
# TWO OUTPUTS, TWO INVOCATIONS. buildx writes one output per invocation, and these are different
# shapes: the image is an OCI layout tar, the checksum is a plain file exported per platform. The
# second invocation is nearly free, because it reuses the first's build cache and the `digest`
# stage shares `builder` with it.
#
# NEITHER NEEDS EMULATION, despite being multi-arch. `builder` pins `--platform=$BUILDPLATFORM`
# and cross-compiles, and the runtime stage only COPYs into a per-arch alpine, so no foreign
# binary is ever executed. That is what keeps this runnable in CI.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "${HERE}"

PLUGIN="openbao-plugin-secrets-cloudflare"
PLATFORMS="${PLATFORMS:-linux/amd64,linux/arm64}"
DIST="${HERE}/dist"
SOURCE_REPO="https://github.com/vgijssel/setup"

if [[ ! -s version.txt ]]; then
    printf 'ERROR: version.txt is missing or empty — refusing to guess a version.\n' >&2
    exit 1
fi
VERSION="$(tr -d '[:space:]' <version.txt)"

rm -rf "${DIST}"
mkdir -p "${DIST}"

# The artifact publish.sh pushes. `--output=type=oci` writes a self-contained OCI layout, so the
# publish step needs no rebuild and cannot accidentally ship different bytes from the ones built
# and checksummed here.
printf '==> building %s:%s for %s\n' "${PLUGIN}" "${VERSION}" "${PLATFORMS}" >&2
docker buildx build \
    --target runtime \
    --platform "${PLATFORMS}" \
    --label "org.opencontainers.image.source=${SOURCE_REPO}" \
    --tag "${PLUGIN}:${VERSION}" \
    --output "type=oci,dest=${DIST}/image.oci.tar" \
    .

# The per-arch checksums, exported as dist/digest/linux_<arch>/plugin-sha256.txt.
printf '==> extracting per-architecture plugin checksums\n' >&2
docker buildx build \
    --target digest \
    --platform "${PLATFORMS}" \
    --output "type=local,dest=${DIST}/digest" \
    .

# Flatten to dist/sha256-<arch>.txt so consumers need not know buildx's directory convention, and
# fail loudly if a platform produced nothing — an empty checksum would propagate as a pin that
# OpenBao rejects with no explanation.
for dir in "${DIST}"/digest/*/; do
    [[ -d "${dir}" ]] || continue
    platform="$(basename "${dir}")"
    arch="${platform#linux_}"
    sha="$(tr -d '[:space:]' <"${dir}/plugin-sha256.txt")"
    if [[ ! "${sha}" =~ ^[0-9a-f]{64}$ ]]; then
        printf 'ERROR: %s produced %q, which is not a sha256.\n' "${platform}" "${sha}" >&2
        exit 1
    fi
    printf '%s\n' "${sha}" >"${DIST}/sha256-${arch}.txt"
    printf '    %-6s %s\n' "${arch}" "${sha}" >&2
done

if ! compgen -G "${DIST}/sha256-*.txt" >/dev/null; then
    printf 'ERROR: no checksums were exported; the digest stage produced nothing.\n' >&2
    exit 1
fi

printf '==> %s\n' "${DIST}/image.oci.tar" >&2
