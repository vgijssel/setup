#!/usr/bin/env bash
# Start the secret cluster: create (or reconnect to) the standalone "secret"
# cluster on vind (vcluster docker driver) — a single-node kubeadm-style cluster
# that is throwaway bootstrap substrate. The durable artifacts are the Fleet
# bundles under src/, so the same manifests work unchanged once Rancher manages
# this cluster later.
#
# Once the node is Ready this script invokes apply.sh, so a single `secret:start`
# brings the cluster up AND applies every Fleet bundle end-to-end. OpenBao then
# self-initialises + auto-unseals and Crossplane reconciles the full config — no
# bootstrap/configure step.
#
# Idempotent: creates the cluster, or just reconnects if it already exists.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vcluster
require kubectl
require jq

# vind uses the docker driver: a standalone vcluster running in its own Docker
# container rather than nested inside a host cluster. Selecting the driver is a
# global, idempotent CLI setting, and scopes the subsequent listing to vind.
echo "==> Selecting the docker driver (vind)"
vcluster use driver docker >/dev/null 2>&1 || true

# `vcluster list --output json` reports docker-driver clusters with capitalised
# keys (.Name / .Status), so match on .Name.
if vcluster list --output json 2>/dev/null |
  jq -e --arg n "${CLUSTER_NAME}" 'any(.[]; .Name == $n)' >/dev/null 2>&1; then
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
  if kubectl get nodes -o name 2>/dev/null | grep -q .; then break; fi
  sleep 2
done

echo "==> Waiting for the node to become Ready"
kubectl wait --for=condition=Ready nodes --all --timeout=180s

# No qemu/binfmt registration: the crossplane core + upbound/provider-vault images
# are multi-arch (arm64), and platform-terranetes (the only amd64-only bundle) targets
# the network cluster, not secret. If a future secret bundle needs an amd64-only image
# on an arm64 host, gate a `docker run --privileged tonistiigi/binfmt --install amd64`
# here on that specific need.

CURRENT_CONTEXT="$(kubectl config current-context)"
echo "==> Cluster ready; kubectl context: ${CURRENT_CONTEXT}"

# End-to-end: install Fleet + apply every bundle. OpenBao self-inits + auto-unseals
# and Crossplane configures it — no further manual step.
echo "==> Applying Fleet bundles (scripts/apply.sh)"
exec "${SCRIPT_DIR}/apply.sh"
