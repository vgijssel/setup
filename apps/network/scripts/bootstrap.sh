#!/usr/bin/env bash
# Bootstrap the network cluster (run after network:start + network:apply):
#
#   1. Break the Tailscale chicken-and-egg. The Tailscale operator needs the
#      operator-oauth Secret to start, but on network that Secret is synced from the
#      REMOTE OpenBao by external-secrets — which itself can't authenticate until the
#      operator's tailnet egress exists. So seed operator-oauth out-of-band here:
#      read the secret-cluster root token from 1Password, read kv/tailscale from the
#      remote OpenBao at https://secret.vgijssel.nl (the operator machine is on the
#      tailnet), and create the Secret directly in the network cluster. ESO takes it
#      over later (apps/network/src/config/externalsecret-operator-oauth.yaml).
#
#   2. Capture the network cluster's OIDC issuer + JWKS. OpenBao (on secret) can't
#      reach the network API, so its jwt-network backend validates network SA-token
#      signatures against STATIC public keys. Extract the issuer and convert the JWKS
#      to PEM, then write them to a git-ignored *.auto.tfvars.json OpenTofu picks up
#      automatically, so `secret:configure` grants network read access to kv/* (T8).
#
# Secrets never touch git: the root token + OAuth client live only in 1Password and
# K8s Secrets, passed in shell variables. The issuer/JWKS are PUBLIC key material
# (safe), but the file is git-ignored and treated as regenerated config (SPEC R5:
# re-run this after a stop+start, then re-run secret:configure).
#
# Idempotent: re-reads/re-applies the Secret; regenerates the tfvars artifact.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
OPENBAO_CONFIG_DIR="${REPO_ROOT}/apps/secret/src/openbao-config"
TFVARS_ARTIFACT="${OPENBAO_CONFIG_DIR}/network-jwt.auto.tfvars.json"

CONTEXT="${NETWORK_KUBE_CONTEXT:-vcluster-docker_network}"
TS_NAMESPACE="${TS_NAMESPACE:-tailscale}"
OP_VAULT="${OP_VAULT:-enigma-prod}"
ROOT_OP_ITEM="${ROOT_OP_ITEM:-OpenBao root + recovery (secret cluster)}"
REMOTE_BAO_ADDR="${REMOTE_BAO_ADDR:-https://secret.vgijssel.nl}"
KV_MOUNT="${KV_MOUNT:-kv}"
KV_TAILSCALE_PATH="${KV_TAILSCALE_PATH:-tailscale}"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require kubectl
require jq
require op
require bao
require python3

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

# Confirm the network context exists (network:start must have run).
if ! kubectl --context "${CONTEXT}" get nodes >/dev/null 2>&1; then
  echo "ERROR: network cluster context '${CONTEXT}' is not reachable. Run 'moon run network:start' first." >&2
  exit 1
fi

# ── Part 1: seed operator-oauth from the remote OpenBao ─────────────────────
echo "==> [1/2] Seeding operator-oauth from the remote OpenBao"

echo "==> Reading the secret-cluster root token from 1Password (${OP_VAULT}/${ROOT_OP_ITEM})"
ROOT_TOKEN="$(op item get "${ROOT_OP_ITEM}" --vault "${OP_VAULT}" --reveal --fields label=root_token 2>/dev/null || true)"
if [[ -z "${ROOT_TOKEN}" ]]; then
  echo "ERROR: root token not found in ${OP_VAULT}/${ROOT_OP_ITEM}. Bootstrap the secret cluster first." >&2
  exit 1
fi

echo "==> Reading ${KV_MOUNT}/${KV_TAILSCALE_PATH} from ${REMOTE_BAO_ADDR}"
ts_json="$(VAULT_ADDR="${REMOTE_BAO_ADDR}" VAULT_TOKEN="${ROOT_TOKEN}" \
  bao kv get -mount="${KV_MOUNT}" -format=json "${KV_TAILSCALE_PATH}" 2>/dev/null || true)"
client_id="$(jq -r '.data.data.oauth_client_id // empty' <<<"${ts_json}")"
client_secret="$(jq -r '.data.data.oauth_client_secret // empty' <<<"${ts_json}")"
if [[ -z "${client_id}" || -z "${client_secret}" ]]; then
  echo "ERROR: could not read oauth_client_id/oauth_client_secret from ${KV_MOUNT}/${KV_TAILSCALE_PATH} at ${REMOTE_BAO_ADDR}." >&2
  echo "       Confirm the operator machine is on the tailnet and kv/${KV_TAILSCALE_PATH} is seeded." >&2
  exit 1
fi

echo "==> Ensuring namespace '${TS_NAMESPACE}' in the network cluster"
kubectl --context "${CONTEXT}" create namespace "${TS_NAMESPACE}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null

echo "==> Applying Secret ${TS_NAMESPACE}/operator-oauth (client_id/client_secret)"
kubectl --context "${CONTEXT}" -n "${TS_NAMESPACE}" create secret generic operator-oauth \
  --from-literal="client_id=${client_id}" \
  --from-literal="client_secret=${client_secret}" \
  --dry-run=client -o yaml | kubectl --context "${CONTEXT}" apply -f - >/dev/null
echo "==> operator-oauth seeded; the Tailscale operator can now register (network-operator)."

# ── Part 2: capture OIDC issuer + JWKS -> git-ignored tofu vars ──────────────
echo "==> [2/2] Capturing the network cluster's OIDC issuer + JWKS (static JWKS for OpenBao)"

issuer="$(kubectl --context "${CONTEXT}" get --raw /.well-known/openid-configuration 2>/dev/null | jq -r '.issuer // empty')"
if [[ -z "${issuer}" ]]; then
  echo "ERROR: could not read the OIDC issuer from ${CONTEXT} (/.well-known/openid-configuration)." >&2
  exit 1
fi
echo "==> Issuer: ${issuer}"

# Convert the cluster's JWKS (JWK/RSA) to PEM public keys with a dependency-free
# stdlib DER encoder (no cryptography/step needed). OpenBao's jwt_validation_pubkeys
# wants PEM; the /openid/v1/jwks endpoint returns JWK.
jwks_json="$(kubectl --context "${CONTEXT}" get --raw /openid/v1/jwks 2>/dev/null || true)"
pem_list_json="$(JWKS_JSON="${jwks_json}" python3 <<'PY'
import os, sys, json, base64

def b64u(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))

def der_len(n):
    if n < 0x80:
        return bytes([n])
    b = []
    while n:
        b.insert(0, n & 0xFF); n >>= 8
    return bytes([0x80 | len(b)]) + bytes(b)

def tlv(tag, val):
    return bytes([tag]) + der_len(len(val)) + val

def der_int(b):
    b = b.lstrip(b"\x00") or b"\x00"
    if b[0] & 0x80:
        b = b"\x00" + b
    return tlv(0x02, b)

def seq(*items):
    return tlv(0x30, b"".join(items))

def jwk_to_pem(jwk):
    rsa_pub = seq(der_int(b64u(jwk["n"])), der_int(b64u(jwk["e"])))
    alg = seq(tlv(0x06, bytes([0x2a,0x86,0x48,0x86,0xf7,0x0d,0x01,0x01,0x01])), tlv(0x05, b""))
    spki = seq(alg, tlv(0x03, b"\x00" + rsa_pub))
    b64 = base64.encodebytes(spki).decode().replace("\n", "")
    body = "\n".join(b64[i:i+64] for i in range(0, len(b64), 64))
    return f"-----BEGIN PUBLIC KEY-----\n{body}\n-----END PUBLIC KEY-----\n"

jwks = json.loads(os.environ["JWKS_JSON"])
pems = [jwk_to_pem(k) for k in jwks.get("keys", []) if k.get("kty") == "RSA"]
if not pems:
    sys.exit("no RSA keys in JWKS")
print(json.dumps(pems))
PY
)"
if [[ -z "${pem_list_json}" || "${pem_list_json}" == "null" ]]; then
  echo "ERROR: failed to convert the network JWKS to PEM." >&2
  exit 1
fi

echo "==> Writing git-ignored tofu vars: ${TFVARS_ARTIFACT}"
jq -n --arg iss "${issuer}" --argjson pems "${pem_list_json}" \
  '{network_oidc_issuer: $iss, network_jwks_pubkeys: $pems}' >"${TFVARS_ARTIFACT}"

cat <<EOF

==> Done. operator-oauth seeded and OIDC issuer/JWKS captured.

    Next — grant the network cluster read access on the SECRET side (T8):

      moon run secret:configure   # auto-loads ${TFVARS_ARTIFACT##*/}; creates the
                                  # jwt-network backend + network-read policy +
                                  # network-eso role in OpenBao.

    (After a network stop+start the issuer/JWKS change — re-run this task, then
     re-run secret:configure. SPEC R5.)
EOF
