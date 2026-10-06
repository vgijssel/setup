#!/usr/bin/env bash
# Seed the NetBird operator's management API PAT into the network cluster — the ONE
# manual step network needs, run automatically by network:start before apply (also
# runnable standalone as network:put_netbird_operator_auth).
#
# Chicken-and-egg: the netbird-operator needs the `netbird-mgmt-api-key` Secret (key
# NB_API_KEY) to talk to the NetBird management API and stand up this cluster's routing
# peer, but on network that Secret is normally minted from the SECRET cluster's OpenBao by
# Vault Secrets Operator — which cannot reach OpenBao until the routing peer exists, because it
# is the routing peer that carries this cluster's route to the overlay. So break the loop here:
# mint the per-cluster PAT from the secret cluster's OpenBao using the local `bao` client, from
# the WORKSTATION (already a mesh peer), and create the netbird-mgmt-api-key Secret directly in
# the network cluster. VSO adopts it later
# (apps/network/src/config/vaultdynamicsecret-netbird-mgmt-api-key.yaml).
#
# Once the operator is up and its routing peer is Connected, VSO reaches OpenBao over the mesh
# and re-mints this same Secret — no further seeding here. The operator creates its own NetBird
# SetupKeys/Groups via the management API (recorded in the SetupKey CR's status), so there is no
# separate setup key to seed.
#
# Per-cluster credential: this cluster mints from the netbird engine role
# `netbird/pat/network-operator`, the secret cluster from `netbird/pat/secret-operator`, so a
# rotation/compromise is bounded to one cluster and each operator peer has an independent NetBird
# identity. The PAT must carry the NetBird role **admin** — the operator caches its capabilities
# at boot, so a too-narrow PAT fails Group creation with permission-denied rather than loudly.
#
# TWO THINGS THAT WENT STALE AND ARE NOW FIXED (both would fail a cold start):
#   - the address was `openbao.secret.vgijssel.nl`, the BYOP reverse-proxy name, deleted with the
#     proxy. It is `openbao.vpn.blueora.ng` now — the mesh exposure.
#   - the PAT was read from a STATIC `kv/network-netbird-operator` entry that no longer exists:
#     the netbird secrets engine mints PATs per-consumer instead, which is the same path VSO
#     uses, so the seed and the steady state no longer disagree.
#
# Auth: BAO_TOKEN/VAULT_TOKEN must be a live OpenBao token. Self-init REVOKES the root token, so
# there is no standing root credential — get one with `moon run secret:get_openbao_auth` (1 h
# admin, needs kubectl admin on the secret cluster):
#   eval "$(moon run --log error secret:get_openbao_auth)" && moon run network:put_netbird_operator_auth
#
# Secrets never touch git: the token lives only in the environment; the PAT is read into a shell
# variable and written straight to a Kubernetes Secret.
#
# Idempotent in effect (re-applies the Secret), but NOT free: each run mints a fresh PAT from the
# engine. That is deliberate — a PAT's value is only returned at creation, so there is nothing to
# re-read — and harmless, because the engine leases them and VSO supersedes this one shortly.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"

CLUSTER_NAME="${NETWORK_CLUSTER_NAME:-network}"
CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
NB_NAMESPACE="${NB_NAMESPACE:-netbird}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://openbao.vpn.blueora.ng}"
# NetBird secrets-engine role that mints this cluster's operator PAT. Configured in
# apps/secret/src/openbao-config/plugin-netbird.yaml; same path VSO reads.
PAT_ROLE_PATH="${PAT_ROLE_PATH:-netbird/pat/network-operator}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require kubectl
require jq
require bao

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient
# kube-context (select the docker driver + connect; idempotent). This makes the
# active context this cluster; the explicit --context "${CONTEXT}" flags below still
# pin every write to it belt-and-suspenders.
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

# An OpenBao token for the secret cluster. BAO_TOKEN is what secret:get_openbao_auth prints;
# VAULT_TOKEN is accepted too (the `bao` client reads either), and .env is still honoured for a
# machine that keeps one there.
if [[ -z "${BAO_TOKEN:-}" && -z "${VAULT_TOKEN:-}" && -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env"
  set +a
fi
if [[ -z "${BAO_TOKEN:-}" && -z "${VAULT_TOKEN:-}" ]]; then
  echo "ERROR: no OpenBao token in the environment (BAO_TOKEN or VAULT_TOKEN)." >&2
  echo "       Self-init revokes root, so there is no standing credential. Mint a 1h admin token:" >&2
  echo "         eval \"\$(moon run --log error secret:get_openbao_auth)\"" >&2
  exit 1
fi
export VAULT_ADDR="${REMOTE_BAO_ADDR}"
export BAO_ADDR="${REMOTE_BAO_ADDR}"

# Confirm the network context exists (network:start must have run).
if ! kubectl --context "${CONTEXT}" get nodes >/dev/null 2>&1; then
  echo "ERROR: network cluster context '${CONTEXT}' is not reachable. Run 'moon run network:start' first." >&2
  exit 1
fi

echo "==> Minting a NetBird operator PAT from ${PAT_ROLE_PATH} at ${REMOTE_BAO_ADDR}"
op_json="$(bao read -format=json "${PAT_ROLE_PATH}" 2>/dev/null || true)"
api_token="$(jq -r '.data.access_token // empty' <<<"${op_json}")"
if [[ -z "${api_token}" ]]; then
  echo "ERROR: could not mint access_token from ${PAT_ROLE_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Checks, in the order they usually fail:" >&2
  echo "         - is this workstation a connected NetBird peer? the address is mesh-only and" >&2
  echo "           does NOT resolve publicly (by design) — 'netbird status' should say Connected" >&2
  echo "         - is the token live and does its policy allow read on ${PAT_ROLE_PATH}?" >&2
  echo "         - is the netbird secrets engine configured? (apps/secret/src/openbao-config)" >&2
  exit 1
fi

echo "==> Ensuring namespace '${NB_NAMESPACE}' in the network cluster"
kubectl --context "${CONTEXT}" create namespace "${NB_NAMESPACE}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> Applying Secret ${NB_NAMESPACE}/netbird-mgmt-api-key (NB_API_KEY)"
kubectl --context "${CONTEXT}" -n "${NB_NAMESPACE}" create secret generic netbird-mgmt-api-key \
  --from-literal="NB_API_KEY=${api_token}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> netbird-mgmt-api-key seeded; the NetBird operator can now register (network routing peer)."
