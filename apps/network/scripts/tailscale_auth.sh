#!/usr/bin/env bash
# Seed the Tailscale operator's OAuth client into the network cluster — the ONE manual
# step network needs, run automatically by network:start before apply (also runnable
# standalone as network:tailscale_auth).
#
# Chicken-and-egg: the Tailscale operator needs the `operator-oauth` Secret to register
# on the tailnet, but on network that Secret is normally synced from the SECRET cluster's
# OpenBao by external-secrets — which cannot reach OpenBao until the operator's tailnet
# egress exists. So break the loop here: read the operator OAuth client
# (oauth_client_id / oauth_client_secret) from the secret cluster's OpenBao using the
# local `bao` client (VAULT_TOKEN from .env, VAULT_ADDR = openbao.secret.vgijssel.nl) and
# create the operator-oauth Secret directly in the network cluster. ESO adopts it later
# (apps/network/src/config/externalsecret-operator-oauth.yaml).
#
# Once the operator is up and the tailnet egress is approved, external-secrets reaches
# OpenBao and Crossplane (provider-upjet-tailscale) reads kv/network-tailscale-crossplane
# for its own API token — no further seeding here.
#
# Secrets never touch git: the root token lives only in .env; the OAuth client is read
# into shell variables and written straight to a Kubernetes Secret.
#
# Idempotent: re-reads and re-applies the operator-oauth Secret.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
TS_NAMESPACE="${TS_NAMESPACE:-tailscale}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://openbao.secret.vgijssel.nl}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_OPERATOR_PATH="${KV_OPERATOR_PATH:-network-tailscale-operator}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require kubectl
require jq
require bao

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
client_id="$(jq -r '.data.data.oauth_client_id // empty' <<<"${op_json}")"
client_secret="$(jq -r '.data.data.oauth_client_secret // empty' <<<"${op_json}")"
if [[ -z "${client_id}" || -z "${client_secret}" ]]; then
  echo "ERROR: could not read oauth_client_id/oauth_client_secret from ${KV_MOUNT}/${KV_OPERATOR_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Confirm this machine is on the tailnet and kv/${KV_OPERATOR_PATH} is seeded." >&2
  exit 1
fi

echo "==> Ensuring namespace '${TS_NAMESPACE}' in the network cluster"
kubectl --context "${CONTEXT}" create namespace "${TS_NAMESPACE}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> Applying Secret ${TS_NAMESPACE}/operator-oauth (client_id/client_secret)"
kubectl --context "${CONTEXT}" -n "${TS_NAMESPACE}" create secret generic operator-oauth \
  --from-literal="client_id=${client_id}" \
  --from-literal="client_secret=${client_secret}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> operator-oauth seeded; the Tailscale operator can now register (network-operator)."
