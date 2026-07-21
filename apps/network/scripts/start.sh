#!/usr/bin/env bash
# Start the network cluster: create (or reconnect to) the standalone "network"
# cluster on vind (vcluster docker driver) — a single-node kubeadm-style cluster
# that is throwaway bootstrap substrate. The durable artifacts are the Fleet
# bundles under src/, so the same manifests work unchanged once Rancher manages
# this cluster later. Mirrors apps/secret/scripts/start.sh.
#
# The cluster comes up empty. Next:
#   moon run network:apply      # install Fleet + apply the bundles
#   moon run network:bootstrap  # seed operator-oauth + extract OIDC issuer/JWKS
#
# Idempotent: creates the cluster, or just reconnects if it already exists.
set -euo pipefail

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

# Precautionary qemu/binfmt registration on arm64 hosts (Apple Silicon): the vind
# node is arm64, and while every operator/app image this cluster runs (tailscale,
# cert-manager, external-secrets, external-dns, the official multi-arch mongo image,
# and mbentley/omada-controller) is multi-arch, registering amd64 emulation is a
# harmless idempotent no-op that de-risks any future amd64-only image. Unlike
# `secret`, network deploys no terranetes (the amd64-only image that made this
# mandatory there).
HOST_ARCH="$(uname -m)"
if [[ "${HOST_ARCH}" = "arm64" ]] || [[ "${HOST_ARCH}" = "aarch64" ]]; then
  if command -v docker >/dev/null 2>&1; then
    echo "==> arm64 host: registering qemu/binfmt for amd64 (precautionary)"
    docker run --privileged --rm tonistiigi/binfmt:qemu-v9.2.2 --install amd64 >/dev/null 2>&1 ||
      echo "WARN: qemu/binfmt registration failed; only matters for amd64-only images"
  fi
fi

CURRENT_CONTEXT="$(kubectl config current-context)"
echo "==> Cluster ready; kubectl context: ${CURRENT_CONTEXT}"
echo "==> Next: moon run network:apply"
