#!/usr/bin/env bash
# Wrapper to run commands from the original working directory (MOON_WORKING_DIR)
# instead of the moon project directory. Adds dist/node_modules/.bin to PATH
# so pnpm-installed binaries are available.
set -euo pipefail
cd "${MOON_WORKING_DIR}"
export PATH="${MOON_PROJECT_ROOT}/dist/node_modules/.bin:${PATH}"
exec "$@"
