#!/usr/bin/env bash
# Manage the standalone "secret" cluster on vind (vcluster docker driver): a
# single-node k3s-in-docker cluster that replaces the old k3d bootstrap. This is
# throwaway bootstrap substrate — the durable artifacts are the Fleet bundles, so
# the same manifests work unchanged once Rancher manages this cluster later.
#
# Usage: cluster.sh up|down   (default: up)
# Idempotent:
#   up   -> creates the cluster, or just reconnects if it already exists
#   down -> deletes the cluster, or a no-op if it is already absent
set -euo pipefail

CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"
ACTION="${1:-up}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vcluster
require kubectl
require jq

# `vcluster list --output json` reports docker-driver clusters with capitalised
# keys (.Name / .Status), so match on .Name. Selecting the docker driver first
# keeps the listing scoped to vind clusters.
cluster_exists() {
  vcluster use driver docker >/dev/null 2>&1 || true
  vcluster list --output json 2>/dev/null |
    jq -e --arg n "${CLUSTER_NAME}" 'any(.[]; .Name == $n)' >/dev/null 2>&1
}

case "${ACTION}" in
up)
  # vind uses the docker driver: a standalone vcluster running in its own Docker
  # container rather than nested inside a host cluster. Selecting the driver is a
  # global, idempotent CLI setting.
  echo "==> Selecting the docker driver (vind)"
  vcluster use driver docker >/dev/null 2>&1 || true

  if cluster_exists; then
    echo "==> vcluster '${CLUSTER_NAME}' already exists; connecting"
    vcluster connect "${CLUSTER_NAME}"
  else
    echo "==> Creating vind cluster '${CLUSTER_NAME}' (docker driver)"
    vcluster create "${CLUSTER_NAME}" --driver docker --connect
  fi

  # The node object registers a few seconds after connect, so poll for it before
  # `kubectl wait` (which errors with "no matching resources" against an empty set).
  echo "==> Waiting for the node to register"
  for _ in $(seq 1 60); do
    [[ -n "$(kubectl get nodes -o name 2>/dev/null)" ]] && break
    sleep 2
  done

  echo "==> Waiting for the node to become Ready"
  kubectl wait --for=condition=Ready nodes --all --timeout=180s

  current_context="$(kubectl config current-context)"
  echo "==> Cluster ready; kubectl context: ${current_context}"
  ;;
down)
  if cluster_exists; then
    echo "==> Deleting vind cluster '${CLUSTER_NAME}'"
    vcluster delete "${CLUSTER_NAME}"
  else
    echo "==> vcluster '${CLUSTER_NAME}' does not exist; nothing to delete"
  fi
  ;;
*)
  echo "ERROR: unknown action '${ACTION}' (expected 'up' or 'down')" >&2
  exit 1
  ;;
esac
