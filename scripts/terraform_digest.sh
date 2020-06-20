#!/bin/bash

set -Eeoux pipefail

RESULT=$(digest.sh "$@")

jq -n --arg result "${RESULT}" '{"result":$result}'
