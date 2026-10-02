#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="${REGISTRY:-ghcr.io/vgijssel/setup}"
VERSION="${VERSION:-0.1.0}"
IMAGE_REF="${REGISTRY}/openbao-plugin-secrets-cloudflare:${VERSION}"
SOURCE_REPO="https://github.com/vgijssel/setup"

echo "Building and pushing openbao-plugin-secrets-cloudflare..."
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
echo ""
echo "Next: pin the plugin catalog sha256 for the cluster's architecture:"
echo "  moon run openbao-cloudflare-plugin:plugin_sha"
