#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${EXISTING_BUILDER:-}" ]]; then
  echo "Using existing docker-container buildx builder: ${EXISTING_BUILDER}"
  # Ensure the builder is selected and bootstrapped
  docker buildx use "${EXISTING_BUILDER}"
  docker buildx inspect --bootstrap "${EXISTING_BUILDER}" >/dev/null 2>&1 || true
else
  echo "Creating buildx builder for multi-platform builds..."
  BUILDER_NAME="container-builder"
  docker buildx create \
    --name "${BUILDER_NAME}" \
    --driver docker-container \
    --bootstrap --use 2>/dev/null || docker buildx use "${BUILDER_NAME}"
fi
