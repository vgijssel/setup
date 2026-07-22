#!/usr/bin/env bash
# Install the external-secrets (ESO) CRDs into a child vcluster via server-side
# apply, over the root's cluster-gateway proxy.
#
# Usage: install.sh <child-cluster-name>
#
# WHY out-of-band (not a KubeVela Component): two ESO CRDs
# (clustersecretstores/secretstores.external-secrets.io) are ~590 KiB each.
# KubeVela's apply path stamps a last-applied-configuration annotation — a
# serialized copy of the whole object — on every dispatched resource, which pushes
# those two CRDs past the API server's 256 KiB metadata.annotations limit
# ("Too long"), failing the platform deploy step. vela-core v1.11.0 exposes no
# apply-by-update / server-side-apply mode to suppress that annotation (the
# ApplyResourceByUpdate feature gate is not recognised by this version), so the
# CRDs cannot be delivered via `topology`. `kubectl apply --server-side` does NOT
# add the last-applied annotation, so it installs even the oversized CRDs cleanly.
# The ESO helmchart Component therefore runs with installCRDs=false and relies on
# this step; it must run BEFORE the child's platform Application is dispatched, so
# the ClusterSecretStore/ExternalSecret CRs have their kinds registered.
#
# The child is reached over the SAME in-cluster control path KubeVela uses — the
# cluster-gateway aggregated-API proxy on the root — reusing the current (root)
# kubeconfig's credentials and CA (the proxy lives on the root API host). No
# tailnet, no port-forward, no extra credentials (SPEC §3.1).
#
# Idempotent: server-side apply upserts; the ESO chart version is pinned.
set -euo pipefail

CLUSTER="${1:?child cluster name required}"
ESO_CHART_VERSION="${ESO_CHART_VERSION:-2.0.1}"
ESO_REPO="${ESO_REPO:-https://charts.external-secrets.io}"

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

echo "==> [${CLUSTER}] rendering external-secrets CRDs (chart ${ESO_CHART_VERSION})"
# The chart ships its CRDs as ordinary templates gated by installCRDs; render with
# it on and keep only the CustomResourceDefinition documents.
helm template external-secrets external-secrets \
  --repo "${ESO_REPO}" --version "${ESO_CHART_VERSION}" \
  --include-crds --set installCRDs=true 2>/dev/null |
  yq eval 'select(.kind == "CustomResourceDefinition")' - >"${tmp}"

crd_count="$(grep -c '^kind: CustomResourceDefinition' "${tmp}" || true)"
if [[ "${crd_count}" -eq 0 ]]; then
  echo "ERROR: rendered no ESO CRDs — chart version/repo may be wrong" >&2
  exit 1
fi

echo "==> [${CLUSTER}] server-side applying ${crd_count} ESO CRDs via cluster-gateway"
kubectl --server "${PROXY}" apply --server-side --force-conflicts -f "${tmp}"
echo "==> [${CLUSTER}] ESO CRDs installed."
