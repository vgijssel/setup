#!/usr/bin/env bash

set -e

$PYINFRA_BINARY --debug --sudo $INVENTORY_FILE $DEPLOY_FILE