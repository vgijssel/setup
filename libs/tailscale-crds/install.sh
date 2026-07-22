#!/usr/bin/env bash
# Install the tailscale-operator CRDs into a child vcluster via server-side apply,
# over the root's cluster-gateway proxy.
#
# Usage: install.sh <child-cluster-name>
#
# WHY out-of-band (not via the tailscale-operator helmchart Component): the chart
# ships its CRDs as ordinary templates (gated by installCRDs), so KubeVela renders
# and dispatches them through its own apply path. That path DROPS the CRD's
# `spec.versions[].subresources.status` field. The tailscale operator writes
# ProxyGroup/Connector/etc. status via the /status subresource; with it missing the
# update 404s ("proxygroups.tailscale.com \"<name>\" not found"), the operator can
# never mark a ProxyGroup Ready, and any Ingress fronted by it waits forever — no
# Service VIP is ever advertised. `kubectl apply --server-side` preserves the
# subresource, so it installs the CRDs correctly. The tailscale-operator Component
# therefore runs with installCRDs=false and relies on this step; it must run BEFORE
# the child's platform Application is dispatched, so ProxyGroup/Ingress CRs have
# their kinds (with status) registered. (Same class of fix as libs/eso-crds.)
#
# The child is reached over the SAME in-cluster control path KubeVela uses — the
# cluster-gateway aggregated-API proxy on the root — reusing the current (root)
# kubeconfig's credentials and CA. No tailnet, no port-forward, no extra credentials.
#
# Idempotent: server-side apply upserts; the chart version is pinned.
set -euo pipefail

CLUSTER="${1:?child cluster name required}"
TS_CHART_VERSION="${TS_CHART_VERSION:-1.90.9}"
TS_REPO="${TS_REPO:-https://pkgs.tailscale.com/helmcharts}"

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

echo "==> [${CLUSTER}] rendering tailscale-operator CRDs (chart ${TS_CHART_VERSION})"
# Render the chart with CRDs enabled and keep only the CustomResourceDefinition
# documents. Placeholder oauth values keep `helm template` happy (never applied).
helm template tailscale-operator tailscale-operator \
  --repo "${TS_REPO}" --version "${TS_CHART_VERSION}" \
  --include-crds --set installCRDs=true \
  --set-string oauth.clientId=placeholder --set-string oauth.clientSecret=placeholder 2>/dev/null |
  yq eval 'select(.kind == "CustomResourceDefinition")' - >"${tmp}"

crd_count="$(grep -c '^kind: CustomResourceDefinition' "${tmp}" || true)"
if [[ "${crd_count}" -eq 0 ]]; then
  echo "ERROR: rendered no tailscale CRDs — chart version/repo may be wrong" >&2
  exit 1
fi

echo "==> [${CLUSTER}] server-side applying ${crd_count} tailscale CRDs via cluster-gateway"
kubectl --server "${PROXY}" apply --server-side --force-conflicts -f "${tmp}"
echo "==> [${CLUSTER}] tailscale CRDs installed."
