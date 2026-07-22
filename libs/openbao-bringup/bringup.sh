#!/usr/bin/env bash
# OpenBao bring-up — runs as a Job INSIDE the secret child (SPEC §4). Replaces the
# host-run bootstrap.sh: seeds the static seal key, initialises OpenBao (recovery +
# root keys -> 1Password), and mints a TEMPORARY admin token into the `vault`
# Provider's credentials Secret so the openbao-config Configuration can apply once
# with use_token=true. The KubeVela Workflow that launches this Job then applies the
# Configuration and finally deletes the temp-token Secret (no long-lived token
# remains in-cluster).
#
# In-cluster differences from the old host script: OpenBao is reached directly over
# its ClusterIP Service DNS (no port-forward), and kubectl uses the Job pod's own
# ServiceAccount. 1Password is reached with OP_SERVICE_ACCOUNT_TOKEN (no interactive
# signin). Secrets never touch disk/git — only 1Password + K8s Secrets, passed in
# shell variables.
#
# Idempotent: seal key + root/recovery keys are get-or-create in 1Password; init is
# skipped when OpenBao is already initialised (root token read back from 1Password).
set -euo pipefail

NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
SEAL_SECRET_NAME="${SEAL_SECRET_NAME:-openbao-seal}"
SEAL_SECRET_KEY="${SEAL_SECRET_KEY:-seal-key}"

OP_VAULT="${OP_VAULT:-enigma-prod}"
SEAL_OP_ITEM="${SEAL_OP_ITEM:-OpenBao static seal (secret cluster)}"
SEAL_OP_FIELD="${SEAL_OP_FIELD:-seal_key}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
RECOVERY_SHARES="${RECOVERY_SHARES:-5}"
RECOVERY_THRESHOLD="${RECOVERY_THRESHOLD:-3}"

# Where the vault Provider + its credentials Secret live in the child (must match the
# generated component's providerRef: vault/default).
PROVIDER_NS="${PROVIDER_NS:-default}"
PROVIDER_SECRET="${PROVIDER_SECRET:-vault-provider-credentials}"
TEMP_TOKEN_TTL="${TEMP_TOKEN_TTL:-60m}"

# Address OpenBao by its POD DNS (headless openbao-internal), not the `openbao`
# Service. The chart runs HA mode (active/standby Services) even at replicas=1, and
# the active-Service routing flaps while a single-node raft settles leader election
# — `bao status` through it intermittently returns non-JSON. The headless service
# selects the pod regardless of active-label churn, so it is stable for the single
# node. Same address is written into the vault Provider creds below.
export BAO_ADDR="${BAO_ADDR:-http://${POD}.openbao-internal.${NAMESPACE}.svc:8200}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require jq
require op
require bao

if [[ -z "${OP_SERVICE_ACCOUNT_TOKEN:-}" ]]; then
  echo "ERROR: OP_SERVICE_ACCOUNT_TOKEN is not set (mount it from the op-credentials Secret)" >&2
  exit 1
fi

# ── Part 1: seed the static seal key ─────────────────────────────────────────
# The 32-byte seal key is the ONE bootstrap secret that cannot come from OpenBao
# itself. Generate on first run, store in 1Password, and mirror into the
# openbao-seal Secret OpenBao mounts as env://SEAL_KEY before it can boot unsealed.
seed_seal() {
  local seal_key
  if op item get "${SEAL_OP_ITEM}" --vault "${OP_VAULT}" >/dev/null 2>&1; then
    echo "==> Seal key already in 1Password (${OP_VAULT}/${SEAL_OP_ITEM}); reading it back"
    seal_key="$(op item get "${SEAL_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields "label=${SEAL_OP_FIELD}")"
  else
    echo "==> Generating a new 32-byte static seal key -> 1Password (${OP_VAULT}/${SEAL_OP_ITEM})"
    seal_key="$(head -c 32 /dev/urandom | base64)"
    op item create --category "Password" --vault "${OP_VAULT}" \
      --title "${SEAL_OP_ITEM}" "${SEAL_OP_FIELD}[password]=${seal_key}" >/dev/null
  fi
  [[ -n "${seal_key}" ]] || { echo "ERROR: seal key empty after get-or-create" >&2; exit 1; }

  echo "==> Applying Secret ${NAMESPACE}/${SEAL_SECRET_NAME} (${SEAL_SECRET_KEY})"
  kubectl -n "${NAMESPACE}" create secret generic "${SEAL_SECRET_NAME}" \
    --from-literal="${SEAL_SECRET_KEY}=${seal_key}" \
    --dry-run=client -o yaml | kubectl apply -f - >/dev/null

  # The platform deploys OpenBao before the seal key exists, so the pod may be stuck
  # in CreateContainerConfigError (container WAITING, never started). Nudge only THAT
  # pod to restart so it mounts the freshly-applied seal Secret. A pod that is already
  # RUNNING must NOT be restarted: an uninitialised OpenBao is legitimately not-Ready
  # (its readiness probe needs init+unseal), and deleting it mid-boot races `bao
  # operator init` and corrupts the raft state ("cluster already has state").
  if kubectl -n "${NAMESPACE}" get pod "${POD}" >/dev/null 2>&1; then
    local running
    running="$(kubectl -n "${NAMESPACE}" get pod "${POD}" -o jsonpath='{.status.containerStatuses[0].state.running}' 2>/dev/null || true)"
    if [[ -z "${running}" ]]; then
      echo "==> ${POD} container is waiting (no seal key yet); restarting to mount it"
      kubectl -n "${NAMESPACE}" delete pod "${POD}" --wait=false >/dev/null 2>&1 || true
    else
      echo "==> ${POD} is already Running; leaving it to auto-unseal after init"
    fi
  fi
}

# ── Part 2: initialise OpenBao ───────────────────────────────────────────────
init_openbao() {
  # The readiness probe is `bao status`, which only passes once OpenBao is
  # initialised + auto-unsealed — so we CANNOT wait for pod Ready before init
  # (deadlock). Instead poll the API for reachability: `bao status` returns valid
  # JSON (with initialized=false) as soon as the server is up, exit code non-zero
  # notwithstanding.
  echo "==> Waiting for the OpenBao API on ${BAO_ADDR}"
  local status=""
  for _ in $(seq 1 120); do
    status="$(bao status -format=json 2>/dev/null || true)"
    if jq -e . >/dev/null 2>&1 <<<"${status}"; then break; fi
    sleep 2
  done
  if ! jq -e . >/dev/null 2>&1 <<<"${status}"; then
    echo "ERROR: OpenBao API not reachable on ${BAO_ADDR} (is ${POD} Running + seal key seeded?)" >&2
    exit 1
  fi

  local initialized root_token
  initialized="$(jq -r '.initialized // false' <<<"${status}" 2>/dev/null || echo false)"

  if [[ "${initialized}" == "true" ]]; then
    echo "==> OpenBao already initialised; reading root token from 1Password"
    root_token="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
    [[ -n "${root_token}" ]] || { echo "ERROR: OpenBao initialised but its root token is not in ${OP_VAULT}/${ROOT_OP_ITEM}." >&2; exit 1; }
  else
    # Pre-flight: confirm we can WRITE to the vault BEFORE init, so a storage failure
    # keeps OpenBao pristine + this Job re-runnable rather than leaving it initialised
    # with unrecoverable keys.
    echo "==> Verifying write access to ${OP_VAULT}"
    local probe_id
    probe_id="$(op item create --category "Secure Note" --vault "${OP_VAULT}" \
      --title "openbao-init-write-check" 'probe[text]=ok' --format json 2>/dev/null | jq -r '.id // empty')"
    [[ -n "${probe_id}" ]] || { echo "ERROR: cannot create items in ${OP_VAULT} (check OP_SERVICE_ACCOUNT_TOKEN scope). OpenBao untouched." >&2; exit 1; }
    op item delete "${probe_id}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true

    echo "==> Initialising OpenBao (recovery shares ${RECOVERY_SHARES}, threshold ${RECOVERY_THRESHOLD})"
    local init_json
    init_json="$(bao operator init -recovery-shares="${RECOVERY_SHARES}" -recovery-threshold="${RECOVERY_THRESHOLD}" -format=json)"

    # A fresh OpenBao invalidates keys from any previous cluster; delete stale items
    # (by id, clearing accidental duplicates) before storing the new one.
    echo "==> Removing any stale ${ROOT_OP_ITEM} item(s) from a previous cluster"
    local stale_ids
    stale_ids="$(op item list --vault "${OP_VAULT}" --format json 2>/dev/null | jq -r --arg t "${ROOT_OP_ITEM}" '.[] | select(.title == $t) | .id' || true)"
    while IFS= read -r stale_id; do
      [[ -n "${stale_id}" ]] || continue
      op item delete "${stale_id}" --vault "${OP_VAULT}" >/dev/null 2>&1 || true
    done <<<"${stale_ids}"

    echo "==> Storing recovery keys + root token in 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
    local op_fields idx recovery_keys
    op_fields=("root_token[password]=$(jq -r '.root_token' <<<"${init_json}")")
    idx=1
    recovery_keys="$(jq -r '.recovery_keys_b64[]' <<<"${init_json}")"
    while IFS= read -r key; do
      [[ -n "${key}" ]] || continue
      op_fields+=("recovery_key_${idx}[password]=${key}")
      idx=$((idx + 1))
    done <<<"${recovery_keys}"

    if ! op item create --category "Password" --vault "${OP_VAULT}" \
      --title "${ROOT_OP_ITEM}" "${op_fields[@]}" >/dev/null 2>&1; then
      echo "ERROR: OpenBao is initialised but storing keys in 1Password failed." >&2
      echo "!!! SAVE THESE NOW into ${OP_VAULT}/${ROOT_OP_ITEM} or OpenBao is unrecoverable:" >&2
      jq -r '"  root_token: \(.root_token)", (.recovery_keys_b64 | to_entries[] | "  recovery_key_\(.key + 1): \(.value)")' <<<"${init_json}" >&2
      exit 1
    fi
    root_token="$(jq -r '.root_token' <<<"${init_json}")"
  fi

  # With static auto-unseal the node unseals itself post-init; wait for it before
  # issuing token/API calls (a brief leader election may follow init).
  echo "==> Waiting for OpenBao to auto-unseal"
  local sealed="" st
  for _ in $(seq 1 60); do
    # Read `.sealed` WITHOUT jq's `//` default: `//` treats a `false` result as empty
    # and would return the fallback, so `.sealed // true` reports "true" even when the
    # node is unsealed. Plain `.sealed` yields "false"/"true"; an unreachable node
    # yields "" (keep looping).
    st="$(bao status -format=json 2>/dev/null || true)"
    sealed="$(jq -r '.sealed' <<<"${st}" 2>/dev/null || true)"
    [[ "${sealed}" == "false" ]] && break
    sleep 2
  done
  [[ "${sealed}" == "false" ]] || { echo "ERROR: OpenBao did not auto-unseal (check the seal key)" >&2; exit 1; }

  # ── Part 3: mint a temporary admin token into the vault Provider Secret ──────
  # Rather than exposing the real root token, mint a short-TTL orphan token (inherits
  # root policy) and write it to the Provider's credentials Secret in the child. The
  # openbao-config Configuration applies once with use_token=true reading this; the
  # Workflow deletes the Secret + revokes the token afterwards.
  echo "==> Minting a temporary admin token (ttl ${TEMP_TOKEN_TTL}) for the openbao-config apply"
  local temp_token
  temp_token="$(BAO_TOKEN="${root_token}" bao token create -orphan -ttl="${TEMP_TOKEN_TTL}" -field=token)"
  [[ -n "${temp_token}" ]] || { echo "ERROR: failed to mint the temporary admin token" >&2; exit 1; }

  echo "==> Ensuring the vault Provider + credentials Secret in ${PROVIDER_NS}"
  kubectl apply -f - >/dev/null <<YAML
apiVersion: v1
kind: Secret
metadata:
  name: ${PROVIDER_SECRET}
  namespace: ${PROVIDER_NS}
type: Opaque
stringData:
  credentials: |
    VAULT_ADDR: ${BAO_ADDR}
    VAULT_TOKEN: ${temp_token}
---
apiVersion: terraform.core.oam.dev/v1beta1
kind: Provider
metadata:
  name: vault
  namespace: ${PROVIDER_NS}
spec:
  provider: custom
  credentials:
    source: Secret
    secretRef:
      name: ${PROVIDER_SECRET}
      namespace: ${PROVIDER_NS}
      key: credentials
YAML

  echo "==> OpenBao initialised + unsealed; temp admin token planted for the config apply."
}

echo "==> [1/2] Seeding the static seal key"
seed_seal
echo "==> [2/2] Initialising OpenBao + planting the temp admin token"
init_openbao
echo "==> OpenBao bring-up complete."
