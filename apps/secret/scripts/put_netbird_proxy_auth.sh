#!/usr/bin/env bash
# secret:put_netbird_proxy_auth — mint the NetBird reverse-proxy PROXY TOKEN that this cluster's
# BYOP reverse proxy (src/netbird-reverse-proxy) authenticates to NetBird Cloud with, and store
# it in this cluster's OpenBao at kv/secret-netbird-proxy#token. ESO then surfaces it as the
# `netbird-proxy-token` Secret (proxy.managementServer.auth.existingSecret).
#
# Isolated to the secret cluster (its proxy, its config): unlike the operator PATs, a proxy
# token's value is returned EXACTLY ONCE by the mint API (the GET list never returns it again),
# so it cannot be a reconciled TF resource — it is minted once here and stashed in OpenBao.
#
# Flow (no network path to OpenBao needed — everything goes through a pod exec):
#   1. Read this cluster's NetBird admin PAT from the in-cluster netbird-mgmt-api-key Secret
#      (NB_API_KEY, synced from kv/secret-netbird-operator by ESO).
#   2. POST /api/reverse-proxies/proxy-tokens {name: secret.vgijssel.nl} -> one-time token value.
#   3. Mint a short-lived OpenBao admin token via the `admin` kubernetes-auth role (exec login
#      into openbao-0, exactly like secret:get_openbao_auth) and write kv/secret-netbird-proxy#token.
#
# Idempotent: if kv/secret-netbird-proxy already holds a non-empty token, do nothing (a proxy
# token's value is not re-derivable, so re-minting every run would churn the running proxy). Set
# FORCE=1 to mint a fresh token anyway (e.g. after a rotation/compromise); the old same-named
# token is left in NetBird — revoke it in the console if desired.
#
# Security model: identical to secret:get_openbao_auth — only a kubectl admin can mint the openbao-admin SA
# token and exec the pod, and a kubectl admin already has full cluster access (Secrets, the
# openbao-seal key, pod exec), so this grants nothing extra. The admin token's TTL is 1h and it
# is passed to the pod exec via env (transient, in-pod); the proxy token value is piped over
# stdin (token=-) so it never lands in the pod's argv.
set -euo pipefail

NS="${SECRET_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
ROLE="${OPENBAO_ADMIN_ROLE:-admin}"
SA="${OPENBAO_ADMIN_SA:-openbao-admin}"
NB_NS="${NB_NAMESPACE:-netbird}"
NB_API_URL="${NB_API_URL:-https://api.netbird.io}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_PROXY_PATH="${KV_PROXY_PATH:-secret-netbird-proxy}"
PROXY_TOKEN_NAME="${PROXY_TOKEN_NAME:-secret.vgijssel.nl}"
CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require kubectl
require jq
require curl

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient
# kube-context (select the docker driver + connect; idempotent).
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

# Fail early if the SA / pod aren't there (wrong cluster/context, or not applied yet).
if ! kubectl -n "${NS}" get serviceaccount "${SA}" >/dev/null 2>&1; then
  ctx="$(kubectl config current-context 2>/dev/null || echo '?')"
  echo "ERROR: ServiceAccount ${NS}/${SA} not found — wrong kube context, or the cluster isn't applied yet." >&2
  echo "       Current context: ${ctx}" >&2
  exit 1
fi

# Mint a short-lived OpenBao admin token (exec login, like secret:get_openbao_auth).
mint_admin_token() {
  local sa_token
  sa_token="$(kubectl -n "${NS}" create token "${SA}" --duration=10m)"
  printf '%s' "${sa_token}" | kubectl -n "${NS}" exec -i "${POD}" -- \
    env BAO_ADDR=http://127.0.0.1:8200 \
    bao write -field=token auth/kubernetes/login role="${ROLE}" jwt=-
}

echo "==> Minting OpenBao admin token (TTL 1h)"
ob_token="$(mint_admin_token)"
if [[ -z "${ob_token:-}" ]]; then
  echo "ERROR: OpenBao login returned no token (is the '${ROLE}' role present? try after secret:apply)." >&2
  exit 1
fi

# Idempotency: skip if a token is already stored (unless FORCE=1).
existing="$(kubectl -n "${NS}" exec -i "${POD}" -- \
  env BAO_ADDR=http://127.0.0.1:8200 BAO_TOKEN="${ob_token}" \
  bao kv get -mount="${KV_MOUNT}" -field=token "${KV_PROXY_PATH}" 2>/dev/null || true)"
if [[ -n "${existing}" && "${FORCE:-0}" != "1" ]]; then
  echo "==> ${KV_MOUNT}/${KV_PROXY_PATH}#token already set; nothing to do (set FORCE=1 to re-mint)."
  exit 0
fi

echo "==> Reading NetBird admin PAT from Secret ${NB_NS}/netbird-mgmt-api-key"
pat="$(kubectl -n "${NB_NS}" get secret netbird-mgmt-api-key -o jsonpath='{.data.NB_API_KEY}' 2>/dev/null | base64 -d || true)"
if [[ -z "${pat}" ]]; then
  echo "ERROR: could not read NB_API_KEY from ${NB_NS}/netbird-mgmt-api-key (is the netbird operator applied + ESO synced?)." >&2
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
printf '%s' "${token}" | kubectl -n "${NS}" exec -i "${POD}" -- \
  env BAO_ADDR=http://127.0.0.1:8200 BAO_TOKEN="${ob_token}" \
  bao kv put -mount="${KV_MOUNT}" "${KV_PROXY_PATH}" token=- >/dev/null

echo "==> Done. ESO surfaces it as the netbird-proxy-token Secret; 'moon run secret:apply'"
echo "    (or a proxy rollout) brings the BYOP proxy online under the secret.vgijssel.nl cluster."
