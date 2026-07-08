#!/usr/bin/env bash
# Deploy the platform components to a cluster via `helm template | kubectl apply`
# (the repo's GitOps-friendly, idempotent install pattern). Defaults to the local
# k3d bootstrap context.
#
# external-secrets and cert-manager ship the CRDs that the ClusterSecretStore,
# ClusterIssuer and ExternalSecret resources depend on, so they are applied and
# their CRDs established first, then every component (including the custom
# resources) is applied.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
CONTEXT="${KUBE_CONTEXT:-k3d-bootstrap}"
COMPONENTS=(external-secrets cert-manager tailscale netdata)

kube() { kubectl --context "${CONTEXT}" "$@"; }

# render_apply <component> [tolerate]
# On the first pass the custom resources (ClusterSecretStore, ClusterIssuer,
# ExternalSecret) can't apply yet because their CRDs/webhooks aren't ready, so
# that pass is called with "tolerate" to ignore those errors; a second,
# authoritative pass applies them once the CRDs and webhooks are up.
render_apply() {
  local component="$1"
  local tolerate="${2:-strict}"
  helm dependency build "${PROJECT_DIR}/${component}" >/dev/null
  if [[ "${tolerate}" == "tolerate" ]]; then
    helm template "${component}" "${PROJECT_DIR}/${component}" \
      --namespace "${component}" --include-crds |
      kubectl --context "${CONTEXT}" apply --server-side --force-conflicts -f - || true
  else
    helm template "${component}" "${PROJECT_DIR}/${component}" \
      --namespace "${component}" --include-crds |
      kubectl --context "${CONTEXT}" apply --server-side --force-conflicts -f -
  fi
}

echo "==> Ensuring namespaces"
for component in "${COMPONENTS[@]}"; do
  kube create namespace "${component}" --dry-run=client -o yaml | kube apply -f -
done

echo "==> Installing CRD owners (external-secrets, cert-manager)"
render_apply external-secrets tolerate
render_apply cert-manager tolerate

echo "==> Waiting for CRDs to be established"
kube wait --for=condition=established --timeout=120s \
  crd/clustersecretstores.external-secrets.io \
  crd/externalsecrets.external-secrets.io \
  crd/clusterissuers.cert-manager.io \
  crd/certificates.cert-manager.io

echo "==> Waiting for admission webhooks to be available"
kube -n external-secrets rollout status deploy/external-secrets-webhook --timeout=180s
kube -n cert-manager rollout status deploy/cert-manager-webhook --timeout=180s

echo "==> Applying all components (operators + custom resources)"
for component in "${COMPONENTS[@]}"; do
  echo "  -> ${component}"
  render_apply "${component}"
done

echo "==> Done. Custom resources depending on OpenBao-backed secrets will stay"
echo "    NotReady until OpenBao is deployed and seeded."
