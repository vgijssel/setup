#!/bin/bash

set -Eeou pipefail

RESULT=$("$@")

jq -n --arg result "${RESULT}" '{"result":$result}'
