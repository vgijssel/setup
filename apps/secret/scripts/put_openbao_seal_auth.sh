#!/usr/bin/env bash
# secret:put_openbao_seal_auth — read the STATIC OpenBao seal key from 1Password and put it
# into the secret cluster as the `openbao-seal` Secret BEFORE OpenBao boots, so OpenBao
# auto-unseals with a durable, externally-managed key (never a cluster-generated random one).
#
# Why: OpenBao's static auto-unseal reads env://SEAL_KEY from the openbao-seal Secret (see
# src/openbao/values.yaml). Sourcing that key from 1Password — the single source of truth —
# rather than generating it on-cluster means the SAME key is always recoverable: a Raft
# snapshot is barrier-encrypted and can ONLY be restored into an OpenBao that holds this exact
# seal key. Lose the key and every backup is unrecoverable ciphertext.
#
# Run automatically by secret:start BEFORE apply (the Secret must exist before the OpenBao
# StatefulSet first starts); also runnable standalone as secret:put_openbao_seal_auth.
#
# Idempotent + fail-safe:
#   - absent           → create it from 1Password.
#   - present, matches  → no-op.
#   - present, DIFFERS  → REFUSE (overwriting the seal would leave OpenBao unable to unseal
#                         existing raft data) unless FORCE=1 (data expendable).
#
# Secrets never touch git or argv: op reads the key into a shell variable, and it is piped to
# kubectl over stdin (--from-file=…=/dev/stdin). The 1Password service-account token comes from
# OP_SERVICE_ACCOUNT_TOKEN (env or the repo-root .env).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"
NS="${SECRET_NAMESPACE:-secret}"
SECRET_NAME="${OPENBAO_SEAL_SECRET:-openbao-seal}"
SECRET_KEY="${OPENBAO_SEAL_KEY:-seal-key}"
OP_SEAL_REF="${OP_SEAL_REF:-op://enigma-prod/openbao-seal/seal-key}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require kubectl
require op

# Load OP_SERVICE_ACCOUNT_TOKEN from .env if not already exported (matches the other scripts).
if [[ -z "${OP_SERVICE_ACCOUNT_TOKEN:-}" && -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env"
  set +a
fi

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient kube-context
# (select the docker driver + connect; idempotent).
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

# Read the seal key from 1Password (this script NEVER generates it).
echo "==> Reading the OpenBao seal key from 1Password (${OP_SEAL_REF})"
seal="$(op read "${OP_SEAL_REF}" 2>/dev/null || true)"
if [[ -z "${seal}" ]]; then
  echo "ERROR: could not read the seal key from 1Password at ${OP_SEAL_REF}." >&2
  echo "       Is OP_SERVICE_ACCOUNT_TOKEN set (env or ${REPO_ROOT}/.env) and the item present?" >&2
  exit 1
fi

# The Secret must exist before the OpenBao StatefulSet starts; this runs before apply creates
# the namespace, so ensure it exists first.
kubectl create namespace "${NS}" --dry-run=client -o yaml | kubectl apply -f - >/dev/null

# Safety: never silently overwrite a DIFFERENT existing seal (would lock OpenBao out of its data).
existing="$(kubectl -n "${NS}" get secret "${SECRET_NAME}" -o "jsonpath={.data.${SECRET_KEY}}" 2>/dev/null | base64 -d 2>/dev/null || true)"
if [[ -n "${existing}" ]]; then
  if [[ "${existing}" == "${seal}" ]]; then
    echo "==> ${NS}/${SECRET_NAME} already holds the 1Password seal key; nothing to do."
    exit 0
  fi
  if [[ "${FORCE:-0}" != "1" ]]; then
    echo "ERROR: ${NS}/${SECRET_NAME} exists with a value DIFFERENT from 1Password." >&2
    echo "       Overwriting the seal key would leave OpenBao unable to unseal existing raft data." >&2
    echo "       Refusing — set FORCE=1 only if this cluster's OpenBao data is expendable." >&2
    exit 1
  fi
  echo "==> FORCE=1: overwriting the existing ${NS}/${SECRET_NAME} seal key."
fi

# Create/update the Secret. The value is piped over stdin, so it never appears in argv.
echo "==> Putting the seal key into ${NS}/${SECRET_NAME} (key ${SECRET_KEY})"
printf '%s' "${seal}" | kubectl -n "${NS}" create secret generic "${SECRET_NAME}" \
  --from-file="${SECRET_KEY}=/dev/stdin" \
  --dry-run=client -o yaml | kubectl -n "${NS}" apply -f - >/dev/null

echo "==> Done. OpenBao auto-unseals with the 1Password-sourced key when it boots."
