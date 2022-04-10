#!/usr/bin/env bash

set -Eeoux pipefail

export VAGRANT_ARGS="$@"
export VAGRANT_BINARY="{vagrant_binary}"
export VAGRANT_CWD="{output_dir}"

{env_string}

# TODO: wtf exec vagrant here? 
$VAGRANT_BINARY exec vagrant $VAGRANT_ARGS