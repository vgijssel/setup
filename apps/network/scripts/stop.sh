#!/usr/bin/env bash
# Stop the network cluster: delete the vind vcluster (and its kube context). All
# in-cluster state is destroyed. Durable state lives elsewhere: the Tailscale OAuth
# client + api_key + kv secrets remain in the remote OpenBao, and the tailnet ACL
# persists, so a fresh `network:start` (which re-runs tailscale_auth + apply) fully
# re-creates the cluster. Mirrors apps/secret/scripts/stop.sh.
#
# Idempotent: deletes the cluster, or a no-op if it is already absent.
set -euo pipefail

CLUSTER_NAME="${NETWORK_CLUSTER_NAME:-network}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require jq

# Selecting the docker driver first scopes the listing to vind clusters; it is a
# global, idempotent CLI setting.
vcluster use driver docker >/dev/null 2>&1 || true

# `vcluster list --output json` reports docker-driver clusters with capitalised
# keys (.Name / .Status), so match on .Name.
if vcluster list --output json 2>/dev/null |
  jq -e --arg n "${CLUSTER_NAME}" 'any(.[]; .Name == $n)' >/dev/null 2>&1; then
  echo "==> Deleting vind cluster '${CLUSTER_NAME}'"
  vcluster delete "${CLUSTER_NAME}"
else
  echo "==> vcluster '${CLUSTER_NAME}' does not exist; nothing to delete"
fi
