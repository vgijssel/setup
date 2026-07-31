#!/usr/bin/env bash
# secret:get_openbao_auth — mint a short-lived (1h) OpenBao ADMIN token for break-glass /
# human admin tasks (seeding kv secrets, recovery-key rotation, policy fixes, ...).
#
# How it works: OpenBao self-init created an `admin` kubernetes-auth role bound to the
# `openbao-admin` ServiceAccount (ns secret). This script mints a short-lived token for
# that SA (only a kubectl admin can), then logs in to OpenBao — over an exec into the
# server pod, so no direct network path to OpenBao is required — and OpenBao returns an
# admin token whose TTL the role caps at 1h.
#
# Security model: a k8s admin already has full cluster access (all Secrets, the
# openbao-seal key, pod exec), so this grants nothing beyond kubectl admin. The short
# TTL bounds a leaked token. There is no long-lived admin credential anywhere.
#
# Usage:
#   moon run secret:get_openbao_auth   # prints export lines for BAO_ADDR + BAO_TOKEN
#   eval "$(moon run --log error secret:get_openbao_auth)"   # load directly into the shell
# Then reach OpenBao from your workstation via: moon run secret:forward
set -euo pipefail

NS="${SECRET_NAMESPACE:-secret}"
POD="${OPENBAO_POD:-openbao-0}"
ROLE="${OPENBAO_ADMIN_ROLE:-admin}"
SA="${OPENBAO_ADMIN_SA:-openbao-admin}"
LOCAL_PORT="${LOCAL_PORT:-8200}"
CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vcluster
require kubectl

# Point kubectl at the '${CLUSTER_NAME}' vind cluster regardless of the ambient
# kube-context (select the docker driver + connect; idempotent). Its output goes to
# stderr so the `export` lines this script prints on stdout stay eval-clean
# (`eval "$(moon run --log error secret:get_openbao_auth)"`).
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)" >&2
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}" >&2

# Fail early if the SA / pod aren't there (wrong cluster/context, or not bootstrapped).
if ! kubectl -n "${NS}" get serviceaccount "${SA}" >/dev/null 2>&1; then
  ctx="$(kubectl config current-context 2>/dev/null || echo '?')"
  echo "ERROR: ServiceAccount ${NS}/${SA} not found — wrong kube context, or the cluster isn't applied yet." >&2
  echo "       Current context: ${ctx}" >&2
  exit 1
fi

# 1. Mint a short-lived SA JWT (only needed for the login handshake).
SA_TOKEN="$(kubectl -n "${NS}" create token "${SA}" --duration=10m)"

# 2. Exchange it for an admin token via OpenBao's kubernetes auth (login runs inside the
#    pod; the JWT is piped over stdin (jwt=-) so it never lands in the pod's argv).
OB_TOKEN="$(printf '%s' "${SA_TOKEN}" | kubectl -n "${NS}" exec -i "${POD}" -- \
  env BAO_ADDR=http://127.0.0.1:8200 bao write -field=token auth/kubernetes/login role="${ROLE}" jwt=-)"

if [[ -z "${OB_TOKEN:-}" ]]; then
  echo "ERROR: login returned no token (is the '${ROLE}' role present? try after a fresh secret:start)." >&2
  exit 1
fi

# 3. Hand the token to the human. Emit shell-eval'able export lines on stdout; guidance
#    on stderr so `eval "$(... secret:get_openbao_auth)"` stays clean.
echo "==> OpenBao admin token minted (TTL 1h). Reach OpenBao via: moon run secret:forward" >&2
echo "export BAO_ADDR=http://127.0.0.1:${LOCAL_PORT}"
echo "export BAO_TOKEN=${OB_TOKEN}"
