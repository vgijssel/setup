#!/bin/bash

if [ ${DIB_DEBUG_TRACE:-1} -gt 0 ]; then
    set -x
fi
set -eu
set -o pipefail

curl -fsSL get.rebar.digital/stable -o install.sh

bash ./install.sh install

drpcli bootenvs uploadiso sledgehammer

# drpcli prefs set defaultWorkflow discover-base unknownBootEnv ignore defaultBootEnv sledgehammer defaultStage discover

# This makes sure that systemd output is sent to the serial port
drpcli profiles set global param kernel-console to "console=tty0 console=ttyS0,115200"

# Install Immutable Image Deployment
drpcli catalog item install image-deploy

# TODO: install discover-new workflow with associated stage and task!

drpcli prefs set defaultWorkflow discover-new unknownBootEnv discovery defaultBootEnv sledgehammer defaultStage discover
