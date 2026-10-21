#!/usr/bin/env bash
# Publish openbao-plugin-secrets-netbird at the version declared in version.txt.
#
# THE SCRIPT'S ONE SIDE EFFECT IS THE PUSH. Everything else it does is a decision about
# whether to take it. That single-effect property is what makes the guard below correct in
# one place, at the top.
#
# Pin propagation lives OUTSIDE this script, in bin/openbao-plugin-pin, deliberately. Were it
# inside, the registry guard would short-circuit the whole script on a tag that already
# exists and the pins would silently never be written — and the bootstrap case is exactly
# where the two disagree about whether there is work to do. On first run version.txt declares
# 0.1.4, which apps/secret/src/openbao/values.yaml ALREADY pins: the image needs publishing
# (the guard says "absent, go") while the image tag needs no change at all, only the
# plugin_sha256 beside it. A guard that gated both would publish the image and then skip the
# pins, leaving the cluster pinning a checksum computed from a locally-built binary.
#
# version.txt is maintained by release-please (release-type "simple", see
# release-please-config.json) and is the SINGLE source of version truth — there is no
# fallback, by design. The previous `VERSION="${VERSION:-0.1.3}"` form is what let CI publish
# 0.1.3 while values.yaml pinned 0.1.4: a default version is a silent wrong answer.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd -P)"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
SOURCE_REPO="https://github.com/vgijssel/setup"
VERSION_FILE="${SCRIPT_DIR}/version.txt"

if [[ ! -s "${VERSION_FILE}" ]]; then
    printf 'ERROR: %s is missing or empty — refusing to guess a version.\n' "${VERSION_FILE}" >&2
    exit 1
fi

# `tr -d` rather than a bare read: release-please writes version.txt with no trailing
# newline, a human editing it leaves one, and a tag must not depend on which happened.
VERSION="$(tr -d '[:space:]' <"${VERSION_FILE}")"

if [[ -z "${VERSION}" ]]; then
    printf 'ERROR: %s contains no version.\n' "${VERSION_FILE}" >&2
    exit 1
fi

IMAGE_REF="${REGISTRY}/openbao-plugin-secrets-netbird:${VERSION}"

echo "Publishing openbao-plugin-secrets-netbird..."
echo "  Target: ${IMAGE_REF}"
echo ""

# Three states, not two: present -> skip; positively absent -> publish; anything else ->
# fail, because a probe failure is not evidence that the tag is free. See
# bin/registry-tag-exists.
set +e
"${REPO_ROOT}/bin/registry-tag-exists" "${IMAGE_REF}"
probe_rc=$?
set -e

case "${probe_rc}" in
0)
    echo "Nothing to do: ${IMAGE_REF} is already published."
    exit 0
    ;;
10) ;; # absent — fall through and publish
*)
    echo "Aborting: could not establish whether ${IMAGE_REF} exists." >&2
    exit "${probe_rc}"
    ;;
esac

docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    --label "org.opencontainers.image.source=${SOURCE_REPO}" \
    --tag "${IMAGE_REF}" \
    "${SCRIPT_DIR}"

echo ""
echo "Successfully published ${IMAGE_REF}"
