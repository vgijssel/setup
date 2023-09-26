#!/bin/sh

set -x
set -e

curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install linux \
  --init none \
  --extra-conf "sandbox = false" \
  --no-start-daemon \
  --no-confirm
