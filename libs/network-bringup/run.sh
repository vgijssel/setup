#!/usr/bin/env bash
# network bring-up orchestrator — breaks the Tailscale chicken-and-egg on the
# network child (the KubeVela-era replacement for the old network:bootstrap).
#
# The tailscale operator needs the `operator-oauth` Secret before it can start, but
# on the network child that Secret is meant to be synced from the SECRET child's
# OpenBao by external-secrets — which itself cannot authenticate to that OpenBao
# until the operator's tailnet path exists. Classic cycle. Break it by seeding
# operator-oauth OUT-OF-BAND here:
#
#   1. read the secret-cluster root token from 1Password (enigma-prod);
#   2. read kv/network-tailscale-operator from the SECRET child's OpenBao over the
#      tailnet (https://secret.tail2c33e2.ts.net — the svc:secret VIP from Task 3.1a);
#   3. create the operator-oauth Secret directly in the network child's tailscale ns
#      over the root's cluster-gateway proxy.
#
# ESO takes the Secret over once the cross-cluster ClusterSecretStore is in place
# (Task 3.1f); this seed only has to get the operator far enough to advertise the
# network VIPs (svc:api-network for JWKS, svc:omada-network for Omada).
#
# Runs on the dev host (which is on the tailnet and has op/bao/kubectl/jq), like the
# other libs/ orchestrators; control:up invokes it after the network platform is
# dispatched. Idempotent: re-reads and re-applies the Secret.
# The `kc` wrapper is used inside `|| true` cleanups where we handle the exit
# ourselves, so shellcheck's set-e-disabled notes (SC2310/SC2312) do not apply.
# shellcheck disable=SC2310,SC2312
set -euo pipefail

CLUSTER="${1:-network}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

TS_NAMESPACE="${TS_NAMESPACE:-tailscale}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://secret.tail2c33e2.ts.net}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_TS_OPERATOR_PATH="${KV_TS_OPERATOR_PATH:-network-tailscale-operator}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require jq
require op
require bao

# 1Password service-account token — sourced from .env (never committed).
if [[ -z "${OP_SERVICE_ACCOUNT_TOKEN:-}" && -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env"
  set +a
fi
[[ -n "${OP_SERVICE_ACCOUNT_TOKEN:-}" ]] || { echo "ERROR: OP_SERVICE_ACCOUNT_TOKEN not set (expected in ${REPO_ROOT}/.env)" >&2; exit 1; }

# Reach the network child through the root's cluster-gateway proxy.
ROOT_SERVER="$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')"
PROXY="${ROOT_SERVER}/apis/cluster.core.oam.dev/v1alpha1/clustergateways/${CLUSTER}/proxy"
kc() { kubectl --server "${PROXY}" "$@"; }

echo "==> [${CLUSTER}] reading the secret-cluster root token from 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
ROOT_TOKEN="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
[[ -n "${ROOT_TOKEN}" ]] || { echo "ERROR: root token not found in ${OP_VAULT}/${ROOT_OP_ITEM}. Bring up the secret cluster first." >&2; exit 1; }

echo "==> [${CLUSTER}] reading ${KV_MOUNT}/${KV_TS_OPERATOR_PATH} from ${REMOTE_BAO_ADDR} (over the tailnet)"
ts_json="$(VAULT_ADDR="${REMOTE_BAO_ADDR}" VAULT_TOKEN="${ROOT_TOKEN}" \
  bao kv get -mount="${KV_MOUNT}" -format=json "${KV_TS_OPERATOR_PATH}" 2>/dev/null || true)"
client_id="$(jq -r '.data.data.oauth_client_id // empty' <<<"${ts_json}")"
client_secret="$(jq -r '.data.data.oauth_client_secret // empty' <<<"${ts_json}")"
if [[ -z "${client_id}" || -z "${client_secret}" ]]; then
  echo "ERROR: could not read oauth_client_id/oauth_client_secret from ${KV_MOUNT}/${KV_TS_OPERATOR_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Confirm the host is on the tailnet and svc:secret (Task 3.1a) is up." >&2
  exit 1
fi

echo "==> [${CLUSTER}] seeding ${TS_NAMESPACE}/operator-oauth (client_id/client_secret)"
kc create namespace "${TS_NAMESPACE}" --dry-run=client -o yaml | kc apply -f - >/dev/null
kc -n "${TS_NAMESPACE}" create secret generic operator-oauth \
  --from-literal="client_id=${client_id}" \
  --from-literal="client_secret=${client_secret}" \
  --dry-run=client -o yaml | kc apply -f - >/dev/null

echo "==> [${CLUSTER}] operator-oauth seeded; the tailscale operator (network-operator) can now register."

# ── clear any stale svc:api-network so the fresh operator can claim it ──────────
# The api-network VIP (Task 3.1d) is a `kube-apiserver` Tailscale Service, which the
# operator requires EXCLUSIVE ownership of. A prior cluster generation that was torn
# down WITHOUT releasing its VIPs leaves svc:api-network owned by now-dead operators,
# and the new operator refuses to hijack it ("already owned by other operator(s)").
# (Ingress VIPs like svc:secret/svc:omada-network don't hit this — that reconciler
# APPENDS owners.) The operator-oauth client we just read has `services` scope, so use
# it to delete a stale svc:api-network here; the operator then recreates + solely owns
# it. Idempotent + safe: this VIP belongs to exactly this cluster, which we are
# bringing up, so delete-then-recreate is a no-op on a clean run.
API="https://api.tailscale.com/api/v2/tailnet/-"
ts_token="$(curl -s -d "client_id=${client_id}" -d "client_secret=${client_secret}" \
  "https://api.tailscale.com/api/v2/oauth/token" | jq -r '.access_token // empty')"
if [[ -n "${ts_token}" ]]; then
  # Newest network-operator device (lexical max lastSeen == chronological) is the live one.
  live_op="$(curl -s -H "Authorization: Bearer ${ts_token}" "${API}/devices" \
    | jq -r '[.devices[] | select(.hostname=="network-operator")] | max_by(.lastSeen).nodeId // empty')"
  owners="$(curl -s -H "Authorization: Bearer ${ts_token}" "${API}/vip-services" \
    | jq -r '(.vipServices // [])[] | select(.name=="svc:api-network")
             | (.annotations["tailscale.com/owner-references"] // "{}" | fromjson.ownerRefs // [] | map(.operatorID) | sort | join(","))' 2>/dev/null || true)"
  # Delete if the VIP exists and is NOT owned solely by the live operator.
  if [[ -n "${owners}" && "${owners}" != "${live_op}" ]]; then
    echo "==> [${CLUSTER}] stale svc:api-network owners [${owners}] != live operator [${live_op:-none}] — deleting so the operator reclaims it"
    curl -s -o /dev/null -w "    tailscale API DELETE svc:api-network -> HTTP %{http_code}\n" \
      -X DELETE -H "Authorization: Bearer ${ts_token}" "${API}/vip-services/svc%3Aapi-network"
    # Nudge the operator to reconcile immediately (else it sits on a long backoff).
    kc -n "${TS_NAMESPACE}" rollout restart deploy/operator >/dev/null 2>&1 || true
  fi
else
  echo "WARNING: could not obtain a tailscale API token to check svc:api-network ownership; if the network"
  echo "         kube-apiserver ProxyGroup stays KubeAPIServerProxyInvalid, delete the stale svc:api-network." >&2
fi
