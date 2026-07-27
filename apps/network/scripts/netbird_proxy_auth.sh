#!/usr/bin/env bash
# Mint the NetBird reverse-proxy PROXY TOKEN that the secret cluster's BYOP reverse proxy
# (apps/secret/src/netbird-reverse-proxy) authenticates to NetBird Cloud with, and store it in
# the secret cluster's OpenBao at kv/secret-netbird-proxy#token. Runnable standalone as
# `moon run network:netbird_proxy_auth`.
#
# WHY this lives in `network` (not `secret`): network is the NetBird/OpenTofu control cluster —
# it holds the `.env` OpenBao root token and the `bao` client already used by netbird_auth.sh,
# and its provider-opentofu manages the reverse-proxy service/DNS. This script is the imperative
# sibling of those declarative Workspaces: minting a proxy token returns its secret value EXACTLY
# ONCE (the GET list never returns it again), so it cannot be a reconciled TF resource — it must
# be minted once and stashed in OpenBao out of band, exactly like the ESO-backed operator PATs.
#
# Flow:
#   1. Read the NetBird management API PAT (admin) from OpenBao (kv/network-netbird-operator#
#      access_token — the same per-cluster admin PAT the reverse-proxy Workspaces use).
#   2. POST /api/reverse-proxies/proxy-tokens {name: secret.vgijssel.nl} -> capture the one-time
#      token value.
#   3. Write it to kv/secret-netbird-proxy#token. ESO on the secret cluster surfaces it as the
#      `netbird-proxy-token` Secret (proxy.managementServer.auth.existingSecret).
#
# Idempotent: if kv/secret-netbird-proxy already holds a non-empty token, do nothing (a proxy
# token's value is not re-derivable, so re-minting every run would churn the running proxy). Set
# FORCE=1 to mint a fresh token anyway (e.g. after a rotation/compromise); the old same-named
# token is left in NetBird — revoke it in the console if desired.
#
# Secrets never touch git: the OpenBao root lives only in .env; the PAT and the minted token are
# held in shell variables and written straight to OpenBao.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://openbao.secret.vgijssel.nl}"
NB_API_URL="${NB_API_URL:-https://api.netbird.io}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_PAT_PATH="${KV_PAT_PATH:-network-netbird-operator}"
KV_PROXY_PATH="${KV_PROXY_PATH:-secret-netbird-proxy}"
PROXY_TOKEN_NAME="${PROXY_TOKEN_NAME:-secret.vgijssel.nl}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require jq
require bao
require curl

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

# Idempotency: skip if a token is already stored (unless FORCE=1).
existing="$(bao kv get -mount="${KV_MOUNT}" -field=token "${KV_PROXY_PATH}" 2>/dev/null || true)"
if [[ -n "${existing}" && "${FORCE:-0}" != "1" ]]; then
  echo "==> ${KV_MOUNT}/${KV_PROXY_PATH}#token already set; nothing to do (set FORCE=1 to re-mint)."
  exit 0
fi

echo "==> Reading NetBird admin PAT from ${KV_MOUNT}/${KV_PAT_PATH} at ${REMOTE_BAO_ADDR}"
pat="$(bao kv get -mount="${KV_MOUNT}" -field=access_token "${KV_PAT_PATH}" 2>/dev/null || true)"
if [[ -z "${pat}" ]]; then
  echo "ERROR: could not read access_token from ${KV_MOUNT}/${KV_PAT_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Confirm this machine can reach OpenBao and kv/${KV_PAT_PATH} is seeded." >&2
  exit 1
fi

echo "==> Minting reverse-proxy proxy token '${PROXY_TOKEN_NAME}' via ${NB_API_URL}"
body="$(jq -nc --arg name "${PROXY_TOKEN_NAME}" '{name: $name}')"
resp="$(curl -fsS -X POST \
  -H "Authorization: Token ${pat}" \
  -H "Content-Type: application/json" \
  -d "${body}" \
  "${NB_API_URL}/api/reverse-proxies/proxy-tokens")"

# The one-time secret is returned under one of a few plausible keys depending on API version;
# accept the first non-empty of token/plain_token/secret/value.
token="$(jq -r '.token // .plain_token // .secret // .value // empty' <<<"${resp}" || true)"
if [[ -z "${token}" ]]; then
  resp_keys="$(jq -r 'keys | join(",")' <<<"${resp}" 2>/dev/null || true)"
  echo "ERROR: mint response did not contain a token value. Response keys: ${resp_keys:-<unparseable>}" >&2
  exit 1
fi

echo "==> Writing token to ${KV_MOUNT}/${KV_PROXY_PATH}#token"
bao kv put -mount="${KV_MOUNT}" "${KV_PROXY_PATH}" token="${token}" >/dev/null

echo "==> Done. ESO on the secret cluster will surface it as the netbird-proxy-token Secret;"
echo "    'moon run secret:apply' (or a proxy rollout) brings the BYOP proxy online."
