#!/bin/bash

if [ ${DIB_DEBUG_TRACE:-1} -gt 0 ]; then
    set -x
fi
set -eu
set -o pipefail

curl -fsSL get.rebar.digital/stable -o install.sh

bash ./install.sh install

drpcli bootenvs uploadiso sledgehammer
drpcli prefs set defaultWorkflow discover-base unknownBootEnv discovery defaultBootEnv sledgehammer defaultStage discover
