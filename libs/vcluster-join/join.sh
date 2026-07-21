#!/usr/bin/env bash
# Join a nested child vcluster to the root KubeVela over the IN-CLUSTER control
# path (cluster-gateway) — no tailnet, no LE cert (SPEC §3.1).
#
# Usage: join.sh <name> <namespace>
#
# KubeVela has no native "join a vcluster I just created" step (SPEC §9 #7), so
# this is the small imperative bridge control:up runs right after the child's
# Application reports the vcluster Ready:
#   1. read the vcluster's generated kubeconfig (Secret vc-<name>, key `config`)
#   2. rewrite its server from https://localhost:8443 to the in-cluster Service DNS
#      https://<name>.<namespace>:443 — which the vcluster serving cert covers
#      (SAN `<name>.<namespace>`) and which resolves from any pod via the
#      svc.cluster.local search path
#   3. `vela cluster join` (idempotent: detach any stale registration first)
#
# `vela cluster join` simply writes a labeled Secret in vela-system
# (cluster.core.oam.dev/cluster-credential-type=X509Certificate; keys ca.crt/
# endpoint/tls.crt/tls.key) that cluster-gateway consumes.
set -euo pipefail

NAME="${1:?child vcluster name required}"
NS="${2:?child vcluster namespace required}"
TIMEOUT="${JOIN_TIMEOUT:-300s}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require vela

# `vela up` returns immediately; the helmchart component deploys the vcluster
# asynchronously, so poll for the StatefulSet to be CREATED before waiting on it.
echo "==> [${NAME}] waiting for the vcluster StatefulSet to be created"
for _ in $(seq 1 90); do
  kubectl -n "${NS}" get "statefulset/${NAME}" >/dev/null 2>&1 && break
  sleep 2
done

echo "==> [${NAME}] waiting for the vcluster pod to be Ready"
kubectl -n "${NS}" rollout status "statefulset/${NAME}" --timeout="${TIMEOUT}"
kubectl -n "${NS}" wait --for=condition=Ready "pod/${NAME}-0" --timeout="${TIMEOUT}"

echo "==> [${NAME}] waiting for the generated kubeconfig secret vc-${NAME}"
for _ in $(seq 1 60); do
  kubectl -n "${NS}" get secret "vc-${NAME}" >/dev/null 2>&1 && break
  sleep 2
done

tmp="$(mktemp)"
trap 'rm -f "${tmp}"' EXIT
kubectl -n "${NS}" get secret "vc-${NAME}" -o jsonpath='{.data.config}' | base64 -d >"${tmp}"

# Rewrite the server to the in-cluster Service DNS endpoint. Portable across
# GNU/BSD sed by not using in-place editing.
sed "s#server: https://localhost:8443#server: https://${NAME}.${NS}:443#" "${tmp}" >"${tmp}.rewritten"
mv "${tmp}.rewritten" "${tmp}"

echo "==> [${NAME}] joining to the root (idempotent)"
vela cluster detach "${NAME}" >/dev/null 2>&1 || true
vela cluster join "${tmp}" --name "${NAME}"

echo "==> [${NAME}] joined:"
vela cluster list | grep -E "(^CLUSTER|${NAME})"
