#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUT_DIR="${PROJECT_DIR}/dist"

# Version configuration from environment (DEPENDENCIES is JSON from moon.yml @meta)
DEPENDENCIES="${DEPENDENCIES:?DEPENDENCIES must be set}"
REALTEK_VERSION=$(echo "$DEPENDENCIES" | jq -r '.["siderolabs/realtek-firmware"].version')
REALTEK_PACKAGE=$(echo "$DEPENDENCIES" | jq -r '.["siderolabs/realtek-firmware"].packageName')

IMAGE_REF="${REALTEK_PACKAGE}:${REALTEK_VERSION}"

mkdir -p "$OUT_DIR"

echo "Fetching digest for ${IMAGE_REF}..."

# Get the amd64 digest from the manifest
DIGEST=$(docker manifest inspect "$IMAGE_REF" 2>/dev/null | jq -r '.manifests[] | select(.platform.architecture == "amd64") | .digest')

if [[ -z "$DIGEST" || "$DIGEST" == "null" ]]; then
    echo "Error: Could not fetch digest for ${IMAGE_REF}"
    exit 1
fi

echo "$DIGEST" > "${OUT_DIR}/realtek-firmware.sha"

echo "Digest: ${DIGEST}"
echo "Saved to: ${OUT_DIR}/realtek-firmware.sha"
