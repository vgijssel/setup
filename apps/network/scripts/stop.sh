#!/usr/bin/env bash
# Stop the network cluster: delete the vind vcluster (and its kube context). All
# in-cluster state is destroyed. Durable state lives elsewhere: the Tailscale OAuth
# client + kv secrets remain in the remote OpenBao / 1Password, and the tailnet ACLs
# persist, so a fresh network:start + network:apply + network:bootstrap re-creates
# the cluster. Note (SPEC R5): the cluster's OIDC issuer/JWKS may change on recreate,
# so re-run network:bootstrap and secret:configure to re-grant JWT access after a
# stop+start. Mirrors apps/secret/scripts/stop.sh.
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
