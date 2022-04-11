#!/usr/bin/env bash

set -Eeou pipefail
# set -x

export VAGRANT_ARGS="$@"
export VAGRANT_BINARY="{vagrant_binary}"
export VAGRANT_CWD="{output_dir}"

{env_string}

$VAGRANT_BINARY $VAGRANT_ARGS