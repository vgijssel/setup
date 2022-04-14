#!/usr/bin/env bash

set -e

ARGS="$@"

# TODO: this is a hacky wat to get the qemu binary in here
# this can also be solved by specifying the qemu binary in the packer template!
export PATH="$PATH:/usr/local/bin"

# export PACKER_LOG=1

{packer_binary} $ARGS