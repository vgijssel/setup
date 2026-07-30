#!/usr/bin/env bash
# Seed the NetBird operator's management API PAT into the network cluster — the ONE
# manual step network needs, run automatically by network:start before apply (also
# runnable standalone as network:netbird_auth).
#
# Chicken-and-egg: the netbird-operator needs the `netbird-mgmt-api-key` Secret (key
# NB_API_KEY) to talk to the NetBird management API and stand up this cluster's routing
# peer, but on network that Secret is normally synced from the SECRET cluster's OpenBao
# by external-secrets — which cannot reach OpenBao until the operator's NetBird routing
# peer (cross-cluster egress) exists. So break the loop here: read the per-cluster PAT
# (access_token) from the secret cluster's OpenBao using the local `bao` client
# (VAULT_TOKEN from .env, VAULT_ADDR = openbao.secret.vgijssel.nl) and create the
# netbird-mgmt-api-key Secret directly in the network cluster. ESO adopts it later
# (apps/network/src/config/externalsecret-netbird-mgmt-api-key.yaml).
#
# Once the operator is up and its routing peer is Connected, external-secrets reaches
# OpenBao over NetBird and re-syncs this same Secret — no further seeding here. The
# operator creates its own NetBird SetupKeys/Groups via the management API (recorded in
# the SetupKey CR's status), so there is no separate setup key to seed.
#
# Per-cluster credential (mirrors the old Tailscale operator-oauth split): the network
# cluster reads kv/network-netbird-operator, the secret cluster reads
# kv/secret-netbird-operator, so a rotation/compromise is bounded to one cluster and each
# operator peer has an independent NetBird identity.
#
# Secrets never touch git: the root token lives only in .env; the PAT is read into a
# shell variable and written straight to a Kubernetes Secret.
#
# Idempotent: re-reads and re-applies the netbird-mgmt-api-key Secret.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CLUSTER_NAME="${NETWORK_CLUSTER_NAME:-network}"
CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
NB_NAMESPACE="${NB_NAMESPACE:-netbird}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://openbao.secret.vgijssel.nl}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_OPERATOR_PATH="${KV_OPERATOR_PATH:-network-netbird-operator}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require kubectl
require jq
require bao

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient
# kube-context (select the docker driver + connect; idempotent). This makes the
# active context this cluster; the explicit --context "${CONTEXT}" flags below still
# pin every write to it belt-and-suspenders.
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

# Load VAULT_TOKEN (secret-cluster root) from .env if not already exported.
if [[ -z "${VAULT_TOKEN:-}" && -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env"
  set +a
fi
if [[ -z "${VAULT_TOKEN:-}" ]]; then
  echo "ERROR: VAULT_TOKEN is not set (expected the secret-cluster root token in ${REPO_ROOT}/.env)" >&2
  exit 1
fi
export VAULT_ADDR="${REMOTE_BAO_ADDR}"

# Confirm the network context exists (network:start must have run).
if ! kubectl --context "${CONTEXT}" get nodes >/dev/null 2>&1; then
  echo "ERROR: network cluster context '${CONTEXT}' is not reachable. Run 'moon run network:start' first." >&2
  exit 1
fi

echo "==> Reading ${KV_MOUNT}/${KV_OPERATOR_PATH} from ${REMOTE_BAO_ADDR}"
op_json="$(bao kv get -mount="${KV_MOUNT}" -format=json "${KV_OPERATOR_PATH}" 2>/dev/null || true)"
api_token="$(jq -r '.data.data.access_token // empty' <<<"${op_json}")"
if [[ -z "${api_token}" ]]; then
  echo "ERROR: could not read access_token from ${KV_MOUNT}/${KV_OPERATOR_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Confirm this machine can reach OpenBao and kv/${KV_OPERATOR_PATH} is seeded." >&2
  exit 1
fi

echo "==> Ensuring namespace '${NB_NAMESPACE}' in the network cluster"
kubectl --context "${CONTEXT}" create namespace "${NB_NAMESPACE}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> Applying Secret ${NB_NAMESPACE}/netbird-mgmt-api-key (NB_API_KEY)"
kubectl --context "${CONTEXT}" -n "${NB_NAMESPACE}" create secret generic netbird-mgmt-api-key \
  --from-literal="NB_API_KEY=${api_token}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> netbird-mgmt-api-key seeded; the NetBird operator can now register (network routing peer)."
