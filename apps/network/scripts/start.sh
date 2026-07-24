#!/usr/bin/env bash
# Start the network cluster: create (or reconnect to) the standalone "network"
# cluster on vind (vcluster docker driver) — a single-node kubeadm-style cluster
# that is throwaway bootstrap substrate. The durable artifacts are the Fleet
# bundles under src/, so the same manifests work unchanged once Rancher manages
# this cluster later. Mirrors apps/secret/scripts/start.sh.
#
# `start` now runs the full bring-up end-to-end: create the cluster, seed the
# Tailscale operator OAuth client (network:tailscale_auth — breaks the operator/ESO
# chicken-and-egg), then install Fleet + apply every bundle (network:apply).
#
# Idempotent: creates the cluster, or just reconnects if it already exists.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLUSTER_NAME="${NETWORK_CLUSTER_NAME:-network}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
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

# No qemu/binfmt registration: every operator/app image this cluster runs (tailscale,
# cert-manager, external-secrets, external-dns, the Percona MongoDB operator + server,
# crossplane + provider-upjet-tailscale, and mbentley/omada-controller) is multi-arch
# (arm64), so no amd64 emulation is needed on this host.

CURRENT_CONTEXT="$(kubectl config current-context)"
echo "==> Cluster ready; kubectl context: ${CURRENT_CONTEXT}"

# Seed the Tailscale operator OAuth client BEFORE apply, so the operator finds
# operator-oauth on first start and can bring up the tailnet egress ESO needs.
echo "==> Seeding the Tailscale operator OAuth client (scripts/tailscale_auth.sh)"
"${SCRIPT_DIR}/tailscale_auth.sh"

# End-to-end: install Fleet + apply every bundle.
echo "==> Applying Fleet bundles (scripts/apply.sh)"
exec "${SCRIPT_DIR}/apply.sh"
