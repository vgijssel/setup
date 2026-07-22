#!/usr/bin/env bash
# Install terraform-controller into a child vcluster, over the root's
# cluster-gateway proxy.
#
# Usage: install.sh <child-cluster-name>
#
# WHY child-local (SPEC §3.2): a terraform.core.oam.dev Configuration reconciles in
# whichever cluster it lands, and its executor pod runs there. openbao-config's
# provider talks to http://openbao.secret.svc:8200 — a child-internal address — so
# the controller (and its executor) MUST run inside the child, not the root.
#
# WHY helm-over-proxy (not a KubeVela Component): the terraform-controller chart is
# vendored from git (charts.kubevela.net has an expired TLS cert), so there is no
# public repoURL a `helmchart` Component could fetch; and its images are the
# locally-built arm64 ones imported into the vind node by control:start, not a
# registry. Driving `helm` at the child through the cluster-gateway proxy reuses the
# EXACT working root install (same vendored chart, same values, same pinned images)
# and handles the chart's crds/ + hooks — far more robust than hand-SSA'ing rendered
# manifests. The proxy is served by the root API host, so the current (root)
# kubeconfig's token + CA authenticate transparently (same reasoning as libs/eso-crds).
#
# Idempotent: `helm upgrade --install` upserts; images are pinned; pullPolicy
# IfNotPresent reuses the node-local images.
set -euo pipefail

CLUSTER="${1:?child cluster name required}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CHART="${REPO_ROOT}/third_party/vendir/charts/terraform-controller"
VALUES="${REPO_ROOT}/apps/control/src/kubevela/values-terraform-controller.yaml"

VELA_NS="${VELA_NAMESPACE:-vela-system}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require helm
require kubectl

# Reach the child through the root's cluster-gateway proxy, reusing the current
# context's auth + CA (the proxy is served by the root API server itself).
ROOT_SERVER="$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')"
PROXY="${ROOT_SERVER}/apis/cluster.core.oam.dev/v1alpha1/clustergateways/${CLUSTER}/proxy"

# Same pinned images control:start builds + imports into the vind node's containerd
# (the child's pods schedule onto that node, so the node-local images resolve). The
# executor is always the OpenTofu build; the controller is rebuilt for arm64 only
# (upstream's "arm64" image is mislabeled amd64 — see values-terraform-controller.yaml).
HELM_ARGS=(--set "terraformImage=tofu-executor:1.10.6")
case "$(uname -m)" in
  arm64 | aarch64)
    HELM_ARGS+=(
      --set image.repository=terraform-controller
      --set image.tag=v0.8.0-arm64
      --set image.pullPolicy=IfNotPresent
    )
    ;;
  # amd64/prod uses the upstream controller image pinned by digest in the values
  # file (its arm64 variant is the mislabeled one), so no override is needed.
  *) ;;
esac

echo "==> [${CLUSTER}] installing terraform-controller (${VELA_NS}) via cluster-gateway"
helm --kube-apiserver "${PROXY}" upgrade --install terraform-controller "${CHART}" \
  --namespace "${VELA_NS}" --create-namespace \
  --values "${VALUES}" \
  "${HELM_ARGS[@]}" \
  --force-conflicts --wait --timeout 300s

# The chart does not create the EXECUTOR ServiceAccount (its ClusterRole only
# get/lists serviceaccounts). terraform-controller launches each executor Job pod as
# `tf-executor` in the Configuration's namespace; that SA must exist and be able to
# manage the kubernetes-backend state (Secrets it writes tfstate into + coordination
# Leases it locks with) in ${VELA_NS}. Create it + a namespace-scoped Role/binding.
# It is also the identity openbao-config's steady-state kubernetes auth binds to.
echo "==> [${CLUSTER}] ensuring the tf-executor ServiceAccount + backend-state RBAC (${VELA_NS})"
kubectl --server "${PROXY}" apply --server-side --force-conflicts -f - <<YAML
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tf-executor
  namespace: ${VELA_NS}
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: tf-executor-state
  namespace: ${VELA_NS}
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: ["coordination.k8s.io"]
    resources: ["leases"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: tf-executor-state
  namespace: ${VELA_NS}
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: tf-executor-state
subjects:
  - kind: ServiceAccount
    name: tf-executor
    namespace: ${VELA_NS}
YAML

echo "==> [${CLUSTER}] terraform-controller installed."
