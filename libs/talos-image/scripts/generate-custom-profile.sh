#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PROFILES_DIR="${PROJECT_DIR}/../../third_party/vendir/config/cozystack-talos-profiles/profiles"
OUT_DIR="${PROJECT_DIR}/dist"

# Version configuration from environment
REALTEK_VERSION="${REALTEK_FIRMWARE_VERSION:-20251125}"
REALTEK_DIGEST="${REALTEK_FIRMWARE_DIGEST:-sha256:b959398fc4072441be8e04a95422c15b3d5e54c227185c0ff463932506053f60}"
REALTEK_IMAGE="ghcr.io/siderolabs/realtek-firmware:${REALTEK_VERSION}@${REALTEK_DIGEST}"

mkdir -p "$OUT_DIR"

echo "Generating custom installer profile with Realtek drivers..."
echo "  Base profile: ${PROFILES_DIR}/installer.yaml"
echo "  Realtek image: ${REALTEK_IMAGE}"

# Copy base profile and add Realtek firmware extension
cp "${PROFILES_DIR}/installer.yaml" "${OUT_DIR}/installer.yaml"

# Add Realtek firmware to the systemExtensions list using yq
yq -i ".input.systemExtensions += [{\"imageRef\": \"${REALTEK_IMAGE}\"}]" "${OUT_DIR}/installer.yaml"

echo "Generated custom profile at: ${OUT_DIR}/installer.yaml"
echo ""
echo "Extensions included:"
yq '.input.systemExtensions[].imageRef' "${OUT_DIR}/installer.yaml"
