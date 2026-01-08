#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
PROFILES_DIR="${PROJECT_DIR}/../../third_party/vendir/config/cozystack-talos-profiles/profiles"
OUT_DIR="${PROJECT_DIR}/dist"

# Version configuration from environment (DEPENDENCIES is JSON from moon.yml @meta)
DEPENDENCIES="${DEPENDENCIES:?DEPENDENCIES must be set}"
REALTEK_VERSION=$(echo "${DEPENDENCIES}" | jq -r '.["siderolabs/realtek-firmware"].version')
REALTEK_PACKAGE=$(echo "${DEPENDENCIES}" | jq -r '.["siderolabs/realtek-firmware"].packageName')

# Read digest from generated sha file
REALTEK_DIGEST=$(cat "${OUT_DIR}/realtek-firmware.sha")
REALTEK_IMAGE="${REALTEK_PACKAGE}:${REALTEK_VERSION}@${REALTEK_DIGEST}"

mkdir -p "${OUT_DIR}"

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
