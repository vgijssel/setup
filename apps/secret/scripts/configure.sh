#!/usr/bin/env bash
# secret:configure — Phase-1 OpenBao configuration via OpenTofu (run once after
# secret:bootstrap). Applies the module at apps/secret/src/openbao-config with the
# ROOT token (auth_method=token) into the SHARED kubernetes-backend state Secret
# tfstate-default-openbao-config (ns secret) — the SAME state terranetes-controller
# reconciles in-cluster. This seeds the kv v2 engine, the kubernetes auth backend +
# config, the external-secrets policy/role, and the terranetes policy + login role,
# so terranetes can log in via its ServiceAccount afterward (no root token in-cluster).
# It is also the lockout-recovery path if terranetes ever revokes its own role.
#
# Shared state, one Secret: the runtime zz_backend.tf written here uses the identical
# kubernetes backend (secret_suffix=openbao-config, ns secret, default workspace) that
# the terranetes backend template renders, so the local apply and the controller never
# fight. The override is git-ignored and removed after apply; state never hits git.
#
# The root token comes from 1Password (never disk/git), via the OP service account
# (OP_SERVICE_ACCOUNT_TOKEN from .env) — no interactive `op signin`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
MODULE_DIR="${SCRIPT_DIR}/../src/openbao-config"

CONTEXT="${KUBE_CONTEXT:-$(kubectl config current-context)}"
NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"

BAO_ADDR="http://127.0.0.1:${LOCAL_PORT}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require kubectl
require jq
require op
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

echo "==> Reading the OpenBao root token from 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
ROOT_TOKEN="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
if [[ -z "${ROOT_TOKEN}" ]]; then
  echo "ERROR: root token not found in ${OP_VAULT}/${ROOT_OP_ITEM}. Run secret:bootstrap first." >&2
  exit 1
fi

# ── Port-forward to OpenBao and wait for the API ─────────────────────────────
pf_pid=""
cleanup() {
  [[ -n "${pf_pid}" ]] && kill "${pf_pid}" 2>/dev/null
  # Always remove the runtime overrides so they never land in git.
  rm -f "${MODULE_DIR}/zz_backend.tf" "${MODULE_DIR}/zz_provider.tf"
}
trap cleanup EXIT

echo "==> Port-forwarding pod/${POD} ${LOCAL_PORT} -> 8200"
kubectl --context "${CONTEXT}" -n "${NAMESPACE}" port-forward "pod/${POD}" "${LOCAL_PORT}:8200" >/dev/null 2>&1 &
pf_pid=$!
for _ in $(seq 1 30); do
  bao_status="$(BAO_ADDR="${BAO_ADDR}" bao status -format=json 2>/dev/null || true)"
  jq -e . >/dev/null 2>&1 <<<"${bao_status}" && break
  sleep 1
done
if ! jq -e '.initialized == true' >/dev/null 2>&1 <<<"${bao_status:-}"; then
  echo "ERROR: OpenBao is not reachable/initialised on ${BAO_ADDR}. Run secret:bootstrap first." >&2
  exit 1
fi

# ── Write the runtime backend + provider overrides ───────────────────────────
# The committed module carries neither a backend nor a provider block — each runner
# injects its own (see versions.tf). Locally we write both, git-ignored, and remove
# them after apply.
#
# Backend: identical to what the terranetes backend template renders for the
# `openbao-config` Configuration in ns `secret`, so both resolve to the ONE Secret
# tfstate-default-openbao-config. in_cluster_config=false: use the local kubeconfig.
echo "==> Writing runtime backend + provider overrides (git-ignored)"
cat >"${MODULE_DIR}/zz_backend.tf" <<'HCL'
terraform {
  backend "kubernetes" {
    secret_suffix     = "openbao-config"
    namespace         = "secret"
    in_cluster_config = false
  }
}
HCL

# Provider: root-token auth. The empty block reads VAULT_ADDR + VAULT_TOKEN from the
# environment (exported below), so no token is ever written to a file.
cat >"${MODULE_DIR}/zz_provider.tf" <<'HCL'
provider "vault" {}
HCL

export VAULT_ADDR="${BAO_ADDR}"
export VAULT_TOKEN="${ROOT_TOKEN}"

# The kubernetes backend (in_cluster_config=false) does not auto-discover the
# kubeconfig; point it at the operator's config + context via its env vars. This
# affects only HOW the backend reaches the cluster, not WHICH Secret holds the
# state (that is secret_suffix/namespace), so shared state with the in-cluster
# controller is preserved.
export KUBE_CONFIG_PATH="${KUBECONFIG:-${HOME}/.kube/config}"
export KUBE_CTX="${CONTEXT}"

echo "==> tofu init (kubernetes backend -> tfstate-default-openbao-config, ns ${NAMESPACE})"
(cd "${MODULE_DIR}" && tofu init -input=false -reconfigure >/dev/null)

# ── Adopt pre-existing singletons (migration + recovery) ─────────────────────
# vault_mount and vault_auth_backend error on an already-in-use path. If OpenBao
# already has kv/ or kubernetes/ (mid-migration from vault-config-operator, or a
# lost state Secret with OpenBao still configured), import them into the shared
# state so the apply adopts rather than recreates. No-op on a clean bootstrap
# (import fails quietly when the resource doesn't exist) and once already in state.
adopt() { # adopt <tofu-address> <import-id>
  if ! (cd "${MODULE_DIR}" && tofu state list 2>/dev/null | grep -qx "$1"); then
    echo "==> Adopting existing $1 ($2) into state (if present)"
    (cd "${MODULE_DIR}" && tofu import -input=false "$1" "$2" >/dev/null 2>&1) || true
  fi
}
adopt vault_mount.kv kv
adopt vault_auth_backend.kubernetes kubernetes

echo "==> tofu apply"
(cd "${MODULE_DIR}" && tofu apply -input=false -auto-approve)

echo "==> Done. OpenBao config applied to the shared state Secret ${NAMESPACE}/tfstate-default-openbao-config."
echo "    terranetes-controller now reconciles the same module + state via its ServiceAccount login."
