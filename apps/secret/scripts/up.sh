#!/usr/bin/env bash
# Apply every Fleet bundle for the secret cluster: the OpenBao stack (apps/secret)
# and the shared platform operators (apps/platform). Each leaf directory holding a
# fleet.yaml is rendered into a Bundle in the fleet-local workspace, which the
# in-cluster Fleet controller then reconciles.
#
# Bundles are discovered (every dir with a fleet.yaml, excluding vendored charts/)
# rather than hard-coded, so new bundles join automatically as they are added.
# Applying explicit leaf paths — not the apps/{secret,platform} roots — keeps
# bundle boundaries clean and maps directly onto a future Rancher GitRepo `paths:`.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
NAMESPACE="fleet-local"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require fleet

cd "${REPO_ROOT}"

# Emit the leaf bundle directories under the given project path (dirs with a
# fleet.yaml, skipping the vendored charts/ subtrees), sorted for determinism.
bundle_dirs() {
  find "$1" -name fleet.yaml -not -path '*/charts/*' -exec dirname {} \; 2>/dev/null | sort
}

apply_project() {
  local name="$1" root="$2"
  local dirs=()
  while IFS= read -r d; do [[ -n "$d" ]] && dirs+=("$d"); done < <(bundle_dirs "${root}")
  if [[ ${#dirs[@]} -eq 0 ]]; then
    echo "==> No ${name} bundles yet (${root}); skipping"
    return 0
  fi
  echo "==> Applying ${name} bundles: ${dirs[*]}"
  fleet apply -n "${NAMESPACE}" "${name}" "${dirs[@]}"
}

apply_project secret apps/secret
apply_project platform apps/platform

echo "==> Applied. Bundles:"
kubectl -n "${NAMESPACE}" get bundles 2>/dev/null || true
