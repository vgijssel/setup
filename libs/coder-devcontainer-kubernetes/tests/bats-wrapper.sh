#!/bin/bash
# Wrapper for bats that works around hermit symlink validation issues
# Downloads and prepares a clean bats installation without problematic test fixtures

set -euo pipefail

BATS_CLEAN_DIR="/tmp/bats-clean-$$"
BATS_VERSION="1.13.0"

# Cleanup on exit
trap 'rm -rf "${BATS_CLEAN_DIR}"' EXIT

# Download and extract bats without problematic fixtures
mkdir -p "${BATS_CLEAN_DIR}"
curl -sL "https://github.com/bats-core/bats-core/archive/refs/tags/v${BATS_VERSION}.tar.gz" \
  | tar xz -C "${BATS_CLEAN_DIR}" --strip-components=1

# Remove the problematic test fixtures that trigger hermit path traversal detection
rm -rf "${BATS_CLEAN_DIR}/test/fixtures/suite/recursive_with_symlinks"

# Run bats from the clean installation
exec bash "${BATS_CLEAN_DIR}/bin/bats" "$@"
