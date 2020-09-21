#!/bin/bash

if [ ${DIB_DEBUG_TRACE:-1} -gt 0 ]; then
    set -x
fi
set -eu
set -o pipefail

curl -fsSL get.rebar.digital/stable -o install.sh

bash ./install.sh install

drpcli bootenvs uploadiso sledgehammer

# This makes sure that systemd output is sent to the serial port
drpcli profiles set global param kernel-console to "console=tty0 console=ttyS0,115200"

# Install Immutable Image Deployment
drpcli catalog item install image-deploy

# Install base content pack
pushd /drp/base
drpcli contents bundle base.yml
drpcli contents upload base.yml
popd

# TODO: Note we're want to set the unknownBootEnv to ignore as we're pre-registering the machines in digital rebar.
# But this prevents regular workflow even for pre-registered machines.
drpcli prefs set defaultWorkflow discover-new unknownBootEnv discovery defaultBootEnv sledgehammer defaultStage discover
