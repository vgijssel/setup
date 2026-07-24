#!/usr/bin/env bash
# Bootstrap the network cluster (run after network:start + network:apply). Two seeds,
# both reaching the SECRET cluster's OpenBao over the tailnet at
# https://openbao.secret.vgijssel.nl with the root VAULT_TOKEN from .env (no 1Password):
#
#   1. operator-oauth — break the Tailscale chicken-and-egg. The Tailscale operator needs
#      the operator-oauth Secret to start, but on network that Secret is synced from the
#      REMOTE OpenBao by external-secrets — which can't authenticate until the operator's
#      tailnet egress exists. So read the operator OAuth client from OpenBao and create the
#      Secret directly; ESO takes it over later
#      (apps/network/src/config/externalsecret-operator-oauth.yaml).
#
#   2. kv/network-tailscale-crossplane#api_key — the static Tailscale API access token that
#      provider-upjet-tailscale authenticates with to reconcile the tailnet policy (the
#      Crossplane replacement for the old terranetes OAuth client). Seeded only if absent;
#      prompts for a token (tskey-api-…, policy_file write scope). Expires ≤90d — rerun to
#      reseed. ESO syncs it into crossplane-system (externalsecret-tailscale-apikey.yaml).
#
# Secrets never touch git: the root token lives only in .env; the api_key is read into a
# shell variable and written straight to OpenBao.
#
# Idempotent: re-reads/re-applies operator-oauth; skips the api_key seed if already set.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
TS_NAMESPACE="${TS_NAMESPACE:-tailscale}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://openbao.secret.vgijssel.nl}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_OPERATOR_PATH="${KV_OPERATOR_PATH:-network-tailscale-operator}"
KV_CROSSPLANE_PATH="${KV_CROSSPLANE_PATH:-network-tailscale-crossplane}"

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

# ── 1. Seed operator-oauth from the remote OpenBao ──────────────────────────
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

# ── 2. Seed the Crossplane Tailscale API key (idempotent) ───────────────────
echo "==> Checking ${KV_MOUNT}/${KV_CROSSPLANE_PATH}#api_key"
existing_api_key="$(bao kv get -mount="${KV_MOUNT}" -field=api_key "${KV_CROSSPLANE_PATH}" 2>/dev/null || true)"
if [[ -n "${existing_api_key}" ]]; then
  echo "==> api_key already present; leaving it untouched."
else
  echo "==> No api_key found. Create a Tailscale API access token (policy_file write scope)"
  echo "    in the admin console, then paste it here."
  api_key="${TS_API_KEY:-}"
  if [[ -z "${api_key}" ]]; then
    read -rsp "    Tailscale API access token (tskey-api-…): " api_key
    echo
  fi
  if [[ -z "${api_key}" ]]; then
    echo "ERROR: no Tailscale API access token provided; cannot seed ${KV_MOUNT}/${KV_CROSSPLANE_PATH}." >&2
    exit 1
  fi
  bao kv put -mount="${KV_MOUNT}" "${KV_CROSSPLANE_PATH}" api_key="${api_key}" >/dev/null
  echo "==> api_key seeded at ${KV_MOUNT}/${KV_CROSSPLANE_PATH}."
fi

# Sanity-check the OIDC issuer matches what OpenBao's jwt-network backend binds
# (bound_issuer). The issuer is in-cluster and stable; a mismatch means the committed
# network_oidc_issuer must be updated on the secret side or ESO login will fail.
EXPECTED_ISSUER="${EXPECTED_ISSUER:-https://kubernetes.default.svc.cluster.local}"
issuer="$(kubectl --context "${CONTEXT}" get --raw /.well-known/openid-configuration 2>/dev/null | jq -r '.issuer // empty')"
if [[ -n "${issuer}" && "${issuer}" != "${EXPECTED_ISSUER}" ]]; then
  echo "WARNING: OIDC issuer '${issuer}' != expected '${EXPECTED_ISSUER}'." >&2
  echo "         Update network_oidc_issuer on the secret side or ESO/JWT login will fail." >&2
fi

echo "==> Done. operator-oauth + Tailscale api_key seeded (issuer: ${issuer:-unknown})."
echo "    Crossplane (provider-upjet-tailscale) reconciles the tailnet policy; ESO reads kv/* over the tailnet."
