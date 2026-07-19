#!/usr/bin/env bash
# Bootstrap OpenBao in the already-running secret cluster (run after
# secret:start + secret:apply):
#   1. seed the static auto-unseal key (1Password -> openbao-seal Secret) so
#      OpenBao boots unsealed with no manual step
#   2. initialise OpenBao (recovery keys + root token -> 1Password) and wait for
#      auto-unseal
#
# OpenBao uses static auto-unseal (see src/openbao/values.yaml): `bao operator
# init` yields RECOVERY keys (not unseal keys) and the node auto-unseals from the
# static seal key on every boot. All OpenBao configuration — the kv engine, the
# kubernetes auth backend, the external-secrets policy/role, and the terranetes
# policy + login role — is applied afterwards by `secret:configure` (OpenTofu, root
# token) and reconciled continuously by terranetes-controller. This script plants
# nothing in OpenBao beyond initialising it.
#
# Idempotent:
#   - first run       -> generate the seal key, init, store keys in 1Password
#   - later runs      -> read the seal key + root token back, (re)apply the Secret
#
# Secrets never touch local disk or git: they live only in 1Password + K8s
# Secrets, passed between them in shell variables. Uses a 1Password service
# account (OP_SERVICE_ACCOUNT_TOKEN from .env), so no interactive `op signin`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CONTEXT="${KUBE_CONTEXT:-$(kubectl config current-context)}"
NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
OP_VAULT="${OP_VAULT:-enigma-prod}"

# The seal-key item (part 1) and the root/recovery item (part 2) are DISTINCT
# 1Password items — keep their identifiers separate so neither clobbers the other.
SEAL_SECRET_NAME="${SEAL_SECRET_NAME:-openbao-seal}"
SEAL_SECRET_KEY="${SEAL_SECRET_KEY:-seal-key}"
SEAL_OP_ITEM="${SEAL_OP_ITEM:-OpenBao static seal (secret cluster)}"
SEAL_OP_FIELD="${SEAL_OP_FIELD:-seal_key}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
RECOVERY_SHARES="${RECOVERY_SHARES:-5}"
RECOVERY_THRESHOLD="${RECOVERY_THRESHOLD:-3}"

export BAO_ADDR="http://127.0.0.1:${LOCAL_PORT}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require jq
require op
require openssl
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

# ── Part 1: seed the static seal key ───────────────────────────────────────
# The 32-byte seal key is the ONE bootstrap secret that cannot come from OpenBao
# itself (chicken-and-egg). Generate it on first run, store it in 1Password, and
# mirror it into the openbao-seal Secret mounted as env://SEAL_KEY *before* the
# pod starts.
seed_seal() {
  local seal_key
  if op item get "${SEAL_OP_ITEM}" --vault "${OP_VAULT}" >/dev/null 2>&1; then
    echo "==> Seal key already in 1Password (${OP_VAULT}/${SEAL_OP_ITEM}); reading it back"
    # Use `op item get --fields` rather than an op:// reference: the item title can
    # contain characters (spaces, '+', parens) invalid in a secret reference.
    seal_key="$(op item get "${SEAL_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields "label=${SEAL_OP_FIELD}")"
  else
    echo "==> Generating a new 32-byte static seal key and storing it in 1Password (${OP_VAULT}/${SEAL_OP_ITEM})"
    seal_key="$(openssl rand -base64 32)"
    op item create --category "Password" --vault "${OP_VAULT}" \
      --title "${SEAL_OP_ITEM}" "${SEAL_OP_FIELD}[password]=${seal_key}" >/dev/null
  fi
  if [[ -z "${seal_key}" ]]; then
    echo "ERROR: seal key is empty after get-or-create" >&2
    exit 1
  fi

  echo "==> Ensuring namespace '${NAMESPACE}'"
  kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f - >/dev/null

  echo "==> Applying Secret ${NAMESPACE}/${SEAL_SECRET_NAME} (${SEAL_SECRET_KEY})"
  kubectl -n "${NAMESPACE}" create secret generic "${SEAL_SECRET_NAME}" \
    --from-literal="${SEAL_SECRET_KEY}=${seal_key}" \
    --dry-run=client -o yaml | kubectl apply -f - >/dev/null

  # secret:apply deploys the OpenBao bundle before the seal key exists, so the pod
  # may be stuck in CreateContainerConfigError. Nudge it to restart promptly with
  # the seal key rather than waiting out the kubelet backoff.
  if kubectl -n "${NAMESPACE}" get pod "${POD}" >/dev/null 2>&1; then
    local ready
    ready="$(kubectl -n "${NAMESPACE}" get pod "${POD}" -o jsonpath='{.status.containerStatuses[0].ready}' 2>/dev/null || true)"
    if [[ "${ready}" != "true" ]]; then
      echo "==> Restarting ${POD} to pick up the seal key"
      kubectl -n "${NAMESPACE}" delete pod "${POD}" --wait=false >/dev/null 2>&1 || true
    fi
  fi

  echo "==> Seal key seeded. OpenBao will boot auto-unsealed once it can read env://SEAL_KEY."
}

# ── Part 2: initialise OpenBao + plant the operator foothold ───────────────
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

init_openbao() {
  echo "==> Waiting for ${POD} to be Running in namespace ${NAMESPACE}"
  kubectl --context "${CONTEXT}" -n "${NAMESPACE}" wait \
    --for=jsonpath='{.status.phase}'=Running "pod/${POD}" --timeout=180s

  echo "==> Port-forwarding pod/${POD} ${LOCAL_PORT} -> 8200"
  trap 'kill "${pf_pid}" 2>/dev/null || true' EXIT
  start_pf "initial"
  local status root_token
  status="$(raw_status)"

  # --- Init (only when brand new) ------------------------------------------
  local initialized
  initialized="$(jq -r '.initialized // false' <<<"${status}" || true)"
  if [[ "${initialized}" == "true" ]]; then
    echo "==> OpenBao already initialised; reading root token from 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
    root_token="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
    if [[ -z "${root_token}" ]]; then
      echo "ERROR: OpenBao is initialised but its root token is not in ${OP_VAULT} (${ROOT_OP_ITEM})." >&2
      echo "       Recover via the recovery keys, or wipe + re-init (destroys stored secrets):" >&2
      echo "         kubectl -n ${NAMESPACE} delete statefulset openbao --cascade=foreground" >&2
      echo "         kubectl -n ${NAMESPACE} delete pvc -l app.kubernetes.io/name=openbao" >&2
      echo "       then re-run secret:apply and this task." >&2
      exit 1
    fi
  else
    # Pre-flight: confirm we can WRITE to the vault BEFORE initialising OpenBao, so
    # a storage failure here (rather than after init) keeps OpenBao pristine and
    # this task re-runnable instead of leaving it initialised with unrecoverable keys.
    echo "==> Verifying write access to ${OP_VAULT}"
    local probe_id
    probe_id="$(op item create --category "Secure Note" --vault "${OP_VAULT}" \
      --title "openbao-init-write-check" 'probe[text]=ok' --format json 2>/dev/null | jq -r '.id // empty')"
    if [[ -z "${probe_id}" ]]; then
      echo "ERROR: cannot create items in ${OP_VAULT} (check OP_SERVICE_ACCOUNT_TOKEN scope). OpenBao left untouched." >&2
      exit 1
    fi
    op item delete "${probe_id}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true

    echo "==> Initialising OpenBao (recovery shares ${RECOVERY_SHARES}, threshold ${RECOVERY_THRESHOLD})"
    local init_json
    init_json="$(bao operator init \
      -recovery-shares="${RECOVERY_SHARES}" -recovery-threshold="${RECOVERY_THRESHOLD}" -format=json)"

    # A fresh OpenBao (e.g. after secret:stop + secret:start) invalidates any item
    # left by a previous cluster — the old root token/recovery keys no longer match.
    # Delete every item with this title (by id, to also clear accidental duplicates)
    # before storing the new one, so read-back stays unambiguous.
    echo "==> Removing any stale ${ROOT_OP_ITEM} item(s) from a previous cluster"
    local stale_ids
    stale_ids="$(op item list --vault "${OP_VAULT}" --format json 2>/dev/null |
      jq -r --arg t "${ROOT_OP_ITEM}" '.[] | select(.title == $t) | .id' || true)"
    while IFS= read -r stale_id; do
      [[ -n "${stale_id}" ]] || continue
      op item delete "${stale_id}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true
    done <<<"${stale_ids}"

    echo "==> Storing recovery keys + root token in 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
    local op_fields idx
    op_fields=("root_token[password]=$(jq -r '.root_token' <<<"${init_json}")")
    idx=1
    local recovery_keys
    recovery_keys="$(jq -r '.recovery_keys_b64[]' <<<"${init_json}")"
    while IFS= read -r key; do
      [[ -n "${key}" ]] || continue
      op_fields+=("recovery_key_${idx}[password]=${key}")
      idx=$((idx + 1))
    done <<<"${recovery_keys}"

    # Safety net: if the store fails despite the pre-flight, print the keys so they
    # are not lost (OpenBao is already initialised at this point).
    if ! op item create --category "Password" --vault "${OP_VAULT}" \
      --title "${ROOT_OP_ITEM}" "${op_fields[@]}" >/dev/null 2>&1; then
      echo "ERROR: OpenBao is initialised but storing the keys in 1Password failed." >&2
      echo "!!! SAVE THESE NOW into 1Password (${OP_VAULT}/${ROOT_OP_ITEM}) or OpenBao is unrecoverable:" >&2
      jq -r '"  root_token: \(.root_token)", (.recovery_keys_b64 | to_entries[] | "  recovery_key_\(.key + 1): \(.value)")' <<<"${init_json}" >&2
      exit 1
    fi
    root_token="$(jq -r '.root_token' <<<"${init_json}")"
  fi

  # --- Wait for auto-unseal ------------------------------------------------
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
  local status_json sealed
  status_json="$(raw_status)"
  sealed="$(jq -r '.sealed' <<<"${status_json}" || true)"
  echo "==> OpenBao is unsealed (sealed=${sealed})"

  # No OpenBao configuration is planted here anymore. The kv engine, the kubernetes
  # auth backend + config, the external-secrets policy/role, and the terranetes
  # policy + login role are all declared by the OpenTofu module
  # (apps/secret/src/openbao-config) and applied by secret:configure with this root
  # token — then reconciled continuously by terranetes-controller via its own
  # ServiceAccount login. No root token is persisted to a K8s Secret.
}

# ── Run ─────────────────────────────────────────────────────────────────────
echo "==> [1/2] Seeding the static seal key"
seed_seal

echo "==> [2/2] Initialising OpenBao"
init_openbao

cat <<EOF

==> Done. OpenBao is initialised and auto-unsealed. Next:

      moon run secret:configure   # OpenTofu (root token) seeds the kv engine,
                                  # kubernetes auth, and the external-secrets +
                                  # terranetes policies/roles into shared state;
                                  # terranetes-controller then reconciles it.

    Add the remaining kv values via the OpenBao UI/API — port-forward, then open
    http://127.0.0.1:${LOCAL_PORT}/ui with the root token from 1Password
    (${OP_VAULT} / "${ROOT_OP_ITEM}"):

      kubectl -n ${NAMESPACE} port-forward svc/openbao ${LOCAL_PORT}:8200

    In the kv v2 engine "kv", add (path -> keys):

      kv/cloudflare   token
      kv/tailscale    oauth_client_id, oauth_client_secret
      kv/netdata      claim_token

    external-secrets then syncs them into the consuming namespaces automatically.
EOF
