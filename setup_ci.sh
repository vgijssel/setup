#!/bin/sh

set -x
set -e

if [ -f /nix/receipt.json ]; then
  echo "Nix already installed"
else
  echo "Installing Nix"
  curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sudo sh -s -- install linux \
    --init none \
    --extra-conf "sandbox = false" \
    --no-start-daemon \
    --no-confirm
fi

sudo chown -R buildbuddy:buildbuddy /nix
ls -la /nix/var/nix/profiles/default/bin/

sudo ln -f -s /nix/var/nix/profiles/default/bin/nix-build /usr/local/bin/nix-build

nix-build --version