#!/usr/bin/env bash
# Install the Fleet controller and apply every Fleet bundle for the network
# cluster (run after network:start). Mirrors apps/secret/scripts/apply.sh.
#
# 1. Install the Fleet controller in single-cluster mode into cattle-fleet-system
#    so Bundles unpack in-cluster: the same cluster is both Fleet manager and
#    agent (the fleet-local workspace / `local` cluster). Charts are vendored +
#    pinned (0.15.4, matching the hermit-pinned fleet CLI) under
#    third_party/vendir/charts. This controller is throwaway bootstrap — the
#    portable fleet.yaml bundles it applies are the durable artifact and migrate
#    unchanged to a Rancher-managed Fleet later.
#
# 2. Label the local Fleet cluster cluster.vgijssel.nl/name=network — the selector
#    the multi-cluster platform + network bundles key on. Cluster targeting is the
#    ONLY deploy gate: each bundle's targetCustomizations/clusterSelector decides
#    whether this cluster gets a BundleDeployment. Crossplane (+ provider-upjet-
#    tailscale) now owns the tailnet policy — there is no terranetes here anymore.
#
# 3. Apply every Fleet bundle via the repo-wide bin/fleet-apply helper, which
#    discovers every fleet.yaml under apps/ (no hardcoded list) and applies each
#    into the fleet-local workspace. Runtime ordering comes from dependsOn labels.
#
# Idempotent: helm upgrade --install for the charts; fleet apply upserts Bundles.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHARTS_DIR="${REPO_ROOT}/third_party/vendir/charts"
FLEET_SYSTEM_NS="cattle-fleet-system"
FLEET_NS="fleet-local"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require helm
require fleet
require kubectl

# ── Install the Fleet controller ───────────────────────────────────────────
echo "==> Installing fleet-crd (CustomResourceDefinitions)"
helm upgrade --install fleet-crd "${CHARTS_DIR}/fleet-crd" \
  --namespace "${FLEET_SYSTEM_NS}" --create-namespace --wait

echo "==> Installing fleet controller (single-cluster mode)"
helm upgrade --install fleet "${CHARTS_DIR}/fleet" \
  --namespace "${FLEET_SYSTEM_NS}" --wait

echo "==> Waiting for fleet-controller to be Available"
kubectl -n "${FLEET_SYSTEM_NS}" rollout status deploy/fleet-controller --timeout=180s

# The fleet-controller bootstraps the local agent, which registers a `local`
# cluster in the fleet-local namespace a few seconds after it comes up.
echo "==> Waiting for the local cluster to register"
for _ in $(seq 1 60); do
  if kubectl get clusters.fleet.cattle.io -A 2>/dev/null | grep -qw local; then
    break
  fi
  sleep 2
done

# Label the standalone Fleet `local` cluster with cluster.vgijssel.nl/name=network.
# Must be set BEFORE `fleet apply` below, or the label-selected bundles would match
# no cluster and not deploy. Idempotent (--overwrite).
echo "==> Labeling the local Fleet cluster: cluster.vgijssel.nl/name=network"
kubectl -n "${FLEET_NS}" label clusters.fleet.cattle.io local \
  cluster.vgijssel.nl/name=network --overwrite >/dev/null

# ── Apply the bundles (global discovery; fleet resolves file:// deps from CWD) ─
echo "==> Applying Fleet bundles (bin/fleet-apply — global discovery)"
"${REPO_ROOT}/bin/fleet-apply" "${FLEET_NS}"

echo "==> Applied. Bundles:"
kubectl -n "${FLEET_NS}" get bundles 2>/dev/null || true

echo "==> Applied. (network:start runs tailscale_auth before this; the api_key persists in OpenBao.)"
