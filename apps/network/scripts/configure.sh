#!/usr/bin/env bash
# network:configure — the out-of-band FIRST apply of the tailscale-config module
# (apps/network/src/tailscale-config), the analog of secret:configure for OpenBao.
#
# Why out-of-band: the module sets the tailnet ACL, including the tag:k8s -> svc:secret
# grant that lets the network cluster's in-cluster runner reach OpenBao. Until that grant
# exists, terranetes in the network cluster CANNOT read OpenBao to reconcile this module —
# chicken-and-egg. So this script does the first apply from the operator machine (which is
# already on the tailnet), authenticating to OpenBao with the ROOT token (auth_method=token)
# and writing state into the SAME kubernetes-backend Secret terranetes reconciles
# (tfstate-default-tailscale-config, ns terranetes-system, network cluster). Afterwards
# terranetes takes over via its network-terranetes jwt login.
#
# The tailscale provider gets its OAuth client from OpenBao (kv/<TS_ACL_KV_PATH>): the ONLY
# dependency is a reachable OpenBao holding that credential. That client MUST have the
# `policy_file` (write) OAuth scope — the operator's device-auth client usually does NOT, so
# seed a dedicated one:
#     bao kv put kv/tailscale-acl oauth_client_id=... oauth_client_secret=...
#
# WARNING: the tailscale_acl resource makes Terraform the source of truth for the ENTIRE
# tailnet policy (overwrite_existing_content=true). Review apps/network/src/tailscale-config/
# main.tf before running — the first apply replaces the hand-managed policy.
#
# The root token comes from 1Password (never disk/git) via the OP service account.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
MODULE_DIR="${SCRIPT_DIR}/../src/tailscale-config"

NETWORK_CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
STATE_NAMESPACE="${STATE_NAMESPACE:-terranetes-system}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://secret.vgijssel.nl}"
TS_ACL_KV_MOUNT="${TS_ACL_KV_MOUNT:-kv}"
TS_ACL_KV_PATH="${TS_ACL_KV_PATH:-tailscale-acl}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require kubectl
require jq
require op
require bao
require tofu

# Load the 1Password service-account token from .env if not already set.
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

# Confirm the network cluster + its terranetes-system namespace exist (state lives there).
if ! kubectl --context "${NETWORK_CONTEXT}" get namespace "${STATE_NAMESPACE}" >/dev/null 2>&1; then
  echo "ERROR: namespace ${STATE_NAMESPACE} not found on ${NETWORK_CONTEXT}. Run 'moon run network:apply' first." >&2
  exit 1
fi

echo "==> Reading the OpenBao root token from 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
ROOT_TOKEN="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
if [[ -z "${ROOT_TOKEN}" ]]; then
  echo "ERROR: root token not found in ${OP_VAULT}/${ROOT_OP_ITEM}. Bootstrap the secret cluster first." >&2
  exit 1
fi

export VAULT_ADDR="${REMOTE_BAO_ADDR}"
export VAULT_TOKEN="${ROOT_TOKEN}"

# Pre-flight: the ACL OAuth client must be seeded (with policy_file scope) or the module's
# vault data source fails. Check for the keys and give an actionable error.
echo "==> Checking ${TS_ACL_KV_MOUNT}/${TS_ACL_KV_PATH} holds oauth_client_id/oauth_client_secret"
acl_json="$(bao kv get -mount="${TS_ACL_KV_MOUNT}" -format=json "${TS_ACL_KV_PATH}" 2>/dev/null || true)"
acl_id="$(jq -r '.data.data.oauth_client_id // empty' <<<"${acl_json}")"
acl_secret="$(jq -r '.data.data.oauth_client_secret // empty' <<<"${acl_json}")"
if [[ -z "${acl_id}" || -z "${acl_secret}" ]]; then
  cat >&2 <<EOF
ERROR: ${TS_ACL_KV_MOUNT}/${TS_ACL_KV_PATH} is missing oauth_client_id/oauth_client_secret.

  Create a Tailscale OAuth client with the "policy_file" (write) scope in the admin
  console, then seed it (reachable OpenBao + root token on the tailnet):

    VAULT_ADDR=${REMOTE_BAO_ADDR} VAULT_TOKEN=<root> \\
      bao kv put ${TS_ACL_KV_MOUNT}/${TS_ACL_KV_PATH} \\
        oauth_client_id=<id> oauth_client_secret=<secret>
EOF
  exit 1
fi

# ── Runtime backend override (git-ignored; removed after apply) ───────────────
# Matches what the terranetes backend template renders for the tailscale-config
# Configuration in ns terranetes-system, so both resolve to the ONE Secret
# tfstate-default-tailscale-config. in_cluster_config=false: use the local kubeconfig.
cleanup() { rm -f "${MODULE_DIR}/zz_backend.tf"; }
trap cleanup EXIT

echo "==> Writing runtime backend override (git-ignored)"
cat >"${MODULE_DIR}/zz_backend.tf" <<HCL
terraform {
  backend "kubernetes" {
    secret_suffix     = "tailscale-config"
    namespace         = "${STATE_NAMESPACE}"
    in_cluster_config = false
  }
}
HCL

# The kubernetes backend (in_cluster_config=false) needs the kubeconfig + the NETWORK
# context (state lives in the network cluster). This affects only HOW the backend reaches
# the cluster, not WHICH Secret holds state, so shared state with terranetes is preserved.
export KUBE_CONFIG_PATH="${KUBECONFIG:-${HOME}/.kube/config}"
export KUBE_CTX="${NETWORK_CONTEXT}"

echo "==> tofu init (kubernetes backend -> tfstate-default-tailscale-config, ns ${STATE_NAMESPACE})"
(cd "${MODULE_DIR}" && tofu init -input=false -reconfigure >/dev/null)

echo "==> tofu apply (auth_method=token; sets the tailnet policy — this OVERWRITES the live policy)"
(cd "${MODULE_DIR}" && tofu apply -input=false -auto-approve \
  -var "auth_method=token" \
  -var "bao_address=${REMOTE_BAO_ADDR}")

echo "==> Done. Tailnet policy applied to the shared state Secret ${STATE_NAMESPACE}/tfstate-default-tailscale-config."
echo "    terranetes-controller (network cluster) now reconciles the same module + state via its network-terranetes jwt login."
