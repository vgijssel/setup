#!/usr/bin/env bash
# Create the local k3d bootstrap cluster. Idempotent: a no-op (beyond ensuring
# the cluster is started) when the cluster already exists.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
CONFIG_FILE="${PROJECT_DIR}/k3d.yaml"
CLUSTER_NAME="bootstrap"

if k3d cluster list -o json | jq -e --arg n "${CLUSTER_NAME}" 'any(.[]; .name == $n)' >/dev/null; then
  echo "==> k3d cluster '${CLUSTER_NAME}' already exists; ensuring it is started"
  k3d cluster start "${CLUSTER_NAME}"
else
  echo "==> Creating k3d cluster '${CLUSTER_NAME}'"
  extra_args=()
  # In docker-in-docker (e.g. Coder workspaces) the default overlayfs snapshotter
  # fails to mount; fall back to the native snapshotter there (per CLAUDE.md).
  if [[ -f /.dockerenv ]]; then
    echo "    docker-in-docker detected; using native snapshotter"
    extra_args+=(--k3s-arg "--snapshotter=native@server:*")
  fi
  k3d cluster create --config "${CONFIG_FILE}" "${extra_args[@]+"${extra_args[@]}"}"
fi

current_context="$(kubectl config current-context)"
echo "==> Cluster ready; kubectl context: ${current_context}"
