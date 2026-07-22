#!/usr/bin/env bash
# Port-forward the secret child's OpenBao to localhost so you can log in (CLI/UI)
# and add kv secrets.
#
# The `secret` child is a nested vcluster that is NOT in the host kubeconfig, so the
# forward goes through the root's cluster-gateway proxy (same in-cluster control path
# control:up uses). It targets the POD directly (openbao-0), not the `openbao`
# Service, whose active/standby routing flaps on the single-node HA raft.
#
# Usage: secret:forward            # forwards localhost:8200 -> openbao-0:8200
#        LOCAL_PORT=8300 secret:forward
#
# Then, to log in:
#   export BAO_ADDR=http://127.0.0.1:${LOCAL_PORT:-8200}
#   set -a; . ./.env; set +a
#   export BAO_TOKEN="$(op item get 'OpenBao root + recovery (secret cluster)' \
#     --vault enigma-prod --reveal --fields label=root_token)"
#   bao kv put kv/... key=value
# or open http://127.0.0.1:${LOCAL_PORT:-8200}/ui and authenticate with the token.
set -euo pipefail

CLUSTER="${CLUSTER:-secret}"
NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
LOCAL_PORT="${LOCAL_PORT:-8200}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl

# Reach the child through the root's cluster-gateway proxy, reusing the current
# context's creds + CA (the proxy is served by the root API host).
ROOT_SERVER="$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')"
PROXY="${ROOT_SERVER}/apis/cluster.core.oam.dev/v1alpha1/clustergateways/${CLUSTER}/proxy"

echo "==> Forwarding http://127.0.0.1:${LOCAL_PORT} -> ${CLUSTER}/${NAMESPACE}/${POD}:8200 (Ctrl-C to stop)"
echo "    Log in: export BAO_ADDR=http://127.0.0.1:${LOCAL_PORT}; or open http://127.0.0.1:${LOCAL_PORT}/ui"
exec kubectl --server "${PROXY}" -n "${NAMESPACE}" port-forward "pod/${POD}" "${LOCAL_PORT}:8200"
