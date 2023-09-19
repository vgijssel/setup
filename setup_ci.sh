#!/usr/bin/env bash
set -e

# Enable debugging
set -x

# Change to the WORKSPACE directory
cd "$BUILD_WORKSPACE_DIRECTORY"

curl -fsSL https://get.jetpack.io/devbox | FORCE=1 bash