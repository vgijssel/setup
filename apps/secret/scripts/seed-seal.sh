#!/usr/bin/env bash
# Seed the OpenBao static auto-unseal key: a 32-byte key that is the ONE bootstrap
# secret that cannot come from OpenBao itself (chicken-and-egg). It is generated
# on first run, stored in 1Password, and mirrored into the `openbao-seal` K8s
# Secret in the `secret` namespace, mounted into the OpenBao pod as env://SEAL_KEY
# *before* the pod starts so OpenBao boots auto-unsealed.
#
# Idempotent:
#   - first run  -> generate a 32-byte key, store it in 1Password, create the Secret
#   - later runs -> read the key back from 1Password, (re)apply the Secret (no-op)
#
# The key never touches local disk or git: it lives only in 1Password and the K8s
# Secret, passed between them in shell variables. Uses a 1Password service account
# (OP_SERVICE_ACCOUNT_TOKEN from .env), so no interactive `op signin` is needed.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

NAMESPACE="${OPENBAO_NAMESPACE:-secret}"
SECRET_NAME="${SEAL_SECRET_NAME:-openbao-seal}"
SECRET_KEY="${SEAL_SECRET_KEY:-seal-key}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
OP_ITEM="${OP_ITEM:-OpenBao static seal (secret cluster)}"
OP_FIELD="${OP_FIELD:-seal_key}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require jq
require op
require openssl

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

# --- Get-or-create the seal key in 1Password -------------------------------
if op item get "${OP_ITEM}" --vault "${OP_VAULT}" >/dev/null 2>&1; then
  echo "==> Seal key already in 1Password (${OP_VAULT}/${OP_ITEM}); reading it back"
  seal_key="$(op read "op://${OP_VAULT}/${OP_ITEM}/${OP_FIELD}")"
else
  echo "==> Generating a new 32-byte static seal key and storing it in 1Password (${OP_VAULT}/${OP_ITEM})"
  seal_key="$(openssl rand -base64 32)"
  op item create \
    --category "Password" \
    --vault "${OP_VAULT}" \
    --title "${OP_ITEM}" \
    "${OP_FIELD}[password]=${seal_key}" >/dev/null
fi

if [[ -z "${seal_key}" ]]; then
  echo "ERROR: seal key is empty after get-or-create" >&2
  exit 1
fi

# --- Mirror the key into the K8s Secret ------------------------------------
echo "==> Ensuring namespace '${NAMESPACE}'"
kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f - >/dev/null

echo "==> Applying Secret ${NAMESPACE}/${SECRET_NAME} (${SECRET_KEY})"
kubectl -n "${NAMESPACE}" create secret generic "${SECRET_NAME}" \
  --from-literal="${SECRET_KEY}=${seal_key}" \
  --dry-run=client -o yaml | kubectl apply -f - >/dev/null

echo "==> Seal key seeded. OpenBao will boot auto-unsealed once it can read env://SEAL_KEY."
