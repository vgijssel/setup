#!/usr/bin/env bash
# Delete the local k3d bootstrap cluster. Idempotent: a no-op when the cluster
# does not exist.
set -euo pipefail

CLUSTER_NAME="bootstrap"

if k3d cluster list -o json | jq -e --arg n "${CLUSTER_NAME}" 'any(.[]; .name == $n)' >/dev/null; then
  echo "==> Deleting k3d cluster '${CLUSTER_NAME}'"
  k3d cluster delete "${CLUSTER_NAME}"
else
  echo "==> k3d cluster '${CLUSTER_NAME}' not found; nothing to do"
fi
