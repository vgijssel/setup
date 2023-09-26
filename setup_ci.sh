#!/bin/sh

set -x
set -e



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

# sudo which nix-build
env
echo $PATH
sudo env
ls -la /nix/var/nix/profiles/default/bin

sudo ln -f -s /nix/var/nix/profiles/default/bin/nix-build /usr/local/bin/nix-build

which nix-build