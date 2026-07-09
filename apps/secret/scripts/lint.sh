#!/usr/bin/env bash
# Render the secret components and validate all manifests (including the config/
# custom resources) with kubeconform. CRD instances (ExternalSecret) have no
# upstream schema, so missing schemas are ignored rather than failing the lint.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
COMPONENTS=(openbao sigv4-proxy)

for component in "${COMPONENTS[@]}"; do
  echo "==> Linting ${component}"
  helm dependency build "${PROJECT_DIR}/${component}" >/dev/null
  helm template "${component}" "${PROJECT_DIR}/${component}" \
    --namespace secret --include-crds |
    kubeconform -strict -ignore-missing-schemas -summary
done

echo "==> Linting config"
kubeconform -strict -ignore-missing-schemas -summary "${PROJECT_DIR}"/config/*.yaml
