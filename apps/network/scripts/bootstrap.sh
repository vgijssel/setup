#!/usr/bin/env bash
# Bootstrap the network cluster (run after network:start + network:apply):
#
#   Break the Tailscale chicken-and-egg. The Tailscale operator needs the
#   operator-oauth Secret to start, but on network that Secret is synced from the
#   REMOTE OpenBao by external-secrets — which itself can't authenticate until the
#   operator's tailnet egress exists. So seed operator-oauth out-of-band here:
#   read the secret-cluster root token from 1Password, read kv/tailscale from the
#   remote OpenBao at https://secret.vgijssel.nl (the operator machine is on the
#   tailnet), and create the Secret directly in the network cluster. ESO takes it
#   over later (apps/network/src/config/externalsecret-operator-oauth.yaml).
#
# Note: this no longer extracts the cluster's JWKS. OpenBao (on secret) now fetches
# the network cluster's JWKS LIVE over the tailnet (jwt-network backend, jwks_url =
# the network-operator noauth API-server proxy), so there is nothing to re-extract
# when the vind cluster is recreated — the network-operator device hostname is stable.
# Confirm network_jwks_url is set once in apps/secret/src/config/configuration-openbao.yaml
# (see the final message below).
#
# Secrets never touch git: the root token + OAuth client live only in 1Password and
# K8s Secrets, passed in shell variables.
#
# Idempotent: re-reads/re-applies the operator-oauth Secret.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
TS_NAMESPACE="${TS_NAMESPACE:-tailscale}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://secret.vgijssel.nl}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_TAILSCALE_PATH="${KV_TAILSCALE_PATH:-tailscale}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require kubectl
require jq
require op
require bao

# Load the 1Password service-account token from .env if it is not already set.
if [[ -z "${OP_SERVICE_ACCOUNT_TOKEN:-}" && -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env"
  set +a
fi
if [[ -z "${OP_SERVICE_ACCOUNT_TOKEN:-}" ]]; then
  echo "ERROR: OP_SERVICE_ACCOUNT_TOKEN is not set (expected in ${REPO_ROOT}/.env)" >&2
  exit 1
fi

# Confirm the network context exists (network:start must have run).
if ! kubectl --context "${CONTEXT}" get nodes >/dev/null 2>&1; then
  echo "ERROR: network cluster context '${CONTEXT}' is not reachable. Run 'moon run network:start' first." >&2
  exit 1
fi

# ── Seed operator-oauth from the remote OpenBao ─────────────────────────────
echo "==> Seeding operator-oauth from the remote OpenBao"

echo "==> Reading the secret-cluster root token from 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
ROOT_TOKEN="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
if [[ -z "${ROOT_TOKEN}" ]]; then
  echo "ERROR: root token not found in ${OP_VAULT}/${ROOT_OP_ITEM}. Bootstrap the secret cluster first." >&2
  exit 1
fi

echo "==> Reading ${KV_MOUNT}/${KV_TAILSCALE_PATH} from ${REMOTE_BAO_ADDR}"
ts_json="$(VAULT_ADDR="${REMOTE_BAO_ADDR}" VAULT_TOKEN="${ROOT_TOKEN}" \
  bao kv get -mount="${KV_MOUNT}" -format=json "${KV_TAILSCALE_PATH}" 2>/dev/null || true)"
client_id="$(jq -r '.data.data.oauth_client_id // empty' <<<"${ts_json}")"
client_secret="$(jq -r '.data.data.oauth_client_secret // empty' <<<"${ts_json}")"
if [[ -z "${client_id}" || -z "${client_secret}" ]]; then
  echo "ERROR: could not read oauth_client_id/oauth_client_secret from ${KV_MOUNT}/${KV_TAILSCALE_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Confirm the operator machine is on the tailnet and kv/${KV_TAILSCALE_PATH} is seeded." >&2
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

# Sanity-check the OIDC issuer matches what OpenBao's jwt-network backend binds
# (bound_issuer). The issuer is in-cluster and stable; a mismatch means the committed
# network_oidc_issuer must be updated on the secret side or ESO login will fail.
EXPECTED_ISSUER="${EXPECTED_ISSUER:-https://kubernetes.default.svc.cluster.local}"
issuer="$(kubectl --context "${CONTEXT}" get --raw /.well-known/openid-configuration 2>/dev/null | jq -r '.issuer // empty')"
if [[ -n "${issuer}" && "${issuer}" != "${EXPECTED_ISSUER}" ]]; then
  echo "WARNING: OIDC issuer '${issuer}' != expected '${EXPECTED_ISSUER}'." >&2
  echo "         Update network_oidc_issuer in apps/secret/src/config/configuration-openbao.yaml." >&2
fi

cat <<EOF

==> Done. operator-oauth seeded (issuer: ${issuer:-unknown}).

    OpenBao fetches this cluster's JWKS LIVE over the tailnet — nothing to extract.
    One-time wiring on the SECRET side (stable across network recreation):

      1. Confirm the network operator's MagicDNS name is up:
           tailscale status | grep network-operator
      2. Set network_jwks_url in apps/secret/src/config/configuration-openbao.yaml:
           network_jwks_url: https://network-operator.<tailnet>.ts.net/openid/v1/jwks
         (<tailnet> is this tailnet's ts.net name; must match the tailnet-fqdn in
          apps/secret/src/config/service-network-jwks-egress.yaml)
      3. Ensure the tailnet ACL is applied (ACL-C grants tag:k8s -> tag:k8s-operator:443)
         and the operator runs the noauth API-server proxy (apiServerProxyConfig).

    terranetes then reconciles the jwt-network backend against the live jwks_url; the
    network cluster's ESO + terranetes log in and read kv/*. No re-run needed after a
    vind stop+start.
EOF
