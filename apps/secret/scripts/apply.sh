#!/usr/bin/env bash
# Apply every Fleet bundle for the secret cluster (run after secret:start).
#
# secret:start brings the cluster up: it creates the vind cluster, installs the
# Fleet controller, and labels the standalone Fleet `local` cluster
# cluster.vgijssel.nl/name=secret. THIS script only pushes bundles — it neither
# installs Fleet nor labels the cluster.
#
# Labelling was deliberately moved OUT of apply and into start.sh: labelling here
# used the ambient kubeconfig context, so if an external tool switched the active
# context between clusters, apply could stamp the wrong name onto the wrong cluster
# and make the two vind clusters collide (the cross-cluster clobber that took OpenBao
# down once). start.sh labels right after `vcluster connect`, when the context is
# known-good. As defence-in-depth this script first VERIFIES the current context's
# Fleet `local` cluster is labelled `secret` and REFUSES to apply otherwise — so a
# stale/switched kubeconfig can never push the secret bundles onto another cluster.
#
# Apply discovers every fleet.yaml under apps/ via bin/fleet-apply (no hardcoded
# list) and applies each into the fleet-local workspace. Cluster targeting is the
# only deploy gate: each bundle's targetCustomizations/clusterSelector on
# cluster.vgijssel.nl/name decides whether the `secret` cluster gets a
# BundleDeployment. Idempotent: fleet apply upserts Bundles.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
CLUSTER_NAME="${SECRET_CLUSTER_NAME:-secret}"
FLEET_NS="fleet-local"
EXPECTED_LABEL="secret"

require() { command -v "$1" >/dev/null 2>&1 || {
  echo "ERROR: '$1' is required but not found" >&2
  exit 1
}; }
require vcluster
require fleet
require kubectl

# ── Point kubectl at THIS cluster regardless of the ambient kube-context ──────
# Select the vind docker driver (global, idempotent) and connect to the cluster,
# which rewrites the active kube-context — so an externally-switched context can't
# send the apply at the wrong cluster. start.sh already connects before it exec's
# here, so this only matters for a standalone `secret:apply`. The label guard below
# stays the authoritative safety gate.
echo "==> Connecting to the '${CLUSTER_NAME}' vind cluster (vcluster connect)"
vcluster use driver docker >/dev/null 2>&1 || true
vcluster connect "${CLUSTER_NAME}"

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

# No bootstrap/configure step: OpenBao self-initialises + auto-unseals on first
# boot, and Crossplane (provider-vault) reconciles the full config over k8s auth.
echo "==> Done. OpenBao self-inits and Crossplane configures it automatically."
echo "==> Optional: moon run secret:forward   # enter human-only seed kv secrets"
