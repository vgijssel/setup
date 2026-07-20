#!/usr/bin/env bash
# Install the Fleet controller and apply every Fleet bundle for the secret
# cluster (run after secret:start).
#
# 1. Install the Fleet controller in single-cluster mode into cattle-fleet-system
#    so Bundles unpack in-cluster: the same cluster is both Fleet manager and
#    agent (the fleet-local workspace / `local` cluster). Charts are vendored +
#    pinned (0.15.4, matching the hermit-pinned fleet CLI) under
#    third_party/vendir/charts. This controller is throwaway bootstrap — the
#    portable fleet.yaml bundles it applies are the durable artifact and migrate
#    unchanged to a Rancher-managed Fleet later.
#
# 2. `fleet apply` each src/ bundle into the fleet-local workspace as an explicit,
#    named bundle. The list is static (not discovered) so it reads as the future
#    Rancher GitRepo `paths:` and each bundle boundary is obvious.
#
# Idempotent: helm upgrade --install for the charts; fleet apply upserts Bundles.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHARTS_DIR="${REPO_ROOT}/third_party/vendir/charts"
FLEET_SYSTEM_NS="cattle-fleet-system"
FLEET_NS="fleet-local"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
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

# Label the standalone Fleet `local` cluster with cluster.vgijssel.nl/name=secret.
# This is the key the multi-cluster platform bundles (apps/platform/src/*) select on
# via fleet.yaml targetCustomizations: bundles gate membership and pick per-cluster
# values off this label. The network cluster's apply.sh sets the same label to
# `network`. Idempotent (--overwrite). Must be set BEFORE `fleet apply` below, or
# the label-selected bundles would match no cluster and not deploy.
echo "==> Labeling the local Fleet cluster: cluster.vgijssel.nl/name=secret"
kubectl -n "${FLEET_NS}" label clusters.fleet.cattle.io local \
  cluster.vgijssel.nl/name=secret --overwrite >/dev/null

# ── Apply the bundles (fleet resolves chart file:// deps relative to CWD) ────
cd "${REPO_ROOT}"

echo "==> Applying Fleet bundles"
fleet apply -n "${FLEET_NS}" secret-config apps/secret/src/config
fleet apply -n "${FLEET_NS}" secret-openbao apps/secret/src/openbao
fleet apply -n "${FLEET_NS}" secret-apiserver-proxy apps/secret/src/apiserver-proxy
fleet apply -n "${FLEET_NS}" platform-external-secrets apps/platform/src/external-secrets
fleet apply -n "${FLEET_NS}" platform-cert-manager apps/platform/src/cert-manager
fleet apply -n "${FLEET_NS}" platform-terranetes apps/platform/src/terranetes
fleet apply -n "${FLEET_NS}" platform-tailscale apps/platform/src/tailscale
fleet apply -n "${FLEET_NS}" platform-tailscale-proxygroup apps/platform/src/tailscale-proxygroup
fleet apply -n "${FLEET_NS}" platform-ingress-nginx apps/platform/src/ingress-nginx
fleet apply -n "${FLEET_NS}" platform-external-dns apps/platform/src/external-dns
fleet apply -n "${FLEET_NS}" platform-netdata apps/platform/src/netdata
fleet apply -n "${FLEET_NS}" platform-config apps/platform/src/config

echo "==> Applied. Bundles:"
kubectl -n "${FLEET_NS}" get bundles 2>/dev/null || true

echo "==> Next: moon run secret:bootstrap"
