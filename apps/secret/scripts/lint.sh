#!/usr/bin/env bash
# Render the secret components and validate all manifests (including the config/
# custom resources) with kubeconform. CRD instances (ExternalSecret) have no
# upstream schema, so missing schemas are ignored rather than failing the lint.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "${SCRIPT_DIR}")"
COMPONENTS=(openbao)

for component in "${COMPONENTS[@]}"; do
  echo "==> Linting ${component}"
  helm dependency build "${PROJECT_DIR}/${component}" >/dev/null
  helm template "${component}" "${PROJECT_DIR}/${component}" \
    --namespace secret --include-crds |
    kubeconform -strict -ignore-missing-schemas -summary
done

echo "==> Linting config"
# Validate the config CRs, but skip fleet.yaml (a Fleet bundle spec, not a k8s
# manifest — it has no `kind`).
config_manifests=()
while IFS= read -r f; do config_manifests+=("$f"); done < <(
  find "${PROJECT_DIR}/config" -maxdepth 1 -name '*.yaml' ! -name 'fleet.yaml' | sort
)
if [[ ${#config_manifests[@]} -gt 0 ]]; then
  kubeconform -strict -ignore-missing-schemas -summary "${config_manifests[@]}"
fi

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
