#!/usr/bin/env bash
# Install the Fleet controller and apply every Fleet bundle for the network
# cluster (run after network:start). Mirrors apps/secret/scripts/apply.sh.
#
# 1. Install the Fleet controller in single-cluster mode into cattle-fleet-system
#    (throwaway bootstrap substrate; the portable fleet.yaml bundles are the durable
#    artifact and migrate unchanged to a Rancher-managed Fleet later).
#
# 2. Label the local Fleet cluster cluster.vgijssel.nl/name=network — the selector
#    the multi-cluster platform bundles key on (apps/platform/src/*). This gates
#    ingress-nginx and the secret-ingress ProxyGroup OUT (their targets match only
#    `secret`) and pins network's per-cluster values (operator hostname
#    network-operator, external-dns txtOwnerId network-cluster).
#
# 3. `fleet apply` the SHARED platform bundles this cluster consumes plus network's
#    OWN bundles. network runs no OpenBao, so it omits the OpenBao/ingress-nginx/
#    secret-ingress bundles. It DOES run terranetes, though — to reconcile
#    apps/network/src/tailscale-config (the tailnet policy) against the remote OpenBao.
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

# Label the local cluster BEFORE applying bundles, or the label-selected platform
# bundles would match no cluster and not deploy (see header). Idempotent.
echo "==> Labeling the local Fleet cluster: cluster.vgijssel.nl/name=network"
kubectl -n "${FLEET_NS}" label clusters.fleet.cattle.io local \
  cluster.vgijssel.nl/name=network --overwrite >/dev/null

# ── Apply the bundles (fleet resolves chart file:// deps relative to CWD) ────
cd "${REPO_ROOT}"

# Apply a network-owned bundle only once its directory has manifests. Lets this
# script run end-to-end while the network bundles are built out task by task
# (they land under apps/network/src as T10–T14 progress).
apply_if_present() { # apply_if_present <bundle-name> <dir>
  if [[ -d "$2" ]] && find "$2" -maxdepth 1 -type f \( -name '*.yaml' -o -name '*.yml' \) | grep -q .; then
    echo "==> Applying ${1} (${2})"
    fleet apply -n "${FLEET_NS}" "$1" "$2"
  else
    echo "==> Skipping ${1}: ${2} has no manifests yet"
  fi
}

echo "==> Applying shared platform bundles"
fleet apply -n "${FLEET_NS}" platform-external-secrets apps/platform/src/external-secrets
fleet apply -n "${FLEET_NS}" platform-cert-manager apps/platform/src/cert-manager
fleet apply -n "${FLEET_NS}" platform-tailscale apps/platform/src/tailscale
fleet apply -n "${FLEET_NS}" platform-external-dns apps/platform/src/external-dns
fleet apply -n "${FLEET_NS}" platform-netdata apps/platform/src/netdata
fleet apply -n "${FLEET_NS}" platform-terranetes apps/platform/src/terranetes
fleet apply -n "${FLEET_NS}" platform-config apps/platform/src/config

echo "==> Applying network bundles"
apply_if_present network-config apps/network/src/config
apply_if_present network-ingress apps/network/src/tailscale-proxygroup
apply_if_present network-mongodb apps/network/src/mongodb
apply_if_present network-omada apps/network/src/omada

echo "==> Applied. Bundles:"
kubectl -n "${FLEET_NS}" get bundles 2>/dev/null || true

echo "==> Next: moon run network:bootstrap, then network:configure"
