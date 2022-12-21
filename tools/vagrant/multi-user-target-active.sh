#!/usr/bin/env bash

set -Eeou pipefail

echo "Starting checking for multi-user.target being active"

timeout 5 bash -c '
while ! systemctl is-active multi-user.target; do
echo "Waiting for multi-user.target to be active..."
sleep 1
done
'
