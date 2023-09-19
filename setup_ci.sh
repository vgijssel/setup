#!/usr/bin/env bash
set -e

# Enable debugging
set -x

curl -fsSL https://get.jetpack.io/devbox | FORCE=1 bash

devbox run -- echo "Installed Packages."