#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
VERSION="${VERSION:-0.1.2}"
IMAGE_REF="${REGISTRY}/openbao-plugin-secrets-netbird:${VERSION}"
SOURCE_REPO="https://github.com/vgijssel/setup"

echo "Building and pushing openbao-plugin-secrets-netbird..."
echo "  Target: ${IMAGE_REF}"
echo ""

docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --push \
    --label "org.opencontainers.image.source=${SOURCE_REPO}" \
    --tag "${IMAGE_REF}" \
    "${SCRIPT_DIR}"

echo ""
echo "Successfully published ${IMAGE_REF}"
