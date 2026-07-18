#!/usr/bin/env bash
# Initialise OpenBao and store the recovery keys + root token in 1Password (and
# nowhere else), then plant the minimal vault-config-operator login foothold
# (kubernetes auth method + config + the operator's own policy/role). Everything
# else -- the kv engine and the external-secrets policy/role -- is reconciled
# declaratively by vault-config-operator from apps/secret/src/config.
#
# OpenBao uses static auto-unseal (see openbao/values.yaml), so there is NO manual
# unseal step: `bao operator init` yields RECOVERY keys (not unseal keys), and the
# node auto-unseals from the static seal key on every boot.
#
# Idempotent:
#   - fresh OpenBao          -> init, store recovery keys + root token in 1Password,
#                               wait for auto-unseal, plant the foothold
#   - already initialised    -> read the root token back from 1Password, (re)apply
#                               the operator foothold only
#
# Secrets never touch local disk: init output stays in shell variables and is
# piped straight into `op`. The local `bao` CLI talks to OpenBao over a
# port-forward to the pod (the Service has no endpoints while the node is sealed
# pre-init) that is torn down on exit. Uses a 1Password service account
# (OP_SERVICE_ACCOUNT_TOKEN from .env), so no interactive `op signin` is needed.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CONTEXT="${KUBE_CONTEXT:-$(kubectl config current-context)}"
NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
OP_ITEM="${OP_ITEM:-OpenBao root + recovery (secret cluster)}"
RECOVERY_SHARES="${RECOVERY_SHARES:-5}"
RECOVERY_THRESHOLD="${RECOVERY_THRESHOLD:-3}"

export BAO_ADDR="http://127.0.0.1:${LOCAL_PORT}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require jq
require bao
require op

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

raw_status() { bao status -format=json 2>/dev/null || true; }

# (Re)establish the port-forward to the OpenBao pod and wait until the API answers.
pf_pid=""
start_pf() {
  [[ -n "${pf_pid}" ]] && kill "${pf_pid}" 2>/dev/null
  kubectl --context "${CONTEXT}" -n "${NAMESPACE}" port-forward "pod/${POD}" "${LOCAL_PORT}:8200" >/dev/null 2>&1 &
  pf_pid=$!
  local st
  for _ in $(seq 1 30); do
    st="$(raw_status)"
    jq -e . >/dev/null 2>&1 <<<"${st}" && return 0
    sleep 1
  done
  echo "ERROR: OpenBao is not reachable on ${BAO_ADDR} (${1:-connect})" >&2
  exit 1
}

echo "==> Waiting for ${POD} to be Running in namespace ${NAMESPACE}"
kubectl --context "${CONTEXT}" -n "${NAMESPACE}" wait \
  --for=jsonpath='{.status.phase}'=Running "pod/${POD}" --timeout=180s

echo "==> Port-forwarding pod/${POD} ${LOCAL_PORT} -> 8200"
trap 'kill "${pf_pid}" 2>/dev/null || true' EXIT
start_pf "initial"
status="$(raw_status)"

# --- Init (only when brand new) --------------------------------------------
initialized="$(jq -r '.initialized // false' <<<"${status}")"

if [[ "${initialized}" == "true" ]]; then
  echo "==> OpenBao already initialised; reading root token from 1Password (${OP_VAULT}/${OP_ITEM})"
  # Use `op item get --fields` rather than an op:// reference: the item title can
  # contain characters (spaces, '+', parens) that are invalid in a secret reference.
  root_token="$(op item get "${OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
  if [[ -z "${root_token}" ]]; then
    echo "ERROR: OpenBao is initialised but its root token is not in ${OP_VAULT} (${OP_ITEM})." >&2
    echo "       Recover via the recovery keys, or wipe + re-init (destroys stored secrets):" >&2
    echo "         kubectl -n ${NAMESPACE} delete statefulset openbao --cascade=foreground" >&2
    echo "         kubectl -n ${NAMESPACE} delete pvc -l app.kubernetes.io/name=openbao" >&2
    echo "       then re-run secret:up and this task." >&2
    exit 1
  fi
else
  # Pre-flight: confirm we can WRITE to the vault BEFORE initialising OpenBao, so a
  # storage failure here (rather than after init) keeps OpenBao pristine and this
  # task re-runnable instead of leaving it initialised with its keys unrecoverable.
  echo "==> Verifying write access to ${OP_VAULT}"
  probe_id="$(op item create --category "Secure Note" --vault "${OP_VAULT}" \
    --title "openbao-init-write-check" 'probe[text]=ok' --format json 2>/dev/null | jq -r '.id // empty')"
  if [[ -z "${probe_id}" ]]; then
    echo "ERROR: cannot create items in ${OP_VAULT} (check OP_SERVICE_ACCOUNT_TOKEN scope). OpenBao left untouched." >&2
    exit 1
  fi
  op item delete "${probe_id}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true

  echo "==> Initialising OpenBao (recovery shares ${RECOVERY_SHARES}, threshold ${RECOVERY_THRESHOLD})"
  init_json="$(bao operator init \
    -recovery-shares="${RECOVERY_SHARES}" -recovery-threshold="${RECOVERY_THRESHOLD}" -format=json)"

  # A fresh OpenBao (e.g. after secret:stop + secret:start) invalidates any item
  # left by a previous cluster — the old root token/recovery keys no longer match.
  # Delete every item with this title (by id, to also clear accidental duplicates)
  # before storing the new one, so read-back stays unambiguous.
  echo "==> Removing any stale ${OP_ITEM} item(s) from a previous cluster"
  while IFS= read -r stale_id; do
    [[ -n "${stale_id}" ]] || continue
    op item delete "${stale_id}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true
  done < <(op item list --vault "${OP_VAULT}" --format json 2>/dev/null |
    jq -r --arg t "${OP_ITEM}" '.[] | select(.title == $t) | .id')

  echo "==> Storing recovery keys + root token in 1Password (${OP_VAULT}/${OP_ITEM})"
  op_fields=("root_token[password]=$(jq -r '.root_token' <<<"${init_json}")")
  idx=1
  while IFS= read -r key; do
    [[ -n "${key}" ]] || continue
    op_fields+=("recovery_key_${idx}[password]=${key}")
    idx=$((idx + 1))
  done < <(jq -r '.recovery_keys_b64[]' <<<"${init_json}")

  # Safety net: if the store fails despite the pre-flight, print the keys so they
  # are not lost (OpenBao is already initialised at this point).
  if ! op item create --category "Password" --vault "${OP_VAULT}" \
    --title "${OP_ITEM}" "${op_fields[@]}" >/dev/null 2>&1; then
    echo "ERROR: OpenBao is initialised but storing the keys in 1Password failed." >&2
    echo "!!! SAVE THESE NOW into 1Password (${OP_VAULT}/${OP_ITEM}) or OpenBao is unrecoverable:" >&2
    jq -r '"  root_token: \(.root_token)", (.recovery_keys_b64 | to_entries[] | "  recovery_key_\(.key + 1): \(.value)")' <<<"${init_json}" >&2
    exit 1
  fi
  root_token="$(jq -r '.root_token' <<<"${init_json}")"
fi

# --- Wait for auto-unseal --------------------------------------------------
# The readiness probe is `bao status`, so Ready == unsealed + active. With static
# auto-unseal there is no manual unseal: the node unseals itself and becomes Ready.
echo "==> Waiting for the OpenBao node to become Ready (auto-unsealed + active)"
if ! kubectl --context "${CONTEXT}" -n "${NAMESPACE}" wait \
  --for=condition=Ready "pod/${POD}" --timeout=180s; then
  echo "ERROR: OpenBao did not become Ready (auto-unseal failed? check the seal key)" >&2
  exit 1
fi

echo "==> Reconnecting after the leader election"
start_pf "after unseal"
echo "==> OpenBao is unsealed (sealed=$(jq -r '.sealed' <<<"$(raw_status)"))"

# --- Plant the vault-config-operator login foothold (root token) -----------
# This is the ONLY OpenBao configuration the script performs. Everything else --
# the kv engine, the external-secrets policy/role, and a re-declaration of this
# very foothold -- is reconciled declaratively by vault-config-operator from the
# CRs in apps/secret/src/config. The seam plants just enough for the operator to log
# in and adopt the rest; it is also the recovery path if the operator is locked out.
#
# The policy and role below MUST stay byte-for-byte in sync with
#   apps/secret/src/config/policy-vault-config-operator.yaml
#   apps/secret/src/config/kubernetesauthenginerole-vault-config-operator.yaml
# so the operator adopts them as no-op overwrites (a matching body cannot
# self-lock the operator out of its own login path).
export BAO_TOKEN="${root_token}"

echo "==> Enabling kubernetes auth method"
if ! jq -e '."kubernetes/"' >/dev/null 2>&1 <<<"$(bao auth list -format=json)"; then
  bao auth enable kubernetes >/dev/null
fi

# OpenBao runs in-cluster and (authDelegator) can review tokens with its own
# ServiceAccount, so kubernetes_host is all that is required. This config write
# stays in the seam (not a CR) because it is a one-time bootstrap value.
echo "==> Configuring kubernetes auth"
bao write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc:443" >/dev/null

echo "==> Writing the vault-config-operator admin policy"
bao policy write vault-config-operator - >/dev/null <<'HCL'
# secret engine mounts (kv)
path "sys/mounts" {
  capabilities = ["read", "list"]
}
path "sys/mounts/*" {
  capabilities = ["create", "read", "update", "delete"]
}
# auth method mounts (kubernetes)
path "sys/auth" {
  capabilities = ["read", "list"]
}
path "sys/auth/*" {
  capabilities = ["create", "read", "update", "delete", "sudo"]
}
# ACL policies (external-secrets, and this policy itself). vault-config-operator
# reads/writes policies via the legacy sys/policy endpoint; grant it plus the
# modern sys/policies/acl alias.
path "sys/policy" {
  capabilities = ["read", "list"]
}
path "sys/policy/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
path "sys/policies/acl" {
  capabilities = ["list"]
}
path "sys/policies/acl/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
# kubernetes auth method config + roles
path "auth/kubernetes/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
HCL

echo "==> Binding the vault-config-operator ServiceAccount to its login role"
bao write auth/kubernetes/role/vault-config-operator \
  bound_service_account_names=controller-manager \
  bound_service_account_namespaces=vault-config-operator \
  policies=vault-config-operator >/dev/null

echo "==> Done. OpenBao is initialised, auto-unsealed, and the vault-config-operator"
echo "    foothold is planted. vault-config-operator now reconciles the kv engine and"
echo "    the external-secrets policy/role from apps/secret/src/config. Seed the real kv"
echo "    values (cloudflare / tailscale / netdata) with: moon run secret:seed"
