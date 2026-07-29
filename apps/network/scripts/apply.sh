#!/usr/bin/env bash
# Apply every Fleet bundle for the network cluster (run after network:start).
# Mirrors apps/secret/scripts/apply.sh.
#
# network:start brings the cluster up: it creates the vind cluster, seeds the
# NetBird operator management API PAT (netbird_auth), installs the Fleet controller,
# and labels the standalone Fleet `local` cluster cluster.vgijssel.nl/name=network.
# THIS script only pushes bundles — it neither installs Fleet nor labels the cluster.
#
# Labelling was deliberately moved OUT of apply and into start.sh: labelling here
# used the ambient kubeconfig context, so if an external tool switched the active
# context between clusters, apply could stamp the wrong name onto the wrong cluster
# and make the two vind clusters collide (a cross-cluster clobber that took OpenBao
# down once). start.sh labels right after `vcluster connect`, when the context is
# known-good. As defence-in-depth this script first VERIFIES the current context's
# Fleet `local` cluster is labelled `network` and REFUSES to apply otherwise — so a
# stale/switched kubeconfig can never push the network bundles onto another cluster.
#
# Apply discovers every fleet.yaml under apps/ via bin/fleet-apply (no hardcoded
# list) and applies each into the fleet-local workspace. Cluster targeting is the
# only deploy gate. Idempotent: fleet apply upserts Bundles.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
FLEET_NS="fleet-local"
EXPECTED_LABEL="network"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require fleet
require kubectl

# ── Safety guard: refuse to apply against the wrong / unlabelled cluster ──────
actual_label="$(kubectl -n "${FLEET_NS}" get clusters.fleet.cattle.io local \
  -o jsonpath='{.metadata.labels.cluster\.vgijssel\.nl/name}' 2>/dev/null || true)"
if [[ "${actual_label}" != "${EXPECTED_LABEL}" ]]; then
  echo "ERROR: the current kube-context's Fleet 'local' cluster is labelled" >&2
  echo "       '${actual_label:-<none>}', but this is ${EXPECTED_LABEL}:apply." >&2
  echo "       Refusing to apply — the active kubeconfig may point at the wrong cluster," >&2
  echo "       or the cluster was never brought up. Run 'moon run ${EXPECTED_LABEL}:start'" >&2
  echo "       first (it creates + labels the cluster), then re-run apply." >&2
  exit 1
fi
echo "==> Verified Fleet 'local' cluster is labelled cluster.vgijssel.nl/name=${EXPECTED_LABEL}"

# ── Apply the bundles (global discovery; fleet resolves file:// deps from CWD) ─
echo "==> Applying Fleet bundles (bin/fleet-apply — global discovery)"
"${REPO_ROOT}/bin/fleet-apply" "${FLEET_NS}"

echo "==> Applied. Bundles:"
kubectl -n "${FLEET_NS}" get bundles 2>/dev/null || true

echo "==> Applied. (network:start runs netbird_auth + labels the cluster before this.)"
