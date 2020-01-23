#!/bin/bash

set -Eeoux pipefail

# source .envrc

compgen -v

echo "::set-env name=BASE_IMAGE::yellow"
