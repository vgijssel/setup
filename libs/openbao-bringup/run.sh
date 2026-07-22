#!/usr/bin/env bash
# OpenBao bring-up orchestrator — the KubeVela-era replacement for the old
# secret:bootstrap + secret:configure scripts (SPEC §4). Runs the one-off ordering
# to bring a fresh secret child's OpenBao to "ESO green":
#
#   1. deliver the in-cluster prerequisites (op-credentials Secret from .env, the
#      bring-up script ConfigMap, the Job's ServiceAccount + RBAC);
#   2. run the bring-up JOB inside the child (libs/openbao-bringup/bringup.sh):
#      seed seal key -> `bao operator init` -> store recovery/root keys to 1Password
#      -> mint a TEMP admin token into the `vault` Provider's credentials Secret;
#   3. apply the openbao-config Terraform Configuration ONCE with use_token=true
#      (the temp token) — creates kv, kubernetes auth, and the ESO + executor
#      policies/roles; the child's terraform-controller runs it (child-local, §3.2);
#   4. DELETE the temp-token Secret. No long-lived token remains in-cluster.
#
# Why a libs/ orchestrator rather than a KubeVela WorkflowRun: (a) the ordering runs
# over the same cluster-gateway path the other bootstrap steps use (libs/vcluster-join,
# libs/eso-crds, libs/tf-controller-child) — KubeVela cannot express those natively
# either; and (b) vela-core 1.11.0's topology `deploy` step does NOT dispatch a
# terraform Configuration component into a child (renders but never applies — the same
# quirk class as the helmchart-component one in Task 2.1), so the Configuration is
# applied straight over the proxy. The imperative OpenBao init itself lives in a Job
# INSIDE the child (bringup.sh), per SPEC §4 — the shell here is only sequencing.
#
# Idempotent: get-or-create everything; the bring-up Job + the Terraform module are
# both idempotent (init skipped when already initialised; module adopts singletons).
# The `kc` kubectl wrapper is deliberately used inside `|| true` cleanups and explicit
# `if !` checks (idempotent deletes, the Job-completion gate) where we handle the exit
# ourselves, so shellcheck's "set -e is disabled in this condition" notes do not apply.
# shellcheck disable=SC2310,SC2312
set -euo pipefail

CLUSTER="${1:?child cluster name required}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BRINGUP_SH="${SCRIPT_DIR}/bringup.sh"
CONFIG_DIR="${REPO_ROOT}/apps/secret/src/openbao-config"

VELA_NS="${VELA_NAMESPACE:-vela-system}"
BOOTSTRAP_IMAGE="${BOOTSTRAP_IMAGE:-openbao-bootstrap:2.5.5}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require kubectl
require vela
require yq

# 1Password service-account token — sourced from .env (never committed), delivered
# to the child so the bring-up Job's `op` calls authenticate non-interactively.
if [[ -z "${OP_SERVICE_ACCOUNT_TOKEN:-}" && -f "${REPO_ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${REPO_ROOT}/.env"
  set +a
fi
[[ -n "${OP_SERVICE_ACCOUNT_TOKEN:-}" ]] || { echo "ERROR: OP_SERVICE_ACCOUNT_TOKEN not set (expected in ${REPO_ROOT}/.env)" >&2; exit 1; }

# Reach the child through the root's cluster-gateway proxy (same path as the other
# libs/): the proxy is served by the root API host, so the current kubeconfig's creds
# + CA authenticate transparently.
ROOT_SERVER="$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')"
PROXY="${ROOT_SERVER}/apis/cluster.core.oam.dev/v1alpha1/clustergateways/${CLUSTER}/proxy"
kc() { kubectl --server "${PROXY}" "$@"; }

# ── 1. prerequisites in the child ─────────────────────────────────────────────
echo "==> [${CLUSTER}] delivering bring-up prerequisites (op-credentials, script, RBAC)"
kc -n "${VELA_NS}" create secret generic op-credentials \
  --from-literal=OP_SERVICE_ACCOUNT_TOKEN="${OP_SERVICE_ACCOUNT_TOKEN}" \
  --dry-run=client -o yaml | kc apply -f - >/dev/null
kc -n "${VELA_NS}" create configmap openbao-bringup-script \
  --from-file=bringup.sh="${BRINGUP_SH}" \
  --dry-run=client -o yaml | kc apply -f - >/dev/null
kc apply -f - >/dev/null <<YAML
apiVersion: v1
kind: ServiceAccount
metadata: { name: openbao-bringup, namespace: ${VELA_NS} }
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata: { name: openbao-bringup }
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "create", "update", "patch", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "delete"]
  - apiGroups: ["terraform.core.oam.dev"]
    resources: ["providers"]
    verbs: ["get", "list", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata: { name: openbao-bringup }
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: ClusterRole, name: openbao-bringup }
subjects:
  - { kind: ServiceAccount, name: openbao-bringup, namespace: ${VELA_NS} }
YAML

# ── 2. run the bring-up Job (recreate so it always uses the current script) ────
echo "==> [${CLUSTER}] running the OpenBao bring-up Job"
kc -n "${VELA_NS}" delete job openbao-bringup --ignore-not-found --wait=true >/dev/null 2>&1 || true
kc apply -f - >/dev/null <<YAML
apiVersion: batch/v1
kind: Job
metadata: { name: openbao-bringup, namespace: ${VELA_NS} }
spec:
  backoffLimit: 3
  ttlSecondsAfterFinished: 600
  template:
    spec:
      serviceAccountName: openbao-bringup
      restartPolicy: Never
      containers:
        - name: bringup
          image: ${BOOTSTRAP_IMAGE}
          imagePullPolicy: IfNotPresent
          command: ["bash", "/scripts/bringup.sh"]
          envFrom:
            - secretRef: { name: op-credentials }
          volumeMounts:
            - { name: script, mountPath: /scripts }
      volumes:
        - name: script
          configMap: { name: openbao-bringup-script }
YAML
if ! kc -n "${VELA_NS}" wait --for=condition=complete job/openbao-bringup --timeout=300s; then
  echo "ERROR: OpenBao bring-up Job did not complete; logs:" >&2
  kc -n "${VELA_NS}" logs -l job-name=openbao-bringup --tail=40 >&2 || true
  exit 1
fi

# ── 3. apply the openbao-config Configuration ONCE (use_token=true) ────────────
# Register the generated ComponentDefinition in the root, render the bootstrap
# variant (use_token=true) to a concrete Configuration, and apply it into the child
# over the proxy (topology deploy can't dispatch it — see header). The child's
# terraform-controller reconciles it: kv + kubernetes auth + ESO/executor policies.
echo "==> [${CLUSTER}] applying openbao-config (one-shot, use_token=true)"
vela def apply "${CONFIG_DIR}/component/openbao-config.yaml" >/dev/null
tmp="$(mktemp -d)"; trap 'rm -rf "${tmp}"' EXIT
cat >"${tmp}/app.yaml" <<'YAML'
apiVersion: core.oam.dev/v1beta1
kind: Application
metadata: { name: openbao-config, namespace: vela-system }
spec:
  components:
    - name: openbao-config
      type: openbao-config
      properties: { use_token: true }
  policies:
    - name: to-secret
      type: topology
      properties: { clusters: [secret] }
YAML
vela dry-run -f "${tmp}/app.yaml" 2>/dev/null | yq 'select(.kind == "Configuration")' >"${tmp}/configuration.yaml"
grep -q 'kind: Configuration' "${tmp}/configuration.yaml" || { echo "ERROR: failed to render the openbao-config Configuration" >&2; exit 1; }
kc -n "${VELA_NS}" apply -f "${tmp}/configuration.yaml" >/dev/null

echo "==> [${CLUSTER}] waiting for the Configuration to become Available"
for _ in $(seq 1 60); do
  state="$(kc -n "${VELA_NS}" get configuration openbao-config -o jsonpath='{.status.apply.state}' 2>/dev/null || true)"
  [[ "${state}" == "Available" ]] && break
  sleep 5
done
[[ "${state:-}" == "Available" ]] || { echo "ERROR: openbao-config Configuration did not reach Available (state=${state:-none})" >&2; exit 1; }

# ── 4. delete the temp-token Secret — no long-lived token remains ──────────────
echo "==> [${CLUSTER}] deleting the temporary vault Provider token Secret"
kc -n default delete secret vault-provider-credentials --ignore-not-found >/dev/null 2>&1 || true

echo "==> [${CLUSTER}] OpenBao bring-up complete (kv + kubernetes auth + policies applied; temp token removed)."
