#!/usr/bin/env bash
# Initialise + unseal OpenBao and store the unseal keys + root token in 1Password
# (and nowhere else), then wire up the Kubernetes auth method + kv engine that
# external-secrets depends on. Finally, print the secrets you must add yourself
# via the OpenBao UI.
#
# Idempotent:
#   - fresh OpenBao          -> init, store keys in 1Password, unseal, configure
#   - initialised but sealed -> read keys back from 1Password, unseal, configure
#   - initialised + unsealed -> (re)apply auth/kv configuration only
#
# Secrets never touch local disk: init output stays in shell variables and is
# piped straight into `op`. The local `bao` CLI talks to OpenBao over a
# port-forward that is torn down on exit.
#
# Requires: kubectl (context k3d-bootstrap), jq, bao, and the 1Password CLI (op)
# signed in. Override the 1Password destination with OP_VAULT / OP_ITEM.
set -euo pipefail

CONTEXT="${KUBE_CONTEXT:-k3d-bootstrap}"
NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
OP_ACCOUNT="${OP_ACCOUNT:-my.1password.com}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
OP_ITEM="${OP_ITEM:-OpenBao unseal (homelab gateway)}"
KEY_SHARES="${KEY_SHARES:-5}"
KEY_THRESHOLD="${KEY_THRESHOLD:-3}"

export BAO_ADDR="http://127.0.0.1:${LOCAL_PORT}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require jq
require bao
require op

raw_status() { bao status -format=json 2>/dev/null || true; }
# Prints "true"/"false" from a status JSON, or "" when the JSON can't be parsed
# (transient during the post-unseal transition) so callers can retry rather than
# mistake an unreadable status for "sealed".
sealed_flag() { jq -r '.sealed // empty' <<<"$1" 2>/dev/null || true; }

# (Re)establish the port-forward to OpenBao. The forward dies during the
# post-unseal leader election, so we restart it at each phase and wait until the
# API answers.
pf_pid=""
start_pf() {
  [[ -n "${pf_pid}" ]] && kill "${pf_pid}" 2>/dev/null
  kubectl --context "${CONTEXT}" -n "${NAMESPACE}" port-forward svc/openbao "${LOCAL_PORT}:8200" >/dev/null 2>&1 &
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

echo "==> Checking access to the ${OP_ACCOUNT} 1Password account"
# `op account get` succeeds with 1Password app/biometric integration (unlike
# `op whoami`, which reports "not signed in" unless a CLI `op signin` session
# is active).
if ! op account get --account "${OP_ACCOUNT}" >/dev/null 2>&1; then
  echo "ERROR: cannot access the ${OP_ACCOUNT} 1Password account (sign in / unlock 1Password, or run: eval \$(op signin --account ${OP_ACCOUNT}))" >&2
  exit 1
fi

echo "==> Waiting for ${POD} to be Running in namespace ${NAMESPACE}"
kubectl --context "${CONTEXT}" -n "${NAMESPACE}" wait \
  --for=jsonpath='{.status.phase}'=Running "pod/${POD}" --timeout=120s

echo "==> Port-forwarding svc/openbao ${LOCAL_PORT} -> 8200"
trap 'kill "${pf_pid}" 2>/dev/null || true' EXIT
start_pf "initial"
status="$(raw_status)"

# --- Init (only when brand new) --------------------------------------------
initialized="$(jq -r '.initialized // false' <<<"${status}")"

if [[ "${initialized}" == "true" ]]; then
  echo "==> OpenBao already initialised; reading keys from 1Password (${OP_ACCOUNT}:${OP_VAULT}/${OP_ITEM})"
  op_json="$(op item get "${OP_ITEM}" --account "${OP_ACCOUNT}" --vault "${OP_VAULT}" --format json 2>/dev/null || true)"
  if [[ -z "${op_json}" ]]; then
    echo "ERROR: OpenBao is initialised but its unseal keys are not in ${OP_VAULT} (${OP_ITEM})." >&2
    echo "       The keys appear lost, so OpenBao cannot be unsealed and must be re-initialised by" >&2
    echo "       wiping its data (this destroys any secrets stored in it):" >&2
    echo "         kubectl -n ${NAMESPACE} delete statefulset openbao --cascade=foreground" >&2
    echo "         kubectl -n ${NAMESPACE} delete pvc -l app.kubernetes.io/name=openbao" >&2
    echo "       then recreate OpenBao (moon run bootstrap:start) and re-run this task." >&2
    exit 1
  fi
  init_json="$(jq '{root_token: (.fields[] | select(.label=="root_token") | .value),
                    unseal_keys_b64: [.fields[] | select(.label|startswith("unseal_key_")) | .value]}' <<<"${op_json}")"
else
  # Pre-flight: confirm we can WRITE to the vault BEFORE initialising OpenBao.
  # 1Password writes need an interactive authorization; failing here (rather than
  # after `bao operator init`) keeps OpenBao pristine so this task stays re-runnable
  # instead of leaving it initialised with its keys unrecoverable.
  echo "==> Verifying write access to ${OP_ACCOUNT}:${OP_VAULT} (approve the 1Password prompt if asked)"
  probe_id="$(op item create --account "${OP_ACCOUNT}" --category "Secure Note" \
    --vault "${OP_VAULT}" --title "openbao-init-write-check" 'probe[text]=ok' \
    --format json 2>/dev/null | jq -r '.id // empty')"
  if [[ -z "${probe_id}" ]]; then
    echo "ERROR: cannot create items in ${OP_VAULT} on ${OP_ACCOUNT}." >&2
    echo "       Enable 'Integrate with 1Password CLI' in the 1Password app (Settings > Developer)" >&2
    echo "       and approve the authorization prompt, then re-run. OpenBao was left untouched." >&2
    exit 1
  fi
  op item delete "${probe_id}" --account "${OP_ACCOUNT}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true

  echo "==> Initialising OpenBao (${KEY_SHARES} shares, threshold ${KEY_THRESHOLD})"
  init_json="$(bao operator init -key-shares="${KEY_SHARES}" -key-threshold="${KEY_THRESHOLD}" -format=json)"

  echo "==> Storing unseal keys + root token in 1Password (${OP_ACCOUNT}:${OP_VAULT}/${OP_ITEM})"
  op_fields=("root_token[password]=$(jq -r '.root_token' <<<"${init_json}")")
  idx=1
  keys="$(jq -r '.unseal_keys_b64[]' <<<"${init_json}")"
  while IFS= read -r key; do
    [[ -n "${key}" ]] || continue
    op_fields+=("unseal_key_${idx}[password]=${key}")
    idx=$((idx + 1))
  done <<<"${keys}"

  # Safety net: if the store fails despite the pre-flight check, print the keys so
  # they are not lost (OpenBao is already initialised at this point).
  if ! op item create \
    --account "${OP_ACCOUNT}" \
    --category "Secure Note" \
    --vault "${OP_VAULT}" \
    --title "${OP_ITEM}" \
    "${op_fields[@]}" >/dev/null 2>&1; then
    echo "ERROR: OpenBao is initialised but storing the keys in 1Password failed." >&2
    echo "!!! SAVE THESE NOW into 1Password (${OP_VAULT}/${OP_ITEM}) or OpenBao is unrecoverable:" >&2
    jq -r '"  root_token: \(.root_token)", (.unseal_keys_b64 | to_entries[] | "  unseal_key_\(.key + 1): \(.value)")' <<<"${init_json}" >&2
    exit 1
  fi
fi

# --- Unseal ----------------------------------------------------------------
status="$(raw_status)"
sealed="$(sealed_flag "${status}")"
if [[ "${sealed}" != "false" ]]; then
  echo "==> Unsealing"
  # Submit every key; the threshold key triggers leader election and may error
  # or drop the connection, so tolerate failures here and confirm below.
  keys="$(jq -r '.unseal_keys_b64[]' <<<"${init_json}")"
  while IFS= read -r key; do
    [[ -n "${key}" ]] || continue
    bao operator unseal "${key}" >/dev/null 2>&1 || true
  done <<<"${keys}"
fi

# The readiness probe is `bao status`, so Ready == unsealed + active. Waiting on
# it rides out the leader election without depending on the (now-dropped)
# port-forward.
echo "==> Waiting for the OpenBao node to become Ready (unsealed + active)"
if ! kubectl --context "${CONTEXT}" -n "${NAMESPACE}" wait \
  --for=condition=Ready "pod/${POD}" --timeout=120s; then
  echo "ERROR: OpenBao did not become Ready (still sealed?)" >&2
  exit 1
fi

echo "==> Reconnecting after the leader election"
start_pf "after unseal"
echo "==> OpenBao is unsealed"

# --- Configure kubernetes auth + kv engine (root token) --------------------
export BAO_TOKEN
BAO_TOKEN="$(jq -r '.root_token' <<<"${init_json}")"

echo "==> Enabling kv v2 engine at kv/"
mounts="$(bao secrets list -format=json)"
if ! jq -e '."kv/"' >/dev/null 2>&1 <<<"${mounts}"; then
  bao secrets enable -path=kv kv-v2 >/dev/null
fi

echo "==> Writing external-secrets read policy"
bao policy write external-secrets - >/dev/null <<'HCL'
path "kv/data/*" {
  capabilities = ["read"]
}
path "kv/metadata/*" {
  capabilities = ["read", "list"]
}
HCL

echo "==> Enabling kubernetes auth method"
auths="$(bao auth list -format=json)"
if ! jq -e '."kubernetes/"' >/dev/null 2>&1 <<<"${auths}"; then
  bao auth enable kubernetes >/dev/null
fi

# OpenBao runs in-cluster and (authDelegator) can review tokens with its own
# ServiceAccount, so kubernetes_host is all that is required.
echo "==> Configuring kubernetes auth"
bao write auth/kubernetes/config \
  kubernetes_host="https://kubernetes.default.svc:443" >/dev/null

echo "==> Binding the external-secrets ServiceAccount to the external-secrets role"
bao write auth/kubernetes/role/external-secrets \
  bound_service_account_names=external-secrets \
  bound_service_account_namespaces=external-secrets \
  policies=external-secrets \
  ttl=1h >/dev/null

# --- Tell the operator what to seed via the OpenBao UI ----------------------
cat <<'SECRETS'

==> OpenBao is initialised, unsealed and configured.

    Now add these secrets yourself via the OpenBao UI (kv v2 engine "kv"),
    each as a separate secret at the given path with the listed keys:

      kv/cloudflare   token
      kv/tailscale    oauth_client_id, oauth_client_secret
      kv/netdata      claim_token
      kv/s3           access_key_id, secret_access_key, region, endpoint
      kv/hetzner      token

    Reach the UI with:
      kubectl port-forward -n secret svc/openbao 8200:8200
    then open http://127.0.0.1:8200/ui and sign in with the root token stored
    in 1Password. external-secrets reconciles the synced secrets automatically.
SECRETS
