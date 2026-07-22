#!/usr/bin/env bash
# Install the cert-manager CRDs into a child vcluster via server-side apply, over the
# root's cluster-gateway proxy.
#
# Usage: install.sh <child-cluster-name>
#
# WHY out-of-band (not via the cert-manager helmchart Component's crds.enabled): the
# chart ships its CRDs as ordinary templates, so KubeVela renders and dispatches them
# through its own apply path. That path DROPS the CRD's
# `spec.versions[].subresources.status` field. cert-manager writes Certificate/
# ClusterIssuer/Order/Challenge status via the /status subresource; with it missing the
# update 404s ("clusterissuers.cert-manager.io \"<name>\" not found"), the issuer never
# goes Ready, no CertificateRequest/Order is created, and every Certificate hangs — the
# pod mounting the (never-issued) TLS Secret stays ContainerCreating forever.
# `kubectl apply --server-side` preserves the subresource, so it installs the CRDs
# correctly. The cert-manager Component therefore runs with crds.enabled=false and
# relies on this step; it must run BEFORE the child's platform Application is dispatched,
# so Certificate/ClusterIssuer CRs have their kinds (with status) registered. (Same
# class of fix as libs/eso-crds and libs/tailscale-crds.)
#
# The child is reached over the SAME in-cluster control path KubeVela uses — the
# cluster-gateway aggregated-API proxy on the root — reusing the current (root)
# kubeconfig's credentials and CA. No tailnet, no port-forward, no extra credentials.
#
# Idempotent: server-side apply upserts; the chart version is pinned.
set -euo pipefail

CLUSTER="${1:?child cluster name required}"
CM_CHART_VERSION="${CM_CHART_VERSION:-v1.20.3}"
CM_REPO="${CM_REPO:-https://charts.jetstack.io}"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require helm
require kubectl
require yq

# Reach the child through the root's cluster-gateway proxy, reusing the current
# context's auth + CA (the proxy is served by the root API server itself).
ROOT_SERVER="$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')"
PROXY="${ROOT_SERVER}/apis/cluster.core.oam.dev/v1alpha1/clustergateways/${CLUSTER}/proxy"

tmp="$(mktemp)"
trap 'rm -f "${tmp}"' EXIT

echo "==> [${CLUSTER}] rendering cert-manager CRDs (chart ${CM_CHART_VERSION})"
# Render the chart with CRDs enabled and keep only the CustomResourceDefinition
# documents.
helm template cert-manager cert-manager \
  --repo "${CM_REPO}" --version "${CM_CHART_VERSION}" \
  --include-crds --set crds.enabled=true 2>/dev/null |
  yq eval 'select(.kind == "CustomResourceDefinition")' - >"${tmp}"

crd_count="$(grep -c '^kind: CustomResourceDefinition' "${tmp}" || true)"
if [[ "${crd_count}" -eq 0 ]]; then
  echo "ERROR: rendered no cert-manager CRDs — chart version/repo may be wrong" >&2
  exit 1
fi

echo "==> [${CLUSTER}] server-side applying ${crd_count} cert-manager CRDs via cluster-gateway"
kubectl --server "${PROXY}" apply --server-side --force-conflicts -f "${tmp}"
echo "==> [${CLUSTER}] cert-manager CRDs installed."
