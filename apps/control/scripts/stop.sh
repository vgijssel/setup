#!/usr/bin/env bash
# Stop the control (base) cluster: delete the vind vcluster (and its kube
# context). The child vclusters (secret, network) live INSIDE this base cluster,
# so they are destroyed with it. All in-cluster state is destroyed; durable data
# (OpenBao seal/recovery keys, Tailscale OAuth) remains in 1Password and is
# re-seeded by the KubeVela bring-up on the next control:start + control:up.
#
# Idempotent: deletes the cluster, or a no-op if it is already absent.
set -euo pipefail

CLUSTER_NAME="${CONTROL_CLUSTER_NAME:-control}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
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
