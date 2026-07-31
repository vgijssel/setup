#!/usr/bin/env bash
# Start the network cluster: create (or reconnect to) the standalone "network"
# cluster on vind (vcluster docker driver) — a single-node kubeadm-style cluster
# that is throwaway bootstrap substrate. The durable artifacts are the Fleet
# bundles under src/, so the same manifests work unchanged once Rancher manages
# this cluster later. Mirrors apps/secret/scripts/start.sh.
#
# `start` now runs the full bring-up end-to-end: create the cluster, seed the
# NetBird operator management API PAT (network:put_netbird_operator_auth — breaks the
# operator/ESO chicken-and-egg), then install Fleet + apply every bundle (network:apply).
#
# Idempotent: creates the cluster, or just reconnects if it already exists.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHARTS_DIR="${REPO_ROOT}/third_party/vendir/charts"
CLUSTER_NAME="${NETWORK_CLUSTER_NAME:-network}"
FLEET_SYSTEM_NS="cattle-fleet-system"
FLEET_NS="fleet-local"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require kubectl
require jq
require helm
require fleet

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

# No qemu/binfmt registration: every operator/app image this cluster runs (netbird-operator,
# cert-manager, external-secrets, external-dns, the Percona MongoDB operator + server,
# crossplane + provider-upjet-cloudflare, and mbentley/omada-controller) is multi-arch
# (arm64), so no amd64 emulation is needed on this host.

CURRENT_CONTEXT="$(kubectl config current-context)"
echo "==> Cluster ready; kubectl context: ${CURRENT_CONTEXT}"

# Seed the NetBird operator management API PAT BEFORE apply, so the operator finds
# netbird-mgmt-api-key on first start and can bring up the routing-peer egress ESO needs.
echo "==> Seeding the NetBird operator management API PAT (scripts/put_netbird_operator_auth.sh)"
"${SCRIPT_DIR}/put_netbird_operator_auth.sh"

# ── Install the Fleet controller + label THIS cluster ─────────────────────────
# Done HERE (not in apply.sh) while the kube-context is known-good: start.sh has just
# run `vcluster connect "${CLUSTER_NAME}"`, so the active context is guaranteed to be
# this cluster. Labelling used to live in apply.sh, but it keyed off the ambient
# kubeconfig context — if an external tool switched the active context, apply could
# stamp cluster.vgijssel.nl/name onto the WRONG cluster and make the two vind clusters
# collide (a cross-cluster clobber that took OpenBao down once). apply.sh now only
# verifies this label and refuses to run on a mismatch.
#
# Single-cluster mode: the same cluster is both Fleet manager and agent (the
# fleet-local workspace / `local` cluster). Charts are vendored + pinned under
# third_party/vendir/charts. Idempotent (helm upgrade --install; label --overwrite).
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
  if kubectl get clusters.fleet.cattle.io -A 2>/dev/null | grep -qw local; then break; fi
  sleep 2
done

echo "==> Labeling the local Fleet cluster: cluster.vgijssel.nl/name=${CLUSTER_NAME}"
kubectl -n "${FLEET_NS}" label clusters.fleet.cattle.io local \
  cluster.vgijssel.nl/name="${CLUSTER_NAME}" --overwrite >/dev/null

# End-to-end: apply every bundle. apply.sh verifies the label above, then pushes bundles.
echo "==> Applying Fleet bundles (scripts/apply.sh)"
exec "${SCRIPT_DIR}/apply.sh"
