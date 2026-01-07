#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUT_DIR="${PROJECT_DIR}/dist"

# Version configuration from environment (DEPENDENCIES is JSON from moon.yml @meta)
DEPENDENCIES="${DEPENDENCIES:?DEPENDENCIES must be set}"
TALOS_VERSION=$(echo "$DEPENDENCIES" | jq -r '.["siderolabs/talos"].version')
ARCH="${ARCH:-amd64}"
IMAGER_IMAGE="ghcr.io/siderolabs/imager:${TALOS_VERSION}"

PROFILE_PATH="${OUT_DIR}/installer.yaml"
OUTPUT_PATH="${OUT_DIR}/installer-${ARCH}.tar"

if [[ ! -f "$PROFILE_PATH" ]]; then
    echo "Error: Profile not found at ${PROFILE_PATH}"
    echo "Run the custom-profile task first."
    exit 1
fi

echo "Building Talos installer image..."
echo "  Talos version: ${TALOS_VERSION}"
echo "  Architecture: ${ARCH}"
echo "  Profile: ${PROFILE_PATH}"
echo "  Output: ${OUTPUT_PATH}"
echo ""

# Run the imager with the custom profile
# The imager reads the profile from stdin and outputs a tar archive
cat "$PROFILE_PATH" | docker run --rm -i \
    -v /dev:/dev \
    --privileged \
    "$IMAGER_IMAGE" \
    --tar-to-stdout - > "$OUTPUT_PATH"

echo ""
echo "Build complete!"
echo "Output archive: ${OUTPUT_PATH}"
ls -lh "$OUTPUT_PATH"
