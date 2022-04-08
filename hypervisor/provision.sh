#!/usr/bin/env bash

set -e

# --debug
$PYINFRA_BINARY --sudo $INVENTORY_FILE $DEPLOY_FILE