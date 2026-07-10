#!/usr/bin/env bash
# Render every platform component and validate all manifests (including the
# config/ custom resources) with kubeconform. CRD instances (ClusterIssuer,
# ExternalSecret, ...) have no upstream schema, so missing schemas are ignored
# rather than failing the lint.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
COMPONENTS=(external-secrets cert-manager vault-config-operator tailscale netdata)

for component in "${COMPONENTS[@]}"; do
  echo "==> Linting ${component}"
  helm dependency build "${PROJECT_DIR}/${component}" >/dev/null
  helm template "${component}" "${PROJECT_DIR}/${component}" \
    --namespace "${component}" --include-crds |
    kubeconform -strict -ignore-missing-schemas -summary
done

echo "==> Linting config"
kubeconform -strict -ignore-missing-schemas -summary "${PROJECT_DIR}"/config/*.yaml
