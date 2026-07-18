#!/usr/bin/env bash
# Install the Fleet controller in single-cluster mode into cattle-fleet-system so
# Bundles unpack in-cluster: the same cluster is both Fleet manager and agent (the
# fleet-local workspace / `local` cluster). The fleet chart bootstraps the local
# agent automatically.
#
# This standalone controller is throwaway bootstrap — the portable fleet.yaml
# bundles it applies are the durable artifact and migrate unchanged to a
# Rancher-managed Fleet later. Charts are vendored + pinned (0.15.4, matching the
# hermit-pinned fleet CLI) under third_party/vendir/charts.
#
# Idempotent: helm upgrade --install for both charts; safe to re-run.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHARTS_DIR="${REPO_ROOT}/third_party/vendir/charts"
NAMESPACE="cattle-fleet-system"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require helm
require kubectl

echo "==> Installing fleet-crd (CustomResourceDefinitions)"
helm upgrade --install fleet-crd "${CHARTS_DIR}/fleet-crd" \
  --namespace "${NAMESPACE}" --create-namespace --wait

echo "==> Installing fleet controller (single-cluster mode)"
helm upgrade --install fleet "${CHARTS_DIR}/fleet" \
  --namespace "${NAMESPACE}" --wait

echo "==> Waiting for fleet-controller to be Available"
kubectl -n "${NAMESPACE}" rollout status deploy/fleet-controller --timeout=180s

# The fleet-controller bootstraps the local agent, which registers a `local`
# cluster in the fleet-local namespace a few seconds after it comes up.
echo "==> Waiting for the local cluster to register"
for _ in $(seq 1 60); do
  if kubectl get clusters.fleet.cattle.io -A 2>/dev/null | grep -qw local; then
    break
  fi
  sleep 2
done

echo "==> Fleet is installed; registered clusters:"
kubectl get clusters.fleet.cattle.io -A
