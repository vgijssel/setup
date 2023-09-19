#!/usr/bin/env bash
set -e

# Enable debugging
# set -x

# Install nix
curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install linux --no-confirm --init none

# Install devbox
curl -fsSL https://get.jetpack.io/devbox | FORCE=1 bash

which devbox
devbox version

which nix
nix --version

# devbox run -- echo "Installed Packages."