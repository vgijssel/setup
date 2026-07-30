#!/usr/bin/env bash
# Port-forward the OpenBao service to localhost:8200 so an operator can enter the
# handful of seed secrets OpenBao cannot self-provide (e.g. the Cloudflare API token,
# Tailscale OAuth client, Netdata creds) into the kv engine via the bao CLI or UI.
#
# Everything else is declarative: OpenBao self-initialises + auto-unseals, and
# Crossplane reconciles the config. This is the one interactive human step, and only
# for secrets that must originate from a person.
#
# Long-running; Ctrl-C to stop.
set -euo pipefail

NS="${SECRET_NAMESPACE:-secret}"
SVC="${OPENBAO_SERVICE:-openbao}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vcluster
require kubectl

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient
# kube-context (select the docker driver + connect; idempotent).
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

CURRENT_CONTEXT="$(kubectl config current-context 2>/dev/null || echo "?")"
echo "==> kubectl context: ${CURRENT_CONTEXT}"
echo "==> Port-forwarding svc/${SVC} (ns ${NS}) -> http://127.0.0.1:${LOCAL_PORT}"
echo "==> In another shell:"
echo "      export BAO_ADDR=http://127.0.0.1:${LOCAL_PORT}"
echo "      bao login    # then: bao kv put kv/<name> ..."
echo "==> Ctrl-C to stop."

exec kubectl -n "${NS}" port-forward "svc/${SVC}" "${LOCAL_PORT}:8200"
