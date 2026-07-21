#!/usr/bin/env bash
# control:up — apply the KubeVela child-provisioning Applications against the
# root, and join each child vcluster to the root once it is Ready.
#
# This is the thin orchestrator SPEC §6 sanctions (`up` = "vela up -f … or a thin
# wrapper"). The only imperative bit beyond `vela up` is the vcluster join
# (libs/vcluster-join), which KubeVela cannot yet express natively (SPEC §9 #7);
# everything the children then RUN (platform, workloads, Terraform, bootstrap
# Workflows) is applied as KubeVela objects via `topology -> <child>`.
#
# Idempotent: `vela up` upserts, the join helper detaches+rejoins.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CHILDREN_DIR="${SCRIPT_DIR}/../src/children"
JOIN="${REPO_ROOT}/libs/vcluster-join/join.sh"

require() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' is required but not found" >&2; exit 1; }; }
require vela
require kubectl

# ── secret child ────────────────────────────────────────────────────────────
echo "==> Applying child-secret Application (creates the 'secret' vcluster)"
vela up -f "${CHILDREN_DIR}/application-secret.yaml"
"${JOIN}" secret secret

echo "==> control:up complete."
