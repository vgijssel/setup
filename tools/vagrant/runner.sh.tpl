#!/usr/bin/env bash

set -Eeoux pipefail

export VAGRANT_ARGS="$@"
export VAGRANT_BINARY="{vagrant_binary}"
export VAGRANT_CWD="{output_dir}"

{env_string}

$VAGRANT_BINARY $VAGRANT_ARGS