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

# Fleet bundle render check: every dir with a fleet.yaml must render to a valid
# Bundle via `fleet apply -o -` (the same rendering a Rancher GitRepo performs).
# fleet resolves chart file:// dependencies relative to CWD, so cd into the
# project and pass relative paths (absolute paths render nothing).
echo "==> Rendering Fleet bundles (fleet apply -o -)"
cd "${PROJECT_DIR}"
while IFS= read -r dir; do
  [[ -n "${dir}" ]] || continue
  echo "  - ${dir}"
  fleet apply -o - "$(basename "${dir}")" "${dir}" >/dev/null
done < <(find . -name fleet.yaml -not -path '*/charts/*' -exec dirname {} \; | sort)
