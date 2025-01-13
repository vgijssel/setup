#!/bin/bash
set -euo pipefail

root="$1"
wheel="$2"
wheel="$root/$wheel"

cd "${root}"
export PIPX_HOME=$root/.pipx

export HERMIT_STATE_DIR=$root/.hermit

pipx install $wheel

unset HERMIT_STATE_DIR