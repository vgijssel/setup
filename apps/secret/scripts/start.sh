#!/usr/bin/env bash
# Start the secret cluster: create the vind cluster, install the single-cluster
# Fleet controller, and apply the Fleet bundles. Idempotent end to end — safe to
# re-run; each step is a no-op when already satisfied.
#
# OpenBao is deployed here but boots into CreateContainerConfigError until the
# static seal key is seeded; run `moon run secret:bootstrap` next to seed the key,
# initialise OpenBao, and open the UI.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> [1/3] Creating the vind cluster"
"${SCRIPT_DIR}/cluster.sh" up

echo "==> [2/3] Installing the Fleet controller"
"${SCRIPT_DIR}/fleet-install.sh"

echo "==> [3/3] Applying the Fleet bundles"
"${SCRIPT_DIR}/up.sh"

echo "==> secret cluster started. Next: moon run secret:bootstrap"
