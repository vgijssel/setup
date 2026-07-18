#!/usr/bin/env bash
# Bootstrap OpenBao in the already-running secret cluster (run after secret:start):
#   1. seed the static seal key (1Password -> openbao-seal Secret)
#   2. initialise OpenBao (recovery keys + root token -> 1Password; auto-unseals)
#   3. port-forward the OpenBao UI/API so the remaining kv secrets can be added
#
# Idempotent: re-running re-seeds (no-op), reads the root token back, and re-opens
# the port-forward. Press Ctrl-C to stop the port-forward once the secrets are added.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
# For the UI instructions only. Do NOT export OP_ITEM — seed-seal.sh and
# init-openbao.sh each key off their own OP_ITEM default (the seal-key item vs the
# root+recovery item); exporting one clobbers the other.
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
export LOCAL_PORT OP_VAULT

echo "==> [1/3] Seeding the static seal key"
"${SCRIPT_DIR}/seed-seal.sh"

# secret:start applies the OpenBao bundle before the seal key exists, so the pod
# may be stuck in CreateContainerConfigError. Nudge it to restart promptly with
# the seal key rather than waiting out the kubelet backoff.
if kubectl -n "${NAMESPACE}" get pod "${POD}" >/dev/null 2>&1; then
  ready="$(kubectl -n "${NAMESPACE}" get pod "${POD}" -o jsonpath='{.status.containerStatuses[0].ready}' 2>/dev/null || true)"
  if [[ "${ready}" != "true" ]]; then
    echo "==> Restarting ${POD} to pick up the seal key"
    kubectl -n "${NAMESPACE}" delete pod "${POD}" --wait=false >/dev/null 2>&1 || true
  fi
fi

echo "==> [2/3] Initialising OpenBao"
"${SCRIPT_DIR}/init-openbao.sh"

echo "==> [3/3] Port-forwarding the OpenBao UI/API"
cat <<EOF

  OpenBao is initialised and auto-unsealed. Add the remaining secrets via the UI:

    URL:   http://127.0.0.1:${LOCAL_PORT}/ui
    Token: root token in 1Password (${OP_VAULT} / "${ROOT_OP_ITEM}"), or run:
             op item get "${ROOT_OP_ITEM}" --vault ${OP_VAULT} --reveal --fields label=root_token

  In the kv v2 engine "kv", add these secrets (path -> keys):

    kv/cloudflare   token
    kv/tailscale    oauth_client_id, oauth_client_secret
    kv/netdata      claim_token

  external-secrets syncs them into the consuming namespaces automatically.
  Press Ctrl-C to stop the port-forward when you are done.

EOF

# Run the port-forward in the background and wait on it, so the trap fires
# promptly on Ctrl-C (INT) or TERM and tears the forward down cleanly instead of
# leaving an orphan (a foreground child would defer the trap until it exits).
pf_pid=""
trap 'echo; echo "==> Port-forward stopped."; [[ -n "${pf_pid}" ]] && kill "${pf_pid}" 2>/dev/null; exit 0' INT TERM
kubectl -n "${NAMESPACE}" port-forward "svc/openbao" "${LOCAL_PORT}:8200" &
pf_pid=$!
wait "${pf_pid}"
