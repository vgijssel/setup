#!/usr/bin/env bash
# Start the secret cluster: create (or reconnect to) the standalone "secret"
# cluster on vind (vcluster docker driver) — a single-node kubeadm-style cluster
# that is throwaway bootstrap substrate. The durable artifacts are the Fleet
# bundles under src/, so the same manifests work unchanged once Rancher manages
# this cluster later.
#
# The cluster comes up empty. Next:
#   moon run secret:apply      # install Fleet + apply the bundles
#   moon run secret:bootstrap  # seed the seal key + initialise OpenBao
#
# Idempotent: creates the cluster, or just reconnects if it already exists.
set -euo pipefail

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

# terranetes-controller (and its terranetes-executor jobs) ship amd64-only images
# — appvia publishes no arm64/multi-arch variant. On an arm64 host (Apple Silicon)
# the vind node is arm64, so those pods CrashLoop with "exec format error" unless
# the Docker host has qemu/binfmt registered to emulate amd64. Register it here so
# `fleet apply` yields a running controller non-interactively. Idempotent and a
# no-op on amd64 hosts. All other operator images are multi-arch and unaffected.
HOST_ARCH="$(uname -m)"
if [[ "${HOST_ARCH}" = "arm64" ]] || [[ "${HOST_ARCH}" = "aarch64" ]]; then
  if command -v docker >/dev/null 2>&1; then
    echo "==> arm64 host: registering qemu/binfmt so amd64 images (terranetes) run"
    docker run --privileged --rm tonistiigi/binfmt:qemu-v9.2.2 --install amd64 >/dev/null 2>&1 ||
      echo "WARN: qemu/binfmt registration failed; terranetes-controller may CrashLoop on arm64"
  fi
fi

CURRENT_CONTEXT="$(kubectl config current-context)"
echo "==> Cluster ready; kubectl context: ${CURRENT_CONTEXT}"
echo "==> Next: moon run secret:apply"
