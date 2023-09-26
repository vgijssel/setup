#!/bin/sh

set -x
set -e

env

echo $PATH

sudo env

sudo which nix-build

if [ -f /nix/receipt.json ]; then
  echo "Nix is already installed"
else
  echo "Installing Nix"

  curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install linux \
    --init none \
    --extra-conf "sandbox = false" \
    --no-start-daemon \
    --no-confirm
fi
