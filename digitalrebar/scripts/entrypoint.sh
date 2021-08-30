#!/bin/bash

set -Eeoumx pipefail

# If the data directory is empty copy the seed files into it
FILES=$(ls -A "$DATA_DIRECTORY")
if [[ -z "$FILES" ]]; then
  cp -vR "$SEED_DIRECTORY"/* "$DATA_DIRECTORY"
fi

dr-provision --base-root="$DATA_DIRECTORY"